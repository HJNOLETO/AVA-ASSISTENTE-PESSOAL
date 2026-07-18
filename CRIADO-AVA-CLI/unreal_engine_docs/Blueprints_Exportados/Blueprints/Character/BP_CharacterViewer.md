# 🎮 Blueprint: BP_CharacterViewer

**[Classe Pai / Parent Class: `Character`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `MousePressed` | `bool` |
| `RotateTimer` | `struct (TimerHandle)` |
| `RotateCamera?` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Rotacionar o personagem com as teclas \"*
- *"Verificar clique do mouse"*
- *"Rotacionar personagem com o movimento do mouse"*
- *"Criar HUD da tela de customização"*
- *"Evento para rotacionar personagem para direita"*
- *"Novos controles enhanced"*
- *"Evento para rotacionar personagem para esquerda"*
- *"Parar o timer da rotação"*

**Eventos de Entrada (Events):**
- 🟢 `RotateRight`
- 🟢 `EventRotateRight`
- 🟢 `EventStopRotate`
- 🟢 `RotateLeft`
- 🟢 `EventRotateLeft`
- 🟢 `ReceiveBeginPlay`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetTimerDelegate()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `RotateCharacter()`
- 🛠️ `K2_ClearAndInvalidateTimerHandle()`
- 🛠️ `GetController()`
- 🛠️ `AddMappingContext()`
- 🛠️ `AddToViewport()`
- 🛠️ `SetInputMode_GameAndUIEx()`
- 🛠️ `GetPlayerController()`
- 🛠️ `BreakVector2D()`

**Variáveis Manipuladas:**
- `Get MousePressed`
- `Get RotateTimer`
- `Set MousePressed`
- `Set RotateTimer`
- `Set bShowMouseCursor`

### 📌 Grafo: `RotateCharacter`

**Funções e Métodos Chamados:**
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get Mesh`
- `Get RelativeRotation`
- `Get RotateCamera?`
- `Get SpringArm`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ExecuteUbergraph_BP_CharacterViewer`

**Comentários e Títulos de Seção Encontrados:**
- *"Novos controles enhanced"*
- *"Rotacionar o personagem com as teclas \"*
- *"Verificar clique do mouse"*
- *"Rotacionar personagem com o movimento do mouse"*
- *"Criar HUD da tela de customização"*
- *"Evento para rotacionar personagem para esquerda"*
- *"Evento para rotacionar personagem para direita"*
- *"Parar o timer da rotação"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `EventRotateLeft`
- 🟢 `RotateLeft`
- 🟢 `EventRotateRight`
- 🟢 `RotateRight`
- 🟢 `EventStopRotate`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetController()`
- 🛠️ `AddMappingContext()`
- 🛠️ `RotateCharacter()`
- 🛠️ `AddToViewport()`
- 🛠️ `SetInputMode_GameAndUIEx()`
- 🛠️ `GetPlayerController()`
- 🛠️ `K2_SetTimerDelegate()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `K2_ClearAndInvalidateTimerHandle()`
- 🛠️ `Create()`
- 🛠️ `GetLocalPlayerSubSystemFromPlayerController()`
- 🛠️ `Multiply_DoubleDouble()`
- 🛠️ `BreakVector2D()`
- 🛠️ `Conv_InputActionValueToAxis2D()`
- 🛠️ `Conv_InputActionValueToBool()`

**Variáveis Manipuladas:**
- `Get MousePressed`
- `Get RotateTimer`
- `Set MousePressed`
- `Set RotateTimer`
- `Set bShowMouseCursor`

### 📌 Grafo: `EventStopRotate`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CharacterViewer()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CharacterViewer()`

### 📌 Grafo: `RotateRight`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CharacterViewer()`

### 📌 Grafo: `EventRotateRight`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CharacterViewer()`

### 📌 Grafo: `RotateLeft`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CharacterViewer()`

### 📌 Grafo: `EventRotateLeft`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CharacterViewer()`

### 📌 Grafo: `InpActEvt_IA_LookMouse_K2Node_EnhancedInputActionEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CharacterViewer()`

### 📌 Grafo: `InpActEvt_IA_MousePressed_K2Node_EnhancedInputActionEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CharacterViewer()`

### 📌 Grafo: `InpActEvt_IA_MousePressed_K2Node_EnhancedInputActionEvent_2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CharacterViewer()`

### 📌 Grafo: `InpActEvt_IA_Move_K2Node_EnhancedInputActionEvent_3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CharacterViewer()`

### 📌 Grafo: `UserConstructionScript_MERGED`

### 📌 Grafo: `RotateCharacter_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `Multiply_DoubleDouble()`
- 🛠️ `Add_DoubleDouble()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get Mesh`
- `Get RelativeRotation`
- `Get RotateCamera?`
- `Get SpringArm`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_CharacterViewer`?
- Quais variáveis estão disponíveis no Blueprint `BP_CharacterViewer`?
- Quais funções e eventos são chamados no grafo do `BP_CharacterViewer`?