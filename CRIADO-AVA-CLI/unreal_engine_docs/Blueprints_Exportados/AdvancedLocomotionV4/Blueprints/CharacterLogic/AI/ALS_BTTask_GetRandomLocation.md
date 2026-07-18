# 🎮 Blueprint: ALS_BTTask_GetRandomLocation

**[Classe Pai / Parent Class: `BTTask_BlueprintBase`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Radius` | `real (float)` |
| `Location` | `struct (Vector)` |
| `MoveToLocation` | `struct (BlackboardKeySelector)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveExecuteAI`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_GetRandomReachablePointInRadius()`
- 🛠️ `SetBlackboardValueAsVector()`
- 🛠️ `FinishExecute()`

**Variáveis Manipuladas:**
- `Get Location`
- `Get MoveToLocation`
- `Get Radius`
- `Set Location`

### 📌 Grafo: `ExecuteUbergraph_ALS_BTTask_GetRandomLocation`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveExecuteAI`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_GetRandomReachablePointInRadius()`
- 🛠️ `SetBlackboardValueAsVector()`
- 🛠️ `FinishExecute()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Location`
- `Get MoveToLocation`
- `Get Radius`
- `Set Location`

### 📌 Grafo: `ReceiveExecuteAI`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_BTTask_GetRandomLocation()`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `ALS_BTTask_GetRandomLocation`?
- Quais variáveis estão disponíveis no Blueprint `ALS_BTTask_GetRandomLocation`?
- Quais funções e eventos são chamados no grafo do `ALS_BTTask_GetRandomLocation`?