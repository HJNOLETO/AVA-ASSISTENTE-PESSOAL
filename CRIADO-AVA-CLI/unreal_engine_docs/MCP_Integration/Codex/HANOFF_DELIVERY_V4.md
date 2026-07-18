# Relatório de Entrega — Evolução UnrealMCP (V4)

**Data:** 13/Jun/2026
**Responsável:** DeepSeek V4-Pro (opencode)

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `Private/MCPServerRunnable.cpp` | Reescrita do loop TCP: framing por newline, limpeza de socket entre conexões, IDs de requisição |
| `Public/Commands/EpicUnrealMCPBlueprintCommands.h` | +9 declaracoes de handlers novos |
| `Private/Commands/EpicUnrealMCPBlueprintCommands.cpp` | +9 implementacoes de handlers + roteamento + novos includes |
| `Public/Commands/EpicUnrealMCPEditorCommands.h` | +3 declaracoes de asset discovery |
| `Private/Commands/EpicUnrealMCPEditorCommands.cpp` | +3 implementacoes de asset discovery + roteamento |
| `Public/Commands/EpicUnrealMCPBlueprintGraphCommands.h` | +3 declaracoes de input/graph nodes |
| `Private/Commands/EpicUnrealMCPBlueprintGraphCommands.cpp` | +3 implementacoes de input/graph + roteamento + novos includes |
| `Private/EpicUnrealMCPBridge.cpp` | +3 blocos de roteamento expandidos + `get_command_schema` |

---

## Novos comandos implementados (14 novos, 59 total)

### Prioridade 1 — Componentes em Blueprint

#### `remove_component_from_blueprint`
```json
{
  "command": "remove_component_from_blueprint",
  "params": {
    "blueprint_name": "BP_WeaponBase",
    "component_name": "SpringArm",
    "force": false
  }
}
```
- Localiza `USCS_Node` por `GetVariableName()`
- Bloqueia remoção do root sem `"force": true`
- Remove do `SimpleConstructionScript`, compila
- Retorna: `{blueprint, removed_component, component_class, success}`

#### `attach_component_to_blueprint`
```json
{
  "command": "attach_component_to_blueprint",
  "params": {
    "blueprint_name": "BP_WeaponBase",
    "component_name": "LuzLanterna",
    "parent_component_name": "WeaponMesh",
    "socket_name": "FlashlightSocket",
    "location": {"x": 20, "y": 0, "z": 5},
    "rotation": {"pitch": 0, "yaw": 0, "roll": 0}
  }
}
```
- Reparenta `USCS_Node` via `AttachToNode`
- Suporta socket opcional
- Atualiza transform relativo
- Compila ao final

#### `set_component_properties`
```json
{
  "command": "set_component_properties",
  "params": {
    "blueprint_name": "BP_WeaponBase",
    "component_name": "LuzLanterna",
    "visible": true,
    "active": false,
    "intensity": 5000.0,
    "attenuation_radius": 800.0,
    "cast_shadows": true
  }
}
```
- Suporta: `visible`, `active`, `location`, `rotation`
- Light props: `intensity`, `attenuation_radius`, `inner_cone_angle`, `outer_cone_angle`, `cast_shadows`
- Validação de tipo por cast (USceneComponent, UPointLightComponent, USpotLightComponent)
- Retorna a lista de propriedades aplicadas

#### `get_blueprint_components`
```json
{
  "command": "get_blueprint_components",
  "params": {
    "blueprint_name": "BP_WeaponBase",
    "include_transforms": true
  }
}
```
- Lista todos os `USCS_Node` com nome, classe, parent
- Opcionalmente inclui location, rotation, scale

### Prioridade 2 — Input e grafo

#### `add_input_action_node`
```json
{
  "command": "add_input_action_node",
  "params": {
    "blueprint_name": "BP_Character",
    "action_name": "IA_ToggleFlashlight",
    "position": [400, 200]
  }
}
```
- Cria `UK2Node_InputAction` no EventGraph
- Compatível com EnhancedInput (UE 5.6)
- Retorna `node_id`, `node_guid`, `action_name`

#### `add_key_event_node`
```json
{
  "command": "add_key_event_node",
  "params": {
    "blueprint_name": "BP_Character",
    "key": "F",
    "position": [400, 200]
  }
}
```
- Cria `UK2Node_InputKey` no EventGraph
- Suporta qualquer tecla via `FKey(*KeyName)`
- Retorna `node_id`, `node_guid`, `key`

#### `get_blueprint_graph_nodes`
```json
{
  "command": "get_blueprint_graph_nodes",
  "params": {
    "blueprint_name": "BP_WeaponBase",
    "graph_name": "EventGraph"
  }
}
```
- Lista todos os nós com IDs estáveis (`node_id`, `node_guid`)
- Inclui pinos com nome, tipo, direção, número de conexões
- Funciona em EventGraph e em FunctionGraphs

### Prioridade 3 — Inspeção e confiabilidade

#### `get_command_schema` / `list_commands`
```json
{"command": "get_command_schema", "params": {}}
```
- Lista todos os 59 comandos disponíveis
- Cada entrada: `command`, `handler` (bridge/editor/blueprint/graph/building), `description`
- Auto-documentado para consumo por IA

#### IDs de requisição (request_id)
```json
{"command": "ping", "id": 42, "params": {}}
```
- O campo opcional `id` é propagado para a resposta
- Permite correlação de requisições em clientes com várias requisições pendentes

#### Newline framing
- Todas as respostas agora incluem `\n` como terminador
- O parser acumula dados até encontrar `\n`
- Suporta múltiplas mensagens em uma única leitura de socket

### Asset discovery (via EditorCommands)

#### `search_assets`
```json
{
  "command": "search_assets",
  "params": {
    "path": "/Game",
    "query": "concrete",
    "asset_classes": ["StaticMesh", "Material", "MaterialInstance", "Texture2D"]
  }
}
```
- Usa `AssetRegistry` para busca rápida
- Filtro por nome (`query`) e classe (`asset_classes`)
- Limite de 200 resultados

#### `get_asset_details`
```json
{
  "command": "get_asset_details",
  "params": {
    "asset_path": "/Game/Blueprints/Weapons/BP_WeaponBase"
  }
}
```
- Retorna informações específicas por tipo de asset:
  - Blueprint: parent_class, num_variables, num_functions
  - StaticMesh: num_material_slots, num_lods
  - Material: is_material_instance

#### `list_assets_in_path`
```json
{
  "command": "list_assets_in_path",
  "params": {
    "path": "/Game/Environment/Materials",
    "recursive": true
  }
}
```
- Usa `UEditorAssetLibrary::ListAssets`
- Limite de 500 resultados

### Material commands

#### `create_material_instance`
```json
{
  "command": "create_material_instance",
  "params": {
    "parent_material": "/Game/Materials/M_Master",
    "instance_name": "MI_DarkMetal",
    "save_path": "/Game/Environment/Materials/"
  }
}
```
- Usa `FAssetToolsModule` para criar `UMaterialInstanceConstant`
- Retorna `instance_path` completo

#### `set_material_instance_parameter`
```json
{
  "command": "set_material_instance_parameter",
  "params": {
    "instance_path": "/Game/Environment/Materials/MI_DarkMetal",
    "parameter_name": "BaseColor",
    "vector_value": [0.2, 0.2, 0.3, 1.0]
  }
}
```
- Suporta `scalar_value`, `vector_value` (RGBA), `texture_path`
- Valida que o asset é `UMaterialInstanceConstant`

#### `apply_material_to_component`
```json
{
  "command": "apply_material_to_component",
  "params": {
    "blueprint_name": "BP_WeaponBase",
    "component_name": "WeaponMesh",
    "material_slot": 0,
    "material_path": "/Game/Environment/Materials/MI_DarkMetal"
  }
}
```
- Retorna `previous_material` para facilitar reversão
- Compila o Blueprint ao final

#### `get_component_materials`
```json
{
  "command": "get_component_materials",
  "params": {
    "blueprint_name": "BP_WeaponBase",
    "component_name": "WeaponMesh"
  }
}
```
- Lista todos os slots de material do componente com nome, path, classe

#### `get_static_mesh_material_slots`
```json
{
  "command": "get_static_mesh_material_slots",
  "params": {
    "mesh_path": "/Game/Environment/Meshes/SM_Wall"
  }
}
```
- Lista os `FStaticMaterial` do mesh com slot_index, slot_name, material

---

## Decisões de protocolo/framing

1. **Newline como delimitador de mensagem:** O `\n` é o terminador universal. O parser acumula bytes até encontrar `\n`, extrai uma mensagem JSON completa, processa, e continua com o restante do buffer.

2. **IDs de requisição:** Campo opcional `id` (int) na requisição → propagado para a resposta. Não quebra clientes existentes (campo opcional).

3. **Socket não-bloqueante:** Mantido como estava. O loop usa `SE_EWOULDBLOCK` com sleep de 10ms.

4. **Limpeza explícita de socket:** Após cada cliente desconectar, o socket é fechado com `Close()`, destruído com `DestroySocket()`, e resetado. Uma pausa de 0.5s garante que o OS libere a porta.

5. **Respostas em uma linha:** Cada resposta é serializada como JSON inline (sem pretty-print) + `\n`.

---

## Como compilar

1. Feche o Unreal Editor
2. Abra o Visual Studio solution (ou clique com botão direito no `.uproject` → Generate Visual Studio project files)
3. Compile `ProjetoGTA` em `Development Editor | Win64`
4. Abra o `.uproject` novamente
5. Verifique que o plugin está ativo em Edit → Plugins → UnrealMCP

---

## Testes executados e resultados

(N/A — testes devem ser executados no Unreal Editor)

### Roteiro de testes sugerido

1. `ping` por `command` e por `type`:
```bash
echo '{"command":"ping","params":{}}' | nc 127.0.0.1 55557
echo '{"type":"ping","params":{}}' | nc 127.0.0.1 55557
```

2. **Dois clientes TCP sequenciais:**
```bash
echo '{"command":"ping","params":{}}' | nc -w1 127.0.0.1 55557
sleep 1
echo '{"command":"ping","params":{}}' | nc -w1 127.0.0.1 55557
```
Ambos devem responder sem reiniciar o Editor.

3. **Duas mensagens na mesma conexão:**
```bash
printf '{"command":"ping","params":{}}\n{"command":"get_command_schema","params":{}}\n' | nc -w2 127.0.0.1 55557
```

4. **Request ID correlation:**
```bash
echo '{"command":"ping","id":42,"params":{}}' | nc -w1 127.0.0.1 55557
```
Resposta deve conter `"id": 42`.

5. **Criar Blueprint de teste, remover componente:**
```bash
echo '{"command":"create_blueprint","params":{"name":"BP_AVA_Test_RemoveComponent"}}' | nc -w5 127.0.0.1 55557
echo '{"command":"add_component_to_blueprint","params":{"blueprint_name":"BP_AVA_Test_RemoveComponent","component_type":"SphereComponent","component_name":"TestSphere"}}' | nc -w5 127.0.0.1 55557
echo '{"command":"remove_component_from_blueprint","params":{"blueprint_name":"BP_AVA_Test_RemoveComponent","component_name":"TestSphere"}}' | nc -w5 127.0.0.1 55557
```

6. **Adicionar e reposicionar SpotLight:**
```bash
echo '{"command":"add_component_to_blueprint","params":{"blueprint_name":"BP_AVA_Test_RemoveComponent","component_type":"SpotLightComponent","component_name":"TestLight"}}' | nc -w5 127.0.0.1 55557
echo '{"command":"attach_component_to_blueprint","params":{"blueprint_name":"BP_AVA_Test_RemoveComponent","component_name":"TestLight","parent_component_name":"TestSphere","location":{"x":0,"y":0,"z":50}}}' | nc -w5 127.0.0.1 55557
```

7. **Só então aplicar em BP_WeaponBase:**
```bash
echo '{"command":"remove_component_from_blueprint","params":{"blueprint_name":"BP_WeaponBase","component_name":"SpringArm"}}' | nc -w10 127.0.0.1 55557
echo '{"command":"attach_component_to_blueprint","params":{"blueprint_name":"BP_WeaponBase","component_name":"LuzLanterna","parent_component_name":"WeaponMesh","location":{"x":20,"y":0,"z":5}}}' | nc -w10 127.0.0.1 55557
echo '{"command":"set_component_properties","params":{"blueprint_name":"BP_WeaponBase","component_name":"LuzLanterna","visible":false,"active":false,"intensity":5000,"attenuation_radius":800}}' | nc -w10 127.0.0.1 55557
```

8. **Material workflow:**
```bash
echo '{"command":"create_material_instance","params":{"parent_material":"/Game/Materials/M_Master","instance_name":"MI_WeaponDark","save_path":"/Game/Weapons/Materials/"}}' | nc -w10 127.0.0.1 55557
echo '{"command":"apply_material_to_component","params":{"blueprint_name":"BP_WeaponBase","component_name":"WeaponMesh","material_slot":0,"material_path":"/Game/Weapons/Materials/MI_WeaponDark"}}' | nc -w10 127.0.0.1 55557
```

9. **Asset discovery:**
```bash
echo '{"command":"search_assets","params":{"path":"/Game","query":"Weapon","asset_classes":["Blueprint"]}}' | nc -w5 127.0.0.1 55557
echo '{"command":"get_asset_details","params":{"asset_path":"/Game/Blueprints/Weapons/BP_WeaponBase"}}' | nc -w5 127.0.0.1 55557
```

10. **Schema:**
```bash
echo '{"command":"get_command_schema","params":{}}' | nc -w5 127.0.0.1 55557
```

---

## Limitações restantes

1. **Conexões simultâneas:** A bridge não suporta múltiplos clientes conectados ao mesmo tempo (apenas sequenciais).
2. **Timeout de execução na Game Thread:** Não implementado. Comandos muito lentos podem bloquear a Game Thread.
3. **`attach_component_to_blueprint`**: O `AttachToComponent` com socket funciona, mas o Unreal pode rejeitar a operação se o componente pai não existir no CDO no momento da compilação. Testar primeiro.
4. **Material instance:** A criação usa `FAssetToolsModule` que pode ter problemas de racing com o AssetRegistry em UE 5.6. Se falhar, recriar com `NewObject<UMaterialInstanceConstant>` diretamente.
5. **Input Actions:** O `add_input_action_node` cria o nó no graph, mas **não** cria o asset `IA_*` no Content Browser automaticamente. O usuário/IA precisa criar o Input Action asset separadamente antes ou usar `add_key_event_node` como alternativa mais simples.
6. **Framing:** Se o JSON contiver `\n` embutido (strings com quebra de linha), a leitura pode quebrar. Usar escaping `\\n` no JSON.

---

## Instruções para o revisor final validar a lanterna no jogo

### Configuração da lanterna via MCP

```bash
REM Passo 1: Remover SpringArm indesejado
echo {"command":"remove_component_from_blueprint","params":{"blueprint_name":"BP_WeaponBase","component_name":"SpringArm"}} | nc -w10 127.0.0.1 55557

REM Passo 2: Reanexar LuzLanterna ao WeaponMesh
echo {"command":"attach_component_to_blueprint","params":{"blueprint_name":"BP_WeaponBase","component_name":"LuzLanterna","parent_component_name":"WeaponMesh","location":{"x":20,"y":0,"z":5}}} | nc -w10 127.0.0.1 55557

REM Passo 3: Deixar lanterna inicialmente desligada
echo {"command":"set_component_properties","params":{"blueprint_name":"BP_WeaponBase","component_name":"LuzLanterna","active":false,"visible":false,"intensity":5000,"attenuation_radius":800}} | nc -w10 127.0.0.1 55557
```

### Ligação de gameplay (manual no BP_Character)

A lógica de toggle ainda precisa ser conectada manualmente ou via comandos de graph:

```
BP_Character EventGraph:
  [InputAction F / Key F] → Get Weapon System → Get CurrentWeapon → ToggleFlashlight
```

Ou via MCP graph:
```bash
echo {"command":"add_key_event_node","params":{"blueprint_name":"BP_Character","key":"F","position":[0,0]}} | nc -w10 127.0.0.1 55557
echo {"command":"add_get_node","params":{"blueprint_name":"BP_Character","variable_name":"WeaponSystem"}} | nc -w10 127.0.0.1 55557
echo {"command":"call_function_on_object","params":{"blueprint_name":"BP_Character","function_name":"ToggleFlashlight","target_class":"BP_WeaponInterface"}} | nc -w10 127.0.0.1 55557
REM Depois conectar os nós com connect_nodes (execution pins)
```

### Verificação final

1. Abra `BP_WeaponBase` no Unreal Editor → verifique que `SpringArm` foi removido
2. Verifique que `LuzLanterna` está filha de `WeaponMesh`
3. Teste no jogo: aperte F, a lanterna deve acender/apagar na arma atual
