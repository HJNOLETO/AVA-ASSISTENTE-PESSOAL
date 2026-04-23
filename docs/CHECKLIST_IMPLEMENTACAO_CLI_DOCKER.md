# Checklist de Implementacao - CLI Docker

Documento criado a partir de `docs/IMPLEMENTACAO_CLI_DOCKER.md` para acompanhar a implementacao da base do AVA CLI isolado em Docker.

## 1) Estrutura CLI

- [x] Criar pasta `cli/` na raiz do projeto
- [x] Criar arquivo de entrada `cli/index.ts`
- [x] Implementar comando inicial `ask <query>` com `commander`
- [x] Integrar chamada ao `invokeLLM` usando provider `ollama`

## 2) Docker Sandbox

- [x] Criar `cli.Dockerfile` na raiz
- [x] Basear imagem em `node:20-alpine`
- [x] Configurar diretório de trabalho `/app`
- [x] Instalar dependencias com `pnpm`
- [x] Executar container com usuario nao-root (`USER node`)

## 3) Compose Dedicado ao CLI

- [x] Criar `docker-compose.cli.yml`
- [x] Adicionar servico `ava-cli`
- [x] Mapear codigo local e banco `sqlite_v2.db`
- [x] Mapear pasta `data` para sincronia de estado e logs

## 4) Hooks de Execucao Rapida

- [x] Criar atalho Windows `ask-ava.bat`
- [x] Criar atalho Unix `ask-ava.sh`
- [x] Configurar ambos para executar `ask` via `docker-compose.cli.yml`

## 5) Dependencias e Validacao

- [x] Garantir dependencia `commander` no projeto
- [x] Rodar validacao TypeScript (`pnpm check`)
- [x] Validar compose do CLI (`docker-compose -f docker-compose.cli.yml config`)
- [x] Testar chamada basica do CLI (`ask`) - comando inicializou e entrou no fluxo LLM

## 6) Observacoes de Execucao

- [ ] Build Docker concluido localmente (`docker-compose -f docker-compose.cli.yml build ava-cli`) - pendente por Docker Desktop daemon indisponivel no ambiente atual
