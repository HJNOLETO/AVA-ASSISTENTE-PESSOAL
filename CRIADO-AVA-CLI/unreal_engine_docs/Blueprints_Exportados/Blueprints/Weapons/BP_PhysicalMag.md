# 🎮 Blueprint: BP_PhysicalMag

**[Classe Pai / Parent Class: `StaticMeshActor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Velocity` | `struct (Vector)` |
| `TimeToDestroy` | `real (double)` |
| `MagazineMesh` | `object (StaticMesh)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `SetSimulatePhysics()`
- 🛠️ `SetAllPhysicsLinearVelocity()`
- 🛠️ `K2_SetTimerDelegate()`

**Variáveis Manipuladas:**
- `Get StaticMeshComponent`
- `Get TimeToDestroy`
- `Get Velocity`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `SetStaticMesh()`

**Variáveis Manipuladas:**
- `Get MagazineMesh`
- `Get StaticMeshComponent`

### 📌 Grafo: `ExecuteUbergraph_BP_PhysicalMag`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `SetSimulatePhysics()`
- 🛠️ `SetAllPhysicsLinearVelocity()`
- 🛠️ `K2_SetTimerDelegate()`

**Variáveis Manipuladas:**
- `Get StaticMeshComponent`
- `Get TimeToDestroy`
- `Get Velocity`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_PhysicalMag()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `SetStaticMesh()`

**Variáveis Manipuladas:**
- `Get MagazineMesh`
- `Get StaticMeshComponent`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_PhysicalMag`?
- Quais variáveis estão disponíveis no Blueprint `BP_PhysicalMag`?
- Quais funções e eventos são chamados no grafo do `BP_PhysicalMag`?