# 🎮 Blueprint: ALS_PlayerCameraManager

**[Classe Pai / Parent Class: `PlayerCameraManager`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `ControlledPawn` | `object (Pawn)` |
| `DebugViewOffset` | `struct (Vector)` |
| `DebugViewRotation` | `struct (Rotator)` |
| `RootLocation` | `struct (Vector)` |
| `SmoothedPivotTarget` | `struct (Transform)` |
| `PivotLocation` | `struct (Vector)` |
| `TargetCameraLocation` | `struct (Vector)` |
| `TargetCameraRotation` | `struct (Rotator)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Set \"*
- *"Updated references in the Camera Behavior AnimBP."*
- *"Mudar posição da camera"*

**Eventos de Entrada (Events):**
- 🟢 `OnPossess`
- 🟢 `ChangeCameraPosition`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `GetOwningPlayerController()`
- 🛠️ `PlaySound2D()`

**Variáveis Manipuladas:**
- `Get CameraBehavior`
- `Get ControlledPawn`
- `Set CameraChange`
- `Set ControlledPawn`
- `Set PlayerController`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `BlueprintUpdateCamera`

**Comentários e Títulos de Seção Encontrados:**
- *"Check the Camera Target actor for the \"*
- *"Calculate custom camera parameters"*
- *"Run Parent Function to return the default camera parameters"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `ActorHasTag()`
- 🛠️ `CustomCameraBehavior()`

**Variáveis Manipuladas:**
- `Get CameraTarget`

### 📌 Grafo: `CustomCameraBehavior`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 2: Calculate Target Camera Rotation. Use the Control Rotation and interpolate for smooth camera rotation."*
- *"Step 3: Calculate the Smoothed Pivot Target (Orange Sphere). Get the 3P Pivot Target (Green Sphere) and interpolate using axis independent lag for maximum control."*
- *"Step 4: Calculate Pivot Location (BlueSphere). Get the Smoothed Pivot Target and apply local offsets for further camera control."*
- *"Step 5: Calculate Target Camera Location. Get the Pivot location and apply camera relative offsets."*
- *"Step 6: Trace for an object between the camera and character to apply a corrective offset. Trace origins are set within the Character BP via the Camera Interface. Functions like the normal spring arm, but can allow for different trace origins regardless of the pivot. "*
- *"Step 7: Draw Debug Shapes."*
- *"Step 1: Get Camera Parameters from CharacterBP via the Camera Interface"*
- *"Step 8: Lerp First Person Override and return target camera parameters."*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetForwardVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetUpVector()`
- 🛠️ `GetRightVector()`
- 🛠️ `GetOwningPlayerController()`
- 🛠️ `GetControlRotation()`
- 🛠️ `RInterpTo()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `DrawDebugSphere()`
- 🛠️ `DrawDebugLine()`
- 🛠️ `Get_CameraBehaviorParam()`
- 🛠️ `GetCameraRotation()`
- 🛠️ `BreakTransform()`
- 🛠️ `BPI_Get_DebugInfo()`
- 🛠️ `MakeTransform()`
- 🛠️ `CalculateAxisIndependentLag()`
- 🛠️ `MakeVector()`
- 🛠️ `SphereTraceSingle()`
- 🛠️ `BreakHitResult()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `BPI_Get_3P_TraceParams()`
- 🛠️ `BPI_Get_CameraParameters()`
- 🛠️ `BPI_Get_3P_PivotTarget()`
- 🛠️ `BPI_Get_FP_CameraTarget()`
- 🛠️ `Lerp()`
- 🛠️ `TLerp()`
- 🛠️ `Not_PreBool()`
- 🛠️ `VLerp()`
- 🛠️ `RLerp()`
- 🛠️ `GetDebugTraceType()`

**Variáveis Manipuladas:**
- `Get ControlledPawn`
- `Get DebugViewOffset`
- `Get DebugViewRotation`
- `Get FPFOV`
- `Get FPTarget`
- `Get PivotLocation`
- `Get PivotTarget`
- `Get SmoothedPivotTarget`
- `Get TPFOV`
- `Get TargetCameraLocation`
- `Get TargetCameraRotation`
- `Set FPFOV`
- `Set FPTarget`
- `Set PivotLocation`
- `Set PivotTarget`
- `Set SmoothedPivotTarget`
- `Set TPFOV`
- `Set TargetCameraLocation`
- `Set TargetCameraRotation`

### 📌 Grafo: `CalculateAxisIndependentLag`

**Funções e Métodos Chamados:**
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `GreaterGreater_VectorRotator()`
- 🛠️ `LessLess_VectorRotator()`
- 🛠️ `MakeVector()`
- 🛠️ `FInterpTo()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get CameraRotation`
- `Get CameraRotationYaw`
- `Get CurrentLocation`
- `Get LagSpeeds`
- `Get TargetLocation`
- `Set CameraRotationYaw`

### 📌 Grafo: `Get_CameraBehaviorParam`

**Comentários e Títulos de Seção Encontrados:**
- *"Get an Anim Curve value from the Player Camera Behavior AnimBP to use as a parameter in the custom camera behavior calculations"*

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `GetCurveValue()`

**Variáveis Manipuladas:**
- `Get CameraBehavior`
- `Get CurveName`

### 📌 Grafo: `GetDebugTraceType`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`
- 🛠️ `BPI_Get_DebugInfo()`

### 📌 Grafo: `ExecuteUbergraph_ALS_PlayerCameraManager`

**Comentários e Títulos de Seção Encontrados:**
- *"Set \"*
- *"Updated references in the Camera Behavior AnimBP."*
- *"Mudar posição da camera"*

**Eventos de Entrada (Events):**
- 🟢 `OnPossess`
- 🟢 `ChangeCameraPosition`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `GetOwningPlayerController()`
- 🛠️ `PlaySound2D()`

**Variáveis Manipuladas:**
- `Get CameraBehavior`
- `Get ControlledPawn`
- `Set CameraChange`
- `Set ControlledPawn`
- `Set PlayerController`

### 📌 Grafo: `ChangeCameraPosition`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_PlayerCameraManager()`

### 📌 Grafo: `OnPossess`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_PlayerCameraManager()`

### 📌 Grafo: `UserConstructionScript_MERGED`

### 📌 Grafo: `BlueprintUpdateCamera_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Check the Camera Target actor for the \"*
- *"Calculate custom camera parameters"*
- *"Run Parent Function to return the default camera parameters"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `ActorHasTag()`
- 🛠️ `CustomCameraBehavior()`

**Variáveis Manipuladas:**
- `Get CameraTarget`
- `Set TargetFOV`
- `Set TargetLocation`
- `Set TargetRotation`

### 📌 Grafo: `CustomCameraBehavior_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Step 2: Calculate Target Camera Rotation. Use the Control Rotation and interpolate for smooth camera rotation."*
- *"Step 3: Calculate the Smoothed Pivot Target (Orange Sphere). Get the 3P Pivot Target (Green Sphere) and interpolate using axis independent lag for maximum control."*
- *"Step 4: Calculate Pivot Location (BlueSphere). Get the Smoothed Pivot Target and apply local offsets for further camera control."*
- *"Step 5: Calculate Target Camera Location. Get the Pivot location and apply camera relative offsets."*
- *"Step 6: Trace for an object between the camera and character to apply a corrective offset. Trace origins are set within the Character BP via the Camera Interface. Functions like the normal spring arm, but can allow for different trace origins regardless of the pivot. "*
- *"Step 7: Draw Debug Shapes."*
- *"Step 1: Get Camera Parameters from CharacterBP via the Camera Interface"*
- *"Step 8: Lerp First Person Override and return target camera parameters."*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetForwardVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetUpVector()`
- 🛠️ `GetRightVector()`
- 🛠️ `GetOwningPlayerController()`
- 🛠️ `GetControlRotation()`
- 🛠️ `RInterpTo()`
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `DrawDebugSphere()`
- 🛠️ `DrawDebugLine()`
- 🛠️ `Get_CameraBehaviorParam()`
- 🛠️ `GetCameraRotation()`
- 🛠️ `BreakTransform()`
- 🛠️ `BPI_Get_DebugInfo()`
- 🛠️ `MakeTransform()`
- 🛠️ `CalculateAxisIndependentLag()`
- 🛠️ `MakeVector()`
- 🛠️ `SphereTraceSingle()`
- 🛠️ `BreakHitResult()`
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `BPI_Get_3P_TraceParams()`
- 🛠️ `BPI_Get_CameraParameters()`
- 🛠️ `BPI_Get_3P_PivotTarget()`
- 🛠️ `BPI_Get_FP_CameraTarget()`
- 🛠️ `Lerp()`
- 🛠️ `TLerp()`
- 🛠️ `Not_PreBool()`
- 🛠️ `VLerp()`
- 🛠️ `RLerp()`
- 🛠️ `GetDebugTraceType()`

**Variáveis Manipuladas:**
- `Get ControlledPawn`
- `Get DebugViewOffset`
- `Get DebugViewRotation`
- `Get FPFOV`
- `Get FPTarget`
- `Get PivotLocation`
- `Get PivotTarget`
- `Get SmoothedPivotTarget`
- `Get TPFOV`
- `Get TargetCameraLocation`
- `Get TargetCameraRotation`
- `Set FPFOV`
- `Set FPTarget`
- `Set PivotLocation`
- `Set PivotTarget`
- `Set SmoothedPivotTarget`
- `Set TPFOV`
- `Set TargetCameraLocation`
- `Set TargetCameraRotation`

### 📌 Grafo: `CalculateAxisIndependentLag_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetWorldDeltaSeconds()`
- 🛠️ `GreaterGreater_VectorRotator()`
- 🛠️ `LessLess_VectorRotator()`
- 🛠️ `MakeVector()`
- 🛠️ `FInterpTo()`
- 🛠️ `MakeRotator()`
- 🛠️ `BreakRotator()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get CameraRotation`
- `Get CameraRotationYaw`
- `Get CurrentLocation`
- `Get LagSpeeds`
- `Get TargetLocation`
- `Set CameraRotationYaw`

### 📌 Grafo: `Get_CameraBehaviorParam_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Get an Anim Curve value from the Player Camera Behavior AnimBP to use as a parameter in the custom camera behavior calculations"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `GetCurveValue()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get CameraBehavior`
- `Get CurveName`

### 📌 Grafo: `GetDebugTraceType_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerController()`
- 🛠️ `BPI_Get_DebugInfo()`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `ALS_PlayerCameraManager`?
- Quais variáveis estão disponíveis no Blueprint `ALS_PlayerCameraManager`?
- Quais funções e eventos são chamados no grafo do `ALS_PlayerCameraManager`?