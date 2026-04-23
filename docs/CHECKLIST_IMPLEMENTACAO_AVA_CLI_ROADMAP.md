# Checklist de Implementacao - AVA CLI Roadmap

Base: `docs/AVA_CLI_ROADMAP.md`
Objetivo: transformar o roadmap em plano executavel com criterios de pronto, validacao e evidencias.

## Como usar este checklist

- Marque cada item apenas quando cumprir o criterio de pronto.
- Registre evidencias em PR, commit ou log tecnico.
- Execute validacoes locais antes de marcar como concluido.

Legenda:

- [ ] pendente
- [~] em andamento
- [x] concluido

---

## 0) Preparacao geral (antes das fases)

- [ ] Criar branch de implementacao do roadmap (ex: `feature/ava-cli-roadmap-phase0`)
  - Pronto quando: branch criada e publicada no remoto.
- [ ] Definir arquivo de controle de status por fase (ex: `docs/STATUS_AVA_CLI_ROADMAP.md`)
  - Pronto quando: status inicial com todas as tarefas pendentes.
- [ ] Definir padrao de evidencia por tarefa (commit, screenshot, log, teste)
  - Pronto quando: padrao documentado no topo do arquivo de status.

---

## 1) Fase 0 - Correcoes imediatas (< 1 semana)

### 1.1 Corrigir `ask-ava.bat`

- [ ] Alterar comando para usar ENTRYPOINT do container
  - Implementacao alvo: `docker-compose -f docker-compose.cli.yml run --rm ava-cli ask "%*"`
  - Arquivo: `ask-ava.bat`
- [ ] Validar execucao no Windows com 3 prompts reais
  - Pronto quando: respostas retornam sem erro de argumento duplicado.
- [ ] Registrar evidencia da correcao
  - Pronto quando: diff + log de execucao anexados.

### 1.2 Habilitar conversa livre no Telegram

- [ ] Implementar fallback para mensagem sem prefixo `/`
  - Arquivo: `server/telegramStudyBot.ts`
- [ ] Garantir que comandos `/` existentes continuam funcionando
  - Comandos minimos: `/novidades`, `/resumo`, `/quiz`, `/cli`.
- [ ] Adicionar teste manual de regressao
  - Pronto quando: 1 mensagem livre + 4 comandos testados com sucesso.

### 1.3 Conectar tools faltantes no CLI

- [ ] Mapear tools declaradas em `server/agents.ts` vs `switch` de `cli/index.ts`
- [ ] Implementar no `switch` as tools priorizadas:
  - [ ] `gerenciar_agenda`
  - [ ] `criar_lembrete`
  - [ ] `listar_lembretes` (se mantida no contrato)
  - [ ] `registrar_historico_estudo` (se mantida no contrato)
- [ ] Definir fallback consistente para tools ainda nao suportadas
- [ ] Atualizar documentacao de tools realmente operacionais
  - Arquivo sugerido: `docs/ANALISE_AVA_CLI_ASK_AVA_TELEGRAM.md` ou novo doc dedicado.

### 1.4 Gate de saida da Fase 0

- [ ] Executar checklist de smoke test:
  - [ ] `ask-ava.bat "que horas sao?"`
  - [ ] Telegram comando com `/resumo`
  - [ ] Telegram mensagem livre sem `/`
  - [ ] Tool de agenda/lembrete disparada com sucesso
- [ ] Publicar changelog da fase

---

## 2) Fase 1 - Autonomia real (2-4 semanas)

### 2.1 File CRUD com sandbox

- [ ] Definir politica de diretorios em `.env`
  - [ ] `AVA_WORKSPACE_DIRS`
  - [ ] `AVA_READONLY_DIRS`
- [ ] Implementar validacao de escrita/delecao por whitelist
- [ ] Implementar tools de arquivos:
  - [ ] `criar_arquivo`
  - [ ] `mover_arquivo`
  - [ ] `copiar_arquivo`
  - [ ] `renomear_arquivo`
  - [ ] `apagar_arquivo` com confirmacao explicita
  - [ ] `criar_pasta`
- [ ] Auditar todas as operacoes no log do CLI

### 2.2 Busca web e navegacao

- [ ] Implementar `buscar_web(query)`
- [ ] Implementar `navegar_pagina(url)` com Playwright headless
- [ ] Implementar `extrair_conteudo_estruturado(url)`
- [ ] Aplicar limites operacionais
  - [ ] timeout 30s
  - [ ] retorno maximo de texto
  - [ ] tratamento de erros de rede

### 2.3 Execucao de codigo em sandbox

- [ ] Definir imagens Docker por linguagem (python/node/bash)
- [ ] Implementar `executar_codigo(...)` com:
  - [ ] `--network none`
  - [ ] limite de memoria
  - [ ] timeout de execucao
- [ ] Padronizar retorno (`stdout`, `stderr`, `exit_code`, `tempo_execucao_ms`)

### 2.4 Cache de URL no SQLite

- [ ] Criar schema de cache com TTL 1h
- [ ] Integrar cache na navegacao web
- [ ] Validar hit/miss em teste manual

### 2.5 Gate de saida da Fase 1

- [ ] Testes de seguranca (path traversal e escrita fora da whitelist)
- [ ] Testes funcionais das novas tools
- [ ] Documento de operacao atualizado com exemplos de uso

---

## 3) Fase 2 - Orquestracao multi-IA (1-2 meses)

### 3.1 LLM Hub

- [ ] Definir interface do roteador de modelos
- [ ] Implementar selecao por tipo de tarefa
- [ ] Implementar fallback automatico por indisponibilidade
- [ ] Adicionar metricas basicas (latencia, falha, provider escolhido)

### 3.2 Integracao Google Drive + Colab

- [ ] Implementar upload de tarefa JSON para Drive
- [ ] Definir contrato de arquivo de tarefa (`task_<uuid>.json`)
- [ ] Implementar download de resultados (`result_<uuid>.md`)
- [ ] Implementar `daemon/driveMonitor.ts` com polling
- [ ] Integrar indexacao RAG automatica apos download
- [ ] Notificar Telegram apos indexacao concluida

### 3.3 Providers externos

- [ ] Revisar variaveis de ambiente de providers
  - [ ] `OPENAI_API_KEY`
  - [ ] `HUGGINGFACE_TOKEN`
  - [ ] `GEMINI_API_KEY`
  - [ ] `OLLAMA_HOST`
- [ ] Implementar politica de custo/prioridade no roteador
- [ ] Validar fallback em cenario offline de provider primario

### 3.4 Gate de saida da Fase 2

- [ ] Fluxo ponta-a-ponta validado: URL -> Colab/Drive -> RAG -> Telegram
- [ ] Log de rastreabilidade por `task_id`
- [ ] Documento de arquitetura atualizado

---

## 4) Fase 3 - Memoria longa e perfil do aluno (2-3 meses)

### 4.1 Banco e dominio de estudo

- [ ] Criar tabelas de perfil/progresso/sessoes/lacunas no SQLite
- [ ] Criar migracoes versionadas
- [ ] Criar camada de acesso a dados para novo dominio

### 4.2 Spaced repetition

- [ ] Implementar algoritmo de agendamento (SM-2 simplificado)
- [ ] Atualizar proxima revisao apos quiz/sessao
- [ ] Cobrir cenarios de desempenho alto, medio e baixo

### 4.3 Comportamento proativo no Telegram

- [ ] Implementar scheduler com `node-cron`
- [ ] Enviar revisoes do dia
- [ ] Enviar lembretes de inatividade
- [ ] Enviar resumo semanal de progresso

### 4.4 Gate de saida da Fase 3

- [ ] Usuario recebe notificacoes proativas corretas por contexto
- [ ] Relatorio semanal mostra progresso por tema
- [ ] Historico de estudo persiste e alimenta recomendacoes

---

## 5) Fase 4 - Poderes avancados e RPA (3-6 meses)

### 5.1 Visao no Telegram

- [ ] Implementar handler de imagem no bot
- [ ] Baixar arquivo de imagem do Telegram com seguranca
- [ ] Integrar modelo de visao (LLaVA/qwen2-vl)
- [ ] Responder analise no chat com fallback em erro

### 5.2 Controle de UI / RPA

- [ ] Implementar `controlar_ui(...)` via subprocess Python
- [ ] Aplicar whitelist de apps/acoes
- [ ] Exigir confirmacao antes de acoes de escrita
- [ ] Registrar log completo de cada acao executada

### 5.3 TTS no Telegram

- [ ] Integrar engine TTS local/remota
- [ ] Gerar audio para respostas selecionadas
- [ ] Enviar voice message no Telegram

### 5.4 Gate de saida da Fase 4

- [ ] Fluxos de imagem, RPA e voz validados com casos reais
- [ ] Guardrails de seguranca testados e documentados

---

## 6) Qualidade, seguranca e operacao continua (transversal)

### 6.1 Testes e confiabilidade

- [ ] Definir suite minima por fase (unitario + integracao + smoke)
- [ ] Adicionar testes de regressao para comandos Telegram
- [ ] Garantir timeout e retry em integracoes externas

### 6.2 Observabilidade

- [ ] Padronizar logs estruturados (origem, acao, status, duracao)
- [ ] Criar painel simples de erros recorrentes
- [ ] Monitorar taxa de sucesso por ferramenta

### 6.3 Seguranca

- [ ] Revisar acesso a arquivos sensiveis em todas as novas tools
- [ ] Revisar regras anti prompt-injection
- [ ] Aplicar rate limit no bot Telegram
- [ ] Revisar segredos e variaveis sensiveis no `.env`

---

## 7) Marco de entrega por fase

- [ ] Fase 0 entregue e homologada
- [ ] Fase 1 entregue e homologada
- [ ] Fase 2 entregue e homologada
- [ ] Fase 3 entregue e homologada
- [ ] Fase 4 entregue e homologada

---

## 8) Aprovacao final

- [ ] Documentacao tecnica atualizada
- [ ] Runbook operacional atualizado
- [ ] Checklist 100% concluido
- [ ] Assinatura de aceite tecnico
