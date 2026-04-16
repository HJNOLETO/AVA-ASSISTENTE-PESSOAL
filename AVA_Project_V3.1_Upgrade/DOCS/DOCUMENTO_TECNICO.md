# DOCUMENTO TÉCNICO - AVA ASSISTANT V3.1

## 1. Visão Geral do Sistema
O **AVA Assistant v3.1** é uma plataforma de assistência virtual inteligente de última geração, projetada para oferecer suporte especializado em múltiplos domínios (Direito, Medicina, Desenvolvimento, etc.) através de uma interface de chat intuitiva e poderosa. O sistema integra inteligência artificial avançada para processamento de linguagem natural, transcrição de áudio e gerenciamento autônomo de arquivos.

## 2. Arquitetura do Sistema
O sistema segue uma arquitetura cliente-servidor moderna:
- **Frontend**: Aplicação Single Page (SPA) construída com React e TypeScript.
- **Backend**: Servidor Node.js utilizando tRPC para comunicação tipo-segura (type-safe) entre cliente e servidor.
- **Banco de Dados**: SQLite para persistência local rápida, com suporte a modelagem relacional para gerenciar usuários, conversas, mensagens e logs de auditoria.
- **Integração de IA**: 
    - **LLM**: Integração com Claude (Anthropic), OpenAI e Ollama.
    - **Transcrição**: OpenAI Whisper para conversão de áudio em texto.
    - **RAG (Retrieval-Augmented Generation)**: Sistema de memória semântica para indexação e recuperação de conhecimento.

## 3. Tecnologias Utilizadas
- **Linguagem**: TypeScript (Full-stack)
- **Frontend**: React, Tailwind CSS, Framer Motion (animações), Radix UI (componentes acessíveis).
- **Comunicação**: tRPC, Zod (validação de esquemas).
- **IA/ML**: LangChain (potencial), OpenAI SDK, Anthropic SDK.
- **Banco de Dados**: Drizzle ORM ou Prisma (recomendado para a nova fase).
- **Ferramentas**: Vitest (testes), Vite (build tool).

## 4. Fluxo de Dados
1. O usuário interage através da interface de chat (texto ou voz).
2. O áudio (se houver) é enviado para o servidor, transcrito pelo Whisper e retornado como texto.
3. A mensagem é enviada via tRPC para o servidor.
4. O servidor consulta o banco de dados e o sistema RAG para obter contexto relevante.
5. O prompt enriquecido é enviado ao LLM selecionado.
6. A resposta do LLM é processada, salva no histórico e enviada de volta ao cliente.
7. Se solicitado, o sistema realiza operações de arquivo (leitura/escrita) com validação de segurança e confirmação do usuário.

## 5. Requisitos Funcionais (Upgrade v3.1)
- **Autenticação e Autorização**: Sistema completo de login, recuperação de senha e RBAC (User/Admin/Maintainer).
- **Painel Administrativo**: Dashboard para gestão de usuários, monitoramento de recursos e logs de auditoria.
- **Módulo RAG**: Indexação inteligente de documentos PDF, TXT e URLs para aprendizado contínuo da IA.
- **Gestão de Documentos**: Upload, organização e análise de materiais de estudo.
- **Post-its Digitais**: Sistema de notas rápidas com alarmes e categorização.
- **Agenda e CRM**: Calendário interativo para agendamento de clientes e cadastro detalhado de contatos.

## 6. Requisitos Não-Funcionais
- **Segurança**: Criptografia de dados sensíveis, validação rigorosa de paths de arquivos e tokens de confirmação para operações críticas.
- **Performance**: Transcrições de áudio em menos de 10 segundos e respostas de chat em tempo real.
- **Escalabilidade**: Estrutura modular para fácil adição de novos domínios de conhecimento.
- **Usabilidade**: Interface minimalista, responsiva e com suporte a temas.

## 7. Casos de Uso Principais
- **Estudante**: Transcreve uma palestra, solicita um resumo estruturado e gera flashcards para estudo.
- **Profissional**: Agenda reuniões com clientes, gerencia documentos de casos e utiliza a IA para redigir rascunhos.
- **Desenvolvedor**: Utiliza a EVA para ler e editar arquivos de código com segurança através de previews e dry-runs.
