# Analise Tecnica - AVA CLI (`ask-ava.bat`) e Integracao com Telegram

## 1) Escopo desta analise

Este documento descreve, com base no codigo atual do projeto, como funciona o atalho `ask-ava.bat`, qual tecnologia ele usa, como o fluxo se conecta ao Telegram e o que o sistema consegue executar hoje.

Arquivos-base da analise:

- `ask-ava.bat`
- `docker-compose.cli.yml`
- `cli.Dockerfile`
- `cli/index.ts`
- `server/agents.ts`
- `server/telegramStudyBot.ts`
- `package.json`

---

## 2) O que o `ask-ava.bat` faz

Conteudo atual:

```bat
@echo off
docker-compose -f docker-compose.cli.yml run --rm ava-cli npx tsx cli/index.ts ask "%*"
```

Interpretacao tecnica:

- `@echo off`: oculta eco dos comandos no terminal.
- `docker-compose -f docker-compose.cli.yml run --rm ava-cli ...`: sobe um container efemero do servico `ava-cli`.
- `--rm`: remove o container apos finalizar a execucao.
- `ask "%*"`: repassa a frase do usuario para o comando `ask` do CLI.

Em termos praticos, o BAT transforma uma chamada simples no Windows (ex.: `ask-ava.bat "resuma o arquivo README"`) em execucao do AVA CLI dentro de container.

---

## 3) Stack e tecnologia envolvida

### Runtime e linguagem

- Node.js 20 (container `node:20-alpine`).
- TypeScript executado com `tsx`.
- CLI estruturado com `commander`.

### Containerizacao

- Servico dedicado no `docker-compose.cli.yml` (`ava-cli`).
- Build via `cli.Dockerfile`.
- Execucao como usuario nao-root (`USER node`).

### IA / Modelos

- O comando `ask` usa `orchestrateAgentResponse(...)` + `invokeLLM(...)`.
- Provider no CLI: `ollama` (padrao) ou `forge` (opcao de flag no comando).
- O core do projeto tambem suporta `groq` e `gemini`, mas o `cli/index.ts` atual tipa explicitamente `forge | ollama` no fluxo principal.

### Persistencia e dados

- Banco SQLite compartilhado por volume (`./sqlite_v2.db:/app/sqlite_v2.db`).
- Pasta `data` montada externamente (dados/auditoria/estado).
- Pastas de backup externas tambem montadas via volume.

---

## 4) Fluxo interno do AVA CLI (`cli/index.ts`)

1. Carrega `.env`.
2. Inicializa comando `ask` com opcoes `--provider` e `--model`.
3. Inicializa DB (`getDb()`).
4. Monta historico de mensagens e entra em loop autonomo (max 15 ciclos).
5. Chama `orchestrateAgentResponse(...)` para gerar resposta + possiveis tool calls.
6. Se houver tools, executa localmente no proprio CLI e injeta resultado no contexto.
7. Repete ate `finish_reason=stop` ou limite de ciclos.

Esse padrao e um "agente com ferramentas" (tool-using loop), nao um prompt unico simples.

---

## 5) O que o AVA CLI consegue fazer hoje

### Ferramentas efetivamente executadas no `cli/index.ts`

- `obter_data_hora`
- `listar_arquivos`
- `ler_arquivo`
- `ler_codigo_fonte`
- `explorar_diretorio_projeto`
- `buscar_documentos_rag`
- `gerenciar_produtos` (modo busca textual no trecho atual do switch)

### Ferramentas declaradas em `server/agents.ts`

O orquestrador expoe uma lista maior de tools (CRM, agenda, juridico, lembretes etc.). Porem, no CLI confinado, tudo que nao estiver implementado no `switch` do `cli/index.ts` cai no fallback:

- "Ferramenta nao suportada remotamente no modo CLI confinado..."

Ou seja: capacidade declarada no orquestrador != capacidade realmente executavel no CLI local.

---

## 6) Seguranca tecnica do CLI

Camadas de protecao atuais:

- Sanitizacao de caminho com `path.resolve` + bloqueio de path traversal.
- Lista negra de acesso (`.env`, `.git`, `node_modules`, `sqlite*.db`).
- Limites de volume de dados:
  - lista de arquivos truncada (max 50 itens),
  - leitura de arquivo truncada (janela de ate 300 linhas).
- Auditoria em log (`data/ava-cli-audit.log`) para respostas e tool calls.
- Limite anti-loop de autonomia (15 ciclos).

---

## 7) Como o Telegram se conecta com o AVA CLI

### Componente

- Bot em `server/telegramStudyBot.ts`.
- Script de execucao: `pnpm telegram:study-bot`.

### Conexao com API do Telegram

- Usa HTTP direto para `https://api.telegram.org/bot<TOKEN>/<method>`.
- Metodos principais:
  - `getUpdates` (long polling)
  - `sendMessage`
  - `sendPhoto`
  - `sendMediaGroup`
  - `deleteWebhook` (evita conflito 409 com webhook ativo)

### Variaveis de ambiente importantes

- `TELEGRAM_BOT_TOKEN` (obrigatoria)
- `TELEGRAM_STUDY_USER_ID` (obrigatoria)
- `TELEGRAM_CHAT_ID` (opcional para restringir chat/autorizacao)
- `TELEGRAM_NOTIFY_INTERVAL_MS`
- `TELEGRAM_LOOKBACK_MINUTES`
- `TELEGRAM_TEXT_PROVIDER`, `TELEGRAM_IMAGE_PROVIDER`

---

## 8) O que e possivel fazer via Telegram

Comandos suportados pelo bot:

- `/novidades`: lista temas recentes indexados no AVA.
- `/resumo <tema>`: resposta didatica com base em RAG.
- `/quiz <tema>`: quiz de revisao.
- `/leitura <tema>`: roteiro de estudo.
- `/post <tema>`: gera texto + imagem (quando provider de imagem ativo).
- `/carrossel <tema>`: gera roteiro em slides + imagens.
- `/cli <comando>`: dispara o AVA CLI para executar tarefa autonoma na maquina.

Ponto importante: para `/cli`, o bot chama `npx tsx cli/index.ts ask ...` diretamente no host (proxy nativo), com timeout de 120s e filtro de logs na resposta enviada ao Telegram.

---

## 9) Relacao entre `ask-ava.bat` e Telegram

- `ask-ava.bat` e um atalho local manual para rodar o CLI via Docker.
- O Telegram nao usa esse BAT diretamente.
- O Telegram aciona o mesmo entrypoint logico do CLI (`cli/index.ts ask`), mas por execucao nativa (`exec`) no `telegramStudyBot.ts`.

Conclusao: existe convergencia no nucleo da automacao (`cli/index.ts`), com dois canais de entrada:

1. Terminal local via `ask-ava.bat` (Docker).
2. Chat Telegram via comando `/cli` (execucao nativa).

---

## 10) Pontos tecnicos de atencao

1. `cli.Dockerfile` ja define `ENTRYPOINT ["npx", "tsx", "cli/index.ts"]`.
2. O `ask-ava.bat` envia de novo `npx tsx cli/index.ts ask ...` como comando do `docker-compose run`.
3. Dependendo de como o Docker Compose combinar `ENTRYPOINT + command`, pode haver duplicacao de argumentos.

Recomendacao tecnica: validar se o BAT nao deveria ser simplificado para:

```bat
docker-compose -f docker-compose.cli.yml run --rm ava-cli ask "%*"
```

Isso aproveita o `ENTRYPOINT` ja definido e reduz risco de chamada redundante.

---

## 11) Diagnostico final (resumo executivo)

- O `ask-ava.bat` e um launcher Windows para executar o AVA CLI em container efemero, com volumes e `.env` compartilhados.
- O AVA CLI atual funciona como agente autonomo com loop de ferramentas e guardrails de seguranca de arquivo e contexto.
- A integracao Telegram e robusta, baseada em polling da API oficial, com comandos de estudo, geracao de conteudo e proxy de execucao do CLI.
- O sistema hoje suporta operacao multi-canal (Terminal + Telegram) com o mesmo core de raciocinio (`cli/index.ts` + `orchestrateAgentResponse`).
- Existe um ponto de melhoria no comando do BAT em relacao ao `ENTRYPOINT` do container.
