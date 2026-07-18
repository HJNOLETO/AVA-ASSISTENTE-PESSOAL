# 🎮 Blueprint: AM_MSCar01

**[Classe Pai / Parent Class: `VehicleAnimationInstance`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `FRDoor` | `real (double)` |
| `FLDoor` | `real (double)` |
| `RRDoor` | `real (double)` |
| `RLDoor` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `BlueprintUpdateAnimation` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*

**Funções e Métodos Chamados:**
- 🛠️ `TryGetPawnOwner()` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*

### 📌 Grafo: `AnimGraph`

**Funções e Métodos Chamados:**
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get FLDoor`
- `Get FRDoor`
- `Get RLDoor`
- `Get RRDoor`

### 📌 Grafo: `AnimGraph__AnimFunc`

### 📌 Grafo: `ExecuteUbergraph_AM_MSCar01`

**Eventos de Entrada (Events):**
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AM_MSCar01_AnimGraphNode_ModifyBone_8795BBB541904E8ED294E58C3046A759`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AM_MSCar01_AnimGraphNode_ModifyBone_B9E922E74B3CB3627B38A6A55E0A430D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AM_MSCar01_AnimGraphNode_ModifyBone_04737771409EED49A0C815B3E0152D07`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AM_MSCar01_AnimGraphNode_ModifyBone_8BDFA53E4254F7B7AFFC3E8BB795FC4E`

**Funções e Métodos Chamados:**
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get FLDoor`
- `Get FRDoor`
- `Get RLDoor`
- `Get RRDoor`

### 📌 Grafo: `AnimGraph__AnimFunc_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `AM_MSCar01`?
- Quais variáveis estão disponíveis no Blueprint `AM_MSCar01`?
- Quais funções e eventos são chamados no grafo do `AM_MSCar01`?