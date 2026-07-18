# 🎮 Blueprint: BP_ProjectileBase

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Speed` | `real (double)` |
| `Ricochet` | `bool` |
| `Damage` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Spawnar partícula no impacto"*
- *"Spawnar buraco de bala"*
- *"Spawnar som de impacto"*
- *"Ricochet"*
- *"Superficies"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveHit`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `ApplyDamage()`
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `SpawnDecalAttached()`
- 🛠️ `MakeRotator()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `BreakRotator()`
- 🛠️ `Multiply_VectorInt()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `SpawnSoundAtLocation()`
- 🛠️ `GetSurfaceType()`
- 🛠️ `SetVisibility()`
- 🛠️ `IsSimulatingPhysics()`
- 🛠️ `AddImpulseAtLocation()`
- 🛠️ `GetVelocity()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `SetLifeSpan()`

**Variáveis Manipuladas:**
- `Get Damage`
- `Get ProjectileMesh`
- `Get Ricochet`
- `Get bCanBeDamaged`

### 📌 Grafo: `UserConstructionScript`

**Variáveis Manipuladas:**
- `Get ProjectileMovement`
- `Get Ricochet`
- `Get Speed`
- `Set InitialSpeed`
- `Set MaxSpeed`
- `Set bShouldBounce`

### 📌 Grafo: `ExecuteUbergraph_BP_ProjectileBase`

**Comentários e Títulos de Seção Encontrados:**
- *"Spawnar partícula no impacto"*
- *"Spawnar buraco de bala"*
- *"Spawnar som de impacto"*
- *"Ricochet"*
- *"Superficies"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveHit`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `ApplyDamage()`
- 🛠️ `SpawnEmitterAtLocation()`
- 🛠️ `SpawnDecalAttached()`
- 🛠️ `MakeRotator()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `BreakRotator()`
- 🛠️ `Multiply_VectorInt()`
- 🛠️ `Conv_VectorToRotator()`
- 🛠️ `SpawnSoundAtLocation()`
- 🛠️ `GetSurfaceType()`
- 🛠️ `SetVisibility()`
- 🛠️ `IsSimulatingPhysics()`
- 🛠️ `AddImpulseAtLocation()`
- 🛠️ `GetVelocity()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `SetLifeSpan()`

**Variáveis Manipuladas:**
- `Get Damage`
- `Get ProjectileMesh`
- `Get Ricochet`
- `Get bCanBeDamaged`

### 📌 Grafo: `ReceiveHit`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_ProjectileBase()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Variáveis Manipuladas:**
- `Get MaxSpeed`
- `Get ProjectileMovement`
- `Get Ricochet`
- `Get Speed`
- `Set InitialSpeed`
- `Set MaxSpeed`
- `Set bShouldBounce`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_ProjectileBase`?
- Quais variáveis estão disponíveis no Blueprint `BP_ProjectileBase`?
- Quais funções e eventos são chamados no grafo do `BP_ProjectileBase`?