# Analise da pasta .opencode para memoria e comandos do chat

Este documento analisa os recursos em `.opencode` e propoe como transformar isso em experiencia pratica no chat (com `/comando` e `@especialista`).

## 1) Diagnostico rapido

A pasta `.opencode` ja tem uma base muito forte para seu objetivo de "AVA professor":

- `agents/` com especialistas por dominio (backend, frontend, seguranca, testes, etc.).
- `skills/` com modulos de conhecimento e modos didaticos (`behavioral-modes`, `ava-program-teacher`, `intelligent-routing`, etc.).
- `workflows/` com comandos slash (`/create`, `/enhance`, `/debug`, `/orchestrate`, `/status`, `/brainstorm`, etc.).
- `rules/GEMINI.md` com protocolo de roteamento automatico e checklist de qualidade.

Conclusao: a arquitetura para operar por comandos no input do chat ja existe conceitualmente; falta consolidar execucao e padrao de UX.

## 2) O que isso permite hoje (conceitualmente)

### A) Chat com comandos de acao

- `/create` -> iniciar criacao de app/feature.
- `/enhance` -> evoluir sistema existente.
- `/debug` -> investigacao de erro com metodo sistematico.
- `/orchestrate` -> coordenar multiplos especialistas.
- `/status` -> mostrar estado do projeto/agentes.

### B) Chat com especializacao explicita

- `@backend-specialist` -> foco API/regra de negocio.
- `@security-auditor` -> foco riscos e vulnerabilidades.
- `@test-engineer` -> foco cobertura e estrategia de testes.
- `@professor` (alias para habilidades de ensino) -> explicacao progressiva e didatica.

### C) Roteamento automatico

Com `skills/intelligent-routing`, o sistema pode:

- detectar dominio pela pergunta,
- escolher agente automaticamente,
- avisar ao usuario qual especializacao esta sendo aplicada.

## 3) Pontos de atencao encontrados

### Inconsistencia de caminho

Varios arquivos citam `.agent/...`, mas no seu projeto o conteudo esta em `.opencode/...`.

Exemplo de impacto:

- comandos/documentacao que mandam executar `python .agent/scripts/...` podem falhar se nao houver espelho da pasta `.agent`.

Recomendacao:

- padronizar tudo para `.opencode` (ou criar compatibilidade por alias/symlink).

### Config MCP

`mcp_config.json` esta em formato com comentario inline e placeholder de chave (`YOUR_API_KEY`), entao precisa revisao antes de uso real.

## 4) Proposta de UX no input do chat

### Sintaxe proposta (simples)

1. `/` = intencao operacional (workflow)
2. `@` = especializacao (agente/modo)
3. texto livre = tarefa/pergunta

Formato:

```text
/comando @especialista sua solicitacao
```

Exemplos:

- `/brainstorm @professor como ensinar arquitetura do AVA para iniciantes`
- `/enhance @backend-specialist adicionar endpoint de historico de memoria`
- `/debug @debugger erro 401 no login depois de refatorar auth`
- `/orchestrate @orchestrator criar plano de modernizacao do projeto`

### Regras de precedencia

1. Se tiver `/comando`, ele define o fluxo principal.
2. Se tiver `@especialista`, ele define estilo/criterio tecnico.
3. Se nao tiver nada, usar roteamento automatico (`intelligent-routing`).
4. Se houver conflito (`/debug` + `@seo-specialist`), pedir confirmacao curta.

## 5) Proposta para "informacoes internas do AVA"

Para evitar respostas vagas, use sempre um template com fonte obrigatoria:

```text
Use apenas fontes internas do AVA.
Fonte: knowledge-export-0XX + didactic-guide + manifest.
Objetivo: <pergunta>
Formato: <topicos/passo a passo/tabela>
Se nao encontrar nas fontes, diga explicitamente: "nao encontrado nas fontes internas".
```

Exemplo:

```text
Use apenas fontes internas do AVA.
Fonte: knowledge-export-014.
Objetivo: explicar o fluxo de voz (captura -> transcricao -> resposta -> TTS).
Formato: diagrama textual + pontos de extensao.
Se faltar base, diga nao encontrado.
```

## 6) Mapeamento sugerido para "modo professor"

Para seu objetivo (ensinar qualquer assunto), recomendo padrao fixo de resposta:

1. Conceito rapido
2. Como funciona na pratica
3. Exemplo concreto
4. Erros comuns
5. Exercicio/pergunta de verificacao

Alias sugeridos:

- `@professor` -> explicacao progressiva
- `@professor-codigo` -> foco em leitura de codigo e arquitetura
- `@professor-tema` -> geopolitica/economia/religiao etc. com base nas fontes carregadas

## 7) Fluxo operacional recomendado (dia a dia)

1. Gerar memoria do projeto com `pnpm rag:knowledge:export -- "<path>" --mode=both`
2. Indexar quando necessario (`pnpm rag:index`)
3. No chat, usar:
   - `/memory use <id>` (quando implementar)
   - `@professor` para explicacoes
   - `/brainstorm` para comparar opcoes
   - `/orchestrate` para tarefas multi-dominio

## 8) Backlog de implementacao (prioridade)

### P1 - Alto impacto

- Parser de input (`/` + `@` + argumentos).
- Dispatcher para mapear workflows em `.opencode/workflows`.
- Resolucao de caminho `.agent` vs `.opencode`.

### P2 - Qualidade

- Modo debug de roteamento (mostrar por que escolheu determinado agente).
- Catalogo de aliases (`@professor`, `@dev`, `@auditor`).
- Mensagens padrao de "fonte interna obrigatoria".

### P3 - Evolucao

- Memoria de sessao de comandos recentes.
- Recomendador de comando (sugere `/debug` quando detectar erro, etc.).

## 9) Conclusao

Sua ideia e muito boa e ja tem base real na `.opencode`. O melhor caminho e:

1. consolidar a interface de comandos no input,
2. padronizar consulta a fontes internas,
3. ativar um modo professor consistente sobre qualquer dominio.

Com isso, o AVA vira um sistema de explicacao orientada por memoria, com operacao simples para voce no dia a dia.
