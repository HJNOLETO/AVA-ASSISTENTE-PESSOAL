# 🎮 Blueprint: OverlayStateSwitcher

**[Classe Pai / Parent Class: `UserWidget`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `OverlayStateButtons` | `struct (OverlayStateButtonParams)` |
| `NewOverlayState` | `byte (ALS_OverlayState)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `Construct`
- 🟢 `SelectOverlayState`
- 🟢 `Tick`

**Funções e Métodos Chamados:**
- 🛠️ `GetOwningPlayer()`
- 🛠️ `K2_GetPawn()`
- 🛠️ `BPI_Get_CurrentStates()`
- 🛠️ `BPI_Set_OverlayState()`
- 🛠️ `UpdateButtonFocus()`
- 🛠️ `CreateButtons()`
- 🛠️ `SlotAsCanvasSlot()`
- 🛠️ `SetPosition()`
- 🛠️ `ProjectWorldLocationToWidgetPosition()`
- 🛠️ `BPI_Get_3P_PivotTarget()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get MovablePanel`
- `Get NewOverlayState`
- `Set NewOverlayState`

### 📌 Grafo: `CreateButtons`

**Funções e Métodos Chamados:**
- 🛠️ `GetOwningPlayer()`
- 🛠️ `AddChildToVerticalBox()`
- 🛠️ `SetText()`
- 🛠️ `Conv_StringToText()`

**Variáveis Manipuladas:**
- `Get Button`
- `Get EnumValue`
- `Get OverlayStateButtons`
- `Get Text`
- `Get VerticalBox`
- `Set Button`
- `Set EnumValue`

### 📌 Grafo: `UpdateButtonFocus`

**Funções e Métodos Chamados:**
- 🛠️ `EqualEqual_ByteByte()`
- 🛠️ `SetVisualParameters()`

**Variáveis Manipuladas:**
- `Get NewOverlayState`
- `Get OverlayStateButtons`

### 📌 Grafo: `CycleState`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `UpdateButtonFocus()`

**Variáveis Manipuladas:**
- `Get NewOverlayState`
- `Get TempEnum`
- `Get Up`
- `Set NewOverlayState`

### 📌 Grafo: `ExecuteUbergraph_OverlayStateSwitcher`

**Eventos de Entrada (Events):**
- 🟢 `Construct`
- 🟢 `SelectOverlayState`
- 🟢 `Tick`

**Funções e Métodos Chamados:**
- 🛠️ `GetOwningPlayer()`
- 🛠️ `K2_GetPawn()`
- 🛠️ `BPI_Get_CurrentStates()`
- 🛠️ `BPI_Set_OverlayState()`
- 🛠️ `UpdateButtonFocus()`
- 🛠️ `CreateButtons()`
- 🛠️ `SlotAsCanvasSlot()`
- 🛠️ `SetPosition()`
- 🛠️ `ProjectWorldLocationToWidgetPosition()`
- 🛠️ `BPI_Get_3P_PivotTarget()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get MovablePanel`
- `Get NewOverlayState`
- `Set NewOverlayState`

### 📌 Grafo: `Tick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_OverlayStateSwitcher()`

### 📌 Grafo: `SelectOverlayState`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_OverlayStateSwitcher()`

### 📌 Grafo: `Construct`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_OverlayStateSwitcher()`

### 📌 Grafo: `CreateButtons_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetOwningPlayer()`
- 🛠️ `AddChildToVerticalBox()`
- 🛠️ `SetText()`
- 🛠️ `Conv_StringToText()`
- 🛠️ `Less_IntInt()`
- 🛠️ `GetEnumeratorValueFromIndex()`
- 🛠️ `Conv_IntToByte()`
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Create()`
- 🛠️ `GetEnumeratorUserFriendlyName()`
- 🛠️ `MakeLiteralInt()`
- 🛠️ `GetValidValue()`

**Variáveis Manipuladas:**
- `Get Button`
- `Get EnumValue`
- `Get OverlayStateButtons`
- `Get Text`
- `Get VerticalBox`
- `Set Button`
- `Set EnumValue`

### 📌 Grafo: `UpdateButtonFocus_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `EqualEqual_ByteByte()`
- 🛠️ `SetVisualParameters()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get NewOverlayState`
- `Get OverlayStateButtons`

### 📌 Grafo: `CycleState_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `UpdateButtonFocus()`
- 🛠️ `SelectInt()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `GetEnumeratorValueFromIndex()`
- 🛠️ `Conv_IntToByte()`
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `Add_IntInt()`
- 🛠️ `MakeLiteralInt()`
- 🛠️ `GetValidValue()`

**Variáveis Manipuladas:**
- `Get NewOverlayState`
- `Get TempEnum`
- `Get Up`
- `Set NewOverlayState`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `OverlayStateSwitcher`?
- Quais variáveis estão disponíveis no Blueprint `OverlayStateSwitcher`?
- Quais funções e eventos são chamados no grafo do `OverlayStateSwitcher`?