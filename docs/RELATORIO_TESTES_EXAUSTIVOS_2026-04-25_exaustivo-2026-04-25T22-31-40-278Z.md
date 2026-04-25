# Relatorio de Testes Exaustivos AVA CLI - 2026-04-25T22:36:00.039Z

Run ID: `exaustivo-2026-04-25T22-31-40-278Z`
Modelos testados: `qwen3.5:397b-cloud`
Timeout por tentativa: 180000ms
Retries por modelo: 3

## Resultado geral

- Aprovados: 10
- Falhos: 1
- Ignorados: 0
- Total: 11

## Detalhes por cenario

### T01 - Autodiagnostico operacional
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 17533ms
- Nota: Tentativa 1/3 com modelo qwen3.5:397b-cloud
- Nota: Autodiagnostico executado.

### T02 - Criacao de lembrete
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 15427ms
- Nota: Tentativa 1/3 com modelo qwen3.5:397b-cloud
- Nota: Lembrete criado e rastreado.

### T03 - Listagem de lembretes
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 29944ms
- Nota: Tentativa 1/3 com modelo qwen3.5:397b-cloud
- Nota: Listagem confirmou lembrete criado.

### T04 - Criacao de pasta/arquivo
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 14162ms
- Nota: Tentativa 1/3 com modelo qwen3.5:397b-cloud
- Nota: Arquivo criado na whitelist.

### T05 - Copia de arquivo
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 20259ms
- Nota: Tentativa 1/3 com modelo qwen3.5:397b-cloud
- Nota: Arquivo copiado com sucesso.

### T06 - Renomeacao de arquivo
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 12572ms
- Nota: Tentativa 1/3 com modelo qwen3.5:397b-cloud
- Nota: Arquivo renomeado com sucesso.

### T07 - Exclusao com confirmacao explicita
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 11880ms
- Nota: Tentativa 1/3 com modelo qwen3.5:397b-cloud
- Nota: Exclusao confirmada e concluida.

### T08 - Busca web
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 16975ms
- Nota: Tentativa 1/3 com modelo qwen3.5:397b-cloud
- Nota: Busca web retornou resultados.

### T09 - Extracao estruturada de pagina
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 17429ms
- Nota: Tentativa 1/3 com modelo qwen3.5:397b-cloud
- Nota: Extracao estruturada executada.

### T10 - Cofre seguro
- Status: failed
- Tentativas: 3
- Duracao: 76480ms
- Nota: Tentativa 1/3 com modelo qwen3.5:397b-cloud
- Nota: Erro fatal detectado com modelo qwen3.5:397b-cloud
- Nota: Tentativa 2/3 com modelo qwen3.5:397b-cloud
- Nota: Erro fatal detectado com modelo qwen3.5:397b-cloud
- Nota: Tentativa 3/3 com modelo qwen3.5:397b-cloud
- Nota: Erro fatal detectado com modelo qwen3.5:397b-cloud

### T11 - Listagem de cofre
- Status: passed
- Tentativas: 1
- Modelo: qwen3.5:397b-cloud
- Duracao: 16206ms
- Nota: Tentativa 1/3 com modelo qwen3.5:397b-cloud
- Nota: Listagem do cofre confirmou metadados.

