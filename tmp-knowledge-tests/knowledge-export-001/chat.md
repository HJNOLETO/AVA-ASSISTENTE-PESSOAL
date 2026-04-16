# Knowledge package: process-text.ts

- Source: `C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\scripts\process-text.ts`
- Chunks: 6
- Generated: 2026-04-07T19:21:20.926Z

## Suggested usage
Use the context below as the only source. If information is missing, state it clearly.

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
