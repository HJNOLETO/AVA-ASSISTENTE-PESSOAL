# Análise Técnica — Plugin UnrealMCP (flopperam-mcp)

**Data da análise:** 18/07/2026
**Escopo:** `flopperam-mcp/UnrealMCP` (C++), `flopperam-mcp/Python` (servidor MCP), `flopperam-mcp/Guides`
**Método:** leitura estática do código, cruzamento de comandos entre camadas (Bridge → Handlers → Python → Docs), comparação de duas cópias do plugin presentes no zip.

## Resumo executivo

O plugin cresceu rápido e por camadas — várias sessões de IA foram adicionando comandos, um de cada vez, sem sempre voltar para atualizar os "vizinhos" de cada mudança. O código C++ do lado Unreal está, hoje, bem mais avançado que o resto do sistema. Os problemas não são de "o código não funciona", e sim de **desalinhamento entre camadas**: coisas que existem em um lugar mas não foram propagadas para os outros.

Achados por gravidade:

| # | Achado | Gravidade |
|---|--------|-----------|
| 1 | Mais da metade dos comandos C++ não têm wrapper Python (inacessíveis via MCP) | 🔴 Crítico |
| 2 | `create_wall`/`create_tower`/`create_staircase`/`construct_house` existem em **duas implementações paralelas e divergentes** (Python força-bruta vs. C++ nativo) | 🔴 Crítico |
| 3 | `LoadBlueprint` reimplementado 5 vezes, com lógicas diferentes e qualidade desigual | 🟠 Alto |
| 4 | Código morto em `NodeManager.cpp` (funções que não são mais chamadas) | 🟡 Médio |
| 5 | As duas cópias do plugin no zip têm `Build.cs` divergentes (uma sem `EnhancedInput`/`UMG`/`UMGEditor`) | 🟠 Alto |
| 6 | Documentação (`Guides/tools-reference.md`) desatualizada frente aos comandos reais | 🟡 Médio |
| 7 | Limitações estruturais já conhecidas (sem conexões simultâneas, sem asset p/ Input Action) | 🟡 Médio |
| 8 | Oportunidades de robustez geral (validação, logging, testes) | 🟢 Baixo |

---

## 1. 🔴 Crítico — Gap entre comandos C++ e wrappers Python

O servidor MCP que a IA (você, o Claude, o Antigravity etc.) realmente usa é o Python (`unreal_mcp_server_advanced.py` + `helpers/`). Cruzando os comandos:

- **87 comandos** estão implementados e roteados no lado C++ (`EpicUnrealMCPBridge.cpp` + handlers).
- Apenas **43 `@mcp.tool()`** existem no Python, e destes só uma fração chama efetivamente comandos novos.
- **47 comandos C++ não são chamados por nenhum arquivo Python**, entre eles:

```
add_blueprint_interface        remove_blueprint_interface
apply_material_to_component    create_material_instance
attach_component_to_blueprint  remove_component_from_blueprint
set_component_properties       set_component_collision
create_widget_blueprint        add_widget_to_viewport
create_input_action_asset      map_input_action
add_input_action_node          add_key_event_node
add_get_node                   call_function_on_object
delete_blueprint                delete_blueprint_node
get_blueprint_components       get_blueprint_diagnostics
get_blueprint_summary          get_blueprint_graph_nodes
search_assets                  get_asset_details / list_assets_in_path
validate_project / run_map_check / compile_project_target
pie_start / pie_stop / pie_state
construct_house / create_wall / create_tower / create_staircase (nativos)
```

**Por que isso importa:** todo o trabalho de C++ (inclusive features que você validou manualmente via `nc`, como a lanterna da arma, componentes, materiais) só é utilizável hoje testando via `netcat`/TCP bruto. Nenhuma IA conectada pelo MCP consegue chamar essas funções — porque para o MCP elas simplesmente não existem.

**Ação recomendada:**
- Gerar os wrappers Python faltantes de forma sistemática. Como o C++ já expõe `get_command_schema`/`list_commands` (retorna todos os comandos com descrição), dá para **gerar automaticamente** um Python que faz introspecção desse schema e cria `@mcp.tool()` genéricos, ou pelo menos usar essa lista como checklist manual.
- Tratar "implementar em C++" e "expor no Python" como duas etapas do mesmo checklist de entrega — nunca fechar uma tarefa sem a outra.

---

## 2. 🔴 Crítico — Implementações paralelas e divergentes de construção procedural

`create_wall`, `create_tower`, `create_staircase` e `construct_house` existem **duas vezes**, com comportamentos completamente diferentes:

- **No C++** (`EpicUnrealMCPBuildingCommands.cpp`), roteados pelo Bridge como comandos nativos — presumivelmente mais eficientes/parametrizáveis (é o código que a AVA "V4" tratou como comando de primeira classe, com timeout próprio de 300s por serem operações pesadas).
- **No Python** (`unreal_mcp_server_advanced.py`, ex. `create_wall` linha ~873), uma implementação **antiga**, que faz um loop `for h in range(height): for i in range(length):` chamando `spawn_actor` individualmente para cada cubo — ou seja, dezenas/centenas de chamadas TCP sequenciais para montar uma parede simples.

Como os nomes das ferramentas MCP (`create_wall`, `create_tower`...) colidem com os nomes dos comandos C++, **o wrapper Python nunca delega para o comando nativo** — ele nem sabe que ele existe. Isso significa:
- Performance pior do que o necessário (muitas viagens de rede em vez de uma).
- Qualquer melhoria feita no C++ (ex.: geometria mais realista, materiais, otimização de mesh) fica **presa e invisível**, porque a ferramenta que a IA chama é a versão antiga.

**Ação recomendada:** decidir qual versão é a "fonte da verdade" (provavelmente a C++ nativa, mais recente) e:
1. Reescrever os wrappers Python de `create_wall`/`create_tower`/`create_staircase`/`construct_house` para chamar `send_command("create_wall", {...})` etc., delegando ao C++.
2. Ou, se a versão Python força-bruta ainda for necessária por algum motivo (ex. mais controle de posição por bloco), renomear para não colidir (`create_wall_bruteforce`) e documentar por que as duas existem.

---

## 3. 🟠 Alto — `LoadBlueprint` reimplementado 5 vezes

Isso confirma exatamente a sua hipótese: quando uma melhoria foi feita em um lugar (a versão "canônica" `FEpicUnrealMCPCommonUtils::FindBlueprintByName`, em `EpicUnrealMCPCommonUtils.cpp`), ela não foi propagada para os outros pontos que resolvem blueprint por nome.

A versão canônica é a mais robusta: tenta path direto → Asset Registry por `ObjectPath` → busca em memória por `FindObject` → fallback de busca por nome em **todos** os blueprints do projeto via Asset Registry. É a única que funciona de forma confiável independentemente de onde o blueprint esteja salvo.

Hoje, **já foram migrados** para chamar essa versão canônica: `NodeManager`, `EventManager`, `BPVariables`, `InterfaceManager`, `EpicUnrealMCPBlueprintCommands` — ótimo, mostra que parte da unificação já aconteceu.

Mas ainda restam **implementações próprias, divergentes entre si**, em:

| Arquivo | Comportamento |
|---|---|
| `NodeDeleter.cpp` (`FNodeDeleter::LoadBlueprint`) | Só tenta `/Game/Blueprints/<nome>` + `LoadObject`/`EditorAssetLibrary`. Não busca em outros caminhos. |
| `NodePropertyManager.cpp` (`FNodePropertyManager::LoadBlueprint`) | Idêntica à do `NodeDeleter` — duplicada. |
| `FunctionManager.cpp` (`FFunctionManager::LoadBlueprint`) | Estratégia bem diferente e frágil: carrega a classe via sufixo `_C` e depois **itera todos os `UBlueprint` carregados em memória** (`TObjectIterator`) procurando um cujo `GetPathName()` "contenha" o nome — isso pode casar com o blueprint errado se o nome for substring de outro (ex. `BP_Weapon` casaria com `BP_WeaponBase`). |
| `FunctionIO.cpp` (`FFunctionIO::LoadBlueprint`) | A mais fraca: só tenta `StaticLoadObject` com o nome cru e `EditorAssetLibrary`, **sem** o fallback de prefixo `/Game/Blueprints/`. Se você passar só `"BP_WeaponBase"` (sem path completo), provavelmente falha. |

**Consequência prática:** o mesmo comando MCP (ex. `create_function` vs `delete_node` vs `set_node_property`) pode ter taxas de sucesso diferentes para o **mesmo blueprint**, dependendo de qual arquivo internamente resolveu o nome — um bug muito difícil de depurar porque parece "aleatório".

**Ação recomendada:**
- Substituir as 4 implementações duplicadas por chamadas a `FEpicUnrealMCPCommonUtils::FindBlueprint()`, exatamente como já foi feito em `NodeManager`/`EventManager`.
- Remover os métodos `LoadBlueprint` privados desses 4 arquivos depois da migração (evita reintroduzir divergência no futuro).

---

## 4. 🟡 Médio — Código morto em `NodeManager.cpp`

`FBlueprintNodeManager::CreateVariableGetNode` e `CreateVariableSetNode` (linhas ~339–408) ainda existem no arquivo, mas **não são mais chamados** — o código real (linhas ~145–149) já foi migrado para usar `FDataNodeCreator::CreateVariableGetNode/SetNode` (em `Nodes/DataNodes.cpp`), que é essencialmente a mesma lógica só que com um helper compartilhado (`FNodeCreatorUtils::InitializeK2Node`).

Isso é o padrão clássico de "refatorei o ponto de chamada mas esqueci de apagar a implementação antiga": não quebra nada agora, mas:
- Confunde quem for ler o código (parece que há duas fontes de verdade).
- Se alguém no futuro (você, uma IA, o Antigravity) editar `NodeManager::CreateVariableGetNode` achando que está corrigindo um bug, a mudança **não terá efeito nenhum**, porque o caminho de execução real passa por `DataNodes.cpp`.

**Ação recomendada:** apagar os métodos mortos em `NodeManager.cpp`/`.h`, ou, se quiser manter por segurança, marcar claramente com `// DEPRECATED - não usado, ver FDataNodeCreator` e um `checkNoEntry()` dentro.

**Nota:** vale rodar uma busca geral por outros métodos "órfãos" do mesmo tipo — não tive como cobrir 100% dos ~30 arquivos `.cpp` manualmente, então isso pode se repetir em outros managers.

---

## 5. 🟠 Alto — As duas cópias do plugin no zip estão dessincronizadas

O zip contém duas cópias do plugin:
- `flopperam-mcp/UnrealMCP/` (a "fonte", com o relatório `HANOFF_DELIVERY_V4.md`)
- `flopperam-mcp/FlopperamUnrealMCP/Plugins/UnrealMCP/` (aparenta ser uma cópia dentro de um projeto Unreal de exemplo/teste)

Todo o código-fonte `.cpp`/`.h` é idêntico entre as duas — **exceto** o `UnrealMCP.Build.cs`:

```diff
  "KismetCompiler",      // For Blueprint compilation (F15-F22)
- "EnhancedInput",       // For InputAction/InputMappingContext
- "UMG",                 // For WidgetBlueprint, UserWidget
- "UMGEditor"            // For WidgetBlueprint factory
```

A cópia dentro de `FlopperamUnrealMCP/` está **sem** os módulos `EnhancedInput`, `UMG` e `UMGEditor` nas dependências. Como o código já usa `UK2Node_InputAction`, `UUserWidget`/`WidgetBlueprint` etc. (comandos `create_widget_blueprint`, `add_input_action_node`, `add_enhanced_input_action_node`), **essa cópia não vai compilar** se for a que estiver ativa em algum projeto.

**Ação recomendada:**
- Definir qual das duas pastas é a "fonte de verdade" e tratar a outra como artefato gerado/copiado, nunca editado à mão — ou eliminar a duplicação de pasta do repositório e usar symlink/submódulo.
- Sincronizar o `Build.cs` imediatamente (adicionar os 3 módulos que faltam na cópia do `FlopperamUnrealMCP`).

---

## 6. 🟡 Médio — Documentação desatualizada

`Guides/tools-reference.md` tem ~31 seções de comando documentadas, contra **87 comandos reais no C++** e 43 ferramentas Python. Ou seja, a documentação cobre uma fração pequena do que o plugin faz hoje — praticamente tudo que foi adicionado nas rodadas mais recentes (materiais, componentes, PIE, asset discovery, blueprint interfaces, `get_command_schema`) não está descrito lá.

Isso é o tipo de problema que se agrava sozinho: uma IA nova (ou você, voltando depois de semanas) vai ler o guia, achar que só existem ~31 comandos, e reimplementar algo que já existe — ou pior, reimplementar de um jeito incompatível com o que já está lá (é basicamente o que aconteceu no item 2).

**Ação recomendada:**
- Já que o próprio plugin expõe `get_command_schema` (lista os 87 comandos com descrição, categoria e handler), usar essa resposta como fonte para **gerar automaticamente** o `tools-reference.md` em vez de mantê-lo manualmente. Isso elimina a categoria inteira de "doc desatualizada".

---

## 7. 🟡 Médio — Limitações estruturais já mapeadas (mas não resolvidas)

O próprio `HANOFF_DELIVERY_V4.md` já documenta honestamente algumas limitações que continuam valendo e merecem entrar no backlog:

1. **Sem conexões TCP simultâneas** — a bridge atende só um cliente por vez (sequencial). Se dois processos (ex. Claude + Antigravity) tentarem falar com a Unreal ao mesmo tempo, um vai falhar ou esperar.
2. **`attach_component_to_blueprint`** pode falhar silenciosamente se o componente pai não existir no CDO no momento da compilação — vale adicionar uma validação prévia (`does component exist`) antes de tentar anexar.
3. **`create_material_instance`** usa `FAssetToolsModule`, que os próprios devs já sinalizaram ter corrida de condição (race) com o Asset Registry em UE 5.6. Se isso já causou falhas intermitentes, o fallback sugerido (`NewObject<UMaterialInstanceConstant>` direto) deveria ser implementado, não só anotado como "se falhar, fazer X".
4. **`add_input_action_node`** cria o nó no grafo mas não cria o asset `IA_*` correspondente — precisa ser criado à parte. Isso é uma pegadinha fácil de esquecer numa sessão futura.
5. **Framing por `\n`** quebra se um JSON tiver `\n` não escapado dentro de uma string — vale validar/escapar no lado do servidor antes de montar a resposta, em vez de depender do cliente sempre escapar certo.

---

## 8. 🟢 Baixo — Robustez geral / boas práticas

Pontos menores, mas que valem a pena ao revisar o código:

- **Padronizar contrato de erro:** a maioria dos handlers retorna `{"success": false, "error": "...", "error_code": "..."}` — vale confirmar que **todos** os 87 comandos seguem exatamente esse contrato (nomes de campo, presença de `error_code`), porque isso é o que o Bridge usa para decidir se propaga sucesso/erro pro cliente.
- **Timeout por categoria:** hoje o Bridge classifica timeout por substring do nome do comando (`Contains("read_")`, `Contains("get_blueprint_")` etc.). Isso é frágil — um comando novo chamado `get_asset_preview_thumbnail` cairia automaticamente em timeout de 120s mesmo que devesse ser rápido, só porque contém `get_`. Prefira uma tabela explícita de comando → timeout, ou ao menos documente a convenção de nomes para quem for adicionar comandos novos.
- **Logs:** o Bridge já loga `cmd`, `duration`, `request_id` — ótimo. Vale garantir que os handlers de nível mais baixo (managers) também logem falhas com `UE_LOG(LogTemp, Error, ...)` de forma consistente; hoje isso parece existir só em parte deles (ex. `FindBlueprintByName` loga, mas nem todo `LoadBlueprint` duplicado loga quando falha).
- **Testes automatizados:** os "testes" documentados no `HANOFF_DELIVERY_V4.md` são roteiros manuais via `nc`. Dado o tamanho que o plugin já tem (87 comandos), vale considerar um script Python simples que roda esses roteiros automaticamente contra uma instância do Editor aberta, e falha alto se algum comando conhecido parar de responder — isso pegaria boa parte dos problemas listados aqui automaticamente em builds futuros.

---

## Plano de ação sugerido (ordem de prioridade)

1. **Sincronizar `Build.cs` das duas cópias do plugin** (5 min, evita builds quebrados).
2. **Unificar `LoadBlueprint`** nos 4 arquivos restantes para usar `FEpicUnrealMCPCommonUtils::FindBlueprint` (baixo risco, alto ganho de confiabilidade).
3. **Resolver a duplicidade de `create_wall`/`create_tower`/`create_staircase`/`construct_house`** — decidir a fonte da verdade e religar o wrapper Python ao comando C++ nativo.
4. **Fechar o gap Python↔C++**: gerar/atualizar os `@mcp.tool()` que faltam (47 comandos), priorizando os que você já validou manualmente (componentes, materiais, blueprint interfaces — tudo ligado ao sistema de armas/lanterna do Pirata Perdido).
5. **Gerar `tools-reference.md` a partir de `get_command_schema`** em vez de mantê-lo manualmente.
6. Limpar código morto (`NodeManager::CreateVariableGetNode/SetNode` antigos) e repetir essa checagem nos demais managers quando houver tempo.
7. Tratar as limitações já conhecidas do item 7 como backlog formal, não só como nota de rodapé no relatório de entrega.

## 1. Sincronizando o `Build.cs` das duas cópiasFeito. Agora vou unificar o `LoadBlueprint`.Nenhum dos 4 inclui `EpicUnrealMCPCommonUtils.h`. Vou adicionar o include e trocar a implementação de cada `LoadBlueprint` para delegar à versão canônica.Agora `NodePropertyManager.cpp`:Agora `FunctionManager.cpp` (a versão mais frágil, com `TObjectIterator` por substring):Agora `FunctionIO.cpp` (a que faltava até o fallback básico de prefixo):## 2. Removendo código morto em `NodeManager`Confirmado: os únicos usos reais (linhas 145/149) já chamam `FDataNodeCreator`, não `FBlueprintNodeManager`. As implementações em 339 e 374 estão órfãs. Vou removê-las do `.cpp` e do `.h`.Vou deixar esses dois includes como estão — remover não é obrigatório e mexer neles sem necessidade só aumenta o risco. Vou sync essa mesma mudança para a cópia `FlopperamUnrealMCP`.As duas cópias estão sincronizadas de novo (só falta o `HANOFF_DELIVERY_V4.md`, que é só documentação histórica, sem problema). Agora vou para o item mais impactante: religar o `create_wall`/`create_tower`/`create_staircase`/`construct_house` do Python para os comandos C++ nativos.Agora vou reescrever `create_wall` e `create_staircase` para delegar ao comando nativo C++ (uma única viagem de rede em vez de dezenas). **Vou manter `create_tower` e `construct_house` como estão** — na verdade essas duas versões Python são *mais* avançadas que as nativas (torre com estilo "tapered" e detalhes decorativos; casa com paredes/telhado/features por estilo arquitetônico gerados por `house_construction.py`), então redirecioná-las seria um retrocesso.Agora vou deixar uma nota explícita perto de `create_tower` e `construct_house`, para nenhuma sessão futura de IA "corrigir" isso incorretamente:Agora os comandos de grafo (BlueprintGraphCommands) e editor:Agora os comandos do EditorCommands (widget/input/asset/PIE/projeto):Agora vou validar a sintaxe Python e conferir se todos os comandos "gap" ficaram cobertos.Quase completo — faltam só 2 que esqueci: `set_component_static_mesh` e `set_point_light_properties`. Vou adicionar.

O HandleCreateBlueprint já está numa boa base — na verdade a versão atual já uniu os dois pontos fortes que eu tinha identificado antes (valida e retorna save_path, e tem o fallback de usar outro Blueprint como parent class). Isso é uma boa notícia. Mas já que você marcou isso como prioridade, vou revisar com mais rigor em busca de falhas que ainda possam existir.Identificou lacunas na API e planejou melhorias estruturaisIdentificou lacunas na API e planejou melhorias estruturaisEncontrei um ponto real: o wrapper Python de create_blueprint não expõe save_path — mesmo o C++ suportando e validando isso plenamente, nenhum client MCP consegue hoje escolher onde salvar o blueprint; tudo cai forçosamente em /Game/Blueprints/. Vou corrigir isso e reforçar o lado C++ também.