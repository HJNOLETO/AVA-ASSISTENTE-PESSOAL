# 🎮 Blueprint: BP_AmmoBox

**[Classe Pai / Parent Class: `BP_PickupObject_C`]**

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

**Comentários e Títulos de Seção Encontrados:**
- *"Executar apenas uma vez?"*
- *"Está ativo?"*

**Eventos de Entrada (Events):**
- 🟢 `Interact`
- 🟢 `ResetDoOnce`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_DestroyActor()`
- 🛠️ `AmmoPickup()`

**Variáveis Manipuladas:**
- `Get Ammo Type`
- `Get Amount Ammo`
- `Get Character`
- `Get DoOnce`
- `Get IsActive`
- `Get Projectile Type`
- `Get Weapon ID`
- `Get Weapon Type`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ExecuteUbergraph_BP_AmmoBox`

**Comentários e Títulos de Seção Encontrados:**
- *"Executar apenas uma vez?"*
- *"Está ativo?"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `Interact`
- 🟢 `ResetDoOnce`
- 🔀 Contém `5` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_DestroyActor()`
- 🛠️ `AmmoPickup()`

**Variáveis Manipuladas:**
- `Get Ammo Type`
- `Get Amount Ammo`
- `Get Character`
- `Get DoOnce`
- `Get IsActive`
- `Get Projectile Type`
- `Get Weapon ID`
- `Get Weapon Type`

### 📌 Grafo: `ResetDoOnce`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_AmmoBox()`

### 📌 Grafo: `Interact`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_AmmoBox()`

### 📌 Grafo: `UserConstructionScript_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_AmmoBox`?
- Quais variáveis estão disponíveis no Blueprint `BP_AmmoBox`?
- Quais funções e eventos são chamados no grafo do `BP_AmmoBox`?