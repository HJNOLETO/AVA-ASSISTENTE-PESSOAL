---
name: legal-research-orchestrator
description: Orquestra pesquisas juridicas em fontes externas (DOU, LexML, jurisprudencia, Comunica PJe) com ordem de consulta, fallback e sintese padronizada.
version: 1.0.0
---

# Legal Research Orchestrator

## Objetivo

Garantir pesquisa juridica externa consistente, rastreavel e reutilizavel usando a tool `buscar_fontes_juridicas`.

## Quando usar

Ative este skill quando o pedido envolver qualquer um destes casos:

- Atualizacao normativa (lei, decreto, portaria, resolucao, edital)
- Diario oficial (publicacoes DOU/DJE)
- Jurisprudencia (STF, TST e outros com fallback)
- Andamento/publicacoes processuais via Comunica PJe
- Perguntas com necessidade de links oficiais e data de publicacao

## Entradas esperadas

Antes de executar buscas, extraia do pedido:

- Tema juridico principal
- Jurisdicao ou orgao preferencial
- Recorte temporal (quando houver)
- Tipo de artefato desejado (norma, acordao, noticia de diario, movimentacao)

Se faltar algum campo, use defaults seguros (tema + periodo recente) sem bloquear a resposta.

## Roteamento por intencao

Classifique o pedido em uma das intencoes abaixo e siga a prioridade:

1. **Normativa**
   - Ordem: `DOU` -> `LexML` -> fallback geral
2. **Jurisprudencia**
   - Ordem: `STF/TST API` -> busca oficial dos tribunais -> `LexML`
3. **Diario/Comunicacoes**
   - Ordem: `Comunica PJe` -> `DOU` (quando aplicavel)
4. **Panorama geral**
   - Ordem: `LexML` -> `DOU` -> `Jurisprudencia` -> `Comunica PJe`

## Processo de pesquisa

1. Gerar 2-4 variacoes de consulta com sinonimos e base legal relevante.
2. Executar `buscar_fontes_juridicas` conforme prioridade da intencao.
3. Coletar resultados com metadados minimos (orgao, data, identificador, URL).
4. Remover duplicatas por URL canonica + identificador oficial.
5. Ordenar por: aderencia ao pedido -> oficialidade da fonte -> atualidade.

## Regras de fallback

- Se API de jurisprudencia nao responder, usar busca oficial do tribunal e sinalizar fallback.
- Se nao houver resultado em uma fonte prioritaria, continuar para a proxima sem interromper.
- Se houver divergencia entre fontes, priorizar fonte oficial primaria e citar a divergencia.

## Formato de saida obrigatorio

Sempre responder com esta estrutura:

1. **Resposta objetiva** (2-5 linhas)
2. **Fontes encontradas** (lista curta com titulo, orgao, data)
3. **Links oficiais**
4. **Observacoes de confiabilidade** (fallback, lacunas, necessidade de validacao humana)

## Limites

- Nao inventar numero de processo, ato, artigo ou data.
- Nao afirmar vigencia sem evidencias nas fontes retornadas.
- Nao substituir analise profissional em casos concretos de alto risco.
