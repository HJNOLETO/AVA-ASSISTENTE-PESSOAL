# 🎮 Blueprint: ALS_Player

**[Classe Pai / Parent Class: `ALS_Base_CharacterBP_C`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `DefaultColor` | `struct (LinearColor)` |
| `SkinColor` | `struct (LinearColor)` |
| `ShirtColor` | `struct (LinearColor)` |
| `PantsColor` | `struct (LinearColor)` |
| `ShoesColor` | `struct (LinearColor)` |
| `GlovesColor` | `struct (LinearColor)` |
| `ShirtType` | `int` |
| `PantsType` | `int` |
| `Shoes` | `bool` |
| `Gloves` | `bool` |
| `SolidColor` | `bool` |
| `BaseLayerColor` | `struct (LinearColor)` |
| `OverlayLayerColor` | `struct (LinearColor)` |
| `AdditiveAmount_Color` | `struct (LinearColor)` |
| `Hand_Color` | `struct (LinearColor)` |
| `HandIK_Color` | `struct (LinearColor)` |
| `Head` | `object (MaterialInstanceDynamic)` |
| `Torso` | `object (MaterialInstanceDynamic)` |
| `Pelvis` | `object (MaterialInstanceDynamic)` |
| `Feet` | `object (MaterialInstanceDynamic)` |
| `Shoulder_L` | `object (MaterialInstanceDynamic)` |
| `UpperArm_L` | `object (MaterialInstanceDynamic)` |
| `LowerArm_L` | `object (MaterialInstanceDynamic)` |
| `Hand_L` | `object (MaterialInstanceDynamic)` |
| `Shoulder_R` | `object (MaterialInstanceDynamic)` |
| `UpperArm_R` | `object (MaterialInstanceDynamic)` |
| `LowerArm_R` | `object (MaterialInstanceDynamic)` |
| `Hand_R` | `object (MaterialInstanceDynamic)` |
| `UpperLegs` | `object (MaterialInstanceDynamic)` |
| `LowerLegs` | `object (MaterialInstanceDynamic)` |
| `Mantle_2m_Default` | `struct (Mantle_Asset)` |
| `Mantle_1m_Default` | `struct (Mantle_Asset)` |
| `Mantle_1m_RH` | `struct (Mantle_Asset)` |
| `Mantle_1m_LH` | `struct (Mantle_Asset)` |
| `Mantle_1m_2H` | `struct (Mantle_Asset)` |
| `Mantle_1m_Box` | `struct (Mantle_Asset)` |
| `LandRoll_Default` | `object (AnimMontage)` |
| `GetUpFront_Default` | `object (AnimMontage)` |
| `LandRoll_RH` | `object (AnimMontage)` |
| `LandRoll_LH` | `object (AnimMontage)` |
| `LandRoll_2H` | `object (AnimMontage)` |
| `GetUpFront_RH` | `object (AnimMontage)` |
| `GetUpFront_LH` | `object (AnimMontage)` |
| `GetUpFront_2H` | `object (AnimMontage)` |
| `GetUpBack_Default` | `object (AnimMontage)` |
| `GetUpBack_RH` | `object (AnimMontage)` |
| `GetUpBack_LH` | `object (AnimMontage)` |
| `GetUpBack_2H` | `object (AnimMontage)` |
| `IsFlying` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `AttachToHand`

**Funções e Métodos Chamados:**
- 🛠️ `ClearHeldObject()`
- 🛠️ `K2_SetRelativeLocation()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `SetSkinnedAssetAndUpdate()`
- 🛠️ `SetAnimClass()`
- 🛠️ `SetStaticMesh()`

**Variáveis Manipuladas:**
- `Get HeldObjectRoot`
- `Get LeftHand`
- `Get Mesh`
- `Get NewAnimClass`
- `Get NewSkeletalMesh`
- `Get NewStaticMesh`
- `Get Offset`
- `Get SkeletalMesh`
- `Get StaticMesh`

### 📌 Grafo: `BPI_Get_3P_PivotTarget`

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `GetVectorArrayAverage()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `K2_GetActorRotation()`

**Variáveis Manipuladas:**
- `Get Mesh`

### 📌 Grafo: `BPI_Get_3P_TraceParams`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketLocation()`

**Variáveis Manipuladas:**
- `Get Mesh`
- `Get RightShoulder`

### 📌 Grafo: `BPI_Get_FP_CameraTarget`

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketLocation()`

**Variáveis Manipuladas:**
- `Get Mesh`

### 📌 Grafo: `ClearHeldObject`

**Funções e Métodos Chamados:**
- 🛠️ `SetStaticMesh()`
- 🛠️ `SetSkinnedAssetAndUpdate()`
- 🛠️ `SetAnimClass()`

**Variáveis Manipuladas:**
- `Get SkeletalMesh`
- `Get StaticMesh`

### 📌 Grafo: `DamageSpeed`

**Funções e Métodos Chamados:**
- 🛠️ `LessEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Health`
- `Get PlayerStatus`
- `Set DesiredGait`

### 📌 Grafo: `Event Death`

**Comentários e Títulos de Seção Encontrados:**
- *"Attach e colisão"*
- *"Deixar o jogo lento"*
- *"Exibir/esconder HUD"*
- *"Reanimar personagem"*
- *"Camera fade"*
- *"Física e colisão"*
- *"Dead e movimento desabilitado"*
- *"Parar animações e executar animação de morrer"*
- *"Desabilitar colisão da capsula"*

**Eventos de Entrada (Events):**
- 🟢 `Death`

**Funções e Métodos Chamados:**
- 🛠️ `VisibilityHUD()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `SetCollisionResponseToChannel()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `StopAnimMontage()`
- 🛠️ `RagdollStart()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `Delay()`
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `StartCameraFade()`
- 🛠️ `GetPlayerController()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `Reanimate()`
- 🛠️ `Deactivate()`
- 🛠️ `IsDead()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get Mesh`
- `Set Dead`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Reanimar personagem"*
- *"Evento para morrer"*
- *"Event Tick"*
- *"Event BeginPlay"*
- *"Definir zoom inicial"*
- *"Evento Dano Global"*
- *"Novos controles enhanced"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🟢 `ReceiveBeginPlay`
- 🟢 `ReceiveAnyDamage`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `SetDamage()`
- 🛠️ `SetZoomScale()`
- 🛠️ `GetController()`
- 🛠️ `AddMappingContext()`

**Variáveis Manipuladas:**
- `Get MapView`
- `Get PlayerStatus`
- `Get Reanimating`

### 📌 Grafo: `Reanimar`

**Comentários e Títulos de Seção Encontrados:**
- *"Camera fade"*
- *"Attach e resetar transform"*
- *"Parar de simular física"*
- *"Avançar hora"*
- *"Ativar/desativar HUD"*
- *"Parar de morrer"*
- *"Tempo volta ao normal"*
- *"Movimento volta ao normal"*
- *"Desativa a animação de morrer"*
- *"Volta colisão e física da cápsula"*
- *"Respawnar jogador"*
- *"Respawnar jogador"*
- *"Vida e velocidade do personagem"*

**Eventos de Entrada (Events):**
- 🟢 `Reanimate`
- 🟢 `RespawnCharacter`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `StartCameraFade()`
- 🛠️ `GetPlayerController()`
- 🛠️ `RespawnCharacter()`
- 🛠️ `SetHealth()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `K2_SetRelativeTransform()`
- 🛠️ `GetGameInstance()`
- 🛠️ `VisibilityHUD()`
- 🛠️ `AddTime()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `Activate()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `BreakTransform()`
- 🛠️ `RagdollEnd()`
- 🛠️ `K2_SetActorTransform()`
- 🛠️ `SetControlRotation()`
- 🛠️ `BreakRotator()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Delay()`
- 🛠️ `RangeSpawnPoint()`
- 🛠️ `Map_Values()`
- 🛠️ `IsDead()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get CameraBoom`
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get Mesh`
- `Get MinHealth`
- `Get PlayerStatus`
- `Get SpawnPoints`
- `Set Dead`
- `Set Reanimating`

### 📌 Grafo: `GetGetUpAnimation`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get GetUpBack_2H`
- `Get GetUpBack_Default`
- `Get GetUpBack_LH`
- `Get GetUpBack_RH`
- `Get GetUpFront_2H`
- `Get GetUpFront_Default`
- `Get GetUpFront_LH`
- `Get GetUpFront_RH`
- `Get OverlayState`

### 📌 Grafo: `GetMantleAsset`

**Variáveis Manipuladas:**
- `Get Mantle_1m_2H`
- `Get Mantle_1m_Box`
- `Get Mantle_1m_Default`
- `Get Mantle_1m_LH`
- `Get Mantle_1m_RH`
- `Get Mantle_2m_Default`
- `Get OverlayState`

### 📌 Grafo: `GetRollAnimation`

**Variáveis Manipuladas:**
- `Get LandRoll_2H`
- `Get LandRoll_Default`
- `Get LandRoll_LH`
- `Get LandRoll_RH`
- `Get OverlayState`

### 📌 Grafo: `HoldInput`

**Funções e Métodos Chamados:**
- 🛠️ `RetriggerableDelay()`

### 📌 Grafo: `IsCustomMovement`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsCustomMovement()`

**Variáveis Manipuladas:**
- `Get CustomMovement`

### 📌 Grafo: `IsInAir`

**Funções e Métodos Chamados:**
- 🛠️ `IsFalling()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`

### 📌 Grafo: `MantleEnd`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateHeldObject()`

### 📌 Grafo: `MantleStart`

**Funções e Métodos Chamados:**
- 🛠️ `ClearHeldObject()`

**Variáveis Manipuladas:**
- `Get MantleType`

### 📌 Grafo: `MultiTapInput`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `RetriggerableDelay()`
- 🛠️ `Less_IntInt()`

### 📌 Grafo: `OnOverlayStateChanged`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateHeldObject()`

### 📌 Grafo: `Jetpack`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `JetpackEffects()`
- 🛠️ `BPI_Set_RotationMode()`
- 🛠️ `StopJumping()`
- 🛠️ `AddForce()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `GetForwardVector()`
- 🛠️ `Delay()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get Interaction`
- `Get InteractionObject`
- `Get IsFlying`
- `Get IsJetpack`
- `Set DesiredRotationMode`
- `Set GravityScale`
- `Set IsFlying`

### 📌 Grafo: `PlayerInputGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Movement Input"*
- *"Camera Input"*
- *"Gait Actions Type 1: Press \"*
- *"Stance Action: Press \"*
- *"AimAction: Hold \"*
- *"rotação do jetpack"*
- *"Select Rotation Mode: Switch the desired (default) rotation mode to Velocity or Looking Direction. This will be the mode the character reverts back to when un-aiming"*
- *"Jump Action: Press \"*
- *"Gait Action Type 2 (Unused): Hold \"*
- *"Camera Action: Hold \"*
- *"Ragdoll Action: Press \"*
- 🔀 Contém `11` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AddControllerPitchInput()`
- 🛠️ `JumpStamina()`
- 🛠️ `Not_PreBool()`
- 🛠️ `GetControlRotation()`
- 🛠️ `Crouch()`
- 🛠️ `UnCrouch()`
- 🛠️ `SmoothCharacterRotation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `K2_SetTimer()`
- 🛠️ `K2_ClearTimer()`
- 🛠️ `BPI_Set_RotationMode()`
- 🛠️ `SetLadderMoveSpeed()`
- 🛠️ `ExitCustomMovement()`
- 🛠️ `PlayerMovementInput()`
- 🛠️ `BPI_Set_ViewMode()`
- 🛠️ `RetriggerableDelay()`
- 🛠️ `Roll Event()`
- 🛠️ `Sprint()`
- 🛠️ `MantleCheck()`
- 🛠️ `RagdollEnd()`
- 🛠️ `AddControllerYawInput()`
- 🛠️ `Jump()`
- 🛠️ `RagdollStart()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakVector2D()`

**Variáveis Manipuladas:**
- `Get CanJump`
- `Get CustomMovement`
- `Get Dead`
- `Get DesiredGait`
- `Get DesiredRotationMode`
- `Get FallingTraceSettings`
- `Get GroundedTraceSettings`
- `Get HasMovementInput`
- `Get Interaction`
- `Get InteractionObject`
- `Get IsJetpack`
- `Get LookLeftRightRate`
- `Get LookUp/DownRate`
- `Get MinHealth`
- `Get MovementAction`
- `Get MovementState`
- `Get PlayerStatus`
- `Get RightShoulder`
- `Get SprintHeld`
- `Get Stamina`
- `Get Stance`
- `Get ViewMode`
- `Set BreakFall`
- `Set DesiredGait`
- `Set DesiredRotationMode`
- `Set DesiredStance`
- `Set InAirRotation`
- `Set RightShoulder`
- `Set SprintHeld`

### 📌 Grafo: `RagdollEnd`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateHeldObject()`

### 📌 Grafo: `RagdollStart`

**Funções e Métodos Chamados:**
- 🛠️ `ClearHeldObject()`

### 📌 Grafo: `UpdateHeldObject`

**Funções e Métodos Chamados:**
- 🛠️ `AttachToHand()`
- 🛠️ `ClearHeldObject()`

**Variáveis Manipuladas:**
- `Get OverlayState`

### 📌 Grafo: `UpdateHeldObjectAnimations`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `GetAnimCurveValue()`

**Variáveis Manipuladas:**
- `Get OverlayState`
- `Get SkeletalMesh`
- `Set Draw`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `SetLeaderPoseComponent()`

**Variáveis Manipuladas:**
- `Get BodyMesh`
- `Get Mesh`

### 📌 Grafo: `WeaponGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Evento target lock"*
- *"Dropar arma"*
- *"Abrir/Fechar Menu do Inventário"*
- *"Verificação"*
- *"Atirar"*
- *"Slowmotion"*
- *"Tecla E para Interagir com a arma"*
- *"Guardar a arma"*
- *"Trocar as armas"*
- *"Modo de tiro"*
- *"Recarregar"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SwitchWeapon()`
- 🛠️ `EventInteraction()`
- 🛠️ `CyclingWeapons()`
- 🛠️ `Fire()`
- 🛠️ `EventTargetLock()`
- 🛠️ `Reload()`
- 🛠️ `SwitchFireMode()`
- 🛠️ `DropWeapon()`
- 🛠️ `CreateRadialMenu()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `HolsterWeapon()`
- 🛠️ `PickupWeapon()`

**Variáveis Manipuladas:**
- `Get InteractedWeapon`
- `Get Interaction`
- `Get IsPickup`
- `Get WeaponSystem`

### 📌 Grafo: `ExecuteUbergraph_ALS_Player`

**Comentários e Títulos de Seção Encontrados:**
- *"Event Tick"*
- *"Evento Dano Global"*
- *"Evento para morrer"*
- *"Reanimar personagem"*
- *"Event BeginPlay"*
- *"Definir zoom inicial"*
- *"Novos controles enhanced"*
- *"Attach e resetar transform"*
- *"Parar de simular física"*
- *"Vida e velocidade do personagem"*
- *"Avançar hora"*
- *"Camera fade"*
- *"Ativar/desativar HUD"*
- *"Parar de morrer"*
- *"Tempo volta ao normal"*
- *"Movimento volta ao normal"*
- *"Desativa a animação de morrer"*
- *"Volta colisão e física da cápsula"*
- *"Respawnar jogador"*
- *"Respawnar jogador"*
- *"Attach e colisão"*
- *"Física e colisão"*
- *"Dead e movimento desabilitado"*
- *"Parar animações e executar animação de morrer"*
- *"Desabilitar colisão da capsula"*
- *"Camera fade"*
- *"Deixar o jogo lento"*
- *"Exibir/esconder HUD"*
- *"Reanimar personagem"*
- *"Movement Input"*
- *"Camera Input"*
- *"Stance Action: Press \"*
- *"Select Rotation Mode: Switch the desired (default) rotation mode to Velocity or Looking Direction. This will be the mode the character reverts back to when un-aiming"*
- *"Jump Action: Press \"*
- *"Camera Action: Hold \"*
- *"Ragdoll Action: Press \"*
- *"Gait Actions Type 1: Press \"*
- *"Gait Action Type 2 (Unused): Hold \"*
- *"AimAction: Hold \"*
- *"rotação do jetpack"*
- *"Tecla E para Interagir com a arma"*
- *"Guardar a arma"*
- *"Trocar as armas"*
- *"Recarregar"*
- *"Modo de tiro"*
- *"Dropar arma"*
- *"Abrir/Fechar Menu do Inventário"*
- *"Verificação"*
- *"Atirar"*
- *"Slowmotion"*
- *"Evento target lock"*
- *"Close on first entrance, if desired"*
- *"Close on first entrance, if desired"*
- *"Only do variable assignment the first time in"*
- *"Only do variable assignment the first time in"*
- *"Close on first entrance, if desired"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🟢 `ReceiveAnyDamage`
- 🟢 `ReceiveBeginPlay`
- 🟢 `Reanimate`
- 🟢 `RespawnCharacter`
- 🟢 `Death`
- 🔀 Contém `44` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetDamage()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `SetZoomScale()`
- 🛠️ `GetController()`
- 🛠️ `AddMappingContext()`
- 🛠️ `SetHealth()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `K2_SetRelativeTransform()`
- 🛠️ `GetGameInstance()`
- 🛠️ `AddTime()`
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `StartCameraFade()`
- 🛠️ `GetPlayerController()`
- 🛠️ `Activate()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `IsDead()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `BreakTransform()`
- 🛠️ `K2_SetActorTransform()`
- 🛠️ `SetControlRotation()`
- 🛠️ `BreakRotator()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `RespawnCharacter()`
- 🛠️ `RangeSpawnPoint()`
- 🛠️ `Map_Values()`
- 🛠️ `VisibilityHUD()`
- 🛠️ `RagdollEnd()`
- 🛠️ `Delay()`
- 🛠️ `SetCollisionResponseToChannel()`
- 🛠️ `StopAnimMontage()`
- 🛠️ `Deactivate()`
- 🛠️ `Reanimate()`
- 🛠️ `RagdollStart()`
- 🛠️ `AddControllerPitchInput()`
- 🛠️ `AddControllerYawInput()`
- 🛠️ `PlayerMovementInput()`
- 🛠️ `Jump()`
- 🛠️ `Crouch()`
- 🛠️ `UnCrouch()`
- 🛠️ `MantleCheck()`
- 🛠️ `RetriggerableDelay()`
- 🛠️ `Roll Event()`
- 🛠️ `Not_PreBool()`
- 🛠️ `BPI_Set_RotationMode()`
- 🛠️ `BPI_Set_ViewMode()`
- 🛠️ `JumpStamina()`
- 🛠️ `Sprint()`
- 🛠️ `GetControlRotation()`
- 🛠️ `SmoothCharacterRotation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `ExitCustomMovement()`
- 🛠️ `K2_SetTimer()`
- 🛠️ `K2_ClearTimer()`
- 🛠️ `SetLadderMoveSpeed()`
- 🛠️ `JetpackEffects()`
- 🛠️ `AddForce()`
- 🛠️ `GetForwardVector()`
- 🛠️ `StopJumping()`
- 🛠️ `PickupWeapon()`
- 🛠️ `SwitchWeapon()`
- 🛠️ `HolsterWeapon()`
- 🛠️ `CyclingWeapons()`
- 🛠️ `Fire()`
- 🛠️ `Reload()`
- 🛠️ `SwitchFireMode()`
- 🛠️ `DropWeapon()`
- 🛠️ `CreateRadialMenu()`
- 🛠️ `EventInteraction()`
- 🛠️ `EventTargetLock()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `IsValid()`
- 🛠️ `IsCustomMovement()`
- 🛠️ `Less_IntInt()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeRotator()`
- 🛠️ `MakeLiteralByte()`
- 🛠️ `GetLocalPlayerSubSystemFromPlayerController()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`
- 🛠️ `Multiply_DoubleDouble()`
- 🛠️ `Conv_InputActionValueToBool()`
- 🛠️ `BreakVector2D()`
- 🛠️ `Conv_InputActionValueToAxis2D()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get CameraBoom`
- `Get CanJump`
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get CustomMovement`
- `Get Dead`
- `Get DesiredGait`
- `Get DesiredRotationMode`
- `Get FallingTraceSettings`
- `Get GroundedTraceSettings`
- `Get HasMovementInput`
- `Get Health`
- `Get InteractedWeapon`
- `Get Interaction`
- `Get InteractionObject`
- `Get IsFlying`
- `Get IsJetpack`
- `Get IsPickup`
- `Get LookLeftRightRate`
- `Get LookUp/DownRate`
- `Get MapView`
- `Get Mesh`
- `Get MinHealth`
- `Get MovementAction`
- `Get MovementState`
- `Get PlayerStatus`
- `Get Reanimating`
- `Get RightShoulder`
- `Get SpawnPoints`
- `Get SprintHeld`
- `Get Stamina`
- `Get Stance`
- `Get ViewMode`
- `Get WeaponSystem`
- `Set BreakFall`
- `Set Dead`
- `Set DesiredGait`
- `Set DesiredRotationMode`
- `Set DesiredStance`
- `Set GravityScale`
- `Set InAirRotation`
- `Set IsFlying`
- `Set Reanimating`
- `Set RightShoulder`
- `Set SprintHeld`

### 📌 Grafo: `Reanimate`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `RespawnCharacter`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `Death`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `ReceiveAnyDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_Z_K2Node_InputKeyEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_Ragdoll_K2Node_EnhancedInputActionEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_ViewMode_K2Node_EnhancedInputActionEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_ViewMode_K2Node_EnhancedInputActionEvent_2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_Aim_K2Node_EnhancedInputActionEvent_3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_Aim_K2Node_EnhancedInputActionEvent_4`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_RotationMode_K2Node_EnhancedInputActionEvent_5`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_Sprint_K2Node_EnhancedInputActionEvent_6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_Sprint_K2Node_EnhancedInputActionEvent_7`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_Walk_K2Node_EnhancedInputActionEvent_8`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_Crouch_K2Node_EnhancedInputActionEvent_9`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_Jump_K2Node_EnhancedInputActionEvent_10`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_Jump_K2Node_EnhancedInputActionEvent_11`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_LookMouse_K2Node_EnhancedInputActionEvent_12`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_IA_Move_K2Node_EnhancedInputActionEvent_13`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_SelectRotationMode_2_K2Node_InputActionEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_TargetLock_K2Node_InputActionEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_TargetLock_K2Node_InputActionEvent_2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_V_K2Node_InputKeyEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_Tab_K2Node_InputKeyEvent_2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_Tab_K2Node_InputKeyEvent_3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_G_K2Node_InputKeyEvent_4`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_F_K2Node_InputKeyEvent_5`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_R_K2Node_InputKeyEvent_6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_LeftMouseButton_K2Node_InputKeyEvent_7`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_LeftMouseButton_K2Node_InputKeyEvent_8`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_MouseScrollDown_K2Node_InputKeyEvent_9`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_MouseScrollUp_K2Node_InputKeyEvent_10`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_Four_K2Node_InputKeyEvent_11`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_Three_K2Node_InputKeyEvent_12`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_Two_K2Node_InputKeyEvent_13`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_H_K2Node_InputKeyEvent_14`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_One_K2Node_InputKeyEvent_15`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `InpActEvt_E_K2Node_InputKeyEvent_16`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Player()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `SetLeaderPoseComponent()`

**Variáveis Manipuladas:**
- `Get BodyMesh`
- `Get Mesh`

### 📌 Grafo: `UpdateHeldObject_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `AttachToHand()`
- 🛠️ `ClearHeldObject()`

**Variáveis Manipuladas:**
- `Get OverlayState`

### 📌 Grafo: `ClearHeldObject_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `SetAnimClass()`
- 🛠️ `SetSkinnedAssetAndUpdate()`
- 🛠️ `SetStaticMesh()`

**Variáveis Manipuladas:**
- `Get SkeletalMesh`
- `Get StaticMesh`

### 📌 Grafo: `AttachToHand_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `K2_SetRelativeLocation()`
- 🛠️ `ClearHeldObject()`
- 🛠️ `SetSkinnedAssetAndUpdate()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `SetAnimClass()`

**Variáveis Manipuladas:**
- `Get HeldObjectRoot`
- `Get LeftHand`
- `Get Mesh`
- `Get NewAnimClass`
- `Get NewSkeletalMesh`
- `Get NewStaticMesh`
- `Get Offset`
- `Get SkeletalMesh`
- `Get StaticMesh`

### 📌 Grafo: `BPI_Get_3P_PivotTarget_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `GetVectorArrayAverage()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `K2_GetActorRotation()`

**Variáveis Manipuladas:**
- `Get Mesh`

### 📌 Grafo: `BPI_Get_FP_CameraTarget_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketLocation()`

**Variáveis Manipuladas:**
- `Get Mesh`

### 📌 Grafo: `GetMantleAsset_MERGED`

**Variáveis Manipuladas:**
- `Get Mantle_1m_2H`
- `Get Mantle_1m_Box`
- `Get Mantle_1m_Default`
- `Get Mantle_1m_LH`
- `Get Mantle_1m_RH`
- `Get Mantle_2m_Default`
- `Get OverlayState`

### 📌 Grafo: `BPI_Get_3P_TraceParams_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketLocation()`

**Variáveis Manipuladas:**
- `Get Mesh`
- `Get RightShoulder`

### 📌 Grafo: `OnOverlayStateChanged_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateHeldObject()`

### 📌 Grafo: `GetRollAnimation_MERGED`

**Variáveis Manipuladas:**
- `Get LandRoll_2H`
- `Get LandRoll_Default`
- `Get LandRoll_LH`
- `Get LandRoll_RH`
- `Get OverlayState`

### 📌 Grafo: `MantleEnd_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateHeldObject()`

### 📌 Grafo: `GetGetUpAnimation_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get GetUpBack_2H`
- `Get GetUpBack_Default`
- `Get GetUpBack_LH`
- `Get GetUpBack_RH`
- `Get GetUpFront_2H`
- `Get GetUpFront_Default`
- `Get GetUpFront_LH`
- `Get GetUpFront_RH`
- `Get OverlayState`

### 📌 Grafo: `RagdollStart_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `ClearHeldObject()`

### 📌 Grafo: `RagdollEnd_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateHeldObject()`

### 📌 Grafo: `UpdateHeldObjectAnimations_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `GetAnimCurveValue()`

**Variáveis Manipuladas:**
- `Get OverlayState`
- `Get SkeletalMesh`
- `Set Draw`

### 📌 Grafo: `MantleStart_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `ClearHeldObject()`

**Variáveis Manipuladas:**
- `Get MantleType`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `ALS_Player`?
- Quais variáveis estão disponíveis no Blueprint `ALS_Player`?
- Quais funções e eventos são chamados no grafo do `ALS_Player`?