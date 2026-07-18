# 🎮 Blueprint: Cubit_ImpactFX_Spawner

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `HitResult` | `struct (HitResult)` |
| `SplasherDecalMat` | `object (MaterialInterface)` |
| `MaterialValues` | `struct (FXMaterialData)` |
| `SurfaceTypeFeed` | `byte (EPhysicalSurface)` |
| `ImpactDecalMat` | `object (MaterialInterface)` |
| `RicochetVector` | `struct (Vector)` |
| `Decals Attached?` | `bool` |
| `Main FX Emitter` | `object (ParticleSystemComponent)` |
| `Location` | `struct (Vector)` |
| `Impact Normal` | `struct (Vector)` |
| `Hit Component` | `object (PrimitiveComponent)` |
| `FXSize` | `byte (Projectile_Size)` |
| `ParticleDecalSpawnerON?` | `bool` |
| `RicochetSoundComponent` | `object (AudioComponent)` |
| `RicochetParticleComponent` | `object (ParticleSystemComponent)` |
| `Impact Point` | `struct (Vector)` |
| `Impact Speed` | `real (double)` |
| `NormalisedRangeMin` | `real (double)` |
| `NormalisedRangeMax` | `real (double)` |
| `ImpactForceMultiplier` | `real (double)` |
| `RicochetExitVelocity` | `real (double)` |
| `Hit Bone` | `name` |
| `Decal Life` | `real (double)` |
| `FX Type` | `byte (FXTypes)` |
| `ParticleCollisionLocation` | `struct (Vector)` |
| `CollisionSurface` | `byte (EPhysicalSurface)` |
| `ParticleCollisionSoundsON` | `bool` |
| `ParticleCollisionVelocity` | `struct (Vector)` |
| `ParticleCollisionNormal` | `struct (Vector)` |
| `MaterialProperties` | `struct (MaterialProperties)` |
| `ParticleCollisionMaterialProperties` | `struct (MaterialProperties)` |
| `Impact Type` | `byte (ImpactType)` |
| `SurfaceName` | `name` |
| `FirePropagationON` | `bool` |
| `ParticleCollisonHitBone` | `name` |
| `UseLineTraceParticleCollisions` | `bool` |
| `ParticleCollisionLineCheckComponent` | `object (PrimitiveComponent)` |
| `CanvasTargetDecals` | `bool` |
| `BacksplatterDecalsON` | `bool` |
| `ProjectilesVector` | `struct (Transform)` |
| `HitActor` | `object (Actor)` |
| `BacksplatterChance` | `real (double)` |
| `BacksplatterDecalMat` | `object (MaterialInstanceDynamic)` |
| `Caliber22` | `struct (Vector)` |
| `Caliber50` | `struct (Vector)` |
| `Caliber762` | `struct (Vector)` |
| `Caliber556` | `struct (Vector)` |
| `CaliberShotgun` | `struct (Vector)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Impact Particle FX"*
- *"Sound Impact Spawn"*
- *"Decal Variant Chooser"*
- *"Spawn Attached Ricochet sound to projectile"*
- *"Spawn Ricochet sound at location if no projectile emitter found..."*
- *"This BP will now self destruct..."*
- *"Particle Spawned Decal Variant Chooser"*
- *"Particle Spawned FX"*
- *"Sound Spawn"*
- *"Decal Rotation"*
- *"1: Surface Type and Hit Result"*
- *"Is this a Terminating or Ricochet Event?"*
- *"Ricochet Particle FX"*
- *"TBD"*
- *"2: Get FX type"*
- *"VR Optimised FX"*
- *"Initial Set up:"*
- *"Add an alternative data table here etc... You can add more than this too..."*
- *"Particle Collision Sound Spawn (WIP)"*
- *"Original Spawned FX Check"*
- *"Particle Sounds Launcher"*
- *"Splash On Wet"*
- *"Splash On Dry"*
- *"Sizzle Wet"*
- *"Sizzle Dry"*
- *"General Sizzle Particle FX"*
- *"Spawn Particle Debris Collision FX  - Choose result from Material Properties STILL WIP!"*
- *"Original Spawned FX Properties and Data"*
- *"Spawn Decals!"*
- *"Spawn Debris FX Particles per Material"*
- *"Access Global Material Properties Matrix"*
- *"Original Spawned FX Properties and Data"*
- *"Particle Collision Material Properties"*
- *"Penetration TBD"*
- *"Fire WIP"*
- *"Complex Material WIP"*
- *"Ricochet Decals WIP Skipped for now..."*
- *"First Pass Blood Back Splatter"*
- *"Standard FX "*
- *"Switch the Data table here to choose between the VR optimised impact FX. There is a quality sacrifice for the VR FX because less particles are spawned to reduce overdraw. However, performance in VR should be much improved. I would only recommend choosing the VR set if you are finding performance issues in VR, since the standard FX do look better."*

**Eventos de Entrada (Events):**
- 🟢 `Impact_Event`
- 🟢 `Ricochet_Event`
- 🟢 `SpawnSounds`
- 🟢 `SpawnDecals`
- 🟢 `DestroyFXSpawner`
- 🟢 `OnParticleCollide_Event`
- 🟢 `SpawnParticleCollisionFX`
- 🟢 `ReceiveBeginPlay`
- 🟢 `Get FX Type`
- 🟢 `ParticleCollisionSounds`
- 🟢 `WetSplash`
- 🟢 `DrySplash`
- 🟢 `SizzleDry`
- 🟢 `SizzleWet`
- 🟢 `SpawnParticleDecals`
- 🟢 `Sizzle Liquid FX`
- 🟢 `Debris FX Spawn`
- 🟢 `Sizzle Dry FX`
- 🟢 `FX Type Chosen`
- 🟢 `DebrisFXInitialise`
- 🟢 `Penetration Event`
- 🟢 `InitiateFXTasks`
- 🟢 `FirePropagation`
- 🟢 `BackSplatter`
- 🔀 Contém `25` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `SpawnSoundAtLocation()`
- 🛠️ `GetGlobalTimeDilation()`
- 🛠️ `SpawnDecalAtLocation()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `Multiply_VectorInt()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `RandomIntegerInRange()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `SetScalarParameterValue()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeRotator()`
- 🛠️ `SpawnDecalAttached()`
- 🛠️ `MakeRotFromZ()`
- 🛠️ `SetSound()`
- 🛠️ `SetPitchMultiplier()`
- 🛠️ `Play()`
- 🛠️ `K2_DestroyActor()` — *Then destroy this projectile*
- 🛠️ `VSize()`
- 🛠️ `SetVectorParameter()`
- 🛠️ `SpawnSounds()`
- 🛠️ `SpawnDecals()`
- 🛠️ `SpawnParticleCollisionFX()`
- 🛠️ `DestroyFXSpawner()`
- 🛠️ `K2_AddRelativeRotation()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `SetRelativeScale3D()`
- 🛠️ `SetTemplate()`
- 🛠️ `Activate()`
- 🛠️ `BreakHitResult()`
- 🛠️ `IsActive()`
- 🛠️ `Delay()`
- 🛠️ `Get FX Type()`
- 🛠️ `FX Type Chosen()`
- 🛠️ `ParticleCollisionSounds()`
- 🛠️ `WetSplash()`
- 🛠️ `DrySplash()`
- 🛠️ `SizzleDry()`
- 🛠️ `SpawnParticleDecals()`
- 🛠️ `Debris FX Spawn()`
- 🛠️ `Sizzle Liquid FX()`
- 🛠️ `DebrisFXInitialise()`
- 🛠️ `SetFadeOut()`
- 🛠️ `InitiateFXTasks()`
- 🛠️ `Conv_VectorToTransform()`
- 🛠️ `Ricochet_Event()`
- 🛠️ `Impact_Event()`
- 🛠️ `Penetration Event()`
- 🛠️ `FirePropagation()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `IsValid()`
- 🛠️ `PrintString()`
- 🛠️ `BackSplatter()`
- 🛠️ `GetForwardVector()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `RandomUnitVectorInEllipticalConeInDegrees()`
- 🛠️ `Not_PreBool()`
- 🛠️ `BreakVector()`
- 🛠️ `FClamp()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get BacksplatterChance`
- `Get BacksplatterDecalMat`
- `Get BacksplatterDecalsON`
- `Get Caliber22`
- `Get Caliber50`
- `Get Caliber556`
- `Get Caliber762`
- `Get CanvasTargetDecals`
- `Get CollisionSurface`
- `Get Decal Life`
- `Get Decals Attached?`
- `Get FX Type`
- `Get FXSize`
- `Get FirePropagationON`
- `Get Hit Bone`
- `Get Hit Component`
- `Get HitActor`
- `Get HitResult`
- `Get Impact Normal`
- `Get Impact Point`
- `Get Impact Speed`
- `Get Impact Type`
- `Get ImpactDecalMat`
- `Get ImpactForceMultiplier`
- `Get Main FX Emitter`
- `Get MaterialProperties`
- `Get MaterialValues`
- `Get NormalisedRangeMax`
- `Get NormalisedRangeMin`
- `Get ParticleCollisionLineCheckComponent`
- `Get ParticleCollisionLocation`
- `Get ParticleCollisionMaterialProperties`
- `Get ParticleCollisionNormal`
- `Get ParticleCollisionSoundsON`
- `Get ParticleCollisionVelocity`
- `Get ParticleDecalSpawnerON?`
- `Get ProjectilesVector`
- `Get RicochetParticleComponent`
- `Get RicochetSoundComponent`
- `Get RicochetVector`
- `Get SplasherDecalMat`
- `Get SurfaceType`
- `Get SurfaceTypeFeed`
- `Get UseLineTraceParticleCollisions`
- `Set BacksplatterDecalMat`
- `Set CollisionSurface`
- `Set Hit Bone`
- `Set Hit Component`
- `Set HitActor`
- `Set Impact Normal`
- `Set Impact Point`
- `Set ImpactDecalMat`
- `Set Location`
- `Set Main FX Emitter`
- `Set MaterialProperties`
- `Set MaterialValues`
- `Set ParticleCollisionLineCheckComponent`
- `Set ParticleCollisionLocation`
- `Set ParticleCollisionMaterialProperties`
- `Set ParticleCollisionNormal`
- `Set ParticleCollisionVelocity`
- `Set ParticleCollisonHitBone`
- `Set SplasherDecalMat`
- `Set SurfaceTypeFeed`

### 📌 Grafo: `ScaleFX by Velocity`

**Comentários e Títulos de Seção Encontrados:**
- *"Scales down ricochet FX length for slower speeds"*

**Funções e Métodos Chamados:**
- 🛠️ `MapRangeClamped()`
- 🛠️ `MakeLiteralDouble()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get Caliber22`
- `Get Caliber50`
- `Get Caliber556`
- `Get Caliber762`
- `Get FXSize`
- `Get RicochetExitVelocity`

### 📌 Grafo: `TemporaryMaterialTranslator_2_2_5_2`

**Funções e Métodos Chamados:**
- 🛠️ `MakeLiteralName()`

**Variáveis Manipuladas:**
- `Set SurfaceName`

### 📌 Grafo: `Rotation WIP`

**Funções e Métodos Chamados:**
- 🛠️ `MakeRotator()`
- 🛠️ `DegAcos()`
- 🛠️ `SignOfFloat()`
- 🛠️ `BreakVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Normal()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GreaterGreater_VectorRotator()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `BreakRotator()`

**Variáveis Manipuladas:**
- `Get Impact Normal`
- `Get RicochetVector`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ExecuteUbergraph_Cubit_ImpactFX_Spawner`

**Comentários e Títulos de Seção Encontrados:**
- *"Impact Particle FX"*
- *"Sound Impact Spawn"*
- *"Decal Variant Chooser"*
- *"Spawn Attached Ricochet sound to projectile"*
- *"Spawn Ricochet sound at location if no projectile emitter found..."*
- *"This BP will now self destruct..."*
- *"Particle Spawned Decal Variant Chooser"*
- *"Particle Spawned FX"*
- *"Sound Spawn"*
- *"Decal Rotation"*
- *"1: Surface Type and Hit Result"*
- *"Is this a Terminating or Ricochet Event?"*
- *"Ricochet Particle FX"*
- *"TBD"*
- *"2: Get FX type"*
- *"VR Optimised FX"*
- *"Initial Set up:"*
- *"Add an alternative data table here etc... You can add more than this too..."*
- *"Particle Collision Sound Spawn (WIP)"*
- *"Original Spawned FX Check"*
- *"Particle Sounds Launcher"*
- *"Splash On Wet"*
- *"Splash On Dry"*
- *"Sizzle Wet"*
- *"Sizzle Dry"*
- *"General Sizzle Particle FX"*
- *"Spawn Particle Debris Collision FX  - Choose result from Material Properties STILL WIP!"*
- *"Original Spawned FX Properties and Data"*
- *"Spawn Decals!"*
- *"Spawn Debris FX Particles per Material"*
- *"Access Global Material Properties Matrix"*
- *"Original Spawned FX Properties and Data"*
- *"Particle Collision Material Properties"*
- *"Penetration TBD"*
- *"Fire WIP"*
- *"Complex Material WIP"*
- *"Ricochet Decals WIP Skipped for now..."*
- *"First Pass Blood Back Splatter"*
- *"Standard FX "*
- *"Switch the Data table here to choose between the VR optimised impact FX. There is a quality sacrifice for the VR FX because less particles are spawned to reduce overdraw. However, performance in VR should be much improved. I would only recommend choosing the VR set if you are finding performance issues in VR, since the standard FX do look better."*
- *"Scales down ricochet FX length for slower speeds"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `Impact_Event`
- 🟢 `Ricochet_Event`
- 🟢 `SpawnSounds`
- 🟢 `SpawnDecals`
- 🟢 `DestroyFXSpawner`
- 🟢 `OnParticleCollide_Event`
- 🟢 `SpawnParticleCollisionFX`
- 🟢 `ReceiveBeginPlay`
- 🟢 `Get FX Type`
- 🟢 `ParticleCollisionSounds`
- 🟢 `WetSplash`
- 🟢 `DrySplash`
- 🟢 `SizzleDry`
- 🟢 `SizzleWet`
- 🟢 `SpawnParticleDecals`
- 🟢 `Sizzle Liquid FX`
- 🟢 `Debris FX Spawn`
- 🟢 `Sizzle Dry FX`
- 🟢 `FX Type Chosen`
- 🟢 `DebrisFXInitialise`
- 🟢 `Penetration Event`
- 🟢 `InitiateFXTasks`
- 🟢 `FirePropagation`
- 🟢 `BackSplatter`
- 🔀 Contém `52` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `SpawnSoundAtLocation()`
- 🛠️ `GetGlobalTimeDilation()`
- 🛠️ `SpawnDecalAtLocation()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `Multiply_VectorInt()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `RandomIntegerInRange()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `SetScalarParameterValue()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeRotator()`
- 🛠️ `SpawnDecalAttached()`
- 🛠️ `MakeRotFromZ()`
- 🛠️ `SetSound()`
- 🛠️ `SetPitchMultiplier()`
- 🛠️ `Play()`
- 🛠️ `K2_DestroyActor()` — *Then destroy this projectile*
- 🛠️ `VSize()`
- 🛠️ `SetVectorParameter()`
- 🛠️ `SpawnSounds()`
- 🛠️ `SpawnDecals()`
- 🛠️ `SpawnParticleCollisionFX()`
- 🛠️ `DestroyFXSpawner()`
- 🛠️ `K2_AddRelativeRotation()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `SetRelativeScale3D()`
- 🛠️ `SetTemplate()`
- 🛠️ `Activate()`
- 🛠️ `BreakHitResult()`
- 🛠️ `IsActive()`
- 🛠️ `Delay()`
- 🛠️ `Get FX Type()`
- 🛠️ `FX Type Chosen()`
- 🛠️ `ParticleCollisionSounds()`
- 🛠️ `WetSplash()`
- 🛠️ `DrySplash()`
- 🛠️ `SizzleDry()`
- 🛠️ `SpawnParticleDecals()`
- 🛠️ `Debris FX Spawn()`
- 🛠️ `Sizzle Liquid FX()`
- 🛠️ `DebrisFXInitialise()`
- 🛠️ `SetFadeOut()`
- 🛠️ `InitiateFXTasks()`
- 🛠️ `Conv_VectorToTransform()`
- 🛠️ `Ricochet_Event()`
- 🛠️ `Impact_Event()`
- 🛠️ `Penetration Event()`
- 🛠️ `FirePropagation()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `IsValid()`
- 🛠️ `PrintString()`
- 🛠️ `BackSplatter()`
- 🛠️ `GetForwardVector()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `RandomUnitVectorInEllipticalConeInDegrees()`
- 🛠️ `Not_PreBool()`
- 🛠️ `BreakVector()`
- 🛠️ `FClamp()`
- 🛠️ `DegAcos()`
- 🛠️ `SignOfFloat()`
- 🛠️ `Normal()`
- 🛠️ `Dot_VectorVector()`
- 🛠️ `GreaterGreater_VectorRotator()`
- 🛠️ `MakeLiteralName()`
- 🛠️ `MakeLiteralDouble()`
- 🛠️ `GetEnumeratorName()`
- 🛠️ `GetDataTableRowFromName()`
- 🛠️ `BreakTransform()`
- 🛠️ `MakeLiteralByte()`

**Variáveis Manipuladas:**
- `Get BacksplatterChance`
- `Get BacksplatterDecalMat`
- `Get BacksplatterDecalsON`
- `Get Caliber22`
- `Get Caliber50`
- `Get Caliber556`
- `Get Caliber762`
- `Get CanvasTargetDecals`
- `Get CollisionSurface`
- `Get Decal Life`
- `Get Decals Attached?`
- `Get FX Type`
- `Get FXSize`
- `Get FirePropagationON`
- `Get Hit Bone`
- `Get Hit Component`
- `Get HitActor`
- `Get HitResult`
- `Get Impact Normal`
- `Get Impact Point`
- `Get Impact Speed`
- `Get Impact Type`
- `Get ImpactDecalMat`
- `Get ImpactForceMultiplier`
- `Get Main FX Emitter`
- `Get MaterialProperties`
- `Get MaterialValues`
- `Get NormalisedRangeMax`
- `Get NormalisedRangeMin`
- `Get ParticleCollisionLineCheckComponent`
- `Get ParticleCollisionLocation`
- `Get ParticleCollisionMaterialProperties`
- `Get ParticleCollisionNormal`
- `Get ParticleCollisionSoundsON`
- `Get ParticleCollisionVelocity`
- `Get ParticleDecalSpawnerON?`
- `Get ProjectilesVector`
- `Get RicochetExitVelocity`
- `Get RicochetParticleComponent`
- `Get RicochetSoundComponent`
- `Get RicochetVector`
- `Get SplasherDecalMat`
- `Get SurfaceType`
- `Get SurfaceTypeFeed`
- `Get UseLineTraceParticleCollisions`
- `Set BacksplatterDecalMat`
- `Set CollisionSurface`
- `Set Hit Bone`
- `Set Hit Component`
- `Set HitActor`
- `Set Impact Normal`
- `Set Impact Point`
- `Set ImpactDecalMat`
- `Set Location`
- `Set Main FX Emitter`
- `Set MaterialProperties`
- `Set MaterialValues`
- `Set ParticleCollisionLineCheckComponent`
- `Set ParticleCollisionLocation`
- `Set ParticleCollisionMaterialProperties`
- `Set ParticleCollisionNormal`
- `Set ParticleCollisionVelocity`
- `Set ParticleCollisonHitBone`
- `Set SplasherDecalMat`
- `Set SurfaceName`
- `Set SurfaceTypeFeed`

### 📌 Grafo: `Impact_Event`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `Ricochet_Event`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `SpawnSounds`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `SpawnDecals`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `DestroyFXSpawner`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `OnParticleCollide_Event`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `BackSplatter`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `FirePropagation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `InitiateFXTasks`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `Penetration Event`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `DebrisFXInitialise`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `FX Type Chosen`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `Sizzle Dry FX`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `Debris FX Spawn`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `SpawnParticleCollisionFX`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `Sizzle Liquid FX`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `SpawnParticleDecals`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `SizzleWet`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `SizzleDry`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `DrySplash`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `WetSplash`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `ParticleCollisionSounds`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `Get FX Type`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Cubit_ImpactFX_Spawner()`

### 📌 Grafo: `UserConstructionScript_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `Cubit_ImpactFX_Spawner`?
- Quais variáveis estão disponíveis no Blueprint `Cubit_ImpactFX_Spawner`?
- Quais funções e eventos são chamados no grafo do `Cubit_ImpactFX_Spawner`?