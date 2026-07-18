# 🎮 Blueprint: AC_Interaction

**[Classe Pai / Parent Class: `ActorComponent`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Character` | `object (Character)` |
| `InteractionAllObjects` | `object (BP_InteractionObject_C)` |
| `InteractionObject` | `object (BP_InteractionObject_C)` |
| `Distance` | `real (double)` |
| `TriggerOverlap` | `bool` |
| `Interaction` | `bool` |
| `PickupAllObjects` | `object (BP_PickupObject_C)` |
| `PickupObject` | `object (BP_PickupObject_C)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Aplicar configurações a classe character"*
- *"Verficar colisão"*
- *"Verificação de interação"*
- *"Pegar itens"*
- *"Interagir com objetos"*

**Eventos de Entrada (Events):**
- 🟢 `EventInteraction`
- 🟢 `TriggerOverlapEnd`
- 🟢 `ReceiveBeginPlay`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SelectPickupObject()`
- 🛠️ `GetOwner()`
- 🛠️ `Not_PreBool()`
- 🛠️ `Interact()`
- 🛠️ `SelectInteractionObject()`
- 🛠️ `GetOverlappingComponents()`
- 🛠️ `GetCollisionObjectType()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get Interaction`
- `Get InteractionObject`
- `Get PickupObject`
- `Get TriggerOverlap`
- `Set Character`
- `Set TriggerOverlap`

### 📌 Grafo: `SelectInteractionObject`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `VSize()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get Distance`
- `Get InteractionAllObjects`
- `Get InteractionObject`
- `Set Distance`
- `Set InteractionObject`

### 📌 Grafo: `SelectPickupObject`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `VSize()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get Distance`
- `Get PickupAllObjects`
- `Get PickupObject`
- `Set Distance`
- `Set PickupObject`

### 📌 Grafo: `ExecuteUbergraph_AC_Interaction`

**Comentários e Títulos de Seção Encontrados:**
- *"Aplicar configurações a classe character"*
- *"Verficar colisão"*
- *"Verificação de interação"*
- *"Pegar itens"*
- *"Interagir com objetos"*
- *"Init Loop Counter"*
- *"Test Loop Condition"*
- *"Execute Loop Body"*
- *"Increment Loop Counter"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Init Array Index"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `EventInteraction`
- 🟢 `TriggerOverlapEnd`
- 🔀 Contém `6` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetOwner()`
- 🛠️ `SelectInteractionObject()`
- 🛠️ `Interact()`
- 🛠️ `GetOverlappingComponents()`
- 🛠️ `GetCollisionObjectType()`
- 🛠️ `Not_PreBool()`
- 🛠️ `SelectPickupObject()`
- 🛠️ `IsValid()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `EqualEqual_ByteByte()`
- 🛠️ `EqualEqual_IntInt()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get Interaction`
- `Get InteractionObject`
- `Get PickupObject`
- `Get TriggerOverlap`
- `Set Character`
- `Set TriggerOverlap`

### 📌 Grafo: `TriggerOverlapEnd`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_Interaction()`

### 📌 Grafo: `EventInteraction`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_Interaction()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_Interaction()`

### 📌 Grafo: `SelectInteractionObject_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `VSize()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Less_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get Distance`
- `Get InteractionAllObjects`
- `Get InteractionObject`
- `Set Distance`
- `Set InteractionObject`

### 📌 Grafo: `SelectPickupObject_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `VSize()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Less_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get Distance`
- `Get PickupAllObjects`
- `Get PickupObject`
- `Set Distance`
- `Set PickupObject`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `AC_Interaction`?
- Quais variáveis estão disponíveis no Blueprint `AC_Interaction`?
- Quais funções e eventos são chamados no grafo do `AC_Interaction`?