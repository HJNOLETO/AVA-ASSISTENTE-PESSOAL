# 🎮 Blueprint: Canister2_Blueprint

**[Classe Pai / Parent Class: `StaticMeshActor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `AngleFX` | `real (double)` |
| `Punctured?` | `bool` |
| `Damage` | `real (double)` |
| `Can Be Damaged?` | `bool` |
| `Damage to puncture` | `real (double)` |
| `Damage to explode` | `real (double)` |
| `Venting` | `bool` |
| `Explosion Angle Variance VFX` | `real (double)` |
| `ShrapnelActivated?` | `bool` |
| `Shrapnel Random Angle` | `real (double)` |
| `Exploding` | `bool` |
| `ShrapnelCompleted` | `bool` |
| `DamageCounterDuration` | `real (double)` |
| `Propellant Force Multiplier` | `real (double)` |
| `NewVar_0` | `real (double)` |
| `NewVar_1` | `real (double)` |
| `SurfaceHit` | `bool` |
| `ImpactLocation` | `struct (Vector)` |
| `ShrapnelCount` | `int` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Random variance"*
- *"Spawn VFX angle + random variance"*
- *"Spawn Decal (pending)"*
- *"Explosion Mid Air"*
- *"Camera Shake!"*
- *"BOOMIFICATION Sound!"*
- *"Impulse and Damage"*
- *"Shrapnel angle"*
- *"Shrapnel Switch - keep it on... you know you want to."*
- *"Surface Explosion"*
- *"Trail FX"*
- *"Apply damage over time"*
- *"Force and Torque"*
- *"Call explode when damage reached"*
- *"Recieve puncture event"*
- *"Explode Event Triggered"*
- *"Tidy Up"*
- *"Wait for FX to fade then kill actor"*
- *"Damage Threshold Checks"*
- *"Hit Results"*
- *"Location"*
- *"Impact Normal"*
- *"Impact Normal"*
- *"Impact Point"*
- *"Set Standard Damage"*
- *"WIP, For later update"*
- *"Shrapnel Spawners"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveActorBeginOverlap` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `ReceiveTick` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `BndEvt__StaticMeshComponent_K2Node_ComponentBoundEvent_628_ComponentHitSignature__DelegateSignature`
- 🟢 `ReceiveAnyDamage`
- 🟢 `Explode`
- 🟢 `ReceiveBeginPlay`
- 🟢 `Punctured`
- 🟢 `Kill`
- 🔀 Contém `10` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetDirectionUnitVector()`
- 🛠️ `RandomUnitVectorInConeInRadians()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeRotFromZ()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `AddForce()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `SpawnSoundAtLocation()`
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `ApplyRadialDamageWithFalloff()`
- 🛠️ `SpawnDecalAtLocation()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `AddRadialImpulse()`
- 🛠️ `PlayWorldCameraShake()`
- 🛠️ `BreakHitResult()`
- 🛠️ `GetGlobalTimeDilation()`
- 🛠️ `Delay()`
- 🛠️ `SpawnEmitterAttached()`
- 🛠️ `MakeVector()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `IsOverlappingComponent()`
- 🛠️ `Punctured()`
- 🛠️ `Explode()`
- 🛠️ `GetPhysicsAngularVelocity()`
- 🛠️ `SpawnSoundAttached()`
- 🛠️ `Normal()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `SetVisibility()`
- 🛠️ `SetSimulatePhysics()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Stop()`
- 🛠️ `K2_DestroyActor()`
- 🛠️ `Kill()`
- 🛠️ `Play()`
- 🛠️ `SetEmitterEnable()`
- 🛠️ `MakeTransform()`
- 🛠️ `RandomUnitVectorInEllipticalConeInDegrees()`
- 🛠️ `SetVelocityInLocalSpace()`
- 🛠️ `MakeLiteralInt()`
- 🛠️ `AddTorqueInDegrees()`
- 🛠️ `GetMass()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get AngleFX`
- `Get Arrow`
- `Get Damage`
- `Get Damage to explode`
- `Get Damage to puncture`
- `Get DamageCounterDuration`
- `Get Explosion Angle Variance VFX`
- `Get Projectile`
- `Get Propellant Force Multiplier`
- `Get PunctureVenting_cue`
- `Get Punctured?`
- `Get Shrapnel Random Angle`
- `Get ShrapnelActivated?`
- `Get ShrapnelCompleted`
- `Get ShrapnelCount`
- `Get StaticMeshComponent`
- `Get Venting`
- `Set Damage`
- `Set Exploding`
- `Set ImpactLocation`
- `Set PitchMultiplier`
- `Set Punctured?`
- `Set ShrapnelCompleted`
- `Set Venting`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `SetCollisionProfileName()`

**Variáveis Manipuladas:**
- `Get StaticMeshComponent`
- `Set Damage`
- `Set bCanBeDamaged`

### 📌 Grafo: `ExecuteUbergraph_Canister2_Blueprint`

**Comentários e Títulos de Seção Encontrados:**
- *"Random variance"*
- *"Spawn VFX angle + random variance"*
- *"Spawn Decal (pending)"*
- *"Explosion Mid Air"*
- *"Camera Shake!"*
- *"BOOMIFICATION Sound!"*
- *"Impulse and Damage"*
- *"Shrapnel angle"*
- *"Shrapnel Switch - keep it on... you know you want to."*
- *"Surface Explosion"*
- *"Trail FX"*
- *"Apply damage over time"*
- *"Force and Torque"*
- *"Call explode when damage reached"*
- *"Recieve puncture event"*
- *"Explode Event Triggered"*
- *"Tidy Up"*
- *"Wait for FX to fade then kill actor"*
- *"Damage Threshold Checks"*
- *"Hit Results"*
- *"Location"*
- *"Impact Normal"*
- *"Impact Normal"*
- *"Impact Point"*
- *"Set Standard Damage"*
- *"WIP, For later update"*
- *"Shrapnel Spawners"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__StaticMeshComponent_K2Node_ComponentBoundEvent_628_ComponentHitSignature__DelegateSignature`
- 🟢 `ReceiveAnyDamage`
- 🟢 `Explode`
- 🟢 `ReceiveBeginPlay`
- 🟢 `Punctured`
- 🟢 `Kill`
- 🔀 Contém `12` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetDirectionUnitVector()`
- 🛠️ `RandomUnitVectorInConeInRadians()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeRotFromZ()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `AddForce()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `SpawnSoundAtLocation()`
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `ApplyRadialDamageWithFalloff()`
- 🛠️ `SpawnDecalAtLocation()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `AddRadialImpulse()`
- 🛠️ `PlayWorldCameraShake()`
- 🛠️ `BreakHitResult()`
- 🛠️ `GetGlobalTimeDilation()`
- 🛠️ `Delay()`
- 🛠️ `SpawnEmitterAttached()`
- 🛠️ `MakeVector()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `IsOverlappingComponent()`
- 🛠️ `Punctured()`
- 🛠️ `Explode()`
- 🛠️ `GetPhysicsAngularVelocity()`
- 🛠️ `SpawnSoundAttached()`
- 🛠️ `Normal()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `SetVisibility()`
- 🛠️ `SetSimulatePhysics()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Stop()`
- 🛠️ `K2_DestroyActor()`
- 🛠️ `Kill()`
- 🛠️ `Play()`
- 🛠️ `SetEmitterEnable()`
- 🛠️ `MakeTransform()`
- 🛠️ `RandomUnitVectorInEllipticalConeInDegrees()`
- 🛠️ `SetVelocityInLocalSpace()`
- 🛠️ `MakeLiteralInt()`
- 🛠️ `AddTorqueInDegrees()`
- 🛠️ `GetMass()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `Add_IntInt()`
- 🛠️ `IsValid()`
- 🛠️ `BeginDeferredActorSpawnFromClass()`
- 🛠️ `FinishSpawningActor()`
- 🛠️ `SetDoublePropertyByName()`
- 🛠️ `SetBoolPropertyByName()`

**Variáveis Manipuladas:**
- `Get AngleFX`
- `Get Arrow`
- `Get Damage`
- `Get Damage to explode`
- `Get Damage to puncture`
- `Get DamageCounterDuration`
- `Get Explosion Angle Variance VFX`
- `Get Projectile`
- `Get Propellant Force Multiplier`
- `Get PunctureVenting_cue`
- `Get Punctured?`
- `Get Shrapnel Random Angle`
- `Get ShrapnelActivated?`
- `Get ShrapnelCompleted`
- `Get ShrapnelCount`
- `Get StaticMeshComponent`
- `Get Venting`
- `Set Damage`
- `Set Exploding`
- `Set ImpactLocation`
- `Set PitchMultiplier`
- `Set Punctured?`
- `Set ShrapnelCompleted`
- `Set Venting`

### 📌 Grafo: `BndEvt__StaticMeshComponent_K2Node_ComponentBoundEvent_628_ComponentHitSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Canister2_Blueprint()`

### 📌 Grafo: `Kill`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Canister2_Blueprint()`

### 📌 Grafo: `Punctured`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Canister2_Blueprint()`

### 📌 Grafo: `ReceiveAnyDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Canister2_Blueprint()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Canister2_Blueprint()`

### 📌 Grafo: `Explode`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Canister2_Blueprint()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `SetCollisionProfileName()`
- 🛠️ `FlushNetDormancy()`
- 🛠️ `MarkPropertyDirtyFromRepIndex()`

**Variáveis Manipuladas:**
- `Get StaticMeshComponent`
- `Set Damage`
- `Set bCanBeDamaged`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `Canister2_Blueprint`?
- Quais variáveis estão disponíveis no Blueprint `Canister2_Blueprint`?
- Quais funções e eventos são chamados no grafo do `Canister2_Blueprint`?