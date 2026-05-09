# Catalogo de Comandos por Canal

## Objetivo

Este documento oferece um guia rapido de comandos e prompts para usar o AVA via CLI, Telegram e chat web.

## Pre-requisitos recomendados

- `AVA_AGENT_LOOP_V2=true`
- Provedor LLM configurado (`LLM_PROVIDER=ollama` ou `gemini`)
- Para cloud Ollama: `gemma4:31b-cloud`
- Para continuidade entre canais: `AVA_CLI_USER_ID` igual a `TELEGRAM_STUDY_USER_ID`

## CLI

### Diagnostico

- `npx tsx cli/index.ts self-status`

### Uso geral

- `npx tsx cli/index.ts ask "Resuma o que voce pode fazer" --provider ollama --model gemma4:31b-cloud`
- `npx tsx cli/index.ts ask "Busque na web o site oficial do STF e mostre 3 links" --provider ollama --model gemma4:31b-cloud`
- `npx tsx cli/index.ts ask "Extraia de https://www.gov.br os campos url, titulo e links" --provider ollama --model gemma4:31b-cloud`

### Lembretes

- `npx tsx cli/index.ts ask "Crie um lembrete para daqui a 10 minutos com mensagem: revisar contrato" --provider ollama --model gemma4:31b-cloud`
- `npx tsx cli/index.ts ask "Liste os lembretes ativos" --provider ollama --model gemma4:31b-cloud`

### Mentor Socratico

- `npx tsx cli/index.ts ask "Como Mentor Socratico, inicie sessao de estudo sobre Docker" --provider ollama --model gemma4:31b-cloud`
- `npx tsx cli/index.ts ask "Liste meus modulos de estudo" --provider ollama --model gemma4:31b-cloud`
- `npx tsx cli/index.ts ask "Verifique revisoes pendentes de estudo" --provider ollama --model gemma4:31b-cloud`

## Telegram

### Inicializacao do bot

- `pnpm telegram:study-bot`

### Mensagens de exemplo

- `Crie um lembrete para 15:30: ligar para cliente`
- `Como Mentor Socratico, inicie estudo sobre responsabilidade civil`
- `Liste meus modulos de estudo`
- `Resuma minhas tarefas pendentes`

### Uso via comando de ponte (quando habilitado)

- `/cli Liste os lembretes ativos`
- `/cli Como Mentor Socratico, inicie sessao sobre Docker`

## Chat Web

Use mensagens naturais com as mesmas intencoes do CLI/Telegram:

- `Crie um lembrete para amanha as 09:00`
- `Inicie sessao de estudo sobre Direito Constitucional`
- `Liste meus modulos de estudo`
- `Busque na web jurisprudencia recente sobre dano moral`

## Testes e operacao

### Suite exaustiva

- `pnpm test:ava-cli:exaustivo`

### Forcar cloud Ollama nos testes

- `export AVA_TEST_PROVIDER='ollama' AVA_TEST_MODELS='gemma4:31b-cloud'; pnpm test:ava-cli:exaustivo`

### Sincronizar assets entre .agent e .opencode

- `pnpm sync:agent-opencode`

## Fluxos prontos (copiar e usar)

### Produtividade

- `Crie lembrete de reuniao amanha as 09:00 e depois liste meus lembretes.`

### Estudo

- `Inicie modulo de estudo sobre Docker e faca a primeira pergunta socratica.`

### Pesquisa

- `Busque decisoes do STJ sobre dano moral e traga 3 fontes confiaveis.`

## Troubleshooting rapido

### Cloud Ollama para de responder

Sintoma comum:

- timeouts consecutivos com `gemma4:31b-cloud`

Acao recomendada:

1. trocar conta/sessao no Ollama cloud;
2. repetir o cenario a partir do ponto de falha.

### Identidade fragmentada entre canais

Sintoma comum:

- contexto diferente no CLI, Telegram e web.

Acao recomendada:

1. definir `AVA_CLI_USER_ID`;
2. definir `TELEGRAM_STUDY_USER_ID` com o mesmo valor;
3. validar no chat web que o usuario autenticado mapeia para o mesmo ID logico.
