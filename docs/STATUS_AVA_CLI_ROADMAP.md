# Status AVA CLI Roadmap

Base: `docs/AVA_CLI_ROADMAP.md` e `docs/CHECKLIST_IMPLEMENTACAO_AVA_CLI_ROADMAP.md`

## Padrao de evidencia por tarefa

- `codigo`: diff em arquivo versionado (com caminho e trecho alterado)
- `execucao`: log de comando local (`npx tsx ...`, `pnpm ...`, `docker-compose ...`)
- `validacao_manual`: passos + resultado observado (Telegram/CLI)
- `documentacao`: atualizacao em `.md` com data e contexto

Cada tarefa concluida deve registrar ao menos 1 evidencia de `codigo` e 1 de `execucao` ou `validacao_manual`.

## Status por fase

### Fase 0 - Correcoes imediatas

- `ask-ava.bat` ajustado para runtime Docker estavel: concluido
  - usa `ava-cli-runtime` (evita travamento em `Creating` no Windows)
  - fallback automatico para `--provider gemini` se provider padrao falhar
- fallback de conversa livre no Telegram: concluido
- tools no CLI:
  - `gerenciar_agenda`: concluido
  - `criar_lembrete`: concluido
  - `listar_lembretes`: concluido
  - `registrar_historico_estudo`: concluido
- smoke test completo ponta-a-ponta (CLI + Telegram): pendente de homologacao
- roteiro pratico de homologacao publicado: `docs/GUIA_TESTES_PRATICOS_AVA_CLI.md`

### Fase 1 - Autonomia real

- Status geral: em andamento
- File CRUD com sandbox inicial: concluido em codigo (faltando homologacao operacional)
  - validacao de escrita/delecao por whitelist (`AVA_WORKSPACE_DIRS`)
  - leitura com areas permitidas (`process.cwd`, `AVA_WORKSPACE_DIRS`, `AVA_READONLY_DIRS`)
  - tools habilitadas: `criar_arquivo`, `mover_arquivo`, `copiar_arquivo`, `renomear_arquivo`, `apagar_arquivo`, `criar_pasta`
  - auditoria por operacao (`FILE_OP`) em `data/ava-cli-audit.log`
  - `.env` com baseline de `AVA_WORKSPACE_DIRS` e `AVA_READONLY_DIRS`
- Busca web/navegacao inicial: concluido parcialmente
  - `buscar_web`, `navegar_pagina`, `extrair_conteudo_estruturado` ativos no CLI
  - timeout de 30s e limite de retorno textual aplicados
  - Playwright headless: pendente (implementacao atual em fallback HTTP)
- Homologacao exaustiva automatizada: em andamento
  - suite criada em `scripts/test-ava-cli-exaustivo.ts` (cenarios reais com retries e timeout longo)
  - comando: `pnpm test:ava-cli:exaustivo`
  - rodada 2026-04-25 executada e documentada em `docs/RELATORIO_TESTES_EXAUSTIVOS_2026-04-25_exaustivo-2026-04-25T19-19-52-324Z.md`
  - bloqueio atual: Ollama local responde `/api/tags`, mas trava em `/api/chat` (timeout mesmo com `llama3.2:3b`)
  - rodadas Ollama cloud comparativas (2026-04-25):
    - `qwen3.5:397b-cloud`: melhor resultado ate agora (8/10, 1 falho, 1 ignorado) em `docs/RELATORIO_TESTES_EXAUSTIVOS_2026-04-25_exaustivo-2026-04-25T21-37-16-541Z.md`
    - `minimax-m2.7:cloud`: desempenho inferior e timeouts em web/extração em `docs/RELATORIO_TESTES_EXAUSTIVOS_2026-04-25_exaustivo-2026-04-25T21-47-40-500Z.md`
    - `qwen3.5:397b-cloud` apos ajustes de memoria operacional + prompts deterministas: 11/11 aprovados (0 falhos, 0 ignorados) em `docs/RELATORIO_TESTES_EXAUSTIVOS_2026-04-25_exaustivo-2026-04-25T22-37-39-466Z.md`

### Fase 2 - Orquestracao multi-IA

- Status geral: pendente
- Governanca de skills (preparacao): em andamento
  - prioridade de fonte de skills configuravel por `AVA_SKILLS_MODE` (`agent`, `opencode`, `auto`)
  - suporte a criacao de skill customizada via tool (`criar_skill_customizada`)
- Adaptacao automatica ao hardware (Ollama): baseline implementada
  - perfil dinamico `full|balanced|safe` em `server/_core/llm.ts`
  - ajuste de `num_ctx`, `num_predict` e `temperature` por perfil
  - suporte opcional a modelo por perfil (`OLLAMA_MODEL_FULL/BALANCED/SAFE`)
  - documentacao tecnica em `docs/ARQUITETURA_ADAPTACAO_HARDWARE_OLLAMA.md`
- Memoria operacional de execucao: implementada
  - skill persistente `execucao-confiavel` em `.agent/skills/execucao-confiavel/SKILL.md`
  - memoria de acertos/erros em `.agent/memory/operacao-feedback.md`
  - `orchestrateAgentResponse` agora injeta a memoria operacional no prompt de sistema
  - runner exaustivo atualiza memoria automaticamente ao fim de cada rodada

### Fase 3 - Memoria longa e perfil do aluno

- Status geral: pendente

### Fase 4 - Poderes avancados e RPA

- Status geral: pendente
