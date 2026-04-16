# AVA - Assistente Virtual Adaptativo v3.1 (Professional Edition)

Esta versão traz uma reformulação completa da interface inspirada no Claude.ai e a integração do novo sistema de agentes inteligentes.

## 🚀 Novidades da Versão 3.1

### 🎨 Interface Profissional
- **Layout Minimalista**: Barra lateral redesenhada com navegação intuitiva e botão de novo chat destacado.
- **Saudação Dinâmica**: Tela inicial que se adapta ao horário do dia e oferece sugestões de tarefas.
- **Chat Aprimorado**: Campo de entrada centralizado com suporte a múltiplos provedores (Forge/Ollama) e anexos.
- **Tema Profissional**: Cores e tipografia otimizadas para longas sessões de trabalho.

### 🤖 Sistema de Agentes Integrado
- **Orquestrador Inteligente**: O AVA agora detecta a intenção do usuário e carrega habilidades específicas.
- **App Builder**: Capacidade de orquestrar a criação de aplicações completas.
- **Systematic Debugging**: Agente especializado em identificação e correção de bugs em código.
- **Skills Extensíveis**: Pasta `.agent` integrada diretamente no fluxo de resposta do servidor.

## 🏗️ Estrutura do Projeto Atualizada

```
ava-assistant/
├── client/src/
│   ├── components/
│   │   ├── DashboardLayout.tsx   # Novo Layout Profissional
│   │   ├── AVAChatBox.tsx        # Chat Redesenhado
│   │   └── archive/              # Componentes antigos arquivados
│   ├── pages/
│   │   └── Home.tsx              # Nova Home com Sugestões
│   └── index.css                 # Novo Tema Visual
├── server/
│   ├── agents.ts                 # Orquestrador de Agentes (NOVO)
│   ├── routers.ts                # Integrado com Agentes
│   └── ...
└── docs/
    ├── chat-roadmap.md           # Referência de melhorias
    └── implementation-plan.md    # Plano de execução v3.1
```

## 🛠️ Como Iniciar

1. **Instalar Dependências**:
   ```bash
   pnpm install
   ```

2. **Configurar Banco de Dados**:
   ```bash
   pnpm db:push
   ```

3. **Executar em Desenvolvimento**:
   ```bash
   pnpm dev
   ```

## 👥 Autor
Desenvolvido e aprimorado com ❤️ por TMJ Noleto
