# 🎮 Blueprint: ALS_HUD

**[Classe Pai / Parent Class: `UserWidget`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `DebugFocusCharacter` | `object (Character)` |
| `DebugView` | `bool` |
| `ShowHUD` | `bool` |
| `Slomo` | `bool` |
| `ShowTraces` | `bool` |
| `ShowDebugShapes` | `bool` |
| `ShowLayerColors` | `bool` |
| `ShowCharacterInfo` | `bool` |
| `EnabledColor` | `struct (LinearColor)` |
| `DisabledColor` | `struct (LinearColor)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `Get_HUD_Visibility`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get ShowHUD`

### 📌 Grafo: `Get_ShowHUD_Color`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DisabledColor`
- `Get EnabledColor`
- `Get ShowHUD`

### 📌 Grafo: `Get_DebugCharacterName`

**Funções e Métodos Chamados:**
- 🛠️ `Conv_StringToText()`
- 🛠️ `GetObjectName()`

**Variáveis Manipuladas:**
- `Get DebugFocusCharacter`

### 📌 Grafo: `Get_CharacterStates`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Get_CurrentStates()`
- 🛠️ `Conv_StringToText()`

**Variáveis Manipuladas:**
- `Get DebugFocusCharacter`
- `Get ShowCharacterInfo`

### 📌 Grafo: `Get_AnimCurveNames`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `Conv_NameToString()`
- 🛠️ `Conv_StringToText()`
- 🛠️ `GetActiveCurveNames()`

**Variáveis Manipuladas:**
- `Get CurveName`
- `Get DebugFocusCharacter`
- `Get Mesh`
- `Get String`
- `Set AnimInstance`
- `Set CurveName`
- `Set String`

### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `Tick`

**Funções e Métodos Chamados:**
- 🛠️ `SlotAsCanvasSlot()`
- 🛠️ `SetPosition()`
- 🛠️ `ProjectWorldLocationToWidgetPosition()`
- 🛠️ `GetOwningPlayer()`
- 🛠️ `BPI_Get_3P_PivotTarget()`
- 🛠️ `BreakTransform()`
- 🛠️ `Get_CharacterInfo_Visibility()`
- 🛠️ `BPI_Get_DebugInfo()`

**Variáveis Manipuladas:**
- `Get DebugFocusCharacter`
- `Get MovablePanels`
- `Set DebugFocusCharacter`
- `Set DebugView`
- `Set ShowCharacterInfo`
- `Set ShowDebugShapes`
- `Set ShowHUD`
- `Set ShowLayerColors`
- `Set ShowTraces`
- `Set Slomo`

### 📌 Grafo: `Get_CharacterInfo_Visibility`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DebugFocusCharacter`
- `Get ShowCharacterInfo`

### 📌 Grafo: `Get_Slomo_Color`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DisabledColor`
- `Get EnabledColor`
- `Get Slomo`

### 📌 Grafo: `Get_DebugView_Color`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DebugView`
- `Get DisabledColor`
- `Get EnabledColor`

### 📌 Grafo: `Get_ShowTraces_Color`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DisabledColor`
- `Get EnabledColor`
- `Get ShowTraces`

### 📌 Grafo: `Get_ShowDebugShapes_Color`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DisabledColor`
- `Get EnabledColor`
- `Get ShowDebugShapes`

### 📌 Grafo: `Get_ShowLayerColors_Color`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DisabledColor`
- `Get EnabledColor`
- `Get ShowLayerColors`

### 📌 Grafo: `Get_ShowCharacterInfo_Color`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DisabledColor`
- `Get EnabledColor`
- `Get ShowCharacterInfo`

### 📌 Grafo: `Get_AnimCurveValues`

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `Conv_StringToText()`
- 🛠️ `GetActiveCurveNames()`
- 🛠️ `GetAnimInstance()`

**Variáveis Manipuladas:**
- `Get AnimInstance`
- `Get CurveName`
- `Get DebugFocusCharacter`
- `Get Mesh`
- `Get String`
- `Set AnimInstance`
- `Set CurveName`
- `Set String`

### 📌 Grafo: `ExecuteUbergraph_ALS_HUD`

**Eventos de Entrada (Events):**
- 🟢 `Tick`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SlotAsCanvasSlot()`
- 🛠️ `SetPosition()`
- 🛠️ `ProjectWorldLocationToWidgetPosition()`
- 🛠️ `GetOwningPlayer()`
- 🛠️ `BPI_Get_3P_PivotTarget()`
- 🛠️ `BreakTransform()`
- 🛠️ `Get_CharacterInfo_Visibility()`
- 🛠️ `BPI_Get_DebugInfo()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get DebugFocusCharacter`
- `Get MovablePanels`
- `Set DebugFocusCharacter`
- `Set DebugView`
- `Set ShowCharacterInfo`
- `Set ShowDebugShapes`
- `Set ShowHUD`
- `Set ShowLayerColors`
- `Set ShowTraces`
- `Set Slomo`

### 📌 Grafo: `Tick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_HUD()`

### 📌 Grafo: `Get_HUD_Visibility_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get ShowHUD`

### 📌 Grafo: `Get_CharacterInfo_Visibility_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get DebugFocusCharacter`
- `Get ShowCharacterInfo`

### 📌 Grafo: `Get_ShowHUD_Color_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DisabledColor`
- `Get EnabledColor`
- `Get ShowHUD`

### 📌 Grafo: `Get_Slomo_Color_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DisabledColor`
- `Get EnabledColor`
- `Get Slomo`

### 📌 Grafo: `Get_DebugView_Color_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DebugView`
- `Get DisabledColor`
- `Get EnabledColor`

### 📌 Grafo: `Get_ShowTraces_Color_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DisabledColor`
- `Get EnabledColor`
- `Get ShowTraces`

### 📌 Grafo: `Get_ShowDebugShapes_Color_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DisabledColor`
- `Get EnabledColor`
- `Get ShowDebugShapes`

### 📌 Grafo: `Get_ShowLayerColors_Color_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DisabledColor`
- `Get EnabledColor`
- `Get ShowLayerColors`

### 📌 Grafo: `Get_ShowCharacterInfo_Color_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get DisabledColor`
- `Get EnabledColor`
- `Get ShowCharacterInfo`

### 📌 Grafo: `Get_DebugCharacterName_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_StringToText()`
- 🛠️ `GetObjectName()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get DebugFocusCharacter`

### 📌 Grafo: `Get_CharacterStates_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Get_CurrentStates()`
- 🛠️ `Conv_StringToText()`
- 🛠️ `IsValid()`
- 🛠️ `GetEnumeratorUserFriendlyName()`

**Variáveis Manipuladas:**
- `Get DebugFocusCharacter`
- `Get ShowCharacterInfo`

### 📌 Grafo: `Get_AnimCurveNames_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `Conv_NameToString()`
- 🛠️ `Conv_StringToText()`
- 🛠️ `GetActiveCurveNames()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get AnimInstance`
- `Get CurveName`
- `Get DebugFocusCharacter`
- `Get Mesh`
- `Get String`
- `Set AnimInstance`
- `Set CurveName`
- `Set String`

### 📌 Grafo: `Get_AnimCurveValues_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `Conv_StringToText()`
- 🛠️ `GetActiveCurveNames()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get AnimInstance`
- `Get CurveName`
- `Get DebugFocusCharacter`
- `Get Mesh`
- `Get String`
- `Set AnimInstance`
- `Set CurveName`
- `Set String`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `ALS_HUD`?
- Quais variáveis estão disponíveis no Blueprint `ALS_HUD`?
- Quais funções e eventos são chamados no grafo do `ALS_HUD`?