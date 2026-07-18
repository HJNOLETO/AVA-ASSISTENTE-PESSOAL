# 🎮 Blueprint: FirstPerson_AnimBP

**[Classe Pai / Parent Class: `AnimInstance`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `IsMoving` | `bool` |
| `bIsInAir` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Setting \'IsInAir\'"*
- *"See if Pawn Owner is valid (will not be in Persona)"*
- *"Set \'IsMoving\'"*

**Eventos de Entrada (Events):**
- 🟢 `BlueprintUpdateAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `TryGetPawnOwner()`
- 🛠️ `VSize()`
- 🛠️ `Greater_DoubleDouble()` — *If velocity is greater than zero*
- 🛠️ `GetMovementComponent()`
- 🛠️ `IsFalling()`
- 🛠️ `GetVelocity()`

**Variáveis Manipuladas:**
- `Set IsMoving`
- `Set bIsInAir`

### 📌 Grafo: `AnimGraph`

### 📌 Grafo: `AnimGraphNode_StateMachine_58`

### 📌 Grafo: `AnimationTransitionGraph_213`

**Funções e Métodos Chamados:**
- 🛠️ `LessEqual_DoubleDouble()`

### 📌 Grafo: `AnimationTransitionGraph_214`

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get bIsInAir`

### 📌 Grafo: `AnimationTransitionGraph_215`

**Funções e Métodos Chamados:**
- 🛠️ `LessEqual_DoubleDouble()`

### 📌 Grafo: `AnimationTransitionGraph_216`

**Variáveis Manipuladas:**
- `Get IsMoving`

### 📌 Grafo: `AnimationTransitionGraph_217`

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get IsMoving`

### 📌 Grafo: `AnimationTransitionGraph_218`

**Variáveis Manipuladas:**
- `Get bIsInAir`

### 📌 Grafo: `AnimationTransitionGraph_219`

**Variáveis Manipuladas:**
- `Get bIsInAir`

### 📌 Grafo: `AnimGraph__AnimFunc`

### 📌 Grafo: `ExecuteUbergraph_FirstPerson_AnimBP`

**Comentários e Títulos de Seção Encontrados:**
- *"Setting \'IsInAir\'"*
- *"See if Pawn Owner is valid (will not be in Persona)"*
- *"Set \'IsMoving\'"*

**Eventos de Entrada (Events):**
- 🟢 `BlueprintUpdateAnimation`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_B15D7EAA46138A38EAF1CCAD3110ACB7`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_A3E5D0514472C54EE7856B9AD4BDD068`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_DA3192DC415202A934CDF598A41EFCDE`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_FD08A51A4E3E4A767C7ED6B9E0A8B8C8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_B368400946B18E8B82462BA54F4BB849`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_DF5EA38F40899E6FA34A95A078F6AC7B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_2C413F41496E16A9E28BB6886E13325E`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `TryGetPawnOwner()`
- 🛠️ `VSize()`
- 🛠️ `Greater_DoubleDouble()` — *If velocity is greater than zero*
- 🛠️ `GetMovementComponent()`
- 🛠️ `IsFalling()`
- 🛠️ `GetVelocity()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `GetInstanceAssetPlayerTimeFromEnd()`
- 🛠️ `Not_PreBool()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get IsMoving`
- `Get bIsInAir`
- `Set IsMoving`
- `Set bIsInAir`

### 📌 Grafo: `BlueprintUpdateAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPerson_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_DF5EA38F40899E6FA34A95A078F6AC7B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPerson_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_FD08A51A4E3E4A767C7ED6B9E0A8B8C8`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPerson_AnimBP()`

### 📌 Grafo: `AnimGraph__AnimFunc_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `FirstPerson_AnimBP`?
- Quais variáveis estão disponíveis no Blueprint `FirstPerson_AnimBP`?
- Quais funções e eventos são chamados no grafo do `FirstPerson_AnimBP`?