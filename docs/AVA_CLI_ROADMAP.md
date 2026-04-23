# AVA CLI — Roadmap de Evolução para JARVIS
> Documento de diretrizes técnicas, prioridades e arquitetura de expansão  
> Baseado na análise técnica do sistema atual (AVA CLI + Telegram Bot)

---

## Índice

1. [Estado Atual — Baseline](#1-estado-atual--baseline)
2. [Visão de Destino — O que é o JARVIS?](#2-visão-de-destino--o-que-é-o-jarvis)
3. [Fase 0 — Correções Imediatas (< 1 semana)](#3-fase-0--correções-imediatas)
4. [Fase 1 — Autonomia Real (2–4 semanas)](#4-fase-1--autonomia-real)
5. [Fase 2 — Orquestração Multi-IA (1–2 meses)](#5-fase-2--orquestração-multi-ia)
6. [Fase 3 — Memória Longa e Perfil do Aluno (2–3 meses)](#6-fase-3--memória-longa-e-perfil-do-aluno)
7. [Fase 4 — Poderes Avançados e RPA (3–6 meses)](#7-fase-4--poderes-avançados-e-rpa)
8. [Arquitetura de Hardware — Divisão de Responsabilidades](#8-arquitetura-de-hardware)
9. [Pipeline Google Colab → Drive → AVA CLI → Telegram](#9-pipeline-google-colab--drive--ava-cli--telegram)
10. [Agenda e Lembretes — Comportamento JARVIS](#10-agenda-e-lembretes--comportamento-jarvis)
11. [Mapa de Riscos e Mitigações](#11-mapa-de-riscos-e-mitigações)
12. [Checklist de Implementação](#12-checklist-de-implementação)

---

## 1. Estado Atual — Baseline

### O que já funciona

| Componente | Status | Observação |
|---|---|---|
| AVA CLI com loop de agente (15 ciclos) | ✅ Operacional | `cli/index.ts` + `orchestrateAgentResponse` |
| Ferramentas de leitura de arquivo | ✅ Operacional | Com guardrails e path traversal bloqueado |
| RAG com busca de documentos | ✅ Operacional | `buscar_documentos_rag` |
| Telegram Bot (long polling) | ✅ Operacional | Comandos `/resumo`, `/quiz`, `/cli`, etc. |
| Audit log | ✅ Operacional | `data/ava-cli-audit.log` |
| SQLite compartilhado | ✅ Operacional | Volume Docker |
| Proxy CLI via Telegram `/cli` | ✅ Operacional | `exec` nativo com timeout 120s |

### Pontos de Atenção Identificados

- **Bug no `ask-ava.bat`**: O BAT repassa `npx tsx cli/index.ts ask ...` ignorando o `ENTRYPOINT` já definido no `cli.Dockerfile`. Correção: simplificar para `docker-compose run --rm ava-cli ask "%*"`.
- **Telegram não aceita conversa livre**: Apenas mensagens com prefixo `/` são roteadas. Qualquer texto sem `/cmd` é ignorado.
- **Ferramentas declaradas vs. implementadas**: O orquestrador em `agents.ts` expõe mais tools do que o switch do CLI realmente executa — CRM, agenda, jurídico, lembretes caem no fallback "não suportado".

---

## 2. Visão de Destino — O que é o JARVIS?

O objetivo final é um assistente autônomo que:

- **Raciocina com múltiplas IAs** (Ollama local, GPT, Gemini, HuggingFace, Colab) de forma transparente, escolhendo o modelo certo para cada tarefa.
- **Age no mundo real**: navega na web, executa código, move arquivos, envia notificações, agenda revisões.
- **Lembra de você**: mantém perfil de aprendizado, progresso por assunto, histórico de desempenho.
- **É proativo**: te encontra no Telegram sem você pedir, com revisões agendadas, alertas de novas informações, lembretes contextuais.
- **É extensível**: qualquer nova fonte de dados (Colab, Drive, URL) vira RAG sem intervenção manual.

```
                         ┌─────────────────────────────────────────┐
                         │           JARVIS — AVA CLI v2           │
                         │                                         │
  Telegram ─────────────►│  Roteador de Intenção (NLP local)       │
  Terminal ─────────────►│  ┌────────────────────────────────────┐ │
  Agendador ────────────►│  │       Agent Loop (15 ciclos)       │ │
                         │  │  tool call → exec → inject → loop  │ │
                         │  └────────────────────────────────────┘ │
                         │         ↓           ↓           ↓       │
                         │    [File CRUD]  [Web/Colab]  [LLM Hub]  │
                         │    [Shell/Code] [Drive Sync] [Agenda]   │
                         │         ↓           ↓           ↓       │
                         │         SQLite   RAG Index  Perfil Aluno│
                         └─────────────────────────────────────────┘
```

---

## 3. Fase 0 — Correções Imediatas

> **Prazo sugerido:** < 1 semana  
> **Esforço:** Baixo | **Impacto:** Alto

### 3.1 Corrigir `ask-ava.bat`

**Problema:** Duplicação de argumentos com ENTRYPOINT do Docker.

```bat
@echo off
REM ANTES (incorreto — duplica o entrypoint)
docker-compose -f docker-compose.cli.yml run --rm ava-cli npx tsx cli/index.ts ask "%*"

REM DEPOIS (correto — usa ENTRYPOINT já definido)
docker-compose -f docker-compose.cli.yml run --rm ava-cli ask "%*"
```

### 3.2 Habilitar Chat Livre no Telegram

**Problema:** O bot só reage a mensagens com prefixo `/`.

**Solução:** No `telegramStudyBot.ts`, adicionar handler de fallback:

```typescript
// Lógica atual (simplificada)
if (text.startsWith('/resumo')) { ... }
else if (text.startsWith('/quiz')) { ... }
// NÃO HÁ FALLBACK

// Nova lógica
if (text.startsWith('/')) {
  handleCommand(text); // roteador atual
} else {
  // Qualquer mensagem sem / vai direto para o agente
  const response = await orchestrateAgentResponse({
    userMessage: text,
    provider: process.env.TELEGRAM_TEXT_PROVIDER,
    // ...
  });
  sendMessage(chatId, response);
}
```

### 3.3 Implementar Tools Faltantes no CLI

Conectar as ferramentas já declaradas em `agents.ts` ao switch do `cli/index.ts`:

- `gerenciar_agenda` (já existe lógica, não está no switch)
- `criar_lembrete`
- `listar_lembretes`
- `registrar_historico_estudo`

---

## 4. Fase 1 — Autonomia Real

> **Prazo sugerido:** 2–4 semanas  
> **Esforço:** Médio | **Impacto:** Muito Alto

### 4.1 File CRUD Completo com Sandbox

Adicionar ao toolset do CLI:

```typescript
// Ferramentas a implementar
criar_arquivo(caminho: string, conteudo: string)
mover_arquivo(origem: string, destino: string)
copiar_arquivo(origem: string, destino: string)
renomear_arquivo(caminho: string, novo_nome: string)
apagar_arquivo(caminho: string)  // Exige confirmação explícita
criar_pasta(caminho: string)
```

**Regra de sandbox obrigatória:** Toda operação de escrita/deleção deve ser bloqueada fora de um conjunto de diretórios permitidos configurável via `.env`:

```env
AVA_WORKSPACE_DIRS=~/ava-workspace,~/Downloads/ava-imports
AVA_READONLY_DIRS=~/Documents,~/Projects
```

### 4.2 Web Search e Navegação com Playwright

```typescript
// Ferramenta 1: Busca rápida (DuckDuckGo/SearXNG local)
buscar_web(query: string): string[]  // Retorna lista de {titulo, url, snippet}

// Ferramenta 2: Navegação profunda (Playwright headless)
navegar_pagina(url: string): string  // Retorna texto extraído da página
extrair_conteudo_estruturado(url: string): object  // JSON com título, corpo, links
```

**Configuração Playwright no i7-2600:**
- Usar `chromium` headless (menor footprint que Firefox)
- Timeout por navegação: 30s
- Max. texto retornado ao agente: 8.000 tokens
- Implementar cache de URL em SQLite (TTL de 1h para evitar re-scraping)

### 4.3 Execução de Código em Sandbox

Ferramenta de tutor de programação:

```typescript
executar_codigo(linguagem: 'python' | 'node' | 'bash', codigo: string): {
  stdout: string,
  stderr: string,
  exit_code: number,
  tempo_execucao_ms: number
}
```

**Implementação recomendada:**
- Docker efêmero com imagem mínima por linguagem
- Timeout: 15–30s
- Sem acesso à rede dentro do container de execução
- Limite de memória: 256MB por execução
- Comando: `docker run --rm --network none --memory 256m --timeout 30 python:3.11-alpine`

---

## 5. Fase 2 — Orquestração Multi-IA

> **Prazo sugerido:** 1–2 meses  
> **Esforço:** Alto | **Impacto:** Transformador

### 5.1 LLM Hub — Roteador de Modelos

O AVA CLI deve escolher o modelo certo para cada tarefa automaticamente:

```
Tarefa de raciocínio complexo → Ollama (notebook GPU) / GPT-4o
Tarefa de código → Codex / DeepSeek Coder via Ollama
Tarefa de visão (imagem enviada) → LLaVA / qwen2-vl no notebook
Tarefa de embedding/RAG → modelo local leve (nomic-embed-text)
Tarefa simples/rápida → modelo menor local (Llama 3.2 3B)
Tarefa com busca web → modelo + tool use
```

```typescript
// Interface do hub
interface LLMHub {
  route(task: TaskType, context: AgentContext): LLMProvider;
  invoke(provider: LLMProvider, messages: Message[]): Promise<string>;
  fallback(primaryProvider: LLMProvider): LLMProvider; // se offline
}
```

### 5.2 Integração Google Colab como Processador Remoto

O Colab pode agir como worker de tarefas pesadas acionado pelo AVA CLI:

**Fluxo:**
1. AVA CLI detecta URL para raspagem ou tarefa de processamento pesado
2. AVA CLI grava um arquivo `.json` de tarefa no Google Drive via API
3. Notebook Colab (rodando com time-trigger ou polling) lê a fila de tarefas
4. Colab executa, salva resultado em `.md` no Drive
5. AVA CLI monitora a pasta de resultados no Drive e baixa quando disponível
6. Conteúdo é sanitizado e indexado no RAG
7. Telegram notifica o usuário

```json
// Formato do arquivo de tarefa (Drive: /ava-tasks/task_<uuid>.json)
{
  "task_id": "uuid",
  "type": "scrape_url" | "process_pdf" | "generate_embeddings",
  "input": { "url": "...", "instructions": "..." },
  "status": "pending",
  "created_at": "ISO8601"
}
```

### 5.3 Integração APIs de IA Externas

```env
# Providers disponíveis
OPENAI_API_KEY=...        # GPT-4o, Codex
HUGGINGFACE_TOKEN=...     # Modelos HuggingFace via Inference API
GEMINI_API_KEY=...        # Gemini 1.5 Pro (suporte a PDFs nativos)
OLLAMA_HOST=http://notebook-local:11434  # Notebook GPU na rede local
```

**Política de uso por custo:**
- Prioridade 1: Ollama local (grátis, privado)
- Prioridade 2: HuggingFace Inference (limitado, grátis)
- Prioridade 3: Gemini (quota gratuita)
- Prioridade 4: GPT-4o (pago, usar para tarefas críticas)

---

## 6. Fase 3 — Memória Longa e Perfil do Aluno

> **Prazo sugerido:** 2–3 meses  
> **Esforço:** Médio-Alto | **Impacto:** Alto (diferencial do tutor)

### 6.1 Schema SQLite — Perfil do Aluno

```sql
-- Tabela de perfil
CREATE TABLE aluno_perfil (
  id INTEGER PRIMARY KEY,
  nome TEXT,
  objetivo_principal TEXT,  -- "OAB", "concurso público", "programação"
  estilo_aprendizado TEXT,   -- detectado automaticamente
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME
);

-- Tabela de temas e progresso
CREATE TABLE temas (
  id INTEGER PRIMARY KEY,
  nome TEXT UNIQUE,
  categoria TEXT,            -- "OAB", "Python", "Geopolítica"
  nivel_dominio INTEGER,     -- 0-100
  ultima_revisao DATETIME,
  proxima_revisao DATETIME,  -- Spaced repetition
  total_quizzes INTEGER DEFAULT 0,
  acertos_totais INTEGER DEFAULT 0,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de sessões de estudo
CREATE TABLE sessoes_estudo (
  id INTEGER PRIMARY KEY,
  tema_id INTEGER REFERENCES temas(id),
  tipo TEXT,                 -- "quiz", "leitura", "resumo", "conversa"
  duracao_segundos INTEGER,
  desempenho INTEGER,        -- 0-100 para quizzes
  notas TEXT,                -- observações da sessão
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de lacunas detectadas
CREATE TABLE lacunas_conhecimento (
  id INTEGER PRIMARY KEY,
  tema_id INTEGER REFERENCES temas(id),
  descricao TEXT,
  detectada_em DATETIME,
  resolvida_em DATETIME,
  status TEXT DEFAULT 'aberta'  -- "aberta", "em progresso", "resolvida"
);
```

### 6.2 Algoritmo de Spaced Repetition

Implementar SM-2 simplificado para agendamento de revisões:

```typescript
function calcularProximaRevisao(tema: Tema, desempenho: number): Date {
  // desempenho: 0-100
  const fator = desempenho >= 80 ? 2.5 : desempenho >= 60 ? 1.5 : 0.5;
  const diasDesdeUltima = daysSince(tema.ultima_revisao);
  const proximosIntervalos = [1, 3, 7, 14, 30, 60]; // dias
  const intervaloAtual = Math.round(diasDesdeUltima * fator);
  return addDays(new Date(), Math.max(1, intervaloAtual));
}
```

### 6.3 Comportamento Proativo no Telegram

A AVA passa a iniciar conversas sem você pedir:

```
"Bom dia! Faz 6 dias que você não revisa Direito Penal.
Quer um quiz rápido de 5 questões? [Sim / Não / Amanhã]"

"Você tem revisão de Python Assíncrono agendada para hoje.
Posso preparar o material agora?"

"Indexei 3 novos documentos ontem:
• Contratos Administrativos — 45 páginas
• Questões OAB 2024 — 120 questões
• Resumo Direito Constitucional
Quer explorar algum deles?"
```

---

## 7. Fase 4 — Poderes Avançados e RPA

> **Prazo sugerido:** 3–6 meses  
> **Esforço:** Alto | **Impacto:** Alto (diferencial avançado)

### 7.1 Visão via Telegram (Foto → Análise)

Fluxo: Usuário envia foto no Telegram → AVA analisa com modelo de visão:

```typescript
// Handler de imagem no telegramStudyBot.ts
if (update.message?.photo) {
  const fileId = update.message.photo.at(-1).file_id; // Maior resolução
  const imageBuffer = await downloadTelegramFile(fileId);
  
  const analise = await invokeVisionModel({
    provider: 'ollama',        // LLaVA/qwen2-vl no notebook GPU
    model: 'llava:13b',
    image: imageBuffer,
    prompt: 'Analise este conteúdo. Se for uma questão jurídica, identifique o tema e resolva. Se for código, explique e corrija.'
  });
  
  await sendMessage(chatId, analise);
}
```

**Casos de uso:**
- Foto de questão do livro → resolução + explicação + quiz gerado
- Foto de código → análise de bug + sugestão de correção
- Screenshot de erro → diagnóstico automático
- Foto de documento → transcrição + resumo

### 7.2 Controle de UI / RPA (Windows)

```typescript
// Ferramenta: controle de mouse e teclado
controlar_ui(acao: 'screenshot' | 'click' | 'type' | 'key', parametros: object): string

// Implementação via pyautogui (subprocess Python)
// Útil para:
// - Abrir aplicativos específicos
// - Preencher formulários
// - Demonstrar como fazer algo (modo tutorial)
// - Automação de tarefas repetitivas
```

**Restrições de segurança:**
- Apenas em diretórios/apps da whitelist
- Confirmação obrigatória antes de qualquer ação de escrita de UI
- Log de cada ação de controle de UI

### 7.3 TTS — AVA com Voz

```typescript
// Sintetizar resposta em áudio e enviar pelo Telegram
const audio = await synthesizeSpeech({
  text: response,
  provider: 'coqui-tts',  // Modelo local no notebook GPU
  voice: 'pt-br-female'
});
await sendVoiceMessage(chatId, audio);
```

---

## 8. Arquitetura de Hardware

### Divisão de Responsabilidades

```
Desktop i7-2600 (3.4 GHz · 16 GB RAM)          Notebook GPU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━          ━━━━━━━━━━━━━━━━━━━
✅ AVA CLI (Node.js/TypeScript)               ✅ Inferência LLM (Ollama)
✅ Telegram Bot (polling)                     ✅ Modelos de visão (LLaVA)
✅ Playwright / Web scraping                  ✅ Embeddings (nomic-embed)
✅ File CRUD + RAG                            ✅ TTS (Coqui)
✅ SQLite + perfil do aluno                   ✅ Modelos > 7B params
✅ Docker containers (execução de código)     ✅ Fine-tuning (futuro)
✅ Agendador de tarefas (cron/node-cron)      
✅ API Google Drive (sync)                    
✅ Controle de UI (pyautogui)                 

                    ↕ Rede Local (WiFi/Ethernet)
                    Ollama API: http://notebook:11434
```

### Requisitos de Rede

- O notebook com GPU deve estar acessível na rede local por hostname fixo ou IP estático
- Configurar `OLLAMA_HOST=http://<ip-notebook>:11434` no `.env` do desktop
- Fallback automático: se notebook offline → usar modelo menor local (Llama 3.2 3B)

---

## 9. Pipeline Google Colab → Drive → AVA CLI → Telegram

### Fluxo Completo

```
1. TRIGGER
   Usuário envia URL para o AVA via Telegram:
   "AVA, indexe este link: https://exemplo.com/artigo"

2. AVA CLI cria tarefa
   → Grava /ava-tasks/task_<uuid>.json no Google Drive
   → Status: "pending"

3. GOOGLE COLAB (Notebook com polling ou time-trigger)
   → Lê fila de tarefas pendentes no Drive
   → Executa: raspagem → limpeza → estruturação em Markdown
   → Salva resultado em /ava-results/result_<uuid>.md no Drive
   → Atualiza status da tarefa para "done"

4. AVA CLI MONITOR (daemon no desktop)
   → Polling do Drive a cada 5 min para resultados novos
   → Baixa o .md para ~/ava-workspace/imports/
   → Move para ~/ava-workspace/rag/
   → Sanitiza: remove HTML residual, normaliza encoding
   → Gera embeddings e indexa no RAG (SQLite ou vector store)
   → Atualiza tabela de temas no SQLite

5. NOTIFICAÇÃO TELEGRAM
   → AVA envia mensagem proativa:
   "✅ Novo conteúdo indexado:
    📄 [Nome do Artigo]
    🏷️ Temas: Direito Constitucional, STF
    📊 3.200 palavras — disponível para /resumo e /quiz"
```

### Implementação Técnica do Monitor

```typescript
// daemon/driveMonitor.ts
import { google } from 'googleapis';
import cron from 'node-cron';

// Roda a cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  const pendingResults = await listDriveFolder('/ava-results', { status: 'new' });
  
  for (const result of pendingResults) {
    const content = await downloadDriveFile(result.id);
    await sanitizeAndIndex(content, result.name);
    await markAsProcessed(result.id);
    await notifyTelegram(`✅ Novo documento indexado: ${result.name}`);
  }
});
```

### Notebook Colab — Template de Raspagem

```python
# Célula no Colab: ava_worker.ipynb
from google.colab import drive
import json, time, requests
from bs4 import BeautifulSoup
from markdownify import markdownify

drive.mount('/content/drive')
TASKS_PATH = '/content/drive/MyDrive/ava-tasks/'
RESULTS_PATH = '/content/drive/MyDrive/ava-results/'

def process_task(task):
    if task['type'] == 'scrape_url':
        html = requests.get(task['input']['url']).text
        soup = BeautifulSoup(html, 'html.parser')
        # Remove nav, footer, ads
        for tag in soup.find_all(['nav', 'footer', 'script', 'style', 'aside']):
            tag.decompose()
        markdown = markdownify(str(soup.find('main') or soup.body))
        return markdown
```

---

## 10. Agenda e Lembretes — Comportamento JARVIS

### O que o sistema já tem

As funcionalidades de agenda e lembretes existem no código mas não estão conectadas ao loop de agente do CLI. O problema é que elas são passivas (só respondem quando perguntadas).

### Como tornar proativo

**Arquitetura de agendamento:**

```typescript
// scheduler/avaScheduler.ts
import cron from 'node-cron';

// 1. Verificar lembretes a cada minuto
cron.schedule('* * * * *', async () => {
  const lembretes = await getLembretesVencidos();
  for (const lembrete of lembretes) {
    await notifyTelegram(formatLembrete(lembrete));
    await marcarLembreteEntregue(lembrete.id);
  }
});

// 2. Revisões de spaced repetition — toda manhã às 8h
cron.schedule('0 8 * * *', async () => {
  const temasParaRevisar = await getTemasParaRevisaoHoje();
  if (temasParaRevisar.length > 0) {
    await notifyTelegram(
      `📚 Revisões de hoje:\n${temasParaRevisar.map(t => `• ${t.nome}`).join('\n')}\n\nQuer começar?`
    );
  }
});

// 3. Relatório semanal — domingo às 20h
cron.schedule('0 20 * * 0', async () => {
  const relatorio = await gerarRelatorioSemanal();
  await notifyTelegram(relatorio);
});

// 4. Monitor do Drive — a cada 5 minutos
cron.schedule('*/5 * * * *', checkDriveForNewResults);
```

### Comportamento esperado do JARVIS

| Situação | Comportamento AVA |
|---|---|
| Lembrete de compromisso se aproximando | Notifica no Telegram 30min antes |
| Tema sem revisão há X dias | Inicia conversa proativa com quiz |
| Novo documento indexado | Notifica com resumo dos temas |
| Quiz com desempenho baixo | Agenda revisão reforçada em 1 dia |
| Quiz com desempenho alto | Aumenta intervalo de revisão |
| Tarefa Colab concluída | Notifica e oferece acesso ao conteúdo |
| Inatividade > 48h | "Oi! Tudo bem? Tem material novo aqui." |

### Comandos de Agenda via Telegram

```
/agenda hoje          → lista compromissos do dia
/lembrar [texto] [tempo]  → "lembrar reunião amanhã 14h"
/revisoes             → mostra fila de spaced repetition
/progresso            → relatório de desempenho por tema
/meta [texto]         → define objetivo de estudo da semana
```

---

## 11. Mapa de Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Notebook GPU offline | Alta | Alto | Fallback para modelo menor local; fila persistente |
| Google Drive API quota | Média | Médio | Cache local de 24h; retry com backoff exponencial |
| Playwright consumindo muita RAM | Média | Médio | Fechar browser após cada tarefa; pool máx. 1 instância |
| Loop infinito no agente | Baixa | Alto | Limite de 15 ciclos (já implementado); timeout por ferramenta |
| Vazamento de dados fora do sandbox | Baixa | Crítico | Whitelist de diretórios; validação de path em toda operação de escrita |
| API externa com custo inesperado | Média | Médio | Priorizar Ollama local; alertas de quota configurados |
| Telegram bot comprometido | Baixa | Crítico | Validar `TELEGRAM_STUDY_USER_ID` em todo request; rate limiting |

---

## 12. Checklist de Implementação

### 🔴 Fase 0 — Agora (< 1 semana)
- [ ] Corrigir `ask-ava.bat` para usar ENTRYPOINT do Docker
- [ ] Adicionar handler de conversa livre no Telegram (sem prefixo `/`)
- [ ] Conectar `gerenciar_agenda` e `criar_lembrete` ao switch do CLI
- [ ] Testar todas as ferramentas declaradas em `agents.ts` no loop do CLI
- [ ] Documentar quais tools estão realmente operacionais

### 🟡 Fase 1 — Curto prazo (2–4 semanas)
- [ ] Implementar `criar_arquivo`, `mover_arquivo`, `apagar_arquivo` com sandbox
- [ ] Configurar `AVA_WORKSPACE_DIRS` via `.env`
- [ ] Implementar `buscar_web` com DuckDuckGo/SearXNG
- [ ] Implementar `navegar_pagina` com Playwright headless
- [ ] Implementar `executar_codigo` com Docker efêmero
- [ ] Criar cache de URLs no SQLite (TTL 1h)

### 🟠 Fase 2 — Médio prazo (1–2 meses)
- [ ] Criar LLM Hub com roteamento por tipo de tarefa
- [ ] Configurar fallback automático entre providers
- [ ] Implementar integração Google Drive API (upload/download)
- [ ] Criar formato de tarefa JSON para fila Colab
- [ ] Desenvolver `daemon/driveMonitor.ts` com polling
- [ ] Criar notebook Colab template (`ava_worker.ipynb`)
- [ ] Pipeline: URL → Colab → Drive → RAG → Telegram

### 🔵 Fase 3 — Memória e perfil (2–3 meses)
- [ ] Criar schema SQLite de perfil do aluno
- [ ] Implementar tracking de desempenho em quizzes
- [ ] Implementar algoritmo SM-2 de spaced repetition
- [ ] Criar `scheduler/avaScheduler.ts` com node-cron
- [ ] Ativar notificações proativas de revisão no Telegram
- [ ] Implementar relatório semanal de progresso

### 🟣 Fase 4 — Poderes avançados (3–6 meses)
- [ ] Handler de imagens no Telegram Bot
- [ ] Integrar modelo de visão (LLaVA/qwen2-vl) no notebook GPU
- [ ] Implementar `controlar_ui` via pyautogui (Windows)
- [ ] Integrar TTS para respostas em áudio via Telegram
- [ ] Dashboard web local de progresso do aluno (opcional)

---

## Referências Técnicas

- **Repositório base**: Código atual em `cli/index.ts`, `server/agents.ts`, `server/telegramStudyBot.ts`
- **Algoritmo SM-2**: [SuperMemo Algorithm SM-2](https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method)
- **Playwright Docs**: [playwright.dev](https://playwright.dev/docs/intro)
- **Google Drive API Node.js**: [googleapis npm](https://github.com/googleapis/google-api-nodejs-client)
- **node-cron**: [github.com/node-cron/node-cron](https://github.com/node-cron/node-cron)
- **LLaVA no Ollama**: `ollama pull llava:13b`
- **qwen2-vl**: `ollama pull qwen2-vl:7b`

---

*Documento gerado com base na análise técnica do AVA CLI v1 e nas diretrizes de evolução para o sistema JARVIS.*  
*Última atualização: Abril 2026*
