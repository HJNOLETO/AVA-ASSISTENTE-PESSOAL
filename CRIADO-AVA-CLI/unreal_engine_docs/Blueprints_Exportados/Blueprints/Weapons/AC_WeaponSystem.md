# 🎮 Blueprint: AC_WeaponSystem

**[Classe Pai / Parent Class: `ActorComponent`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `CharacterReference` | `object (Character)` |
| `Current Weapon Index` | `int` |
| `WeaponIsLocked` | `bool` |
| `InitialWeapon` | `struct (S_StoredWeapons)` |
| `CurrentWeapon` | `object (BP_WeaponBase_C)` |
| `SpawnedWeapons` | `object (BP_WeaponBase_C)` |
| `HideWeapon` | `bool` |
| `Overlay State` | `byte (ALS_OverlayState)` |
| `MaxWeaponLimit` | `int` |
| `PegarMunicaoArmaIgual` | `bool` |
| `HasSameWeapon` | `bool` |
| `AmmoAdd` | `int` |
| `ShowMenu` | `bool` |
| `UMGInventory` | `object (UMG_Inventory_C)` |
| `TargetStart` | `real (double)` |
| `TraceRange` | `real (double)` |
| `TargetRadius` | `real (float)` |
| `TargetLock` | `bool` |
| `TargetActor` | `object (Actor)` |
| `TargetTimer` | `struct (TimerHandle)` |
| `IsHit` | `bool` |
| `BlendWeight` | `real (double)` |
| `BoneName` | `name` |
| `HitReactionCurve` | `object (CurveFloat)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `AimTarget`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetController()`
- 🛠️ `SetControlRotation()`
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `FindLookAtRotation()`
- 🛠️ `PrintString()`
- 🛠️ `GetCharacterDead()`

**Variáveis Manipuladas:**
- `Get CameraBehavior`
- `Get CharacterReference`
- `Get RootComponent`
- `Get TargetActor`
- `Get TargetLock`
- `Set TargetLock`

### 📌 Grafo: `ALS_EquipState`

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Get_CurrentStates()`

**Variáveis Manipuladas:**
- `Get CharacterReference`
- `Get CurrentWeapon`
- `Get WeaponData`

### 📌 Grafo: `ALS_UnequipState`

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Get_CurrentStates()`

**Variáveis Manipuladas:**
- `Get CharacterReference`
- `Get CurrentWeapon`
- `Get WeaponData`

### 📌 Grafo: `CastToAnimBP`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`

**Variáveis Manipuladas:**
- `Get CharacterReference`
- `Get Mesh`

### 📌 Grafo: `CheckDontHaveSameWeaponType`

**Comentários e Títulos de Seção Encontrados:**
- *"Adicionar munição a arma existente"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CheckWeaponType()`
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `K2_DestroyActor()`

**Variáveis Manipuladas:**
- `Get CurrentAmmoInBP`
- `Get PegarMunicaoArmaIgual`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Set CurrentAmmoInBP`

### 📌 Grafo: `CheckWeaponLimit`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Less_IntInt()`
- 🛠️ `PrintString()`

**Variáveis Manipuladas:**
- `Get InitialWeapon`
- `Get MaxWeaponLimit`

### 📌 Grafo: `CheckWeaponType`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get FoundSameType`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Set FoundSameType`

### 📌 Grafo: `CombatGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Target lock"*
- *"Adicionar impulso"*
- *"Simular física na região específica"*
- *"Aplicar curva de animação"*
- *"Resetar esqueleto do personagem"*
- *"Reação de tiro"*

**Eventos de Entrada (Events):**
- 🟢 `EventTargetLock`
- 🟢 `HitReact`
- 🟢 `ResetHit`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SphereTraceSingleForObjects()`
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `SetAllBodiesSimulatePhysics()`
- 🛠️ `ResetHit()`
- 🛠️ `Delay()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `AddImpulse()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetForwardVector()`
- 🛠️ `BreakHitResult()`
- 🛠️ `K2_SetTimer()`
- 🛠️ `K2_ClearAndInvalidateTimerHandle()`
- 🛠️ `SetAllBodiesBelowSimulatePhysics()`
- 🛠️ `SetAllBodiesBelowPhysicsBlendWeight()`
- 🛠️ `SetAllBodiesPhysicsBlendWeight()`
- 🛠️ `GetCharacterDead()`

**Variáveis Manipuladas:**
- `Get BlendWeight`
- `Get BoneName`
- `Get CharacterReference`
- `Get HitReactionCurve`
- `Get IsHit`
- `Get Mesh`
- `Get RootComponent`
- `Get TargetRadius`
- `Get TargetStart`
- `Get TargetTimer`
- `Get TraceRange`
- `Set BlendWeight`
- `Set BoneName`
- `Set IsHit`
- `Set TargetActor`
- `Set TargetLock`
- `Set TargetTimer`

### 📌 Grafo: `CurveFloat`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetFloatValue()`
- 🛠️ `Delay()`
- 🛠️ `GetTimeRange()`
- 🛠️ `SelectFloat()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `NotEqual_DoubleDouble()`

### 📌 Grafo: `CyclingToNexPrevtWeapon`

**Comentários e Títulos de Seção Encontrados:**
- *"Selecionar próxima arma"*
- *"Selecionar arma anterior"*

**Funções e Métodos Chamados:**
- 🛠️ `Less_IntInt()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `Subtract_IntInt()`

**Variáveis Manipuladas:**
- `Get Current Weapon Index`
- `Get InitialWeapon`

### 📌 Grafo: `EquipAnimations`

**Comentários e Títulos de Seção Encontrados:**
- *"Notify"*

**Funções e Métodos Chamados:**
- 🛠️ `AnimNotify_EquipWeapon()`
- 🛠️ `AnimBP_SetAnimations()`

**Variáveis Manipuladas:**
- `Get CharacterReference`

### 📌 Grafo: `Substituir a Arma`

**Funções e Métodos Chamados:**
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `SetActorHiddenInGame()`
- 🛠️ `WeaponFire()`
- 🛠️ `K2_DetachFromActor()`
- 🛠️ `SetWeaponIsDropped()`
- 🛠️ `GetWeaponData()`
- 🛠️ `AddRadialImpulse()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `BPI_Set_OverlayState()`

**Variáveis Manipuladas:**
- `Get CharacterReference`
- `Get InitialWeapon`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Get WeaponMesh`
- `Set Current Weapon Index`
- `Set CurrentWeapon`
- `Set HasSameWeapon`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Animação de Equipar a Arma"*
- *"Evento fire"*
- *"Animação de desequipar a arma"*
- *"Guardar a arma"*
- *"Evento recarregar "*
- *"Alternar armas - próximo e anterior"*
- *"Rotacionar arma ao dropar (estilo gta san andreas)"*
- *"Adicionar munição específica para arma "*
- *"Checar se a arma vai esconder ou não"*
- *"Spawnar armas"*
- *"Selecionar Arma"*
- *"Parar de atirar"*
- *"Animação de Desequipar a Arma"*
- *"Desanexar arma do personagem"*
- *"Dropar arma com física"*
- *"Aplicar impulso na arma ao lançar"*
- *"Remover arma da lista"*
- *"Adicionar a arma spawnada na lista"*
- *"Resetar arma e ir para o modo desarmado"*
- *"Verificar se o personagem está morto"*
- *"Voltar para animação padrão"*
- *"Dropar arma"*
- *"Verificar se o personagem está morto"*
- *"Atualizar o HUD no componente"*
- *"Verificar se o personagem está morto"*
- *"Trocar informações da arma através do slot específico"*
- *"Trocar informações da arma através do slot específico"*
- *"Esconder ou não a arma"*
- *"Modo padrão de animação ALS"*
- *"Destruir arma depois de 20 segundos"*
- *"Event Begin Play"*
- *"Evento PickupWeapon"*
- *"Selecionar Arma"*
- *"Trocar a Arma"*
- *"Resetar a arma atual "*
- *"Trocar modo de tiro "*

**Eventos de Entrada (Events):**
- 🟢 `PickupWeapon`
- 🟢 `SwitchWeapon`
- 🟢 `SpawnWeapons`
- 🟢 `DropWeapon`
- 🟢 `UpdateHUD_Local`
- 🟢 `HolsterWeapon`
- 🟢 `Fire`
- 🟢 `CyclingWeapons`
- 🟢 `Reload`
- 🟢 `SwitchFireMode`
- 🟢 `AddAmmo`
- 🟢 `ReceiveBeginPlay`
- 🔀 Contém `20` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetWeaponIsDropped()`
- 🛠️ `Not_PreBool()`
- 🛠️ `GetPlayLength()`
- 🛠️ `Delay()`
- 🛠️ `WeaponFireMode()`
- 🛠️ `UnequipAnimations()`
- 🛠️ `GetOwner()`
- 🛠️ `SetOwner()`
- 🛠️ `EquipAnimations()`
- 🛠️ `CanReload?()`
- 🛠️ `SetActorHiddenInGame()`
- 🛠️ `AddAmmoToBP()`
- 🛠️ `K2_SetActorRelativeRotation()`
- 🛠️ `UpdateHUD_WeaponData()`
- 🛠️ `SetWeaponDataHUD()`
- 🛠️ `PlayAnimation()`
- 🛠️ `ALS_UnequipState()`
- 🛠️ `ShootingAnimation()`
- 🛠️ `WeaponFire()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `WeaponIsSelected()`
- 🛠️ `ALS_EquipState()`
- 🛠️ `SwitchWeapon()`
- 🛠️ `WeaponReload()`
- 🛠️ `SetLifeSpan()`
- 🛠️ `IsValid()`
- 🛠️ `EqualEqual_NameName()`
- 🛠️ `EqualEqual_ClassClass()`
- 🛠️ `PrintString()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_AddActorLocalRotation()`
- 🛠️ `K2_DetachFromActor()`
- 🛠️ `AddRadialImpulse()`
- 🛠️ `IsPlayerControlled()`
- 🛠️ `SetActive()`
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `HolsterWeapon()`
- 🛠️ `AnimNotify_UnequipWeapon()`
- 🛠️ `GetWeaponData()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `K2_SetActorLocationAndRotation()`
- 🛠️ `GetHUD()`
- 🛠️ `BPI_Set_OverlayState()`
- 🛠️ `GetCharacterDead()`
- 🛠️ `BPI_Get_CurrentStates()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get AmmoAdd`
- `Get CharacterReference`
- `Get Current Weapon Index`
- `Get CurrentWeapon`
- `Get HasSameWeapon`
- `Get HideWeapon`
- `Get InitialWeapon`
- `Get Mesh`
- `Get RotatingMovement`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Get WeaponIsLocked`
- `Get WeaponMesh`
- `Get WeaponStored`
- `Set AmmoAdd`
- `Set CharacterReference`
- `Set Current Weapon Index`
- `Set CurrentWeapon`
- `Set HasSameWeapon`
- `Set OwnerCharacter`
- `Set WeaponIsLocked`

### 📌 Grafo: `GetWeaponData`

**Variáveis Manipuladas:**
- `Get WeaponData`

### 📌 Grafo: `Inventory`

**Comentários e Títulos de Seção Encontrados:**
- *"Selecionar slot do inventario"*
- *"Abrir/Fechar o inventário"*

**Eventos de Entrada (Events):**
- 🟢 `CreateRadialMenu`
- 🟢 `WeaponIsSelected`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AddToViewport()`
- 🛠️ `GetPlayerController()`
- 🛠️ `SwitchWeapon()`
- 🛠️ `Get Selection Option()`
- 🛠️ `SetRenderTransformAngle()`
- 🛠️ `WeaponIsSelected()`
- 🛠️ `CenterMousePosition()`
- 🛠️ `UpdateHUD_WeaponData()`
- 🛠️ `SetInputMode_GameAndUIEx()`
- 🛠️ `SetIgnoreLookInput()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `RemoveFromParent()`
- 🛠️ `SetInputMode_GameOnly()`

**Variáveis Manipuladas:**
- `Get Angles`
- `Get BorderSelection`
- `Get Current Weapon Index`
- `Get CurrentWeapon`
- `Get MenuRadial`
- `Get Selection`
- `Get UMGInventory`
- `Get UMG_RadialMenu`
- `Set ShowMenu`
- `Set UMGInventory`

### 📌 Grafo: `UnequipAnimations`

**Comentários e Títulos de Seção Encontrados:**
- *"Notify"*

**Funções e Métodos Chamados:**
- 🛠️ `AnimNotify_UnequipWeapon()`
- 🛠️ `AnimBP_SetAnimations()`

**Variáveis Manipuladas:**
- `Get CharacterReference`

### 📌 Grafo: `ExecuteUbergraph_AC_WeaponSystem`

**Comentários e Títulos de Seção Encontrados:**
- *"Evento PickupWeapon"*
- *"Animação de Desequipar a Arma"*
- *"Animação de Equipar a Arma"*
- *"Selecionar Arma"*
- *"Trocar a Arma"*
- *"Atualizar o HUD no componente"*
- *"Selecionar Arma"*
- *"Resetar a arma atual "*
- *"Animação de desequipar a arma"*
- *"Guardar a arma"*
- *"Alternar armas - próximo e anterior"*
- *"Evento fire"*
- *"Evento recarregar "*
- *"Trocar modo de tiro "*
- *"Adicionar munição específica para arma "*
- *"Checar se a arma vai esconder ou não"*
- *"Spawnar armas"*
- *"Parar de atirar"*
- *"Desanexar arma do personagem"*
- *"Dropar arma com física"*
- *"Aplicar impulso na arma ao lançar"*
- *"Remover arma da lista"*
- *"Resetar arma e ir para o modo desarmado"*
- *"Voltar para animação padrão"*
- *"Dropar arma"*
- *"Verificar se o personagem está morto"*
- *"Verificar se o personagem está morto"*
- *"Verificar se o personagem está morto"*
- *"Adicionar a arma spawnada na lista"*
- *"Trocar informações da arma através do slot específico"*
- *"Trocar informações da arma através do slot específico"*
- *"Esconder ou não a arma"*
- *"Modo padrão de animação ALS"*
- *"Event Begin Play"*
- *"Rotacionar arma ao dropar (estilo gta san andreas)"*
- *"Destruir arma depois de 20 segundos"*
- *"Selecionar slot do inventario"*
- *"Abrir/Fechar o inventário"*
- *"Target lock"*
- *"Adicionar impulso"*
- *"Simular física na região específica"*
- *"Aplicar curva de animação"*
- *"Resetar esqueleto do personagem"*
- *"Reação de tiro"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- *"Selecionar próxima arma"*
- *"Selecionar arma anterior"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- *"Adicionar munição a arma existente"*
- *"Only do variable assignment the first time in"*
- *"Close on first entrance, if desired"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `PickupWeapon`
- 🟢 `SwitchWeapon`
- 🟢 `UpdateHUD_Local`
- 🟢 `HolsterWeapon`
- 🟢 `CyclingWeapons`
- 🟢 `Fire`
- 🟢 `Reload`
- 🟢 `SwitchFireMode`
- 🟢 `AddAmmo`
- 🟢 `SpawnWeapons`
- 🟢 `DropWeapon`
- 🟢 `ReceiveBeginPlay`
- 🟢 `CreateRadialMenu`
- 🟢 `WeaponIsSelected`
- 🟢 `EventTargetLock`
- 🟢 `HitReact`
- 🟢 `ResetHit`
- 🔀 Contém `71` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `SetWeaponIsDropped()`
- 🛠️ `SetOwner()`
- 🛠️ `Not_PreBool()`
- 🛠️ `IsValid()`
- 🛠️ `SetActorHiddenInGame()`
- 🛠️ `UnequipAnimations()`
- 🛠️ `ALS_UnequipState()`
- 🛠️ `GetPlayLength()`
- 🛠️ `Delay()`
- 🛠️ `EquipAnimations()`
- 🛠️ `ALS_EquipState()`
- 🛠️ `BPI_Set_OverlayState()`
- 🛠️ `K2_SetActorRelativeRotation()`
- 🛠️ `GetHUD()`
- 🛠️ `UpdateHUD_WeaponData()`
- 🛠️ `SetWeaponDataHUD()`
- 🛠️ `SwitchWeapon()`
- 🛠️ `WeaponFire()`
- 🛠️ `CanReload?()`
- 🛠️ `WeaponReload()`
- 🛠️ `WeaponFireMode()`
- 🛠️ `AddAmmoToBP()`
- 🛠️ `EqualEqual_NameName()`
- 🛠️ `EqualEqual_ClassClass()`
- 🛠️ `PrintString()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_AddActorLocalRotation()`
- 🛠️ `K2_DetachFromActor()`
- 🛠️ `AddRadialImpulse()`
- 🛠️ `SetActive()`
- 🛠️ `GetCharacterDead()`
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `HolsterWeapon()`
- 🛠️ `AnimNotify_UnequipWeapon()`
- 🛠️ `GetWeaponData()`
- 🛠️ `WeaponIsSelected()`
- 🛠️ `ShootingAnimation()`
- 🛠️ `PlayAnimation()`
- 🛠️ `GetOwner()`
- 🛠️ `IsPlayerControlled()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `K2_SetActorLocationAndRotation()`
- 🛠️ `BPI_Get_CurrentStates()`
- 🛠️ `SetLifeSpan()`
- 🛠️ `AddToViewport()`
- 🛠️ `GetPlayerController()`
- 🛠️ `SetInputMode_GameAndUIEx()`
- 🛠️ `SetIgnoreLookInput()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `RemoveFromParent()`
- 🛠️ `SetInputMode_GameOnly()`
- 🛠️ `Get Selection Option()`
- 🛠️ `SetRenderTransformAngle()`
- 🛠️ `CenterMousePosition()`
- 🛠️ `SphereTraceSingleForObjects()`
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetForwardVector()`
- 🛠️ `BreakHitResult()`
- 🛠️ `K2_SetTimer()`
- 🛠️ `K2_ClearAndInvalidateTimerHandle()`
- 🛠️ `SetAllBodiesBelowSimulatePhysics()`
- 🛠️ `SetAllBodiesBelowPhysicsBlendWeight()`
- 🛠️ `SetAllBodiesPhysicsBlendWeight()`
- 🛠️ `SetAllBodiesSimulatePhysics()`
- 🛠️ `ResetHit()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `AddImpulse()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `CheckWeaponType()`
- 🛠️ `K2_DestroyActor()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `GetFloatValue()`
- 🛠️ `GetTimeRange()`
- 🛠️ `SelectFloat()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `NotEqual_DoubleDouble()`
- 🛠️ `EqualEqual_ByteByte()`
- 🛠️ `Add_VectorVector()`
- 🛠️ `MakeTransform()`
- 🛠️ `BeginDeferredActorSpawnFromClass()`
- 🛠️ `FinishSpawningActor()`
- 🛠️ `SetObjectPropertyByName()`
- 🛠️ `SetStructurePropertyByName()`
- 🛠️ `GetDataTableRowFromName()`
- 🛠️ `Create()`
- 🛠️ `FlushNetDormancy()`
- 🛠️ `OnRep_CurrentAmmoInBP()`
- 🛠️ `MarkPropertyDirtyFromRepIndex()`

**Variáveis Manipuladas:**
- `Get AmmoAdd`
- `Get Angles`
- `Get BlendWeight`
- `Get BoneName`
- `Get BorderSelection`
- `Get CharacterReference`
- `Get Current Weapon Index`
- `Get CurrentAmmoInBP`
- `Get CurrentWeapon`
- `Get HasSameWeapon`
- `Get HideWeapon`
- `Get HitReactionCurve`
- `Get InitialWeapon`
- `Get IsHit`
- `Get MenuRadial`
- `Get Mesh`
- `Get PegarMunicaoArmaIgual`
- `Get RootComponent`
- `Get RotatingMovement`
- `Get Selection`
- `Get SpawnedWeapons`
- `Get TargetRadius`
- `Get TargetStart`
- `Get TargetTimer`
- `Get TraceRange`
- `Get UMGInventory`
- `Get UMG_RadialMenu`
- `Get WeaponData`
- `Get WeaponIsLocked`
- `Get WeaponMesh`
- `Get WeaponStored`
- `Set AmmoAdd`
- `Set BlendWeight`
- `Set BoneName`
- `Set CharacterReference`
- `Set Current Weapon Index`
- `Set CurrentAmmoInBP`
- `Set CurrentWeapon`
- `Set HasSameWeapon`
- `Set IsHit`
- `Set OwnerCharacter`
- `Set ShowMenu`
- `Set TargetActor`
- `Set TargetLock`
- `Set TargetTimer`
- `Set UMGInventory`
- `Set WeaponIsLocked`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `DropWeapon`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `SpawnWeapons`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `AddAmmo`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `SwitchFireMode`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `Reload`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `Fire`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `CyclingWeapons`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `HolsterWeapon`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `UpdateHUD_Local`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `SwitchWeapon`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `PickupWeapon`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `WeaponIsSelected`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `CreateRadialMenu`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `ResetHit`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `HitReact`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `EventTargetLock`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_AC_WeaponSystem()`

### 📌 Grafo: `EquipAnimations_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Notify"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AnimBP_SetAnimations()`
- 🛠️ `AnimNotify_EquipWeapon()`
- 🛠️ `IsValid()`
- 🛠️ `GetAnimInstance()`

**Variáveis Manipuladas:**
- `Get CharacterReference`
- `Get Mesh`

### 📌 Grafo: `UnequipAnimations_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Notify"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AnimBP_SetAnimations()`
- 🛠️ `AnimNotify_UnequipWeapon()`
- 🛠️ `IsValid()`
- 🛠️ `GetAnimInstance()`

**Variáveis Manipuladas:**
- `Get CharacterReference`
- `Get Mesh`

### 📌 Grafo: `ALS_EquipState_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Get_CurrentStates()`

**Variáveis Manipuladas:**
- `Get CharacterReference`
- `Get CurrentWeapon`
- `Get WeaponData`

### 📌 Grafo: `ALS_UnequipState_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Get_CurrentStates()`

**Variáveis Manipuladas:**
- `Get CharacterReference`
- `Get CurrentWeapon`
- `Get WeaponData`

### 📌 Grafo: `CheckWeaponType_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Init Loop Counter"*
- *"Test Loop Condition"*
- *"Execute Loop Body"*
- *"Increment Loop Counter"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Init Array Index"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `IsValid()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get FoundSameType`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Set FoundSameType`

### 📌 Grafo: `GetWeaponData_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get WeaponData`

### 📌 Grafo: `AimTarget_MERGED`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetController()`
- 🛠️ `SetControlRotation()`
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `FindLookAtRotation()`
- 🛠️ `PrintString()`
- 🛠️ `GetCharacterDead()`
- 🛠️ `IsValid()`
- 🛠️ `K2_GetRootComponent()`
- 🛠️ `Add_VectorVector()`

**Variáveis Manipuladas:**
- `Get CameraBehavior`
- `Get CharacterReference`
- `Get RootComponent`
- `Get TargetActor`
- `Get TargetLock`
- `Set TargetLock`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `AC_WeaponSystem`?
- Quais variáveis estão disponíveis no Blueprint `AC_WeaponSystem`?
- Quais funções e eventos são chamados no grafo do `AC_WeaponSystem`?