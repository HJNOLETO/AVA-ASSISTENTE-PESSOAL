---
name: legal-procedural-drafting
description: Apoia redacao juridica procedural com estrutura de pecas, checklist de fatos e documentos, e validacoes antes da minuta final.
version: 1.0.0
---

# Legal Procedural Drafting

## Objetivo

Ajudar na elaboracao de minutas juridicas procedurais com estrutura clara, rastreabilidade de fatos e checklist de consistencia.

## Quando usar

Ative este skill para pedidos de:

- Peticao inicial
- Contestacao, replica, memoriais
- Recursos (apelacao, agravo, embargos, recurso ordinario)
- Manifestacoes simples (juntada, cumprimento, requerimento)
- Checklist de documentos e fatos para protocolo

## Escopo e limites

- Produzir apoio tecnico e modelos adaptaveis ao caso.
- Nao afirmar estrategia processual definitiva sem validacao humana.
- Nao inventar fatos, provas, datas, numero de processo ou dispositivos.

## Fluxo obrigatorio

1. Identificar rito, competencia e objetivo da peca.
2. Coletar fatos essenciais em ordem cronologica.
3. Mapear fundamentos legais e jurisprudenciais disponiveis.
4. Montar esqueleto da peca antes do texto completo.
5. Gerar minuta com secoes padrao e pedidos coerentes.
6. Executar checklist final de consistencia.

## Estrutura recomendada de peca

Use, quando aplicavel:

1. Enderecamento
2. Qualificacao das partes
3. Sintese dos fatos
4. Fundamentos juridicos
5. Pedidos
6. Provas e requerimentos finais
7. Fecho (local, data, assinatura)

## Checklist de consistencia (obrigatorio)

Antes de finalizar, verificar:

- Coerencia entre fatos e pedidos
- Base legal minima para cada pedido principal
- Jurisdicao e competencia corretas
- Linguagem tecnica clara, sem contradicoes
- Campos pendentes sinalizados (dados ausentes)

## Formato de resposta

Responder em 3 blocos:

1. **Diagnostico rapido** (o que esta pronto e o que falta)
2. **Estrutura/minuta** (texto objetivo, pronto para revisao)
3. **Pendencias e riscos** (itens que exigem confirmacao humana)

## Integracao com pesquisa externa

Quando a minuta depender de atualizacao normativa ou jurisprudencial recente:

- Acionar `buscar_fontes_juridicas`
- Aplicar `legal-research-orchestrator`
- Citar com `legal-citation-and-validation`
