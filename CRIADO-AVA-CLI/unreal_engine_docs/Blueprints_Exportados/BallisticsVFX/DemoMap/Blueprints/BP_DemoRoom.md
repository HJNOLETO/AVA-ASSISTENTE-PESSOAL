# 🎮 Blueprint: BP_DemoRoom

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `RoomSize` | `int` |
| `SectionWidth` | `struct (Vector)` |
| `TrimWidth` | `struct (Vector)` |
| `MirrorRoom` | `bool` |
| `Lights` | `bool` |
| `LightRadius` | `real (double)` |
| `Brightness` | `real (double)` |
| `DoubleHeight` | `bool` |
| `LoopMesh` | `object (StaticMesh)` |
| `OpenRoof` | `bool` |
| `NumberofRooms` | `int` |
| `SwitchColor` | `bool` |
| `GlassWalls` | `bool` |
| `RoomNames` | `text` |
| `RoomType` | `byte (BP_DemoRoom_Enum)` |
| `FrontDoor` | `bool` |
| `OpenBack` | `bool` |
| `CastShadows` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

### 📌 Grafo: `UserConstructionScript`

**Comentários e Títulos de Seção Encontrados:**
- *"Offset for rooms"*
- *"Add Components of the Room"*
- *"Loop for each room"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AddLoopSections()`
- 🛠️ `AddBackWall()`
- 🛠️ `AddClamp()`
- 🛠️ `AddTrim()`
- 🛠️ `AddWall()`
- 🛠️ `AddLights()`
- 🛠️ `AddOpenTrim()`
- 🛠️ `Clamp()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `AddRoomNames()`
- 🛠️ `BreakVector()`

**Variáveis Manipuladas:**
- `Get MirrorRoom`
- `Get NumberofRooms`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddLoopSections`

**Comentários e Títulos de Seção Encontrados:**
- *"Set Color"*
- *"set last loop mesh"*
- *"Start loop depending on room size"*
- *"set loop mesh"*
- *"Add and transform loop mesh"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Clamp()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `MakeTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `SelectObject()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `CreateDynamicMaterialInstance()`
- 🛠️ `SetVectorParameterValue()`
- 🛠️ `SetScalarParameterValue()`
- 🛠️ `Greater_IntInt()`

**Variáveis Manipuladas:**
- `Get DoubleHeight`
- `Get OpenRoof`
- `Get RoomSize`
- `Get RoomType`
- `Get SectionWidth`
- `Get SwitchColor`
- `Get TrimWidth`

### 📌 Grafo: `AddBackWall`

**Comentários e Títulos de Seção Encontrados:**
- *"Different wall if double height room"*
- *"add Wall mesh"*

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`
- 🛠️ `Divide_VectorVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `SelectObject()`
- 🛠️ `SetStaticMesh()`

**Variáveis Manipuladas:**
- `Get DoubleHeight`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddClamp`

**Comentários e Títulos de Seção Encontrados:**
- *"Add and transform Clamp mesh"*
- *"Last mesh and transformation"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `SelectObject()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Clamp()`

**Variáveis Manipuladas:**
- `Get DoubleHeight`
- `Get NumberofRooms`
- `Get OpenBack`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddTrim`

**Comentários e Títulos de Seção Encontrados:**
- *"add and set transformation for last mesh"*
- *"Add mesh"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `SelectObject()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Clamp()`

**Variáveis Manipuladas:**
- `Get DoubleHeight`
- `Get NumberofRooms`
- `Get OpenBack`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddWall`

**Comentários e Títulos de Seção Encontrados:**
- *"Add Glass walls"*
- *"Add Glass walls"*
- *"AddWall"*
- *"Select mesh"*
- *"Add room divider"*
- *"add 2nd Wall"*
- *"Scale"*
- *"Location"*
- *"Offset"*
- *"Front Door"*
- 🔀 Contém `13` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `SelectObject()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Clamp()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `SetMaterial()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `NotEqual_BoolBool()`

**Variáveis Manipuladas:**
- `Get DoubleHeight`
- `Get FrontDoor`
- `Get GlassWalls`
- `Get MirrorRoom`
- `Get NumberofRooms`
- `Get OpenBack`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddLights`

**Comentários e Títulos de Seção Encontrados:**
- *"Add lights if true"*
- *"Set Light Parameters"*
- *"Start Loop and Offset Transformation"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetAttenuationRadius()`
- 🛠️ `SetIntensity()`
- 🛠️ `BreakTransform()`
- 🛠️ `BreakVector()`
- 🛠️ `GetTransform()`
- 🛠️ `Clamp()`
- 🛠️ `MakeTransform()`
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `SelectVector()`
- 🛠️ `MakeVector()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `FFloor()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Fraction()`
- 🛠️ `SelectFloat()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `SetSourceRadius()`
- 🛠️ `SetCastShadows()`

**Variáveis Manipuladas:**
- `Get Brightness`
- `Get CastShadows`
- `Get LightRadius`
- `Get Lights`
- `Get MirrorRoom`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddOpenTrim`

**Comentários e Títulos de Seção Encontrados:**
- *"Add Trim if its and Open room"*
- *"Add Trim at the end of the room"*
- *"Add Trim at the beginning of the room"*
- *"Add Trim for loop section"*
- *"Scale mesh to fit the entire length of the room"*
- *"Location of the end trim"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Clamp()`
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get NumberofRooms`
- `Get OpenRoof`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddRoomNames`

**Comentários e Títulos de Seção Encontrados:**
- *"Add text Render actor and set Text"*
- *"If there is text in the array then it sets the TextRenderComponent text of that room"*
- *"Add TextRenderComponent"*
- *"Text location at the beginning of each room"*
- *"Text location at the end of each room"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GreaterEqual_IntInt()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeVector()`
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `SelectFloat()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `BreakVector()`
- 🛠️ `K2_SetText()`
- 🛠️ `Conv_StringToText()`

**Variáveis Manipuladas:**
- `Get MirrorRoom`
- `Get NumberofRooms`
- `Get OpenBack`
- `Get RoomNames`
- `Get RoomSize`
- `Get SectionWidth`

### 📌 Grafo: `ExecuteUbergraph_BP_DemoRoom`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Offset for rooms"*
- *"Add Components of the Room"*
- *"Loop for each room"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AddLoopSections()`
- 🛠️ `AddBackWall()`
- 🛠️ `AddClamp()`
- 🛠️ `AddTrim()`
- 🛠️ `AddWall()`
- 🛠️ `AddLights()`
- 🛠️ `AddOpenTrim()`
- 🛠️ `Clamp()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `AddRoomNames()`
- 🛠️ `BreakVector()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `Add_IntInt()`

**Variáveis Manipuladas:**
- `Get MirrorRoom`
- `Get NumberofRooms`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddLoopSections_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Set Color"*
- *"set last loop mesh"*
- *"Start loop depending on room size"*
- *"set loop mesh"*
- *"Add and transform loop mesh"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Clamp()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `MakeTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `SelectObject()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `CreateDynamicMaterialInstance()`
- 🛠️ `SetVectorParameterValue()`
- 🛠️ `SetScalarParameterValue()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `Add_IntInt()`
- 🛠️ `EqualEqual_ByteByte()`

**Variáveis Manipuladas:**
- `Get DoubleHeight`
- `Get OpenRoof`
- `Get RoomSize`
- `Get RoomType`
- `Get SectionWidth`
- `Get SwitchColor`
- `Get TrimWidth`

### 📌 Grafo: `AddBackWall_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Different wall if double height room"*
- *"add Wall mesh"*

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`
- 🛠️ `Divide_VectorVector()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `SelectObject()`
- 🛠️ `SetStaticMesh()`

**Variáveis Manipuladas:**
- `Get DoubleHeight`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddClamp_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Add and transform Clamp mesh"*
- *"Last mesh and transformation"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `SelectObject()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Clamp()`

**Variáveis Manipuladas:**
- `Get DoubleHeight`
- `Get NumberofRooms`
- `Get OpenBack`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddTrim_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"add and set transformation for last mesh"*
- *"Add mesh"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `SelectObject()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Clamp()`

**Variáveis Manipuladas:**
- `Get DoubleHeight`
- `Get NumberofRooms`
- `Get OpenBack`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddWall_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Add Glass walls"*
- *"Add Glass walls"*
- *"AddWall"*
- *"Select mesh"*
- *"Add room divider"*
- *"add 2nd Wall"*
- *"Scale"*
- *"Location"*
- *"Offset"*
- *"Front Door"*
- 🔀 Contém `13` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `SelectObject()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `MakeVector()`
- 🛠️ `BreakVector()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Clamp()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `Greater_DoubleDouble()`
- 🛠️ `SetMaterial()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `NotEqual_BoolBool()`

**Variáveis Manipuladas:**
- `Get DoubleHeight`
- `Get FrontDoor`
- `Get GlassWalls`
- `Get MirrorRoom`
- `Get NumberofRooms`
- `Get OpenBack`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddLights_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Add lights if true"*
- *"Set Light Parameters"*
- *"Start Loop and Offset Transformation"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetAttenuationRadius()`
- 🛠️ `SetIntensity()`
- 🛠️ `BreakTransform()`
- 🛠️ `BreakVector()`
- 🛠️ `GetTransform()`
- 🛠️ `Clamp()`
- 🛠️ `MakeTransform()`
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `SelectVector()`
- 🛠️ `MakeVector()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `FFloor()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Fraction()`
- 🛠️ `SelectFloat()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `SetSourceRadius()`
- 🛠️ `SetCastShadows()`
- 🛠️ `Add_IntInt()`

**Variáveis Manipuladas:**
- `Get Brightness`
- `Get CastShadows`
- `Get LightRadius`
- `Get Lights`
- `Get MirrorRoom`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddOpenTrim_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Add Trim if its and Open room"*
- *"Add Trim at the end of the room"*
- *"Add Trim at the beginning of the room"*
- *"Add Trim for loop section"*
- *"Scale mesh to fit the entire length of the room"*
- *"Location of the end trim"*
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_IntToFloat()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Clamp()`
- 🛠️ `Greater_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get NumberofRooms`
- `Get OpenRoof`
- `Get RoomSize`
- `Get SectionWidth`
- `Get TrimWidth`

### 📌 Grafo: `AddRoomNames_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Add text Render actor and set Text"*
- *"If there is text in the array then it sets the TextRenderComponent text of that room"*
- *"Add TextRenderComponent"*
- *"Text location at the beginning of each room"*
- *"Text location at the end of each room"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GreaterEqual_IntInt()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeVector()`
- 🛠️ `Multiply_IntFloat()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `SelectFloat()`
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `LessEqual_IntInt()`
- 🛠️ `BreakVector()`
- 🛠️ `K2_SetText()`
- 🛠️ `Conv_StringToText()`

**Variáveis Manipuladas:**
- `Get MirrorRoom`
- `Get NumberofRooms`
- `Get OpenBack`
- `Get RoomNames`
- `Get RoomSize`
- `Get SectionWidth`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_DemoRoom`?
- Quais variáveis estão disponíveis no Blueprint `BP_DemoRoom`?
- Quais funções e eventos são chamados no grafo do `BP_DemoRoom`?