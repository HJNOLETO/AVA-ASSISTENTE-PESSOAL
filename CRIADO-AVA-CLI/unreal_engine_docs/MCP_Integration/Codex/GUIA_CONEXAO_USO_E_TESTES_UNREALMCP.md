# UnrealMCP — conexão, utilização e avaliação

**Projeto:** ProjetoGTA · **Unreal Engine:** 5.6.x · **Plugin:** UnrealMCP  
**Transporte:** TCP local · **Endereço:** `127.0.0.1:55557` · **Protocolo:** uma mensagem JSON por linha (`\n`)

## 1. Antes de conectar

1. Compile `ProjetoGTAEditor Win64 Development` depois de qualquer alteração no código do plugin.
2. Abra `ProjetoGTA.uproject` no Unreal Editor.
3. Confirme no **Output Log** mensagens semelhantes a:

```text
MCPServerRunnable: Server thread starting...
MCPServerRunnable: Client connection pending, accepting...
```

4. O Editor deve permanecer aberto durante toda a conexão. O plugin é local: não exponha a porta 55557 na rede.

## 2. Formato de conexão

O cliente conecta por TCP em `127.0.0.1`, porta `55557`, envia JSON UTF-8 terminado por quebra de linha e lê uma resposta JSON.

### Requisição atual

```json
{
  "id": "identificador-opcional",
  "command": "nome_do_comando",
  "params": {}
}
```

O formato legado com `type` ainda pode existir por compatibilidade, mas clientes novos devem usar `command`.

### Resposta de sucesso

```json
{
  "status": "success",
  "result": {},
  "id": "identificador-opcional"
}
```

### Resposta de falha

```json
{
  "status": "error",
  "error": {
    "code": "UNKNOWN_COMMAND",
    "message": "Descrição do problema"
  },
  "id": "identificador-opcional"
}
```

Nunca trate uma resposta com `status: "error"` como sucesso. Registre o `id`, o comando e a mensagem de erro antes de tentar novamente.

## 3. Verificação inicial

Envie os comandos abaixo antes de qualquer alteração:

```json
{"id":"check-01","command":"health","params":{}}
{"id":"check-02","command":"get_command_schema","params":{}}
{"id":"check-03","command":"get_project_info","params":{}}
{"id":"check-04","command":"pie_state","params":{}}
```

Critérios:

- `health` deve indicar `server_state: "running"`, UE 5.6 e contagem de comandos.
- `get_command_schema` deve listar os comandos publicados (na versão testada: 86).
- `get_project_info` deve identificar projeto, mapa atual e plugin UnrealMCP habilitado.
- `pie_state` deve começar em `stopped` antes de uma rodada de teste.

## 4. Fluxo seguro para uma IA cliente

```text
planejar → inspecionar → dry-run → executar → compilar → diagnosticar → validar nível → testar em PIE → relatar
```

### Planejar e inspecionar

Use `get_project_info`, `search_assets`, `get_asset_details`, `get_actors_in_level`, `get_blueprint_summary`, `get_blueprint_graph_nodes` e `get_blueprint_diagnostics`.

Não crie uma referência, nó ou conexão apenas por suposição. Primeiro confirme o caminho do asset, a classe e os pinos disponíveis.

### Alterar com isolamento

Use uma pasta exclusiva, por exemplo `/Game/MCPTests/`, para toda prova de conceito. Exemplo:

```json
{
  "id": "bp-create-01",
  "command": "create_blueprint",
  "params": {
    "name": "BP_MCP_MeuTeste",
    "save_path": "/Game/MCPTests/",
    "parent_class": "Actor"
  }
}
```

O caminho retornado deve começar por `/Game/MCPTests/`. Se o comando criar em outro local, interrompa a rodada e reporte o defeito.

Para operações compatíveis, execute primeiro com `dry_run: true`. Isso é obrigatório antes de remover nó, desconectar pino ou realizar uma conexão de grafo que possa substituir outra conexão.

### Compilar e diagnosticar

Após alterações relevantes, execute:

```json
{"command":"compile_blueprint","params":{"blueprint_name":"BP_MCP_MeuTeste"}}
{"command":"get_blueprint_diagnostics","params":{"blueprint_name":"BP_MCP_MeuTeste"}}
```

Só prossiga quando `has_errors` for falso e o diagnóstico não apresentar nós órfãos, pinos soltos inesperados ou referências inválidas.

### Enhanced Input e objetos opcionais

Para Enhanced Input use `add_enhanced_input_action_node`, não o nó legado de Input Action. Ao chamar uma função em arma, componente ou ator que pode não existir, coloque uma guarda `Is Valid` antes da chamada. Isto evita erros como **Accessed None**.

## 5. Testes de aceitação

Execute na ordem abaixo. Não use Blueprints de produção para esses testes.

| Nº | Teste | Procedimento | Aprovado quando |
|---:|---|---|---|
| 1 | Saúde do servidor | `health` e `ping` | JSON válido, `status:success`, servidor em execução |
| 2 | Erro estruturado | enviar comando inexistente | `status:error` e código `UNKNOWN_COMMAND` |
| 3 | Caminho de criação | criar BP em `/Game/MCPTests/` | caminho retornado e resumo apontam exatamente para a pasta |
| 4 | Validação de caminho | `save_path` sem `/Game/` | falha sem criar asset |
| 5 | Busca por nome curto | consultar o BP criado apenas pelo nome | asset localizado mesmo fora de `/Game/Blueprints/` |
| 6 | Compilação | `compile_blueprint` | `compiled:true`, `has_errors:false` |
| 7 | Diagnóstico | `get_blueprint_diagnostics` | 0 erros e sem nós órfãos no BP de teste |
| 8 | Dry run | conexão/remoção com `dry_run:true` | resposta de validação sem modificar o asset |
| 9 | Map Check | `run_map_check` no nível de teste | retorna lista estruturada; resultado sem problemas atribuídos ao teste |
| 10 | Validação do projeto | `validate_project` | plugin habilitado e resultado coerente com o Editor |
| 11 | Relatório | `create_test_report` | versão, uptime e contador de comandos retornados |
| 12 | Ciclo PIE | `pie_start` → polling de `pie_state` → `pie_stop` → polling | inicia e encerra com uma única solicitação de parada, sem queda de conexão |

## 6. Procedimento específico para PIE

`pie_start` e `pie_stop` são assíncronos. Após enviá-los, consulte `pie_state` em intervalos de 1 segundo, até timeout de 15 segundos.

```text
pie_start
enquanto pie_state != running: aguardar 1 s e consultar novamente

pie_stop
enquanto pie_state != stopped: aguardar 1 s e consultar novamente
```

### Estado atual conhecido

O comando `pie_stop` já informa `accepted:true` e `completed:false`, o que descreve corretamente uma parada assíncrona. Contudo, em testes reais anteriores, a conexão TCP foi abortada durante o polling e, em alguns casos, foi necessária uma segunda chamada de `pie_stop`.

**Enquanto isso não for corrigido, o teste 12 deve ser considerado reprovado.** Não inicie outra modificação nem um novo PIE enquanto `pie_state` não retornar `stopped`.

## 7. Comandos mais usados por domínio

| Domínio | Exemplos |
|---|---|
| Bridge | `ping`, `health`, `get_command_schema`, `create_test_report` |
| Editor | `get_project_info`, `search_assets`, `spawn_actor`, `run_map_check`, `pie_start`, `pie_stop`, `pie_state` |
| Blueprint | `create_blueprint`, `add_component_to_blueprint`, `compile_blueprint`, `get_blueprint_summary`, `get_blueprint_diagnostics` |
| Grafo | `add_enhanced_input_action_node`, `connect_nodes`, `disconnect_pins`, `delete_blueprint_node`, `add_is_valid_guard` |
| Conteúdo | materiais, componentes, colisão, widgets, sockets e propriedades de Blueprint |

Consulte sempre `get_command_schema` no Editor em execução: ela é a fonte de verdade da versão instalada.

## 8. Limpeza e relatório

Mantenha todos os assets de teste em `/Game/MCPTests/`. Ao fim, salve um relatório contendo:

- versão do plugin e do UE;
- lista de comandos e JSONs enviados;
- respostas recebidas;
- assets criados e seus caminhos;
- resultado de compilação, diagnóstico, Map Check e PIE;
- falhas, tentativas de recuperação e limitações.

Não exclua arquivos `.uasset` pelo Explorer enquanto o Editor estiver aberto. Faça a limpeza pelo Content Browser ou implemente um comando MCP de remoção de asset com confirmação explícita.

## Referência de evidências anteriores

O histórico de testes e defeitos reproduzidos está em [RELATORIO_TESTE_INTEGRACAO_UNREALMCP_2026-07-15.md](RELATORIO_TESTE_INTEGRACAO_UNREALMCP_2026-07-15.md).
