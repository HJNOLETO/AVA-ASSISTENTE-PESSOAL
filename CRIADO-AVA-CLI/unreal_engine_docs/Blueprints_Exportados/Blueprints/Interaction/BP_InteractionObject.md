# 🎮 Blueprint: BP_InteractionObject

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Character` | `object (Actor)` |
| `IsActive` | `bool` |
| `DoOnce` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `TriggerOverlap`

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__BP_InteractionObject_Trigger_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__BP_InteractionObject_Trigger_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerPawn()`
- 🛠️ `TriggerOverlapEnd()`
- 🛠️ `GetComponents()`

**Variáveis Manipuladas:**
- `Get InteractionAllObjects`
- `Set Character`
- `Set InteractionAllObjects`
- `Set TriggerOverlap`

### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `Interact`
- 🟢 `ResetDoOnce`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ExecuteUbergraph_BP_InteractionObject`

**Eventos de Entrada (Events):**
- 🟢 `Interact`
- 🟢 `ResetDoOnce`
- 🟢 `BndEvt__BP_InteractionObject_Trigger_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__BP_InteractionObject_Trigger_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerPawn()`
- 🛠️ `GetComponents()`
- 🛠️ `TriggerOverlapEnd()`
- 🛠️ `EqualEqual_ObjectObject()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get InteractionAllObjects`
- `Set Character`
- `Set InteractionAllObjects`
- `Set TriggerOverlap`

### 📌 Grafo: `BndEvt__BP_InteractionObject_Trigger_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_InteractionObject()`

### 📌 Grafo: `BndEvt__BP_InteractionObject_Trigger_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_InteractionObject()`

### 📌 Grafo: `ResetDoOnce`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_InteractionObject()`

### 📌 Grafo: `Interact`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_InteractionObject()`

### 📌 Grafo: `UserConstructionScript_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_InteractionObject`?
- Quais variáveis estão disponíveis no Blueprint `BP_InteractionObject`?
- Quais funções e eventos são chamados no grafo do `BP_InteractionObject`?