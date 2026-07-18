# Integração AVA CLI + Flopperam Unreal Engine MCP

## Visão Geral

O AVA CLI agora possui **dois canais de comunicação** com o Unreal Engine 5:

```
┌──────────────────────────────────────────────────────────────────┐
│                         AVA CLI (TypeScript)                      │
│                                                                   │
│  ┌─────────────────────┐        ┌──────────────────────────────┐ │
│  │     unreal_ops      │        │        unreal_mcp            │ │
│  │  HTTP REST :30010   │        │     TCP JSON :55557          │ │
│  │  (Remote Control)   │        │  (Plugin UnrealMCP C++)      │ │
│  └────────┬────────────┘        └────────────┬─────────────────┘ │
│           │                                   │                   │
└───────────┼───────────────────────────────────┼───────────────────┘
            │                                   │
            ▼                                   ▼
┌───────────────────────┐          ┌───────────────────────────────┐
│  Remote Control API   │          │     UnrealMCP Plugin (C++)     │
│  (Nativo do UE5)      │          │  - Servidor TCP porta 55557    │
│  - ExecutePythonScript│          │  - Blueprint creation/edit     │
│  - Screenshot         │          │  - Blueprint graph (nós/pins)  │
│  - Console commands   │          │  - Spawn/move/delete actors    │
│  - Output: limitado   │          │  - Physics, Materials, Color   │
│  (log do editor)      │          │  - Construção procedural       │
└───────────────────────┘          │  - Output: JSON completo       │
                                   └───────────────────────────────┘
```

**Por que dois canais?** Porque cada um é melhor em coisas diferentes. O Remote Control (HTTP) é ótimo para executar Python arbitrário e comandos de console — mas ruim para receber respostas complexas. O UnrealMCP (TCP) é ótimo para criar/modificar Blueprints e atores — mas não executa Python arbitrário. Juntos, cobrem todas as necessidades.

---

## O que foi instalado no ProjetoGTA

### Caminho exato

```
C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\
  ProjetoGTA\ProjetoGTA\Plugins\UnrealMCP\
    ├── UnrealMCP.uplugin          ← Config do plugin (Editor-only, UE 5.5+)
    └── Source\UnrealMCP\
        ├── UnrealMCP.Build.cs     ← Dependências: BlueprintGraph, KismetCompiler, UnrealEd...
        ├── Public\                 ← Headers C++
        │   ├── EpicUnrealMCPBridge.h
        │   ├── MCPServerRunnable.h
        │   └── Commands\           ← Headers dos comandos
        │       ├── EpicUnrealMCPBlueprintCommands.h
        │       ├── EpicUnrealMCPBlueprintGraphCommands.h
        │       ├── EpicUnrealMCPEditorCommands.h
        │       ├── EpicUnrealMCPCommonUtils.h
        │       └── BlueprintGraph\  ← Nós de BP: Branch, ForLoop, Print, Cast...
        └── Private\                ← Implementações C++
            ├── EpicUnrealMCPBridge.cpp     ← Servidor TCP (listen 55557)
            ├── MCPServerRunnable.cpp       ← Thread de conexão
            └── Commands\
                ├── EpicUnrealMCPBlueprintCommands.cpp     (64 KB)
                ├── EpicUnrealMCPBlueprintGraphCommands.cpp (15 KB)
                ├── EpicUnrealMCPEditorCommands.cpp         (11 KB)
                ├── EpicUnrealMCPCommonUtils.cpp            (27 KB)
                └── BlueprintGraph\
                    ├── NodeManager.cpp         ← Criar nós (Branch, Sequence, ForLoop...)
                    ├── BPVariables.cpp         ← Gerenciar variáveis
                    ├── BPConnector.cpp         ← Conectar pins
                    ├── EventManager.cpp        ← Eventos (BeginPlay, Tick...)
                    ├── NodeDeleter.cpp         ← Deletar nós
                    ├── NodePropertyManager.cpp ← Propriedades de nós
                    └── Function\               ← Funções customizadas
```

### Como o plugin foi obtido

Clone do repositório open-source (MIT License):
```
https://github.com/flopperam/unreal-engine-mcp
```
O código C++ foi copiado diretamente da pasta `UnrealMCP/` do repositório clonado.

> **Portabilidade:** A pasta `UnrealMCP/` pode ser copiada para **qualquer projeto UE5** que precise dessa integração. Basta colar em `<Projeto>/Plugins/UnrealMCP/` e abrir o `.uproject` — a compilação é automática em projetos C++. Se o projeto for **Blueprint-only**, será necessário convertê-lo para C++ primeiro (Add → New C++ Class → criar qualquer classe vazia).

> ⚠️ **Aviso de compatibilidade:** O plugin original do Flopperam suporta **Unreal Engine 5.5+**. Neste projeto, foi testado e compilado para **UE 5.6**. Para UE 5.5, o código original deve funcionar sem alterações. O `UnrealMCP.uplugin` não possui campo `EngineVersion` — a compatibilidade depende do `BuildSettings` do projeto alvo.

### Ativação

O ProjetoGTA já é um projeto **C++** (contém `ProjetoGTA.sln` e `Source/`), então o plugin compila automaticamente ao abrir o `.uproject` no UE5.

**Após abrir o projeto, é necessário ativar os plugins:**

1. **UnrealMCP:** **Edit → Plugins** → buscar `UnrealMCP` → marcar **Enabled** ✓ (necessário para o canal `unreal_mcp` TCP :55557)
2. **Remote Control API:** **Edit → Plugins** → buscar `Remote Control API` → marcar **Enabled** ✓ (necessário para o canal `unreal_ops` HTTP :30010 — é um plugin nativo do UE5, não faz parte do MCP)

Os dois plugins juntos garantem o funcionamento completo dos dois canais de comunicação do AVA.

---

## O que foi implementado no servidor AVA

### Arquivo 1: `server/tools/unreal_mcp_adapter.ts` (novo — 280 linhas)

Este é o **adaptador TCP** que conversa com o plugin UnrealMCP. Ele:

1. **Abre uma conexão TCP** para `127.0.0.1:55557`
2. **Envia um comando JSON**: `{"type": "nome_do_comando", "params": {...}}`
3. **Recebe a resposta JSON** com o resultado completo
4. **Fecha a conexão** (uma conexão por comando)

#### Comandos implementados (21 ações)

| # | Ação | Comando TCP | Descrição |
|---|------|-------------|-----------|
| 1 | `check` | `get_actors_in_level` | Verifica se o plugin está online |
| 2 | `actors` | `get_actors_in_level` | Lista todos os atores do level |
| 3 | `find_actor` | `find_actors_by_name` | Busca atores por padrão de nome |
| 4 | `delete_actor` | `delete_actor` | Deleta um ator pelo nome |
| 5 | `set_transform` | `set_actor_transform` | Move/roda/escala um ator |
| 6 | `create_bp` | `create_blueprint` | Cria um novo Blueprint (Actor, Pawn, etc.) |
| 7 | `add_component` | `add_component_to_blueprint` | Adiciona componente a um BP |
| 8 | `compile_bp` | `compile_blueprint` | Compila um Blueprint |
| 9 | `spawn_actor` | `spawn_blueprint_actor` | Spawna um Blueprint no level |
| 10 | `set_physics` | `set_physics_properties` | Configura física em componente |
| 11 | `list_materials` | `get_available_materials` | Lista materiais disponíveis |
| 12 | `apply_material` | `apply_material_to_actor` | Aplica material a um ator |
| 13 | `set_color` | `set_mesh_material_color` | Define cor de um componente |
| 14 | `add_node` | `add_node` | Adiciona nó ao graph de BP |
| 15 | `connect_nodes` | `connect_nodes` | Conecta pins entre nós |
| 16 | `create_var` | `create_variable` | Cria variável no BP |
| 17 | `construct_house` | `construct_house` | Constrói casa procedural |
| 18 | `create_tower` | `create_tower` | Constrói torre procedural |
| 19 | `create_wall` | `create_wall` | Constrói parede procedural |
| 20 | `create_staircase` | `create_staircase` | Constrói escada procedural |

### Arquivo 2: `server/tools/executor.ts` (modificado — +3 linhas)

Adicionado o dispatch da tool `unreal_mcp`:

```typescript
if (name === "unreal_mcp") {
  return unrealMcp(args);
}
```

### Arquivo 3: `server/agents.ts` (modificado — +65 linhas)

1. **Tool definition** registrada com schema JSON completo (parâmetros: action, name, blueprint, location, etc.)
2. **Filtro de keywords** — a tool é automaticamente incluída na lista de ferramentas enviadas ao LLM quando a query contém palavras-chave como:
   - `spawnar`, `spawn`, `criar blueprint`, `criar bp`, `componente`
   - `compilar`, `fisica`, `physics`, `material`, `cor`
   - `no graph`, `conectar pin`, `variavel bp`
   - `casa`, `torre`, `parede`, `escada`, `procedural`, `construir`
   - `mcp`, `unreal_mcp`
3. **`legacyPredefined`** — adicionada ao conjunto de ferramentas que o filtro de queries mais abrangentes reconhece.

---

## Comparação Completa: unreal_ops vs unreal_mcp

| Capacidade | `unreal_ops` (HTTP :30010) | `unreal_mcp` (TCP :55557) |
|-----------|:---:|:---:|
| **Python arbitrário no editor** | ✅ ``python`` | ❌ |
| **Console commands (`stat fps`)** | ✅ ``console`` | ❌ |
| **Screenshot do viewport** | ✅ ``screenshot`` | ❌ |
| **Listar assets do Content Browser** | ✅ ``assets`` | ❌ |
| **Inspecionar propriedades de ator** | ✅ ``inspect`` | ❌ |
| **Compilar todos os Blueprints** | ✅ ``compile`` | ❌ |
| **Verificar conexão** | ✅ ``check`` | ✅ ``check`` |
| **Listar atores** | ✅ ``actors`` | ✅ ``actors`` |
| **Buscar ator por nome** | ❌ | ✅ ``find_actor`` |
| **Deletar ator** | ❌ | ✅ ``delete_actor`` |
| **Mover/rotacionar/escalar ator** | ❌ | ✅ ``set_transform`` |
| **Criar Blueprint** | ❌ | ✅ ``create_bp`` |
| **Adicionar componente ao BP** | ❌ | ✅ ``add_component`` |
| **Compilar um BP específico** | ❌ | ✅ ``compile_bp`` |
| **Spawnar Blueprint no level** | ❌ | ✅ ``spawn_actor`` |
| **Configurar física** | ❌ | ✅ ``set_physics`` |
| **Listar materiais** | ❌ | ✅ ``list_materials`` |
| **Aplicar material** | ❌ | ✅ ``apply_material`` |
| **Definir cor** | ❌ | ✅ ``set_color`` |
| **Adicionar nó ao EventGraph** | ❌ | ✅ ``add_node`` |
| **Conectar pins entre nós** | ❌ | ✅ ``connect_nodes`` |
| **Criar variável de BP** | ❌ | ✅ ``create_var`` |
| **Construir casa procedural** | ❌ | ✅ ``construct_house`` |
| **Construir torre** | ❌ | ✅ ``create_tower`` |
| **Construir parede** | ❌ | ✅ ``create_wall`` |
| **Construir escada** | ❌ | ✅ ``create_staircase`` |

**Regra prática:** Use `unreal_ops` para Python e console. Use `unreal_mcp` para tudo que envolve criar/modificar Blueprints, atores, e construção procedural.

---

## Próximos Passos

### Passo 1: Ativar o Plugin (AÇÃO DO USUÁRIO)

```
1. Fechar o UE5 (se estiver aberto)
2. Abrir ProjetoGTA.uproject
3. O editor vai detectar o novo plugin em Plugins/UnrealMCP/
4. Vai perguntar se quer compilar → SIM
5. Aguardar a compilação (~1-2 minutos na primeira vez)
6. Confirmar: Edit → Plugins → buscar "UnrealMCP" → Enabled ✓
```

### Passo 2: Testar a Conexão

No AVA CLI, executar:
```
unreal_mcp({ action: "check" })
```

Resposta esperada:
```
UnrealMCP ONLINE - X actors no level atual.
```

Se falhar com `UnrealMCP plugin nao encontrado na porta 55557`:
- O UE5 pode não ter compilado o plugin ainda
- Verifique Edit → Plugins → UnrealMCP → Enabled
- Reinicie o editor

### Passo 3: Testar uma Ação Simples

```
unreal_mcp({ action: "actors" })
```

Deve listar todos os atores do mapa TestMap (ALS_NPC, BP_Beretta, etc.)

### Passo 4: Aplicar ao Caso da Tocha

Com a integração funcionando, o plano para criar a tocha no player fica muito mais direto:

```
1. criar BP da tocha:
   unreal_mcp({ action: "create_bp", name: "BP_Torch", parent_class: "Actor" })

2. adicionar o mesh da tocha:
   unreal_mcp({ 
     action: "add_component", 
     blueprint: "BP_Torch", 
     component_type: "StaticMeshComponent", 
     component_name: "TorchMesh" 
   })

3. adicionar luz (PointLight):
   unreal_mcp({ 
     action: "add_component", 
     blueprint: "BP_Torch", 
     component_type: "PointLightComponent", 
     component_name: "TorchLight" 
   })

4. compilar:
   unreal_mcp({ action: "compile_bp", name: "BP_Torch" })

5. spawnar no level para testar:
   unreal_mcp({ 
     action: "spawn_actor", 
     blueprint: "BP_Torch", 
     name: "TorchTest", 
     location: [0, 0, 100] 
   })
```

**Detalhes que precisam de Python (unreal_ops):**
Como o `unreal_mcp` não tem todas as capacidades do Python, algumas coisas ainda precisam de `unreal_ops`:

```python
# Anexar a tocha ao socket WeaponHand do personagem
unreal_ops({
  action: "python",
  script: `
import unreal
world = unreal.EditorLevelLibrary.get_editor_world()
torch = None
for a in unreal.EditorLevelLibrary.get_all_level_actors():
    if 'TorchTest' in a.get_actor_label():
        torch = a
        break
pawn = unreal.GameplayStatics.get_player_pawn(world, 0)
if torch and pawn:
    mesh = pawn.get_component_by_class(unreal.SkeletalMeshComponent)
    torch.k2_attach_to_component(mesh, 'WeaponHand', 
        unreal.AttachmentRule.SNAP_TO_TARGET,
        unreal.AttachmentRule.SNAP_TO_TARGET, 
        unreal.AttachmentRule.KEEP_RELATIVE, True)
    unreal.log('Torch attached to player!')
  `
})
```

---

## Expandindo as Capacidades

### Se quiser adicionar mais comandos ao adaptador

O padrão é simples. No `unreal_mcp_adapter.ts`:

```typescript
case "novo_comando": {
  const resultado = await sendMcpCommand("nome_do_comando_tcp", {
    param1: args.param1,
    param2: args.param2,
  });
  return formatarResposta(resultado);
}
```

Os comandos TCP disponíveis (enviados pelo plugin C++) estão documentados em:
- `flopperam-mcp/Python/unreal_mcp_server_advanced.py` — servidor Python que lista todos os comandos
- `flopperam-mcp/Guides/tools-reference.md` — referência de ferramentas

### Se quiser integrar com Cursor/Claude via MCP Protocol

O AVA já tem um cliente MCP em `server/mcp/client.ts`. Para transformar o AVA em um **servidor MCP**:

1. Instalar `@modelcontextprotocol/sdk` no package.json
2. Criar `server/mcp/server.ts` com as tools expostas
3. Configurar `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "ava-unreal": {
      "command": "node",
      "args": ["--loader", "tsx", "server/mcp/server.ts"]
    }
  }
}
```

Isso permitiria usar o AVA diretamente no Cursor sem o CLI.

---

## Arquivos Criados/Modificados

```
CRIADO-AVA-CLI/
├── adicionar_tocha_ao_player/
│   ├── GUIA_ADICIONAR_TOCHA_AO_PLAYER.md      ← Guia da tocha (anterior)
│   ├── ANALISE_FLOPPERAM_MCP.md               ← Análise comparativa (anterior)
│   ├── RESUMO_PROJETO.md                      ← Resumo ProjetoGTA (anterior)
│   ├── INTEGRACAO_MCP.md                      ← Documentação técnica (anterior)
│   └── DOCUMENTACAO_COMPLETA.md               ← ESTE DOCUMENTO
│
├── flopperam-mcp/                              ← Clone do repo (MIT License)
│   ├── UnrealMCP/                              ← Plugin C++ (copiado p/ ProjetoGTA)
│   ├── Python/                                 ← Servidor MCP local (referência)
│   └── Guides/                                 ← Documentação do Flopperam
│
└── ProjetoGTA/Plugins/UnrealMCP/               ← Plugin instalado no projeto

server/
├── tools/
│   ├── unreal_mcp_adapter.ts                   ← NOVO: Adaptador TCP
│   ├── unreal_ops.ts                           ← Existente: HTTP Remote Control
│   └── executor.ts                             ← Modificado: +dispatch unreal_mcp
└── agents.ts                                   ← Modificado: +tool definition
```

---

## Troubleshooting

| Problema | Causa Provável | Solução |
|----------|---------------|---------|
| `ECONNREFUSED :55557` | Plugin não compilou/carregou ou não foi ativado | **Edit → Plugins** → UnrealMCP → **Enabled** ✓. Reiniciar editor se necessário. |
| `ECONNREFUSED :30010` (unreal_ops) | Remote Control API não ativado | **Edit → Plugins** → Remote Control API → **Enabled** ✓ |
| Plugin não compila / erro C++ | Versão do UE5 incompatível | O plugin foi testado e compilado para **UE 5.6**. Versões anteriores (5.4, 5.3) podem exigir ajustes no código C++ e no `UnrealMCP.uplugin`. |
| `Timeout` no `construct_house` | Operação grande (spawn de muitos atores) | Aumentar `UE_MCP_LARGE_TIMEOUT_MS` |
| Plugin não aparece no UE5 | Projeto pode ser Blueprint-only | Verificar se `ProjetoGTA.sln` e `Source/` existem. Projetos Blueprint-only precisam ser convertidos para C++ primeiro. |
| Erro de compilação C++ | `BuildSettingsVersion` do projeto incompatível | O plugin requer `DefaultBuildSettings.V5` (UE 5.6) ou superior. Para UE 5.5, verificar `.Target.cs` do projeto. |
| `Connection reset` | Editor fechou ou crashou | Reabrir o UE5, o plugin recarrega automaticamente |
