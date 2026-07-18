# 🎮 Blueprint: SimpleObjectBuilder

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Mesh` | `object (StaticMesh)` |
| `Material` | `object (MaterialInterface)` |
| `TopColor 1` | `struct (LinearColor)` |
| `TopColor 2` | `struct (LinearColor)` |
| `SideColor 1` | `struct (LinearColor)` |
| `SideColor 2` | `struct (LinearColor)` |
| `Tiling` | `real (double)` |
| `Roughness` | `real (double)` |
| `NewPhysicalMaterial` | `object (PhysicalMaterial)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `SetPhysMaterialOverride()`

**Variáveis Manipuladas:**
- `Get NewPhysicalMaterial`
- `Get StaticMesh`

### 📌 Grafo: `UserConstructionScript`

**Funções e Métodos Chamados:**
- 🛠️ `SetVectorParameterValueOnMaterials()`
- 🛠️ `SetScalarParameterValueOnMaterials()`
- 🛠️ `Conv_LinearColorToVector()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `SetMaterial()`

**Variáveis Manipuladas:**
- `Get Material`
- `Get Mesh`
- `Get Roughness`
- `Get SideColor 1`
- `Get SideColor 2`
- `Get StaticMesh`
- `Get Tiling`
- `Get TopColor 1`
- `Get TopColor 2`

### 📌 Grafo: `ExecuteUbergraph_SimpleObjectBuilder`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `SetPhysMaterialOverride()`

**Variáveis Manipuladas:**
- `Get NewPhysicalMaterial`
- `Get StaticMesh`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_SimpleObjectBuilder()`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `SetVectorParameterValueOnMaterials()`
- 🛠️ `SetScalarParameterValueOnMaterials()`
- 🛠️ `Conv_LinearColorToVector()`
- 🛠️ `SetStaticMesh()`
- 🛠️ `SetMaterial()`

**Variáveis Manipuladas:**
- `Get Material`
- `Get Mesh`
- `Get Roughness`
- `Get SideColor 1`
- `Get SideColor 2`
- `Get StaticMesh`
- `Get Tiling`
- `Get TopColor 1`
- `Get TopColor 2`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `SimpleObjectBuilder`?
- Quais variáveis estão disponíveis no Blueprint `SimpleObjectBuilder`?
- Quais funções e eventos são chamados no grafo do `SimpleObjectBuilder`?