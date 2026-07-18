# 🎮 Blueprint: AnimBP_Character

**[Classe Pai / Parent Class: `AnimInstance`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `BP Character` | `object (BP_Character_C)` |
| `Speed` | `real (double)` |
| `isCrouching` | `bool` |
| `IsFalling` | `bool` |
| `Jumping` | `bool` |
| `Damage Anim` | `bool` |
| `Dead` | `bool` |
| `Tired Animation` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `AnimGraphNode_StateMachine_0`

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Damage Anim`
- `Get Speed`
- `Get isCrouching`

### 📌 Grafo: `AnimGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Movimentação Básica"*
- *"Animação de morte morrida"*

**Variáveis Manipuladas:**
- `Get Dead`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Obtendo velocidade do personagem"*
- *"Está agachando"*
- *"Está em queda"*

**Eventos de Entrada (Events):**
- 🟢 `BlueprintUpdateAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `TryGetPawnOwner()`
- 🛠️ `GetVelocity()`
- 🛠️ `VSize()`
- 🛠️ `GetMovementComponent()`
- 🛠️ `IsCrouching()`
- 🛠️ `IsFalling()`

**Variáveis Manipuladas:**
- `Set IsFalling`
- `Set Speed`
- `Set isCrouching`

### 📌 Grafo: `Interface`

**Comentários e Títulos de Seção Encontrados:**
- *"Evento Damage Animation"*
- *"Evento Is Dead"*
- *"Evento pular"*

**Eventos de Entrada (Events):**
- 🟢 `DamageAnimation`
- 🟢 `IsDead`
- 🟢 `IsJumping`

**Funções e Métodos Chamados:**
- 🛠️ `Delay()`

**Variáveis Manipuladas:**
- `Set Damage Anim`
- `Set Dead`
- `Set Jumping`

### 📌 Grafo: `AnimGraph__AnimFunc`

### 📌 Grafo: `GetCharacterDead`

### 📌 Grafo: `ExecuteUbergraph_AnimBP_Character`

**Comentários e Títulos de Seção Encontrados:**
- *"Obtendo velocidade do personagem"*
- *"Está agachando"*
- *"Está em queda"*
- *"Evento Damage Animation"*
- *"Evento Is Dead"*
- *"Evento pular"*

**Eventos de Entrada (Events):**
- 🟢 `BlueprintUpdateAnimation`
- 🟢 `DamageAnimation`
- 🟢 `IsDead`
- 🟢 `IsJumping`
- 🟢 `IsJetpack`
- 🟢 `Death`
- 🟢 `SetArmour`
- 🟢 `SetDamage`
- 🟢 `SetHealth`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_BlendListByBool_217FDBBC448BFB42ED1FEE900A38312C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_BlendListByBool_285F6FB54BBD1AB593F3FF90F2F33C15`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_BlendSpacePlayer_3494DA294F2E0F7DB112129342382A5D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_BlendSpacePlayer_D4B674294BE5CD140339B7879C872F8B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_BlendListByBool_A4C542BB4515D522F09F16B56C857A46`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_BlendListByBool_F69BC7614FDEAE01713BFEBB2DCB59D9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_BlendSpacePlayer_F755560646B331A7E50215A2CB3ABB5B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_BlendSpacePlayer_1D2478444FF12A70C87FD7A7B09AE22B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_BlendListByBool_D8BA7D524B5871E8AFCC35BAFC18AD7C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_3001E7BF4E0C9CE45A411D8D6A60B41A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_BDA216D948595D831B75A8AC837E87EE`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_58A8798B4CEB9934C7F28AB10394DDE5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_6B0189F04CAC9910806362A28484482A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_0F573C284B13097B079C629D67B838B1`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_47110DEA40F4F32CF2C304B6AF155567`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_7F22947548037690DC855D8E9769031A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_68A7E5D8484CB469455E1DA513DF427D`

**Funções e Métodos Chamados:**
- 🛠️ `TryGetPawnOwner()`
- 🛠️ `GetVelocity()`
- 🛠️ `VSize()`
- 🛠️ `GetMovementComponent()`
- 🛠️ `IsCrouching()`
- 🛠️ `IsFalling()`
- 🛠️ `Delay()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Not_PreBool()`
- 🛠️ `Less_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Damage Anim`
- `Get Dead`
- `Get IsFalling`
- `Get Jumping`
- `Get Speed`
- `Get isCrouching`
- `Set Damage Anim`
- `Set Dead`
- `Set IsFalling`
- `Set Jumping`
- `Set Speed`
- `Set isCrouching`

### 📌 Grafo: `SetHealth`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `SetDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `BlueprintUpdateAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `SetArmour`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `IsJumping`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `Death`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `IsDead`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `IsJetpack`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `DamageAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_68A7E5D8484CB469455E1DA513DF427D`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_47110DEA40F4F32CF2C304B6AF155567`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_0F573C284B13097B079C629D67B838B1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_6B0189F04CAC9910806362A28484482A`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_TransitionResult_3001E7BF4E0C9CE45A411D8D6A60B41A`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_AnimBP_Character_AnimGraphNode_BlendListByBool_D8BA7D524B5871E8AFCC35BAFC18AD7C`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AnimBP_Character()`

### 📌 Grafo: `AnimGraph__AnimFunc_MERGED`

### 📌 Grafo: `GetCharacterDead_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `AnimBP_Character`?
- Quais variáveis estão disponíveis no Blueprint `AnimBP_Character`?
- Quais funções e eventos são chamados no grafo do `AnimBP_Character`?