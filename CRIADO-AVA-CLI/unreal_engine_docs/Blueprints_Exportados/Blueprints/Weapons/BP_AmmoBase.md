# 🎮 Blueprint: BP_AmmoBase

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Ammo Type` | `byte (AmmoType)` |
| `Weapon ID` | `name` |
| `Amount Ammo` | `int` |
| `Weapon Type` | `byte (ALS_OverlayState)` |
| `Projectile Type` | `class (BP_ProjectileBase_C)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `ReceiveActorBeginOverlap` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `ReceiveTick` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `BndEvt__BP_AmmoBase_AmmoCollision_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AmmoPickup()`
- 🛠️ `IsValid()`
- 🛠️ `K2_DestroyActor()`

**Variáveis Manipuladas:**
- `Get Ammo Type`
- `Get Amount Ammo`
- `Get CurrentWeapon`
- `Get Projectile Type`
- `Get Weapon ID`
- `Get Weapon Type`
- `Get WeaponSystem`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ExecuteUbergraph_BP_AmmoBase`

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__BP_AmmoBase_AmmoCollision_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AmmoPickup()`
- 🛠️ `IsValid()`
- 🛠️ `K2_DestroyActor()`

**Variáveis Manipuladas:**
- `Get Ammo Type`
- `Get Amount Ammo`
- `Get CurrentWeapon`
- `Get Projectile Type`
- `Get Weapon ID`
- `Get Weapon Type`
- `Get WeaponSystem`

### 📌 Grafo: `BndEvt__BP_AmmoBase_AmmoCollision_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_AmmoBase()`

### 📌 Grafo: `UserConstructionScript_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_AmmoBase`?
- Quais variáveis estão disponíveis no Blueprint `BP_AmmoBase`?
- Quais funções e eventos são chamados no grafo do `BP_AmmoBase`?