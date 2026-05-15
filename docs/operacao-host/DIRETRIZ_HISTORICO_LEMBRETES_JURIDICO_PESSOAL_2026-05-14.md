# Diretriz de Historico de Lembretes (Juridico e Pessoal)

Data: 2026-05-14
Projeto: AVA Assistente Pessoal
Status: Registro para continuidade futura

## Decisao registrada

- Nao apagar lembretes antigos de forma cega.
- Preservar historico porque ele e util para contexto juridico e pessoal.

## Justificativa

- No uso juridico, historico de lembretes ajuda em diligencia, rastreabilidade e continuidade de casos.
- No uso pessoal/profissional, historico melhora previsibilidade de rotina e reduz risco de esquecimentos.
- Exemplos citados:
  - agendamento no INSS de cliente;
  - audiencias e prazos;
  - tarefas pessoais;
  - supermercado e compromissos recorrentes.

## Diretriz funcional

1. Manter lembretes antigos no sistema (nao excluir por idade apenas).
2. Organizar por estado:
   - `active` (em aberto)
   - `completed` (concluido)
   - `archived` (historico consultavel)
3. Separar por categoria (juridico, pessoal, saude, compras, etc.).
4. Aplicar retencao inteligente por categoria (arquivar, nao deletar como regra geral).
5. Exibir no dia a dia apenas alertas ativos/proximos, mantendo o historico acessivel por busca.

## Proposta de retencao (base)

- Juridico: retencao longa (ex.: 5 anos ou mais).
- Pessoal: retencao media.
- Rotina operacional (agua/alongamento): retencao curta com consolidacao/sumarizacao periodica.

## Impacto esperado

- Mais confiabilidade para operacao juridica e administrativa.
- Melhor memoria operacional do AVA sem poluir alertas atuais.
- Continuidade entre sessoes e menor retrabalho.

## Proximos passos para implementacao

1. Criar campo de categoria e politica de retencao em `proactiveTasks`.
2. Implementar rotina de arquivamento (sem exclusao destrutiva por padrao).
3. Ajustar listagens para foco em `active` e busca historica por filtro.
4. Adicionar comandos para consulta de historico por tema/cliente/categoria.
