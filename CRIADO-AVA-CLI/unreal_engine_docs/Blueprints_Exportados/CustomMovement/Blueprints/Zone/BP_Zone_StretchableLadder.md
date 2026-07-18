# 🎮 Blueprint: BP_Zone_StretchableLadder

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
- 🛠️ `FindClosestBottomEnterLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Bottom_Enter`

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
- 🛠️ `Subtract_IntInt()` — *최소 스텝 갯수 4개*
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `K2_SetRelativeLocation()`
- 🛠️ `SetRelativeScale3D()`
- 🛠️ `GetComponentBounds()`
- 🛠️ `BreakVector()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `GetScaledBoxExtent()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get RelativeLocation`
- `Get RelativeScale3D`
- `Get Step Count`
- `Get Step Height`
- `Get Step Width Margin`
- `Get Step Width Scale`
- `Get Top`
- `Get Top_Enter`
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

### 📌 Grafo: `FindClosestBottomEnterLocation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetRightVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `FindClosestPointOnSegment()`

**Variáveis Manipuladas:**
- `Get Bottom_Enter`
- `Get Step Half Width`

### 📌 Grafo: `GetLadderLocation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `FindClosestTopLocation()`
- 🛠️ `FindClosestBottomLocation()`

### 📌 Grafo: `GetLadderRotation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`

### 📌 Grafo: `CheckExitToBottom`

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()` — *Close to the ladder floor\r\n(사다리 바닥에 근접했는지 여부)*
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `FindClosestBottomLocation()`

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
- 🛠️ `Greater_DoubleDouble()` — *Do not enter the middle if close to the floor\r\n(바닥에 가까우면 중간에 진입 금지)*
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `FindClosestBottomLocation()`

### 📌 Grafo: `CheckEnterToBottom`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `FindClosestBottomEnterLocation()`

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
- 🛠️ `FindClosestTopEnterLocation()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Top_Enter`

### 📌 Grafo: `ExecuteUbergraph_BP_Zone_StretchableLadder`

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
- 🛠️ `ExecuteUbergraph_BP_Zone_StretchableLadder()`

### 📌 Grafo: `BndEvt__Box_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Zone_StretchableLadder()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Zone_StretchableLadder()`

### 📌 Grafo: `UserConstructionScript_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_IntInt()` — *최소 스텝 갯수 4개*
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `K2_SetRelativeLocation()`
- 🛠️ `SetRelativeScale3D()`
- 🛠️ `GetComponentBounds()`
- 🛠️ `BreakVector()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `GetScaledBoxExtent()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `Add_IntInt()`
- 🛠️ `MakeVector()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get RelativeLocation`
- `Get RelativeScale3D`
- `Get Step Count`
- `Get Step Height`
- `Get Step Width Margin`
- `Get Step Width Scale`
- `Get Top`
- `Get Top_Enter`
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

### 📌 Grafo: `FindClosestBottomEnterLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetRightVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `FindClosestPointOnSegment()`

**Variáveis Manipuladas:**
- `Get Bottom_Enter`
- `Get Step Half Width`

### 📌 Grafo: `GetLadderLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `FindClosestTopLocation()`
- 🛠️ `FindClosestBottomLocation()`

### 📌 Grafo: `GetLadderRotation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`

### 📌 Grafo: `CheckExitToBottom_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()` — *Close to the ladder floor\r\n(사다리 바닥에 근접했는지 여부)*
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `FindClosestBottomLocation()`

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
- 🛠️ `Greater_DoubleDouble()` — *Do not enter the middle if close to the floor\r\n(바닥에 가까우면 중간에 진입 금지)*
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `FindClosestBottomLocation()`

### 📌 Grafo: `CheckEnterToBottom_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `FindClosestBottomEnterLocation()`

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
- 🛠️ `FindClosestTopEnterLocation()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Top_Enter`

### 📌 Grafo: `GetBottomEnterLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `FindClosestBottomEnterLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Bottom_Enter`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_Zone_StretchableLadder`?
- Quais variáveis estão disponíveis no Blueprint `BP_Zone_StretchableLadder`?
- Quais funções e eventos são chamados no grafo do `BP_Zone_StretchableLadder`?