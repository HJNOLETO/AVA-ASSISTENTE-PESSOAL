# 🎮 Blueprint: W_CustomCharacter

**[Classe Pai / Parent Class: `UserWidget`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
*Nenhuma variável explícita declarada no painel de controle.*

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Botão para rotacionar para esquerda"*
- *"Botão para rotacionar para direita"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__W_CustomCharacter_LeftButton_K2Node_ComponentBoundEvent_1_OnButtonReleasedEvent__DelegateSignature`
- 🟢 `BndEvt__W_CustomCharacter_RightButton_K2Node_ComponentBoundEvent_3_OnButtonReleasedEvent__DelegateSignature`
- 🟢 `BndEvt__W_CustomCharacter_LeftButton_K2Node_ComponentBoundEvent_4_OnButtonPressedEvent__DelegateSignature`
- 🟢 `BndEvt__W_CustomCharacter_RightButton_K2Node_ComponentBoundEvent_5_OnButtonPressedEvent__DelegateSignature`
- 🟢 `PreConstruct` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `Construct` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `Tick` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*

**Funções e Métodos Chamados:**
- 🛠️ `GetActorOfClass()`
- 🛠️ `EventRotateLeft()`
- 🛠️ `EventStopRotate()`
- 🛠️ `EventRotateRight()`

### 📌 Grafo: `ExecuteUbergraph_W_CustomCharacter`

**Comentários e Títulos de Seção Encontrados:**
- *"Botão para rotacionar para esquerda"*
- *"Botão para rotacionar para direita"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__W_CustomCharacter_LeftButton_K2Node_ComponentBoundEvent_1_OnButtonReleasedEvent__DelegateSignature`
- 🟢 `BndEvt__W_CustomCharacter_RightButton_K2Node_ComponentBoundEvent_3_OnButtonReleasedEvent__DelegateSignature`
- 🟢 `BndEvt__W_CustomCharacter_LeftButton_K2Node_ComponentBoundEvent_4_OnButtonPressedEvent__DelegateSignature`
- 🟢 `BndEvt__W_CustomCharacter_RightButton_K2Node_ComponentBoundEvent_5_OnButtonPressedEvent__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `GetActorOfClass()`
- 🛠️ `EventRotateLeft()`
- 🛠️ `EventStopRotate()`
- 🛠️ `EventRotateRight()`

### 📌 Grafo: `BndEvt__W_CustomCharacter_RightButton_K2Node_ComponentBoundEvent_5_OnButtonPressedEvent__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_W_CustomCharacter()`

### 📌 Grafo: `BndEvt__W_CustomCharacter_LeftButton_K2Node_ComponentBoundEvent_4_OnButtonPressedEvent__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_W_CustomCharacter()`

### 📌 Grafo: `BndEvt__W_CustomCharacter_RightButton_K2Node_ComponentBoundEvent_3_OnButtonReleasedEvent__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_W_CustomCharacter()`

### 📌 Grafo: `BndEvt__W_CustomCharacter_LeftButton_K2Node_ComponentBoundEvent_1_OnButtonReleasedEvent__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_W_CustomCharacter()`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `W_CustomCharacter`?
- Quais funções e eventos são chamados no grafo do `W_CustomCharacter`?