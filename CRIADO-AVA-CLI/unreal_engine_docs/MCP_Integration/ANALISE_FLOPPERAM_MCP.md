# Análise: Flopperam MCP vs AVA CLI `unreal_ops`

## Resumo

O **Flopperam Unreal Engine MCP** é um servidor MCP (Model Context Protocol) para Unreal Engine com **1.1k estrelas**, **195 forks**, recentemente adquirido pela Aura. Ele permite controlar o Unreal Editor via linguagem natural a partir de qualquer cliente MCP (Cursor, Claude, Windsurf, VS Code, Cline).

O repositório contém **duas soluções distintas**:
1. **Hosted Flop MCP** (comercial) — 50+ ferramentas hospedadas, API key, plugin FlopAI
2. **Local MCP** (open-source) — ~36 ferramentas locais, plugin UnrealMCP C++

---

## Arquitetura Comparada

### AVA CLI `unreal_ops` (atual)

```
┌─────────────┐  HTTP REST (JSON)  ┌──────────────────────┐
│  Ava CLI     │ ──────────────────→│  Remote Control API   │
│  (TypeScript)│  porta 30010       │  (UE5 Built-in)       │
└─────────────┘                    │  PythonScriptPlugin   │
                                   └──────────────────────┘
                                            │
                                            ▼
                                   ┌──────────────────────┐
                                   │  Python no Editor     │
                                   │  (unreal.* API)       │
                                   └──────────────────────┘
```

- **Sem plugin** necessário (só Remote Control + Python Script plugins do UE5)
- **1 tool monolítica** (`unreal_ops`) com 8 ações
- Transporte: HTTP REST (JSON)
- Python executado via `ExecutePythonScript` — output não volta na resposta HTTP
- Porta: **30010**

---

### Flopperam Local MCP (open-source)

```
┌─────────────┐  MCP stdio       ┌──────────────────┐  TCP Socket  ┌──────────────────┐
│  IDE/AI     │ ────────────────→│ Python Server     │ ────────────→│ UnrealMCP Plugin │
│  (Cursor/   │                  │ (FastMCP)         │  porta 55557 │ (C++ dentro UE)  │
│   Claude)   │                  │ unreal_mcp_server │              │                  │
└─────────────┘                  │ _advanced.py      │              └──────────────────┘
                                 └──────────────────┘                      │
                                                                          ▼
                                                               ┌──────────────────┐
                                                               │  Unreal Engine    │
                                                               │  Native API       │
                                                               └──────────────────┘
```

- **Plugin C++ obrigatório** (`UnrealMCP` — 59% do código é C++)
- **~36 ferramentas** em 5 categorias: Blueprint, World Building, Epic Structures, Physics/Materials, Actor Management
- Transporte: MCP stdio (IDE ↔ Python) + TCP JSON (Python ↔ UE5 Plugin)
- Porta TCP: **55557**
- Python 3.12+ + `uv` + `fastmcp` como dependências
- Blueprint graph: criar BPs, adicionar nós, conectar pins, variáveis, funções

---

### Flopperam Hosted MCP (comercial)

```
┌─────────────┐  MCP HTTP       ┌────────────────┐  WebSocket  ┌──────────────────┐
│  IDE/AI     │ ───────────────→│ Flop MCP Server │ ───────────→│ FlopAI Plugin    │
│             │  + API Key      │ (agent.flopperam│            │ (C++/Python UE)  │
└─────────────┘                 │  .com/mcp)      │            └──────────────────┘
                                └────────────────┘
                                       │
                                       ▼
                                ┌────────────────┐
                                │ 50+ Tools      │
                                │ 9 Domínios     │
                                └────────────────┘
```

- Plugin dedicado (`FlopAI` — via flopperam.com/unreal-agent)
- Requer API key (gratuita ou paga)
- 50+ ferramentas em 9 domínios:
  - Blueprint Authoring (criar, editar, compilar graphs completos)
  - Scene & Level (query, spawn, delete, inspect)
  - Materials & Shading
  - VFX (Niagara, Chaos)
  - Animation (Sequences, Montages, BlendSpaces, IK Retarget)
  - UMG/Widgets
  - AI & Abilities (Behavior Trees, GAS)
  - Landscape & Foliage
  - Cinematics & Audio (Sequencer, MetaSound)
  - Procedural (PCG)
  - Editor & Diagnostics
  - Runtime Verification (PIE testing)

---

## Ferramentas do Local MCP (Open-Source)

| Categoria | Ferramentas |
|-----------|------------|
| **Blueprint** | `add_node`, `connect_nodes`, `delete_node`, `set_node_property`, `create_variable`, `set_blueprint_variable_properties`, `create_function`, `add_function_input/output`, `delete_function`, `rename_function`, `create_blueprint`, `compile_blueprint`, `add_component_to_blueprint`, `set_static_mesh_properties` |
| **Blueprint Analysis** | `read_blueprint_content`, `analyze_blueprint_graph`, `get_blueprint_variable_details`, `get_blueprint_function_details` |
| **Actor Management** | `get_actors_in_level`, `find_actors_by_name`, `delete_actor`, `set_actor_transform`, `get_actor_material_info` |
| **World Building** | `create_town`, `construct_house`, `construct_mansion`, `create_tower`, `create_arch`, `create_staircase` |
| **Epic Structures** | `create_castle_fortress`, `create_suspension_bridge`, `create_aqueduct` |
| **Level Design** | `create_maze`, `create_pyramid`, `create_wall` |
| **Physics/Materials** | `spawn_physics_blueprint_actor`, `set_physics_properties`, `get_available_materials`, `apply_material_to_actor`, `apply_material_to_blueprint`, `set_mesh_material_color` |

---

## Comparação Direta: Capacidades

| Capacidade | AVA `unreal_ops` | Flopperam Local | Flopperam Hosted |
|-----------|:---:|:---:|:---:|
| Verificar conexão | ✅ `check` | ❌ | ✅ |
| Executar Python arbitrário | ✅ `python` | ❌ (TCP commands) | ✅ `python_execution` |
| Comandos de console | ✅ `console` | ❌ | ✅ |
| Listar actors | ✅ `actors` | ✅ `get_actors_in_level` | ✅ `scene_query` |
| Inspecionar actor | ✅ `inspect` | ❌ | ✅ `actor_inspect` |
| Screenshot | ✅ `screenshot` | ❌ | ✅ `window_capture` |
| Listar assets | ✅ `assets` | ❌ | ✅ `search_assets` |
| Compilar Blueprints | ✅ `compile` | ✅ `compile_blueprint` | ✅ |
| Criar Blueprint | ❌ | ✅ `create_blueprint` | ✅ `bp_create` |
| Adicionar nó em graph | ❌ | ✅ `add_node` (23+ tipos) | ✅ `bp_nodes` (40+ tipos) |
| Conectar pins | ❌ | ✅ `connect_nodes` | ✅ `bp_wire` |
| Criar variáveis BP | ❌ | ✅ `create_variable` | ✅ `bp_variable` |
| Criar funções BP | ❌ | ✅ `create_function` | ✅ |
| Inspecionar graph BP | ❌ | ✅ `read_blueprint_content` | ✅ `bp_inspect` |
| Spawnar atores | ❌ (via Python indireto) | ✅ `spawn_physics_...` | ✅ `scene_compose` |
| Construção procedural | ❌ | ✅ (town, castle, mansion) | ✅ |
| Materials | ❌ | ✅ (apply, set color) | ✅ `material_edit` |
| Physics | ❌ | ✅ `set_physics_properties` | ✅ |
| Niagara VFX | ❌ | ❌ | ✅ |
| Animation | ❌ | ❌ | ✅ |
| UMG/Widgets | ❌ | ❌ | ✅ |
| AI/Behavior Trees | ❌ | ❌ | ✅ |
| Landscape | ❌ | ❌ | ✅ |

---

## Como o AVA Poderia Implementar Este Serviço

### Opção A: Instalar o UnrealMCP Plugin + Envolver como Tool AVA (Recomendado)

1. **Instalar o plugin UnrealMCP** no ProjetoGTA:
   ```bash
   cp -r UnrealMCP/ "C:/Users/hijon/Documents/UnrealEngine/PROJETO-GTA-29-10-2025/ProjetoGTA/ProjetoGTA/Plugins/"
   ```

2. **Criar um adaptador TCP → Python** em `server/tools/` que conversa com o UnrealMCP:
   ```typescript
   // server/tools/unreal_mcp_adapter.ts
   import * as net from "net";
   
   const UNREAL_MCP_HOST = "127.0.0.1";
   const UNREAL_MCP_PORT = 55557;
   
   function sendMcpCommand(command: string, params: object): Promise<any> {
     return new Promise((resolve, reject) => {
       const client = new net.Socket();
       client.connect(UNREAL_MCP_PORT, UNREAL_MCP_HOST, () => {
         client.write(JSON.stringify({ type: command, params }));
       });
       // ... receive response
     });
   }
   ```

3. **Registrar como tools separadas** (ao invés de monolítico):
   - `bp_create`, `bp_add_node`, `bp_compile`
   - `spawn_actor`, `delete_actor`, `list_actors`
   - `get_materials`, `apply_material`

4. **Manter `unreal_ops` como fallback** (Remote Control API)

### Opção B: Transformar o AVA CLI em Servidor MCP Nativo

Usar **FastMCP** (Python) para expor o `unreal_ops` como tools MCP:

```python
# mcp_server.py
from mcp.server.fastmcp import FastMCP
import httpx

mcp = FastMCP("ava-unreal")

@mcp.tool()
def unreal_check() -> dict:
    """Verifica se o UE5 está online via Remote Control"""
    r = httpx.get("http://127.0.0.1:30010/remote/info")
    return r.json()

@mcp.tool()
def unreal_python(script: str) -> dict:
    """Executa Python no Unreal Editor"""
    r = httpx.put("http://127.0.0.1:30010/remote/object/call", json={
        "objectPath": "/Script/PythonScriptPlugin.Default__PythonScriptLibrary",
        "functionName": "ExecutePythonScript",
        "parameters": {"PythonScript": script}
    })
    return r.json()
# ... mais ferramentas
```

Configurar no Cursor `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "ava-unreal": {
      "command": "python",
      "args": ["mcp_server.py"]
    }
  }
}
```

### Opção C: Abordagem Híbrida (Máximo Poder)

Combinar as duas abordagens:
- **Remote Control API** (HTTP 30010) para Python arbitrário, screenshot, console
- **UnrealMCP Plugin** (TCP 55557) para Blueprint authoring, material editing
- **Ambos expostos via MCP** para integração com qualquer IDE

```
┌─────────────┐     ┌──────────────────────────────┐     ┌─────────────────────┐
│  IDE/AI     │ ←──→│  AVA MCP Server (Python)      │ ←──→│  Unreal Engine 5    │
│  (Cursor/   │ MCP │                               │     │                     │
│   Claude)   │     │  ├─ HTTP Client → Remote Ctrl  │ ──→│  Port 30010 (HTTP)  │
└─────────────┘     │  └─ TCP Client → UnrealMCP     │ ──→│  Port 55557 (TCP)   │
                    └──────────────────────────────┘     └─────────────────────┘
```

---

## Resumo: Vantagens e Desvantagens

### Flopperam MCP vs AVA `unreal_ops`

| Aspecto | Vantagem |
|---------|----------|
| **Facilidade de setup** | AVA (só ativar plugins nativos, sem compilar C++) |
| **Execução Python** | AVA (via Remote Control, flexible) |
| **Blueprint Authoring** | Flopperam (C++ plugin permite modificar graphs) |
| **Performance** | Flopperam (TCP é mais rápido que HTTP REST) |
| **Retorno de dados** | Flopperam (TCP bidirecional, respostas completas) |
| **Integração IDE** | Flopperam (MCP protocol nativo) |
| **Independência** | AVA (sem dependências externas, sem API key) |
| **Expansibilidade** | AVA (Python arbitrário = ilimitado) |

### Recomendação

Para o **uso atual do ProjetoGTA**, o AVA `unreal_ops` já cobre bem as necessidades.
Para tarefas que envolvem **criação/programação de Blueprints visuais**, o Flopperam Local MCP seria um complemento útil.

A **Opção A** (instalar UnrealMCP plugin + adaptador TypeScript) é a mais prática para manter compatibilidade com o código existente.

A **Opção C** (MCP híbrido) é a mais poderosa, permitindo acesso tanto via AVA CLI quanto via qualquer IDE MCP.
