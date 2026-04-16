# Guia do Knowledge CLI (MVP)

Este documento explica o que foi implementado no MVP (Opcao 1), como executar, o que esperar na saida e como usar os arquivos gerados para chat e RAG.

## O que foi implementado

### 1) Script principal

- Arquivo criado: `scripts/knowledge-cli.ts`
- Objetivo: converter arquivo unico ou projeto inteiro em pacote de conhecimento pronto para chat e indexacao RAG.

### 2) Script npm

- Entrada adicionada no `package.json`:
  - `rag:knowledge:export`: executa `tsx scripts/knowledge-cli.ts`

### 3) Saidas novas da camada MVP

Em cada execucao, o CLI cria uma pasta sequencial:

- `knowledge-export-001`
- `knowledge-export-002`
- etc.

Dentro dessa pasta:

- `chat.md` (quando modo `chat` ou `both`)
- `rag.jsonl` (quando modo `rag` ou `both`)
- `manifest.json` (sempre)
- `tree.md` (sempre)
- `module-summaries/README.md` (sempre)
- `module-summaries/*.md` (resumo por modulo)
- `didactic-guide.md` (sempre)
- `didactic-notes.jsonl` (sempre)

## Como o CLI funciona

### Entrada

- Aceita um caminho de arquivo ou pasta.
- Pode ser executado por flags ou em modo interativo.

### Coleta e filtros

- Varre recursivamente quando o alvo e pasta.
- Exclui diretorios comuns de ruido: `.git`, `node_modules`, `dist`, `build`, `coverage`, etc.
- Exclui lockfiles (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`).
- Ignora binarios e arquivos maiores que o limite configurado.

### Sanitizacao

- Normaliza quebras de linha e espacos.
- Reduz linhas em branco excessivas.
- Mascara padroes simples de segredo (`api_key`, `token`, `secret`).

### Classificacao

Cada arquivo entra com tipo:

- `source_code`
- `documentation`
- `config`
- `data_json`
- `internal_memory`
- `other_text`

Observacao sobre JSON:

- Nem todo `.json` e memoria interna.
- O CLI marca `internal_memory` por contexto de caminho/nome (ex.: `.rag`, `embeddings`, `manifest`, `memory`, `cache`).
- Outros JSONs entram como `data_json`.

### Chunking

- Divide texto por tamanho de caracteres (`chunk-size`) com sobreposicao (`overlap`).
- Cada chunk vai com metadados para rastreabilidade.
- Cada chunk recebe `teaching_note` para ajudar respostas explicativas no RAG.

### Camada didatica (professor)

- O CLI gera explicacao de utilidade por arquivo (para que serve).
- Gera foco pedagogico (como estudar/explicar aquele artefato).
- Detecta estruturas tecnicas: classes, interfaces, funcoes, hooks, imports/exports, sinais de API, SQL e testes.
- Isso fortalece o objetivo de transformar projeto em conhecimento ensinavel.

## Comandos

### 1) Ajuda

```bash
pnpm rag:knowledge:export -- --help
```

### 2) Execucao simples (modo completo)

```bash
pnpm rag:knowledge:export -- "C:\caminho\do\projeto" --mode=both
```

### 3) Com parametros de chunk

```bash
pnpm rag:knowledge:export -- "C:\caminho\do\projeto" --mode=both --chunk-size=1800 --overlap=250
```

### 4) Definindo pasta de saida

```bash
pnpm rag:knowledge:export -- "C:\caminho\do\projeto" --mode=both --out-root="C:\saida\knowledge"
```

### 5) Modo interativo

```bash
pnpm rag:knowledge:export -- --interactive
```

No modo interativo, o CLI pergunta:

- caminho alvo
- modo (`chat|rag|both`)
- tamanho do chunk
- overlap
- pasta base de saida

## O que esperar na execucao

Exemplo de log:

```text
Export dir: ...\knowledge-export-00X
Arquivos incluidos: N
Arquivos/pastas excluidos: M
Chunks gerados: K
Arquivos gerados:
- ...\chat.md
- ...\rag.jsonl
- ...\tree.md
- ...\module-summaries
- ...\didactic-guide.md
- ...\didactic-notes.jsonl
- ...\manifest.json
```

Interpretacao rapida:

- `incluidos`: quantidade de arquivos que viraram conhecimento
- `excluidos`: itens ignorados por regra/tamanho/tipo
- `chunks`: volume final para indexacao

## Como usar cada arquivo gerado

### `rag.jsonl`

- Entrada para pipeline de embeddings/indexador vetorial.
- Cada linha e um documento JSON com texto e metadados.

### `chat.md`

- Material consolidado para uso manual no chat (contexto direto).

### `tree.md`

- Visao estrutural do projeto considerado no pacote.
- Ajuda a explicar "onde estao as coisas".

### `module-summaries/`

- `README.md`: visao geral por modulo (pastas de topo).
- Arquivos por modulo: tipos de arquivo, linguagens e top arquivos por chunks.

### `didactic-guide.md`

- Guia legivel para ensino dos fundamentos do projeto.
- Traz, por arquivo: utilidade, foco didatico e estruturas detectadas.

### `didactic-notes.jsonl`

- Versao estruturada da camada didatica para indexar junto no RAG.
- Ajuda o chat a responder com explicacoes de "como funciona" e "como foi construido".

### `manifest.json`

- Auditoria completa da execucao:
  - configuracoes usadas
  - totais
  - lista de incluidos/excluidos
  - ponteiros para arquivos gerados

## Relacao com seu objetivo (fundamentacao do projeto)

Sim, este MVP ja serve para isso:

- Ele monta uma base consistente para o RAG responder "como o projeto funciona".
- Ele reduz ruido tecnico (dependencias, builds, binarios) e prioriza conhecimento util.
- Ele cria rastreabilidade para voce validar o que entrou ou ficou de fora.

## Limites atuais do MVP

- Nao faz resumo semantico por LLM (intencional no MVP).
- Nao extrai texto de PDF/DOCX no estado atual.
- Sanitizacao de segredo e por padrao simples (regex), podendo ser reforcada.

## Proximos passos recomendados

1. Rodar no projeto-alvo real e revisar `manifest.json` + `excluded_entries`.
2. Indexar `rag.jsonl` no seu pipeline de embeddings.
3. Medir qualidade das respostas do chat sobre arquitetura e decisoes.
4. Se necessario, evoluir para camada 2 (curadoria com LLM) por modulo.
