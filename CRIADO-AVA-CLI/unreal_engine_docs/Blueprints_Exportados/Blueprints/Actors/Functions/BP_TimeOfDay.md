# 🎮 Blueprint: BP_TimeOfDay

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `SunLight` | `object (DirectionalLight)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `ReceiveActorBeginOverlap` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `ReceiveTick` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `TimeOfDay`

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetActorRotation()`
- 🛠️ `MakeRotator()`
- 🛠️ `MapRangeClamped()`

**Variáveis Manipuladas:**
- `Get SunLight`

### 📌 Grafo: `ExecuteUbergraph_BP_TimeOfDay`

### 📌 Grafo: `UserConstructionScript_MERGED`

### 📌 Grafo: `TimeOfDay_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetActorRotation()`
- 🛠️ `MakeRotator()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get SunLight`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_TimeOfDay`?
- Quais variáveis estão disponíveis no Blueprint `BP_TimeOfDay`?
- Quais funções e eventos são chamados no grafo do `BP_TimeOfDay`?