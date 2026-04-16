# Correcao Exclusiva - Chat local qwen2.5:7b-instruct nao responde

Data: 2026-04-13
Projeto: `ava-assistant-v3-main`
Escopo: Fluxo `chat.sendMessage` com provider local Ollama

## Problema observado

- O chat com `qwen2.5:7b-instruct` ficava sem resposta e encerrava com timeout.
- Havia fallback para Forge em cenarios onde o ambiente local deveria ser exclusivo Ollama.
- Em alguns casos, o payload para Ollama ficava grande (system prompt + historico + RAG), degradando muito a latencia.

## Diagnostico consolidado

- O gargalo principal nao era ausencia do modelo: o modelo estava instalado e respondia no endpoint direto do Ollama.
- O fluxo do chat estava montando contexto pesado demais para o modelo local em parte das requisicoes.
- O fallback para Forge criava ruido operacional quando nao configurado ou indesejado.

## Correcoes implementadas

### 1) Ollama como padrao e Forge desativado por default

- Default de provider alterado para `ollama`.
- Fallback para Forge passou a ser opt-in via env:
  - `ENABLE_FORGE_FALLBACK=false` (padrao no `.env`)

Arquivos:
- `server/_core/env.ts`
- `server/_core/llm.ts`
- `server/routers.ts`
- `.env`

### 2) Ajuste de keep_alive no payload do Ollama

- `OLLAMA_KEEP_ALIVE=-1` agora e enviado em formato compativel no payload (`keep_alive`).
- Corrigido erro de parsing de duracao que ocorria com valor string sem unidade em alguns cenarios.

Arquivo:
- `server/_core/llm.ts`

### 3) Robustez da chamada HTTP ao Ollama

- Chamada para `/api/chat` no caminho do chat atualizada para `axios` com timeout e tratamento de erro mais previsiveis.
- Tratamento explicito de timeout/cancelamento/conexao recusada.

Arquivo:
- `server/_core/llm.ts`

### 4) Reducao de contexto para o provider Ollama

- Reducao de volume no prompt para chamadas locais:
  - Menos chunks de RAG no contexto
  - Truncamento de chunks
  - Limite de tamanho de system prompt para Ollama
  - Janela de historico menor e truncada
- Remocao de duplicacao de mensagens de sistema no orquestrador.

Arquivos:
- `server/routers.ts`
- `server/agents.ts`

### 5) Coerencia de metadados de provider

- Ajuste do fallback de `embeddingProvider` para `ollama` onde aplicavel.

Arquivo:
- `server/rag.ts`

## Validacao executada

- Verificacao de tipos: `pnpm check` concluido sem erros.
- Reproducao de chat via script interno:
  - Script: `scripts/repro-ollama-chat.ts`
  - Resultado final apos correcoes: resposta bem-sucedida (`assistantMessage=OK`) usando `qwen2.5:7b-instruct`.

## Estado final

- Chat local com `qwen2.5:7b-instruct` voltou a responder no fluxo do sistema.
- Forge nao interfere mais no caminho principal quando `ENABLE_FORGE_FALLBACK=false`.
- Timeout e contexto ficaram mais adequados para execucao local.
