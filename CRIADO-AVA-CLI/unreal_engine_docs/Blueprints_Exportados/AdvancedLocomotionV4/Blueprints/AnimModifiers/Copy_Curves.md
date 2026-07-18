# 🎮 Blueprint: Copy_Curves

**[Classe Pai / Parent Class: `AnimationModifier`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `AnimSequence` | `object (AnimSequence)` |
| `AnimToCopyFrom` | `object (AnimSequence)` |
| `CopyAllCurves` | `bool` |
| `CurvesToCopy` | `name` |
| `CurveName` | `name` |
| `AllCurves` | `name` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"This Anim Modifier simply copies curves from one animation to another."*

**Eventos de Entrada (Events):**
- 🟢 `OnApply`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `DoesCurveExist()`
- 🛠️ `GetFloatKeys()`
- 🛠️ `AddFloatCurveKeys()`
- 🛠️ `AddCurve()`
- 🛠️ `RemoveCurve()`

**Variáveis Manipuladas:**
- `Get AllCurves`
- `Get AnimSequence`
- `Get AnimToCopyFrom`
- `Get CopyAllCurves`
- `Get CurveName`
- `Get CurvesToCopy`
- `Set AnimSequence`
- `Set CurveName`

### 📌 Grafo: `ExecuteUbergraph_Copy_Curves`

**Comentários e Títulos de Seção Encontrados:**
- *"This Anim Modifier simply copies curves from one animation to another."*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*

**Eventos de Entrada (Events):**
- 🟢 `OnApply`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `DoesCurveExist()`
- 🛠️ `GetFloatKeys()`
- 🛠️ `AddFloatCurveKeys()`
- 🛠️ `AddCurve()`
- 🛠️ `RemoveCurve()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`

**Variáveis Manipuladas:**
- `Get AllCurves`
- `Get AnimSequence`
- `Get AnimToCopyFrom`
- `Get CopyAllCurves`
- `Get CurveName`
- `Get CurvesToCopy`
- `Set AnimSequence`
- `Set CurveName`

### 📌 Grafo: `OnApply`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Copy_Curves()`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `Copy_Curves`?
- Quais variáveis estão disponíveis no Blueprint `Copy_Curves`?
- Quais funções e eventos são chamados no grafo do `Copy_Curves`?