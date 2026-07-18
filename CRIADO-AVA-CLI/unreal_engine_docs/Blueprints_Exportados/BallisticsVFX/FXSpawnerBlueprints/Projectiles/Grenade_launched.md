# 🎮 Blueprint: Grenade_launched

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Explosion Angle Variance VFX` | `real (double)` |
| `Bounces` | `int` |
| `ShrapnelActivated?` | `bool` |
| `Shrapnel Random Angle` | `real (double)` |
| `DecalMat` | `object (MaterialInterface)` |
| `ImpNormVector` | `struct (Vector)` |
| `ShrapnelCount` | `int` |
| `SurfaceHit` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Spawn VFX angle + random variance"*
- *"Bounces"*
- *"Bounce Count to trigger BOOMIFICATION!"*
- *"Decal Spawn"*
- *"Explosion"*
- *"Camera Shake!"*
- *"Sound!"*
- *"Impulse and Damage"*
- *"Shrapnel Switch - keep it on... you know you want to."*
- *"Shrapnel Spawners"*
- *"Decal Chooser"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__Projectile_K2Node_ComponentBoundEvent_132_OnProjectileBounceDelegate__DelegateSignature`
- 🟢 `ReceiveTick`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SpawnSoundAtLocation()`
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `ApplyRadialDamageWithFalloff()`
- 🛠️ `SpawnDecalAtLocation()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `AddRadialImpulse()`
- 🛠️ `PlayWorldCameraShake()`
- 🛠️ `BreakHitResult()`
- 🛠️ `PrintString()`
- 🛠️ `Conv_IntToString()`
- 🛠️ `K2_DestroyActor()`
- 🛠️ `GreaterEqual_IntInt()`
- 🛠️ `GetDirectionUnitVector()`
- 🛠️ `RandomUnitVectorInConeInRadians()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeRotFromZ()`
- 🛠️ `MakeRotFromX()`
- 🛠️ `GetGlobalTimeDilation()`
- 🛠️ `MakeTransform()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `RandomIntegerInRange()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `SetScalarParameterValue()`
- 🛠️ `MakeVector()`
- 🛠️ `RandomUnitVectorInEllipticalConeInDegrees()`
- 🛠️ `MakeLiteralInt()`
- 🛠️ `RandomRotator()`
- 🛠️ `SetVelocityInLocalSpace()`

**Variáveis Manipuladas:**
- `Get Bounces`
- `Get DecalMat`
- `Get Explosion Angle Variance VFX`
- `Get ImpNormVector`
- `Get Projectile`
- `Get Shrapnel Random Angle`
- `Get ShrapnelActivated?`
- `Get ShrapnelCount`
- `Get SurfaceHit`
- `Set Bounces`
- `Set DecalMat`
- `Set ImpNormVector`
- `Set SurfaceHit`

### 📌 Grafo: `UserConstructionScript`

**Variáveis Manipuladas:**
- `Set Bounces`

### 📌 Grafo: `ExecuteUbergraph_Grenade_launched`

**Comentários e Títulos de Seção Encontrados:**
- *"Spawn VFX angle + random variance"*
- *"Bounces"*
- *"Bounce Count to trigger BOOMIFICATION!"*
- *"Decal Spawn"*
- *"Explosion"*
- *"Camera Shake!"*
- *"Sound!"*
- *"Impulse and Damage"*
- *"Shrapnel Switch - keep it on... you know you want to."*
- *"Shrapnel Spawners"*
- *"Decal Chooser"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__Projectile_K2Node_ComponentBoundEvent_132_OnProjectileBounceDelegate__DelegateSignature`
- 🟢 `ReceiveTick`
- 🔀 Contém `5` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SpawnSoundAtLocation()`
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `ApplyRadialDamageWithFalloff()`
- 🛠️ `SpawnDecalAtLocation()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `AddRadialImpulse()`
- 🛠️ `PlayWorldCameraShake()`
- 🛠️ `BreakHitResult()`
- 🛠️ `PrintString()`
- 🛠️ `Conv_IntToString()`
- 🛠️ `K2_DestroyActor()`
- 🛠️ `GreaterEqual_IntInt()`
- 🛠️ `GetDirectionUnitVector()`
- 🛠️ `RandomUnitVectorInConeInRadians()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeRotFromZ()`
- 🛠️ `MakeRotFromX()`
- 🛠️ `GetGlobalTimeDilation()`
- 🛠️ `MakeTransform()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `RandomIntegerInRange()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `SetScalarParameterValue()`
- 🛠️ `MakeVector()`
- 🛠️ `RandomUnitVectorInEllipticalConeInDegrees()`
- 🛠️ `MakeLiteralInt()`
- 🛠️ `RandomRotator()`
- 🛠️ `SetVelocityInLocalSpace()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `Add_IntInt()`
- 🛠️ `IsValid()`
- 🛠️ `BeginDeferredActorSpawnFromClass()`
- 🛠️ `FinishSpawningActor()`
- 🛠️ `SetDoublePropertyByName()`
- 🛠️ `SetBoolPropertyByName()`

**Variáveis Manipuladas:**
- `Get Bounces`
- `Get DecalMat`
- `Get Explosion Angle Variance VFX`
- `Get ImpNormVector`
- `Get Projectile`
- `Get Shrapnel Random Angle`
- `Get ShrapnelActivated?`
- `Get ShrapnelCount`
- `Get SurfaceHit`
- `Set Bounces`
- `Set DecalMat`
- `Set ImpNormVector`
- `Set SurfaceHit`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Grenade_launched()`

### 📌 Grafo: `BndEvt__Projectile_K2Node_ComponentBoundEvent_132_OnProjectileBounceDelegate__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Grenade_launched()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Variáveis Manipuladas:**
- `Set Bounces`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `Grenade_launched`?
- Quais variáveis estão disponíveis no Blueprint `Grenade_launched`?
- Quais funções e eventos são chamados no grafo do `Grenade_launched`?