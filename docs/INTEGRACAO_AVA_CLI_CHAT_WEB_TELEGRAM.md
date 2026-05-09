# Integracao AVA CLI + Chat Web + Telegram

## Objetivo

Este documento explica o estado atual da integracao entre os tres canais do AVA (CLI, chat web e Telegram), os motivos mais provaveis para parecerem desconectados e um plano pratico para unificar comportamento, memoria e contexto.

## Resumo executivo

- O Mentor Socratico no CLI esta funcional e foi validado em execucao real.
- O bot do Telegram sobe corretamente, remove webhook e entra em polling.
- A sensacao de "nao funciona junto" ocorre principalmente por divergencia de identidade de usuario entre canais e por ponte indireta do Telegram para o CLI.
- Ha um alerta tecnico relevante no CLI (`require is not defined` no ToolRegistry) que pode reduzir estabilidade de ferramentas dinamicas.

## Evidencias da analise

### 1) Guia do Mentor Socratico

Guia analisado:

- `ava-assistant-v3-main-dados/diversos/anotacoes/projeto_professor_ava/GUIA_USUARIO_MENTOR_SOCRATICO.md`

Pontos-chave do guia:

- `AVA_AGENT_LOOP_V2=true` e obrigatorio para o fluxo do Mentor.
- Provedor recomendado para estabilidade: `gemini`.
- Comando principal de uso: `npx tsx cli/index.ts ask "..." --provider gemini`.

### 2) Validacao do CLI

Comandos executados:

- `npx tsx cli/index.ts --help`
- `npx tsx cli/index.ts self-status`
- `npx tsx cli/index.ts ask "Como Mentor Socratico, inicie sessao de estudo sobre Docker" --provider gemini`

Resultado observado:

- O CLI respondeu com sucesso.
- O modulo "Docker" foi criado e o fluxo de sondagem do Mentor foi iniciado.

Observacao tecnica:

- Durante execucao de `ask`, apareceram mensagens:
  - `ToolRegistry Falha compilando schema_zod: require is not defined`

### 3) Validacao do Telegram

Comando executado:

- `pnpm telegram:study-bot`

Resultado observado:

- Bot iniciou normalmente.
- Logou `userId=1`.
- Logou `chatIdsPermitidos=...`.
- Removeu webhook com sucesso para evitar conflito 409.

Nota:

- O timeout do terminal na sessao de teste e esperado, pois o bot roda continuamente (polling).

## Arquitetura atual (como os canais se conectam hoje)

Documento de referencia:

- `ARCHITECTURE.md`

Fluxo macro registrado:

- `CLI/Telegram/Web -> Agent Loop V2 -> Tools/RAG -> SQLite`

Na pratica, cada canal ainda pode operar com identidade/contexto diferentes dependendo da configuracao.

## Causa principal da desconexao entre canais

### Identidade de usuario fragmentada

Hoje existem fontes de `userId` distintas:

- CLI: `AVA_CLI_USER_ID` (ou fallback em `TELEGRAM_STUDY_USER_ID`) em `cli/index.ts`.
- Telegram: `TELEGRAM_STUDY_USER_ID` em `server/telegramStudyBot.ts`.
- Chat web: `ctx.user.id` no backend de conversa (usuario autenticado).

Se esses IDs nao forem o mesmo usuario logico, cada canal grava/consulta memoria, progresso e contexto em registros diferentes do banco. O efeito para o usuario final e: "cada canal parece uma AVA diferente".

## Limitacao de integracao no Telegram (estado atual)

No bot atual, comandos e mensagem livre acionam CLI via shell (`exec`) com:

- `npx tsx cli/index.ts ask "..."`

Isso funciona como ponte rapida, mas tem desvantagens:

- overhead de processo por mensagem;
- resposta depende de parsing de stdout/stderr;
- persistencia de conversa do Telegram nao entra automaticamente no mesmo fluxo de conversas do chat web;
- maior risco de comportamento divergente entre canais.

## Problema tecnico adicional: ToolRegistry

Erro observado em runtime:

- `ToolRegistry Falha compilando schema_zod: require is not defined`

Impacto potencial:

- parte das tools dinamicas pode falhar em validacao/carga;
- comportamento de execucao pode ficar inconsistente entre ambientes;
- reducao de confiabilidade no loop autonomo.

## Plano de unificacao recomendado

### Etapa 1 - Unificar userId entre canais

No `.env`, garantir alinhamento:

- `AVA_CLI_USER_ID=<ID_UNICO>`
- `TELEGRAM_STUDY_USER_ID=<MESMO_ID_UNICO>`

E alinhar o usuario autenticado do chat web com esse mesmo ID logico (ou mapear por tabela de identidade cruzada).

### Etapa 2 - Corrigir ToolRegistry (prioridade alta)

Resolver causa do `require is not defined` no fluxo de schema zod para garantir carregamento estavel de tools dinamicas em ambiente ESM.

### Etapa 3 - Centralizar o processamento do "ask"

Extrair/usar uma funcao interna unica de processamento de mensagens (Agent Loop + Tools + RAG) para:

- CLI,
- Telegram,
- chat web.

Objetivo: eliminar diferencas de comportamento por canal.

### Etapa 4 - Persistir Telegram no mesmo historico do chat web

Registrar mensagens do Telegram no mesmo modelo de conversa/mensagens do chat web (com metadado de canal), mantendo:

- trilha unica de contexto;
- memoria compartilhada;
- rastreabilidade por canal.

### Etapa 5 - Homologacao ponta-a-ponta

Executar roteiro pratico com base em:

- `docs/GUIA_TESTES_PRATICOS_AVA_CLI.md`

Casos minimos para integracao:

1. `/resumo <tema>` no Telegram;
2. mensagem livre sem comando no Telegram;
3. execucao `/cli` de acao operacional com evidencia de tool call;
4. continuidade da mesma sessao no chat web e no CLI usando o mesmo contexto.

## Checklist rapido de configuracao

- `AVA_AGENT_LOOP_V2=true`
- `LLM_PROVIDER=gemini` (ou cadeia de fallback definida)
- `GEMINI_API_KEY` valida
- `AVA_CLI_USER_ID` definido
- `TELEGRAM_STUDY_USER_ID` igual ao `AVA_CLI_USER_ID`
- `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID` validos

## Conclusao

O ecossistema ja tem os tres canais operando, mas a integracao plena depende de consolidar identidade de usuario e de centralizar o motor de processamento em um unico fluxo compartilhado. Com os ajustes propostos, a experiencia passa a ser realmente continua entre CLI, web e Telegram, com memoria e contexto unificados.
