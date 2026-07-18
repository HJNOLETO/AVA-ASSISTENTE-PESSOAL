# 🎮 Blueprint: UMG_RadialMenu

**[Classe Pai / Parent Class: `UserWidget`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Time` | `real (double)` |
| `Angles` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `PreConstruct` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `Construct` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `Tick` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*

### 📌 Grafo: `GetCurrentIndex`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `GetComponentByClass()`
- 🛠️ `GreaterEqual_IntInt()`

**Variáveis Manipuladas:**
- `Get Current Weapon Index`

### 📌 Grafo: `RadialMenuControl`

**Comentários e Títulos de Seção Encontrados:**
- *"Mouse"*
- *"Gamepad"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`
- 🛠️ `GetMousePosition()`
- 🛠️ `DegAtan2()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `SelectFloat()`
- 🛠️ `MakeVector2D()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `GetViewportSize()`
- 🛠️ `VSize2D()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Divide_IntInt()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `GetComponentByClass()`
- 🛠️ `BreakVector2D()`
- 🛠️ `FTrunc()`
- 🛠️ `SetRenderTransformAngle()`
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Get Angle`
- `Get Angles`
- `Get Gamepad X`
- `Get Gamepad Y`
- `Get MenuRadial`
- `Get Selection`
- `Get Slots`
- `Get Time`
- `Set Angle`
- `Set Current Weapon Index`
- `Set Gamepad X`
- `Set Gamepad Y`
- `Set Time`

### 📌 Grafo: `ExecuteUbergraph_UMG_RadialMenu`

### 📌 Grafo: `RadialMenuControl_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Mouse"*
- *"Gamepad"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`
- 🛠️ `GetMousePosition()`
- 🛠️ `GetViewportSize()`
- 🛠️ `BreakVector2D()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `VSize2D()`
- 🛠️ `MakeVector2D()`
- 🛠️ `DegAtan2()`
- 🛠️ `SelectFloat()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Divide_IntInt()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `GetComponentByClass()`
- 🛠️ `FTrunc()`
- 🛠️ `SetRenderTransformAngle()`
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Get Angle`
- `Get Angles`
- `Get Current Weapon Index`
- `Get Gamepad X`
- `Get Gamepad Y`
- `Get MenuRadial`
- `Get Selection`
- `Get Slots`
- `Get Time`
- `Set Angle`
- `Set Current Weapon Index`
- `Set Gamepad X`
- `Set Gamepad Y`
- `Set Slots`
- `Set Time`

### 📌 Grafo: `GetCurrentIndex_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `GetComponentByClass()`
- 🛠️ `GreaterEqual_IntInt()`

**Variáveis Manipuladas:**
- `Get Current Weapon Index`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `UMG_RadialMenu`?
- Quais variáveis estão disponíveis no Blueprint `UMG_RadialMenu`?
- Quais funções e eventos são chamados no grafo do `UMG_RadialMenu`?