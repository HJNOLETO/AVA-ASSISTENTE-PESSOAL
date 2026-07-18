# Análise Técnica — Plugin UnrealMCP (flopperam-mcp)

**Data da análise:** 18/07/2026
**Última atualização:** 18/07/2026
**Escopo:** `flopperam-mcp/UnrealMCP` (C++), `flopperam-mcp/Python` (servidor MCP), `flopperam-mcp/Guides`
**Método:** leitura estática do código, cruzamento de comandos entre camadas (Bridge → Handlers → Python → Docs), comparação de duas cópias do plugin.

---

## Estado Atual — 87 Comandos

| Camada | Cobertura | Status |
|--------|-----------|--------|
| C++ handlers (implementação) | 87/87 | ✅ |
| Bridge routing (`ExecuteCommand`) | 87/87 | ✅ |
| Bridge schema (`AddCmd` + `commands_count`) | 87/87 | ✅ |
| Python `@mcp.tool()` wrappers | 59/87 (68%) | ⚠️ |
| Python genérico (`send_command`) | 87/87 | ✅ fallback |
| `tools-reference.md` | 86/86 | ✅ |
| Sincronização GTA ↔ AVA | Código idêntico (MD5) | ✅ |

---

## Achados — Status das Correções

| # | Achado | Gravidade | Status |
|---|--------|-----------|--------|
| 1 | Gap Python↔C++ (53 comandos sem wrapper) | 🔴 Crítico | ⚠️ Parcial |
| 2 | Construção procedural duplicada (Python vs C++) | 🔴 Crítico | ✅ Resolvido |
| 3 | `LoadBlueprint` reimplementado 5 vezes | 🟠 Alto | ✅ Resolvido |
| 4 | Código morto em `NodeManager.cpp` | 🟡 Médio | ✅ Resolvido |
| 5 | `Build.cs` divergente entre cópias | 🟠 Alto | ✅ Resolvido |
| 6 | Documentação desatualizada | 🟡 Médio | ✅ Resolvido |
| 7 | `create_blueprint` Python sem `save_path` | 🟠 Alto | ✅ Resolvido |
| 8 | `commands_count` off-by-one (86 vs 87) | 🟡 Médio | ✅ Resolvido |

---

## Detalhe das Correções Concluídas

### ✅ #2 — Construção procedural duplicada
- `create_wall` e `create_staircase`: wrappers Python reescritos para delegar ao C++ nativo (`send_command("create_wall", ...)`) — 1 chamada TCP em vez de N×M.
- `create_tower` e `construct_house`: mantidos em Python (versão Python é **mais avançada** que a C++ nativa — estilos múltiplos, elementos decorativos, house_construction.py). Nota documentada no código.

### ✅ #3 — LoadBlueprint unificado
- 4 arquivos migrados para `FEpicUnrealMCPCommonUtils::FindBlueprint()`:
  - `NodeDeleter.cpp/h`
  - `NodePropertyManager.cpp/h`
  - `FunctionManager.cpp/h` (antes usava `TObjectIterator` por substring — frágil)
  - `FunctionIO.cpp/h` (antes não tinha fallback de prefixo — quebrava com nome curto)
- Métodos `LoadBlueprint` privados removidos dos `.h` e `.cpp` (evita divergência futura).

### ✅ #4 — Código morto removido
- `FBlueprintNodeManager::CreateVariableGetNode` e `CreateVariableSetNode` removidos de `NodeManager.cpp/h`.
- Código real já migrado para `FDataNodeCreator` em `Nodes/DataNodes.cpp`.

### ✅ #5 — Build.cs sincronizado
- `FlopperamUnrealMCP/Plugins/UnrealMCP/` agora inclui `EnhancedInput`, `UMG`, `UMGEditor`.
- 3 cópias idênticas (GTA, UnrealMCP, FlopperamUnrealMCP).

### ✅ #6 — Documentação autogerada
- `tools-reference.md` gerado a partir de `get_command_schema` (86 comandos, 5 handlers).
- Regenerar com: `python -c "... send_command('get_command_schema') ..."`.

### ✅ #7 — create_blueprint com save_path
- Python wrapper do `create_blueprint` agora expõe `save_path` opcional.
- Antes todo blueprint caía em `/Game/Blueprints/`; agora cliente MCP escolhe o path.

### ✅ #8 — commands_count corrigido
- `health`/`get_server_info` retornava `commands_count: 86` (hardcoded).
- Corrigido para `87` (número real de `AddCmd` no schema).

---

## ⚠️ #1 — Gap Python↔C++ (Pendente)

**Estado atual:** 59 wrappers específicos + 1 dispatcher genérico (`send_command`).

### Comandos COM wrapper específico (59)

**Bridge (3):** ping, health, get_server_info *(usados internamente pelo servidor MCP)*

**Editor (14):** get_actors_in_level, find_actors_by_name, spawn_actor, delete_actor, set_actor_transform, spawn_blueprint_actor, attach_actor_to_socket, search_assets, get_asset_details, list_assets_in_path, get_project_info, validate_project, pie_start, pie_stop, pie_state

**Blueprint (19):** create_blueprint, add_component_to_blueprint, compile_blueprint, set_static_mesh_properties, set_component_static_mesh, set_mesh_material_color, get_available_materials, apply_material_to_actor, apply_material_to_blueprint, get_actor_material_info, create_material_instance, set_material_instance_parameter, apply_material_to_component, get_blueprint_material_info, read_blueprint_content, analyze_blueprint_graph, get_blueprint_summary, get_blueprint_diagnostics, get_blueprint_components, create_input_action_asset, map_input_action, set_blueprint_property, set_blueprint_default_value, create_widget_blueprint, set_component_collision, add_socket_to_component, set_component_properties

**Graph (17):** add_blueprint_node, connect_nodes, create_variable, set_blueprint_variable_properties, add_event_node, delete_node, set_node_property, create_function, add_function_input, add_function_output, delete_function, rename_function, get_blueprint_graph_nodes, add_blueprint_interface, remove_blueprint_interface

**Building (4):** create_wall, create_tower, create_staircase, construct_house

**Schema (2):** get_command_schema, list_commands

### Comandos SEM wrapper específico (28) — acessíveis via `send_command()`

| Categoria | Comandos |
|-----------|----------|
| Bridge | create_test_report |
| Editor | add_widget_to_viewport, compile_project_target, run_map_check |
| Blueprint | remove_component_from_blueprint, attach_component_to_blueprint, set_physics_properties, set_point_light_properties, get_blueprint_variable_details, get_blueprint_function_details, get_component_materials, get_static_mesh_material_slots, delete_blueprint |
| Graph | add_input_action_node, add_key_event_node, add_get_node, call_function_on_object, disconnect_pins, delete_blueprint_node, add_enhanced_input_action_node, add_is_valid_guard |

**Como usar o `send_command` genérico:**

```python
# Exemplo: chamar qualquer comando sem wrapper específico
send_command(command="delete_blueprint", params={"blueprint_path": "/Game/Blueprints/BP_Old"})
send_command(command="add_input_action_node", params={"blueprint_name": "BP_Player", "action_name": "IA_Jump"})
send_command(command="disconnect_pins", params={"blueprint_name": "BP_Weapon", "node_id": "abc123", "dry_run": True})
```

---

## Limitações Estruturais (Backlog)

| # | Limitação | Impacto |
|---|-----------|---------|
| 1 | Sem conexões TCP simultâneas | 1 cliente por vez |
| 2 | `attach_component_to_blueprint` falha silenciosa | Sem validação prévia |
| 3 | `create_material_instance` race condition UE 5.6 | Fallback `NewObject<>` não implementado |
| 4 | `add_input_action_node` não cria asset `IA_*` | Precisa criar separado |
| 5 | Framing `\n` quebra com JSON não escapado | Validar/escapar no servidor |
| 6 | Timeout por substring frágil | Tabela explícita comando→timeout |
| 7 | Erro sem `error_code` em alguns handlers | Padronizar contrato |
| 8 | Logs inconsistentes nos managers | Garantir `UE_LOG(LogTemp, Error, ...)` |
| 9 | Sem testes automatizados | Só roteiros manuais via `nc` |

---

## Próximos Passos (prioridade)

1. **Recompilar plugin no editor GTA** — DLL atual não tem `delete_blueprint` nem `commands_count=87` (alterações no fonte, aguardando build)
2. **Completar wrappers Python** — 28 comandos restantes (opcional: `send_command` já cobre)
3. **Regenerar `tools-reference.md`** após build (incluirá `delete_blueprint`)
4. **Backlog** — priorizar limitações estruturais que afetam o workflow atual
