# 🎮 Blueprint: ALS_NPC

**[Classe Pai / Parent Class: `ALS_Base_CharacterBP_C`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `DefaultColor` | `struct (LinearColor)` |
| `SkinColor` | `struct (LinearColor)` |
| `ShirtColor` | `struct (LinearColor)` |
| `PantsColor` | `struct (LinearColor)` |
| `ShoesColor` | `struct (LinearColor)` |
| `GlovesColor` | `struct (LinearColor)` |
| `ShirtType` | `int` |
| `PantsType` | `int` |
| `Shoes` | `bool` |
| `Gloves` | `bool` |
| `SolidColor` | `bool` |
| `BaseLayerColor` | `struct (LinearColor)` |
| `OverlayLayerColor` | `struct (LinearColor)` |
| `AdditiveAmount_Color` | `struct (LinearColor)` |
| `Hand_Color` | `struct (LinearColor)` |
| `HandIK_Color` | `struct (LinearColor)` |
| `Head` | `object (MaterialInstanceDynamic)` |
| `Torso` | `object (MaterialInstanceDynamic)` |
| `Pelvis` | `object (MaterialInstanceDynamic)` |
| `Feet` | `object (MaterialInstanceDynamic)` |
| `Shoulder_L` | `object (MaterialInstanceDynamic)` |
| `UpperArm_L` | `object (MaterialInstanceDynamic)` |
| `LowerArm_L` | `object (MaterialInstanceDynamic)` |
| `Hand_L` | `object (MaterialInstanceDynamic)` |
| `Shoulder_R` | `object (MaterialInstanceDynamic)` |
| `UpperArm_R` | `object (MaterialInstanceDynamic)` |
| `LowerArm_R` | `object (MaterialInstanceDynamic)` |
| `Hand_R` | `object (MaterialInstanceDynamic)` |
| `UpperLegs` | `object (MaterialInstanceDynamic)` |
| `LowerLegs` | `object (MaterialInstanceDynamic)` |
| `Mantle_2m_Default` | `struct (Mantle_Asset)` |
| `Mantle_1m_Default` | `struct (Mantle_Asset)` |
| `Mantle_1m_RH` | `struct (Mantle_Asset)` |
| `Mantle_1m_LH` | `struct (Mantle_Asset)` |
| `Mantle_1m_2H` | `struct (Mantle_Asset)` |
| `Mantle_1m_Box` | `struct (Mantle_Asset)` |
| `LandRoll_Default` | `object (AnimMontage)` |
| `GetUpFront_Default` | `object (AnimMontage)` |
| `LandRoll_RH` | `object (AnimMontage)` |
| `LandRoll_LH` | `object (AnimMontage)` |
| `LandRoll_2H` | `object (AnimMontage)` |
| `GetUpFront_RH` | `object (AnimMontage)` |
| `GetUpFront_LH` | `object (AnimMontage)` |
| `GetUpFront_2H` | `object (AnimMontage)` |
| `GetUpBack_Default` | `object (AnimMontage)` |
| `GetUpBack_RH` | `object (AnimMontage)` |
| `GetUpBack_LH` | `object (AnimMontage)` |
| `GetUpBack_2H` | `object (AnimMontage)` |
| `IsNPCSpecial` | `bool` |
| `Weapon ID` | `name` |
| `Current Fire Mode` | `byte (E_FireMode)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `AttachToHand`

**Funções e Métodos Chamados:**
- 🛠️ `ClearHeldObject()`
- 🛠️ `K2_SetRelativeLocation()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `SetSkinnedAssetAndUpdate()`
- 🛠️ `SetAnimClass()`
- 🛠️ `SetStaticMesh()`

**Variáveis Manipuladas:**
- `Get HeldObjectRoot`
- `Get LeftHand`
- `Get Mesh`
- `Get NewAnimClass`
- `Get NewSkeletalMesh`
- `Get NewStaticMesh`
- `Get Offset`
- `Get SkeletalMesh`
- `Get StaticMesh`

### 📌 Grafo: `BPI_Get_3P_PivotTarget`

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `GetVectorArrayAverage()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `K2_GetActorRotation()`

**Variáveis Manipuladas:**
- `Get Mesh`

### 📌 Grafo: `BPI_Get_3P_TraceParams`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketLocation()`

**Variáveis Manipuladas:**
- `Get Mesh`
- `Get RightShoulder`

### 📌 Grafo: `BPI_Get_FP_CameraTarget`

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketLocation()`

**Variáveis Manipuladas:**
- `Get Mesh`

### 📌 Grafo: `ClearHeldObject`

**Funções e Métodos Chamados:**
- 🛠️ `SetStaticMesh()`
- 🛠️ `SetSkinnedAssetAndUpdate()`
- 🛠️ `SetAnimClass()`

**Variáveis Manipuladas:**
- `Get SkeletalMesh`
- `Get StaticMesh`

### 📌 Grafo: `DamageSpeed`

**Funções e Métodos Chamados:**
- 🛠️ `LessEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Health`
- `Get PlayerStatus`
- `Set DesiredGait`

### 📌 Grafo: `Criar pose depois do ragdoll`

**Comentários e Títulos de Seção Encontrados:**
- *"Aqui ele vai pegar todos os ossos da malha original e replicar pra essa nova malha pose"*
- *"Aqui caso quiser usar uma outra física quando quiser que o personagem passe por cima do corpo sem problemas"*
- *"Aplicar materiais da malha original para a malha pose"*
- *"Cria um componente que gera uma outra malha que ficará na mesma pose que a malha original"*
- *"Desabilitar colisão da malha original"*
- *"Esconder malha original"*
- *"Desabilitar o tick do personagem para fazer ele \"*

**Funções e Métodos Chamados:**
- 🛠️ `GetMaterials()`
- 🛠️ `SetMaterial()`
- 🛠️ `GetAllSocketNames()`
- 🛠️ `SetBoneTransformByName()`
- 🛠️ `GetSocketTransform()`
- 🛠️ `SetPhysicsAsset()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `SetVisibility()`
- 🛠️ `SetActorTickEnabled()`
- 🛠️ `GetRelativeTransform()`
- 🛠️ `SetSkinnedAssetAndUpdate()`

**Variáveis Manipuladas:**
- `Get Mesh`
- `Get SkinnedAsset`

### 📌 Grafo: `Event Death`

**Comentários e Títulos de Seção Encontrados:**
- *"Desabilitar visibilidade do ícone"*
- *"Attach e colisão"*
- *"Criar pose depois do ragdoll"*
- *"Verificação está caindo"*
- *"Após 15 segundos, o actor será deletado"*
- *"Física e colisão"*
- *"Dead e movimento desabilitado"*
- *"Parar animações e executar animação de morrer"*
- *"Desabilitar colisão da capsula"*

**Eventos de Entrada (Events):**
- 🟢 `Death`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Delay()`
- 🛠️ `SetLifeSpan()`
- 🛠️ `SetCollisionResponseToChannel()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `StopAnimMontage()`
- 🛠️ `RagdollStart()`
- 🛠️ `DropWeapon()`
- 🛠️ `SpawnBloodPool()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `SetIconVisible()`
- 🛠️ `K2_DestroyComponent()`
- 🛠️ `Deactivate()`
- 🛠️ `IsFalling()`
- 🛠️ `IsDead()`

**Variáveis Manipuladas:**
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get IconeNPC`
- `Get Mesh`
- `Get WeaponSystem`
- `Set Dead`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Event BeginPlay"*
- *"Evento para morrer"*
- *"Event Tick"*
- *"Sprinting NPC"*
- *"Evento Dano Global"*

**Eventos de Entrada (Events):**
- 🟢 `SprintAction`
- 🟢 `ReceiveBeginPlay`
- 🟢 `ReceiveTick`
- 🟢 `ReceiveAnyDamage`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetDamage()`
- 🛠️ `Not_PreBool()`
- 🛠️ `K2_SetText()`
- 🛠️ `Conv_DoubleToText()`
- 🛠️ `Sprint()`

**Variáveis Manipuladas:**
- `Get Armour`
- `Get Health`
- `Get IsNPCSpecial`
- `Get MinHealth`
- `Get PlayerStatus`
- `Get Stamina`
- `Get TextRender`
- `Get TextRender1`

### 📌 Grafo: `GetGetUpAnimation`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get GetUpBack_2H`
- `Get GetUpBack_Default`
- `Get GetUpBack_LH`
- `Get GetUpBack_RH`
- `Get GetUpFront_2H`
- `Get GetUpFront_Default`
- `Get GetUpFront_LH`
- `Get GetUpFront_RH`
- `Get OverlayState`

### 📌 Grafo: `GetMantleAsset`

**Variáveis Manipuladas:**
- `Get Mantle_1m_2H`
- `Get Mantle_1m_Box`
- `Get Mantle_1m_Default`
- `Get Mantle_1m_LH`
- `Get Mantle_1m_RH`
- `Get Mantle_2m_Default`
- `Get OverlayState`

### 📌 Grafo: `GetRollAnimation`

**Variáveis Manipuladas:**
- `Get LandRoll_2H`
- `Get LandRoll_Default`
- `Get LandRoll_LH`
- `Get LandRoll_RH`
- `Get OverlayState`

### 📌 Grafo: `MantleEnd`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateHeldObject()`

### 📌 Grafo: `MantleStart`

**Funções e Métodos Chamados:**
- 🛠️ `ClearHeldObject()`

**Variáveis Manipuladas:**
- `Get MantleType`

### 📌 Grafo: `OnOverlayStateChanged`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateHeldObject()`

### 📌 Grafo: `RagdollEnd`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateHeldObject()`

### 📌 Grafo: `RagdollStart`

**Funções e Métodos Chamados:**
- 🛠️ `ClearHeldObject()`

### 📌 Grafo: `UpdateHeldObject`

**Funções e Métodos Chamados:**
- 🛠️ `AttachToHand()`
- 🛠️ `ClearHeldObject()`

**Variáveis Manipuladas:**
- `Get OverlayState`

### 📌 Grafo: `UpdateHeldObjectAnimations`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `GetAnimCurveValue()`

**Variáveis Manipuladas:**
- `Get OverlayState`
- `Get SkeletalMesh`
- `Set Draw`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `SetLeaderPoseComponent()`

**Variáveis Manipuladas:**
- `Get BodyMesh`
- `Get Current Fire Mode`
- `Get InitialWeapon`
- `Get Mesh`
- `Get Weapon ID`
- `Get WeaponSystem`

### 📌 Grafo: `ExecuteUbergraph_ALS_NPC`

**Comentários e Títulos de Seção Encontrados:**
- *"Event Tick"*
- *"Evento para morrer"*
- *"Evento Dano Global"*
- *"Event BeginPlay"*
- *"Sprinting NPC"*
- *"Attach e colisão"*
- *"Física e colisão"*
- *"Dead e movimento desabilitado"*
- *"Parar animações e executar animação de morrer"*
- *"Desabilitar colisão da capsula"*
- *"Desabilitar visibilidade do ícone"*
- *"Após 15 segundos, o actor será deletado"*
- *"Criar pose depois do ragdoll"*
- *"Verificação está caindo"*
- *"Cria um componente que gera uma outra malha que ficará na mesma pose que a malha original"*
- *"Desabilitar colisão da malha original"*
- *"Esconder malha original"*
- *"Desabilitar o tick do personagem para fazer ele \"*
- *"Aqui ele vai pegar todos os ossos da malha original e replicar pra essa nova malha pose"*
- *"Aqui caso quiser usar uma outra física quando quiser que o personagem passe por cima do corpo sem problemas"*
- *"Aplicar materiais da malha original para a malha pose"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveAnyDamage`
- 🟢 `ReceiveBeginPlay`
- 🟢 `ReceiveTick`
- 🟢 `SprintAction`
- 🟢 `Death`
- 🔀 Contém `8` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetDamage()`
- 🛠️ `Not_PreBool()`
- 🛠️ `K2_SetText()`
- 🛠️ `Conv_DoubleToText()`
- 🛠️ `Sprint()`
- 🛠️ `SetCollisionResponseToChannel()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `IsDead()`
- 🛠️ `StopAnimMontage()`
- 🛠️ `Deactivate()`
- 🛠️ `RagdollStart()`
- 🛠️ `Delay()`
- 🛠️ `DropWeapon()`
- 🛠️ `SpawnBloodPool()`
- 🛠️ `SetIconVisible()`
- 🛠️ `K2_DestroyComponent()`
- 🛠️ `SetLifeSpan()`
- 🛠️ `IsFalling()`
- 🛠️ `GetRelativeTransform()`
- 🛠️ `SetSkinnedAssetAndUpdate()`
- 🛠️ `GetMaterials()`
- 🛠️ `SetMaterial()`
- 🛠️ `GetAllSocketNames()`
- 🛠️ `SetBoneTransformByName()`
- 🛠️ `GetSocketTransform()`
- 🛠️ `SetPhysicsAsset()`
- 🛠️ `SetVisibility()`
- 🛠️ `SetActorTickEnabled()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `GetSkinnedAsset()`
- 🛠️ `MakeLiteralByte()`
- 🛠️ `EqualEqual_DoubleDouble()`
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Armour`
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get Health`
- `Get IconeNPC`
- `Get IsNPCSpecial`
- `Get Mesh`
- `Get MinHealth`
- `Get PlayerStatus`
- `Get SkinnedAsset`
- `Get Stamina`
- `Get TextRender`
- `Get TextRender1`
- `Get WeaponSystem`
- `Set Dead`
- `Set DesiredGait`

### 📌 Grafo: `Death`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_NPC()`

### 📌 Grafo: `SprintAction`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_NPC()`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_NPC()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_NPC()`

### 📌 Grafo: `ReceiveAnyDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_ALS_NPC()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `SetLeaderPoseComponent()`

**Variáveis Manipuladas:**
- `Get BodyMesh`
- `Get Current Fire Mode`
- `Get InitialWeapon`
- `Get Mesh`
- `Get Weapon ID`
- `Get WeaponSystem`

### 📌 Grafo: `UpdateHeldObject_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `AttachToHand()`
- 🛠️ `ClearHeldObject()`

**Variáveis Manipuladas:**
- `Get OverlayState`

### 📌 Grafo: `ClearHeldObject_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `SetAnimClass()`
- 🛠️ `SetSkinnedAssetAndUpdate()`
- 🛠️ `SetStaticMesh()`

**Variáveis Manipuladas:**
- `Get SkeletalMesh`
- `Get StaticMesh`

### 📌 Grafo: `AttachToHand_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `K2_SetRelativeLocation()`
- 🛠️ `ClearHeldObject()`
- 🛠️ `SetSkinnedAssetAndUpdate()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `SetAnimClass()`

**Variáveis Manipuladas:**
- `Get HeldObjectRoot`
- `Get LeftHand`
- `Get Mesh`
- `Get NewAnimClass`
- `Get NewSkeletalMesh`
- `Get NewStaticMesh`
- `Get Offset`
- `Get SkeletalMesh`
- `Get StaticMesh`

### 📌 Grafo: `BPI_Get_3P_PivotTarget_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `GetVectorArrayAverage()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `K2_GetActorRotation()`

**Variáveis Manipuladas:**
- `Get Mesh`

### 📌 Grafo: `BPI_Get_FP_CameraTarget_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketLocation()`

**Variáveis Manipuladas:**
- `Get Mesh`

### 📌 Grafo: `GetMantleAsset_MERGED`

**Variáveis Manipuladas:**
- `Get Mantle_1m_2H`
- `Get Mantle_1m_Box`
- `Get Mantle_1m_Default`
- `Get Mantle_1m_LH`
- `Get Mantle_1m_RH`
- `Get Mantle_2m_Default`
- `Get OverlayState`

### 📌 Grafo: `BPI_Get_3P_TraceParams_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketLocation()`

**Variáveis Manipuladas:**
- `Get Mesh`
- `Get RightShoulder`

### 📌 Grafo: `OnOverlayStateChanged_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateHeldObject()`

### 📌 Grafo: `GetRollAnimation_MERGED`

**Variáveis Manipuladas:**
- `Get LandRoll_2H`
- `Get LandRoll_Default`
- `Get LandRoll_LH`
- `Get LandRoll_RH`
- `Get OverlayState`

### 📌 Grafo: `MantleEnd_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateHeldObject()`

### 📌 Grafo: `GetGetUpAnimation_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get GetUpBack_2H`
- `Get GetUpBack_Default`
- `Get GetUpBack_LH`
- `Get GetUpBack_RH`
- `Get GetUpFront_2H`
- `Get GetUpFront_Default`
- `Get GetUpFront_LH`
- `Get GetUpFront_RH`
- `Get OverlayState`

### 📌 Grafo: `RagdollStart_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `ClearHeldObject()`

### 📌 Grafo: `RagdollEnd_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `UpdateHeldObject()`

### 📌 Grafo: `UpdateHeldObjectAnimations_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `GetAnimCurveValue()`

**Variáveis Manipuladas:**
- `Get OverlayState`
- `Get SkeletalMesh`
- `Set Draw`

### 📌 Grafo: `MantleStart_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `ClearHeldObject()`

**Variáveis Manipuladas:**
- `Get MantleType`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `ALS_NPC`?
- Quais variáveis estão disponíveis no Blueprint `ALS_NPC`?
- Quais funções e eventos são chamados no grafo do `ALS_NPC`?