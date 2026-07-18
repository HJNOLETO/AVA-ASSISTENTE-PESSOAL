# Integração Flopperam MCP → AVA CLI

## Resumo

A integração foi concluída usando a estratégia **"utilizar o que já está pronto"** — o plugin C++ UnrealMCP (MIT License) agora complementa o `unreal_ops` existente, adicionando capacidades que ele não tinha.

---

## Arquitetura Final

```
AVA CLI (TypeScript)
├── unreal_ops       ← HTTP REST 30010 → Remote Control API (Python arbitrario, console, screenshot)
└── unreal_mcp       ← TCP JSON 55557  → UnrealMCP Plugin (Blueprint, spawn, materiais, fisica)
```

---

## O que foi feito

### 1. Plugin UnrealMCP copiado
**Destino:** `ProjetoGTA/Plugins/UnrealMCP/`
- Código C++ (Editor-only, compatível com UE 5.5+)
- Servidor TCP na porta 55557
- Comandos: Blueprint creation, Blueprint graph (nós/pins/variáveis/funções), Actor management, Physics, Materials, Construção procedural

### 2. Adaptador TCP criado
**Arquivo:** `server/tools/unreal_mcp_adapter.ts` (~280 linhas)
- Conexão TCP para 127.0.0.1:55557
- 21 ações (check, actors, find_actor, delete_actor, set_transform, create_bp, add_component, compile_bp, spawn_actor, set_physics, list_materials, apply_material, set_color, add_node, connect_nodes, create_var, construct_house, create_tower, create_wall, create_staircase)
- Timeout configurável por env var (`UE_MCP_TIMEOUT_MS`, default 30s)

### 3. Tool registrada
**Arquivos modificados:**
- `server/tools/executor.ts` — dispatch `unreal_mcp` → `unrealMcp()`
- `server/agents.ts` — tool definition com 21 ações, filtro de keywords, adicionada ao `legacyPredefined`

---

## Como ativar

### Passo 1: Abrir o ProjetoGTA no UE5
Abra `ProjetoGTA.uproject` — o editor vai detectar o novo plugin `UnrealMCP/` e compilá-lo automaticamente.
Confirme que o plugin aparece em **Edit → Plugins → "UnrealMCP"**.

### Passo 2: Verificar a conexão
```
unreal_mcp({ action: "check" })
```
Deve retornar: `UnrealMCP ONLINE - X actors no level atual.`

---

## Comparação: unreal_ops vs unreal_mcp

| Ação | `unreal_ops` (HTTP 30010) | `unreal_mcp` (TCP 55557) |
|------|:---:|:---:|
| **Executar Python arbitrário** | ✅ `python` | ❌ |
| **Comandos de console** | ✅ `console` | ❌ |
| **Screenshot viewport** | ✅ `screenshot` | ❌ |
| **Listar assets Content Browser** | ✅ `assets` | ❌ |
| **Verificar conexão** | ✅ `check` | ✅ `check` |
| **Listar actors** | ✅ `actors` | ✅ `actors` |
| **Buscar actor por nome** | ❌ | ✅ `find_actor` |
| **Deletar actor** | ❌ | ✅ `delete_actor` |
| **Mover/rotacionar/escalar actor** | ❌ | ✅ `set_transform` |
| **Criar Blueprint** | ❌ | ✅ `create_bp` |
| **Adicionar componente ao BP** | ❌ | ✅ `add_component` |
| **Compilar Blueprint** | ❌ | ✅ `compile_bp` |
| **Spawnar Blueprint no level** | ❌ | ✅ `spawn_actor` |
| **Configurar física** | ❌ | ✅ `set_physics` |
| **Listar materiais** | ❌ | ✅ `list_materials` |
| **Aplicar material** | ❌ | ✅ `apply_material` |
| **Definir cor** | ❌ | ✅ `set_color` |
| **Adicionar nó ao graph** | ❌ | ✅ `add_node` |
| **Conectar pins** | ❌ | ✅ `connect_nodes` |
| **Criar variável** | ❌ | ✅ `create_var` |
| **Construir casa procedural** | ❌ | ✅ `construct_house` |
| **Construir torre** | ❌ | ✅ `create_tower` |
| **Construir parede** | ❌ | ✅ `create_wall` |
| **Construir escada** | ❌ | ✅ `create_staircase` |

---

## Variáveis de Ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `UE_MCP_HOST` | `127.0.0.1` | Host do UnrealMCP |
| `UE_MCP_PORT` | `55557` | Porta TCP do UnrealMCP |
| `UE_MCP_TIMEOUT_MS` | `30000` | Timeout normal (30s) |
| `UE_MCP_LARGE_TIMEOUT_MS` | `300000` | Timeout para operações grandes (5min) |

---

## Exemplos de Uso

```typescript
// Verificar conexão
unreal_mcp({ action: "check" })

// Listar todos os actors
unreal_mcp({ action: "actors" })

// Criar um Blueprint
unreal_mcp({ action: "create_bp", name: "BP_Torch", parent_class: "Actor" })

// Adicionar StaticMeshComponent
unreal_mcp({ action: "add_component", blueprint: "BP_Torch", component_type: "StaticMeshComponent", component_name: "TorchMesh" })

// Spawnar o Blueprint
unreal_mcp({ action: "spawn_actor", blueprint: "BP_Torch", name: "Torch1", location: [0, 0, 100] })

// Configurar física
unreal_mcp({ action: "set_physics", blueprint: "BP_Torch", component: "TorchMesh", mass: 2 })

// Aplicar material
unreal_mcp({ action: "apply_material", actor: "Torch1", material: "/Game/Materials/M_Prop_Torch1" })

// Criar variável no Blueprint
unreal_mcp({ action: "create_var", blueprint: "BP_Torch", name: "bIsLit", type: "Boolean" })

// Adicionar nó de Branch
unreal_mcp({ action: "add_node", blueprint: "BP_Torch", node_type: "Branch", pos_x: 300, pos_y: 0 })

// Construir uma casa procedural
unreal_mcp({ action: "construct_house", width: 1000, depth: 800, height: 500, location: [0, 0, 0], style: "modern" })

// Construir uma torre
unreal_mcp({ action: "create_tower", height: 15, base_size: 6, style: "cylindrical" })

// Construir uma parede
unreal_mcp({ action: "create_wall", length: 10, height: 3, orientation: "x" })
```
