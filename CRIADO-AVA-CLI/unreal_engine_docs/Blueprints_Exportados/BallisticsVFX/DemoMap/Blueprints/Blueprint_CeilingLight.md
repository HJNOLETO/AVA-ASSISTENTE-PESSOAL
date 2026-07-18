# 🎮 Blueprint: Blueprint_CeilingLight

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Brightness` | `real (double)` |
| `Color` | `struct (LinearColor)` |
| `Source Radius` | `real (double)` |
| `Joules` | `real (double)` |
| `SwitchState` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `SwitchChange`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetVisibility()`
- 🛠️ `GreaterEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Joules`
- `Get PointLight1`
- `Get SpotLight`
- `Set SwitchState`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `SetIntensity()`
- 🛠️ `SetLightColor()`

**Variáveis Manipuladas:**
- `Get Brightness`
- `Get Color`
- `Get SpotLight`

### 📌 Grafo: `ExecuteUbergraph_Blueprint_CeilingLight`

**Eventos de Entrada (Events):**
- 🟢 `SwitchChange`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetVisibility()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get Joules`
- `Get PointLight1`
- `Get SpotLight`
- `Set SwitchState`

### 📌 Grafo: `SwitchChange`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Blueprint_CeilingLight()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `SetIntensity()`
- 🛠️ `SetLightColor()`

**Variáveis Manipuladas:**
- `Get Brightness`
- `Get Color`
- `Get SpotLight`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `Blueprint_CeilingLight`?
- Quais variáveis estão disponíveis no Blueprint `Blueprint_CeilingLight`?
- Quais funções e eventos são chamados no grafo do `Blueprint_CeilingLight`?