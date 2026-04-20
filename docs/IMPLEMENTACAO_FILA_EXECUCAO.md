# Diretrizes para Implementação de Fila de Execução (Queue System)

**Objetivo:** Resolver travamentos no sistema Host e otimizar o consumo de recursos criando ordenamento para a execução de tarefas pesadas, limitando totalmente a concorrência paralela que sobrecarrega Máquina Local.

## 1. Avaliação do Estado Atual
A resposta é sim para a sua percepção e **NÃO**, não temos uma fila de execuções.
Atualmente as requisições que chegam ao servidor (rotas da web, Guardrails, invocações do `assistant.ts`, `rag.ts`) operam de forma puramente concorrente. Elas invocam de imediato o LLM. Esse paralelismo descontrolado leva o provedor local (Ollama) ou a CPU/GPU do sistema ao limite de sua utilidade, causando engasgos, perdas de conexão (timeout na interface) e falha total.

## 2. Instruções de Implementação
**Para a IA delegada (Agente Executor), siga estritamente os passos abaixo:**

### Passo 2.1: Criação de um Controlador de Fila (`TaskQueue`)
- Implemente uma classe ou módulo (ex: `server/utils/TaskQueue.ts`) baseada no conceito abstrato de paralelismo controlado. Você pode usar uma biblioteca como `p-limit`, ou criar uma lógica simples com array e Promises (resolvendo a promessa anterior antes de disparar a próxima).
- Configure o paralelismo de acordo com o ambiente (Local = máximo de 1 processamento síncrono. Cloud = permite concorrência maior, como 5).

### Passo 2.2: Refatorar o `server/_core/llm.ts`
- O "Gargalo da Garrafa" acontece dentro do arquivo `llm.ts` na `function invokeLLM`.
- O Agente deve modificar `invokeLLM` para que toda a comunicação interna com a engine passe primeiramente por essa nova fila de execução (ex: `TaskQueue.enqueue(() => processo_real())`).
- Caso seja Ollama (`provider === "ollama"`), a execução deve seguir a limitação rígida `MAX_CONCURRENT=1`. 

### Passo 2.3: Atualização de Variáveis de Ambiente
- Criar a leitura de váriaveis: `MAX_CONCURRENT_OLLAMA_CALLS=1` e suporte dentro de `env.ts`.

### Passo 2.4: Log e Telemetria (Acompanhamento)
Crie o monitoramento no console durante o controle da fila, exibindo:
- *[TaskQueue]* Processo `[${tipo}/${provider}]` entrou na Fila. Tamanho da fila: `X`.
- *[TaskQueue]* Iniciando Processo da fila. Tempo na espera: `Y ms`.
- *[TaskQueue]* Tarefa Concluída. Resolvendo próxima da Fila...

### Passo 2.5: Mitigação de Timeouts da Interface (Atenção redobrada)
- **Correção mandatória:** O temporizador de `timeoutMs` não pode estar contando o tempo de "espera da fila", caso contrário a task sempre vai dar falha antes mesmo de rodar. O timeout de chamadas deve **iniciar apenas a partir do momento em que a tarefa sai da fila e a requisição HTTP local via Axios/fetch é iniciada.**

## 3. Retorno
Ao finalizar todas estas implementações:
1. Certifique-se de não destruir funcionalidades vigentes e manter os imports corretos do _core_.
2. Comunique ao usuário a finalização. O Arquiteto Chefe (Eu, Antigravity) irei varrer os logs e analisar se sua implementação de infraestrutura foi adequada quando o usuário me chamar de volta.
