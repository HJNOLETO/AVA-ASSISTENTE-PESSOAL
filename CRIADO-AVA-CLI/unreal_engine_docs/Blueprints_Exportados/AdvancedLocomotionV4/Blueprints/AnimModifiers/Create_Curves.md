# 🎮 Blueprint: Create_Curves

**[Classe Pai / Parent Class: `AnimationModifier`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `AnimSequence` | `object (AnimSequence)` |
| `CurveParams` | `struct (AnimCurveCreationParams)` |
| `CurvesToCreate` | `struct (AnimCurveCreationParams)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"This Anim Modifier simply creates the defined curves. By selecting multiple assets in the content browser and applying a modifier by right clicking, you can easily create a set of curves across multiple animations."*

**Eventos de Entrada (Events):**
- 🟢 `OnApply`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `DoesCurveExist()`
- 🛠️ `RemoveCurve()`
- 🛠️ `AddFloatCurveKey()`
- 🛠️ `AddCurve()`
- 🛠️ `GetTimeAtFrame()`
- 🛠️ `GetNumFrames()`
- 🛠️ `Subtract_IntInt()`

**Variáveis Manipuladas:**
- `Get AnimSequence`
- `Get CurveParams`
- `Get CurvesToCreate`
- `Set AnimSequence`
- `Set CurveParams`

### 📌 Grafo: `ExecuteUbergraph_Create_Curves`

**Comentários e Títulos de Seção Encontrados:**
- *"This Anim Modifier simply creates the defined curves. By selecting multiple assets in the content browser and applying a modifier by right clicking, you can easily create a set of curves across multiple animations."*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*

**Eventos de Entrada (Events):**
- 🟢 `OnApply`
- 🔀 Contém `5` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `DoesCurveExist()`
- 🛠️ `RemoveCurve()`
- 🛠️ `AddFloatCurveKey()`
- 🛠️ `AddCurve()`
- 🛠️ `GetTimeAtFrame()`
- 🛠️ `GetNumFrames()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`

**Variáveis Manipuladas:**
- `Get AnimSequence`
- `Get CurveParams`
- `Get CurvesToCreate`
- `Set AnimSequence`
- `Set CurveParams`

### 📌 Grafo: `OnApply`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Create_Curves()`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `Create_Curves`?
- Quais variáveis estão disponíveis no Blueprint `Create_Curves`?
- Quais funções e eventos são chamados no grafo do `Create_Curves`?