# 🎮 Blueprint: WBCrosshair

**[Classe Pai / Parent Class: `UserWidget`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `crosshair_spread` | `real (double)` |
| `crosshair_thickness` | `real (double)` |
| `crosshair_length` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `Tick`

**Funções e Métodos Chamados:**
- 🛠️ `SlotAsCanvasSlot()`
- 🛠️ `SetSize()`
- 🛠️ `SetPosition()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `MakeVector2D()`

**Variáveis Manipuladas:**
- `Get bottom`
- `Get crosshair_length`
- `Get crosshair_spread`
- `Get crosshair_thickness`
- `Get left`
- `Get right`
- `Get top`

### 📌 Grafo: `InitCrosshairValues`

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get crosshair_thickness`

### 📌 Grafo: `ExecuteUbergraph_WBCrosshair`

**Eventos de Entrada (Events):**
- 🟢 `Tick`

**Funções e Métodos Chamados:**
- 🛠️ `SlotAsCanvasSlot()`
- 🛠️ `SetSize()`
- 🛠️ `SetPosition()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `MakeVector2D()`

**Variáveis Manipuladas:**
- `Get bottom`
- `Get crosshair_length`
- `Get crosshair_spread`
- `Get crosshair_thickness`
- `Get left`
- `Get right`
- `Get top`

### 📌 Grafo: `Tick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_WBCrosshair()`

### 📌 Grafo: `InitCrosshairValues_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get crosshair_thickness`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `WBCrosshair`?
- Quais variáveis estão disponíveis no Blueprint `WBCrosshair`?
- Quais funções e eventos são chamados no grafo do `WBCrosshair`?