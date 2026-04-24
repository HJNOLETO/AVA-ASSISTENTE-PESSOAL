# Arquitetura de Memoria Segura - AVA CLI (Rumo ao "JARVIS")

## Objetivo

Definir um modelo de memoria robusto para a AVA CLI que:

- lembre informacoes uteis de forma consistente;
- aprenda com uso real (acoes executadas, erros, preferencias);
- proteja segredos e dados sensiveis por padrao;
- reduza simulacao e aumente confiabilidade operacional.

## Status de implementacao (2026-04-24)

Primeira etapa implementada no codigo:

- `server/security/memoryGuard.ts`
  - classificador deterministico (`secret`, `sensitive`, `useful`, `discard`);
  - roteador de persistencia com politica fail-closed;
  - redacao automatica (`redactSensitiveText`) para logs.
- `cli/index.ts`
  - `logAudit` agora mascara segredos antes de escrever em `data/ava-cli-audit.log`;
  - tool `registrar_historico_estudo` passou a usar `routeMemoryPersistence`;
  - bloqueio de persistencia semantica quando conteudo for sensivel/segredo.
- Testes automatizados adicionados:
  - `client/src/lib/memoryGuard.test.ts`.

## Estado atual (diagnostico)

Hoje o projeto ja possui blocos importantes, mas ainda sem governanca completa de memoria:

- Existe registro operacional/auditoria no CLI (`cli/index.ts`).
- Existe armazenamento de memoria contextual via `addMemoryEntry` no fluxo de tool de historico de estudo (`cli/index.ts`).
- Existe orquestracao por LLM e tools (`server/agents.ts`, `server/_core/llm.ts`).

### Limites atuais de seguranca

1. Nao ha classificador central obrigatorio para diferenciar `segredo`, `sensivel` e `util` antes de persistir.
2. Nao ha separacao formal de "cofre" vs "memoria semantica" com politica fail-closed.
3. Nao ha trilha completa de consentimento para dados pessoais/sensiveis.
4. Nao ha conjunto padrao de testes de seguranca de memoria (ex.: tentativa de gravar senha em vetor).

Conclusao: **a seguranca ainda nao e suficiente para confiar em memorizacao automatica de segredos.**

---

## Principios de projeto (baseline de robustez)

1. **Default deny**: nada e persistido sem classificacao.
2. **Fail closed**: se classificacao for incerta, bloqueia e pede confirmacao.
3. **Data minimization**: guardar apenas o necessario para o objetivo.
4. **Need-to-know retrieval**: recuperar somente o minimo necessario para a tarefa atual.
5. **Auditabilidade forte**: toda gravacao deve ser rastreavel (quem, quando, por que, destino).
6. **Direito ao esquecimento**: apagar sob comando e por expiracao automatica.

---

## Modelo alvo de memoria (4 camadas)

## 1) Memoria de Sessao (curto prazo)

- Contexto da conversa atual e estado transitorio.
- TTL curto (ex.: 24h).
- Nao deve armazenar segredos em texto puro.

## 2) Memoria Episodica (eventos reais)

- Foco em fatos verificaveis: tool chamada, argumentos, sucesso/erro, latencia.
- Base para aprendizado operacional e investigacao de falhas.

## 3) Memoria Semantica (conhecimento util)

- Preferencias, padroes de projeto, convencoes e contexto de longo prazo.
- Indexada por embeddings + metadados + score de confianca.
- Nao receber segredos.

## 4) Memoria de Cofre (segredos/sensivel)

- Senhas, API keys, tokens, credenciais, dados pessoais sensiveis.
- Criptografia forte em repouso + mascaramento em log + acesso estritamente controlado.
- Nunca indexar em embedding store.

---

## Classificacao de dados (roteador de memoria)

Toda entrada candidata a memoria passa por pipeline:

1. **Deteccao deterministica** (regex/heuristica):
   - `password`, `senha`, `token`, `api key`, `bearer`, formatos conhecidos (`sk-`, `AIza`, etc.).
2. **Classificador semantico** (LLM com schema estrito):
   - classes: `secret`, `sensitive`, `useful`, `discard`;
   - com `confidence` e `reason`.
3. **Policy engine**:
   - `secret` -> cofre;
   - `sensitive` -> confirmar consentimento + memoria privada criptografada;
   - `useful` -> memoria semantica;
   - `discard` -> nao persistir.
4. **Fail closed**:
   - `confidence` baixa => nao salva automaticamente.

### Regras de consentimento

- Para `secret`: exigir confirmacao explicita do usuario para salvar no cofre.
- Para `sensitive`: confirmar finalidade + prazo de retencao.
- Registrar trilha: `consent_given_at`, `consent_scope`, `retention_policy`.

---

## Requisitos de seguranca para nivel "suficiente"

Para considerar o sistema robusto (proximo de um "JARVIS" confiavel), implementar no minimo:

1. **Cofre segregado** (tabela/servico separado da memoria geral).
2. **Criptografia em repouso** para cofre e dados sensiveis.
3. **Redacao automatica de logs** (masking) antes de auditoria.
4. **RBAC por escopo** (quem pode ler o que) + separacao por usuario/tenant.
5. **Politica de retencao e expiracao** por classe de dado.
6. **Comandos de governanca**:
   - `/memoria listar`
   - `/memoria esquecer <id|filtro>`
   - `/cofre salvar <chave>`
   - `/cofre remover <chave>`
   - `/memoria politica`
7. **Testes automatizados de seguranca** para evitar regressao.

---

## Requisitos de aprendizagem continua (sem comprometer seguranca)

Aprendizado deve usar principalmente eventos reais e feedback:

- sucesso/falha de tools;
- tempo de execucao;
- fallback utilizado;
- aprovacao/reprovacao do usuario;
- resolucao final da tarefa.

### Mecanismo de melhoria

1. Extrair "insights" apos cada tarefa (curtos e objetivos).
2. Atualizar ranking de memoria por utilidade observada.
3. Reforcar estrategias que funcionam (ex.: cadeia de fallback de LLM).
4. Despromover conhecimento de baixa confianca.

---

## Arquitetura tecnica proposta

## Componentes

1. `memory-classifier.ts`
   - classifica e define destino de persistencia.
2. `memory-policy-engine.ts`
   - aplica regras de seguranca/consentimento/retencao.
3. `memory-store.ts`
   - semantica + episodica (nao segredo).
4. `vault-store.ts`
   - segredos/sensivel com criptografia e trilha de acesso.
5. `memory-retriever.ts`
   - recuperacao contextual com filtros de seguranca.
6. `memory-governance.ts`
   - comandos de listagem, esquecimento, expiracao.

## Contrato de dados sugerido

```ts
type MemoryClass = "secret" | "sensitive" | "useful" | "discard";

type MemoryEnvelope = {
  userId: number;
  content: string;
  source: "chat" | "tool_result" | "system";
  classification: MemoryClass;
  confidence: number;
  destination: "vault" | "semantic" | "episodic" | "none";
  consentRequired: boolean;
  retentionDays?: number;
  tags: string[];
  createdAt: string;
};
```

---

## Plano de implementacao por fases

## Fase 1 - Fundacao de seguranca

- Implementar classificador + policy engine fail-closed.
- Bloquear persistencia automatica de segredo sem consentimento.
- Inserir masking nos logs.

**Entrega minima:** nenhum segredo vai para memoria semantica.

## Fase 2 - Cofre e governanca

- Criar `vault-store` com criptografia.
- Criar comandos de gestao (`listar/esquecer/remover`).
- Adicionar retencao por tipo de dado.

**Entrega minima:** usuario controla o que fica memorizado.

## Fase 3 - Aprendizado operacional

- Consolidar memoria episodica + score de utilidade.
- Gerar insights automaticos apos tarefas.
- Melhorar roteamento/fallback com base em historico real.

**Entrega minima:** evidencia de melhoria em metricas.

## Fase 4 - Hardening

- Testes adversariais (prompt injection para exfiltrar segredo).
- Revisao de permissoes e isolamento por tenant.
- Relatorio de conformidade operacional.

**Entrega minima:** baseline de robustez de producao.

---

## Suite de testes obrigatoria (seguranca e robustez)

1. **Nao vaza segredo para embedding**
   - input com API key -> destino obrigatorio `vault`.
2. **Ambiguidade bloqueada**
   - classificacao baixa confianca -> nao persiste sem confirmacao.
3. **Masking em log**
   - nenhum segredo aparece em texto puro no audit.
4. **Direito ao esquecimento**
   - apagar item remove de store e indice.
5. **Recuperacao com escopo**
   - usuario A nao enxerga memoria de usuario B.
6. **Resistencia a injection**
   - prompt malicioso nao altera policy de armazenamento.

---

## Metricas de sucesso (proximidade de "JARVIS")

- Taxa de acao real (tool executada) > 95% em pedidos operacionais.
- 0 incidentes de segredo em memoria semantica/log texto puro.
- Reducao de erros repetidos por fallback inteligente.
- Melhor "first attempt success" em tarefas recorrentes.
- Tempo medio de conclusao por tarefa em queda.

---

## Decisao pratica recomendada agora

Implementar imediatamente Fase 1 + Fase 2 (seguranca e governanca), antes de ampliar "aprendizado autonomo".

Sem isso, a IA pode "lembrar" de forma insegura.
Com isso, ela passa a lembrar com controle, confiabilidade e evolucao real.
