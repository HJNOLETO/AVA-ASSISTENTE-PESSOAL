# Relatório de teste integrado — UnrealMCP

**Data:** 15/07/2026  
**Editor:** Unreal Engine 5.6.1  
**Servidor:** `127.0.0.1:55557`  
**Plugin informado pelo servidor:** UnrealMCP 1.0.0; 86 comandos

## Resultado

O servidor, o protocolo, a criação de Blueprint, a inspeção, a compilação, o diagnóstico e o ciclo de início de PIE foram comprovados em um Editor real. O plugin **não está aprovado integralmente** ainda, pois há dois defeitos reproduzíveis que impedem a garantia de testes isolados e de parada determinística de PIE.

## Evidências aprovadas

| Verificação | Resultado |
|---|---|
| `health` | Sucesso; resposta estruturada, UE 5.6, porta 55557, 86 comandos |
| Comando desconhecido | Retornou `status:error` e `UNKNOWN_COMMAND` |
| `pie_state` | Retornou estado estruturado |
| `get_command_schema` | Retornou 86 comandos |
| Criação de Blueprint | Criou `BP_MCP_IntegrationTest`, classe pai `Actor` |
| `get_blueprint_summary` | Leu componentes, graphs e estado de compilação |
| `compile_blueprint` | Sucesso, `has_errors:false`, duração 81 ms |
| `get_blueprint_diagnostics` | 0 erros, 0 avisos, 0 nós órfãos, 0 pinos soltos |
| `run_map_check` | Retornou dois problemas estruturados do nível atual |
| `validate_project` | Plugin habilitado; estado válido; 0 erros/avisos retornados |
| PIE | `pie_start` chegou a `running`; segunda chamada de `pie_stop` levou a `stopped` |
| `create_test_report` | Retornou snapshot da sessão e contador de comandos |

## Defeitos reproduzíveis

### 1. `create_blueprint` ignora `save_path`

**Requisição enviada:**

```json
{"command":"create_blueprint","params":{"name":"BP_MCP_IntegrationTest","save_path":"/Game/MCPTests/","parent_class":"Actor"}}
```

**Esperado:** `/Game/MCPTests/BP_MCP_IntegrationTest`.

**Resultado recebido:** `/Game/Blueprints/BP_MCP_IntegrationTest`.

**Impacto:** a IA não consegue isolar os assets de teste; pode poluir conteúdo de produção. O comando não deve declarar sucesso com caminho diferente do solicitado.

**Correção exigida:** aceitar e validar `save_path` (ou documentar o nome correto do parâmetro), criar exatamente no pacote solicitado e retornar erro quando o caminho for inválido. Criar teste de integração que compare o caminho solicitado ao caminho retornado.

### 2. `pie_stop` retorna sucesso antes de PIE encerrar

**Sequência observada:**

1. `pie_start` → `state:starting`.
2. Após dois segundos, `pie_state` → `running`.
3. `pie_stop` → `state:stopping`, `status:success`.
4. Após seis segundos, `pie_state` ainda → `running`.
5. Uma segunda chamada de `pie_stop`, seguida de três segundos, resultou em `pie_state:stopped`.

**Impacto:** uma IA pode iniciar outro teste, editar o mundo ou relatar fim de execução enquanto PIE ainda está ativo.

**Correção exigida:** `pie_stop` deve aguardar o encerramento real (com timeout e erro explícito), ou retornar `accepted:true`, `completed:false` e exigir polling documentado. O comportamento atual não pode retornar simplesmente `success` como se a parada estivesse concluída.

## Observações do Map Check

O nível atual `TestMap` retornou:

- `GameplayDebuggerPlayerManager_0`: Actor has no root component.
- `ChaosDebugDrawActor`: Actor has no root component.

Esses itens não foram causados pelo Blueprint de teste e devem ser classificados pelo plugin como atores temporários/de ferramentas, ou investigados separadamente.

## Artefatos criados

- `BP_MCP_IntegrationTest` foi criado em `/Game/Blueprints/` devido ao defeito acima.
- `BP_AVA_SmokeTest` já existia em `/Game/Blueprints/` antes desta rodada.

Não excluir esses assets manualmente até a correção do comando de caminho ou até uma decisão explícita de limpeza. Depois da correção, os dois devem ser movidos para `/Game/MCPTests/` ou removidos de forma controlada.

## Critério para aprovação final

Após corrigir os dois defeitos, repetir:

1. Criar um Blueprint somente em `/Game/MCPTests/` e confirmar o pacote retornado.
2. Fazer `pie_start` → aguardar `running` → uma chamada de `pie_stop` → aguardar/confirmar `stopped`.
3. Reexecutar compilação, diagnóstico e `run_map_check`.
4. Anexar as respostas JSON reais ao relatório.
