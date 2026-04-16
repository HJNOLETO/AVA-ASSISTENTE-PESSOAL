# Modelo de Destilação de Conhecimento (RAG Offline)

Este é um modelo prático de como funciona a "Destilação de Conhecimento" para sistemas RAG (Retrieval-Augmented Generation).

## O Conceito

O problema de ler documentos imensos (livros, processos, manuais) toda vez é que:
1. É lento.
2. É caro (computacionalmente).
3. Polui o contexto da IA com informações irrelevantes.

**A Solução:** Em vez de ler o documento original toda vez, nós criamos um "processador" que lê uma vez, resume/extrai o que importa, e salva um arquivo menor e mais denso (o "Destilado"). A IA do dia-a-dia só lê esse resumo.

## Como usar este modelo

Este script `processador.js` simula esse comportamento:
1. Ele vigia a pasta `entrada/`.
2. Lê qualquer arquivo `.txt` que você colocar lá.
3. Envia para uma LLM local (Ollama) pedindo para resumir.
4. Salva o resultado na pasta `saida/`.

### Pré-requisitos
- Node.js instalado.
- [Ollama](https://ollama.com) rodando localmente (padrão porta 11434).
- Um modelo baixado no Ollama (ex: `llama3`).

### Como rodar
1. Abra o terminal nesta pasta.
2. Instale a dependência (opcional, o script usa fetch nativo do Node 18+):
   ```bash
   node processador.js
   ```
3. O script vai ler o arquivo na pasta `entrada` e gerar um resumo na pasta `saida`.

## Portabilidade
Você pode usar essa lógica em qualquer linguagem (Python, C#, Java). O segredo não é o código, é o **Fluxo**:
`Documento Bruto -> LLM (Prompt de Extração) -> Documento Estruturado -> Banco de Dados`
