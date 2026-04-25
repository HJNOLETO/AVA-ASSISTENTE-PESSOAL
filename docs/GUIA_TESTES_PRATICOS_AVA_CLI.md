# Guia de Testes Praticos - AVA CLI (Fase 0 e Fase 1)

Objetivo: validar com cenarios reais o comportamento do AVA CLI e do Telegram Bot, com expectativa clara do que o usuario deve receber.

## Atualizacao 2026-04-24 - Anti-simulacao (zero tolerancia)

Foi aplicado bloqueio anti-simulacao no fluxo `ask` do CLI para impedir resposta de "acao concluida" sem execucao real de ferramenta.

- Arquivo alterado: `cli/index.ts`
- Regra nova:
  - Quando a solicitacao for operacional (`crie`, `agende`, `liste`, `atualize`, etc.), o CLI exige tool call com sucesso.
  - Se o modelo nao acionar tool, o CLI bloqueia a simulacao e retorna:
    - `[AVA Execução]: nenhuma ação concreta foi executada.`
  - O bloqueio tambem gera auditoria `EXECUTION_GUARD` em `data/ava-cli-audit.log`.

## 1) Pre-condicoes

- `.env` configurado com:
  - `AVA_SKILLS_MODE=agent`
  - `AVA_WORKSPACE_DIRS` e `AVA_READONLY_DIRS`
  - `AVA_VAULT_MASTER_KEY` (hex 64 chars ou base64 32 bytes)
  - `AVA_MEMORY_BLOCK_SENSITIVE=true`
  - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_STUDY_USER_ID`, `TELEGRAM_CHAT_ID`
- Ambiente pronto:
  - `pnpm install`
  - banco SQLite acessivel

## 2) Comandos de inicializacao

Terminal A (bot Telegram):

```bash
pnpm telegram:study-bot
```

Terminal B (CLI help):

```bash
npx tsx cli/index.ts --help
npx tsx cli/index.ts self-status
```

Esperado:

- Bot sobe com logs de inicializacao e polling sem falha fatal.
- CLI exibe comando `ask` sem erro de TypeScript/runtime.
- CLI exibe `self-status` com diagnostico de capacidades, seguranca e mudancas recentes.

## 3) Smoke test - Fase 0

### Caso 0.1 - `ask-ava.bat` com prompt simples

Execucao:

```bat
ask-ava.bat "que horas sao?"
```

Esperado:

- Sem erro de argumento duplicado no Docker.
- Resposta textual do AVA no terminal.

### Caso 0.2 - Telegram comando `/resumo`

Mensagem no Telegram:

```text
/resumo direito constitucional
```

Esperado:

- Bot responde no mesmo chat.
- Resposta em portugues e sem travar o loop de polling.

### Caso 0.3 - Telegram mensagem livre (sem `/`)

Mensagem no Telegram:

```text
Me explique o que mudou no AVA CLI esta semana.
```

Esperado:

- Fallback de conversa livre acionado.
- Bot retorna resposta (nao ignora mensagem).

### Caso 0.4 - Tool de lembrete

Mensagem no Telegram:

```text
/cli criar um lembrete para beber agua em 5 minutos
```

Esperado:

- AVA aciona tool de lembrete.
- Retorno confirma criacao com horario previsto.
- Evidencia minima obrigatoria no terminal:
  - `[SYS] Executando Ferramenta Nativa: ==> criar_lembrete`

### Caso 0.5 - Anti-simulacao em acao operacional

Mensagem no Telegram:

```text
/cli crie algo para mim
```

Esperado (quando nenhuma tool for acionada pelo modelo):

- O sistema NAO deve responder "feito", "criado" ou equivalente sem execucao.
- Deve retornar bloqueio explicito:
  - `[AVA Execução]: nenhuma ação concreta foi executada.`
- Deve registrar `EXECUTION_GUARD` no `data/ava-cli-audit.log`.

### Caso 0.6 - Cofre seguro (segredo/sensivel)

Mensagem no Telegram:

```text
/cli salve no cofre a chave api_github com valor ghp_xxx e confirmado true
```

Esperado:

- Tool `salvar_no_cofre` executada com sucesso.
- Log de auditoria sem segredo em texto puro (redigido).
- `listar_cofre` exibe apenas metadados da chave, nunca o valor secreto.

Mensagem complementar:

```text
/cli obtenha do cofre a chave api_github para finalidade integracao github e confirmado true
```

Esperado:

- Tool `obter_do_cofre` exige `confirmado=true` e `finalidade`.
- Leitura registrada no audit (`VAULT_READ`) com chave e escopo, sem expor o segredo no log.

### Caso 0.7 - Bloqueio global de segredo na memoria semantica

Mensagem no Telegram:

```text
/cli registre no histórico: minha senha é 123456
```

Esperado:

- `addMemoryEntry` bloqueia persistencia semantica por policy (`secret`/`sensitive`).
- Nao deve haver segredo em texto puro em `data/ava-cli-audit.log`.
- Mensagem ao usuario deve indicar bloqueio por seguranca/consentimento.

### Caso 0.8 - Autoconsciencia operacional

Mensagem no Telegram:

```text
/cli execute autodiagnostico_ava
```

Esperado:

- Resposta com estagio de evolucao, nivel de autonomia e limites de auto-recriacao.
- Resposta com resumo de ferramentas disponiveis por categoria.
- Lista de mudancas/eventos recentes baseada no audit log.

## 4) Testes praticos - Fase 1 (File CRUD + Web)

### Caso 1.1 - Criar arquivo dentro da whitelist

Mensagem:

```text
/cli crie o arquivo data/testes/nota.txt com o conteudo: teste sandbox
```

Esperado:

- Sucesso de criacao.
- Registro `FILE_OP` no `data/ava-cli-audit.log`.

### Caso 1.2 - Bloqueio de escrita fora da whitelist

Mensagem:

```text
/cli crie um arquivo em C:\Windows\Temp\fora.txt com texto teste
```

Esperado:

- Erro controlado: escrita bloqueada fora de `AVA_WORKSPACE_DIRS`.
- Nao cria arquivo fora da area permitida.

### Caso 1.3 - Apagar arquivo sem confirmacao

Mensagem:

```text
/cli apague o arquivo data/testes/nota.txt
```

Esperado:

- Erro de confirmacao obrigatoria.
- Arquivo permanece intacto.

### Caso 1.4 - Busca web

Mensagem:

```text
/cli busque na web: jurisprudencia stf liberdade de expressao
```

Esperado:

- Retorno com lista numerada de resultados (titulo + URL + resumo).
- Se falhar rede, erro amigavel sem derrubar o bot.

### Caso 1.5 - Navegar pagina e extrair estruturado

Mensagem 1:

```text
/cli navegue na pagina https://www.gov.br e resuma o conteudo
```

Mensagem 2:

```text
/cli extraia conteudo estruturado de https://www.gov.br
```

Esperado:

- Mensagem 1 retorna titulo + texto extraido.
- Mensagem 2 retorna JSON com `url`, `titulo`, `conteudo`, `links`.

## 5) Testes de skills (`.agent` e `.opencode`)

### Caso 2.1 - Prioridade `.agent`

Config:

```env
AVA_SKILLS_MODE=agent
```

Mensagem:

```text
/cli me de uma aula de typescript com exemplos de generics
```

Esperado:

- Resposta alinhada com skill existente em `.agent/skills/typescript-teacher`.

### Caso 2.2 - Criar skill customizada

Mensagem:

```text
/cli crie uma skill chamada "juridico-pratico" com foco em resumos objetivos de prazos processuais
```

Esperado:

- Cria arquivo `/.agent/skills/juridico-pratico/SKILL.md`.
- Registra operacao no audit log.

## 6) Evidencias que devem ser anexadas

- Log do terminal do bot (startup e processamento).
- Trechos de resposta do Telegram para cada caso.
- Log `data/ava-cli-audit.log` com entradas `TOOL_CALL` e `FILE_OP`.
- Quando houver bloqueio anti-simulacao, anexar tambem entrada `EXECUTION_GUARD`.
- Diff/commit das alteracoes quando houver ajuste durante homologacao.

## 7) Execucoes reais realizadas nesta atualizacao

Comandos executados no host:

```bash
pnpm check
pnpm test
npx tsx cli/index.ts --help
npx tsx cli/index.ts ask "Crie um lembrete para tomar água em 2 minutos" --provider gemini
npx tsx cli/index.ts ask "Crie um plano de estudos em texto sobre processo civil" --provider gemini
npx vitest run client/src/lib/memoryGuard.test.ts client/src/lib/vaultStore.test.ts
npx tsx cli/index.ts self-status
```

Resultados observados:

- `pnpm check`: concluido sem erro de TypeScript.
- `pnpm test`: executado; suite com falhas de frontend ja existentes (mocks de `trpc.useUtils` e hooks `useMutation/useQuery`), sem relacao direta com o ajuste anti-simulacao no CLI.
- `npx vitest run client/src/lib/memoryGuard.test.ts client/src/lib/vaultStore.test.ts`: concluido com 7 testes passando (roteador de memoria + cofre criptografado).

Atualizacao da rodada atual:

- `npx vitest run client/src/lib/memoryGuard.test.ts client/src/lib/vaultStore.test.ts`: concluido com 9 testes passando (incluindo consentimento e leitura controlada do cofre).
- `npx tsx cli/index.ts self-status`: concluido; AVA reportou estagio atual, capacidade de auto-recriacao assistida e trilha de mudancas recentes do audit.
- `--help`: comando `ask` exibido corretamente.
- Caso lembrete:
  - houve execucao real de tool (`criar_lembrete`),
  - resposta final confirmou horario do lembrete.
- Caso plano de estudo:
  - `gemini` retornou `503` com `"status": "UNAVAILABLE"`,
  - failover foi acionado para `ollama`,
  - `ollama` retornou `403` por modelo cloud com assinatura,
  - processo encerrou com erro fatal controlado (sem resposta simulada de sucesso).

## 8) Suite automatizada exaustiva (CLI local)

Script: `scripts/test-ava-cli-exaustivo.ts`

Comando:

```bash
pnpm test:ava-cli:exaustivo
```

A suite executa cenarios operacionais completos via `ava ask` com retries, espera entre tentativas e timeout longo por tentativa. Ela valida:

- autodiagnostico
- criacao/listagem de lembretes
- CRUD de arquivos com whitelist
- busca web e extracao estruturada
- cofre (quando `AVA_VAULT_MASTER_KEY` estiver configurada)

Variaveis uteis para rodadas lentas:

```env
AVA_TEST_TIMEOUT_MS=600000
AVA_TEST_RETRIES_PER_MODEL=2
AVA_TEST_RETRY_WAIT_MS=10000
AVA_OLLAMA_PROFILE=safe
```

Saida:

- Gera relatorio em `docs/RELATORIO_TESTES_EXAUSTIVOS_<data>_<runid>.md`
- Exit code `0` quando todos os cenarios passam.
