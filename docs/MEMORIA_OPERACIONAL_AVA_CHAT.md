# Memoria operacional AVA (chat + scripts)

Este documento e um guia rapido para lembrar:

- qual script usar,
- qual comando rodar,
- como pedir informacoes no chat,
- como evoluir para comandos com `/` e `@` (estilo agentes/especializacoes).

## 1) Comandos que voce mais vai usar

### Comandos no input do chat (ja implementado)

- `/help`
- `/status`
- `/skill list|use|status|clear`
- `/knowledge on|off`
- `/archive on|off`
- `/brainstorm <tema>`
- `/plan <tema>`
- `/debug <problema>`
- `/teach <assunto>`
- `/memory summarize`

Especializacoes via `@` (ja implementado):

- `@professor`
- `@professor-codigo`
- `@arquiteto`
- `@dev`
- `@auditor`
- `@resumo`

### Preparar conhecimento de arquivo/projeto (MVP atual)

Gerar pacote completo para chat + RAG + visao didatica:

```bash
pnpm rag:knowledge:export -- "C:\caminho\do\projeto-ou-arquivo" --mode=both
```

Modo interativo (o script pergunta tudo):

```bash
pnpm rag:knowledge:export -- --interactive
```

Saidas esperadas em `knowledge-export-00x/`:

- `chat.md`
- `rag.jsonl`
- `tree.md`
- `module-summaries/`
- `didactic-guide.md`
- `didactic-notes.jsonl`
- `manifest.json`

### Preparar texto/livro para chat e RAG

```bash
npx tsx scripts/process-text.ts "C:\caminho\arquivo.md" --mode=both
```

### Indexar no pipeline RAG atual

```bash
pnpm rag:index
```

### Backup rapido da memoria/RAG

```bash
pnpm rag:backup
```

## 2) Qual script usar em cada situacao

- Projeto inteiro (codigo + docs): `scripts/knowledge-cli.ts`
- Livro/texto em Markdown: `scripts/process-text.ts`
- Indexacao em embeddings no AVA: `scripts/index-drive-sync.ts` (via `pnpm rag:index`)
- Backup de memoria/RAG: `scripts/rag-backup.ts`

Regra pratica:

- Se quer "ensinar o projeto" para o chat: use `knowledge-cli.ts`.
- Se quer "organizar texto longo" rapidamente: use `process-text.ts`.

## 3) Como encontrar conhecimento depois

Sempre abra primeiro o `manifest.json` do ultimo export. Ele responde:

- o que entrou,
- o que ficou de fora,
- onde estao os arquivos gerados.

Depois consulte:

- `didactic-guide.md` para explicacao humana,
- `tree.md` para estrutura,
- `rag.jsonl` para indexacao.

## 4) Como pedir informacao no chat (padrao recomendado)

Use pedidos com 4 partes:

1. contexto (`use o pacote knowledge-export-00x`)
2. objetivo (`quero entender arquitetura/autenticacao/modulo X`)
3. formato (`responda em topicos + exemplo`)
4. limite (`se nao estiver no material, diga que nao encontrou`)

Exemplo:

```text
Use o conhecimento do knowledge-export-012.
Explique o modulo de autenticacao do projeto.
Quero: visao geral, fluxo passo a passo e pontos de risco.
Se faltar base no material, diga explicitamente.
```

## 5) Sua ideia de `/` e `@` (analise)

E uma excelente ideia e faz muito sentido para operacao diaria.

### Por que vale a pena

- reduz friccao de uso,
- padroniza pedidos,
- evita prompts longos para tarefas repetidas,
- melhora roteamento para "modo professor", "modo tecnico", "modo acao".

### Como implementar com seguranca

Use um parser leve antes da LLM:

- detecta comandos iniciados com `/`
- detecta especializacao com `@`
- monta um objeto de intencao (acao + parametros)
- so depois chama LLM/ferramentas

Isso evita depender da interpretacao livre do modelo para comandos operacionais.

## 6) Proposta de sintaxe interna AVA

### Comandos `/` (acao)

- `/help` -> lista comandos
- `/memory latest` -> mostra ultimo pacote gerado
- `/memory list` -> lista pacotes `knowledge-export-00x`
- `/memory use 012` -> fixa contexto no pacote 012
- `/rag index` -> dispara indexacao
- `/rag backup` -> backup rapido
- `/knowledge build <path>` -> executa export de conhecimento
- `/knowledge status` -> mostra ultimos artefatos e contagens

### Especializacoes `@` (estilo de resposta)

- `@professor` -> didatico, passo a passo, analogias
- `@arquiteto` -> foco em design de sistema e trade-offs
- `@dev` -> foco em implementacao e codigo
- `@auditor` -> foco em riscos, lacunas e validacao
- `@resumo` -> versao curta em bullets

Exemplo combinado:

```text
/memory use 012
@professor Explique como o modulo de RAG foi construido e como eu replico em outro projeto.
```

## 7) Padrao de solicitacao de informacoes internas do AVA

Recomendacao: sempre usar uma frase de "fonte obrigatoria".

Template:

```text
Use apenas as fontes internas do AVA (pacote X / memoria Y).
Objetivo: <o que quero entender>.
Formato: <como quero a resposta>.
Se nao houver evidencia nas fontes, diga "nao encontrado nas fontes internas".
```

Isso melhora confiabilidade e reduz alucinacao.

## 8) Checklist rapido (cola)

- Quero transformar projeto em memoria: `pnpm rag:knowledge:export -- "<path>" --mode=both`
- Quero transformar livro/texto: `npx tsx scripts/process-text.ts "<arquivo.md>" --mode=both`
- Quero indexar no RAG: `pnpm rag:index`
- Quero backup: `pnpm rag:backup`
- Quero explicar melhor no chat: use `didactic-guide.md` + `didactic-notes.jsonl`

## 9) Proximo passo sugerido

Implementar no chat um mini-dispatcher com:

- parser de `/comando`,
- parser de `@especializacao`,
- memoria ativa (`knowledge-export selecionado`),
- resposta padrao com citacao de fonte interna.

Com isso, o AVA fica mais proximo de um "sistema professor" consistente para qualquer assunto.
