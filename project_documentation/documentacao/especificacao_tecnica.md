# Documento de Especificação Técnica - AVA Assistant v3.1

## 1. Visão Geral
O AVA Assistant v3.1 é um ecossistema de inteligência artificial avançado projetado para atuar como um assistente pessoal e profissional multifuncional. O sistema integra capacidades de processamento de linguagem natural (LLM), visão computacional, processamento de áudio e manipulação de arquivos para fornecer uma experiência de automação e suporte sem precedentes.

## 2. Arquitetura do Sistema
O sistema segue uma arquitetura cliente-servidor moderna:
- **Frontend:** Desenvolvido em React com Vite, utilizando Tailwind CSS para uma interface clean e responsiva.
- **Backend:** Node.js com TypeScript, utilizando tRPC para comunicação tipo-segura (type-safe) entre cliente e servidor.
- **Banco de Dados:** SQLite para persistência local rápida e eficiente, gerenciado via Drizzle ORM.
- **Integração LLM:** Abstração para múltiplos provedores (OpenAI, Claude, LLMs locais via Ollama).
- **Processamento de Áudio:** Integração com Whisper API para transcrição de alta precisão.

## 3. Tecnologias Utilizadas
- **Linguagens:** TypeScript (Full-stack)
- **Framework Web:** React + Vite
- **Comunicação:** tRPC + Zod (Validação)
- **Estilização:** Tailwind CSS + Radix UI / Shadcn UI
- **ORM:** Drizzle ORM
- **Banco de Dados:** SQLite
- **Inteligência Artificial:** OpenAI (GPT-4, Whisper), Anthropic (Claude), Ollama (Local)
- **Gerenciamento de Estado:** TanStack Query (React Query)

## 4. Fluxo de Dados
1. **Entrada do Usuário:** Texto, áudio ou arquivos são enviados via interface React.
2. **Processamento tRPC:** As requisições são validadas pelo Zod e processadas pelos routers específicos no servidor.
3. **Camada de Serviço:** O servidor decide se a tarefa requer processamento local, consulta ao banco de dados ou chamada externa de LLM.
4. **Módulo RAG:** Para consultas contextuais, o sistema recupera fragmentos relevantes de documentos indexados no SQLite antes de enviar o prompt final à LLM.
5. **Persistência:** Todas as interações, logs de auditoria e configurações são salvas no banco SQLite.
6. **Resposta:** O sistema retorna a resposta estruturada para o frontend, que atualiza a UI em tempo real.

## 5. Requisitos Funcionais (Funcionalidades Obrigatórias)

### 5.1. Sistema de Autenticação e Autorização (Auth & RBAC)
- **Login Seguro:** Validação de credenciais com hash de senha (argon2/bcrypt).
- **Controle de Sessão:** Tokens JWT ou Cookies seguros com expiração controlada.
- **Recuperação de Senha:** Fluxo completo de redefinição de senha via e-mail ou código de segurança.
- **Níveis de Permissão (RBAC):**
    - `User`: Acesso básico ao chat e seus próprios documentos.
    - `Admin`: Acesso total ao painel administrativo, gestão de usuários e logs globais.

### 5.2. Painel Administrativo
- **Dashboard Analítico:** Visualização de uso de tokens, volume de mensagens e métricas do sistema.
- **Gestão de Usuários:** Interface para criar, editar, desativar usuários e alterar permissões.
- **Logs de Atividades:** Auditoria detalhada de operações de sistema, especialmente modificações de arquivos.
- **Configurações:** Gerenciamento de chaves de API, modelos padrão e limites de sistema.

### 5.3. Módulo RAG Avançado e Automação Proativa
- **RAG Multi-Fonte (Open WebUI Inspiration):** Integração de busca web em tempo real (Google/Brave Search) para enriquecer respostas com dados atuais. Suporte a múltiplos bancos de dados vetoriais.
- **Artefatos e Gestão de Conhecimento:** Sistema de armazenamento de "Artefatos" (documentos, códigos, tabelas) que podem ser editados e visualizados em uma janela lateral dedicada.
- **Automação Proativa (OpenClaw Inspiration):** A AVA não apenas responde, ela executa. Sistema de background tasks para:
    - **Cron Jobs:** Monitoramento de emails e notificações em intervalos definidos.
    - **Self-Healing:** Execução de testes agendados e correção automática de bugs detectados em logs.
    - **Contexto Persistente:** Memória "Self-Hackable" onde a AVA armazena preferências aprendidas para otimizar futuras interações.
- **Loop de Voz-Ação-Resultado (Conversational DevOps):**
    1. **Comando de Voz:** Usuário solicita via áudio (ex: "Prepare o ambiente de produção").
    2. **Ação OpenCode:** AVA traduz para comandos CLI e executa no terminal integrado.
    3. **Monitoramento:** AVA observa o output do terminal em tempo real.
    4. **Relatório Vocal:** AVA responde por voz confirmando o sucesso ou detalhando erros encontrados.
- **Capacidade OpenCode:** Integração de um terminal interativo no chat para compilação e execução de scripts (Python/Node/Go).

### 5.4. Interface Híbrida (Chat + Console)
- **Chat Web Principal:** Interface React moderna para conversação.
- **Console Integrado:** Um terminal (PowerShell/Bash) simulado ou anexado dentro da página web, permitindo que o usuário veja a AVA trabalhando no código, instalando dependências ou rodando servidores em tempo real.

### 5.4. Gerenciamento de Documentos
- **Upload e Organização:** Sistema para subir PDFs, TXTs e imagens, organizados por pastas ou categorias.
- **Análise Profissional:** EVA analisa mockups e documentos de estudo para extrair insights e gerar resumos estruturados.

### 5.5. Sistema de Post-its Digitais
- **Drag and Drop:** Interface interativa para organizar notas visuais.
- **Funcionalidades:** Alarmes de lembrete, categorização por cores, priorização (Alta, Média, Baixa) e busca avançada por conteúdo.

### 5.6. Agenda e Cadastro de Clientes
- **Calendário Interativo:** Visualização diária, semanal e mensal de compromissos.
- **Agendamento:** Gestão de conflitos de horários e notificações automáticas.
- **Cadastro Detalhado:** Formulários com validação rigorosa, histórico de interações e integração direta com a agenda.

## 6. Requisitos Não-Funcionais
- **Segurança:** Criptografia de dados sensíveis e sanitização de entradas.
- **Performance:** Respostas de chat em menos de 2 segundos (excluindo latência da LLM).
- **Portabilidade:** Rodar localmente em Windows/Linux/Mac com dependências mínimas.
- **Escalabilidade:** Estrutura modular que permite adicionar novos domínios de conhecimento facilmente.

## 7. Casos de Uso Principais
1. **Estudante:** Faz upload de um documentário em áudio, EVA transcreve, gera uma apostila resumida e cria flashcards para estudo.
2. **Profissional de Saúde/Direito:** Cadastra um cliente, agenda uma consulta/reunião e utiliza o RAG para consultar o histórico de casos similares.
3. **Desenvolvedor:** Utiliza a EVA para ler e editar arquivos do projeto, realizando backups automáticos e mantendo um log de auditoria das mudanças.
