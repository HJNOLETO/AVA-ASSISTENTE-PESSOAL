# 🎮 Blueprint: AnimBP_Motorcycle

**[Classe Pai / Parent Class: `VehicleAnimationInstance`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Steering` | `real (float)` |
| `BackSuspension` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `AnimGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Frente"*
- *"Suspensão traseira"*

**Funções e Métodos Chamados:**
- 🛠️ `MakeRotator()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get BackSuspension`
- `Get Steering`

### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `BlueprintUpdateAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `TryGetPawnOwner()`
- 🛠️ `GetSteerAngle()`
- 🛠️ `GetSuspensionOffset()`

**Variáveis Manipuladas:**
- `Get VehicleMovementComponent`
- `Get Wheels`
- `Set BackSuspension`
- `Set Steering`

### 📌 Grafo: `AnimGraph__AnimFunc`

### 📌 Grafo: `ExecuteUbergraph_AnimBP_Motorcycle`

**Eventos de Entrada (Events):**
- 🟢 `BlueprintUpdateAnimation`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Motorcycle_AnimGraphNode_ModifyBone_C9B35BA24E1CF57B30D0F48B3565DE26`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Motorcycle_AnimGraphNode_ModifyBone_5078E5644195494C962B1EBA07705C97`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `TryGetPawnOwner()`
- 🛠️ `GetSteerAngle()`
- 🛠️ `GetSuspensionOffset()`
- 🛠️ `MakeVector()`
- 🛠️ `MakeRotator()`
- 🛠️ `IsValid()`
- 🛠️ `Add_DoubleDouble()`
- 🛠️ `Multiply_DoubleDouble()`
- 🛠️ `Subtract_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get BackSuspension`
- `Get Steering`
- `Get VehicleMovementComponent`
- `Get Wheels`
- `Set BackSuspension`
- `Set Steering`

### 📌 Grafo: `BlueprintUpdateAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Motorcycle()`

### 📌 Grafo: `AnimGraph__AnimFunc_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `AnimBP_Motorcycle`?
- Quais variáveis estão disponíveis no Blueprint `AnimBP_Motorcycle`?
- Quais funções e eventos são chamados no grafo do `AnimBP_Motorcycle`?