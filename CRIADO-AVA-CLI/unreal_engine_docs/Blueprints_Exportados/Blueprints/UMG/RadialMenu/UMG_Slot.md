# 🎮 Blueprint: UMG_Slot

**[Classe Pai / Parent Class: `UserWidget`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Character` | `object (ALS_Base_CharacterBP_C)` |
| `WeaponSlot` | `byte (WeaponSlots)` |
| `WarningColor` | `struct (LinearColor)` |
| `NormalColor` | `struct (LinearColor)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Cast para seu personagem"*

**Eventos de Entrada (Events):**
- 🟢 `Construct`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Set Character`

### 📌 Grafo: `GetAmmoMagazine`

**Comentários e Títulos de Seção Encontrados:**
- *"Se a munição do pente for menor que 5 ela ficará na cor vermelha"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `IsValid()`
- 🛠️ `Less_IntInt()`
- 🛠️ `SetColorAndOpacity()`
- 🛠️ `Conv_IntToText()`

**Variáveis Manipuladas:**
- `Get AmmoMagazine`
- `Get Character`
- `Get CurrentAmmoInMag`
- `Get SpawnedWeapons`
- `Get WarningColor`
- `Get WeaponSlot`
- `Get WeaponSystem`

### 📌 Grafo: `GetAmmoStored`

**Comentários e Títulos de Seção Encontrados:**
- *"Se a munição armazenada for menor que 5 ela ficará na cor vermelha"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `IsValid()`
- 🛠️ `Less_IntInt()`
- 🛠️ `SetColorAndOpacity()`
- 🛠️ `Conv_IntToText()`

**Variáveis Manipuladas:**
- `Get AmmoStored`
- `Get Character`
- `Get CurrentAmmoInBP`
- `Get NormalColor`
- `Get SpawnedWeapons`
- `Get WarningColor`
- `Get WeaponSlot`
- `Get WeaponSystem`

### 📌 Grafo: `GetAmmoVisibility`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `EqualEqual_NameName()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get InitialWeapon`
- `Get WeaponSlot`
- `Get WeaponSystem`

### 📌 Grafo: `GetItemVisibility`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get SpawnedWeapons`
- `Get WeaponSlot`
- `Get WeaponSystem`

### 📌 Grafo: `GetWeaponIcon`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Get WeaponSlot`
- `Get WeaponSystem`

### 📌 Grafo: `ExecuteUbergraph_UMG_Slot`

**Comentários e Títulos de Seção Encontrados:**
- *"Cast para seu personagem"*

**Eventos de Entrada (Events):**
- 🟢 `Construct`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Set Character`

### 📌 Grafo: `Construct`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_UMG_Slot()`

### 📌 Grafo: `GetItemVisibility_MERGED`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get SpawnedWeapons`
- `Get WeaponSlot`
- `Get WeaponSystem`

### 📌 Grafo: `GetWeaponIcon_MERGED`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Get WeaponSlot`
- `Get WeaponSystem`

### 📌 Grafo: `GetAmmoMagazine_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Se a munição do pente for menor que 5 ela ficará na cor vermelha"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `IsValid()`
- 🛠️ `Conv_IntToText()`
- 🛠️ `Less_IntInt()`
- 🛠️ `SetColorAndOpacity()`

**Variáveis Manipuladas:**
- `Get AmmoMagazine`
- `Get Character`
- `Get CurrentAmmoInMag`
- `Get SpawnedWeapons`
- `Get WarningColor`
- `Get WeaponSlot`
- `Get WeaponSystem`

### 📌 Grafo: `GetAmmoStored_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Se a munição armazenada for menor que 5 ela ficará na cor vermelha"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsValid()`
- 🛠️ `Conv_IntToText()`
- 🛠️ `Less_IntInt()`
- 🛠️ `SetColorAndOpacity()`
- 🛠️ `Conv_ByteToInt()`

**Variáveis Manipuladas:**
- `Get AmmoStored`
- `Get Character`
- `Get CurrentAmmoInBP`
- `Get NormalColor`
- `Get SpawnedWeapons`
- `Get WarningColor`
- `Get WeaponSlot`
- `Get WeaponSystem`

### 📌 Grafo: `GetAmmoVisibility_MERGED`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_ByteToInt()`
- 🛠️ `EqualEqual_NameName()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get InitialWeapon`
- `Get WeaponSlot`
- `Get WeaponSystem`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `UMG_Slot`?
- Quais variáveis estão disponíveis no Blueprint `UMG_Slot`?
- Quais funções e eventos são chamados no grafo do `UMG_Slot`?