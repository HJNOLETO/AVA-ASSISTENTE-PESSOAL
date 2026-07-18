# 🎮 Blueprint: AC_PlayerStatus

**[Classe Pai / Parent Class: `ActorComponent`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Character` | `object (Character)` |
| `Health` | `real (double)` |
| `MaxHealth` | `real (double)` |
| `LocalDamage` | `real (double)` |
| `MinHealth` | `real (double)` |
| `Armour` | `real (double)` |
| `MaxArmour` | `real (double)` |
| `NewStamina` | `real (double)` |
| `TimeStamina` | `real (double)` |
| `StaminaTimer` | `struct (TimerHandle)` |
| `Stamina` | `real (double)` |
| `MaxStamina` | `real (double)` |
| `NewJumpStamina` | `real (double)` |
| `CanJump` | `bool` |
| `TimeJumpStamina` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Event BeginPlay"*
- *"Sistema de vida"*
- *"Receber dano colete"*
- *"Evento Set Damage"*
- *"Jump"*
- *"Recuperar vida"*
- *"Efeitos visuais de dano"*
- *"Receber dano = 0 morrer"*
- *"Evento Fall Damage"*
- *"Sprint"*
- *"Event Tick"*
- *"Stamina Sprint"*
- *"Jump Stamina"*
- *"Sistema de Colete"*

**Eventos de Entrada (Events):**
- 🟢 `Sprint`
- 🟢 `FallDamage`
- 🟢 `StaminaSprint`
- 🟢 `JumpStamina`
- 🟢 `HealthRegen`
- 🟢 `StartHealthRegen`
- 🟢 `Jump`
- 🟢 `ReceiveBeginPlay`
- 🟢 `ReceiveTick`
- 🟢 `SetHealth`
- 🟢 `SetDamage`
- 🟢 `SetArmour`
- 🔀 Contém `16` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetHealth()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `GetOwner()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `PrintString()`
- 🛠️ `StartCameraShake()`
- 🛠️ `IsMovingOnGround()`
- 🛠️ `SetDamage()`
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `K2_SetTimerDelegate()`
- 🛠️ `GetVelocity()`
- 🛠️ `FClamp()`
- 🛠️ `Not_PreBool()`
- 🛠️ `Abs()`
- 🛠️ `InRange_FloatFloat()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `K2_ClearAndInvalidateTimerHandle()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `IsFalling()`
- 🛠️ `Jump()`
- 🛠️ `Conv_BoolToString()`
- 🛠️ `Sprint()`
- 🛠️ `Roll Event()`
- 🛠️ `SetArmour()`
- 🛠️ `StartHealthRegen()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `DamageAnimation()`
- 🛠️ `GetCharacterDead()`
- 🛠️ `GetComponents()`
- 🛠️ `Death()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get Armour`
- `Get CanJump`
- `Get Character`
- `Get CharacterMovement`
- `Get DesiredGait`
- `Get Gait`
- `Get Health`
- `Get InteractionObject`
- `Get IsActive`
- `Get LocalDamage`
- `Get MaxArmour`
- `Get MaxHealth`
- `Get MaxStamina`
- `Get Mesh`
- `Get MinHealth`
- `Get NewJumpStamina`
- `Get NewStamina`
- `Get Stamina`
- `Get StaminaTimer`
- `Get Stance`
- `Get TimeJumpStamina`
- `Get TimeStamina`
- `Set Armour`
- `Set CanJump`
- `Set Character`
- `Set DesiredGait`
- `Set Health`
- `Set LocalDamage`
- `Set NewJumpStamina`
- `Set NewStamina`
- `Set Stamina`
- `Set StaminaTimer`
- `Set Stance`

### 📌 Grafo: `GetCharacterDead`

### 📌 Grafo: `HealthRegeneration`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `RetriggerableDelay()`
- 🛠️ `SetHealth()`
- 🛠️ `PrintString()`
- 🛠️ `Not_PreBool()`
- 🛠️ `GetCharacterDead()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get Health`
- `Get MaxHealth`

### 📌 Grafo: `ExecuteUbergraph_AC_PlayerStatus`

**Comentários e Títulos de Seção Encontrados:**
- *"Event BeginPlay"*
- *"Sistema de vida"*
- *"Efeitos visuais de dano"*
- *"Receber dano = 0 morrer"*
- *"Sistema de Colete"*
- *"Receber dano colete"*
- *"Evento Set Damage"*
- *"Evento Fall Damage"*
- *"Sprint"*
- *"Event Tick"*
- *"Stamina Sprint"*
- *"Jump Stamina"*
- *"Jump"*
- *"Recuperar vida"*
- *"Only do variable assignment the first time in"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `SetHealth`
- 🟢 `SetDamage`
- 🟢 `SetArmour`
- 🟢 `FallDamage`
- 🟢 `Sprint`
- 🟢 `StaminaSprint`
- 🟢 `ReceiveTick`
- 🟢 `JumpStamina`
- 🟢 `Jump`
- 🟢 `HealthRegen`
- 🟢 `StartHealthRegen`
- 🟢 `IsJetpack`
- 🟢 `IsJumping`
- 🟢 `IsDead`
- 🟢 `Death`
- 🟢 `DamageAnimation`
- 🔀 Contém `24` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `StartCameraShake()`
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `SetHealth()`
- 🛠️ `PrintString()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `DamageAnimation()`
- 🛠️ `Death()`
- 🛠️ `GetVelocity()`
- 🛠️ `Abs()`
- 🛠️ `InRange_FloatFloat()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `SetDamage()`
- 🛠️ `K2_SetTimerDelegate()`
- 🛠️ `IsMovingOnGround()`
- 🛠️ `FClamp()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `K2_ClearAndInvalidateTimerHandle()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `IsFalling()`
- 🛠️ `Jump()`
- 🛠️ `Conv_BoolToString()`
- 🛠️ `Sprint()`
- 🛠️ `Roll Event()`
- 🛠️ `SetArmour()`
- 🛠️ `GetOwner()`
- 🛠️ `GetComponents()`
- 🛠️ `GetCharacterDead()`
- 🛠️ `Not_PreBool()`
- 🛠️ `StartHealthRegen()`
- 🛠️ `RetriggerableDelay()`
- 🛠️ `IsValid()`
- 🛠️ `EqualEqual_ByteByte()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get Armour`
- `Get CanJump`
- `Get Character`
- `Get CharacterMovement`
- `Get DesiredGait`
- `Get Gait`
- `Get Health`
- `Get InteractionObject`
- `Get IsActive`
- `Get LocalDamage`
- `Get MaxArmour`
- `Get MaxHealth`
- `Get MaxStamina`
- `Get Mesh`
- `Get MinHealth`
- `Get NewJumpStamina`
- `Get NewStamina`
- `Get Stamina`
- `Get StaminaTimer`
- `Get Stance`
- `Get TimeJumpStamina`
- `Get TimeStamina`
- `Set Armour`
- `Set CanJump`
- `Set Character`
- `Set DesiredGait`
- `Set Health`
- `Set LocalDamage`
- `Set NewJumpStamina`
- `Set NewStamina`
- `Set Stamina`
- `Set StaminaTimer`
- `Set Stance`

### 📌 Grafo: `StartHealthRegen`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `HealthRegen`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `DamageAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `Death`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `IsDead`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `IsJumping`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `Jump`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `IsJetpack`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `JumpStamina`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `SetHealth`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `SetDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `StaminaSprint`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `Sprint`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `FallDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `SetArmour`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_PlayerStatus()`

### 📌 Grafo: `GetCharacterDead_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `AC_PlayerStatus`?
- Quais variáveis estão disponíveis no Blueprint `AC_PlayerStatus`?
- Quais funções e eventos são chamados no grafo do `AC_PlayerStatus`?