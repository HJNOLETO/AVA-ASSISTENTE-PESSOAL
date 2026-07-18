# PROMPT: Conversão do ProjetoGTA em Documentação Markdown para Estudo e RAG

---

## CONTEXTO

Você já tem acesso ao Unreal Engine 5.1 via Remote API/Python e já demonstrou capacidade de criar materiais, importar assets e manipular o editor programaticamente. Agora preciso que você use esse mesmo acesso para **extrair e documentar** o conteúdo do projeto `ProjetoGTA`, transformando Blueprints visuais em texto estruturado que sirva tanto para indexação no RAG da AVA quanto para estudo direto do usuário.

**Caminho do projeto:**
```
C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA
```

---

## OBJETIVO PRINCIPAL

Criar uma pasta exclusiva de documentação com subpastas organizadas, contendo arquivos `.md` que descrevem:
1. Todo o código C++ do projeto (já em texto, mas precisa de contexto explicativo)
2. Cada Blueprint relevante, com os nós convertidos em descrição textual didática
3. Espaço reservado para futuros tópicos de estudo (carros, bicicletas, outras mecânicas)

---

## ESTRUTURA DE PASTAS PROPOSTA

Crie a seguinte estrutura (ajuste nomes se encontrar convenção melhor no projeto):

```
Docs_ProjetoGTA_Estudo/
├── 00_Indice_Geral.md
├── 01_CodigoCpp/
│   ├── PPPirateCharacter.md
│   ├── PPGameMode.md
│   └── [demais classes C++ encontradas]
├── 02_Blueprints/
│   ├── AC_PlayerStatus.md
│   ├── BP_WeaponBase.md
│   ├── BP_Character.md
│   └── [demais Blueprints relevantes]
├── 03_Sistemas/
│   ├── Sistema_Vida_Stamina.md
│   ├── Sistema_Armas.md
│   ├── Sistema_HUD.md
│   └── Sistema_MenuRotativo.md
├── 04_TopicosFuturos/
│   ├── Adicionar_Carro.md          (placeholder, a preencher quando solicitado)
│   ├── Adicionar_Bicicleta.md      (placeholder, a preencher quando solicitado)
│   └── _modelo_topico_novo.md      (template para novos assuntos)
└── 05_GlossarioBlueprint/
    └── Nos_Comuns_Explicados.md
```

---

## COMO EXTRAIR O CONTEÚDO DOS BLUEPRINTS

Use o Python Remote API do Unreal Engine para:

1. Listar todos os Blueprints relevantes do projeto (priorize os que têm lógica de gameplay: personagem, armas, HUD, inimigos — ignore Blueprints puramente decorativos)
2. Para cada Blueprint, percorrer os Event Graphs e extrair:
   - Nome de cada nó (function call, event, branch, variable get/set)
   - Conexões entre nós (de onde vem o pino, para onde vai)
   - Valores literais configurados nos nós (números, strings, booleans)
   - Comentários que já existem no grafo (muitos BPs do projeto já têm comment boxes como "Sistema de Vida", "Sistema de Colete" — preserve esses títulos como seções)
3. Traduzir essa estrutura para **prosa explicativa em português**, não apenas lista de nós. Exemplo de formato esperado:

```markdown
## Sistema de Vida (Event Graph: AC_PlayerStatus)

Quando o jogo começa (Event BeginPlay), o componente inicializa a vida do jogador.

**O que acontece:**
1. A vida atual é definida com o valor máximo de vida (clamping com MIN para garantir
   que nunca passe do limite)
2. Esse valor é propagado para a UI através de [nome do binding/evento]

**Variáveis envolvidas:**
- `Vida Atual` (Float) — vida corrente do jogador
- `Vida Maxima` (Float) — limite superior, definido no editor

**Por que foi feito assim:**
[explicação do propósito do nó MIN — evitar overflow de vida ao curar, por exemplo]
```

---

## REGRAS IMPORTANTES PARA A DOCUMENTAÇÃO

1. **Priorize o "porquê" sobre o "o quê".** Não basta dizer "nó Branch verifica condição X" — explique o que essa condição representa no contexto do gameplay.

2. **Marque a origem de cada sistema.** Use a classificação:
   - `[ALS NATIVO]` — veio do ALSv4 original
   - `[ALS MODIFICADO]` — adaptado do ALS
   - `[CUSTOMIZADO]` — criado especificamente para este projeto
   - `[PLUGIN]` — de um plugin externo (ex: ChaosVehiclesPlugin)

3. **Cada arquivo `.md` deve ser autocontido.** Como será usado para RAG com chunks, evite depender excessivamente de "como vimos no arquivo anterior" — cada documento deve explicar o suficiente para ser entendido isoladamente.

4. **Tamanho de chunk amigável ao RAG.** Quebre cada `.md` em seções com `##` claras, de tamanho moderado (200-400 palavras por seção), para que o RAG indexe com chunking coerente sem cortar explicações no meio.

5. **Inclua exemplos de pergunta-resposta no final de cada arquivo de sistema**, no estilo:
   ```markdown
   ## Perguntas que este documento responde
   - Como funciona o sistema de stamina ao correr?
   - O que acontece quando o colete absorve dano?
   ```
   Isso ajuda tanto o usuário a navegar quanto melhora a recuperação semântica no RAG.

6. **Glossário de nós comuns** (`05_GlossarioBlueprint/Nos_Comuns_Explicados.md`): documente uma vez, de forma genérica, o que cada tipo de nó faz (Branch, Sequence, ForEachLoop, Cast To, Set Timer by Event, Clamp Float, etc.), para que o usuário aprenda Blueprint de forma transferível, não só sobre este projeto específico.

---

## ARQUIVOS DE TÓPICOS FUTUROS

Crie a subpasta `04_TopicosFuturos/` com um arquivo `_modelo_topico_novo.md` servindo de template, contendo a estrutura que qualquer novo assunto (carro, bicicleta, ou outro) deve seguir quando for solicitado:

```markdown
# [Nome do Tópico]

## Objetivo
[o que o usuário quer alcançar]

## Pré-requisitos no projeto
[o que já existe e pode ser reaproveitado]

## Passo a passo
[numerado, didático]

## Código C++ relevante (se aplicável)
[blocos de código]

## Blueprints relevantes (se aplicável)
[descrição dos nós necessários]

## Perguntas que este documento responde
[lista]
```

Quando o usuário pedir um tópico novo (ex: "como adicionar um carro"), você deve gerar um novo arquivo nessa pasta seguindo esse template, e não documentar dentro da raiz da pasta principal.

---

## VERIFICAÇÃO FINAL ESPERADA

Ao concluir, gere o arquivo `00_Indice_Geral.md` listando todos os documentos criados com uma linha de resumo de cada um, e confirme:

1. Quantos Blueprints foram processados com sucesso
2. Se algum Blueprint não pôde ser lido via Remote API (e por quê)
3. O caminho final da pasta `Docs_ProjetoGTA_Estudo/` para que o usuário possa apontar o `index-drive-sync.ts` para ela depois

---

## OBSERVAÇÃO SOBRE ESCOPO

Não modifique nenhum asset do projeto original — esta é uma tarefa de **leitura e documentação**, não de edição. Se precisar abrir um Blueprint para leitura via Remote API, garanta que nenhuma alteração seja salva de volta no `.uasset`.
