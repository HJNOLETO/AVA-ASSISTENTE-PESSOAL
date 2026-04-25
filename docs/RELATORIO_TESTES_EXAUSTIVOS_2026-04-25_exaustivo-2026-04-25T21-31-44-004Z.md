# Relatorio de Testes Exaustivos AVA CLI - 2026-04-25T21:35:12.207Z

Run ID: `exaustivo-2026-04-25T21-31-44-004Z`
Modelos testados: `qwen3.5:397b-cloud`
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
- Modelo: qwen3.5:397b-cloud
- Duracao: 67137ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Autodiagnostico executado.

### T02 - Criacao de lembrete
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 11134ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Lembrete criado e rastreado.

### T03 - Listagem de lembretes
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 14468ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Listagem confirmou lembrete criado.

### T04 - Criacao de pasta/arquivo
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 14529ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Arquivo criado na whitelist.

### T05 - Copia de arquivo
- Status: failed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 14137ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: [AVA Agent]: Iniciando loop autônomo. Provedor: OLLAMA...
[AVA Agent]: Tarefa Recebida: "Copie o arquivo C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\data\testes-exaustivos\exaustivo-2026-04-25T21-31-44-004Z\nota.txt para C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\data\testes-exaustivos\exaustivo-2026-04-25T21-31-44-004Z\nota-copia.txt."

[Database] Triggers and views initialized
[TaskQueue] Processo [invokeLLM/ollama] entrou na Fila. Tamanho da fila: 1
[TaskQueue] Iniciando Processo [invokeLLM/ollama] da fila. Tempo na espera: 1 ms
[LLM] Conectando ao Ollama: http://localhost:11434/api/chat
[LLM] Modelo: qwen3.5:397b-cloud
[LLM][Adaptive] perfil=balanced | modelo=qwen3.5:397b-cloud | num_ctx=4096 | num_predict=768 | motivo=forcado por AVA_OLLAMA_PROFILE=balanced
[LLM] Resposta Ollama recebida (0 caracteres)
[TaskQueue] Tarefa Concluida. Resolvendo proxima da Fila...
[SYS] Executando Ferramenta Nativa: ==> sistema_de_arquivos
[TaskQueue] Processo [invokeLLM/ollama] entrou na Fila. Tamanho da fila: 1
[TaskQueue] Iniciando Processo [invokeLLM/ollama] da fila. Tempo na espera: 0 ms
[LLM] Conectando ao Ollama: http://localhost:11434/a
... [truncado]

### T06 - Renomeacao de arquivo
- Status: failed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 13830ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: [AVA Agent]: Iniciando loop autônomo. Provedor: OLLAMA...
[AVA Agent]: Tarefa Recebida: "Renomeie o arquivo C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\data\testes-exaustivos\exaustivo-2026-04-25T21-31-44-004Z\nota-copia.txt para nota-renomeada.txt."

[Database] Triggers and views initialized
[TaskQueue] Processo [invokeLLM/ollama] entrou na Fila. Tamanho da fila: 1
[TaskQueue] Iniciando Processo [invokeLLM/ollama] da fila. Tempo na espera: 0 ms
[LLM] Conectando ao Ollama: http://localhost:11434/api/chat
[LLM] Modelo: qwen3.5:397b-cloud
[LLM][Adaptive] perfil=balanced | modelo=qwen3.5:397b-cloud | num_ctx=4096 | num_predict=768 | motivo=forcado por AVA_OLLAMA_PROFILE=balanced
[LLM] Resposta Ollama recebida (64 caracteres)
[TaskQueue] Tarefa Concluida. Resolvendo proxima da Fila...
[SYS] Executando Ferramenta Nativa: ==> sistema_de_arquivos
[TaskQueue] Processo [invokeLLM/ollama] entrou na Fila. Tamanho da fila: 1
[TaskQueue] Iniciando Processo [invokeLLM/ollama] da fila. Tempo na espera: 1 ms
[LLM] Conectando ao Ollama: http://localhost:11434/api/chat
[LLM] Modelo: qwen3.5:397b-cloud
[LLM][Adaptive] perfil=balanced | modelo=qwen3.5:397b-cloud | num_ctx=409
... [truncado]

### T07 - Exclusao com confirmacao explicita
- Status: failed
- Tentativas: 2
- Duracao: 32550ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Erro fatal detectado com modelo qwen3.5:397b-cloud
- Nota: Tentativa 2/2 com modelo qwen3.5:397b-cloud
- Nota: Erro fatal detectado com modelo qwen3.5:397b-cloud

### T08 - Busca web
- Status: failed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 16765ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: [AVA Agent]: Iniciando loop autônomo. Provedor: OLLAMA...
[AVA Agent]: Tarefa Recebida: "Busque na web: site oficial do STJ Brasil e mostre 3 resultados."

[Database] Triggers and views initialized
[TaskQueue] Processo [invokeLLM/ollama] entrou na Fila. Tamanho da fila: 1
[TaskQueue] Iniciando Processo [invokeLLM/ollama] da fila. Tempo na espera: 0 ms
[LLM] Conectando ao Ollama: http://localhost:11434/api/chat
[LLM] Modelo: qwen3.5:397b-cloud
[LLM][Adaptive] perfil=balanced | modelo=qwen3.5:397b-cloud | num_ctx=4096 | num_predict=768 | motivo=forcado por AVA_OLLAMA_PROFILE=balanced
[LLM] Resposta Ollama recebida (0 caracteres)
[TaskQueue] Tarefa Concluida. Resolvendo proxima da Fila...
[SYS] Executando Ferramenta Nativa: ==> buscar_web
[TaskQueue] Processo [invokeLLM/ollama] entrou na Fila. Tamanho da fila: 1
[TaskQueue] Iniciando Processo [invokeLLM/ollama] da fila. Tempo na espera: 0 ms
[LLM] Conectando ao Ollama: http://localhost:11434/api/chat
[LLM] Modelo: qwen3.5:397b-cloud
[LLM][Adaptive] perfil=balanced | modelo=qwen3.5:397b-cloud | num_ctx=4096 | num_predict=768 | motivo=forcado por AVA_OLLAMA_PROFILE=balanced
[LLM] Resposta Ollama recebida (162 caracteres)
[TaskQueue] Tar
... [truncado]

### T09 - Extracao estruturada de pagina
- Status: failed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 15087ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: [AVA Agent]: Iniciando loop autônomo. Provedor: OLLAMA...
[AVA Agent]: Tarefa Recebida: "Extraia conteudo estruturado de https://www.gov.br e retorne os campos url, titulo e links."

[Database] Triggers and views initialized
[TaskQueue] Processo [invokeLLM/ollama] entrou na Fila. Tamanho da fila: 1
[TaskQueue] Iniciando Processo [invokeLLM/ollama] da fila. Tempo na espera: 0 ms
[LLM] Conectando ao Ollama: http://localhost:11434/api/chat
[LLM] Modelo: qwen3.5:397b-cloud
[LLM][Adaptive] perfil=balanced | modelo=qwen3.5:397b-cloud | num_ctx=4096 | num_predict=768 | motivo=forcado por AVA_OLLAMA_PROFILE=balanced
[LLM] Resposta Ollama recebida (0 caracteres)
[TaskQueue] Tarefa Concluida. Resolvendo proxima da Fila...
[SYS] Executando Ferramenta Nativa: ==> extrair_conteudo_estruturado
[TaskQueue] Processo [invokeLLM/ollama] entrou na Fila. Tamanho da fila: 1
[TaskQueue] Iniciando Processo [invokeLLM/ollama] da fila. Tempo na espera: 0 ms
[LLM] Conectando ao Ollama: http://localhost:11434/api/chat
[LLM] Modelo: qwen3.5:397b-cloud
[LLM][Adaptive] perfil=balanced | modelo=qwen3.5:397b-cloud | num_ctx=4096 | num_predict=768 | motivo=forcado por AVA_OLLAMA_PROFILE=balanced
[LLM] Resposta Oll
... [truncado]

### T10/T11 - Cofre seguro
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado: AVA_VAULT_MASTER_KEY nao configurada.

