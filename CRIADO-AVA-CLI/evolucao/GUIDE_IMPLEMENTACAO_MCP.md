# Guia de Implementação — Correções Plugin UnrealMCP

**Para:** Claude / GPT-OSS (contexto limitado)
**Data:** 18/07/2026
**UE:** 5.6.1
**Repositório:** `flopperam-mcp/UnrealMCP/`

---

## 1. Como Conectar ao Plugin

O plugin roda um servidor TCP dentro do Unreal Editor.

```
Host: 127.0.0.1
Porta: 55557
Protocolo: TCP, mensagens JSON delimitadas por \n
```

**Formato de requisição:**
```json
{"command": "nome_do_comando", "params": {"param1": "valor1"}}
```

**Python para testar:**
```python
import socket, json
s = socket.socket(); s.settimeout(5)
s.connect(('127.0.0.1', 55557))
s.sendall(json.dumps({"command":"health"}).encode()+b'\n')
print(s.recv(8192).decode())
s.close()
```

---

## 2. Arquitetura do Plugin

```
TCP Client (Python/IA)
    ↓
MCPServerRunnable.cpp         ← recebe JSON, extrai "command" + "params"
    ↓
EpicUnrealMCPBridge.cpp       ← roteia comando para o handler correto
    ↓
    ├── EpicUnrealMCPEditorCommands.cpp     ← PIE, actores, spawn
    ├── EpicUnrealMCPBlueprintCommands.cpp  ← criar BP, compilar, materiais
    ├── EpicUnrealMCPBlueprintGraphCommands.cpp ← nós, conexões, variáveis
    │       ↓
    │   ├── NodeManager.cpp        ← add_blueprint_node (QUERBRADO)
    │   ├── EventManager.cpp       ← add_event_node (QUERBRADO)
    │   ├── BPConnector.cpp        ← connect_nodes (QUERBRADO)
    │   ├── FunctionManager.cpp    ← create_function (QUERBRADO)
    │   ├── FunctionIO.cpp         ← add_function_input/output (QUERBRADO)
    │   ├── NodeDeleter.cpp        ← delete_node (QUERBRADO)
    │   ├── NodePropertyManager.cpp ← set_node_property (QUERBRADO)
    │   └── BPVariables.cpp        ← create_variable (FUNCIONA ✓)
    └── CommonUtils.cpp            ← FindBlueprint (FUNCIONA ✓)
```

---

## 3. CORREÇÃO #1 (PRIORIDADE MÁXIMA): LoadBlueprint duplicado e quebrado

### O problema

Existem **6 cópias** da função `LoadBlueprint()` espalhadas por:
- `NodeManager.cpp` linha 409
- `EventManager.cpp` linha 148
- `NodeDeleter.cpp` linha 154
- `FunctionManager.cpp` linha 267
- `FunctionIO.cpp` linha 287
- `NodePropertyManager.cpp` linha 537

**Todas são idênticas e todas falham** — elas só tentam `LoadObject<UBlueprint>` e `UEditorAssetLibrary::DoesAssetExist/LoadAsset`, mas NÃO usam AssetRegistry como fallback. Isso faz com que Blueprints criados na sessão atual não sejam encontrados.

**Já existe uma função que FUNCIONA:** `FEpicUnrealMCPCommonUtils::FindBlueprint()` em `CommonUtils.cpp` linha 154. Ela usa:
1. `LoadObject<UBlueprint>` (rápido)
2. `AssetRegistryModule.GetAssetByObjectPath()` (robusto para assets novos)
3. `FindObject<UBlueprint>` (fallback para assets em memória)

### O que fazer

Em cada um dos 6 arquivos, substituir a implementação local de `LoadBlueprint` por uma chamada a `FEpicUnrealMCPCommonUtils::FindBlueprint()`.

**Exemplo para NodeManager.cpp:**

```cpp
// ANTES (linhas 409-441 — REMOVER tudo):
UBlueprint* FBlueprintNodeManager::LoadBlueprint(const FString& BlueprintName)
{
    // ... toda a implementação quebrada ...
}

// DEPOIS (substituir por):

#include "Commands/EpicUnrealMCPCommonUtils.h"  // já existe no topo, verificar

UBlueprint* FBlueprintNodeManager::LoadBlueprint(const FString& BlueprintName)
{
    return FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
}
```

**Repetir exatamente o mesmo em:**
- `FEventManager::LoadBlueprint()` — EventManager.cpp:148
- `FNodeDeleter::LoadBlueprint()` — NodeDeleter.cpp:154
- `FFunctionManager::LoadBlueprint()` — FunctionManager.cpp:267
- `FFunctionIO::LoadBlueprint()` — FunctionIO.cpp:287
- `FNodePropertyManager::LoadBlueprint()` — NodePropertyManager.cpp:537

**Verificação após corrigir:**
```python
# Testar add_blueprint_node em BP recém-criado
s.sendall(json.dumps({"command":"add_blueprint_node","params":{
    "blueprint_name":"BP_SourceTest",
    "node_type":"PrintString",
    "node_params":{"function_name":"","position":[400,0]}
}}).encode()+b'\n')
# Esperado: success com node_id (não "Blueprint not found")
```

---

## 4. CORREÇÃO #2: create_blueprint com Blueprint como parent_class

### O problema

`HandleCreateBlueprint()` em `BlueprintCommands.cpp:119` só aceita classes nativas C++ como `parent_class`. Se passar o caminho de um Blueprint existente (`/Game/Blueprints/ALS_NPC.ALS_NPC`), ele é ignorado e o BP é criado como filho de Actor.

### O que fazer

Modificar `HandleCreateBlueprint()` em `BlueprintCommands.cpp`. Após a linha ~178 (onde a busca por classe nativa falha), adicionar fallback para carregar Blueprint como parent:

```cpp
// Inserir APÓS o bloco que tenta LoadClass<AActor> (após linha ~178):

// Fallback: try to use another Blueprint as parent class
if (!FoundClass && ParentClass.Contains(TEXT("/")))
{
    // ParentClass is a path like "/Game/Blueprints/ALS_NPC"
    UBlueprint* ParentBP = LoadObject<UBlueprint>(nullptr, *ParentClass);
    if (!ParentBP)
    {
        // Try with .AssetName suffix
        FString AssetName = FPaths::GetBaseFilename(ParentClass);
        FString FullPath = FString::Printf(TEXT("%s.%s"), *ParentClass, *AssetName);
        ParentBP = LoadObject<UBlueprint>(nullptr, *FullPath);
    }
    
    if (ParentBP && ParentBP->GeneratedClass)
    {
        FoundClass = ParentBP->GeneratedClass;
        UE_LOG(LogTemp, Log, TEXT("Using Blueprint '%s' as parent class"), *ParentClass);
    }
}
```

---

## 5. CORREÇÃO #3: Campo "type" vs "command" no MCPServerRunnable

### O problema

`MCPServerRunnable.cpp` tem dois code paths:
- `Run()` linha 81 lê campo `"type"` (ERRADO)
- `ProcessMessage()` linha 318 lê campo `"command"` (CORRETO)

Se o servidor estiver usando o code path do `Run()`, comandos com `"command"` serão ignorados.

### O que fazer

Em `MCPServerRunnable.cpp`, linha 81, mudar:
```cpp
// ANTES:
if (JsonObject->TryGetStringField(TEXT("type"), CommandType))

// DEPOIS:
if (JsonObject->TryGetStringField(TEXT("command"), CommandType))
```

---

## 6. CORREÇÃO #4: Adicionar comando delete_blueprint

### O que fazer

Em `BlueprintCommands.h`, adicionar declaração:
```cpp
TSharedPtr<FJsonObject> HandleDeleteBlueprint(const TSharedPtr<FJsonObject>& Params);
```

Em `BlueprintCommands.cpp`, adicionar no `HandleCommand()`:
```cpp
else if (CommandType == TEXT("delete_blueprint"))
{
    return HandleDeleteBlueprint(Params);
}
```

Implementação:
```cpp
TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleDeleteBlueprint(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintPath;
    if (!Params->TryGetStringField(TEXT("blueprint_path"), BlueprintPath))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_path' parameter"));
    }
    
    if (!UEditorAssetLibrary::DoesAssetExist(BlueprintPath))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(
            FString::Printf(TEXT("Asset not found: %s"), *BlueprintPath));
    }
    
    bool bDeleted = UEditorAssetLibrary::DeleteAsset(BlueprintPath);
    
    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetBoolField(TEXT("deleted"), bDeleted);
    ResultObj->SetStringField(TEXT("path"), BlueprintPath);
    return ResultObj;
}
```

Adicionar rota no `EpicUnrealMCPBridge.cpp`:
```cpp
// Na lista de Blueprint Commands, adicionar:
CommandType == TEXT("delete_blueprint")
```

---

## 7. CORREÇÃO #5: add_component_to_blueprint com componentes Blueprint

### O problema

`HandleAddComponentToBlueprint()` em `BlueprintCommands.cpp` só busca classes C++ com `FindObject<UClass>` / `LoadClass`. Componentes criados como Blueprint não são encontrados.

### O que fazer

Após o loop de busca de classes nativas (linha ~293, antes da verificação final), adicionar fallback via AssetRegistry:

```cpp
// Fallback: search for Blueprint components via AssetRegistry
if (!ComponentClass || !ComponentClass->IsChildOf(UActorComponent::StaticClass()))
{
    FAssetRegistryModule& AssetRegistryModule = FModuleManager::LoadModuleChecked<FAssetRegistryModule>(TEXT("AssetRegistry"));
    IAssetRegistry& AssetRegistry = AssetRegistryModule.Get();
    
    for (const FString& Candidate : Candidates)
    {
        // Try searching by asset name
        TArray<FAssetData> Assets;
        AssetRegistry.GetAssetsByPath(FName("/Game/"), Assets, true);
        for (const FAssetData& Asset : Assets)
        {
            if (Asset.AssetName.ToString().Contains(Candidate))
            {
                UBlueprint* CompBP = Cast<UBlueprint>(Asset.GetAsset());
                if (CompBP && CompBP->GeneratedClass && 
                    CompBP->GeneratedClass->IsChildOf(UActorComponent::StaticClass()))
                {
                    ComponentClass = CompBP->GeneratedClass;
                    break;
                }
            }
        }
        if (ComponentClass) break;
    }
}
```

---

## 8. CORREÇÃO #6: Padronizar parâmetros blueprint_name vs blueprint_path

O código atual tem inconsistência. O ideal é aceitar AMBOS em todos os comandos.

**Padrão a adotar em todo lugar:**
```cpp
FString BlueprintName;
if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
{
    // Fallback to blueprint_path
    if (!Params->TryGetStringField(TEXT("blueprint_path"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' or 'blueprint_path' parameter"));
    }
}
```

`FEpicUnrealMCPCommonUtils::FindBlueprint()` já aceita tanto nome curto quanto path completo, então essa mudança é suficiente.

---

## 9. Referência: Comandos que FUNCIONAM (implementação correta)

Use estes como molde para qualquer novo comando:

### create_variable (BPVariables.cpp:13)
- Usa `FEpicUnrealMCPCommonUtils::FindBlueprint()` — **sempre use esta função**
- Cria variável com `FBlueprintEditorUtils::AddMemberVariable()`
- Compila com `FKismetEditorUtilities::CompileBlueprint()`
- Marca dirty com `Blueprint->MarkPackageDirty()`

### get_blueprint_summary (funciona, buscar onde está implementado)
- Faz lookup de Blueprint corretamente
- Retorna informações estruturadas de componentes, variáveis, funções e estado de compilação

---

## 10. Checklist de Verificação Pós-Correção

Após cada correção, testar com este script:

```python
import socket, json, time

def cmd(command, params=None):
    s = socket.socket(); s.settimeout(5)
    s.connect(('127.0.0.1', 55557))
    msg = {"command": command}
    if params: msg["params"] = params
    s.sendall(json.dumps(msg).encode() + b'\n')
    resp = s.recv(8192).decode()
    s.close()
    return json.loads(resp)

# Teste 1: criar Blueprint e adicionar nó
bp = cmd("create_blueprint", {"name":"BP_TestNode","save_path":"/Game/MCPTests/","parent_class":"Actor"})
print("Create:", bp)

node = cmd("add_blueprint_node", {"blueprint_name":"BP_TestNode","node_type":"PrintString"})
print("Node:", node)  # Deve retornar success com node_id

# Teste 2: Blueprint como parent_class
bp2 = cmd("create_blueprint", {"name":"BP_Child","save_path":"/Game/MCPTests/","parent_class":"/Game/MCPTests/BP_TestNode"})
print("Child:", bp2)  # parent_class deve ser BP_TestNode, não Actor

# Teste 3: delete_blueprint
d = cmd("delete_blueprint", {"blueprint_path":"/Game/MCPTests/BP_TestNode"})
print("Delete:", d)  # deleted: true

# Teste 4: limpar
cmd("delete_blueprint", {"blueprint_path":"/Game/MCPTests/BP_Child"})
cmd("delete_blueprint", {"blueprint_path":"/Game/MCPTests/BP_SourceTest"})
```

---

## 11. Notas para o Claude

1. **SEMPRE** use `FEpicUnrealMCPCommonUtils::FindBlueprint()` para localizar Blueprints — nunca escreva seu próprio lookup.
2. **SEMPRE** inclua `#include "Commands/EpicUnrealMCPCommonUtils.h"` no topo.
3. Comandos de leitura funcionam, comandos de escrita em grafo estão quebrados pela função LoadBlueprint local.
4. O `MCPServerRunnable.cpp` tem dois code paths — certifique-se de que ambos leem `"command"`, não `"type"`.
5. Arquivos a modificar estão em: `flopperam-mcp/UnrealMCP/Source/UnrealMCP/`
