# Plano de execução — UnrealMCP com DeepSeek V4 Pro

## Como usar

Entregue os quatro arquivos de implementação ao DeepSeek **na ordem indicada**. Cada arquivo é uma tarefa fechada: ele deve alterar somente o necessário, compilar o módulo e devolver um relatório objetivo. Não entregue todas as etapas em um único prompt.

1. `DEEPSEEK_01_CONTRATO_E_CONFIABILIDADE.md`
2. `DEEPSEEK_02_BLUEPRINT_SEGURO.md`
3. `DEEPSEEK_03_SISTEMAS_DE_JOGO_E_CONTEUDO.md`
4. `DEEPSEEK_04_VALIDACAO_TESTES_E_ENTREGA.md`

## Regras globais para todas as etapas

- Projeto UE: `ProjetoGTA`, Unreal Engine 5.6.
- Plugin: `Plugins/UnrealMCP`.
- Preserve comandos já existentes e compatibilidade com mensagens que usam `command` e as que usam `type`.
- Não alterar assets `.uasset`, Blueprints do jogo, mapa nem configurações do projeto durante o desenvolvimento do plugin. Criar assets de teste somente em uma pasta claramente identificada, se isso for indispensável e autorizado.
- Não declarar uma função como pronta sem: compilação do módulo, teste de resposta JSON e evidência no log.
- Toda alteração deve falhar de forma explícita e não deixar Blueprints parcialmente modificados.
- No relatório final de cada etapa, listar: arquivos alterados, comandos adicionados/alterados, comandos de teste enviados, respostas recebidas, limitações e próximos riscos.

## Definição de pronto do produto

Uma IA deve conseguir executar o ciclo abaixo com segurança:

`especificar → inspecionar → criar/alterar → compilar → validar grafo → testar em PIE → relatar/reverter`.

O objetivo não é apenas criar nós. É produzir gameplay funcional, detectar referências nulas e impedir grafos órfãos ou conexões inválidas.
