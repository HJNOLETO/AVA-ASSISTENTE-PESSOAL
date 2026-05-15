# Relatorio de Testes Exaustivos AVA CLI - 2026-05-09T15:10:43.445Z

Run ID: `exaustivo-2026-05-09T15-02-19-308Z`
Modelos testados: `gemma4:31b-cloud`
Timeout por tentativa: 180000ms
Retries por modelo: 1

## Resultado geral

- Aprovados: 2
- Falhos: 4
- Ignorados: 14
- Total: 20

## Detalhes por cenario

### T01 - Autodiagnostico operacional
- Status: failed
- Tentativas: 1
- Duracao: 138474ms
- Nota: Tentativa 1/1 com modelo gemma4:31b-cloud
- Nota: Timeout com modelo gemma4:31b-cloud (duracao 137736ms)

### T02 - Criacao de lembrete
- Status: failed
- Tentativas: 1
- Duracao: 180343ms
- Nota: Tentativa 1/1 com modelo gemma4:31b-cloud
- Nota: Timeout com modelo gemma4:31b-cloud (duracao 180020ms)

### T03 - Listagem de lembretes
- Status: failed
- Tentativas: 1
- Duracao: 180834ms
- Nota: Tentativa 1/1 com modelo gemma4:31b-cloud
- Nota: Timeout com modelo gemma4:31b-cloud (duracao 180021ms)

### T04 - Criacao de pasta/arquivo
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T05 - Copia de arquivo
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T06 - Renomeacao de arquivo
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T07 - Exclusao com confirmacao explicita
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T08 - Busca web
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T09 - Extracao estruturada de pagina
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T10 - Cofre seguro
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T11 - Listagem de cofre
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T12 - Mentor Socratico: iniciar sessao de estudo
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T13 - Mentor Socratico: listar modulos de estudo
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T14 - Mentor Socratico: verificar revisoes pendentes
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T15 - Identidade unificada CLI==Telegram
- Status: failed
- Tentativas: 0
- Duracao: 0ms
- Nota: IDs divergentes ou ausentes: AVA_CLI_USER_ID='' vs TELEGRAM_STUDY_USER_ID='1'. Defina ambos com o mesmo valor no .env.

### T16 - Persistencia multi-canal (log unificado)
- Status: passed
- Tentativas: 0
- Duracao: 0ms
- Nota: Log unificado presente em data/ava-unified-audit.log. Canal tag detectada: true.

### T17 - Motor unificado via Gemini: auto-status
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T18 - Git status operacional
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T19 - RAG juridico: busca de documentos
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado por AVA_TEST_MAX_SCENARIOS=3

### T20 - ToolRegistry ESM: ausencia de require error
- Status: passed
- Tentativas: 0
- Duracao: 0ms
- Nota: Sem erros ESM de require() no ToolRegistry. Compilacao ESM estavel.

