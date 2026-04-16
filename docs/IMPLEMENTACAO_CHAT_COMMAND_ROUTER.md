# Implementacao forte: Chat Command Router (/ e @)

Este documento registra a implementacao realizada para transformar o input do chat em uma interface mais operacional e didatica.

## Ideia aplicada

Implementar um **roteador de comandos no proprio chat** com duas camadas:

- `/comando` para acao rapida (workflow curto),
- `@especializacao` para ajustar o estilo e profundidade da resposta.

Objetivo: reduzir friccao, evitar prompts longos repetitivos e aproximar o AVA de um "professor/operador".

## O que foi implementado

### 1) Presets de especializacao (`@`)

Foram adicionados presets para uso direto no input:

- `@professor`
- `@professor-codigo`
- `@arquiteto`
- `@dev`
- `@auditor`
- `@resumo`

Esses presets geram uma instrucao interna e envelopam a solicitacao do usuario.

### 2) Comandos slash (`/`)

Foi adicionado parser com suporte a:

- `/help`
- `/status`
- `/knowledge on|off`
- `/archive on|off`
- `/brainstorm <tema>`
- `/plan <tema>`
- `/debug <problema>`
- `/teach <assunto>`
- `/memory summarize`

### 3) Integracao no envio de mensagem

Antes de enviar para o backend, o chat agora:

1. analisa o texto,
2. resolve comando/especializacao,
3. decide se:
   - responde localmente (sem chamar LLM), ou
   - envia prompt transformado para processamento.

## Arquivos alterados

- `client/src/components/AVAChatBoxRefactored.tsx`

Principais adicoes:

- `SPECIALIST_PRESETS`
- `extractSpecialistFromText(...)`
- `applySpecialistPreset(...)`
- `resolveTypedWorkflowCommand(...)`
- Hook no `handleSendMessage(...)` para processar slash/mention antes do envio.

## Como usar (exemplos)

### Especializacao direta

```text
@professor explique autenticação JWT do zero
```

```text
@auditor revise riscos do fluxo de reset de senha
```

### Comandos

```text
/help
/status
/knowledge on
/archive off
/brainstorm estratégia de memória do projeto
/plan melhorar pipeline RAG
/debug erro 401 ao logar
/teach vetorização semântica
/memory summarize
```

### Comando + especializacao

```text
/debug @auditor falha de autenticação no endpoint /login
```

```text
/teach @professor-codigo como funciona o arquivo AVAChatBoxRefactored.tsx
```

## Comportamento esperado

- Comandos administrativos (`/status`, `/knowledge`, `/archive`, `/help`) retornam mensagem local imediata.
- Comandos de conteudo (`/brainstorm`, `/plan`, `/debug`, `/teach`, `/memory summarize`) geram prompt guiado.
- `@especializacao` sem slash tambem funciona.

## Validacao executada

Foi executado:

```bash
pnpm check
```

Resultado:

- Nao houve novo erro relacionado ao `AVAChatBoxRefactored.tsx` apos os ajustes do roteador.
- Persistem erros antigos em scripts de RAG (`TS2802` em arquivos de `scripts/`), ja existentes e fora do escopo desta implementacao.

## Proximas evolucoes recomendadas

1. Persistir "especializacao ativa" por sessao (ex.: manter `@professor` ligado ate trocar).
2. Adicionar `/memory use <id>` para vincular pacote de conhecimento explicitamente.
3. Exibir badge visual no chat quando um preset `@...` estiver sendo aplicado.
4. Integrar com os workflows de `.opencode/workflows` de forma dinamica (carregar definicoes ao inves de hardcode).
