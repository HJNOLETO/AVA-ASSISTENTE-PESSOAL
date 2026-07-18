# 🎮 Blueprint: BP_Armour

**[Classe Pai / Parent Class: `BP_PickupObject_C`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
*Nenhuma variável explícita declarada no painel de controle.*

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Executar apenas uma vez?"*
- *"Está ativo?"*

**Eventos de Entrada (Events):**
- 🟢 `Interact`
- 🟢 `ResetDoOnce`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetComponents()`
- 🛠️ `K2_DestroyActor()`
- 🛠️ `SetArmour()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get DoOnce`
- `Get IsActive`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ExecuteUbergraph_BP_Armour`

**Comentários e Títulos de Seção Encontrados:**
- *"Executar apenas uma vez?"*
- *"Está ativo?"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `Interact`
- 🟢 `ResetDoOnce`
- 🔀 Contém `5` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetComponents()`
- 🛠️ `K2_DestroyActor()`
- 🛠️ `SetArmour()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get DoOnce`
- `Get IsActive`

### 📌 Grafo: `ResetDoOnce`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Armour()`

### 📌 Grafo: `Interact`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Armour()`

### 📌 Grafo: `UserConstructionScript_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_Armour`?
- Quais funções e eventos são chamados no grafo do `BP_Armour`?