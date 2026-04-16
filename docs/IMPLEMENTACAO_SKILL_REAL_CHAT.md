# Implementacao real de Skills no chat do AVA

Este documento descreve a implementacao real (sem simulacao) de ativacao de skill no chat.

## Objetivo

Permitir que o usuario ative uma skill da pasta `.opencode/skills` e que essa skill realmente altere o comportamento da resposta do modelo.

## O que foi implementado

### 1) Backend: leitura real de `.opencode/skills`

Arquivo: `server/routers.ts`

- Criado scanner real de skills em `.opencode/skills/*/SKILL.md`.
- Criado parser de perfil da skill (id, titulo, descricao) lendo frontmatter e corpo.
- Criado carregador de instrucoes da skill (`loadSkillInstruction`) para injetar no prompt do sistema.

### 2) API real para o chat listar skills

Arquivo: `server/routers.ts`

- Novo endpoint TRPC: `chat.listSkillProfiles`.
- Retorna skills existentes fisicamente na pasta `.opencode/skills`.

### 3) Injeção de skill no fluxo de resposta

Arquivo: `server/routers.ts`

- `chat.sendMessage` agora aceita `context.activeSkill`.
- Quando `activeSkill` e enviada:
  - backend carrega `SKILL.md` real,
  - adiciona perfil e instrucoes da skill ao `systemContent`,
  - LLM responde sob essa especializacao.

Sem arquivo de skill valido, o backend marca explicitamente que a skill nao foi encontrada.

### 4) Frontend: comandos de skill no input do chat

Arquivo: `client/src/components/AVAChatBoxRefactored.tsx`

Comandos implementados:

- `/skill list`
- `/skill use <nome>`
- `/skill status`
- `/skill clear`

Comportamento:

- `/skill list` usa `chat.listSkillProfiles` real.
- `/skill use` valida contra a lista real.
- skill ativa fica persistida em local storage (`ava-active-skill`).
- toda mensagem enviada inclui `context.activeSkill` quando houver skill ativa.

## Comandos de uso

No chat:

```text
/skill list
/skill use ava-program-teacher
/skill status
/skill clear
```

Exemplo de uso real:

```text
/skill use ava-program-teacher
explique a arquitetura do AVA e onde modificar o fluxo de voz
```

## Resultado esperado

- Respostas passam a refletir o estilo/conteudo da skill ativa.
- Trocar skill muda o comportamento da resposta na proxima mensagem.
- Limpar skill retorna ao comportamento padrao.

## Validacao

Comando executado:

```bash
pnpm check
```

Resultado:

- TypeScript validado sem erros.
