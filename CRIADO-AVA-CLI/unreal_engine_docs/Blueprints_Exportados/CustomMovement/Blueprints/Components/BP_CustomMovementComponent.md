# 🎮 Blueprint: BP_CustomMovementComponent

**[Classe Pai / Parent Class: `ActorComponent`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `LadderStepPos` | `real (double)` |
| `IsLadderForNextAnimation` | `bool` |
| `LadderBlendTimeForAnimation` | `real (double)` |
| `LadderMoveSpeed` | `real (double)` |
| `NextHold` | `object (Actor)` |
| `NextHoldInterface` | `interface (BPI_CustomMoveZone_Climbing_C)` |
| `IsMovingNextHoldForAnimation` | `bool` |
| `MovingNextHoldTransitionAlphaForAnimation` | `real (double)` |
| `MovingNextHoldTransitionDeltaForAnimation` | `struct (Vector)` |
| `OverlappedClimbingHolds` | `object (Actor)` |
| `ClimbingLocation` | `struct (Vector)` |
| `ClimbingRotation` | `struct (Rotator)` |
| `IsClimbingForNextAnimation` | `bool` |
| `ClimbingBlendTimeForAnimation` | `real (double)` |
| `NextHoldIsFarHold` | `bool` |
| `MaxClimbingDistance` | `real (double)` |
| `OverlappedCustomMoveZone` | `struct (SCustomMoveZone)` |
| `CurrentCustomMoveZone` | `struct (SCustomMoveZone)` |
| `IsTransitioningCustomMoveZone` | `bool` |
| `EnteringTransitionBeginLocation` | `struct (Vector)` |
| `EnteringTransitionEndLocation` | `struct (Vector)` |
| `EnteringTransitionBeginRotation` | `struct (Rotator)` |
| `EnteringTransitionEndRotation` | `struct (Rotator)` |
| `MovementDeltaTime` | `real (double)` |
| `PrevUseControllerRotationYaw` | `bool` |
| `PrevOrientRotationToMovement` | `bool` |
| `Character` | `object (Character)` |
| `CharacterMovement` | `object (CharacterMovementComponent)` |
| `EnteringLadderTopTimeline_Time` | `real (double)` |
| `EnteringLadderTopTimeline_Transition` | `object (CurveFloat)` |
| `AM_EnteringLadderTop` | `object (AnimMontage)` |
| `EnteringLadderMiddleTimeline_Time` | `real (double)` |
| `EnteringLadderMiddleTimeline_Transition` | `object (CurveFloat)` |
| `EnteringLadderBottomTimeline_Time` | `real (double)` |
| `EnteringLadderBottomTimeline_Transition` | `object (CurveFloat)` |
| `EnteringClimbingTopTimeline_Time` | `real (double)` |
| `EnteringClimbingTopTimeline_Transition` | `object (CurveFloat)` |
| `EnteringClimbingTimeline_Time` | `real (double)` |
| `EnteringClimbingTimeline_Transition` | `object (CurveFloat)` |
| `MovingNextHoldTimeline_Time` | `real (double)` |
| `MovingNextHoldTimeline_PlayRate` | `real (double)` |
| `MovingNextHoldTimeline_TransitionLocation` | `object (CurveFloat)` |
| `MovingNextHoldTimeline_TransitionRotation` | `object (CurveFloat)` |
| `AM_EnteringLadderBottom` | `object (AnimMontage)` |
| `AM_ExitingLadderTop` | `object (AnimMontage)` |
| `AM_ExitingLadderBottom` | `object (AnimMontage)` |
| `AM_EnteringClimbingTop` | `object (AnimMontage)` |
| `AM_ExitingClimbingTop` | `object (AnimMontage)` |
| `Timeline` | `mcdelegate` |
| `OnStartCustomMovement` | `mcdelegate` |
| `OnEndCustomMovement` | `mcdelegate` |
| `PrevUseControllerDesiredRotation` | `bool` |
| `ServerInProgress` | `bool` |
| `TransitionTargetLocation` | `struct (Vector)` |
| `TransitionTargetRotation` | `struct (Rotator)` |
| `InputLadderUP` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `BeginOverlappedCustomMoveZone`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsLocallyControlled()`

**Variáveis Manipuladas:**
- `Get OverlappedClimbingHolds`
- `Set OverlappedCustomMoveZone`

### 📌 Grafo: `CheckClimbingNextHold`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `CheckMoveToNextHold()`
- 🛠️ `GetLastInputVector()`
- 🛠️ `Normal()`
- 🛠️ `VSize()`
- 🛠️ `MovingNextHold()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get IsTransitioningCustomMoveZone`

### 📌 Grafo: `CheckEnteringCustomMoveZone`
- 🔀 Contém `8` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `IsValid()`
- 🛠️ `FindClosestClimbingHold()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `BreakVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `GetLastInputVector()`
- 🛠️ `Normal()`
- 🛠️ `VSize()`
- 🛠️ `CheckEnterToTop()`
- 🛠️ `EnteringLadderTop()`
- 🛠️ `CheckEnterToBottom()`
- 🛠️ `EnteringLadderBottom()`
- 🛠️ `IsFalling()`
- 🛠️ `CheckEnterToMiddle()`
- 🛠️ `EnteringLadderMiddle()`
- 🛠️ `EnteringClimbingTop()`
- 🛠️ `CheckEnter()`
- 🛠️ `EnteringClimbing()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get CharacterMovement`
- `Get CurrentCustomMoveZone`
- `Get IsTransitioningCustomMoveZone`
- `Get OverlappedCustomMoveZone`
- `Get TempCharacterBottomLocation`
- `Get TempClimbingInterface`
- `Get TempInputDirection`
- `Get TempInputScale`
- `Get TempLadderInterface`
- `Set TempCharacterBottomLocation`
- `Set TempClimbingInterface`
- `Set TempInputDirection`
- `Set TempInputScale`
- `Set TempLadderInterface`

### 📌 Grafo: `CheckExitingClimbing`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CheckExitToBottom()`
- 🛠️ `ExitingClimbing()`
- 🛠️ `Not_PreBool()`
- 🛠️ `CheckExitToTop()`
- 🛠️ `ExitingClimbingTop()`

**Variáveis Manipuladas:**
- `Get ClimbingInterface`
- `Get InputScale`
- `Get IsTransitioningCustomMoveZone`

### 📌 Grafo: `CheckExitingCustomMoveZone_Ladder`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `BreakVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `CheckExitToTop()`
- 🛠️ `ExitingLadderTop()`
- 🛠️ `CheckExitToBottom()`
- 🛠️ `ExitingLadderBottom()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get IsTransitioningCustomMoveZone`
- `Get TempCharacterBottomLocation`
- `Get TempInputScale`
- `Get TempLadderInterface`
- `Set TempCharacterBottomLocation`
- `Set TempInputScale`
- `Set TempLadderInterface`

### 📌 Grafo: `ClimbingEntering`

**Eventos de Entrada (Events):**
- 🟢 `EnteringClimbing`
- 🟢 `ServerEnteringClimbing`
- 🟢 `BroadcastEnteringClimbing`
- 🟢 `UpdateEnteringClimbingTimeline`
- 🔀 Contém `5` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `FClamp()`
- 🛠️ `SetMovementMode()`
- 🛠️ `HasAuthority()`
- 🛠️ `ServerEnteringClimbing()`
- 🛠️ `BroadcastEnteringClimbing()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `GetHoldRotation()`
- 🛠️ `GetHoldLocation()`
- 🛠️ `GetUpVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetFloatValue()`
- 🛠️ `VLerp()`
- 🛠️ `RLerp()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `GetTimeRange()`
- 🛠️ `NotifyServerComplete()`
- 🛠️ `CanEnteringCustomMovement()`
- 🛠️ `OnBeforeStartCustomMovement()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get CharacterMovement`
- `Get CurrentCustomMoveZone`
- `Get EnteringClimbingTimeline_Time`
- `Get EnteringClimbingTimeline_Transition`
- `Get EnteringTransitionBeginLocation`
- `Get EnteringTransitionBeginRotation`
- `Get EnteringTransitionEndLocation`
- `Get EnteringTransitionEndRotation`
- `Get OverlappedCustomMoveZone`
- `Get ServerInProgress`
- `Get bOrientRotationToMovement`
- `Get bUseControllerDesiredRotation`
- `Get bUseControllerRotationYaw`
- `Set ClimbingBlendTimeForAnimation`
- `Set ClimbingLocation`
- `Set ClimbingRotation`
- `Set CurrentCustomMoveZone`
- `Set EnteringClimbingTimeline_Time`
- `Set EnteringTransitionBeginLocation`
- `Set EnteringTransitionBeginRotation`
- `Set EnteringTransitionEndLocation`
- `Set EnteringTransitionEndRotation`
- `Set IsClimbingForNextAnimation`
- `Set IsTransitioningCustomMoveZone`
- `Set PrevOrientRotationToMovement`
- `Set PrevUseControllerDesiredRotation`
- `Set PrevUseControllerRotationYaw`
- `Set ServerInProgress`
- `Set TransitionTargetLocation`
- `Set TransitionTargetRotation`
- `Set Velocity`
- `Set bOrientRotationToMovement`
- `Set bUseControllerDesiredRotation`
- `Set bUseControllerRotationYaw`

### 📌 Grafo: `ClimbingEnteringTop`

**Eventos de Entrada (Events):**
- 🟢 `ClimbingEnteringTopServerAck`
- 🟢 `EnteringClimbingTop`
- 🟢 `ServerEnteringClimbingTop`
- 🟢 `BroadcastEnteringClimbingTop`
- 🟢 `UpdateEnteringClimbingTopTimeline`
- 🟢 `ServerEnteringClimbingTopRootMotion`
- 🟢 `BroadcastEnteringClimbingTopRootMotion`
- 🔀 Contém `9` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `NotifyServerComplete()`
- 🛠️ `GetTopEnterLocatoin()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `GetHoldRotation()`
- 🛠️ `GetHoldLocation()`
- 🛠️ `GetUpVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Delay()`
- 🛠️ `GetFloatValue()`
- 🛠️ `UpdateEnteringTransition()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `GetTimeRange()`
- 🛠️ `GetPlayLength()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `SetMovementMode()`
- 🛠️ `BroadcastEnteringClimbingTopRootMotion()`
- 🛠️ `ServerEnteringClimbingTopRootMotion()`
- 🛠️ `GetController()`
- 🛠️ `HasAuthority()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `BreakRotator()`
- 🛠️ `GetControlRotation()`
- 🛠️ `MakeRotator()`
- 🛠️ `SetControlRotation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `ServerEnteringClimbingTop()`
- 🛠️ `BroadcastEnteringClimbingTop()`
- 🛠️ `ClimbingEnteringTopServerAck()`
- 🛠️ `CanEnteringCustomMovement()`
- 🛠️ `OnBeforeStartCustomMovement()`

**Variáveis Manipuladas:**
- `Get AM_EnteringClimbingTop`
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get CharacterMovement`
- `Get ClimbingRotation`
- `Get CurrentCustomMoveZone`
- `Get EnteringClimbingTopTimeline_Time`
- `Get EnteringClimbingTopTimeline_Transition`
- `Get Mesh`
- `Get OverlappedCustomMoveZone`
- `Get ServerInProgress`
- `Get bOrientRotationToMovement`
- `Get bUseControllerDesiredRotation`
- `Get bUseControllerRotationYaw`
- `Set ClimbingBlendTimeForAnimation`
- `Set ClimbingLocation`
- `Set ClimbingRotation`
- `Set CurrentCustomMoveZone`
- `Set EnteringClimbingTopTimeline_Time`
- `Set EnteringTransitionBeginLocation`
- `Set EnteringTransitionBeginRotation`
- `Set EnteringTransitionEndLocation`
- `Set EnteringTransitionEndRotation`
- `Set IsClimbingForNextAnimation`
- `Set IsTransitioningCustomMoveZone`
- `Set PrevOrientRotationToMovement`
- `Set PrevUseControllerDesiredRotation`
- `Set PrevUseControllerRotationYaw`
- `Set ServerInProgress`
- `Set TransitionTargetLocation`
- `Set TransitionTargetRotation`
- `Set Velocity`
- `Set bOrientRotationToMovement`
- `Set bUseControllerDesiredRotation`
- `Set bUseControllerRotationYaw`

### 📌 Grafo: `ClimbingExiting`

**Eventos de Entrada (Events):**
- 🟢 `ExitingClimbing`
- 🟢 `ServerExitingClimbing`
- 🟢 `BroadcastExitingClimbing`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `SetMovementMode()`
- 🛠️ `AddImpulse()`
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Delay()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `HasAuthority()`
- 🛠️ `NotifyServerComplete()`
- 🛠️ `ServerExitingClimbing()`
- 🛠️ `BroadcastExitingClimbing()`
- 🛠️ `K2_SetActorRotation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get ClimbingBlendTimeForAnimation`
- `Get PrevOrientRotationToMovement`
- `Get PrevUseControllerDesiredRotation`
- `Get PrevUseControllerRotationYaw`
- `Get ServerInProgress`
- `Set ClimbingBlendTimeForAnimation`
- `Set CurrentCustomMoveZone`
- `Set IsClimbingForNextAnimation`
- `Set IsTransitioningCustomMoveZone`
- `Set ServerInProgress`
- `Set bOrientRotationToMovement`
- `Set bUseControllerDesiredRotation`
- `Set bUseControllerRotationYaw`

### 📌 Grafo: `ClimbingExitingTop`

**Eventos de Entrada (Events):**
- 🟢 `ExitingClimbingTop`
- 🟢 `ServerExitingClimbingTop`
- 🟢 `BroadcastExitingClimbingTop`
- 🟢 `ServerExitingClimbingTopRootMotion`
- 🟢 `BroadcastExitingClimbingTopRootMotion`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `SetMovementMode()`
- 🛠️ `GetPlayLength()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Delay()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `ServerExitingClimbingTop()`
- 🛠️ `BroadcastExitingClimbingTop()`
- 🛠️ `BroadcastExitingClimbingTopRootMotion()`
- 🛠️ `ServerExitingClimbingTopRootMotion()`
- 🛠️ `NotifyServerComplete()`
- 🛠️ `HasAuthority()`

**Variáveis Manipuladas:**
- `Get AM_ExitingClimbingTop`
- `Get Character`
- `Get CharacterMovement`
- `Get Mesh`
- `Get PrevOrientRotationToMovement`
- `Get PrevUseControllerDesiredRotation`
- `Get PrevUseControllerRotationYaw`
- `Get ServerInProgress`
- `Set ClimbingBlendTimeForAnimation`
- `Set CurrentCustomMoveZone`
- `Set IsClimbingForNextAnimation`
- `Set IsTransitioningCustomMoveZone`
- `Set ServerInProgress`
- `Set bOrientRotationToMovement`
- `Set bUseControllerDesiredRotation`
- `Set bUseControllerRotationYaw`

### 📌 Grafo: `ClimbingMovingNextHold`

**Eventos de Entrada (Events):**
- 🟢 `MovingNextHold`
- 🟢 `ServerMovingNextHold`
- 🟢 `BroadcastMovingNextHold`
- 🟢 `UpdateMovingNextHoldTimeline`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `ServerMovingNextHold()`
- 🛠️ `BroadcastMovingNextHold()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `GetHoldRotation()`
- 🛠️ `GetUpVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetHoldLocation()`
- 🛠️ `VLerp()`
- 🛠️ `RLerp()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `MakeTransform()`
- 🛠️ `InverseTransformDirection()`
- 🛠️ `BreakVector()`
- 🛠️ `Abs()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `NotifyServerComplete()`
- 🛠️ `Delay()`
- 🛠️ `VSize()`
- 🛠️ `SelectFloat()`
- 🛠️ `GetFloatValue()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `GetTimeRange()`
- 🛠️ `HasAuthority()`
- 🛠️ `FClamp()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get CharacterMovement`
- `Get EnteringTransitionBeginLocation`
- `Get EnteringTransitionBeginRotation`
- `Get EnteringTransitionEndLocation`
- `Get EnteringTransitionEndRotation`
- `Get MaxClimbingDistance`
- `Get MovingNextHoldTimeline_PlayRate`
- `Get MovingNextHoldTimeline_Time`
- `Get MovingNextHoldTimeline_TransitionLocation`
- `Get MovingNextHoldTimeline_TransitionRotation`
- `Get NextHold`
- `Get NextHoldInterface`
- `Get NextHoldIsFarHold`
- `Get ServerInProgress`
- `Set ClimbingLocation`
- `Set ClimbingRotation`
- `Set CurrentCustomMoveZone`
- `Set EnteringTransitionBeginLocation`
- `Set EnteringTransitionBeginRotation`
- `Set EnteringTransitionEndLocation`
- `Set EnteringTransitionEndRotation`
- `Set IsMovingNextHoldForAnimation`
- `Set IsTransitioningCustomMoveZone`
- `Set MovingNextHoldTimeline_PlayRate`
- `Set MovingNextHoldTimeline_Time`
- `Set MovingNextHoldTransitionAlphaForAnimation`
- `Set MovingNextHoldTransitionDeltaForAnimation`
- `Set NextHold`
- `Set NextHoldInterface`
- `Set NextHoldIsFarHold`
- `Set ServerInProgress`
- `Set Velocity`

### 📌 Grafo: `EndOverlappedCustomMoveZone`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsLocallyControlled()`
- 🛠️ `EqualEqual_ObjectObject()`

**Variáveis Manipuladas:**
- `Get OverlappedClimbingHolds`
- `Get OverlappedCustomMoveZone`
- `Set OverlappedCustomMoveZone`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"BeginPlay"*
- *"ExitCustomMovement"*
- *"UpdateEnteringTransition"*
- *"Tick"*
- *"UpdateCustomMovement"*
- *"AddCustomMovmentInput"*
- *"InputAxis_Ladder"*
- *"Notify Server Complete"*
- *"InputAxis_Climbing"*

**Eventos de Entrada (Events):**
- 🟢 `UpdateEnteringTransition`
- 🟢 `NotifyServerComplete`
- 🟢 `InputAxis_ClimbingRight`
- 🟢 `AddCustomMovementInput_Up`
- 🟢 `AddCustomMovementInput_Right`
- 🟢 `ExitCustomMovement`
- 🟢 `UpdateCustomMovement`
- 🟢 `InputAxis_LadderUp`
- 🟢 `InputAxis_ClimbingUp`
- 🟢 `ReceiveBeginPlay`
- 🟢 `ReceiveTick`
- 🔀 Contém `6` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `UpdateTransition()`
- 🛠️ `Not_PreBool()`
- 🛠️ `InputAxis_LadderUp()`
- 🛠️ `InputAxis_ClimbingUp()`
- 🛠️ `InputAxis_ClimbingRight()`
- 🛠️ `CheckEnteringCustomMoveZone()`
- 🛠️ `Initialize()`
- 🛠️ `GetOwner()`
- 🛠️ `CheckExitingClimbing()`
- 🛠️ `GetHoldRotation()`
- 🛠️ `GetUpVector()`
- 🛠️ `AddMovementInput()`
- 🛠️ `GetRightVector()`
- 🛠️ `ExitingLadderMiddle()`
- 🛠️ `ExitingClimbing()`
- 🛠️ `HasAuthority()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `VLerp()`
- 🛠️ `RLerp()`
- 🛠️ `CheckClimbingNextHold()`
- 🛠️ `UpdateRootMotion()`
- 🛠️ `UpdateLadderMovement()`
- 🛠️ `UpdateClimbingMovement()`
- 🛠️ `CheckExitingCustomMoveZone_Ladder()`
- 🛠️ `GetLadderLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Normal()`
- 🛠️ `FClamp()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get CustomMovementMode`
- `Get EnteringTransitionBeginLocation`
- `Get EnteringTransitionBeginRotation`
- `Get EnteringTransitionEndLocation`
- `Get EnteringTransitionEndRotation`
- `Get IsTransitioningCustomMoveZone`
- `Get ServerInProgress`
- `Set InputLadderUP`
- `Set MovementDeltaTime`
- `Set ServerInProgress`
- `Set TransitionTargetLocation`
- `Set TransitionTargetRotation`

### 📌 Grafo: `FindClosestClimbingHold`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Greater_IntInt()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSizeSquared()`
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get OverlappedClimbingHolds`
- `Get OverlappedCustomMoveZone`
- `Get TempFoundedHold`
- `Get TempMinDistanceSqrt`
- `Set OverlappedCustomMoveZone`
- `Set TempFoundedHold`
- `Set TempMinDistanceSqrt`

### 📌 Grafo: `GetCharacterNetSmoothLocation`

**Funções e Métodos Chamados:**
- 🛠️ `GetBaseTranslationOffset()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetTransform()`
- 🛠️ `TransformDirection()`
- 🛠️ `Subtract_VectorVector()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get Mesh`

### 📌 Grafo: `GetLadderStepPos`

**Funções e Métodos Chamados:**
- 🛠️ `GetLadderLocation()`
- 🛠️ `GetCharacterNetSmoothLocation()`
- 🛠️ `BreakVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `FindClosestPointOnSegment()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Percent_FloatFloat()`
- 🛠️ `GetLadderStepHeight()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`

### 📌 Grafo: `GetMovingNextHoldTransitionAlpha`

**Funções e Métodos Chamados:**
- 🛠️ `GetCharacterNetSmoothLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `FClamp()`

**Variáveis Manipuladas:**
- `Get EnteringTransitionBeginLocation`
- `Get EnteringTransitionEndLocation`

### 📌 Grafo: `HasAuthority`

**Funções e Métodos Chamados:**
- 🛠️ `HasAuthority()`

**Variáveis Manipuladas:**
- `Get Character`

### 📌 Grafo: `Initialize`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Set Character`
- `Set CharacterMovement`

### 📌 Grafo: `IsCustomMovement`

**Funções e Métodos Chamados:**
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get CurrentCustomMoveZone`
- `Get IsTransitioningCustomMoveZone`
- `Get ServerInProgress`

### 📌 Grafo: `IsLocallyControlled`

**Funções e Métodos Chamados:**
- 🛠️ `IsLocallyControlled()`

**Variáveis Manipuladas:**
- `Get Character`

### 📌 Grafo: `LadderEnteringBottom`

**Eventos de Entrada (Events):**
- 🟢 `EnteringLadderBottom`
- 🟢 `ServerEnteringLadderBottom`
- 🟢 `BroadcastEnteringLadderBottom`
- 🟢 `ServerEnteringLadderBottomRootMotion`
- 🟢 `BroadcastEnteringLadderBottomRootMotion`
- 🟢 `LadderEnteringBottomServerAck`
- 🟢 `UpdateEnteringLadderBottomTimeline`
- 🔀 Contém `8` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `GetBottomEnterLocation()`
- 🛠️ `HasAuthority()`
- 🛠️ `NotifyServerComplete()`
- 🛠️ `Delay()`
- 🛠️ `BroadcastEnteringLadderBottomRootMotion()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `ServerEnteringLadderBottomRootMotion()`
- 🛠️ `GetPlayLength()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `ServerEnteringLadderBottom()`
- 🛠️ `BroadcastEnteringLadderBottom()`
- 🛠️ `SetMovementMode()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `GetFloatValue()`
- 🛠️ `UpdateEnteringTransition()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `GetTimeRange()`
- 🛠️ `LadderEnteringBottomServerAck()`
- 🛠️ `CanEnteringCustomMovement()`
- 🛠️ `OnBeforeStartCustomMovement()`

**Variáveis Manipuladas:**
- `Get AM_EnteringLadderBottom`
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get CharacterMovement`
- `Get CurrentCustomMoveZone`
- `Get EnteringLadderBottomTimeline_Time`
- `Get EnteringLadderBottomTimeline_Transition`
- `Get Mesh`
- `Get OverlappedCustomMoveZone`
- `Get ServerInProgress`
- `Get bOrientRotationToMovement`
- `Get bUseControllerDesiredRotation`
- `Get bUseControllerRotationYaw`
- `Set CurrentCustomMoveZone`
- `Set EnteringLadderBottomTimeline_Time`
- `Set EnteringTransitionBeginLocation`
- `Set EnteringTransitionBeginRotation`
- `Set EnteringTransitionEndLocation`
- `Set EnteringTransitionEndRotation`
- `Set IsLadderForNextAnimation`
- `Set IsTransitioningCustomMoveZone`
- `Set LadderBlendTimeForAnimation`
- `Set LadderStepPos`
- `Set PrevOrientRotationToMovement`
- `Set PrevUseControllerDesiredRotation`
- `Set PrevUseControllerRotationYaw`
- `Set ServerInProgress`
- `Set TransitionTargetLocation`
- `Set TransitionTargetRotation`
- `Set Velocity`
- `Set bOrientRotationToMovement`
- `Set bUseControllerDesiredRotation`
- `Set bUseControllerRotationYaw`

### 📌 Grafo: `LadderEnteringMiddle`

**Eventos de Entrada (Events):**
- 🟢 `LadderEnteringMiddleServerAck`
- 🟢 `ServerEnteringLadderMiddleChangeMode`
- 🟢 `BroadcastEnteringLadderMiddleChangeMode`
- 🟢 `EnteringLadderMiddle`
- 🟢 `ServerEnteringLadderMiddle`
- 🟢 `BroadcastEnteringLadderMiddle`
- 🟢 `UpdateEnteringLadderMiddleTimeline`
- 🔀 Contém `8` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `Delay()`
- 🛠️ `BroadcastEnteringLadderMiddleChangeMode()`
- 🛠️ `ServerEnteringLadderMiddleChangeMode()`
- 🛠️ `SetMovementMode()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `HasAuthority()`
- 🛠️ `GetLadderLocation()`
- 🛠️ `GetLadderStepHeight()`
- 🛠️ `BreakVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `FindClosestPointOnSegment()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Percent_FloatFloat()`
- 🛠️ `NotifyServerComplete()`
- 🛠️ `GetLadderRotation()`
- 🛠️ `ServerEnteringLadderMiddle()`
- 🛠️ `BroadcastEnteringLadderMiddle()`
- 🛠️ `LadderEnteringMiddleServerAck()`
- 🛠️ `GetFloatValue()`
- 🛠️ `UpdateEnteringTransition()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `GetTimeRange()`
- 🛠️ `CanEnteringCustomMovement()`
- 🛠️ `OnBeforeStartCustomMovement()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get CharacterMovement`
- `Get CurrentCustomMoveZone`
- `Get EnteringLadderMiddleTimeline_Time`
- `Get EnteringLadderMiddleTimeline_Transition`
- `Get OverlappedCustomMoveZone`
- `Get ServerInProgress`
- `Get bOrientRotationToMovement`
- `Get bUseControllerDesiredRotation`
- `Get bUseControllerRotationYaw`
- `Set CurrentCustomMoveZone`
- `Set EnteringLadderMiddleTimeline_Time`
- `Set EnteringTransitionBeginLocation`
- `Set EnteringTransitionBeginRotation`
- `Set EnteringTransitionEndLocation`
- `Set EnteringTransitionEndRotation`
- `Set IsLadderForNextAnimation`
- `Set IsTransitioningCustomMoveZone`
- `Set LadderBlendTimeForAnimation`
- `Set LadderStepPos`
- `Set PrevOrientRotationToMovement`
- `Set PrevUseControllerDesiredRotation`
- `Set PrevUseControllerRotationYaw`
- `Set ServerInProgress`
- `Set TransitionTargetLocation`
- `Set TransitionTargetRotation`
- `Set Velocity`
- `Set bOrientRotationToMovement`
- `Set bUseControllerDesiredRotation`
- `Set bUseControllerRotationYaw`

### 📌 Grafo: `LadderEnteringTop`

**Eventos de Entrada (Events):**
- 🟢 `LadderEnteringTopServerAck`
- 🟢 `ServerEnteringLadderTopRootMotion`
- 🟢 `BroadcastEnteringLadderTopRootMotion`
- 🟢 `EnteringLadderTop`
- 🟢 `ServerEnteringLadderTop`
- 🟢 `UpdateEnteringLadderTopTimeline`
- 🟢 `BroadcastEnteringLadderTop`
- 🔀 Contém `9` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `NotifyServerComplete()`
- 🛠️ `Delay()`
- 🛠️ `HasAuthority()`
- 🛠️ `SetMovementMode()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `ServerEnteringLadderTopRootMotion()`
- 🛠️ `BroadcastEnteringLadderTopRootMotion()`
- 🛠️ `GetPlayLength()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `GetController()`
- 🛠️ `GetLadderRotation()`
- 🛠️ `GetControlRotation()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeRotator()`
- 🛠️ `SetControlRotation()`
- 🛠️ `GetTopEnterLocation()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `LadderEnteringTopServerAck()`
- 🛠️ `BroadcastEnteringLadderTop()`
- 🛠️ `ServerEnteringLadderTop()`
- 🛠️ `GetFloatValue()`
- 🛠️ `UpdateEnteringTransition()`
- 🛠️ `GetTimeRange()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `CanEnteringCustomMovement()`
- 🛠️ `OnBeforeStartCustomMovement()`

**Variáveis Manipuladas:**
- `Get AM_EnteringLadderTop`
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get CharacterMovement`
- `Get CurrentCustomMoveZone`
- `Get EnteringLadderTopTimeline_Time`
- `Get EnteringLadderTopTimeline_Transition`
- `Get Mesh`
- `Get OverlappedCustomMoveZone`
- `Get ServerInProgress`
- `Get bOrientRotationToMovement`
- `Get bUseControllerDesiredRotation`
- `Get bUseControllerRotationYaw`
- `Set CurrentCustomMoveZone`
- `Set EnteringLadderTopTimeline_Time`
- `Set EnteringTransitionBeginLocation`
- `Set EnteringTransitionBeginRotation`
- `Set EnteringTransitionEndLocation`
- `Set EnteringTransitionEndRotation`
- `Set IsLadderForNextAnimation`
- `Set IsTransitioningCustomMoveZone`
- `Set LadderBlendTimeForAnimation`
- `Set LadderStepPos`
- `Set PrevOrientRotationToMovement`
- `Set PrevUseControllerDesiredRotation`
- `Set PrevUseControllerRotationYaw`
- `Set ServerInProgress`
- `Set TransitionTargetLocation`
- `Set TransitionTargetRotation`
- `Set Velocity`
- `Set bOrientRotationToMovement`
- `Set bUseControllerDesiredRotation`
- `Set bUseControllerRotationYaw`

### 📌 Grafo: `LadderExitingBottom`

**Eventos de Entrada (Events):**
- 🟢 `ServerExitingLadderBottomRootMotion`
- 🟢 `BroadcastExitingLadderBottomRootMotion`
- 🟢 `ExitingLadderBottom`
- 🟢 `ServerExitingLadderBottom`
- 🟢 `BroadcastExitingLadderBottom`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `NotifyServerComplete()`
- 🛠️ `SetMovementMode()`
- 🛠️ `GetPlayLength()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Delay()`
- 🛠️ `BroadcastExitingLadderBottomRootMotion()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `ServerExitingLadderBottomRootMotion()`
- 🛠️ `ServerExitingLadderBottom()`
- 🛠️ `BroadcastExitingLadderBottom()`
- 🛠️ `HasAuthority()`

**Variáveis Manipuladas:**
- `Get AM_ExitingLadderBottom`
- `Get Character`
- `Get CharacterMovement`
- `Get Mesh`
- `Get PrevOrientRotationToMovement`
- `Get PrevUseControllerDesiredRotation`
- `Get PrevUseControllerRotationYaw`
- `Get ServerInProgress`
- `Set CurrentCustomMoveZone`
- `Set IsLadderForNextAnimation`
- `Set IsTransitioningCustomMoveZone`
- `Set LadderBlendTimeForAnimation`
- `Set ServerInProgress`
- `Set bOrientRotationToMovement`
- `Set bUseControllerDesiredRotation`
- `Set bUseControllerRotationYaw`

### 📌 Grafo: `LadderExitingMiddle`

**Eventos de Entrada (Events):**
- 🟢 `ExitingLadderMiddle`
- 🟢 `ServerExitingLadderMiddle`
- 🟢 `BroadcastExitingLadderMiddle`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `HasAuthority()`
- 🛠️ `ServerExitingLadderMiddle()`
- 🛠️ `BroadcastExitingLadderMiddle()`
- 🛠️ `SetMovementMode()`
- 🛠️ `AddImpulse()`
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Delay()`
- 🛠️ `NotifyServerComplete()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get LadderBlendTimeForAnimation`
- `Get PrevOrientRotationToMovement`
- `Get PrevUseControllerDesiredRotation`
- `Get PrevUseControllerRotationYaw`
- `Get ServerInProgress`
- `Set CurrentCustomMoveZone`
- `Set IsLadderForNextAnimation`
- `Set IsTransitioningCustomMoveZone`
- `Set LadderBlendTimeForAnimation`
- `Set ServerInProgress`
- `Set bOrientRotationToMovement`
- `Set bUseControllerDesiredRotation`
- `Set bUseControllerRotationYaw`

### 📌 Grafo: `LadderExitingTop`

**Eventos de Entrada (Events):**
- 🟢 `ServerExitingLadderTopRootMotion`
- 🟢 `BroadcastExitingLadderTopRootMotion`
- 🟢 `ExitingLadderTop`
- 🟢 `ServerExitingLadderTop`
- 🟢 `BroadcastExitingLadderTop`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `NotifyServerComplete()`
- 🛠️ `ServerExitingLadderTop()`
- 🛠️ `BroadcastExitingLadderTop()`
- 🛠️ `SetMovementMode()`
- 🛠️ `BroadcastExitingLadderTopRootMotion()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `ServerExitingLadderTopRootMotion()`
- 🛠️ `Delay()`
- 🛠️ `GetPlayLength()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `HasAuthority()`

**Variáveis Manipuladas:**
- `Get AM_ExitingLadderTop`
- `Get Character`
- `Get CharacterMovement`
- `Get Mesh`
- `Get PrevOrientRotationToMovement`
- `Get PrevUseControllerDesiredRotation`
- `Get PrevUseControllerRotationYaw`
- `Get ServerInProgress`
- `Set CurrentCustomMoveZone`
- `Set IsLadderForNextAnimation`
- `Set IsTransitioningCustomMoveZone`
- `Set LadderBlendTimeForAnimation`
- `Set ServerInProgress`
- `Set bOrientRotationToMovement`
- `Set bUseControllerDesiredRotation`
- `Set bUseControllerRotationYaw`

### 📌 Grafo: `OnEndCustomMovement`

### 📌 Grafo: `OnStartCustomMovement`

### 📌 Grafo: `SwitchByCustomMoveZone`

**Variáveis Manipuladas:**
- `Get CurrentCustomMoveZone`

### 📌 Grafo: `Timeline`

### 📌 Grafo: `UpdateClimbingMovement`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsLocallyControlled()`
- 🛠️ `HasAuthority()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_MoveUpdatedComponent()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `GetCurrentAcceleration()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetTransform()`
- 🛠️ `InverseTransformDirection()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get ClimbingLocation`
- `Get ClimbingRotation`
- `Get IsTransitioningCustomMoveZone`
- `Get MaxAcceleration`
- `Get MaxClimbingDistance`
- `Set Velocity`

### 📌 Grafo: `UpdateLadderMovement`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `Not_PreBool()`
- 🛠️ `GetLadderLocation()`
- 🛠️ `GetLadderRotation()`
- 🛠️ `GetLadderStepHeight()`
- 🛠️ `GetCurrentAcceleration()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `BreakVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `FindClosestPointOnSegment()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Percent_FloatFloat()`
- 🛠️ `Round()`
- 🛠️ `Lerp()`
- 🛠️ `Normal()`
- 🛠️ `HasAuthority()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `K2_MoveUpdatedComponent()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get CharacterMovement`
- `Get IsTransitioningCustomMoveZone`
- `Get LadderMoveSpeed`
- `Get LadderStepPos`
- `Get MaxAcceleration`
- `Get MovementDeltaTime`
- `Get TempDeltaMovement`
- `Get TempLadderBottomLocation`
- `Get TempLadderInterface`
- `Get TempLadderRotation`
- `Get TempLadderStepHeight`
- `Get TempLadderTopLocation`
- `Get TempStepDownPos`
- `Set LadderStepPos`
- `Set TempDeltaMovement`
- `Set TempLadderBottomLocation`
- `Set TempLadderInterface`
- `Set TempLadderRotation`
- `Set TempLadderStepHeight`
- `Set TempLadderTopLocation`
- `Set TempStepDownPos`
- `Set Velocity`

### 📌 Grafo: `UpdateRootMotion`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `K2_MoveUpdatedComponent()`
- 🛠️ `IsPlayingRootMotion()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get MovementDeltaTime`
- `Get Velocity`
- `Set Velocity`

### 📌 Grafo: `UpdateTransition`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `HasAuthority()`
- 🛠️ `K2_MoveUpdatedComponent()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get Delta`
- `Get TransitionTargetLocation`
- `Get TransitionTargetRotation`
- `Set Delta`

### 📌 Grafo: `ExecuteUbergraph_BP_CustomMovementComponent`

**Comentários e Títulos de Seção Encontrados:**
- *"ExitCustomMovement"*
- *"UpdateEnteringTransition"*
- *"Tick"*
- *"UpdateCustomMovement"*
- *"InputAxis_Ladder"*
- *"InputAxis_Climbing"*
- *"AddCustomMovmentInput"*
- *"BeginPlay"*
- *"Notify Server Complete"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🟢 `UpdateEnteringTransition`
- 🟢 `ExitCustomMovement`
- 🟢 `UpdateCustomMovement`
- 🟢 `InputAxis_LadderUp`
- 🟢 `InputAxis_ClimbingUp`
- 🟢 `InputAxis_ClimbingRight`
- 🟢 `AddCustomMovementInput_Up`
- 🟢 `AddCustomMovementInput_Right`
- 🟢 `ReceiveBeginPlay`
- 🟢 `NotifyServerComplete`
- 🟢 `EnteringLadderTop`
- 🟢 `ServerEnteringLadderTop`
- 🟢 `BroadcastEnteringLadderTop`
- 🟢 `UpdateEnteringLadderTopTimeline`
- 🟢 `ServerEnteringLadderTopRootMotion`
- 🟢 `BroadcastEnteringLadderTopRootMotion`
- 🟢 `LadderEnteringTopServerAck`
- 🟢 `EnteringLadderBottom`
- 🟢 `ServerEnteringLadderBottom`
- 🟢 `BroadcastEnteringLadderBottom`
- 🟢 `UpdateEnteringLadderBottomTimeline`
- 🟢 `ServerEnteringLadderBottomRootMotion`
- 🟢 `BroadcastEnteringLadderBottomRootMotion`
- 🟢 `LadderEnteringBottomServerAck`
- 🟢 `EnteringLadderMiddle`
- 🟢 `ServerEnteringLadderMiddle`
- 🟢 `BroadcastEnteringLadderMiddle`
- 🟢 `UpdateEnteringLadderMiddleTimeline`
- 🟢 `LadderEnteringMiddleServerAck`
- 🟢 `ServerEnteringLadderMiddleChangeMode`
- 🟢 `BroadcastEnteringLadderMiddleChangeMode`
- 🟢 `ExitingLadderTop`
- 🟢 `ServerExitingLadderTop`
- 🟢 `BroadcastExitingLadderTop`
- 🟢 `ServerExitingLadderTopRootMotion`
- 🟢 `BroadcastExitingLadderTopRootMotion`
- 🟢 `ExitingLadderBottom`
- 🟢 `ServerExitingLadderBottom`
- 🟢 `BroadcastExitingLadderBottom`
- 🟢 `ServerExitingLadderBottomRootMotion`
- 🟢 `BroadcastExitingLadderBottomRootMotion`
- 🟢 `ExitingLadderMiddle`
- 🟢 `ServerExitingLadderMiddle`
- 🟢 `BroadcastExitingLadderMiddle`
- 🟢 `EnteringClimbing`
- 🟢 `ServerEnteringClimbing`
- 🟢 `BroadcastEnteringClimbing`
- 🟢 `UpdateEnteringClimbingTimeline`
- 🟢 `EnteringClimbingTop`
- 🟢 `ServerEnteringClimbingTop`
- 🟢 `BroadcastEnteringClimbingTop`
- 🟢 `UpdateEnteringClimbingTopTimeline`
- 🟢 `ServerEnteringClimbingTopRootMotion`
- 🟢 `BroadcastEnteringClimbingTopRootMotion`
- 🟢 `ClimbingEnteringTopServerAck`
- 🟢 `ExitingClimbing`
- 🟢 `ServerExitingClimbing`
- 🟢 `BroadcastExitingClimbing`
- 🟢 `ExitingClimbingTop`
- 🟢 `ServerExitingClimbingTop`
- 🟢 `BroadcastExitingClimbingTop`
- 🟢 `ServerExitingClimbingTopRootMotion`
- 🟢 `BroadcastExitingClimbingTopRootMotion`
- 🟢 `MovingNextHold`
- 🟢 `ServerMovingNextHold`
- 🟢 `BroadcastMovingNextHold`
- 🟢 `UpdateMovingNextHoldTimeline`
- 🟢 `OnCompleted_10C99DFB4BD067287B623280FDDB977B`
- 🟢 `OnBlendOut_10C99DFB4BD067287B623280FDDB977B`
- 🟢 `OnInterrupted_10C99DFB4BD067287B623280FDDB977B`
- 🟢 `OnNotifyBegin_10C99DFB4BD067287B623280FDDB977B`
- 🟢 `OnNotifyEnd_10C99DFB4BD067287B623280FDDB977B`
- 🟢 `OnCompleted_1E7B60B146BC1DBEED18AD8A88F50900`
- 🟢 `OnBlendOut_1E7B60B146BC1DBEED18AD8A88F50900`
- 🟢 `OnInterrupted_1E7B60B146BC1DBEED18AD8A88F50900`
- 🟢 `OnNotifyBegin_1E7B60B146BC1DBEED18AD8A88F50900`
- 🟢 `OnNotifyEnd_1E7B60B146BC1DBEED18AD8A88F50900`
- 🟢 `OnCompleted_0B6052B147BA631DEB594C87771CD3C0`
- 🟢 `OnBlendOut_0B6052B147BA631DEB594C87771CD3C0`
- 🟢 `OnInterrupted_0B6052B147BA631DEB594C87771CD3C0`
- 🟢 `OnNotifyBegin_0B6052B147BA631DEB594C87771CD3C0`
- 🟢 `OnNotifyEnd_0B6052B147BA631DEB594C87771CD3C0`
- 🟢 `OnCompleted_7815B4404043DE25B6C892B2CE924B63`
- 🟢 `OnBlendOut_7815B4404043DE25B6C892B2CE924B63`
- 🟢 `OnInterrupted_7815B4404043DE25B6C892B2CE924B63`
- 🟢 `OnNotifyBegin_7815B4404043DE25B6C892B2CE924B63`
- 🟢 `OnNotifyEnd_7815B4404043DE25B6C892B2CE924B63`
- 🟢 `OnCompleted_B8BEF53646A61DA7D191C7A89841AD91`
- 🟢 `OnBlendOut_B8BEF53646A61DA7D191C7A89841AD91`
- 🟢 `OnInterrupted_B8BEF53646A61DA7D191C7A89841AD91`
- 🟢 `OnNotifyBegin_B8BEF53646A61DA7D191C7A89841AD91`
- 🟢 `OnNotifyEnd_B8BEF53646A61DA7D191C7A89841AD91`
- 🟢 `OnCompleted_75ACA9E84656B4B8B7456FA3B66BF7A6`
- 🟢 `OnBlendOut_75ACA9E84656B4B8B7456FA3B66BF7A6`
- 🟢 `OnInterrupted_75ACA9E84656B4B8B7456FA3B66BF7A6`
- 🟢 `OnNotifyBegin_75ACA9E84656B4B8B7456FA3B66BF7A6`
- 🟢 `OnNotifyEnd_75ACA9E84656B4B8B7456FA3B66BF7A6`
- 🔀 Contém `92` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `ExitingLadderMiddle()`
- 🛠️ `ExitingClimbing()`
- 🛠️ `HasAuthority()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `VLerp()`
- 🛠️ `RLerp()`
- 🛠️ `CheckClimbingNextHold()`
- 🛠️ `UpdateRootMotion()`
- 🛠️ `UpdateLadderMovement()`
- 🛠️ `UpdateClimbingMovement()`
- 🛠️ `CheckExitingCustomMoveZone_Ladder()`
- 🛠️ `GetLadderLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Normal()`
- 🛠️ `AddMovementInput()`
- 🛠️ `CheckExitingClimbing()`
- 🛠️ `GetHoldRotation()`
- 🛠️ `GetUpVector()`
- 🛠️ `GetRightVector()`
- 🛠️ `CheckEnteringCustomMoveZone()`
- 🛠️ `FClamp()`
- 🛠️ `InputAxis_LadderUp()`
- 🛠️ `InputAxis_ClimbingUp()`
- 🛠️ `InputAxis_ClimbingRight()`
- 🛠️ `Initialize()`
- 🛠️ `GetOwner()`
- 🛠️ `UpdateTransition()`
- 🛠️ `Not_PreBool()`
- 🛠️ `SetMovementMode()`
- 🛠️ `GetController()`
- 🛠️ `GetLadderRotation()`
- 🛠️ `GetControlRotation()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeRotator()`
- 🛠️ `SetControlRotation()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `GetTopEnterLocation()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `BroadcastEnteringLadderTop()`
- 🛠️ `ServerEnteringLadderTop()`
- 🛠️ `GetFloatValue()`
- 🛠️ `UpdateEnteringTransition()`
- 🛠️ `GetTimeRange()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `ServerEnteringLadderTopRootMotion()`
- 🛠️ `BroadcastEnteringLadderTopRootMotion()`
- 🛠️ `CanEnteringCustomMovement()`
- 🛠️ `OnBeforeStartCustomMovement()`
- 🛠️ `Delay()`
- 🛠️ `GetPlayLength()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `LadderEnteringTopServerAck()`
- 🛠️ `NotifyServerComplete()`
- 🛠️ `ServerEnteringLadderBottom()`
- 🛠️ `BroadcastEnteringLadderBottom()`
- 🛠️ `BroadcastEnteringLadderBottomRootMotion()`
- 🛠️ `ServerEnteringLadderBottomRootMotion()`
- 🛠️ `GetBottomEnterLocation()`
- 🛠️ `LadderEnteringBottomServerAck()`
- 🛠️ `ServerEnteringLadderMiddle()`
- 🛠️ `BroadcastEnteringLadderMiddle()`
- 🛠️ `GetLadderStepHeight()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `FindClosestPointOnSegment()`
- 🛠️ `VSize()`
- 🛠️ `Percent_FloatFloat()`
- 🛠️ `LadderEnteringMiddleServerAck()`
- 🛠️ `BroadcastEnteringLadderMiddleChangeMode()`
- 🛠️ `ServerEnteringLadderMiddleChangeMode()`
- 🛠️ `ServerExitingLadderTop()`
- 🛠️ `BroadcastExitingLadderTop()`
- 🛠️ `BroadcastExitingLadderTopRootMotion()`
- 🛠️ `ServerExitingLadderTopRootMotion()`
- 🛠️ `ServerExitingLadderBottom()`
- 🛠️ `BroadcastExitingLadderBottom()`
- 🛠️ `BroadcastExitingLadderBottomRootMotion()`
- 🛠️ `ServerExitingLadderBottomRootMotion()`
- 🛠️ `ServerExitingLadderMiddle()`
- 🛠️ `BroadcastExitingLadderMiddle()`
- 🛠️ `AddImpulse()`
- 🛠️ `GetActorForwardVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `ServerEnteringClimbing()`
- 🛠️ `BroadcastEnteringClimbing()`
- 🛠️ `GetHoldLocation()`
- 🛠️ `ServerEnteringClimbingTop()`
- 🛠️ `BroadcastEnteringClimbingTop()`
- 🛠️ `GetTopEnterLocatoin()`
- 🛠️ `BroadcastEnteringClimbingTopRootMotion()`
- 🛠️ `ServerEnteringClimbingTopRootMotion()`
- 🛠️ `ClimbingEnteringTopServerAck()`
- 🛠️ `ServerExitingClimbing()`
- 🛠️ `BroadcastExitingClimbing()`
- 🛠️ `K2_SetActorRotation()`
- 🛠️ `ServerExitingClimbingTop()`
- 🛠️ `BroadcastExitingClimbingTop()`
- 🛠️ `BroadcastExitingClimbingTopRootMotion()`
- 🛠️ `ServerExitingClimbingTopRootMotion()`
- 🛠️ `ServerMovingNextHold()`
- 🛠️ `BroadcastMovingNextHold()`
- 🛠️ `MakeTransform()`
- 🛠️ `InverseTransformDirection()`
- 🛠️ `Abs()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `SelectFloat()`
- 🛠️ `IsValid()`
- 🛠️ `GetValidValue()`
- 🛠️ `MakeLiteralByte()`
- 🛠️ `CreateProxyObjectForPlayMontage()`
- 🛠️ `MarkPropertyDirtyFromRepIndex()`

**Variáveis Manipuladas:**
- `Get AM_EnteringClimbingTop`
- `Get AM_EnteringLadderBottom`
- `Get AM_EnteringLadderTop`
- `Get AM_ExitingClimbingTop`
- `Get AM_ExitingLadderBottom`
- `Get AM_ExitingLadderTop`
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get CharacterMovement`
- `Get ClimbingBlendTimeForAnimation`
- `Get ClimbingRotation`
- `Get CurrentCustomMoveZone`
- `Get CustomMovementMode`
- `Get EnteringClimbingTimeline_Time`
- `Get EnteringClimbingTimeline_Transition`
- `Get EnteringClimbingTopTimeline_Time`
- `Get EnteringClimbingTopTimeline_Transition`
- `Get EnteringLadderBottomTimeline_Time`
- `Get EnteringLadderBottomTimeline_Transition`
- `Get EnteringLadderMiddleTimeline_Time`
- `Get EnteringLadderMiddleTimeline_Transition`
- `Get EnteringLadderTopTimeline_Time`
- `Get EnteringLadderTopTimeline_Transition`
- `Get EnteringTransitionBeginLocation`
- `Get EnteringTransitionBeginRotation`
- `Get EnteringTransitionEndLocation`
- `Get EnteringTransitionEndRotation`
- `Get InputLadderUP`
- `Get IsTransitioningCustomMoveZone`
- `Get LadderBlendTimeForAnimation`
- `Get MaxClimbingDistance`
- `Get Mesh`
- `Get MovingNextHoldTimeline_PlayRate`
- `Get MovingNextHoldTimeline_Time`
- `Get MovingNextHoldTimeline_TransitionLocation`
- `Get MovingNextHoldTimeline_TransitionRotation`
- `Get MovingNextHoldTransitionDeltaForAnimation`
- `Get NextHold`
- `Get NextHoldInterface`
- `Get NextHoldIsFarHold`
- `Get OverlappedCustomMoveZone`
- `Get PrevOrientRotationToMovement`
- `Get PrevUseControllerDesiredRotation`
- `Get PrevUseControllerRotationYaw`
- `Get ServerInProgress`
- `Get bOrientRotationToMovement`
- `Get bUseControllerDesiredRotation`
- `Get bUseControllerRotationYaw`
- `Set ClimbingBlendTimeForAnimation`
- `Set ClimbingLocation`
- `Set ClimbingRotation`
- `Set CurrentCustomMoveZone`
- `Set EnteringClimbingTimeline_Time`
- `Set EnteringClimbingTopTimeline_Time`
- `Set EnteringLadderBottomTimeline_Time`
- `Set EnteringLadderMiddleTimeline_Time`
- `Set EnteringLadderTopTimeline_Time`
- `Set EnteringTransitionBeginLocation`
- `Set EnteringTransitionBeginRotation`
- `Set EnteringTransitionEndLocation`
- `Set EnteringTransitionEndRotation`
- `Set InputLadderUP`
- `Set IsClimbingForNextAnimation`
- `Set IsLadderForNextAnimation`
- `Set IsMovingNextHoldForAnimation`
- `Set IsTransitioningCustomMoveZone`
- `Set LadderBlendTimeForAnimation`
- `Set LadderStepPos`
- `Set MovementDeltaTime`
- `Set MovingNextHoldTimeline_PlayRate`
- `Set MovingNextHoldTimeline_Time`
- `Set MovingNextHoldTransitionAlphaForAnimation`
- `Set MovingNextHoldTransitionDeltaForAnimation`
- `Set NextHold`
- `Set NextHoldInterface`
- `Set NextHoldIsFarHold`
- `Set PrevOrientRotationToMovement`
- `Set PrevUseControllerDesiredRotation`
- `Set PrevUseControllerRotationYaw`
- `Set ServerInProgress`
- `Set TransitionTargetLocation`
- `Set TransitionTargetRotation`
- `Set Velocity`
- `Set bOrientRotationToMovement`
- `Set bUseControllerDesiredRotation`
- `Set bUseControllerRotationYaw`

### 📌 Grafo: `NotifyServerComplete`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `AddCustomMovementInput_Right`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `AddCustomMovementInput_Up`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `InputAxis_ClimbingRight`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `InputAxis_ClimbingUp`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `InputAxis_LadderUp`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `UpdateCustomMovement`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ExitCustomMovement`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `UpdateEnteringTransition`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `LadderEnteringTopServerAck`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastEnteringLadderTopRootMotion`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerEnteringLadderTopRootMotion`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `UpdateEnteringLadderTopTimeline`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastEnteringLadderTop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerEnteringLadderTop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `EnteringLadderTop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `LadderEnteringBottomServerAck`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastEnteringLadderBottomRootMotion`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerEnteringLadderBottomRootMotion`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `UpdateEnteringLadderBottomTimeline`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastEnteringLadderBottom`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerEnteringLadderBottom`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `EnteringLadderBottom`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastEnteringLadderMiddleChangeMode`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerEnteringLadderMiddleChangeMode`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `LadderEnteringMiddleServerAck`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `UpdateEnteringLadderMiddleTimeline`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastEnteringLadderMiddle`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerEnteringLadderMiddle`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `EnteringLadderMiddle`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastExitingLadderTopRootMotion`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerExitingLadderTopRootMotion`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastExitingLadderTop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerExitingLadderTop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ExitingLadderTop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastExitingLadderBottomRootMotion`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerExitingLadderBottomRootMotion`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastExitingLadderBottom`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerExitingLadderBottom`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ExitingLadderBottom`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastExitingLadderMiddle`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerExitingLadderMiddle`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ExitingLadderMiddle`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `UpdateEnteringClimbingTimeline`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastEnteringClimbing`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerEnteringClimbing`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `EnteringClimbing`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ClimbingEnteringTopServerAck`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastEnteringClimbingTopRootMotion`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerEnteringClimbingTopRootMotion`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `UpdateEnteringClimbingTopTimeline`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastEnteringClimbingTop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerEnteringClimbingTop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `EnteringClimbingTop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastExitingClimbing`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerExitingClimbing`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ExitingClimbing`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastExitingClimbingTopRootMotion`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerExitingClimbingTopRootMotion`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastExitingClimbingTop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerExitingClimbingTop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ExitingClimbingTop`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `UpdateMovingNextHoldTimeline`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BroadcastMovingNextHold`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `ServerMovingNextHold`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `MovingNextHold`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnCompleted_10C99DFB4BD067287B623280FDDB977B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnBlendOut_10C99DFB4BD067287B623280FDDB977B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnInterrupted_10C99DFB4BD067287B623280FDDB977B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnNotifyBegin_10C99DFB4BD067287B623280FDDB977B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnNotifyEnd_10C99DFB4BD067287B623280FDDB977B`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnCompleted_1E7B60B146BC1DBEED18AD8A88F50900`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnBlendOut_1E7B60B146BC1DBEED18AD8A88F50900`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnInterrupted_1E7B60B146BC1DBEED18AD8A88F50900`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnNotifyBegin_1E7B60B146BC1DBEED18AD8A88F50900`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnNotifyEnd_1E7B60B146BC1DBEED18AD8A88F50900`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnCompleted_0B6052B147BA631DEB594C87771CD3C0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnBlendOut_0B6052B147BA631DEB594C87771CD3C0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnInterrupted_0B6052B147BA631DEB594C87771CD3C0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnNotifyBegin_0B6052B147BA631DEB594C87771CD3C0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnNotifyEnd_0B6052B147BA631DEB594C87771CD3C0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnCompleted_7815B4404043DE25B6C892B2CE924B63`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnBlendOut_7815B4404043DE25B6C892B2CE924B63`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnInterrupted_7815B4404043DE25B6C892B2CE924B63`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnNotifyBegin_7815B4404043DE25B6C892B2CE924B63`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnNotifyEnd_7815B4404043DE25B6C892B2CE924B63`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnCompleted_B8BEF53646A61DA7D191C7A89841AD91`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnBlendOut_B8BEF53646A61DA7D191C7A89841AD91`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnInterrupted_B8BEF53646A61DA7D191C7A89841AD91`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnNotifyBegin_B8BEF53646A61DA7D191C7A89841AD91`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnNotifyEnd_B8BEF53646A61DA7D191C7A89841AD91`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnCompleted_75ACA9E84656B4B8B7456FA3B66BF7A6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnBlendOut_75ACA9E84656B4B8B7456FA3B66BF7A6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnInterrupted_75ACA9E84656B4B8B7456FA3B66BF7A6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnNotifyBegin_75ACA9E84656B4B8B7456FA3B66BF7A6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `OnNotifyEnd_75ACA9E84656B4B8B7456FA3B66BF7A6`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_CustomMovementComponent()`

### 📌 Grafo: `BeginOverlappedCustomMoveZone_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsLocallyControlled()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get OverlappedClimbingHolds`
- `Get OverlappedCustomMoveZone`
- `Set OverlappedCustomMoveZone`

### 📌 Grafo: `IsLocallyControlled_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsLocallyControlled()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Character`

### 📌 Grafo: `EndOverlappedCustomMoveZone_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsLocallyControlled()`
- 🛠️ `EqualEqual_ObjectObject()`

**Variáveis Manipuladas:**
- `Get OverlappedClimbingHolds`
- `Get OverlappedCustomMoveZone`
- `Set OverlappedCustomMoveZone`

### 📌 Grafo: `CheckEnteringCustomMoveZone_MERGED`
- 🔀 Contém `8` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `IsValid()`
- 🛠️ `FindClosestClimbingHold()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `BreakVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `CheckEnterToTop()`
- 🛠️ `EnteringLadderTop()`
- 🛠️ `CheckEnterToBottom()`
- 🛠️ `EnteringLadderBottom()`
- 🛠️ `IsFalling()`
- 🛠️ `CheckEnterToMiddle()`
- 🛠️ `EnteringLadderMiddle()`
- 🛠️ `EnteringClimbingTop()`
- 🛠️ `CheckEnter()`
- 🛠️ `EnteringClimbing()`
- 🛠️ `GetLastInputVector()`
- 🛠️ `Normal()`
- 🛠️ `VSize()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get CharacterMovement`
- `Get CurrentCustomMoveZone`
- `Get IsTransitioningCustomMoveZone`
- `Get OverlappedCustomMoveZone`
- `Get TempCharacterBottomLocation`
- `Get TempClimbingInterface`
- `Get TempInputDirection`
- `Get TempInputScale`
- `Get TempLadderInterface`
- `Set TempCharacterBottomLocation`
- `Set TempClimbingInterface`
- `Set TempInputDirection`
- `Set TempInputScale`
- `Set TempLadderInterface`

### 📌 Grafo: `CheckExitingCustomMoveZone_Ladder_MERGED`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `BreakVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `CheckExitToTop()`
- 🛠️ `ExitingLadderTop()`
- 🛠️ `CheckExitToBottom()`
- 🛠️ `ExitingLadderBottom()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get IsTransitioningCustomMoveZone`
- `Get TempCharacterBottomLocation`
- `Get TempInputScale`
- `Get TempLadderInterface`
- `Set TempCharacterBottomLocation`
- `Set TempInputScale`
- `Set TempLadderInterface`

### 📌 Grafo: `UpdateLadderMovement_MERGED`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `GetLadderLocation()`
- 🛠️ `GetLadderRotation()`
- 🛠️ `GetLadderStepHeight()`
- 🛠️ `GetCurrentAcceleration()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `BreakVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `FindClosestPointOnSegment()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Percent_FloatFloat()`
- 🛠️ `Round()`
- 🛠️ `Lerp()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `Normal()`
- 🛠️ `HasAuthority()`
- 🛠️ `IsLocallyControlled()`
- 🛠️ `K2_MoveUpdatedComponent()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get CharacterMovement`
- `Get CurrentCustomMoveZone`
- `Get IsTransitioningCustomMoveZone`
- `Get LadderMoveSpeed`
- `Get LadderStepPos`
- `Get MaxAcceleration`
- `Get MovementDeltaTime`
- `Get TempDeltaMovement`
- `Get TempLadderBottomLocation`
- `Get TempLadderInterface`
- `Get TempLadderRotation`
- `Get TempLadderStepHeight`
- `Get TempLadderTopLocation`
- `Get TempStepDownPos`
- `Set LadderStepPos`
- `Set TempDeltaMovement`
- `Set TempLadderBottomLocation`
- `Set TempLadderInterface`
- `Set TempLadderRotation`
- `Set TempLadderStepHeight`
- `Set TempLadderTopLocation`
- `Set TempStepDownPos`
- `Set Velocity`

### 📌 Grafo: `FindClosestClimbingHold_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- 🔀 Contém `5` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Greater_IntInt()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSizeSquared()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `IsValid()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get OverlappedClimbingHolds`
- `Get OverlappedCustomMoveZone`
- `Get TempFoundedHold`
- `Get TempMinDistanceSqrt`
- `Set OverlappedCustomMoveZone`
- `Set TempFoundedHold`
- `Set TempMinDistanceSqrt`

### 📌 Grafo: `CheckExitingClimbing_MERGED`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `CheckExitToTop()`
- 🛠️ `ExitingClimbingTop()`
- 🛠️ `CheckExitToBottom()`
- 🛠️ `ExitingClimbing()`

**Variáveis Manipuladas:**
- `Get ClimbingInterface`
- `Get InputScale`
- `Get IsTransitioningCustomMoveZone`

### 📌 Grafo: `UpdateRootMotion_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `K2_MoveUpdatedComponent()`
- 🛠️ `IsPlayingRootMotion()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get MovementDeltaTime`
- `Get Velocity`
- `Set Velocity`

### 📌 Grafo: `UpdateClimbingMovement_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsLocallyControlled()`
- 🛠️ `HasAuthority()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_MoveUpdatedComponent()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `GetCurrentAcceleration()`
- 🛠️ `Divide_VectorFloat()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetTransform()`
- 🛠️ `InverseTransformDirection()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get ClimbingLocation`
- `Get ClimbingRotation`
- `Get IsTransitioningCustomMoveZone`
- `Get MaxAcceleration`
- `Get MaxClimbingDistance`
- `Set Velocity`

### 📌 Grafo: `CheckClimbingNextHold_MERGED`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Not_PreBool()`
- 🛠️ `CheckMoveToNextHold()`
- 🛠️ `GetLastInputVector()`
- 🛠️ `Normal()`
- 🛠️ `VSize()`
- 🛠️ `MovingNextHold()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get CurrentCustomMoveZone`
- `Get IsTransitioningCustomMoveZone`

### 📌 Grafo: `GetCharacterNetSmoothLocation_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetTransform()`
- 🛠️ `TransformDirection()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `GetBaseTranslationOffset()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get Mesh`

### 📌 Grafo: `GetMovingNextHoldTransitionAlpha_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetCharacterNetSmoothLocation()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `FClamp()`

**Variáveis Manipuladas:**
- `Get EnteringTransitionBeginLocation`
- `Get EnteringTransitionEndLocation`

### 📌 Grafo: `GetLadderStepPos_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetLadderLocation()`
- 🛠️ `GetCharacterNetSmoothLocation()`
- 🛠️ `BreakVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `MakeVector()`
- 🛠️ `FindClosestPointOnSegment()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `VSize()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Percent_FloatFloat()`
- 🛠️ `GetLadderStepHeight()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CapsuleHalfHeight`
- `Get Character`
- `Get CurrentCustomMoveZone`

### 📌 Grafo: `IsCustomMovement_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get CurrentCustomMoveZone`
- `Get IsTransitioningCustomMoveZone`
- `Get ServerInProgress`

### 📌 Grafo: `HasAuthority_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `HasAuthority()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Character`

### 📌 Grafo: `Initialize_MERGED`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Set Character`
- `Set CharacterMovement`

### 📌 Grafo: `UpdateTransition_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsLocallyControlled()`
- 🛠️ `HasAuthority()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `K2_MoveUpdatedComponent()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get Delta`
- `Get TransitionTargetLocation`
- `Get TransitionTargetRotation`
- `Set Delta`

### 📌 Grafo: `Timeline_MERGED`

### 📌 Grafo: `OnStartCustomMovement_MERGED`

### 📌 Grafo: `OnEndCustomMovement_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_CustomMovementComponent`?
- Quais variáveis estão disponíveis no Blueprint `BP_CustomMovementComponent`?
- Quais funções e eventos são chamados no grafo do `BP_CustomMovementComponent`?