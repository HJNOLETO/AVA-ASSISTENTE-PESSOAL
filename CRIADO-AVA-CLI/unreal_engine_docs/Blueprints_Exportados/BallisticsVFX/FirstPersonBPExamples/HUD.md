# 🎮 Blueprint: HUD

**[Classe Pai / Parent Class: `HUD`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
*Nenhuma variável explícita declarada no painel de controle.*

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Draw crosshair in center of screen"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `ReceiveActorBeginOverlap` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `ReceiveTick` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `ReceiveDrawHUD`

**Funções e Métodos Chamados:**
- 🛠️ `DrawTexture()`
- 🛠️ `Divide_IntInt()`
- 🛠️ `Conv_IntToFloat()`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ExecuteUbergraph_HUD`

**Comentários e Títulos de Seção Encontrados:**
- *"Draw crosshair in center of screen"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveDrawHUD`

**Funções e Métodos Chamados:**
- 🛠️ `DrawTexture()`
- 🛠️ `Divide_IntInt()`
- 🛠️ `Conv_IntToFloat()`

### 📌 Grafo: `ReceiveDrawHUD`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_HUD()`

### 📌 Grafo: `UserConstructionScript_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `HUD`?
- Quais funções e eventos são chamados no grafo do `HUD`?