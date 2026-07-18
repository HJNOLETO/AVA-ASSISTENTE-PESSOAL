# 🎮 Blueprint: BP_DemoDisplay

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Type` | `byte (BP_DemoDisplay_Enum)` |
| `Text` | `bool` |
| `Number` | `text` |
| `Description` | `text` |
| `Description2ndLine` | `text` |
| `Transform_0` | `real (double)` |
| `BackgroundColor` | `struct (LinearColor)` |
| `PositionBias1stLine` | `struct (Vector)` |
| `PositionBias1stLineRoom` | `struct (Vector)` |
| `PositionBias2ndLine` | `struct (Vector)` |
| `PositionBias2ndLineRoom` | `struct (Vector)` |
| `ScaleTransform` | `real (double)` |
| `MeshScale` | `struct (Vector)` |
| `FixScale` | `bool` |
| `PhysMat` | `object (PhysicalMaterial)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

### 📌 Grafo: `UserConstructionScript`

**Comentários e Títulos de Seção Encontrados:**
- *"Selected Room Type"*
- *"Description Plate Only"*
- *"Add 1st Line of Description"*
- *"Add Round Display"*
- *"Add Square L Shape Display"*
- *"Add Room Display"*
- *"Add Room Number"*
- *"Add Room Number"*
- *"Add 2nd Description Line"*
- *"Add Second Description Line"*
- *"Add Second Description Line"*
- *"Add 1st Line of Description"*
- *"Add 1st Line of Description"*
- *"Add 1st Line of Description"*
- *"Add Second Description Line"*
- *"Flat Back Wall"*
- *"Room number copy for flat wall"*
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `CreateDynamicMaterialInstance()`
- 🛠️ `SetVectorParameterValue()`
- 🛠️ `Add2ndLineDescription()`
- 🛠️ `Add1stLineDescription()`
- 🛠️ `FixLegacyScale()`
- 🛠️ `K2_SetText()`
- 🛠️ `SetCollisionEnabled()`

**Variáveis Manipuladas:**
- `Get BackgroundColor`
- `Get MeshScale`
- `Get Number`
- `Get PhysMat`
- `Get PositionBias1stLine`
- `Get PositionBias1stLineRoom`
- `Get PositionBias2ndLine`
- `Get PositionBias2ndLineRoom`
- `Get Text`
- `Get Transform_0`
- `Get Type`
- `Set PhysMaterial`

### 📌 Grafo: `ScaleTransformPosition`

**Comentários e Títulos de Seção Encontrados:**
- *"Fix for wrong scaled Legacy Content"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get ScaleTransform`

### 📌 Grafo: `ScaleTransformPosition_2`

**Comentários e Títulos de Seção Encontrados:**
- *"Fix for wrong scaled Legacy Content"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get ScaleTransform`

### 📌 Grafo: `ScaleTransformPosition_3`

**Comentários e Títulos de Seção Encontrados:**
- *"Fix for wrong scaled Legacy Content"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get ScaleTransform`

### 📌 Grafo: `ScaleTransformPositioScale4`

**Comentários e Títulos de Seção Encontrados:**
- *"Fix for wrong scaled Legacy Content"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get ScaleTransform`

### 📌 Grafo: `ScaleTransformPosition_5`

**Comentários e Títulos de Seção Encontrados:**
- *"Fix for wrong scaled Legacy Content"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get ScaleTransform`

### 📌 Grafo: `ScaleTransformPosition_6`

**Comentários e Títulos de Seção Encontrados:**
- *"Fix for wrong scaled Legacy Content"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get ScaleTransform`

### 📌 Grafo: `ScaleTransformPosition_7`

**Comentários e Títulos de Seção Encontrados:**
- *"Fix for wrong scaled Legacy Content"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get ScaleTransform`

### 📌 Grafo: `ScaleTransformPositioScale4_2`

**Comentários e Títulos de Seção Encontrados:**
- *"Fix for wrong scaled Legacy Content"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get ScaleTransform`

### 📌 Grafo: `ScaleTransformPositioScale4_2_2`

**Comentários e Títulos de Seção Encontrados:**
- *"Fix for wrong scaled Legacy Content"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get ScaleTransform`

### 📌 Grafo: `Add2ndLineDescription`

**Comentários e Títulos de Seção Encontrados:**
- *"If there is text"*
- *"add text"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `EqualEqual_StrStr()`
- 🛠️ `SetXScale()`
- 🛠️ `SetYScale()`
- 🛠️ `K2_SetText()`
- 🛠️ `Conv_TextToString()`

**Variáveis Manipuladas:**
- `Get Description2ndLine`
- `Get Transform_0`

### 📌 Grafo: `Add1stLineDescription`

**Comentários e Títulos de Seção Encontrados:**
- *"Make String for Text"*
- *"Add Text and Set Positions"*
- *"Fix for legacy content that has wrong scale"*

**Funções e Métodos Chamados:**
- 🛠️ `Concat_StrStr()`
- 🛠️ `BreakTransform()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeRotator()`
- 🛠️ `SetXScale()`
- 🛠️ `SetYScale()`
- 🛠️ `SelectVector()`
- 🛠️ `EqualEqual_StrStr()`
- 🛠️ `SelectString()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `Len()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_TextToString()`
- 🛠️ `Conv_StringToText()`
- 🛠️ `K2_SetText()`

**Variáveis Manipuladas:**
- `Get Description`
- `Get Description2ndLine`
- `Get Number`
- `Get ScaleTransform`
- `Get Transform_0`

### 📌 Grafo: `ScaleTransformScale`

**Comentários e Títulos de Seção Encontrados:**
- *"Fix for wrong scaled Legacy Content"*

**Funções e Métodos Chamados:**
- 🛠️ `BreakTransform()`
- 🛠️ `MakeTransform()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Divide_VectorVector()`

**Variáveis Manipuladas:**
- `Get MeshScale`
- `Get ScaleTransform`

### 📌 Grafo: `FixLegacyScale`

**Comentários e Títulos de Seção Encontrados:**
- *"This is a fix for Legacy Content that was not build in 1uu = 1cm"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get FixScale`
- `Set MeshScale`
- `Set ScaleTransform`

### 📌 Grafo: `ExecuteUbergraph_BP_DemoDisplay`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Selected Room Type"*
- *"Description Plate Only"*
- *"Add 1st Line of Description"*
- *"Add Round Display"*
- *"Add Square L Shape Display"*
- *"Add Room Display"*
- *"Add Room Number"*
- *"Add Room Number"*
- *"Add 2nd Description Line"*
- *"Add Second Description Line"*
- *"Add Second Description Line"*
- *"Add 1st Line of Description"*
- *"Add 1st Line of Description"*
- *"Add 1st Line of Description"*
- *"Add Second Description Line"*
- *"Flat Back Wall"*
- *"Room number copy for flat wall"*
- *"Fix for wrong scaled Legacy Content"*
- *"Fix for wrong scaled Legacy Content"*
- *"Fix for wrong scaled Legacy Content"*
- *"Fix for wrong scaled Legacy Content"*
- *"Fix for wrong scaled Legacy Content"*
- *"Fix for wrong scaled Legacy Content"*
- *"Fix for wrong scaled Legacy Content"*
- *"Fix for wrong scaled Legacy Content"*
- *"Fix for wrong scaled Legacy Content"*
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `MakeTransform()`
- 🛠️ `CreateDynamicMaterialInstance()`
- 🛠️ `SetVectorParameterValue()`
- 🛠️ `Add2ndLineDescription()`
- 🛠️ `Add1stLineDescription()`
- 🛠️ `FixLegacyScale()`
- 🛠️ `K2_SetText()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `BreakTransform()`
- 🛠️ `Multiply_VectorFloat()`

**Variáveis Manipuladas:**
- `Get BackgroundColor`
- `Get MeshScale`
- `Get Number`
- `Get PhysMat`
- `Get PositionBias1stLine`
- `Get PositionBias1stLineRoom`
- `Get PositionBias2ndLine`
- `Get PositionBias2ndLineRoom`
- `Get ScaleTransform`
- `Get Text`
- `Get Transform_0`
- `Get Type`
- `Set PhysMaterial`

### 📌 Grafo: `Add2ndLineDescription_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"If there is text"*
- *"add text"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `EqualEqual_StrStr()`
- 🛠️ `SetXScale()`
- 🛠️ `SetYScale()`
- 🛠️ `K2_SetText()`
- 🛠️ `Conv_TextToString()`

**Variáveis Manipuladas:**
- `Get Description2ndLine`
- `Get Transform_0`

### 📌 Grafo: `Add1stLineDescription_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Make String for Text"*
- *"Add Text and Set Positions"*
- *"Fix for legacy content that has wrong scale"*
- *"Fix for wrong scaled Legacy Content"*

**Funções e Métodos Chamados:**
- 🛠️ `Concat_StrStr()`
- 🛠️ `BreakTransform()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeRotator()`
- 🛠️ `SetXScale()`
- 🛠️ `SetYScale()`
- 🛠️ `SelectVector()`
- 🛠️ `EqualEqual_StrStr()`
- 🛠️ `SelectString()`
- 🛠️ `Greater_IntInt()`
- 🛠️ `Len()`
- 🛠️ `Multiply_VectorFloat()`
- 🛠️ `Conv_TextToString()`
- 🛠️ `Conv_StringToText()`
- 🛠️ `K2_SetText()`
- 🛠️ `Divide_VectorVector()`

**Variáveis Manipuladas:**
- `Get Description`
- `Get Description2ndLine`
- `Get MeshScale`
- `Get Number`
- `Get ScaleTransform`
- `Get Transform_0`

### 📌 Grafo: `FixLegacyScale_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"This is a fix for Legacy Content that was not build in 1uu = 1cm"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get FixScale`
- `Set MeshScale`
- `Set ScaleTransform`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_DemoDisplay`?
- Quais variáveis estão disponíveis no Blueprint `BP_DemoDisplay`?
- Quais funções e eventos são chamados no grafo do `BP_DemoDisplay`?