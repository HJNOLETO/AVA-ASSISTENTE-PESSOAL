# Guia pratico: Skills no chat do AVA

Este guia mostra como usar as novas habilidades (skills) diretamente no chat, com exemplos práticos.

## 1) O que mudou

Agora o chat pode ativar uma skill real da pasta `.opencode/skills` e usar as instrucoes dessa skill para moldar a resposta.

Em termos simples:

- voce escolhe a skill,
- a skill fica ativa,
- as respostas passam a seguir aquele estilo/especialidade.

## 2) Comandos disponiveis

No input do chat:

- `/skill list` -> lista skills reais disponiveis
- `/skill use <nome-da-skill>` -> ativa skill
- `/skill status` -> mostra skill ativa
- `/skill clear` -> desativa skill e volta ao padrao

## 3) Fluxo rapido de uso

1. Liste as skills:

```text
/skill list
```

2. Ative uma:

```text
/skill use ava-program-teacher
```

3. Faca sua pergunta normalmente:

```text
Explique o fluxo completo de chat e voz do AVA.
```

4. Verifique qual skill esta ativa:

```text
/skill status
```

5. Limpe quando quiser voltar ao modo padrao:

```text
/skill clear
```

## 4) Exemplos praticos

### Exemplo A: Professor do AVA

```text
/skill use ava-program-teacher
Onde eu altero o comportamento de leitura em voz alta?
```

O que esperar:

- resposta didatica,
- apontando arquivos relevantes,
- explicando fluxo e impacto de mudanca.

### Exemplo B: Professor de TypeScript

```text
/skill use typescript-teacher
Explique esse erro TS2802 e como corrigir corretamente no projeto.
```

O que esperar:

- explicacao tecnica de tipagem/target,
- passo a passo de correcao,
- exemplo aplicado ao codigo.

### Exemplo C: Professor de Python

```text
/skill use python-teacher
Me ensine a estruturar um script CLI para processamento de arquivos.
```

O que esperar:

- estrutura de script,
- boas praticas,
- exemplo progressivo.

### Exemplo D: Professor de Ingles

```text
/skill use english-teacher
Explique diferenca entre present perfect e simple past com exemplos.
```

O que esperar:

- foco linguistico,
- exemplos claros,
- exercicio curto.

### Exemplo E: Troca de skill no meio da sessao

```text
/skill use ava-program-teacher
Explique a arquitetura atual do chat.

/skill use legal-research-orchestrator
Agora responda como organizar pesquisa juridica por fontes oficiais.
```

O que esperar:

- mudanca imediata de estilo e criterio da resposta conforme skill ativa.

### Exemplo F: Professor da OAB (nova skill)

```text
/skill use professor-mestre-da-oab
Professor, me ensine revisao de Direito Constitucional para a 1a fase em 20 minutos.
```

```text
/skill use professor-mestre-da-oab
Treinar peca: mandado de seguranca na 2a fase. Quero estrutura, fundamentos e erros que tiram ponto.
```

O que esperar:

- foco em cobranca da FGV,
- linguagem de preparacao para prova,
- acao pratica ao final (treino/correcao/checklist).

## 5) Combinar skill com comandos de chat

Voce pode usar skill ativa junto com comandos existentes:

```text
/skill use ava-program-teacher
/plan melhorar pipeline de memoria RAG
```

```text
/skill use typescript-teacher
/debug erro de tipagem no roteador do chat
```

## 6) Boas praticas

- Sempre use `/skill status` antes de uma tarefa importante.
- Troque skill quando mudar de dominio (juridico, programacao, idioma, etc.).
- Use `/skill clear` ao finalizar um bloco de trabalho para evitar vies de resposta em temas diferentes.

## 7) Solucao de problemas

### "Skill nao encontrada"

Use:

```text
/skill list
```

E copie o nome exatamente como aparece.

### "Nao senti mudanca na resposta"

Checklist:

1. Confirme com `/skill status`.
2. Reenvie a pergunta com objetivo claro.
3. Evite prompt muito generico (ex.: "fale disso").

## 8) Resumo rapido (cola)

```text
/skill list
/skill use <nome>
/skill status
/skill clear
```

Com isso, voce controla o perfil de resposta do AVA de forma real e imediata no proprio chat.
