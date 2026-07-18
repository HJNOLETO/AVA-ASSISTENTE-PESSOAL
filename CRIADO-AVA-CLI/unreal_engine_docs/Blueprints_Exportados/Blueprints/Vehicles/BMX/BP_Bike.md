# 🎮 Blueprint: BP_Bike

**[Classe Pai / Parent Class: `WheeledVehiclePawn`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `DeltaTime` | `real (double)` |
| `MaxSteeringAngle` | `real (double)` |
| `SteeringAngle` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Camera"*
- *"Movimentos básicos"*
- *"Event tick"*
- *"Pular com a bike"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AddControllerPitchInput()`
- 🛠️ `AddControllerYawInput()`
- 🛠️ `SetThrottleInput()`
- 🛠️ `SetBrakeInput()`
- 🛠️ `SetSteeringInput()`
- 🛠️ `Steering()`
- 🛠️ `GetSocketTransform()`
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `K2_SetRelativeLocation()`
- 🛠️ `Cycling()`
- 🛠️ `AddImpulse()`
- 🛠️ `IsInAir()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakTransform()`
- 🛠️ `BreakVector()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get Mesh`
- `Get RelativeLocation`
- `Get SM_Roda`
- `Get VehicleMovementComponent`
- `Get Wheels`
- `Set DeltaTime`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `Steering`

**Funções e Métodos Chamados:**
- 🛠️ `FInterpTo()`
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get DeltaTime`
- `Get MaxSteeringAngle`
- `Get SM_Guidao1`
- `Get SM_GuidaoRoda`
- `Get SteeringAngle`
- `Set SteeringAngle`

### 📌 Grafo: `Cycling`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetForwardSpeed()`
- 🛠️ `FInterpTo()`
- 🛠️ `K2_AddLocalRotation()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get DeltaTime`
- `Get SM_Pedal`
- `Get VehicleMovementComponent`

### 📌 Grafo: `ExecuteUbergraph_BP_Bike`

**Comentários e Títulos de Seção Encontrados:**
- *"Camera"*
- *"Movimentos básicos"*
- *"Event tick"*
- *"Pular com a bike"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AddControllerPitchInput()`
- 🛠️ `AddControllerYawInput()`
- 🛠️ `SetThrottleInput()`
- 🛠️ `SetBrakeInput()`
- 🛠️ `SetSteeringInput()`
- 🛠️ `Steering()`
- 🛠️ `GetSocketTransform()`
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `K2_SetRelativeLocation()`
- 🛠️ `Cycling()`
- 🛠️ `AddImpulse()`
- 🛠️ `IsInAir()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `BreakVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`
- 🛠️ `BreakTransform()`
- 🛠️ `Multiply_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Mesh`
- `Get RelativeLocation`
- `Get SM_Roda`
- `Get VehicleMovementComponent`
- `Get Wheels`
- `Set DeltaTime`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Bike()`

### 📌 Grafo: `InpAxisEvt_MoveRight/Left_K2Node_InputAxisEvent_2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Bike()`

### 📌 Grafo: `InpAxisEvt_Rear_K2Node_InputAxisEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Bike()`

### 📌 Grafo: `InpAxisEvt_Drive_K2Node_InputAxisEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Bike()`

### 📌 Grafo: `InpAxisKeyEvt_MouseY_K2Node_InputAxisKeyEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Bike()`

### 📌 Grafo: `InpAxisKeyEvt_MouseX_K2Node_InputAxisKeyEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Bike()`

### 📌 Grafo: `InpActEvt_SpaceBar_K2Node_InputKeyEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Bike()`

### 📌 Grafo: `UserConstructionScript_MERGED`

### 📌 Grafo: `Steering_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `FInterpTo()`
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `Multiply_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get DeltaTime`
- `Get MaxSteeringAngle`
- `Get SM_Guidao1`
- `Get SM_GuidaoRoda`
- `Get SteeringAngle`
- `Set SteeringAngle`

### 📌 Grafo: `Cycling_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetForwardSpeed()`
- 🛠️ `FInterpTo()`
- 🛠️ `K2_AddLocalRotation()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Multiply_DoubleDouble()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get DeltaTime`
- `Get SM_Pedal`
- `Get VehicleMovementComponent`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_Bike`?
- Quais variáveis estão disponíveis no Blueprint `BP_Bike`?
- Quais funções e eventos são chamados no grafo do `BP_Bike`?