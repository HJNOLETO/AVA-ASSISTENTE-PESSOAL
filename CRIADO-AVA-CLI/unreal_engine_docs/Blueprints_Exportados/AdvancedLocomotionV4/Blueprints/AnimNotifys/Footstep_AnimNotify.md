# 🎮 Blueprint: Footstep_AnimNotify

**[Classe Pai / Parent Class: `AnimNotify`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Sound` | `object (SoundBase)` |
| `Attach Point Name` | `name` |
| `Pitch Multiplier` | `real (double)` |
| `FootstepModes` | `byte (E_FootstepModes)` |
| `BoneNames` | `name` |
| `IsLeft` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `Footstep`

**Funções e Métodos Chamados:**
- 🛠️ `SpawnSoundAttached()`
- 🛠️ `TryGetPawnOwner()`
- 🛠️ `GetMovementComponent()`
- 🛠️ `IsCrouching()`
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `SpawnSystemAtLocation()`
- 🛠️ `SpawnDecalAtLocation()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get AnimInstance`
- `Get Decal`
- `Get DecalLifeSpan`
- `Get DecalSize`
- `Get FSound`
- `Get Location`
- `Get Mesh`
- `Get Niagara`
- `Get Particle`
- `Get RelativeLocation`
- `Get RelativeRotation`

### 📌 Grafo: `LineTrace`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketLocation()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `GetOwner()`
- 🛠️ `BreakHitResult()`
- 🛠️ `IsValid()`
- 🛠️ `GetSocketRotation()`
- 🛠️ `Footstep()`
- 🛠️ `GetPhysicalMaterial()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get AnimInstance`
- `Get EndTrace`
- `Get ImpactTransform`
- `Get MeshComp`
- `Get SocketName`
- `Get StartTrace`
- `Set ImpactTransform`

### 📌 Grafo: `Sistema de passos - ANTIGO`

**Comentários e Títulos de Seção Encontrados:**
- *"Spawnar pegadas"*
- *"Spawnar Particulas"*
- *"Verificar se o personagem agachar"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SpawnSoundAttached()`
- 🛠️ `SpawnDecalAtLocation()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetSurfaceType()`
- 🛠️ `SetIntParameter()`
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `SpawnSystemAtLocation()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `GetOwner()`
- 🛠️ `GetSocketRotation()`
- 🛠️ `BreakHitResult()`
- 🛠️ `LineTraceSingle()`

**Variáveis Manipuladas:**
- `Get Attach Point Name`
- `Get BoneNames`
- `Get FootstepModes`
- `Get IsLeft`
- `Get MeshComp`
- `Get Pitch Multiplier`
- `Get Sound`
- `Get bIsCrouched`

### 📌 Grafo: `Received_Notify`

**Comentários e Títulos de Seção Encontrados:**
- *"Sistema de passos - ANTIGO"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `LineTrace()`

**Variáveis Manipuladas:**
- `Get IsLeft`
- `Get MeshComp`

### 📌 Grafo: `Received_Notify_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Sistema de passos - ANTIGO"*
- *"Verificar se o personagem agachar"*
- *"Spawnar Particulas"*
- *"Spawnar pegadas"*
- 🔀 Contém `7` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetAnimInstance()`
- 🛠️ `LineTrace()`
- 🛠️ `GetOwner()`
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `SpawnSoundAttached()`
- 🛠️ `SetIntParameter()`
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `GetSocketLocation()`
- 🛠️ `GetSurfaceType()`
- 🛠️ `SpawnSystemAtLocation()`
- 🛠️ `BreakHitResult()`
- 🛠️ `GetSocketRotation()`
- 🛠️ `SpawnDecalAtLocation()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Attach Point Name`
- `Get BoneNames`
- `Get FootstepModes`
- `Get IsLeft`
- `Get MeshComp`
- `Get Pitch Multiplier`
- `Get Sound`
- `Get bIsCrouched`

### 📌 Grafo: `LineTrace_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetSocketLocation()`
- 🛠️ `LineTraceSingle()`
- 🛠️ `GetOwner()`
- 🛠️ `BreakHitResult()`
- 🛠️ `IsValid()`
- 🛠️ `GetSocketRotation()`
- 🛠️ `Footstep()`
- 🛠️ `GetPhysicalMaterial()`
- 🛠️ `Add_VectorVector()`
- 🛠️ `MakeTransform()`
- 🛠️ `GetDataTableRowFromName()`

**Variáveis Manipuladas:**
- `Get AnimInstance`
- `Get EndTrace`
- `Get ImpactTransform`
- `Get MeshComp`
- `Get SocketName`
- `Get StartTrace`
- `Set ImpactTransform`

### 📌 Grafo: `Footstep_MERGED`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SpawnSoundAttached()`
- 🛠️ `TryGetPawnOwner()`
- 🛠️ `GetMovementComponent()`
- 🛠️ `IsCrouching()`
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `SpawnSystemAtLocation()`
- 🛠️ `SpawnDecalAtLocation()`
- 🛠️ `IsValid()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get AnimInstance`
- `Get Decal`
- `Get DecalLifeSpan`
- `Get DecalSize`
- `Get FSound`
- `Get Location`
- `Get Mesh`
- `Get Niagara`
- `Get Particle`
- `Get RelativeLocation`
- `Get RelativeRotation`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `Footstep_AnimNotify`?
- Quais variáveis estão disponíveis no Blueprint `Footstep_AnimNotify`?
- Quais funções e eventos são chamados no grafo do `Footstep_AnimNotify`?