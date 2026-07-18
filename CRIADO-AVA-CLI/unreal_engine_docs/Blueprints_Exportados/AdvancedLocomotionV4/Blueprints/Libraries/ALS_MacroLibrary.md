# 🎮 Blueprint: ALS_MacroLibrary

**[Classe Pai / Parent Class: `Object`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
*Nenhuma variável explícita declarada no painel de controle.*

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `ML_IsDifferent(Byte)`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `NotEqual_ByteByte()`

### 📌 Grafo: `ML_MultiTraceHit`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Conv_IntToBool()`

### 📌 Grafo: `ML_ComponentWorldToLocal`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentToWorld()`
- 🛠️ `InvertTransform()`
- 🛠️ `ComposeTransforms()`

### 📌 Grafo: `ML_ComponentLocalToWorld`

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetComponentToWorld()`
- 🛠️ `InvertTransform()`
- 🛠️ `BreakTransform()`
- 🛠️ `InverseTransformLocation()`
- 🛠️ `InverseTransformRotation()`
- 🛠️ `MakeTransform()`

### 📌 Grafo: `ML_Transform-Transform`

**Funções e Métodos Chamados:**
- 🛠️ `Subtract_VectorVector()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `BreakTransform()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeRotator()`

### 📌 Grafo: `ML_Transform+Transform`

**Funções e Métodos Chamados:**
- 🛠️ `BreakTransform()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeRotator()`

### 📌 Grafo: `ML_DoWhile(TrueFalse)`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

### 📌 Grafo: `ML_SetPreviousAndNewValue`

### 📌 Grafo: `ML_GetNextArrayItem`

**Funções e Métodos Chamados:**
- 🛠️ `EqualEqual_IntInt()`
- 🛠️ `SelectInt()`

### 📌 Grafo: `ML_GetPreviousArrayItem`

**Funções e Métodos Chamados:**
- 🛠️ `SelectInt()`
- 🛠️ `Subtract_IntInt()`
- 🛠️ `LessEqual_IntInt()`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `ALS_MacroLibrary`?
- Quais funções e eventos são chamados no grafo do `ALS_MacroLibrary`?