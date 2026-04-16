# Tecnologias Desenvolvidas - AVA Assistant

Este documento resume as tecnologias e funcionalidades implementadas no sistema de Login e Autenticação do AVA Assistant.

## 🛠 Stack Tecnológica

### Frontend
- **Framework**: React 19 (com TypeScript)
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS v4 (Design moderno, responsivo e com suporte a temas)
- **Animações**: Framer Motion (Transições suaves entre abas e estados)
- **Componentes UI**: Radix UI (Acessibilidade e componentes primitivos)
- **Ícones**: Lucide React
- **Roteamento**: Wouter (Leve e eficiente)
- **Gerenciamento de Estado/API**: TanStack Query & TRPC Client
- **Notificações**: Sonner (Toasts flutuantes)

### Backend
- **Ambiente**: Node.js
- **Framework**: Express (Servidor web)
- **API**: TRPC (Type-safe API para comunicação entre cliente e servidor)
- **ORM**: Drizzle ORM (Manipulação segura do banco de dados)
- **Banco de Dados**: SQLite (Local via better-sqlite3)
- **Segurança**:
  - **Criptografia**: Bcryptjs (Hashing de senhas)
  - **Tokens**: Jose (JWT para sessões seguras)
  - **Validação**: Zod (Esquemas de dados rigorosos)

## 🔑 Funcionalidades de Login & Segurança

1.  **Autenticação Local**: Login e registro com e-mail e senha.
2.  **Gestão de Sessão**: Cookies seguros com validade de longo prazo.
3.  **Recuperação de Senha**:
    - Via E-mail (Simulado com geração de tokens).
    - Via **Carta de Segurança** (Método alternativo robusto).
4.  **Validação de Senha**: Indicador visual de força da senha (score 0-100).
5.  **Segurança Avançada**:
    - **Honeypot**: Campo oculto para detectar bots de registro.
    - **Simulação de Captcha**: Verificação humana integrada ao fluxo.
    - **Lembrar-me**: Persistência segura de preferências no localStorage.
6.  **Interface UI/UX**:
    - Tabs para alternar entre Login e Cadastro.
    - Feedback instantâneo de erros nos campos.
    - Visualização/Ocultação de senha.
    - Design focado em produtividade e clareza visual.
