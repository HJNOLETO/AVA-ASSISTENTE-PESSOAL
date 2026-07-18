# 🎮 Blueprint: Create_LayeringCurves

**[Classe Pai / Parent Class: `AnimationModifier`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `AnimSequence` | `object (AnimSequence)` |
| `Curve` | `name` |
| `CurvesToCreate` | `name` |
| `DefaultValue` | `real (double)` |
| `KeyEachFrame` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"This Anim Modifier automatically creates all Layering Curves and is a great way to quickly add the necessary curves to the overlay animations."*

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
- `Get Curve`
- `Get CurvesToCreate`
- `Get DefaultValue`
- `Get KeyEachFrame`
- `Set AnimSequence`
- `Set Curve`

### 📌 Grafo: `ExecuteUbergraph_Create_LayeringCurves`

**Comentários e Títulos de Seção Encontrados:**
- *"This Anim Modifier automatically creates all Layering Curves and is a great way to quickly add the necessary curves to the overlay animations."*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*

**Eventos de Entrada (Events):**
- 🟢 `OnApply`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `DoesCurveExist()`
- 🛠️ `RemoveCurve()`
- 🛠️ `AddFloatCurveKey()`
- 🛠️ `AddCurve()`
- 🛠️ `GetTimeAtFrame()`
- 🛠️ `GetNumFrames()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `LessEqual_IntInt()`

**Variáveis Manipuladas:**
- `Get AnimSequence`
- `Get Curve`
- `Get CurvesToCreate`
- `Get DefaultValue`
- `Get KeyEachFrame`
- `Set AnimSequence`
- `Set Curve`

### 📌 Grafo: `OnApply`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Create_LayeringCurves()`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `Create_LayeringCurves`?
- Quais variáveis estão disponíveis no Blueprint `Create_LayeringCurves`?
- Quais funções e eventos são chamados no grafo do `Create_LayeringCurves`?