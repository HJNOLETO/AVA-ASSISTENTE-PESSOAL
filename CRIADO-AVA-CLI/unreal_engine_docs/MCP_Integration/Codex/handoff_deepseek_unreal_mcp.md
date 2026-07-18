# Handoff para DeepSeek V4-Pro — Evolução do UnrealMCP (UE 5.6)

## Papel solicitado

Você está recebendo a continuação de um plugin C++ para Unreal Engine 5.6, chamado `UnrealMCP`. Sua tarefa é ampliar a capacidade de manipular Blueprints via TCP/MCP de modo confiável, mantendo compatibilidade com o projeto existente.

Priorize correções pequenas, testáveis e bem roteadas. Não reescreva o plugin inteiro nem altere lógica de jogo existente sem necessidade.

---

## Caminhos

- Projeto Unreal:
  `C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\ProjetoGTA.uproject`
- Plugin:
  `C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\Plugins\UnrealMCP`
- Código-fonte do módulo:
  `Plugins\UnrealMCP\Source\UnrealMCP`
- Engine:
  Unreal Engine 5.6

---

## Como a bridge funciona hoje

1. `UEpicUnrealMCPBridge` escuta TCP em `127.0.0.1:55557`.
2. `FMCPServerRunnable` aceita um cliente e recebe JSON.
3. A bridge encaminha `CommandType` para classes de comando:
   - `FEpicUnrealMCPBlueprintCommands`
   - `FEpicUnrealMCPBlueprintGraphCommands`
   - `FEpicUnrealMCPEditorCommands`
   - `FEpicUnrealMCPBuildingCommands`
4. A execução é passada para a Game Thread por `AsyncTask` e devolve JSON.

Formato de mensagem recomendado:

```json
{"command":"ping","params":{}}
```

A bridge também foi ajustada para aceitar o formato legado:

```json
{"type":"ping","params":{}}
```

O `ping` foi validado no Unreal:

```json
{
  "status": "success",
  "result": { "message": "pong" }
}
```

---

## Conexões e ajustes já implementados

### 1. Interface de Blueprint exposta no MCP

`FInterfaceManager` já tinha implementação para adicionar/remover interfaces, mas não era alcançável pela bridge.

Foram conectados estes comandos:

- `add_blueprint_interface`
- `remove_blueprint_interface`

Fluxo atual:

```text
TCP JSON → MCPServerRunnable → UEpicUnrealMCPBridge
→ FEpicUnrealMCPBlueprintGraphCommands → FInterfaceManager
```

Arquivos envolvidos:

- `Private/EpicUnrealMCPBridge.cpp`
- `Private/Commands/EpicUnrealMCPBlueprintGraphCommands.cpp`
- `Public/Commands/EpicUnrealMCPBlueprintGraphCommands.h`
- `Private/Commands/BlueprintGraph/InterfaceManager.cpp`

Foi necessário incluir:

```cpp
#include "Commands/BlueprintGraph/InterfaceManager.h"
```

em `EpicUnrealMCPBlueprintGraphCommands.cpp`.

### 2. Compatibilidade de protocolo

`MCPServerRunnable.cpp` continha dois caminhos de processamento: um usava `type`; outro usava `command`. O caminho ativo foi ajustado para aceitar ambos e para tratar `params` como opcional.

### 3. Situação de compilação

O projeto já foi recompilado depois dos ajustes e o `ping` por `command` respondeu com sucesso. Ao alterar C++, feche o Unreal Editor, compile `ProjetoGTA` em `Development Editor | Win64`, depois abra o `.uproject` novamente.

---

## Limitação crítica atual da bridge

A bridge processa um cliente TCP por vez. Em testes, depois que um cliente encerra, uma próxima conexão às vezes fica aguardando até reiniciar o Editor.

Isso precisa ser tratado como prioridade alta.

Hipóteses a revisar:

- ciclo de vida de `ClientSocket` e chamada explícita de `Close()`/`Reset()`;
- `Recv()` bloqueante e tratamento de `SE_EWOULDBLOCK`;
- ausência de framing robusto por newline;
- leitura de vários JSONs em um mesmo `Recv()`;
- resposta sem delimitador consistente;
- falta de timeout ou desconexão limpa;
- impossibilidade de servir múltiplos clientes sequenciais.

Objetivo mínimo: um cliente conecta, envia uma mensagem, recebe uma resposta, desconecta; o próximo cliente deve funcionar sem reiniciar o Editor.

Objetivo ideal: suporte estável a conexão persistente, várias mensagens separadas por newline e clientes sequenciais.

---

## Caso de uso real: lanterna em todas as armas

Ativos relevantes:

- Personagem: `/Game/Blueprints/Character/BP_Character`
- Arma base: `/Game/Blueprints/Weapons/BP_WeaponBase`
- Componente de armas: `/Game/Blueprints/Weapons/AC_WeaponSystem`
- Interface: `/Game/Blueprints/Weapons/BP_WeaponInterface`

Descobertas confirmadas:

- `BP_WeaponBase` tem `WeaponMesh`, `SpringArm`, `LuzLanterna` (`SpotLightComponent`), variável `FlashlightOn` e função `ToggleFlashlight`.
- Todas as armas herdam de `BP_WeaponBase`; portanto, todas devem continuar com a lanterna.
- `SpringArm` é inadequado para uma lanterna presa à arma e deve ser removido/reparentado.
- `AC_WeaponSystem` tem a referência `CurrentWeapon`.
- `BP_Character` já chama `Get Weapon System` para operações como reload.

Ligação de gameplay desejada:

```text
BP_Character (input F / ação de lanterna)
→ AC_WeaponSystem
→ CurrentWeapon
→ BP_WeaponBase.ToggleFlashlight
→ LuzLanterna
```

Não use cast rígido desnecessário no personagem. Prefira uma chamada por interface ou uma função pública bem definida no `AC_WeaponSystem`.

---

## Integração de ativos Fab / Quixel

O projeto pode receber objetos 3D, texturas, superfícies e materiais de alta complexidade pelo Fab/Quixel. Isso é relevante para o MCP, mas deve ser tratado em duas etapas:

1. **Aquisição/importação:** o usuário baixa e adiciona o ativo ao projeto pelo fluxo oficial disponível no Unreal/Fab.
2. **Uso dentro do projeto:** depois que o ativo existe em `/Game/...`, o plugin MCP deve conseguir localizá-lo, inspecioná-lo, aplicá-lo e configurar materiais sem depender de automação da interface do Fab.

Não automatizar cliques, login, compra ou download na interface do Fab. Essas operações dependem da conta do usuário e de interfaces que mudam. Em vez disso, tornar o plugin excelente no trabalho que vem **depois da importação**.

### Comandos de alto valor sugeridos

#### Descoberta de ativos

- `search_assets`
- `get_asset_details`
- `list_assets_in_path`

Exemplo:

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

Cada resultado deve informar pelo menos: object path, classe, nome, package path e, quando aplicável, materiais associados.

#### Materiais

- `create_material_instance`
- `set_material_instance_parameter`
- `apply_material_to_component`
- `get_component_materials`
- `get_static_mesh_material_slots`

Exemplo de aplicação:

```json
{
  "command": "apply_material_to_component",
  "params": {
    "blueprint_path": "/Game/Blueprints/Weapons/BP_WeaponBase",
    "component_name": "WeaponMesh",
    "material_slot": 0,
    "material_path": "/Game/Environment/Materials/MI_DarkMetal"
  }
}
```

#### Configuração visual segura

- permitir aplicar uma `MaterialInstance` a um slot específico;
- permitir definir parâmetros escalares, vetoriais e texturas conhecidos;
- validar que o ativo é realmente um Material/Material Instance antes da aplicação;
- retornar material anterior e material novo para facilitar reversão;
- nunca sobrescrever um `Material` mestre importado sem confirmação explícita: criar instância primeiro.

### Fluxo recomendado para IA

```text
Usuário importa pelo Fab/Quixel
→ IA busca o ativo no Asset Registry
→ IA inspeciona classe e slots
→ IA cria Material Instance quando necessário
→ IA aplica ao componente/ator/Blueprint solicitado
→ IA compila e relata os paths finais
```

### Implementação sugerida

Use `AssetRegistry` e APIs de editor do Unreal para pesquisar assets no Content Browser. Mantenha os comandos de descoberta como somente leitura e os comandos de aplicação como mutações explícitas.

---

## Comandos MCP que faltam e devem ser implementados

### Prioridade 1 — Componentes em Blueprint

O plugin consegue adicionar componente (`add_component_to_blueprint`), mas não remove nem altera o pai de um componente. Implementar:

#### `remove_component_from_blueprint`

Parâmetros sugeridos:

```json
{
  "blueprint_name": "BP_WeaponBase",
  "component_name": "SpringArm"
}
```

Requisitos:

- localizar `USCS_Node` pelo nome;
- impedir remover o root sem opção explícita;
- remover corretamente do `SimpleConstructionScript`;
- marcar Blueprint como modificado, compilar e retornar JSON detalhado;
- erro claro se não encontrado.

#### `attach_component_to_blueprint`

Parâmetros sugeridos:

```json
{
  "blueprint_name": "BP_WeaponBase",
  "component_name": "LuzLanterna",
  "parent_component_name": "WeaponMesh",
  "socket_name": "",
  "location": {"x": 20, "y": 0, "z": 5},
  "rotation": {"pitch": 0, "yaw": 0, "roll": 0}
}
```

Requisitos:

- reparentar `USCS_Node` corretamente;
- suportar socket opcional;
- atualizar transform relativo;
- preservar componentes e lógica não relacionados;
- compilar ao final.

#### `set_component_properties`

Comando genérico e seguro para propriedades básicas de componente, por exemplo `visible`, `active`, transform relativo e propriedades de luz (intensity, attenuation, cone angles). Evitar reflexão irrestrita sem validação de tipos.

### Prioridade 2 — Input e grafo

O plugin contém `CreateInputActionNode` em `EpicUnrealMCPCommonUtils`, mas esse recurso não está devidamente exposto por `add_blueprint_node`.

Implementar:

- `add_input_action_node` (legado, quando aplicável);
- suporte explícito a `EnhancedInputAction` para UE 5.6;
- opcionalmente `create_input_action_asset` e `map_input_action` para criar `IA_ToggleFlashlight` e inseri-la no Mapping Context existente.

Para uma primeira entrega prática, também pode haver:

- `add_key_event_node` com `key: "F"`;
- `call_blueprint_function`/`call_function_on_object` robusto;
- ligação de nós com IDs e pinos devolvidos pelo próprio plugin.

### Prioridade 3 — Inspeção e confiabilidade

Implementar/fortalecer:

- `get_blueprint_components` com pai, classe, socket e transform;
- `get_blueprint_graph_nodes` com IDs estáveis e pinos;
- `get_command_schema` ou `list_commands` para a IA descobrir comandos e parâmetros;
- respostas sempre em uma única linha JSON (ou framing de tamanho definido);
- IDs de requisição correlacionados em resposta e logs;
- timeout de execução na Game Thread;
- logs consistentes, sem despejar JSON grande em nível Display.

---

## Padrão de implementação esperado

Para cada novo comando:

1. Criar método do handler com validação de parâmetros.
2. Registrar em `HandleCommand` da classe responsável.
3. Registrar no roteamento de `UEpicUnrealMCPBridge::ExecuteCommand`.
4. Retornar `{ success, error?, ...dados úteis }`.
5. Marcar Blueprint modificado e compilar quando houver mutação.
6. Testar primeiro com asset de teste antes de usar `BP_WeaponBase`.

Não deixe uma função implementada, porém inacessível pelo roteamento — este erro já aconteceu com `FInterfaceManager`.

---

## Roteiro de testes sugerido

1. `ping` por `command` e por `type`.
2. Dois clientes TCP sequenciais, sem reiniciar o Editor.
3. Duas mensagens na mesma conexão persistente.
4. Remover um componente em um Blueprint de teste.
5. Adicionar e reanexar um `SpotLightComponent` em um Blueprint de teste.
6. Compilar e ler o conteúdo do Blueprint de teste.
7. Só então aplicar em `BP_WeaponBase`:
   - remover `SpringArm`;
   - anexar `LuzLanterna` a `WeaponMesh`;
   - deixá-la inicialmente desligada.
8. Criar a entrada de lanterna no personagem e validar que só `CurrentWeapon` é afetada.

---

## Entrega esperada do DeepSeek

Ao terminar, registre em um Markdown:

- arquivos alterados;
- comandos novos e exemplos JSON;
- decisões de protocolo/framing;
- como compilar;
- testes executados e resultados;
- limitações restantes;
- instruções para o revisor final validar a lanterna no jogo.

Não faça mudanças irreversíveis em Blueprints de produção sem registrar o antes/depois.
