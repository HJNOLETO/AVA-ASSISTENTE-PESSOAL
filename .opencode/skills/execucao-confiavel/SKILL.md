# Execucao Confiavel

## Objetivo

Garantir que cada pedido operacional tenha fechamento claro, verificavel e consistente.

## Regras obrigatorias

1. Para pedidos operacionais, use tool call real antes de afirmar conclusao.
2. Depois da tool, sempre responda com status explicito em 1 linha:
   - `Status: sucesso` ou `Status: falha`
3. Sempre inclua uma linha de resultado objetivo:
   - Exemplo: `Pasta criada com sucesso em: <caminho>`
4. Em falha, explique causa direta e proxima acao:
   - `Falha ao criar pasta: caminho fora da whitelist. Ajuste para AVA_WORKSPACE_DIRS.`
5. Nunca finalize sem posicionamento final.

## Padrao de resposta para operacoes

Formato minimo:

1) O que foi pedido.
2) O que foi executado.
3) Resultado final (`sucesso`/`falha`).

Exemplo:

- Pedido: criar pasta `data/testes/x`.
- Execucao: tool `criar_pasta` acionada.
- Status: sucesso. Pasta criada com sucesso em `data/testes/x`.

## Tratamento de incerteza entre modelos

Quando a resposta do modelo vier vazia, ambigua ou sem fechamento:

- nao improvise sucesso;
- confirme o estado real via resultado da tool;
- retorne status objetivo para o usuario.
