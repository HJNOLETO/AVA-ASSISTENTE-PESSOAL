# 🎮 Blueprint: BP_GoodSky

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Refresh Sky Shader( For direction actor ` | `bool` |
| `└ Directional light actor ( For Custom Mode ` | `object (DirectionalLight)` |
| `Enable Auto Day / Night Cycle In Game?` | `bool` |
| `└ How long is a day in the game? ( Unit : Minute ` | `real (double)` |
| `Enable Time of Day` | `bool` |
| `└ Time of Day ( For Custom Mode ` | `real (double)` |
| `SkyPreset` | `byte (Enum_GoodSky_Preset)` |
| `SkyCloudsStyle` | `byte (Enum_GoodSky_Style_Clouds)` |
| `SkyCloudsCoveragePreset` | `byte (Enum_GoodSky_Clouds_Coverage)` |
| `Curve_BaseCloudColor` | `object (CurveLinearColor)` |
| `Curve_DomeColor` | `object (CurveLinearColor)` |
| `Curve_AllOverlayColor` | `object (CurveLinearColor)` |
| `Curve_StarsTime` | `object (CurveFloat)` |
| `Curve_BackGroundHorizonColor` | `object (CurveVector)` |
| `Curve_SunDirection` | `object (CurveVector)` |
| `SkyMaterial` | `object (MaterialInstanceDynamic)` |
| `SelectSkyName` | `name` |
| `SkyEffect` | `byte (Enum_GoodSky_Effects)` |
| `SkyMesh` | `byte (Enum_GoodSky_MeshType)` |
| `UseRandomTime( For Custom Mode ` | `bool` |
| `Use All Random` | `bool` |
| `Global Texture Move Speed ` | `real (double)` |
| `Global Overlay Color` | `struct (LinearColor)` |
| `Global Horizon Fog Falloff` | `real (double)` |
| `Clouds Behind Effect Intensity` | `real (double)` |
| `Moon Overlay Color` | `struct (LinearColor)` |
| `Moon Size` | `real (double)` |
| `Moon Brightness` | `real (double)` |
| `Moon Move` | `real (double)` |
| `Sun Size` | `real (double)` |
| `Sun Brightness` | `real (double)` |
| `Stars Overlay  Color` | `struct (LinearColor)` |
| `Stars Brightness` | `real (double)` |
| `Stars UVTile` | `real (double)` |
| `Stars Falloff Intensity` | `real (double)` |
| `Lightning Brightness` | `real (double)` |
| `Curve_SunLight` | `object (CurveFloat)` |
| `Lightning Overlay Color` | `struct (LinearColor)` |
| `Get Present Time of Day` | `real (double)` |
| `Moon Eclipse Intensity` | `int` |
| `├ Moon Eclipse Offset` | `real (double)` |
| `└ Moon Eclipse Rotator` | `real (double)` |
| `Get Rotator To Time of Day` | `real (double)` |
| `Temp Time of Day` | `real (double)` |
| `Get Present Rotator` | `struct (Rotator)` |
| `East / West ` | `real (double)` |
| `ArrowTool  Visible` | `bool` |
| `Sun Disappear In Horizon` | `real (double)` |
| `Sun Direction` | `byte (Enum_SunDirection)` |
| `Lightning Frequency` | `real (double)` |
| `bDaytime` | `bool` |
| `NewVar_0` | `struct (Vector2D)` |
| `TempX` | `int` |
| `TempY` | `int` |
| `TempVector` | `struct (Vector)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"GoodSky v2.4(Permanently Free Content / Sponsored Content from March 1st, 2019)\r\n\r\nLast updated On :  Sep ,2022 by UNEASY (You-Siang,Jian) Email:feeling94750@gmail.com\r\n\r\nDocument : https://uneasy-game-dev.gitbook.io/docum/unreal-marketplace/good-sky"*
- *"real world time 60 second  from \"*
- *"Night / Day Cycle In Game"*
- *"start from user setting"*
- *"update direction light actor"*
- *"Enable Auto Day / Night Cycle In Game?"*
- *"Check Light Actor is valid?"*
- *"Covert time of day"*
- *"Custom Event"*
- *"real world time 60 second  from \"*
- *"0=<X=<360"*
- *"Add Present Rotator"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `ReceiveActorBeginOverlap` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `ReceiveTick`
- 🟢 `GoodSky Realtime Update`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetActorTickEnabled()`
- 🛠️ `GetRealTimeSeconds()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `MakeRotator()`
- 🛠️ `Percent_FloatFloat()`
- 🛠️ `MapRangeUnclamped()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `BreakRotator()`
- 🛠️ `Init()`
- 🛠️ `K2_SetActorRotation()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `BreakVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Abs()`

**Variáveis Manipuladas:**
- `Get East / West `
- `Get Enable Auto Day / Night Cycle In Game?`
- `Get Get Present Rotator`
- `Get Get Present Time of Day`
- `Get └ Directional light actor ( For Custom Mode )`
- `Get └ How long is a day in the game? ( Unit : Minute )`
- `Get └ Time of Day ( For Custom Mode )`
- `Set East / West `
- `Set Get Present Rotator`
- `Set Get Present Time of Day`
- `Set Get Rotator To Time of Day`
- `Set └ Time of Day ( For Custom Mode )`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `Init()`

### 📌 Grafo: `Get Sky Presets DataTable`

**Comentários e Títulos de Seção Encontrados:**
- *"Global Setting"*
- *"Sky Background"*
- *"Sky clouds"*
- *"Effect Sun"*
- *"Sun Back Lit"*
- *"Storm"*
- *"Stars"*
- *"Moon"*
- *"Global"*
- *"Check Row Name"*

**Funções e Métodos Chamados:**
- 🛠️ `SetScalarParameterValue()`
- 🛠️ `SetVectorParameterValue()`

**Variáveis Manipuladas:**
- `Get SkyMaterial`

### 📌 Grafo: `Use All Random Sky`

**Comentários e Títulos de Seção Encontrados:**
- *"Check Bool"*
- *"Random Time"*
- *"Random Clouds Coverage"*
- *"Random Weather Effects (Sun / Moon / Storm)"*
- *"Random Clouds Style"*
- *"Force Covert Default Mode"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `RandomIntegerInRange()`
- 🛠️ `RandomFloatInRange()`

**Variáveis Manipuladas:**
- `Get Use All Random`
- `Set SkyCloudsCoveragePreset`
- `Set SkyCloudsStyle`
- `Set SkyEffect`
- `Set SkyPreset`
- `Set └ Time of Day ( For Custom Mode )`

### 📌 Grafo: `Init`

**Comentários e Títulos de Seção Encontrados:**
- *"Reforce Update BP when checking"*
- *"None Mode"*
- *"Check if Add Effect"*
- *"Check if Use Preset"*
- *"Check if Rand Time"*
- *"Check if Cloud Coverage Preset"*
- *"Time Of Day Setting"*
- *"Super Heavy"*
- *"Middle"*
- *"Slight"*
- *"Super Slight"*
- *"Clear"*
- *"Parameter"*
- *"Moon"*
- *"Stars"*
- *"Storm"*
- *"Force Time of Day & Use Time Function"*
- *"Sun"*
- *"Unreal Style_Sun"*
- *"Custom Style  Base"*
- *"Sun / Stars Mode"*
- *"Moon Mode"*
- *"Storm Mode"*
- *"Sky Clouds Style"*
- *"Cloud Coverage Preset Setting"*
- *"check Mesh Setting"*
- *"Check Random Weather"*
- *"Force Effect"*
- *"Force Time of Day"*
- *"Force Time of Day"*
- *"Force Effect"*
- *"Unckeck Time Funciton "*
- *"Assign  Material  when choice a preset"*
- *"Check Effect"*
- *"Get Sky Presets DataTable"*
- *"Unckeck Time Funciton "*
- *"None Mode"*
- *"Sun / Stars Mode"*
- *"Moon Mode"*
- *"Storm Mode"*
- *"Check Effect"*
- *"Get Sky Presets DataTable"*
- *"Custom Can Adjust  Sun Position / Stars"*
- *"Force Sun / Stars Mode"*
- *"Direction Light Setting"*
- *"Direction Light Actor Covert Variable"*
- *"Valid?"*
- *"Moon Setting"*
- *"Sun /Stars Setting"*
- *"Storm"*
- *"Global"*
- *"Clamp 0~24"*
- *"Sun Rise In The East"*
- *"Arrow Tool"*
- *"Force Hidden in game"*
- *"Get Time of Day"*
- *"Arrow Face Sun Point"*
- *"Set Visible Mesh in Sun/Stars Mode"*
- *"Storm Mode"*
- *"Storm Mode"*
- *"O=daytime"*
- 🔀 Contém `8` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CreateDynamicMaterialInstance()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `SetVectorParameterValue()`
- 🛠️ `GetLinearColorValue()`
- 🛠️ `SetScalarParameterValue()`
- 🛠️ `Get Sky Presets DataTable()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `Use All Random Sky()`
- 🛠️ `SetTextureParameterValue()`
- 🛠️ `K2_GetScalarParameterValue()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `GetFloatValue()`
- 🛠️ `Conv_VectorToLinearColor()`
- 🛠️ `BreakRotator()`
- 🛠️ `MapRangeUnclamped()`
- 🛠️ `K2_GetVectorParameterValue()`
- 🛠️ `Conv_LinearColorToVector()`
- 🛠️ `Percent_FloatFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `MakeRotator()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `K2_SetWorldRotation()`
- 🛠️ `SetVisibility()`
- 🛠️ `GetVectorValue()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `MakeVector2D()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get ArrowTool`
- `Get ArrowTool  Visible`
- `Get Clouds Behind Effect Intensity`
- `Get Curve_AllOverlayColor`
- `Get Curve_BackGroundHorizonColor`
- `Get Curve_BaseCloudColor`
- `Get Curve_DomeColor`
- `Get Curve_StarsTime`
- `Get Curve_SunDirection`
- `Get Curve_SunLight`
- `Get Enable Time of Day`
- `Get Global Horizon Fog Falloff`
- `Get Global Overlay Color`
- `Get Global Texture Move Speed `
- `Get Lightning Brightness`
- `Get Lightning Frequency`
- `Get Lightning Overlay Color`
- `Get Mesh_Group`
- `Get Moon Brightness`
- `Get Moon Eclipse Intensity`
- `Get Moon Move`
- `Get Moon Overlay Color`
- `Get Moon Size`
- `Get MoonMesh`
- `Get NOW_Arrow`
- `Get Refresh Sky Shader( For direction actor )`
- `Get SelectSkyName`
- `Get SkyCloudsCoveragePreset`
- `Get SkyCloudsStyle`
- `Get SkyEffect`
- `Get SkyMaterial`
- `Get SkyMesh`
- `Get SkyPreset`
- `Get StarMesh`
- `Get Stars Brightness`
- `Get Stars Falloff Intensity`
- `Get Stars Overlay  Color`
- `Get Stars UVTile`
- `Get StaticMesh`
- `Get Sun Brightness`
- `Get Sun Direction`
- `Get Sun Disappear In Horizon`
- `Get Sun Size`
- `Get SunMesh`
- `Get SunSphere_Group`
- `Get Temp Time of Day`
- `Get TempVector`
- `Get Use All Random`
- `Get UseRandomTime( For Custom Mode )`
- `Get └ Directional light actor ( For Custom Mode )`
- `Get └ Moon Eclipse Rotator`
- `Get └ Time of Day ( For Custom Mode )`
- `Get ├ Moon Eclipse Offset`
- `Set Enable Time of Day`
- `Set Refresh Sky Shader( For direction actor )`
- `Set SelectSkyName`
- `Set SkyEffect`
- `Set SkyMaterial`
- `Set SkyPreset`
- `Set Temp Time of Day`
- `Set TempVector`
- `Set TempX`
- `Set TempY`
- `Set Use All Random`
- `Set UseRandomTime( For Custom Mode )`
- `Set └ Time of Day ( For Custom Mode )`

### 📌 Grafo: `TimeOfDay`

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetActorRotation()`
- 🛠️ `MakeRotator()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `Init()`

**Variáveis Manipuladas:**
- `Get └ Directional light actor ( For Custom Mode )`
- `Set └ Time of Day ( For Custom Mode )`

### 📌 Grafo: `ExecuteUbergraph_BP_GoodSky`

**Comentários e Títulos de Seção Encontrados:**
- *"GoodSky v2.4(Permanently Free Content / Sponsored Content from March 1st, 2019)\r\n\r\nLast updated On :  Sep ,2022 by UNEASY (You-Siang,Jian) Email:feeling94750@gmail.com\r\n\r\nDocument : https://uneasy-game-dev.gitbook.io/docum/unreal-marketplace/good-sky"*
- *"real world time 60 second  from \"*
- *"Night / Day Cycle In Game"*
- *"start from user setting"*
- *"update direction light actor"*
- *"Enable Auto Day / Night Cycle In Game?"*
- *"Check Light Actor is valid?"*
- *"Covert time of day"*
- *"Custom Event"*
- *"real world time 60 second  from \"*
- *"0=<X=<360"*
- *"Add Present Rotator"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`
- 🟢 `ReceiveTick`
- 🟢 `GoodSky Realtime Update`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetActorTickEnabled()`
- 🛠️ `GetRealTimeSeconds()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `MakeRotator()`
- 🛠️ `Percent_FloatFloat()`
- 🛠️ `MapRangeUnclamped()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `BreakRotator()`
- 🛠️ `Init()`
- 🛠️ `K2_SetActorRotation()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `BreakVector()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `Abs()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get East / West `
- `Get Enable Auto Day / Night Cycle In Game?`
- `Get Get Present Rotator`
- `Get Get Present Time of Day`
- `Get └ Directional light actor ( For Custom Mode )`
- `Get └ How long is a day in the game? ( Unit : Minute )`
- `Get └ Time of Day ( For Custom Mode )`
- `Set East / West `
- `Set Get Present Rotator`
- `Set Get Present Time of Day`
- `Set Get Rotator To Time of Day`
- `Set └ Time of Day ( For Custom Mode )`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_GoodSky()`

### 📌 Grafo: `ReceiveTick`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_GoodSky()`

### 📌 Grafo: `GoodSky Realtime Update`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_GoodSky()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `Init()`

### 📌 Grafo: `Get Sky Presets DataTable_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Global Setting"*
- *"Sky Background"*
- *"Sky clouds"*
- *"Effect Sun"*
- *"Sun Back Lit"*
- *"Storm"*
- *"Stars"*
- *"Moon"*
- *"Global"*
- *"Check Row Name"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetScalarParameterValue()`
- 🛠️ `SetVectorParameterValue()`
- 🛠️ `GetDataTableRowFromName()`

**Variáveis Manipuladas:**
- `Get SkyMaterial`

### 📌 Grafo: `Use All Random Sky_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Check Bool"*
- *"Random Time"*
- *"Random Clouds Coverage"*
- *"Random Weather Effects (Sun / Moon / Storm)"*
- *"Random Clouds Style"*
- *"Force Covert Default Mode"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `RandomIntegerInRange()`
- 🛠️ `RandomFloatInRange()`

**Variáveis Manipuladas:**
- `Get Use All Random`
- `Set SkyCloudsCoveragePreset`
- `Set SkyCloudsStyle`
- `Set SkyEffect`
- `Set SkyPreset`
- `Set └ Time of Day ( For Custom Mode )`

### 📌 Grafo: `Init_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Reforce Update BP when checking"*
- *"None Mode"*
- *"Check if Add Effect"*
- *"Check if Use Preset"*
- *"Check if Rand Time"*
- *"Check if Cloud Coverage Preset"*
- *"Time Of Day Setting"*
- *"Super Heavy"*
- *"Middle"*
- *"Slight"*
- *"Super Slight"*
- *"Clear"*
- *"Parameter"*
- *"Moon"*
- *"Stars"*
- *"Storm"*
- *"Force Time of Day & Use Time Function"*
- *"Sun"*
- *"Unreal Style_Sun"*
- *"Custom Style  Base"*
- *"Sun / Stars Mode"*
- *"Moon Mode"*
- *"Storm Mode"*
- *"Sky Clouds Style"*
- *"Cloud Coverage Preset Setting"*
- *"check Mesh Setting"*
- *"Check Random Weather"*
- *"Force Effect"*
- *"Force Time of Day"*
- *"Force Time of Day"*
- *"Force Effect"*
- *"Unckeck Time Funciton "*
- *"Assign  Material  when choice a preset"*
- *"Check Effect"*
- *"Get Sky Presets DataTable"*
- *"Unckeck Time Funciton "*
- *"None Mode"*
- *"Sun / Stars Mode"*
- *"Moon Mode"*
- *"Storm Mode"*
- *"Check Effect"*
- *"Get Sky Presets DataTable"*
- *"Custom Can Adjust  Sun Position / Stars"*
- *"Force Sun / Stars Mode"*
- *"Direction Light Setting"*
- *"Direction Light Actor Covert Variable"*
- *"Valid?"*
- *"Moon Setting"*
- *"Sun /Stars Setting"*
- *"Storm"*
- *"Global"*
- *"Clamp 0~24"*
- *"Sun Rise In The East"*
- *"Arrow Tool"*
- *"Force Hidden in game"*
- *"Get Time of Day"*
- *"Arrow Face Sun Point"*
- *"Set Visible Mesh in Sun/Stars Mode"*
- *"Storm Mode"*
- *"Storm Mode"*
- *"O=daytime"*
- 🔀 Contém `12` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `CreateDynamicMaterialInstance()`
- 🛠️ `RandomFloatInRange()`
- 🛠️ `SetVectorParameterValue()`
- 🛠️ `GetLinearColorValue()`
- 🛠️ `SetScalarParameterValue()`
- 🛠️ `Get Sky Presets DataTable()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `Use All Random Sky()`
- 🛠️ `SetTextureParameterValue()`
- 🛠️ `K2_GetScalarParameterValue()`
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `Conv_RotatorToVector()`
- 🛠️ `GetFloatValue()`
- 🛠️ `Conv_VectorToLinearColor()`
- 🛠️ `BreakRotator()`
- 🛠️ `MapRangeUnclamped()`
- 🛠️ `K2_GetVectorParameterValue()`
- 🛠️ `Conv_LinearColorToVector()`
- 🛠️ `Percent_FloatFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `MakeRotator()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `K2_SetWorldRotation()`
- 🛠️ `SetVisibility()`
- 🛠️ `GetVectorValue()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `MakeVector2D()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`
- 🛠️ `IsValid()`
- 🛠️ `Multiply_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get ArrowTool`
- `Get ArrowTool  Visible`
- `Get Clouds Behind Effect Intensity`
- `Get Curve_AllOverlayColor`
- `Get Curve_BackGroundHorizonColor`
- `Get Curve_BaseCloudColor`
- `Get Curve_DomeColor`
- `Get Curve_StarsTime`
- `Get Curve_SunDirection`
- `Get Curve_SunLight`
- `Get Enable Time of Day`
- `Get Global Horizon Fog Falloff`
- `Get Global Overlay Color`
- `Get Global Texture Move Speed `
- `Get Lightning Brightness`
- `Get Lightning Frequency`
- `Get Lightning Overlay Color`
- `Get Mesh_Group`
- `Get Moon Brightness`
- `Get Moon Eclipse Intensity`
- `Get Moon Move`
- `Get Moon Overlay Color`
- `Get Moon Size`
- `Get MoonMesh`
- `Get NOW_Arrow`
- `Get Refresh Sky Shader( For direction actor )`
- `Get SelectSkyName`
- `Get SkyCloudsCoveragePreset`
- `Get SkyCloudsStyle`
- `Get SkyEffect`
- `Get SkyMaterial`
- `Get SkyMesh`
- `Get SkyPreset`
- `Get StarMesh`
- `Get Stars Brightness`
- `Get Stars Falloff Intensity`
- `Get Stars Overlay  Color`
- `Get Stars UVTile`
- `Get StaticMesh`
- `Get Sun Brightness`
- `Get Sun Direction`
- `Get Sun Disappear In Horizon`
- `Get Sun Size`
- `Get SunMesh`
- `Get SunSphere_Group`
- `Get Temp Time of Day`
- `Get TempVector`
- `Get Use All Random`
- `Get UseRandomTime( For Custom Mode )`
- `Get └ Directional light actor ( For Custom Mode )`
- `Get └ Moon Eclipse Rotator`
- `Get └ Time of Day ( For Custom Mode )`
- `Get ├ Moon Eclipse Offset`
- `Set Enable Time of Day`
- `Set Refresh Sky Shader( For direction actor )`
- `Set SelectSkyName`
- `Set SkyEffect`
- `Set SkyMaterial`
- `Set SkyPreset`
- `Set Temp Time of Day`
- `Set TempVector`
- `Set TempX`
- `Set TempY`
- `Set Use All Random`
- `Set UseRandomTime( For Custom Mode )`
- `Set └ Time of Day ( For Custom Mode )`

### 📌 Grafo: `TimeOfDay_MERGED`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetActorRotation()`
- 🛠️ `MakeRotator()`
- 🛠️ `MapRangeClamped()`
- 🛠️ `Init()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get └ Directional light actor ( For Custom Mode )`
- `Get └ Time of Day ( For Custom Mode )`
- `Set └ Time of Day ( For Custom Mode )`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_GoodSky`?
- Quais variáveis estão disponíveis no Blueprint `BP_GoodSky`?
- Quais funções e eventos são chamados no grafo do `BP_GoodSky`?