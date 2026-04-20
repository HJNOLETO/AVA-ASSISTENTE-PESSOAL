# Checklist de Implementacao - Fila de Execucao

Documento de acompanhamento da implementacao descrita em `docs/IMPLEMENTACAO_FILA_EXECUCAO.md`.

## 1) Estrutura da Fila (TaskQueue)

- [x] Criar `server/utils/TaskQueue.ts` com fila FIFO baseada em Promises
- [x] Garantir controle de concorrencia por configuracao (`maxConcurrent`)
- [x] Garantir execucao da proxima tarefa apos conclusao/erro da tarefa atual
- [x] Expor `enqueue(() => Promise<T>, meta)` com tipagem generica

## 2) Integracao no LLM Core

- [x] Integrar `TaskQueue` no fluxo principal de chamadas do LLM em `server/_core/llm.ts`
- [x] Encapsular execucao real em `invokeLLMInternal(...)`
- [x] Passar toda chamada de `invokeLLM(...)` pela fila (`queue.enqueue(...)`)
- [x] Separar fila por provider (`ollama` e `forge/cloud`) para politicas diferentes

## 3) Politica de Concorrencia por Ambiente

- [x] Ollama local com concorrencia padrao `1`
- [x] Cloud com concorrencia padrao maior (ex.: `5`)
- [x] Permitir ajuste por variaveis de ambiente sem quebrar fallback padrao

## 4) Variaveis de Ambiente

- [x] Ler `MAX_CONCURRENT_OLLAMA_CALLS` em `server/_core/env.ts`
- [x] Ler `MAX_CONCURRENT_CLOUD_LLM_CALLS` em `server/_core/env.ts`
- [x] Normalizar valores invalidos com fallback seguro (inteiro positivo)

## 5) Logs e Telemetria da Fila

- [x] Log ao entrar na fila com tipo/provider e tamanho da fila
- [x] Log ao iniciar processamento com tempo de espera
- [x] Log ao concluir tarefa e iniciar proxima
- [x] Garantir logs em caminhos de sucesso e erro

## 6) Timeout Correto (Sem Contar Espera na Fila)

- [x] Iniciar timeout de rede apenas dentro da tarefa que saiu da fila
- [x] Nao iniciar timeout na fase de espera da fila
- [x] Aplicar timeout no request HTTP real (`axios`/`fetch`)
- [x] Preservar cancelamento por `AbortSignal` sem quebrar fluxo

## 7) Compatibilidade e Seguranca de Integracao

- [x] Manter assinaturas publicas de `invokeLLM(...)` e `orchestrateAgentResponse(...)`
- [x] Validar imports e tipos no core
- [x] Garantir que ferramentas/tool-calls continuem funcionando
- [x] Garantir que fallback de provider continue funcional

## 8) Validacao Tecnica

- [x] Rodar verificacao de tipos (`pnpm check`)
- [x] Executar aplicacao (`npm run dev`) e validar inicializacao sem erro
- [x] Confirmar logs de fila no console durante chamadas LLM
- [x] Simular chamadas sequenciais/concorrentes e verificar serializacao no Ollama

## 9) Criterios de Aceite

- [x] Nao ocorre paralelismo descontrolado no provider local
- [x] Nao ha timeout antes da tarefa iniciar de fato no provider
- [x] Sistema sem travamento do host nos testes executados
- [x] Logs permitem auditar tempo de espera e processamento da fila

## 10) Automacao de Inicializacao do Ollama (Novo)

- [x] Criar script `scripts/ensure-ollama-ready.ts` para bootstrap automatico
- [x] Adicionar `predev` no `package.json` para rodar `ollama list` automaticamente
- [x] Validar inicializacao automatica antes do servidor subir

## 11) Teste de Estresse Controlado (Novo)

- [x] Criar script `scripts/stress-ollama-queue.ts`
- [x] Limitar carga para proteger host local (defaults: 4 requisicoes, concorrencia 2)
- [x] Rodar teste com acompanhamento de logs da fila
- [ ] Obter 100% de sucesso de resposta em todas as requisicoes (pendente por latencia do runtime Ollama)

## 12) Observacoes de Execucao Real

- Bootstrap do Ollama validado: `npm run dev` inicia com `predev` e executa `ollama list` automaticamente.
- Servidor sobe normalmente apos bootstrap (`Server running on http://localhost:300x/`).
- Fila funcionando como esperado: entrada em fila, tempo de espera e processamento sequencial no Ollama.
- Host nao travou durante os testes de estresse.
- Gargalo atual observado: timeout de resposta do modelo local (inclusive em teste direto com `ollama run`), indicando limitacao de performance do runtime/modelo local e nao da fila/automacao.

## 13) Arquivos Alterados nesta Etapa

- `package.json`
- `scripts/ensure-ollama-ready.ts`
- `scripts/stress-ollama-queue.ts`
- `server/_core/env.ts`
- `server/utils/TaskQueue.ts`

## 14) Proximos Passos Recomendados

- [ ] Testar estresse com modelo mais leve (ex.: `STRESS_OLLAMA_MODEL=llama3.2:3b`)
- [ ] Ajustar `OLLAMA_NUM_PREDICT`, `OLLAMA_NUM_CTX` e timeout para reduzir latencia
- [ ] Consolidar perfil de ambiente "stress-safe" no `.env`
