# 🎮 Blueprint: FirstPersonCharacter_rifle_2

**[Classe Pai / Parent Class: `Character`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `BaseTurnRate` | `real (double)` |
| `BaseLookUpRate` | `real (double)` |
| `ObjectLocation` | `real (double)` |
| `ObjectRotation` | `struct (Rotator)` |
| `ImpulseValue` | `real (double)` |
| `JumpShakeScale` | `real (double)` |
| `Rifle_Recoil Amp` | `real (double)` |
| `Rifle_sideways` | `real (double)` |
| `CharacterFullHeight` | `real (double)` |
| `HeadBobScale` | `real (double)` |
| `Aim_Offset_Max_Range` | `real (double)` |
| `MaxRangeHitLocation` | `struct (Vector)` |
| `Rifle Fire Rate` | `real (double)` |
| `GrenadeLauncher_Recoil` | `real (double)` |
| `SelectedWeapon` | `int` |
| `Pistol Fire Rate` | `real (double)` |
| `HiPowered Fire Rate` | `real (double)` |
| `Pistol_Recoil Amp` | `real (double)` |
| `HP_Recoil Amp` | `real (double)` |
| `Game Mode BP` | `object (FirstPersonGameMode_C)` |
| `Pistol_sideways` | `real (double)` |
| `HP_sideways` | `real (double)` |
| `Grenade_sideways` | `real (double)` |
| `AssholeRating` | `real (double)` |
| `Doors Destroyed?` | `real (double)` |
| `Slowmo?` | `bool` |
| `VO_BP` | `object (VO_BP_C)` |
| `Aiming` | `bool` |
| `AimingTransition` | `bool` |
| `ThrowGrenadeRate` | `real (double)` |
| `TriggerPressed` | `bool` |
| `ScopeActive` | `bool` |
| `GunAudioToggle` | `bool` |
| `CharacterMoving` | `bool` |
| `AimOffsetMaxRange` | `real (double)` |
| `AimOffsetHit` | `bool` |
| `AimTransform` | `struct (Transform)` |
| `ObjectPickedUp` | `bool` |
| `Pickup` | `object (Actor)` |
| `Decal Fade Size Multiplier` | `real (double)` |
| `RecoilType` | `byte (RecoilType)` |
| `ConeRecoilYawMAX` | `real (double)` |
| `ConeRecoilPitch MAX` | `real (double)` |
| `ConeRecoilYaw` | `real (double)` |
| `ConeRecoilPitch` | `real (double)` |
| `RecoilConePerShotAdd` | `real (double)` |
| `RecoilCurve` | `object (CurveFloat)` |
| `RecoilFloatSet` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `AimOffsetTrace`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetForwardVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `BreakHitResult()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeRotFromX()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `GetControlRotation()`

**Variáveis Manipuladas:**
- `Set AimOffsetHit`
- `Set AimTransform`
- `Set MaxRangeHitLocation`

### 📌 Grafo: `ConeRecoilWorkout_3`

**Funções e Métodos Chamados:**
- 🛠️ `RandomUnitVectorInEllipticalConeInDegrees()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get AimTransform`
- `Get ConeRecoilPitch`
- `Get ConeRecoilYaw`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Cone Recoil Simple Example"*
- *"Spawn Rifle projectile"*
- *"Shell and Ejector Port Smoke"*
- *"BulletTime"*
- *"Muzzle Flash"*
- *"Spawn Pistol projectile"*
- *"Shell and Ejector Port Smoke"*
- *"Muzzle Flash"*
- *"Activate Muzzle Smoke FX once trigger is lifted (we don\'t want to spawn too many smoke FX during rapid fire)"*
- *"MUZZLE SMOKE OFF"*
- *"Weapon Select"*
- *"Recoil Pistol Fire"*
- *"Headbob"*
- *"Gun Audio Toggle"*
- *"Grenade"*
- *"HP Rifle"*
- *"Rifle"*
- *"Pistol"*
- *"Zoom Toggler"*
- *"Trigger Press"*
- *"Muzzle Flash"*
- *"Set Gun Loc"*
- *"Movement Check"*
- *"Deactivate Muzzle Smoke On Movement Threshold"*
- *"Recoil Hi Powered Fire"*
- *"Recoil Rifle Fire"*
- *"Grenade Thrown"*
- *"Aiming Mode"*
- *"Aim Offset"*
- *"Shell and Ejector Port Smoke"*
- *"Grenade Launcher"*
- *"Recoil Grenade Fire"*
- *"Stick input"*
- *"Jump"*
- *"Mouse input"*
- *"Movement input"*
- *"Spawn HP Rifle projectile"*

**Eventos de Entrada (Events):**
- 🟢 `ChangeWeapon`
- 🟢 `AimOffsetTrigger`
- 🟢 `ConeRecoil`
- 🟢 `TriggerOFF`
- 🟢 `TriggerON`
- 🟢 `MuzzleSmokeOff`
- 🟢 `ReceiveTick`
- 🟢 `ReceiveBeginPlay`
- 🔀 Contém `23` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `RandomFloatInRange()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `AddControllerPitchInput()`
- 🛠️ `AddControllerYawInput()`
- 🛠️ `SpawnEmitterAttached()`
- 🛠️ `Jump()`
- 🛠️ `AimOffsetTrigger()`
- 🛠️ `AddMovementInput()`
- 🛠️ `GetActorForwardVector()`
- 🛠️ `K2_SetRelativeLocationAndRotation()`
- 🛠️ `VSize()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Activate()`
- 🛠️ `MuzzleSmokeOff()`
- 🛠️ `Lerp()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `TriggerOFF()`
- 🛠️ `IsActive()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `ClientStartCameraShake()`
- 🛠️ `GetPlayerController()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `GetControlRotation()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `ComposeRotators()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `ConeRecoil()`
- 🛠️ `GetGlobalTimeDilation()`
- 🛠️ `GetDisplayName()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `SpawnSoundAttached()`
- 🛠️ `Montage_Play()`
- 🛠️ `MakeTransform()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `ExecuteConsoleCommand()`
- 🛠️ `FClamp()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `K2_GetComponentRotation()`
- 🛠️ `GetForwardVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `BreakHitResult()`
- 🛠️ `PrintString()`
- 🛠️ `GetActorRightVector()`
- 🛠️ `MoveComponentTo()`
- 🛠️ `Deactivate()`
- 🛠️ `StopJumping()`
- 🛠️ `BPI_Interaction()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get AimOffsetMaxRange`
- `Get AimTransform`
- `Get Aiming`
- `Get BaseLookUpRate`
- `Get BaseTurnRate`
- `Get CharacterMovement`
- `Get ConeRecoilPitch`
- `Get ConeRecoilPitch MAX`
- `Get ConeRecoilYaw`
- `Get ConeRecoilYawMAX`
- `Get Decal Fade Size Multiplier`
- `Get EjectorPort`
- `Get FieldOfView`
- `Get FirstPersonCamera`
- `Get GrenadeLauncher_Recoil`
- `Get GrenadeSpawnPoint`
- `Get Grenade_sideways`
- `Get GunAudioToggle`
- `Get HP_Recoil Amp`
- `Get HP_sideways`
- `Get HeadBobScale`
- `Get HiPowered Fire Rate`
- `Get Mesh2P`
- `Get Muzzle_Smoke_light`
- `Get ObjectPickedUp`
- `Get Pickup`
- `Get Pistol Fire Rate`
- `Get Pistol_Recoil Amp`
- `Get Pistol_sideways`
- `Get ProjectileSpawnPoint`
- `Get RecoilConePerShotAdd`
- `Get RecoilType`
- `Get Rifle Fire Rate`
- `Get Rifle_Recoil Amp`
- `Get Rifle_sideways`
- `Get SelectedWeapon`
- `Get Slowmo?`
- `Get ThrowGrenadeRate`
- `Get TriggerPressed`
- `Get Velocity`
- `Set Aiming`
- `Set AimingTransition`
- `Set CharacterMoving`
- `Set ConeRecoilPitch`
- `Set ConeRecoilYaw`
- `Set FieldOfView`
- `Set GunAudioToggle`
- `Set HeadBobScale`
- `Set RecoilFloatSet`
- `Set ScopeActive`
- `Set SelectedWeapon`
- `Set Slowmo?`
- `Set TriggerPressed`

### 📌 Grafo: `FireRateAndSpamClickRegulation`

**Funções e Métodos Chamados:**
- 🛠️ `RetriggerableDelay()`

### 📌 Grafo: `ConeRecoilWorkout`

**Funções e Métodos Chamados:**
- 🛠️ `RandomUnitVectorInEllipticalConeInDegrees()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get AimTransform`
- `Get ConeRecoilPitch`
- `Get ConeRecoilYaw`

### 📌 Grafo: `ConeRecoilWorkout_2`

**Funções e Métodos Chamados:**
- 🛠️ `RandomUnitVectorInEllipticalConeInDegrees()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get AimTransform`
- `Get ConeRecoilPitch`
- `Get ConeRecoilYaw`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `K2_AttachTo()`

**Variáveis Manipuladas:**
- `Get FP_Gun`
- `Get Mesh2P`

### 📌 Grafo: `ExecuteUbergraph_FirstPersonCharacter_rifle_2`

**Comentários e Títulos de Seção Encontrados:**
- *"Mouse input"*
- *"Jump"*
- *"Movement input"*
- *"Stick input"*
- *"Recoil Rifle Fire"*
- *"Grenade Launcher"*
- *"Recoil Grenade Fire"*
- *"Recoil Pistol Fire"*
- *"Recoil Hi Powered Fire"*
- *"Spawn Rifle projectile"*
- *"BulletTime"*
- *"Weapon Select"*
- *"Headbob"*
- *"Trigger Press"*
- *"Shell and Ejector Port Smoke"*
- *"Aiming Mode"*
- *"Grenade Thrown"*
- *"Activate Muzzle Smoke FX once trigger is lifted (we don\'t want to spawn too many smoke FX during rapid fire)"*
- *"Gun Audio Toggle"*
- *"Muzzle Flash"*
- *"Zoom Toggler"*
- *"Set Gun Loc"*
- *"Movement Check"*
- *"Deactivate Muzzle Smoke On Movement Threshold"*
- *"MUZZLE SMOKE OFF"*
- *"Spawn Pistol projectile"*
- *"Shell and Ejector Port Smoke"*
- *"Muzzle Flash"*
- *"Spawn HP Rifle projectile"*
- *"Shell and Ejector Port Smoke"*
- *"Muzzle Flash"*
- *"Aim Offset"*
- *"Grenade"*
- *"HP Rifle"*
- *"Rifle"*
- *"Pistol"*
- *"Cone Recoil Simple Example"*
- *"Only do variable assignment the first time in"*
- *"Only do variable assignment the first time in"*
- *"Close on first entrance, if desired"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `TriggerOFF`
- 🟢 `ReceiveTick`
- 🟢 `MuzzleSmokeOff`
- 🟢 `AimOffsetTrigger`
- 🟢 `TriggerON`
- 🟢 `ConeRecoil`
- 🟢 `ChangeWeapon`
- 🟢 `BPI_Interaction`
- 🟢 `ConeRecoilFloat__UpdateFunc`
- 🟢 `ConeRecoilFloat__FinishedFunc`
- 🟢 `Timeline_4__UpdateFunc`
- 🟢 `Timeline_4__FinishedFunc`
- 🟢 `Timeline_5__UpdateFunc`
- 🟢 `Timeline_5__FinishedFunc`
- 🟢 `Timeline_1__UpdateFunc`
- 🟢 `Timeline_1__FinishedFunc`
- 🟢 `Timeline_6__UpdateFunc`
- 🟢 `Timeline_6__FinishedFunc`
- 🟢 `0-1 in a second__UpdateFunc`
- 🟢 `0-1 in a second__FinishedFunc`
- 🟢 `Timeline_0__UpdateFunc`
- 🟢 `Timeline_0__FinishedFunc`
- 🔀 Contém `37` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Jump()`
- 🛠️ `AddControllerPitchInput()`
- 🛠️ `AddControllerYawInput()`
- 🛠️ `AddMovementInput()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `GetActorForwardVector()`
- 🛠️ `GetActorRightVector()`
- 🛠️ `StopJumping()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `ClientStartCameraShake()`
- 🛠️ `GetPlayerController()`
- 🛠️ `Lerp()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `MakeTransform()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `GetControlRotation()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `Montage_Play()`
- 🛠️ `GetGlobalTimeDilation()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `ComposeRotators()`
- 🛠️ `MoveComponentTo()`
- 🛠️ `K2_SetRelativeLocationAndRotation()`
- 🛠️ `SpawnSoundAttached()`
- 🛠️ `SpawnEmitterAttached()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `VSize()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `IsActive()`
- 🛠️ `Deactivate()`
- 🛠️ `MuzzleSmokeOff()`
- 🛠️ `AimOffsetTrigger()`
- 🛠️ `Activate()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `K2_GetComponentRotation()`
- 🛠️ `GetForwardVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `BreakHitResult()`
- 🛠️ `PrintString()`
- 🛠️ `GetDisplayName()`
- 🛠️ `BPI_Interaction()`
- 🛠️ `ExecuteConsoleCommand()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `ConeRecoil()`
- 🛠️ `FClamp()`
- 🛠️ `TriggerOFF()`
- 🛠️ `RetriggerableDelay()`
- 🛠️ `RandomUnitVectorInEllipticalConeInDegrees()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `MakeRotFromX()`
- 🛠️ `Not_PreBool()`
- 🛠️ `BreakTransform()`
- 🛠️ `BeginDeferredActorSpawnFromClass()`
- 🛠️ `FinishSpawningActor()`
- 🛠️ `SetDoublePropertyByName()`
- 🛠️ `SetBytePropertyByName()`
- 🛠️ `MakeLiteralByte()`
- 🛠️ `PlayFromStart()`
- 🛠️ `ReverseFromEnd()`
- 🛠️ `Play()`

**Variáveis Manipuladas:**
- `Get 0-1 in a second`
- `Get AimOffsetMaxRange`
- `Get AimTransform`
- `Get Aiming`
- `Get BaseLookUpRate`
- `Get BaseTurnRate`
- `Get CharacterMovement`
- `Get ConeRecoilFloat`
- `Get ConeRecoilFloat_RecoilConeFloat_EB0936E940DEC5430AB1929EF8942213`
- `Get ConeRecoilPitch`
- `Get ConeRecoilPitch MAX`
- `Get ConeRecoilYaw`
- `Get ConeRecoilYawMAX`
- `Get Decal Fade Size Multiplier`
- `Get EjectorPort`
- `Get FieldOfView`
- `Get FirstPersonCamera`
- `Get GrenadeLauncher_Recoil`
- `Get GrenadeSpawnPoint`
- `Get Grenade_sideways`
- `Get GunAudioToggle`
- `Get HP_Recoil Amp`
- `Get HP_sideways`
- `Get HeadBobScale`
- `Get HiPowered Fire Rate`
- `Get Mesh2P`
- `Get Muzzle_Smoke_light`
- `Get ObjectPickedUp`
- `Get Pickup`
- `Get Pistol Fire Rate`
- `Get Pistol_Recoil Amp`
- `Get Pistol_sideways`
- `Get ProjectileSpawnPoint`
- `Get RecoilConePerShotAdd`
- `Get RecoilType`
- `Get Rifle Fire Rate`
- `Get Rifle_Recoil Amp`
- `Get Rifle_sideways`
- `Get SelectedWeapon`
- `Get Slowmo?`
- `Get ThrowGrenadeRate`
- `Get Timeline_0`
- `Get Timeline_0_Recoil_Float_BBF1F5DB45D1CADD2BE1239C3DE42133`
- `Get Timeline_1`
- `Get Timeline_1_Recoil_Float_6841B3DE439487549DD87DB0C29F983B`
- `Get Timeline_4`
- `Get Timeline_4_Range_2A7A09874500B7FCEF43C7A31C711405`
- `Get Timeline_5`
- `Get Timeline_5_Recoil_Float_0E3E399341B5C6B16997B4879968BA05`
- `Get Timeline_6`
- `Get Timeline_6_Recoil_Float_C264A5AE475EB064CA2627A9C093D25E`
- `Get TriggerPressed`
- `Get Velocity`
- `Get __1_in_a_second_0_1_in_a_second_92A65D3240F10C69F73A6BB830DBD05D`
- `Set AimOffsetHit`
- `Set AimTransform`
- `Set Aiming`
- `Set AimingTransition`
- `Set CharacterMoving`
- `Set ConeRecoilPitch`
- `Set ConeRecoilYaw`
- `Set FieldOfView`
- `Set GunAudioToggle`
- `Set HeadBobScale`
- `Set MaxRangeHitLocation`
- `Set RecoilFloatSet`
- `Set ScopeActive`
- `Set SelectedWeapon`
- `Set Slowmo?`
- `Set TriggerPressed`

### 📌 Grafo: `ChangeWeapon`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `ConeRecoil`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `TriggerON`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `AimOffsetTrigger`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `MuzzleSmokeOff`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `TriggerOFF`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpAxisEvt_LookUpRate_K2Node_InputAxisEvent_62`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpAxisEvt_TurnRate_K2Node_InputAxisEvent_34`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpAxisEvt_MoveRight_K2Node_InputAxisEvent_192`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpAxisEvt_MoveForward_K2Node_InputAxisEvent_181`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpAxisEvt_LookUp_K2Node_InputAxisEvent_172`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpAxisEvt_Turn_K2Node_InputAxisEvent_157`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `BPI_Interaction`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_F_K2Node_InputKeyEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_Slash_K2Node_InputKeyEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_C_K2Node_InputKeyEvent_2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_Four_K2Node_InputKeyEvent_3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_V_K2Node_InputKeyEvent_4`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_E_K2Node_InputKeyEvent_5`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_Three_K2Node_InputKeyEvent_6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_Two_K2Node_InputKeyEvent_7`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_One_K2Node_InputKeyEvent_8`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_RightMouseButton_K2Node_InputKeyEvent_9`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_Fire_K2Node_InputActionEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_Fire_K2Node_InputActionEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_Jump_K2Node_InputActionEvent_2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `InpActEvt_Jump_K2Node_InputActionEvent_3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `ConeRecoilFloat__UpdateFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `ConeRecoilFloat__FinishedFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `Timeline_4__UpdateFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `Timeline_4__FinishedFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `Timeline_5__UpdateFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `Timeline_5__FinishedFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `Timeline_1__UpdateFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `Timeline_1__FinishedFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `Timeline_6__UpdateFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `Timeline_6__FinishedFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `0-1 in a second__UpdateFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `0-1 in a second__FinishedFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `Timeline_0__UpdateFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `Timeline_0__FinishedFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_FirstPersonCharacter_rifle_2()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_AttachTo()`

**Variáveis Manipuladas:**
- `Get FP_Gun`
- `Get Mesh2P`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `FirstPersonCharacter_rifle_2`?
- Quais variáveis estão disponíveis no Blueprint `FirstPersonCharacter_rifle_2`?
- Quais funções e eventos são chamados no grafo do `FirstPersonCharacter_rifle_2`?