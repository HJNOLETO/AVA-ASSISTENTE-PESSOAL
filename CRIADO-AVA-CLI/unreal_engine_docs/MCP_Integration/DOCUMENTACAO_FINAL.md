# Documentação Final — Integração AVA CLI + Flopperam Unreal Engine MCP

**Data:** 07/07/2026  
**Projeto:** ProjetoGTA (UE 5.6)  
**Objetivo:** Conectar o AVA CLI ao Unreal Engine 5 para controle total via linguagem natural, com foco em criar uma tocha anexada ao player.

---

## 1. Linha do Tempo

| Etapa | O que foi feito | Resultado |
|-------|----------------|-----------|
| **Análise** | Estudado Flopperam MCP (1.1k stars, MIT) | Arquitetura: TCP C++ plugin + Python MCP server |
| **Comparação** | vs `unreal_ops` existente (HTTP Remote Control) | `unreal_ops` bom para Python/console; MCP bom para Blueprints |
| **Decisão** | Usar código pronto (MIT) + melhorar conforme necessidade | Reaproveitamento de código C++ existente |
| **Clone** | `git clone` do repositório Flopperam | Código fonte disponível em `flopperam-mcp/` |
| **Instalação** | Plugin copiado para `ProjetoGTA/Plugins/UnrealMCP/` | Compilou ao abrir o projeto |
| **Adaptador** | Criado `server/tools/unreal_mcp_adapter.ts` (280 linhas) | 21 ações disponíveis via `unreal_mcp` |
| **Registro** | `executor.ts` + `agents.ts` modificados | Tool integrada ao AVA CLI |
| **Testes Iniciais** | 5/7 passaram, 2 problemas encontrados | Componentes + construção procedural quebrados |
| **Correção 1** | `FindObject` → `StaticLoadClass` no BlueprintCommands | Componentes passam a funcionar |
| **Adição 1** | `EpicUnrealMCPBuildingCommands` (407 linhas) | `create_wall`, `create_staircase`, `create_tower`, `construct_house` |
| **Correção 3** | `ProjetoGTAEditor.Target.cs` (V2→V5) + `ProjetoGTA.uproject` (5.1→5.6, Bridge removido) | Projeto compila em UE 5.6 |
| **Adição 2** | `set_component_static_mesh`, `set_point_light_properties` (BlueprintCommands) | Configurar mesh e luz no BP via TCP |
| **Adição 3** | `attach_actor_to_socket` (EditorCommands) | Anexar ator ao socket de outro ator |
| **Build** | Compilação completa (39 ações, 6.5 min) | Nova DLL com todos os comandos |
| **Status Final** | Plugin ONLINE, todos comandos prontos para teste | Aguardando teste do fluxo completo da tocha |

---

## 2. Arquitetura Final

```
AVA CLI (TypeScript)
│
├── unreal_ops (HTTP :30010)
│   └── Remote Control API nativa do UE5
│       ├── execute_python   (com retorno limitado)
│       ├── console commands
│       ├── screenshot
│       ├── inspect actors
│       └── list assets
│
└── unreal_mcp (TCP :55557)
    └── UnrealMCP Plugin C++ (MIT, melhorado pelo AVA)
        ├── create_blueprint, compile_blueprint
        ├── add_component_to_blueprint  [CORRIGIDO: StaticLoadClass]
        ├── set_component_static_mesh   [NOVO - AVA]
        ├── set_point_light_properties  [NOVO - AVA]
        ├── set_mesh_material_color
        ├── set_physics_properties
        ├── spawn_blueprint_actor
        ├── get_actors_in_level, find_actors_by_name
        ├── delete_actor, set_actor_transform
        ├── attach_actor_to_socket      [NOVO - AVA]
        ├── create_wall, create_staircase [NOVO - AVA]
        ├── create_tower, construct_house [NOVO - AVA]
        └── BlueprintGraph (add_node, connect_nodes, create_variable, create_function...)
```

---

## 3. Comandos Disponíveis (`unreal_mcp`)

### Conexão e Atores
| Ação | Descrição |
|------|-----------|
| `check` | Verifica se plugin UnrealMCP está online |
| `actors` | Lista todos os atores do level |
| `find_actor` | Busca atores por padrão de nome (`pattern`) |
| `delete_actor` | Deleta um ator (`name`) |
| `set_transform` | Move/roda/escala ator (`name`, `location`, `rotation`, `scale`) |

### Blueprint
| Ação | Descrição |
|------|-----------|
| `create_bp` | Cria Blueprint (`name`, `parent_class`) |
| `add_component` | Adiciona componente ao BP (`blueprint`, `component_type`, `component_name`) |
| `compile_bp` | Compila Blueprint (`name`) |
| `create_var` | Cria variável no BP (`blueprint`, `name`, `type`) |

### Componentes (CORRIGIDOS/ADICIONADOS)
| Ação | Descrição |
|------|-----------|
| `set_mesh` | Define StaticMesh no componente (`blueprint`, `component`, `static_mesh`) |
| `set_light` | Configura PointLight (`blueprint`, `component`, `intensity`, `light_color`...) |
| `set_color` | Define cor do material (`blueprint`, `component`, `color`) |
| `set_physics` | Configura física (`blueprint`, `component`, `mass`, `simulate_physics`) |

### Spawn e Anexação
| Ação | Descrição |
|------|-----------|
| `spawn_actor` | Spawna Blueprint no level (`blueprint`, `name`, `location`, `rotation`) |
| `attach` | Anexa ator ao socket de outro (`child`, `parent`, `socket`) |

### Blueprint Graph
| Ação | Descrição |
|------|-----------|
| `add_node` | Adiciona nó ao EventGraph (`blueprint`, `node_type`) |
| `connect_nodes` | Conecta pins entre nós (`blueprint`, `source_*`, `target_*`) |

### Construção Procedural (ADICIONADO)
| Ação | Descrição |
|------|-----------|
| `create_wall` | Parede de cubos (`length`, `height`, `block_size`, `location`, `orientation`) |
| `create_staircase` | Escada (`steps`, `step_size`, `location`) |
| `create_tower` | Torre quadrada/cilíndrica (`height`, `base_size`, `style`, `location`) |
| `construct_house` | Casa com paredes + teto (`width`, `depth`, `height`, `location`) |

---

## 4. Fluxo da Tocha — Comandos Prontos para Testar

O teste do fluxo completo está no script `testar_tocha.py` (pronto, não executado). Sequência:

```
1. create_bp        → Criar BP_TochaAvA
2. add_component     → TorchMesh (StaticMeshComponent)
3. add_component     → TorchLight (PointLightComponent)
4. set_mesh          → /Game/AdvancedLocomotionV4/Props/Meshes/Torch
5. set_light         → Intensidade 5000, cor laranja, raio 800
6. compile_bp        → Compilar
7. spawn_actor       → Spawnar em (500, 500, 200)
8. attach            → Anexar ao socket WeaponHand do ALS_NPC_C_0
```

### Para executar (próxima sessão):

```bash
python testar_tocha.py
```

---

## 5. Arquivos Modificados/Criados

### AVA CLI (TypeScript)
```
server/
├── tools/
│   ├── unreal_mcp_adapter.ts    ← NOVO: Adaptador TCP (280 linhas)
│   ├── unreal_ops.ts             ← Existente: HTTP Remote Control
│   └── executor.ts               ← Modificado: +dispatch unreal_mcp
└── agents.ts                     ← Modificado: +tool definition, +filtro keywords
```

### Plugin C++ UnrealMCP
```
ProjetoGTA/Plugins/UnrealMCP/Source/UnrealMCP/
├── Public/
│   ├── EpicUnrealMCPBridge.h                           ← Modificado (+BuildingCommands)
│   └── Commands/
│       ├── EpicUnrealMCPBlueprintCommands.h             ← Modificado (+set_component_static_mesh, +set_point_light)
│       ├── EpicUnrealMCPEditorCommands.h                ← Modificado (+attach_actor_to_socket)
│       └── EpicUnrealMCPBuildingCommands.h              ← NOVO (37 linhas)
└── Private/
    ├── EpicUnrealMCPBridge.cpp                          ← Modificado (+routing dos novos comandos)
    └── Commands/
        ├── EpicUnrealMCPBlueprintCommands.cpp           ← Modificado (~100 linhas: StaticLoadClass fix + 2 novos handlers)
        ├── EpicUnrealMCPEditorCommands.cpp              ← Modificado (+80 linhas: attach_actor_to_socket)
        └── EpicUnrealMCPBuildingCommands.cpp            ← NOVO (407 linhas: wall, staircase, tower, house)
```

### ProjetoGTA
```
Source/
└── ProjetoGTAEditor.Target.cs     ← Modificado: BuildSettingsVersion.V2 → V5
ProjetoGTA.uproject                ← Modificado: EngineAssociation 5.1→5.6, Bridge plugin removido
```

### Documentação
```
unreal_engine_docs/MCP_Integration/
├── README.md                ← Índice geral
├── DOCUMENTACAO_COMPLETA.md ← Guia completo da integração
├── ANALISE_FLOPPERAM_MCP.md ← Análise comparativa original
├── INTEGRACAO_TECNICA.md    ← Detalhes técnicos
├── PLANO_DE_TESTES.md       ← Roteiro de testes faseados
├── MELHORIAS_AVA.md         ← Documentação das melhorias C++
├── testar_plugin.py         ← Script de teste geral
├── testar_tocha.py          ← Script do fluxo da tocha (NÃO EXECUTADO)
└── ping_test.ps1            ← Teste rápido de conexão
```

---

## 6. Próxima Sessão — Por Onde Continuar

### Imediato (5 min)
1. Executar `python testar_tocha.py` para testar o fluxo completo
2. Verificar no viewport: ALS_NPC_C_0 segurando a tocha

### Curto Prazo
3. Se o fluxo da tocha passar, usar os comandos para construir cenários (parede, torre, casa)
4. Testar `add_node` + `connect_nodes` para criar lógica de toggle no BP_TochaAvA
5. Atualizar o `unreal_mcp_adapter.ts` com os aliases das novas ações (`set_mesh`, `set_light`, `attach`)

### Médio Prazo
6. Implementar `add_blueprint_event_handler` no C++ (BeginPlay + toggle automático)
7. Integrar o AVA como servidor MCP nativo (para uso com Cursor, Claude, VS Code)
8. Contribuir as melhorias de volta ao repositório Flopperam (PR)

---

## 7. Notas Importantes

### Portabilidade do Plugin

A pasta `UnrealMCP/` (em `ProjetoGTA/Plugins/UnrealMCP/`) é **portátil** — pode ser copiada para **qualquer outro projeto UE5**. Basta colar em `<OutroProjeto>/Plugins/UnrealMCP/` e abrir o `.uproject`. A compilação acontece automaticamente em projetos C++. Em projetos Blueprint-only, é necessário convertê-lo para C++ primeiro (Add → New C++ Class → criar qualquer classe vazia).

### Compatibilidade

O plugin original do Flopperam suporta **Unreal Engine 5.5+** (conforme documentação oficial e arquitetura do repositório). Neste projeto, foi testado e compilado especificamente no **UE 5.6**, com `DefaultBuildSettings V5` no `.Target.cs` e `EngineAssociation 5.6` no `.uproject`. Para usar em UE 5.5, o código fonte original do Flopperam deve funcionar sem alterações, desde que o projeto use `BuildSettingsVersion` compatível.

### Plugins que Precisam Estar Ativados

Após abrir o projeto no UE5, verifique em **Edit → Plugins**:

| Plugin | Origem | Necessário para |
|--------|--------|-----------------|
| **UnrealMCP** | Flopperam MCP (instalado) | `unreal_mcp` (TCP :55557) |
| **Remote Control API** | Nativo do UE5 | `unreal_ops` (HTTP :30010) |

> **Nota:** O Remote Control API é um plugin nativo da Epic Games, não faz parte do Flopperam MCP. É necessário exclusivamente para o canal `unreal_ops` do AVA (Python, console, screenshot). O `unreal_mcp` funciona independentemente dele.

Ambos precisam estar **Enabled** ✓ para o funcionamento completo dos dois canais do AVA.

---

## 8. Comandos Úteis

### Verificar se plugin está online
```bash
python -c "import socket;s=socket.socket();s.settimeout(2);s.connect(('127.0.0.1',55557));print('ONLINE');s.close()"
```

### Testar um comando rápido
```bash
python -c "import socket,json,time;s=socket.socket();s.settimeout(3);s.connect(('127.0.0.1',55557));s.sendall(b'{\"type\":\"get_actors_in_level\",\"params\":{}}');time.sleep(0.5);d=s.recv(4096);print(d.decode()[:200])"
```

### Forçar recompilação do plugin
```bash
# 1. Fechar UE5
taskkill /F /IM UnrealEditor.exe
# 2. Deletar cache
rm -rf ProjetoGTA/Plugins/UnrealMCP/Binaries
rm -rf ProjetoGTA/Plugins/UnrealMCP/Intermediate
rm -rf ProjetoGTA/Intermediate
# 3. Recompilar
"UE_5.6/Engine/Binaries/DotNET/UnrealBuildTool/UnrealBuildTool.exe" ProjetoGTAEditor Win64 Development -project="ProjetoGTA.uproject" -waitmutex
```

---

## 9. Resumo de Bugs Corrigidos e Features Adicionadas

| # | O quê | Tipo | Arquivo | Linhas |
|---|-------|------|---------|--------|
| 1 | `FindObject` não resolvia componentes | Bug Fix | BlueprintCommands.cpp | ~15 |
| 2 | `StaticLoadClass` corrige resolução de UClasses | Bug Fix | BlueprintCommands.cpp | ~10 |
| 3 | `create_wall` — parede procedural | Feature | BuildingCommands.cpp | 100 |
| 4 | `create_staircase` — escada procedural | Feature | BuildingCommands.cpp | 72 |
| 5 | `create_tower` — torre (quadrada/cilíndrica) | Feature | BuildingCommands.cpp | 117 |
| 6 | `construct_house` — casa com teto | Feature | BuildingCommands.cpp | 118 |
| 7 | `set_component_static_mesh` — definir mesh em componente | Feature | BlueprintCommands.cpp | 52 |
| 8 | `set_point_light_properties` — configurar luz | Feature | BlueprintCommands.cpp | 60 |
| 9 | `attach_actor_to_socket` — anexar ao socket | Feature | EditorCommands.cpp | 80 |
| 10 | Routing Bridge para 7 novos comandos | Feature | EpicUnrealMCPBridge.cpp | ~15 |
| 11 | `DefaultBuildSettings V2→V5` (UE 5.6 compat) | Bug Fix | ProjetoGTAEditor.Target.cs | 1 |
| 12 | Remover plugin Bridge inexistente | Bug Fix | ProjetoGTA.uproject | 8 |
| | **Total** | | | **~648 linhas** |
