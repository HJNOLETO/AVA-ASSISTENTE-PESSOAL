# AVA - Assistente Virtual Adaptativo | TODO

## Funcionalidades Obrigatórias

### Núcleo de Hardware e Modos
- [x] Sistema de detecção automática de hardware (CPU, RAM, GPU)
- [x] Implementar modo ECO (APIs remotas, modelos Tiny)
- [x] Implementar modo STANDARD (modelos locais 3-7B, ChromaDB)
- [x] Implementar modo PERFORMANCE (modelos 8B+, reranking)
- [x] Seleção automática de modo baseada em recursos disponíveis
- [x] Fallback seguro entre modos

### Interface de Chat
- [x] Componente de chat interativo (input + histórico)
- [x] Renderização de markdown com Streamdown
- [x] Histórico de conversas persistido no banco de dados
- [x] Timestamps para cada mensagem
- [x] Suporte a múltiplas conversas/threads
- [x] Indicador de status de digitação (typing indicator)

### Dashboard de Monitoramento
- [x] Monitoramento em tempo real de CPU (%)
- [x] Monitoramento em tempo real de RAM (GB/%)
- [x] Monitoramento em tempo real de GPU (VRAM %)
- [x] Gráficos de histórico de recursos (últimas 1h)
- [x] Indicadores de saúde do sistema
- [x] Alertas de limite de recursos

### Integração com APIs de IA
- [ ] Integração com LLM (Claude/GPT via Manus API)
- [ ] Fallback para modelos locais simulados (STANDARD/PERFORMANCE)
- [ ] Streaming de respostas LLM
- [ ] Tratamento de erros e rate limiting
- [ ] Cache de respostas frequentes

### Speech-to-Text (STT)
- [ ] Integração com Whisper API (Manus)
- [ ] Captura de áudio do navegador
- [ ] Transcrição com suporte a PT-BR
- [ ] Indicador de gravação ativa
- [ ] Fallback para entrada de texto

### Sistema de Memória
- [ ] Banco de dados SQLite para keywords (ECO mode)
- [ ] Simulação de ChromaDB com embeddings MiniLM (STANDARD)
- [x] Busca por keywords
- [x] Busca semântica (simulada)
- [x] Limpeza automática de memória antiga
- [x] Exportação de memória

### Configurações e Visualização
- [ ] Painel de configurações de modo
- [ ] Visualização de capacidades ativas (STT, LLM, TTS, Memória)
- [ ] Seletor manual de modo (com aviso de compatibilidade)
- [ ] Configuração de parâmetros de LLM (temperatura, top_p, etc)
- [ ] Preferências de usuário (tema, idioma)

### Histórico e Logging
- [ ] Histórico de comandos com timestamps
- [ ] Histórico de respostas do assistente
- [ ] Logs de operações do sistema
- [ ] Exportação de histórico (JSON/CSV)
- [ ] Busca no histórico

## Tarefas Técnicas

### Banco de Dados (Drizzle)
- [x] Tabela de conversas (conversations)
- [x] Tabela de mensagens (messages)
- [x] Tabela de memória (memory_entries)
- [x] Tabela de configurações de usuário (user_settings)
- [x] Tabela de logs do sistema (system_logs)
- [x] Índices para performance

### Backend (tRPC)
- [x] Procedimento de detecção de hardware
- [x] Procedimento de chat (enviar mensagem)
- [x] Procedimento de monitoramento de recursos
- [x] Procedimento de busca em memória
- [x] Procedimento de configuração de modo
- [x] Procedimento de histórico de conversas
- [ ] Procedimento de STT (transcrição)

### Frontend (React)
- [x] Página principal com layout de chat
- [x] Componente ChatBox (AIChatBox customizado)
- [x] Componente ResourceMonitor (gráficos em tempo real)
- [x] Componente ModeSelector
- [ ] Componente Settings
- [x] Componente MemoryViewer
- [ ] Componente CommandHistory

### Integração com Manus APIs
- [ ] Configurar LLM (invokeLLM)
- [ ] Configurar STT (transcribeAudio)
- [ ] Configurar notificações (notifyOwner)
- [ ] Variáveis de ambiente necessárias

### Testes
- [x] Testes de detecção de hardware
- [x] Testes de seleção de modo
- [ ] Testes de procedimentos tRPC
- [ ] Testes de componentes React
- [ ] Testes de integração com APIs

### Documentação
- [ ] README.md com instruções de setup
- [ ] Documentação de arquitetura
- [ ] Guia de uso do assistente
- [ ] Documentação de APIs internas
- [ ] Troubleshooting

## Status Geral
- **Fase Atual**: 3 - Interface de Chat
- **Progresso**: 50%
- **Última Atualização**: 2026-01-29
