# 🎮 Blueprint: ALS_PlayerCameraBehavior

**[Classe Pai / Parent Class: `AnimInstance`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `PlayerController` | `object (PlayerController)` |
| `ControlledPawn` | `object (Pawn)` |
| `MovementState` | `byte (ALS_MovementState)` |
| `MovementAction` | `byte (ALS_MovementAction)` |
| `RotationMode` | `byte (ALS_RotationMode)` |
| `Gait` | `byte (ALS_Gait)` |
| `Stance` | `byte (ALS_Stance)` |
| `ViewMode` | `byte (ALS_ViewMode)` |
| `RightShoulder` | `bool` |
| `DebugView` | `bool` |
| `CameraChange` | `int` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `UpdateCharacterInfo`

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Get_CurrentStates()`
- 🛠️ `BPI_Get_DebugInfo()`
- 🛠️ `BPI_Get_CameraParameters()`

**Variáveis Manipuladas:**
- `Get ControlledPawn`
- `Get PlayerController`
- `Set DebugView`
- `Set Gait`
- `Set MovementAction`
- `Set MovementState`
- `Set RightShoulder`
- `Set RotationMode`
- `Set Stance`
- `Set ViewMode`

### 📌 Grafo: `AnimGraphNode_StateMachine_0`

**Comentários e Títulos de Seção Encontrados:**
- *"Agachando"*
- *"Levantado"*
- *"Agachando"*
- *"Levantado"*
- *"Múltiplas posições da câmera"*

**Variáveis Manipuladas:**
- `Get CameraChange`
- `Get Gait`
- `Get Stance`

### 📌 Grafo: `AnimGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Main Camera States"*
- *"Shoulder Swap"*
- *"First Person"*
- *"Ragdoll Override"*
- *"Debug View Override"*
- *"Movement Action Overrides"*

**Variáveis Manipuladas:**
- `Get DebugView`
- `Get MovementAction`
- `Get MovementState`
- `Get RightShoulder`
- `Get ViewMode`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Get info from the character each frame to use in the camera graph."*

**Eventos de Entrada (Events):**
- 🟢 `BlueprintUpdateAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateCharacterInfo()`

### 📌 Grafo: `AnimGraph__AnimFunc`

### 📌 Grafo: `ExecuteUbergraph_ALS_PlayerCameraBehavior`

**Comentários e Títulos de Seção Encontrados:**
- *"Get info from the character each frame to use in the camera graph."*

**Eventos de Entrada (Events):**
- 🟢 `BlueprintUpdateAnimation`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByEnum_76A63B7C46EF3A1A27F5C5B773BA97B1`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByBool_E47B6539431BAD753F8875A744F38260`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByEnum_314131714E5E897BE96CF1AE5670BE88`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByBool_AD7342AD46931CF9FCD2BFA4B463C0BD`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByEnum_DE885E99451AF4BF76CD26B1A91921A9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByEnum_7EEC52F1432CBC37FEF504AC8507C865`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByEnum_5F710C7744BEF3CA5DF6E3BE39524CC9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByEnum_93AC2E0D4AC42A4DF858818F5EA3C36E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByEnum_B68D023E4D2903C88ABE319B54A23952`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_ModifyCurve_6EBB5C74401A7E162EFBA08C4DDECCF9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_ModifyCurve_B597835147A6EFCE4B29ACBE9CDEE72A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByEnum_BB63C41F46FDAD8D48D7B18E69E1F9E8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByEnum_38E5144D4B9DADEB12D72ABDFE9452D4`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_ModifyCurve_653A60E84E95E549694EB1BFCBD30ACF`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByEnum_09C981724D6476B6CD786CA8DDB37147`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByEnum_E58BC97D48FFA89CB30530A8E60D6E6B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_BlendListByEnum_B739A7FA4B6AF89E02C335A5505826CA`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_TransitionResult_0D30AFC6461B5834DDD33588DB08FD2B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_TransitionResult_12E957984E9E8E18C540A197CA5611D7`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_TransitionResult_C201AD03413A706ECFD533B5BE53C5AD`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateCharacterInfo()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get CameraChange`
- `Get DebugView`
- `Get Gait`
- `Get MovementAction`
- `Get MovementState`
- `Get RightShoulder`
- `Get RotationMode`
- `Get Stance`
- `Get ViewMode`

### 📌 Grafo: `AnimationStateGraph_1`

**Comentários e Títulos de Seção Encontrados:**
- *"Agachando"*
- *"Levantado"*
- *"Múltiplas posições da câmera"*

### 📌 Grafo: `AnimationStateGraph_2`

**Comentários e Títulos de Seção Encontrados:**
- *"Agachando"*
- *"Levantado"*

### 📌 Grafo: `BlueprintUpdateAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_PlayerCameraBehavior()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_TransitionResult_C201AD03413A706ECFD533B5BE53C5AD`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_PlayerCameraBehavior()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_TransitionResult_12E957984E9E8E18C540A197CA5611D7`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_PlayerCameraBehavior()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_TransitionResult_0D30AFC6461B5834DDD33588DB08FD2B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_PlayerCameraBehavior()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_ModifyCurve_653A60E84E95E549694EB1BFCBD30ACF`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_PlayerCameraBehavior()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_ModifyCurve_B597835147A6EFCE4B29ACBE9CDEE72A`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_PlayerCameraBehavior()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_PlayerCameraBehavior_AnimGraphNode_ModifyCurve_6EBB5C74401A7E162EFBA08C4DDECCF9`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_PlayerCameraBehavior()`

### 📌 Grafo: `UpdateCharacterInfo_MERGED`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Get_CurrentStates()`
- 🛠️ `BPI_Get_DebugInfo()`
- 🛠️ `BPI_Get_CameraParameters()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get ControlledPawn`
- `Get PlayerController`
- `Set DebugView`
- `Set Gait`
- `Set MovementAction`
- `Set MovementState`
- `Set RightShoulder`
- `Set RotationMode`
- `Set Stance`
- `Set ViewMode`

### 📌 Grafo: `AnimGraph__AnimFunc_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `ALS_PlayerCameraBehavior`?
- Quais variáveis estão disponíveis no Blueprint `ALS_PlayerCameraBehavior`?
- Quais funções e eventos são chamados no grafo do `ALS_PlayerCameraBehavior`?