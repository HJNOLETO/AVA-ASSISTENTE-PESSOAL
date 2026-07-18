# 🎮 Blueprint: BP_Zone_StretchableLadderFromTop

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Step Count` | `int` |
| `Step Height` | `real (double)` |
| `Step Half Width` | `real (double)` |
| `Step Width Scale` | `real (double)` |
| `Step Width Margin` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `FindClosestTopLocation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetRightVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `FindClosestPointOnSegment()`

**Variáveis Manipuladas:**
- `Get Step Half Width`
- `Get Top`

### 📌 Grafo: `GetBottomEnterLocation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `FindClosestBottomLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Bottom`

### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `ReceiveActorBeginOverlap` — *지금 이 노드는 비활성 상태입니다.\n핀을 끌어서 다른 노드를 연결하면 활성화됩니다.*
- 🟢 `ReceiveTick` — *지금 이 노드는 비활성 상태입니다.\n핀을 끌어서 다른 노드를 연결하면 활성화됩니다.*
- 🟢 `BndEvt__Box_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__Box_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `GetCustomMovement()`
- 🛠️ `EndOverlappedCustomMoveZone()`
- 🛠️ `BeginOverlappedCustomMoveZone()`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `K2_SetRelativeLocation()`
- 🛠️ `SetRelativeScale3D()`
- 🛠️ `GetComponentBounds()`
- 🛠️ `BreakVector()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `GetScaledBoxExtent()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get Bottom`
- `Get RelativeLocation`
- `Get RelativeScale3D`
- `Get Step Count`
- `Get Step Height`
- `Get Step Width Margin`
- `Get Step Width Scale`
- `Get TriggerBox`
- `Set Step Half Width`

### 📌 Grafo: `FindClosestBottomLocation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetRightVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `FindClosestPointOnSegment()`

**Variáveis Manipuladas:**
- `Get Bottom`
- `Get Step Half Width`

### 📌 Grafo: `FindClosestTopEnterLocation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetRightVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `FindClosestPointOnSegment()`

**Variáveis Manipuladas:**
- `Get Step Half Width`
- `Get Top_Enter`

### 📌 Grafo: `GetLadderLocation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `FindClosestTopLocation()`
- 🛠️ `FindClosestBottomLocation()`

### 📌 Grafo: `GetLadderRotation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`

### 📌 Grafo: `CheckExitToBottom`

### 📌 Grafo: `CheckExitToTop`

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()` — *Close to the top of the ladder\r\n(사다리 상단에 근접했는지 여부)*
- 🛠️ `FindClosestTopLocation()`

### 📌 Grafo: `CheckEnterToMiddle`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `FindClosestBottomLocation()`

### 📌 Grafo: `CheckEnterToBottom`

### 📌 Grafo: `CheckEnterToTop`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `FindClosestTopEnterLocation()`

### 📌 Grafo: `GetLadderStepHeight`

**Variáveis Manipuladas:**
- `Get Step Height`

### 📌 Grafo: `GetTopEnterLocation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `FindClosestTopEnterLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Top_Enter`

### 📌 Grafo: `ExecuteUbergraph_BP_Zone_StretchableLadderFromTop`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `BndEvt__Box_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__Box_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `GetCustomMovement()`
- 🛠️ `EndOverlappedCustomMoveZone()`
- 🛠️ `BeginOverlappedCustomMoveZone()`

### 📌 Grafo: `BndEvt__Box_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Zone_StretchableLadderFromTop()`

### 📌 Grafo: `BndEvt__Box_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Zone_StretchableLadderFromTop()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Zone_StretchableLadderFromTop()`

### 📌 Grafo: `UserConstructionScript_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `K2_SetRelativeLocation()`
- 🛠️ `SetRelativeScale3D()`
- 🛠️ `GetComponentBounds()`
- 🛠️ `BreakVector()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `GetScaledBoxExtent()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `Add_IntInt()`
- 🛠️ `MakeVector()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get Bottom`
- `Get RelativeLocation`
- `Get RelativeScale3D`
- `Get Step Count`
- `Get Step Height`
- `Get Step Width Margin`
- `Get Step Width Scale`
- `Get TriggerBox`
- `Set Step Half Width`

### 📌 Grafo: `FindClosestTopLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetRightVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `FindClosestPointOnSegment()`

**Variáveis Manipuladas:**
- `Get Step Half Width`
- `Get Top`

### 📌 Grafo: `FindClosestBottomLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetRightVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `FindClosestPointOnSegment()`

**Variáveis Manipuladas:**
- `Get Bottom`
- `Get Step Half Width`

### 📌 Grafo: `FindClosestTopEnterLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetRightVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `FindClosestPointOnSegment()`

**Variáveis Manipuladas:**
- `Get Step Half Width`
- `Get Top_Enter`

### 📌 Grafo: `GetLadderLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `FindClosestTopLocation()`
- 🛠️ `FindClosestBottomLocation()`

### 📌 Grafo: `GetLadderRotation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`

### 📌 Grafo: `CheckExitToBottom_MERGED`

### 📌 Grafo: `CheckExitToTop_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()` — *Close to the top of the ladder\r\n(사다리 상단에 근접했는지 여부)*
- 🛠️ `FindClosestTopLocation()`

### 📌 Grafo: `CheckEnterToMiddle_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `FindClosestBottomLocation()`

### 📌 Grafo: `CheckEnterToBottom_MERGED`

### 📌 Grafo: `CheckEnterToTop_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `FindClosestTopEnterLocation()`

### 📌 Grafo: `GetLadderStepHeight_MERGED`

**Variáveis Manipuladas:**
- `Get Step Height`

### 📌 Grafo: `GetTopEnterLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `FindClosestTopEnterLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Top_Enter`

### 📌 Grafo: `GetBottomEnterLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `FindClosestBottomLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Bottom`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_Zone_StretchableLadderFromTop`?
- Quais variáveis estão disponíveis no Blueprint `BP_Zone_StretchableLadderFromTop`?
- Quais funções e eventos são chamados no grafo do `BP_Zone_StretchableLadderFromTop`?