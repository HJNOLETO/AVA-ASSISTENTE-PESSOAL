# CHANGELOG

## v2.2.0 - 2026-04-27

### feat:
- adiciona Tool Registry dinamico via `config/tools.json` com loader Zod
- adiciona guard de execucao por risco com auditoria JSONL (`data/tool-registry-audit.jsonl`)
- adiciona RAG retriever patch com `minScore` dinamico, fallback explicito e `truncateSmart`
- adiciona Agent Loop formalizado em `server/agents/agent-loop.ts`

### fix:
- melhora retrieval para Ollama (`topK` padrao 3 no patch)
- remove truncamento fixo de 300 chars no contexto do patch
- permite modo exploratorio relaxando filtro legal via `legalStatus: any`

### test:
- inclui suites para tool registry, retriever, agent loop e guard/audit
- adiciona scripts `test:coverage` e `test:watch`

### docs:
- adiciona `ARCHITECTURE.md`, `TOOLS_REGISTRY.md`, `AGENT_LOOP.md`, `TEST_REPORT.md`

### breaking changes:
- nenhuma. Mudancas protegidas por feature flags e fallback legado.
