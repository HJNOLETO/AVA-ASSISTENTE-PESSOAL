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
const DEFAULT_MANAGER_DIR = path.join(DEFAULT_DATA_DIR, ".rag", "knowledge-manager");
const DEFAULT_MANIFEST = path.join(DEFAULT_MANAGER_DIR, "manifest.json");
const DEFAULT_REPORT = path.join(DEFAULT_MANAGER_DIR, "latest-report.md");

const SUPPORTED_EXTENSIONS = new Set([".txt", ".md", ".pdf"]);

function parseArgs() {
  const args = process.argv.slice(2);
  const values: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
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
