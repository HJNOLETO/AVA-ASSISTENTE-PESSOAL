# 🎮 Blueprint: CubitUniProjectile

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Cone Angle VFX` | `real (double)` |
| `RicochetCounter` | `int` |
| `Ricochet VFX Cone` | `real (double)` |
| `Deactivated?` | `bool` |
| `PhysicalSurfaces` | `byte (EPhysicalSurface)` |
| `MaterialValueStruct` | `struct (FXMaterialData)` |
| `MinX` | `real (double)` |
| `MinY` | `real (double)` |
| `MinZ` | `real (double)` |
| `MaxX` | `real (double)` |
| `MaxY` | `real (double)` |
| `MaxZ` | `real (double)` |
| `RicochetOccursConeAngleBase` | `real (double)` |
| `Ricochet_speed_reducer` | `real (double)` |
| `Decal Size` | `struct (Vector)` |
| `DecalMat` | `object (MaterialInterface)` |
| `MaterialValues` | `struct (ProjectileMaterialData)` |
| `Impact Velocity` | `struct (Vector)` |
| `ImpactResult` | `struct (HitResult)` |
| `LastPosition` | `struct (Vector)` |
| `Drag` | `object (CurveFloat)` |
| `DragPerCM` | `real (double)` |
| `InLiquid` | `bool` |
| `Bullet Roll` | `real (double)` |
| `BulletPitch` | `real (double)` |
| `BulletYaw` | `real (double)` |
| `Bullet_test1` | `object (StaticMeshComponent)` |
| `TraceDuration` | `real (double)` |
| `SurfaceType` | `byte (EPhysicalSurface)` |
| `RicochetVector` | `struct (Vector)` |
| `RicochetExitVelocity` | `real (double)` |
| `MuzzleVelocity` | `real (double)` |
| `RicochetEnabled` | `bool` |
| `WildRicochetEnabled` | `bool` |
| `WildRicochetAngleMultiplier` | `real (double)` |
| `WildRicochetSpeedMultiplier` | `real (double)` |
| `WildRicochetOccured` | `bool` |
| `Is Shrapnel?` | `bool` |
| `ProjectileSize` | `byte (Projectile_Size)` |
| `DataTable` | `struct (FXMaterialData)` |
| `Impact Type` | `byte (ImpactType)` |
| `RicochetOccured` | `bool` |
| `PenetrationCount` | `int` |
| `PenetrationOccured` | `bool` |
| `ProjectileState` | `byte (ProjectileState)` |
| `ImpactNormal` | `struct (Vector)` |
| `ImpactLocation` | `struct (Vector)` |
| `SurfaceName` | `name` |
| `ProjectilesVector` | `struct (Vector)` |
| `ProjectileTransform` | `struct (Transform)` |
| `Damage` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `RandomRicochetAngleAndSpeed`

**Comentários e Títulos de Seção Encontrados:**
- *"Random Ricochet angles"*
- *"Ricochet Projectile Speed loss min/max"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `RandomFloatInRange()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetDirectionUnitVector()`
- 🛠️ `VSize()`
- 🛠️ `RandomUnitVectorInConeInRadians()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get MaxX`
- `Get MaxY`
- `Get MaxZ`
- `Get MinX`
- `Get MinY`
- `Get MinZ`
- `Get Projectile`
- `Get Velocity`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Damage Enemy HUD"*
- *"Shrapnel or Not?"*
- *"Hit reaction character"*
- *"Impacto no personagem"*
- *"Keep trails alive long enough before killing projectile... "*
- *"Tracer Scale per velocity + Tracer Flare"*
- *"Damage HUD"*
- *"Bullet Bounce Event"*
- *"Damage HUD"*
- *"Simulating?"*
- *"Get velocity of projectile, multiply if desired or clamp value "*
- *"IMPACT - termination"*
- *"Components"*
- *"IMPACT - Ricochet"*
- *"Get velocity - decrease value/clamp then feed that to impulse"*
- *"Global Ricochet ON/OFF Switch"*
- *"Wild Ricochet Switch/logic"*
- *"Damage HUD"*
- *"Ricochet Switch"*
- *"Figure out impact angle and decide to ricochet or not..."*
- *"Ricochet Counter"*
- *"Random Ricochet deflection angle and speed reduction with material modifiers"*
- *"Impulse and Damage"*
- *"Damage HUD"*
- *"FX SPAWNER"*
- *"Prerequisite Inputs"*
- *"Calcular impulso do tiro no personagem"*
- *"Impacto do tiro depois do personagem morrer"*
- *"Efeito HeadShot + Impacto"*
- *"Detectar hit nos personagens"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__Projectile_K2Node_ComponentBoundEvent_132_OnProjectileBounceDelegate__DelegateSignature`
- 🟢 `BndEvt__Projectile_K2Node_ComponentBoundEvent_9_OnProjectileStopDelegate__DelegateSignature`
- 🟢 `DamageHUD`
- 🟢 `AddImpactOnCharacter`
- 🟢 `HitReactionCharacter`
- 🟢 `SpawnFX`
- 🟢 `Kill Projectile NO FX`
- 🟢 `RicochetON`
- 🟢 `ReceiveTick`
- 🟢 `ReceiveBeginPlay`
- 🔀 Contém `19` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `ApplyDamage()`
- 🛠️ `BreakHitResult()`
- 🛠️ `SetVisibility()`
- 🛠️ `PlaySlotAnimationAsDynamicMontage()`
- 🛠️ `AddImpulse()`
- 🛠️ `GreaterEqual_IntInt()`
- 🛠️ `SpawnFX()`
- 🛠️ `DamageHUD()`
- 🛠️ `Conv_IntToString()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `RicochetON()`
- 🛠️ `PrintString()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `Activate()`
- 🛠️ `Deactivate()`
- 🛠️ `ClampVectorSize()`
- 🛠️ `ApplyRadialDamageWithFalloff()`
- 🛠️ `IsSimulatingPhysics()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `AddImpulseAtLocation()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Delay()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `Conv_FloatToVector()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `GetDirectionUnitVector()`
- 🛠️ `GetTransform()`
- 🛠️ `BreakVector()`
- 🛠️ `GetVelocity()`
- 🛠️ `K2_DestroyActor()` — *Then destroy this projectile*
- 🛠️ `ActorHasTag()`
- 🛠️ `GetComponentByClass()`
- 🛠️ `RandomFloat()`
- 🛠️ `ComponentHasTag()`
- 🛠️ `SetDamage()`
- 🛠️ `K2_GetComponentToWorld()`
- 🛠️ `Not_PreBool()`
- 🛠️ `Conv_NameToString()`
- 🛠️ `GetWeaponSystem()`
- 🛠️ `AddImpactOnCharacter()`
- 🛠️ `HitReact()`
- 🛠️ `HitReactionCharacter()`
- 🛠️ `IsValid()`
- 🛠️ `StopMovementImmediately()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `Conv_VectorToString()`
- 🛠️ `VSize()`
- 🛠️ `IsActive()`
- 🛠️ `GetOwner()`
- 🛠️ `NormalizeToRange()`
- 🛠️ `SetRelativeScale3D()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `Multiply_VectorInt()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `GetHUD()`
- 🛠️ `GetCharacterDead()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get CollisionComponent`
- `Get Damage`
- `Get Impact Type`
- `Get Impact Velocity`
- `Get ImpactLocation`
- `Get ImpactResult`
- `Get Is Shrapnel?`
- `Get MaterialValues`
- `Get Mesh`
- `Get MuzzleVelocity`
- `Get PenetrationCount`
- `Get PointLight`
- `Get Projectile`
- `Get ProjectileSize`
- `Get ProjectileTransform`
- `Get ProjectilesVector`
- `Get RichochetSound`
- `Get RicochetCounter`
- `Get RicochetEnabled`
- `Get RicochetExitVelocity`
- `Get RicochetOccured`
- `Get RicochetOccursConeAngleBase`
- `Get RicochetParticle`
- `Get RicochetVector`
- `Get ShrapnelFlame`
- `Get SurfaceType`
- `Get TracerFlare`
- `Get TracerMesh`
- `Get UpdatedPrimitive`
- `Get Velocity`
- `Get WildRicochetAngleMultiplier`
- `Get WildRicochetOccured`
- `Get WildRicochetSpeedMultiplier`
- `Set Impact Type`
- `Set Impact Velocity`
- `Set ImpactLocation`
- `Set ImpactResult`
- `Set InitialSpeed`
- `Set MaterialValues`
- `Set ProjectileTransform`
- `Set ProjectilesVector`
- `Set RicochetCounter`
- `Set RicochetExitVelocity`
- `Set RicochetOccured`
- `Set RicochetVector`
- `Set SurfaceType`
- `Set Velocity`
- `Set WildRicochetAngleMultiplier`
- `Set WildRicochetOccured`
- `Set WildRicochetSpeedMultiplier`

### 📌 Grafo: `Get Bullets Forward Vector_2`

**Funções e Métodos Chamados:**
- 🛠️ `GetForwardVector()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `Conv_RotatorToVector()`

**Variáveis Manipuladas:**
- `Get Projectile`
- `Get UpdatedPrimitive`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `PrintString()`

**Variáveis Manipuladas:**
- `Get CollisionComponent`
- `Get ProjectileState`

### 📌 Grafo: `ExecuteUbergraph_CubitUniProjectile`

**Comentários e Títulos de Seção Encontrados:**
- *"Simulating?"*
- *"Get velocity of projectile, multiply if desired or clamp value "*
- *"IMPACT - termination"*
- *"Figure out impact angle and decide to ricochet or not..."*
- *"Impulse and Damage"*
- *"Keep trails alive long enough before killing projectile... "*
- *"FX SPAWNER"*
- *"Bullet Bounce Event"*
- *"Components"*
- *"IMPACT - Ricochet"*
- *"Get velocity - decrease value/clamp then feed that to impulse"*
- *"Random Ricochet deflection angle and speed reduction with material modifiers"*
- *"Ricochet Counter"*
- *"Global Ricochet ON/OFF Switch"*
- *"Wild Ricochet Switch/logic"*
- *"Ricochet Switch"*
- *"Tracer Scale per velocity + Tracer Flare"*
- *"Prerequisite Inputs"*
- *"Shrapnel or Not?"*
- *"Damage Enemy HUD"*
- *"Damage HUD"*
- *"Damage HUD"*
- *"Damage HUD"*
- *"Damage HUD"*
- *"Calcular impulso do tiro no personagem"*
- *"Impacto do tiro depois do personagem morrer"*
- *"Efeito HeadShot + Impacto"*
- *"Impacto no personagem"*
- *"Detectar hit nos personagens"*
- *"Hit reaction character"*
- *"Random Ricochet angles"*
- *"Ricochet Projectile Speed loss min/max"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__Projectile_K2Node_ComponentBoundEvent_132_OnProjectileBounceDelegate__DelegateSignature`
- 🟢 `BndEvt__Projectile_K2Node_ComponentBoundEvent_9_OnProjectileStopDelegate__DelegateSignature`
- 🟢 `RicochetON`
- 🟢 `ReceiveTick`
- 🟢 `SpawnFX`
- 🟢 `Kill Projectile NO FX`
- 🟢 `ReceiveBeginPlay`
- 🟢 `DamageHUD`
- 🟢 `AddImpactOnCharacter`
- 🟢 `HitReactionCharacter`
- 🔀 Contém `26` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AddImpulseAtLocation()`
- 🛠️ `GetVelocity()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `IsSimulatingPhysics()`
- 🛠️ `BreakHitResult()`
- 🛠️ `ApplyRadialDamageWithFalloff()`
- 🛠️ `ClampVectorSize()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `Multiply_VectorInt()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `K2_DestroyActor()` — *Then destroy this projectile*
- 🛠️ `Delay()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `SetVisibility()`
- 🛠️ `Deactivate()`
- 🛠️ `GetTransform()`
- 🛠️ `VSize()`
- 🛠️ `NormalizeToRange()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `SetRelativeScale3D()`
- 🛠️ `Conv_FloatToVector()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `StopMovementImmediately()`
- 🛠️ `SpawnFX()`
- 🛠️ `RandomFloat()`
- 🛠️ `PrintString()`
- 🛠️ `Conv_IntToString()`
- 🛠️ `RicochetON()`
- 🛠️ `Activate()`
- 🛠️ `IsActive()`
- 🛠️ `Conv_VectorToString()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `K2_GetComponentToWorld()`
- 🛠️ `GreaterEqual_IntInt()`
- 🛠️ `ApplyDamage()`
- 🛠️ `IsValid()`
- 🛠️ `ActorHasTag()`
- 🛠️ `ComponentHasTag()`
- 🛠️ `GetOwner()`
- 🛠️ `GetHUD()`
- 🛠️ `DamageHUD()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `PlaySlotAnimationAsDynamicMontage()`
- 🛠️ `AddImpulse()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `GetDirectionUnitVector()`
- 🛠️ `BreakVector()`
- 🛠️ `GetComponentByClass()`
- 🛠️ `SetDamage()`
- 🛠️ `AddImpactOnCharacter()`
- 🛠️ `Conv_NameToString()`
- 🛠️ `GetCharacterDead()`
- 🛠️ `Not_PreBool()`
- 🛠️ `GetWeaponSystem()`
- 🛠️ `HitReact()`
- 🛠️ `HitReactionCharacter()`
- 🛠️ `GetForwardVector()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `RandomUnitVectorInConeInRadians()`
- 🛠️ `MakeVector()`
- 🛠️ `BeginDeferredActorSpawnFromClass()`
- 🛠️ `FinishSpawningActor()`
- 🛠️ `SetStructurePropertyByName()`
- 🛠️ `SetVectorPropertyByName()`
- 🛠️ `SetBytePropertyByName()`
- 🛠️ `SetObjectPropertyByName()`
- 🛠️ `SetDoublePropertyByName()`
- 🛠️ `SetBoolPropertyByName()`
- 🛠️ `SetTransformPropertyByName()`
- 🛠️ `Multiply_VectorVector()`
- 🛠️ `Conv_DoubleToVector()`
- 🛠️ `EqualEqual_NameName()`
- 🛠️ `GetEnumeratorName()`
- 🛠️ `GetDataTableRowFromName()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get CollisionComponent`
- `Get Damage`
- `Get Impact Type`
- `Get Impact Velocity`
- `Get ImpactLocation`
- `Get ImpactResult`
- `Get Is Shrapnel?`
- `Get MaterialValues`
- `Get MaxX`
- `Get MaxY`
- `Get MaxZ`
- `Get Mesh`
- `Get MinX`
- `Get MinY`
- `Get MinZ`
- `Get MuzzleVelocity`
- `Get PenetrationCount`
- `Get PointLight`
- `Get Projectile`
- `Get ProjectileSize`
- `Get ProjectileTransform`
- `Get ProjectilesVector`
- `Get RichochetSound`
- `Get RicochetCounter`
- `Get RicochetEnabled`
- `Get RicochetExitVelocity`
- `Get RicochetOccured`
- `Get RicochetOccursConeAngleBase`
- `Get RicochetParticle`
- `Get RicochetVector`
- `Get ShrapnelFlame`
- `Get SurfaceType`
- `Get TracerFlare`
- `Get TracerMesh`
- `Get UpdatedPrimitive`
- `Get Velocity`
- `Get WildRicochetAngleMultiplier`
- `Get WildRicochetOccured`
- `Get WildRicochetSpeedMultiplier`
- `Set Impact Type`
- `Set Impact Velocity`
- `Set ImpactLocation`
- `Set ImpactResult`
- `Set InitialSpeed`
- `Set MaterialValues`
- `Set ProjectileTransform`
- `Set ProjectilesVector`
- `Set RicochetCounter`
- `Set RicochetExitVelocity`
- `Set RicochetOccured`
- `Set RicochetVector`
- `Set SurfaceType`
- `Set Velocity`
- `Set WildRicochetAngleMultiplier`
- `Set WildRicochetOccured`
- `Set WildRicochetSpeedMultiplier`

### 📌 Grafo: `BndEvt__Projectile_K2Node_ComponentBoundEvent_132_OnProjectileBounceDelegate__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile()`

### 📌 Grafo: `BndEvt__Projectile_K2Node_ComponentBoundEvent_9_OnProjectileStopDelegate__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile()`

### 📌 Grafo: `HitReactionCharacter`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile()`

### 📌 Grafo: `AddImpactOnCharacter`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile()`

### 📌 Grafo: `DamageHUD`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile()`

### 📌 Grafo: `Kill Projectile NO FX`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile()`

### 📌 Grafo: `RicochetON`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile()`

### 📌 Grafo: `SpawnFX`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile()`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile()`

### 📌 Grafo: `UserConstructionScript_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `PrintString()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get CollisionComponent`
- `Get ProjectileState`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `CubitUniProjectile`?
- Quais variáveis estão disponíveis no Blueprint `CubitUniProjectile`?
- Quais funções e eventos são chamados no grafo do `CubitUniProjectile`?