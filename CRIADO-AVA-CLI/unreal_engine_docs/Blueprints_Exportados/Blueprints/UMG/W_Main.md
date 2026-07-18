# 🎮 Blueprint: W_Main

**[Classe Pai / Parent Class: `UserWidget`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Dinheiro` | `int` |
| `NormalColor` | `struct (LinearColor)` |
| `NoAmmoColor` | `struct (LinearColor)` |
| `Player` | `object (ALS_Base_CharacterBP_C)` |
| `NorthYaw` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `ArmourVisibility`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `LessEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Armour`
- `Get PlayerStatus`

### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Atualizar munição do pente "*
- *"Informações do HUD para a arma"*
- *"Atualizar munição armazenada"*
- *"Event tick"*

**Eventos de Entrada (Events):**
- 🟢 `SetWeaponDataHUD`
- 🟢 `UpdateAmmoBP`
- 🟢 `UpdateAmmoMag`
- 🟢 `PreConstruct` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `Construct`
- 🟢 `Tick`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `TickBorder()`

**Variáveis Manipuladas:**
- `Set Player`

### 📌 Grafo: `Get_AmmoBox_Visibility_0`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Get Current Weapon Index`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Get WeaponSystem`

### 📌 Grafo: `Get_Icon_Weapons_Brush_0`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Get Current Weapon Index`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Get WeaponSystem`

### 📌 Grafo: `Get_Stamina`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `Divide_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get MaxStamina`
- `Get PlayerStatus`
- `Get Stamina`

### 📌 Grafo: `GetColete`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Get Armour`
- `Get MaxArmour`
- `Get PlayerStatus`

### 📌 Grafo: `GetVida`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Get Health`
- `Get MaxHealth`
- `Get PlayerStatus`

### 📌 Grafo: `GetVisibility_0`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Get Dead`
- `Get RotationMode`

### 📌 Grafo: `Money`

**Funções e Métodos Chamados:**
- 🛠️ `Conv_StringToText()`
- 🛠️ `Conv_IntToString()`

**Variáveis Manipuladas:**
- `Get Dinheiro`

### 📌 Grafo: `Informações da Arma + Posição do Widget`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetOwningPlayer()`
- 🛠️ `ProjectWorldLocationToWidgetPosition()`
- 🛠️ `SetPosition()`
- 🛠️ `SlotAsCanvasSlot()`

**Variáveis Manipuladas:**
- `Get InteractedWeapon`
- `Get Player`
- `Get W_PickupItem`
- `Get WeaponData`
- `Get WeaponMesh`
- `Set WeaponName`

### 📌 Grafo: `PickupVisibility`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get InteractedWeapon`
- `Get IsPickup`
- `Get Player`

### 📌 Grafo: `SwitcherWeapon`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetActiveWidgetIndex()`

**Variáveis Manipuladas:**
- `Get WeaponSwitcher`

### 📌 Grafo: `TickBorder`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetViewYaw()`
- 🛠️ `SetRenderTransformAngle()`
- 🛠️ `IsVisible()`

**Variáveis Manipuladas:**
- `Get MapViewComp`
- `Get Minimap`
- `Get MinimapBorder`
- `Get NorthYaw`

### 📌 Grafo: `Timer`

**Comentários e Títulos de Seção Encontrados:**
- *"Horas"*
- *"Minutos"*

**Funções e Métodos Chamados:**
- 🛠️ `GetGameInstance()`
- 🛠️ `GetSubstring()`
- 🛠️ `Conv_IntToString()`
- 🛠️ `Conv_StringToText()`

**Variáveis Manipuladas:**
- `Get Hour`
- `Get Minute`

### 📌 Grafo: `UpdAmmoBP`

**Comentários e Títulos de Seção Encontrados:**
- *"Cor para o texto "*

**Funções e Métodos Chamados:**
- 🛠️ `SetText()`
- 🛠️ `SetColorAndOpacity()`
- 🛠️ `Less_IntInt()`
- 🛠️ `Conv_IntToText()`

**Variáveis Manipuladas:**
- `Get AmmoStored`
- `Get NoAmmoColor`
- `Get NormalColor`

### 📌 Grafo: `UpdAmmoMag`

**Comentários e Títulos de Seção Encontrados:**
- *"Cor para o texto "*

**Funções e Métodos Chamados:**
- 🛠️ `SetText()`
- 🛠️ `SetColorAndOpacity()`
- 🛠️ `Less_IntInt()`
- 🛠️ `Conv_IntToText()`

**Variáveis Manipuladas:**
- `Get AmmoMagazine`
- `Get NoAmmoColor`
- `Get NormalColor`

### 📌 Grafo: `WeaponData`

**Funções e Métodos Chamados:**
- 🛠️ `SetBrushFromTexture()`

**Variáveis Manipuladas:**
- `Get Icon_Weapons`

### 📌 Grafo: `ExecuteUbergraph_W_Main`

**Comentários e Títulos de Seção Encontrados:**
- *"Informações do HUD para a arma"*
- *"Atualizar munição do pente "*
- *"Atualizar munição armazenada"*
- *"Event tick"*
- *"Cor para o texto "*
- *"Cor para o texto "*
- *"Cor para o texto "*
- *"Cor para o texto "*

**Eventos de Entrada (Events):**
- 🟢 `Construct`
- 🟢 `Tick`
- 🟢 `SetWeaponDataHUD`
- 🟢 `UpdateAmmoMag`
- 🟢 `UpdateAmmoBP`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `TickBorder()`
- 🛠️ `SetText()`
- 🛠️ `Conv_IntToText()`
- 🛠️ `SetColorAndOpacity()`
- 🛠️ `Less_IntInt()`

**Variáveis Manipuladas:**
- `Get AmmoMagazine`
- `Get AmmoStored`
- `Get NoAmmoColor`
- `Get NormalColor`
- `Set Player`

### 📌 Grafo: `UpdateAmmoBP`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_W_Main()`

### 📌 Grafo: `UpdateAmmoMag`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_W_Main()`

### 📌 Grafo: `SetWeaponDataHUD`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_W_Main()`

### 📌 Grafo: `Tick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_W_Main()`

### 📌 Grafo: `Construct`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_W_Main()`

### 📌 Grafo: `Money_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Conv_StringToText()`
- 🛠️ `Conv_IntToString()`

**Variáveis Manipuladas:**
- `Get Dinheiro`

### 📌 Grafo: `Timer_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Horas"*
- *"Minutos"*

**Funções e Métodos Chamados:**
- 🛠️ `GetGameInstance()`
- 🛠️ `GetSubstring()`
- 🛠️ `Conv_IntToString()`
- 🛠️ `Conv_StringToText()`

**Variáveis Manipuladas:**
- `Get Hour`
- `Get Minute`

### 📌 Grafo: `ArmourVisibility_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Get Armour`
- `Get PlayerStatus`

### 📌 Grafo: `GetVisibility_0_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get Dead`
- `Get RotationMode`

### 📌 Grafo: `PickupVisibility_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentLocation()`
- 🛠️ `GetOwningPlayer()`
- 🛠️ `ProjectWorldLocationToWidgetPosition()`
- 🛠️ `SlotAsCanvasSlot()`
- 🛠️ `SetPosition()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get InteractedWeapon`
- `Get IsPickup`
- `Get Player`
- `Get W_PickupItem`
- `Get WeaponData`
- `Get WeaponMesh`
- `Set WeaponName`

### 📌 Grafo: `GetVida_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `Divide_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Health`
- `Get MaxHealth`
- `Get PlayerStatus`

### 📌 Grafo: `GetColete_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `Divide_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get Armour`
- `Get MaxArmour`
- `Get PlayerStatus`

### 📌 Grafo: `Get_Stamina_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Get MaxStamina`
- `Get PlayerStatus`
- `Get Stamina`

### 📌 Grafo: `Get_Icon_Weapons_Brush_0_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Current Weapon Index`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Get WeaponSystem`

### 📌 Grafo: `Get_AmmoBox_Visibility_0_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `IsValid()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get Current Weapon Index`
- `Get SpawnedWeapons`
- `Get WeaponData`
- `Get WeaponSystem`

### 📌 Grafo: `TickBorder_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `IsVisible()`
- 🛠️ `SetRenderTransformAngle()`
- 🛠️ `GetViewYaw()`

**Variáveis Manipuladas:**
- `Get MapViewComp`
- `Get Minimap`
- `Get MinimapBorder`
- `Get NorthYaw`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `W_Main`?
- Quais variáveis estão disponíveis no Blueprint `W_Main`?
- Quais funções e eventos são chamados no grafo do `W_Main`?