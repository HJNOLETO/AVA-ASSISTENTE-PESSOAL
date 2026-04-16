# Didactic guide: scripts

- Source: `C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\scripts`
- Files analyzed: 19
- Generated: 2026-04-07T21:23:33.358Z

## How to use in chat
Use este guia para explicar fundamentos: utilidade de cada arquivo, formacao tecnica e conexoes entre modulos.

## check_tags.js

- Tipo: source_code
- Linguagem: javascript
- Utilidade: Arquivo de javascript com papel tecnico no projeto. Tambem traz funcoes como stripJS, que implementam regras e fluxos.
- Foco didatico: Ao estudar, foque na entrada, transformacao e saida de cada funcao para dominar o raciocinio do codigo.
- Estruturas detectadas: funcoes: stripJS

## clean.ps1

- Tipo: other_text
- Linguagem: powershell
- Utilidade: Arquivo de powershell com responsabilidade de implementacao e suporte ao funcionamento do projeto.
- Foco didatico: Ao estudar, foque no papel do arquivo dentro do projeto e em como ele se conecta com outros modulos.

## drive-sync-manifest.json

- Tipo: internal_memory
- Linguagem: json
- Utilidade: Este arquivo parece parte de memoria/indice interno. Ele e util para operacao do sistema, mas nao representa regra de negocio principal.
- Foco didatico: Ao estudar, foque no papel do arquivo dentro do projeto e em como ele se conecta com outros modulos.

## drive_sync.py

- Tipo: source_code
- Linguagem: python
- Utilidade: Arquivo de python com responsabilidade de implementacao e suporte ao funcionamento do projeto.
- Foco didatico: Ao estudar, foque no papel do arquivo dentro do projeto e em como ele se conecta com outros modulos.
- Estruturas detectadas: imports: 4

## full-reset.ps1

- Tipo: other_text
- Linguagem: powershell
- Utilidade: Arquivo de powershell com responsabilidade de implementacao e suporte ao funcionamento do projeto.
- Foco didatico: Ao estudar, foque no papel do arquivo dentro do projeto e em como ele se conecta com outros modulos.

## import-drive-embeddings-to-memory.ts

- Tipo: source_code
- Linguagem: typescript
- Utilidade: Este arquivo contem logica de acesso ou manipulacao de dados no banco, definindo como informacoes sao consultadas e alteradas.
- Foco didatico: Ao estudar, foque na entrada, transformacao e saida de cada funcao para dominar o raciocinio do codigo.
- Estruturas detectadas: funcoes: parseArgs, resolveUserId, loadManifest, saveManifest, listJsonFiles, normalizeText, isInterestingItem, buildSourcePath | imports: 8 | possui comandos SQL

## index-drive-sync.ts

- Tipo: source_code
- Linguagem: typescript
- Utilidade: Este arquivo contem logica de acesso ou manipulacao de dados no banco, definindo como informacoes sao consultadas e alteradas.
- Foco didatico: Ao estudar, foque na entrada, transformacao e saida de cada funcao para dominar o raciocinio do codigo.
- Estruturas detectadas: funcoes: parseArgs, ensureNomicModelDefault, checkOllamaAvailable, loadManifest, saveManifest, getAllFiles, walk, mimeTypeFromFileName | imports: 9 | possui comandos SQL

## knowledge-cli.ts

- Tipo: source_code
- Linguagem: typescript
- Utilidade: Arquivo de typescript com papel tecnico no projeto. Tambem traz funcoes como parseArgs, toMode, sanitizeText, stripHtml, que implementam regras e fluxos. Ha sinais de rotas/controladores, sugerindo que este arquivo participa da camada de API.
- Foco didatico: Ao estudar, acompanhe o caminho requisicao -> validacao -> regra -> resposta para entender a arquitetura.
- Estruturas detectadas: funcoes: parseArgs, toMode, sanitizeText, stripHtml, inferLanguage, classifyFile, isTextCandidate, collectFiles | imports: 5 | possui sinais de API/rotas

## knowledge-manager.ts

- Tipo: source_code
- Linguagem: typescript
- Utilidade: Este arquivo contem logica de acesso ou manipulacao de dados no banco, definindo como informacoes sao consultadas e alteradas.
- Foco didatico: Ao estudar, foque na entrada, transformacao e saida de cada funcao para dominar o raciocinio do codigo.
- Estruturas detectadas: funcoes: parseArgs, nowIso, sha256, toPosix, decodeTextBuffer, normalizeText, logicalIdFromPath, guessProfile | imports: 9 | possui comandos SQL

## memory-pipeline.ts

- Tipo: source_code
- Linguagem: typescript
- Utilidade: Este arquivo contem logica de acesso ou manipulacao de dados no banco, definindo como informacoes sao consultadas e alteradas.
- Foco didatico: Ao estudar, foque na entrada, transformacao e saida de cada funcao para dominar o raciocinio do codigo.
- Estruturas detectadas: funcoes: parseArgs, sha256, toPosix, mimeTypeFromExt, buildOutputFileName, resolveUserId, listFilesRecursive, loadManifest | imports: 9 | possui comandos SQL

## menu.ps1

- Tipo: other_text
- Linguagem: powershell
- Utilidade: Arquivo de powershell com responsabilidade de implementacao e suporte ao funcionamento do projeto.
- Foco didatico: Ao estudar, foque no papel do arquivo dentro do projeto e em como ele se conecta com outros modulos.

## prepare-journal-memory.ts

- Tipo: source_code
- Linguagem: typescript
- Utilidade: Este arquivo contem logica de acesso ou manipulacao de dados no banco, definindo como informacoes sao consultadas e alteradas.
- Foco didatico: Ao estudar, foque na entrada, transformacao e saida de cada funcao para dominar o raciocinio do codigo.
- Estruturas detectadas: funcoes: parseArgs, resolveUserId, parseTitle, detectTranscriptError, fallbackFromError, llmAnalyze, toMarkdown, run | imports: 7 | possui comandos SQL

## process-text.ts

- Tipo: source_code
- Linguagem: typescript
- Utilidade: Arquivo de typescript com papel tecnico no projeto. Tambem traz funcoes como normalizeMarkdown, parseArgs, parseMode, splitSections, que implementam regras e fluxos.
- Foco didatico: Ao estudar, foque na entrada, transformacao e saida de cada funcao para dominar o raciocinio do codigo.
- Estruturas detectadas: funcoes: normalizeMarkdown, parseArgs, parseMode, splitSections, estimateWords, getTailWords, chunkSection, buildChunks | imports: 2

## rag-backup.ts

- Tipo: source_code
- Linguagem: typescript
- Utilidade: Arquivo de typescript com papel tecnico no projeto. Tambem traz funcoes como getDataDir, getBackupDir, nowStamp, resolveDatabaseFile, que implementam regras e fluxos.
- Foco didatico: Ao estudar, foque na entrada, transformacao e saida de cada funcao para dominar o raciocinio do codigo.
- Estruturas detectadas: funcoes: getDataDir, getBackupDir, nowStamp, resolveDatabaseFile, copyIfExists, run, pad | imports: 3

## README.md

- Tipo: documentation
- Linguagem: markdown
- Utilidade: Este arquivo documenta o projeto, registrando contexto, instrucoes e decisoes que ajudam a entender o funcionamento geral.
- Foco didatico: Ao estudar, foque em objetivo do modulo, fluxos principais e termos de dominio citados no texto.

## start-dev.ps1

- Tipo: other_text
- Linguagem: powershell
- Utilidade: Arquivo de powershell com responsabilidade de implementacao e suporte ao funcionamento do projeto.
- Foco didatico: Ao estudar, foque no papel do arquivo dentro do projeto e em como ele se conecta com outros modulos.

## start-prod.ps1

- Tipo: other_text
- Linguagem: powershell
- Utilidade: Arquivo de powershell com responsabilidade de implementacao e suporte ao funcionamento do projeto.
- Foco didatico: Ao estudar, foque no papel do arquivo dentro do projeto e em como ele se conecta com outros modulos.

## start-server.ps1

- Tipo: other_text
- Linguagem: powershell
- Utilidade: Arquivo de powershell com responsabilidade de implementacao e suporte ao funcionamento do projeto.
- Foco didatico: Ao estudar, foque no papel do arquivo dentro do projeto e em como ele se conecta com outros modulos.

## test-rag.ts

- Tipo: source_code
- Linguagem: typescript
- Utilidade: Este arquivo contem logica de acesso ou manipulacao de dados no banco, definindo como informacoes sao consultadas e alteradas.
- Foco didatico: Ao estudar, foque na entrada, transformacao e saida de cada funcao para dominar o raciocinio do codigo.
- Estruturas detectadas: funcoes: testRagFlow | imports: 6 | possui comandos SQL
