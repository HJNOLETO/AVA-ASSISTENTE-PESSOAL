# RAG no Google Colab (GPU)

Este pacote cria uma versao dedicada para Google Colab sem alterar seus scripts atuais.

Arquivo principal:
- `colab-rag/rag_colab_pipeline.py`

## O que esta versao faz

- Monta o Google Drive no Colab (quando voce usa `--mount-drive`)
- Processa arquivos `.md`, `.txt` e `.pdf`
- Faz chunking com parametros alinhados ao projeto atual (`chunk_size=2000`, `overlap=200`)
- Gera embeddings com `sentence-transformers` usando GPU CUDA quando disponivel
- Salva estado incremental em `manifest.json` para retomar execucoes
- Salva banco SQLite com tabelas de RAG e memoria:
  - `documents`
  - `document_chunks`
  - `memory_entries`
- Permite consulta semantica rapida com `--phase query`

## Estrutura recomendada no Google Drive

Crie estas pastas no seu Drive:

```text
MyDrive/
  AVA_RAG/
    input/
      (seus arquivos .md/.txt/.pdf)
    output/
      (sqlite, manifest, report)
```

## Como usar no Google Colab

### 1) Preparar ambiente

No Colab, ative GPU em:
- `Runtime` -> `Change runtime type` -> `GPU`

Depois rode:

```python
!pip install -q sentence-transformers pypdf
```

### 2) Executar pipeline completo

Se o arquivo estiver no proprio repositorio local, envie para o Drive ou use upload no Colab.

Exemplo (arquivo no diretorio atual do notebook):

```python
!python rag_colab_pipeline.py \
  --mount-drive \
  --phase all \
  --input-dir /content/drive/MyDrive/AVA_RAG/input \
  --output-dir /content/drive/MyDrive/AVA_RAG/output \
  --embedding-model sentence-transformers/paraphrase-multilingual-mpnet-base-v2
```

### 3) Rodar em lotes (controle de custo/tempo)

```python
!python rag_colab_pipeline.py \
  --mount-drive \
  --phase all \
  --input-dir /content/drive/MyDrive/AVA_RAG/input \
  --output-dir /content/drive/MyDrive/AVA_RAG/output \
  --max-files-per-run 2 \
  --max-chunks-per-run 200 \
  --max-imports-per-run 200
```

Quando o limite for atingido, o manifest e salvo e voce pode executar novamente para continuar.

### 4) Consultar o RAG no SQLite

```python
!python rag_colab_pipeline.py \
  --mount-drive \
  --phase query \
  --output-dir /content/drive/MyDrive/AVA_RAG/output \
  --query "quais sao os requisitos para responsabilidade civil" \
  --top-k 5
```

## Principais comandos

- Pipeline completo:
```bash
python rag_colab_pipeline.py --mount-drive --phase all
```

- Apenas embedding + import para SQLite (mesmo fluxo de `all` nesta versao):
```bash
python rag_colab_pipeline.py --mount-drive --phase embed
```

- Consulta semantica:
```bash
python rag_colab_pipeline.py --mount-drive --phase query --query "texto"
```

## Arquivos de saida

Em `output-dir`:
- `rag_colab.sqlite`: base com chunks e embeddings
- `manifest.json`: estado incremental para retomada
- `run-report.md`: resumo da execucao

## Relacao com o modelo atual de RAG e banco

Esta versao foi desenhada para manter o mesmo raciocinio do projeto atual:
- Chunking com tamanho e overlap equivalentes
- Persistencia de conteudo + embedding por chunk
- Memoria tipo `context` para cada chunk processado
- Busca por similaridade via produto escalar em vetores normalizados

Se quiser, em um passo seguinte, voce pode criar um importador para levar os dados do
`rag_colab.sqlite` para o banco principal da aplicacao (`memoryEntries`/`documentChunks`).

## Observacoes

- PDF imagem (scan puro) pode precisar OCR adicional.
- Modelos maiores podem exigir mais VRAM; ajuste `--batch-size` se faltar memoria.
- Se nao houver GPU, o pipeline roda em CPU (mais lento).
