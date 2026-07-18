# 🎮 Blueprint: Doors_DM_opener

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Left Door Is broken!` | `bool` |
| `Right Door Is broken!` | `bool` |
| `Fracture!` | `mcdelegate` |
| `FP_rifle` | `object` |
| `InMotionLeft` | `bool` |
| `InMotionRight` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveActorBeginOverlap` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `ReceiveTick` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `BndEvt__SM_Door_DM_K2Node_ComponentBoundEvent_100_ComponentFractureSignature__DelegateSignature`
- 🟢 `BndEvt__SM_Door_DM1_K2Node_ComponentBoundEvent_105_ComponentFractureSignature__DelegateSignature`
- 🟢 `BndEvt__Trigger_1_K2Node_ComponentBoundEvent_467_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__Trigger_1_K2Node_ComponentBoundEvent_474_ComponentEndOverlapSignature__DelegateSignature`
- 🔀 Contém `10` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MoveComponentTo()`
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `Delay()`

**Variáveis Manipuladas:**
- `Get AssholeRating`
- `Get Doors Destroyed?`
- `Get InMotionLeft`
- `Get InMotionRight`
- `Get Left Door Is broken!`
- `Get Right Door Is broken!`
- `Get SM_Door_DM_left`
- `Get SM_Door_DM_right`
- `Set AssholeRating`
- `Set Doors Destroyed?`
- `Set InMotionLeft`
- `Set InMotionRight`
- `Set Left Door Is broken!`
- `Set Right Door Is broken!`

### 📌 Grafo: `UserConstructionScript`

**Variáveis Manipuladas:**
- `Set Left Door Is broken!`
- `Set Right Door Is broken!`

### 📌 Grafo: `Fracture!`

### 📌 Grafo: `ExecuteUbergraph_Doors_DM_opener`

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__SM_Door_DM_K2Node_ComponentBoundEvent_100_ComponentFractureSignature__DelegateSignature`
- 🟢 `BndEvt__SM_Door_DM1_K2Node_ComponentBoundEvent_105_ComponentFractureSignature__DelegateSignature`
- 🟢 `BndEvt__Trigger_1_K2Node_ComponentBoundEvent_467_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__Trigger_1_K2Node_ComponentBoundEvent_474_ComponentEndOverlapSignature__DelegateSignature`
- 🔀 Contém `10` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MoveComponentTo()`
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `Delay()`

**Variáveis Manipuladas:**
- `Get AssholeRating`
- `Get Doors Destroyed?`
- `Get InMotionLeft`
- `Get InMotionRight`
- `Get Left Door Is broken!`
- `Get Right Door Is broken!`
- `Get SM_Door_DM_left`
- `Get SM_Door_DM_right`
- `Set AssholeRating`
- `Set Doors Destroyed?`
- `Set InMotionLeft`
- `Set InMotionRight`
- `Set Left Door Is broken!`
- `Set Right Door Is broken!`

### 📌 Grafo: `BndEvt__Trigger_1_K2Node_ComponentBoundEvent_474_ComponentEndOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Doors_DM_opener()`

### 📌 Grafo: `BndEvt__Trigger_1_K2Node_ComponentBoundEvent_467_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Doors_DM_opener()`

### 📌 Grafo: `BndEvt__SM_Door_DM1_K2Node_ComponentBoundEvent_105_ComponentFractureSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Doors_DM_opener()`

### 📌 Grafo: `BndEvt__SM_Door_DM_K2Node_ComponentBoundEvent_100_ComponentFractureSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Doors_DM_opener()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Variáveis Manipuladas:**
- `Set Left Door Is broken!`
- `Set Right Door Is broken!`

### 📌 Grafo: `Fracture!_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `Doors_DM_opener`?
- Quais variáveis estão disponíveis no Blueprint `Doors_DM_opener`?
- Quais funções e eventos são chamados no grafo do `Doors_DM_opener`?