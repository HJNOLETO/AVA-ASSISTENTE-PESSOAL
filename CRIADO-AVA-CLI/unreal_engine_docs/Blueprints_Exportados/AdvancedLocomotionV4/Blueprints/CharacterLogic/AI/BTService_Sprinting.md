# 🎮 Blueprint: BTService_Sprinting

**[Classe Pai / Parent Class: `BTService_BlueprintBase`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
*Nenhuma variável explícita declarada no painel de controle.*

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveActivationAI`
- 🟢 `ReceiveDeactivationAI`

**Funções e Métodos Chamados:**
- 🛠️ `SprintAction()`

### 📌 Grafo: `ExecuteUbergraph_BTService_Sprinting`

**Eventos de Entrada (Events):**
- 🟢 `ReceiveActivationAI`
- 🟢 `ReceiveDeactivationAI`

**Funções e Métodos Chamados:**
- 🛠️ `SprintAction()`

### 📌 Grafo: `ReceiveDeactivationAI`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BTService_Sprinting()`

### 📌 Grafo: `ReceiveActivationAI`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BTService_Sprinting()`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BTService_Sprinting`?
- Quais funções e eventos são chamados no grafo do `BTService_Sprinting`?