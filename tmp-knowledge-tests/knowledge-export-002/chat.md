# Knowledge package: scripts

- Source: `C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\scripts`
- Chunks: 102
- Generated: 2026-04-07T19:30:40.657Z

## Suggested usage
Use the context below as the only source. If information is missing, state it clearly.

## check_tags.js (chunk 1)

```text
const fs = require("fs");
let s = fs.readFileSync("client/src/components/AVAChatBox.tsx", "utf8");
function stripJS(s) {
  let out = "";
  let i = 0;
  while (i < s.length) {
    let c = s[i];
    if (c === '"' || c === "'" || c === "`") {
      let q = c;
      out += c;
      i++;
      while (i < s.length) {
        let d = s[i++];
        out += d;
        if (d === "\\") {
          out += s[i++] || "";
          continue;
        }
        if (d === q) break;
      }
    } else if (c === "{") {
      out += c;
      i++;
      let depth = 1;
      while (i < s.length && depth > 0) {
        let d = s[i++];
        if (d === "{") depth++;
        else if (d === "}") depth--;
      }
    } else {
      out += c;
      i++;
    }
  }
  return out;
}
let clean = stripJS(s);
const pattern = /<(\/)?([A-Za-z0-9_\-\.]+)([^>]*)?(\/?)>/g;
let stack = [];
let m;
while ((m = pattern.exec(clean))) {
  const closing = !!m[1];
  const tag = m[2];
  const selfclose = !!m[4];
  const line = clean.substring(0, m.index).split("\n").length;
  if (!closing && !selfclose && /^[A-Za-z]/.test(tag))
    stack.push({ tag, line });
  else if (closing) {
    if (!stack) {
      console.log("Unmatched closing", tag, "at", line);
      process.exit(0);
    }
    const last = stack.pop();
    if (last.tag !== tag) {
      console.log(
        "Mismatch: expected closing for",
        last.tag,
        "(opened at",
        last.line,
        "), but found closing",
        tag,
        "at",
        line
      );
      process.exit(0);
    }
  }
}
if (stack.length)
  console.log("Unclosed tags at end (first 10):", stack.slice(0, 10));
else console.log("All tags matched");
```

## clean.ps1 (chunk 1)

```text
# Script de Limpeza - AVA Assistant v3.1
# Limpa caches, processos node e prepara ambiente
# Uso: .\scripts\clean.ps1

Write-Host "[LIMPEZA DE AMBIENTE - AVA Assistant]" -ForegroundColor Cyan
Write-Host ""

# 1. Matar processos node anteriores
Write-Host "[1] Matando processos Node.js anteriores..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Write-Host "   [OK] Processos Node.js finalizados" -ForegroundColor Green
}
else {
    Write-Host "   [INFO] Nenhum processo node ativo" -ForegroundColor Gray
}

# 2. Limpar diretórios de cache e build
Write-Host ""
Write-Host "[2] Removendo diretorios de cache..." -ForegroundColor Yellow
$dirsToClean = @("dist", ".turbo", ".vitest", ".next", "build")
foreach ($dir in $dirsToClean) {
    if (Test-Path $dir) {
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "   [OK] Removido: $dir" -ForegroundColor Green
    }
}

# 3. Limpar cache do Vite
Write-Host ""
Write-Host "[3] Limpando cache do sistema..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") {
    Remove-Item -Path "node_modules/.vite" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   [OK] Cache Vite removido" -ForegroundColor Green
}

# 4. Liberar portas
Write-Host ""
Write-Host "[4] Liberar portas..." -ForegroundColor Yellow
$ports = @(5173, 5174, 3000, 3001, 8080)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        $processId = $process.OwningProcess
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Write-Host "   [OK] Porta $port liberada" -ForegroundCol
```

## clean.ps1 (chunk 2)

```text
n -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        $processId = $process.OwningProcess
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Write-Host "   [OK] Porta $port liberada" -ForegroundColor Green
    }
}

# 5. Relatório final
Write-Host ""
Write-Host "[LIMPEZA CONCLUIDA COM SUCESSO]" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "   - Use: .\scripts\start-dev.ps1  (para desenvolvimento)" -ForegroundColor White
Write-Host "   - Use: .\scripts\start-prod.ps1 (para producao)" -ForegroundColor White
Write-Host ""
```

## drive-sync-manifest.json (chunk 1)

```text
{}
```

## drive_sync.py (chunk 1)

```text
import io
import logging
import os
import pickle
from pathlib import Path

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/drive.file"]

PROJECT_ROOT = Path(__file__).parent.parent
DEFAULT_DATA_DIR = PROJECT_ROOT.parent / f"{PROJECT_ROOT.name}-dados"
DATA_DIR = Path(os.getenv("AVA_DATA_DIR", str(DEFAULT_DATA_DIR)))
LOCAL_SYNC_FOLDER = Path(os.getenv("AVA_DRIVE_SYNC_DIR", str(DATA_DIR / "Drive_Sync")))
CREDENTIALS_FILE = PROJECT_ROOT / "credentials.json"
TOKEN_FILE = PROJECT_ROOT / "token.pickle"
DRIVE_FOLDER_NAME = os.getenv("DRIVE_SYNC_FOLDER_NAME", "SISTEMA_AVA_KNOWLEDGE")

def authenticate_google_drive():
    creds = None

    if TOKEN_FILE.exists():
        with open(TOKEN_FILE, "rb") as token:
            ***REDACTED*** = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            ***REDACTED***
        else:
            if not CREDENTIALS_FILE.exists():
                raise FileNotFoundError(
                    f"Arquivo {CREDENTIALS_FILE} nao encontrado. Coloque credentials.json na raiz do projeto."
                )

            flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_FILE), SCOPES)
            creds = flow.run_local_server(port=0)

        with open(TOKEN_FILE, "wb") as token:
            ***REDACTED*** token)

    return build("drive", "v3", credentials=creds)

def get_or_create_folder(service, folder_name, parent_id=None):
```

## drive_sync.py (chunk 2)

```text
creds = flow.run_local_server(port=0)

        with open(TOKEN_FILE, "wb") as token:
            ***REDACTED*** token)

    return build("drive", "v3", credentials=creds)

def get_or_create_folder(service, folder_name, parent_id=None):
    query_parts = [
        "mimeType='application/vnd.google-apps.folder'",
        f"name='{folder_name}'",
        "trashed=false",
    ]
    if parent_id:
        query_parts.append(f"'{parent_id}' in parents")

    query = " and ".join(query_parts)
    results = service.files().list(q=query, fields="files(id, name)").execute()
    files = results.get("files", [])

    if files:
        return files[0]["id"]

    metadata = {
        "name": folder_name,
        "mimeType": "application/vnd.google-apps.folder",
    }
    if parent_id:
        metadata["parents"] = [parent_id]

    created = service.files().create(body=metadata, fields="id").execute()
    return created["id"]

def ensure_remote_folder_tree(service, root_folder_id, relative_parts):
    current_parent = root_folder_id
    for part in relative_parts:
        current_parent = get_or_create_folder(service, part, current_parent)
    return current_parent

def upload_files_recursive(service, root_folder_id):
    LOCAL_SYNC_FOLDER.mkdir(parents=True, exist_ok=True)

    for file_path in LOCAL_SYNC_FOLDER.rglob("*"):
        if not file_path.is_file():
            continue

        relative_path = file_path.relative_to(LOCAL_SYNC_FOLDER)
        relative_parts = list(relative_path.parts)
        if not relative_parts:
            continue

        filename = relative_parts[-1]
        parent_parts = relative_parts[:-1]
        parent_id = ensure_remote_folder_tree(service, root_folder_id, parent_parts)

        query = (
            f"name='{filename}' and '{parent_
```

## drive_sync.py (chunk 3)

```text
continue

        filename = relative_parts[-1]
        parent_parts = relative_parts[:-1]
        parent_id = ensure_remote_folder_tree(service, root_folder_id, parent_parts)

        query = (
            f"name='{filename}' and '{parent_id}' in parents and trashed=false"
        )
        existing = service.files().list(q=query, fields="files(id)").execute().get("files", [])

        media = MediaFileUpload(str(file_path), resumable=True)

        if existing:
            file_id = existing[0]["id"]
            service.files().update(fileId=file_id, media_body=media).execute()
            logger.info("Arquivo atualizado no Drive: %s", relative_path.as_posix())
        else:
            service.files().create(
                body={"name": filename, "parents": [parent_id]},
                media_body=media,
                fields="id",
            ).execute()
            logger.info("Arquivo enviado ao Drive: %s", relative_path.as_posix())

def list_folder_files(service, folder_id):
    query = f"'{folder_id}' in parents and trashed=false"
    page_token = ***REDACTED***

    while True:
        results = service.files().list(
            q=query,
            fields="nextPageToken, files(id, name, mimeType)",
            pageToken=***REDACTED***
        ).execute()

        for item in results.get("files", []):
            yield item

        page_token = ***REDACTED***"nextPageToken")
        if not page_token:
            ***REDACTED***

def download_tree(service, folder_id, local_dir):
    local_dir.mkdir(parents=True, exist_ok=True)

    for item in list_folder_files(service, folder_id):
        item_id = item["id"]
        item_name = item["name"]
        mime_type = item.get("mimeType", "")

        if mime_type == "application/vnd.google-apps.folder":
```

## drive_sync.py (chunk 4)

```text
nts=True, exist_ok=True)

    for item in list_folder_files(service, folder_id):
        item_id = item["id"]
        item_name = item["name"]
        mime_type = item.get("mimeType", "")

        if mime_type == "application/vnd.google-apps.folder":
            download_tree(service, item_id, local_dir / item_name)
            continue

        target = local_dir / item_name
        if target.exists():
            continue

        request = service.files().get_media(fileId=item_id)
        handle = io.BytesIO()
        downloader = MediaIoBaseDownload(handle, request)
        done = False
        while not done:
            _, done = downloader.next_chunk()

        with open(target, "wb") as f:
            f.write(handle.getvalue())

        logger.info("Arquivo baixado do Drive: %s", target.relative_to(LOCAL_SYNC_FOLDER).as_posix())

def main():
    logger.info("Sincronizando Drive <-> %s", LOCAL_SYNC_FOLDER)
    service = authenticate_google_drive()
    root_folder_id = get_or_create_folder(service, DRIVE_FOLDER_NAME)

    upload_files_recursive(service, root_folder_id)
    download_tree(service, root_folder_id, LOCAL_SYNC_FOLDER)

    logger.info("Sincronizacao concluida com sucesso")

if __name__ == "__main__":
    main()
```

## full-reset.ps1 (chunk 1)

```text
# Script Completo: Limpar + Iniciar Dev - AVA Assistant v3.1
# Combina limpeza e início do servidor
# Uso: .\scripts\full-reset.ps1

Write-Host "[RESET COMPLETO + START - AVA Assistant]" -ForegroundColor Cyan
Write-Host ""

# Executar limpeza
Write-Host "[Etapa 1] Limpeza de ambiente..." -ForegroundColor Yellow
.\scripts\clean.ps1

# Verificar se a limpeza foi bem-sucedida
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Erro durante limpeza!" -ForegroundColor Red
    exit 1
}

# Aguardar um pouco
Write-Host ""
Write-Host "[Aguardando 2 segundos...]" -ForegroundColor Gray
Start-Sleep -Seconds 2

# Executar start dev
Write-Host ""
Write-Host "[Etapa 2] Iniciando dev server..." -ForegroundColor Yellow
.\scripts\start-dev.ps1
```

## import-drive-embeddings-to-memory.ts (chunk 1)

```text
import "dotenv/config";
import path from "node:path";
import { createHash } from "node:crypto";
import { createReadStream, promises as fs } from "node:fs";
import { asc, eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { invokeLLM } from "../server/_core/llm";
import { addMemoryEntry, getDb } from "../server/db";

type RawEmbeddingItem = {
  identifier?: string;
  source_path?: string;
  location?: string;
  details?: string;
  tags?: string[];
  type?: string;
};

type Group = {
  key: string;
  sourcePath: string;
  fileName: string;
  itemCount: number;
  tags: Set<string>;
  snippets: string[];
};

type Manifest = Record<string, { signature: string; updatedAt: string }>;

const PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(PROJECT_ROOT, "..", `${path.basename(PROJECT_ROOT)}-dados`);
const DEFAULT_INPUT_DIR = path.join(DEFAULT_DATA_DIR, "google-drive-embeddings", "json");
const DEFAULT_MANIFEST = path.join(DEFAULT_DATA_DIR, ".rag", "memory-import-manifest.json");

function parseArgs() {
  const raw = process.argv.slice(2);
  const values: Record<string, string | boolean> = {};

  for (let i = 0; i < raw.length; i += 1) {
    const token = ***REDACTED***
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = raw[i + 1];
    if (!next || next.startsWith("--")) {
      values[key] = true;
    } else {
      values[key] = next;
      i += 1;
    }
  }

  return {
    userId: typeof values["user-id"] === "string" ? Number(values["user-id"]) : undefined,
    inputDir: typeof values["input-dir"] === "string" ? path.resolve(values["input-dir"]) : DEFAULT_INPUT_DIR,
    manifestPath:
      typeof values["manifest"] === "string" ? path.resolve(values["manifest"]) : DEFAULT_MANIFEST,
    model:
```

## import-drive-embeddings-to-memory.ts (chunk 2)

```text
undefined,
    inputDir: typeof values["input-dir"] === "string" ? path.resolve(values["input-dir"]) : DEFAULT_INPUT_DIR,
    manifestPath:
      typeof values["manifest"] === "string" ? path.resolve(values["manifest"]) : DEFAULT_MANIFEST,
    model:
      typeof values["model"] === "string"
        ? values["model"]
        : process.env.OLLAMA_MODEL || "qwen3:8b",
    maxSnippetsPerSource:
      typeof values["max-snippets"] === "string" ? Math.max(1, Number(values["max-snippets"])) : 8,
    maxGroupsPerFile:
      typeof values["max-groups"] === "string" ? Math.max(1, Number(values["max-groups"])) : 300,
    dryRun: values["dry-run"] === true,
  };
}

async function resolveUserId(cliUserId?: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponivel.");

  if (cliUserId) {
    const found = await db.select().from(users).where(eq(users.id, cliUserId)).limit(1);
    if (!found[0]) throw new Error(`Usuario ${cliUserId} nao encontrado.`);
    return cliUserId;
  }

  const first = await db.select().from(users).orderBy(asc(users.id)).limit(1);
  if (!first[0]) throw new Error("Nenhum usuario encontrado no banco.");
  return first[0].id;
}

async function loadManifest(filePath: string): Promise<Manifest> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Manifest;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function saveManifest(filePath: string, data: Manifest): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function listJsonFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir
```

## import-drive-embeddings-to-memory.ts (chunk 3)

```text
se<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function listJsonFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".json"))
    .map((e) => path.join(dir, e.name))
    .sort((a, b) => a.localeCompare(b));
}

function normalizeText(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim();
}

function isInterestingItem(item: RawEmbeddingItem): boolean {
  const details = normalizeText(item.details);
  if (!details) return false;
  if (details.length < 15) return false;
  return true;
}

function buildSourcePath(item: RawEmbeddingItem, fallback: string): string {
  const source = normalizeText(item.source_path) || normalizeText(item.location);
  if (source) return source;
  const id = normalizeText(item.identifier);
  return id || fallback;
}

function extractSimpleKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s_-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);
  const counts = new Map<string, number>();
  for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
}

function fileSignature(group: Group): string {
  const payload = JSON.stringify({
    sourcePath: group.sourcePath,
    itemCount: group.itemCount,
    snippets: group.snippets,
    tags: [...group.tags].sort(),
  });
  return createHash("sha256").update(payload).digest("hex");
}

async function
```

## import-drive-embeddings-to-memory.ts (chunk 4)

```text
const payload = JSON.stringify({
    sourcePath: group.sourcePath,
    itemCount: group.itemCount,
    snippets: group.snippets,
    tags: [...group.tags].sort(),
  });
  return createHash("sha256").update(payload).digest("hex");
}

async function summarizeWithLocalLlm(group: Group, model: string): Promise<{ summary: string; keywords: string[] }> {
  const snippets = group.snippets
    .map((s, idx) => `Trecho ${idx + 1}: ${s}`)
    .join("\n");

  const prompt = [
    "Você organiza memória de projeto para recuperação futura.",
    "Retorne JSON com os campos: summary (max 450 chars) e keywords (array de 5 a 12 termos curtos).",
    `Fonte: ${group.sourcePath}`,
    `Itens agrupados: ${group.itemCount}`,
    `Tags: ${[...group.tags].slice(0, 20).join(", ") || "sem tags"}`,
    "Conteúdo:",
    snippets,
  ].join("\n");

  try {
    const result = await invokeLLM({
      provider: "ollama",
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      timeoutMs: 120000,
    });

    const content = result.choices?.[0]?.message?.content;
    const text = typeof content === "string" ? content : JSON.stringify(content || {});
    const parsed = JSON.parse(text || "{}");
    const summary = normalizeText(String(parsed.summary || ""));
    const keywords = Array.isArray(parsed.keywords)
      ? parsed.keywords.map((k: unknown) => normalizeText(String(k))).filter(Boolean)
      : [];

    if (summary) {
      return { summary, keywords: keywords.slice(0, 12) };
    }
  } catch {
    // fallback below
  }

  const fallbackSummary = normalizeText(group.snippets.join(" ")).slice(0, 450);
  const fallbackKeywords = [...group.tags, ...extractSimpleKeywords(fallbackSummary)].slice(0, 12);
  return { summary: fallbackSumma
```

## import-drive-embeddings-to-memory.ts (chunk 5)

```text
catch {
    // fallback below
  }

  const fallbackSummary = normalizeText(group.snippets.join(" ")).slice(0, 450);
  const fallbackKeywords = [...group.tags, ...extractSimpleKeywords(fallbackSummary)].slice(0, 12);
  return { summary: fallbackSummary, keywords: fallbackKeywords };
}

async function* streamItemsFromJson(filePath: string): AsyncGenerator<RawEmbeddingItem> {
  const stream = createReadStream(filePath, { encoding: "utf-8" });

  let mode: "seekItems" | "seekArray" | "seekObject" | "inObject" | "done" = "seekItems";
  let recent = "";
  let objectBuffer = "";
  let braceDepth = 0;
  let inString = false;
  let escaped = false;

  for await (const chunk of stream) {
    for (let i = 0; i < chunk.length; i += 1) {
      const ch = chunk[i];

      if (mode === "seekItems") {
        recent = (recent + ch).slice(-32);
        if (recent.includes('"items"')) {
          mode = "seekArray";
        }
        continue;
      }

      if (mode === "seekArray") {
        if (ch === "[") mode = "seekObject";
        continue;
      }

      if (mode === "seekObject") {
        if (ch === "{") {
          mode = "inObject";
          objectBuffer = "{";
          braceDepth = 1;
          inString = false;
          escaped = false;
          continue;
        }
        if (ch === "]") {
          mode = "done";
          break;
        }
        continue;
      }

      if (mode === "inObject") {
        objectBuffer += ch;

        if (inString) {
          if (escaped) {
            escaped = false;
          } else if (ch === "\\") {
            escaped = true;
          } else if (ch === '"') {
            inString = false;
          }
          continue;
        }

        if (ch === '"') {
          inString = true;
          continue;
        }

        if (
```

## import-drive-embeddings-to-memory.ts (chunk 6)

```text
f (ch === "\\") {
            escaped = true;
          } else if (ch === '"') {
            inString = false;
          }
          continue;
        }

        if (ch === '"') {
          inString = true;
          continue;
        }

        if (ch === "{") {
          braceDepth += 1;
          continue;
        }

        if (ch === "}") {
          braceDepth -= 1;
          if (braceDepth === 0) {
            try {
              const item = JSON.parse(objectBuffer) as RawEmbeddingItem;
              yield item;
            } catch {
              // ignore invalid object and keep stream moving
            }
            objectBuffer = "";
            mode = "seekObject";
          }
        }
      }
    }

    if (mode === "done") break;
  }
}

async function processFile(
  filePath: string,
  userId: number,
  model: string,
  maxSnippetsPerSource: number,
  maxGroupsPerFile: number,
  manifest: Manifest,
  dryRun: boolean
) {
  const groups = new Map<string, Group>();
  const fileName = path.basename(filePath);
  let scannedItems = 0;

  for await (const item of streamItemsFromJson(filePath)) {
    scannedItems += 1;
    if (!isInterestingItem(item)) continue;

    const sourcePath = buildSourcePath(item, fileName);
    const key = `${fileName}::${sourcePath}`;
    const details = normalizeText(item.details);

    if (!groups.has(key)) {
      if (groups.size >= maxGroupsPerFile) continue;
      groups.set(key, {
        key,
        sourcePath,
        fileName,
        itemCount: 0,
        tags: new Set<string>(),
        snippets: [],
      });
    }

    const group = groups.get(key)!;
    group.itemCount += 1;

    if (details && group.snippets.length < maxSnippetsPerSource) {
      group.snippets.push(details.slice(0, 1200));
    }

    if (Array.isArr
```

## import-drive-embeddings-to-memory.ts (chunk 7)

```text
(),
        snippets: [],
      });
    }

    const group = groups.get(key)!;
    group.itemCount += 1;

    if (details && group.snippets.length < maxSnippetsPerSource) {
      group.snippets.push(details.slice(0, 1200));
    }

    if (Array.isArray(item.tags)) {
      for (const tag of item.tags) {
        const normalized = normalizeText(String(tag)).toLowerCase();
        if (normalized && group.tags.size < 30) group.tags.add(normalized);
      }
    }
    if (item.type) group.tags.add(normalizeText(item.type).toLowerCase());
  }

  let imported = 0;
  let skipped = 0;

  for (const group of groups.values()) {
    if (group.snippets.length === 0) {
      skipped += 1;
      continue;
    }

    const signature = fileSignature(group);
    const previous = manifest[group.key];
    if (previous?.signature === signature) {
      skipped += 1;
      continue;
    }

    const organized = await summarizeWithLocalLlm(group, model);
    const keywords = [...new Set([...group.tags, ...organized.keywords])].slice(0, 16).join(", ");
    const memoryText = [
      `[IMPORTADO] Fonte: ${group.sourcePath}`,
      `Arquivo-base: ${group.fileName}`,
      `Entradas agregadas: ${group.itemCount}`,
      `Resumo: ${organized.summary}`,
    ].join("\n");

    if (!dryRun) {
      await addMemoryEntry(userId, memoryText, keywords, "context");
    }

    manifest[group.key] = {
      signature,
      updatedAt: new Date().toISOString(),
    };
    imported += 1;
  }

  return { scannedItems, groups: groups.size, imported, skipped };
}

async function run() {
  const args = parseArgs();
  const userId = await resolveUserId(args.userId);

  process.env.LLM_PROVIDER = process.env.LLM_PROVIDER || "ollama";
  process.env.EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "nomic-embed-text:la
```

## import-drive-embeddings-to-memory.ts (chunk 8)

```text
nc function run() {
  const args = parseArgs();
  const userId = await resolveUserId(args.userId);

  process.env.LLM_PROVIDER = process.env.LLM_PROVIDER || "ollama";
  process.env.EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "nomic-embed-text:latest";

  const inputDirStat = await fs.stat(args.inputDir).catch(() => null);
  if (!inputDirStat || !inputDirStat.isDirectory()) {
    throw new Error(`Pasta de entrada nao encontrada: ${args.inputDir}`);
  }

  const files = await listJsonFiles(args.inputDir);
  if (files.length === 0) {
    console.log(`[MemoryImport] Nenhum JSON encontrado em ${args.inputDir}`);
    return;
  }

  const manifest = await loadManifest(args.manifestPath);

  let totalScanned = 0;
  let totalGroups = 0;
  let totalImported = 0;
  let totalSkipped = 0;

  console.log(`[MemoryImport] Usuario: ${userId}`);
  console.log(`[MemoryImport] Pasta: ${args.inputDir}`);
  console.log(`[MemoryImport] Arquivos: ${files.length}`);
  console.log(`[MemoryImport] Modelo local: ${args.model}`);
  if (args.dryRun) console.log("[MemoryImport] DRY RUN ativo (sem gravar no banco)");

  for (const filePath of files) {
    const result = await processFile(
      filePath,
      userId,
      args.model,
      args.maxSnippetsPerSource,
      args.maxGroupsPerFile,
      manifest,
      args.dryRun
    );
    totalScanned += result.scannedItems;
    totalGroups += result.groups;
    totalImported += result.imported;
    totalSkipped += result.skipped;

    console.log(
      `[MemoryImport] ${path.basename(filePath)} -> itens: ${result.scannedItems}, grupos: ${result.groups}, importados: ${result.imported}, pulados: ${result.skipped}`
    );
  }

  if (!args.dryRun) {
    await saveManifest(args.manifestPath, manifest);
  }

  console.log("\n[MemoryImport] Concluid
```

## import-drive-embeddings-to-memory.ts (chunk 9)

```text
itens: ${result.scannedItems}, grupos: ${result.groups}, importados: ${result.imported}, pulados: ${result.skipped}`
    );
  }

  if (!args.dryRun) {
    await saveManifest(args.manifestPath, manifest);
  }

  console.log("\n[MemoryImport] Concluido");
  console.log(`[MemoryImport] Itens lidos: ${totalScanned}`);
  console.log(`[MemoryImport] Grupos: ${totalGroups}`);
  console.log(`[MemoryImport] Memorias importadas: ${totalImported}`);
  console.log(`[MemoryImport] Puladas: ${totalSkipped}`);
  console.log(`[MemoryImport] Manifesto: ${args.manifestPath}`);
}

run().catch((error) => {
  console.error("[MemoryImport] Falha:", error);
  process.exitCode = 1;
});
```

## index-drive-sync.ts (chunk 1)

```text
import "dotenv/config";
import path from "node:path";
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import { asc, eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import {
  createDocumentChunkBatch,
  createDocumentRAG,
  getDb,
  getDocumentByExternalId,
  hardDeleteDocument,
  updateDocumentProgress,
  updateDocumentStatusById,
} from "../server/db";
import { chunkText, extractText } from "../server/rag";
import { generateEmbedding } from "../server/_core/llm";

type ManifestEntry = {
  sha256: string;
  documentId: number;
  updatedAt: string;
};

type Manifest = Record<string, ManifestEntry>;

const PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(
  PROJECT_ROOT,
  "..",
  `${path.basename(PROJECT_ROOT)}-dados`
);
const DATA_DIR = process.env.AVA_DATA_DIR
  ? path.resolve(process.env.AVA_DATA_DIR)
  : DEFAULT_DATA_DIR;
const DEFAULT_DRIVE_SYNC_DIR = process.env.AVA_DRIVE_SYNC_DIR
  ? path.resolve(process.env.AVA_DRIVE_SYNC_DIR)
  : path.join(DATA_DIR, "Drive_Sync");
const DEFAULT_MANIFEST_PATH = process.env.AVA_MANIFEST_PATH
  ? path.resolve(process.env.AVA_MANIFEST_PATH)
  : path.join(DATA_DIR, ".rag", "drive-sync-manifest.json");
const DEFAULT_BATCH_SIZE = 10;

const SUPPORTED_EXTENSIONS = new Set([
  ".txt",
  ".md",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".csv",
  ".json",
  ".html",
  ".htm",
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".bmp",
  ".tiff",
  ".tif",
]);

function parseArgs() {
  const args = process.argv.slice(2);
  const values: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i += 1) {
    const raw = args[i];
    if (!raw.startsWith("--")) continue;
    const key = raw.slice(2);
```

## index-drive-sync.ts (chunk 2)

```text
parseArgs() {
  const args = process.argv.slice(2);
  const values: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i += 1) {
    const raw = args[i];
    if (!raw.startsWith("--")) continue;
    const key = raw.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith("--")) {
      values[key] = true;
    } else {
      values[key] = next;
      i += 1;
    }
  }

  return {
    userId: values["user-id"] ? Number(values["user-id"]) : undefined,
    driveDir: typeof values["drive-dir"] === "string" ? values["drive-dir"] : DEFAULT_DRIVE_SYNC_DIR,
    manifestPath:
      typeof values["manifest"] === "string" ? values["manifest"] : DEFAULT_MANIFEST_PATH,
    batchSize:
      typeof values["batch-size"] === "string"
        ? Math.max(1, Number(values["batch-size"]))
        : DEFAULT_BATCH_SIZE,
    purgeMissing: values["purge-missing"] === true,
  };
}

function ensureNomicModelDefault() {
  if (!process.env.EMBEDDING_MODEL) {
    process.env.EMBEDDING_MODEL = "nomic-embed-text:latest";
  }
}

async function checkOllamaAvailable(baseUrl: string) {
  const url = `${baseUrl.replace(/\/$/, "")}/api/tags`;
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    throw new Error(`Falha ao consultar Ollama em ${url}: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as { models?: Array<{ name?: string }> };
  const modelName = process.env.EMBEDDING_MODEL || "nomic-embed-text:latest";
  const expected = modelName.split(":")[0];
  const models = (data.models || []).map((m) => m.name || "");
  const found = models.some((name) => name.includes(expected));
  if (!found) {
    throw new Error(
      `Modelo de embedding nao encontrado no Ollama. Esperado: ${modelName}. Disponive
```

## index-drive-sync.ts (chunk 3)

```text
const models = (data.models || []).map((m) => m.name || "");
  const found = models.some((name) => name.includes(expected));
  if (!found) {
    throw new Error(
      `Modelo de embedding nao encontrado no Ollama. Esperado: ${modelName}. Disponiveis: ${models.join(", ") || "nenhum"}`
    );
  }
}

async function loadManifest(filePath: string): Promise<Manifest> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Manifest;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function saveManifest(filePath: string, manifest: Manifest): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(manifest, null, 2), "utf-8");
}

async function getAllFiles(rootDir: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(current: string) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  return results.sort((a, b) => a.localeCompare(b));
}

function mimeTypeFromFileName(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const map: Record<string, string> = {
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "applicat
```

## index-drive-sync.ts (chunk 4)

```text
d<string, string> = {
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".csv": "text/csv",
    ".json": "application/json",
    ".html": "text/html",
    ".htm": "text/html",
    ".js": "text/javascript",
    ".ts": "text/plain",
    ".jsx": "text/plain",
    ".tsx": "text/plain",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".tiff": "image/tiff",
    ".tif": "image/tiff",
  };
  return map[ext] || "application/octet-stream";
}

function externalIdFromRelativePath(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/").toLowerCase();
  return `drive_sync:${normalized}`;
}

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

async function resolveUserId(cliUserId?: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponivel.");

  if (cliUserId) {
    const found = await db.select().from(users).where(eq(users.id, cliUserId)).limit(1);
    if (!found[0]) {
      throw new Error(`Usuario ${cliUserId} nao encontrado.`);
    }
    return cliUserId;
  }

  const first = await db.select().from(users).orderBy(asc(users.id)).limit(1);
  if (!first[0]) {
    throw new Error("Nenhum usuario encontrado no banco. Crie um usuario antes de indexar.");
  }
  return first[0].id;
}

async function run() {
  ensureNomicModelDefault();
  const args = parseArgs();
  co
```

## index-drive-sync.ts (chunk 5)

```text
sc(users.id)).limit(1);
  if (!first[0]) {
    throw new Error("Nenhum usuario encontrado no banco. Crie um usuario antes de indexar.");
  }
  return first[0].id;
}

async function run() {
  ensureNomicModelDefault();
  const args = parseArgs();
  const driveDir = path.resolve(args.driveDir);
  const manifestPath = path.resolve(args.manifestPath);
  const userId = await resolveUserId(args.userId);
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  await checkOllamaAvailable(ollamaBaseUrl);

  const stat = await fs.stat(driveDir).catch(() => null);
  if (!stat) {
    await fs.mkdir(driveDir, { recursive: true });
    console.warn(`[RAG][DriveSync] Pasta criada automaticamente: ${driveDir}`);
  } else if (!stat.isDirectory()) {
    throw new Error(`Caminho nao e pasta: ${driveDir}`);
  }

  const files = await getAllFiles(driveDir);
  const manifest = await loadManifest(manifestPath);
  const nextManifest: Manifest = { ...manifest };
  const seenKeys = new Set<string>();

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`[RAG][DriveSync] Usuario: ${userId}`);
  console.log(`[RAG][DriveSync] Data dir: ${DATA_DIR}`);
  console.log(`[RAG][DriveSync] Pasta: ${driveDir}`);
  console.log(`[RAG][DriveSync] Arquivos elegiveis: ${files.length}`);

  for (const fullPath of files) {
    const relativePath = path.relative(driveDir, fullPath);
    const key = relativePath.replace(/\\/g, "/");
    seenKeys.add(key);

    try {
      const fileBuffer = await fs.readFile(fullPath);
      const hash = sha256(fileBuffer);
      const previous = manifest[key];
      if (previous?.sha256 === hash) {
        skipped += 1;
        continue;
      }

      const fileName = path.basename(fullPath);
      const mimeType = mimeTypeFromFileNa
```

## index-drive-sync.ts (chunk 6)

```text
const hash = sha256(fileBuffer);
      const previous = manifest[key];
      if (previous?.sha256 === hash) {
        skipped += 1;
        continue;
      }

      const fileName = path.basename(fullPath);
      const mimeType = mimeTypeFromFileName(fileName);
      const externalId = externalIdFromRelativePath(key);

      const existing = await getDocumentByExternalId(userId, externalId);
      if (existing) {
        await hardDeleteDocument(userId, existing.id);
      }

      const extracted = await extractText(fileName, mimeType, fileBuffer);
      const text = extracted.replace(/\s+/g, " ").trim();
      if (!text) {
        console.warn(`[RAG][DriveSync] Sem texto util: ${key}`);
        skipped += 1;
        continue;
      }

      const chunks = chunkText(text);
      const estimatedSizeKB = Math.ceil((text.length + chunks.length * 768 * 4) / 1024);

      const createResult = await createDocumentRAG(userId, {
        name: fileName,
        filename: key,
        type: mimeType,
        size: fileBuffer.length,
        status: "processing",
        isIndexed: 0,
        externalId,
        sourceType: "drive_sync",
        legalStatus: "vigente",
        totalChunks: chunks.length,
        indexedChunks: 0,
        estimatedSizeKB,
        embeddingProvider: "ollama",
        embeddingModel: process.env.EMBEDDING_MODEL,
      });

      const documentId = Number((createResult as any)?.lastInsertRowid || (createResult as any)?.[0]?.id);
      if (!Number.isFinite(documentId) || documentId <= 0) {
        throw new Error(`Falha ao criar documento para ${key}`);
      }

      let indexed = 0;
      for (let i = 0; i < chunks.length; i += args.batchSize) {
        const batch = chunks.slice(i, i + args.batchSize);
        const vectors = await Promise.all(ba
```

## index-drive-sync.ts (chunk 7)

```text
new Error(`Falha ao criar documento para ${key}`);
      }

      let indexed = 0;
      for (let i = 0; i < chunks.length; i += args.batchSize) {
        const batch = chunks.slice(i, i + args.batchSize);
        const vectors = await Promise.all(batch.map((chunk) => generateEmbedding(chunk.content, "ollama")));

        const rows = batch.map((chunk, offset) => ({
          documentId,
          chunkIndex: chunk.chunkIndex,
          content: chunk.content,
          metadata: JSON.stringify(chunk.metadata || {}),
          embedding: JSON.stringify(vectors[offset]),
          embeddingProvider: "ollama",
          embeddingModel: process.env.EMBEDDING_MODEL || "nomic-embed-text:latest",
          embeddingDimensions: vectors[offset].length,
        }));

        await createDocumentChunkBatch(rows);
        indexed += batch.length;
        await updateDocumentProgress(documentId, indexed, chunks.length);
      }

      await updateDocumentStatusById(documentId, "indexed");

      nextManifest[key] = {
        sha256: hash,
        documentId,
        updatedAt: new Date().toISOString(),
      };

      processed += 1;
      console.log(`[RAG][DriveSync] Indexado: ${key} (${chunks.length} chunks)`);
    } catch (error) {
      failed += 1;
      console.error(`[RAG][DriveSync] Erro em ${key}:`, error);
    }
  }

  if (args.purgeMissing) {
    const missingKeys = Object.keys(nextManifest).filter((k) => !seenKeys.has(k));
    for (const missingKey of missingKeys) {
      const externalId = externalIdFromRelativePath(missingKey);
      const existing = await getDocumentByExternalId(userId, externalId);
      if (existing) {
        await hardDeleteDocument(userId, existing.id);
      }
      delete nextManifest[missingKey];
      console.log(`[RAG][DriveSync] Removido
```

## index-drive-sync.ts (chunk 8)

```text
gKey);
      const existing = await getDocumentByExternalId(userId, externalId);
      if (existing) {
        await hardDeleteDocument(userId, existing.id);
      }
      delete nextManifest[missingKey];
      console.log(`[RAG][DriveSync] Removido (nao existe mais no Drive_Sync): ${missingKey}`);
    }
  }

  await saveManifest(manifestPath, nextManifest);
  console.log("\n[RAG][DriveSync] Concluido");
  console.log(`[RAG][DriveSync] Processados: ${processed}`);
  console.log(`[RAG][DriveSync] Ignorados (sem alteracao/sem texto): ${skipped}`);
  console.log(`[RAG][DriveSync] Falhas: ${failed}`);
  console.log(`[RAG][DriveSync] Manifesto: ${manifestPath}`);
}

run().catch((error) => {
  console.error("[RAG][DriveSync] Falha fatal:", error);
  process.exitCode = 1;
});
```

## knowledge-cli.ts (chunk 1)

```text
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

type Mode = 'chat' | 'rag' | 'both';
type EntryType = 'source_code' | 'documentation' | 'config' | 'data_json' | 'internal_memory' | 'other_text';

type CliOptions = {
  targetPath: string;
  mode: Mode;
  chunkSize: number;
  overlapChars: number;
  maxFileSizeBytes: number;
  outRoot: string;
};

type CollectedFile = {
  absolutePath: string;
  relativePath: string;
  extension: string;
  size: number;
};

type ChunkRecord = {
  id: string;
  source_file: string;
  file_type: EntryType;
  extension: string;
  language: string;
  chunk_index: number;
  chars: number;
  text: string;
};

type FileSummary = {
  file: string;
  type: EntryType;
  language: string;
  chunks: number;
  size: number;
  hash: string;
};

type ModuleSummary = {
  modulePath: string;
  files: number;
  chunks: number;
  totalBytes: number;
  byType: Record<EntryType, number>;
  byLanguage: Record<string, number>;
  topFilesByChunks: Array<{ file: string; chunks: number; size: number }>;
};

const DEFAULTS = {
  mode: 'both' as Mode,
  chunkSize: 1800,
  overlapChars: 250,
  maxFileSizeBytes: 2 * 1024 * 1024,
};

const EXCLUDED_DIRS = new Set([
  '.git',
  '.next',
  '.turbo',
  '.cache',
  '.idea',
  '.vscode',
  'node_modules',
  'dist',
  'build',
  'coverage',
  'tmp',
  'temp',
  'logs',
  '__pycache__',
]);

const ALWAYS_EXCLUDED_FILES = new Set(['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock']);

const TEXT_EXTENSIONS = new Set([
  '.md', '.txt', '.html', '.htm', '.json', '.yaml', '.yml', '.toml', '.ini', '.env',
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
```

## knowledge-cli.ts (chunk 2)

```text
S_EXCLUDED_FILES = new Set(['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock']);

const TEXT_EXTENSIONS = new Set([
  '.md', '.txt', '.html', '.htm', '.json', '.yaml', '.yml', '.toml', '.ini', '.env',
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.py', '.java', '.cs', '.go', '.rs', '.php',
  '.rb', '.swift', '.kt', '.kts', '.dart', '.sql', '.sh', '.bat', '.ps1', '.css', '.scss',
  '.less', '.xml', '.csv', '.graphql', '.gql', '.vue', '.svelte', '.dockerfile', '.conf', '.cfg'
]);

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.mp3', '.mp4', '.zip', '.gz', '.7z',
  '.rar', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.exe', '.dll', '.bin', '.db'
]);

function parseArgs(argv: string[]) {
  const flags = new Map<string, string>();
  const positional: string[] = [];

  for (const token of argv) {
    if (!token.startsWith('--')) {
      positional.push(token);
      continue;
    }
    const [key, value] = token.slice(2).split('=');
    flags.set(key, value ?? 'true');
  }

  return { flags, positional };
}

function toMode(value: string | undefined): Mode {
  if (value === 'chat' || value === 'rag' || value === 'both') {
    return value;
  }
  return DEFAULTS.mode;
}

function sanitizeText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/[\t]/g, '  ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/(api[_-]?key\s*[=:]\s*)(["']?)[^\s"']+\2/gi, '$1***REDACTED***')
    .replace(/(token\s*[=:]\s*)(["']?)[^\s"']+\2/gi, '$1***REDACTED***')
    .replace(/(secret\s*[=:]\s*)(["']?)[^\s"']+\2/gi, '$1***REDACTED***')
    .trim();
}

function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
```

## knowledge-cli.ts (chunk 3)

```text
"']+\2/gi, '$1***REDACTED***')
    .replace(/(secret\s*[=:]\s*)(["']?)[^\s"']+\2/gi, '$1***REDACTED***')
    .trim();
}

function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function inferLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const byExt: Record<string, string> = {
    '.ts': 'typescript', '.tsx': 'typescript', '.js': 'javascript', '.jsx': 'javascript',
    '.py': 'python', '.go': 'go', '.rs': 'rust', '.java': 'java', '.cs': 'csharp',
    '.php': 'php', '.rb': 'ruby', '.swift': 'swift', '.kt': 'kotlin', '.dart': 'dart',
    '.sql': 'sql', '.sh': 'shell', '.bat': 'batch', '.ps1': 'powershell',
    '.css': 'css', '.scss': 'scss', '.html': 'html', '.htm': 'html', '.md': 'markdown',
    '.json': 'json', '.yaml': 'yaml', '.yml': 'yaml', '.xml': 'xml', '.txt': 'text',
  };
  return byExt[ext] ?? 'text';
}

function classifyFile(relativePath: string): EntryType {
  const normalized = relativePath.replace(/\\/g, '/').toLowerCase();
  const ext = path.extname(relativePath).toLowerCase();

  if (normalized.includes('/docs/') || ext === '.md') {
    return 'documentation';
  }
  if (ext === '.json') {
    if (
      normalized.includes('/.rag/')
      || normalized.includes('/memory/')
      || normalized.includes('embeddings')
      || normalized.includes('manifest')
      || normalized.includes('/cache/')
    ) {
      return 'internal_memory';
    }
    return 'data_json';
  }
  if (['.env', '.yaml', '.yml', '.toml', '.ini', '.conf', '.cfg'].includes(ext)) {
    return 'config';
  }
  if (['.ts', '.tsx', '.j
```

## knowledge-cli.ts (chunk 4)

```text
')
      || normalized.includes('/cache/')
    ) {
      return 'internal_memory';
    }
    return 'data_json';
  }
  if (['.env', '.yaml', '.yml', '.toml', '.ini', '.conf', '.cfg'].includes(ext)) {
    return 'config';
  }
  if (['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.cs', '.php', '.rb', '.sql', '.css', '.scss'].includes(ext)) {
    return 'source_code';
  }

  return 'other_text';
}

function isTextCandidate(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath).toLowerCase();

  if (ALWAYS_EXCLUDED_FILES.has(base)) {
    return false;
  }
  if (BINARY_EXTENSIONS.has(ext)) {
    return false;
  }
  if (TEXT_EXTENSIONS.has(ext)) {
    return true;
  }
  return ext === '';
}

function collectFiles(targetPath: string, maxFileSizeBytes: number): {
  files: CollectedFile[];
  excluded: Array<{ path: string; reason: string }>;
} {
  const files: CollectedFile[] = [];
  const excluded: Array<{ path: string; reason: string }> = [];

  const rootStat = fs.statSync(targetPath);
  const rootBase = rootStat.isFile() ? path.dirname(targetPath) : targetPath;

  const walk = (absolute: string) => {
    const stat = fs.statSync(absolute);

    if (stat.isDirectory()) {
      const dirName = path.basename(absolute).toLowerCase();
      if (EXCLUDED_DIRS.has(dirName)) {
        excluded.push({ path: absolute, reason: `excluded directory: ${dirName}` });
        return;
      }

      const children = fs.readdirSync(absolute);
      for (const child of children) {
        walk(path.join(absolute, child));
      }
      return;
    }

    if (!stat.isFile()) {
      return;
    }

    const relativePath = path.relative(rootBase, absolute) || path.basename(absolute);

    if (!isTextCandidate(absolute
```

## knowledge-cli.ts (chunk 5)

```text
hildren) {
        walk(path.join(absolute, child));
      }
      return;
    }

    if (!stat.isFile()) {
      return;
    }

    const relativePath = path.relative(rootBase, absolute) || path.basename(absolute);

    if (!isTextCandidate(absolute)) {
      excluded.push({ path: relativePath, reason: 'non-text or excluded file' });
      return;
    }

    if (stat.size > maxFileSizeBytes) {
      excluded.push({ path: relativePath, reason: `file too large (${stat.size} bytes)` });
      return;
    }

    files.push({
      absolutePath: absolute,
      relativePath,
      extension: path.extname(absolute).toLowerCase() || '<none>',
      size: stat.size,
    });
  };

  walk(targetPath);
  return { files, excluded };
}

function splitChunks(text: string, chunkSize: number, overlapChars: number): string[] {
  const clean = sanitizeText(text);
  if (!clean) {
    return [];
  }

  const chunks: string[] = [];
  let index = 0;

  while (index < clean.length) {
    const end = Math.min(clean.length, index + chunkSize);
    const chunk = clean.slice(index, end).trim();
    if (chunk) {
      chunks.push(chunk);
    }
    if (end >= clean.length) {
      break;
    }
    index = Math.max(0, end - overlapChars);
  }

  return chunks;
}

function nextExportDir(outRoot: string): string {
  if (!fs.existsSync(outRoot)) {
    fs.mkdirSync(outRoot, { recursive: true });
  }

  const names = fs.readdirSync(outRoot).filter((name) => /^knowledge-export-\d{3}$/.test(name));
  const current = names
    .map((name) => Number(name.replace('knowledge-export-', '')))
    .filter((n) => Number.isFinite(n));
  const next = (current.length ? Math.max(...current) : 0) + 1;
  const folderName = `knowledge-export-${String(next).padStart(3, '0')}`;
  const absolute = path.join(outRoot, folder
```

## knowledge-cli.ts (chunk 6)

```text
('knowledge-export-', '')))
    .filter((n) => Number.isFinite(n));
  const next = (current.length ? Math.max(...current) : 0) + 1;
  const folderName = `knowledge-export-${String(next).padStart(3, '0')}`;
  const absolute = path.join(outRoot, folderName);
  fs.mkdirSync(absolute, { recursive: true });
  return absolute;
}

function readFileText(file: CollectedFile): string {
  const ext = path.extname(file.absolutePath).toLowerCase();
  const raw = fs.readFileSync(file.absolutePath, 'utf-8');

  if (ext === '.html' || ext === '.htm') {
    return stripHtml(raw);
  }

  return raw;
}

function buildChatMarkdown(chunks: ChunkRecord[], sourcePath: string): string {
  const lines: string[] = [];
  lines.push(`# Knowledge package: ${path.basename(sourcePath)}`);
  lines.push('');
  lines.push(`- Source: \`${sourcePath}\``);
  lines.push(`- Chunks: ${chunks.length}`);
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Suggested usage');
  lines.push('Use the context below as the only source. If information is missing, state it clearly.');
  lines.push('');

  for (const chunk of chunks) {
    lines.push(`## ${chunk.source_file} (chunk ${chunk.chunk_index + 1})`);
    lines.push('');
    lines.push('```text');
    lines.push(chunk.text);
    lines.push('```');
    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}

function buildTreeMarkdown(files: CollectedFile[], sourcePath: string): string {
  const normalized = files
    .map((file) => file.relativePath.replace(/\\/g, '/'))
    .sort((a, b) => a.localeCompare(b));

  const lines: string[] = [];
  lines.push(`# Project tree: ${path.basename(sourcePath)}`);
  lines.push('');
  lines.push(`- Source: \`${sourcePath}\``);
  lines.push(`- Included files: ${normalized.length
```

## knowledge-cli.ts (chunk 7)

```text
)
    .sort((a, b) => a.localeCompare(b));

  const lines: string[] = [];
  lines.push(`# Project tree: ${path.basename(sourcePath)}`);
  lines.push('');
  lines.push(`- Source: \`${sourcePath}\``);
  lines.push(`- Included files: ${normalized.length}`);
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('```text');

  let previousParts: string[] = [];
  for (const filePath of normalized) {
    const parts = filePath.split('/');
    let common = 0;
    while (common < previousParts.length && common < parts.length - 1 && previousParts[common] === parts[common]) {
      common += 1;
    }

    for (let i = common; i < parts.length - 1; i += 1) {
      lines.push(`${'  '.repeat(i)}${parts[i]}/`);
    }

    lines.push(`${'  '.repeat(parts.length - 1)}${parts[parts.length - 1]}`);
    previousParts = parts;
  }

  lines.push('```');
  lines.push('');
  return lines.join('\n');
}

function getModuleKey(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, '/');
  const [first] = normalized.split('/');
  if (!first || first === normalized) {
    return '.';
  }
  return first;
}

function buildModuleSummaries(fileSummaries: FileSummary[]): ModuleSummary[] {
  const map = new Map<string, ModuleSummary>();

  for (const file of fileSummaries) {
    const modulePath = getModuleKey(file.file);
    const current = map.get(modulePath) ?? {
      modulePath,
      files: 0,
      chunks: 0,
      totalBytes: 0,
      byType: {
        source_code: 0,
        documentation: 0,
        config: 0,
        data_json: 0,
        internal_memory: 0,
        other_text: 0,
      },
      byLanguage: {},
      topFilesByChunks: [],
    };

    current.files += 1;
    current.chunks += file.chunks;
    current.totalBytes += fil
```

## knowledge-cli.ts (chunk 8)

```text
0,
        config: 0,
        data_json: 0,
        internal_memory: 0,
        other_text: 0,
      },
      byLanguage: {},
      topFilesByChunks: [],
    };

    current.files += 1;
    current.chunks += file.chunks;
    current.totalBytes += file.size;
    current.byType[file.type] += 1;
    current.byLanguage[file.language] = (current.byLanguage[file.language] ?? 0) + 1;
    current.topFilesByChunks.push({ file: file.file, chunks: file.chunks, size: file.size });

    map.set(modulePath, current);
  }

  return Array.from(map.values())
    .map((summary) => ({
      ...summary,
      topFilesByChunks: summary.topFilesByChunks
        .sort((a, b) => b.chunks - a.chunks || b.size - a.size)
        .slice(0, 10),
    }))
    .sort((a, b) => a.modulePath.localeCompare(b.modulePath));
}

function writeModuleSummaries(exportDir: string, summaries: ModuleSummary[]): string {
  const dir = path.join(exportDir, 'module-summaries');
  fs.mkdirSync(dir, { recursive: true });

  const overviewLines: string[] = [];
  overviewLines.push('# Module summaries');
  overviewLines.push('');
  overviewLines.push(`- Modules: ${summaries.length}`);
  overviewLines.push(`- Generated: ${new Date().toISOString()}`);
  overviewLines.push('');
  overviewLines.push('| Module | Files | Chunks | Size (bytes) |');
  overviewLines.push('| --- | ---: | ---: | ---: |');

  for (const summary of summaries) {
    const fileName = summary.modulePath === '.' ? 'root.md' : `${summary.modulePath.replace(/[^a-zA-Z0-9._-]/g, '_')}.md`;
    overviewLines.push(`| [${summary.modulePath}](./${fileName}) | ${summary.files} | ${summary.chunks} | ${summary.totalBytes} |`);

    const moduleLines: string[] = [];
    moduleLines.push(`# Module: ${summary.modulePath}`);
    moduleLines.push('');
    moduleLines.pus
```

## knowledge-cli.ts (chunk 9)

```text
| [${summary.modulePath}](./${fileName}) | ${summary.files} | ${summary.chunks} | ${summary.totalBytes} |`);

    const moduleLines: string[] = [];
    moduleLines.push(`# Module: ${summary.modulePath}`);
    moduleLines.push('');
    moduleLines.push(`- Files: ${summary.files}`);
    moduleLines.push(`- Chunks: ${summary.chunks}`);
    moduleLines.push(`- Total size: ${summary.totalBytes} bytes`);
    moduleLines.push('');
    moduleLines.push('## Types');
    moduleLines.push('');
    moduleLines.push('| Type | Count |');
    moduleLines.push('| --- | ---: |');
    moduleLines.push(`| source_code | ${summary.byType.source_code} |`);
    moduleLines.push(`| documentation | ${summary.byType.documentation} |`);
    moduleLines.push(`| config | ${summary.byType.config} |`);
    moduleLines.push(`| data_json | ${summary.byType.data_json} |`);
    moduleLines.push(`| internal_memory | ${summary.byType.internal_memory} |`);
    moduleLines.push(`| other_text | ${summary.byType.other_text} |`);
    moduleLines.push('');
    moduleLines.push('## Languages');
    moduleLines.push('');
    moduleLines.push('| Language | Count |');
    moduleLines.push('| --- | ---: |');

    Object.entries(summary.byLanguage)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .forEach(([language, count]) => {
        moduleLines.push(`| ${language} | ${count} |`);
      });

    moduleLines.push('');
    moduleLines.push('## Top files by chunks');
    moduleLines.push('');
    moduleLines.push('| File | Chunks | Size (bytes) |');
    moduleLines.push('| --- | ---: | ---: |');

    for (const file of summary.topFilesByChunks) {
      moduleLines.push(`| ${file.file} | ${file.chunks} | ${file.size} |`);
    }

    moduleLines.push('');
    fs.writeFileSync(path.join(dir, fileName
```

## knowledge-cli.ts (chunk 10)

```text
moduleLines.push('| --- | ---: | ---: |');

    for (const file of summary.topFilesByChunks) {
      moduleLines.push(`| ${file.file} | ${file.chunks} | ${file.size} |`);
    }

    moduleLines.push('');
    fs.writeFileSync(path.join(dir, fileName), `${moduleLines.join('\n').trim()}\n`, 'utf-8');
  }

  fs.writeFileSync(path.join(dir, 'README.md'), `${overviewLines.join('\n').trim()}\n`, 'utf-8');
  return dir;
}

function createHash(text: string): string {
  return crypto.createHash('sha1').update(text).digest('hex');
}

async function getOptionsFromPrompt(initial: Partial<CliOptions>): Promise<CliOptions> {
  const rl = createInterface({ input, output });

  const targetPrompt = await rl.question(`Caminho do arquivo/pasta alvo [${initial.targetPath ?? ''}]: `);
  const modePrompt = await rl.question(`Modo (chat|rag|both) [${initial.mode ?? DEFAULTS.mode}]: `);
  const chunkPrompt = await rl.question(`Tamanho do chunk em caracteres [${initial.chunkSize ?? DEFAULTS.chunkSize}]: `);
  const overlapPrompt = await rl.question(`Overlap em caracteres [${initial.overlapChars ?? DEFAULTS.overlapChars}]: `);
  const outPrompt = await rl.question(`Pasta base de saida [${initial.outRoot ?? path.resolve(process.cwd(), 'knowledge-exports')}]: `);

  rl.close();

  return {
    targetPath: path.resolve((targetPrompt || initial.targetPath || '').trim()),
    mode: toMode((modePrompt || initial.mode || DEFAULTS.mode).trim()),
    chunkSize: Number(chunkPrompt || initial.chunkSize || DEFAULTS.chunkSize),
    overlapChars: Number(overlapPrompt || initial.overlapChars || DEFAULTS.overlapChars),
    maxFileSizeBytes: initial.maxFileSizeBytes ?? DEFAULTS.maxFileSizeBytes,
    outRoot: path.resolve((outPrompt || initial.outRoot || path.resolve(process.cwd(), 'knowledge-exports')).trim())
```

## knowledge-cli.ts (chunk 11)

```text
rompt || initial.overlapChars || DEFAULTS.overlapChars),
    maxFileSizeBytes: initial.maxFileSizeBytes ?? DEFAULTS.maxFileSizeBytes,
    outRoot: path.resolve((outPrompt || initial.outRoot || path.resolve(process.cwd(), 'knowledge-exports')).trim()),
  };
}

function usage() {
  console.log('Uso: npx tsx scripts/knowledge-cli.ts <path> [--mode=chat|rag|both] [--chunk-size=1800] [--overlap=250] [--max-file-size-mb=2] [--out-root=./knowledge-exports] [--interactive]');
}

async function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2));

  if (flags.has('help')) {
    usage();
    return;
  }

  const partial: Partial<CliOptions> = {
    targetPath: positional[0] ? path.resolve(positional[0]) : undefined,
    mode: toMode(flags.get('mode')),
    chunkSize: Number(flags.get('chunk-size') ?? DEFAULTS.chunkSize),
    overlapChars: Number(flags.get('overlap') ?? DEFAULTS.overlapChars),
    maxFileSizeBytes: Math.max(1, Number(flags.get('max-file-size-mb') ?? 2)) * 1024 * 1024,
    outRoot: flags.get('out-root') ? path.resolve(flags.get('out-root') as string) : path.resolve(process.cwd(), 'knowledge-exports'),
  };

  const interactive = flags.has('interactive') || !partial.targetPath;
  const options = interactive ? await getOptionsFromPrompt(partial) : (partial as CliOptions);

  if (!options.targetPath || !fs.existsSync(options.targetPath)) {
    console.error(`Erro: caminho nao encontrado: ${options.targetPath}`);
    usage();
    process.exitCode = 1;
    return;
  }

  const exportDir = nextExportDir(options.outRoot);
  console.log(`\nExport dir: ${exportDir}`);

  const { files, excluded } = collectFiles(options.targetPath, options.maxFileSizeBytes);
  console.log(`Arquivos incluidos: ${files.length}`);
  console.log(`Arquivos/pastas excluidos:
```

## knowledge-cli.ts (chunk 12)

```text
options.outRoot);
  console.log(`\nExport dir: ${exportDir}`);

  const { files, excluded } = collectFiles(options.targetPath, options.maxFileSizeBytes);
  console.log(`Arquivos incluidos: ${files.length}`);
  console.log(`Arquivos/pastas excluidos: ${excluded.length}`);

  const chunkRecords: ChunkRecord[] = [];
  const perFileSummary: FileSummary[] = [];

  for (const file of files) {
    const text = readFileText(file);
    const chunks = splitChunks(text, options.chunkSize, options.overlapChars);
    const fileType = classifyFile(file.relativePath);
    const language = inferLanguage(file.relativePath);

    chunks.forEach((chunkText, index) => {
      chunkRecords.push({
        id: `${file.relativePath.replace(/[\\/]/g, '_')}-c${index}`,
        source_file: file.relativePath,
        file_type: fileType,
        extension: file.extension,
        language,
        chunk_index: index,
        chars: chunkText.length,
        text: chunkText,
      });
    });

    perFileSummary.push({
      file: file.relativePath,
      type: fileType,
      language,
      chunks: chunks.length,
      size: file.size,
      hash: createHash(text),
    });
  }

  const treeMarkdown = buildTreeMarkdown(files, options.targetPath);
  fs.writeFileSync(path.join(exportDir, 'tree.md'), treeMarkdown, 'utf-8');

  const moduleSummaries = buildModuleSummaries(perFileSummary);
  const moduleSummariesDir = writeModuleSummaries(exportDir, moduleSummaries);

  if (options.mode === 'chat' || options.mode === 'both') {
    const chatMd = buildChatMarkdown(chunkRecords, options.targetPath);
    fs.writeFileSync(path.join(exportDir, 'chat.md'), chatMd, 'utf-8');
  }

  if (options.mode === 'rag' || options.mode === 'both') {
    const jsonl = `${chunkRecords.map((item) => JSON.stringify(item)).j
```

## knowledge-cli.ts (chunk 13)

```text
arkdown(chunkRecords, options.targetPath);
    fs.writeFileSync(path.join(exportDir, 'chat.md'), chatMd, 'utf-8');
  }

  if (options.mode === 'rag' || options.mode === 'both') {
    const jsonl = `${chunkRecords.map((item) => JSON.stringify(item)).join('\n')}\n`;
    fs.writeFileSync(path.join(exportDir, 'rag.jsonl'), jsonl, 'utf-8');
  }

  const manifest = {
    source: options.targetPath,
    generated_at: new Date().toISOString(),
    mode: options.mode,
    settings: {
      chunk_size: options.chunkSize,
      overlap_chars: options.overlapChars,
      max_file_size_bytes: options.maxFileSizeBytes,
    },
    totals: {
      files_included: files.length,
      files_excluded: excluded.length,
      chunks: chunkRecords.length,
      modules: moduleSummaries.length,
    },
    included_files: perFileSummary,
    excluded_entries: excluded,
    generated_files: {
      tree: path.join(exportDir, 'tree.md'),
      module_summaries_dir: moduleSummariesDir,
      chat: options.mode === 'chat' || options.mode === 'both' ? path.join(exportDir, 'chat.md') : null,
      rag: options.mode === 'rag' || options.mode === 'both' ? path.join(exportDir, 'rag.jsonl') : null,
    },
  };

  fs.writeFileSync(path.join(exportDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');

  console.log(`Chunks gerados: ${chunkRecords.length}`);
  console.log('Arquivos gerados:');
  if (options.mode === 'chat' || options.mode === 'both') {
    console.log(`- ${path.join(exportDir, 'chat.md')}`);
  }
  if (options.mode === 'rag' || options.mode === 'both') {
    console.log(`- ${path.join(exportDir, 'rag.jsonl')}`);
  }
  console.log(`- ${path.join(exportDir, 'tree.md')}`);
  console.log(`- ${moduleSummariesDir}`);
  console.log(`- ${path.join(exportDir, 'manifest.json')}`)
```

## knowledge-cli.ts (chunk 14)

```text
|| options.mode === 'both') {
    console.log(`- ${path.join(exportDir, 'rag.jsonl')}`);
  }
  console.log(`- ${path.join(exportDir, 'tree.md')}`);
  console.log(`- ${moduleSummariesDir}`);
  console.log(`- ${path.join(exportDir, 'manifest.json')}`);
}

main().catch((error) => {
  console.error('Falha ao gerar pacote de conhecimento:', error);
  process.exitCode = 1;
});
```

## knowledge-manager.ts (chunk 1)

```text
import "dotenv/config";
import path from "node:path";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import { asc, eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { invokeLLM } from "../server/_core/llm";
import { addMemoryEntry, getDb } from "../server/db";
import { extractText } from "../server/rag";

type Profile =
  | "auto"
  | "general"
  | "tech_ai"
  | "programming"
  | "robotics_n8n"
  | "juridico"
  | "economia_geopolitica";

type JobStatus = "new" | "processing" | "completed" | "skipped" | "failed";

type JobRecord = {
  jobId: string;
  logicalId: string;
  sourcePath: string;
  fileHash: string;
  profile: Exclude<Profile, "auto">;
  status: JobStatus;
  progress: number;
  supersedesJobId?: string;
  supersededByJobId?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
};

type ManagerManifest = {
  version: string;
  jobs: Record<string, JobRecord>;
  logicalIndex: Record<string, string>;
  hashIndex: Record<string, string>;
};

type KnowledgePacket = {
  titulo: string;
  descricao: string;
  temaPrincipal: string;
  assuntosAbordados: string[];
  pontosChave: string[];
  perguntasAprofundamento: string[];
  claimsParaVerificacao: Array<{
    claim: string;
    dadoFaltante: string;
    fonteSugerida: string;
  }>;
  leisOuNormasCitadas: Array<{
    referencia: string;
    contexto: string;
    pendencia: string;
  }>;
  pendencias: string[];
  palavrasChave: string[];
  documentoPtBr: string;
  proximosPassos: string[];
};

const PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(PROJECT_ROOT, "..", `${path.basename(PROJECT_ROOT)}-dados`);
const DEFAULT_INPUT_DIR = path.join(DEFAULT_DATA_DIR, "Drive_Sync", "conhecimentos-sobre-AVA");
const DEFAULT_MANAGER_
```

## knowledge-manager.ts (chunk 2)

```text
st PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(PROJECT_ROOT, "..", `${path.basename(PROJECT_ROOT)}-dados`);
const DEFAULT_INPUT_DIR = path.join(DEFAULT_DATA_DIR, "Drive_Sync", "conhecimentos-sobre-AVA");
const DEFAULT_MANAGER_DIR = path.join(DEFAULT_DATA_DIR, ".rag", "knowledge-manager");
const DEFAULT_MANIFEST = path.join(DEFAULT_MANAGER_DIR, "manifest.json");
const DEFAULT_REPORT = path.join(DEFAULT_MANAGER_DIR, "latest-report.md");

const SUPPORTED_EXTENSIONS = new Set([".txt", ".md", ".pdf"]);

function parseArgs() {
  const args = process.argv.slice(2);
  const values: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i += 1) {
    const token = ***REDACTED***
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith("--")) {
      values[key] = true;
    } else {
      values[key] = next;
      i += 1;
    }
  }

  const profileRaw = String(values.profile || "auto") as Profile;
  const profile: Profile = [
    "auto",
    "general",
    "tech_ai",
    "programming",
    "robotics_n8n",
    "juridico",
    "economia_geopolitica",
  ].includes(profileRaw)
    ? profileRaw
    : "auto";

  return {
    filePath: typeof values.file === "string" ? path.resolve(values.file) : "",
    inputDir: typeof values["input-dir"] === "string" ? path.resolve(values["input-dir"]) : DEFAULT_INPUT_DIR,
    managerDir: typeof values["manager-dir"] === "string" ? path.resolve(values["manager-dir"]) : DEFAULT_MANAGER_DIR,
    manifestPath: typeof values.manifest === "string" ? path.resolve(values.manifest) : DEFAULT_MANIFEST,
    reportPath: typeof values.report === "string" ? path.resolve(values.report) : DEFAULT_REPORT,
    userId: typeof values["user-id"] =
```

## knowledge-manager.ts (chunk 3)

```text
ER_DIR,
    manifestPath: typeof values.manifest === "string" ? path.resolve(values.manifest) : DEFAULT_MANIFEST,
    reportPath: typeof values.report === "string" ? path.resolve(values.report) : DEFAULT_REPORT,
    userId: typeof values["user-id"] === "string" ? Number(values["user-id"]) : undefined,
    provider: (String(values.provider || "ollama") === "forge" ? "forge" : "ollama") as "ollama" | "forge",
    model: typeof values.model === "string" ? values.model : "qwen2.5:7b-instruct",
    profile,
    maxFilesPerRun: typeof values["max-files"] === "string" ? Math.max(1, Number(values["max-files"])) : 2,
    dryRun: values["dry-run"] === true,
    watch: values.watch === true,
    intervalSec: typeof values["interval-sec"] === "string" ? Math.max(30, Number(values["interval-sec"])) : 300,
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

function sha256(input: string | Buffer): string {
  return createHash("sha256").update(input).digest("hex");
}

function toPosix(p: string): string {
  return p.replace(/\\/g, "/");
}

function decodeTextBuffer(buffer: Buffer): string {
  const utf8 = buffer.toString("utf-8");
  const utf8Clean = utf8.replace(/\u0000/g, "").trim();
  if (utf8Clean.length > 0) return utf8;
  const latin1 = buffer.toString("latin1");
  const latin1Clean = latin1.replace(/\u0000/g, "").trim();
  if (latin1Clean.length > 0) return latin1;
  return "";
}

function normalizeText(input: string): string {
  return input.replace(/\u0000/g, " ").replace(/\s+/g, " ").trim();
}

function logicalIdFromPath(filePath: string): string {
  return path
    .basename(filePath, path.extname(filePath))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .rep
```

## knowledge-manager.ts (chunk 4)

```text
calIdFromPath(filePath: string): string {
  return path
    .basename(filePath, path.extname(filePath))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function guessProfile(content: string, fileName: string): Exclude<Profile, "auto"> {
  const sample = `${fileName} ${content.slice(0, 5000)}`.toLowerCase();

  const has = (patterns: string[]) => patterns.some((p) => sample.includes(p));

  if (has(["python", "javascript", "typescript", "benchmark", "cpu", "latencia", "performance"])) {
    return "programming";
  }
  if (has(["arduino", "esp32", "sensor", "robot", "n8n", "automacao", "iot"])) {
    return "robotics_n8n";
  }
  if (has(["llm", "modelo", "inteligencia artificial", "embedding", "prompt", "rag"])) {
    return "tech_ai";
  }
  if (has(["lei", "art.", "jurisprud", "tribunal", "processo", "acordao"])) {
    return "juridico";
  }
  if (has(["pib", "inflacao", "guerra", "geopolitica", "fmi", "otan", "comercio", "tarifa"])) {
    return "economia_geopolitica";
  }
  return "general";
}

function profileInstruction(profile: Exclude<Profile, "auto">): string {
  const shared =
    "Sempre responder em PT-BR. Se houver lacunas de dados, criar pendencias acionaveis com fonte sugerida.";
  if (profile === "tech_ai") {
    return `${shared} Priorize arquitetura, limitações, riscos, métricas e comparações de modelo.`;
  }
  if (profile === "programming") {
    return `${shared} Priorize stack, design, trade-offs, benchmark e próximos experimentos.`;
  }
  if (profile === "robotics_n8n") {
    return `${shared} Priorize fluxo, integrações, hardware, segurança operacional e testes de campo.`;
  }
  if (profile === "juridico") {
    return `${shared}
```

## knowledge-manager.ts (chunk 5)

```text
trade-offs, benchmark e próximos experimentos.`;
  }
  if (profile === "robotics_n8n") {
    return `${shared} Priorize fluxo, integrações, hardware, segurança operacional e testes de campo.`;
  }
  if (profile === "juridico") {
    return `${shared} Priorize base normativa, validade temporal, jurisprudência e riscos de interpretação.`;
  }
  if (profile === "economia_geopolitica") {
    return `${shared} Priorize séries históricas, contexto internacional, causalidade e fontes oficiais.`;
  }
  return `${shared} Faça síntese clara, sem perder contexto.`;
}

async function resolveUserId(cliUserId?: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponivel.");

  if (cliUserId) {
    const found = await db.select().from(users).where(eq(users.id, cliUserId)).limit(1);
    if (!found[0]) throw new Error(`Usuario ${cliUserId} nao encontrado.`);
    return cliUserId;
  }

  const first = await db.select().from(users).orderBy(asc(users.id)).limit(1);
  if (!first[0]) throw new Error("Nenhum usuario encontrado no banco.");
  return first[0].id;
}

async function loadManifest(filePath: string): Promise<ManagerManifest> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as ManagerManifest;
    if (parsed && parsed.jobs && parsed.logicalIndex && parsed.hashIndex) return parsed;
  } catch {
    // ignore
  }
  return {
    version: "1.0",
    jobs: {},
    logicalIndex: {},
    hashIndex: {},
  };
}

async function saveManifest(filePath: string, manifest: ManagerManifest): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(manifest, null, 2), "utf-8");
}

async function findCandidateFiles(rootDir: string): Pro
```

## knowledge-manager.ts (chunk 6)

```text
string, manifest: ManagerManifest): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(manifest, null, 2), "utf-8");
}

async function findCandidateFiles(rootDir: string): Promise<string[]> {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue;
    out.push(path.join(rootDir, e.name));
  }
  return out.sort((a, b) => a.localeCompare(b));
}

async function extractRawText(filePath: string, buffer: Buffer): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".txt" || ext === ".md") return decodeTextBuffer(buffer);
  if (ext === ".pdf") return extractText(path.basename(filePath), "application/pdf", buffer);
  return decodeTextBuffer(buffer);
}

function safeArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.map((x) => String(x || "").trim()).filter(Boolean);
}

function safeClaims(input: unknown): KnowledgePacket["claimsParaVerificacao"] {
  if (!Array.isArray(input)) return [];
  return input
    .map((x: any) => ({
      claim: String(x?.claim || "").trim(),
      dadoFaltante: String(x?.dadoFaltante || x?.missingData || "").trim(),
      fonteSugerida: String(x?.fonteSugerida || x?.suggestedSource || "").trim(),
    }))
    .filter((c) => c.claim);
}

function safeLaws(input: unknown): KnowledgePacket["leisOuNormasCitadas"] {
  if (!Array.isArray(input)) return [];
  return input
    .map((x: any) => ({
      referencia: String(x?.referencia || x?.law || "").trim(),
      contexto: String(x?.contexto || x?.context || "").tri
```

## knowledge-manager.ts (chunk 7)

```text
nown): KnowledgePacket["leisOuNormasCitadas"] {
  if (!Array.isArray(input)) return [];
  return input
    .map((x: any) => ({
      referencia: String(x?.referencia || x?.law || "").trim(),
      contexto: String(x?.contexto || x?.context || "").trim(),
      pendencia: String(x?.pendencia || x?.action || "").trim(),
    }))
    .filter((l) => l.referencia || l.contexto || l.pendencia);
}

function buildHeuristicPacket(fileName: string, text: string, profile: Exclude<Profile, "auto">): KnowledgePacket {
  const clean = normalizeText(text);
  const words = clean
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s_-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);
  const counts = new Map<string, number>();
  for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([w]) => w);

  const preview = clean.slice(0, 1800);
  return {
    titulo: path.basename(fileName, path.extname(fileName)),
    descricao: "Pacote gerado por fallback heuristico (LLM indisponivel/timeout).",
    temaPrincipal: profile,
    assuntosAbordados: top.slice(0, 8),
    pontosChave: [
      "Conteudo coletado e normalizado para memoria.",
      "Necessario reprocessar com LLM para analise profunda quando houver disponibilidade.",
    ],
    perguntasAprofundamento: [
      "Quais dados comparativos faltam para validar as afirmacoes?",
      "Quais fontes oficiais devem ser consultadas para consolidar o tema?",
    ],
    claimsParaVerificacao: [
      {
        claim: "Existem afirmacoes que exigem verificacao detalhada.",
        dadoFaltante: "Series historicas, numeros e referencias primarias.",
        fonteSugerida: "Bases oficiai
```

## knowledge-manager.ts (chunk 8)

```text
consolidar o tema?",
    ],
    claimsParaVerificacao: [
      {
        claim: "Existem afirmacoes que exigem verificacao detalhada.",
        dadoFaltante: "Series historicas, numeros e referencias primarias.",
        fonteSugerida: "Bases oficiais e documentos primarios do tema.",
      },
    ],
    leisOuNormasCitadas: [],
    pendencias: [
      "Executar novamente com LLM para enriquecer analise semantica.",
      "Validar claims e preencher fontes faltantes.",
    ],
    palavrasChave: top,
    documentoPtBr: preview,
    proximosPassos: [
      "Reprocessar quando o modelo local responder dentro do timeout.",
      "Comparar pendencias com novas fontes adicionadas.",
    ],
  };
}

async function buildKnowledgePacket(
  fileName: string,
  text: string,
  profile: Exclude<Profile, "auto">,
  provider: "ollama" | "forge",
  model: string
): Promise<KnowledgePacket> {
  const modelFallbacks = provider === "ollama" ? [model, "llama3.2:3b"] : [model];

  const prompt = [
    "Voce e um organizador de memoria para estudo continuo.",
    "Retorne APENAS JSON valido em PT-BR, sem markdown fora do JSON.",
    profileInstruction(profile),
    "Campos obrigatorios:",
    "titulo, descricao, temaPrincipal, assuntosAbordados[], pontosChave[], perguntasAprofundamento[],",
    "claimsParaVerificacao[{claim,dadoFaltante,fonteSugerida}],",
    "leisOuNormasCitadas[{referencia,contexto,pendencia}],",
    "pendencias[], palavrasChave[], documentoPtBr, proximosPassos[].",
    "Regra de qualidade:",
    "- Se houver indicador sem comparativo temporal, criar pendencia.",
    "- Se houver citação de lei/norma sem detalhes, criar pendencia de busca.",
    "- documentoPtBr deve ser claro, organizado e didatico.",
    `Arquivo: ${fileName}`,
    "Conteudo fonte:",
    text.slice(0, 18
```

## knowledge-manager.ts (chunk 9)

```text
arativo temporal, criar pendencia.",
    "- Se houver citação de lei/norma sem detalhes, criar pendencia de busca.",
    "- documentoPtBr deve ser claro, organizado e didatico.",
    `Arquivo: ${fileName}`,
    "Conteudo fonte:",
    text.slice(0, 18000),
  ].join("\n");

  let result: Awaited<ReturnType<typeof invokeLLM>> | null = null;
  let lastError: unknown;

  for (const candidate of modelFallbacks) {
    try {
      result = await invokeLLM({
        provider,
        model: candidate,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        timeoutMs: 45000,
      });
      break;
    } catch (error) {
      lastError = error;
      const msg = String((error as any)?.message || error || "");
      console.warn(`[KnowledgeManager] Modelo ${candidate} falhou: ${msg}`);
    }
  }

  if (!result) {
    console.warn("[KnowledgeManager] Usando fallback heuristico por indisponibilidade de LLM.");
    return buildHeuristicPacket(fileName, text, profile);
  }

  const llmContent = result.choices?.[0]?.message?.content;
  const asText = typeof llmContent === "string" ? llmContent : JSON.stringify(llmContent || {});
  const parsed = JSON.parse(asText || "{}");

  const packet: KnowledgePacket = {
    titulo: String(parsed.titulo || fileName),
    descricao: String(parsed.descricao || ""),
    temaPrincipal: String(parsed.temaPrincipal || ""),
    assuntosAbordados: safeArray(parsed.assuntosAbordados),
    pontosChave: safeArray(parsed.pontosChave),
    perguntasAprofundamento: safeArray(parsed.perguntasAprofundamento),
    claimsParaVerificacao: safeClaims(parsed.claimsParaVerificacao),
    leisOuNormasCitadas: safeLaws(parsed.leisOuNormasCitadas),
    pendencias: safeArray(parsed.pendencias),
    palavrasChave: safeA
```

## knowledge-manager.ts (chunk 10)

```text
nto: safeArray(parsed.perguntasAprofundamento),
    claimsParaVerificacao: safeClaims(parsed.claimsParaVerificacao),
    leisOuNormasCitadas: safeLaws(parsed.leisOuNormasCitadas),
    pendencias: safeArray(parsed.pendencias),
    palavrasChave: safeArray(parsed.palavrasChave),
    documentoPtBr: String(parsed.documentoPtBr || "").trim(),
    proximosPassos: safeArray(parsed.proximosPassos),
  };

  if (!packet.documentoPtBr) {
    packet.documentoPtBr = [
      `Titulo: ${packet.titulo}`,
      `Tema principal: ${packet.temaPrincipal || "nao informado"}`,
      `Descricao: ${packet.descricao || "nao informada"}`,
      `Assuntos: ${packet.assuntosAbordados.join(", ") || "nao identificados"}`,
      "Pontos-chave:",
      ...packet.pontosChave.map((p) => `- ${p}`),
    ].join("\n");
  }

  return packet;
}

function packetToMarkdown(packet: KnowledgePacket, sourcePath: string, profile: string): string {
  const out: string[] = [];
  out.push(`# ${packet.titulo}`);
  out.push("");
  out.push(`Fonte: ${sourcePath}`);
  out.push(`Perfil: ${profile}`);
  out.push("");
  out.push("## Descricao");
  out.push(packet.descricao || "(sem descricao)");
  out.push("");
  out.push("## Tema Principal");
  out.push(packet.temaPrincipal || "(nao identificado)");
  out.push("");
  out.push("## Assuntos Abordados");
  for (const a of packet.assuntosAbordados) out.push(`- ${a}`);
  out.push("");
  out.push("## Pontos-Chave");
  for (const p of packet.pontosChave) out.push(`- ${p}`);
  out.push("");
  out.push("## Perguntas para Aprofundamento");
  for (const q of packet.perguntasAprofundamento) out.push(`- ${q}`);
  out.push("");
  out.push("## Claims para Verificacao");
  for (const c of packet.claimsParaVerificacao) {
    out.push(`- Claim: ${c.claim}`);
    out.push(`  - Dado faltante:
```

## knowledge-manager.ts (chunk 11)

```text
;
  for (const q of packet.perguntasAprofundamento) out.push(`- ${q}`);
  out.push("");
  out.push("## Claims para Verificacao");
  for (const c of packet.claimsParaVerificacao) {
    out.push(`- Claim: ${c.claim}`);
    out.push(`  - Dado faltante: ${c.dadoFaltante}`);
    out.push(`  - Fonte sugerida: ${c.fonteSugerida}`);
  }
  out.push("");
  out.push("## Leis/Normas Citadas");
  for (const l of packet.leisOuNormasCitadas) {
    out.push(`- Referencia: ${l.referencia}`);
    out.push(`  - Contexto: ${l.contexto}`);
    out.push(`  - Pendencia: ${l.pendencia}`);
  }
  out.push("");
  out.push("## Pendencias");
  for (const p of packet.pendencias) out.push(`- ${p}`);
  out.push("");
  out.push("## Documento PT-BR (Organizado)");
  out.push(packet.documentoPtBr);
  out.push("");
  out.push("## Proximos Passos");
  for (const p of packet.proximosPassos) out.push(`- ${p}`);
  return out.join("\n");
}

async function moveToProcessed(filePath: string, managerDir: string): Promise<string> {
  const processedDir = path.join(managerDir, "processed");
  await fs.mkdir(processedDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const target = path.join(processedDir, `${stamp}__${path.basename(filePath)}`);
  await fs.rename(filePath, target);
  return target;
}

async function writeRunReport(reportPath: string, lines: string[]): Promise<void> {
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, lines.join("\n"), "utf-8");
}

async function runCycle(args: ReturnType<typeof parseArgs>) {
  process.env.LLM_PROVIDER = args.provider;
  process.env.EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "nomic-embed-text:latest";

  const userId = await resolveUserId(args.userId);
  const inputStat = aw
```

## knowledge-manager.ts (chunk 12)

```text
cle(args: ReturnType<typeof parseArgs>) {
  process.env.LLM_PROVIDER = args.provider;
  process.env.EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "nomic-embed-text:latest";

  const userId = await resolveUserId(args.userId);
  const inputStat = await fs.stat(args.inputDir).catch(() => null);
  if (!inputStat || !inputStat.isDirectory()) {
    throw new Error(`Pasta de entrada nao encontrada: ${args.inputDir}`);
  }

  if (args.filePath) {
    const fileStat = await fs.stat(args.filePath).catch(() => null);
    if (!fileStat || !fileStat.isFile()) {
      throw new Error(`Arquivo especificado nao encontrado: ${args.filePath}`);
    }
    const ext = path.extname(args.filePath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) {
      throw new Error(`Extensao nao suportada para --file: ${ext}`);
    }
  }

  await fs.mkdir(args.managerDir, { recursive: true });
  const manifest = await loadManifest(args.manifestPath);
  const candidates = args.filePath ? [args.filePath] : await findCandidateFiles(args.inputDir);

  const report: string[] = [];
  report.push(`# Run Report - Knowledge Manager`);
  report.push(``);
  report.push(`- Inicio: ${nowIso()}`);
  report.push(`- Pasta de entrada: ${args.inputDir}`);
  report.push(`- Modelo: ${args.model}`);
  report.push(`- Provider: ${args.provider}`);
  report.push(`- Dry run: ${args.dryRun ? "sim" : "nao"}`);
  report.push(`- Candidatos detectados: ${candidates.length}`);
  report.push(``);

  let handled = 0;
  let completed = 0;
  let skipped = 0;
  let failed = 0;

  for (const filePath of candidates) {
    if (handled >= args.maxFilesPerRun) break;
    handled += 1;

    const rel = args.filePath
      ? toPosix(path.basename(filePath))
      : toPosix(path.relative(args.inputDir, filePath));
    const logicalId = lo
```

## knowledge-manager.ts (chunk 13)

```text
const filePath of candidates) {
    if (handled >= args.maxFilesPerRun) break;
    handled += 1;

    const rel = args.filePath
      ? toPosix(path.basename(filePath))
      : toPosix(path.relative(args.inputDir, filePath));
    const logicalId = logicalIdFromPath(rel);
    const buffer = await fs.readFile(filePath);
    const fileHash = sha256(buffer);

    if (manifest.hashIndex[fileHash]) {
      skipped += 1;
      report.push(`- SKIP: ${rel} (hash ja processado em ${manifest.hashIndex[fileHash]})`);
      continue;
    }

    const previousLatest = manifest.logicalIndex[logicalId];
    const jobId = `${logicalId}:${fileHash.slice(0, 12)}`;
    const selectedProfile = args.profile === "auto" ? "general" : args.profile;

    manifest.jobs[jobId] = {
      jobId,
      logicalId,
      sourcePath: rel,
      fileHash,
      profile: selectedProfile,
      status: "processing",
      progress: 5,
      supersedesJobId: previousLatest || undefined,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    if (previousLatest && manifest.jobs[previousLatest]) {
      manifest.jobs[previousLatest].supersededByJobId = jobId;
      manifest.jobs[previousLatest].updatedAt = nowIso();
    }
    manifest.logicalIndex[logicalId] = jobId;
    await saveManifest(args.manifestPath, manifest);

    try {
      const extracted = await extractRawText(filePath, buffer);
      const normalized = normalizeText(extracted);
      if (!normalized) {
        throw new Error("Sem texto util apos extracao");
      }
      manifest.jobs[jobId].progress = 30;
      await saveManifest(args.manifestPath, manifest);

      const effectiveProfile =
        args.profile === "auto" ? guessProfile(normalized, path.basename(filePath)) : (args.profile as Exclude<Profile, "auto">);
      manifest.
```

## knowledge-manager.ts (chunk 14)

```text
d].progress = 30;
      await saveManifest(args.manifestPath, manifest);

      const effectiveProfile =
        args.profile === "auto" ? guessProfile(normalized, path.basename(filePath)) : (args.profile as Exclude<Profile, "auto">);
      manifest.jobs[jobId].profile = effectiveProfile;

      const packet = await buildKnowledgePacket(path.basename(filePath), normalized, effectiveProfile, args.provider, args.model);
      manifest.jobs[jobId].progress = 70;
      await saveManifest(args.manifestPath, manifest);

      const outBase = path.basename(filePath, path.extname(filePath));
      const outputDir = path.join(args.managerDir, "outputs");
      await fs.mkdir(outputDir, { recursive: true });
      const jsonOut = path.join(outputDir, `${outBase}.${fileHash.slice(0, 8)}.knowledge.json`);
      const mdOut = path.join(outputDir, `${outBase}.${fileHash.slice(0, 8)}.knowledge.md`);
      await fs.writeFile(jsonOut, JSON.stringify(packet, null, 2), "utf-8");
      await fs.writeFile(mdOut, packetToMarkdown(packet, rel, effectiveProfile), "utf-8");

      if (!args.dryRun) {
        const mainMemory = [
          `[KNOWLEDGE] ${packet.titulo}`,
          `Tema principal: ${packet.temaPrincipal}`,
          `Descricao: ${packet.descricao}`,
          `Assuntos: ${packet.assuntosAbordados.join(", ")}`,
          `Pontos-chave: ${packet.pontosChave.join(" | ")}`,
        ].join("\n");

        const pendingMemory = [
          `[KNOWLEDGE][PENDENCIAS] ${packet.titulo}`,
          ...packet.pendencias.map((p) => `- ${p}`),
          ...packet.claimsParaVerificacao.map((c) => `- Verificar: ${c.claim} | faltante: ${c.dadoFaltante}`),
          ...packet.leisOuNormasCitadas.map((l) => `- Norma: ${l.referencia} | pendencia: ${l.pendencia}`),
        ].join("\n");

        awai
```

## knowledge-manager.ts (chunk 15)

```text
...packet.claimsParaVerificacao.map((c) => `- Verificar: ${c.claim} | faltante: ${c.dadoFaltante}`),
          ...packet.leisOuNormasCitadas.map((l) => `- Norma: ${l.referencia} | pendencia: ${l.pendencia}`),
        ].join("\n");

        await addMemoryEntry(userId, mainMemory, packet.palavrasChave.join(", ") || "knowledge, estudo", "context");
        await addMemoryEntry(userId, pendingMemory, "pendencia, verificacao, aprofundamento", "context");
      }

      const movedPath = args.dryRun ? "(dry-run: arquivo nao movido)" : await moveToProcessed(filePath, args.managerDir);

      manifest.jobs[jobId].status = "completed";
      manifest.jobs[jobId].progress = 100;
      manifest.jobs[jobId].updatedAt = nowIso();
      manifest.hashIndex[fileHash] = jobId;
      await saveManifest(args.manifestPath, manifest);

      completed += 1;
      report.push(`- OK: ${rel}`);
      report.push(`  - Perfil: ${effectiveProfile}`);
      report.push(`  - JSON: ${jsonOut}`);
      report.push(`  - MD: ${mdOut}`);
      report.push(`  - Arquivo origem: ${movedPath}`);
    } catch (error: any) {
      failed += 1;
      manifest.jobs[jobId].status = "failed";
      manifest.jobs[jobId].error = error?.message || "erro desconhecido";
      manifest.jobs[jobId].updatedAt = nowIso();
      await saveManifest(args.manifestPath, manifest);

      report.push(`- FAIL: ${rel}`);
      report.push(`  - Erro: ${manifest.jobs[jobId].error}`);
    }
  }

  report.push("");
  report.push("## Resumo");
  report.push(`- Processados nesta rodada: ${handled}`);
  report.push(`- Concluidos: ${completed}`);
  report.push(`- Ignorados: ${skipped}`);
  report.push(`- Falhas: ${failed}`);
  report.push(`- Proximo passo: rode novamente para continuar, ou use --watch para automacao continua.`);
```

## knowledge-manager.ts (chunk 16)

```text
a: ${handled}`);
  report.push(`- Concluidos: ${completed}`);
  report.push(`- Ignorados: ${skipped}`);
  report.push(`- Falhas: ${failed}`);
  report.push(`- Proximo passo: rode novamente para continuar, ou use --watch para automacao continua.`);

  await writeRunReport(args.reportPath, report);
  console.log(`[KnowledgeManager] Concluido. Report: ${args.reportPath}`);
}

async function run() {
  const args = parseArgs();

  if (!args.watch) {
    await runCycle(args);
    return;
  }

  console.log(`[KnowledgeManager] Watch ativo. Intervalo: ${args.intervalSec}s`);
  while (true) {
    try {
      await runCycle(args);
    } catch (error) {
      console.error("[KnowledgeManager] Falha na rodada:", error);
    }
    await new Promise((resolve) => setTimeout(resolve, args.intervalSec * 1000));
  }
}

run().catch((error) => {
  console.error("[KnowledgeManager] Falha fatal:", error);
  process.exitCode = 1;
});
```

## memory-pipeline.ts (chunk 1)

```text
import "dotenv/config";
import path from "node:path";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import { asc, eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { addMemoryEntry, getDb } from "../server/db";
import { generateEmbedding } from "../server/_core/llm";
import { chunkText, extractText } from "../server/rag";

type Phase = "embed" | "import" | "all";

type PipelineFileState = {
  sourcePath: string;
  fileHash: string;
  outputFile: string;
  totalChunks: number;
  embeddedChunks: number;
  importedChunks: number;
  nextChunkIndex: number;
  nextImportIndex: number;
  status: "pending" | "partial" | "embedded" | "imported" | "failed";
  updatedAt: string;
  error?: string;
};

type EmbeddingItem = {
  id: string;
  sourcePath: string;
  chunkIndex: number;
  chunkHash: string;
  content: string;
  embedding: number[];
};

type EmbeddingFile = {
  sourcePath: string;
  fileHash: string;
  model: string;
  provider: "ollama" | "forge";
  totalChunks: number;
  items: EmbeddingItem[];
};

type Manifest = {
  version: string;
  files: Record<string, PipelineFileState>;
};

const PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(PROJECT_ROOT, "..", `${path.basename(PROJECT_ROOT)}-dados`);
const DEFAULT_INPUT_DIR = path.join(DEFAULT_DATA_DIR, "Drive_Sync", "conhecimentos-sobre-AVA");
const DEFAULT_PIPELINE_DIR = path.join(DEFAULT_DATA_DIR, ".rag", "memory-pipeline");
const DEFAULT_EMBEDDINGS_DIR = path.join(DEFAULT_PIPELINE_DIR, "embeddings");
const DEFAULT_MANIFEST_PATH = path.join(DEFAULT_PIPELINE_DIR, "manifest.json");

const SUPPORTED_EXTENSIONS = new Set([".md", ".txt", ".pdf"]);

function parseArgs() {
  const args = process.argv.slice(2);
  const values: Record<string, string
```

## memory-pipeline.ts (chunk 2)

```text
gs");
const DEFAULT_MANIFEST_PATH = path.join(DEFAULT_PIPELINE_DIR, "manifest.json");

const SUPPORTED_EXTENSIONS = new Set([".md", ".txt", ".pdf"]);

function parseArgs() {
  const args = process.argv.slice(2);
  const values: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i += 1) {
    const token = ***REDACTED***
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith("--")) {
      values[key] = true;
    } else {
      values[key] = next;
      i += 1;
    }
  }

  const phaseRaw = String(values["phase"] || "all").toLowerCase();
  const phase: Phase = phaseRaw === "embed" || phaseRaw === "import" || phaseRaw === "all" ? phaseRaw : "all";

  return {
    phase,
    userId: typeof values["user-id"] === "string" ? Number(values["user-id"]) : undefined,
    inputDir: typeof values["input-dir"] === "string" ? path.resolve(values["input-dir"]) : DEFAULT_INPUT_DIR,
    pipelineDir: typeof values["pipeline-dir"] === "string" ? path.resolve(values["pipeline-dir"]) : DEFAULT_PIPELINE_DIR,
    batchSize: typeof values["batch-size"] === "string" ? Math.max(1, Number(values["batch-size"])) : 8,
    maxChunksPerRun:
      typeof values["max-chunks-per-run"] === "string" ? Math.max(1, Number(values["max-chunks-per-run"])) : 0,
    maxImportsPerRun:
      typeof values["max-imports-per-run"] === "string" ? Math.max(1, Number(values["max-imports-per-run"])) : 0,
    embeddingProvider: (String(values["embedding-provider"] || "ollama").toLowerCase() === "forge"
      ? "forge"
      : "ollama") as "ollama" | "forge",
    embeddingModel:
      typeof values["embedding-model"] === "string"
        ? values["embedding-model"]
        : process.env.EMBEDDING_MODEL || "nomic-embed
```

## memory-pipeline.ts (chunk 3)

```text
ama").toLowerCase() === "forge"
      ? "forge"
      : "ollama") as "ollama" | "forge",
    embeddingModel:
      typeof values["embedding-model"] === "string"
        ? values["embedding-model"]
        : process.env.EMBEDDING_MODEL || "nomic-embed-text:latest",
    dryRun: values["dry-run"] === true,
  };
}

function sha256(buffer: Buffer | string): string {
  return createHash("sha256").update(buffer).digest("hex");
}

function toPosix(p: string): string {
  return p.replace(/\\/g, "/");
}

function mimeTypeFromExt(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".md") return "text/markdown";
  if (ext === ".txt") return "text/plain";
  if (ext === ".pdf") return "application/pdf";
  return "application/octet-stream";
}

function buildOutputFileName(sourcePath: string): string {
  const sourceHash = sha256(sourcePath).slice(0, 16);
  const safeName = path.basename(sourcePath).replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `${safeName}.${sourceHash}.embeddings.json`;
}

async function resolveUserId(cliUserId?: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponivel.");

  if (cliUserId) {
    const found = await db.select().from(users).where(eq(users.id, cliUserId)).limit(1);
    if (!found[0]) throw new Error(`Usuario ${cliUserId} nao encontrado.`);
    return cliUserId;
  }

  const first = await db.select().from(users).orderBy(asc(users.id)).limit(1);
  if (!first[0]) throw new Error("Nenhum usuario encontrado no banco.");
  return first[0].id;
}

async function listFilesRecursive(rootDir: string): Promise<string[]> {
  const out: string[] = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const entries = await fs.read
```

## memory-pipeline.ts (chunk 4)

```text
return first[0].id;
}

async function listFilesRecursive(rootDir: string): Promise<string[]> {
  const out: string[] = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const entries = await fs.readdir(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        out.push(fullPath);
      }
    }
  }

  return out.sort((a, b) => a.localeCompare(b));
}

async function loadManifest(filePath: string): Promise<Manifest> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Manifest;
    if (parsed && parsed.files) return parsed;
  } catch {
    // ignore
  }
  return { version: "1.0", files: {} };
}

async function saveManifest(filePath: string, manifest: Manifest): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(manifest, null, 2), "utf-8");
}

async function loadEmbeddingFile(filePath: string, fallback: EmbeddingFile): Promise<EmbeddingFile> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as EmbeddingFile;
    if (Array.isArray(parsed.items)) return parsed;
  } catch {
    // ignore
  }
  return fallback;
}

async function saveEmbeddingFile(filePath: string, content: EmbeddingFile): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), "utf-8");
}

function buildMemoryKeywords(sourcePath: string, chunkT
```

## memory-pipeline.ts (chunk 5)

```text
ath: string, content: EmbeddingFile): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), "utf-8");
}

function buildMemoryKeywords(sourcePath: string, chunkTextValue: string): string {
  const base = path.basename(sourcePath, path.extname(sourcePath)).toLowerCase();
  const tokens = (base + " " + chunkTextValue.slice(0, 180))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s_-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);
  const counts = new Map<string, number>();
  for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1);
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w);
  return [...new Set(["pipeline", "rag", ...top])].join(", ");
}

function decodeTextBuffer(buffer: Buffer): string {
  const utf8 = buffer.toString("utf-8");
  const utf8Clean = utf8.replace(/\u0000/g, "").trim();
  if (utf8Clean.length > 0) return utf8;

  const latin1 = buffer.toString("latin1");
  const latin1Clean = latin1.replace(/\u0000/g, "").trim();
  if (latin1Clean.length > 0) return latin1;

  return "";
}

async function extractTextForPipeline(filePath: string, fileBuffer: Buffer): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".txt" || ext === ".md") {
    return decodeTextBuffer(fileBuffer);
  }

  const mimeType = mimeTypeFromExt(filePath);
  return extractText(path.basename(filePath), mimeType, fileBuffer);
}

async function generateEmbeddingWithRetry(
  text: string,
  provider: "ollama" | "forge",
  maxAttempts = 3
): Promise<number[]> {
  let lastError: unknown;
  let currentText = text;

  for (let attempt = 1; attempt <= maxA
```

## memory-pipeline.ts (chunk 6)

```text
mimeType, fileBuffer);
}

async function generateEmbeddingWithRetry(
  text: string,
  provider: "ollama" | "forge",
  maxAttempts = 3
): Promise<number[]> {
  let lastError: unknown;
  let currentText = text;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await generateEmbedding(currentText, provider);
    } catch (error: any) {
      lastError = error;
      const message = String(error?.message || error || "").toLowerCase();
      const isAbort = message.includes("aborted") || message.includes("aborterror");

      if (isAbort && currentText.length > 4000) {
        currentText = currentText.slice(0, Math.floor(currentText.length * 0.7));
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
      }
    }
  }

  throw lastError;
}

async function runEmbedPhase(args: ReturnType<typeof parseArgs>, manifest: Manifest) {
  const files = await listFilesRecursive(args.inputDir);
  console.log(`[Pipeline][Embed] Arquivos encontrados: ${files.length}`);

  let processedFiles = 0;
  let skippedFiles = 0;
  let failedFiles = 0;
  let embeddedChunksThisRun = 0;

  for (const filePath of files) {
    const relativePath = toPosix(path.relative(args.inputDir, filePath));
    const sourceKey = relativePath;

    try {
      const fileBuffer = await fs.readFile(filePath);
      const fileHash = sha256(fileBuffer);
      const outputFileName = buildOutputFileName(relativePath);
      const outputFile = path.join(args.pipelineDir, "embeddings", outputFileName);
      const previous = manifest.files[sourceKey];

      const changed = !previous || previous.fileHash !== fileHash;
      let state: PipelineFileState = changed
        ? {
            sourcePath: relativePath,
```

## memory-pipeline.ts (chunk 7)

```text
mbeddings", outputFileName);
      const previous = manifest.files[sourceKey];

      const changed = !previous || previous.fileHash !== fileHash;
      let state: PipelineFileState = changed
        ? {
            sourcePath: relativePath,
            fileHash,
            outputFile,
            totalChunks: 0,
            embeddedChunks: 0,
            importedChunks: 0,
            nextChunkIndex: 0,
            nextImportIndex: 0,
            status: "pending",
            updatedAt: new Date().toISOString(),
          }
        : previous;

      const extracted = await extractTextForPipeline(filePath, fileBuffer);
      const cleaned = extracted.replace(/\s+/g, " ").trim();
      if (!cleaned) {
        state.status = "failed";
        state.error = "Sem texto extraido";
        state.updatedAt = new Date().toISOString();
        manifest.files[sourceKey] = state;
        failedFiles += 1;
        console.warn(`[Pipeline][Embed] Sem texto: ${relativePath}`);
        continue;
      }

      const chunks = chunkText(cleaned);
      state.totalChunks = chunks.length;

      if (state.embeddedChunks >= state.totalChunks && !changed) {
        skippedFiles += 1;
        console.log(`[Pipeline][Embed] Sem mudanca: ${relativePath}`);
        continue;
      }

      const defaultEmbeddingFile: EmbeddingFile = {
        sourcePath: relativePath,
        fileHash,
        model: args.embeddingModel,
        provider: args.embeddingProvider,
        totalChunks: chunks.length,
        items: [],
      };

      let embeddingFile = changed
        ? defaultEmbeddingFile
        : await loadEmbeddingFile(outputFile, defaultEmbeddingFile);

      if (changed) {
        embeddingFile.items = [];
        state.embeddedChunks = 0;
        state.nextChunkIndex = 0;
        stat
```

## memory-pipeline.ts (chunk 8)

```text
ile = changed
        ? defaultEmbeddingFile
        : await loadEmbeddingFile(outputFile, defaultEmbeddingFile);

      if (changed) {
        embeddingFile.items = [];
        state.embeddedChunks = 0;
        state.nextChunkIndex = 0;
        state.importedChunks = 0;
        state.nextImportIndex = 0;
      }

      for (let i = state.nextChunkIndex; i < chunks.length; i += 1) {
        const chunk = chunks[i];
        try {
          const vector = await generateEmbeddingWithRetry(chunk.content, args.embeddingProvider, 3);
          const content = chunk.content.trim();
          const chunkHash = sha256(content);
          const id = `${sha256(relativePath).slice(0, 12)}:${chunk.chunkIndex}:${chunkHash.slice(0, 12)}`;

          embeddingFile.items[chunk.chunkIndex] = {
            id,
            sourcePath: relativePath,
            chunkIndex: chunk.chunkIndex,
            chunkHash,
            content,
            embedding: vector,
          };

          state.embeddedChunks = Math.max(state.embeddedChunks, chunk.chunkIndex + 1);
          state.nextChunkIndex = chunk.chunkIndex + 1;
          embeddedChunksThisRun += 1;

          const percent = ((state.embeddedChunks / state.totalChunks) * 100).toFixed(1);
          console.log(
            `[Pipeline][Embed] ${relativePath} -> ${state.embeddedChunks}/${state.totalChunks} chunks (${percent}%)`
          );

          if (args.maxChunksPerRun > 0 && embeddedChunksThisRun >= args.maxChunksPerRun) {
            state.status = "partial";
            state.updatedAt = new Date().toISOString();
            manifest.files[sourceKey] = state;
            await saveEmbeddingFile(outputFile, embeddingFile);
            await saveManifest(path.join(args.pipelineDir, "manifest.json"), manifest);
            console.
```

## memory-pipeline.ts (chunk 9)

```text
At = new Date().toISOString();
            manifest.files[sourceKey] = state;
            await saveEmbeddingFile(outputFile, embeddingFile);
            await saveManifest(path.join(args.pipelineDir, "manifest.json"), manifest);
            console.log("[Pipeline][Embed] Limite por execucao atingido, estado salvo para retomar.");
            return;
          }
        } catch (embedError: any) {
          state.status = "partial";
          state.error = embedError?.message || "Falha ao gerar embedding";
          state.updatedAt = new Date().toISOString();
          manifest.files[sourceKey] = state;
          await saveEmbeddingFile(outputFile, embeddingFile);
          await saveManifest(path.join(args.pipelineDir, "manifest.json"), manifest);
          console.warn(
            `[Pipeline][Embed] Pausado para retomar depois em ${relativePath} (chunk ${chunk.chunkIndex}): ${state.error}`
          );
          return;
        }

        if ((i + 1) % Math.max(1, args.batchSize) === 0) {
          await saveEmbeddingFile(outputFile, embeddingFile);
        }
      }

      await saveEmbeddingFile(outputFile, embeddingFile);

      state.status = "embedded";
      state.updatedAt = new Date().toISOString();
      delete state.error;
      manifest.files[sourceKey] = state;
      processedFiles += 1;
      console.log(`[Pipeline][Embed] Concluido: ${relativePath}`);
    } catch (error: any) {
      failedFiles += 1;
      const previous = manifest.files[sourceKey];
      manifest.files[sourceKey] = {
        ...(previous || {
          sourcePath: relativePath,
          fileHash: "",
          outputFile: path.join(args.pipelineDir, "embeddings", buildOutputFileName(relativePath)),
          totalChunks: 0,
          embeddedChunks: 0,
          importedChunks: 0,
```

## memory-pipeline.ts (chunk 10)

```text
| {
          sourcePath: relativePath,
          fileHash: "",
          outputFile: path.join(args.pipelineDir, "embeddings", buildOutputFileName(relativePath)),
          totalChunks: 0,
          embeddedChunks: 0,
          importedChunks: 0,
          nextChunkIndex: 0,
          nextImportIndex: 0,
        }),
        status: "failed",
        error: error?.message || "Erro desconhecido",
        updatedAt: new Date().toISOString(),
      };
      console.error(`[Pipeline][Embed] Falha em ${relativePath}:`, error?.message || error);
    }
  }

  console.log("\n[Pipeline][Embed] Resumo");
  console.log(`[Pipeline][Embed] Processados: ${processedFiles}`);
  console.log(`[Pipeline][Embed] Ignorados: ${skippedFiles}`);
  console.log(`[Pipeline][Embed] Falhas: ${failedFiles}`);
}

async function runImportPhase(
  args: ReturnType<typeof parseArgs>,
  userId: number,
  manifest: Manifest
) {
  const entries = Object.values(manifest.files).sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
  const candidates = entries.filter((f) => f.embeddedChunks > 0 && f.status !== "failed");
  console.log(`[Pipeline][Import] Fontes candidatas: ${candidates.length}`);

  let importedThisRun = 0;

  for (const state of candidates) {
    const filePath = state.outputFile || path.join(args.pipelineDir, "embeddings", buildOutputFileName(state.sourcePath));
    const raw = await fs.readFile(filePath, "utf-8").catch(() => "");
    if (!raw) {
      console.warn(`[Pipeline][Import] Arquivo de embeddings ausente: ${state.sourcePath}`);
      continue;
    }

    let data: EmbeddingFile;
    try {
      data = JSON.parse(raw) as EmbeddingFile;
    } catch {
      console.warn(`[Pipeline][Import] JSON invalido: ${state.sourcePath}`);
      continue;
    }

    for (let i = state.nextImp
```

## memory-pipeline.ts (chunk 11)

```text
continue;
    }

    let data: EmbeddingFile;
    try {
      data = JSON.parse(raw) as EmbeddingFile;
    } catch {
      console.warn(`[Pipeline][Import] JSON invalido: ${state.sourcePath}`);
      continue;
    }

    for (let i = state.nextImportIndex; i < data.items.length; i += 1) {
      const item = data.items[i];
      if (!item || !item.content || !Array.isArray(item.embedding) || item.embedding.length === 0) {
        continue;
      }

      const memoryText = [
        `[PIPELINE] Fonte: ${item.sourcePath}`,
        `Chunk: ${item.chunkIndex}`,
        `ChunkId: ${item.id}`,
        `Conteudo: ${item.content}`,
      ].join("\n");
      const keywords = buildMemoryKeywords(item.sourcePath, item.content);

      if (!args.dryRun) {
        await addMemoryEntry(userId, memoryText, keywords, "context");
      }

      state.importedChunks = Math.max(state.importedChunks, item.chunkIndex + 1);
      state.nextImportIndex = item.chunkIndex + 1;
      state.updatedAt = new Date().toISOString();

      const total = Math.max(1, state.embeddedChunks);
      const percent = ((state.importedChunks / total) * 100).toFixed(1);
      console.log(
        `[Pipeline][Import] ${state.sourcePath} -> ${state.importedChunks}/${total} chunks (${percent}%)`
      );

      importedThisRun += 1;
      if (args.maxImportsPerRun > 0 && importedThisRun >= args.maxImportsPerRun) {
        state.status = state.importedChunks >= state.totalChunks ? "imported" : "partial";
        manifest.files[state.sourcePath] = state;
        await saveManifest(path.join(args.pipelineDir, "manifest.json"), manifest);
        console.log("[Pipeline][Import] Limite por execucao atingido, estado salvo para retomar.");
        return;
      }
    }

    state.status = state.importedChunks >= state.
```

## memory-pipeline.ts (chunk 12)

```text
saveManifest(path.join(args.pipelineDir, "manifest.json"), manifest);
        console.log("[Pipeline][Import] Limite por execucao atingido, estado salvo para retomar.");
        return;
      }
    }

    state.status = state.importedChunks >= state.totalChunks ? "imported" : "partial";
    manifest.files[state.sourcePath] = state;
    console.log(`[Pipeline][Import] Concluido: ${state.sourcePath}`);
  }

  console.log("\n[Pipeline][Import] Resumo");
  console.log(`[Pipeline][Import] Chunks importados nesta execucao: ${importedThisRun}`);
}

async function run() {
  const args = parseArgs();
  const userId = await resolveUserId(args.userId);
  process.env.EMBEDDING_MODEL = args.embeddingModel;

  const inputStat = await fs.stat(args.inputDir).catch(() => null);
  if (!inputStat || !inputStat.isDirectory()) {
    throw new Error(`Pasta de entrada nao encontrada: ${args.inputDir}`);
  }

  await fs.mkdir(path.join(args.pipelineDir, "embeddings"), { recursive: true });
  const manifestPath = path.join(args.pipelineDir, "manifest.json");
  const manifest = await loadManifest(manifestPath);

  console.log(`[Pipeline] Usuario: ${userId}`);
  console.log(`[Pipeline] Entrada: ${args.inputDir}`);
  console.log(`[Pipeline] Pipeline dir: ${args.pipelineDir}`);
  console.log(`[Pipeline] Fase: ${args.phase}`);
  console.log(`[Pipeline] Provider embedding: ${args.embeddingProvider}`);
  console.log(`[Pipeline] Modelo embedding: ${args.embeddingModel}`);
  if (args.dryRun) {
    console.log("[Pipeline] DRY RUN ativo (na fase de importacao nao grava no banco)");
  }

  if (args.phase === "embed" || args.phase === "all") {
    await runEmbedPhase(args, manifest);
    await saveManifest(manifestPath, manifest);
  }

  if (args.phase === "import" || args.phase === "all") {
    await runIm
```

## memory-pipeline.ts (chunk 13)

```text
nao grava no banco)");
  }

  if (args.phase === "embed" || args.phase === "all") {
    await runEmbedPhase(args, manifest);
    await saveManifest(manifestPath, manifest);
  }

  if (args.phase === "import" || args.phase === "all") {
    await runImportPhase(args, userId, manifest);
    await saveManifest(manifestPath, manifest);
  }

  console.log("\n[Pipeline] Finalizado com sucesso.");
  console.log(`[Pipeline] Manifesto: ${manifestPath}`);
}

run().catch((error) => {
  console.error("[Pipeline] Falha fatal:", error);
  process.exitCode = 1;
});
```

## menu.ps1 (chunk 1)

```text
# Menu Interativo Principal - AVA Assistant v3.1
# Uso: .\scripts\menu.ps1

# Configuracao inicial
$ErrorActionPreference = "SilentlyContinue"
$WarningPreference = "SilentlyContinue"

function Show-Menu {
    Clear-Host
    Write-Host "[MENU PRINCIPAL - AVA Assistant v3.1]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Escolha uma opção:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  [1]  🧹  Limpar Ambiente (cache, node_modules, processos)" -ForegroundColor White
    Write-Host "  [2]  🔍  Verificar Servidores Ativos" -ForegroundColor White
    Write-Host "  [3]  🟢  Iniciar Dev Server (Vite - porta 5173)" -ForegroundColor White
    Write-Host "  [4]  🏭  Build + Produção (Build e iniciar servidor)" -ForegroundColor White
    Write-Host "  [5]  🔄  Reset Completo (Limpar + Iniciar Dev)" -ForegroundColor White
    Write-Host "  [6]  📊  Status Completo do Sistema" -ForegroundColor White
    Write-Host "  [7]  🛑  Parar Todos os Servidores" -ForegroundColor White
    Write-Host "  [8]  📋  Verificar Portas em Uso" -ForegroundColor White
    Write-Host "  [9]  📚  Ver Documentação dos Scripts" -ForegroundColor White
    Write-Host "  [10] 🚀  Iniciar TODOS os Servidores (Vite+Backend)" -ForegroundColor Cyan
    Write-Host "  [0]  ❌  Sair" -ForegroundColor Red
    Write-Host ""
    Write-Host "────────────────────────────────────────────────────────────" -ForegroundColor Gray
}

function Option-1-Clean {
    Write-Host ""
    Write-Host "Executando: .\scripts\clean.ps1" -ForegroundColor Yellow
    Write-Host ""
    & .\scripts\clean.ps1

    Write-Host ""
    Write-Host "✅ Limpeza concluída!" -ForegroundColor Green
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,Includ
```

## menu.ps1 (chunk 2)

```text
Host ""
    & .\scripts\clean.ps1

    Write-Host ""
    Write-Host "✅ Limpeza concluída!" -ForegroundColor Green
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Option-2-CheckServers {
    Clear-Host
    Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  🔍 VERIFICAR SERVIDORES ATIVOS                        ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""

    # Verificar Node.js
    Write-Host "📌 Processos Node.js:" -ForegroundColor Yellow
    $nodeProcs = Get-Process node -ErrorAction SilentlyContinue
    if ($nodeProcs) {
        $nodeProcs | Format-Table -Property Id, ProcessName, CPU, Memory -AutoSize
    } else {
        Write-Host "   ℹ Nenhum processo Node.js ativo" -ForegroundColor Gray
    }

    Write-Host ""

    # Verificar portas principais
    Write-Host "📌 Portas em Uso:" -ForegroundColor Yellow
    $ports = @(
        [PSCustomObject]@{Port=5173; Service="Vite Dev"},
        [PSCustomObject]@{Port=3000; Service="Node Server"},
        [PSCustomObject]@{Port=3001; Service="API"},
        [PSCustomObject]@{Port=5174; Service="Vite (alt)"},
        [PSCustomObject]@{Port=8080; Service="Outro Serviço"}
    )

    foreach ($portInfo in $ports) {
        $conn = Get-NetTCPConnection -LocalPort $portInfo.Port -ErrorAction SilentlyContinue
        if ($conn) {
            $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            Write-Host "   ✓ Porta $($portInfo.Port) [$($portInfo.Service)]: ATIVA - PID $($conn.OwningProcess) ($($proc.ProcessName))" -ForegroundColor
```

## menu.ps1 (chunk 3)

```text
f ($conn) {
            $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            Write-Host "   ✓ Porta $($portInfo.Port) [$($portInfo.Service)]: ATIVA - PID $($conn.OwningProcess) ($($proc.ProcessName))" -ForegroundColor Green
        } else {
            Write-Host "   ○ Porta $($portInfo.Port) [$($portInfo.Service)]: livre" -ForegroundColor Gray
        }
    }

    Write-Host ""
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Option-3-StartDev {
    Write-Host ""
    Write-Host "Executando: .\scripts\start-dev.ps1" -ForegroundColor Yellow
    Write-Host ""
    & .\scripts\start-dev.ps1
}

function Option-4-StartProd {
    Write-Host ""
    Write-Host "Executando: .\scripts\start-prod.ps1" -ForegroundColor Yellow
    Write-Host ""
    & .\scripts\start-prod.ps1
}

function Option-5-FullReset {
    Write-Host ""
    $confirm = Read-Host "⚠️  Deseja executar reset COMPLETO (limpeza + dev server)? (s/n)"
    if ($confirm -eq 's' -or $confirm -eq 'S') {
        & .\scripts\full-reset.ps1
    } else {
        Write-Host "❌ Operação cancelada" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

function Option-6-SystemStatus {
    Clear-Host
    Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  📊 STATUS COMPLETO DO SISTEMA                         ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""

    # Versões
    Write-Host
```

## menu.ps1 (chunk 4)

```text
Cyan
    Write-Host "║  📊 STATUS COMPLETO DO SISTEMA                         ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""

    # Versões
    Write-Host "📌 Versões Instaladas:" -ForegroundColor Yellow
    $nodeVer = node --version 2>$null
    $npmVer = npm --version 2>$null
    $pnpmVer = pnpm --version 2>$null

    Write-Host "   • Node.js: $nodeVer" -ForegroundColor White
    Write-Host "   • npm: $npmVer" -ForegroundColor White
    Write-Host "   • pnpm: $pnpmVer" -ForegroundColor White

    Write-Host ""

    # Verificar se node_modules existe
    Write-Host "📌 Dependências:" -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        $moduleCount = (Get-ChildItem -Path "node_modules" -Directory).Count
        Write-Host "   ✓ node_modules encontrado ($moduleCount pacotes)" -ForegroundColor Green
    } else {
        Write-Host "   ✗ node_modules NÃO encontrado" -ForegroundColor Red
    }

    Write-Host ""

    # Verificar pastas principais
    Write-Host "📌 Estrutura do Projeto:" -ForegroundColor Yellow
    $folders = @("client", "server", "shared", "drizzle", "docs", "scripts")
    foreach ($folder in $folders) {
        if (Test-Path $folder) {
            Write-Host "   ✓ $folder/" -ForegroundColor Green
        } else {
            Write-Host "   ✗ $folder/ (não encontrado)" -ForegroundColor Red
        }
    }

    Write-Host ""

    # TypeScript Check
    Write-Host "📌 Verificação TypeScript:" -ForegroundColor Yellow
    Write-Host "   Executando pnpm check..." -ForegroundColor Gray
    pnpm check 2>&1 | Select-Object -First 5

    Write-Host ""
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.U
```

## menu.ps1 (chunk 5)

```text
Color Yellow
    Write-Host "   Executando pnpm check..." -ForegroundColor Gray
    pnpm check 2>&1 | Select-Object -First 5

    Write-Host ""
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Option-7-StopServers {
    Write-Host ""
    Write-Host "🛑 Parando todos os servidores..." -ForegroundColor Yellow

    # Matar Node.js
    $nodeProcs = Get-Process node -ErrorAction SilentlyContinue
    if ($nodeProcs) {
        Stop-Process -Name node -Force -ErrorAction SilentlyContinue
        Write-Host "   ✓ Processos Node.js finalizados" -ForegroundColor Green
    } else {
        Write-Host "   ℹ Nenhum processo Node.js ativo" -ForegroundColor Gray
    }

    Write-Host ""
    Write-Host "✅ Todos os servidores foram parados!" -ForegroundColor Green
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Option-8-CheckPorts {
    Clear-Host
    Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  📋 VERIFICAÇÃO DETALHADA DE PORTAS                    ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""

    $ports = @(5173, 5174, 3000, 3001, 8080, 8000, 8888)

    Write-Host "Analisando portas..." -ForegroundColor Yellow
    Write-Host ""

    foreach ($port in $ports) {
        $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($conn) {
            $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            Write-Host "Porta $port - EM USO
```

## menu.ps1 (chunk 6)

```text
$conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($conn) {
            $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            Write-Host "Porta $port - EM USO" -ForegroundColor Red
            Write-Host "  └─ Processo: $($proc.ProcessName) (PID: $($conn.OwningProcess))" -ForegroundColor Yellow
            Write-Host "  └─ Memória: $([math]::Round($proc.WorkingSet/1MB, 2)) MB" -ForegroundColor Gray
        } else {
            Write-Host "Porta $port - Livre" -ForegroundColor Green
        }
    }

    Write-Host ""
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Option-9-ShowDocs {
    Clear-Host
    Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  📚 DOCUMENTAÇÃO DOS SCRIPTS                           ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""

    if (Test-Path "scripts/README.md") {
        Get-Content "scripts/README.md" | Out-Host
    } else {
        Write-Host "❌ Arquivo scripts/README.md não encontrado" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Option-10-StartAll {
    Write-Host ""
    Write-Host "🚀 Iniciando servidor completo..." -ForegroundColor Yellow
    Write-Host ""

    # Limpar primeiro
    Write-Host "🧹 Limpando ambiente..." -ForegroundColor Gray
    & .\scripts\clean.ps1

    Write-Host ""
    Write-Host "🟢 Iniciando Vite + Ba
```

## menu.ps1 (chunk 7)

```text
st "🚀 Iniciando servidor completo..." -ForegroundColor Yellow
    Write-Host ""

    # Limpar primeiro
    Write-Host "🧹 Limpando ambiente..." -ForegroundColor Gray
    & .\scripts\clean.ps1

    Write-Host ""
    Write-Host "🟢 Iniciando Vite + Backend..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📍 Acesse em: http://localhost:5173" -ForegroundColor Green
    Write-Host "⏹️  Pressione CTRL+C para parar" -ForegroundColor Yellow
    Write-Host ""

    # Aguardar 2 segundos
    Start-Sleep -Seconds 2

    # Executar pnpm dev (que já inclui backend)
    pnpm dev
}

# Loop principal
while ($true) {
    Show-Menu

    $choice = Read-Host "Digite a opção"

    switch ($choice) {
        "1" { Option-1-Clean }
        "2" { Option-2-CheckServers }
        "3" { Option-3-StartDev }
        "4" { Option-4-StartProd }
        "5" { Option-5-FullReset }
        "6" { Option-6-SystemStatus }
        "7" { Option-7-StopServers }
        "8" { Option-8-CheckPorts }
        "9" { Option-9-ShowDocs }
        "10" { Option-10-StartAll }
        "0" {
            Clear-Host
            Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
            Write-Host "║  👋 Até logo! AVA Assistant v3.1                        ║" -ForegroundColor Cyan
            Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
            Write-Host ""
            exit
        }
        default {
            Write-Host ""
            Write-Host "❌ Opção inválida! Tente novamente." -ForegroundColor Red
            Write-Host ""
            Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
    }
}
```

## prepare-journal-memory.ts (chunk 1)

```text
import "dotenv/config";
import path from "node:path";
import { promises as fs } from "node:fs";
import { asc, eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { invokeLLM } from "../server/_core/llm";
import { addMemoryEntry, getDb } from "../server/db";

type AnalysisResult = {
  title: string;
  summary: string;
  topics: string[];
  keyPoints: string[];
  deepDiveQuestions: string[];
  claimsToVerify: Array<{ claim: string; missingData: string; suggestedSource: string }>;
  lawsMentioned: Array<{ law: string; context: string; action: string }>;
  pendingItems: string[];
  confidence: "low" | "medium" | "high";
  notes?: string;
};

function parseArgs() {
  const args = process.argv.slice(2);
  const values: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i += 1) {
    const token = ***REDACTED***
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith("--")) {
      values[key] = true;
    } else {
      values[key] = next;
      i += 1;
    }
  }

  const filePath = typeof values.file === "string" ? path.resolve(values.file) : "";
  if (!filePath) throw new Error("Use --file <caminho-do-arquivo>");

  return {
    filePath,
    model: typeof values.model === "string" ? values.model : "qwen2.5:7b-instruct",
    provider: (typeof values.provider === "string" && values.provider === "forge" ? "forge" : "ollama") as
      | "ollama"
      | "forge",
    importMemory: values["import-memory"] === true,
    userId: typeof values["user-id"] === "string" ? Number(values["user-id"]) : undefined,
  };
}

async function resolveUserId(cliUserId?: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indi
```

## prepare-journal-memory.ts (chunk 2)

```text
= true,
    userId: typeof values["user-id"] === "string" ? Number(values["user-id"]) : undefined,
  };
}

async function resolveUserId(cliUserId?: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponivel.");

  if (cliUserId) {
    const found = await db.select().from(users).where(eq(users.id, cliUserId)).limit(1);
    if (!found[0]) throw new Error(`Usuario ${cliUserId} nao encontrado.`);
    return cliUserId;
  }

  const first = await db.select().from(users).orderBy(asc(users.id)).limit(1);
  if (!first[0]) throw new Error("Nenhum usuario encontrado no banco.");
  return first[0].id;
}

function parseTitle(content: string, fallback: string): string {
  const line = content
    .split(/\r?\n/)
    .find((l) => l.toLowerCase().includes("titulo") || l.toLowerCase().includes("title"));
  if (!line) return fallback;
  return line.replace(/^.*?:\s*/, "").trim() || fallback;
}

function detectTranscriptError(content: string): { hasError: boolean; reason?: string; videoId?: string } {
  const normalized = content.toLowerCase();
  const hasError =
    normalized.includes("erro ao extrair transcri") ||
    normalized.includes("could not retrieve a transcript") ||
    normalized.includes("invalid video id");

  let videoId = "";
  const liveMatch = content.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{6,})/i);
  const watchMatch = content.match(/[?&]v=([a-zA-Z0-9_-]{6,})/i);
  if (liveMatch?.[1]) videoId = liveMatch[1];
  if (!videoId && watchMatch?.[1]) videoId = watchMatch[1];

  return {
    hasError,
    reason: hasError ? "Transcricao nao foi extraida. O arquivo contem mensagem de erro da API." : undefined,
    videoId: videoId || undefined,
  };
}

function fallbackFromError(title: string, reason: string, videoId?: string
```

## prepare-journal-memory.ts (chunk 3)

```text
return {
    hasError,
    reason: hasError ? "Transcricao nao foi extraida. O arquivo contem mensagem de erro da API." : undefined,
    videoId: videoId || undefined,
  };
}

function fallbackFromError(title: string, reason: string, videoId?: string): AnalysisResult {
  const pending = [
    "Refazer extracao da transcricao com o video id correto (nao usar URL completa).",
    "Salvar transcricao completa e revisar se ha marcacao de tempo por bloco.",
    "Rodar analise novamente para gerar pontos de aprofundamento.",
  ];
  if (videoId) {
    pending.unshift(`Video id detectado para teste: ${videoId}`);
  }

  return {
    title,
    summary: "Nao foi possivel analisar o jornal porque a transcricao nao foi carregada corretamente.",
    topics: ["pendencia de coleta", "transcricao ausente"],
    keyPoints: [reason],
    deepDiveQuestions: [
      "Quais temas economicos foram abordados no episodio?",
      "Quais leis, indicadores e comparacoes historicas foram citados?",
    ],
    claimsToVerify: [
      {
        claim: "Nao ha claims verificaveis porque o texto e erro tecnico.",
        missingData: "Transcricao completa do episodio.",
        suggestedSource: "YouTube transcript/manual + fonte oficial dos temas citados.",
      },
    ],
    lawsMentioned: [],
    pendingItems: pending,
    confidence: "low",
    notes: "Assim que a transcricao real existir, rode novamente o script.",
  };
}

async function llmAnalyze(title: string, content: string, provider: "ollama" | "forge", model: string): Promise<AnalysisResult> {
  const prompt = [
    "Voce e um analista de conhecimento para memoria de estudo.",
    "Analise a transcricao e retorne APENAS JSON valido.",
    "Objetivo: destacar assuntos, pontos para aprofundamento e pendencias de dados/leis faltantes.",
```

## prepare-journal-memory.ts (chunk 4)

```text
{
  const prompt = [
    "Voce e um analista de conhecimento para memoria de estudo.",
    "Analise a transcricao e retorne APENAS JSON valido.",
    "Objetivo: destacar assuntos, pontos para aprofundamento e pendencias de dados/leis faltantes.",
    "Campos obrigatorios do JSON:",
    "title (string), summary (string), topics (array string), keyPoints (array string), deepDiveQuestions (array string),",
    "claimsToVerify (array de objetos com claim, missingData, suggestedSource),",
    "lawsMentioned (array de objetos com law, context, action), pendingItems (array string), confidence (low|medium|high), notes (string opcional).",
    "Regras:",
    "- Se citar indicador sem comparativo (ex.: PIB sem periodo completo), gerar pendencia explicita.",
    "- Se citar lei sem detalhes, gerar pendencia para buscar texto legal e status (vigente/revogada).",
    "- Priorizar perguntas praticas de aprofundamento.",
    `Titulo: ${title}`,
    "Transcricao (trecho):",
    content.slice(0, 30000),
  ].join("\n");

  const result = await invokeLLM({
    provider,
    model,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    timeoutMs: 180000,
  });

  const llmContent = result.choices?.[0]?.message?.content;
  const text = typeof llmContent === "string" ? llmContent : JSON.stringify(llmContent || {});
  const parsed = JSON.parse(text || "{}");

  const out: AnalysisResult = {
    title: String(parsed.title || title),
    summary: String(parsed.summary || ""),
    topics: Array.isArray(parsed.topics) ? parsed.topics.map((x: unknown) => String(x)) : [],
    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.map((x: unknown) => String(x)) : [],
    deepDiveQuestions: Array.isArray(parsed.deepDiveQuestions)
      ? parsed.dee
```

## prepare-journal-memory.ts (chunk 5)

```text
rsed.topics) ? parsed.topics.map((x: unknown) => String(x)) : [],
    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.map((x: unknown) => String(x)) : [],
    deepDiveQuestions: Array.isArray(parsed.deepDiveQuestions)
      ? parsed.deepDiveQuestions.map((x: unknown) => String(x))
      : [],
    claimsToVerify: Array.isArray(parsed.claimsToVerify)
      ? parsed.claimsToVerify.map((x: any) => ({
          claim: String(x?.claim || ""),
          missingData: String(x?.missingData || ""),
          suggestedSource: String(x?.suggestedSource || ""),
        }))
      : [],
    lawsMentioned: Array.isArray(parsed.lawsMentioned)
      ? parsed.lawsMentioned.map((x: any) => ({
          law: String(x?.law || ""),
          context: String(x?.context || ""),
          action: String(x?.action || ""),
        }))
      : [],
    pendingItems: Array.isArray(parsed.pendingItems) ? parsed.pendingItems.map((x: unknown) => String(x)) : [],
    confidence:
      parsed.confidence === "high" || parsed.confidence === "medium" || parsed.confidence === "low"
        ? parsed.confidence
        : "medium",
    notes: parsed.notes ? String(parsed.notes) : undefined,
  };

  return out;
}

function toMarkdown(result: AnalysisResult, sourceFile: string): string {
  const lines: string[] = [];
  lines.push(`# Analise de Memoria - ${result.title}`);
  lines.push("");
  lines.push(`Fonte: ${sourceFile}`);
  lines.push("");
  lines.push("## Resumo");
  lines.push(result.summary || "(sem resumo)");
  lines.push("");
  lines.push("## Assuntos Abordados");
  for (const t of result.topics) lines.push(`- ${t}`);
  lines.push("");
  lines.push("## Pontos-Chave");
  for (const p of result.keyPoints) lines.push(`- ${p}`);
  lines.push("");
  lines.push("## Perguntas para Aprofundamento")
```

## prepare-journal-memory.ts (chunk 6)

```text
suntos Abordados");
  for (const t of result.topics) lines.push(`- ${t}`);
  lines.push("");
  lines.push("## Pontos-Chave");
  for (const p of result.keyPoints) lines.push(`- ${p}`);
  lines.push("");
  lines.push("## Perguntas para Aprofundamento");
  for (const q of result.deepDiveQuestions) lines.push(`- ${q}`);
  lines.push("");
  lines.push("## Claims para Verificacao");
  for (const c of result.claimsToVerify) {
    lines.push(`- Claim: ${c.claim}`);
    lines.push(`  - Dado faltante: ${c.missingData}`);
    lines.push(`  - Fonte sugerida: ${c.suggestedSource}`);
  }
  lines.push("");
  lines.push("## Leis Citadas e Acao");
  for (const l of result.lawsMentioned) {
    lines.push(`- Lei: ${l.law}`);
    lines.push(`  - Contexto: ${l.context}`);
    lines.push(`  - Acao: ${l.action}`);
  }
  lines.push("");
  lines.push("## Pendencias");
  for (const p of result.pendingItems) lines.push(`- ${p}`);
  lines.push("");
  lines.push(`Confianca da analise: ${result.confidence}`);
  if (result.notes) {
    lines.push("");
    lines.push(`Observacao: ${result.notes}`);
  }
  return lines.join("\n");
}

async function run() {
  const args = parseArgs();
  const raw = await fs.readFile(args.filePath, "utf-8");
  const baseName = path.basename(args.filePath, path.extname(args.filePath));
  const title = parseTitle(raw, baseName);

  const check = detectTranscriptError(raw);
  const result = check.hasError
    ? fallbackFromError(title, check.reason || "Erro desconhecido de transcricao", check.videoId)
    : await llmAnalyze(title, raw, args.provider, args.model);

  const outDir = path.join(path.dirname(args.filePath), "analises-jornal");
  await fs.mkdir(outDir, { recursive: true });

  const jsonPath = path.join(outDir, `${baseName}.analysis.json`);
  const mdPath = path.j
```

## prepare-journal-memory.ts (chunk 7)

```text
, raw, args.provider, args.model);

  const outDir = path.join(path.dirname(args.filePath), "analises-jornal");
  await fs.mkdir(outDir, { recursive: true });

  const jsonPath = path.join(outDir, `${baseName}.analysis.json`);
  const mdPath = path.join(outDir, `${baseName}.analysis.md`);

  await fs.writeFile(jsonPath, JSON.stringify(result, null, 2), "utf-8");
  await fs.writeFile(mdPath, toMarkdown(result, path.basename(args.filePath)), "utf-8");

  if (args.importMemory) {
    const userId = await resolveUserId(args.userId);
    const memoryMain = [
      `[JORNAL] ${result.title}`,
      `Resumo: ${result.summary}`,
      `Assuntos: ${result.topics.join(", ")}`,
      `Pontos-chave: ${result.keyPoints.join(" | ")}`,
    ].join("\n");

    const memoryPending = [
      `[JORNAL][PENDENCIAS] ${result.title}`,
      ...result.pendingItems.map((p) => `- ${p}`),
      ...result.claimsToVerify.map((c) => `- Verificar: ${c.claim} | faltante: ${c.missingData}`),
      ...result.lawsMentioned.map((l) => `- Lei citada: ${l.law} | acao: ${l.action}`),
    ].join("\n");

    await addMemoryEntry(userId, memoryMain, "jornal, analise, resumo", "context");
    await addMemoryEntry(userId, memoryPending, "jornal, pendencia, verificacao, lei", "context");
  }

  console.log(`[JournalPrep] Analise salva em: ${jsonPath}`);
  console.log(`[JournalPrep] Relatorio salvo em: ${mdPath}`);
  if (check.hasError) {
    console.log("[JournalPrep] Aviso: arquivo contem erro de transcricao; pendencias geradas.");
  }
}

run().catch((error) => {
  console.error("[JournalPrep] Falha:", error);
  process.exitCode = 1;
});
```

## process-text.ts (chunk 1)

```text
import * as fs from 'node:fs';
import * as path from 'node:path';
type Mode = 'chat' | 'rag' | 'both';

const CONFIG = {
  CHUNK_SIZE: 1800,
  OVERLAP_WORDS: 40,
  MIN_CHUNK_SIZE: 350,
  MODE: 'both' as Mode,
};

type Section = {
  title: string;
  sectionIndex: number;
  content: string;
};

type Chunk = {
  id: string;
  sourceFile: string;
  sectionTitle: string;
  sectionIndex: number;
  chunkIndex: number;
  chunkIndexInSection: number;
  text: string;
  chars: number;
  words: number;
};

function normalizeMarkdown(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, '  ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseArgs(argv: string[]) {
  const flags = new Map<string, string>();
  const positional: string[] = [];

  for (const arg of argv) {
    if (!arg.startsWith('--')) {
      positional.push(arg);
      continue;
    }

    const [key, value] = arg.slice(2).split('=');
    flags.set(key, value ?? 'true');
  }

  return { flags, positional };
}

function parseMode(value: string | undefined): Mode {
  if (value === 'chat' || value === 'rag' || value === 'both') {
    return value;
  }
  return CONFIG.MODE;
}

function splitSections(markdown: string): Section[] {
  const lines = markdown.split('\n');
  const sections: Section[] = [];

  let currentTitle = 'Introducao';
  let currentBuffer: string[] = [];
  let sectionIndex = 0;

  const pushCurrent = () => {
    const content = currentBuffer.join('\n').trim();
    if (!content) {
      return;
    }
    sections.push({
      title: currentTitle,
      sectionIndex,
      content,
    });
    sectionIndex += 1;
    currentBuffer = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);

    if
```

## process-text.ts (chunk 2)

```text
return;
    }
    sections.push({
      title: currentTitle,
      sectionIndex,
      content,
    });
    sectionIndex += 1;
    currentBuffer = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);

    if (headingMatch) {
      pushCurrent();
      currentTitle = headingMatch[1].trim();
      continue;
    }

    currentBuffer.push(line);
  }

  pushCurrent();

  if (sections.length === 0) {
    return [{ title: 'Conteudo', sectionIndex: 0, content: markdown }];
  }

  return sections;
}

function estimateWords(text: string): number {
  if (!text.trim()) {
    return 0;
  }
  return text.trim().split(/\s+/).length;
}

function getTailWords(text: string, overlapWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= overlapWords) {
    return text.trim();
  }
  return words.slice(words.length - overlapWords).join(' ');
}

function chunkSection(section: Section, chunkSize: number, overlapWords: number, minChunkSize: number): string[] {
  const paragraphs = section.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let currentChunk = '';

  const pushChunk = () => {
    const chunk = currentChunk.trim();
    if (!chunk) {
      return;
    }
    chunks.push(chunk);
    currentChunk = '';
  };

  for (const paragraph of paragraphs) {
    const candidate = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph;

    if (candidate.length <= chunkSize || currentChunk.length < minChunkSize) {
      currentChunk = candidate;
      continue;
    }

    const previous = currentChunk;
    pushChunk();
    const overlap = getTailWords(previous, overlapWords);
    currentChunk = overlap ? `${overlap}\n\n${paragraph}` : paragraph;

    if (currentChunk.leng
```

## process-text.ts (chunk 3)

```text
tChunk = candidate;
      continue;
    }

    const previous = currentChunk;
    pushChunk();
    const overlap = getTailWords(previous, overlapWords);
    currentChunk = overlap ? `${overlap}\n\n${paragraph}` : paragraph;

    if (currentChunk.length > chunkSize * 1.5) {
      pushChunk();
    }
  }

  pushChunk();
  return chunks;
}

function buildChunks(fullText: string, sourceFile: string, chunkSize: number, overlapWords: number, minChunkSize: number): Chunk[] {
  const sections = splitSections(fullText);
  const allChunks: Chunk[] = [];
  let globalIndex = 0;

  for (const section of sections) {
    const sectionChunks = chunkSection(section, chunkSize, overlapWords, minChunkSize);

    sectionChunks.forEach((text, chunkIndexInSection) => {
      allChunks.push({
        id: `${path.basename(sourceFile, path.extname(sourceFile))}-s${section.sectionIndex}-c${chunkIndexInSection}`,
        sourceFile: path.basename(sourceFile),
        sectionTitle: section.title,
        sectionIndex: section.sectionIndex,
        chunkIndex: globalIndex,
        chunkIndexInSection,
        text,
        chars: text.length,
        words: estimateWords(text),
      });
      globalIndex += 1;
    });
  }

  return allChunks;
}

function toChatMarkdown(chunks: Chunk[], inputPath: string): string {
  const bySection = new Map<string, Chunk[]>();

  chunks.forEach((chunk) => {
    const key = `${chunk.sectionIndex}::${chunk.sectionTitle}`;
    const current = bySection.get(key) ?? [];
    current.push(chunk);
    bySection.set(key, current);
  });

  const lines: string[] = [];
  lines.push(`# Material para Chat: ${path.basename(inputPath)}`);
  lines.push('');
  lines.push(`- Arquivo de origem: \`${path.basename(inputPath)}\``);
  lines.push(`- Blocos: ${chunks.length}`);
  lines.pu
```

## process-text.ts (chunk 4)

```text
t);
  });

  const lines: string[] = [];
  lines.push(`# Material para Chat: ${path.basename(inputPath)}`);
  lines.push('');
  lines.push(`- Arquivo de origem: \`${path.basename(inputPath)}\``);
  lines.push(`- Blocos: ${chunks.length}`);
  lines.push(`- Gerado em: ${new Date().toLocaleString('pt-BR')}`);
  lines.push('');
  lines.push('## Prompt sugerido');
  lines.push('Use o material abaixo como contexto. Se faltar informacao no texto, diga explicitamente que nao encontrou no material fornecido.');
  lines.push('');

  bySection.forEach((sectionChunks, key) => {
    const [, sectionTitle] = key.split('::');
    lines.push(`## ${sectionTitle}`);
    lines.push('');

    for (const chunk of sectionChunks) {
      lines.push(`### Trecho ${chunk.chunkIndex + 1}`);
      lines.push('');
      lines.push(chunk.text);
      lines.push('');
    }
  });

  return `${lines.join('\n').trim()}\n`;
}

function toJsonl(chunks: Chunk[]): string {
  return `${chunks
    .map((chunk) => JSON.stringify({
      id: chunk.id,
      source_file: chunk.sourceFile,
      section_title: chunk.sectionTitle,
      section_index: chunk.sectionIndex,
      chunk_index: chunk.chunkIndex,
      chunk_index_in_section: chunk.chunkIndexInSection,
      chars: chunk.chars,
      words: chunk.words,
      text: chunk.text,
    }))
    .join('\n')}\n`;
}

function processFile(inputPath: string, options?: {
  mode?: Mode;
  chunkSize?: number;
  overlapWords?: number;
  minChunkSize?: number;
}) {
  if (!fs.existsSync(inputPath)) {
    console.error(`Erro: Arquivo não encontrado: ${inputPath}`);
    return;
  }

  const mode = options?.mode ?? CONFIG.MODE;
  const chunkSize = options?.chunkSize ?? CONFIG.CHUNK_SIZE;
  const overlapWords = options?.overlapWords ?? CONFIG.OVERLAP_WORDS;
  const minChunk
```

## process-text.ts (chunk 5)

```text
Arquivo não encontrado: ${inputPath}`);
    return;
  }

  const mode = options?.mode ?? CONFIG.MODE;
  const chunkSize = options?.chunkSize ?? CONFIG.CHUNK_SIZE;
  const overlapWords = options?.overlapWords ?? CONFIG.OVERLAP_WORDS;
  const minChunkSize = options?.minChunkSize ?? CONFIG.MIN_CHUNK_SIZE;

  console.log(`\nLendo: ${path.basename(inputPath)}...`);
  const rawText = fs.readFileSync(inputPath, 'utf-8');
  const normalized = normalizeMarkdown(rawText);
  const chunks = buildChunks(normalized, inputPath, chunkSize, overlapWords, minChunkSize);

  console.log(`Texto dividido em ${chunks.length} blocos (chunk=${chunkSize}, overlap=${overlapWords} palavras).`);

  const ext = path.extname(inputPath);
  const basePath = ext ? inputPath.slice(0, -ext.length) : inputPath;

  if (mode === 'chat' || mode === 'both') {
    const chatPath = `${basePath}-chat.md`;
    fs.writeFileSync(chatPath, toChatMarkdown(chunks, inputPath), 'utf-8');
    console.log(`Gerado: ${path.basename(chatPath)}`);
  }

  if (mode === 'rag' || mode === 'both') {
    const ragPath = `${basePath}-rag.jsonl`;
    fs.writeFileSync(ragPath, toJsonl(chunks), 'utf-8');
    console.log(`Gerado: ${path.basename(ragPath)}`);
  }

  console.log('\nConcluido.');
}

// Execução CLI
const { positional, flags } = parseArgs(process.argv.slice(2));
const inputFile = positional[0];

if (!inputFile) {
  console.log('Uso: npx tsx scripts/process-text.ts <caminho-do-arquivo> [--mode=chat|rag|both] [--chunk-size=1800] [--overlap=40] [--min-chunk=350]');
} else {
  processFile(path.resolve(inputFile), {
    mode: parseMode(flags.get('mode')),
    chunkSize: Number(flags.get('chunk-size') ?? CONFIG.CHUNK_SIZE),
    overlapWords: Number(flags.get('overlap') ?? CONFIG.OVERLAP_WORDS),
    minChunkSize: Number(flags.get(
```

## process-text.ts (chunk 6)

```text
ssFile(path.resolve(inputFile), {
    mode: parseMode(flags.get('mode')),
    chunkSize: Number(flags.get('chunk-size') ?? CONFIG.CHUNK_SIZE),
    overlapWords: Number(flags.get('overlap') ?? CONFIG.OVERLAP_WORDS),
    minChunkSize: Number(flags.get('min-chunk') ?? CONFIG.MIN_CHUNK_SIZE),
  });
}
```

## rag-backup.ts (chunk 1)

```text
import "dotenv/config";
import path from "node:path";
import { promises as fs } from "node:fs";

const PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(
  PROJECT_ROOT,
  "..",
  `${path.basename(PROJECT_ROOT)}-dados`
);
const DEFAULT_BACKUP_DIR = path.resolve(
  PROJECT_ROOT,
  "..",
  `${path.basename(PROJECT_ROOT)}-backup`
);

function getDataDir() {
  return process.env.AVA_DATA_DIR
    ? path.resolve(process.env.AVA_DATA_DIR)
    : DEFAULT_DATA_DIR;
}

function getBackupDir() {
  return process.env.AVA_BACKUP_DIR
    ? path.resolve(process.env.AVA_BACKUP_DIR)
    : DEFAULT_BACKUP_DIR;
}

function nowStamp() {
  const date = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function resolveDatabaseFile(): string {
  const raw = process.env.DATABASE_URL || "file:./sqlite_v2.db";
  if (raw.startsWith("file:")) {
    const dbPath = raw.slice("file:".length);
    return path.resolve(PROJECT_ROOT, dbPath);
  }
  throw new Error(`DATABASE_URL nao suportada para backup local: ${raw}`);
}

async function copyIfExists(source: string, target: string): Promise<boolean> {
  const stat = await fs.stat(source).catch(() => null);
  if (!stat) return false;

  await fs.mkdir(path.dirname(target), { recursive: true });
  if (stat.isDirectory()) {
    await fs.cp(source, target, { recursive: true });
  } else {
    await fs.copyFile(source, target);
  }
  return true;
}

async function run() {
  const dataDir = getDataDir();
  const backupRoot = getBackupDir();
  const snapshotDir = path.join(backupRoot, `rag-backup-${nowStamp()}`);
  const dbFile = resolveDatabaseFile();

  await fs.mkdir
```

## rag-backup.ts (chunk 2)

```text
get);
  }
  return true;
}

async function run() {
  const dataDir = getDataDir();
  const backupRoot = getBackupDir();
  const snapshotDir = path.join(backupRoot, `rag-backup-${nowStamp()}`);
  const dbFile = resolveDatabaseFile();

  await fs.mkdir(snapshotDir, { recursive: true });

  const copied: string[] = [];
  const skipped: string[] = [];

  const targets: Array<{ source: string; target: string; label: string }> = [
    {
      source: dbFile,
      target: path.join(snapshotDir, "runtime", path.basename(dbFile)),
      label: "sqlite database",
    },
    {
      source: path.join(dataDir, ".rag", "drive-sync-manifest.json"),
      target: path.join(snapshotDir, "rag", "drive-sync-manifest.json"),
      label: "rag manifest",
    },
    {
      source: path.join(dataDir, "google-drive-embeddings", "json"),
      target: path.join(snapshotDir, "data", "google-drive-embeddings", "json"),
      label: "legacy embeddings json",
    },
  ];

  for (const item of targets) {
    const ok = await copyIfExists(item.source, item.target);
    if (ok) {
      copied.push(item.label);
    } else {
      skipped.push(item.label);
    }
  }

  const metadata = {
    createdAt: new Date().toISOString(),
    projectRoot: PROJECT_ROOT,
    dataDir,
    backupRoot,
    databaseFile: dbFile,
    copied,
    skipped,
  };

  await fs.writeFile(
    path.join(snapshotDir, "backup-metadata.json"),
    JSON.stringify(metadata, null, 2),
    "utf-8"
  );

  console.log(`[RAG][Backup] Snapshot: ${snapshotDir}`);
  console.log(`[RAG][Backup] Copiados: ${copied.join(", ") || "nenhum"}`);
  console.log(`[RAG][Backup] Ignorados: ${skipped.join(", ") || "nenhum"}`);
}

run().catch((error) => {
  console.error("[RAG][Backup] Falha:", error);
  process.exitCode = 1;
});
```

## README.md (chunk 1)

```text
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

- **PowerShell 5.1+** (pré-i
```

## README.md (chunk 2)

```text
scripts\start-dev.ps1
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

O bot r
```

## README.md (chunk 3)

```text
tificacoes proativas
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
```

## README.md (chunk 4)

```text
origem dos arquivos.
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
```

## start-dev.ps1 (chunk 1)

```text
# Script para Iniciar Dev Server - AVA Assistant v3.1
# Inicia o Vite dev server com Node.js
# Uso: .\scripts\start-dev.ps1

Write-Host "[INICIANDO DEV SERVER - AVA Assistant]" -ForegroundColor Cyan
Write-Host ""

# Verificar se pnpm está instalado
Write-Host "[1] Verificando ambiente..." -ForegroundColor Yellow
$pnpmCheck = pnpm --version 2>$null
if (-not $pnpmCheck) {
    Write-Host "[ERRO] pnpm nao esta instalado!" -ForegroundColor Red
    Write-Host "   Instale com: npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}
Write-Host "   [OK] pnpm versao: $pnpmCheck" -ForegroundColor Green

# Verificar se node_modules existe
Write-Host ""
Write-Host "[2] Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "   [AVISO] node_modules nao encontrado. Instalando..." -ForegroundColor Yellow
    pnpm install
    Write-Host "   [OK] Dependencias instaladas" -ForegroundColor Green
}
else {
    Write-Host "   [OK] node_modules ja existe" -ForegroundColor Green
}

# Executar verificação TypeScript
Write-Host ""
Write-Host "[3] Compilacao TypeScript..." -ForegroundColor Yellow
pnpm check
if ($LASTEXITCODE -ne 0) {
    Write-Host "[AVISO] pnpm check retornou erros" -ForegroundColor Yellow
    Write-Host "   Continuando mesmo assim..." -ForegroundColor Gray
}

# Iniciar servidor de desenvolvimento
Write-Host ""
Write-Host "[DEV SERVER INICIANDO EM 3 SECS]" -ForegroundColor Green
Write-Host ""
Write-Host "Acesse em: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Pressione CTRL+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

# Aguardar 3 segundos
Start-Sleep -Seconds 3

# Executar pnpm dev
pnpm dev
```

## start-prod.ps1 (chunk 1)

```text
# Script para Build e Modo Producao - AVA Assistant v3.1
# Constroi a aplicacao e inicia em modo producao
# Uso: .\scripts\start-prod.ps1

Write-Host "[BUILD E PRODUCAO - AVA Assistant]" -ForegroundColor Cyan
Write-Host ""

# Verificar se pnpm está instalado
Write-Host "[1] Verificando ambiente..." -ForegroundColor Yellow
$pnpmCheck = pnpm --version 2>$null
if (-not $pnpmCheck) {
    Write-Host "[ERRO] pnpm nao esta instalado!" -ForegroundColor Red
    Write-Host "   Instale com: npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}
Write-Host "   [OK] pnpm versao: $pnpmCheck" -ForegroundColor Green

# Verificar dependências
Write-Host ""
Write-Host "[2] Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "   [AVISO] Instalando dependencias..." -ForegroundColor Yellow
    pnpm install
}
Write-Host "   [OK] Dependencias OK" -ForegroundColor Green

# Verificação TypeScript
Write-Host ""
Write-Host "[3] Verificacao TypeScript..." -ForegroundColor Yellow
pnpm check
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Erro na compilacao TypeScript!" -ForegroundColor Red
    exit 1
}
Write-Host "   [OK] TypeScript OK" -ForegroundColor Green

# Build
Write-Host ""
Write-Host "[4] Construindo aplicacao..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Erro durante build!" -ForegroundColor Red
    exit 1
}
Write-Host "   [OK] Build concluido" -ForegroundColor Green

# Executar testes (opcional)
Write-Host ""
Write-Host "[5] Executando testes..." -ForegroundColor Yellow
pnpm test
if ($LASTEXITCODE -ne 0) {
    Write-Host "[AVISO] Alguns testes falharam" -ForegroundColor Yellow
}

# Iniciar servidor
Write-Host ""
Write-Host "[SERVIDOR PRODUCAO INICIANDO]" -ForegroundColor Green
Write-Hos
```

## start-prod.ps1 (chunk 2)

```text
s..." -ForegroundColor Yellow
pnpm test
if ($LASTEXITCODE -ne 0) {
    Write-Host "[AVISO] Alguns testes falharam" -ForegroundColor Yellow
}

# Iniciar servidor
Write-Host ""
Write-Host "[SERVIDOR PRODUCAO INICIANDO]" -ForegroundColor Green
Write-Host ""
Write-Host "Acesse em: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Pressione CTRL+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

# Aguardar 3 segundos
Start-Sleep -Seconds 3

# Iniciar servidor (ajuste conforme necessário)
# pnpm start  # Se tiver script 'start' definido
# ou
node dist/index.js  # Se tiver arquivo de entrada
```

## start-server.ps1 (chunk 1)

```text
# Script para iniciar o servidor completo
# Uso: powershell -ExecutionPolicy Bypass -File "scripts\start-server.ps1"

Write-Host "[INICIANDO SERVIDOR COMPLETO - AVA Assistant]" -ForegroundColor Cyan
Write-Host ""

# Limpar ambiente
Write-Host "[1] Limpando ambiente..." -ForegroundColor Yellow
& .\scripts\clean.ps1

Write-Host ""

# Matar processos anteriores
Write-Host "[2] Matando todos os processos anteriores..." -ForegroundColor Yellow
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Stop-Process -Name powershell -Force -ErrorAction SilentlyContinue
Stop-Process -Name pwsh -Force -ErrorAction SilentlyContinue
Write-Host "[OK] Processos finalizados" -ForegroundColor Green

Write-Host ""

# Liberar portas
Write-Host "[3] Liberando portas..." -ForegroundColor Yellow
$ports = @(5173, 5174, 3000, 3001, 8080)
foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "[OK] Portas liberadas" -ForegroundColor Green

Write-Host ""
Write-Host "[LIMPEZA CONCLUIDA]" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[INICIANDO VITE + BACKEND]" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Conectar em:" -ForegroundColor White
Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "  - Backend:  http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Para parar: Pressione CTRL+C" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

#
```

## start-server.ps1 (chunk 2)

```text
reen
Write-Host "  - Backend:  http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Para parar: Pressione CTRL+C" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Aguardar 2 segundos
Start-Sleep -Seconds 2

# Executar servidor
Write-Host "Iniciando pnpm dev..." -ForegroundColor Yellow
Write-Host ""

pnpm dev
```

## test-rag.ts (chunk 1)

```text
import "dotenv/config";
import { getDb } from "../server/db";
import {
  createDocument,
  createDocumentChunk,
  searchDocumentChunks,
  getDocuments,
  getDocumentChunks
} from "../server/db";
import { generateEmbedding } from "../server/_core/llm";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function testRagFlow() {
  console.log("Starting RAG Flow Test...");
  const db = await getDb();
  if (!db) throw new Error("DB not available");

  // 1. Get or Create Test User
  let user = (await db.select().from(users).where(eq(users.email, "test@example.com")).limit(1))[0];

  if (!user) {
    console.log("Creating test user...");
    const result = await db.insert(users).values({
      email: "test@example.com",
      name: "Test User",
      password: "hashed_password",
      role: "user",
      openId: "test-user-openid-123"
    }).returning();
    user = result[0];
  }

  const userId = user.id;
  console.log(`Using User ID: ${userId}`);

  // 2. Create Document
  console.log("Creating test document...");
  const docData = {
    name: "Ollama Documentation",
    type: "text/markdown",
    size: 1024,
    content: "Ollama allows you to run open-source large language models, such as Llama 2, locally.",
    status: "processing" as const
  };

  // Note: createDocument returns the result of db.insert, which in better-sqlite3 with returning() gives the object
  const docResult = await createDocument(userId, docData);
  // Type assertion or check might be needed depending on return type implementation
  const docId = (docResult as any).lastInsertRowid;
  console.log(`Document created with ID: ${docId}`);

  // 3. Generate Embedding & Create Chunk
  const text = "Ollama runs Llama 2 locally.";
  console.log(`Generating embedding for text:
```

## test-rag.ts (chunk 2)

```text
entation
  const docId = (docResult as any).lastInsertRowid;
  console.log(`Document created with ID: ${docId}`);

  // 3. Generate Embedding & Create Chunk
  const text = "Ollama runs Llama 2 locally.";
  console.log(`Generating embedding for text: "${text}"...`);

  // Force using an available model if default is missing
  if (!process.env.EMBEDDING_MODEL) {
    process.env.EMBEDDING_MODEL = "llama3.2:latest";
  }

  let embedding: number[] = [];
  try {
    embedding = await generateEmbedding(text, "ollama");
    console.log(`Embedding generated successfully. Length: ${embedding.length}`);
  } catch (error) {
    console.warn("Failed to generate embedding (Ollama might be down or model missing). Using mock embedding.");
    // Mock embedding for testing db insertion
    embedding = Array(768).fill(0).map(() => Math.random());
  }

  // 4. Save Chunk
  console.log("Saving document chunk...");
  await createDocumentChunk({
    documentId: docId,
    content: text,
    chunkIndex: 0,
    embedding: JSON.stringify(embedding)
  });

  // 5. Test Search
  console.log("Testing search...");
  const query = "run models locally";
  const searchResults = await searchDocumentChunks(userId, query, 3);

  console.log(`Search results for "${query}":`);
  searchResults.forEach((result, i) => {
    // @ts-ignore - score property added by search logic
    console.log(`${i + 1}. [Score: ${result.score?.toFixed(4)}] ${result.content}`);
  });

  if (searchResults.length > 0) {
    console.log("✅ RAG Flow Test Passed!");
  } else {
    console.log("⚠️ No results found. Check embedding generation or similarity logic.");
  }
}

testRagFlow().catch(console.error);
```
