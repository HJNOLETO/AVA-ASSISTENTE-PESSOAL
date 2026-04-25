# Memoria Operacional AVA

Atualizado em: 2026-04-25

## Objetivo

Registrar padroes de acerto/erro para melhorar a consistencia das respostas operacionais entre modelos diferentes.

## Acertos recentes

- Criacao de lembrete com `criar_lembrete` + confirmacao de horario.
- Listagem de lembretes com `listar_lembretes`.
- Busca web e extracao estruturada executando as tools corretas.

## Erros recorrentes

- Em algumas rodadas, a ferramenta `sistema_de_arquivos` recebeu acao errada para renomear (ex.: editar em vez de renomear).
- Ocorrencias de bloqueio anti-simulacao quando houve tool call sem fechamento operacional coerente.
- Respostas finais sem posicionamento claro de sucesso/falha em alguns casos.

## Regras de decisao

1. Pedido operacional exige tool call correspondente.
2. Depois da tool, retornar sempre:
   - Status: sucesso/falha
   - Resultado objetivo da acao
3. Se houver falha, informar causa e proxima acao imediata.
4. Nao encerrar sem mensagem final de conclusao.

## Meta de qualidade

- Evitar respostas sem fechamento.
- Reduzir variacao entre modelos cloud/local em tarefas de execucao.
- Priorizar confiabilidade de execucao sobre estilo de texto.

## Rodada 2026-04-25T22:30:11.446Z (exaustivo-2026-04-25T22-26-11-826Z)
- Aprovados: 10
- Falhos: 1
- Ignorados: 0
- Cenarios aprovados: T01 - Autodiagnostico operacional; T02 - Criacao de lembrete; T03 - Listagem de lembretes; T04 - Criacao de pasta/arquivo; T05 - Copia de arquivo; T06 - Renomeacao de arquivo; T07 - Exclusao com confirmacao explicita; T08 - Busca web; T09 - Extracao estruturada de pagina; T11 - Listagem de cofre
- Cenarios falhos: T10 - Cofre seguro
- Cenarios ignorados: nenhum

## Rodada 2026-04-25T22:36:00.042Z (exaustivo-2026-04-25T22-31-40-278Z)
- Aprovados: 10
- Falhos: 1
- Ignorados: 0
- Cenarios aprovados: T01 - Autodiagnostico operacional; T02 - Criacao de lembrete; T03 - Listagem de lembretes; T04 - Criacao de pasta/arquivo; T05 - Copia de arquivo; T06 - Renomeacao de arquivo; T07 - Exclusao com confirmacao explicita; T08 - Busca web; T09 - Extracao estruturada de pagina; T11 - Listagem de cofre
- Cenarios falhos: T10 - Cofre seguro
- Cenarios ignorados: nenhum

## Rodada 2026-04-25T22:40:32.224Z (exaustivo-2026-04-25T22-37-39-466Z)
- Aprovados: 11
- Falhos: 0
- Ignorados: 0
- Cenarios aprovados: T01 - Autodiagnostico operacional; T02 - Criacao de lembrete; T03 - Listagem de lembretes; T04 - Criacao de pasta/arquivo; T05 - Copia de arquivo; T06 - Renomeacao de arquivo; T07 - Exclusao com confirmacao explicita; T08 - Busca web; T09 - Extracao estruturada de pagina; T10 - Cofre seguro; T11 - Listagem de cofre
- Cenarios falhos: nenhum
- Cenarios ignorados: nenhum
