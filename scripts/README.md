# 📋 Scripts de Automação - AVA Assistant v3.1

Pasta contendo scripts PowerShell para automação de limpeza e inicialização do servidor.

## 📂 Arquivos

### `clean.ps1` - Limpeza Completa

Remove caches, processos node anteriores e libera portas.

**Uso:**

```powershell
.\scripts\clean.ps1
```

**O que faz:**

- ✓ Mata processos Node.js anteriores
- ✓ Remove diretórios de cache (dist, .turbo, .vitest, .next, build)
- ✓ Limpa cache do Vite
- ✓ Libera portas: 5173, 5174, 3000, 3001, 8080

---

### `start-dev.ps1` - Iniciar Dev Server

Inicia o servidor de desenvolvimento com Vite.

**Uso:**

```powershell
.\scripts\start-dev.ps1
```

**O que faz:**

- ✓ Verifica se pnpm está instalado
- ✓ Instala dependências se necessário
- ✓ Executa verificação TypeScript
- ✓ Inicia `pnpm dev` na porta 5173

**Acesso:** http://localhost:5173

---

### `start-prod.ps1` - Build e Modo Produção

Constrói a aplicação e inicia em modo produção.

**Uso:**

```powershell
.\scripts\start-prod.ps1
```

**O que faz:**

- ✓ Verifica ambiente
- ✓ Instala dependências se necessário
- ✓ Executa `pnpm check`
- ✓ Executa `pnpm build`
- ✓ Executa testes
- ✓ Inicia servidor em modo produção

---

### `full-reset.ps1` - Reset Completo + Dev

Combina limpeza + inicialização do dev server.

**Uso:**

```powershell
.\scripts\full-reset.ps1
```

**O que faz:**

1. Executa `clean.ps1`
2. Aguarda 2 segundos
3. Executa `start-dev.ps1`

---

## 🚀 Workflow Recomendado

### Primeira Vez

```powershell
cd C:\Users\hijon\Downloads\ava-assistant-v3.1-final-02-02-2026
.\scripts\start-dev.ps1
```

### Antes de Reabrir o Servidor

```powershell
.\scripts\clean.ps1
.\scripts\start-dev.ps1
```

### Automatizado (Recomendado)

```powershell
.\scripts\full-reset.ps1
```

---

## ⚠️ Requisitos

- **PowerShell 5.1+** (pré-instalado no Windows)
- **pnpm** instalado globalmente
  ```powershell
  npm install -g pnpm
  ```
- **Node.js 18+**

---

## 🔧 Troubleshooting

### "Script não pode ser carregado"

Se receber erro de execução, execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Porta já em uso"

Os scripts tentam liberar portas automaticamente. Se persistir:

```powershell
# Encontrar processo na porta
netstat -ano | findstr :5173

# Matar processo
taskkill /PID <PID> /F
```

### "pnpm não encontrado"

```powershell
npm install -g pnpm
```

---

## 📝 Notas

- Scripts limpam automaticamente processos node anteriores
- Recomendado executar `clean.ps1` antes de iniciar novo servidor
- Use `full-reset.ps1` para garantir ambiente limpo
- Logs coloridos indicam sucesso (verde) e erros (vermelho)

---

## 🤖 Bot de Estudo no Telegram (Novo)

Agora o projeto possui um bot de estudo com notificacoes de novos assuntos indexados no AVA.

**Arquivo:** `server/telegramStudyBot.ts`

**Execucao:**

```bash
pnpm telegram:study-bot
```

**Variaveis de ambiente obrigatorias:**

- `TELEGRAM_BOT_TOKEN`: token do BotFather
- `TELEGRAM_STUDY_USER_ID`: userId interno do AVA para consultar RAG

**Variaveis opcionais:**

- `TELEGRAM_CHAT_ID`: restringe chat e recebe notificacoes proativas
- `TELEGRAM_NOTIFY_INTERVAL_MS` (padrao `300000`)
- `TELEGRAM_LOOKBACK_MINUTES` (padrao `1440`)
- `TELEGRAM_STUDY_MODEL` (override de modelo)

**Comandos no Telegram:**

- `/novidades`
- `/resumo <tema>`
- `/quiz <tema>`

O bot responde com base no que ja foi indexado no AVA (sem inventar fontes quando nao houver base suficiente).

---

**Última atualização:** 02 de fevereiro de 2026

---

## Drive Sync + Embeddings Locais

Fluxo para indexar conhecimento usando pasta de dados externa (`main-dados`):

1. Coloque arquivos em `main-dados/Drive_Sync`
2. (Opcional) Rode a sincronizacao com Google Drive (`scripts/drive_sync.py`)
3. Rode a indexacao local com embeddings nomic

### Variaveis de ambiente (recomendado)

```env
AVA_DATA_DIR=C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main-dados
AVA_BACKUP_DIR=C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main-backup
```

Opcional:

- `AVA_DRIVE_SYNC_DIR`: sobrescreve a pasta de entrada (padrao: `<AVA_DATA_DIR>/Drive_Sync`)
- `AVA_MANIFEST_PATH`: sobrescreve o manifesto (padrao: `<AVA_DATA_DIR>/.rag/drive-sync-manifest.json`)

### Preparar embedding local

```bash
ollama pull nomic-embed-text:latest
```

### Indexar no banco do AVA

```bash
pnpm rag:index
```

Com parametros:

```bash
pnpm rag:index -- --user-id 1 --drive-dir "C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main-dados\Drive_Sync" --batch-size 10 --purge-missing
```

- `--user-id`: usuario dono dos documentos no AVA.
- `--drive-dir`: pasta de origem dos arquivos.
- `--batch-size`: chunks por lote.
- `--purge-missing`: remove documentos que nao existem mais na pasta.

### Backup rapido da memoria/RAG

```bash
pnpm rag:backup
```

Esse comando cria um snapshot em `AVA_BACKUP_DIR` contendo:

- banco SQLite do AVA
- manifesto RAG
- JSONs legados de embeddings (quando existirem)

### Sincronizar com Google Drive (opcional)

```bash
python scripts/drive_sync.py
```

Requisitos Python:

- `google-api-python-client`
- `google-auth-oauthlib`
- `google-auth-httplib2`

Observacao: a indexacao usa manifesto em `scripts/drive-sync-manifest.json` para pular arquivos sem alteracao e reduzir latencia nas proximas execucoes.
