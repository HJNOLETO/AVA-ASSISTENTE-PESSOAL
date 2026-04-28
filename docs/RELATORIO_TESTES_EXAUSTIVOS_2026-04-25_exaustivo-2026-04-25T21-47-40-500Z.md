# Relatorio de Testes Exaustivos AVA CLI - 2026-04-25T22:05:48.415Z

Run ID: `exaustivo-2026-04-25T21-47-40-500Z`
Modelos testados: `minimax-m2.7:cloud`
Timeout por tentativa: 180000ms
Retries por modelo: 2

## Resultado geral

- Aprovados: 4
- Falhos: 5
- Ignorados: 1
- Total: 10

## Detalhes por cenario

### T01 - Autodiagnostico operacional
- Status: passed
- Tentativas: 1
- Modelo: minimax-m2.7:cloud
- Duracao: 38022ms
- Nota: Tentativa 1/2 com modelo minimax-m2.7:cloud
- Nota: Autodiagnostico executado.

### T02 - Criacao de lembrete
- Status: passed
- Tentativas: 1
- Modelo: minimax-m2.7:cloud
- Duracao: 46212ms
- Nota: Tentativa 1/2 com modelo minimax-m2.7:cloud
- Nota: Lembrete criado e rastreado.

### T03 - Listagem de lembretes
- Status: passed
- Tentativas: 1
- Modelo: minimax-m2.7:cloud
- Duracao: 33931ms
- Nota: Tentativa 1/2 com modelo minimax-m2.7:cloud
- Nota: Listagem confirmou lembrete criado.

### T04 - Criacao de pasta/arquivo
- Status: failed
- Tentativas: 1
- Modelo: minimax-m2.7:cloud
- Duracao: 34534ms
- Nota: Tentativa 1/2 com modelo minimax-m2.7:cloud
- Nota: [AVA Agent]: Iniciando loop autônomo. Provedor: OLLAMA...
[AVA Agent]: Tarefa Recebida: "Crie a pasta C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\data\testes-exaustivos\exaustivo-2026-04-25T21-47-40-500Z e depois crie o arquivo C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\data\testes-exaustivos\exaustivo-2026-04-25T21-47-40-500Z\nota.txt com conteudo: teste exaustivo exaustivo-2026-04-25T21-47-40-500Z."

[Database] Triggers and views initialized
[TaskQueue] Processo [invokeLLM/ollama] entrou na Fila. Tamanho da fila: 1
[TaskQueue] Iniciando Processo [invokeLLM/ollama] da fila. Tempo na espera: 0 ms
[LLM] Conectando ao Ollama: http://localhost:11434/api/chat
[LLM] Modelo: minimax-m2.7:cloud
[LLM][Adaptive] perfil=balanced | modelo=minimax-m2.7:cloud | num_ctx=4096 | num_predict=768 | motivo=forcado por AVA_OLLAMA_PROFILE=balanced
[LLM] Resposta Ollama recebida (0 caracteres)
[TaskQueue] Tarefa Concluida. Resolvendo proxima da Fila...
[SYS] Executando Ferramenta Nativa: ==> criar_pasta
[TaskQueue] Processo [invokeLLM/ollama] entrou na Fila. Tamanho da fila: 1
[TaskQueue] Iniciando Processo [invokeLLM/ollama] da fila. Tempo na espera:
... [truncado]

### T05 - Copia de arquivo
- Status: failed
- Tentativas: 2
- Duracao: 116356ms
- Nota: Tentativa 1/2 com modelo minimax-m2.7:cloud
- Nota: Erro fatal detectado com modelo minimax-m2.7:cloud
- Nota: Tentativa 2/2 com modelo minimax-m2.7:cloud
- Nota: Erro fatal detectado com modelo minimax-m2.7:cloud

### T06 - Renomeacao de arquivo
- Status: failed
- Tentativas: 2
- Duracao: 50325ms
- Nota: Tentativa 1/2 com modelo minimax-m2.7:cloud
- Nota: Erro fatal detectado com modelo minimax-m2.7:cloud
- Nota: Tentativa 2/2 com modelo minimax-m2.7:cloud
- Nota: Erro fatal detectado com modelo minimax-m2.7:cloud

### T07 - Exclusao com confirmacao explicita
- Status: failed
- Tentativas: 2
- Duracao: 41222ms
- Nota: Tentativa 1/2 com modelo minimax-m2.7:cloud
- Nota: Tentativa 2/2 com modelo minimax-m2.7:cloud

### T08 - Busca web
- Status: passed
- Tentativas: 2
- Modelo: minimax-m2.7:cloud
- Duracao: 350390ms
- Nota: Tentativa 1/2 com modelo minimax-m2.7:cloud
- Nota: Timeout com modelo minimax-m2.7:cloud (duracao 180018ms)
- Nota: Tentativa 2/2 com modelo minimax-m2.7:cloud
- Nota: Busca web retornou resultados.

### T09 - Extracao estruturada de pagina
- Status: failed
- Tentativas: 2
- Duracao: 368777ms
- Nota: Tentativa 1/2 com modelo minimax-m2.7:cloud
- Nota: Timeout com modelo minimax-m2.7:cloud (duracao 180015ms)
- Nota: Tentativa 2/2 com modelo minimax-m2.7:cloud
- Nota: Timeout com modelo minimax-m2.7:cloud (duracao 180014ms)

### T10/T11 - Cofre seguro
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado: AVA_VAULT_MASTER_KEY nao configurada.


