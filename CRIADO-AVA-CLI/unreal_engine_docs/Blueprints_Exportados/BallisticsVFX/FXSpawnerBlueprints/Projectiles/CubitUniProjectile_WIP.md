# 🎮 Blueprint: CubitUniProjectile_WIP

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
| `Overlapping` | `object (PrimitiveComponent)` |
| `Hit Component` | `object (PrimitiveComponent)` |
| `Penetrating` | `bool` |
| `DragCurve` | `object (CurveFloat)` |
| `PenetrationEnabled` | `bool` |
| `SurfaceName` | `name` |
| `PenetratorProjectile` | `object` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"IMPACT - termination"*
- *"Figure out impact angle and decide to ricochet or not..."*
- *"Keep trails alive long enough before killing projectile... "*
- *"FX SPAWNER"*
- *"Bullet Bounce Event"*
- *"Components"*
- *"Random Ricochet deflection angle and speed reduction with material modifiers"*
- *"Ricochet Counter"*
- *"Global Ricochet ON/OFF Switch"*
- *"Wild Ricochet Switch/logic"*
- *"Ricochet Switch"*
- *"Tracer Scale per velocity + Tracer Flare"*
- *"Prerequisite Inputs"*
- *"Penetration"*
- *"Penetration Timer WIP"*
- *"Random Vector WIP"*
- *"Penetration Spawn Projectile etc WIP\r\n"*
- *"Remember to mouse over the input pin text for tool tips"*
- *"Get velocity of projectile, multiply if desired or clamp value "*
- *"Damage Dealer"*
- *"Liquid Tag Check"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__Projectile_K2Node_ComponentBoundEvent_132_OnProjectileBounceDelegate__DelegateSignature`
- 🟢 `BndEvt__Projectile_K2Node_ComponentBoundEvent_9_OnProjectileStopDelegate__DelegateSignature`
- 🟢 `RicochetSuccess`
- 🟢 `ReceiveTick`
- 🟢 `SpawnFX`
- 🟢 `PenetrationON`
- 🟢 `Kill Projectile NO FX`
- 🟢 `PenetrationSuccess`
- 🟢 `Timer`
- 🟢 `PenetrationInitialise`
- 🟢 `RicochetInitialise`
- 🟢 `DamageDealer`
- 🟢 `WaterExit`
- 🟢 `WaterCheck`
- 🟢 `ReceiveBeginPlay`
- 🔀 Contém `17` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `BreakHitResult()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `Multiply_VectorInt()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `K2_DestroyActor()`
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
- 🛠️ `RicochetSuccess()`
- 🛠️ `Activate()`
- 🛠️ `IsActive()`
- 🛠️ `GetDirectionUnitVector()`
- 🛠️ `RandomUnitVectorInConeInRadians()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `GreaterEqual_IntInt()`
- 🛠️ `Kill Projectile NO FX()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `PenetrationSuccess()`
- 🛠️ `K2_SetTimer()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `MakeRotator()`
- 🛠️ `ComposeRotators()`
- 🛠️ `GetForwardVector()`
- 🛠️ `EqualEqual_ObjectObject()`
- 🛠️ `PenetrationInitialise()`
- 🛠️ `RicochetInitialise()`
- 🛠️ `DamageDealer()`
- 🛠️ `ApplyRadialDamageWithFalloff()`
- 🛠️ `AddImpulseAtLocation()`
- 🛠️ `IsSimulatingPhysics()`
- 🛠️ `GetVelocity()`
- 🛠️ `ClampVectorSize()`
- 🛠️ `PrintString()`
- 🛠️ `WaterExit()`
- 🛠️ `WaterCheck()`
- 🛠️ `PenetrationON()`
- 🛠️ `ComponentHasTag()`
- 🛠️ `SetUpdatedComponent()`
- 🛠️ `K2_PauseTimer()`
- 🛠️ `Conv_IntToString()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get CollisionComponent`
- `Get Hit Component`
- `Get Impact Type`
- `Get Impact Velocity`
- `Get ImpactLocation`
- `Get ImpactResult`
- `Get Is Shrapnel?`
- `Get MaterialValues`
- `Get PenetrationCount`
- `Get PenetrationEnabled`
- `Get PointLight`
- `Get Projectile`
- `Get ProjectileSize`
- `Get ProjectileState`
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
- `Get Velocity`
- `Get WildRicochetAngleMultiplier`
- `Get WildRicochetEnabled`
- `Get WildRicochetOccured`
- `Get WildRicochetSpeedMultiplier`
- `Set DragPerCM`
- `Set Hit Component`
- `Set Impact Type`
- `Set Impact Velocity`
- `Set ImpactLocation`
- `Set ImpactResult`
- `Set InitialSpeed`
- `Set MaterialValues`
- `Set Overlapping`
- `Set Penetrating`
- `Set PenetrationCount`
- `Set ProjectileGravityScale`
- `Set ProjectileState`
- `Set RicochetCounter`
- `Set RicochetExitVelocity`
- `Set RicochetOccured`
- `Set RicochetVector`
- `Set SurfaceType`
- `Set Velocity`
- `Set WildRicochetAngleMultiplier`
- `Set WildRicochetOccured`
- `Set WildRicochetSpeedMultiplier`

### 📌 Grafo: `Get Bullets Forward Vector`

**Funções e Métodos Chamados:**
- 🛠️ `GetForwardVector()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `Conv_RotatorToVector()`

**Variáveis Manipuladas:**
- `Get Projectile`
- `Get UpdatedPrimitive`

### 📌 Grafo: `RandomRicochetAngleAndSpeed`

**Comentários e Títulos de Seção Encontrados:**
- *"Random Ricochet angles"*
- *"Ricochet Projectile Speed loss min/max"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `RandomFloatInRange()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `GetDirectionUnitVector()`
- 🛠️ `RandomUnitVectorInConeInRadians()`
- 🛠️ `VSize()`
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

### 📌 Grafo: `DRAGGER`

**Funções e Métodos Chamados:**
- 🛠️ `VSize()`
- 🛠️ `GetFloatValue()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get DragCurve`
- `Get DragPerCM`
- `Get Projectile`
- `Get Velocity`

### 📌 Grafo: `TemporaryMaterialTranslator`

**Funções e Métodos Chamados:**
- 🛠️ `MakeLiteralName()`

**Variáveis Manipuladas:**
- `Set SurfaceName`

### 📌 Grafo: `UserConstructionScript`

**Comentários e Títulos de Seção Encontrados:**
- *"WIP"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GreaterEqual_IntInt()`
- 🛠️ `SetCollisionEnabled()`

**Variáveis Manipuladas:**
- `Get CollisionComponent`
- `Get MuzzleVelocity`
- `Get PenetrationCount`
- `Get Projectile`
- `Get ProjectileState`
- `Set InitialSpeed`
- `Set ProjectileGravityScale`

### 📌 Grafo: `ExecuteUbergraph_CubitUniProjectile_WIP`

**Comentários e Títulos de Seção Encontrados:**
- *"IMPACT - termination"*
- *"Figure out impact angle and decide to ricochet or not..."*
- *"Keep trails alive long enough before killing projectile... "*
- *"FX SPAWNER"*
- *"Bullet Bounce Event"*
- *"Components"*
- *"Random Ricochet deflection angle and speed reduction with material modifiers"*
- *"Ricochet Counter"*
- *"Global Ricochet ON/OFF Switch"*
- *"Wild Ricochet Switch/logic"*
- *"Ricochet Switch"*
- *"Tracer Scale per velocity + Tracer Flare"*
- *"Prerequisite Inputs"*
- *"Penetration"*
- *"Penetration Timer WIP"*
- *"Random Vector WIP"*
- *"Penetration Spawn Projectile etc WIP\r\n"*
- *"Remember to mouse over the input pin text for tool tips"*
- *"Get velocity of projectile, multiply if desired or clamp value "*
- *"Damage Dealer"*
- *"Liquid Tag Check"*
- *"Random Ricochet angles"*
- *"Ricochet Projectile Speed loss min/max"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__Projectile_K2Node_ComponentBoundEvent_132_OnProjectileBounceDelegate__DelegateSignature`
- 🟢 `BndEvt__Projectile_K2Node_ComponentBoundEvent_9_OnProjectileStopDelegate__DelegateSignature`
- 🟢 `RicochetSuccess`
- 🟢 `ReceiveTick`
- 🟢 `SpawnFX`
- 🟢 `PenetrationON`
- 🟢 `Kill Projectile NO FX`
- 🟢 `PenetrationSuccess`
- 🟢 `Timer`
- 🟢 `PenetrationInitialise`
- 🟢 `RicochetInitialise`
- 🟢 `DamageDealer`
- 🟢 `WaterExit`
- 🟢 `WaterCheck`
- 🟢 `ReceiveBeginPlay`
- 🔀 Contém `24` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `BreakHitResult()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `Multiply_VectorInt()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `K2_DestroyActor()`
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
- 🛠️ `RicochetSuccess()`
- 🛠️ `Activate()`
- 🛠️ `IsActive()`
- 🛠️ `GetDirectionUnitVector()`
- 🛠️ `RandomUnitVectorInConeInRadians()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `GreaterEqual_IntInt()`
- 🛠️ `Kill Projectile NO FX()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `PenetrationSuccess()`
- 🛠️ `K2_SetTimer()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `MakeRotator()`
- 🛠️ `ComposeRotators()`
- 🛠️ `GetForwardVector()`
- 🛠️ `EqualEqual_ObjectObject()`
- 🛠️ `PenetrationInitialise()`
- 🛠️ `RicochetInitialise()`
- 🛠️ `DamageDealer()`
- 🛠️ `ApplyRadialDamageWithFalloff()`
- 🛠️ `AddImpulseAtLocation()`
- 🛠️ `IsSimulatingPhysics()`
- 🛠️ `GetVelocity()`
- 🛠️ `ClampVectorSize()`
- 🛠️ `PrintString()`
- 🛠️ `WaterExit()`
- 🛠️ `WaterCheck()`
- 🛠️ `PenetrationON()`
- 🛠️ `ComponentHasTag()`
- 🛠️ `SetUpdatedComponent()`
- 🛠️ `K2_PauseTimer()`
- 🛠️ `Conv_IntToString()`
- 🛠️ `MakeLiteralName()`
- 🛠️ `GetFloatValue()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `IsValid()`
- 🛠️ `MakeVector()`
- 🛠️ `GetDataTableRowFromName()`
- 🛠️ `BeginDeferredActorSpawnFromClass()`
- 🛠️ `FinishSpawningActor()`
- 🛠️ `SetStructurePropertyByName()`
- 🛠️ `SetVectorPropertyByName()`
- 🛠️ `SetBytePropertyByName()`
- 🛠️ `SetObjectPropertyByName()`
- 🛠️ `SetDoublePropertyByName()`
- 🛠️ `SetBoolPropertyByName()`

**Variáveis Manipuladas:**
- `Get CollisionComponent`
- `Get DragCurve`
- `Get DragPerCM`
- `Get Hit Component`
- `Get Impact Type`
- `Get Impact Velocity`
- `Get ImpactLocation`
- `Get ImpactResult`
- `Get Is Shrapnel?`
- `Get MaterialValues`
- `Get MaxX`
- `Get MaxY`
- `Get MaxZ`
- `Get MinX`
- `Get MinY`
- `Get MinZ`
- `Get PenetrationCount`
- `Get PenetrationEnabled`
- `Get PointLight`
- `Get Projectile`
- `Get ProjectileSize`
- `Get ProjectileState`
- `Get RichochetSound`
- `Get RicochetCounter`
- `Get RicochetEnabled`
- `Get RicochetExitVelocity`
- `Get RicochetOccured`
- `Get RicochetOccursConeAngleBase`
- `Get RicochetParticle`
- `Get RicochetVector`
- `Get ShrapnelFlame`
- `Get SurfaceName`
- `Get SurfaceType`
- `Get TracerFlare`
- `Get TracerMesh`
- `Get UpdatedPrimitive`
- `Get Velocity`
- `Get WildRicochetAngleMultiplier`
- `Get WildRicochetEnabled`
- `Get WildRicochetOccured`
- `Get WildRicochetSpeedMultiplier`
- `Set DragPerCM`
- `Set Hit Component`
- `Set Impact Type`
- `Set Impact Velocity`
- `Set ImpactLocation`
- `Set ImpactResult`
- `Set InitialSpeed`
- `Set MaterialValues`
- `Set Overlapping`
- `Set Penetrating`
- `Set PenetrationCount`
- `Set ProjectileGravityScale`
- `Set ProjectileState`
- `Set RicochetCounter`
- `Set RicochetExitVelocity`
- `Set RicochetOccured`
- `Set RicochetVector`
- `Set SurfaceName`
- `Set SurfaceType`
- `Set Velocity`
- `Set WildRicochetAngleMultiplier`
- `Set WildRicochetOccured`
- `Set WildRicochetSpeedMultiplier`

### 📌 Grafo: `RicochetSuccess`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `BndEvt__Projectile_K2Node_ComponentBoundEvent_132_OnProjectileBounceDelegate__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `BndEvt__Projectile_K2Node_ComponentBoundEvent_9_OnProjectileStopDelegate__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `WaterCheck`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `WaterExit`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `DamageDealer`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `RicochetInitialise`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `PenetrationInitialise`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `Timer`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `PenetrationSuccess`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `SpawnFX`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `Kill Projectile NO FX`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `PenetrationON`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_CubitUniProjectile_WIP()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"WIP"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GreaterEqual_IntInt()`
- 🛠️ `SetCollisionEnabled()`

**Variáveis Manipuladas:**
- `Get CollisionComponent`
- `Get MuzzleVelocity`
- `Get PenetrationCount`
- `Get Projectile`
- `Get ProjectileState`
- `Set InitialSpeed`
- `Set ProjectileGravityScale`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `CubitUniProjectile_WIP`?
- Quais variáveis estão disponíveis no Blueprint `CubitUniProjectile_WIP`?
- Quais funções e eventos são chamados no grafo do `CubitUniProjectile_WIP`?