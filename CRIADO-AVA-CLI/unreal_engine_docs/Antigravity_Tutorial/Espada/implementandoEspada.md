# 🗡️ Tutorial Completo: Implementando Espada com Animações no Pirata Perdido

**[Data: 27 de Junho de 2026]**
**[Projeto: TheLostPirate | UE 5.1+ | ALSv4]**
**[Status do Editor: Online/Verificado via Remote Control API porta 30010]**

---

## 📋 Inventário do que JÁ EXISTE no Projeto (Verificado Hoje)

Antes de começar, saiba que muito já foi preparado. Aqui está o que você **NÃO precisa criar do zero**:

| Asset | Caminho no Content Browser | Status |
|:---|:---|:---:|
| **BP_PPPirateCharacter** | `/Game/AdvancedLocomotionV4/Blueprints/CharacterLogic/BP_PPPirateCharacter` | ✅ Existe |
| **IA_Attack** (Boolean) | `/Game/Necropolis/Demo/Character/Input/Actions/IA_Attack` | ✅ Existe |
| **IA_HeavyAttack** (Boolean) | `/Game/Necropolis/Demo/Character/Input/Actions/IA_HeavyAttack` | ✅ Existe |
| **IA_Block** (Boolean) | `/Game/Necropolis/Demo/Character/Input/Actions/IA_Block` | ✅ Existe |
| **IMC_Default** | `/Game/Necropolis/Demo/Character/Input/IMC_Default` | ✅ Existe |
| **ALS_AnimBP** | `/Game/AdvancedLocomotionV4/CharacterAssets/MannequinSkeleton/ALS_AnimBP` | ✅ Existe |
| **ALS_Mannequin_Skeleton** | `/Game/AdvancedLocomotionV4/CharacterAssets/MannequinSkeleton/ALS_Mannequin_Skeleton` | ✅ Existe |
| **UE4_Mannequin_Skeleton** | `/Game/Pirate/Demoscene_UE4/Mesh/UE4_Mannequin_Skeleton` | ✅ Existe |
| **SM_Pirate_Sword** | `/Game/Pirate/Mesh_UE4/Weapon/SM_Pirate_Sword` | ✅ Existe |
| **SM_stone_sword** | `/Game/Necropolis/Placeables/Ruins_Update/SM_stone_sword` | ✅ Existe |
| **SM_Sword_01a** (HQ) | `/Game/AncientTreasures/Meshes/SM_Sword_01a` | ✅ Existe |
| **ALS_GameMode_SP** | `/Game/AdvancedLocomotionV4/Blueprints/GameModes/ALS_GameMode_SP` | ✅ Existe |

### Animações de Espada (18 arquivos FBX copiados hoje para o projeto)

As animações do **Lite Sword and Shield Pack** estão agora em:
```
Content/Pirate/Animations/Sword/
```

| Arquivo FBX | Tipo de Animação |
|:---|:---|
| `sword and shield idle.fbx` | Idle com espada e escudo |
| `sword and shield attack.fbx` | Ataque 1 |
| `sword and shield attack (2).fbx` | Ataque 2 (combo) |
| `sword and shield attack (3).fbx` | Ataque 3 (combo) |
| `sword and shield attack (4).fbx` | Ataque 4 (combo) |
| `sword and shield block.fbx` | Bloqueio |
| `sword and shield block (2).fbx` | Bloqueio 2 |
| `sword and shield block idle.fbx` | Bloqueio parado |
| `sword and shield run.fbx` | Corrida com espada |
| `sword and shield run (2).fbx` | Corrida com espada 2 |
| `sword and shield strafe.fbx` | Strafe lateral |
| `sword and shield strafe (2).fbx` | Strafe lateral 2 |
| `sword and shield turn.fbx` | Giro |
| `sword and shield turn (2).fbx` | Giro 2 |
| `sword and shield death.fbx` | Morte |
| `draw sword 1.fbx` | Sacar espada |
| `sheath sword 1.fbx` | Guardar espada |
| `Parasite L Starkie.fbx` | ⚠️ Personagem completo (ignorar por enquanto) |

---

## 🗺️ Roteiro de Implementação (7 Passos)

```
PASSO 1 ──► Importar Animações FBX para o Unreal
PASSO 2 ──► Criar Animation Montages (Ataque, Pesado, Bloqueio)
PASSO 3 ──► Criar Socket da Espada (hand_rWeapon)
PASSO 4 ──► Configurar BP_PPPirateCharacter (Mesh, Inputs, GameMode)
PASSO 5 ──► Programar Lógica de Ataque no Event Graph
PASSO 6 ──► Configurar Animation Blueprint (ALS_AnimBP)
PASSO 7 ──► Testar e Ajustar
```

---

## 📥 PASSO 1 — Importar Animações FBX para o Unreal

### 1.1 Localize os arquivos no Content Browser

1. Abra o **Content Browser** no Unreal Editor.
2. Navegue até: `Content/Pirate/Animations/Sword/`
3. Você verá os 18 arquivos `.fbx` listados.

### 1.2 Importação em Lote (Batch Import)

1. Selecione **todos os arquivos `.fbx`** (exceto `Parasite L Starkie.fbx`).
2. Clique com botão direito → **Import to /Game/Pirate/Animations/Sword/**
   > ⚠️ Se pedir para sobrescrever, escolha **Import All**.
3. Na janela **FBX Import Options**, configure:

| Campo | Valor |
|:---|:---|
| **Skeleton** | `UE4_Mannequin_Skeleton` |
| **Import Content Type** | `Animation` (apenas animação, sem mesh) |
| **Import Meshes in Bone Hierarchy** | ❌ Desmarque |
| **Import Animations** | ✅ Marcado |
| **Animation Length** | `Exported Time` |
| **Import Uniform Scale** | `1.0` |
| **Convert Scene** | ✅ Marcado |
| **Force Front XAxis** | ✅ Marcado |
| **Convert Scene Unit** | ✅ Marcado |

4. Clique **Import All**.

> 💡 **Por que UE4_Mannequin_Skeleton?**  
> As malhas do pirata (`SK_Pirate_Full_01`, `SK_Pirate_Torso`, etc.) usam este esqueleto. As animações do Mixamo são compatíveis com o esqueleto UE4 Mannequin.

### 1.3 Verifique a Importação

Após importar, cada `.fbx` deve gerar uma **Animation Sequence** (sequência azul). Confirme que:
- Os assets têm o ícone de animação (play button azul).
- Ao dar duplo clique, a animação toca corretamente no visualizador.

---

## 🎬 PASSO 2 — Criar Animation Montages

Animation Montages são contêineres que permitem tocar animações com slots, seções e notificações. São essenciais para ataques e combos.

### 2.1 Criar a Pasta de Montages

No Content Browser, crie a pasta:
```
Content/Pirate/Animations/Montages/
```

### 2.2 Criar Montage de Ataque Leve (Combo)

1. Clique com botão direito em `Content/Pirate/Animations/Montages/` → **Animation** → **Animation Montage**.
2. Selecione o skeleton: **`UE4_Mannequin_Skeleton`**
3. Nomeie: `AM_Sword_Attack`
4. Abra a montage (duplo clique).

Dentro da Montage:
1. No painel **Asset Browser** (canto inferior), localize as animações:
   - `sword and shield attack`
   - `sword and shield attack (2)`
   - `sword and shield attack (3)`
   - `sword and shield attack (4)`
2. Arraste **`sword and shield attack`** para o slot `DefaultSlot` na timeline.
3. Arraste as demais em sequência na mesma trilha.
4. Configure as **Sections** clicando com botão direito na timeline:
   - Crie uma section no frame 0 chamada `Attack1`
   - Crie uma section no início da animação 2 chamada `Attack2`
   - Crie uma section no início da animação 3 chamada `Attack3`
   - Crie uma section no início da animação 4 chamada `Attack4`

```
Timeline da AM_Sword_Attack:
[========== Attack1 ==========][===== Attack2 =====][===== Attack3 =====][===== Attack4 =====]
         anim 1                       anim 2               anim 3               anim 4
```

### 2.3 Criar Montage de Ataque Pesado

1. Crie nova Animation Montage → `AM_Sword_HeavyAttack` (skeleton: `UE4_Mannequin_Skeleton`)
2. Arraste **`sword and shield attack`** e **`sword and shield attack (3)`** (uma combinação mais lenta/pesada)
3. Nomeie a section inicial como `Heavy`.

### 2.4 Criar Montage de Bloqueio

1. Crie nova Animation Montage → `AM_Sword_Block` (skeleton: `UE4_Mannequin_Skeleton`)
2. Arraste **`sword and shield block idle`** para o slot `DefaultSlot`.
3. Na timeline, clique com botão direito sobre a animação → **Looping** → marque **Loop**. Isso fará o personagem manter o bloqueio enquanto segurar o botão.

---

## 🔩 PASSO 3 — Criar Socket da Espada (hand_rWeapon)

O socket é o ponto de encaixe onde a espada será fixada na mão do personagem.

1. No Content Browser, vá para: `Content/Pirate/Demoscene_UE4/Mesh/`
2. Abra o **Skeletal Mesh** `UE4_Mannequin_Skeleton` (duplo clique no asset do esqueleto).
3. Na janela do **Skeleton Tree** (esquerda), localize o osso: `hand_r`
   > Dica: use a busca por "hand_r"
4. Clique com botão direito em `hand_r` → **Add Socket**
5. Nomeie o socket exatamente como: **`hand_rWeapon`**
6. Com o socket selecionado, no painel **Details**, ajuste a posição relativa:
   - **Location:** `(12, 5, 2)` — ajuste conforme necessário para que a espada fique na palma da mão
   - **Rotation:** `(0, 0, 90)` — eixo X apontando para **frente da palma**
   - **Scale:** `(1, 1, 1)`

> 🎯 **O eixo X positivo (seta vermelha) deve apontar para FRENTE.** A lâmina da espada deve estar alinhada com o eixo X.

7. Salve o esqueleto (`Ctrl+S`).

---

## 👤 PASSO 4 — Configurar BP_PPPirateCharacter

Agora vamos abrir o Blueprint do personagem e adicionar a espada e as referências de animação.

### 4.1 Abrir o Blueprint

1. No Content Browser, vá para: `Content/AdvancedLocomotionV4/Blueprints/CharacterLogic/`
2. Abra **`BP_PPPirateCharacter`** (duplo clique).

### 4.2 Adicionar o Componente da Espada (Static Mesh)

1. Na aba **Components** (esquerda superior), clique em **+ Add Component**.
2. Selecione **Static Mesh Component**.
3. Renomeie para **`SwordMesh`**.
4. Com `SwordMesh` selecionado, no painel **Details**:
   - **Static Mesh** → selecione `SM_Pirate_Sword` (ou `SM_Sword_01a`)
   - **Collision Presets** → `NoCollision` (a detecção de dano será por Line Trace, não colisão)
5. Ainda com `SwordMesh` selecionado, clique com botão direito → **Attach** → digite o socket `hand_rWeapon`
   > Isso fará a espada seguir a mão automaticamente.

### 4.3 Criar Variáveis para Controle de Combate

Na aba **My Blueprint** (esquerda), adicione estas variáveis:

| Nome da Variável | Tipo | Valor Padrão | Categoria | Propósito |
|:---|:---|:---|:---|:---|
| `ComboIndex` | Integer | `0` | Combat | Controla o estágio atual do combo (0 = sem combo) |
| `bSaveAttack` | Boolean | `False` | Combat | Flag que indica se o próximo input deve avançar o combo |
| `bIsBlocking` | Boolean | `False` | Combat | Flag de bloqueio ativo |
| `bIsAttacking` | Boolean | `False` | Combat | Flag de ataque em andamento |
| `SwordVisible` | Boolean | `True` | Combat | Visibilidade da espada |

### 4.4 Expor Variáveis de Animação

Na aba **Details** do Blueprint (não dos componentes), crie estas variáveis com a tag `EditAnywhere`:

| Nome da Variável | Tipo | Propósito |
|:---|:---|:---|
| `AttackMontage` | `Anim Montage` (Object Reference) | Referência à `AM_Sword_Attack` |
| `HeavyAttackMontage` | `Anim Montage` (Object Reference) | Referência à `AM_Sword_HeavyAttack` |
| `BlockMontage` | `Anim Montage` (Object Reference) | Referência à `AM_Sword_Block` |

> 💡 **Por que Object Reference?** Para que você possa selecionar estes assets diretamente no painel Details do Blueprint, sem hardcodar caminhos.

### 4.5 Atribuir as Referências no Painel Details

1. **Compile** o Blueprint primeiro (botão **Compile** na toolbar).
2. No painel **Details** (com o Blueprint selecionado), role até a seção **Combat**:
   - `Attack Montage` → selecione `AM_Sword_Attack`
   - `Heavy Attack Montage` → selecione `AM_Sword_HeavyAttack`
   - `Block Montage` → selecione `AM_Sword_Block`

### 4.6 Verificar Input Actions (Já Configuradas)

No painel **Details**, seção **Input**, confira que estão atribuídos:
- **Move Action** → `IA_Move`
- **Look Action** → `IA_Look`
- **Jump Action** → `IA_Jump`
- **Sprint Action** → `IA_Sprint`

As ações `IA_Attack`, `IA_HeavyAttack` e `IA_Block` serão vinculadas no Event Graph (Passo 5).

### 4.7 Definir como Default Pawn no GameMode

1. Abra **`ALS_GameMode_SP`** em `Content/AdvancedLocomotionV4/Blueprints/GameModes/`
2. No painel **Details**:
   - **Default Pawn Class** → selecione `BP_PPPirateCharacter`
3. Salve.

---

## 🧠 PASSO 5 — Programar Lógica de Ataque no Event Graph

Agora a parte mais importante: conectar os inputs às animações e à lógica de combate.

### 5.1 Configurar Visibility da Espada no BeginPlay

No Event Graph do `BP_PPPirateCharacter`:

```
[Event BeginPlay] ──► [Set Visibility (SwordMesh)]
                           ├── New Visibility: [GET SwordVisible]
                           └── Propagate to Children: ✅
```

### 5.2 Lógica de Ataque Leve (Combo)

Adicione os nós de **Input Action** (já existem como assets, precisamos referenciá-los no grafo):

```
[IA_Attack (Started)] ──► [Branch]
                              ├── Condition: [NOT bIsAttacking]
                              │
                              ├── True:
                              │   ┌─────────────────────────────────────────────────┐
                              │   │ [Branch]                                        │
                              │   │   ├── Condition: [ComboIndex == 0]              │
                              │   │   ├── True: Play Attack1                        │
                              │   │   │   [Play Montage]                            │
                              │   │   │     ├── Montage: AttackMontage              │
                              │   │   │     ├── Section Name: "Attack1"             │
                              │   │   │     └── ► [Set ComboIndex = 1]             │
                              │   │   │        ► [Set bIsAttacking = True]          │
                              │   │   └── False:                                    │
                              │   │       [Branch]                                  │
                              │   │         ├── Condition: bSaveAttack              │
                              │   │         ├── True:                               │
                              │   │         │   [Montage Jump to Section]           │
                              │   │         │     ├── Section Name: "Attack2/3/4"   │
                              │   │         │     └── ► [Set bSaveAttack = False]   │
                              │   │         │        ► [Increment ComboIndex]       │
                              │   │         └── False: (ignora input)               │
                              │   └─────────────────────────────────────────────────┘
                              │
                              └── False: (ignora - já atacando)
```

**Implementação Detalhada no Blueprint:**

1. **Adicionar Input Action IA_Attack:**
   - Clique com botão direito no grafo → pesquise por `IA_Attack`
   - Selecione o nó **Input Action IA_Attack** (evento Started)

2. **Verificar se não está atacando:**
   - Do pino `Pressed`, arraste um fio → **Branch**
   - Condition: arraste a variável `bIsAttacking` → **NOT Boolean** → conecte ao Condition

3. **Ramo True — Primeiro Ataque ou Combo:**
   - Conecte outro **Branch**
   - Condition: `ComboIndex == 0` (arraste `ComboIndex` + nó `Integer == Integer`)
   - **True** (Primeiro ataque):
     - Nó **Play Montage**
       - Montage to Play: `AttackMontage`
       - In Starting Section: `"Attack1"` (digite manualmente)
     - Conecte o pino de execução a **Set ComboIndex** = `1`
     - Conecte a **Set bIsAttacking** = `True` (marcado ✅)
   - **False** (Combo em andamento):
     - Outro **Branch** com Condition: `bSaveAttack`
     - **True**: Use **Montage Jump to Section** (nó específico para montages)
       - Section Name: use um **Select** node baseado em `ComboIndex`:
         - Se `ComboIndex == 1` → `"Attack2"` e set `ComboIndex = 2`
         - Se `ComboIndex == 2` → `"Attack3"` e set `ComboIndex = 3`
         - Se `ComboIndex == 3` → `"Attack4"` e set `ComboIndex = 0` (reseta)
     - Set `bSaveAttack = False`

### 5.3 Lógica de Ataque Pesado

```
[IA_HeavyAttack (Started)] ──► [Branch]
                                  ├── Condition: [NOT bIsAttacking]
                                  ├── True:
                                  │   [Play Montage]
                                  │     ├── Montage: HeavyAttackMontage
                                  │     ├── Section Name: "Heavy"
                                  │     └── ► [Set bIsAttacking = True]
                                  │        ► [Set ComboIndex = 0]
                                  └── False: (ignora)
```

### 5.4 Lógica de Bloqueio (Segurado)

```
[IA_Block (Started)] ──► [Play Montage]
                            ├── Montage: BlockMontage
                            └── ► [Set bIsBlocking = True]

[IA_Block (Completed)] ──► [Stop Montage]
                              ├── Montage: BlockMontage
                              └── ► [Set bIsBlocking = False]
```

### 5.5 Reseta o Estado de Ataque (On Montage Ended/Blend Out)

É **essencial** resetar as flags quando a animação terminar:

1. Encontre o pino de saída **On Completed** (ou **On Blend Out**) do nó `Play Montage` de ataque.
2. Conecte a:
   ```
   [On Completed] ──► [Set bIsAttacking = False]
                 └──► [Set ComboIndex = 0]
                 └──► [Set bSaveAttack = False]
   ```

### 5.6 Sistema de Combo: AnimNotify "SaveAttack"

Para que o combo funcione, você precisa adicionar uma **AnimNotify** nas montages de ataque.

1. Abra `AM_Sword_Attack`.
2. Na timeline, clique com botão direito **próximo do final de cada seção de ataque** (onde o jogador pode "enfileirar" o próximo golpe).
3. Selecione **Add Notify** → **New Notify** → crie um **AnimNotify** chamado `AnimNotify_SaveAttack`.
4. Abra o Blueprint do `AnimNotify_SaveAttack`:
   - No Event Graph, implemente:
   ```
   [Event Received_Notify] ──► [Get Owning Actor] ──► [Cast to BP_PPPirateCharacter]
                                                           └──► [Set bSaveAttack = True]
   ```
5. Retorne `True` no pino Return Value.
6. Compile e salve o AnimNotify.
7. Posicione este notify no final de cada seção (`Attack1`, `Attack2`, `Attack3`) da montage.

---

## 🎭 PASSO 6 — Configurar Animation Blueprint

O projeto usa o **ALS_AnimBP** (sistema avançado de locomoção). Precisamos integrar as animações de espada a ele.

### 6.1 Abordagem Recomendada: Slot de Animação

O ALSv4 já tem slots para ações. Vamos usar o slot de Upper Body para tocar as animações de espada nos braços sem interromper as pernas.

1. Abra `ALS_AnimBP` em `/Game/AdvancedLocomotionV4/CharacterAssets/MannequinSkeleton/`
2. Vá para o **AnimGraph**.
3. Localize o nó final de output (provavelmente um **Layered blend per bone** ou **Slot** node).
4. Adicione um novo **Slot 'DefaultSlot'** node antes do output:
   - Clique com botão direito → **Slot 'DefaultSlot'**
   - A montage `AM_Sword_Attack` já usa `DefaultSlot`, então será mixada automaticamente.

### 6.2 Alternativa Simplificada (Recomendada para Iniciantes)

Se o ALS_AnimBP for muito complexo para mexer agora:

1. Crie um **novo Animation Blueprint** chamado `AnimBP_Pirate_Sword`:
   - Skeleton: `UE4_Mannequin_Skeleton`
2. No **Event Graph**, crie um nó **Event Blueprint Update Animation**:
   - Obtenha o **Owning Pawn** → **Cast to BP_PPPirateCharacter**
   - Leia as variáveis `bIsAttacking`, `bIsBlocking`
3. No **AnimGraph**, use um **Blend Poses by bool** para alternar entre:
   - **True:** Pose de ataque/bloqueio (usando Slot node)
   - **False:** Pose base do pirata (referência ao ALS_AnimBP via Linked Anim Graph ou Copy Pose)

> ⚠️ Esta é uma simplificação. O ideal é integrar diretamente no ALS_AnimBP, mas isso exige conhecimento avançado do ALSv4.

---

## ✅ PASSO 7 — Testar e Ajustar

### 7.1 Checklist de Teste

- [ ] Todos os Blueprints compilam sem erros (✅ verde no botão Compile)
- [ ] `BP_PPPirateCharacter` está como Default Pawn Class no `ALS_GameMode_SP`
- [ ] A espada (`SwordMesh`) está visível no personagem ao dar Play
- [ ] Botão esquerdo do mouse executa ataque leve (Montage toca)
- [ ] Clicar repetidamente executa o combo (Attack1 → Attack2 → Attack3)
- [ ] Botão direito executa ataque pesado
- [ ] Segurar botão direito mantém bloqueio (animação em loop)
- [ ] Soltar bloqueio retorna ao idle
- [ ] A espada acompanha a mão durante as animações

### 7.2 Troubleshooting

| Problema | Causa Provável | Solução |
|:---|:---|:---|
| Espada não aparece | `SwordVisible = False` ou Static Mesh não atribuído | Verifique no Details do BP |
| Espada no chão / posição errada | Socket `hand_rWeapon` mal posicionado | Reajuste o socket no Skeleton |
| Animação não toca | Montage não foi atribuída nas variáveis | Verifique o painel Details → Combat |
| Input não funciona | IA_Attack não está no IMC_Default | Abra IMC_Default e adicione IA_Attack, IA_HeavyAttack, IA_Block com teclas (Mouse Left, Mouse Right) |
| Combo não avança | `AnimNotify_SaveAttack` não dispara | Verifique o posicionamento do notify na montage |
| Erro "Accessed None" | Referência nula no Cast | Verifique se o Cast to BP_PPPirateCharacter está recebendo o Owning Actor correto |
| Corpo inteiro congela no ataque | Montage em slot errado | Use slot `DefaultSlot` para que pernas continuem se movendo |

### 7.3 Adicionar os Mappings no IMC_Default

Se os inputs de ataque ainda não estiverem mapeados:

1. Abra `IMC_Default` em `/Game/Necropolis/Demo/Character/Input/IMC_Default`
2. Adicione novos mappings:
   - **IA_Attack** → Tecla: `Left Mouse Button`
   - **IA_HeavyAttack** → Tecla: `Right Mouse Button` (Trigger: `Pressed`)
   - **IA_Block** → Tecla: `Right Mouse Button` (Trigger: `Pressed` + `Released`)

---

## 🏃 Próximos Passos (Depois que o Básico Funcionar)

1. **Sistema de Dano com Line Trace:**
   - Crie um `AnimNotifyState` que ativa um Line Trace da base à ponta da espada durante o arco do golpe.
   - Ao detectar um inimigo, aplique dano com `Apply Damage`.

2. **Sistema de Parry (Aparo):**
   - Se bloquear exatamente 0.2s antes de receber um golpe, execute um parry que empurra o inimigo.

3. **Sacar/Guardar Espada:**
   - Use as animações `draw sword 1` e `sheath sword 1` + uma tecla dedicada (ex: `1` ou `Tab`).

4. **Escudo:**
   - Adicione um Static Mesh do escudo na mão esquerda (`hand_lShield`) para complementar.

5. **Locomoção com Espada:**
   - Integre `sword and shield run` e `sword and shield strafe` como animações de movimento quando a espada estiver equipada.

6. **VFX/SFX de Impacto:**
   - Adicione partículas de faísca metálica e som de corte ao acertar inimigos.

---

## 📚 Referências Rápidas

| Recurso | Caminho |
|:---|:---|
| Projeto no Disco | `G:\PROJETO_UNREAL_5-Neri_Verso\Criando um jogo de Pirata Nivel Intermediario\TheLostPirate\` |
| Animações FBX (importadas) | `Content/Pirate/Animations/Sword/` |
| Personagem BP | `/Game/AdvancedLocomotionV4/Blueprints/CharacterLogic/BP_PPPirateCharacter` |
| Animation Montages (a criar) | `Content/Pirate/Animations/Montages/` |
| Guia de Combate Corpo a Corpo | `Docs_ProjetoGTA_Estudo/04_TopicosFuturos/Adicionar_Sistema_Combate_Corpo_a_Corpo.md` |
| Glossário de Nós | `Docs_ProjetoGTA_Estudo/05_GlossarioBlueprint/Nos_Comuns_Explicados.md` |

---

*Tutorial criado com base na inspeção em tempo real do projeto via Remote Control API (porta 30010).*
