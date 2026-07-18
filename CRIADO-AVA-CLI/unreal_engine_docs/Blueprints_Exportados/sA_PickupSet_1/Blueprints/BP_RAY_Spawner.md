# 🎮 Blueprint: BP_RAY_Spawner

**[Classe Pai / Parent Class: `Character`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `GunOffset` | `struct (Vector)` |
| `BaseTurnRate` | `real (double)` |
| `BaseLookUpRate` | `real (double)` |
| `UsingMotionControllers?` | `bool` |
| `EnergyFX` | `object (NiagaraSystem)` |
| `MuzzleOffset` | `struct (Vector)` |
| `Actor` | `class (Actor)` |
| `MuzzleDelay` | `real (double)` |
| `ProjectileDelay` | `real (double)` |
| `Muzzleready` | `bool` |
| `ProjectileReady` | `bool` |
| `time` | `real (double)` |
| `Muzzletimer` | `real (double)` |
| `Projectiletimer` | `real (double)` |
| `timeactivemuzzle` | `bool` |
| `timeactiveprojectile` | `bool` |
| `RayFx` | `object (NiagaraSystem)` |
| `HitFx` | `object (NiagaraSystem)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Timer"*
- *"Spawn"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Muzzlefybc()`
- 🛠️ `Delay()`

**Variáveis Manipuladas:**
- `Get MuzzleDelay`
- `Get Muzzleready`
- `Get Muzzletimer`
- `Get ProjectileDelay`
- `Get timeactivemuzzle`
- `Set Muzzleready`
- `Set Muzzletimer`
- `Set timeactivemuzzle`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `Muzzlefybc`

**Funções e Métodos Chamados:**
- 🛠️ `SetAsset()`
- 🛠️ `SetActive()`

**Variáveis Manipuladas:**
- `Get Energy`
- `Get EnergyFX`

### 📌 Grafo: `ExecuteUbergraph_BP_RAY_Spawner`

**Comentários e Títulos de Seção Encontrados:**
- *"Timer"*
- *"Spawn"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `Muzzlefybc()`
- 🛠️ `Delay()`

**Variáveis Manipuladas:**
- `Get MuzzleDelay`
- `Get Muzzleready`
- `Get Muzzletimer`
- `Get ProjectileDelay`
- `Get timeactivemuzzle`
- `Set Muzzleready`
- `Set Muzzletimer`
- `Set timeactivemuzzle`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_RAY_Spawner()`

### 📌 Grafo: `UserConstructionScript_MERGED`

### 📌 Grafo: `Muzzlefybc_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `SetAsset()`
- 🛠️ `SetActive()`

**Variáveis Manipuladas:**
- `Get Energy`
- `Get EnergyFX`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_RAY_Spawner`?
- Quais variáveis estão disponíveis no Blueprint `BP_RAY_Spawner`?
- Quais funções e eventos são chamados no grafo do `BP_RAY_Spawner`?