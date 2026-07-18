# 🎮 Blueprint: MovementAction_NotifyState

**[Classe Pai / Parent Class: `AnimNotifyState`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `MovementAction` | `byte (ALS_MovementAction)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `Received_NotifyBegin`

**Funções e Métodos Chamados:**
- 🛠️ `GetOwner()`
- 🛠️ `BPI_Set_MovementAction()`

**Variáveis Manipuladas:**
- `Get MovementAction`

### 📌 Grafo: `Received_NotifyEnd`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetOwner()`
- 🛠️ `BPI_Get_CurrentStates()`
- 🛠️ `BPI_Set_MovementAction()`

**Variáveis Manipuladas:**
- `Get MeshComp`
- `Get MovementAction`

### 📌 Grafo: `GetNotifyName`

**Variáveis Manipuladas:**
- `Get MovementAction`

### 📌 Grafo: `Received_NotifyBegin_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetOwner()`
- 🛠️ `BPI_Set_MovementAction()`

**Variáveis Manipuladas:**
- `Get MovementAction`

### 📌 Grafo: `Received_NotifyEnd_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetOwner()`
- 🛠️ `BPI_Get_CurrentStates()`
- 🛠️ `BPI_Set_MovementAction()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get MeshComp`
- `Get MovementAction`

### 📌 Grafo: `GetNotifyName_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetEnumeratorUserFriendlyName()`

**Variáveis Manipuladas:**
- `Get MovementAction`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `MovementAction_NotifyState`?
- Quais variáveis estão disponíveis no Blueprint `MovementAction_NotifyState`?
- Quais funções e eventos são chamados no grafo do `MovementAction_NotifyState`?