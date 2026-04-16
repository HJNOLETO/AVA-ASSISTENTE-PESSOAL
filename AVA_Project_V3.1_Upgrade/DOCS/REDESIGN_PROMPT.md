# PROMPT DE REDESIGN DE INTERFACE - AVA ASSISTANT V3.1

## Objetivo
Solicitar o redesign completo da interface do usuário (UI) e experiência do usuário (UX) para o AVA Assistant, focando em uma estética minimalista, futurista e altamente funcional (estilo "Linear" ou "Apple").

## Requisitos de UX/UI
1. **Estética Visual**:
    - **Tema**: Dark mode refinado com acentos em tons de "Electric Blue" ou "Deep Emerald".
    - **Superfícies**: Uso de Glassmorphism (efeito vidro fosco) com bordas sutilmente iluminadas.
    - **Tipografia**: Fontes Sans-serif modernas (ex: Inter, Geist, ou SF Pro) com hierarquia clara e legibilidade impecável.
    - **Ícones**: Estilo "Outline" fino e consistente (Lucide-react style).

2. **Componentes Chave**:
    - **Sidebar**: Retrátil, com transições suaves (0.3s ease-in-out), ícones claros e labels que aparecem apenas quando expandida.
    - **Área de Chat**: Centralizada, com largura máxima de 2xl (aprox. 42rem), mensagens com bolhas sutis ou separação por tipografia limpa.
    - **Input de Mensagem**: Transição dinâmica do centro da página (estado inicial) para a base (estado ativo). Design "floating" com botões de ação (anexo, voz, enviar) integrados de forma harmônica.
    - **Dashboard Administrativo**: Cards informativos com gráficos minimalistas, tabelas limpas e filtros intuitivos.
    - **Calendário**: Interativo, com visão de mês/semana e sistema de cores para diferentes tipos de compromissos.

3. **Padrões de Design**:
    - **Grid**: Sistema de grid flexível para garantir responsividade perfeita em desktop e mobile.
    - **Espaçamento**: Generoso ("Whitespace") para evitar poluição visual e focar na informação.
    - **Micro-interações**: Feedback visual imediato ao clicar em botões, hover effects suaves e loading states elegantes (skeletons).

## Referências Visuais
- **Linear.app**: Pela clareza de interface e navegação por comandos.
- **Apple Intelligence**: Pelo uso de gradientes suaves e feedback visual de IA.
- **Perplexity.ai**: Pela organização de fontes de informação e clareza no chat.
- **Raycast**: Pela eficiência e foco em produtividade.

## Especificação Técnica para Implementação
- **Framework**: React com Tailwind CSS.
- **Animações**: Framer Motion.
- **Componentes**: Radix UI (Primitives).
- **Acessibilidade**: Conformidade com WCAG 2.1 (contraste de cores, navegação por teclado).

---

**Prompt para IA Generativa (DALL-E/Midjourney)**:
> "High-fidelity UI design for a futuristic AI assistant dashboard, dark mode, glassmorphism, minimalist sidebar, centered chat interface with clean typography, electric blue accents, professional productivity tool aesthetic, sleek and modern, 4k resolution, user interface kit style."
