# 🎮 Blueprint: UMG_Inventory

**[Classe Pai / Parent Class: `UserWidget`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
*Nenhuma variável explícita declarada no painel de controle.*

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `PreConstruct` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `Construct`
- 🟢 `Tick` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*

### 📌 Grafo: `Get Selection Option`

**Funções e Métodos Chamados:**
- 🛠️ `GetCurrentIndex()`

**Variáveis Manipuladas:**
- `Get UMG_RadialMenu`

### 📌 Grafo: `GetWeaponName`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Get Current Weapon Index`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Get WeaponSystem`

### 📌 Grafo: `ExecuteUbergraph_UMG_Inventory`

**Eventos de Entrada (Events):**
- 🟢 `Construct`

### 📌 Grafo: `Construct`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_UMG_Inventory()`

### 📌 Grafo: `Get Selection Option_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetCurrentIndex()`

**Variáveis Manipuladas:**
- `Get UMG_RadialMenu`

### 📌 Grafo: `GetWeaponName_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Current Weapon Index`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Get WeaponSystem`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `UMG_Inventory`?
- Quais funções e eventos são chamados no grafo do `UMG_Inventory`?