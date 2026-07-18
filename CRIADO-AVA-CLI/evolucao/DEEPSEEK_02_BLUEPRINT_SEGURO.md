# DeepSeek V4 Pro — Etapa 2: edição segura e verificável de Blueprints

Pré-requisito: a Etapa 1 está compilada e seus testes de protocolo passaram. Trabalhe no mesmo plugin UnrealMCP, UE 5.6.

## Objetivo

Transformar comandos de edição de Blueprint em operações seguras: a IA deve inspecionar o estado antes de escrever, conectar pinos corretamente, compilar e detectar nós órfãos, referências nulas e incompatibilidades.

## Implementar

### Inspeção determinística

- `get_blueprint_summary`: classe pai, componentes, variáveis, interfaces, graphs/funções e status de compilação.
- `get_blueprint_graph`: nós com `node_id` estável na sessão, tipo/classe, título, posição, pinos (nome, direção, tipo) e conexões.
- `get_blueprint_diagnostics`: erros/avisos de compilação, nós sem fluxo de execução quando aplicável, pinos obrigatórios soltos e referências conhecidamente nulas.

Não precisa serializar propriedades gigantes; use resumo e opção de detalhamento.

### Edição transacional

- Adicionar `dry_run:true` aos comandos que criam/removem nó, variável, componente ou conexão. Deve validar sem salvar/alterar asset.
- Usar `FScopedTransaction`, marcar Blueprint como modificado e executar compilação apenas quando solicitada ou no comando de validação.
- Em uma falha de edição, não deixar conexão parcial. Se for viável, desfazer a transação; caso contrário, retorne claramente `partial_change:true` e IDs afetados.
- `connect_nodes` deve validar existência, direção (saída→entrada), compatibilidade de tipo, exclusividade de pino e evitar ciclos de execução acidentais. Retornar os pinos efetivamente conectados.
- Criar `disconnect_pins` e `delete_blueprint_node` por identificador, com `dry_run`.

### Enhanced Input real

Não usar `UK2Node_InputAction` legado para uma `UInputAction` de Enhanced Input. Implementar suporte específico ou retornar erro orientativo até que ele esteja correto.

Comandos mínimos:

- `add_enhanced_input_action_node` (asset `UInputAction`, graph e posição);
- `add_is_valid_guard` ou uma forma semântica de criar a sequência `Is Valid` antes de chamar função em objeto opcional;
- `call_function_on_object` deve aceitar objeto oriundo de nó/pino e conectar automaticamente o pino `Target` somente após validar a classe.

## Cenário obrigatório de teste

Em um Blueprint de teste descartável, criar e validar este fluxo sem nós soltos:

`Enhanced Input Started → obter CurrentWeapon → Is Valid → ToggleFlashlight`.

A saída `CurrentWeapon` deve alimentar tanto a entrada do `Is Valid` quanto o `Target` de `ToggleFlashlight`. O caminho inválido não deve chamar a função. O relatório deve provar conexões e compilação.

## Critérios de aceite

- Uma IA consegue ler o grafo e conectar por IDs/pinos, sem depender de nomes visuais ambíguos.
- `dry_run` não modifica o asset.
- Erro de tipo ou pino inexistente não cria fios/nós parciais.
- Diagnóstico identifica os dois nós de leitura puros desconectados como não utilizados, mas não os confunde com erro fatal.
- O fluxo de lanterna acima compila e não gera `Accessed None` ao não haver arma equipada.

## Entrega exigida

Relatório com JSONs reais de requisição/resposta, prova de compilação, limitações e lista dos comandos ainda legados/não seguros.
