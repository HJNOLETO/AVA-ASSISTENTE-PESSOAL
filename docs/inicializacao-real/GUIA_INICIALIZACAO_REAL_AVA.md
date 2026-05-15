# Guia de Inicializacao Real do AVA (Docker + Ollama)

## Objetivo

Este documento explica, de forma didatica, como a inicializacao real do AVA esta ocorrendo no ambiente local, incluindo:

- ordem de execucao,
- comandos usados,
- validacoes obrigatorias,
- inconsistencias encontradas,
- como diagnosticar antes de subir o programa.

## Pasta exclusiva

Este guia foi salvo em uma pasta exclusiva para a trilha de inicializacao:

- `docs/inicializacao-real/`

## Visao geral da inicializacao

O AVA depende de dois servicos de host:

1. `Ollama` ativo (LLM local).
2. `Docker Desktop` ativo (runtime do `ava-cli` via compose).

No projeto, o fluxo de bootstrap esta concentrado em:

- `scripts/ensure-host-services.ts`

Esse script:

- verifica Ollama (`ollama list`),
- tenta iniciar Ollama automaticamente (`ollama serve`) se necessario,
- verifica Docker (`docker info`),
- tenta iniciar Docker Desktop automaticamente,
- derruba compose legados (`down --remove-orphans`),
- para containers em execucao que nao estao em lista de manutencao.

## Script-faísca de inicializacao do programa

Para o programa principal, o ponto de partida recomendado no repositório e:

- `start-ava.ps1`

Comando:

```powershell
.\start-ava.ps1
```

Esse script prepara `.env`, valida banco/tipos (quando checks habilitados) e abre server/client.

## Sessao de comandos (passo a passo)

Use esta sequencia para repetir a inicializacao como usuario final.

### 1) Entrar no projeto

```powershell
cd C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main
```

### 2) Validar runtime local

```powershell
node --version
pnpm --version
```

### 3) Validar Ollama

```powershell
ollama list
```

Se falhar, iniciar manualmente:

```powershell
ollama serve
```

### 4) Diagnosticar host (Ollama + Docker)

```powershell
pnpm host:doctor
```

Interprete o JSON:

- `ollama.status = up`: ok.
- `docker.status = up`: ok.
- `docker.status = partial/down`: Docker ainda nao pronto para execucao real.

### 5) Bootstrap do host (auto-correcao)

```powershell
pnpm host:bootstrap
```

Essa etapa tenta:

- iniciar Docker Desktop,
- aguardar daemon,
- derrubar compose antigos,
- parar containers nao utilizados.

### 6) Iniciar o programa (faísca)

```powershell
.\start-ava.ps1
```

## Inconsistencias reais observadas nesta rodada

Durante a inicializacao, os seguintes comportamentos reais apareceram:

1. `ollama list` inicialmente estourou timeout, mas depois ficou `up` em `host:doctor`.
2. Docker apresentou erros de daemon/API durante `docker info`:
   - `The system cannot find the file specified` (pipe do engine nao disponivel),
   - `500 Internal Server Error for API route and version` (cliente/daemon ainda nao negociado no startup).
3. Como efeito colateral, o bootstrap nao conseguiu concluir o fechamento de todos os servicos automaticamente em alguns ciclos, pois o daemon nao estabilizou a tempo.

## Ajuste tecnico aplicado no bootstrap

Foi aplicado ajuste em:

- `scripts/ensure-host-services.ts`

Melhoria implementada:

- fallback de versao de API Docker quando detectado erro de negociacao de versao (`requested API version` / `API route and version`).

Objetivo:

- reduzir falhas logo apos abrir Docker Desktop, quando cliente e daemon ainda estao dessincronizados.

## Como fechar servicos automaticos do Docker com seguranca

Quando Docker estabilizar, o proprio bootstrap deve encerrar servicos antigos. Se precisar fazer manualmente:

```powershell
docker compose -f docker-compose.study.yml down --remove-orphans
docker compose -f docker-compose.cli.yml down --remove-orphans
docker ps
```

Se restarem containers nao relacionados ao AVA, pare individualmente:

```powershell
docker container stop <container_id>
```

## Checklist rapido de sucesso

- `ollama list` responde sem erro.
- `docker info` responde sem erro.
- `pnpm host:doctor` retorna `ollama: up` e `docker: up`.
- `pnpm host:bootstrap` encerra compose antigos sem falha.
- `.\start-ava.ps1` sobe servidor/cliente.

## Observacao final

Este guia descreve inicializacao real, sem simulacao e sem silenciar falhas. Se o Docker estiver abrindo e subindo servicos automaticos, o caminho recomendado e sempre:

1. estabilizar daemon,
2. encerrar compose/container herdado,
3. iniciar AVA pelo script-faísca.
