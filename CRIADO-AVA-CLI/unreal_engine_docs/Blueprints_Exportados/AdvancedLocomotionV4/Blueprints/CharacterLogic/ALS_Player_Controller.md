# 🎮 Blueprint: ALS_Player_Controller

**[Classe Pai / Parent Class: `PlayerController`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `DebugFocusCharacter` | `object (Character)` |
| `AvailableDebugCharacters` | `object (Character)` |
| `ShowHUD` | `bool` |
| `DebugView` | `bool` |
| `ShowTraces` | `bool` |
| `ShowDebugShapes` | `bool` |
| `ShowLayerColors` | `bool` |
| `ShowCharacterInfo` | `bool` |
| `OverlaySwitcher` | `object (OverlayStateSwitcher_C)` |
| `OverlayMenuOpen` | `bool` |
| `Slomo` | `bool` |
| `HUD` | `object (W_Main_C)` |
| `ALSCameraManager` | `object (ALS_PlayerCameraManager_C)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `BPI_Get_DebugInfo`

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get DebugFocusCharacter`
- `Get DebugView`
- `Get OverlayMenuOpen`
- `Get ShowCharacterInfo`
- `Get ShowDebugShapes`
- `Get ShowHUD`
- `Get ShowLayerColors`
- `Get ShowTraces`
- `Get Slomo`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Multiplas posições da camera"*
- *"Call \"*
- *"Create and add HUD to Viewport"*
- *"Switch Overlay States"*
- *"Visibilidade de cada elemento da tela do player"*

**Eventos de Entrada (Events):**
- 🟢 `VisibilityHUD`
- 🟢 `ReceiveBeginPlay`
- 🟢 `ReceivePossess`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetVisibility()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `RemoveFromParent()`
- 🛠️ `SelectOverlayState()`
- 🛠️ `OnPossess()`
- 🛠️ `ChangeCameraPosition()`
- 🛠️ `CycleState()`
- 🛠️ `PlaySound2D()`
- 🛠️ `AddToViewport()`
- 🛠️ `K2_GetPawn()`
- 🛠️ `PC_SetHUD()`
- 🛠️ `CharBeginPlay()`

**Variáveis Manipuladas:**
- `Get ALSCameraManager`
- `Get DeathScreen`
- `Get HUD`
- `Get OverlayMenuOpen`
- `Get OverlaySwitcher`
- `Get PlayerCameraManager`
- `Get Player_Info`
- `Get Slomo`
- `Set ALSCameraManager`
- `Set HUD`
- `Set OverlayMenuOpen`
- `Set OverlaySwitcher`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ExecuteUbergraph_ALS_Player_Controller`

**Comentários e Títulos de Seção Encontrados:**
- *"Call \"*
- *"Create and add HUD to Viewport"*
- *"Switch Overlay States"*
- *"Visibilidade de cada elemento da tela do player"*
- *"Multiplas posições da camera"*

**Eventos de Entrada (Events):**
- 🟢 `ReceivePossess`
- 🟢 `ReceiveBeginPlay`
- 🟢 `VisibilityHUD`
- 🔀 Contém `7` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `OnPossess()`
- 🛠️ `AddToViewport()`
- 🛠️ `RemoveFromParent()`
- 🛠️ `SelectOverlayState()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `CycleState()`
- 🛠️ `PlaySound2D()`
- 🛠️ `SetVisibility()`
- 🛠️ `K2_GetPawn()`
- 🛠️ `PC_SetHUD()`
- 🛠️ `CharBeginPlay()`
- 🛠️ `ChangeCameraPosition()`
- 🛠️ `IsValid()`
- 🛠️ `Create()`

**Variáveis Manipuladas:**
- `Get ALSCameraManager`
- `Get DeathScreen`
- `Get HUD`
- `Get OverlayMenuOpen`
- `Get OverlaySwitcher`
- `Get PlayerCameraManager`
- `Get Player_Info`
- `Get Slomo`
- `Set ALSCameraManager`
- `Set HUD`
- `Set OverlayMenuOpen`
- `Set OverlaySwitcher`

### 📌 Grafo: `ReceivePossess`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player_Controller()`

### 📌 Grafo: `VisibilityHUD`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player_Controller()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player_Controller()`

### 📌 Grafo: `InpActEvt_V_K2Node_InputKeyEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player_Controller()`

### 📌 Grafo: `InpActEvt_CycleOverlayDown_K2Node_InputActionEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player_Controller()`

### 📌 Grafo: `InpActEvt_CycleOverlayUp_K2Node_InputActionEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player_Controller()`

### 📌 Grafo: `InpActEvt_OpenOverlayMenu_K2Node_InputActionEvent_2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player_Controller()`

### 📌 Grafo: `InpActEvt_OpenOverlayMenu_K2Node_InputActionEvent_3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player_Controller()`

### 📌 Grafo: `UserConstructionScript_MERGED`

### 📌 Grafo: `BPI_Get_DebugInfo_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get DebugFocusCharacter`
- `Get DebugView`
- `Get OverlayMenuOpen`
- `Get ShowCharacterInfo`
- `Get ShowDebugShapes`
- `Get ShowHUD`
- `Get ShowLayerColors`
- `Get ShowTraces`
- `Get Slomo`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `ALS_Player_Controller`?
- Quais variáveis estão disponíveis no Blueprint `ALS_Player_Controller`?
- Quais funções e eventos são chamados no grafo do `ALS_Player_Controller`?