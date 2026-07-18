# 🎮 Blueprint: BP_Zone_Ladder

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Step Count` | `int` |
| `Step Height` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
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
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get RelativeLocation`
- `Get RelativeScale3D`
- `Get Step Count`
- `Get Step Height`
- `Get Top`
- `Get Top_Enter`
- `Get TriggerBox`

### 📌 Grafo: `GetLadderLocation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`

**Variáveis Manipuladas:**
- `Get Bottom`
- `Get Top`

### 📌 Grafo: `GetLadderRotation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`

### 📌 Grafo: `CheckExitToBottom`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()` — *Close to the ladder floor\r\n(사다리 바닥에 근접했는지 여부)*
- 🛠️ `Less_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Bottom`

### 📌 Grafo: `CheckExitToTop`

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()` — *Close to the top of the ladder\r\n(사다리 상단에 근접했는지 여부)*

**Variáveis Manipuladas:**
- `Get Top`

### 📌 Grafo: `CheckEnterToMiddle`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()` — *Do not enter the middle if close to the floor\r\n(바닥에 가까우면 중간에 진입 금지)*
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`

**Variáveis Manipuladas:**
- `Get Bottom`

### 📌 Grafo: `CheckEnterToBottom`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Bottom_Enter`

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
- `Get Top_Enter`

### 📌 Grafo: `GetLadderStepHeight`

**Variáveis Manipuladas:**
- `Get Step Height`

### 📌 Grafo: `GetTopEnterLocation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Top_Enter`

### 📌 Grafo: `GetBottomEnterLocation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Bottom_Enter`

### 📌 Grafo: `ExecuteUbergraph_BP_Zone_Ladder`

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
- 🛠️ `ExecuteUbergraph_BP_Zone_Ladder()`

### 📌 Grafo: `BndEvt__Box_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Zone_Ladder()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Zone_Ladder()`

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
- `Get Top`
- `Get Top_Enter`
- `Get TriggerBox`

### 📌 Grafo: `GetLadderLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`

**Variáveis Manipuladas:**
- `Get Bottom`
- `Get Top`

### 📌 Grafo: `GetLadderRotation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`

### 📌 Grafo: `CheckExitToBottom_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()` — *Close to the ladder floor\r\n(사다리 바닥에 근접했는지 여부)*
- 🛠️ `Less_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Bottom`

### 📌 Grafo: `CheckExitToTop_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()` — *Close to the top of the ladder\r\n(사다리 상단에 근접했는지 여부)*

**Variáveis Manipuladas:**
- `Get Top`

### 📌 Grafo: `CheckEnterToMiddle_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()` — *Do not enter the middle if close to the floor\r\n(바닥에 가까우면 중간에 진입 금지)*
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`

**Variáveis Manipuladas:**
- `Get Bottom`

### 📌 Grafo: `CheckEnterToBottom_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Bottom_Enter`

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
- `Get Top_Enter`

### 📌 Grafo: `GetLadderStepHeight_MERGED`

**Variáveis Manipuladas:**
- `Get Step Height`

### 📌 Grafo: `GetTopEnterLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Top_Enter`

### 📌 Grafo: `GetBottomEnterLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `K2_GetComponentRotation()`

**Variáveis Manipuladas:**
- `Get Bottom_Enter`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_Zone_Ladder`?
- Quais variáveis estão disponíveis no Blueprint `BP_Zone_Ladder`?
- Quais funções e eventos são chamados no grafo do `BP_Zone_Ladder`?