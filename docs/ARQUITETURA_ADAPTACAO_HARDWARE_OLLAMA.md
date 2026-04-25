# Arquitetura de Adaptacao ao Hardware (AVA + Ollama)

Data: 2026-04-25

## Objetivo

Garantir que o AVA rode bem em hardware simples e escale em hardware forte sem trocar a experiencia funcional.

Principio:

- o software se adapta ao hardware;
- o usuario nao perde as capacidades principais;
- o sistema prioriza estabilidade e previsibilidade antes de qualidade maxima.

## Problema observado

No estado anterior, o runtime podia entrar em timeout prolongado quando o modelo local exigia mais recursos que a maquina disponibilizava no momento.

Sintomas tipicos:

- CPU em 100% por longos periodos;
- latencia excessiva no `ollama /api/chat`;
- comandos de alto nivel do AVA sem retorno dentro do timeout.

## Estrategia implementada (primeira entrega)

Foi adicionada adaptacao dinamica no caminho de invocacao Ollama em `server/_core/llm.ts`.

### 1) Perfil adaptativo automatico

O sistema detecta o perfil de execucao com base em:

- memoria total (GB)
- memoria livre atual (GB)
- quantidade de CPUs logicas

Perfis:

- `full`: maquinas fortes
- `balanced`: maquinas intermediarias
- `safe`: maquinas limitadas ou sob pressao

Degradacao adicional:

- se memoria livre < 12% do total, o perfil cai 1 nivel (`full -> balanced`, `balanced -> safe`).

### 2) Ajuste automatico de parametros Ollama

O perfil controla:

- `num_ctx`
- `num_predict`
- `temperature`

Politica aplicada:

- `full`: preserva configuracao base
- `balanced`: limita contexto e resposta para reduzir custo computacional
- `safe`: limita mais agressivamente para garantir resposta

### 3) Selecao de modelo por perfil (opcional)

Sem quebrar compatibilidade, o sistema permite mapear modelo por perfil via `.env`:

- `OLLAMA_MODEL_FULL`
- `OLLAMA_MODEL_BALANCED`
- `OLLAMA_MODEL_SAFE`

Por padrao, se o usuario informar `--model`, esse valor e respeitado.
Se quiser forcar modelo do perfil mesmo com `--model`, usar:

- `AVA_OLLAMA_FORCE_PROFILE_MODEL=true`

## Variaveis de ambiente novas

- `AVA_OLLAMA_PROFILE=auto|full|balanced|safe`
  - `auto` (padrao): detecta hardware em runtime
  - outros valores: fixam o perfil
- `AVA_OLLAMA_FORCE_PROFILE_MODEL=true|false`
  - `false` (padrao): nao sobrescreve `--model`
- `OLLAMA_MODEL_FULL` (opcional)
- `OLLAMA_MODEL_BALANCED` (opcional)
- `OLLAMA_MODEL_SAFE` (opcional)
- `AVA_OLLAMA_RETRY_ON_TIMEOUT=true|false`
  - `true` (padrao): em timeout, faz 1 retry com `OLLAMA_MODEL_SAFE` (se configurado e diferente do atual)

## Exemplo recomendado para hardware simples

```env
AVA_OLLAMA_PROFILE=auto
AVA_OLLAMA_FORCE_PROFILE_MODEL=false

OLLAMA_MODEL=qwen2.5:7b-instruct
OLLAMA_MODEL_SAFE=llama3.2:3b

OLLAMA_NUM_CTX=4096
OLLAMA_NUM_PREDICT=0
OLLAMA_TEMPERATURE=0.2
```

Com esse setup, quando a maquina estiver sob pressao, o runtime tende a operar em modo `safe` com menor custo.

## Observabilidade

Foi adicionado log explicito por chamada:

`[LLM][Adaptive] perfil=... | modelo=... | num_ctx=... | num_predict=... | motivo=...`

Isso permite auditar se o sistema esta realmente se ajustando ao host.

## Proximos passos (fase 2 da adaptacao)

1. Persistir metricas por requisicao (latencia, timeout, perfil escolhido) em tabela SQLite.
2. Adicionar histerese temporal para evitar troca de perfil muito frequente.
3. Expor comando de diagnostico no CLI (`ava self-status`) com snapshot de perfil atual.
4. Criar testes automatizados cobrindo selecao de perfil e limites de parametros.
5. Expandir fallback em cascata com lista ordenada de modelos (nao apenas 1 retry).
