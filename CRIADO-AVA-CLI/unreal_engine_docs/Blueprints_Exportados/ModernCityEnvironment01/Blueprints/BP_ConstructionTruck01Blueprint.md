# 🎮 Blueprint: BP_ConstructionTruck01Blueprint

**[Classe Pai / Parent Class: `WheeledVehiclePawn`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `WantDumpsterGoUp` | `bool` |
| `CT01AnimBP` | `object (AB_CT01AnimBlurPrint_C)` |
| `WantBackDoorOpen` | `bool` |
| `Exterior Material` | `object (MaterialInterface)` |
| `Light Material` | `object (MaterialInterface)` |
| `Interior Material` | `object (MaterialInterface)` |
| `Wheel Material` | `object (MaterialInterface)` |
| `Hydraulic Material` | `object (MaterialInterface)` |
| `Light Colour` | `struct (LinearColor)` |
| `Light Intensity` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🟢 `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `FInterpTo()`
- 🛠️ `SelectFloat()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `ExecuteConsoleCommand()`
- 🛠️ `SetSteeringInput()`
- 🛠️ `K2_AddRelativeRotation()`
- 🛠️ `SetThrottleInput()`
- 🛠️ `SetBrakeInput()`
- 🛠️ `Conv_BoolToFloat()`
- 🛠️ `SetHandbrakeInput()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get BackDoorOpeningCT01`
- `Get CT01AnimBP`
- `Get DumpingGoingUpCT01`
- `Get Mesh`
- `Get SpringArm`
- `Get VehicleMovementComponent`
- `Get WantBackDoorOpen`
- `Get WantDumpsterGoUp`
- `Set BackDoorOpeningCT01`
- `Set CT01AnimBP`
- `Set DumpingGoingUpCT01`
- `Set WantBackDoorOpen`
- `Set WantDumpsterGoUp`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `SetMaterial()`
- 🛠️ `SetLightColor()`
- 🛠️ `SetIntensity()`

**Variáveis Manipuladas:**
- `Get Exterior Material`
- `Get Hydraulic Material`
- `Get Interior Material`
- `Get Light Colour`
- `Get Light Intensity`
- `Get Light Material`
- `Get Mesh`
- `Get SpotLight`
- `Get SpotLight1`
- `Get Wheel Material`

### 📌 Grafo: `ExecuteUbergraph_BP_ConstructionTruck01Blueprint`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🟢 `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `FInterpTo()`
- 🛠️ `SelectFloat()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `ExecuteConsoleCommand()`
- 🛠️ `SetSteeringInput()`
- 🛠️ `K2_AddRelativeRotation()`
- 🛠️ `SetThrottleInput()`
- 🛠️ `SetBrakeInput()`
- 🛠️ `Conv_BoolToFloat()`
- 🛠️ `SetHandbrakeInput()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get BackDoorOpeningCT01`
- `Get CT01AnimBP`
- `Get DumpingGoingUpCT01`
- `Get Mesh`
- `Get SpringArm`
- `Get VehicleMovementComponent`
- `Get WantBackDoorOpen`
- `Get WantDumpsterGoUp`
- `Set BackDoorOpeningCT01`
- `Set CT01AnimBP`
- `Set DumpingGoingUpCT01`
- `Set WantBackDoorOpen`
- `Set WantDumpsterGoUp`

### 📌 Grafo: `InpAxisEvt_Throttle_K2Node_InputAxisEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_ConstructionTruck01Blueprint()`

### 📌 Grafo: `InpAxisEvt_LookUp_K2Node_InputAxisEvent_23`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_ConstructionTruck01Blueprint()`

### 📌 Grafo: `InpAxisEvt_LookRight_K2Node_InputAxisEvent_16`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_ConstructionTruck01Blueprint()`

### 📌 Grafo: `InpAxisEvt_Steer_K2Node_InputAxisEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_ConstructionTruck01Blueprint()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_ConstructionTruck01Blueprint()`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_ConstructionTruck01Blueprint()`

### 📌 Grafo: `InpActEvt_SpaceBar_K2Node_InputKeyEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_ConstructionTruck01Blueprint()`

### 📌 Grafo: `InpActEvt_SpaceBar_K2Node_InputKeyEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_ConstructionTruck01Blueprint()`

### 📌 Grafo: `InpActEvt_Q_K2Node_InputKeyEvent_2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_ConstructionTruck01Blueprint()`

### 📌 Grafo: `InpActEvt_E_K2Node_InputKeyEvent_3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_ConstructionTruck01Blueprint()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `SetMaterial()`
- 🛠️ `SetLightColor()`
- 🛠️ `SetIntensity()`

**Variáveis Manipuladas:**
- `Get Exterior Material`
- `Get Hydraulic Material`
- `Get Interior Material`
- `Get Light Colour`
- `Get Light Intensity`
- `Get Light Material`
- `Get Mesh`
- `Get SpotLight`
- `Get SpotLight1`
- `Get Wheel Material`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_ConstructionTruck01Blueprint`?
- Quais variáveis estão disponíveis no Blueprint `BP_ConstructionTruck01Blueprint`?
- Quais funções e eventos são chamados no grafo do `BP_ConstructionTruck01Blueprint`?