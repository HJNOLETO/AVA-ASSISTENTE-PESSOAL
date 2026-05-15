# Arquitetura de Memória e Auto-Expansão (Self-Healing)

**Data:** 2026-05-15
**Objetivo:** Documentar a filosofia de design para a evolução contínua do AVA, focando na integridade do núcleo, amputação/criação de "membros" (skills) e a taxonomia da memória cognitiva.

---

## 1. O Princípio da Integridade do Núcleo (O Cérebro vs. Os Membros)
Para que o AVA possa evoluir sozinho sem o risco de se autodestruir (*Death Loop*), aplicamos o conceito de **Biologia de Software**:
- **O Cérebro (Intocável):** A pasta `server/_core` e a base de dados principal. O AVA *nunca* tem permissão para reescrever seu próprio núcleo operacional. Isso garante que a capacidade de "acordar" e "pensar" nunca seja corrompida.
- **Os Membros (Braços e Pernas):** As pastas `.agent/skills` e `.opencode`. Aqui o AVA tem permissão total (Sandboxing). Ele pode criar scripts novos para resolver problemas que não sabia resolver, e pode excluir (amputar) habilidades que ficaram obsoletas ou estão com falhas, reconstruindo-as do zero.

### Proteção Contra Alucinação e Duplicação
Antes de "criar um novo braço", o AVA executa uma **Reflexão Prévia (RAG para Código)**. Ele obrigatoriamente pesquisa seu `ToolRegistry` interno. Apenas se confirmar que a ferramenta ou solução ainda não existe, ele tem permissão para codificar uma nova. Isso evita que a IA reinvente a roda ou duplique código inútil.

---

## 2. A Evolução da Memória (Taxonomia Cognitiva)

A memória não pode ser um bloco gigante de texto. Se a IA lembrar de tudo ao mesmo tempo, ela fica lenta, confusa e cara (estouro de tokens). A memória do AVA deve ser dividida como a memória humana:

### A. Memória Global (O "Subconsciente" e a Identidade)
* **O que é:** Regras universais, seu nome, suas preferências de tom (mais formal ou direto), o formato de resposta desejado e restrições absolutas de segurança.
* **Uso:** É injetada em **todas** as interações, mas deve ser minúscula (poucos tokens).

### B. Memória Local (A "Memória de Trabalho" / Curto Prazo)
* **O que é:** O que está acontecendo *agora*. A conversa dos últimos 15 minutos, a tela do terminal atual, a aba que você tem aberta.
* **Uso:** É volátil. Quando você muda de assunto ou o dia acaba, o Watchdog Daemon sumariza essa memória e a descarta, enviando apenas o suco da informação para as memórias de longo prazo.

### C. Memória Específica (O Contexto de Projeto)
* **O que é:** Memória atrelada a uma gaveta específica (ex: um repositório clonado no `.opencode` do GitHub).
* **Uso:** O AVA só carrega essa memória quando você entra naquele assunto. Se você pede para ele analisar o "Projeto X", ele carrega a arquitetura do Projeto X. Quando você pede para agendar o supermercado, ele *descarrega* o Projeto X da mente para focar na agenda. Isso traz foco absoluto (Zero-Shot Precision).

### D. Memória Especialista (A "Matriz" de Sub-Agentes)
* **O que é:** Bancos de dados vetoriais (RAG) independentes e treinados. É a "terceirização" do cérebro.
* **Uso:** O AVA principal não precisa saber as leis de Direito Civil de cor. Em vez disso, ele tem a *Memória Especialista Jurídica*. Quando você faz uma pergunta legal, o AVA principal delega a pergunta para o "Sub-Agente Jurídico", que consulta sua base exclusiva, gera a resposta e devolve para o AVA principal. Isso permite criar "especialistas" (Médico, Jurídico, Financeiro) sem poluir a memória central.

---

## 3. Bancada de Trabalho: A Visão do `.opencode`
A aplicação mais segura e poderosa da auto-expansão não é o AVA alterar a si mesmo, mas sim **revisar e construir projetos externos**.
A pasta `.opencode` funciona como um Laboratório. O AVA pode:
1. Clonar o projeto do GitHub.
2. Ler a Memória Específica desse projeto.
3. Usar as ferramentas de Engenharia de Software (Membros) para criar, destruir e refatorar arquivos.
4. Escrever testes de segurança.
Se tudo der errado e a IA alucinar, o dano fica contido no Laboratório. O "Cérebro" do AVA segue intacto, pronto para apagar o laboratório e começar de novo.
