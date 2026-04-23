# O Plano JARVIS: Evolução Arquitetural do AVA Assistant

Baseado nas reflexões do documento de possibilidades e no princípio fundamental de IA Agêntica (Agentic AI), construí este mapa de evolução. O objetivo é transformar a AVA de uma "ferramenta reativa de perguntas e respostas" (Chatbot) em uma **entidade proativa, ubíqua e autônoma** (um assistente estilo JARVIS), mas respeitando as duras limitações de hardware de inferência local (visto que modelos rodando localmente consomem severa RAM/VRAM).

Aqui está o roadmap de ideias pautados no que já temos de infraestrutura (Node.js, TypeScript, Ollama local e Fila de Execução recém-construída).

---

## 🏗️ 1. O Salto para a Autonomia: Loop de Raciocínio (ReAct / OODA)

Atualmente, se você pede para a AVA fazer algo complexo, ela faz uma Call de Função e tenta resolver tudo num turno só. O JARVIS não opera num turno; ele *pensa, tenta, erra, corrige e entrega o resultado*.

*   **A Implementação Sustentável:** Usar a infraestrutura atual para criar um "Controlador de LOOP" (um `while` no backend Node.js) inspirado em arquiteturas de Agentes como o LangGraph.
*   **Como respeita o hardware:** Graças à nossa nova `TaskQueue` (limitando 1 requisição local por vez), o Loop processaria as tentativas sequencialmente sem explodir e congelar o Windows.
*   **Ação:** O AVA receberia um objetivo ("Analise a base de dados de clientes, descubra quem tem pendência, gere um CSV e salve nos meus documentos"). O Loop o faria delegar: `[Ler DB] -> [Refletir: Faltou algo?] -> [Filtrar Dados] -> [Rodar código bash para criar pasta] -> [Salvar CSV]`, entregando apenas a notificação de finalização validada pro usuário.

## 🔎 2. Consciência de Contexto sem Fritar a Placa de Vídeo (Visão vs. Acessibilidade)

No documento foi levantado o Computer Use (Visão Computacional para o AVA "ver" a sua tela em tempo real). 
*   **O Problema (Gargalo de Hardware):** Processar imagens via IA de Visão continuamente local extenua a máquina. A janela de contexto de imagens é massiva (Swap de Memória constante em cima do disco C).
*   **Solução Estilo JARVIS (Eficiente):** O JARVIS sabe no que o Tony Stark está focado porque ele "lê a semântica" dos aparelhos, não necessariamente tirando "fotos" deles. 
*   **Ação Prática:** Criar uma ponte nativa (ou usar extensões de acessibilidade) que leia a "Árvore da Janela Ativa" ou o conteúdo da sua Área de Transferência. Se você estiver numa página e debater com a AVA, ela magicamente enviará o HTML bruto limpo ou o texto destacado em background para o Ollama como texto puro (extremamente mais barato computacionalmente), permitindo uma automação invisível ("Browser Puppet" via Playwright headless) para navegar na web por você e preencher formulários, ao invés de depender de IA de Pixels.

## 🗃️ 3. A Arte da Gestão de "Artefatos" ("Sai do Chat!")

Eu criei arquivos reais na sua máquina porque o chat é um péssimo lugar para mostrar código extenso ou relatórios dinâmicos. Quando o chat cresce demais, estouramos a contagem de Tokens (Janela de Contexto local) enviando o histórico gigante, "esquecendo" tudo ou falhando miseravelmente no Ollama.
*   **Ação Prática:** Construir uma infraestrutura "Artifacts" na interface React do AVA (semelhante ao Claude).
*   **O Roteiro:** Quando o AVA for criar código enorme (`generar_arquivo`) ou um relatório jurídico monstro, ela escreve um documento `.md` num painel lateral. O front-end React *escuta* as mudanças desse arquivo e renderiza uma bela janela lateral fluida e viva. O histórico de mensagens do Chat recebe apenas "Sintetize" / "Concluí senhor, veja ao lado", limpando os tokens do Chat e permitindo altíssima produtividade.

## 🛠️ 4. Agência de Máquina: Integração com Terminal Local (Ferramenta Root)

O JARVIS compila a armadura, a AVA precisa poder rodar a engrenagem do PC. Ela precisa executar scripts na sua máquina para testar código ou organizar os seus arquivos, sem precisar pedir para você digitar.
*   **A Implementação:** Uma Tool chamada `execute_terminal_command`.
*   **Barreira de Segurança (Guardrails de Ferro):** Construir uma "Sandbox". O Node.js aceitará rodar shell/cmd, mas passará por um `GuardRail Router`. Comandos destrutivos (como `rm -rf`, deleções, alterações globais) são bloqueados pela AVA, OU retidos no Chat para que você (o Humano) clique num botão **"Aprovar"** antes da execução correr na máquina.
*   **O Ganho Absoluto:** Você manda "Baixe a dependência, construa a build e verifique o log de erro". AVA roda o comando, aguarda `async`, lê a tela preta preta sozinha, entende o erro (tipo falta de Typescript) e auto-corrige no arquivo local. Mágica.

## 🕰️ 5. Ubiquidade e Fila Proativa (Background Workers Silenciosos)

O JARVIS trabalha quando o Tony dorme. Assistentes verdadeiros não precisam da interface web de chat em aberto aguardando no Foreground para agir.
*   **O Racional:** Máquinas locais ficam ociosas boa parte do dia. Como já implementamos um limitador perfeito na fila, podemos encher a fila de "Tarefas Frias" em background.
*   **A Implementação:** Uma tabela/worker de "Cron Jobs" (como o BullMQ ou Node Cron no servidor). O usuário manda (seja texto ou voz): "AVA, todo dia de madrugada raspe as atualizações do Jusbrasil e resuma pra mim." O Worker será atirado na `TaskQueue`, puxará os recursos lentos do Ollama de forma assíncrona, não vai travar nada (limitado a 1 processo na fila), e de manhã quando você abrir, a interface exibirá uma Notificação Rica / Email prontas na tela inicial. Nada síncrono. Tudo por baixo dos panos.

---

## 🚨 Conclusão: Por onde começar a revolução?

Em um ambiente "Hardware Constraint" (onde a CPU e Memória são ouro e não rodam na Nuvem escalável), Inteligência = Organização Assíncrona e Gestão Limpa de Contexto de Texto.

Recomendo a priorização imediata nas duas vertentes que causaram maior fricção visual e conceitual até então:
1. **Pilar 3: Criação da Infraestrutura de Artefatos no Painel Web** (Limpa o chat, diminui vertiginosamente o gasto de memória/tokens, e melhora a leitura de saídas gigantescas).
2. **Pilar 4: Implementação da Tool de Execução do Sistema (`Command Runner` com botão de Aprovação / Intervenção Humana do Guardrail)** - Permitindo que a aplicação evolua e construa projetos práticos pra você.
