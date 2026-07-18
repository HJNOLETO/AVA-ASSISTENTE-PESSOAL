# Limites do Plugin UnrealMCP — ProjetoGTA

**Data:** 17/07/2026
**UE:** 5.6.1
**Plugin:** UnrealMCP 1.0.0 (86 comandos, V5 com fix EndPIE)

---

## Resumo de Capacidades

### O que FUNCIONA

| Categoria | Comandos |
|---|---|
| Leitura | `health`, `get_command_schema`, `get_blueprint_summary`, `analyze_blueprint_graph`, `get_blueprint_variable_details`, `get_blueprint_function_details`, `get_blueprint_graph_nodes` |
| Variaveis | `create_variable` ✓, `set_blueprint_variable_properties` ✓ |
| Compilacao | `compile_blueprint` ✓, `get_blueprint_diagnostics` ✓ |
| Nivel | `get_actors_in_level`, `find_actors_by_name`, `search_assets`, `list_assets_in_path`, `run_map_check`, `validate_project` |
| Criacao | `create_blueprint` (so com classes nativas C++: Actor, Character, Pawn, etc.) |
| PIE | `pie_start`, `pie_stop`, `pie_state` (com fix EndPIE) |
| Spawn | `spawn_actor`, `spawn_blueprint_actor`, `set_actor_transform` |
| Materiais | `set_mesh_material_color`, `apply_material_to_actor`, `get_available_materials` |

### O que NAO FUNCIONA

---

## Limite 1 (CRITICO): Comandos de manipulacao de grafo quebrados

**Comandos afetados:** `add_blueprint_node`, `add_event_node`, `add_input_action_node`, `add_key_event_node`, `connect_nodes`, `create_function`, `add_blueprint_interface`, `add_function_input`, `add_function_output`, `delete_node`, `delete_blueprint_node`, `set_node_property`, `call_function_on_object`, `add_get_node`

**Sintoma:** Todos retornam `"Blueprint not found: <nome>"` para QUALQUER Blueprint, mesmo quando `get_blueprint_summary` com o mesmo nome funciona.

**Impacto:** Impossivel criar logica de jogo (eventos, funcoes, conexoes) via MCP. Toda logica de Blueprint precisa ser feita manualmente no Editor.

**Possivel causa:** O sistema de busca de assets usado por esses comandos e diferente do usado por `get_blueprint_summary`/`create_variable`. Provavelmente usam `FindObject` sem carregar o pacote antes.

---

## Limite 2: `create_blueprint` nao aceita Blueprint como parent_class

**Sintoma:** `parent_class: '/Game/.../ALS_NPC.ALS_NPC'` ignora o caminho e cria com `parent_class: Actor`.

**Aceita apenas:** Classes nativas C++ (`Actor`, `Character`, `Pawn`, `Object`, etc.).

**Impacto:** Nao e possivel criar Blueprints filhos de outros Blueprints via MCP.

---

## Limite 3: Sem comando `delete_blueprint` / `delete_asset`

**Comandos de delecao existentes:** `delete_actor` (instancia no nivel), `delete_node` (grafo), `remove_component_from_blueprint`.

**O que falta:** Delecao de assets do Content Browser.

---

## Limite 4: `add_component_to_blueprint` nao encontra componentes Blueprint

**Sintoma:** So aceita classes nativas C++ de componente (`StaticMeshComponent`, `BoxComponent`, etc.). Componentes criados como Blueprint (`AC_PlayerStatus`) retornam `Unknown component type`.

---

## Limite 5: Inconsistencia nos parametros entre comandos

| Comando | Usa |
|---|---|
| `get_blueprint_summary` | `blueprint_name` |
| `get_blueprint_variable_details` | `blueprint_path` |
| `get_blueprint_function_details` | `blueprint_path` |
| `add_blueprint_node` | `blueprint_name` (exige, mas nao funciona) |

Nao ha padronizacao — alguns usam `blueprint_name`, outros `blueprint_path`.

---

## Limite 6: Conexao TCP instavel (WinError 10053)

**Sintoma:** Durante queries pesadas ou multiplas requisicoes rapidas, a conexao TCP cai com `WSAECONNABORTED`.

**Workaround:** Adicionar `time.sleep(2)` entre comandos. Nao resolve completamente.

---

## Limite 7: Nomes de campo inconsistentes no `get_blueprint_variable_details`

**Sintoma:** Os campos sao `name` e `type` (nao `variable_name` e `variable_type` como em outros comandos). Documentacao ausente.

---

## Acao recomendada para o plugin (prioridade)

1. **Corrigir `add_blueprint_node` e todos os comandos de grafo** — fazer o lookup de asset igual ao `get_blueprint_summary`/`create_variable` que funciona
2. **Adicionar `delete_blueprint`** — `UEditorAssetLibrary::DeleteAsset()`
3. **Suportar Blueprint como `parent_class` no `create_blueprint`** — carregar o Blueprint asset e usar sua GeneratedClass
4. **Suportar componentes Blueprint no `add_component_to_blueprint`** — buscar no AssetRegistry
5. **Padronizar parametros** — `blueprint_name` vs `blueprint_path`
6. **Documentar nomes de campo** de cada resposta JSON

---

