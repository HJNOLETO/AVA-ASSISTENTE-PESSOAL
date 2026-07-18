# 🎮 Blueprint: ALS_AnimBP

**[Classe Pai / Parent Class: `AnimInstance`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `AimingRotation` | `struct (Rotator)` |
| `Velocity` | `struct (Vector)` |
| `RelativeVelocityDirection` | `struct (Vector)` |
| `Acceleration` | `struct (Vector)` |
| `MovementInput` | `struct (Vector)` |
| `IsMoving` | `bool` |
| `HasMovementInput` | `bool` |
| `Speed` | `real (double)` |
| `MovementInputAmount` | `real (double)` |
| `GroundedEntryState` | `byte (GroundedEntryState)` |
| `MovementDirection` | `byte (MovementDirection)` |
| `TrackedHipsDirection` | `byte (HipsDirection)` |
| `RelativeAccelerationAmount` | `struct (Vector)` |
| `ShouldMove` | `bool` |
| `Rotate_L` | `bool` |
| `Rotate_R` | `bool` |
| `Pivot` | `bool` |
| `RotateRate` | `real (double)` |
| `RotationScale` | `real (double)` |
| `DiagonalScaleAmount` | `real (double)` |
| `WalkRunBlend` | `real (double)` |
| `StandingPlayRate` | `real (double)` |
| `CrouchingPlayRate` | `real (double)` |
| `StrideBlend` | `real (double)` |
| `VelocityBlend` | `struct (VelocityBlend)` |
| `LeanAmount` | `struct (LeanAmount)` |
| `DiagonalScaleAmountCurve` | `object (CurveFloat)` |
| `StrideBlend_N_Walk` | `object (CurveFloat)` |
| `StrideBlend_N_Run` | `object (CurveFloat)` |
| `StrideBlend_C_Walk` | `object (CurveFloat)` |
| `SmoothedAimingRotation` | `struct (Rotator)` |
| `SpineRotation` | `struct (Rotator)` |
| `AimingAngle` | `struct (Vector2D)` |
| `SmoothedAimingAngle` | `struct (Vector2D)` |
| `AimSweepTime` | `real (double)` |
| `AimYawRate` | `real (double)` |
| `ZoomAmount` | `real (double)` |
| `Jumped` | `bool` |
| `JumpPlayRate` | `real (double)` |
| `FallSpeed` | `real (double)` |
| `LandPrediction` | `real (double)` |
| `LandPredictionCurve` | `object (CurveFloat)` |
| `LeanInAirCurve` | `object (CurveFloat)` |
| `OverlayOverrideState` | `int` |
| `Enable_AimOffset` | `real (double)` |
| `FootLock_L_Alpha` | `real (double)` |
| `FootLock_R_Alpha` | `real (double)` |
| `FootLock_L_Location` | `struct (Vector)` |
| `FootLock_R_Location` | `struct (Vector)` |
| `FootLock_L_Rotation` | `struct (Rotator)` |
| `FootLock_R_Rotation` | `struct (Rotator)` |
| `FootOffset_L_Location` | `struct (Vector)` |
| `FootOffset_R_Location` | `struct (Vector)` |
| `FootOffset_L_Rotation` | `struct (Rotator)` |
| `FootOffset_R_Rotation` | `struct (Rotator)` |
| `PelvisOffset` | `struct (Vector)` |
| `PelvisAlpha` | `real (double)` |
| `Character` | `object (Character)` |
| `DeltaTimeX` | `real (double)` |
| `TurnCheckMinAngle` | `real (double)` |
| `Turn180Threshold` | `real (double)` |
| `AimYawRateLimit` | `real (double)` |
| `ElapsedDelayTime` | `real (double)` |
| `MovementState` | `byte (ALS_MovementState)` |
| `PrevMovementState` | `byte (ALS_MovementState)` |
| `MovementAction` | `byte (ALS_MovementAction)` |
| `RotationMode` | `byte (ALS_RotationMode)` |
| `Gait` | `byte (ALS_Gait)` |
| `Stance` | `byte (ALS_Stance)` |
| `ViewMode` | `byte (ALS_ViewMode)` |
| `OverlayState` | `byte (ALS_OverlayState)` |
| `BasePose_N` | `real (double)` |
| `BasePose_CLF` | `real (double)` |
| `Arm_L` | `real (double)` |
| `Arm_L_Add` | `real (double)` |
| `Arm_L_LS` | `real (double)` |
| `Arm_L_MS` | `real (double)` |
| `Arm_R` | `real (double)` |
| `Arm_R_Add` | `real (double)` |
| `Arm_R_LS` | `real (double)` |
| `Arm_R_MS` | `real (double)` |
| `Hand_L` | `real (double)` |
| `Hand_R` | `real (double)` |
| `Legs` | `real (double)` |
| `Legs_Add` | `real (double)` |
| `Pelvis` | `real (double)` |
| `Pelvis_Add` | `real (double)` |
| `Spine` | `real (double)` |
| `Spine_Add` | `real (double)` |
| `Head` | `real (double)` |
| `Head_Add` | `real (double)` |
| `YawOffset_FB` | `object (CurveVector)` |
| `YawOffset_LR` | `object (CurveVector)` |
| `FYaw` | `real (double)` |
| `BYaw` | `real (double)` |
| `LYaw` | `real (double)` |
| `RYaw` | `real (double)` |
| `InputYawOffsetTime` | `real (double)` |
| `ForwardYawTime` | `real (double)` |
| `LeftYawTime` | `real (double)` |
| `RightYawTime` | `real (double)` |
| `MinAngleDelay` | `real (double)` |
| `MaxAngleDelay` | `real (double)` |
| `RotateMinThreshold` | `real (double)` |
| `RotateMaxThreshold` | `real (double)` |
| `N_TurnIP_L90` | `struct (TurnInPlace_Asset)` |
| `N_TurnIP_R90` | `struct (TurnInPlace_Asset)` |
| `N_TurnIP_L180` | `struct (TurnInPlace_Asset)` |
| `N_TurnIP_R180` | `struct (TurnInPlace_Asset)` |
| `AimYawRateMinRange` | `real (double)` |
| `AimYawRateMaxRange` | `real (double)` |
| `MinPlayRate` | `real (double)` |
| `MaxPlayRate` | `real (double)` |
| `CLF_TurnIP_L90` | `struct (TurnInPlace_Asset)` |
| `CLF_TurnIP_R90` | `struct (TurnInPlace_Asset)` |
| `CLF_TurnIP_L180` | `struct (TurnInPlace_Asset)` |
| `CLF_TurnIP_R180` | `struct (TurnInPlace_Asset)` |
| `FlailRate` | `real (double)` |
| `Enable_HandIK_L` | `real (double)` |
| `Enable_HandIK_R` | `real (double)` |
| `AnimatedWalkSpeed` | `real (double)` |
| `AnimatedRunSpeed` | `real (double)` |
| `AnimatedSprintSpeed` | `real (double)` |
| `AnimatedCrouchSpeed` | `real (double)` |
| `VelocityBlendInterpSpeed` | `real (double)` |
| `GroundedLeanInterpSpeed` | `real (double)` |
| `InAirLeanInterpSpeed` | `real (double)` |
| `SmoothedAimingRotationInterpSpeed` | `real (double)` |
| `InputYawOffsetInterpSpeed` | `real (double)` |
| `TriggerPivotSpeedLimit` | `real (double)` |
| `FootHeight` | `real (double)` |
| `IK_TraceDistanceAboveFoot` | `real (double)` |
| `IK_TraceDistanceBelowFoot` | `real (double)` |
| `Damage Anim` | `bool` |
| `Dead` | `bool` |
| `HasWeapon` | `bool` |
| `Weapon Type` | `byte (E_WeaponType)` |
| `IKLeft Hand` | `struct (Vector)` |
| `Is Shooting` | `bool` |
| `Is on Fire Rate Delay` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `UpdateRotationValues`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the Movement Direction"*
- *"Set the Yaw Offsets. These values influence the \"*

**Funções e Métodos Chamados:**
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `GetVectorValue()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `CalculateMovementDirection()`
- 🛠️ `GetControlRotation()`
- 🛠️ `BreakVector()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get Velocity`
- `Get YawOffset_FB`
- `Get YawOffset_LR`
- `Set BYaw`
- `Set FYaw`
- `Set LYaw`
- `Set MovementDirection`
- `Set RYaw`

### 📌 Grafo: `CalculateRelativeAccelerationAmount`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Relative Acceleration Amount. This value represents the current amount of acceleration / deceleration relative to the actor rotation. It is normalized to a range of -1 to 1 so that -1 equals the Max Braking Deceleration, and 1 equals the Max Acceleration of the Character Movement Component."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Vector_ClampSizeMax()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `LessLess_VectorRotator()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `GetMaxBrakingDeceleration()`
- 🛠️ `GetMaxAcceleration()`

**Variáveis Manipuladas:**
- `Get Acceleration`
- `Get Character`
- `Get CharacterMovement`
- `Get Velocity`

### 📌 Grafo: `AnimGraphNode_StateMachine_6`

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `EqualEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get RotateRate`
- `Get Rotate_L`
- `Get ShouldMove`

### 📌 Grafo: `AnimGraphNode_StateMachine_0`

**Comentários e Títulos de Seção Encontrados:**
- *"Only apply the new foot location on the right leg."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*
- *"Secondary Motion"*
- *"This State Machine applies additive detail animations onto the locomotion cycles depending on how the character is moving."*
- *"Standing Poses"*
- *"Idle Pose"*
- *"These poses are parts of the locomotion cycles where the Right foot IS fully planted down."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*
- *"Crouched Aim Sweep"*
- *"Additive stopping transitions are triggered via the \"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walking Pose"*
- *"Running Poses"*
- *"Sprinting Poses"*
- *"If the character stops while a foot is planted down, lock the correct foot."*
- *"If the character stops while a foot is NOT planted down, play a section of the cycle where the foot IS down, and lock it."*
- *"The \'Feet_Position\' curve also determines which foot is planted (or about to plant). Positive values mean the right foot is planted, negative values mean the left."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*
- *"Choose whether a foot is planted or about to plant when stopping using the \'Feet_Position\' anim curve. A value <.5 means the foot is planted, and a value >.5 means the foot is still in the air."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*
- *"Standing Poses"*

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `Abs()`

**Variáveis Manipuladas:**
- `Get AimSweepTime`
- `Get BasePose_CLF`
- `Get BasePose_N`
- `Get JumpPlayRate`
- `Get TrackedHipsDirection`
- `Get VelocityBlend`

### 📌 Grafo: `AnimGraphNode_StateMachine_2`

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `EqualEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get HasMovementInput`
- `Get InputYawOffsetTime`
- `Get RotateRate`
- `Get Rotate_L`
- `Get Rotate_R`
- `Get RotationScale`
- `Get ShouldMove`

### 📌 Grafo: `AnimationTransitionGraph_0`

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `EqualEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Gait`
- `Get RotationMode`

### 📌 Grafo: `AnimGraphNode_StateMachine_1`

**Comentários e Títulos de Seção Encontrados:**
- *"Walk / Run Locomotion Cycles"*
- *"Sprinting Cycles"*
- *"Blend all Locomotion Cycles together"*
- *"Apply Leaning Additive to only the Run and Sprint animations by using the Weight_Gait curve as an alpha."*
- *"Apply Diagonal Scaling"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*
- *"Crouching Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*
- *"In Air Poses"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walking Pose"*
- *"Running Poses"*
- *"Sprinting Poses"*
- *"Standing Poses"*
- *"Crouched Pose"*
- *"Standing Poses"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakVector()`
- 🛠️ `Abs()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `GetCurveValue()`

**Variáveis Manipuladas:**
- `Get AimSweepTime`
- `Get BasePose_CLF`
- `Get BasePose_N`
- `Get DiagonalScaleAmount`
- `Get Is Shooting`
- `Get LeanAmount`
- `Get RelativeAccelerationAmount`
- `Get StandingPlayRate`
- `Get StrideBlend`
- `Get VelocityBlend`
- `Get WalkRunBlend`

### 📌 Grafo: `AnimGraphNode_StateMachine_11`

**Comentários e Títulos de Seção Encontrados:**
- *"The blank entry node is used to pick a stance on entry (based on the most weighted BasePose anim curve). It also uses the Grounded Entry State enum to enter an entry override state to transition from other actions, such as rolling."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get MovementAction`
- `Get Rotate_L`
- `Get Rotate_R`

### 📌 Grafo: `AnimGraphNode_StateMachine_4`

**Comentários e Títulos de Seção Encontrados:**
- *"Apply Leaning Additive"*
- *"Crouch Walk Locomotion Cycles"*
- *"Blend all Locomotion Cycles together"*
- *"Slow movement pose"*
- *"Apply Diagonal Scaling"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakVector2D()`
- 🛠️ `InRange_FloatFloat()`
- 🛠️ `NotEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get CrouchingPlayRate`
- `Get DiagonalScaleAmount`
- `Get ForwardYawTime`
- `Get LeanAmount`
- `Get LeftYawTime`
- `Get RightYawTime`
- `Get SmoothedAimingAngle`
- `Get StrideBlend`

### 📌 Grafo: `AnimGraphNode_StateMachine_9`

**Comentários e Títulos de Seção Encontrados:**
- *"On Ground States"*
- *"Other Movement States such as flying, swimming, or climbing can go here, and can transition via the Movement State conduit"*
- *"In Air States"*

**Funções e Métodos Chamados:**
- 🛠️ `Abs()`

**Variáveis Manipuladas:**
- `Get FallSpeed`
- `Get LandPrediction`
- `Get LeanAmount`
- `Get Rotate_L`
- `Get Rotate_R`
- `Get Speed`

### 📌 Grafo: `AnimGraphNode_StateMachine_5`

**Comentários e Títulos de Seção Encontrados:**
- *"Mantle 1M Pose"*
- *"Get Up Pose"*
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Idle Pose"*
- *"Standing Poses"*
- *"Walk / Run / Sprint Pose"*
- *"Land Roll Pose"*
- *"Mantle 1M Pose"*
- *"Get Up Pose"*
- *"Pistol 2H States"*
- *"Crouched Pose"*
- *"Get Up Pose"*
- *"Land Roll Pose"*
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Idle Pose"*
- *"Walk / Run / Sprint Pose"*
- *"Land Roll Pose"*

**Variáveis Manipuladas:**
- `Get AimSweepTime`
- `Get BasePose_CLF`
- `Get BasePose_N`
- `Get LandPrediction`
- `Get OverlayOverrideState`

### 📌 Grafo: `AnimationTransitionGraph_1`

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `GetCurveValue()`
- 🛠️ `EqualEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get MovementState`
- `Get RotationMode`

### 📌 Grafo: `InterpVelocityBlend`

**Funções e Métodos Chamados:**
- 🛠️ `FInterpTo()`

**Variáveis Manipuladas:**
- `Get Current`
- `Get DeltaTime`
- `Get InterpSpeed`
- `Get Target`

### 📌 Grafo: `InterpLeanAmount`

**Funções e Métodos Chamados:**
- 🛠️ `FInterpTo()`

**Variáveis Manipuladas:**
- `Get Current`
- `Get DeltaTime`
- `Get InterpSpeed`
- `Get Target`

### 📌 Grafo: `UpdateFootIK`

**Comentários e Títulos de Seção Encontrados:**
- *"Update Foot Locking values."*
- *"Update all Foot Lock and Foot Offset values when not In Air"*
- *"Reset IK Offsets if In Air"*

**Funções e Métodos Chamados:**
- 🛠️ `SetFootLocking()`
- 🛠️ `SetPelvisIKOffset()`
- 🛠️ `SetFootOffsets()`
- 🛠️ `ResetIKOffsets()`

**Variáveis Manipuladas:**
- `Get FootLock_L_Alpha`
- `Get FootLock_L_Location`
- `Get FootLock_L_Rotation`
- `Get FootLock_R_Alpha`
- `Get FootLock_R_Location`
- `Get FootLock_R_Rotation`
- `Get FootOffset_L_Location`
- `Get FootOffset_L_Rotation`
- `Get FootOffset_L_Target`
- `Get FootOffset_R_Location`
- `Get FootOffset_R_Rotation`
- `Get FootOffset_R_Target`
- `Get MovementState`

### 📌 Grafo: `AngleInRange`

**Funções e Métodos Chamados:**
- 🛠️ `InRange_FloatFloat()`
- 🛠️ `Subtract_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Angle`
- `Get Buffer`
- `Get IncreaseBuffer`
- `Get MaxAngle`
- `Get MinAngle`

### 📌 Grafo: `CalculateQuadrant`

**Comentários e Títulos de Seção Encontrados:**
- *"Take the input angle and determine its quadrant (direction). Use the current Movement Direction to increase or decrease the buffers on the angle ranges for each quadrant."*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AngleInRange()`

**Variáveis Manipuladas:**
- `Get Angle`
- `Get BL-Threshold`
- `Get BR-Threshold`
- `Get Buffer`
- `Get Current`
- `Get FL-Threshold`
- `Get FR-Threshold`

### 📌 Grafo: `TurnInPlace`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Set Turn Angle"*
- *"Step 2: Choose Turn Asset based on the Turn Angle and Stance"*
- *"Step 3: If the Target Turn Animation is not playing or set to be overriden, play the turn animation as a dynamic montage."*
- *"Step 4: Scale the rotation amount (gets scaled in animgraph) to compensate for turn angle (If Allowed) and play rate."*
- 🔀 Contém `5` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `Not_PreBool()`
- 🛠️ `IsPlayingSlotAnimation()`
- 🛠️ `PlaySlotAnimationAsDynamicMontage()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Abs()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get CLF_TurnIP_L180`
- `Get CLF_TurnIP_L90`
- `Get CLF_TurnIP_R180`
- `Get CLF_TurnIP_R90`
- `Get Character`
- `Get N_TurnIP_L180`
- `Get N_TurnIP_L90`
- `Get N_TurnIP_R180`
- `Get N_TurnIP_R90`
- `Get OverrideCurrent`
- `Get PlayRateScale`
- `Get Stance`
- `Get StartTime`
- `Get TargetRotation`
- `Get TargetTurnAsset`
- `Get Turn180Threshold`
- `Get TurnAngle`
- `Set RotationScale`
- `Set TargetTurnAsset`
- `Set TurnAngle`

### 📌 Grafo: `SetFootLockOffsets`

**Comentários e Títulos de Seção Encontrados:**
- *"Use the delta between the current and last updated rotation to find how much the foot should be rotated to remain planted on the ground."*
- *"Get the distance traveled between frames relative to the mesh rotation to find how much the foot should be offset to remain planted on the ground."*
- *"Subtract the location difference from the current local location and rotate it by the rotation difference to keep the foot planted in component space."*
- *"Subtract the Rotation Difference from the current Local Rotation to get the new local rotation."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsMovingOnGround()`
- 🛠️ `GetLastUpdateRotation()`
- 🛠️ `RotateAngleAxis()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `LessLess_VectorRotator()`
- 🛠️ `GetOwningComponent()`
- 🛠️ `K2_GetComponentRotation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get LocalLocation`
- `Get LocalRotation`
- `Get LocationDifference`
- `Get RotationDifference`
- `Get Velocity`
- `Set LocationDifference`
- `Set RotationDifference`

### 📌 Grafo: `SetFootOffsets`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Trace downward from the foot location to find the geometry. If the surface is walkable, save the Impact Location and Normal."*
- *"Step 1.2: Calculate the Rotation offset by getting the Atan2 of the Impact Normal."*
- *"Only update Foot IK offset values if the Foot IK curve has a weight. If it equals 0, clear the offset values."*
- *"Step 2: Interp the Current Location Offset to the new target value. Interpolate at different speeds based on whether the new target is above or below the current one."*
- *"Step 1.1: Find the difference in location from the Impact point and the expected (flat) floor location. These values are offset by the nomrmal multiplied by the foot height to get better behavior on angled surfaces."*
- *"Step 3: Interp the Current Rotation Offset to the new target value."*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `LineTraceSingle()`
- 🛠️ `GetOwningComponent()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `DegAtan2()`
- 🛠️ `MakeRotator()`
- 🛠️ `RInterpTo()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `VInterpTo()`
- 🛠️ `BreakHitResult()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `MakeVector()`
- 🛠️ `GetDebugTraceType()`
- 🛠️ `IsWalkable()`
- 🛠️ `GetCurveValue()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get CurrentLocationOffset`
- `Get CurrentLocationTarget`
- `Get CurrentRotationOffset`
- `Get DeltaTimeX`
- `Get FootHeight`
- `Get IKFootBone`
- `Get IKFootFloorLocation`
- `Get IK_TraceDistanceAboveFoot`
- `Get IK_TraceDistanceBelowFoot`
- `Get ImpactNormal`
- `Get ImpactPoint`
- `Get RootBone`
- `Get TargetRotationOffset`
- `Set IKFootFloorLocation`
- `Set ImpactNormal`
- `Set ImpactPoint`
- `Set TargetRotationOffset`

### 📌 Grafo: `SetPelvisIKOffset`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Pelvis Alpha by finding the average Foot IK weight. If the alpha is 0, clear the offset."*
- *"Step 1: Set the new Pelvis Target to be the lowest Foot Offset"*
- *"Step 2: Interp the Current Pelvis Offset to the new target value. Interpolate at different speeds based on whether the new target is above or below the current one."*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `VInterpTo()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get DeltaTimeX`
- `Get FootOffset_L_Target`
- `Get FootOffset_R_Target`
- `Get PelvisOffset`
- `Get PelvisTarget`
- `Set PelvisAlpha`
- `Set PelvisOffset`
- `Set PelvisTarget`

### 📌 Grafo: `ResetIKOffsets`

**Comentários e Títulos de Seção Encontrados:**
- *"Interp Foot IK offsets back to 0"*

**Funções e Métodos Chamados:**
- 🛠️ `VInterpTo()`
- 🛠️ `RInterpTo()`

**Variáveis Manipuladas:**
- `Get DeltaTimeX`
- `Set FootLock_R_Location`
- `Set FootOffset_L_Location`
- `Set FootOffset_L_Rotation`

### 📌 Grafo: `WeaponData`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsValid()`
- 🛠️ `GetChar_CurrentWeapon()`
- 🛠️ `GetChar_WpnSystemValid()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get IsOnFireRateDelay`
- `Get WeaponData`
- `Set HasWeapon`
- `Set IKLeft Hand`
- `Set Is on Fire Rate Delay`
- `Set Weapon Type`

### 📌 Grafo: `GetCharacterDead`

### 📌 Grafo: `GetChar_Mesh`

### 📌 Grafo: `GetChar_CurrentWeapon`

### 📌 Grafo: `GetChar_WpnSystemValid`

### 📌 Grafo: `GetChar_WeaponSystem`

### 📌 Grafo: `GetHUD`

### 📌 Grafo: `AnimGraphNode_StateMachine_10`

**Comentários e Títulos de Seção Encontrados:**
- *"This pose snapshot is saved in the CharacterBP in the RagdollEnd function."*
- *"Transition to the Blend Out is 0 making the charatcer immediately assume the ragdoll\'s pose when blending back to the animation states,"*

**Variáveis Manipuladas:**
- `Get FlailRate`
- `Get MovementState`

### 📌 Grafo: `AnimGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Final"*
- *"Entrar em modo de movimento customizado"*
- *"Animação de morte morrida"*
- *"Hand IK"*
- *"Foot IK"*
- *"Animação de dano com ALS mesclado"*
- *"Apply Aim Offsets or manual spine rotation"*
- *"Ragdoll Override"*
- *"Ragdoll States"*
- *"ALS V4"*
- *"Layer Blending"*
- *"Animação especifica para uma parte do corpo - Acima da cintura"*
- *"IMPORTANT!!!\r\n\r\nThe layout of every Animation Graph should ideally be determined by the specific needs of each individual project. Therefore, it is most likely necessary to modify parts (or all) of this Animation Graph and the Linked Layer Graphs in order to meet your project\'s specific needs. Thankfully, due to the highly flexible nature of UE4\'s animation system, it is entirely possible to keep/rearrange parts of these graphs (or concepts of this system) while also using a completely different setup."*

**Variáveis Manipuladas:**
- `Get Damage Anim`
- `Get Dead`
- `Get Enable_AimOffset`
- `Get Enable_HandIK_L`
- `Get Enable_HandIK_R`
- `Get MovementState`
- `Get Speed`
- `Get SpineRotation`

### 📌 Grafo: `CalculateCrouchingPlayRate`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Crouching Play Rate by dividing the Character\'s speed by the Animated Speed. This value needs to be separate from the standing play rate to improve the blend from crocuh to stand while in motion."*

**Funções e Métodos Chamados:**
- 🛠️ `FClamp()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `GetOwningComponent()`
- 🛠️ `K2_GetComponentScale()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get AnimatedCrouchSpeed`
- `Get Speed`
- `Get StrideBlend`

### 📌 Grafo: `CalculateDiagonalScaleAmount`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Diagnal Scale Amount. This value is used to scale the Foot IK Root bone to make the Foot IK bones cover more distance on the diagonal blends. Without scaling, the feet would not move far enough on the diagonal direction due to the linear translational blending of the IK bones. The curve is used to easily map the value."*

**Funções e Métodos Chamados:**
- 🛠️ `GetFloatValue()`
- 🛠️ `Abs()`

**Variáveis Manipuladas:**
- `Get DiagonalScaleAmountCurve`
- `Get VelocityBlend`

### 📌 Grafo: `CalculateInAirLeanAmount`

**Comentários e Títulos de Seção Encontrados:**
- *"Use the relative Velocity direction and amount to determine how much the character should lean while in air. The Lean In Air curve gets the Fall Speed and is used as a multiplier to smoothly reverse the leaning direction when transitioning from moving upwards to moving downwards."*

**Funções e Métodos Chamados:**
- 🛠️ `Multiply_Vector2DFloat()`
- 🛠️ `GetFloatValue()`
- 🛠️ `LessLess_VectorRotator()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `MakeVector2D()`
- 🛠️ `BreakVector()`
- 🛠️ `BreakVector2D()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get FallSpeed`
- `Get LeanInAirCurve`
- `Get Velocity`

### 📌 Grafo: `CalculateLandPrediction`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the land prediction weight by tracing in the velocity direction to find a walkable surface the character is falling toward, and getting the \'Time\' (range of 0-1, 1 being maximum, 0 being about to land) till impact. The Land Prediction Curve is used to control how the time affects the final weight for a smooth blend. "*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CapsuleTraceSingleByProfile()`
- 🛠️ `GetCurveValue()`
- 🛠️ `Vector_NormalUnsafe()`
- 🛠️ `FClamp()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `IsWalkable()`
- 🛠️ `BreakHitResult()`
- 🛠️ `GetFloatValue()`
- 🛠️ `Lerp()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `GetDebugTraceType()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get CapsuleRadius`
- `Get Character`
- `Get CharacterMovement`
- `Get FallSpeed`
- `Get LandPredictionCurve`
- `Get Velocity`

### 📌 Grafo: `CalculateMovementDirection`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Movement Direction. This value represents the direction the character is moving relative to the camera during the Looking Cirection / Aiming rotation modes, and is used in the Cycle Blending Anim Layers to blend to the appropriate directional states."*

**Funções e Métodos Chamados:**
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `CalculateQuadrant()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get AimingRotation`
- `Get Gait`
- `Get MovementDirection`
- `Get RotationMode`
- `Get Velocity`

### 📌 Grafo: `CalculateStandingPlayRate`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Play Rate by dividing the Character\'s speed by the Animated Speed for each gait. The lerps are determined by the \"*

**Funções e Métodos Chamados:**
- 🛠️ `Lerp()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `FClamp()`
- 🛠️ `GetOwningComponent()`
- 🛠️ `K2_GetComponentScale()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get AnimatedRunSpeed`
- `Get AnimatedSprintSpeed`
- `Get AnimatedWalkSpeed`
- `Get Speed`
- `Get StrideBlend`

### 📌 Grafo: `CalculateStrideBlend`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Stride Blend. This value is used within the blendspaces to scale the stride (distance feet travel) so that the character can walk or run at different movement speeds. It also allows the walk or run gait animations to blend independently while still matching the animation speed to the movement speed, preventing the character from needing to play a half walk+half run blend. The curves are used to map the stride amount to the speed for maximum control."*

**Funções e Métodos Chamados:**
- 🛠️ `Lerp()`
- 🛠️ `GetFloatValue()`
- 🛠️ `GetCurveValue()`

**Variáveis Manipuladas:**
- `Get Speed`
- `Get StrideBlend_C_Walk`
- `Get StrideBlend_N_Run`
- `Get StrideBlend_N_Walk`

### 📌 Grafo: `CalculateVelocityBlend`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Velocity Blend. This value represents the velocity amount of the actor in each direction (normalized so that diagonals equal .5 for each direction), and is used in a BlendMulti node to produce better directional blending than a standard blendspace."*

**Funções e Métodos Chamados:**
- 🛠️ `Normal()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `FClamp()`
- 🛠️ `Abs()`
- 🛠️ `LessLess_VectorRotator()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get LocRelativeVelocityDir`
- `Get RelativeDirection`
- `Get Sum`
- `Get Velocity`
- `Set LocRelativeVelocityDir`
- `Set RelativeDirection`
- `Set Sum`

### 📌 Grafo: `CalculateWalkRunBlend`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Walk Run Blend. This value is used within the Blendspaces to blend between walking and running."*

**Variáveis Manipuladas:**
- `Get Gait`

### 📌 Grafo: `CanDynamicTransition`

**Comentários e Títulos de Seção Encontrados:**
- *"Only perform a Dynamic Transition check if the \"*

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `EqualEqual_DoubleDouble()`

### 📌 Grafo: `CanOverlayTransition`

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get ShouldMove`
- `Get Stance`

### 📌 Grafo: `CanRotateInPlace`

**Comentários e Títulos de Seção Encontrados:**
- *"Only perform a Rotate In Place Check if the character is Aiming or in First Person."*

**Variáveis Manipuladas:**
- `Get RotationMode`
- `Get ViewMode`

### 📌 Grafo: `CanTurnInPlace`

**Comentários e Títulos de Seção Encontrados:**
- *"Only perform a Turn In Place check if the character is looking toward the camera in Third Person, and if the \"*

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get RotationMode`
- `Get ViewMode`

### 📌 Grafo: `DynamicTransitionCheck`

**Comentários e Títulos de Seção Encontrados:**
- *"Check each foot to see if the location difference between the IK_Foot bone and its desired / target location (determined via a virtual bone) exceeds a threshold. If it does, play an additive transition animation on that foot. The currently set transition plays the second half of a 2 foot transition animation, so that only a single foot moves. Because only the IK_Foot bone can be locked, the separate virtual bone allows the system to know its desired location when locked."*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `PlayDynamicTransition()`
- 🛠️ `K2_DistanceBetweenTwoSocketsAndMapRange()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `GetOwningComponent()`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Jumped"*
- *"Cycle Blending Notify Events"*
- *"Evento Is Dead"*
- *"Anim Notify Transition Events"*
- *"Stopping Transitions"*
- *"Bow Transitions"*
- *"M4A1 Transitions"*
- *"Overlay State Transitions"*
- *"Interface Events"*
- *"Play Additive Transition Animation"*
- *"Set Overlay Override State"*
- *"Pistol 1H Transitions"*
- *"Stop Transition/Turn Animations"*
- *"Set / Reset Grounded Entry State"*
- *"Pistol 2H Transitions"*
- *"Additive Transitions"*
- *"Pivot"*
- *"Set Tracked Hips Direction"*
- *"Evento Damage Animation"*
- *"Movement State / Action Transitions"*
- *"Play Dynamic Additive Transition Animation"*
- *"Initiaize Anim Instance"*

**Eventos de Entrada (Events):**
- 🟢 `PlayTransition`
- 🟢 `PlayDynamicTransition`
- 🟢 `DamageAnimation`
- 🟢 `IsDead`
- 🟢 `AnimNotify_M4A1 Relaxed->Ready`
- 🟢 `AnimNotify_Roll->Idle`
- 🟢 `AnimNotify_->N Stop L`
- 🟢 `BlueprintInitializeAnimation`
- 🟢 `AnimNotify_->N QuickStop `
- 🟢 `AnimNotify_Land->Idle`
- 🟢 `AnimNotify_->CLF Stop`
- 🟢 `BPI_SetGroundedEntryState`
- 🟢 `AnimNotify_Reset-GroundedEntryState`
- 🟢 `AnimNotify_Hips LB`
- 🟢 `AnimNotify_Bow Ready->Relaxed`
- 🟢 `AnimNotify_Hips LF`
- 🟢 `AnimNotify_Hips RB`
- 🟢 `AnimNotify_Hips RF`
- 🟢 `AnimNotify_Pivot`
- 🟢 `BPI_SetOverlayOverrideState`
- 🟢 `AnimNotify_Pistol 1H Ready->Relaxed`
- 🟢 `AnimNotify_Pistol 1H Relaxed->Ready`
- 🟢 `AnimNotify_Pistol 2H Ready->Relaxed`
- 🟢 `AnimNotify_StopTransition`
- 🟢 `AnimNotify_Pistol 2H Relaxed->Ready`
- 🟢 `AnimNotify_->N Stop R`
- 🟢 `AnimNotify_Bow Relaxed->Ready`
- 🟢 `BPI_Jumped`
- 🟢 `AnimNotify_Hips F`
- 🟢 `AnimNotify_M4A1 Ready->Relaxed`
- 🟢 `AnimNotify_Hips B`
- 🔀 Contém `8` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `PlayTransition()`
- 🛠️ `Delay()`
- 🛠️ `CanOverlayTransition()`
- 🛠️ `StopSlotAnimation()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `PlaySlotAnimationAsDynamicMontage()`
- 🛠️ `TryGetPawnOwner()`
- 🛠️ `MapRangeClamped()`

**Variáveis Manipuladas:**
- `Get Speed`
- `Get TriggerPivotSpeedLimit`
- `Set Character`
- `Set Damage Anim`
- `Set Dead`
- `Set GroundedEntryState`
- `Set JumpPlayRate`
- `Set Jumped`
- `Set OverlayOverrideState`
- `Set Pivot`
- `Set TrackedHipsDirection`

### 📌 Grafo: `GetAnimCurve_Clamped`

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `FClamp()`

### 📌 Grafo: `GetAnimCurve_Compact`

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`

### 📌 Grafo: `GetDebugTraceType`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`
- 🛠️ `BPI_Get_DebugInfo()`

### 📌 Grafo: `RotateInPlaceCheck`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Check if the character should rotate left or right by checking if the Aiming Angle exceeds the threshold."*
- *"Step 2: If the character should be rotating, set the Rotate Rate to scale with the Aim Yaw Rate. This makes the character rotate faster when moving the camera faster."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `BreakVector2D()`

**Variáveis Manipuladas:**
- `Get AimYawRate`
- `Get AimYawRateMaxRange`
- `Get AimYawRateMinRange`
- `Get AimingAngle`
- `Get MaxPlayRate`
- `Get MinPlayRate`
- `Get RotateMaxThreshold`
- `Get RotateMinThreshold`
- `Get Rotate_L`
- `Get Rotate_R`
- `Set RotateRate`
- `Set Rotate_L`
- `Set Rotate_R`

### 📌 Grafo: `SetFootLocking`

**Comentários e Títulos de Seção Encontrados:**
- *"Only update values if FootIK curve has a weight."*
- *"Step 1: Set Local FootLock Curve value"*
- *"Step 2: Only update the FootLock Alpha if the new value is less than the current, or it equals 1. This makes it so that the foot can only blend out of the locked position or lock to a new position, and never blend in."*
- *"Step 3: If the Foot Lock curve equals 1, save the new lock location and rotation in component space."*
- *"Step 4: If the Foot Lock Alpha has a weight, update the Foot Lock offsets to keep the foot planted in place while the capsule moves."*
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetOwningComponent()`
- 🛠️ `GetSocketTransform()`
- 🛠️ `SetFootLockOffsets()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `GetCurveValue()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get CurrentFootLockAlpha`
- `Get CurrentFootLockLocation`
- `Get CurrentFootLockRotation`
- `Get FootLockCurve`
- `Get FootLockCurveValue`
- `Get IKFootBone`
- `Set FootLockCurveValue`

### 📌 Grafo: `ShouldMoveCheck`

**Comentários e Títulos de Seção Encontrados:**
- *"Enable Movement Animations if IsMoving and HasMovementInput, or if the Speed is greater than 150. "*

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get HasMovementInput`
- `Get IsMoving`
- `Get Speed`

### 📌 Grafo: `TurnInPlaceCheck`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Check if Aiming angle is outside of the Turn Check Min Angle, and if the Aim Yaw Rate is below the Aim Yaw Rate Limit. If so, begin counting the Elapsed Delay Time. If not, reset the Elapsed Delay Time. This ensures the conditions remain true for a sustained peroid of time before turning in place."*
- *"Step 2: Check if the Elapsed Delay time exceeds the set delay (mapped to the turn angle range). If so, trigger a Turn In Place."*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Abs()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `TurnInPlace()`
- 🛠️ `BreakVector2D()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get AimYawRate`
- `Get AimYawRateLimit`
- `Get AimingAngle`
- `Get AimingRotation`
- `Get DeltaTimeX`
- `Get ElapsedDelayTime`
- `Get MaxAngleDelay`
- `Get MinAngleDelay`
- `Get TurnCheckMinAngle`
- `Set ElapsedDelayTime`

### 📌 Grafo: `UpdateAimingValues`

**Comentários e Títulos de Seção Encontrados:**
- *"Interp the Aiming Rotation value to achieve smooth aiming rotation changes. Interpolating the rotation before calculating the angle ensures the value is not affected by changes in actor rotation, allowing slow aiming rotation changes with fast actor rotation changes."*
- *"Calculate the Aiming angle and Smoothed Aiming Angle by getting the delta between the aiming rotation and the actor rotation."*
- *"Use the Aiming Yaw Angle divided by the number of spine+pelvis bones to get the amount of spine rotation needed to remain facing the camera direction."*
- *"Clamp the Aiming Pitch Angle to a range of 1 to 0 for use in the vertical aim sweeps."*
- *"Get the delta between the Movement Input rotation and Actor rotation and map it to a range of 0-1. This value is used in the aim offset behavior to make the character look toward the Movement Input."*
- *"Separate the Aiming Yaw Angle into 3 separate Yaw Times. These 3 values are used in the Aim Offset behavior to improve the blending of the aim offset when rotating completely around the character. This allows you to keep the aiming responsive but still smoothly blend from left to right or right to left."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `MakeVector2D()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `RInterpTo()`
- 🛠️ `FInterpTo()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `Abs()`
- 🛠️ `BreakRotator()`
- 🛠️ `BreakVector2D()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get AimingAngle`
- `Get AimingRotation`
- `Get Character`
- `Get DeltaTimeX`
- `Get HasMovementInput`
- `Get InputYawOffsetInterpSpeed`
- `Get MovementInput`
- `Get RotationMode`
- `Get SmoothedAimingAngle`
- `Get SmoothedAimingRotation`
- `Get SmoothedAimingRotationInterpSpeed`
- `Set AimSweepTime`
- `Set AimingAngle`
- `Set ForwardYawTime`
- `Set InputYawOffsetTime`
- `Set LeftYawTime`
- `Set RightYawTime`
- `Set SmoothedAimingAngle`
- `Set SmoothedAimingRotation`
- `Set SpineRotation`

### 📌 Grafo: `UpdateCharacterInfo`

**Comentários e Títulos de Seção Encontrados:**
- *"Get Information from the Character via the Character Interface to use throughout the AnimBP and AnimGraph."*

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Get_EssentialValues()`
- 🛠️ `BPI_Get_CurrentStates()`

**Variáveis Manipuladas:**
- `Get Character`
- `Set Acceleration`
- `Set AimYawRate`
- `Set AimingRotation`
- `Set Gait`
- `Set HasMovementInput`
- `Set IsMoving`
- `Set MovementAction`
- `Set MovementInput`
- `Set MovementInputAmount`
- `Set MovementState`
- `Set OverlayState`
- `Set PrevMovementState`
- `Set RotationMode`
- `Set Speed`
- `Set Stance`
- `Set Velocity`
- `Set ViewMode`

### 📌 Grafo: `UpdateGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Check Movement Mode"*
- *"Do While On Ground"*
- *"Weapon Data"*
- *"Do While Moving"*
- *"Do While Not Moving"*
- *"Do When Starting To Move"*
- *"Do While InAir"*
- *"Check If Moving Or Not"*
- *"Only update if character is valid"*
- *"Do Every Frame"*
- *"Do While Ragdolling"*

**Eventos de Entrada (Events):**
- 🟢 `BlueprintUpdateAnimation`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `NotEqual_DoubleDouble()`
- 🛠️ `UpdateMovementValues()`
- 🛠️ `CanDynamicTransition()`
- 🛠️ `UpdateAimingValues()`
- 🛠️ `CanTurnInPlace()`
- 🛠️ `UpdateLayerValues()`
- 🛠️ `UpdateRotationValues()`
- 🛠️ `UpdateInAirValues()`
- 🛠️ `TurnInPlaceCheck()`
- 🛠️ `DynamicTransitionCheck()`
- 🛠️ `ShouldMoveCheck()`
- 🛠️ `UpdateCharacterInfo()`
- 🛠️ `CanRotateInPlace()`
- 🛠️ `RotateInPlaceCheck()`
- 🛠️ `UpdateFootIK()`
- 🛠️ `WeaponData()`
- 🛠️ `UpdateRagdollValues()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get MovementState`
- `Set DeltaTimeX`
- `Set ElapsedDelayTime`
- `Set Rotate_L`
- `Set Rotate_R`
- `Set ShouldMove`

### 📌 Grafo: `UpdateInAirValues`

**Comentários e Títulos de Seção Encontrados:**
- *"Update the fall speed. Setting this value only while in the air allows you to use it within the AnimGraph for the landing strength. If not, the Z velocity would return to 0 on landing. "*
- *"Set the Land Prediction weight."*
- *"Interp and set the In Air Lean Amount"*

**Funções e Métodos Chamados:**
- 🛠️ `CalculateLandPrediction()`
- 🛠️ `CalculateInAirLeanAmount()`
- 🛠️ `InterpLeanAmount()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get DeltaTimeX`
- `Get InAirLeanInterpSpeed`
- `Get LeanAmount`
- `Get Velocity`
- `Set FallSpeed`
- `Set LandPrediction`
- `Set LeanAmount`

### 📌 Grafo: `UpdateLayerValues`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the Base Pose weights"*
- *"Set the Additive amount weights for each body part"*
- *"Get the Aim Offset weight by getting the opposite of the Aim Offset Mask."*
- *"Set the Hand Override weights"*
- *"Blend and set the Hand IK weights to ensure they only are weighted if allowed by the Arm layers."*
- *"Set whether the arms should blend in mesh space or local space. The Mesh space weight will always be 1 unless the Local Space (LS) curve is fully weighted."*

**Funções e Métodos Chamados:**
- 🛠️ `Lerp()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `FFloor()`

**Variáveis Manipuladas:**
- `Set Arm_L_Add`
- `Set Arm_L_LS`
- `Set Arm_L_MS`
- `Set Arm_R_Add`
- `Set Arm_R_LS`
- `Set Arm_R_MS`
- `Set BasePose_CLF`
- `Set BasePose_N`
- `Set Enable_AimOffset`
- `Set Enable_HandIK_L`
- `Set Enable_HandIK_R`
- `Set Hand_L`
- `Set Hand_R`
- `Set Head_Add`
- `Set Spine_Add`

### 📌 Grafo: `UpdateMovementValues`

**Comentários e Títulos de Seção Encontrados:**
- *"Interp and set the Velocity Blend."*
- *"Set the Diagnal Scale Amount."*
- *"Set the Relative Acceleration Amount and Interp the Lean Amount."*
- *"Set the Walk Run Blend"*
- *"Set the Stride Blend"*
- *"Set the Standing and Crouching Play Rates"*

**Funções e Métodos Chamados:**
- 🛠️ `CalculateRelativeAccelerationAmount()`
- 🛠️ `CalculateStandingPlayRate()`
- 🛠️ `CalculateVelocityBlend()`
- 🛠️ `CalculateStrideBlend()`
- 🛠️ `InterpVelocityBlend()`
- 🛠️ `CalculateCrouchingPlayRate()`
- 🛠️ `CalculateDiagonalScaleAmount()`
- 🛠️ `InterpLeanAmount()`
- 🛠️ `CalculateWalkRunBlend()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get DeltaTimeX`
- `Get GroundedLeanInterpSpeed`
- `Get LeanAmount`
- `Get RelativeAccelerationAmount`
- `Get VelocityBlend`
- `Get VelocityBlendInterpSpeed`
- `Set CrouchingPlayRate`
- `Set DiagonalScaleAmount`
- `Set LeanAmount`
- `Set RelativeAccelerationAmount`
- `Set StandingPlayRate`
- `Set StrideBlend`
- `Set VelocityBlend`
- `Set WalkRunBlend`

### 📌 Grafo: `UpdateRagdollValues`

**Comentários e Títulos de Seção Encontrados:**
- *"Scale the Flail Rate by the velocity length. The faster the ragdoll moves, the faster the character will flail."*

**Funções e Métodos Chamados:**
- 🛠️ `GetOwningComponent()`
- 🛠️ `GetPhysicsLinearVelocity()`
- 🛠️ `VSize()`
- 🛠️ `MapRangeClamped()`

**Variáveis Manipuladas:**
- `Set FlailRate`

### 📌 Grafo: `WeaponGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Todas as animações do personagem"*
- *"Notifys para dar efeito de recarregamento a arma"*
- *"Animação de Atirar"*
- *"Equip Notify"*
- *"Unequip Notify"*

**Eventos de Entrada (Events):**
- 🟢 `PlayAnimation`
- 🟢 `ShootingAnimation`
- 🟢 `AnimNotify_EquipWeapon`
- 🟢 `AnimNotify_UnequipWeapon`
- 🟢 `AnimNotify_DropMagazine`
- 🟢 `AnimNotify_PickupMagazine`
- 🟢 `AnimNotify_InsertMagazine`
- 🟢 `AnimNotify_AttachInHand`

**Funções e Métodos Chamados:**
- 🛠️ `AttachInHand()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `SetActorHiddenInGame()`
- 🛠️ `K2_SetActorRelativeRotation()`
- 🛠️ `GetPlayerPawn()`
- 🛠️ `DropMagazine()`
- 🛠️ `K2_SetActorRelativeLocation()`
- 🛠️ `PickupMagazine()`
- 🛠️ `InsertMagazine()`
- 🛠️ `PlaySlotAnimationAsDynamicMontage()`
- 🛠️ `GetChar_Mesh()`
- 🛠️ `BPI_Set_OverlayState()`
- 🛠️ `GetChar_WeaponSystem()`
- 🛠️ `GetChar_CurrentWeapon()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CurrentWeapon`
- `Get HideWeapon`
- `Get WeaponData`
- `Set Is Shooting`

### 📌 Grafo: `AnimGraph__AnimFunc`

### 📌 Grafo: `BaseLayer__AnimFunc`

### 📌 Grafo: `OverlayLayer__AnimFunc`

### 📌 Grafo: `BasePoses__AnimFunc`

### 📌 Grafo: `LayerBlending__AnimFunc`

### 📌 Grafo: `(N) CycleBlending__AnimFunc`

### 📌 Grafo: `(CLF) CycleBlending__AnimFunc`

### 📌 Grafo: `Foot IK__AnimFunc`

### 📌 Grafo: `AimOffsetBehaviors__AnimFunc`

### 📌 Grafo: `ExecuteUbergraph_ALS_AnimBP`

**Comentários e Títulos de Seção Encontrados:**
- *"Additive Transitions"*
- *"Overlay State Transitions"*
- *"Initiaize Anim Instance"*
- *"Stopping Transitions"*
- *"Jumped"*
- *"Play Dynamic Additive Transition Animation"*
- *"Stop Transition/Turn Animations"*
- *"Interface Events"*
- *"Pivot"*
- *"Set Tracked Hips Direction"*
- *"Set / Reset Grounded Entry State"*
- *"Movement State / Action Transitions"*
- *"Bow Transitions"*
- *"M4A1 Transitions"*
- *"Pistol 1H Transitions"*
- *"Anim Notify Transition Events"*
- *"Cycle Blending Notify Events"*
- *"Play Additive Transition Animation"*
- *"Set Overlay Override State"*
- *"Pistol 2H Transitions"*
- *"Evento Damage Animation"*
- *"Evento Is Dead"*
- *"Check Movement Mode"*
- *"Do While On Ground"*
- *"Do While Moving"*
- *"Do While Not Moving"*
- *"Do When Starting To Move"*
- *"Do While InAir"*
- *"Check If Moving Or Not"*
- *"Only update if character is valid"*
- *"Do Every Frame"*
- *"Do While Ragdolling"*
- *"Weapon Data"*
- *"Todas as animações do personagem"*
- *"Equip Notify"*
- *"Unequip Notify"*
- *"Animação de Atirar"*
- *"Notifys para dar efeito de recarregamento a arma"*
- *"Only do variable assignment the first time in"*
- *"Close on first entrance, if desired"*
- *"Close on first entrance, if desired"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `BlueprintInitializeAnimation`
- 🟢 `AnimNotify_->CLF Stop`
- 🟢 `AnimNotify_StopTransition`
- 🟢 `PlayTransition`
- 🟢 `AnimNotify_Roll->Idle`
- 🟢 `AnimNotify_->N Stop L`
- 🟢 `AnimNotify_->N Stop R`
- 🟢 `AnimNotify_Land->Idle`
- 🟢 `AnimNotify_->N QuickStop `
- 🟢 `BPI_Jumped`
- 🟢 `BPI_SetGroundedEntryState`
- 🟢 `AnimNotify_Reset-GroundedEntryState`
- 🟢 `AnimNotify_Bow Ready->Relaxed`
- 🟢 `AnimNotify_Bow Relaxed->Ready`
- 🟢 `AnimNotify_M4A1 Ready->Relaxed`
- 🟢 `AnimNotify_M4A1 Relaxed->Ready`
- 🟢 `AnimNotify_Pistol 1H Ready->Relaxed`
- 🟢 `AnimNotify_Pistol 1H Relaxed->Ready`
- 🟢 `AnimNotify_Hips F`
- 🟢 `AnimNotify_Hips B`
- 🟢 `AnimNotify_Hips LB`
- 🟢 `AnimNotify_Hips LF`
- 🟢 `AnimNotify_Hips RB`
- 🟢 `AnimNotify_Hips RF`
- 🟢 `AnimNotify_Pivot`
- 🟢 `PlayDynamicTransition`
- 🟢 `BPI_SetOverlayOverrideState`
- 🟢 `AnimNotify_Pistol 2H Ready->Relaxed`
- 🟢 `AnimNotify_Pistol 2H Relaxed->Ready`
- 🟢 `DamageAnimation`
- 🟢 `IsDead`
- 🟢 `BlueprintUpdateAnimation`
- 🟢 `PlayAnimation`
- 🟢 `AnimNotify_EquipWeapon`
- 🟢 `AnimNotify_UnequipWeapon`
- 🟢 `ShootingAnimation`
- 🟢 `AnimNotify_DropMagazine`
- 🟢 `AnimNotify_PickupMagazine`
- 🟢 `AnimNotify_InsertMagazine`
- 🟢 `AnimNotify_AttachInHand`
- 🟢 `IsJetpack`
- 🟢 `IsJumping`
- 🟢 `Death`
- 🟢 `SetArmour`
- 🟢 `SetDamage`
- 🟢 `SetHealth`
- 🟢 `CharBeginPlay`
- 🟢 `AmmoPickup`
- 🟢 `WPN_Recoil`
- 🟢 `WPN_CantShoot`
- 🟢 `PC_SetHUD`
- 🟢 `AnimBP_SetAnimations`
- 🟢 `WPN_SetWeaponToInteract`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByBool_A3E734EC4D6D79E7057B289F793C6230`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ApplyMeshSpaceAdditive_99A66FB9405EC0BFFB8CEF8B4840BE02`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyBone_D64DCCDF44B05E9EE5A3C78495B3F504`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyBone_D8848F5B4A8DA21D09B35F8CD20EB7C8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyBone_84DF35094008E0CABFDD1F9464F9640C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyBone_BC87DF3D48D834BE61D57B89D740D818`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByEnum_0B6571B44676ED7B9CD44A9DCBE00079`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoBoneIK_F60C8ABA42BC58DF845B1891544F7908`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoBoneIK_0AA01FC243BDF65A464D238C51E63C7F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_6F09D4694EB4D50D4C673BB197831473`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_LayeredBoneBlend_7FA287504A7F1BF76D566EBEEBDD250D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_LayeredBoneBlend_B778F1E44A1EC4730CE079A527ACBEF2`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_LayeredBoneBlend_53CCDCE3459A5245A2E29DA3B0E13978`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_LayeredBoneBlend_09F6BA9341CA60DA806460915B8696E6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_LayeredBoneBlend_C7AA6B074E37CA806CC691992970A2CC`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ApplyAdditive_6627DF4F40C0651C984553A80EC1CBE0`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ApplyAdditive_B1B8A3144547023B1810DBAFA3AB5364`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ApplyMeshSpaceAdditive_985938AB4C63283CACFA8E9AD4A2FFC8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ApplyMeshSpaceAdditive_E64E33FA49E23FC001C82BB3B972232A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByEnum_55280CFA49E9FE9BAD48B59A9E15F9B2`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyBone_F26F03204AB9F21F4EC4188ED91DE2DD`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyBone_E7D6CE3C422C636D2DB5639009790A23`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyBone_703C18AA43CDECF18EA2A4AED14F18A6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyBone_B6589AFF46726F2B00FB6B8BC38805C2`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyBone_B790AA3B4C408984EFE01981F9C56EB9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_860D9E55436398531D65A7B5489DA7FE`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_F4F1F3AF44A1327846E540A25AF2B76F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_E98E85D447753056C5988D8963678E60`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpaceEvaluator_0E084C864E8FC68927AE9CAF23F3D346`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpaceEvaluator_5772262E4D933B7D9D91AFB4F2D4113F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpaceEvaluator_3A25007248734C5EE5E91498A288C0A5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpaceEvaluator_354B9DEC4C1D69F98D6964962C1F816F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_333743C24C21EEA2DD11C6A20CBBFDBE`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_3CB174E6444EDEB70617318A2964487B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_839E09784828992E8362989200793B2C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_677E99374D02342093738ABBAE01642D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_04A29F7048F137CC383A10B207C2D99B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_CDF7792E4B7FD4B26F742D9A76BE4C6F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8F1743BF4B5639DCE929F198E8410475`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D4AFFB9B40841BC062C7A6BE70D034E3`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_907081E84AFD6D7C8CC125ACCF93F61F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_F11F3463497098C289C790BF1328875E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_6176124B41CBCF396EBEB18DB65CB4D0`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_6B3F516942CE131F70193EA081991F44`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_BC38E67C4A1EDD602616948086FCF24F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_D794905C4237BC0AA7BA2A82680F68E4`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByEnum_4B114D6140BED834194B60939237AFDE`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByEnum_F2E3098140A1E3779CC542BA3165BD98`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_31B8D0E74202DD8E8F839BA086DD3835`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByEnum_F856CD014CA99BDCCE447FB49D073BED`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByEnum_77737F5F461E0BDE6EC05D9ED584E7ED`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_C55C274A4AA4A6F6CC651DA229CA982F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_DD0CDD1C42B00AC0FEA40E8043554B98`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_BCB6B9F0433250A004EFACA7D0140FAA`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_FF9F05024865FF78C61EE7BF727F2CDA`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_1A2FD9414A4589E656EA35B8BEA2D943`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_0C4BFCA44A08EC7EFCD49FA3DEEE6969`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_6233759F4B8DCFCC888DDEB9FCFB568C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_58E227044A9A6F0A7880C08A68B30DA6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_568A415744774874231EDE8E2095797A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_99E39A8740DFE22CF2A6929D3F75B42F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_32ADC5494C5D9C9A2E18F5B00178DA72`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_48F86642453C5A5EB7551DACB92683DA`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_09FE0A4245374506B1866C9C6D6BF91D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_F17F279446FA704AFEDD2FA96986A0B8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_F2C7170B49F2ED80831942AB21853951`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_29789E2D4DBD944BB47B218167EFB270`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_820D98944CA0304763B4CEA42690ACB4`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_E67940D9469FB6C4B0C685A1EB2330B3`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_72F166224769B03D5D19BC9B037AFFD1`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_C439BABB439D2317561121829E209FFC`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_3FAED3FD4F3DD848B9434789A6A359E8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_CF904E9646B6301BF457719BA799E8D5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_962BFA2C4B91621B893D47BA3FD2E161`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D0A5EBB94DD0D29A130CCDB1837D4AD8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_4F2A1458446188B19871FBA7C4F8049D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_57D645EF47AAC5A2CD2AF2A3E180F56D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyBone_150578974EE51597FDAE4EB9D53E1991`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_2D8BA32745220E80E49E6799626DFE9D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_997390CF4F603A48BC52C2AF9BE0400A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_448D251B4FE8C9BADEAB7CA2E9BCF6E9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_67DC711F4F8822D18602D19C546082B6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_689B8F444ADD84E40B760794395BDDA9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_BDDD436246B86183F670F09F7998AAC8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_73B488584570CBF55C3EE192C8B6E95E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpacePlayer_F9E17BE5440B3A431F4C3681DDC30A44`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_2701F2C242B046E0F75CB7888A57671B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_A8719FA5437125A1C37C9088511532D6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_1422F3B9460B148FF9158480DAEEF165`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_9D844F5E48B4C61AA88AF091649D6A73`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_DF397FB844879312BB5BFE9277AB2E10`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_28E8899D4D01BDC49CABE28FC0556B45`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_35CD80E244073BA17C589F94F80B8566`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_1EE5EA1249CD18EE39F514BBB68A6954`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_C6577CB94569EDDC4FA068B0507D33EF`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_530BEFFD4C7CB134F588D888BDAE1BB4`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_4B81839C4A471C7C53F2F3888E796C64`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_EC2571C04D853134A08B9897A826D426`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_08F8312E4F928604408FADB218C6AA54`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_7A539FFA41A096B997A36398E3C19E1C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_3947CF1A4EE017EAA3A3618434F9F5C1`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_48370AE243CFBD2C310D7ABC946CA2F1`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyBone_3214891A422EF2ACA5175EB5976946A8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpacePlayer_9C43D8FC47327B1E9643E3A181B6573A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_3AB2E6DB4FD9954F1D77E3AF2860A715`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_CE232BE14ED6B8E86F165285650B6C3E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_C6CD2A4D410C9A7F7398AEB2E77080EE`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpacePlayer_E2CECFDB46A12AAE1F898D994CC75AD1`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpacePlayer_0748021F4D7229808194B3AA518ABF42`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpacePlayer_2326E43B4DCB6B806650CC8E65C4D793`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpacePlayer_27E523594BC8F88297B4D5A3ACA9A19B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpacePlayer_9047DE0A47684B7645142EA697B37839`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpacePlayer_BF5515E74F3B966A07B5CD808E0FBF57`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_1DE90E884749DE0F89109A9751255267`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_672A34C944AB9921F4942990F1354F03`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_FE28013D4D987D95188D09A1321EC7A6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_C05074EA4C692CA3D0EE0D824950B007`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_28AA257246E463AA11DF088175BD7AC7`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_B2CD3DB24833E492578AECA742A6BA20`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_064EDEC5405E797A995D639F6EE21501`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_2301A22B4097DC6B72ACC3B5FAC7E95D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_0B5586354B36E07719742AA3BA64F1AE`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_0DFDE3984234363C0EB4B5BE03C49903`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_CDF54F5E41641CB8B61BBB8CCF7EFBE3`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpacePlayer_3A09CE374B90D14349A1C0BA31A2B5BC`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_BDF86BB34C1174490E3BAB83C716E49A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_8991B7134383B53A2F26E18A7079AAEC`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_E1366CAE4D8F3271AA8A729E9FE622A8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_4A6AB45548555DFC1DB88697A405DC03`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_0A45DC35486AE48054C11AB6F018E48D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_D965200343B037515574E7A0C6CC1626`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendSpacePlayer_54C8065448948107CD768FBAEB03567A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_296E1DA84393344956B15BB1AF5C329A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_BFEBEB904FBEBF377A4A8080B0935026`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_BE60E928428D76D643C3F8B67C205027`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_682E8CFE4CF9ED5065D1E6AA637BF491`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_23DE404547A3F9460B2D02B970E36CF3`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_F6CAAF4142D64BA64DECD3B9506F85A2`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_E7E5F30F434026A92121AAA9A9E23928`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_249C850645754815B381F6B1842827AA`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D581D1814B7D6F7984E74EB17FE2F624`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_F39C4C484731D910E49B6492253E521E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_960B9C9044884B1B7ABC2685E04B1B02`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_C8FF4D0846262FC0CE2E989311F7C344`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_177A31A640F610A5E40724A679199460`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8D1528064F6F3CEF01B1A4B755AEF9A5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D121A99F4C785E9A77C6439118119DB4`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_AA38513C492D8024731ECA871D69D426`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_034C09CC4CEA4C2C49D7E38E246CAF7E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_A7E598AA485564A8C8C851BFA6B53A93`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_303497BB49BD2A9231891DB5C5933A0C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_7121A5704B5E6DF5B38C348C1E0CDA24`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_A77D5B7040ACAC78254E76A5F9718613`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_918C226B480A3AA1418E64B8BB7F499A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_13A758204C181CF5DDF322B07F64B189`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_AFB48EDE4B14EEB0DA92D58B69886C33`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_5FD6A85B4F7DF598F3AF8F82669BF2DF`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_2B172466446BC94194FF849D80A1604D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_E35A65C94707A51CEF8972B825A9CDED`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_0A04C55641FAF5B676EEAFA49950CFB5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_CACD505B487F80E3D98DB0B5B92A5623`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByInt_441D1A8F49979BF8795012B525517980`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_8468AFB54C36F366A8D8CA9D1A608A69`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_12E5DB1546E92FD70053B285CFE6EA9D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_226D019D4ECF3A5F471983A168375EFF`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByEnum_DCB6F2CD4662635C6D043184748F3B3E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_9E5B71EA47D208ACA3825FBB11BFA8A7`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByInt_854CC4DB431A6C7A69D81B9810914FEF`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_CF2151C84308AEEEBEBECFA5CF4D4D9D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_20E0B0AC45B4ADD28196189179A92DA3`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_F08C95B74C5C40B89771BD85DA289AE6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByEnum_6BE1D8B54D9E862D84220092C276B907`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_DC188AE3495CDC29C9C607A7BCE16442`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByInt_8844CCA94BC40239A52118903B43DC4E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_DAF9F17F48A167B4020F82B82849A46A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_6502799C470BA1A1F12D03B3636710EA`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_9ABD05D7456C0A0A06C772AC95EC77CD`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_9C2A805542E16C2984225F95A00FFBA6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_3A43E8654DB018C81D8F0A8445B42818`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_1A7FE2A34BB6BE12BCD1F1B609C0D82B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_9C124D314C9E32706D7982A23FC9662F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_00A5B821458FAB6188DFB690ECA421D9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_142FF32745AD35195C710B972006B408`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_B0F2920F4EF51E266DD3C9A45AAAB03A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByInt_386EB41A49FEAE97C8516B8D63EA945E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_0770DEEC4DCDF5682996EEABC719B19F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_6221B7B54CBEE3FA09C692B54B63179B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_B8F7FB314475E3603DCFF68839F150C8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_7111DBCA48DD9B35B64B13A31DA5B368`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_697CF1A54068F0238B2429BCCDDEE8DF`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_886EF0FB4B1A6B4BBBA6DEA0A3B90E24`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_7E0C8CAE4CBC47B0B0CEE8B51D1C4AA5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_ECCDDC574ECF2FDE469CD780490F38BB`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_0B5317564943AA0899D90FB383FFC7D5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_D552792B4F890E05DD246BA35FFA3579`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_CB2B5D0F4FC2334AA5C8BDB227F44187`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_EB080065416667E66B34309218799FA5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_2B12243340A764332333E2A4DB9E0541`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_A32AA97948FAB1BC73372FA235C9AA33`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_5260B98A478244486F06C5A3D6A96C48`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_A4B93E7E494CABDB197E39B19C0C7335`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_F0CD5D284B8C6C0C6C338090DE9E9169`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_2A71F77A4D0ED6307EFE769290921F5B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8F4893D54E3F7C3DF76BCE8E6D5FAF8B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_0841CCDF4B04E43BA8EA808ABAECBE7C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_B96D719F4E51C18004D855BFEC1B3C4E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_AC5FD0F543FAAAC962942587CB585EEF`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_433D6FEA486F397FE44D5D8773000BE0`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_098E4F784DE8536448C4729B76B530E2`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_2C3886684CC5D1B47060E0AD325CA7D7`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_318DD3D645B60056A3BD77A1EF52E615`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_AE15B42E463A36A4EAB13586F2F618C8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_7A6100F84F1642EAA1D7C9825A18D902`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_4C90188245F7F41704C7F8B2A8EF8AFF`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_862E87E24495AACE93887EB5953BD1FB`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequencePlayer_8AB2699F4B4D739682E805A1144ED7E0`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_AF07395C45F4AE31D4D91BA88AA39CB6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_1B739E444C6DEC9D0D321B849DD0884C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_3073ADFE46E9CD95173BE8B5FDAE571E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_386A9ED34C862E81753E50B183E86163`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_1CC44CEA46D5773AE63E74A6B0F913BC`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_3FF5171A4DCF2FD8E0AE57B34EFF3C48`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_AAFDBC8D4AC09E84ADDE998175A86BD5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8B7A39E541BEDE306DDC57AD3A8A15DC`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_E9127C144F6D66CBFFC707B730420D6A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_1E31BC084A889B805C5EAB805550FF79`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_4AD951ED4928C19AF50C66A626294C1A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_AB72F84D46F13A44E61820ABB8EE0B82`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByInt_6B9DF0AD41A6C77A55D19EA5F6016BFB`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_4BF560844CE338ADAB68479743DDCBB7`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_CC499D774A9D920E1E5273B8869B640F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_FB5C08594DB66D871D64AFBC3D0432A2`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_F20EC571492A5C56280534A21673E658`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_81F83CED413B9A01DEB15E8202600BD9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_0A2A194D4F8295C74AEBC5A48542F0FF`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_77C0BB8E436B5D2C091E58BBC708B8D8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_DBAA763447BBEE3D2F76A59A5846A2C8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_AB96CCC84DA89CC9073B0095D57AF859`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D66E77A94C2DBC5B06942F89048C2D2F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_24FBCA464E5CD0695F687F9726880BA2`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_694E0FBE4CC6AE947EF578B7B809EF76`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_5771DBE64FE7663894C0F4866ADB5B9C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_4086BA1D4CDEA113CAA598AD7437FC86`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_2B4DABB54F47D1A860FBA292194371FE`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_BC66C3D349CE851B21568ABA399423F4`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_2B2D729849661EE3354AE2836F0408A4`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D4C7AD9A43C6E19F525A1E920303C0C3`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_01A162FE48F487C82FE0ACA676763FF4`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_48B1A8BF413763E15B7C8481483F93C1`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_EC3A94344096E5B4A09864B08549CB77`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_43AB6D71414451D3E3805DBF6F265C80`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_0D4B09AC4BC4A72ABACB00BB1D7A453E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByInt_C5B30C4149A9E9D93D3178837BB3F989`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_7960ADAF4E86F291BADCC5A44F99661E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_6470A9FB4054AA4F21B5FD8984125FB2`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_43C0DD6044FCABB3AA49079C6D98B282`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_51299E8342D8D41BAB836F93416CF49F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_AE5FDAEB44F9E7A591B2D590CEEDF105`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_63E75E5F4F2BE884F6E4B1BD2F51F62F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_73BF85B6431E2C660269F999F5F40354`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_D17419B94658FD7BF2BE0E9897715C48`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_86F834B149866ADBB887F3B8F68B8CF1`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_06DE9F644D4D752DCD1E34AAA416ADA3`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_E0BD58D6490BC126003E6CAF1EA3F6A5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D577D1A14D09AB625A04F8A241C23D4C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_059C26984A208E6B4EBDF6A1F12F7C95`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_76782BA64E8156E60F3C02B7F51F3BB6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_C1B3CE3841FF59FAC9D0C3A3DAAD7428`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_E930DFF94004E56DD066AEB1C0E11986`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_249B167C431EFEF8DF2837A046206EA7`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_BlendListByInt_31F6AB4B4DB83936898F70B29D13AC26`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_7BECF953470DC05DD34AAB90F2AC7DA8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_4746C47C4E46B11D530152ABF64DE9C9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_BB74131C4204A110C964A085852DA86F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_SequenceEvaluator_D28538F54033A20875D1178373813AB6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_651551F64250C3C6252CB1A1FB726F04`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_2385C672451BC8FC3E701AB71D7897D9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_707C8E2746737ECF4F69BB99694B0E56`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_4EB877234979414AE7C2F8BBDF963AE4`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_B8F35B5547FB77D7A763EA8B4FE2EBE6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_57FEADF94F5662BEEED8FF972524119C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D5184EBA49700D8A366FAD97897E38A7`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_3758BCE74A5B9561DFDAEDAD6EFB6A4D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8EFA8DA34D6F75566F25F788190517FE`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_CC53911E49416E9B86CFAD89F8D1A247`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_687D12474232C89FF8DBEB9F78C6419C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_0E2273F745B4FCBF6E2AE5878E077461`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_61C8DDD640FE3D14C511F78031F85372`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D39744E84E0916E724563D8D6FDDFB50`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_19B4A1204634AE67EFDFE8BDB7C4A499`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_19BD2B314CB6449138DEF489DDB36CA3`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_B890803A448FCF41F49EFFA66A46622F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8298217D4375BCE8179AF4BAFB937391`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_DA8A491F4BCD78B4C32470860E7126E4`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_9846DDB64B10A1B85EAF20A1F739BEBB`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D3D376C547A0F7B17C9DEBB1ED7399D6`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_7FADF57A41F67FB2462114A1E4D93755`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_A079B0AF4567C743F8C91294EF3C83F3`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_076837A34355E9BFB7EE1AA7D304B1A9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_ACAA2B164231EFC1629D688B24F7D579`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D22872B241258C96DDE40283DD08F2EC`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D69EE4B947E2E2BC85F142B857FE0D40`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_4EE99E0D4B1ED290C56B39930491D3B3`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8BDF2D12408C9DAAC5AB08BEF4BDF790`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D2BC4E5D4755D5A78678B8839D5BC013`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_FB37D1A141FC9D8041800D9143DD35CC`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_26DE064A467E9889E76AC6872637D25D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_BF0FA94E437C1E0E8D00798C8A167671`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_C3BAB10D4F4864E520B18D9A20AD98D3`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_1E2B3854486486011C48928B35CBA85B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_50176C9144E2C91CFACD9D83F23A62A7`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_C7A856BD42E0F0D11321E1BC0AA12F5D`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_2A81BBF8400490A3E01F4186FC7F28AF`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_2BEEFFC345BFF48BEC71D19618F08A32`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_F8AFDAF347198A305F28E499083FC9F9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_CC0B70FF440DA4E01D01BB91B090E64E`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_12BCD869492C820F677ED4A947C4E95B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_C426B58140B7F5EEBDDC758F1F9D4865`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_4849C2FA451A6B423A485BBDB5B8AB09`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_487DAFCA4C914BD5E3C2B78005D05662`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8C98DD92497158DBE93606A860D448E9`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_2B80D01843D09FA4B35D2F82D40DE807`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_44AC17E94DCA4C381EF6E1B621638AB5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_4913A3744B254360C880C2916FD0C58B`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_DA82501045FCAD12B3F57BBCCFE99F46`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_48DEC15F4AC67AFF541C019237CD8254`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_AAAADA7B45185CADFE96428ADAD657C8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_7A81ED9146384FF30C1278938EEE09A1`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_CE72B4444366A93EB2FBAEB538D6CE5F`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_0A1E6D3B447FC782536A229DF1EB0B73`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_53E4D9D14346BC3FAE78849B209026F4`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_A3C07E824E54757A7F5A44B317D8B6D5`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_B0EA8B19421D684A55794D8A87141BA7`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_2751953B45FE9E00517E9D9E4561EAF8`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_16F0583543104852527625B0BB92857A`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_0BB469CE46642D239596AB82C0062D65`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_8DF3000A43B35D289DF16787F61552FE`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_ModifyCurve_2A21B69042BF9C95EC896CBF3E10824C`
- 🟢 `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_MultiWayBlend_AE8269F744CF4D2EB2A12097DE76F891`
- 🔀 Contém `33` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `TryGetPawnOwner()`
- 🛠️ `Delay()`
- 🛠️ `PlaySlotAnimationAsDynamicMontage()`
- 🛠️ `StopSlotAnimation()`
- 🛠️ `PlayTransition()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `CanOverlayTransition()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `UpdateAimingValues()`
- 🛠️ `UpdateMovementValues()`
- 🛠️ `UpdateInAirValues()`
- 🛠️ `DynamicTransitionCheck()`
- 🛠️ `TurnInPlaceCheck()`
- 🛠️ `CanDynamicTransition()`
- 🛠️ `CanTurnInPlace()`
- 🛠️ `CanRotateInPlace()`
- 🛠️ `RotateInPlaceCheck()`
- 🛠️ `UpdateLayerValues()`
- 🛠️ `UpdateCharacterInfo()`
- 🛠️ `NotEqual_DoubleDouble()`
- 🛠️ `ShouldMoveCheck()`
- 🛠️ `UpdateRagdollValues()`
- 🛠️ `UpdateRotationValues()`
- 🛠️ `UpdateFootIK()`
- 🛠️ `WeaponData()`
- 🛠️ `GetChar_Mesh()`
- 🛠️ `GetChar_CurrentWeapon()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `K2_SetActorRelativeRotation()`
- 🛠️ `K2_SetActorRelativeLocation()`
- 🛠️ `GetPlayerPawn()`
- 🛠️ `BPI_Set_OverlayState()`
- 🛠️ `GetChar_WeaponSystem()`
- 🛠️ `SetActorHiddenInGame()`
- 🛠️ `DropMagazine()`
- 🛠️ `PickupMagazine()`
- 🛠️ `InsertMagazine()`
- 🛠️ `AttachInHand()`
- 🛠️ `Not_PreBool()`
- 🛠️ `BreakVector2D()`
- 🛠️ `InRange_FloatFloat()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `EqualEqual_ByteByte()`
- 🛠️ `NotEqual_ByteByte()`
- 🛠️ `GetCurveValue()`
- 🛠️ `Abs()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `BreakVector()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get AimSweepTime`
- `Get Arm_L_Add`
- `Get Arm_L_LS`
- `Get Arm_L_MS`
- `Get Arm_R_Add`
- `Get Arm_R_LS`
- `Get Arm_R_MS`
- `Get BYaw`
- `Get BasePose_CLF`
- `Get BasePose_N`
- `Get Character`
- `Get CrouchingPlayRate`
- `Get CurrentWeapon`
- `Get Dead`
- `Get DeltaTimeX`
- `Get DiagonalScaleAmount`
- `Get Enable_AimOffset`
- `Get Enable_HandIK_L`
- `Get Enable_HandIK_R`
- `Get FYaw`
- `Get FallSpeed`
- `Get FlailRate`
- `Get FootLock_L_Alpha`
- `Get FootLock_L_Location`
- `Get FootLock_L_Rotation`
- `Get FootLock_R_Alpha`
- `Get FootLock_R_Location`
- `Get FootLock_R_Rotation`
- `Get FootOffset_L_Location`
- `Get FootOffset_L_Rotation`
- `Get FootOffset_R_Location`
- `Get FootOffset_R_Rotation`
- `Get ForwardYawTime`
- `Get Gait`
- `Get GroundedEntryState`
- `Get Hand_L`
- `Get Hand_R`
- `Get HasMovementInput`
- `Get Head_Add`
- `Get HideWeapon`
- `Get InputYawOffsetTime`
- `Get Is Shooting`
- `Get Is on Fire Rate Delay`
- `Get IsMoving`
- `Get JumpPlayRate`
- `Get Jumped`
- `Get LYaw`
- `Get LandPrediction`
- `Get LeanAmount`
- `Get LeftYawTime`
- `Get MovementAction`
- `Get MovementDirection`
- `Get MovementState`
- `Get OverlayOverrideState`
- `Get OverlayState`
- `Get PelvisAlpha`
- `Get PelvisOffset`
- `Get Pivot`
- `Get RYaw`
- `Get RelativeAccelerationAmount`
- `Get RightYawTime`
- `Get RotateRate`
- `Get Rotate_L`
- `Get Rotate_R`
- `Get RotationMode`
- `Get RotationScale`
- `Get ShouldMove`
- `Get SmoothedAimingAngle`
- `Get Speed`
- `Get SpineRotation`
- `Get Spine_Add`
- `Get Stance`
- `Get StandingPlayRate`
- `Get StrideBlend`
- `Get TrackedHipsDirection`
- `Get TriggerPivotSpeedLimit`
- `Get VelocityBlend`
- `Get WalkRunBlend`
- `Get WeaponData`
- `Set Character`
- `Set Damage Anim`
- `Set Dead`
- `Set DeltaTimeX`
- `Set ElapsedDelayTime`
- `Set GroundedEntryState`
- `Set Is Shooting`
- `Set JumpPlayRate`
- `Set Jumped`
- `Set OverlayOverrideState`
- `Set Pivot`
- `Set Rotate_L`
- `Set Rotate_R`
- `Set ShouldMove`
- `Set TrackedHipsDirection`

### 📌 Grafo: `AnimGraphNode_StateMachine_3`

**Comentários e Títulos de Seção Encontrados:**
- *"Apply Forward Yaw Offset"*
- *"Blend forwards facing cycles together."*
- *"This state machine blends the directional cycles together based on the movement direction and the \'HipOrientation_Bias\' curve in order to achieve superior blending when switching directions or changing hip rotation. The L->R / F->B (center) transitions also trigger pivots via a notify event."*

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get FYaw`
- `Get VelocityBlend`

### 📌 Grafo: `AnimGraphNode_StateMachine_7`

**Comentários e Títulos de Seção Encontrados:**
- *"Blend forwards facing cycles together."*
- *"Apply Forward Yaw Offset"*
- *"This state machine blends the directional cycles together based on the movement direction and the \'HipOrientation_Bias\' curve in order to achieve superior blending when switching directions or changing hip rotation."*

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `EqualEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get FYaw`
- `Get VelocityBlend`

### 📌 Grafo: `AnimGraphNode_StateMachine_8`

### 📌 Grafo: `AnimGraphNode_StateMachine_12`

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get HasMovementInput`
- `Get InputYawOffsetTime`

### 📌 Grafo: `AnimGraphNode_StateMachine_13`

**Funções e Métodos Chamados:**
- 🛠️ `BreakVector2D()`
- 🛠️ `InRange_FloatFloat()`
- 🛠️ `NotEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get ForwardYawTime`
- `Get LeftYawTime`
- `Get RightYawTime`
- `Get SmoothedAimingAngle`

### 📌 Grafo: `AnimationStateGraph_10`

**Comentários e Títulos de Seção Encontrados:**
- *"This pose snapshot is saved in the CharacterBP in the RagdollEnd function."*

### 📌 Grafo: `AnimGraphNode_StateMachine_14`

**Comentários e Títulos de Seção Encontrados:**
- *"These poses are parts of the locomotion cycles where the Left foot IS fully planted down."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*
- *"Only apply the new foot location on the left leg."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*
- *"If the character stops while a foot is planted down, lock the correct foot."*
- *"If the character stops while a foot is NOT planted down, play a section of the cycle where the foot IS down, and lock it."*
- *"Choose whether a foot is planted or about to plant when stopping using the \'Feet_Position\' anim curve. A value <.5 means the foot is planted, and a value >.5 means the foot is still in the air."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*
- *"The \'Feet_Position\' curve also determines which foot is planted (or about to plant). Positive values mean the right foot is planted, negative values mean the left."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*
- *"Additive stopping transitions are triggered via the \"*

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `Abs()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get TrackedHipsDirection`
- `Get VelocityBlend`

### 📌 Grafo: `AnimationStateGraph_17`

**Comentários e Títulos de Seção Encontrados:**
- *"These poses are parts of the locomotion cycles where the Left foot IS fully planted down."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*
- *"Only apply the new foot location on the left leg."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*

### 📌 Grafo: `AnimationStateGraph_18`

**Comentários e Títulos de Seção Encontrados:**
- *"These poses are parts of the locomotion cycles where the Right foot IS fully planted down."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*
- *"Only apply the new foot location on the right leg."*
- *"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"*

### 📌 Grafo: `AnimationStateGraph_26`

**Comentários e Títulos de Seção Encontrados:**
- *"Apply Leaning Additive"*
- *"Apply Diagonal Scaling"*
- *"Crouch Walk Locomotion Cycles"*
- *"Blend all Locomotion Cycles together"*
- *"Slow movement pose"*

### 📌 Grafo: `AnimationStateGraph_33`

**Comentários e Títulos de Seção Encontrados:**
- *"Apply Leaning Additive to only the Run and Sprint animations by using the Weight_Gait curve as an alpha."*
- *"Apply Diagonal Scaling"*
- *"Walk / Run Locomotion Cycles"*
- *"Sprinting Cycles"*
- *"Blend all Locomotion Cycles together"*

### 📌 Grafo: `AnimGraphNode_StateMachine_15`

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `GreaterEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get JumpPlayRate`
- `Get Speed`

### 📌 Grafo: `AnimationStateGraph_50`

**Comentários e Títulos de Seção Encontrados:**
- *"Idle / Movement Poses"*
- *"In Air Poses"*
- *"Secondary Motion"*

### 📌 Grafo: `AnimationStateGraph_51`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Idle Pose"*
- *"Not Aiming Poses"*
- *"Secondary Motion"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Idle Pose"*
- *"Walk / Run Pose"*
- *"Crouched Pose"*
- *"Aiming Poses"*
- *"Walk / Run Pose"*
- *"Sprinting Pose"*
- *"Mantle 1M Pose"*
- *"Land Roll Pose"*
- *"Get Up Pose"*

### 📌 Grafo: `AnimationStateGraph_52`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Idle Pose"*
- *"Walk / Run / Sprint Pose"*
- *"Not Aiming Poses"*
- *"Secondary Motion"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Idle Pose"*
- *"Walk / Run Pose"*
- *"Crouched Pose"*
- *"Aiming Poses"*
- *"Mantle 1M Pose"*
- *"Land Roll Pose"*
- *"Get Up Pose"*

### 📌 Grafo: `AnimationStateGraph_53`

**Comentários e Títulos de Seção Encontrados:**
- *"Crouched Pose"*
- *"Idle Pose"*
- *"Standing Poses"*
- *"Walk / Run / Sprint Pose"*
- *"Secondary Motion"*
- *"Mantle 1M Pose"*
- *"Land Roll Pose"*
- *"Get Up Pose"*

### 📌 Grafo: `AnimationStateGraph_54`

**Comentários e Títulos de Seção Encontrados:**
- *"Crouched Pose"*
- *"Idle Pose"*
- *"Standing Poses"*
- *"Walk / Run / Sprint Pose"*
- *"Secondary Motion"*

### 📌 Grafo: `AnimationStateGraph_55`

**Comentários e Títulos de Seção Encontrados:**
- *"Idle / Movement Poses"*
- *"In Air Poses"*
- *"Secondary Motion"*

### 📌 Grafo: `AnimationStateGraph_56`

**Comentários e Títulos de Seção Encontrados:**
- *"Idle / Movement Poses"*
- *"In Air Poses"*
- *"Secondary Motion"*

### 📌 Grafo: `AnimationStateGraph_57`

**Comentários e Títulos de Seção Encontrados:**
- *"Idle / Movement Poses"*
- *"In Air Poses"*
- *"Secondary Motion"*

### 📌 Grafo: `AnimationStateGraph_58`

**Comentários e Títulos de Seção Encontrados:**
- *"Idle / Movement Poses"*
- *"In Air Poses"*
- *"Secondary Motion"*

### 📌 Grafo: `AnimationStateGraph_59`

**Comentários e Títulos de Seção Encontrados:**
- *"Rifle States"*
- *"Mantle 1M Pose"*
- *"Land Roll Pose"*
- *"Get Up Pose"*
- *"Rifle States"*

### 📌 Grafo: `AnimGraphNode_StateMachine_17`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walking Pose"*
- *"Running Poses"*
- *"Sprinting Poses"*
- *"In Air Poses"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*
- *"Crouching Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get AimSweepTime`
- `Get BasePose_CLF`
- `Get BasePose_N`
- `Get LandPrediction`
- `Get RelativeAccelerationAmount`
- `Get VelocityBlend`

### 📌 Grafo: `AnimGraphNode_StateMachine_16`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walking Pose"*
- *"Running Poses"*
- *"Sprinting Poses"*
- *"In Air Poses"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*
- *"Crouching Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get AimSweepTime`
- `Get BasePose_CLF`
- `Get BasePose_N`
- `Get LandPrediction`
- `Get RelativeAccelerationAmount`
- `Get VelocityBlend`

### 📌 Grafo: `AnimationStateGraph_60`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walking Pose"*
- *"Running Poses"*
- *"Sprinting Poses"*
- *"In Air Poses"*

### 📌 Grafo: `AnimationStateGraph_61`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*

### 📌 Grafo: `AnimationStateGraph_62`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouching Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*

### 📌 Grafo: `AnimationStateGraph_63`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*

### 📌 Grafo: `AnimationStateGraph_64`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walking Pose"*
- *"Running Poses"*
- *"Sprinting Poses"*
- *"In Air Poses"*

### 📌 Grafo: `AnimationStateGraph_65`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*

### 📌 Grafo: `AnimationStateGraph_66`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouching Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*

### 📌 Grafo: `AnimationStateGraph_67`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*

### 📌 Grafo: `AnimationStateGraph_68`

**Comentários e Títulos de Seção Encontrados:**
- *"Pistol 1H States"*
- *"Mantle 1M Pose"*
- *"Land Roll Pose"*
- *"Get Up Pose"*
- *"Pistol 1H States"*

### 📌 Grafo: `AnimGraphNode_StateMachine_19`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Idle Pose"*
- *"Run / Walk Pose"*
- *"Standing Poses"*
- *"Sprint Pose"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*

**Variáveis Manipuladas:**
- `Get AimSweepTime`
- `Get BasePose_CLF`
- `Get BasePose_N`

### 📌 Grafo: `AnimGraphNode_StateMachine_18`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Idle Pose"*
- *"Run / Walk Pose"*
- *"Standing Poses"*
- *"Sprint Pose"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*

**Variáveis Manipuladas:**
- `Get AimSweepTime`
- `Get BasePose_CLF`
- `Get BasePose_N`

### 📌 Grafo: `AnimationStateGraph_69`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Idle Pose"*
- *"Run / Walk Pose"*
- *"Standing Poses"*
- *"Sprint Pose"*

### 📌 Grafo: `AnimationStateGraph_70`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*

### 📌 Grafo: `AnimationStateGraph_71`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*

### 📌 Grafo: `AnimationStateGraph_72`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Idle Pose"*
- *"Run / Walk Pose"*
- *"Standing Poses"*
- *"Sprint Pose"*

### 📌 Grafo: `AnimationStateGraph_73`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*

### 📌 Grafo: `AnimationStateGraph_74`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*

### 📌 Grafo: `AnimationStateGraph_75`

**Comentários e Títulos de Seção Encontrados:**
- *"Mantle 1M Pose"*
- *"Land Roll Pose"*
- *"Get Up Pose"*
- *"Pistol 2H States"*

### 📌 Grafo: `AnimGraphNode_StateMachine_20`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Idle Pose"*
- *"Run / Walk Pose"*
- *"Standing Poses"*
- *"Sprint Pose"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`

**Variáveis Manipuladas:**
- `Get AimSweepTime`
- `Get BasePose_CLF`
- `Get BasePose_N`

### 📌 Grafo: `AnimationStateGraph_76`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Idle Pose"*
- *"Run / Walk Pose"*
- *"Standing Poses"*
- *"Sprint Pose"*

### 📌 Grafo: `AnimationStateGraph_77`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*

### 📌 Grafo: `AnimationStateGraph_78`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*

### 📌 Grafo: `AnimationStateGraph_79`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*

### 📌 Grafo: `AnimationStateGraph_80`

**Comentários e Títulos de Seção Encontrados:**
- *"Bow States"*
- *"Mantle 1M Pose"*
- *"Land Roll Pose"*
- *"Get Up Pose"*

### 📌 Grafo: `AnimGraphNode_StateMachine_21`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walking Pose"*
- *"Running Pose"*
- *"Sprinting Pose"*
- *"Crouched Aim Sweep"*
- *"Crouched Pose"*
- *"Crouching Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*

**Variáveis Manipuladas:**
- `Get AimSweepTime`
- `Get BasePose_CLF`
- `Get BasePose_N`

### 📌 Grafo: `AnimationStateGraph_81`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouched Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walking Pose"*
- *"Running Pose"*
- *"Sprinting Pose"*

### 📌 Grafo: `AnimationStateGraph_82`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Standing Aim Sweep"*
- *"Crouched Aim Sweep"*
- *"Standing Poses"*
- *"Crouched Pose"*

### 📌 Grafo: `AnimationStateGraph_83`

**Comentários e Títulos de Seção Encontrados:**
- *"Secondary Motion"*
- *"Crouching Pose"*
- *"Standing Poses"*
- *"Idle Pose"*
- *"Walk / Running Pose"*

### 📌 Grafo: `AnimationTransitionGraph_138`

**Variáveis Manipuladas:**
- `Get OverlayState`

### 📌 Grafo: `AnimationTransitionGraph_141`

**Variáveis Manipuladas:**
- `Get OverlayState`

### 📌 Grafo: `AnimationTransitionGraph_144`

**Variáveis Manipuladas:**
- `Get OverlayState`

### 📌 Grafo: `AnimationTransitionGraph_150`

**Variáveis Manipuladas:**
- `Get OverlayState`

### 📌 Grafo: `AnimationTransitionGraph_153`

**Variáveis Manipuladas:**
- `Get OverlayState`

### 📌 Grafo: `AnimationTransitionGraph_156`

**Variáveis Manipuladas:**
- `Get OverlayState`

### 📌 Grafo: `AnimationStateGraph_84`

**Comentários e Títulos de Seção Encontrados:**
- *"Apply Forward Yaw Offset"*
- *"Blend forwards facing cycles together."*

### 📌 Grafo: `AnimationStateGraph_85`

**Comentários e Títulos de Seção Encontrados:**
- *"Blend backwards facing cycles together."*
- *"Apply Backwards Yaw Offset"*

### 📌 Grafo: `AnimationStateGraph_86`

**Comentários e Títulos de Seção Encontrados:**
- *"Blend Right facing cycles together."*
- *"Apply Right Yaw Offset"*

### 📌 Grafo: `AnimationStateGraph_87`

**Comentários e Títulos de Seção Encontrados:**
- *"Blend Left facing cycles together."*
- *"Apply Right Yaw Offset"*

### 📌 Grafo: `AnimationStateGraph_88`

**Comentários e Títulos de Seção Encontrados:**
- *"Blend Left facing cycles together."*
- *"Apply Left Yaw Offset"*

### 📌 Grafo: `AnimationStateGraph_89`

**Comentários e Títulos de Seção Encontrados:**
- *"Blend Right facing cycles together."*
- *"Apply Left Yaw Offset"*

### 📌 Grafo: `AnimationStateGraph_90`

**Comentários e Títulos de Seção Encontrados:**
- *"Blend forwards facing cycles together."*
- *"Apply Forward Yaw Offset"*

### 📌 Grafo: `AnimationStateGraph_91`

**Comentários e Títulos de Seção Encontrados:**
- *"Blend backwards facing cycles together."*
- *"Apply Backwards Yaw Offset"*

### 📌 Grafo: `AnimationStateGraph_92`

**Comentários e Títulos de Seção Encontrados:**
- *"Blend Right facing cycles together."*
- *"Apply Right Yaw Offset"*

### 📌 Grafo: `AnimationStateGraph_93`

**Comentários e Títulos de Seção Encontrados:**
- *"Blend Left facing cycles together."*
- *"Apply Right Yaw Offset"*

### 📌 Grafo: `AnimationStateGraph_94`

**Comentários e Títulos de Seção Encontrados:**
- *"Blend Left facing cycles together."*
- *"Apply Left Yaw Offset"*

### 📌 Grafo: `AnimationStateGraph_95`

**Comentários e Títulos de Seção Encontrados:**
- *"Blend Right facing cycles together."*
- *"Apply Left Yaw Offset"*

### 📌 Grafo: `IsDead`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `DamageAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Pistol 2H Relaxed->Ready`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Pistol 2H Ready->Relaxed`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `BPI_SetOverlayOverrideState`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `PlayDynamicTransition`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Pivot`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Hips RF`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Hips RB`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Hips LF`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Hips LB`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Hips B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Hips F`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Pistol 1H Relaxed->Ready`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Pistol 1H Ready->Relaxed`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_M4A1 Relaxed->Ready`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_M4A1 Ready->Relaxed`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Bow Relaxed->Ready`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Bow Ready->Relaxed`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Reset-GroundedEntryState`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `BPI_SetGroundedEntryState`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `BPI_Jumped`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_->N QuickStop `

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Land->Idle`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_->N Stop R`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_->N Stop L`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_Roll->Idle`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `PlayTransition`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_StopTransition`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_->CLF Stop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `BlueprintInitializeAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `BlueprintUpdateAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_AttachInHand`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_InsertMagazine`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_PickupMagazine`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_DropMagazine`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `ShootingAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_UnequipWeapon`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimNotify_EquipWeapon`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `PlayAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_AAAADA7B45185CADFE96428ADAD657C8`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_48DEC15F4AC67AFF541C019237CD8254`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_DA82501045FCAD12B3F57BBCCFE99F46`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_4913A3744B254360C880C2916FD0C58B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_44AC17E94DCA4C381EF6E1B621638AB5`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_2B80D01843D09FA4B35D2F82D40DE807`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8C98DD92497158DBE93606A860D448E9`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_487DAFCA4C914BD5E3C2B78005D05662`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_26DE064A467E9889E76AC6872637D25D`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_FB37D1A141FC9D8041800D9143DD35CC`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D2BC4E5D4755D5A78678B8839D5BC013`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8BDF2D12408C9DAAC5AB08BEF4BDF790`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_4EE99E0D4B1ED290C56B39930491D3B3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D69EE4B947E2E2BC85F142B857FE0D40`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D22872B241258C96DDE40283DD08F2EC`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_ACAA2B164231EFC1629D688B24F7D579`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_076837A34355E9BFB7EE1AA7D304B1A9`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_A079B0AF4567C743F8C91294EF3C83F3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_7FADF57A41F67FB2462114A1E4D93755`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D3D376C547A0F7B17C9DEBB1ED7399D6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_9846DDB64B10A1B85EAF20A1F739BEBB`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_DA8A491F4BCD78B4C32470860E7126E4`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8298217D4375BCE8179AF4BAFB937391`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_B890803A448FCF41F49EFFA66A46622F`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_19BD2B314CB6449138DEF489DDB36CA3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_19B4A1204634AE67EFDFE8BDB7C4A499`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D39744E84E0916E724563D8D6FDDFB50`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_61C8DDD640FE3D14C511F78031F85372`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_0E2273F745B4FCBF6E2AE5878E077461`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_687D12474232C89FF8DBEB9F78C6419C`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_CC53911E49416E9B86CFAD89F8D1A247`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8EFA8DA34D6F75566F25F788190517FE`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_3758BCE74A5B9561DFDAEDAD6EFB6A4D`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D5184EBA49700D8A366FAD97897E38A7`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_57FEADF94F5662BEEED8FF972524119C`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_B8F35B5547FB77D7A763EA8B4FE2EBE6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_4EB877234979414AE7C2F8BBDF963AE4`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_707C8E2746737ECF4F69BB99694B0E56`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_2385C672451BC8FC3E701AB71D7897D9`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_E930DFF94004E56DD066AEB1C0E11986`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_C1B3CE3841FF59FAC9D0C3A3DAAD7428`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_76782BA64E8156E60F3C02B7F51F3BB6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_059C26984A208E6B4EBDF6A1F12F7C95`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D577D1A14D09AB625A04F8A241C23D4C`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_E0BD58D6490BC126003E6CAF1EA3F6A5`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_86F834B149866ADBB887F3B8F68B8CF1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_0D4B09AC4BC4A72ABACB00BB1D7A453E`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_43AB6D71414451D3E3805DBF6F265C80`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_EC3A94344096E5B4A09864B08549CB77`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_48B1A8BF413763E15B7C8481483F93C1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_01A162FE48F487C82FE0ACA676763FF4`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D4C7AD9A43C6E19F525A1E920303C0C3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_2B2D729849661EE3354AE2836F0408A4`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_24FBCA464E5CD0695F687F9726880BA2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D66E77A94C2DBC5B06942F89048C2D2F`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_AB96CCC84DA89CC9073B0095D57AF859`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_DBAA763447BBEE3D2F76A59A5846A2C8`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_77C0BB8E436B5D2C091E58BBC708B8D8`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_0A2A194D4F8295C74AEBC5A48542F0FF`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_4AD951ED4928C19AF50C66A626294C1A`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_1E31BC084A889B805C5EAB805550FF79`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_E9127C144F6D66CBFFC707B730420D6A`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8B7A39E541BEDE306DDC57AD3A8A15DC`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_AAFDBC8D4AC09E84ADDE998175A86BD5`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_3FF5171A4DCF2FD8E0AE57B34EFF3C48`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_386A9ED34C862E81753E50B183E86163`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_0841CCDF4B04E43BA8EA808ABAECBE7C`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8F4893D54E3F7C3DF76BCE8E6D5FAF8B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_2A71F77A4D0ED6307EFE769290921F5B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_F0CD5D284B8C6C0C6C338090DE9E9169`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_A4B93E7E494CABDB197E39B19C0C7335`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_A32AA97948FAB1BC73372FA235C9AA33`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_E35A65C94707A51CEF8972B825A9CDED`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_2B172466446BC94194FF849D80A1604D`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_5FD6A85B4F7DF598F3AF8F82669BF2DF`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_AFB48EDE4B14EEB0DA92D58B69886C33`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_918C226B480A3AA1418E64B8BB7F499A`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_A77D5B7040ACAC78254E76A5F9718613`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_7121A5704B5E6DF5B38C348C1E0CDA24`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_303497BB49BD2A9231891DB5C5933A0C`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_A7E598AA485564A8C8C851BFA6B53A93`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_034C09CC4CEA4C2C49D7E38E246CAF7E`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_AA38513C492D8024731ECA871D69D426`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D121A99F4C785E9A77C6439118119DB4`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8D1528064F6F3CEF01B1A4B755AEF9A5`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_177A31A640F610A5E40724A679199460`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TwoWayBlend_C8FF4D0846262FC0CE2E989311F7C344`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_960B9C9044884B1B7ABC2685E04B1B02`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_F39C4C484731D910E49B6492253E521E`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D581D1814B7D6F7984E74EB17FE2F624`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_249C850645754815B381F6B1842827AA`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_CDF54F5E41641CB8B61BBB8CCF7EFBE3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_0DFDE3984234363C0EB4B5BE03C49903`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_0B5586354B36E07719742AA3BA64F1AE`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_2301A22B4097DC6B72ACC3B5FAC7E95D`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_064EDEC5405E797A995D639F6EE21501`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_B2CD3DB24833E492578AECA742A6BA20`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_28AA257246E463AA11DF088175BD7AC7`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_C05074EA4C692CA3D0EE0D824950B007`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_FE28013D4D987D95188D09A1321EC7A6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_672A34C944AB9921F4942990F1354F03`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_1DE90E884749DE0F89109A9751255267`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_48370AE243CFBD2C310D7ABC946CA2F1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_3947CF1A4EE017EAA3A3618434F9F5C1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_7A539FFA41A096B997A36398E3C19E1C`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_08F8312E4F928604408FADB218C6AA54`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_EC2571C04D853134A08B9897A826D426`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_4B81839C4A471C7C53F2F3888E796C64`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_530BEFFD4C7CB134F588D888BDAE1BB4`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_C6577CB94569EDDC4FA068B0507D33EF`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_35CD80E244073BA17C589F94F80B8566`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_28E8899D4D01BDC49CABE28FC0556B45`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_DF397FB844879312BB5BFE9277AB2E10`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_57D645EF47AAC5A2CD2AF2A3E180F56D`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D0A5EBB94DD0D29A130CCDB1837D4AD8`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_F2C7170B49F2ED80831942AB21853951`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_09FE0A4245374506B1866C9C6D6BF91D`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_1A2FD9414A4589E656EA35B8BEA2D943`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_FF9F05024865FF78C61EE7BF727F2CDA`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_BCB6B9F0433250A004EFACA7D0140FAA`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_DD0CDD1C42B00AC0FEA40E8043554B98`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_BC38E67C4A1EDD602616948086FCF24F`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_6B3F516942CE131F70193EA081991F44`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_F11F3463497098C289C790BF1328875E`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_907081E84AFD6D7C8CC125ACCF93F61F`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_D4AFFB9B40841BC062C7A6BE70D034E3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_8F1743BF4B5639DCE929F198E8410475`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_CDF7792E4B7FD4B26F742D9A76BE4C6F`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_04A29F7048F137CC383A10B207C2D99B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_677E99374D02342093738ABBAE01642D`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_839E09784828992E8362989200793B2C`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_3CB174E6444EDEB70617318A2964487B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `EvaluateGraphExposedInputs_ExecuteUbergraph_ALS_AnimBP_AnimGraphNode_TransitionResult_333743C24C21EEA2DD11C6A20CBBFDBE`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `WPN_SetWeaponToInteract`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AnimBP_SetAnimations`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `PC_SetHUD`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `WPN_CantShoot`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `WPN_Recoil`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `AmmoPickup`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `CharBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `SetHealth`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `SetDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `SetArmour`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `IsJetpack`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `IsJumping`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `Death`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_AnimBP()`

### 📌 Grafo: `UpdateCharacterInfo_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Get Information from the Character via the Character Interface to use throughout the AnimBP and AnimGraph."*

**Funções e Métodos Chamados:**
- 🛠️ `BPI_Get_EssentialValues()`
- 🛠️ `BPI_Get_CurrentStates()`

**Variáveis Manipuladas:**
- `Get Character`
- `Set Acceleration`
- `Set AimYawRate`
- `Set AimingRotation`
- `Set Gait`
- `Set HasMovementInput`
- `Set IsMoving`
- `Set MovementAction`
- `Set MovementInput`
- `Set MovementInputAmount`
- `Set MovementState`
- `Set OverlayState`
- `Set PrevMovementState`
- `Set RotationMode`
- `Set Speed`
- `Set Stance`
- `Set Velocity`
- `Set ViewMode`

### 📌 Grafo: `UpdateAimingValues_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Interp the Aiming Rotation value to achieve smooth aiming rotation changes. Interpolating the rotation before calculating the angle ensures the value is not affected by changes in actor rotation, allowing slow aiming rotation changes with fast actor rotation changes."*
- *"Calculate the Aiming angle and Smoothed Aiming Angle by getting the delta between the aiming rotation and the actor rotation."*
- *"Use the Aiming Yaw Angle divided by the number of spine+pelvis bones to get the amount of spine rotation needed to remain facing the camera direction."*
- *"Get the delta between the Movement Input rotation and Actor rotation and map it to a range of 0-1. This value is used in the aim offset behavior to make the character look toward the Movement Input."*
- *"Separate the Aiming Yaw Angle into 3 separate Yaw Times. These 3 values are used in the Aim Offset behavior to improve the blending of the aim offset when rotating completely around the character. This allows you to keep the aiming responsive but still smoothly blend from left to right or right to left."*
- *"Clamp the Aiming Pitch Angle to a range of 1 to 0 for use in the vertical aim sweeps."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MapRangeClamped()`
- 🛠️ `Abs()`
- 🛠️ `RInterpTo()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `FInterpTo()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `MakeVector2D()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `BreakRotator()`
- 🛠️ `BreakVector2D()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get AimingAngle`
- `Get AimingRotation`
- `Get Character`
- `Get DeltaTimeX`
- `Get HasMovementInput`
- `Get InputYawOffsetInterpSpeed`
- `Get InputYawOffsetTime`
- `Get MovementInput`
- `Get RotationMode`
- `Get SmoothedAimingAngle`
- `Get SmoothedAimingRotation`
- `Get SmoothedAimingRotationInterpSpeed`
- `Set AimSweepTime`
- `Set AimingAngle`
- `Set ForwardYawTime`
- `Set InputYawOffsetTime`
- `Set LeftYawTime`
- `Set RightYawTime`
- `Set SmoothedAimingAngle`
- `Set SmoothedAimingRotation`
- `Set SpineRotation`

### 📌 Grafo: `UpdateLayerValues_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the Base Pose weights"*
- *"Set the Additive amount weights for each body part"*
- *"Get the Aim Offset weight by getting the opposite of the Aim Offset Mask."*
- *"Set the Hand Override weights"*
- *"Blend and set the Hand IK weights to ensure they only are weighted if allowed by the Arm layers."*
- *"Set whether the arms should blend in mesh space or local space. The Mesh space weight will always be 1 unless the Local Space (LS) curve is fully weighted."*

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `FFloor()`
- 🛠️ `Lerp()`
- 🛠️ `GetCurveValue()`

**Variáveis Manipuladas:**
- `Get Arm_L_LS`
- `Get Arm_R_LS`
- `Set Arm_L_Add`
- `Set Arm_L_LS`
- `Set Arm_L_MS`
- `Set Arm_R_Add`
- `Set Arm_R_LS`
- `Set Arm_R_MS`
- `Set BasePose_CLF`
- `Set BasePose_N`
- `Set Enable_AimOffset`
- `Set Enable_HandIK_L`
- `Set Enable_HandIK_R`
- `Set Hand_L`
- `Set Hand_R`
- `Set Head_Add`
- `Set Spine_Add`

### 📌 Grafo: `UpdateFootIK_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Update all Foot Lock and Foot Offset values when not In Air"*
- *"Reset IK Offsets if In Air"*
- *"Update Foot Locking values."*

**Funções e Métodos Chamados:**
- 🛠️ `SetFootLocking()`
- 🛠️ `SetFootOffsets()`
- 🛠️ `SetPelvisIKOffset()`
- 🛠️ `ResetIKOffsets()`

**Variáveis Manipuladas:**
- `Get FootLock_L_Alpha`
- `Get FootLock_L_Location`
- `Get FootLock_L_Rotation`
- `Get FootLock_R_Alpha`
- `Get FootLock_R_Location`
- `Get FootLock_R_Rotation`
- `Get FootOffset_L_Location`
- `Get FootOffset_L_Rotation`
- `Get FootOffset_L_Target`
- `Get FootOffset_R_Location`
- `Get FootOffset_R_Rotation`
- `Get FootOffset_R_Target`
- `Get MovementState`

### 📌 Grafo: `UpdateMovementValues_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Interp and set the Velocity Blend."*
- *"Set the Diagnal Scale Amount."*
- *"Set the Relative Acceleration Amount and Interp the Lean Amount."*
- *"Set the Walk Run Blend"*
- *"Set the Stride Blend"*
- *"Set the Standing and Crouching Play Rates"*

**Funções e Métodos Chamados:**
- 🛠️ `CalculateStandingPlayRate()`
- 🛠️ `CalculateVelocityBlend()`
- 🛠️ `CalculateWalkRunBlend()`
- 🛠️ `CalculateStrideBlend()`
- 🛠️ `CalculateCrouchingPlayRate()`
- 🛠️ `CalculateDiagonalScaleAmount()`
- 🛠️ `CalculateRelativeAccelerationAmount()`
- 🛠️ `InterpVelocityBlend()`
- 🛠️ `InterpLeanAmount()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get DeltaTimeX`
- `Get GroundedLeanInterpSpeed`
- `Get LeanAmount`
- `Get RelativeAccelerationAmount`
- `Get VelocityBlend`
- `Get VelocityBlendInterpSpeed`
- `Set CrouchingPlayRate`
- `Set DiagonalScaleAmount`
- `Set LeanAmount`
- `Set RelativeAccelerationAmount`
- `Set StandingPlayRate`
- `Set StrideBlend`
- `Set VelocityBlend`
- `Set WalkRunBlend`

### 📌 Grafo: `UpdateRotationValues_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Set the Movement Direction"*
- *"Set the Yaw Offsets. These values influence the \"*

**Funções e Métodos Chamados:**
- 🛠️ `CalculateMovementDirection()`
- 🛠️ `GetVectorValue()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `GetControlRotation()`
- 🛠️ `BreakVector()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get Velocity`
- `Get YawOffset_FB`
- `Get YawOffset_LR`
- `Set BYaw`
- `Set FYaw`
- `Set LYaw`
- `Set MovementDirection`
- `Set RYaw`

### 📌 Grafo: `UpdateInAirValues_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Update the fall speed. Setting this value only while in the air allows you to use it within the AnimGraph for the landing strength. If not, the Z velocity would return to 0 on landing. "*
- *"Set the Land Prediction weight."*
- *"Interp and set the In Air Lean Amount"*

**Funções e Métodos Chamados:**
- 🛠️ `CalculateLandPrediction()`
- 🛠️ `CalculateInAirLeanAmount()`
- 🛠️ `InterpLeanAmount()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get DeltaTimeX`
- `Get InAirLeanInterpSpeed`
- `Get LeanAmount`
- `Get Velocity`
- `Set FallSpeed`
- `Set LandPrediction`
- `Set LeanAmount`

### 📌 Grafo: `UpdateRagdollValues_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Scale the Flail Rate by the velocity length. The faster the ragdoll moves, the faster the character will flail."*

**Funções e Métodos Chamados:**
- 🛠️ `VSize()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `GetPhysicsLinearVelocity()`
- 🛠️ `GetOwningComponent()`

**Variáveis Manipuladas:**
- `Set FlailRate`

### 📌 Grafo: `CalculateVelocityBlend_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Velocity Blend. This value represents the velocity amount of the actor in each direction (normalized so that diagonals equal .5 for each direction), and is used in a BlendMulti node to produce better directional blending than a standard blendspace."*

**Funções e Métodos Chamados:**
- 🛠️ `FClamp()`
- 🛠️ `Abs()`
- 🛠️ `LessLess_VectorRotator()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `Normal()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get LocRelativeVelocityDir`
- `Get RelativeDirection`
- `Get Sum`
- `Get Velocity`
- `Set LocRelativeVelocityDir`
- `Set RelativeDirection`
- `Set Sum`

### 📌 Grafo: `CalculateDiagonalScaleAmount_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Diagnal Scale Amount. This value is used to scale the Foot IK Root bone to make the Foot IK bones cover more distance on the diagonal blends. Without scaling, the feet would not move far enough on the diagonal direction due to the linear translational blending of the IK bones. The curve is used to easily map the value."*

**Funções e Métodos Chamados:**
- 🛠️ `GetFloatValue()`
- 🛠️ `Abs()`

**Variáveis Manipuladas:**
- `Get DiagonalScaleAmountCurve`
- `Get VelocityBlend`

### 📌 Grafo: `CalculateRelativeAccelerationAmount_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Relative Acceleration Amount. This value represents the current amount of acceleration / deceleration relative to the actor rotation. It is normalized to a range of -1 to 1 so that -1 equals the Max Braking Deceleration, and 1 equals the Max Acceleration of the Character Movement Component."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `GetMaxAcceleration()`
- 🛠️ `Vector_ClampSizeMax()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `LessLess_VectorRotator()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `GetMaxBrakingDeceleration()`

**Variáveis Manipuladas:**
- `Get Acceleration`
- `Get Character`
- `Get CharacterMovement`
- `Get Velocity`

### 📌 Grafo: `CalculateWalkRunBlend_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Walk Run Blend. This value is used within the Blendspaces to blend between walking and running."*

**Variáveis Manipuladas:**
- `Get Gait`

### 📌 Grafo: `CalculateStrideBlend_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Stride Blend. This value is used within the blendspaces to scale the stride (distance feet travel) so that the character can walk or run at different movement speeds. It also allows the walk or run gait animations to blend independently while still matching the animation speed to the movement speed, preventing the character from needing to play a half walk+half run blend. The curves are used to map the stride amount to the speed for maximum control."*

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `Lerp()`
- 🛠️ `GetFloatValue()`
- 🛠️ `FClamp()`

**Variáveis Manipuladas:**
- `Get Speed`
- `Get StrideBlend_C_Walk`
- `Get StrideBlend_N_Run`
- `Get StrideBlend_N_Walk`

### 📌 Grafo: `CalculateStandingPlayRate_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Play Rate by dividing the Character\'s speed by the Animated Speed for each gait. The lerps are determined by the \"*

**Funções e Métodos Chamados:**
- 🛠️ `Lerp()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `GetOwningComponent()`
- 🛠️ `K2_GetComponentScale()`
- 🛠️ `FClamp()`
- 🛠️ `GetCurveValue()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get AnimatedRunSpeed`
- `Get AnimatedSprintSpeed`
- `Get AnimatedWalkSpeed`
- `Get Speed`
- `Get StrideBlend`

### 📌 Grafo: `CalculateCrouchingPlayRate_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Crouching Play Rate by dividing the Character\'s speed by the Animated Speed. This value needs to be separate from the standing play rate to improve the blend from crocuh to stand while in motion."*

**Funções e Métodos Chamados:**
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `FClamp()`
- 🛠️ `GetOwningComponent()`
- 🛠️ `K2_GetComponentScale()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get AnimatedCrouchSpeed`
- `Get Speed`
- `Get StrideBlend`

### 📌 Grafo: `CalculateMovementDirection_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Movement Direction. This value represents the direction the character is moving relative to the camera during the Looking Cirection / Aiming rotation modes, and is used in the Cycle Blending Anim Layers to blend to the appropriate directional states."*

**Funções e Métodos Chamados:**
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `CalculateQuadrant()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get AimingRotation`
- `Get Gait`
- `Get MovementDirection`
- `Get RotationMode`
- `Get Velocity`

### 📌 Grafo: `SetFootOffsets_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Trace downward from the foot location to find the geometry. If the surface is walkable, save the Impact Location and Normal."*
- *"Step 1.1: Find the difference in location from the Impact point and the expected (flat) floor location. These values are offset by the nomrmal multiplied by the foot height to get better behavior on angled surfaces."*
- *"Step 2: Interp the Current Location Offset to the new target value. Interpolate at different speeds based on whether the new target is above or below the current one."*
- *"Step 3: Interp the Current Rotation Offset to the new target value."*
- *"Only update Foot IK offset values if the Foot IK curve has a weight. If it equals 0, clear the offset values."*
- *"Step 1.2: Calculate the Rotation offset by getting the Atan2 of the Impact Normal."*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `LineTraceSingle()`
- 🛠️ `GetOwningComponent()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `MakeVector()`
- 🛠️ `GetDebugTraceType()`
- 🛠️ `IsWalkable()`
- 🛠️ `BreakHitResult()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `DegAtan2()`
- 🛠️ `MakeRotator()`
- 🛠️ `RInterpTo()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `VInterpTo()`
- 🛠️ `GetCurveValue()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get CurrentLocationOffset`
- `Get CurrentLocationTarget`
- `Get CurrentRotationOffset`
- `Get DeltaTimeX`
- `Get FootHeight`
- `Get IKFootBone`
- `Get IKFootFloorLocation`
- `Get IK_TraceDistanceAboveFoot`
- `Get IK_TraceDistanceBelowFoot`
- `Get ImpactNormal`
- `Get ImpactPoint`
- `Get RootBone`
- `Get TargetRotationOffset`
- `Set IKFootFloorLocation`
- `Set ImpactNormal`
- `Set ImpactPoint`
- `Set TargetRotationOffset`

### 📌 Grafo: `SetPelvisIKOffset_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the Pelvis Alpha by finding the average Foot IK weight. If the alpha is 0, clear the offset."*
- *"Step 1: Set the new Pelvis Target to be the lowest Foot Offset"*
- *"Step 2: Interp the Current Pelvis Offset to the new target value. Interpolate at different speeds based on whether the new target is above or below the current one."*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `GetCurveValue()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `VInterpTo()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get DeltaTimeX`
- `Get FootOffset_L_Target`
- `Get FootOffset_R_Target`
- `Get PelvisAlpha`
- `Get PelvisOffset`
- `Get PelvisTarget`
- `Set PelvisAlpha`
- `Set PelvisOffset`
- `Set PelvisTarget`

### 📌 Grafo: `SetFootLocking_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Only update values if FootIK curve has a weight."*
- *"Step 1: Set Local FootLock Curve value"*
- *"Step 2: Only update the FootLock Alpha if the new value is less than the current, or it equals 1. This makes it so that the foot can only blend out of the locked position or lock to a new position, and never blend in."*
- *"Step 3: If the Foot Lock curve equals 1, save the new lock location and rotation in component space."*
- *"Step 4: If the Foot Lock Alpha has a weight, update the Foot Lock offsets to keep the foot planted in place while the capsule moves."*
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `GetOwningComponent()`
- 🛠️ `GetSocketTransform()`
- 🛠️ `SetFootLockOffsets()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get CurrentFootLockAlpha`
- `Get CurrentFootLockLocation`
- `Get CurrentFootLockRotation`
- `Get FootLockCurve`
- `Get FootLockCurveValue`
- `Get IKFootBone`
- `Set FootLockCurveValue`

### 📌 Grafo: `SetFootLockOffsets_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Use the delta between the current and last updated rotation to find how much the foot should be rotated to remain planted on the ground."*
- *"Get the distance traveled between frames relative to the mesh rotation to find how much the foot should be offset to remain planted on the ground."*
- *"Subtract the location difference from the current local location and rotate it by the rotation difference to keep the foot planted in component space."*
- *"Subtract the Rotation Difference from the current Local Rotation to get the new local rotation."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsMovingOnGround()`
- 🛠️ `GetLastUpdateRotation()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `LessLess_VectorRotator()`
- 🛠️ `GetOwningComponent()`
- 🛠️ `K2_GetComponentRotation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `RotateAngleAxis()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get LocalLocation`
- `Get LocalRotation`
- `Get LocationDifference`
- `Get RotationDifference`
- `Get Velocity`
- `Set LocationDifference`
- `Set RotationDifference`

### 📌 Grafo: `ShouldMoveCheck_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Enable Movement Animations if IsMoving and HasMovementInput, or if the Speed is greater than 150. "*

**Funções e Métodos Chamados:**
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get HasMovementInput`
- `Get IsMoving`
- `Get Speed`

### 📌 Grafo: `CanTurnInPlace_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Only perform a Turn In Place check if the character is looking toward the camera in Third Person, and if the \"*

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get RotationMode`
- `Get ViewMode`

### 📌 Grafo: `CanRotateInPlace_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Only perform a Rotate In Place Check if the character is Aiming or in First Person."*

**Funções e Métodos Chamados:**
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get RotationMode`
- `Get ViewMode`

### 📌 Grafo: `CanDynamicTransition_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Only perform a Dynamic Transition check if the \"*

**Funções e Métodos Chamados:**
- 🛠️ `GetCurveValue()`
- 🛠️ `EqualEqual_DoubleDouble()`

### 📌 Grafo: `CanOverlayTransition_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get ShouldMove`
- `Get Stance`

### 📌 Grafo: `TurnInPlace_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Set Turn Angle"*
- *"Step 2: Choose Turn Asset based on the Turn Angle and Stance"*
- *"Step 3: If the Target Turn Animation is not playing or set to be overriden, play the turn animation as a dynamic montage."*
- *"Step 4: Scale the rotation amount (gets scaled in animgraph) to compensate for turn angle (If Allowed) and play rate."*
- 🔀 Contém `5` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `NormalizedDeltaRotator()`
- 🛠️ `Abs()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `IsPlayingSlotAnimation()`
- 🛠️ `PlaySlotAnimationAsDynamicMontage()`
- 🛠️ `Not_PreBool()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get CLF_TurnIP_L180`
- `Get CLF_TurnIP_L90`
- `Get CLF_TurnIP_R180`
- `Get CLF_TurnIP_R90`
- `Get Character`
- `Get N_TurnIP_L180`
- `Get N_TurnIP_L90`
- `Get N_TurnIP_R180`
- `Get N_TurnIP_R90`
- `Get OverrideCurrent`
- `Get PlayRateScale`
- `Get Stance`
- `Get StartTime`
- `Get TargetRotation`
- `Get TargetTurnAsset`
- `Get Turn180Threshold`
- `Get TurnAngle`
- `Set RotationScale`
- `Set TargetTurnAsset`
- `Set TurnAngle`

### 📌 Grafo: `TurnInPlaceCheck_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Check if Aiming angle is outside of the Turn Check Min Angle, and if the Aim Yaw Rate is below the Aim Yaw Rate Limit. If so, begin counting the Elapsed Delay Time. If not, reset the Elapsed Delay Time. This ensures the conditions remain true for a sustained peroid of time before turning in place."*
- *"Step 2: Check if the Elapsed Delay time exceeds the set delay (mapped to the turn angle range). If so, trigger a Turn In Place."*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Abs()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `TurnInPlace()`
- 🛠️ `BreakVector2D()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get AimYawRate`
- `Get AimYawRateLimit`
- `Get AimingAngle`
- `Get AimingRotation`
- `Get DeltaTimeX`
- `Get ElapsedDelayTime`
- `Get MaxAngleDelay`
- `Get MinAngleDelay`
- `Get TurnCheckMinAngle`
- `Set AngleMulti`
- `Set ElapsedDelayTime`

### 📌 Grafo: `CalculateLandPrediction_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Calculate the land prediction weight by tracing in the velocity direction to find a walkable surface the character is falling toward, and getting the \'Time\' (range of 0-1, 1 being maximum, 0 being about to land) till impact. The Land Prediction Curve is used to control how the time affects the final weight for a smooth blend. "*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CapsuleTraceSingleByProfile()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `Vector_NormalUnsafe()`
- 🛠️ `FClamp()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetFloatValue()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `GetCurveValue()`
- 🛠️ `IsWalkable()`
- 🛠️ `BreakHitResult()`
- 🛠️ `GetDebugTraceType()`
- 🛠️ `Lerp()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get CapsuleRadius`
- `Get Character`
- `Get CharacterMovement`
- `Get FallSpeed`
- `Get LandPredictionCurve`
- `Get Velocity`

### 📌 Grafo: `CalculateInAirLeanAmount_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Use the relative Velocity direction and amount to determine how much the character should lean while in air. The Lean In Air curve gets the Fall Speed and is used as a multiplier to smoothly reverse the leaning direction when transitioning from moving upwards to moving downwards."*

**Funções e Métodos Chamados:**
- 🛠️ `Multiply_Vector2DFloat()`
- 🛠️ `GetFloatValue()`
- 🛠️ `LessLess_VectorRotator()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `MakeVector2D()`
- 🛠️ `BreakVector2D()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get FallSpeed`
- `Get LeanInAirCurve`
- `Get Velocity`

### 📌 Grafo: `RotateInPlaceCheck_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 1: Check if the character should rotate left or right by checking if the Aiming Angle exceeds the threshold."*
- *"Step 2: If the character should be rotating, set the Rotate Rate to scale with the Aim Yaw Rate. This makes the character rotate faster when moving the camera faster."*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `BreakVector2D()`

**Variáveis Manipuladas:**
- `Get AimYawRate`
- `Get AimYawRateMaxRange`
- `Get AimYawRateMinRange`
- `Get AimingAngle`
- `Get MaxPlayRate`
- `Get MinPlayRate`
- `Get RotateMaxThreshold`
- `Get RotateMinThreshold`
- `Get Rotate_L`
- `Get Rotate_R`
- `Set RotateRate`
- `Set Rotate_L`
- `Set Rotate_R`

### 📌 Grafo: `DynamicTransitionCheck_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Check each foot to see if the location difference between the IK_Foot bone and its desired / target location (determined via a virtual bone) exceeds a threshold. If it does, play an additive transition animation on that foot. The currently set transition plays the second half of a 2 foot transition animation, so that only a single foot moves. Because only the IK_Foot bone can be locked, the separate virtual bone allows the system to know its desired location when locked."*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetOwningComponent()`
- 🛠️ `K2_DistanceBetweenTwoSocketsAndMapRange()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `PlayDynamicTransition()`

### 📌 Grafo: `GetDebugTraceType_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`
- 🛠️ `BPI_Get_DebugInfo()`

### 📌 Grafo: `InterpVelocityBlend_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `FInterpTo()`

**Variáveis Manipuladas:**
- `Get Current`
- `Get DeltaTime`
- `Get InterpSpeed`
- `Get Target`

### 📌 Grafo: `InterpLeanAmount_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `FInterpTo()`

**Variáveis Manipuladas:**
- `Get Current`
- `Get DeltaTime`
- `Get InterpSpeed`
- `Get Target`

### 📌 Grafo: `CalculateQuadrant_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Take the input angle and determine its quadrant (direction). Use the current Movement Direction to increase or decrease the buffers on the angle ranges for each quadrant."*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AngleInRange()`
- 🛠️ `NotEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get Angle`
- `Get BL-Threshold`
- `Get BR-Threshold`
- `Get Buffer`
- `Get Current`
- `Get FL-Threshold`
- `Get FR-Threshold`

### 📌 Grafo: `AngleInRange_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `InRange_FloatFloat()`
- 🛠️ `Subtract_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Angle`
- `Get Buffer`
- `Get IncreaseBuffer`
- `Get MaxAngle`
- `Get MinAngle`

### 📌 Grafo: `ResetIKOffsets_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Interp Foot IK offsets back to 0"*

**Funções e Métodos Chamados:**
- 🛠️ `VInterpTo()`
- 🛠️ `RInterpTo()`

**Variáveis Manipuladas:**
- `Get DeltaTimeX`
- `Get FootLock_R_Location`
- `Get FootOffset_L_Location`
- `Get FootOffset_L_Rotation`
- `Set FootLock_R_Location`
- `Set FootOffset_L_Location`
- `Set FootOffset_L_Rotation`

### 📌 Grafo: `WeaponData_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetChar_WpnSystemValid()`
- 🛠️ `GetChar_CurrentWeapon()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get HasWeapon`
- `Get IsOnFireRateDelay`
- `Get WeaponData`
- `Set HasWeapon`
- `Set IKLeft Hand`
- `Set Is on Fire Rate Delay`
- `Set Weapon Type`

### 📌 Grafo: `AnimGraph__AnimFunc_MERGED`

### 📌 Grafo: `BaseLayer__AnimFunc_MERGED`

### 📌 Grafo: `OverlayLayer__AnimFunc_MERGED`

### 📌 Grafo: `BasePoses__AnimFunc_MERGED`

### 📌 Grafo: `LayerBlending__AnimFunc_MERGED`

### 📌 Grafo: `(N) CycleBlending__AnimFunc_MERGED`

### 📌 Grafo: `(CLF) CycleBlending__AnimFunc_MERGED`

### 📌 Grafo: `Foot IK__AnimFunc_MERGED`

### 📌 Grafo: `AimOffsetBehaviors__AnimFunc_MERGED`

### 📌 Grafo: `GetCharacterDead_MERGED`

### 📌 Grafo: `GetHUD_MERGED`

### 📌 Grafo: `GetChar_WeaponSystem_MERGED`

### 📌 Grafo: `GetChar_WpnSystemValid_MERGED`

### 📌 Grafo: `GetChar_CurrentWeapon_MERGED`

### 📌 Grafo: `GetChar_Mesh_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `ALS_AnimBP`?
- Quais variáveis estão disponíveis no Blueprint `ALS_AnimBP`?
- Quais funções e eventos são chamados no grafo do `ALS_AnimBP`?