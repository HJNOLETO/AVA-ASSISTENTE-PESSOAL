# 🎮 Blueprint: BP_WeaponBase

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `IsPickup` | `bool` |
| `AutoPickUp` | `bool` |
| `OwnerCharacter` | `Object (Character)` |
| `WeaponStored` | `struct (S_StoredWeapons)` |
| `Bullets in Shot` | `int` |
| `Fire Rate` | `real (double)` |
| `Weapon Spread` | `real (double)` |
| `Bullet Speed` | `real (double)` |
| `Projectile` | `class (BP_ProjectileBase_C)` |
| `Muzzle Flash FX` | `Object (ParticleSystem)` |
| `Fire Sound` | `Object (SoundBase)` |
| `Reload Sound` | `Object (SoundBase)` |
| `Reduce Accuracy While Moving` | `bool` |
| `Accuracy Penalty While Moving` | `real (double)` |
| `Reload Duration` | `real (double)` |
| `Char Animations` | `struct (S_CharacterAnims)` |
| `Weapon Animations` | `struct (S_WeaponAnims)` |
| `CurrentAmmoInMag` | `int` |
| `CurrentAmmoInBP` | `int` |
| `Current Fire Mode` | `byte (E_FireMode)` |
| `Current Weapon State` | `byte (E_WeaponState)` |
| `IsFiring` | `bool` |
| `IsReloading` | `bool` |
| `IsOnFireRateDelay` | `bool` |
| `NoAmmo` | `bool` |
| `CurrentRoundsInBurst` | `int` |
| `BulletRicochet` | `bool` |
| `NoAmmoSound` | `Object (SoundBase)` |
| `ReloadTimer` | `struct (TimerHandle)` |
| `TimerSpread` | `struct (TimerHandle)` |
| `WeaponPhysics` | `bool` |
| `WeaponRotating` | `bool` |
| `ProjectileSize` | `byte (Projectile_Size)` |
| `WeaponData` | `struct (S_WeaponData)` |
| `Bullets` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `CalcFinalDirection`

**Comentários e Títulos de Seção Encontrados:**
- *"\"*

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `ComposeRotators()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get Weapon Spread`

### 📌 Grafo: `CalculateDamage`

**Funções e Métodos Chamados:**
- 🛠️ `RandomFloatInRange()`
- 🛠️ `SelectFloat()`
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get WeaponData`

### 📌 Grafo: `StartPoint`

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `GetForwardVector()`
- 🛠️ `Multiply_VectorFloat()`

### 📌 Grafo: `CalculateInitialDirection`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `DoesSocketExist()`
- 🛠️ `PrintString()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `SelectVector()`
- 🛠️ `FindLookAtRotation()`
- 🛠️ `ComposeRotators()`
- 🛠️ `MakeRotator()`
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `K2_GetComponentToWorld()`
- 🛠️ `BreakHitResult()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get CameraBehavior`
- `Get WeaponMesh`

### 📌 Grafo: `EndPoint`

**Funções e Métodos Chamados:**
- 🛠️ `GetForwardVector()`
- 🛠️ `Multiply_VectorFloat()`

### 📌 Grafo: `CanReload?`

**Funções e Métodos Chamados:**
- 🛠️ `Greater_IntInt()`
- 🛠️ `NotEqual_IntInt()`
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get CurrentAmmoInBP`
- `Get CurrentAmmoInMag`
- `Get IsReloading`
- `Get WeaponData`

### 📌 Grafo: `CanShoot?`

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get IsFiring`
- `Get IsOnFireRateDelay`
- `Get IsReloading`

### 📌 Grafo: `CantShoot`

**Funções e Métodos Chamados:**
- 🛠️ `LessEqual_IntInt()`

**Variáveis Manipuladas:**
- `Get CurrentAmmoInBP`
- `Get CurrentAmmoInMag`
- `Set NoAmmo`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Interação com as armas"*
- *"Simular Física"*
- *"Evento atirar"*
- *"Evento Recarregar "*
- *"Definir modo de tiro ao iniciar o game"*
- *"Animação do personagem"*
- *"Partícula do Muzzle"*
- *"Som do tiro"*
- *"Animação da arma"*
- *"Efeitos da arma"*
- *"Evento trocar o modo de tiro"*
- *"Adicionar munição a arma"*
- *"Alterar canal de colisão quando estiver dropado"*
- *"Rotação da arma"*
- *"Eventos para efeitos da arma ao recarregar"*
- *"Dar acesso a classe genérica character"*
- *"Evento para dropar arma"*
- *"Atribuir informações da arma no HUD"*
- *"Está atirando"*
- *"Modo de tiro único"*
- *"Modo de tiro \"*
- *"Modo de tiro automático"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__BP_WeaponBase_WeaponCollision_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__BP_WeaponBase_WeaponCollision_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature`
- 🟢 `SetWeaponIsDropped`
- 🟢 `UpdateHUD_WeaponData`
- 🟢 `AttachInHand`
- 🟢 `WeaponFire`
- 🟢 `WeaponReload`
- 🟢 `WeaponEffects`
- 🟢 `WeaponFireMode`
- 🟢 `AddAmmoToBP`
- 🟢 `DropMagazine`
- 🟢 `InsertMagazine`
- 🟢 `PickupMagazine`
- 🟢 `ReceiveBeginPlay`
- 🔀 Contém `8` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetMaxSpread()`
- 🛠️ `CantShoot()`
- 🛠️ `CanShoot?()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `SpawnProjectile()`
- 🛠️ `RetriggerableDelay()`
- 🛠️ `GetOwner()`
- 🛠️ `PlaySoundAtLocation()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `SpawnEmitterAttached()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `PlayAnimation()`
- 🛠️ `SetWeaponDataHUD()`
- 🛠️ `SetSimulatePhysics()`
- 🛠️ `Clamp()`
- 🛠️ `SetActive()`
- 🛠️ `Not_PreBool()`
- 🛠️ `SetVisibility()`
- 🛠️ `SetMode_SingleShot()`
- 🛠️ `SetMode_Burst()`
- 🛠️ `SetMode_Auto()`
- 🛠️ `NextWeaponMode()`
- 🛠️ `SpawnMagazine()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `Delay()`
- 🛠️ `ReloadStart()`
- 🛠️ `GetHUD()`
- 🛠️ `WPN_SetWeaponToInteract()`
- 🛠️ `GetChar_WeaponSystem()`

**Variáveis Manipuladas:**
- `Get AutoPickUp`
- `Get Current Fire Mode`
- `Get CurrentAmmoInBP`
- `Get CurrentAmmoInMag`
- `Get CurrentRoundsInBurst`
- `Get Fire Rate`
- `Get Fire Sound`
- `Get IsFiring`
- `Get IsPickup`
- `Get Magazine`
- `Get Mesh`
- `Get Muzzle Flash FX`
- `Get OwnerCharacter`
- `Get RotatingMovement`
- `Get WeaponCollision`
- `Get WeaponData`
- `Get WeaponMesh`
- `Get WeaponPhysics`
- `Get WeaponRotating`
- `Set CurrentAmmoInBP`
- `Set CurrentRoundsInBurst`
- `Set IsFiring`
- `Set IsOnFireRateDelay`
- `Set IsPickup`
- `Set OwnerCharacter`
- `Set WeaponPhysics`

### 📌 Grafo: `GetMovingPenalty`

**Funções e Métodos Chamados:**
- 🛠️ `GetVelocity()`
- 🛠️ `VSize()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `SelectFloat()`

**Variáveis Manipuladas:**
- `Get Accuracy Penalty While Moving`
- `Get CharacterMovement`
- `Get MaxWalkSpeed`
- `Get OwnerCharacter`
- `Get Reduce Accuracy While Moving`

### 📌 Grafo: `MuzzlePos`

**Funções e Métodos Chamados:**
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetSocketTransform()`
- 🛠️ `GetForwardVector()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get WeaponMesh`

### 📌 Grafo: `NextWeaponMode`

**Funções e Métodos Chamados:**
- 🛠️ `SetMode_Burst()`
- 🛠️ `SetMode_Auto()`
- 🛠️ `SetMode_SingleShot()`

**Variáveis Manipuladas:**
- `Get Current Fire Mode`

### 📌 Grafo: `OnRep_CurrentAmmoInBP`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateAmmoBP()`
- 🛠️ `GetHUD()`

**Variáveis Manipuladas:**
- `Get CurrentAmmoInBP`
- `Get OwnerCharacter`

### 📌 Grafo: `OnRep_CurrentAmmoInMag`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateAmmoMag()`
- 🛠️ `GetHUD()`

**Variáveis Manipuladas:**
- `Get CurrentAmmoInMag`
- `Get OwnerCharacter`

### 📌 Grafo: `OnRep_NoAmmo`

**Comentários e Títulos de Seção Encontrados:**
- *"Atualizar HUD "*

**Funções e Métodos Chamados:**
- 🛠️ `WPN_CantShoot()`

**Variáveis Manipuladas:**
- `Get NoAmmo`
- `Get OwnerCharacter`
- `Set Current Weapon State`

### 📌 Grafo: `ReloadEnd`

**Comentários e Títulos de Seção Encontrados:**
- *"Limpar tempo de recarregamento"*
- *"Parar de recarregar"*
- *"Perder todas as balas restantes do pente"*
- *"Adicionar munição armazenada para o pente"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_IntInt()`
- 🛠️ `K2_ClearAndInvalidateTimerHandle()`

**Variáveis Manipuladas:**
- `Get CurrentAmmoInBP`
- `Get CurrentAmmoInMag`
- `Get LRoundstoAdd`
- `Get ReloadTimer`
- `Get WeaponData`
- `Set CurrentAmmoInBP`
- `Set CurrentAmmoInMag`
- `Set IsReloading`
- `Set LRoundstoAdd`

### 📌 Grafo: `ReloadStart`

**Comentários e Títulos de Seção Encontrados:**
- *"Tempo de recarregamento"*
- *"Posso recarregar?"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CanReload?()`
- 🛠️ `CantShoot()`
- 🛠️ `K2_SetTimer()`

**Variáveis Manipuladas:**
- `Get Reload Duration`
- `Set IsFiring`
- `Set IsReloading`
- `Set ReloadTimer`

### 📌 Grafo: `SetMaxSpread`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `FInterpTo()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `FClamp()`
- 🛠️ `K2_SetTimer()`
- 🛠️ `PrintString()`
- 🛠️ `GetHUD()`

**Variáveis Manipuladas:**
- `Get Current Fire Mode`
- `Get IsFiring`
- `Get OwnerCharacter`
- `Get WBCrosshair`
- `Get crosshair_spread`
- `Set TimerSpread`
- `Set crosshair_spread`

### 📌 Grafo: `SetMinSpread`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `K2_ClearAndInvalidateTimerHandle()`
- 🛠️ `PrintString()`
- 🛠️ `GetHUD()`
- 🛠️ `GetChar_CurrentWeapon()`

**Variáveis Manipuladas:**
- `Get OwnerCharacter`
- `Get TimerSpread`
- `Get WBCrosshair`
- `Get crosshair_spread`
- `Set crosshair_spread`

### 📌 Grafo: `SetMode_Auto`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetMode_SingleShot()`

**Variáveis Manipuladas:**
- `Get WeaponData`
- `Set Current Fire Mode`

### 📌 Grafo: `SetMode_Burst`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetMode_Auto()`

**Variáveis Manipuladas:**
- `Get WeaponData`
- `Set Current Fire Mode`

### 📌 Grafo: `SetMode_SingleShot`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetMode_Burst()`

**Variáveis Manipuladas:**
- `Get WeaponData`
- `Set Current Fire Mode`

### 📌 Grafo: `SpawnMagazine`

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketTransform()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Normal()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetInstigator()`
- 🛠️ `GetVelocity()`

**Variáveis Manipuladas:**
- `Get Magazine`
- `Get Mesh`
- `Get OwnerCharacter`
- `Get StaticMesh`
- `Get WeaponData`
- `Get WeaponMesh`

### 📌 Grafo: `SpawnProjectile`

**Comentários e Títulos de Seção Encontrados:**
- *"Fechar mira"*
- *"Subtrair munição se o projétil for lançado"*
- *"Fechar o sistema de tiro"*
- *"Recoil da arma"*
- *"Efeito do tiro - VFX + Sons + Animações"*
- *"Dano do projétil"*
- *"Som da arma sem munição"*
- *"Auto Reload"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetMaxSpread()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `CalculateInitialDirection()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `Reload()`
- 🛠️ `CalcFinalDirection()`
- 🛠️ `IsValid()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `SpawnSoundAtLocation()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `WeaponEffects()`
- 🛠️ `CalculateDamage()`
- 🛠️ `WPN_CantShoot()`
- 🛠️ `WPN_Recoil()`
- 🛠️ `GetChar_WeaponSystem()`

**Variáveis Manipuladas:**
- `Get Bullet Speed`
- `Get BulletRicochet`
- `Get BulletSpawned`
- `Get Bullets in Shot`
- `Get CurrentAmmoInMag`
- `Get NoAmmoSound`
- `Get OwnerCharacter`
- `Get ProjectileSize`
- `Get WeaponData`
- `Set BulletSpawned`
- `Set CurrentAmmoInMag`

### 📌 Grafo: `UserConstructionScript`

**Comentários e Títulos de Seção Encontrados:**
- *"Criar e atribuir estrutura da arma para a variavel \"*
- *"Atribuir variaveis do \"*
- *"Munições, modos de tiro e estado da arma"*
- *"Definir novo pente para a arma"*

**Funções e Métodos Chamados:**
- 🛠️ `Clamp()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `GetPlayLength()`
- 🛠️ `SetSkinnedAssetAndUpdate()`
- 🛠️ `Divide_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Magazine`
- `Get WeaponData`
- `Get WeaponMesh`
- `Get WeaponStored`
- `Set Accuracy Penalty While Moving`
- `Set Bullet Speed`
- `Set BulletRicochet`
- `Set Bullets in Shot`
- `Set Char Animations`
- `Set Current Fire Mode`
- `Set Current Weapon State`
- `Set CurrentAmmoInBP`
- `Set CurrentAmmoInMag`
- `Set Fire Rate`
- `Set Fire Sound`
- `Set Muzzle Flash FX`
- `Set Projectile`
- `Set ProjectileSize`
- `Set Reduce Accuracy While Moving`
- `Set Reload Duration`
- `Set Reload Sound`
- `Set Weapon Animations`
- `Set Weapon Spread`
- `Set WeaponData`

### 📌 Grafo: `ExecuteUbergraph_BP_WeaponBase`

**Comentários e Títulos de Seção Encontrados:**
- *"Interação com as armas"*
- *"Simular Física"*
- *"Alterar canal de colisão quando estiver dropado"*
- *"Dar acesso a classe genérica character"*
- *"Evento para dropar arma"*
- *"Atribuir informações da arma no HUD"*
- *"Está atirando"*
- *"Modo de tiro único"*
- *"Modo de tiro \"*
- *"Modo de tiro automático"*
- *"Evento atirar"*
- *"Evento Recarregar "*
- *"Animação do personagem"*
- *"Partícula do Muzzle"*
- *"Som do tiro"*
- *"Animação da arma"*
- *"Efeitos da arma"*
- *"Definir modo de tiro ao iniciar o game"*
- *"Evento trocar o modo de tiro"*
- *"Adicionar munição a arma"*
- *"Rotação da arma"*
- *"Eventos para efeitos da arma ao recarregar"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__BP_WeaponBase_WeaponCollision_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__BP_WeaponBase_WeaponCollision_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature`
- 🟢 `ReceiveBeginPlay`
- 🟢 `SetWeaponIsDropped`
- 🟢 `UpdateHUD_WeaponData`
- 🟢 `WeaponFire`
- 🟢 `WeaponReload`
- 🟢 `WeaponEffects`
- 🟢 `WeaponFireMode`
- 🟢 `AddAmmoToBP`
- 🟢 `DropMagazine`
- 🟢 `InsertMagazine`
- 🟢 `PickupMagazine`
- 🟢 `AttachInHand`
- 🔀 Contém `10` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `WPN_SetWeaponToInteract()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `SetSimulatePhysics()`
- 🛠️ `GetOwner()`
- 🛠️ `Delay()`
- 🛠️ `GetHUD()`
- 🛠️ `SetWeaponDataHUD()`
- 🛠️ `CanShoot?()`
- 🛠️ `SpawnProjectile()`
- 🛠️ `RetriggerableDelay()`
- 🛠️ `CantShoot()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `ReloadStart()`
- 🛠️ `PlaySoundAtLocation()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `SpawnEmitterAttached()`
- 🛠️ `GetChar_WeaponSystem()`
- 🛠️ `PlayAnimation()`
- 🛠️ `SetMode_SingleShot()`
- 🛠️ `SetMode_Burst()`
- 🛠️ `SetMode_Auto()`
- 🛠️ `NextWeaponMode()`
- 🛠️ `SetMaxSpread()`
- 🛠️ `Clamp()`
- 🛠️ `SetActive()`
- 🛠️ `Not_PreBool()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `SetVisibility()`
- 🛠️ `SpawnMagazine()`
- 🛠️ `IsValid()`
- 🛠️ `FlushNetDormancy()`
- 🛠️ `OnRep_CurrentAmmoInBP()`
- 🛠️ `MarkPropertyDirtyFromRepIndex()`

**Variáveis Manipuladas:**
- `Get AutoPickUp`
- `Get Current Fire Mode`
- `Get CurrentAmmoInBP`
- `Get CurrentAmmoInMag`
- `Get CurrentRoundsInBurst`
- `Get Fire Rate`
- `Get Fire Sound`
- `Get IsFiring`
- `Get IsPickup`
- `Get Magazine`
- `Get Mesh`
- `Get Muzzle Flash FX`
- `Get OwnerCharacter`
- `Get RotatingMovement`
- `Get WeaponCollision`
- `Get WeaponData`
- `Get WeaponMesh`
- `Get WeaponPhysics`
- `Get WeaponRotating`
- `Set CurrentAmmoInBP`
- `Set CurrentRoundsInBurst`
- `Set IsFiring`
- `Set IsOnFireRateDelay`
- `Set IsPickup`
- `Set OwnerCharacter`
- `Set WeaponPhysics`

### 📌 Grafo: `AttachInHand`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `PickupMagazine`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `InsertMagazine`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `DropMagazine`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `AddAmmoToBP`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `WeaponFireMode`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `BndEvt__BP_WeaponBase_WeaponCollision_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `BndEvt__BP_WeaponBase_WeaponCollision_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `WeaponEffects`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `WeaponReload`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `WeaponFire`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `UpdateHUD_WeaponData`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `SetWeaponIsDropped`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_WeaponBase()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Criar e atribuir estrutura da arma para a variavel \"*
- *"Atribuir variaveis do \"*
- *"Munições, modos de tiro e estado da arma"*
- *"Definir novo pente para a arma"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `GetPlayLength()`
- 🛠️ `SetSkinnedAssetAndUpdate()`
- 🛠️ `Clamp()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `IsValid()`
- 🛠️ `GetDataTableRowFromName()`
- 🛠️ `FlushNetDormancy()`
- 🛠️ `OnRep_CurrentAmmoInMag()`
- 🛠️ `MarkPropertyDirtyFromRepIndex()`
- 🛠️ `OnRep_CurrentAmmoInBP()`

**Variáveis Manipuladas:**
- `Get Char Animations`
- `Get Magazine`
- `Get WeaponData`
- `Get WeaponMesh`
- `Get WeaponStored`
- `Set Accuracy Penalty While Moving`
- `Set Bullet Speed`
- `Set BulletRicochet`
- `Set Bullets in Shot`
- `Set Char Animations`
- `Set Current Fire Mode`
- `Set Current Weapon State`
- `Set CurrentAmmoInBP`
- `Set CurrentAmmoInMag`
- `Set Fire Rate`
- `Set Fire Sound`
- `Set Muzzle Flash FX`
- `Set Projectile`
- `Set ProjectileSize`
- `Set Reduce Accuracy While Moving`
- `Set Reload Duration`
- `Set Reload Sound`
- `Set Weapon Animations`
- `Set Weapon Spread`
- `Set WeaponData`

### 📌 Grafo: `CanShoot?_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get IsFiring`
- `Get IsOnFireRateDelay`
- `Get IsReloading`

### 📌 Grafo: `SpawnProjectile_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Subtrair munição se o projétil for lançado"*
- *"Fechar o sistema de tiro"*
- *"Recoil da arma"*
- *"Efeito do tiro - VFX + Sons + Animações"*
- *"Dano do projétil"*
- *"Som da arma sem munição"*
- *"Auto Reload"*
- *"Fechar mira"*
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CalculateInitialDirection()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `CalcFinalDirection()`
- 🛠️ `IsValid()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `WPN_CantShoot()`
- 🛠️ `SpawnSoundAtLocation()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `CalculateDamage()`
- 🛠️ `WPN_Recoil()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `GetChar_WeaponSystem()`
- 🛠️ `Reload()`
- 🛠️ `WeaponEffects()`
- 🛠️ `SetMaxSpread()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `Add_IntInt()`
- 🛠️ `BeginDeferredActorSpawnFromClass()`
- 🛠️ `FinishSpawningActor()`
- 🛠️ `SetDoublePropertyByName()`
- 🛠️ `SetBoolPropertyByName()`
- 🛠️ `SetBytePropertyByName()`
- 🛠️ `SetIntPropertyByName()`
- 🛠️ `SetObjectPropertyByName()`
- 🛠️ `FlushNetDormancy()`
- 🛠️ `OnRep_CurrentAmmoInMag()`
- 🛠️ `MarkPropertyDirtyFromRepIndex()`

**Variáveis Manipuladas:**
- `Get Bullet Speed`
- `Get BulletRicochet`
- `Get BulletSpawned`
- `Get Bullets in Shot`
- `Get CurrentAmmoInMag`
- `Get NoAmmoSound`
- `Get OwnerCharacter`
- `Get ProjectileSize`
- `Get WeaponData`
- `Set BulletSpawned`
- `Set CurrentAmmoInMag`

### 📌 Grafo: `CantShoot_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `FlushNetDormancy()`
- 🛠️ `OnRep_NoAmmo()`
- 🛠️ `MarkPropertyDirtyFromRepIndex()`

**Variáveis Manipuladas:**
- `Get CurrentAmmoInBP`
- `Get CurrentAmmoInMag`
- `Set NoAmmo`

### 📌 Grafo: `OnRep_NoAmmo_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Atualizar HUD "*

**Funções e Métodos Chamados:**
- 🛠️ `WPN_CantShoot()`

**Variáveis Manipuladas:**
- `Get NoAmmo`
- `Get OwnerCharacter`
- `Set Current Weapon State`

### 📌 Grafo: `CalculateInitialDirection_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `K2_GetComponentToWorld()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `SelectVector()`
- 🛠️ `FindLookAtRotation()`
- 🛠️ `ComposeRotators()`
- 🛠️ `MakeRotator()`
- 🛠️ `DoesSocketExist()`
- 🛠️ `PrintString()`
- 🛠️ `GetForwardVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `GetSocketTransform()`
- 🛠️ `GetVelocity()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `SelectFloat()`
- 🛠️ `BreakTransform()`
- 🛠️ `BreakHitResult()`

**Variáveis Manipuladas:**
- `Get Accuracy Penalty While Moving`
- `Get CameraBehavior`
- `Get CharacterMovement`
- `Get MaxWalkSpeed`
- `Get OwnerCharacter`
- `Get Reduce Accuracy While Moving`
- `Get WeaponMesh`

### 📌 Grafo: `CalcFinalDirection_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"\"*

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `ComposeRotators()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get Weapon Spread`

### 📌 Grafo: `CalculateDamage_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `RandomFloatInRange()`
- 🛠️ `SelectFloat()`
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get WeaponData`

### 📌 Grafo: `ReloadStart_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Tempo de recarregamento"*
- *"Posso recarregar?"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CanReload?()`
- 🛠️ `CantShoot()`
- 🛠️ `K2_SetTimer()`

**Variáveis Manipuladas:**
- `Get Reload Duration`
- `Set IsFiring`
- `Set IsReloading`
- `Set ReloadTimer`

### 📌 Grafo: `ReloadEnd_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Limpar tempo de recarregamento"*
- *"Parar de recarregar"*
- *"Perder todas as balas restantes do pente"*
- *"Adicionar munição armazenada para o pente"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_IntInt()`
- 🛠️ `K2_ClearAndInvalidateTimerHandle()`
- 🛠️ `FlushNetDormancy()`
- 🛠️ `OnRep_CurrentAmmoInMag()`
- 🛠️ `MarkPropertyDirtyFromRepIndex()`
- 🛠️ `OnRep_CurrentAmmoInBP()`

**Variáveis Manipuladas:**
- `Get CurrentAmmoInBP`
- `Get CurrentAmmoInMag`
- `Get LRoundstoAdd`
- `Get ReloadTimer`
- `Get WeaponData`
- `Set CurrentAmmoInBP`
- `Set CurrentAmmoInMag`
- `Set IsReloading`
- `Set LRoundstoAdd`

### 📌 Grafo: `CanReload?_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Greater_IntInt()`
- 🛠️ `NotEqual_IntInt()`
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get CurrentAmmoInBP`
- `Get CurrentAmmoInMag`
- `Get IsReloading`
- `Get WeaponData`

### 📌 Grafo: `OnRep_CurrentAmmoInMag_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetHUD()`
- 🛠️ `UpdateAmmoMag()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get CurrentAmmoInMag`
- `Get OwnerCharacter`

### 📌 Grafo: `OnRep_CurrentAmmoInBP_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetHUD()`
- 🛠️ `UpdateAmmoBP()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get CurrentAmmoInBP`
- `Get OwnerCharacter`

### 📌 Grafo: `SetMode_SingleShot_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetMode_Burst()`

**Variáveis Manipuladas:**
- `Get WeaponData`
- `Set Current Fire Mode`

### 📌 Grafo: `SetMode_Burst_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetMode_Auto()`

**Variáveis Manipuladas:**
- `Get WeaponData`
- `Set Current Fire Mode`

### 📌 Grafo: `SetMode_Auto_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetMode_SingleShot()`

**Variáveis Manipuladas:**
- `Get WeaponData`
- `Set Current Fire Mode`

### 📌 Grafo: `NextWeaponMode_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `SetMode_Burst()`
- 🛠️ `SetMode_Auto()`
- 🛠️ `SetMode_SingleShot()`

**Variáveis Manipuladas:**
- `Get Current Fire Mode`

### 📌 Grafo: `SetMinSpread_MERGED`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetHUD()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `K2_ClearAndInvalidateTimerHandle()`
- 🛠️ `PrintString()`
- 🛠️ `GetChar_CurrentWeapon()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get OwnerCharacter`
- `Get TimerSpread`
- `Get WBCrosshair`
- `Get crosshair_spread`
- `Set crosshair_spread`

### 📌 Grafo: `SetMaxSpread_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetHUD()`
- 🛠️ `FInterpTo()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `FClamp()`
- 🛠️ `K2_SetTimer()`
- 🛠️ `PrintString()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Current Fire Mode`
- `Get IsFiring`
- `Get OwnerCharacter`
- `Get WBCrosshair`
- `Get crosshair_spread`
- `Set TimerSpread`
- `Set crosshair_spread`

### 📌 Grafo: `SpawnMagazine_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketTransform()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Normal()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetInstigator()`
- 🛠️ `GetVelocity()`
- 🛠️ `IsValid()`
- 🛠️ `BeginDeferredActorSpawnFromClass()`
- 🛠️ `FinishSpawningActor()`
- 🛠️ `SetVectorPropertyByName()`
- 🛠️ `SetDoublePropertyByName()`
- 🛠️ `SetObjectPropertyByName()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get Magazine`
- `Get Mesh`
- `Get OwnerCharacter`
- `Get StaticMesh`
- `Get WeaponData`
- `Get WeaponMesh`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_WeaponBase`?
- Quais variáveis estão disponíveis no Blueprint `BP_WeaponBase`?
- Quais funções e eventos são chamados no grafo do `BP_WeaponBase`?