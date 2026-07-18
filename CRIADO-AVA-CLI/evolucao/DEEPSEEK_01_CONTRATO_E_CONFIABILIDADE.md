# DeepSeek V4 Pro — Etapa 1: contrato e confiabilidade do MCP

Você está trabalhando no plugin `Plugins/UnrealMCP` de um projeto Unreal Engine 5.6. A ponte TCP já responde a `ping`, aceita JSON com `command` e também existe legado com `type`. Fortaleça a camada de protocolo antes de acrescentar recursos de gameplay.

## Objetivo

Fazer com que cada solicitação MCP tenha formato, ciclo de vida, erro e rastreabilidade previsíveis. Uma falha não pode travar a conexão nem deixar o editor sem resposta.

## Implementar

1. Definir e documentar o envelope de requisição:

```json
{"id":"uuid-ou-texto","command":"nome","params":{}}
```

2. Definir envelope de resposta para **todos** os comandos:

```json
{"id":"...","status":"success|error","result":{},"error":{"code":"...","message":"...","details":{}}}
```

`error` pode ser omitido em sucesso. Nunca retornar texto solto quando a entrada é JSON.

3. Validar JSON, campos obrigatórios, tipos de `params`, comando desconhecido e exceções. Erros devem informar o comando e o campo inválido sem expor caminhos desnecessários.
4. Implementar framing robusto para TCP: uma requisição por linha (`\n`), leitura parcial e múltiplas linhas no mesmo pacote. Não executar JSON incompleto.
5. Evitar bloqueio por cliente desconectado ou inativo: timeout de leitura razoável, fechamento limpo e capacidade de aceitar a próxima conexão.
6. Adicionar `health` ou `get_server_info`, retornando versão do plugin, versão do protocolo, UE, estado do servidor e lista/resumo de comandos registrados.
7. Manter `ping` compatível e incluir `id` na resposta quando ele existir na requisição.
8. Registrar no Output Log somente: recebimento, id, comando, duração, sucesso/erro. Não registrar o JSON completo se ele puder conter dados extensos.

## Critérios de aceite

- `ping` e `health` respondem com JSON válido.
- JSON malformado, comando inexistente e parâmetros inválidos retornam `status:error`, sem fechar indevidamente o servidor.
- Duas requisições enviadas no mesmo pacote são ambas processadas.
- Uma requisição deliberadamente fragmentada entre dois envios é processada uma única vez após o terminador de linha.
- Depois de um cliente desconectar, outro consegue enviar `ping`.
- O módulo compila para `ProjetoGTAEditor Win64 Development`.

## Entrega exigida

Não comece a Etapa 2. Entregue um Markdown com arquivos alterados, decisões de compatibilidade, testes efetuados e trechos exatos do Output Log.
