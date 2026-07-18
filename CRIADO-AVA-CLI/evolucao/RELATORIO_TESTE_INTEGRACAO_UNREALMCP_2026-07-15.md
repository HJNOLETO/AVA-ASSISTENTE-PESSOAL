# Relatório de teste integrado — UnrealMCP

**Data original:** 15/07/2026
**Atualizado:** 18/07/2026 (pós-teste em projeto real ProjetoGTA)
**Editor:** Unreal Engine 5.6.1
**Servidor:** `127.0.0.1:55557`
**Plugin:** UnrealMCP 1.0.0 (86 comandos, V5 com fix EndPIE)

---

## Resultado Geral

O plugin funciona para operações de **leitura, criação simples e compilação**, mas **falha em toda manipulação de lógica de jogo** (grafos, nós, conexões, funções). O que parecia "quase aprovado" no teste de fumaça revelou-se **não utilizável para desenvolvimento real** quando testado no ProjetoGTA em 17/07/2026.

---

## O que FUNCIONA (confirmado em ambos os testes)

| Categoria | Comandos | Status |
|---|---|---|
| Leitura/Diagnóstico | `health`, `get_command_schema`, `get_blueprint_summary`, `get_blueprint_diagnostics`, `analyze_blueprint_graph`, `get_blueprint_variable_details`, `get_blueprint_function_details`, `get_blueprint_graph_nodes` | OK |
| Criação básica | `create_blueprint` (apenas com parent_class nativo C++), `create_variable`, `set_blueprint_variable_properties` | OK |
| Compilação | `compile_blueprint` | OK |
| Nível | `get_actors_in_level`, `find_actors_by_name`, `search_assets`, `list_assets_in_path`, `run_map_check`, `validate_project` | OK |
| PIE | `pie_start`, `pie_stop`, `pie_state` (com instabilidade TCP) | Parcial |
| Spawn | `spawn_actor`, `spawn_blueprint_actor`, `set_actor_transform` | OK |
| Materiais | `set_mesh_material_color`, `apply_material_to_actor`, `get_available_materials` | OK |

---

## O que NÃO FUNCIONA (descoberto no ProjetoGTA)

### LIMITE 1 (CRÍTICO): Comandos de manipulação de grafo quebrados

**Comandos afetados:** `add_blueprint_node`, `add_event_node`, `add_input_action_node`, `add_key_event_node`, `connect_nodes`, `create_function`, `add_blueprint_interface`, `add_function_input`, `add_function_output`, `delete_node`, `delete_blueprint_node`, `set_node_property`, `call_function_on_object`, `add_get_node` — **14 comandos quebrados.**

**Sintoma:** Todos retornam `"Blueprint not found: <nome>"` para QUALQUER Blueprint, mesmo quando `get_blueprint_summary` com o mesmo nome localiza o asset corretamente.

**Causa provável:** O sistema de lookup de assets usado pelos comandos de grafo (`FindObject` sem carregar pacote) é diferente do usado por `get_blueprint_summary`/`create_variable` (que carrega via `UEditorAssetLibrary::LoadAsset` ou AssetRegistry).

**Impacto:** Impossível criar lógica de jogo via MCP. Toda lógica de Blueprint precisa ser feita manualmente no Editor. Isso inviabiliza o uso do plugin para desenvolvimento assistido por IA.

### LIMITE 2: `create_blueprint` não aceita Blueprint como parent_class

**Sintoma:** Passar `parent_class: '/Game/Blueprints/ALS_NPC.ALS_NPC'` é ignorado silenciosamente; o Blueprint é criado com `parent_class: Actor`.

**Aceita apenas:** Classes nativas C++ (`Actor`, `Character`, `Pawn`, `Object`, etc.).

**Impacto:** Não é possível criar Blueprints filhos de outros Blueprints via MCP.

### LIMITE 3: Sem comando de deleção de assets

**Existentes:** `delete_actor` (instância no nível), `delete_node` (grafo, quebrado), `remove_component_from_blueprint`.

**Falta:** `delete_blueprint` / `delete_asset` para remover assets do Content Browser.

### LIMITE 4: `add_component_to_blueprint` não encontra componentes Blueprint

**Sintoma:** Só aceita classes nativas C++ de componente (`StaticMeshComponent`, `BoxComponent`, etc.). Componentes criados como Blueprint (`AC_PlayerStatus`) retornam `Unknown component type`.

### LIMITE 5: Parâmetros inconsistentes entre comandos

| Comando | Nome do parâmetro |
|---|---|
| `get_blueprint_summary` | `blueprint_name` |
| `get_blueprint_variable_details` | `blueprint_path` |
| `get_blueprint_function_details` | `blueprint_path` |
| `add_blueprint_node` | `blueprint_name` |

### LIMITE 6: Conexão TCP instável

**Sintoma:** Durante PIE start/stop ou múltiplas requisições rápidas, o servidor fecha a conexão com `WinError 10053` (WSAECONNABORTED).

**Workaround:** `time.sleep(2)` entre comandos. Reduz mas não elimina o problema.

### LIMITE 7: Nomes de campo inconsistentes nas respostas

`get_blueprint_variable_details` retorna `name` e `type`, enquanto outros comandos usam `variable_name` e `variable_type`.

---

## Artefatos e side effects

- `BP_MCP_IntegrationTest` criado em `/Game/Blueprints/`
- `BP_MCP_FinalApproval` criado em `/Game/MCPTests/`
- `BP_AVA_SmokeTest` pré-existente em `/Game/Blueprints/`
- `BP_SourceTest` criado em `/Game/MCPTests/`

---

## Critério para aprovação final (ATUALIZADO)

Após correção dos 7 limites, repetir:

1. `create_blueprint` com `save_path` customizado + `parent_class` de outro Blueprint → confirmar ambos os campos
2. `add_blueprint_node` + `connect_nodes` em Blueprint existente → executar sem "Blueprint not found"
3. `add_component_to_blueprint` com componente Blueprint → executar sem "Unknown component type"
4. PIE: `pie_start` → polling `pie_state` → UMA chamada `pie_stop` → `stopped` sem queda de conexão
5. `delete_blueprint` → asset removido do Content Browser
6. Testar 3 comandos consecutivos sem sleep → sem WinError 10053
