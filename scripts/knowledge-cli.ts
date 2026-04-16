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
  teaching_note?: string;
};

type FileConstructs = {
  classes: string[];
  interfaces: string[];
  functions: string[];
  hooks: string[];
  imports: number;
  exports: number;
  hasApiRoute: boolean;
  hasSql: boolean;
  hasTests: boolean;
};

type DidacticNote = {
  file: string;
  file_type: EntryType;
  language: string;
  utility_explanation: string;
  pedagogical_focus: string;
  constructs: FileConstructs;
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

function uniqueTop(items: string[], max = 8): string[] {
  return Array.from(new Set(items)).slice(0, max);
}

function detectConstructs(text: string, language: string, relativePath: string): FileConstructs {
  const classes = uniqueTop(Array.from(text.matchAll(/\bclass\s+([A-Za-z_$][\w$]*)/g)).map((m) => m[1]));
  const interfaces = uniqueTop(Array.from(text.matchAll(/\binterface\s+([A-Za-z_$][\w$]*)/g)).map((m) => m[1]));
  const fnByDeclaration = Array.from(text.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)).map((m) => m[1]);
  const fnByArrow = Array.from(text.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g)).map((m) => m[1]);
  const functions = uniqueTop([...fnByDeclaration, ...fnByArrow]);
  const hooks = uniqueTop(Array.from(text.matchAll(/\buse[A-Z][A-Za-z0-9_]+\b/g)).map((m) => m[0]));
  const imports = (text.match(/^\s*import\s+/gm) ?? []).length;
  const exports = (text.match(/^\s*export\s+/gm) ?? []).length;
  const hasApiRoute = /\b(router|route|endpoint|controller|app\.(get|post|put|delete|patch))\b/i.test(text);
  const hasSql = /(\bselect\b[\s\S]{0,120}\bfrom\b)|(\binsert\s+into\b)|(\bupdate\s+[a-zA-Z0-9_."`]+\s+set\b)|(\bdelete\s+from\b)|(\bwhere\b[\s\S]{0,120}\b(and|or)\b)/i.test(text);
  const hasTests = /\.test\.|\.spec\.|\bdescribe\(|\bit\(|\bexpect\(/i.test(relativePath + '\n' + text);

  if (language === 'sql') {
    return {
      classes: [],
      interfaces: [],
      functions: [],
      hooks: [],
      imports: 0,
      exports: 0,
      hasApiRoute: false,
      hasSql: true,
      hasTests,
    };
  }

  return { classes, interfaces, functions, hooks, imports, exports, hasApiRoute, hasSql, hasTests };
}

function buildUtilityExplanation(file: string, fileType: EntryType, language: string, constructs: FileConstructs): string {
  if (fileType === 'documentation') {
    return 'Este arquivo documenta o projeto, registrando contexto, instrucoes e decisoes que ajudam a entender o funcionamento geral.';
  }

  if (fileType === 'config') {
    return 'Este arquivo define configuracoes de ambiente, build, execucao ou integracao. Ele controla como o sistema sobe e se comporta.';
  }

  if (fileType === 'data_json') {
    return 'Este arquivo contem dados estruturados usados pela aplicacao. Serve como base para carregar informacoes e alimentar funcionalidades.';
  }

  if (fileType === 'internal_memory') {
    return 'Este arquivo parece parte de memoria/indice interno. Ele e util para operacao do sistema, mas nao representa regra de negocio principal.';
  }

  if (language === 'sql' || constructs.hasSql) {
    return 'Este arquivo contem logica de acesso ou manipulacao de dados no banco, definindo como informacoes sao consultadas e alteradas.';
  }

  const classPart = constructs.classes.length > 0
    ? `Possui classes como ${constructs.classes.slice(0, 3).join(', ')}, indicando modelagem de entidades e comportamento.`
    : '';
  const functionPart = constructs.functions.length > 0
    ? `Tambem traz funcoes como ${constructs.functions.slice(0, 4).join(', ')}, que implementam regras e fluxos.`
    : '';
  const routePart = constructs.hasApiRoute
    ? 'Ha sinais de rotas/controladores, sugerindo que este arquivo participa da camada de API.'
    : '';
  const testPart = constructs.hasTests
    ? 'Contem padroes de teste, servindo para validar comportamento e evitar regressao.'
    : '';

  const compact = [classPart, functionPart, routePart, testPart].filter(Boolean).join(' ');
  if (compact) {
    return `Arquivo de ${language} com papel tecnico no projeto. ${compact}`.trim();
  }

  return `Arquivo de ${language} com responsabilidade de implementacao e suporte ao funcionamento do projeto.`;
}

function buildPedagogicalFocus(fileType: EntryType, language: string, constructs: FileConstructs): string {
  if (fileType === 'documentation') {
    return 'Ao estudar, foque em objetivo do modulo, fluxos principais e termos de dominio citados no texto.';
  }
  if (fileType === 'config') {
    return 'Ao estudar, foque em quais parametros alteram comportamento, seguranca e deploy.';
  }
  if (fileType === 'data_json') {
    return 'Ao estudar, foque em estrutura das chaves, tipos de valor e como esses dados entram no fluxo da aplicacao.';
  }
  if (constructs.hasApiRoute) {
    return 'Ao estudar, acompanhe o caminho requisicao -> validacao -> regra -> resposta para entender a arquitetura.';
  }
  if (constructs.classes.length > 0) {
    return 'Ao estudar, foque em responsabilidades de cada classe e na colaboracao entre metodos e objetos.';
  }
  if (constructs.functions.length > 0) {
    return 'Ao estudar, foque na entrada, transformacao e saida de cada funcao para dominar o raciocinio do codigo.';
  }
  if (language === 'sql' || constructs.hasSql) {
    return 'Ao estudar, foque em quais tabelas sao lidas/escritas e quais filtros influenciam resultado e desempenho.';
  }
  return 'Ao estudar, foque no papel do arquivo dentro do projeto e em como ele se conecta com outros modulos.';
}

function buildDidacticNote(file: string, fileType: EntryType, language: string, text: string): DidacticNote {
  const constructs = detectConstructs(text, language, file);
  return {
    file,
    file_type: fileType,
    language,
    utility_explanation: buildUtilityExplanation(file, fileType, language, constructs),
    pedagogical_focus: buildPedagogicalFocus(fileType, language, constructs),
    constructs,
  };
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
    fs.writeFileSync(path.join(dir, fileName), `${moduleLines.join('\n').trim()}\n`, 'utf-8');
  }

  fs.writeFileSync(path.join(dir, 'README.md'), `${overviewLines.join('\n').trim()}\n`, 'utf-8');
  return dir;
}

function writeDidacticArtifacts(exportDir: string, sourcePath: string, notes: DidacticNote[]): {
  guidePath: string;
  jsonlPath: string;
} {
  const guidePath = path.join(exportDir, 'didactic-guide.md');
  const jsonlPath = path.join(exportDir, 'didactic-notes.jsonl');

  const lines: string[] = [];
  lines.push(`# Didactic guide: ${path.basename(sourcePath)}`);
  lines.push('');
  lines.push(`- Source: \`${sourcePath}\``);
  lines.push(`- Files analyzed: ${notes.length}`);
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## How to use in chat');
  lines.push('Use este guia para explicar fundamentos: utilidade de cada arquivo, formacao tecnica e conexoes entre modulos.');
  lines.push('');

  for (const note of notes) {
    lines.push(`## ${note.file}`);
    lines.push('');
    lines.push(`- Tipo: ${note.file_type}`);
    lines.push(`- Linguagem: ${note.language}`);
    lines.push(`- Utilidade: ${note.utility_explanation}`);
    lines.push(`- Foco didatico: ${note.pedagogical_focus}`);

    const listedConstructs: string[] = [];
    if (note.constructs.classes.length > 0) listedConstructs.push(`classes: ${note.constructs.classes.join(', ')}`);
    if (note.constructs.interfaces.length > 0) listedConstructs.push(`interfaces: ${note.constructs.interfaces.join(', ')}`);
    if (note.constructs.functions.length > 0) listedConstructs.push(`funcoes: ${note.constructs.functions.join(', ')}`);
    if (note.constructs.hooks.length > 0) listedConstructs.push(`hooks: ${note.constructs.hooks.join(', ')}`);
    if (note.constructs.imports > 0) listedConstructs.push(`imports: ${note.constructs.imports}`);
    if (note.constructs.exports > 0) listedConstructs.push(`exports: ${note.constructs.exports}`);
    if (note.constructs.hasApiRoute) listedConstructs.push('possui sinais de API/rotas');
    if (note.constructs.hasSql) listedConstructs.push('possui comandos SQL');
    if (note.constructs.hasTests) listedConstructs.push('possui padrao de teste');

    if (listedConstructs.length > 0) {
      lines.push(`- Estruturas detectadas: ${listedConstructs.join(' | ')}`);
    }

    lines.push('');
  }

  fs.writeFileSync(guidePath, `${lines.join('\n').trim()}\n`, 'utf-8');
  fs.writeFileSync(jsonlPath, `${notes.map((n) => JSON.stringify(n)).join('\n')}\n`, 'utf-8');

  return { guidePath, jsonlPath };
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
  console.log(`Arquivos/pastas excluidos: ${excluded.length}`);

  const chunkRecords: ChunkRecord[] = [];
  const perFileSummary: FileSummary[] = [];
  const didacticNotes: DidacticNote[] = [];

  for (const file of files) {
    const text = readFileText(file);
    const chunks = splitChunks(text, options.chunkSize, options.overlapChars);
    const fileType = classifyFile(file.relativePath);
    const language = inferLanguage(file.relativePath);
    const didacticNote = buildDidacticNote(file.relativePath, fileType, language, text);
    didacticNotes.push(didacticNote);

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
        teaching_note: didacticNote.utility_explanation,
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
  const didacticArtifacts = writeDidacticArtifacts(exportDir, options.targetPath, didacticNotes);

  if (options.mode === 'chat' || options.mode === 'both') {
    const chatMd = buildChatMarkdown(chunkRecords, options.targetPath);
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
      didactic_notes: didacticNotes.length,
    },
    included_files: perFileSummary,
    excluded_entries: excluded,
    generated_files: {
      tree: path.join(exportDir, 'tree.md'),
      module_summaries_dir: moduleSummariesDir,
      didactic_guide: didacticArtifacts.guidePath,
      didactic_notes_jsonl: didacticArtifacts.jsonlPath,
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
  console.log(`- ${didacticArtifacts.guidePath}`);
  console.log(`- ${didacticArtifacts.jsonlPath}`);
  console.log(`- ${path.join(exportDir, 'manifest.json')}`);
}

main().catch((error) => {
  console.error('Falha ao gerar pacote de conhecimento:', error);
  process.exitCode = 1;
});
