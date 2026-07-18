# 🎮 Blueprint: Grenade_Thrown

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Explosion Angle Variance VFX` | `real (double)` |
| `Bounces` | `int` |
| `ShrapnelActivated?` | `bool` |
| `Shrapnel Random Angle` | `real (double)` |
| `Fuse Delay` | `real (double)` |
| `Shrapnel` | `class (Actor)` |
| `ShrapnelCount` | `int` |
| `ImpNormVector` | `struct (Vector)` |
| `SurfaceHit` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Spawn VFX angle + random variance"*
- *"Bounces"*
- *"Fuse Delay"*
- *"Decal"*
- *"Explosion Mid air"*
- *"Camera Shake!"*
- *"Sound!"*
- *"Impulse and Damage"*
- *"Explosion On Surface"*
- *"Shrapnel Switch - keep it on... you know you want to."*
- *"Shrapnel Spawners"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__Projectile_K2Node_ComponentBoundEvent_132_OnProjectileBounceDelegate__DelegateSignature`
- 🟢 `ReceiveTick`
- 🟢 `ReceiveAnyDamage`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

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
- 🛠️ `GetDirectionUnitVector()`
- 🛠️ `RandomUnitVectorInConeInRadians()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeRotFromZ()`
- 🛠️ `GetGlobalTimeDilation()`
- 🛠️ `Delay()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `K2_DestroyActor()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `MakeLiteralInt()`
- 🛠️ `SetVelocityInLocalSpace()`
- 🛠️ `MakeTransform()`
- 🛠️ `RandomUnitVectorInEllipticalConeInDegrees()`
- 🛠️ `RandomRotator()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get Bounces`
- `Get CollisionComponent`
- `Get Explosion Angle Variance VFX`
- `Get Fuse Delay`
- `Get ImpNormVector`
- `Get Projectile`
- `Get Shrapnel Random Angle`
- `Get ShrapnelActivated?`
- `Get ShrapnelCount`
- `Get SurfaceHit`
- `Set Bounces`
- `Set ImpNormVector`
- `Set SurfaceHit`

### 📌 Grafo: `UserConstructionScript`

**Variáveis Manipuladas:**
- `Set Bounces`

### 📌 Grafo: `ExecuteUbergraph_Grenade_Thrown`

**Comentários e Títulos de Seção Encontrados:**
- *"Spawn VFX angle + random variance"*
- *"Bounces"*
- *"Fuse Delay"*
- *"Decal"*
- *"Explosion Mid air"*
- *"Camera Shake!"*
- *"Sound!"*
- *"Impulse and Damage"*
- *"Explosion On Surface"*
- *"Shrapnel Switch - keep it on... you know you want to."*
- *"Shrapnel Spawners"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__Projectile_K2Node_ComponentBoundEvent_132_OnProjectileBounceDelegate__DelegateSignature`
- 🟢 `ReceiveTick`
- 🟢 `ReceiveAnyDamage`
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
- 🛠️ `GetDirectionUnitVector()`
- 🛠️ `RandomUnitVectorInConeInRadians()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeRotFromZ()`
- 🛠️ `GetGlobalTimeDilation()`
- 🛠️ `Delay()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `K2_DestroyActor()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `MakeLiteralInt()`
- 🛠️ `SetVelocityInLocalSpace()`
- 🛠️ `MakeTransform()`
- 🛠️ `RandomUnitVectorInEllipticalConeInDegrees()`
- 🛠️ `RandomRotator()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `Add_IntInt()`
- 🛠️ `MakeVector()`
- 🛠️ `BeginDeferredActorSpawnFromClass()`
- 🛠️ `FinishSpawningActor()`
- 🛠️ `SetDoublePropertyByName()`
- 🛠️ `SetBoolPropertyByName()`

**Variáveis Manipuladas:**
- `Get Bounces`
- `Get CollisionComponent`
- `Get Explosion Angle Variance VFX`
- `Get Fuse Delay`
- `Get ImpNormVector`
- `Get Projectile`
- `Get Shrapnel Random Angle`
- `Get ShrapnelActivated?`
- `Get ShrapnelCount`
- `Get SurfaceHit`
- `Set Bounces`
- `Set ImpNormVector`
- `Set SurfaceHit`

### 📌 Grafo: `ReceiveAnyDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Grenade_Thrown()`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Grenade_Thrown()`

### 📌 Grafo: `BndEvt__Projectile_K2Node_ComponentBoundEvent_132_OnProjectileBounceDelegate__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Grenade_Thrown()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Variáveis Manipuladas:**
- `Set Bounces`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `Grenade_Thrown`?
- Quais variáveis estão disponíveis no Blueprint `Grenade_Thrown`?
- Quais funções e eventos são chamados no grafo do `Grenade_Thrown`?