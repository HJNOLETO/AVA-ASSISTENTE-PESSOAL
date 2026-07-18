# 🎮 Blueprint: PC_ProjetoGTA

**[Classe Pai / Parent Class: `PlayerController`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Main_HUD` | `object (W_Main_C)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Event BeginPlay"*
- *"Visibilidade de cada elemento da tela do player"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `VisibilityHUD`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`
- 🛠️ `AddToViewport()`
- 🛠️ `SetVisibility()`

**Variáveis Manipuladas:**
- `Get DeathScreen`
- `Get Main_HUD`
- `Get Player_Info`
- `Set Main_HUD`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ExecuteUbergraph_PC_ProjetoGTA`

**Comentários e Títulos de Seção Encontrados:**
- *"Event BeginPlay"*
- *"Visibilidade de cada elemento da tela do player"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `VisibilityHUD`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`
- 🛠️ `AddToViewport()`
- 🛠️ `SetVisibility()`
- 🛠️ `Create()`

**Variáveis Manipuladas:**
- `Get DeathScreen`
- `Get Main_HUD`
- `Get Player_Info`
- `Set Main_HUD`

### 📌 Grafo: `VisibilityHUD`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_PC_ProjetoGTA()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_PC_ProjetoGTA()`

### 📌 Grafo: `UserConstructionScript_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `PC_ProjetoGTA`?
- Quais variáveis estão disponíveis no Blueprint `PC_ProjetoGTA`?
- Quais funções e eventos são chamados no grafo do `PC_ProjetoGTA`?