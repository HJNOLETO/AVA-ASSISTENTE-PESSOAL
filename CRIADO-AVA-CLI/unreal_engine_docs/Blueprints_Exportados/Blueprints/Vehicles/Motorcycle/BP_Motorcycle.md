# 🎮 Blueprint: BP_Motorcycle

**[Classe Pai / Parent Class: `WheeledVehiclePawn`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
*Nenhuma variável explícita declarada no painel de controle.*

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Camera"*
- *"Movimentos básicos"*
- *"Event tick"*
- *"Empinar"*
- *"Pular com a bike"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AddControllerYawInput()`
- 🛠️ `AddTorqueInRadians()`
- 🛠️ `SetCenterOfMass()`
- 🛠️ `WakeAllRigidBodies()`
- 🛠️ `AddImpulse()`
- 🛠️ `IsInAir()`
- 🛠️ `VLerp()`
- 🛠️ `SetThrottleInput()`
- 🛠️ `ResetVehicle()`
- 🛠️ `SetBrakeInput()`
- 🛠️ `SetSteeringInput()`
- 🛠️ `SetFloatParameter()`
- 🛠️ `GetForwardSpeed()`
- 🛠️ `GetRightVector()`
- 🛠️ `AddControllerPitchInput()`

**Variáveis Manipuladas:**
- `Get Engine`
- `Get Mesh`
- `Get UpdatedPrimitive`
- `Get VehicleMovementComponent`
- `Get Wheels`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ExecuteUbergraph_BP_Motorcycle`

**Comentários e Títulos de Seção Encontrados:**
- *"Movimentos básicos"*
- *"Camera"*
- *"Pular com a bike"*
- *"Event tick"*
- *"Empinar"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🟢 `Timeline_0__UpdateFunc`
- 🟢 `Timeline_0__FinishedFunc`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetThrottleInput()`
- 🛠️ `SetBrakeInput()`
- 🛠️ `SetSteeringInput()`
- 🛠️ `AddControllerPitchInput()`
- 🛠️ `AddControllerYawInput()`
- 🛠️ `AddImpulse()`
- 🛠️ `IsInAir()`
- 🛠️ `SetFloatParameter()`
- 🛠️ `GetForwardSpeed()`
- 🛠️ `AddTorqueInRadians()`
- 🛠️ `VLerp()`
- 🛠️ `GetRightVector()`
- 🛠️ `SetCenterOfMass()`
- 🛠️ `WakeAllRigidBodies()`
- 🛠️ `ResetVehicle()`
- 🛠️ `Not_PreBool()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `Multiply_VectorVector()`
- 🛠️ `Conv_DoubleToVector()`
- 🛠️ `Multiply_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Engine`
- `Get Mesh`
- `Get Timeline_0_NewTrack_0_273AC17B4E743338D48BB9BFC0B03965`
- `Get UpdatedPrimitive`
- `Get VehicleMovementComponent`
- `Get Wheels`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Motorcycle()`

### 📌 Grafo: `InpAxisKeyEvt_MouseY_K2Node_InputAxisKeyEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Motorcycle()`

### 📌 Grafo: `InpAxisKeyEvt_MouseX_K2Node_InputAxisKeyEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Motorcycle()`

### 📌 Grafo: `InpAxisEvt_MoveRight/Left_K2Node_InputAxisEvent_2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Motorcycle()`

### 📌 Grafo: `InpAxisEvt_Rear_K2Node_InputAxisEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Motorcycle()`

### 📌 Grafo: `InpAxisEvt_Drive_K2Node_InputAxisEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Motorcycle()`

### 📌 Grafo: `InpActEvt_K_K2Node_InputKeyEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Motorcycle()`

### 📌 Grafo: `InpActEvt_Interact_K2Node_InputActionEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Motorcycle()`

### 📌 Grafo: `InpActEvt_SpaceBar_K2Node_InputKeyEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Motorcycle()`

### 📌 Grafo: `Timeline_0__UpdateFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Motorcycle()`

### 📌 Grafo: `Timeline_0__FinishedFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Motorcycle()`

### 📌 Grafo: `UserConstructionScript_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_Motorcycle`?
- Quais funções e eventos são chamados no grafo do `BP_Motorcycle`?