# 🎮 Blueprint: VO_BP

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `Is Sound Playing?` | `bool` |
| `Is a sound pending?` | `bool` |
| `Anger_1_Played` | `bool` |
| `Anger_2_Played` | `bool` |
| `Anger_3_Played` | `bool` |
| `Is Anger Playing?` | `bool` |
| `DoorCommented?` | `bool` |
| `AngerThreshold_1` | `real (double)` |
| `AngerThreshold_2` | `real (double)` |
| `AngerThreshold_3` | `real (double)` |
| `AngerThreshold_4` | `real (double)` |
| `Segwayed?` | `bool` |
| `Anger_4_Played` | `bool` |
| `FinalThreshold` | `real (double)` |
| `NarratorEnabled?` | `bool` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Mood of VO"*
- *"Door comment"*
- *"Anger 2"*
- *"Anger 3"*
- *"Check if sound is pending, check if sound is playing... "*
- *"Check if sound is pending, check if sound is playing... "*
- *"Check if sound is pending, check if sound is playing... "*
- *"check 1"*
- *"Door Already Done Check"*
- *"Check 2"*
- *"Check 3"*
- *"Anger 4"*
- *"Check if sound is pending, check if sound is playing... "*
- *"Anger 1"*
- *"Check if sound is pending, check if sound is playing... "*
- *"Comment"*
- *"Audio Finished Bool Set"*
- *"Comment"*
- *"Check if sound is pending, check if sound is playing... "*
- *"VO 4"*
- *"Comment"*
- *"Comment"*
- *"Comment"*
- *"Comment"*
- *"Check if sound is pending, check if sound is playing... "*
- *"Check if sound is pending, check if sound is playing... "*
- *"Final"*
- *"Check if sound is pending, check if sound is playing... "*
- *"VO 2"*
- *"VO 3"*
- *"VO 4"*
- *"Comment"*
- *"Starting VO 1"*
- *"Comment"*
- *"Comment"*

**Eventos de Entrada (Events):**
- 🟢 `ReceiveTick` — *This node is disabled and will not be called.\nDrag off pins to build functionality.*
- 🟢 `BndEvt__Audio_K2Node_ComponentBoundEvent_449_OnAudioFinished__DelegateSignature`
- 🟢 `BndEvt__VO_2_K2Node_ComponentBoundEvent_60_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__Lookat_dirt_K2Node_ComponentBoundEvent_622_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__VO_3_K2Node_ComponentBoundEvent_65_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__VO_4_K2Node_ComponentBoundEvent_71_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__Trigger_VO_1_K2Node_ComponentBoundEvent_47_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `ReceiveBeginPlay`
- 🔀 Contém `43` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetSound()`
- 🛠️ `Play()`
- 🛠️ `Delay()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `PrintString()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `Conv_BoolToString()`
- 🛠️ `K2_DestroyComponent()`
- 🛠️ `RetriggerableDelay()`
- 🛠️ `GetPlayerCharacter()`

**Variáveis Manipuladas:**
- `Get AngerThreshold_1`
- `Get AngerThreshold_2`
- `Get AngerThreshold_3`
- `Get AngerThreshold_4`
- `Get Anger_1_Played`
- `Get Anger_2_Played`
- `Get Anger_3_Played`
- `Get Anger_4_Played`
- `Get AssholeRating`
- `Get Audio`
- `Get DoorCommented?`
- `Get Doors Destroyed?`
- `Get FinalThreshold`
- `Get Is Anger Playing?`
- `Get Is Sound Playing?`
- `Get Is a sound pending?`
- `Get Lookat_dirt`
- `Get NarratorEnabled?`
- `Get Segwayed?`
- `Get Trigger_VO_1`
- `Get VO_2`
- `Get VO_3`
- `Get VO_4`
- `Set AngerThreshold_1`
- `Set AngerThreshold_2`
- `Set AngerThreshold_3`
- `Set AngerThreshold_4`
- `Set Anger_1_Played`
- `Set Anger_2_Played`
- `Set Anger_3_Played`
- `Set Anger_4_Played`
- `Set DoorCommented?`
- `Set FinalThreshold`
- `Set Is Anger Playing?`
- `Set Is Sound Playing?`
- `Set Is a sound pending?`
- `Set NarratorEnabled?`
- `Set Segwayed?`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `ExecuteUbergraph_VO_BP`

**Comentários e Títulos de Seção Encontrados:**
- *"Audio Finished Bool Set"*
- *"Comment"*
- *"Comment"*
- *"Comment"*
- *"Comment"*
- *"Check if sound is pending, check if sound is playing... "*
- *"Check if sound is pending, check if sound is playing... "*
- *"Check if sound is pending, check if sound is playing... "*
- *"Starting VO 1"*
- *"VO 2"*
- *"VO 3"*
- *"VO 4"*
- *"Anger 1"*
- *"Mood of VO"*
- *"Anger 2"*
- *"Anger 3"*
- *"Anger 4"*
- *"Check if sound is pending, check if sound is playing... "*
- *"Check if sound is pending, check if sound is playing... "*
- *"Check if sound is pending, check if sound is playing... "*
- *"Check if sound is pending, check if sound is playing... "*
- *"check 1"*
- *"Check 2"*
- *"Check 3"*
- *"Door comment"*
- *"Comment"*
- *"Comment"*
- *"Comment"*
- *"Door Already Done Check"*
- *"Final"*
- *"Check if sound is pending, check if sound is playing... "*
- *"Comment"*
- *"Check if sound is pending, check if sound is playing... "*
- *"VO 4"*
- *"Comment"*
- *"Close on first entrance, if desired"*

**Eventos de Entrada (Events):**
- 🟢 `BndEvt__Trigger_VO_1_K2Node_ComponentBoundEvent_47_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__VO_2_K2Node_ComponentBoundEvent_60_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__VO_3_K2Node_ComponentBoundEvent_65_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__VO_4_K2Node_ComponentBoundEvent_71_ComponentBeginOverlapSignature__DelegateSignature`
- 🟢 `BndEvt__Audio_K2Node_ComponentBoundEvent_449_OnAudioFinished__DelegateSignature`
- 🟢 `ReceiveBeginPlay`
- 🟢 `BndEvt__Lookat_dirt_K2Node_ComponentBoundEvent_622_ComponentBeginOverlapSignature__DelegateSignature`
- 🔀 Contém `47` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Delay()`
- 🛠️ `SetSound()`
- 🛠️ `Play()`
- 🛠️ `K2_DestroyComponent()`
- 🛠️ `PrintString()`
- 🛠️ `Conv_DoubleToString()`
- 🛠️ `GetPlayerCharacter()`
- 🛠️ `GreaterEqual_DoubleDouble()`
- 🛠️ `RetriggerableDelay()`
- 🛠️ `Conv_BoolToString()`
- 🛠️ `Less_IntInt()`

**Variáveis Manipuladas:**
- `Get AngerThreshold_1`
- `Get AngerThreshold_2`
- `Get AngerThreshold_3`
- `Get AngerThreshold_4`
- `Get Anger_1_Played`
- `Get Anger_2_Played`
- `Get Anger_3_Played`
- `Get Anger_4_Played`
- `Get AssholeRating`
- `Get Audio`
- `Get DoorCommented?`
- `Get Doors Destroyed?`
- `Get FinalThreshold`
- `Get Is Anger Playing?`
- `Get Is Sound Playing?`
- `Get Is a sound pending?`
- `Get Lookat_dirt`
- `Get NarratorEnabled?`
- `Get Segwayed?`
- `Get Trigger_VO_1`
- `Get VO_2`
- `Get VO_3`
- `Get VO_4`
- `Set AngerThreshold_1`
- `Set AngerThreshold_2`
- `Set AngerThreshold_3`
- `Set AngerThreshold_4`
- `Set Anger_1_Played`
- `Set Anger_2_Played`
- `Set Anger_3_Played`
- `Set Anger_4_Played`
- `Set DoorCommented?`
- `Set FinalThreshold`
- `Set Is Anger Playing?`
- `Set Is Sound Playing?`
- `Set Is a sound pending?`
- `Set NarratorEnabled?`
- `Set Segwayed?`

### 📌 Grafo: `BndEvt__Audio_K2Node_ComponentBoundEvent_449_OnAudioFinished__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_VO_BP()`

### 📌 Grafo: `BndEvt__Lookat_dirt_K2Node_ComponentBoundEvent_622_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_VO_BP()`

### 📌 Grafo: `BndEvt__Trigger_VO_1_K2Node_ComponentBoundEvent_47_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_VO_BP()`

### 📌 Grafo: `BndEvt__VO_2_K2Node_ComponentBoundEvent_60_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_VO_BP()`

### 📌 Grafo: `BndEvt__VO_3_K2Node_ComponentBoundEvent_65_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_VO_BP()`

### 📌 Grafo: `BndEvt__VO_4_K2Node_ComponentBoundEvent_71_ComponentBeginOverlapSignature__DelegateSignature`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_VO_BP()`

### 📌 Grafo: `ReceiveBeginPlay`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_VO_BP()`

### 📌 Grafo: `UserConstructionScript_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `VO_BP`?
- Quais variáveis estão disponíveis no Blueprint `VO_BP`?
- Quais funções e eventos são chamados no grafo do `VO_BP`?