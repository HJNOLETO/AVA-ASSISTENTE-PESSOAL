# 🎮 Blueprint: BP_Jetpack

**[Classe Pai / Parent Class: `BP_InteractionObject_C`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `IsJetpack` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Está ativo?"*
- *"Executar apenas uma vez?"*
- *"Desativar Jetpack"*
- *"Ativar jetpack"*
- *"Efeitos do JetPack"*

**Eventos de Entrada (Events):**
- 🟢 `Interact`
- 🟢 `ResetDoOnce`
- 🟢 `JetpackEffects`
- 🔀 Contém `3` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetComponents()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `SetActive()`
- 🛠️ `K2_DetachFromActor()`
- 🛠️ `K2_SetActorTransform()`
- 🛠️ `GetTransform()`
- 🛠️ `ResetDoOnce()`
- 🛠️ `K2_GetComponentToWorld()`
- 🛠️ `SpawnSoundAtLocation()`
- 🛠️ `SetHiddenInGame()`
- 🛠️ `SetIntensity()`
- 🛠️ `SetIntParameter()`
- 🛠️ `SetFloatParameter()`
- 🛠️ `SetColorParameter()`
- 🛠️ `SetLightColor()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `IsJetpack()`
- 🛠️ `BreakTransform()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get DoOnce`
- `Get FX_LThruster`
- `Get FX_RThruster`
- `Get IsActive`
- `Get Item`
- `Get JetpackSound`
- `Get Light_LThruster`
- `Get Light_RThruster`
- `Get Mesh`
- `Get RotatingMovement`
- `Set GravityScale`
- `Set IsActive`
- `Set IsJetpack`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ThrusterRotation`

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `FInterpTo()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get LThruster`
- `Get RThruster`

### 📌 Grafo: `ExecuteUbergraph_BP_Jetpack`

**Comentários e Títulos de Seção Encontrados:**
- *"Está ativo?"*
- *"Executar apenas uma vez?"*
- *"Desativar Jetpack"*
- *"Ativar jetpack"*
- *"Efeitos do JetPack"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `Interact`
- 🟢 `ResetDoOnce`
- 🟢 `JetpackEffects`
- 🔀 Contém `6` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetComponents()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `SetActive()`
- 🛠️ `K2_DetachFromActor()`
- 🛠️ `K2_SetActorTransform()`
- 🛠️ `GetTransform()`
- 🛠️ `ResetDoOnce()`
- 🛠️ `K2_GetComponentToWorld()`
- 🛠️ `SpawnSoundAtLocation()`
- 🛠️ `SetHiddenInGame()`
- 🛠️ `SetIntensity()`
- 🛠️ `SetIntParameter()`
- 🛠️ `SetFloatParameter()`
- 🛠️ `SetColorParameter()`
- 🛠️ `SetLightColor()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `IsJetpack()`
- 🛠️ `BreakTransform()`
- 🛠️ `MakeTransform()`

**Variáveis Manipuladas:**
- `Get Character`
- `Get CharacterMovement`
- `Get DoOnce`
- `Get FX_LThruster`
- `Get FX_RThruster`
- `Get IsActive`
- `Get Item`
- `Get JetpackSound`
- `Get Light_LThruster`
- `Get Light_RThruster`
- `Get Mesh`
- `Get RotatingMovement`
- `Set GravityScale`
- `Set IsActive`
- `Set IsJetpack`

### 📌 Grafo: `JetpackEffects`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Jetpack()`

### 📌 Grafo: `ResetDoOnce`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Jetpack()`

### 📌 Grafo: `Interact`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Jetpack()`

### 📌 Grafo: `UserConstructionScript_MERGED`

### 📌 Grafo: `ThrusterRotation_MERGED`

**Funções e Métodos Chamados:**
- 🛠️ `K2_SetRelativeRotation()`
- 🛠️ `FInterpTo()`
- 🛠️ `MakeRotator()`
- 🛠️ `Multiply_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get LThruster`
- `Get RThruster`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_Jetpack`?
- Quais variáveis estão disponíveis no Blueprint `BP_Jetpack`?
- Quais funções e eventos são chamados no grafo do `BP_Jetpack`?