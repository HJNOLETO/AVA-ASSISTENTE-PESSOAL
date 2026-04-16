---
name: legal-citation-and-validation
description: Padroniza citacao juridica e validacao minima de fontes externas com checklist de rastreabilidade e qualidade.
version: 1.0.0
---

# Legal Citation and Validation

## Objetivo

Padronizar como referencias juridicas sao citadas, validadas e comunicadas ao usuario final.

## Quando usar

Ative este skill em qualquer resposta que cite norma, jurisprudencia, diario oficial ou movimentacao processual.

## Checklist de validacao (obrigatorio)

Para cada item citado, validar:

1. Fonte oficial ou institucional identificada
2. URL funcional e relevante para o item
3. Data de publicacao/julgamento claramente informada
4. Identificador oficial (lei, decreto, acordao, processo, comunicacao)
5. Coerencia com o pedido original (tema, periodo, orgao)

Se algum campo faltar, declarar explicitamente o que nao foi encontrado.

## Politica de confiabilidade

- **Alta**: fonte oficial primaria + identificador completo + data
- **Media**: fonte oficial sem todos os metadados
- **Baixa**: apenas fallback de busca sem confirmacao primaria

Sempre sinalizar o nivel de confiabilidade ao final.

## Formato de citacao

Use o padrao abaixo por item:

- `Fonte`: nome do portal/orgao
- `Tipo`: norma, acordao, DJE, comunicacao etc.
- `Identificador`: numero e/ou classe processual
- `Data`: formato ISO (`YYYY-MM-DD`) quando disponivel
- `URL`: link oficial
- `Status`: encontrado via API oficial ou fallback

## Regras de apresentacao

- Primeiro responder a pergunta do usuario em linguagem simples.
- Depois apresentar citacoes em bloco estruturado.
- Evitar excesso de itens: priorizar os 3-8 mais relevantes.
- Em conflito entre fontes, mostrar conflito e indicar a fonte primaria.

## Tratamento de ausencia de resultado

Quando nao houver resultado suficiente:

- Informar que a busca foi realizada e em quais fontes.
- Explicar a lacuna (periodo, termo muito amplo, indisponibilidade da API).
- Sugerir refinamento objetivo de busca (termo, orgao, data).

## Nao conformidades proibidas

- Nao citar links nao verificados como se fossem oficiais.
- Nao omitir que houve fallback quando API falhar.
- Nao apresentar inferencias como fatos documentais.
