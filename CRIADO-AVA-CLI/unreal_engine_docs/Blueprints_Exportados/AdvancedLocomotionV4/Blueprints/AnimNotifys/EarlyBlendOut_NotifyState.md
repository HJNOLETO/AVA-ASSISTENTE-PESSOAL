# 🎮 Blueprint: EarlyBlendOut_NotifyState

**[Classe Pai / Parent Class: `AnimNotifyState`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `ThisMontage` | `object (AnimMontage)` |
| `BlendOutTime` | `real (double)` |
| `CheckMovementState` | `bool` |
| `MovementStateEquals` | `byte (ALS_MovementState)` |
| `CheckStance` | `bool` |
| `StanceEquals` | `byte (ALS_Stance)` |
| `CheckMovementInput` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `Received_NotifyTick`
- 🔀 Contém `6` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Get_EssentialValues()`
- 🛠️ `BPI_Get_CurrentStates()`
- 🛠️ `Montage_Stop()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `GetOwner()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get AnimInstance`
- `Get BlendOutTime`
- `Get CheckMovementInput`
- `Get CheckMovementState`
- `Get CheckStance`
- `Get MovementStateEquals`
- `Get OwningActor`
- `Get StanceEquals`
- `Get ThisMontage`
- `Set AnimInstance`
- `Set OwningActor`

### 📌 Grafo: `GetNotifyName`

### 📌 Grafo: `Received_NotifyTick_MERGED`
- 🔀 Contém `6` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Get_EssentialValues()`
- 🛠️ `BPI_Get_CurrentStates()`
- 🛠️ `Montage_Stop()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `GetOwner()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get AnimInstance`
- `Get BlendOutTime`
- `Get CheckMovementInput`
- `Get CheckMovementState`
- `Get CheckStance`
- `Get MovementStateEquals`
- `Get OwningActor`
- `Get StanceEquals`
- `Get ThisMontage`
- `Set AnimInstance`
- `Set OwningActor`

### 📌 Grafo: `GetNotifyName_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `EarlyBlendOut_NotifyState`?
- Quais variáveis estão disponíveis no Blueprint `EarlyBlendOut_NotifyState`?
- Quais funções e eventos são chamados no grafo do `EarlyBlendOut_NotifyState`?