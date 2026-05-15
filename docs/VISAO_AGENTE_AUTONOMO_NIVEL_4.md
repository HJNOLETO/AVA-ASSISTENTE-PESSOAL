# Visão Estratégica: AVA como Agente Autônomo (Nível 4)

**Data:** 2026-05-15
**Objetivo:** Estabelecer o "norte" arquitetural para a transição do AVA de um assistente reativo (Nível 2) para um colaborador e gerente proativo (Níveis 3 e 4).

---

## 1. O Ponto de Chegada (A Visão)
A automação que buscamos não é apenas disparar alertas de calendário. É transformar o AVA em uma inteligência de background que trabalha de forma invisível. 

O AVA deve ser capaz de:
- **Engenharia (Nível 3):** Receber uma ordem de alto nível (*"Crie uma landing page"*), usar suas ferramentas, criar os arquivos, validar e avisar quando terminar.
- **Educação (Nível 3):** Assumir a postura de um Mentor Socrático, ensinando assuntos e acompanhando o nível de domínio em tópicos fracionados.
- **Análise Profunda (Nível 3):** Digerir PDFs longos de forma estruturada via RAG (Retrieval-Augmented Generation).
- **Proatividade (Nível 4 - O Santo Graal):** Acordar sozinho, analisar o contexto (ex: um novo arquivo na pasta, uma tarefa atrasada ou uma notícia importante) e **tomar a iniciativa** de conversar com o usuário, delegando a si mesmo o trabalho.

---

## 2. O Desafio de Engenharia (Hardware vs. Autonomia)
Para o AVA estar "sempre ativo e procurando", não podemos cometer o erro de deixar a LLM pesada (Gemini / Ollama de 30b+) rodando em looping infinito. Isso consome VRAM local, drena bateria, causa lentidão e estoura limites de APIs na nuvem.

A solução técnica que adotaremos é a **Arquitetura de Delegação por Eventos (Watchdog Daemon)**.

---

## 3. A Arquitetura do Agente Autônomo (Como Faremos)

Em vez da Inteligência Artificial (LLM) ficar acordada esperando algo acontecer, usaremos o software clássico como "Vigia" para acordar a IA apenas quando necessário.

### A. O Cão de Guarda (Node.js Watchdog)
Um serviço em background (`autonomous-daemon.ts`) rodando com consumo de 0% de hardware pesado. Ele monitora:
- O relógio (tarefas de rotina).
- O banco de dados (progresso de estudos, RAG).
- O sistema de arquivos (novos PDFs no `Drive_Sync`).

### B. O Acordar do Raciocínio (State Prompt)
Se o Watchdog perceber que algo mudou (ex: faltam 10 minutos para uma audiência ou o usuário não estuda há 2 dias), ele monta um "State Prompt" (o estado do mundo atual) e envia para a LLM.
> *"AVA, são 10h. O usuário tem um PDF não lido e uma revisão pendente. Analise a situação, invoque as ferramentas necessárias e aja para ajudar o usuário de forma autônoma."*

### C. A Ação da LLM (Delegação e Ferramentas)
Acordada, a LLM raciocina e usa seu **Tool Registry**:
1. Pode criar um resumo usando o motor RAG de forma invisível.
2. Pode usar o comando de terminal para preparar o ambiente.
3. Por fim, invoca a ferramenta do **Telegram** para notificar o usuário da ação tomada (ex: *"Resumi o PDF novo que você colocou na pasta. Quer debater sobre ele?"*).

### D. Roteamento Inteligente (Modelos Pequenos vs Grandes)
Para economizar recursos locais, o AVA utilizará SLMs (Small Language Models como `llama3.2:3b` ou `qwen2.5:7b`) para a tomada de decisão rápida de "devo agir agora?", e deixará as LLMs pesadas (Gemini Flash ou Ollama 30b) para quando for estritamente necessário processar raciocínios complexos (ex: codificar um site ou resumir um livro).

---

## 4. Próximos Passos (Roadmap de Implementação)

1. **Implementar o `autonomous-daemon.ts`**: Criar a espinha dorsal do loop de eventos.
2. **Conectar o Telegram ao Daemon**: Fazer com que o daemon chame o motor unificado (`unified-engine.ts`), e o motor possa enviar mensagens via Telegram para o usuário sem ter recebido um `/comando`.
3. **Refinar as Tools de Criação**: Garantir que as *skills* de engenharia e RAG estejam robustas no Tool Registry para aguentarem a execução sem intervenção humana.
4. **Revisar Histórico de Lembretes**: Integrar a `DIRETRIZ_HISTORICO_LEMBRETES_JURIDICO_PESSOAL` ao cérebro do Daemon para que ele não apenas avise, mas consolide as rotinas de retenção de memória.

Este documento guiará nossas decisões de código daqui para frente, garantindo que qualquer nova função desenvolvida responda à pergunta: **"Isso nos aproxima do Nível 4?"**
