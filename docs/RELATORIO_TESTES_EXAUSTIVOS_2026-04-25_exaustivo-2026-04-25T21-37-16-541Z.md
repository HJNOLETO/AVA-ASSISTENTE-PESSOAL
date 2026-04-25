# Relatorio de Testes Exaustivos AVA CLI - 2026-04-25T21:40:29.702Z

Run ID: `exaustivo-2026-04-25T21-37-16-541Z`
Modelos testados: `qwen3.5:397b-cloud`
Timeout por tentativa: 180000ms
Retries por modelo: 2

## Resultado geral

- Aprovados: 8
- Falhos: 1
- Ignorados: 1
- Total: 10

## Detalhes por cenario

### T01 - Autodiagnostico operacional
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 29886ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Autodiagnostico executado.

### T02 - Criacao de lembrete
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 11178ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Lembrete criado e rastreado.

### T03 - Listagem de lembretes
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 15795ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Listagem confirmou lembrete criado.

### T04 - Criacao de pasta/arquivo
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 14427ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Arquivo criado na whitelist.

### T05 - Copia de arquivo
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 15654ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Arquivo copiado com sucesso.

### T06 - Renomeacao de arquivo
- Status: failed
- Tentativas: 2
- Modelo: qwen3.5:397b-cloud
- Duracao: 34401ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Tentativa 2/2 com modelo qwen3.5:397b-cloud
- Nota: [AVA Agent]: Iniciando loop autônomo. Provedor: OLLAMA...
[AVA Agent]: Tarefa Recebida: "Renomeie o arquivo C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\data\testes-exaustivos\exaustivo-2026-04-25T21-37-16-541Z\nota-copia.txt para nota-renomeada.txt usando a acao renomear_arquivo."

[Database] Triggers and views initialized
[TaskQueue] Processo [invokeLLM/ollama] entrou na Fila. Tamanho da fila: 1
[TaskQueue] Iniciando Processo [invokeLLM/ollama] da fila. Tempo na espera: 0 ms
[LLM] Conectando ao Ollama: http://localhost:11434/api/chat
[LLM] Modelo: qwen3.5:397b-cloud
[LLM][Adaptive] perfil=balanced | modelo=qwen3.5:397b-cloud | num_ctx=4096 | num_predict=768 | motivo=forcado por AVA_OLLAMA_PROFILE=balanced
[LLM] Resposta Ollama recebida (546 caracteres)
[TaskQueue] Tarefa Concluida. Resolvendo proxima da Fila...
[SYS] Executando Ferramenta Nativa: ==> sistema_de_arquivos
[TaskQueue] Processo [invokeLLM/ollama] entrou na Fila. Tamanho da fila: 1
[TaskQueue] Iniciando Processo [invokeLLM/ollama] da fila. Tempo na espera: 0 ms
[LLM] Conectando ao Ollama: http://localhost:11434/api/chat
[LLM] Modelo: qwen3.5:397b-cloud
[LLM][Adaptive] perfil=balanced | modelo=
... [truncado]

### T07 - Exclusao com confirmacao explicita
- Status: passed
- Tentativas: 2
- Modelo: qwen3.5:397b-cloud
- Duracao: 32906ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Erro fatal detectado com modelo qwen3.5:397b-cloud
- Nota: Tentativa 2/2 com modelo qwen3.5:397b-cloud
- Nota: Exclusao confirmada e concluida.

### T08 - Busca web
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 17977ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Busca web retornou resultados.

### T09 - Extracao estruturada de pagina
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 12877ms
- Nota: Tentativa 1/2 com modelo qwen3.5:397b-cloud
- Nota: Extracao estruturada executada.

### T10/T11 - Cofre seguro
- Status: skipped
- Tentativas: 0
- Duracao: 0ms
- Nota: Ignorado: AVA_VAULT_MASTER_KEY nao configurada.

