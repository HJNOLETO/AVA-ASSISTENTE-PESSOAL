# Correcao Exclusiva - Modos por barra no chat (`/programacao`, `/professor`, `/loja`)

Data: 2026-04-13
Projeto: `ava-assistant-v3-main`
Escopo: Roteamento de assunto por comando no `chat.sendMessage`

## Contexto

- Foi identificada mistura de contexto entre assuntos diferentes dentro da mesma conversa.
- Exemplo observado: apos consulta de produtos (ex.: chambril), pedidos nao relacionados podiam herdar contexto anterior.
- Solucao adotada: modo explicito por barra, com isolamento de contexto por turno.

## Implementacao

### 1) Parser de modos por barra

- Suporte principal:
  - `/programacao`
  - `/professor`
  - `/loja`
- Aceita variacoes como `/professor/` e aliases internos.

Arquivo:
- `server/routers.ts`

Pontos adicionados:
- `type ChatDomainMode`
- `type ChatDomainParseResult`
- `parseChatDomainMode(raw)`
- `buildModeActivatedMessage(mode)`

### 2) Integracao no fluxo `sendMessage`

- Resolucao de modo antes da execucao principal.
- Mapeamentos:
  - `/professor` -> skill automatica `professor-mestre-da-oab`
  - `/programacao` -> modulo `DEVELOPER`
- Quando o usuario envia apenas o comando (sem conteudo), o chat responde com mensagem de confirmacao do modo.

Arquivo:
- `server/routers.ts`

### 3) Isolamento de contexto para reduzir arrasto de assunto

- Ao usar comando de modo no turno, janela de historico e reduzida para `0` nesse turno.
- RAG automatico passou a rodar apenas no modo `default` (ou quando houver documento explicitamente selecionado).
- No modo `/loja`, a intencao operacional de produto e priorizada.
- Nos modos `/programacao` e `/professor`, evita-se elevar intencao de loja por heuristica textual.

Arquivo:
- `server/routers.ts`

## Testes executados

### Script 1: troca de assunto

Arquivo:
- `scripts/test-topic-shift-chat.ts`

Cenario:
1. Pedido de produto chambril
2. Pedido nao relacionado (modelo SQL)
3. Pedido com `/programacao` para SQL

Observacoes:
- Sem comando de modo, nao houve vazamento de termos de produto na segunda resposta quando houve retorno.
- Comando `/programacao` direcionou corretamente o assunto, sujeito ao tempo de resposta do modelo local.

### Script 2: modo programacao direto

Arquivo:
- `scripts/test-slash-programacao.ts`

Observacoes:
- Com timeout maior (`OLLAMA_CHAT_TIMEOUT_MS=300000`), o modo `/programacao` retornou SQL com sucesso.
- Com timeout menor, houve casos de timeout por latencia do modelo local.

## Arquivos alterados

- `server/routers.ts`
- `scripts/test-topic-shift-chat.ts`
- `scripts/test-slash-programacao.ts`

## Resultado final

- O chat agora permite separacao de assunto por comando (`/programacao`, `/professor`, `/loja`).
- A troca de modo reduz heranca indesejada de contexto no turno.
- O comportamento final ainda depende da latencia/timeout do Ollama local para respostas longas.
