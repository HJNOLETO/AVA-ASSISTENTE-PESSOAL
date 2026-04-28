# Relatorio de Execucao - Testes Praticos AVA CLI (2026-04-27)

Base de referencia: `docs/RELATORIO_TESTES_PRATICOS_2026-04-23.md` e `docs/GUIA_TESTES_PRATICOS_AVA_CLI.md`.

## Resultado geral

- Executado com foco em `Ollama Cloud` via `ava-cli-runtime`.
- Erros reproduzidos e corrigidos nesta rodada:
  1. `ask-ava.sh` quebrado por comando duplicado de `npx` dentro do container.
  2. Loop de tool calls com alguns modelos cloud (`minimax-m2.7:cloud`) sem resposta textual final.
  3. Whitelist de escrita falhando no Docker por caminhos Windows em variaveis de ambiente dentro de container Linux.

## Modelos Ollama verificados

- `qwen3.5:397b-cloud`: respondeu com sucesso nos cenarios testados.
- `minimax-m2.7:cloud`: reproduziu loop de tool call em `obter_data_hora` (corrigido por guard de repeticao).
- `kimi-k2.6:cloud`: retornou `403` (modelo requer assinatura no ambiente atual).

## Casos executados (rodada 2026-04-27)

### 0.1 Prompt simples (`que horas sao?`)

- Status: aprovado em `qwen3.5:397b-cloud`.
- Evidencia: `TOOL_CALL obter_data_hora` seguido de resposta final textual.

### 1.1 Criar arquivo dentro da whitelist (`data/testes/cloud-nota.txt`)

- Status: aprovado apos ajuste de ambiente Docker.
- Evidencia em log:
  - `TOOL_CALL criar_arquivo`
  - `FILE_OP criar_arquivo | /app/data/testes/cloud-nota.txt`

### 1.2 Escrita fora da whitelist (`C:\Windows\Temp\...`)

- Status: aprovado (bloqueio de seguranca mantido).
- Evidencia em log:
  - `EXECUTION_GUARD | Bloqueio anti-simulacao | ... tool_calls=0`

### 1.3 Apagar arquivo sem confirmacao explicita

- Status: aprovado (bloqueio ativo).
- Evidencia em log:
  - `TOOL_CALL apagar_arquivo ... confirmado=true`
  - erro de confirmacao obrigatoria
  - `EXECUTION_GUARD`

### 1.5 Extrair conteudo estruturado (`https://www.gov.br`)

- Status: aprovado.
- Evidencia em log:
  - `TOOL_CALL extrair_conteudo_estruturado`
  - `LLM_RESPONSE` com resumo estruturado.

## Correcoes aplicadas nesta rodada

1. `ask-ava.sh`
   - removido comando invalido (`npx` duplicado)
   - alinhado com `ava-cli-runtime ask "$@"`
   - mantido fallback em cadeia (Ollama -> modelo leve -> Gemini)

2. `cli/index.ts`
   - adicionado guard de repeticao de batch de tool calls
   - quando o modelo repete a mesma tool sem convergir, o CLI interrompe o loop e responde com consolidacao
   - auditoria adicionada: `EXECUTION_GUARD | Loop de tool call interrompido`

3. `docker-compose.cli.yml`
   - definido `AVA_WORKSPACE_DIRS` para caminhos internos do container (`/app;/app/data`)
   - definido `AVA_READONLY_DIRS` para caminhos internos (`/app/docs;/app/.agent;/app/.opencode`)
   - evita falso bloqueio de whitelist em runtime Docker Linux.

## Logs acompanhados

- Arquivo principal da rodada: `C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main-dados\ava-cli-audit.log`
- Novas evidencias relevantes:
  - `EXECUTION_GUARD | Loop de tool call interrompido | tool=obter_data_hora | repeticoes=3`
  - `FILE_OP | criar_arquivo | /app/data/testes/cloud-nota.txt`

## Pendencias restantes para homologacao completa

- Executar cenarios Telegram interativos reais (`/resumo`, mensagem livre, `/cli`) com `OLLAMA` cloud como provider de texto do bot.
- Avaliar prompt/tool-policy para reduzir chamadas redundantes de ferramentas em prompts operacionais longos.

## Performance observada (antes/depois)

### Melhora confirmada

- Caso de loop em `obter_data_hora` com `minimax-m2.7:cloud` melhorou de forma objetiva.
  - Antes do guard: ate `15` ciclos de tool call e encerramento por limitador (`fallbackCounter`), sem convergencia confiavel.
  - Depois do guard: interrupcao controlada em `3` repeticoes e resposta consolidada ao usuario.
- Evidencia em auditoria:
  - `EXECUTION_GUARD | Loop de tool call interrompido | tool=obter_data_hora | repeticoes=3`

### Sem melhora conclusiva (ou comportamento ainda inconsistente)

- Em prompts operacionais mais longos, alguns modelos cloud ainda oscilam entre:
  - chamar ferramenta correta e concluir;
  - nao chamar ferramenta e cair em `EXECUTION_GUARD` (anti-simulacao).
- Em alguns cenarios, a resposta final veio em blocos (duas saidas sequenciais), indicando possivel fragilidade de fechamento de resposta em respostas longas.

## Analise objetiva - pontos positivos e negativos

### Pontos positivos

- Maior resiliencia operacional no CLI:
  - loop de tool call deixou de ficar ate o limite maximo em casos repetitivos;
  - usuario recebe retorno explicito em vez de "silencio" operacional.
- Seguranca mantida:
  - bloqueios de whitelist continuaram ativos;
  - delete sem confirmacao explicita continuou bloqueado.
- Compatibilidade Docker corrigida para sandbox:
  - `AVA_WORKSPACE_DIRS` e `AVA_READONLY_DIRS` alinhados ao path Linux do container.
- UX de erro melhorada:
  - para `403` de modelo cloud sem permissao, o AVA agora informa causa e sugere modelo local (`llama3.2:3b`) ou cloud autorizado.

### Pontos negativos

- Ainda existe variabilidade alta entre modelos cloud na taxa de conclusao de fluxo tool->resposta.
- Modelo cloud sem permissao (`403`) pode confundir usuario sem fallback automatico para local por padrao no comando atual.
- Em ambiente local, houve casos de alta latencia/timeout no `api/chat` com `stream=false` para `llama3.2:3b`, apesar de `ollama run` funcionar no shell em outros modelos.

## LLM local vs cloud (insight importante)

- Foi observado que o problema nao e apenas "modelo indisponivel":
  - `ollama run minimax-m2.7:cloud` no PowerShell respondeu normalmente;
  - no AVA CLI, parte das falhas veio de orquestracao (loop, falta de convergencia, timeout de fluxo), nao apenas conectividade.
- Para modelo local `llama3.2:3b`, houve timeout em algumas chamadas via AVA/API direta durante esta rodada.
  - Hipotese tecnica: combinacao de perfil/parametros (ex.: `num_ctx`, `num_predict`) + estado de carga/memoria do host + ausencia de streaming no caminho atual.

## Scripts e comandos que geram os relatorios

### Relatorio pratico (`RELATORIO_TESTES_PRATICOS_2026-04-27.md`)

- Este relatorio foi gerado a partir de execucao manual orientada (nao por script unico dedicado), combinando:
  - comandos `docker compose ... ava-cli-runtime ask ...`;
  - comando `npx tsx cli/index.ts ask ...` no host;
  - leitura do audit log (`ava-cli-audit.log`) para evidencias.

### Relatorios exaustivos (automatizados)

- Script principal de carga/robustez: `scripts/test-ava-cli-exaustivo.ts`.
- Execucao padrao: `pnpm test:ava-cli:exaustivo`.
- Saida automatica: `docs/RELATORIO_TESTES_EXAUSTIVOS_<data>_<runid>.md`.
- O script mede tentativas, timeout, retries, duracao por cenario e consolida aprovado/falho/ignorado.

## Possiveis melhorias (proxima iteracao)

1. Implementar fallback automatico de modelo no `ask`:
   - em `403` cloud, cair automaticamente para `llama3.2:3b` antes de encerrar.
2. Adicionar budget de tool calls por tipo:
   - ex.: no maximo 2 chamadas iguais consecutivas para `obter_data_hora` antes de consolidar.
3. Instrumentar metricas de latencia no audit:
   - tempo de `invokeLLM` por chamada, por modelo, por prompt (p50/p95 por rodada).
4. Adicionar modo `stream=true` opcional para Ollama em tarefas longas:
   - pode reduzir timeout percebido e melhorar fechamento de resposta.
5. Criar script dedicado de testes praticos:
   - ex.: `scripts/test-ava-cli-pratico.ts` para reproduzir exatamente os casos 0.1, 1.1, 1.2, 1.3, 1.5 com saida padronizada.

## Informacoes adicionais relevantes ao usuario

- O ambiente estava com alteracoes paralelas (db/state/log) durante os testes; isso pode introduzir ruido de performance entre rodadas.
- O caso `kimi-k2.6:cloud` falhou por permissao/plano, nao por bug local do AVA.
- Para comparacoes justas de performance, recomenda-se fixar:
  - modelo unico por rodada,
  - mesmos timeouts,
  - mesmo perfil `AVA_OLLAMA_PROFILE`,
  - host sem concorrencia pesada de outros processos LLM.
