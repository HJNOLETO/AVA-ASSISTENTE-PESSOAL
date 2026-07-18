# 🎮 Blueprint: BP_Zone_Holds

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `NearHolds` | `object (Actor)` |
| `DebugArrows` | `object (ArrowComponent)` |
| `Is Top Hold` | `bool` |
| `FarHolds` | `object (Actor)` |
| `Max Climbing Distance` | `real (double)` |
| `Is Bottom Hold` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay` — *지금 이 노드는 비활성 상태입니다.\n핀을 끌어서 다른 노드를 연결하면 활성화됩니다.*
- 🟢 `ReceiveActorBeginOverlap` — *지금 이 노드는 비활성 상태입니다.\n핀을 끌어서 다른 노드를 연결하면 활성화됩니다.*
- 🟢 `ReceiveTick` — *지금 이 노드는 비활성 상태입니다.\n핀을 끌어서 다른 노드를 연결하면 활성화됩니다.*
- 🟢 `BndEvt__Trigger_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__Trigger_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `GetCustomMovement()`
- 🛠️ `EndOverlappedCustomMoveZone()`
- 🛠️ `BeginOverlappedCustomMoveZone()`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateDebugArrows()`

### 📌 Grafo: `UpdateNearHolds`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetAllActorsOfClass()`
- 🛠️ `NotEqual_ObjectObject()`
- 🛠️ `GetHoldLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `UpdateDebugArrows()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `GetHoldRotation()`
- 🛠️ `GetForwardVector()`
- 🛠️ `Dot_VectorVector()`

**Variáveis Manipuladas:**
- `Get Local HoldsList`
- `Get Local Start Hold`
- `Get Local Target Hold`
- `Get Max Climbing Distance`
- `Get NearHolds`
- `Set Local HoldsList`
- `Set Local Start Hold`
- `Set Local Target Hold`

### 📌 Grafo: `UpdateDebugArrows`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `VSize()`
- 🛠️ `K2_SetWorldLocationAndRotation()`
- 🛠️ `SetRelativeScale3D()`
- 🛠️ `SetArrowColor()`
- 🛠️ `K2_DestroyComponent()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `GetUpVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GetRightVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetForwardVector()`
- 🛠️ `SelectFloat()`
- 🛠️ `K2_GetRootComponent()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get DebugArrows`
- `Get FarHolds`
- `Get NearHolds`
- `Get Temp Arrow Component`
- `Get Temp ArrowOffset_Y`
- `Get Temp ArrowOffset_Z`
- `Get Temp Holds`
- `Set Temp Arrow Component`
- `Set Temp ArrowOffset_Y`
- `Set Temp ArrowOffset_Z`

### 📌 Grafo: `GetHoldRotation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`

### 📌 Grafo: `GetHoldLocation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_GetComponentLocation()`

**Variáveis Manipuladas:**
- `Get CharacterBaseLocation`

### 📌 Grafo: `CheckMoveToNextHold`

**Comentários e Títulos de Seção Encontrados:**
- *"Find the Hold closest to the input direction (입력방향과 가장 근접한 홀드를 찾기)"*
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `IsValid()`
- 🛠️ `Normal()`

**Variáveis Manipuladas:**
- `Get FarHolds`
- `Get NearHolds`
- `Get Temp Founded Hold`
- `Get Temp Founded Hold Dot`
- `Get Temp Hold`
- `Get Temp Hold Dot`
- `Get Temp Input Direction`
- `Set Temp Founded Hold`
- `Set Temp Founded Hold Dot`
- `Set Temp Hold`
- `Set Temp Hold Dot`
- `Set Temp Input Direction`

### 📌 Grafo: `CheckEnter`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `K2_GetComponentLocation()`

**Variáveis Manipuladas:**
- `Get CharacterBaseLocation`

### 📌 Grafo: `CheckExitToTop`

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Is Top Hold`

### 📌 Grafo: `CheckEnterToTop`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `GreaterEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Is Top Hold`
- `Get Top_Enter`

### 📌 Grafo: `GetTopEnterLocatoin`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Top_Enter`

### 📌 Grafo: `CheckExitToBottom`

**Funções e Métodos Chamados:**
- 🛠️ `Less_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Is Bottom Hold`

### 📌 Grafo: `ExecuteUbergraph_BP_Zone_Holds`

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__Trigger_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__Trigger_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `GetCustomMovement()`
- 🛠️ `EndOverlappedCustomMoveZone()`
- 🛠️ `BeginOverlappedCustomMoveZone()`

### 📌 Grafo: `BndEvt__Trigger_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Zone_Holds()`

### 📌 Grafo: `BndEvt__Trigger_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Zone_Holds()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateDebugArrows()`

### 📌 Grafo: `UpdateNearHolds_MERGED`

**Comentários e Títulos de Seção Encontrados:**
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
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetAllActorsOfClass()`
- 🛠️ `NotEqual_ObjectObject()`
- 🛠️ `GetHoldLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `UpdateDebugArrows()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `GetHoldRotation()`
- 🛠️ `GetForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`

**Variáveis Manipuladas:**
- `Get Local HoldsList`
- `Get Local Start Hold`
- `Get Local Target Hold`
- `Get Max Climbing Distance`
- `Get NearHolds`
- `Set Local HoldsList`
- `Set Local Start Hold`
- `Set Local Target Hold`

### 📌 Grafo: `UpdateDebugArrows_MERGED`

**Comentários e Títulos de Seção Encontrados:**
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
- 🔀 Contém `6` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `VSize()`
- 🛠️ `K2_SetWorldLocationAndRotation()`
- 🛠️ `SetRelativeScale3D()`
- 🛠️ `SetArrowColor()`
- 🛠️ `K2_DestroyComponent()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `GetUpVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GetRightVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetForwardVector()`
- 🛠️ `SelectFloat()`
- 🛠️ `K2_GetRootComponent()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `IsValid()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get DebugArrows`
- `Get FarHolds`
- `Get NearHolds`
- `Get Temp Arrow Component`
- `Get Temp ArrowOffset_Y`
- `Get Temp ArrowOffset_Z`
- `Get Temp Holds`
- `Set Temp Arrow Component`
- `Set Temp ArrowOffset_Y`
- `Set Temp ArrowOffset_Z`

### 📌 Grafo: `GetHoldRotation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`

### 📌 Grafo: `GetHoldLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_GetComponentLocation()`

**Variáveis Manipuladas:**
- `Get CharacterBaseLocation`

### 📌 Grafo: `CheckMoveToNextHold_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Find the Hold closest to the input direction (입력방향과 가장 근접한 홀드를 찾기)"*
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
- 🔀 Contém `7` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `IsValid()`
- 🛠️ `Normal()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`

**Variáveis Manipuladas:**
- `Get FarHolds`
- `Get NearHolds`
- `Get Temp Founded Hold`
- `Get Temp Founded Hold Dot`
- `Get Temp Hold`
- `Get Temp Hold Dot`
- `Get Temp Input Direction`
- `Set Temp Founded Hold`
- `Set Temp Founded Hold Dot`
- `Set Temp Hold`
- `Set Temp Hold Dot`
- `Set Temp Input Direction`

### 📌 Grafo: `CheckEnter_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `K2_GetComponentLocation()`

**Variáveis Manipuladas:**
- `Get CharacterBaseLocation`

### 📌 Grafo: `CheckExitToTop_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Is Top Hold`

### 📌 Grafo: `CheckEnterToTop_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `GreaterEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Is Top Hold`
- `Get Top_Enter`

### 📌 Grafo: `GetTopEnterLocatoin_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Top_Enter`

### 📌 Grafo: `CheckExitToBottom_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Less_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Is Bottom Hold`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_Zone_Holds`?
- Quais variáveis estão disponíveis no Blueprint `BP_Zone_Holds`?
- Quais funções e eventos são chamados no grafo do `BP_Zone_Holds`?