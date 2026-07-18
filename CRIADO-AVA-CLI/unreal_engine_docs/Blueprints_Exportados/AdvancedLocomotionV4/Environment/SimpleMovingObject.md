# 🎮 Blueprint: SimpleMovingObject

**[Classe Pai / Parent Class: `SimpleObjectBuilder_C`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `DeltaSeconds` | `real (double)` |
| `MovementCurve` | `object (CurveFloat)` |
| `StartPosition` | `real (double)` |
| `MovementDuration` | `real (double)` |
| `MovementDirection` | `int` |
| `WaitTime` | `real (double)` |
| `MovementTime` | `real (double)` |
| `CanMove` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"This blueprint was built off of the Movable Platform Blueprint created by drb1992, and adapted to use a curve asset for smooth movement.\r\n\r\nThe original BP can be found here - drbforums.unrealengine.com/community/community-content-tools-and-tutorials/65463-free-moving-platform-blueprint"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `NearlyEqual_FloatFloat()`
- 🛠️ `Delay()`
- 🛠️ `FClamp()`
- 🛠️ `UpdateObjectLocation()`

**Variáveis Manipuladas:**
- `Get CanMove`
- `Get DeltaSeconds`
- `Get Duration`
- `Get MovementDirection`
- `Get MovementTime`
- `Get Track`
- `Get WaitTime`
- `Set CanMove`
- `Set DeltaSeconds`
- `Set MovementDirection`
- `Set MovementTime`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateObjectLocation()`

**Variáveis Manipuladas:**
- `Get MovementDuration`
- `Get StartPosition`
- `Get Track`
- `Set Duration`
- `Set MovementTime`

### 📌 Grafo: `UpdateObjectLocation`

**Funções e Métodos Chamados:**
- 🛠️ `GetFloatValue()`
- 🛠️ `NormalizeToRange()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `GetLocationAtTime()`
- 🛠️ `K2_SetWorldLocation()`

**Variáveis Manipuladas:**
- `Get Duration`
- `Get MovementCurve`
- `Get MovementTime`
- `Get StaticMesh`
- `Get Track`

### 📌 Grafo: `ExecuteUbergraph_SimpleMovingObject`

**Comentários e Títulos de Seção Encontrados:**
- *"This blueprint was built off of the Movable Platform Blueprint created by drb1992, and adapted to use a curve asset for smooth movement.\r\n\r\nThe original BP can be found here - drbforums.unrealengine.com/community/community-content-tools-and-tutorials/65463-free-moving-platform-blueprint"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🔀 Contém `5` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `NearlyEqual_FloatFloat()`
- 🛠️ `Delay()`
- 🛠️ `FClamp()`
- 🛠️ `UpdateObjectLocation()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `Less_IntInt()`

**Variáveis Manipuladas:**
- `Get CanMove`
- `Get DeltaSeconds`
- `Get Duration`
- `Get MovementDirection`
- `Get MovementTime`
- `Get Track`
- `Get WaitTime`
- `Set CanMove`
- `Set DeltaSeconds`
- `Set MovementDirection`
- `Set MovementTime`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_SimpleMovingObject()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateObjectLocation()`

**Variáveis Manipuladas:**
- `Get MovementDuration`
- `Get StartPosition`
- `Get Track`
- `Set Duration`
- `Set MovementTime`

### 📌 Grafo: `UpdateObjectLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetFloatValue()`
- 🛠️ `NormalizeToRange()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `GetLocationAtTime()`
- 🛠️ `K2_SetWorldLocation()`

**Variáveis Manipuladas:**
- `Get Duration`
- `Get MovementCurve`
- `Get MovementTime`
- `Get StaticMesh`
- `Get Track`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `SimpleMovingObject`?
- Quais variáveis estão disponíveis no Blueprint `SimpleMovingObject`?
- Quais funções e eventos são chamados no grafo do `SimpleMovingObject`?