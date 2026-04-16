# CLI de Conhecimento - duas opcoes de implementacao

Este documento detalha duas formas de construir o CLI para converter arquivos/projetos em material para chat e RAG.

## Visao geral rapida

- Sim, o CLI e uma aplicacao a ser criada (normalmente um comando em Node/TypeScript).
- Ele pode viver dentro do projeto atual (pasta `scripts/`) ou como projeto separado.
- O caminho abaixo pode ser usado como projeto-alvo de leitura:
  - `C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main-dados\diversos\projetos-exemplos\clawd-cod-exemplo\claw-code-main`

## Opcao 1 - MVP forte e deterministico (recomendada para iniciar)

Foco: confiabilidade, velocidade e baixo custo.

### O que faz

- Entrada por arquivo unico ou pasta de projeto.
- Detecta tipo e linguagem por extensao e estrutura.
- Extrai texto de formatos comuns: `.md`, `.txt`, `.html`, `.json`, `.ts`, `.js`, `.css`, `.bat`, etc.
- Aplica sanitizacao e filtros (nao indexa `node_modules`, `dist`, `build`, binarios grandes, caches).
- Faz chunking com overlap e metadados.
- Gera saidas:
  - `chat.md` (leitura direta no chat)
  - `rag.jsonl` (ingestao em pipeline de embeddings)
  - `manifest.json` (o que entrou, o que foi excluido, tamanhos e hash)

### Vantagens

- Resultado reproduzivel.
- Custo quase zero de LLM.
- Menor risco de alucinacao no preparo dos dados.
- Facil de manter.

### Limites

- Entrega menos "inteligencia editorial" (menos resumo automatico por modulo).
- Menos orientacao arquitetural para replicar e melhorar o projeto.

## Opcao 2 - Pipeline guiado por LLM (curadoria avancada)

Foco: transformar codigo/documentacao em conhecimento acionavel.

### O que adiciona sobre a opcao 1

- Classificacao semantica de arquivos (`source_code`, `docs`, `config`, `data_json`, `memory_json`, etc.).
- Resumo por arquivo e por modulo.
- Mapa arquitetural automatico (camadas, dependencias, fluxos).
- Deteccao de riscos e oportunidades de melhoria.
- Export de "manual de replicacao aprimorada" com passos e decisoes tecnicas.

### Vantagens

- Melhor para onboarding e transferencia de conhecimento.
- Ajuda a reconstruir/modernizar projetos com contexto.
- Material mais rico para RAG de alta qualidade.

### Limites

- Maior custo e tempo de processamento.
- Requer controle de prompts, validacoes e fallback.
- Precisa de governanca para evitar ruido/alucinacao.

## Sobre sua pergunta: "CLI seria algo assim?"

Sim, o conceito e esse. Existem duas formas praticas:

- CLI dentro deste repositorio: por exemplo `scripts/knowledge-cli.ts` executado com `npx tsx`.
- CLI separada (repositorio proprio): publica como pacote/command e aponta para qualquer pasta-alvo.

No seu exemplo, o caminho do `claw-code-main` pode ser usado como alvo:

```bash
npx tsx scripts/knowledge-cli.ts "C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main-dados\diversos\projetos-exemplos\clawd-cod-exemplo\claw-code-main" --mode=both
```

## Estrutura sugerida de saida

Cada execucao cria uma pasta exclusiva e sequencial:

```text
knowledge-export-001/
knowledge-export-002/
knowledge-export-003/
```

Dentro de cada pasta:

- `chat.md`
- `rag.jsonl`
- `manifest.json`
- `tree.md`
- `module-summaries/`

## Regras de saneamento recomendadas

- Excluir por padrao: `.git`, `node_modules`, `dist`, `build`, `.next`, `coverage`, caches e binarios grandes.
- Tratar `.json` por contexto (nao excluir tudo):
  - manter dados de dominio relevantes;
  - marcar "memoria interna" quando estiver em pastas/padroes dedicados.
- Mascarar segredos (`API_KEY`, tokens, credenciais).
- Limitar tamanho por arquivo e por lote para evitar estouro.

## Plano de entrega sugerido

1. Implementar Opcao 1 (MVP) e validar com 2-3 projetos reais.
2. Medir qualidade de recuperacao no RAG.
3. Adicionar componentes da Opcao 2 gradualmente (sumarios, mapa arquitetural, manual de replicacao).

## Recomendacao final

Comecar pela Opcao 1 e evoluir para a Opcao 2 em camadas. Assim voce ganha resultado imediato sem travar em complexidade inicial.
