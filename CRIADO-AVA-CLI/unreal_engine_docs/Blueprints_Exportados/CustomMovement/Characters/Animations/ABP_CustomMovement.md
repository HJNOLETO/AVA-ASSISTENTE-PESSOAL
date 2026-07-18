# 🎮 Blueprint: ABP_CustomMovement

**[Classe Pai / Parent Class: `AnimInstance`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `IsLadder` | `bool` |
| `LadderPos` | `real (double)` |
| `Owner` | `object (Character)` |
| `LadderBlendTime` | `real (double)` |
| `IsClimbing` | `bool` |
| `IsMovingNextHold` | `bool` |
| `MovingNextHoldTransitionAlpha` | `real (double)` |
| `MovingNextHoldTransitionDelta` | `struct (Vector)` |
| `ClimbingReadyDirection` | `struct (Vector)` |
| `ClimbingBlendTIme` | `real (double)` |
| `CustomMovement` | `object (BP_CustomMovementComponent_C)` |
| `AM_EnteringLadderTop` | `object (AnimMontage)` |
| `AM_EnteringLadderBottom` | `object (AnimMontage)` |
| `AM_ExitingLadderTop` | `object (AnimMontage)` |
| `AM_ExitingLadderBottom` | `object (AnimMontage)` |
| `AM_EnteringClimbingTop` | `object (AnimMontage)` |
| `AM_ExitingClimbingTop` | `object (AnimMontage)` |
| `AS_Ladder_Up_Loop` | `object (AnimSequence)` |
| `Input Ladder UP` | `real (double)` |
| `Ladder Move Speed` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `BlueprintUpdateAnimation`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `VLerp()`
- 🛠️ `GetVelocity()`
- 🛠️ `IsValid()`
- 🛠️ `GetLadderStepPos()`
- 🛠️ `GetMovingNextHoldTransitionAlpha()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get ClimbingBlendTimeForAnimation`
- `Get ClimbingReadyDirection`
- `Get CustomMovement`
- `Get CustomMovementMode`
- `Get InputLadderUP`
- `Get IsClimbingForNextAnimation`
- `Get IsLadder`
- `Get IsLadderForNextAnimation`
- `Get IsMovingNextHoldForAnimation`
- `Get LadderBlendTimeForAnimation`
- `Get LadderMoveSpeed`
- `Get MovementMode`
- `Get MovingNextHoldTransitionDeltaForAnimation`
- `Get Owner`
- `Set ClimbingBlendTIme`
- `Set ClimbingReadyDirection`
- `Set Input Ladder UP`
- `Set IsClimbing`
- `Set IsLadder`
- `Set IsMovingNextHold`
- `Set Ladder Move Speed`
- `Set LadderBlendTime`
- `Set LadderPos`
- `Set MovingNextHoldTransitionAlpha`
- `Set MovingNextHoldTransitionDelta`

### 📌 Grafo: `Initialize`

**Funções e Métodos Chamados:**
- 🛠️ `TryGetPawnOwner()`
- 🛠️ `GetCustomMovement()`

**Variáveis Manipuladas:**
- `Get AM_EnteringClimbingTop`
- `Get AM_EnteringLadderBottom`
- `Get AM_EnteringLadderTop`
- `Get AM_ExitingClimbingTop`
- `Get AM_ExitingLadderBottom`
- `Get AM_ExitingLadderTop`
- `Get CustomMovement`
- `Set AM_EnteringClimbingTop`
- `Set AM_EnteringLadderBottom`
- `Set AM_EnteringLadderTop`
- `Set AM_ExitingClimbingTop`
- `Set AM_ExitingLadderBottom`
- `Set AM_ExitingLadderTop`
- `Set CustomMovement`
- `Set Owner`

### 📌 Grafo: `AnimGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Escada"*

**Funções e Métodos Chamados:**
- 🛠️ `Divide_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get AS_Ladder_Up_Loop`
- `Get ClimbingBlendTIme`
- `Get Input Ladder UP`
- `Get IsClimbing`
- `Get IsLadder`
- `Get Ladder Move Speed`
- `Get LadderBlendTime`
- `Get LadderPos`
- `Get SequenceLength`

### 📌 Grafo: `AnimGraphNode_StateMachine_4`

**Funções e Métodos Chamados:**
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `BreakVector()`
- 🛠️ `Not_PreBool()`
- 🛠️ `VSize()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `EqualEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get ClimbingReadyDirection`
- `Get IsMovingNextHold`
- `Get MovingNextHoldTransitionAlpha`
- `Get MovingNextHoldTransitionDelta`

### 📌 Grafo: `AnimGraph__AnimFunc`

### 📌 Grafo: `ExecuteUbergraph_ABP_CustomMovement`

**Comentários e Títulos de Seção Encontrados:**
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `BlueprintUpdateAnimation`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendListByBool_2942C45E44C3F8DFD60BE5B8E3E84B60`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_SequenceEvaluator_FD947A424C84EB1B8688EDB529CEA97A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendListByBool_3A68170F40C11A6E3356D29F7B00B08A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendListByBool_50DDA32D4FEA9B41CF5091A85A29D76C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendListByBool_035184B84085F113A1E0F895E201BB98`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendSpacePlayer_510FAD7B4FC431354EB9FEAC390D9DA8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendSpacePlayer_F1A7C2784413EFB11A3276800FB5F137`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendListByBool_4F104BED4A43464EF761F6A72DCADA32`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendSpacePlayer_2F70CF0A4A53AD26FD889E82313D095D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendSpacePlayer_4723DC1B466ABB11A01DA18971E83C5F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_TwoWayBlend_435E656E4079D798F2BB8CAF8880EE40`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendListByBool_985437C5480EF4801CBCE49D5484A46F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendSpacePlayer_0FDEF777441740CFD078C1AEB6A79D74`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendSpacePlayer_E4B0A704413C4FD5EE73BDA217BD62EC`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_TransitionResult_EF4891F34C156D879C0963921DF3679C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_TransitionResult_756DCA674D582CE747BD1DA2A749D09F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_TransitionResult_512B4F2B480E2015EACA87961E04B4A5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_TransitionResult_E27CD463421F66C9C75511A3F98EDD06`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_TransitionResult_6D07B20A488B10F8B4F7C5A20FD40165`
- 🔀 Contém `7` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `VLerp()`
- 🛠️ `GetVelocity()`
- 🛠️ `IsValid()`
- 🛠️ `GetLadderStepPos()`
- 🛠️ `GetMovingNextHoldTransitionAlpha()`
- 🛠️ `TryGetPawnOwner()`
- 🛠️ `GetCustomMovement()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `BreakVector()`
- 🛠️ `VSize()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Not_PreBool()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `GetValidValue()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get AM_EnteringClimbingTop`
- `Get AM_EnteringLadderBottom`
- `Get AM_EnteringLadderTop`
- `Get AM_ExitingClimbingTop`
- `Get AM_ExitingLadderBottom`
- `Get AM_ExitingLadderTop`
- `Get AS_Ladder_Up_Loop`
- `Get CharacterMovement`
- `Get ClimbingBlendTIme`
- `Get ClimbingBlendTimeForAnimation`
- `Get ClimbingReadyDirection`
- `Get CustomMovement`
- `Get CustomMovementMode`
- `Get Input Ladder UP`
- `Get InputLadderUP`
- `Get IsClimbing`
- `Get IsClimbingForNextAnimation`
- `Get IsLadder`
- `Get IsLadderForNextAnimation`
- `Get IsMovingNextHold`
- `Get IsMovingNextHoldForAnimation`
- `Get Ladder Move Speed`
- `Get LadderBlendTime`
- `Get LadderBlendTimeForAnimation`
- `Get LadderMoveSpeed`
- `Get LadderPos`
- `Get MovementMode`
- `Get MovingNextHoldTransitionAlpha`
- `Get MovingNextHoldTransitionDelta`
- `Get MovingNextHoldTransitionDeltaForAnimation`
- `Get Owner`
- `Get SequenceLength`
- `Set AM_EnteringClimbingTop`
- `Set AM_EnteringLadderBottom`
- `Set AM_EnteringLadderTop`
- `Set AM_ExitingClimbingTop`
- `Set AM_ExitingLadderBottom`
- `Set AM_ExitingLadderTop`
- `Set ClimbingBlendTIme`
- `Set ClimbingReadyDirection`
- `Set CustomMovement`
- `Set Input Ladder UP`
- `Set IsClimbing`
- `Set IsLadder`
- `Set IsMovingNextHold`
- `Set Ladder Move Speed`
- `Set LadderBlendTime`
- `Set LadderPos`
- `Set MovingNextHoldTransitionAlpha`
- `Set MovingNextHoldTransitionDelta`
- `Set Owner`

### 📌 Grafo: `BlueprintUpdateAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ABP_CustomMovement()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_TransitionResult_6D07B20A488B10F8B4F7C5A20FD40165`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ABP_CustomMovement()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_TransitionResult_756DCA674D582CE747BD1DA2A749D09F`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ABP_CustomMovement()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendListByBool_985437C5480EF4801CBCE49D5484A46F`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ABP_CustomMovement()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendSpacePlayer_4723DC1B466ABB11A01DA18971E83C5F`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ABP_CustomMovement()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendSpacePlayer_2F70CF0A4A53AD26FD889E82313D095D`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ABP_CustomMovement()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendListByBool_4F104BED4A43464EF761F6A72DCADA32`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ABP_CustomMovement()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendListByBool_035184B84085F113A1E0F895E201BB98`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ABP_CustomMovement()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_SequenceEvaluator_FD947A424C84EB1B8688EDB529CEA97A`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ABP_CustomMovement()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ABP_CustomMovement_AnimGraphNode_BlendListByBool_2942C45E44C3F8DFD60BE5B8E3E84B60`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ABP_CustomMovement()`

### 📌 Grafo: `AnimGraph__AnimFunc_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `ABP_CustomMovement`?
- Quais variáveis estão disponíveis no Blueprint `ABP_CustomMovement`?
- Quais funções e eventos são chamados no grafo do `ABP_CustomMovement`?