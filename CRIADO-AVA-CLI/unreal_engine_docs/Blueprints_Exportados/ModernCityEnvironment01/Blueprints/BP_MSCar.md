# 🎮 Blueprint: BP_MSCar

**[Classe Pai / Parent Class: `WheeledVehiclePawn`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Light Material` | `object (MaterialInterface)` |
| `Exterio Material` | `object (MaterialInterface)` |
| `Window Material` | `object (MaterialInterface)` |
| `Interior Material` | `object (MaterialInterface)` |
| `Light Colour` | `struct (LinearColor)` |
| `Light Intensity` | `real (double)` |
| `FLDoorOpen` | `bool` |
| `FRDoorOpen` | `bool` |
| `RRDoorOpen` | `bool` |
| `RLDoorOpen` | `bool` |
| `Anim BP MSCar01` | `object (AM_MSCar01_C)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `FInterpTo()`
- 🛠️ `SelectFloat()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `SetSteeringInput()`
- 🛠️ `K2_AddRelativeRotation()`
- 🛠️ `SetThrottleInput()`
- 🛠️ `SetBrakeInput()`
- 🛠️ `Conv_BoolToFloat()`
- 🛠️ `SetHandbrakeInput()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get Anim BP MSCar01`
- `Get FLDoor`
- `Get FLDoorOpen`
- `Get FRDoor`
- `Get FRDoorOpen`
- `Get Mesh`
- `Get RLDoor`
- `Get RLDoorOpen`
- `Get RRDoor`
- `Get RRDoorOpen`
- `Get SpringArm`
- `Get VehicleMovementComponent`
- `Set Anim BP MSCar01`
- `Set FLDoor`
- `Set FLDoorOpen`
- `Set FRDoor`
- `Set FRDoorOpen`
- `Set RLDoor`
- `Set RLDoorOpen`
- `Set RRDoor`
- `Set RRDoorOpen`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `SetMaterial()`
- 🛠️ `SetLightColor()`
- 🛠️ `SetIntensity()`

**Variáveis Manipuladas:**
- `Get Exterio Material`
- `Get Interior Material`
- `Get Light Colour`
- `Get Light Intensity`
- `Get Light Material`
- `Get Mesh`
- `Get SpotLight`
- `Get SpotLight1`
- `Get Window Material`

### 📌 Grafo: `ExecuteUbergraph_BP_MSCar`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `FInterpTo()`
- 🛠️ `SelectFloat()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `SetSteeringInput()`
- 🛠️ `K2_AddRelativeRotation()`
- 🛠️ `SetThrottleInput()`
- 🛠️ `SetBrakeInput()`
- 🛠️ `Conv_BoolToFloat()`
- 🛠️ `SetHandbrakeInput()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get Anim BP MSCar01`
- `Get FLDoor`
- `Get FLDoorOpen`
- `Get FRDoor`
- `Get FRDoorOpen`
- `Get Mesh`
- `Get RLDoor`
- `Get RLDoorOpen`
- `Get RRDoor`
- `Get RRDoorOpen`
- `Get SpringArm`
- `Get VehicleMovementComponent`
- `Set Anim BP MSCar01`
- `Set FLDoor`
- `Set FLDoorOpen`
- `Set FRDoor`
- `Set FRDoorOpen`
- `Set RLDoor`
- `Set RLDoorOpen`
- `Set RRDoor`
- `Set RRDoorOpen`

### 📌 Grafo: `InpAxisEvt_Throttle_K2Node_InputAxisEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpAxisEvt_LookUp_K2Node_InputAxisEvent_23`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpAxisEvt_LookRight_K2Node_InputAxisEvent_16`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpAxisEvt_Steer_K2Node_InputAxisEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpActEvt_E_K2Node_InputKeyEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpActEvt_E_K2Node_InputKeyEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpActEvt_Q_K2Node_InputKeyEvent_2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpActEvt_Q_K2Node_InputKeyEvent_3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpActEvt_R_K2Node_InputKeyEvent_4`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpActEvt_R_K2Node_InputKeyEvent_5`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpActEvt_F_K2Node_InputKeyEvent_6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpActEvt_F_K2Node_InputKeyEvent_7`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpActEvt_SpaceBar_K2Node_InputKeyEvent_8`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `InpActEvt_SpaceBar_K2Node_InputKeyEvent_9`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_MSCar()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `SetMaterial()`
- 🛠️ `SetLightColor()`
- 🛠️ `SetIntensity()`

**Variáveis Manipuladas:**
- `Get Exterio Material`
- `Get Interior Material`
- `Get Light Colour`
- `Get Light Intensity`
- `Get Light Material`
- `Get Mesh`
- `Get SpotLight`
- `Get SpotLight1`
- `Get Window Material`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_MSCar`?
- Quais variáveis estão disponíveis no Blueprint `BP_MSCar`?
- Quais funções e eventos são chamados no grafo do `BP_MSCar`?