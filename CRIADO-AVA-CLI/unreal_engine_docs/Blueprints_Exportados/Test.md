# 🎮 Blueprint: Test

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
*Nenhuma variável explícita declarada no painel de controle.*

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveBeginPlay` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `ReceiveActorBeginOverlap` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `ReceiveTick` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `BndEvt__Test_Box_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `ReceiveAnyDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ApplyDamage()`
- 🛠️ `SetDamage()`
- 🛠️ `K2_SetText()`
- 🛠️ `Conv_StringToText()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `GetWidget()`
- 🛠️ `SetPercent()`
- 🛠️ `Divide_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get BarDamage`
- `Get Barrinha`
- `Get Health`
- `Get TextRender`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ExecuteUbergraph_Test`

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__Test_Box_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `ReceiveAnyDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ApplyDamage()`
- 🛠️ `SetDamage()`
- 🛠️ `K2_SetText()`
- 🛠️ `Conv_StringToText()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `GetWidget()`
- 🛠️ `SetPercent()`
- 🛠️ `Divide_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get BarDamage`
- `Get Barrinha`
- `Get Health`
- `Get TextRender`

### 📌 Grafo: `ReceiveAnyDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Test()`

### 📌 Grafo: `BndEvt__Test_Box_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_Test()`

### 📌 Grafo: `UserConstructionScript_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `Test`?
- Quais funções e eventos são chamados no grafo do `Test`?