# 🎮 Blueprint: Calculate_RotationAmount

**[Classe Pai / Parent Class: `AnimationModifier`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `AnimSequence` | `object (AnimSequence)` |
| `CurveName` | `name` |
| `RootBoneName` | `name` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"This Anim Modifier calculates the change in root rotation and is used to create the \"*

**Eventos de Entrada (Events):**
- 🟢 `OnApply`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `DoesCurveExist()`
- 🛠️ `RemoveCurve()`
- 🛠️ `AddCurve()`
- 🛠️ `GetNumFrames()`
- 🛠️ `GetBonePoseForFrame()`
- 🛠️ `FinalizeBoneAnimation()`
- 🛠️ `AddFloatCurveKey()`
- 🛠️ `GetTimeAtFrame()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `GetRateScale()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `SelectInt()`
- 🛠️ `Abs()`
- 🛠️ `BreakTransform()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get AnimSequence`
- `Get CurveName`
- `Get RootBoneName`
- `Set AnimSequence`

### 📌 Grafo: `ExecuteUbergraph_Calculate_RotationAmount`

**Comentários e Títulos de Seção Encontrados:**
- *"This Anim Modifier calculates the change in root rotation and is used to create the \"*

**Eventos de Entrada (Events):**
- 🟢 `OnApply`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `DoesCurveExist()`
- 🛠️ `RemoveCurve()`
- 🛠️ `AddCurve()`
- 🛠️ `GetNumFrames()`
- 🛠️ `GetBonePoseForFrame()`
- 🛠️ `FinalizeBoneAnimation()`
- 🛠️ `AddFloatCurveKey()`
- 🛠️ `GetTimeAtFrame()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `GetRateScale()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `SelectInt()`
- 🛠️ `Abs()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `Add_IntInt()`
- 🛠️ `BreakRotator()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get AnimSequence`
- `Get CurveName`
- `Get RootBoneName`
- `Set AnimSequence`

### 📌 Grafo: `OnApply`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Calculate_RotationAmount()`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `Calculate_RotationAmount`?
- Quais variáveis estão disponíveis no Blueprint `Calculate_RotationAmount`?
- Quais funções e eventos são chamados no grafo do `Calculate_RotationAmount`?