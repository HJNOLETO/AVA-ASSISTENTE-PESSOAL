# 🎮 Blueprint: ProjetoGameInstance

**[Classe Pai / Parent Class: `GameInstance`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `RealTime` | `bool` |
| `Hour` | `int` |
| `Minute` | `int` |
| `Tick` | `real (double)` |
| `TimeOfDay` | `real (double)` |
| `DayCount` | `int` |
| `Day` | `int` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Hora do jogo"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveInit`

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetTimerDelegate()`
- 🛠️ `GetGameTimeInSeconds()`

### 📌 Grafo: `Tempo do Real/Jogo`

**Comentários e Títulos de Seção Encontrados:**
- *"Velocidade do Tempo do Jogo"*
- *"Obtem os minutos"*
- *"Obtem as horas"*

**Eventos de Entrada (Events):**
- 🟢 `GameTime`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Now()`
- 🛠️ `GetHour()`
- 🛠️ `GetMinute()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `FMod()`
- 🛠️ `FFloor()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `GetActorOfClass()`
- 🛠️ `TimeOfDay()`

**Variáveis Manipuladas:**
- `Get Day`
- `Get DayCount`
- `Get RealTime`
- `Get Tick`
- `Get TimeOfDay`
- `Set Day`
- `Set DayCount`
- `Set Hour`
- `Set Minute`
- `Set TimeOfDay`

### 📌 Grafo: `AddTime`

**Variáveis Manipuladas:**
- `Get TimeOfDay`
- `Set TimeOfDay`

### 📌 Grafo: `ExecuteUbergraph_ProjetoGameInstance`

**Comentários e Títulos de Seção Encontrados:**
- *"Hora do jogo"*
- *"Velocidade do Tempo do Jogo"*
- *"Obtem os minutos"*
- *"Obtem as horas"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveInit`
- 🟢 `GameTime`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetTimerDelegate()`
- 🛠️ `GetGameTimeInSeconds()`
- 🛠️ `Now()`
- 🛠️ `GetHour()`
- 🛠️ `GetMinute()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `FMod()`
- 🛠️ `FFloor()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `GetActorOfClass()`
- 🛠️ `TimeOfDay()`

**Variáveis Manipuladas:**
- `Get Day`
- `Get DayCount`
- `Get RealTime`
- `Get Tick`
- `Get TimeOfDay`
- `Set Day`
- `Set DayCount`
- `Set Hour`
- `Set Minute`
- `Set TimeOfDay`

### 📌 Grafo: `GameTime`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ProjetoGameInstance()`

### 📌 Grafo: `ReceiveInit`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ProjetoGameInstance()`

### 📌 Grafo: `AddTime_MERGED`

**Variáveis Manipuladas:**
- `Get TimeOfDay`
- `Set TimeOfDay`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `ProjetoGameInstance`?
- Quais variáveis estão disponíveis no Blueprint `ProjetoGameInstance`?
- Quais funções e eventos são chamados no grafo do `ProjetoGameInstance`?