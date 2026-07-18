# 🎮 Blueprint: FirstPersonGameMode

**[Classe Pai / Parent Class: `GameMode`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Global Gravity` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `GetAllActorsOfClass()`
- 🛠️ `FilterArray()`

**Variáveis Manipuladas:**
- `Get GlobalGravityZ`
- `Get bGlobalGravitySet`
- `Set Global Gravity`

### 📌 Grafo: `ExecuteUbergraph_FirstPersonGameMode`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonGameMode()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetAllActorsOfClass()`
- 🛠️ `FilterArray()`

**Variáveis Manipuladas:**
- `Get GlobalGravityZ`
- `Get bGlobalGravitySet`
- `Set Global Gravity`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `FirstPersonGameMode`?
- Quais variáveis estão disponíveis no Blueprint `FirstPersonGameMode`?
- Quais funções e eventos são chamados no grafo do `FirstPersonGameMode`?