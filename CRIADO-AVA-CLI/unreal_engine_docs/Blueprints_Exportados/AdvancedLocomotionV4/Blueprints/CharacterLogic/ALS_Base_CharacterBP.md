# 🎮 Blueprint: ALS_Base_CharacterBP

**[Classe Pai / Parent Class: `Character`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `MovementState` | `byte (ALS_MovementState)` |
| `PrevMovementState` | `byte (ALS_MovementState)` |
| `DesiredRotationMode` | `byte (ALS_RotationMode)` |
| `MovementAction` | `byte (ALS_MovementAction)` |
| `RotationMode` | `byte (ALS_RotationMode)` |
| `DesiredGait` | `byte (ALS_Gait)` |
| `Gait` | `byte (ALS_Gait)` |
| `Stance` | `byte (ALS_Stance)` |
| `ViewMode` | `byte (ALS_ViewMode)` |
| `PreviousVelocity` | `struct (Vector)` |
| `Acceleration` | `struct (Vector)` |
| `IsMoving` | `bool` |
| `HasMovementInput` | `bool` |
| `LastVelocityRotation` | `struct (Rotator)` |
| `LastMovementInputRotation` | `struct (Rotator)` |
| `Speed` | `real (double)` |
| `MovementInputAmount` | `real (double)` |
| `PreviousAimYaw` | `real (double)` |
| `TargetRotation` | `struct (Rotator)` |
| `InAirRotation` | `struct (Rotator)` |
| `YawOffset` | `real (double)` |
| `MovementModel` | `struct (DataTableRowHandle)` |
| `MovementData` | `struct (MovementSettings_State)` |
| `CurrentMovementSettings` | `struct (MovementSettings)` |
| `MantleParams` | `struct (Mantle_Params)` |
| `MantleLedgeLS` | `struct (ALS_ComponentAndTransform)` |
| `MantleTarget` | `struct (Transform)` |
| `MantleActualStartOffset` | `struct (Transform)` |
| `MantleAnimatedStartOffset` | `struct (Transform)` |
| `GroundedTraceSettings` | `struct (Mantle_TraceSettings)` |
| `AutomaticTraceSettings` | `struct (Mantle_TraceSettings)` |
| `FallingTraceSettings` | `struct (Mantle_TraceSettings)` |
| `DesiredStance` | `byte (ALS_Stance)` |
| `LookUp/DownRate` | `real (double)` |
| `LookLeftRightRate` | `real (double)` |
| `AimYawRate` | `real (double)` |
| `OverlayState` | `byte (ALS_OverlayState)` |
| `TimesPressedStance` | `int` |
| `BreakFall` | `bool` |
| `SprintHeld` | `bool` |
| `MainAnimInstance` | `object (AnimInstance)` |
| `RagdollOnGround` | `bool` |
| `RagdollFaceUp` | `bool` |
| `LastRagdollVelocity` | `struct (Vector)` |
| `ThirdPersonFOV` | `real (double)` |
| `FirstPersonFOV` | `real (double)` |
| `RightShoulder` | `bool` |
| `SpawnPoints` | `name` |
| `Dead` | `bool` |
| `InteractedWeapon` | `object (BP_WeaponBase_C)` |
| `HUD` | `object (W_Main_C)` |
| `IsFiring` | `bool` |
| `ShowSniperScope` | `bool` |
| `Int` | `int` |
| `Delta Seconds` | `real (double)` |
| `Reanimating` | `bool` |
| `MovementAxis` | `struct (Vector2D)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `AddToCharacterRotation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_AddActorWorldRotation()`
- 🛠️ `ComposeRotators()`

**Variáveis Manipuladas:**
- `Get DeltaRotation`
- `Get TargetRotation`
- `Set TargetRotation`

### 📌 Grafo: `BPI_Get_3P_PivotTarget`

**Funções e Métodos Chamados:**
- 🛠️ `GetTransform()`

### 📌 Grafo: `BPI_Get_3P_TraceParams`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`

### 📌 Grafo: `BPI_Get_CameraParameters`

**Variáveis Manipuladas:**
- `Get FirstPersonFOV`
- `Get RightShoulder`
- `Get ThirdPersonFOV`

### 📌 Grafo: `BPI_Get_CurrentStates`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get Gait`
- `Get MovementAction`
- `Get MovementMode`
- `Get MovementState`
- `Get OverlayState`
- `Get PrevMovementState`
- `Get RotationMode`
- `Get Stance`
- `Get ViewMode`

### 📌 Grafo: `BPI_Get_EssentialValues`

**Funções e Métodos Chamados:**
- 🛠️ `GetControlRotation()`
- 🛠️ `GetCurrentAcceleration()`
- 🛠️ `GetVelocity()`

**Variáveis Manipuladas:**
- `Get Acceleration`
- `Get AimYawRate`
- `Get CharacterMovement`
- `Get HasMovementInput`
- `Get IsMoving`
- `Get MovementInputAmount`
- `Get Speed`

### 📌 Grafo: `BPI_Get_FP_CameraTarget`

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketLocation()`

**Variáveis Manipuladas:**
- `Get Mesh`

### 📌 Grafo: `CacheValues`

**Comentários e Títulos de Seção Encontrados:**
- *"Cache certain values to be used in calculations on the next frame"*

**Funções e Métodos Chamados:**
- 🛠️ `GetControlRotation()`
- 🛠️ `GetVelocity()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Set PreviousAimYaw`
- `Set PreviousVelocity`

### 📌 Grafo: `CalculateAcceleration`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Acceleration by comparing the current and previous velocity. The Current Acceleration returned by the movement component equals the input acceleration, and does not represent the actual physical accelration of the character."*

**Funções e Métodos Chamados:**
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `GetVelocity()`

**Variáveis Manipuladas:**
- `Get PreviousVelocity`

### 📌 Grafo: `CalculateGroundedRotationRate`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the rotation rate by using the current Rotation Rate Curve in the Movement Settings. Using the curve in conjunction with the mapped speed gives you a high level of control over the rotation rates for each speed. Increase the speed if the camera is rotating quickly for more responsive rotation."*

**Funções e Métodos Chamados:**
- 🛠️ `MapRangeClamped()`
- 🛠️ `GetMappedSpeed()`
- 🛠️ `GetFloatValue()`

**Variáveis Manipuladas:**
- `Get AimYawRate`
- `Get CurrentMovementSettings`

### 📌 Grafo: `CalculateSpeedLadder`

**Funções e Métodos Chamados:**
- 🛠️ `SetLadderMoveSpeed()`
- 🛠️ `PrintString()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `BreakVector2D()`

### 📌 Grafo: `CanEnteringCustomMovement`

### 📌 Grafo: `CanSprint`

**Comentários e Títulos de Seção Encontrados:**
- *"Determine if the character is currently able to sprint based on the Rotation mode and current acceleration (input) rotation. If the character is in the Looking Rotation mode, only allow sprinting if there is full movement input and it is faced forward relative to the camera + or - 50 degrees."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Abs()`
- 🛠️ `GetCurrentAcceleration()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `GetControlRotation()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get HasMovementInput`
- `Get MovementInputAmount`
- `Get RotationMode`

### 📌 Grafo: `CanUpdateMovingRotation`

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Not_PreBool()`
- 🛠️ `HasAnyRootMotion()`

**Variáveis Manipuladas:**
- `Get HasMovementInput`
- `Get IsMoving`
- `Get Speed`

### 📌 Grafo: `CapsuleHasRoomCheck`

**Comentários e Títulos de Seção Encontrados:**
- *"Perform a trace to see if the capsule has room to be at the target location."*

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `GetTraceDebugType()`
- 🛠️ `SphereTraceSingleByProfile()`
- 🛠️ `GetScaledCapsuleHalfHeight_WithoutHemisphere()`
- 🛠️ `BooleanNOR()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakHitResult()`

**Variáveis Manipuladas:**
- `Get Capsule`
- `Get CapsuleRadius`
- `Get DebugType`
- `Get HeightOffset`
- `Get RadiusOffset`
- `Get TargetLocation`

### 📌 Grafo: `DamageSpeed`

**Funções e Métodos Chamados:**
- 🛠️ `LessEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Health`
- `Get PlayerStatus`
- `Set DesiredGait`

### 📌 Grafo: `DrawDebugShapes`

**Comentários e Títulos de Seção Encontrados:**
- *"Target Rotation Arrow"*
- *"Get Debug Info from Player Controller"*
- *"Velocity Arrow"*
- *"Movement Input Arrow"*
- *"Aiming Rotation Cone"*
- *"Capsule "*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetMaxAcceleration()`
- 🛠️ `DrawDebugConeInDegrees()`
- 🛠️ `Vector_NormalUnsafe()`
- 🛠️ `DrawDebugArrow()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `GetScaledCapsuleHalfHeight()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `GetPlayerController()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `DrawDebugCapsule()`
- 🛠️ `GetScaledCapsuleRadius()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `EqualEqual_VectorVector()`
- 🛠️ `SelectVector()`
- 🛠️ `VSize()`
- 🛠️ `SelectColor()`
- 🛠️ `GetControlRotation()`
- 🛠️ `GetVelocity()`
- 🛠️ `GetCurrentAcceleration()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `BPI_Get_DebugInfo()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get LastMovementInputRotation`
- `Get LastVelocityRotation`
- `Get MaxWalkSpeed`
- `Get Mesh`
- `Get TargetRotation`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Spawn Blood Pool"*
- *"Atualizar o movimento customizado"*
- *"Breakfall / Roll: Simply play a Root Motion Montage."*
- *"These functions are a great place to perform logic based on the previous and new state, as they should be called whenever a state changes (as long as you use the Interface Event to change the state)."*
- *"Mantle Timeline: This timeline is triggered from the MantleStart function and updates the function that lerps the character to the new location."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*
- *"State Events"*
- *"Crouch / UnCrouch"*
- *"Event BeginPlay"*
- *"On Pawn Movement Mode Changed"*
- *"State Changes"*
- *"Definir velocidade ao subir/descer a escada"*
- *"Movement Events"*
- *"IMPORTANT!!!\r\n\r\nThis blueprint contains a lot of simple logic meant to be built on or replaced by more sophisticated systems on a Per Project basis. How you manage Movement, Movement actions, Gameplay Events, and Character States should all be determined by the specific needs of your project. \r\n\r\nThe most important thing is to make sure you are updating the correct Character Information in the interface to allow the AnimBP to function correctly."*
- *"On Landed: Temporarily increase the braking friction on lands to make landings more accurate, or trigger a breakfall roll."*
- *"On Jumped: Set the new In Air Rotation to the velocity rotation if speed is greater than 100."*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__ALS_Base_CharacterBP_CustomMovement_K2Node_ComponentBoundEvent_0_OnStartCustomMovement__DelegateSignature`
- 🟢 `BndEvt__ALS_Base_CharacterBP_CustomMovement_K2Node_ComponentBoundEvent_1_OnEndCustomMovement__DelegateSignature`
- 🟢 `SpawnBloodPool`
- 🟢 `SetLadderMoveSpeed`
- 🟢 `Breakfall Event`
- 🟢 `Roll Event`
- 🟢 `ReceiveBeginPlay`
- 🟢 `K2_OnStartCrouch`
- 🟢 `BPI_Set_ViewMode`
- 🟢 `BPI_Set_OverlayState`
- 🟢 `OnLanded`
- 🟢 `OnJumped`
- 🟢 `BPI_Set_MovementState`
- 🟢 `K2_UpdateCustomMovement`
- 🟢 `K2_OnEndCrouch`
- 🟢 `BPI_Set_MovementAction`
- 🟢 `K2_OnMovementModeChanged`
- 🟢 `BPI_Set_RotationMode`
- 🟢 `BPI_Set_Gait`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetRollAnimation()`
- 🛠️ `BreakHitResult()`
- 🛠️ `OnMovementStateChanged()`
- 🛠️ `SpawnDecalAtLocation()`
- 🛠️ `SetWorldScale3D()`
- 🛠️ `OnRotationModeChanged()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `VLerp()`
- 🛠️ `RetriggerableDelay()`
- 🛠️ `SetFadeOut()`
- 🛠️ `FallDamage()`
- 🛠️ `MantleUpdate()`
- 🛠️ `Montage_Play()`
- 🛠️ `Breakfall Event()`
- 🛠️ `OnGaitChanged()`
- 🛠️ `OnViewModeChanged()`
- 🛠️ `OnOverlayStateChanged()`
- 🛠️ `OnCharacterMovementModeChanged()`
- 🛠️ `OnStanceChanged()`
- 🛠️ `OnMovementActionChanged()`
- 🛠️ `UpdateCustomMovement()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `On Begin Play()`
- 🛠️ `Sprint()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `MantleEnd()`
- 🛠️ `BPI_Jumped()`

**Variáveis Manipuladas:**
- `Get BreakFall`
- `Get CharacterMovement`
- `Get CustomMovement`
- `Get Gait`
- `Get HasMovementInput`
- `Get LastVelocityRotation`
- `Get MainAnimInstance`
- `Get Mesh`
- `Get MovementAction`
- `Get MovementState`
- `Get OverlayState`
- `Get PlayerStatus`
- `Get RotationMode`
- `Get Speed`
- `Get ViewMode`
- `Get WeaponIsLocked`
- `Get WeaponSystem`
- `Set BrakingFrictionFactor`
- `Set InAirRotation`
- `Set LadderMoveSpeed`

### 📌 Grafo: `FixDiagonalGamepadValues`

**Funções e Métodos Chamados:**
- 🛠️ `MapRangeClamped()`
- 🛠️ `Abs()`
- 🛠️ `FClamp()`

### 📌 Grafo: `GetActualGait`

**Comentários e Títulos de Seção Encontrados:**
- *"Get the Actual Gait. This is calculated by the actual movement of the character, and so it can be different from the desired gait or allowed gait. For instance, if the Allowed Gait becomes walking, the Actual gait will still be running untill the character decelerates to the walking speed."*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GreaterEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get AllowedGait`
- `Get CurrentMovementSettings`
- `Get LocalRunSpeed`
- `Get LocalWalkSpeed`
- `Get Speed`
- `Set LocalRunSpeed`
- `Set LocalSprintSpeed`
- `Set LocalWalkSpeed`

### 📌 Grafo: `GetAllowedGait`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Allowed Gait. This represents the maximum Gait the character is currently allowed to be in, and can be determined by the desired gait, the rotation mode, the stance, etc. For example, if you wanted to force the character into a walking state while indoors, this could be done here."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CanSprint()`

**Variáveis Manipuladas:**
- `Get DesiredGait`
- `Get RotationMode`
- `Get Stance`

### 📌 Grafo: `GetAnimCurveValue`

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`

**Variáveis Manipuladas:**
- `Get CurveName`
- `Get MainAnimInstance`

### 📌 Grafo: `GetCalpsuleBaseLocation`

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `GetUpVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetScaledCapsuleHalfHeight()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get ZOffset`

### 📌 Grafo: `GetCapsuleLocationFromBase`

**Funções e Métodos Chamados:**
- 🛠️ `GetScaledCapsuleHalfHeight()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get ZOffset`

### 📌 Grafo: `GetChar_CurrentWeapon`

**Variáveis Manipuladas:**
- `Get CurrentWeapon`
- `Get WeaponSystem`

### 📌 Grafo: `GetChar_Mesh`

**Variáveis Manipuladas:**
- `Get Mesh`

### 📌 Grafo: `GetChar_WeaponSystem`

**Variáveis Manipuladas:**
- `Get WeaponSystem`

### 📌 Grafo: `GetChar_WpnSystemValid`

**Funções e Métodos Chamados:**
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get WeaponSystem`

### 📌 Grafo: `GetCharacterDead`

**Variáveis Manipuladas:**
- `Get Dead`

### 📌 Grafo: `GetComponents`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`

**Variáveis Manipuladas:**
- `Get HUD`
- `Get Interaction`
- `Get PlayerStatus`
- `Get WeaponSystem`

### 📌 Grafo: `GetControlForward/RightVector`

**Funções e Métodos Chamados:**
- 🛠️ `GetControlRotation()`
- 🛠️ `GetForwardVector()`
- 🛠️ `GetRightVector()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`

### 📌 Grafo: `GetCustomMovement`

**Variáveis Manipuladas:**
- `Get CustomMovement`

### 📌 Grafo: `GetGetUpAnimation`

**Comentários e Títulos de Seção Encontrados:**
- *"This gets overriden in the AnimMan Child character to select the appropriate animation based on the overlay state."*

### 📌 Grafo: `GetHUD`

**Variáveis Manipuladas:**
- `Get HUD`

### 📌 Grafo: `GetMantleAsset`

**Comentários e Títulos de Seção Encontrados:**
- *"Get the Default Mantle Asset values. These will be overriden in the AnimMan Child Character"*

### 📌 Grafo: `GetMappedSpeed`

**Comentários e Títulos de Seção Encontrados:**
- *"Map the character\'s current speed to the configured movement speeds with a range of 0-3, with 0 = stopped, 1 = the Walk Speed, 2 = the Run Speed, and 3 = the Sprint Speed. This allows you to vary the movement speeds but still use the mapped range in calculations for consistent results."*

**Funções e Métodos Chamados:**
- 🛠️ `MapRangeClamped()`
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get CurrentMovementSettings`
- `Get LocRunSpeed`
- `Get LocSprintSpeed`
- `Get LocWalkSpeed`
- `Get Speed`
- `Set LocRunSpeed`
- `Set LocSprintSpeed`
- `Set LocWalkSpeed`

### 📌 Grafo: `GetPlayerMovementInput`

**Funções e Métodos Chamados:**
- 🛠️ `GetControlForward/RightVector()`
- 🛠️ `Normal()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `BreakVector2D()`

### 📌 Grafo: `GetRollAnimation`

**Comentários e Títulos de Seção Encontrados:**
- *"This gets overriden in the AnimMan Child character to select the appropriate animation based on the overlay state."*

### 📌 Grafo: `GetTargetMovementSettings`

**Variáveis Manipuladas:**
- `Get MovementData`
- `Get RotationMode`
- `Get Stance`

### 📌 Grafo: `GetTraceDebugType`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`
- 🛠️ `BPI_Get_DebugInfo()`

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

### 📌 Grafo: `LimitRotation`

**Comentários e Títulos de Seção Encontrados:**
- *"Prevent the character from rotating past a certain angle."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `InRange_FloatFloat()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `SmoothCharacterRotation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `GetControlRotation()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `SelectFloat()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get InterpSpeed`

### 📌 Grafo: `MantleCheck`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Trace forward to find a wall / object the character cannot walk on."*
- *"Step 5: If everything checks out, start the Mantle"*
- *"Step 2: Trace downward from the first trace\'s Impact Point and determine if the hit location is walkable."*
- *"Step 3: Check if the capsule has room to stand at the downward trace\'s location. If so, set that location as the Target Transform and calculate the mantle height."*
- *"Step 4: Determine the Mantle Type by checking the movement mode and Mantle Height."*
- 🔀 Contém `5` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CapsuleTraceSingle()`
- 🛠️ `IsWalkable()`
- 🛠️ `BreakHitResult()`
- 🛠️ `CapsuleHasRoomCheck()`
- 🛠️ `GetTraceDebugType()`
- 🛠️ `GetCalpsuleBaseLocation()`
- 🛠️ `SphereTraceSingle()`
- 🛠️ `Not_PreBool()`
- 🛠️ `MantleStart()`
- 🛠️ `GetPlayerMovementInput()`
- 🛠️ `GetCapsuleLocationFromBase()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `BreakTransform()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeVector()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get CanJump`
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get DebugType`
- `Get DownTraceLocation`
- `Get HitComponent`
- `Get InitialTrace_ImpactPoint`
- `Get InitialTrace_Normal`
- `Get MantleHeight`
- `Get MantleType`
- `Get MovementState`
- `Get PlayerStatus`
- `Get TargetTransform`
- `Get Trace Settings`
- `Set DownTraceLocation`
- `Set HitComponent`
- `Set InitialTrace_ImpactPoint`
- `Set InitialTrace_Normal`
- `Set MantleHeight`
- `Set MantleType`
- `Set TargetTransform`

### 📌 Grafo: `MantleEnd`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the Character Movement Mode to Walking"*

**Funções e Métodos Chamados:**
- 🛠️ `SetMovementMode()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`

### 📌 Grafo: `MantleStart`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Get the Mantle Asset and use it to set the new Mantle Params."*
- *"Step 7: Play the Anim Montaget if valid."*
- *"Step 6: Configure the Mantle Timeline so that it is the same length as the Lerp/Correction curve minus the starting position, and plays at the same speed as the animation. Then start the timeline."*
- *"Step 5: Clear the Character Movement Mode and set the Movement State to Mantling"*
- *"Step 4: Calculate the Animated Start Offset from the Target Location. This would be the location the actual animation starts at relative to the Target Transform. "*
- *"Step 3: Set the Mantle Target and calculate the Starting Offset (offset amount between the actor and target transform)."*
- *"Step 2: Convert the world space target to the mantle component\'s local space for use in moving objects."*

**Funções e Métodos Chamados:**
- 🛠️ `JumpStamina()`
- 🛠️ `Montage_Play()`
- 🛠️ `SetTimelineLength()`
- 🛠️ `GetTransform()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `GetMantleAsset()`
- 🛠️ `GetTimeRange()`
- 🛠️ `MakeVector()`
- 🛠️ `SetPlayRate()`
- 🛠️ `BPI_Set_MovementState()`
- 🛠️ `PlayFromStart()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `SetMovementMode()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `BreakVector()`
- 🛠️ `BreakTransform()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get MainAnimInstance`
- `Get MantleAsset`
- `Get MantleHeight`
- `Get MantleLedgeWS`
- `Get MantleParams`
- `Get MantleTarget`
- `Get MantleTimeline`
- `Get MantleType`
- `Get PlayerStatus`
- `Set MantleActualStartOffset`
- `Set MantleAnimatedStartOffset`
- `Set MantleAsset`
- `Set MantleLedgeLS`
- `Set MantleParams`
- `Set MantleTarget`

### 📌 Grafo: `MantleUpdate`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Continually update the mantle target from the stored local transform to follow along with moving objects."*
- *"Step 2: Update the Position and Correction Alphas using the Position/Correction curve set for each Mantle."*
- *"Step 3: Lerp multiple transforms together for independent control over the horizontal and vertical blend to the animated start position, as well as the target position."*
- *"Initial Blend In (controlled in the timeline curve) to allow the actor to blend into the Position/Correction curve at the midoint. This prevents pops when mantling an object lower than the animated mantle."*
- *"Blend from the currently blending transforms into the final mantle target using the X value of the Position/Correction Curve."*
- *"Blend into the animated horizontal and rotation offset using the Y value of the Position/Correction Curve."*
- *"Blend into the animated vertical offset using the Z value of the Position/Correction Curve."*
- *"Step 4: Set the actors location and rotation to the Lerped Target."*

**Funções e Métodos Chamados:**
- 🛠️ `TLerp()`
- 🛠️ `GetVectorValue()`
- 🛠️ `BreakVector()`
- 🛠️ `BreakTransform()`
- 🛠️ `SetActorLocationAndRotation(UpdateTarget)()`
- 🛠️ `GetPlaybackPosition()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get BlendIn`
- `Get LerpedTarget`
- `Get MantleActualStartOffset`
- `Get MantleAnimatedStartOffset`
- `Get MantleLedgeLS`
- `Get MantleParams`
- `Get MantleTarget`
- `Get MantleTimeline`
- `Get PositionAlpha`
- `Get XYCorrectionAlpha`
- `Get ZCorrectionAlpha`
- `Set LerpedTarget`
- `Set MantleTarget`
- `Set PositionAlpha`
- `Set XYCorrectionAlpha`
- `Set ZCorrectionAlpha`

### 📌 Grafo: `MovementCrosshair`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetVelocity()`
- 🛠️ `VSize()`
- 🛠️ `MapRangeClamped()`

**Variáveis Manipuladas:**
- `Get HUD`
- `Get IsFiring`
- `Get WBCrosshair`
- `Set crosshair_spread`

### 📌 Grafo: `MultiTapInput`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `RetriggerableDelay()`
- 🛠️ `Less_IntInt()`

### 📌 Grafo: `On Begin Play`

**Comentários e Títulos de Seção Encontrados:**
- *"Make sure the mesh and animbp update after the CharacterBP to ensure it gets the most recent values."*
- *"Set Reference to the Main Anim Instance."*
- *"Update states to use the initial desired values."*
- *"Set default rotation values."*
- *"Set the Movement Model"*

**Funções e Métodos Chamados:**
- 🛠️ `OnRotationModeChanged()`
- 🛠️ `OnViewModeChanged()`
- 🛠️ `AddTickPrerequisiteActor()`
- 🛠️ `OnGaitChanged()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `Crouch()`
- 🛠️ `SetMovementModel()`
- 🛠️ `UnCrouch()`
- 🛠️ `OnOverlayStateChanged()`
- 🛠️ `K2_GetActorRotation()`

**Variáveis Manipuladas:**
- `Get DesiredGait`
- `Get DesiredRotationMode`
- `Get DesiredStance`
- `Get Mesh`
- `Get OverlayState`
- `Get ViewMode`
- `Set LastMovementInputRotation`
- `Set LastVelocityRotation`
- `Set MainAnimInstance`
- `Set TargetRotation`

### 📌 Grafo: `OnBeforeStartCustomMovement`

### 📌 Grafo: `OnCharacterMovementModeChanged`

**Comentários e Títulos de Seção Encontrados:**
- *"Use the Character Movement Mode changes to set the Movement States to the right values. This allows you to have a custom set of movement states but still use the functionality of the default character movement component."*

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Set_MovementState()`

### 📌 Grafo: `OnGaitChanged`

**Variáveis Manipuladas:**
- `Get Gait`
- `Get PreviousActualGait`

### 📌 Grafo: `OnMovementActionChanged`

**Comentários e Títulos de Seção Encontrados:**
- *"Make the character crouch if performing a roll."*
- *"Upon ending a roll, reset the stance back to its desired value."*

**Funções e Métodos Chamados:**
- 🛠️ `Crouch()`
- 🛠️ `UnCrouch()`

**Variáveis Manipuladas:**
- `Get DesiredStance`
- `Get MovementAction`
- `Get PreviousMovementAction`

### 📌 Grafo: `OnMovementStateChanged`

**Comentários e Títulos de Seção Encontrados:**
- *"If the character enters the air, set the In Air Rotation and uncrouch if crouched. If the character is currently rolling, enable the ragdoll."*
- *"Stop the Mantle Timeline if transitioning to the ragdoll state while mantling."*

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `RagdollStart()`
- 🛠️ `Stop()`
- 🛠️ `UnCrouch()`

**Variáveis Manipuladas:**
- `Get MantleTimeline`
- `Get MovementAction`
- `Get MovementState`
- `Get PreviousMovementState`
- `Get Stance`
- `Set InAirRotation`

### 📌 Grafo: `OnOverlayStateChanged`

**Variáveis Manipuladas:**
- `Get OverlayState`
- `Get PreviousOverlayState`

### 📌 Grafo: `OnRotationModeChanged`

**Comentários e Títulos de Seção Encontrados:**
- *"If the new rotation mode is Velocity Direction and the character is in First Person, set the viewmode to Third Person."*

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Set_ViewMode()`

**Variáveis Manipuladas:**
- `Get PreviousRotationMode`
- `Get RotationMode`
- `Get ViewMode`

### 📌 Grafo: `OnStanceChanged`

**Variáveis Manipuladas:**
- `Get PreviousStance`
- `Get Stance`

### 📌 Grafo: `OnViewModeChanged`

**Comentários e Títulos de Seção Encontrados:**
- *"If Third Person, set the rotation mode back to the desired mode."*
- *"If First Person, set the rotation mode to looking direction if currently in the velocity direction mode."*

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Set_RotationMode()`

**Variáveis Manipuladas:**
- `Get DesiredRotationMode`
- `Get PreviousViewMode`
- `Get RotationMode`
- `Get ViewMode`

### 📌 Grafo: `PlayerMovementInput`

**Comentários e Títulos de Seção Encontrados:**
- *"Default camera relative movement behavior"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AddMovementInput()`
- 🛠️ `GetControlForward/RightVector()`
- 🛠️ `AddCustomMovementInput_Up()`
- 🛠️ `AddCustomMovementInput_Right()`
- 🛠️ `ThrusterRotation()`
- 🛠️ `FixDiagonalGamepadValues()`
- 🛠️ `BreakVector2D()`

**Variáveis Manipuladas:**
- `Get CustomMovement`
- `Get Delta Seconds`
- `Get Interaction`
- `Get InteractionObject`
- `Get IsForwardAxis`
- `Get IsJetpack`
- `Get MovementState`

### 📌 Grafo: `RagdollEnd`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Save a snapshot of the current Ragdoll Pose for use in AnimGraph to blend out of the ragdoll"*
- *"Step 2: If the ragdoll is on the ground, set the movement mode to walking and play a Get Up animation. If not, set the movement mode to falling and update teh character movement velocity to match the last ragdoll velocity."*
- *"Step 3: Re-Enable capsule collision, and disable physics simulation on the mesh."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Montage_Play()`
- 🛠️ `SetMovementMode()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `GetGetUpAnimation()`
- 🛠️ `SavePoseSnapshot()`
- 🛠️ `SetAllBodiesSimulatePhysics()`
- 🛠️ `SetCollisionObjectType()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get LastRagdollVelocity`
- `Get MainAnimInstance`
- `Get Mesh`
- `Get RagdollFaceUp`
- `Get RagdollOnGround`
- `Set Velocity`

### 📌 Grafo: `RagdollStart`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Clear the Character Movement Mode and set teh Movement State to Ragdoll"*
- *"Step 2: Disable capsule collision and enable mesh physics simulation starting from the pelvis."*
- *"Step 3: Stop any active montages."*

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Set_MovementState()`
- 🛠️ `Montage_Stop()`
- 🛠️ `SetMovementMode()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `SetCollisionObjectType()`
- 🛠️ `SetAllBodiesBelowSimulatePhysics()`
- 🛠️ `MakeLiteralName()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get MainAnimInstance`
- `Get Mesh`

### 📌 Grafo: `RagdollUpdate`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the Last Ragdoll Velocity."*
- *"Use the Ragdoll Velocity to scale the ragdoll\'s joint strength for physical animation."*
- *"Disable Gravity if falling faster than -4000 to prevent continual acceleration. This also prevents the ragdoll from going through the floor."*
- *"Update the Actor location to follow the ragdoll."*

**Funções e Métodos Chamados:**
- 🛠️ `GetPhysicsLinearVelocity()`
- 🛠️ `SetAllMotorsAngularDriveParams()`
- 🛠️ `VSize()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `SetActorLocationDuringRagdoll()`
- 🛠️ `SetEnableGravity()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get LastRagdollVelocity`
- `Get Mesh`
- `Set LastRagdollVelocity`

### 📌 Grafo: `RangeSpawnPoint`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `Vector_Distance()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get DistanceIndex`
- `Get MinDistance`
- `Set DistanceIndex`
- `Set MinDistance`

### 📌 Grafo: `SetActorLocationAndRotation(UpdateTarget)`

**Comentários e Títulos de Seção Encontrados:**
- *"Update the Actors Location and Rotation as well as the Target Rotation variable to keep everything in sync."*

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetActorLocationAndRotation()`

**Variáveis Manipuladas:**
- `Set TargetRotation`

### 📌 Grafo: `SetActorLocationDuringRagdoll`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the pelvis as the target location."*
- *"Determine wether the ragdoll is facing up or down and set the target rotation accordingly."*
- *"Trace downward from the target location to offset the target location, preventing the lower half of the capsule from going through the floor when the ragdoll is laying on the ground."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketRotation()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `GetScaledCapsuleHalfHeight()`
- 🛠️ `SetActorLocationAndRotation(UpdateTarget)()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `Abs()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `MakeRotator()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `BreakHitResult()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get Mesh`
- `Get TargetRagdollLocation`
- `Get TargetRagdollRotation`
- `Set RagdollFaceUp`
- `Set RagdollOnGround`
- `Set TargetRagdollLocation`
- `Set TargetRagdollRotation`

### 📌 Grafo: `SetEssentialValues`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the amount of Acceleration."*
- *"Determine if the character is moving by getting it\'s speed. The Speed equals the length of the horizontal (x y) velocity, so it does not take vertical movement into account. If the character is moving, update the last velocity rotation. This value is saved because it might be useful to know the last orientation of movement even after the character has stopped."*
- *"Determine if the character has movement input by getting its movement input amount. The Movement Input Amount is equal to the current acceleration divided by the max acceleration so that it has a range of 0-1, 1 being the maximum possible amount of input, and 0 beiung none. If the character has movement input, update the Last Movement Input Rotation."*
- *"Set the Aim Yaw rate by comparing the current and previous Aim Yaw value, divided by Delta Seconds. This represents the speed the camera is rotating left to right. "*
- *"These values represent how the capsule is moving as well as how it wants to move, and therefore are essential for any data driven animation system. They are also used throughout the system for various functions, so I found it is easiest to manage them all in one place."*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `Abs()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `GetCurrentAcceleration()`
- 🛠️ `CalculateAcceleration()`
- 🛠️ `VSize()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `GetVelocity()`
- 🛠️ `GetControlRotation()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `GetMaxAcceleration()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakRotator()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get PreviousAimYaw`
- `Set Acceleration`
- `Set AimYawRate`
- `Set HasMovementInput`
- `Set IsMoving`
- `Set LastMovementInputRotation`
- `Set LastVelocityRotation`
- `Set MovementInputAmount`
- `Set Speed`

### 📌 Grafo: `SetMovementModel`

**Comentários e Títulos de Seção Encontrados:**
- *"Get movement data from the Movement Model Data table and set the Movement Data Struct. This allows you to easily switch out movement behaviors."*

**Variáveis Manipuladas:**
- `Get MovementModel`
- `Set MovementData`

### 📌 Grafo: `SmoothCharacterRotation`

**Comentários e Títulos de Seção Encontrados:**
- *"Interpolate the Target Rotation for extra smooth rotation behavior"*

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetActorRotation()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `RInterpTo_Constant()`
- 🛠️ `RInterpTo()`
- 🛠️ `K2_GetActorRotation()`

**Variáveis Manipuladas:**
- `Get ActorInterpSpeed(Smooth)`
- `Get Target`
- `Get TargetInterpSpeed(Const)`
- `Get TargetRotation`
- `Set TargetRotation`

### 📌 Grafo: `MovementSpread`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetVelocity()`
- 🛠️ `VSize()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `K2_SetTimer()`
- 🛠️ `K2_ClearAndInvalidateTimerHandle()`

### 📌 Grafo: `TickGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Check Movement Mode"*
- *"Sistema de hora do jogo"*
- *"Perform a mantle check if falling while movement input is pressed."*
- *"Do while in Ragdoll"*
- *"Do while In Air"*
- *"Do While On Ground"*
- *"Movimentar menu radial"*
- *"Do Every Frame"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetGameInstance()`
- 🛠️ `CacheValues()`
- 🛠️ `SetEssentialValues()`
- 🛠️ `UpdateInAirRotation()`
- 🛠️ `DrawDebugShapes()`
- 🛠️ `UpdateGroudedRotation()`
- 🛠️ `UpdateCharacterMovement()`
- 🛠️ `RagdollUpdate()`
- 🛠️ `RadialMenuControl()`
- 🛠️ `MantleCheck()`
- 🛠️ `GameTime()`

**Variáveis Manipuladas:**
- `Get Delta Seconds`
- `Get FallingTraceSettings`
- `Get HasMovementInput`
- `Get MovementState`
- `Get UMGInventory`
- `Get UMG_RadialMenu`
- `Get WeaponSystem`
- `Set Delta Seconds`

### 📌 Grafo: `UpdateCharacterMovement`

**Comentários e Títulos de Seção Encontrados:**
- *"Use the allowed gait to update the movement settings."*
- *"Set the Allowed Gait"*
- *"Determine the Actual Gait. If it is different from the current Gait, Set the new Gait Event."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Set_Gait()`
- 🛠️ `GetAllowedGait()`
- 🛠️ `GetActualGait()`
- 🛠️ `UpdateDynamicMovementSettings()`

**Variáveis Manipuladas:**
- `Get ActualGait`
- `Get AllowedGait`
- `Get Gait`
- `Set ActualGait`
- `Set AllowedGait`

### 📌 Grafo: `UpdateDynamicMovementSettings`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Get the Current Movement Settings."*
- *"Update the Character Max Walk Speed to the configured speeds based on the currently Allowed Gait."*
- *"Update the Acceleration, Deceleration, and Ground Friction using the Movement Curve. This allows for fine control over movement behavior at each speed (May not be suitable for replication)."*

**Funções e Métodos Chamados:**
- 🛠️ `GetTargetMovementSettings()`
- 🛠️ `GetMappedSpeed()`
- 🛠️ `GetVectorValue()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get AllowedGait`
- `Get CharacterMovement`
- `Get CurrentMovementSettings`
- `Set BrakingDecelerationWalking`
- `Set CurrentMovementSettings`
- `Set GroundFriction`
- `Set MaxAcceleration`
- `Set MaxWalkSpeed`
- `Set MaxWalkSpeedCrouched`

### 📌 Grafo: `UpdateGroudedRotation`

**Comentários e Títulos de Seção Encontrados:**
- *"Rolling Rotation"*
- *"Not Moving"*
- *"Apply the RotationAmount curve from Turn In Place Animations. The Rotation Amount curve defines how much rotation should be applied each frame, and is calculated for animations that are animated at 30fps. "*
- *"Velocity Direction Rotation"*
- *"Looking Direction Rotation"*
- *"Aiming Rotation"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CalculateGroundedRotationRate()`
- 🛠️ `SmoothCharacterRotation()`
- 🛠️ `CanUpdateMovingRotation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `K2_AddActorWorldRotation()`
- 🛠️ `GetControlRotation()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `LimitRotation()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `GetAnimCurveValue()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Abs()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get Gait`
- `Get HasMovementInput`
- `Get LastMovementInputRotation`
- `Get LastVelocityRotation`
- `Get MovementAction`
- `Get RotationMode`
- `Get ViewMode`
- `Set TargetRotation`

### 📌 Grafo: `UpdateInAirRotation`

**Comentários e Títulos de Seção Encontrados:**
- *"Aiming Rotation"*
- *"Velocity / Looking Direction Rotation"*

**Funções e Métodos Chamados:**
- 🛠️ `SmoothCharacterRotation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `GetControlRotation()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get InAirRotation`
- `Get RotationMode`
- `Set InAirRotation`

### 📌 Grafo: `UserConstructionScript`

**Variáveis Manipuladas:**
- `Get WeaponSystem`
- `Set CharacterReference`

### 📌 Grafo: `WeaponGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Criar hud"*
- *"Animação local do personagem"*
- *"Evento da arma para funcionar assim que iniciar o jogo"*
- *"Evento da Interface Set Animations"*
- *"Evento Set Wepon to Interact"*
- *"Atirar"*
- *"Recoil da arma"*
- *"Evento da interface para pegar munição"*

**Eventos de Entrada (Events):**
- 🟢 `AnimationOn`
- 🟢 `Fire`
- 🟢 `WeaponRecoil`
- 🟢 `AnimBP_SetAnimations`
- 🟢 `PC_SetHUD`
- 🟢 `WPN_CantShoot`
- 🟢 `WPN_SetWeaponToInteract`
- 🟢 `WPN_Recoil`
- 🟢 `AmmoPickup`
- 🟢 `CharBeginPlay`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AnimationOn()`
- 🛠️ `Fire()`
- 🛠️ `AddControllerPitchInput()`
- 🛠️ `AddControllerYawInput()`
- 🛠️ `SelectFloat()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `WeaponRecoil()`
- 🛠️ `AddAmmo()`
- 🛠️ `SpawnWeapons()`
- 🛠️ `PlayAnimation()`
- 🛠️ `AddToViewport()`
- 🛠️ `PickupWeapon()`

**Variáveis Manipuladas:**
- `Get CurrentWeapon`
- `Get InteractedWeapon`
- `Get Mesh`
- `Get ShowSniperScope`
- `Get WeaponSystem`
- `Set HUD`
- `Set InteractedWeapon`
- `Set IsFiring`

### 📌 Grafo: `ExecuteUbergraph_ALS_Base_CharacterBP`

**Comentários e Títulos de Seção Encontrados:**
- *"Event BeginPlay"*
- *"On Pawn Movement Mode Changed"*
- *"Movement Events"*
- *"State Events"*
- *"Crouch / UnCrouch"*
- *"State Changes"*
- *"On Landed: Temporarily increase the braking friction on lands to make landings more accurate, or trigger a breakfall roll."*
- *"On Jumped: Set the new In Air Rotation to the velocity rotation if speed is greater than 100."*
- *"Breakfall / Roll: Simply play a Root Motion Montage."*
- *"Mantle Timeline: This timeline is triggered from the MantleStart function and updates the function that lerps the character to the new location."*
- *"IMPORTANT!!!\r\n\r\nThis blueprint contains a lot of simple logic meant to be built on or replaced by more sophisticated systems on a Per Project basis. How you manage Movement, Movement actions, Gameplay Events, and Character States should all be determined by the specific needs of your project. \r\n\r\nThe most important thing is to make sure you are updating the correct Character Information in the interface to allow the AnimBP to function correctly."*
- *"These functions are a great place to perform logic based on the previous and new state, as they should be called whenever a state changes (as long as you use the Interface Event to change the state)."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*
- *"Spawn Blood Pool"*
- *"Atualizar o movimento customizado"*
- *"Definir velocidade ao subir/descer a escada"*
- *"Perform a mantle check if falling while movement input is pressed."*
- *"Do while in Ragdoll"*
- *"Do while In Air"*
- *"Do While On Ground"*
- *"Do Every Frame"*
- *"Check Movement Mode"*
- *"Movimentar menu radial"*
- *"Sistema de hora do jogo"*
- *"Evento Set Wepon to Interact"*
- *"Animação local do personagem"*
- *"Evento da Interface Set Animations"*
- *"Criar hud"*
- *"Atirar"*
- *"Recoil da arma"*
- *"Evento da interface para pegar munição"*
- *"Evento da arma para funcionar assim que iniciar o jogo"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `K2_OnStartCrouch`
- 🟢 `K2_OnEndCrouch`
- 🟢 `K2_OnMovementModeChanged`
- 🟢 `OnJumped`
- 🟢 `OnLanded`
- 🟢 `Breakfall Event`
- 🟢 `Roll Event`
- 🟢 `BPI_Set_MovementState`
- 🟢 `BPI_Set_MovementAction`
- 🟢 `BPI_Set_RotationMode`
- 🟢 `BPI_Set_Gait`
- 🟢 `BPI_Set_ViewMode`
- 🟢 `BPI_Set_OverlayState`
- 🟢 `SpawnBloodPool`
- 🟢 `K2_UpdateCustomMovement`
- 🟢 `BndEvt__ALS_Base_CharacterBP_CustomMovement_K2Node_ComponentBoundEvent_0_OnStartCustomMovement__DelegateSignature`
- 🟢 `BndEvt__ALS_Base_CharacterBP_CustomMovement_K2Node_ComponentBoundEvent_1_OnEndCustomMovement__DelegateSignature`
- 🟢 `SetLadderMoveSpeed`
- 🟢 `ReceiveTick`
- 🟢 `WPN_SetWeaponToInteract`
- 🟢 `AnimBP_SetAnimations`
- 🟢 `AnimationOn`
- 🟢 `PC_SetHUD`
- 🟢 `Fire`
- 🟢 `WPN_CantShoot`
- 🟢 `WeaponRecoil`
- 🟢 `WPN_Recoil`
- 🟢 `AmmoPickup`
- 🟢 `CharBeginPlay`
- 🟢 `IsJetpack`
- 🟢 `IsJumping`
- 🟢 `IsDead`
- 🟢 `Death`
- 🟢 `SetArmour`
- 🟢 `DamageAnimation`
- 🟢 `SetDamage`
- 🟢 `SetHealth`
- 🟢 `BloodPoolTime__UpdateFunc`
- 🟢 `BloodPoolTime__FinishedFunc`
- 🟢 `MantleTimeline__UpdateFunc`
- 🟢 `MantleTimeline__FinishedFunc`
- 🔀 Contém `22` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `RetriggerableDelay()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `Breakfall Event()`
- 🛠️ `MantleEnd()`
- 🛠️ `Montage_Play()`
- 🛠️ `BPI_Jumped()`
- 🛠️ `OnMovementStateChanged()`
- 🛠️ `OnRotationModeChanged()`
- 🛠️ `OnGaitChanged()`
- 🛠️ `OnViewModeChanged()`
- 🛠️ `OnOverlayStateChanged()`
- 🛠️ `OnCharacterMovementModeChanged()`
- 🛠️ `OnStanceChanged()`
- 🛠️ `OnMovementActionChanged()`
- 🛠️ `On Begin Play()`
- 🛠️ `GetRollAnimation()`
- 🛠️ `MantleUpdate()`
- 🛠️ `FallDamage()`
- 🛠️ `Sprint()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `BreakHitResult()`
- 🛠️ `SpawnDecalAtLocation()`
- 🛠️ `SetWorldScale3D()`
- 🛠️ `VLerp()`
- 🛠️ `SetFadeOut()`
- 🛠️ `UpdateCustomMovement()`
- 🛠️ `UpdateCharacterMovement()`
- 🛠️ `RagdollUpdate()`
- 🛠️ `SetEssentialValues()`
- 🛠️ `CacheValues()`
- 🛠️ `UpdateInAirRotation()`
- 🛠️ `UpdateGroudedRotation()`
- 🛠️ `DrawDebugShapes()`
- 🛠️ `MantleCheck()`
- 🛠️ `RadialMenuControl()`
- 🛠️ `GetGameInstance()`
- 🛠️ `GameTime()`
- 🛠️ `GetVelocity()`
- 🛠️ `VSize()`
- 🛠️ `K2_SetTimer()`
- 🛠️ `K2_ClearAndInvalidateTimerHandle()`
- 🛠️ `PickupWeapon()`
- 🛠️ `AnimationOn()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `PlayAnimation()`
- 🛠️ `AddToViewport()`
- 🛠️ `Fire()`
- 🛠️ `AddControllerPitchInput()`
- 🛠️ `AddControllerYawInput()`
- 🛠️ `SelectFloat()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `WeaponRecoil()`
- 🛠️ `AddAmmo()`
- 🛠️ `SpawnWeapons()`
- 🛠️ `NotEqual_ByteByte()`
- 🛠️ `IsValid()`
- 🛠️ `Add_VectorVector()`
- 🛠️ `Play()`

**Variáveis Manipuladas:**
- `Get BloodPoolTime`
- `Get BloodPoolTime_Alpha_B191D44B4982DD6FD4254DA64C2FD6FE`
- `Get BreakFall`
- `Get CharacterMovement`
- `Get CurrentWeapon`
- `Get CustomMovement`
- `Get Delta Seconds`
- `Get FallingTraceSettings`
- `Get Gait`
- `Get HUD`
- `Get HasMovementInput`
- `Get InteractedWeapon`
- `Get IsFiring`
- `Get LastVelocityRotation`
- `Get MainAnimInstance`
- `Get MantleTimeline_BlendIn_91D7A42A4A23268AEE2E28853DEE703D`
- `Get Mesh`
- `Get MovementAction`
- `Get MovementState`
- `Get OverlayState`
- `Get PlayerStatus`
- `Get RotationMode`
- `Get ShowSniperScope`
- `Get Speed`
- `Get UMGInventory`
- `Get UMG_RadialMenu`
- `Get ViewMode`
- `Get WeaponIsLocked`
- `Get WeaponSystem`
- `Set BrakingFrictionFactor`
- `Set Delta Seconds`
- `Set HUD`
- `Set InAirRotation`
- `Set InteractedWeapon`
- `Set IsFiring`
- `Set LadderMoveSpeed`

### 📌 Grafo: `SetLadderMoveSpeed`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `BndEvt__ALS_Base_CharacterBP_CustomMovement_K2Node_ComponentBoundEvent_1_OnEndCustomMovement__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `BndEvt__ALS_Base_CharacterBP_CustomMovement_K2Node_ComponentBoundEvent_0_OnStartCustomMovement__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `K2_UpdateCustomMovement`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `SpawnBloodPool`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `BPI_Set_OverlayState`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `BPI_Set_ViewMode`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `BPI_Set_Gait`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `BPI_Set_RotationMode`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `BPI_Set_MovementAction`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `BPI_Set_MovementState`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `Roll Event`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `Breakfall Event`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `OnLanded`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `OnJumped`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `K2_OnMovementModeChanged`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `K2_OnEndCrouch`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `K2_OnStartCrouch`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `SetHealth`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `CharBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `SetDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `AmmoPickup`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `WPN_Recoil`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `DamageAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `WeaponRecoil`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `WPN_CantShoot`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `SetArmour`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `Fire`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `Death`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `PC_SetHUD`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `IsDead`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `IsJumping`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `AnimationOn`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `AnimBP_SetAnimations`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `IsJetpack`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `WPN_SetWeaponToInteract`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `BloodPoolTime__UpdateFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `BloodPoolTime__FinishedFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `MantleTimeline__UpdateFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `MantleTimeline__FinishedFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_Base_CharacterBP()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Variáveis Manipuladas:**
- `Get WeaponSystem`
- `Set CharacterReference`

### 📌 Grafo: `PlayerMovementInput_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Default camera relative movement behavior"*
- 🔀 Contém `5` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetControlForward/RightVector()`
- 🛠️ `FixDiagonalGamepadValues()`
- 🛠️ `AddMovementInput()`
- 🛠️ `ThrusterRotation()`
- 🛠️ `AddCustomMovementInput_Up()`
- 🛠️ `AddCustomMovementInput_Right()`
- 🛠️ `IsValid()`
- 🛠️ `IsCustomMovement()`
- 🛠️ `Multiply_DoubleDouble()`
- 🛠️ `BreakVector2D()`
- 🛠️ `Conv_InputActionValueToAxis2D()`

**Variáveis Manipuladas:**
- `Get CustomMovement`
- `Get Delta Seconds`
- `Get Interaction`
- `Get InteractionObject`
- `Get IsForwardAxis`
- `Get IsJetpack`
- `Get MovementState`

### 📌 Grafo: `SetEssentialValues_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the amount of Acceleration."*
- *"Determine if the character is moving by getting it\'s speed. The Speed equals the length of the horizontal (x y) velocity, so it does not take vertical movement into account. If the character is moving, update the last velocity rotation. This value is saved because it might be useful to know the last orientation of movement even after the character has stopped."*
- *"Determine if the character has movement input by getting its movement input amount. The Movement Input Amount is equal to the current acceleration divided by the max acceleration so that it has a range of 0-1, 1 being the maximum possible amount of input, and 0 beiung none. If the character has movement input, update the Last Movement Input Rotation."*
- *"Set the Aim Yaw rate by comparing the current and previous Aim Yaw value, divided by Delta Seconds. This represents the speed the camera is rotating left to right. "*
- *"These values represent how the capsule is moving as well as how it wants to move, and therefore are essential for any data driven animation system. They are also used throughout the system for various functions, so I found it is easiest to manage them all in one place."*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `VSize()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `GetControlRotation()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Abs()`
- 🛠️ `GetCurrentAcceleration()`
- 🛠️ `GetMaxAcceleration()`
- 🛠️ `CalculateAcceleration()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `GetVelocity()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakRotator()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get HasMovementInput`
- `Get IsMoving`
- `Get MovementInputAmount`
- `Get PreviousAimYaw`
- `Get Speed`
- `Set Acceleration`
- `Set AimYawRate`
- `Set HasMovementInput`
- `Set IsMoving`
- `Set LastMovementInputRotation`
- `Set LastVelocityRotation`
- `Set MovementInputAmount`
- `Set Speed`

### 📌 Grafo: `CacheValues_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Cache certain values to be used in calculations on the next frame"*

**Funções e Métodos Chamados:**
- 🛠️ `GetControlRotation()`
- 🛠️ `GetVelocity()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Set PreviousAimYaw`
- `Set PreviousVelocity`

### 📌 Grafo: `UpdateGroudedRotation_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Rolling Rotation"*
- *"Not Moving"*
- *"Apply the RotationAmount curve from Turn In Place Animations. The Rotation Amount curve defines how much rotation should be applied each frame, and is calculated for animations that are animated at 30fps. "*
- *"Velocity Direction Rotation"*
- *"Looking Direction Rotation"*
- *"Aiming Rotation"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `LimitRotation()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `CalculateGroundedRotationRate()`
- 🛠️ `SmoothCharacterRotation()`
- 🛠️ `GetControlRotation()`
- 🛠️ `GetAnimCurveValue()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Abs()`
- 🛠️ `CanUpdateMovingRotation()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `K2_AddActorWorldRotation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get Gait`
- `Get HasMovementInput`
- `Get LastMovementInputRotation`
- `Get LastVelocityRotation`
- `Get MovementAction`
- `Get RotationMode`
- `Get ViewMode`
- `Set TargetRotation`

### 📌 Grafo: `UpdateInAirRotation_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Velocity / Looking Direction Rotation"*
- *"Aiming Rotation"*

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `SmoothCharacterRotation()`
- 🛠️ `GetControlRotation()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get InAirRotation`
- `Get RotationMode`
- `Set InAirRotation`

### 📌 Grafo: `SmoothCharacterRotation_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Interpolate the Target Rotation for extra smooth rotation behavior"*

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetActorRotation()`
- 🛠️ `RInterpTo_Constant()`
- 🛠️ `RInterpTo()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `GetWorldDeltaSeconds()`

**Variáveis Manipuladas:**
- `Get ActorInterpSpeed(Smooth)`
- `Get Target`
- `Get TargetInterpSpeed(Const)`
- `Get TargetRotation`
- `Set TargetRotation`

### 📌 Grafo: `SetMovementModel_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Get movement data from the Movement Model Data table and set the Movement Data Struct. This allows you to easily switch out movement behaviors."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetDataTableRowFromName()`

**Variáveis Manipuladas:**
- `Get MovementModel`
- `Set MovementData`

### 📌 Grafo: `UpdateCharacterMovement_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the Allowed Gait"*
- *"Determine the Actual Gait. If it is different from the current Gait, Set the new Gait Event."*
- *"Use the allowed gait to update the movement settings."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetAllowedGait()`
- 🛠️ `GetActualGait()`
- 🛠️ `UpdateDynamicMovementSettings()`
- 🛠️ `BPI_Set_Gait()`
- 🛠️ `NotEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get ActualGait`
- `Get AllowedGait`
- `Get Gait`
- `Set ActualGait`
- `Set AllowedGait`

### 📌 Grafo: `UpdateDynamicMovementSettings_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Get the Current Movement Settings."*
- *"Update the Character Max Walk Speed to the configured speeds based on the currently Allowed Gait."*
- *"Update the Acceleration, Deceleration, and Ground Friction using the Movement Curve. This allows for fine control over movement behavior at each speed (May not be suitable for replication)."*

**Funções e Métodos Chamados:**
- 🛠️ `GetVectorValue()`
- 🛠️ `GetTargetMovementSettings()`
- 🛠️ `GetMappedSpeed()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get AllowedGait`
- `Get CharacterMovement`
- `Get CurrentMovementSettings`
- `Get MaxWalkSpeed`
- `Set BrakingDecelerationWalking`
- `Set CurrentMovementSettings`
- `Set GroundFriction`
- `Set MaxAcceleration`
- `Set MaxWalkSpeed`
- `Set MaxWalkSpeedCrouched`

### 📌 Grafo: `GetTargetMovementSettings_MERGED`

**Variáveis Manipuladas:**
- `Get MovementData`
- `Get RotationMode`
- `Get Stance`

### 📌 Grafo: `GetAllowedGait_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Allowed Gait. This represents the maximum Gait the character is currently allowed to be in, and can be determined by the desired gait, the rotation mode, the stance, etc. For example, if you wanted to force the character into a walking state while indoors, this could be done here."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CanSprint()`

**Variáveis Manipuladas:**
- `Get DesiredGait`
- `Get RotationMode`
- `Get Stance`

### 📌 Grafo: `GetActualGait_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Get the Actual Gait. This is calculated by the actual movement of the character, and so it can be different from the desired gait or allowed gait. For instance, if the Allowed Gait becomes walking, the Actual gait will still be running untill the character decelerates to the walking speed."*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GreaterEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get AllowedGait`
- `Get CurrentMovementSettings`
- `Get LocalRunSpeed`
- `Get LocalWalkSpeed`
- `Get Speed`
- `Set LocalRunSpeed`
- `Set LocalSprintSpeed`
- `Set LocalWalkSpeed`

### 📌 Grafo: `CanSprint_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Determine if the character is currently able to sprint based on the Rotation mode and current acceleration (input) rotation. If the character is in the Looking Rotation mode, only allow sprinting if there is full movement input and it is faced forward relative to the camera + or - 50 degrees."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `GetCurrentAcceleration()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `GetControlRotation()`
- 🛠️ `Abs()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get HasMovementInput`
- `Get MovementInputAmount`
- `Get RotationMode`

### 📌 Grafo: `AddToCharacterRotation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_AddActorWorldRotation()`
- 🛠️ `ComposeRotators()`

**Variáveis Manipuladas:**
- `Get DeltaRotation`
- `Get TargetRotation`
- `Set TargetRotation`

### 📌 Grafo: `LimitRotation_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Prevent the character from rotating past a certain angle."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SmoothCharacterRotation()`
- 🛠️ `GetControlRotation()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `InRange_FloatFloat()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `SelectFloat()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get InterpSpeed`

### 📌 Grafo: `SetActorLocationAndRotation(UpdateTarget)_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Update the Actors Location and Rotation as well as the Target Rotation variable to keep everything in sync."*

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetActorLocationAndRotation()`

**Variáveis Manipuladas:**
- `Get TargetRotation`
- `Set TargetRotation`

### 📌 Grafo: `CalculateGroundedRotationRate_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the rotation rate by using the current Rotation Rate Curve in the Movement Settings. Using the curve in conjunction with the mapped speed gives you a high level of control over the rotation rates for each speed. Increase the speed if the camera is rotating quickly for more responsive rotation."*

**Funções e Métodos Chamados:**
- 🛠️ `MapRangeClamped()`
- 🛠️ `GetMappedSpeed()`
- 🛠️ `GetFloatValue()`

**Variáveis Manipuladas:**
- `Get AimYawRate`
- `Get CurrentMovementSettings`

### 📌 Grafo: `MantleCheck_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Trace forward to find a wall / object the character cannot walk on."*
- *"Step 2: Trace downward from the first trace\'s Impact Point and determine if the hit location is walkable."*
- *"Step 3: Check if the capsule has room to stand at the downward trace\'s location. If so, set that location as the Target Transform and calculate the mantle height."*
- *"Step 5: If everything checks out, start the Mantle"*
- *"Step 4: Determine the Mantle Type by checking the movement mode and Mantle Height."*
- 🔀 Contém `5` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CapsuleTraceSingle()`
- 🛠️ `SphereTraceSingle()`
- 🛠️ `MakeVector()`
- 🛠️ `IsWalkable()`
- 🛠️ `BreakHitResult()`
- 🛠️ `CapsuleHasRoomCheck()`
- 🛠️ `MakeTransform()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `GetPlayerMovementInput()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Not_PreBool()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `GetCalpsuleBaseLocation()`
- 🛠️ `GetCapsuleLocationFromBase()`
- 🛠️ `GetTraceDebugType()`
- 🛠️ `MantleStart()`
- 🛠️ `BreakTransform()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get CanJump`
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get DebugType`
- `Get DownTraceLocation`
- `Get HitComponent`
- `Get InitialTrace_ImpactPoint`
- `Get InitialTrace_Normal`
- `Get MantleHeight`
- `Get MantleType`
- `Get MovementState`
- `Get PlayerStatus`
- `Get TargetTransform`
- `Get Trace Settings`
- `Set DownTraceLocation`
- `Set HitComponent`
- `Set InitialTrace_ImpactPoint`
- `Set InitialTrace_Normal`
- `Set MantleHeight`
- `Set MantleType`
- `Set TargetTransform`

### 📌 Grafo: `GetPlayerMovementInput_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Normal()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetControlForward/RightVector()`
- 🛠️ `BreakVector2D()`
- 🛠️ `Conv_InputActionValueToAxis2D()`

### 📌 Grafo: `FixDiagonalGamepadValues_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `MapRangeClamped()`
- 🛠️ `Abs()`
- 🛠️ `FClamp()`

### 📌 Grafo: `DrawDebugShapes_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Velocity Arrow"*
- *"Movement Input Arrow"*
- *"Aiming Rotation Cone"*
- *"Capsule "*
- *"Get Debug Info from Player Controller"*
- *"Target Rotation Arrow"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `Vector_NormalUnsafe()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `GetScaledCapsuleRadius()`
- 🛠️ `GetScaledCapsuleHalfHeight()`
- 🛠️ `DrawDebugCapsule()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `GetControlRotation()`
- 🛠️ `DrawDebugConeInDegrees()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `GetMaxAcceleration()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `GetCurrentAcceleration()`
- 🛠️ `SelectColor()`
- 🛠️ `VSize()`
- 🛠️ `SelectVector()`
- 🛠️ `EqualEqual_VectorVector()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `DrawDebugArrow()`
- 🛠️ `BPI_Get_DebugInfo()`
- 🛠️ `GetVelocity()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get LastMovementInputRotation`
- `Get LastVelocityRotation`
- `Get MaxWalkSpeed`
- `Get Mesh`
- `Get TargetRotation`

### 📌 Grafo: `MantleStart_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 7: Play the Anim Montaget if valid."*
- *"Step 6: Configure the Mantle Timeline so that it is the same length as the Lerp/Correction curve minus the starting position, and plays at the same speed as the animation. Then start the timeline."*
- *"Step 5: Clear the Character Movement Mode and set the Movement State to Mantling"*
- *"Step 4: Calculate the Animated Start Offset from the Target Location. This would be the location the actual animation starts at relative to the Target Transform. "*
- *"Step 3: Set the Mantle Target and calculate the Starting Offset (offset amount between the actor and target transform)."*
- *"Step 2: Convert the world space target to the mantle component\'s local space for use in moving objects."*
- *"Step 1: Get the Mantle Asset and use it to set the new Mantle Params."*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `PlayFromStart()`
- 🛠️ `SetPlayRate()`
- 🛠️ `SetTimelineLength()`
- 🛠️ `SetMovementMode()`
- 🛠️ `MakeVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `GetTransform()`
- 🛠️ `GetTimeRange()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Montage_Play()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `GetMantleAsset()`
- 🛠️ `BPI_Set_MovementState()`
- 🛠️ `JumpStamina()`
- 🛠️ `MakeTransform()`
- 🛠️ `K2_GetComponentToWorld()`
- 🛠️ `InvertTransform()`
- 🛠️ `ComposeTransforms()`
- 🛠️ `IsValid()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`
- 🛠️ `BreakTransform()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get MainAnimInstance`
- `Get MantleAsset`
- `Get MantleHeight`
- `Get MantleLedgeWS`
- `Get MantleParams`
- `Get MantleTarget`
- `Get MantleTimeline`
- `Get MantleType`
- `Get PlayerStatus`
- `Set MantleActualStartOffset`
- `Set MantleAnimatedStartOffset`
- `Set MantleAsset`
- `Set MantleLedgeLS`
- `Set MantleParams`
- `Set MantleTarget`

### 📌 Grafo: `MantleEnd_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the Character Movement Mode to Walking"*

**Funções e Métodos Chamados:**
- 🛠️ `SetMovementMode()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`

### 📌 Grafo: `MantleUpdate_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 2: Update the Position and Correction Alphas using the Position/Correction curve set for each Mantle."*
- *"Step 3: Lerp multiple transforms together for independent control over the horizontal and vertical blend to the animated start position, as well as the target position."*
- *"Initial Blend In (controlled in the timeline curve) to allow the actor to blend into the Position/Correction curve at the midoint. This prevents pops when mantling an object lower than the animated mantle."*
- *"Blend from the currently blending transforms into the final mantle target using the X value of the Position/Correction Curve."*
- *"Blend into the animated horizontal and rotation offset using the Y value of the Position/Correction Curve."*
- *"Blend into the animated vertical offset using the Z value of the Position/Correction Curve."*
- *"Step 1: Continually update the mantle target from the stored local transform to follow along with moving objects."*
- *"Step 4: Set the actors location and rotation to the Lerped Target."*

**Funções e Métodos Chamados:**
- 🛠️ `TLerp()`
- 🛠️ `MakeTransform()`
- 🛠️ `GetVectorValue()`
- 🛠️ `GetPlaybackPosition()`
- 🛠️ `BreakVector()`
- 🛠️ `BreakTransform()`
- 🛠️ `SetActorLocationAndRotation(UpdateTarget)()`
- 🛠️ `K2_GetComponentToWorld()`
- 🛠️ `InvertTransform()`
- 🛠️ `InverseTransformLocation()`
- 🛠️ `InverseTransformRotation()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get BlendIn`
- `Get LerpedTarget`
- `Get MantleActualStartOffset`
- `Get MantleAnimatedStartOffset`
- `Get MantleLedgeLS`
- `Get MantleParams`
- `Get MantleTarget`
- `Get MantleTimeline`
- `Get PositionAlpha`
- `Get XYCorrectionAlpha`
- `Get ZCorrectionAlpha`
- `Set LerpedTarget`
- `Set MantleTarget`
- `Set PositionAlpha`
- `Set XYCorrectionAlpha`
- `Set ZCorrectionAlpha`

### 📌 Grafo: `CapsuleHasRoomCheck_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Perform a trace to see if the capsule has room to be at the target location."*

**Funções e Métodos Chamados:**
- 🛠️ `SphereTraceSingleByProfile()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `GetScaledCapsuleHalfHeight_WithoutHemisphere()`
- 🛠️ `BooleanNOR()`
- 🛠️ `GetTraceDebugType()`
- 🛠️ `BreakHitResult()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get Capsule`
- `Get CapsuleRadius`
- `Get DebugType`
- `Get HeightOffset`
- `Get RadiusOffset`
- `Get TargetLocation`

### 📌 Grafo: `GetMantleAsset_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Get the Default Mantle Asset values. These will be overriden in the AnimMan Child Character"*

### 📌 Grafo: `GetControlForward/RightVector_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetControlRotation()`
- 🛠️ `GetForwardVector()`
- 🛠️ `GetRightVector()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeRotator()`

### 📌 Grafo: `GetCalpsuleBaseLocation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetScaledCapsuleHalfHeight()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `GetUpVector()`
- 🛠️ `Multiply_VectorFloat()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get ZOffset`

### 📌 Grafo: `GetCapsuleLocationFromBase_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetScaledCapsuleHalfHeight()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get ZOffset`

### 📌 Grafo: `CalculateAcceleration_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Acceleration by comparing the current and previous velocity. The Current Acceleration returned by the movement component equals the input acceleration, and does not represent the actual physical accelration of the character."*

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `GetVelocity()`

**Variáveis Manipuladas:**
- `Get PreviousVelocity`

### 📌 Grafo: `RagdollStart_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Clear the Character Movement Mode and set teh Movement State to Ragdoll"*
- *"Step 2: Disable capsule collision and enable mesh physics simulation starting from the pelvis."*
- *"Step 3: Stop any active montages."*

**Funções e Métodos Chamados:**
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `SetCollisionObjectType()`
- 🛠️ `SetAllBodiesBelowSimulatePhysics()`
- 🛠️ `MakeLiteralName()`
- 🛠️ `SetMovementMode()`
- 🛠️ `BPI_Set_MovementState()`
- 🛠️ `Montage_Stop()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get MainAnimInstance`
- `Get Mesh`

### 📌 Grafo: `RagdollEnd_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Save a snapshot of the current Ragdoll Pose for use in AnimGraph to blend out of the ragdoll"*
- *"Step 2: If the ragdoll is on the ground, set the movement mode to walking and play a Get Up animation. If not, set the movement mode to falling and update teh character movement velocity to match the last ragdoll velocity."*
- *"Step 3: Re-Enable capsule collision, and disable physics simulation on the mesh."*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetMovementMode()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `SetCollisionObjectType()`
- 🛠️ `SetAllBodiesSimulatePhysics()`
- 🛠️ `SavePoseSnapshot()`
- 🛠️ `Montage_Play()`
- 🛠️ `GetGetUpAnimation()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get LastRagdollVelocity`
- `Get MainAnimInstance`
- `Get Mesh`
- `Get RagdollFaceUp`
- `Get RagdollOnGround`
- `Set Velocity`

### 📌 Grafo: `RagdollUpdate_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the Last Ragdoll Velocity."*
- *"Use the Ragdoll Velocity to scale the ragdoll\'s joint strength for physical animation."*
- *"Disable Gravity if falling faster than -4000 to prevent continual acceleration. This also prevents the ragdoll from going through the floor."*
- *"Update the Actor location to follow the ragdoll."*

**Funções e Métodos Chamados:**
- 🛠️ `SetEnableGravity()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `SetAllMotorsAngularDriveParams()`
- 🛠️ `VSize()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `SetActorLocationDuringRagdoll()`
- 🛠️ `GetPhysicsLinearVelocity()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get LastRagdollVelocity`
- `Get Mesh`
- `Set LastRagdollVelocity`

### 📌 Grafo: `SetActorLocationDuringRagdoll_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the pelvis as the target location."*
- *"Determine wether the ragdoll is facing up or down and set the target rotation accordingly."*
- *"Trace downward from the target location to offset the target location, preventing the lower half of the capsule from going through the floor when the ragdoll is laying on the ground."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `LineTraceSingle()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `GetScaledCapsuleHalfHeight()`
- 🛠️ `Abs()`
- 🛠️ `MakeRotator()`
- 🛠️ `SetActorLocationAndRotation(UpdateTarget)()`
- 🛠️ `GetSocketRotation()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `BreakHitResult()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get Mesh`
- `Get RagdollFaceUp`
- `Get RagdollOnGround`
- `Get TargetRagdollLocation`
- `Get TargetRagdollRotation`
- `Set RagdollFaceUp`
- `Set RagdollOnGround`
- `Set TargetRagdollLocation`
- `Set TargetRagdollRotation`

### 📌 Grafo: `GetTraceDebugType_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`
- 🛠️ `BPI_Get_DebugInfo()`

### 📌 Grafo: `GetAnimCurveValue_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get CurveName`
- `Get MainAnimInstance`

### 📌 Grafo: `On Begin Play_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Make sure the mesh and animbp update after the CharacterBP to ensure it gets the most recent values."*
- *"Set Reference to the Main Anim Instance."*
- *"Update states to use the initial desired values."*
- *"Set default rotation values."*
- *"Set the Movement Model"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AddTickPrerequisiteActor()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `OnRotationModeChanged()`
- 🛠️ `OnViewModeChanged()`
- 🛠️ `SetMovementModel()`
- 🛠️ `OnGaitChanged()`
- 🛠️ `Crouch()`
- 🛠️ `UnCrouch()`
- 🛠️ `OnOverlayStateChanged()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get DesiredGait`
- `Get DesiredRotationMode`
- `Get DesiredStance`
- `Get Mesh`
- `Get OverlayState`
- `Get ViewMode`
- `Set LastMovementInputRotation`
- `Set LastVelocityRotation`
- `Set MainAnimInstance`
- `Set TargetRotation`

### 📌 Grafo: `OnCharacterMovementModeChanged_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Use the Character Movement Mode changes to set the Movement States to the right values. This allows you to have a custom set of movement states but still use the functionality of the default character movement component."*

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Set_MovementState()`

### 📌 Grafo: `OnMovementStateChanged_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Stop the Mantle Timeline if transitioning to the ragdoll state while mantling."*
- *"If the character enters the air, set the In Air Rotation and uncrouch if crouched. If the character is currently rolling, enable the ragdoll."*

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `UnCrouch()`
- 🛠️ `RagdollStart()`
- 🛠️ `Stop()`

**Variáveis Manipuladas:**
- `Get MantleTimeline`
- `Get MovementAction`
- `Get MovementState`
- `Get PreviousMovementState`
- `Get Stance`
- `Set InAirRotation`
- `Set PreviousMovementState`

### 📌 Grafo: `OnMovementActionChanged_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Make the character crouch if performing a roll."*
- *"Upon ending a roll, reset the stance back to its desired value."*

**Funções e Métodos Chamados:**
- 🛠️ `Crouch()`
- 🛠️ `UnCrouch()`

**Variáveis Manipuladas:**
- `Get DesiredStance`
- `Get MovementAction`
- `Get PreviousMovementAction`
- `Set PreviousMovementAction`

### 📌 Grafo: `OnStanceChanged_MERGED`

**Variáveis Manipuladas:**
- `Get PreviousStance`
- `Get Stance`
- `Set PreviousStance`

### 📌 Grafo: `OnRotationModeChanged_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"If the new rotation mode is Velocity Direction and the character is in First Person, set the viewmode to Third Person."*

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Set_ViewMode()`

**Variáveis Manipuladas:**
- `Get PreviousRotationMode`
- `Get RotationMode`
- `Get ViewMode`
- `Set PreviousRotationMode`

### 📌 Grafo: `OnGaitChanged_MERGED`

**Variáveis Manipuladas:**
- `Get Gait`
- `Get PreviousActualGait`
- `Set PreviousActualGait`

### 📌 Grafo: `OnViewModeChanged_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"If Third Person, set the rotation mode back to the desired mode."*
- *"If First Person, set the rotation mode to looking direction if currently in the velocity direction mode."*

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Set_RotationMode()`

**Variáveis Manipuladas:**
- `Get DesiredRotationMode`
- `Get PreviousViewMode`
- `Get RotationMode`
- `Get ViewMode`
- `Set PreviousViewMode`

### 📌 Grafo: `OnOverlayStateChanged_MERGED`

**Variáveis Manipuladas:**
- `Get OverlayState`
- `Get PreviousOverlayState`
- `Set PreviousOverlayState`

### 📌 Grafo: `CanUpdateMovingRotation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `HasAnyRootMotion()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get HasMovementInput`
- `Get IsMoving`
- `Get Speed`

### 📌 Grafo: `GetMappedSpeed_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Map the character\'s current speed to the configured movement speeds with a range of 0-3, with 0 = stopped, 1 = the Walk Speed, 2 = the Run Speed, and 3 = the Sprint Speed. This allows you to vary the movement speeds but still use the mapped range in calculations for consistent results."*

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `MapRangeClamped()`

**Variáveis Manipuladas:**
- `Get CurrentMovementSettings`
- `Get LocRunSpeed`
- `Get LocSprintSpeed`
- `Get LocWalkSpeed`
- `Get Speed`
- `Set LocRunSpeed`
- `Set LocSprintSpeed`
- `Set LocWalkSpeed`

### 📌 Grafo: `GetRollAnimation_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"This gets overriden in the AnimMan Child character to select the appropriate animation based on the overlay state."*

### 📌 Grafo: `GetGetUpAnimation_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"This gets overriden in the AnimMan Child character to select the appropriate animation based on the overlay state."*

### 📌 Grafo: `RangeSpawnPoint_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `Vector_Distance()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get DistanceIndex`
- `Get MinDistance`
- `Set DistanceIndex`
- `Set MinDistance`

### 📌 Grafo: `MovementCrosshair_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetVelocity()`
- 🛠️ `VSize()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get HUD`
- `Get IsFiring`
- `Get WBCrosshair`
- `Set crosshair_spread`

### 📌 Grafo: `CalculateSpeedLadder_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetLadderMoveSpeed()`
- 🛠️ `PrintString()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `IsCustomMovement()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `BreakVector2D()`
- 🛠️ `Conv_InputActionValueToAxis2D()`

**Variáveis Manipuladas:**
- `Get CustomMovement`

### 📌 Grafo: `BPI_Get_CurrentStates_MERGED`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get Gait`
- `Get MovementAction`
- `Get MovementMode`
- `Get MovementState`
- `Get OverlayState`
- `Get PrevMovementState`
- `Get RotationMode`
- `Get Stance`
- `Get ViewMode`

### 📌 Grafo: `BPI_Get_EssentialValues_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetControlRotation()`
- 🛠️ `GetCurrentAcceleration()`
- 🛠️ `GetVelocity()`

**Variáveis Manipuladas:**
- `Get Acceleration`
- `Get AimYawRate`
- `Get CharacterMovement`
- `Get HasMovementInput`
- `Get IsMoving`
- `Get MovementInputAmount`
- `Get Speed`

### 📌 Grafo: `BPI_Get_FP_CameraTarget_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketLocation()`

**Variáveis Manipuladas:**
- `Get Mesh`

### 📌 Grafo: `BPI_Get_3P_PivotTarget_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetTransform()`

### 📌 Grafo: `BPI_Get_3P_TraceParams_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`

### 📌 Grafo: `BPI_Get_CameraParameters_MERGED`

**Variáveis Manipuladas:**
- `Get FirstPersonFOV`
- `Get RightShoulder`
- `Get ThirdPersonFOV`

### 📌 Grafo: `GetCharacterDead_MERGED`

**Variáveis Manipuladas:**
- `Get Dead`

### 📌 Grafo: `GetChar_Mesh_MERGED`

**Variáveis Manipuladas:**
- `Get Mesh`

### 📌 Grafo: `GetChar_CurrentWeapon_MERGED`

**Variáveis Manipuladas:**
- `Get CurrentWeapon`
- `Get WeaponSystem`

### 📌 Grafo: `GetChar_WpnSystemValid_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get WeaponSystem`

### 📌 Grafo: `GetChar_WeaponSystem_MERGED`

**Variáveis Manipuladas:**
- `Get WeaponSystem`

### 📌 Grafo: `GetHUD_MERGED`

**Variáveis Manipuladas:**
- `Get HUD`

### 📌 Grafo: `GetComponents_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`

**Variáveis Manipuladas:**
- `Get HUD`
- `Get Interaction`
- `Get PlayerStatus`
- `Get WeaponSystem`

### 📌 Grafo: `OnBeforeStartCustomMovement_MERGED`

### 📌 Grafo: `CanEnteringCustomMovement_MERGED`

### 📌 Grafo: `GetCustomMovement_MERGED`

**Variáveis Manipuladas:**
- `Get CustomMovement`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `ALS_Base_CharacterBP`?
- Quais variáveis estão disponíveis no Blueprint `ALS_Base_CharacterBP`?
- Quais funções e eventos são chamados no grafo do `ALS_Base_CharacterBP`?