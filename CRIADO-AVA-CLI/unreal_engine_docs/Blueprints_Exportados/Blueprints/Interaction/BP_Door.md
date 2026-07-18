# 🎮 Blueprint: BP_Door

**[Classe Pai / Parent Class: `BP_InteractionObject_C`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `DoorIsOpened` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Está ativo?"*
- *"Spawnar o som em multiplayer"*
- *"Porta"*

**Eventos de Entrada (Events):**
- 🟢 `Interact`
- 🟢 `PlaySound (Multicast)`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `PlaySoundAtLocation()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `PlaySound (Multicast)()`
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `Not_PreBool()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get DoorAxis`
- `Get DoorIsOpened`
- `Get IsActive`
- `Get RelativeRotation`
- `Set DoorIsOpened`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `SelectRotator()`

**Variáveis Manipuladas:**
- `Get DoorAxis`
- `Get DoorIsOpened`

### 📌 Grafo: `ExecuteUbergraph_BP_Door`

**Comentários e Títulos de Seção Encontrados:**
- *"Está ativo?"*
- *"Spawnar o som em multiplayer"*
- *"Porta"*

**Eventos de Entrada (Events):**
- 🟢 `Interact`
- 🟢 `PlaySound (Multicast)`
- 🟢 `RotationDoor__UpdateFunc`
- 🟢 `RotationDoor__FinishedFunc`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `PlaySoundAtLocation()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `PlaySound (Multicast)()`
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `Not_PreBool()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeRotator()`
- 🛠️ `Play()`
- 🛠️ `Reverse()`
- 🛠️ `ReverseFromEnd()`
- 🛠️ `FlushNetDormancy()`
- 🛠️ `MarkPropertyDirtyFromRepIndex()`

**Variáveis Manipuladas:**
- `Get DoorAxis`
- `Get DoorIsOpened`
- `Get IsActive`
- `Get RelativeRotation`
- `Get RotationDoor`
- `Get RotationDoor_Rotation_DC22C30C4280EE2BC0B24B8DABB6215A`
- `Set DoorIsOpened`

### 📌 Grafo: `Interact`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Door()`

### 📌 Grafo: `PlaySound (Multicast)`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Door()`

### 📌 Grafo: `RotationDoor__UpdateFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Door()`

### 📌 Grafo: `RotationDoor__FinishedFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Door()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `SelectRotator()`

**Variáveis Manipuladas:**
- `Get DoorAxis`
- `Get DoorIsOpened`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_Door`?
- Quais variáveis estão disponíveis no Blueprint `BP_Door`?
- Quais funções e eventos são chamados no grafo do `BP_Door`?