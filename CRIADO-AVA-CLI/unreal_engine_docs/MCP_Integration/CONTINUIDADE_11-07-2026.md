# Continuidade — 11/07/2026

## Resumo da Sessão

Objetivo retomado das sessões anteriores (`2026-07-10`): **corrigir a lanterna das armas** no ProjetoGTA (UE 5.6) via UnrealMCP.

Ao tentar conectar no bridge TCP, descobriu-se que a conexão estava "morta" — porta 55557 escutando, mas sem responder a comandos. Foi identificado um bug no plugin que causa travamento em conexões ociosas.

---

## 1. Bug Encontrado: Conexão Idle Trava o Bridge

### Sintoma
- Após alguns minutos sem tráfego, o bridge para de responder
- A porta 55557 continua em `LISTENING`
- O Unreal Editor continua rodando normalmente
- Nenhum erro visível nos logs
- Nova tentativa de conexão TCP conecta mas nunca recebe resposta

### Causa Raiz
**`MCPServerRunnable.cpp` — Socket do cliente aceito NUNCA era configurado como non-blocking.**

```cpp
// Linhas 45-54 (ANTES do fix):
ClientSocket = MakeShareable(ListenerSocket->Accept(TEXT("MCPClient")));
ClientSocket->SetNoDelay(true);
ClientSocket->SetSendBufferSize(65536, 65536);
ClientSocket->SetReceiveBufferSize(65536, 65536);
// FALTAVA: ClientSocket->SetNonBlocking(true);

// Linha 66: Recv() BLOQUEANTE — se o cliente ficar ocioso, a thread trava aqui pra sempre
if (ClientSocket->Recv(Buffer, sizeof(Buffer) - 1, BytesRead))
```

O listener socket era non-blocking, mas o socket do cliente aceito **herdava o modo padrão (blocking)**. Como `Recv()` bloqueante espera dados indefinidamente, uma conexão ociosa paralisa a thread inteira. O bridge nunca volta ao loop externo para aceitar novas conexões.

### O código já tinha tratamento pra non-blocking (morto)
```cpp
// Linhas 155-160 — código que NUNCA era atingido porque o socket estava bloqueando:
if (LastError == SE_EWOULDBLOCK)  // "would block" — normal pra non-blocking
{
    bShouldBreak = false;
    FPlatformProcess::Sleep(0.01f);
}
```

O dev original esperava comportamento non-blocking (tratou `SE_EWOULDBLOCK`), mas esqueceu de setar `SetNonBlocking(true)`.

### Fix Aplicado
**Arquivo:** `Source\UnrealMCP\Private\MCPServerRunnable.cpp`
**Linha adicionada:** 60

```cpp
// Depois de SetReceiveBufferSize, ANTES do uint8 Buffer[8192]:
ClientSocket->SetNonBlocking(true);
```

Com isso, `Recv()` retorna imediatamente com `SE_EWOULDBLOCK` quando não há dados. A thread dorme 10ms e tenta de novo. Conexões ociosas nunca mais travam.

### Status do Fix
**NÃO COMPILADO AINDA.** A DLL `UnrealEditor-UnrealMCP.dll` ainda é de `11/07/2026 11:24:36` (versão antiga). O Live Coding do Editor não detecta mudanças em plugins.

---

## 2. Como Recompilar o Plugin Corretamente

O Live Coding **NÃO** recompila plugins. É necessário build offline:

```powershell
# 1. FECHAR o Unreal Editor
taskkill /F /IM UnrealEditor.exe

# 2. Deletar cache de build do plugin (FORÇA recompilação)
Remove-Item -Recurse -Force "C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\Plugins\UnrealMCP\Intermediate" -ErrorAction SilentlyContinue

# 3. Build
& "C:\Program Files\Epic Games\UE_5.6\Engine\Build\BatchFiles\Build.bat" ProjetoGTAEditor Win64 Development -Project="C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\ProjetoGTA.uproject"

# 4. Reabrir o projeto
Start-Process "C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\ProjetoGTA.uproject"
```

**Verificar se compilou:** a DLL deve ter timestamp novo:
```powershell
Get-ChildItem "C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\Plugins\UnrealMCP\Binaries" -Recurse -Filter "*.dll" | Select-Object Name, LastWriteTime
```

---

## 3. Arquitetura Detalhada da Conexão

### Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│ AVA CLI (TypeScript)                                                │
│ server/tools/unreal_mcp_adapter.ts                                  │
│                                                                     │
│ Conecta via TCP → 127.0.0.1:55557                                  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ JSON + "\n"
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Unreal Editor (ProjetoGTA)                                          │
│                                                                     │
│ ┌───────────────────────────────────────────────────────────────┐   │
│ │ UEpicUnrealMCPBridge (UEditorSubsystem)                       │   │
│ │ - Inicializa ao abrir o Editor                                │   │
│ │ - Cria listener socket 127.0.0.1:55557 (non-blocking)         │   │
│ │ - Cria thread FMCPServerRunnable                              │   │
│ │ - ExecuteCommand(): despacha pra GameThread via AsyncTask     │   │
│ └───────────────────────────────────────────────────────────────┘   │
│                               │                                     │
│                               ▼                                     │
│ ┌───────────────────────────────────────────────────────────────┐   │
│ │ FMCPServerRunnable (Thread dedicada: "UnrealMCPServerThread") │   │
│ │                                                               │   │
│ │ Loop externo (a cada 100ms):                                  │   │
│ │   ListenerSocket->HasPendingConnection() → Accept()           │   │
│ │                                                               │   │
│ │ Loop interno (único cliente por vez):                         │   │
│ │   ClientSocket->Recv() → parse JSON → Bridge->ExecuteCommand │   │
│ │   → envia resposta → volta pro Recv()                        │   │
│ │                                                               │   │
│ │ [FIX] ClientSocket->SetNonBlocking(true)  ← ADICIONADO HOJE  │   │
│ └───────────────────────────────────────────────────────────────┘   │
│                               │                                     │
│                               ▼                                     │
│ ┌───────────────────────────────────────────────────────────────┐   │
│ │ GameThread (via AsyncTask + TPromise/TFuture)                 │   │
│ │ - EditorCommands: get_actors, spawn, delete, attach, etc.     │   │
│ │ - BlueprintCommands: create_bp, add_component, compile, etc.  │   │
│ │ - BlueprintGraphCommands: add_node, connect, create_func, etc.│   │
│ │ - BuildingCommands: create_wall, construct_house, etc.        │   │
│ └───────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Protocolo

- **Transporte:** TCP, `127.0.0.1:55557`
- **Formato:** JSON terminado por `\n`
- **Cliente único:** uma conexão TCP por vez (mantenha a mesma conexão aberta)
- **Campos da mensagem:**
  ```json
  {
    "command": "nome_do_comando",
    "params": { "chave": "valor" }
  }
  ```
- **Resposta:**
  ```json
  {
    "status": "success",
    "result": { ... }
  }
  ```
- **Teste:**
  ```json
  {"command":"ping","params":{}}
  ```
  Resposta esperada: `{"status":"success","result":{"message":"pong"}}`

### Comandos de Bridge (Sistema)

| Comando | Descrição |
|---------|-----------|
| `ping` | Teste de conectividade |
| `read_blueprint_content` | Lê estrutura do Blueprint |
| `analyze_blueprint_graph` | Analisa o graph de eventos/funções |
| `add_blueprint_interface` | Adiciona interface ao BP |
| `remove_blueprint_interface` | Remove interface do BP |

### Comandos Disponíveis (39 ações)

Ver `DOCUMENTACAO_FINAL.md` seção 3 para lista completa. Destaques:
- **Blueprint:** `create_blueprint`, `add_component_to_blueprint`, `compile_blueprint`
- **Componentes:** `set_component_static_mesh`, `set_point_light_properties`, `set_mesh_material_color`
- **Atores:** `spawn_blueprint_actor`, `get_actors_in_level`, `find_actors_by_name`, `delete_actor`, `set_actor_transform`, `attach_actor_to_socket`
- **Graph:** `add_blueprint_node`, `connect_blueprint_nodes`, `create_blueprint_variable`, `create_blueprint_function`
- **Construção:** `create_wall`, `create_staircase`, `create_tower`, `construct_house`

---

## 4. Tarefa Atual: Corrigir Lanterna das Armas

### Contexto
Jogo de terror — ProjetoGTA. Todas as armas devem ter lanterna funcional.

### Blueprints Envolvidos

| Blueprint | Path | Descrição |
|-----------|------|-----------|
| `BP_Character` | `/Game/Blueprints/Character/BP_Character` | Personagem do jogador |
| `BP_WeaponBase` | `/Game/Blueprints/Weapons/BP_WeaponBase` | Classe base de todas as armas |
| `AC_WeaponSystem` | `/Game/Blueprints/Weapons/AC_WeaponSystem` | Componente de sistema de armas |
| `BP_WeaponInterface` | `/Game/Blueprints/Weapons/BP_WeaponInterface` | Interface de armas |

### Diagnóstico Confirmado (sessão 10/07/2026)

`BP_WeaponBase` já contém:
- `WeaponMesh` (SkeletalMeshComponent)
- `SpringArm` (SpringArmComponent) ← **PROBLEMA: inadequado pra lanterna**
- `LuzLanterna` (SpotLightComponent)
- Variável `FlashlightOn` (bool)
- Função `ToggleFlashlight` (9 nós)
- Interface `BP_WeaponInterface_C`

O `SpringArm` é componente de câmera e causa posicionamento/rotação indesejados.

### Plano de Execução (8 passos)

1. **Ler `BP_Character` e `AC_WeaponSystem`** — identificar referência da arma equipada
2. **Inspecionar `ToggleFlashlight`** — confirmar que alterna `LuzLanterna` e `FlashlightOn`
3. **Remover `SpringArm`** de `BP_WeaponBase`
4. **Anexar `LuzLanterna` diretamente a `WeaponMesh`**
   - Se houver socket `FlashlightSocket` nos esqueletos, usar ele
   - Senão, anexar direto com transform relativo
5. **Definir `LuzLanterna` iniciando desligada** (Visibility/Active = false)
6. **No `BP_Character`**, adicionar ação de input da lanterna → arma equipada
7. **Adicionar `ToggleFlashlight` à `BP_WeaponInterface`** e chamar como mensagem de interface (evita casts)
8. **Compilar e validar** com `read_blueprint_content` / `analyze_blueprint_graph`

### Cuidados
- NÃO remover `WeaponMesh`, `WeaponCollision`, `Magazine` ou lógica de tiro/recarregamento
- NÃO criar classe filha separada pra lanterna (usuário decidiu: todas as armas)
- Compilar após cada alteração grande
- Sempre usar `blueprint_path`, NÃO `blueprint_name`

### Comandos Úteis para a Tarefa

```json
// Ler estrutura do BP_WeaponBase
{"command":"read_blueprint_content","params":{"blueprint_path":"/Game/Blueprints/Weapons/BP_WeaponBase"}}

// Ler estrutura do BP_Character
{"command":"read_blueprint_content","params":{"blueprint_path":"/Game/Blueprints/Character/BP_Character"}}

// Ler AC_WeaponSystem
{"command":"read_blueprint_content","params":{"blueprint_path":"/Game/Blueprints/Weapons/AC_WeaponSystem"}}

// Analisar graph da função ToggleFlashlight
{"command":"analyze_blueprint_graph","params":{"blueprint_path":"/Game/Blueprints/Weapons/BP_WeaponBase","function_name":"ToggleFlashlight"}}

// Adicionar função à interface
{"command":"add_blueprint_function","params":{"blueprint_path":"/Game/Blueprints/Weapons/BP_WeaponInterface","function_name":"ToggleFlashlight"}}
```

---

## 5. Próximos Passos (Checklist)

### Imediato
- [ ] **Recompilar o plugin** (com o fix do `SetNonBlocking`) — instruções na seção 2
- [ ] **Abrir ProjetoGTA no UE 5.6**
- [ ] **Testar ping** para confirmar bridge funcional
- [ ] **Executar passo 1 do plano:** ler `BP_Character` e `AC_WeaponSystem`

### Em Sequência
- [ ] Passos 2-8 do plano da lanterna (seção 4)
- [ ] Validar visualmente no viewport

### Pendências Críticas
- [ ] DLL `UnrealEditor-UnrealMCP.dll` precisa ser recompilada com o fix de non-blocking
- [ ] `Intermediate/` do plugin precisa ser deletado antes do build (Live Coding NÃO serve)

---

## 6. Arquivos do Plugin Modificados (Histórico)

| Arquivo | O quê | Quando |
|---------|-------|--------|
| `MCPServerRunnable.cpp` | `SetNonBlocking(true)` no socket do cliente | 11/07/2026 (NÃO COMPILADO) |
| `MCPServerRunnable.cpp` | Aceitar `command` + `type`, aceitar `params` ausente | 10/07/2026 |
| `EpicUnrealMCPBridge.cpp` | Roteamento `add_blueprint_interface`, `remove_blueprint_interface` | 10/07/2026 |
| `EpicUnrealMCPBlueprintGraphCommands.cpp` | Exposição dos comandos de interface | 10/07/2026 |
| `EpicUnrealMCPBlueprintGraphCommands.h` | Declaração dos comandos de interface | 10/07/2026 |

---

## 7. Caminhos Importantes

```
Projeto UE5:
  C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\

Plugin C++:
  ...\ProjetoGTA\Plugins\UnrealMCP\
  ...\ProjetoGTA\Plugins\UnrealMCP\Source\UnrealMCP\Private\MCPServerRunnable.cpp  ← FIX AQUI

Memória de sessões:
  C:\Users\hijon\Documents\Codex\2026-07-10\eu\outputs\unreal_mcp_continuidade.md

DLL compilada:
  ...\ProjetoGTA\Plugins\UnrealMCP\Binaries\Win64\UnrealEditor-UnrealMCP.dll

Unreal Engine:
  C:\Program Files\Epic Games\UE_5.6\

Docs AVA:
  C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\CRIADO-AVA-CLI\unreal_engine_docs\MCP_Integration\
```
