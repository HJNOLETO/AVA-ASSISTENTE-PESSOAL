# 🎮 Blueprint: CameraShake_Notify

**[Classe Pai / Parent Class: `AnimNotify`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `ShakeClass` | `class (LegacyCameraShake)` |
| `Scale` | `real (double)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `Received_Notify`

**Funções e Métodos Chamados:**
- 🛠️ `GetOwner()`
- 🛠️ `ClientStartCameraShake()`
- 🛠️ `GetController()`

**Variáveis Manipuladas:**
- `Get Scale`
- `Get ShakeClass`

### 📌 Grafo: `Received_Notify_MERGED`
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `GetOwner()`
- 🛠️ `ClientStartCameraShake()`
- 🛠️ `GetController()`
- 🛠️ `IsValid()`

**Variáveis Manipuladas:**
- `Get Scale`
- `Get ShakeClass`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `CameraShake_Notify`?
- Quais variáveis estão disponíveis no Blueprint `CameraShake_Notify`?
- Quais funções e eventos são chamados no grafo do `CameraShake_Notify`?