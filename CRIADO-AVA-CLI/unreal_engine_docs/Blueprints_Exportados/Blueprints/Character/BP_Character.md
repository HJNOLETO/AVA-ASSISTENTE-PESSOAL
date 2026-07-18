# 🎮 Blueprint: BP_Character

**[Classe Pai / Parent Class: `Character`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `BaseTurnRate` | `real (double)` |
| `BaseLookUpRate` | `real (double)` |
| `CameraCrouch` | `bool` |
| `CameraSmooth` | `real (double)` |
| `Dead` | `bool` |
| `SpawnPoints` | `name` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

**Comentários e Títulos de Seção Encontrados:**
- *"Mouse input"*
- *"Movement input"*
- *"Correr"*
- *"Agachar"*
- *"Evento Start/End Crouch"*
- *"Evento Dano Global"*
- *"Evento para morrer"*
- *"Reanimar personagem"*
- *"Pular"*
- *"Event On Landed"*

**Eventos de Entrada (Events):**
- 🟢 `K2_OnStartCrouch`
- 🟢 `K2_OnEndCrouch`
- 🟢 `ReceiveAnyDamage`
- 🟢 `OnLanded`
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AddControllerPitchInput()`
- 🛠️ `AddControllerYawInput()`
- 🛠️ `AddMovementInput()`
- 🛠️ `GetControlRotation()`
- 🛠️ `GetForwardVector()`
- 🛠️ `GetRightVector()`
- 🛠️ `BreakRotator()` — *Zero out pitch and roll, only move on plane*
- 🛠️ `MakeRotator()`
- 🛠️ `Crouch()`
- 🛠️ `UnCrouch()`
- 🛠️ `Not_PreBool()`
- 🛠️ `SetDamage()`
- 🛠️ `FallDamage()`
- 🛠️ `Sprint()`

**Variáveis Manipuladas:**
- `Get Dead`
- `Get Health`
- `Get MinHealth`
- `Get bIsCrouched`
- `Set CameraCrouch`

### 📌 Grafo: `Efeito Camera Suave`

**Funções e Métodos Chamados:**
- 🛠️ `MapRangeUnclamped()`
- 🛠️ `SelectFloat()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `K2_SetRelativeLocation()`
- 🛠️ `Lerp()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`

**Variáveis Manipuladas:**
- `Get CameraBoom`
- `Get CameraCrouch`
- `Get CameraSmooth`
- `Get RelativeLocation`
- `Set CameraSmooth`

### 📌 Grafo: `Event Death`

**Comentários e Títulos de Seção Encontrados:**
- *"Attach e colisão"*
- *"Física e colisão"*
- *"Dead e movimento desabilitado"*
- *"Parar animações e executar animação de morrer"*
- *"Desabilitar colisão da capsula"*
- *"Camera fade"*
- *"Deixar o jogo lento"*
- *"Exibir/esconder HUD"*
- *"Reanimar personagem"*

**Eventos de Entrada (Events):**
- 🟢 `Death`

**Funções e Métodos Chamados:**
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `SetCollisionResponseToChannel()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `SetSimulatePhysics()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `IsDead()`
- 🛠️ `StopAnimMontage()`
- 🛠️ `Deactivate()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `StartCameraFade()`
- 🛠️ `GetPlayerController()`
- 🛠️ `VisibilityHUD()`
- 🛠️ `Delay()`
- 🛠️ `Reanimate()`

**Variáveis Manipuladas:**
- `Get CameraBoom`
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get Mesh`
- `Set Dead`

### 📌 Grafo: `Reanimar`

**Comentários e Títulos de Seção Encontrados:**
- *"Attach e resetar transform"*
- *"Parar de simular física"*
- *"Vida e velocidade do personagem"*
- *"Avançar hora"*
- *"Camera fade"*
- *"Ativar/desativar HUD"*
- *"Parar de morrer"*
- *"Tempo volta ao normal"*
- *"Movimento volta ao normal"*
- *"Desativa a animação de morrer"*
- *"Volta colisão e física da cápsula"*
- *"Respawnar jogador"*
- *"Respawnar jogador"*

**Eventos de Entrada (Events):**
- 🟢 `Reanimate`
- 🟢 `RespawnCharacter`

**Funções e Métodos Chamados:**
- 🛠️ `SetHealth()`
- 🛠️ `SetSimulatePhysics()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `K2_SetRelativeTransform()`
- 🛠️ `GetGameInstance()`
- 🛠️ `AddTime()`
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `StartCameraFade()`
- 🛠️ `GetPlayerController()`
- 🛠️ `VisibilityHUD()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `Activate()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `IsDead()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `BreakTransform()`
- 🛠️ `K2_SetActorTransform()`
- 🛠️ `SetControlRotation()`
- 🛠️ `BreakRotator()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `RespawnCharacter()`
- 🛠️ `RangeSpawnPoint()`
- 🛠️ `Map_Values()`
- 🛠️ `MakeTransform()`
- 🛠️ `MakeRotator()`

**Variáveis Manipuladas:**
- `Get CameraBoom`
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get Health`
- `Get Mesh`
- `Get MinHealth`
- `Get SpawnPoints`
- `Set Dead`

### 📌 Grafo: `Jumping`

**Comentários e Títulos de Seção Encontrados:**
- *"Jump"*
- 🔀 Contém `4` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `Jump()`
- 🛠️ `StopJumping()`
- 🛠️ `Not_PreBool()`
- 🛠️ `UnCrouch()`
- 🛠️ `Delay()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `IsJumping()`
- 🛠️ `LaunchCharacter()`
- 🛠️ `JumpStamina()`

**Variáveis Manipuladas:**
- `Get CanJump`
- `Get Health`
- `Get Mesh`
- `Get bIsCrouched`

### 📌 Grafo: `UserConstructionScript`

### 📌 Grafo: `RangeSpawnPoint`
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `Vector_Distance()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get DistanceIndex`
- `Get MinDistance`
- `Set DistanceIndex`
- `Set MinDistance`

### 📌 Grafo: `IsInAir`

**Funções e Métodos Chamados:**
- 🛠️ `IsFalling()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`

### 📌 Grafo: `DamageSpeed`

**Funções e Métodos Chamados:**
- 🛠️ `LessEqual_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get CharacterMovement`
- `Get Health`
- `Set MaxWalkSpeed`

### 📌 Grafo: `BPI_Get_EssentialValues`

### 📌 Grafo: `BPI_Get_CurrentStates`

### 📌 Grafo: `GetCharacterDead`

### 📌 Grafo: `ExecuteUbergraph_BP_Character`

**Comentários e Títulos de Seção Encontrados:**
- *"Mouse input"*
- *"Movement input"*
- *"Correr"*
- *"Agachar"*
- *"Evento Start/End Crouch"*
- *"Evento Dano Global"*
- *"Evento para morrer"*
- *"Reanimar personagem"*
- *"Pular"*
- *"Event On Landed"*
- *"Jump"*
- *"Attach e resetar transform"*
- *"Parar de simular física"*
- *"Vida e velocidade do personagem"*
- *"Avançar hora"*
- *"Camera fade"*
- *"Ativar/desativar HUD"*
- *"Parar de morrer"*
- *"Tempo volta ao normal"*
- *"Movimento volta ao normal"*
- *"Desativa a animação de morrer"*
- *"Volta colisão e física da cápsula"*
- *"Respawnar jogador"*
- *"Respawnar jogador"*
- *"Attach e colisão"*
- *"Física e colisão"*
- *"Dead e movimento desabilitado"*
- *"Parar animações e executar animação de morrer"*
- *"Desabilitar colisão da capsula"*
- *"Camera fade"*
- *"Deixar o jogo lento"*
- *"Exibir/esconder HUD"*
- *"Reanimar personagem"*

**Eventos de Entrada (Events):**
- 🟢 `K2_OnStartCrouch`
- 🟢 `K2_OnEndCrouch`
- 🟢 `ReceiveAnyDamage`
- 🟢 `OnLanded`
- 🟢 `Reanimate`
- 🟢 `RespawnCharacter`
- 🟢 `Death`
- 🟢 `IsJetpack`
- 🟢 `IsJumping`
- 🟢 `IsDead`
- 🟢 `SetArmour`
- 🟢 `DamageAnimation`
- 🟢 `SetDamage`
- 🟢 `SetHealth`
- 🟢 `BPI_Set_OverlayState`
- 🟢 `BPI_Set_ViewMode`
- 🟢 `BPI_Set_Gait`
- 🟢 `BPI_Set_RotationMode`
- 🟢 `BPI_Set_MovementAction`
- 🟢 `BPI_Set_MovementState`
- 🟢 `CameraSuave__UpdateFunc`
- 🟢 `CameraSuave__FinishedFunc`
- 🔀 Contém `8` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `AddControllerPitchInput()`
- 🛠️ `AddControllerYawInput()`
- 🛠️ `AddMovementInput()`
- 🛠️ `GetControlRotation()`
- 🛠️ `GetForwardVector()`
- 🛠️ `GetRightVector()`
- 🛠️ `BreakRotator()`
- 🛠️ `MakeRotator()`
- 🛠️ `Crouch()`
- 🛠️ `UnCrouch()`
- 🛠️ `Not_PreBool()`
- 🛠️ `SetDamage()`
- 🛠️ `FallDamage()`
- 🛠️ `Sprint()`
- 🛠️ `Jump()`
- 🛠️ `StopJumping()`
- 🛠️ `Delay()`
- 🛠️ `GetAnimInstance()`
- 🛠️ `IsJumping()`
- 🛠️ `LaunchCharacter()`
- 🛠️ `JumpStamina()`
- 🛠️ `SetHealth()`
- 🛠️ `SetSimulatePhysics()`
- 🛠️ `K2_AttachToComponent()`
- 🛠️ `K2_SetRelativeTransform()`
- 🛠️ `GetGameInstance()`
- 🛠️ `AddTime()`
- 🛠️ `GetPlayerCameraManager()`
- 🛠️ `StartCameraFade()`
- 🛠️ `GetPlayerController()`
- 🛠️ `VisibilityHUD()`
- 🛠️ `SetGlobalTimeDilation()`
- 🛠️ `Activate()`
- 🛠️ `IsDead()`
- 🛠️ `SetCollisionEnabled()`
- 🛠️ `BreakTransform()`
- 🛠️ `K2_SetActorTransform()`
- 🛠️ `SetControlRotation()`
- 🛠️ `Subtract_DoubleDouble()`
- 🛠️ `RespawnCharacter()`
- 🛠️ `RangeSpawnPoint()`
- 🛠️ `Map_Values()`
- 🛠️ `SetCollisionResponseToChannel()`
- 🛠️ `StopAnimMontage()`
- 🛠️ `Deactivate()`
- 🛠️ `Reanimate()`
- 🛠️ `MapRangeUnclamped()`
- 🛠️ `SelectFloat()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `K2_SetRelativeLocation()`
- 🛠️ `Lerp()`
- 🛠️ `IsFalling()`
- 🛠️ `LessEqual_DoubleDouble()`
- 🛠️ `MakeTransform()`
- 🛠️ `BreakVector()`
- 🛠️ `MakeVector()`
- 🛠️ `PlayFromStart()`

**Variáveis Manipuladas:**
- `Get CameraBoom`
- `Get CameraCrouch`
- `Get CameraSmooth`
- `Get CameraSuave`
- `Get CameraSuave_Alpha_848BBB3148EF277104929FBE1137E560`
- `Get CanJump`
- `Get CapsuleComponent`
- `Get CharacterMovement`
- `Get Dead`
- `Get Health`
- `Get Mesh`
- `Get MinHealth`
- `Get RelativeLocation`
- `Get SpawnPoints`
- `Get bIsCrouched`
- `Set CameraCrouch`
- `Set CameraSmooth`
- `Set Dead`
- `Set MaxWalkSpeed`

### 📌 Grafo: `Reanimate`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `RespawnCharacter`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `Death`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `OnLanded`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `ReceiveAnyDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `K2_OnEndCrouch`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `K2_OnStartCrouch`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `BPI_Set_MovementState`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `BPI_Set_MovementAction`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `BPI_Set_RotationMode`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `InpAxisEvt_MoveRight_K2Node_InputAxisEvent_90`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `InpAxisEvt_MoveForward_K2Node_InputAxisEvent_79`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `BPI_Set_Gait`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `InpAxisEvt_Turn_K2Node_InputAxisEvent_47`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `InpAxisEvt_LookUp_K2Node_InputAxisEvent_40`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `IsJetpack`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `IsJumping`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `IsDead`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `SetArmour`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `DamageAnimation`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `SetDamage`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `SetHealth`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `BPI_Set_OverlayState`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `BPI_Set_ViewMode`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `InpActEvt_Jump_K2Node_InputActionEvent_0`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `InpActEvt_Jump_K2Node_InputActionEvent_1`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `InpActEvt_Crouch_K2Node_InputActionEvent_2`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `InpActEvt_Run_K2Node_InputActionEvent_3`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `InpActEvt_Run_K2Node_InputActionEvent_4`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `CameraSuave__UpdateFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `CameraSuave__FinishedFunc`

**Funções e Métodos Chamados:**
- 🛠️ `ExecuteUbergraph_BP_Character()`

### 📌 Grafo: `UserConstructionScript_MERGED`

### 📌 Grafo: `RangeSpawnPoint_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Warning: Do not add, remove, or reorder elements in the input array during the execution of the loop body!"*
- *"Increment Loop Counter"*
- *"Execute Loop Body"*
- *"Test Loop Condition"*
- *"Init Loop Counter"*
- *"Init Array Index"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorLocation()`
- 🛠️ `Vector_Distance()`
- 🛠️ `Less_DoubleDouble()`
- 🛠️ `Add_IntInt()`
- 🛠️ `Less_IntInt()`
- 🛠️ `BreakTransform()`

**Variáveis Manipuladas:**
- `Get DistanceIndex`
- `Get MinDistance`
- `Set DistanceIndex`
- `Set MinDistance`

### 📌 Grafo: `GetCharacterDead_MERGED`

### 📌 Grafo: `BPI_Get_EssentialValues_MERGED`

### 📌 Grafo: `BPI_Get_CurrentStates_MERGED`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_Character`?
- Quais variáveis estão disponíveis no Blueprint `BP_Character`?
- Quais funções e eventos são chamados no grafo do `BP_Character`?