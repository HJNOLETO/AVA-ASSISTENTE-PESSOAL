# Guia: Como Adicionar uma Tocha ao Player

## Projeto: ProjetoGTA (ALS V4)
## Mapa atual: TestMap

---

## Assets Disponíveis

| Tipo | Nome | Caminho Completo |
|------|------|-----------------|
| Static Mesh (tocha) | `Torch` | `/Game/AdvancedLocomotionV4/Props/Meshes/Torch` |
| Material 1 (cabo/base) | `M_Prop_Torch1` | `/Game/AdvancedLocomotionV4/Props/Materials/M_Prop_Torch1` |
| Material 2 (envoltura) | `M_Prop_Torch2` | `/Game/AdvancedLocomotionV4/Props/Materials/M_Prop_Torch2` |
| Material 3 (ponta/chama) | `M_Prop_Torch3` | `/Game/AdvancedLocomotionV4/Props/Materials/M_Prop_Torch3` |
| Efeito de Fogo | `Blueprint_Effect_Fire` | `/Game/StarterContent/Blueprints/Blueprint_Effect_Fire` |
| Efeito Fagulhas | `Blueprint_Effect_Sparks` | `/Game/StarterContent/Blueprints/Blueprint_Effect_Sparks` |

## Personagem Player

| Nome | Caminho |
|------|---------|
| ALS_Base_CharacterBP | `/Game/AdvancedLocomotionV4/Blueprints/CharacterLogic/ALS_Base_CharacterBP` |
| ALS_Player | `/Game/AdvancedLocomotionV4/Blueprints/CharacterLogic/ALS_Player` |
| **BP_Character (projeto)** | `/Game/Blueprints/BP_Character` |
| PC_ProjetoGTA | `/Game/Blueprints/PC_ProjetoGTA` |

## Sockets Disponíveis no Esqueleto ALS_Mannequin_Skeleton

| Socket | Uso |
|--------|-----|
| `WeaponHand` | Mão direita - para segurar itens/armas |
| `PistolSocket` | Posição de pistola (offset da mão) |
| `WeaponBack` | Costas - para armas nas costas |
| `RifleBack` | Costas - para rifles |
| `SMGSocket` | Posição de submetralhadora |
| `JetpackPosition` | Posição do jetpack (costas/coluna) |
| `MagSocket` | Posição de carregador |

**Socket recomendado para tocha:** `WeaponHand` (segurar na mão direita)

---

## Método 1: Criar Blueprint BP_Torch (Recomendado)

### Passo 1: Criar o Blueprint
1. No Content Browser, navegue até `/Game/Blueprints/`
2. Clique direito → **Blueprint Class**
3. Escolha `Actor` como classe pai
4. Nomeie como `BP_Torch`

### Passo 2: Adicionar Componentes no BP_Torch

Abra o BP_Torch e adicione os seguintes componentes:

#### 2a. StaticMeshComponent (a tocha)
- Adicione um **Static Mesh Component**
- Em Details → Static Mesh, escolha `Torch`
- Em Details → Materials, verifique:
  - Element 0 = `M_Prop_Torch1`
  - Element 1 = `M_Prop_Torch2`  
  - Element 2 = `M_Prop_Torch3`

#### 2b. PointLightComponent (iluminação)
- Adicione um **Point Light Component**
- No **Construction Script** (ou como filho do StaticMesh):
  - Intensity: 5000 cd
  - Light Color: laranja/amarelo (#FF9933)
  - Attenuation Radius: 800
  - Source Radius: 15
  - Cast Shadows: True
  - Posicione próximo à ponta da tocha (Z ≈ +30)

#### 2c. ParticleSystemComponent (efeito de fogo)
- Adicione um **Particle System Component** (ou Niagara)
- Template: `P_Fire` (do Starter Content) ou crie um novo
- Posicione na ponta da tocha (Z ≈ +32)
- Scale: (0.5, 0.5, 0.5)

### Passo 3: Adicionar Lógica de Ligar/Desligar

No **Event Graph** do BP_Torch:

```
Crie uma variável:
  - bIsLit (Boolean, default = false)
  - TorchLight (PointLightComponent reference)
  - TorchFlame (ParticleSystemComponent reference)

Event BeginPlay:
  → TorchLight.SetVisibility(false)
  → TorchFlame.SetVisibility(false)

Função ToggleTorch():
  → Branch (bIsLit)
    True → bIsLit = false → TorchLight.SetVisibility(false) → TorchFlame.SetVisibility(false)
    False → bIsLit = true  → TorchLight.SetVisibility(true)  → TorchFlame.SetVisibility(true)
```

---

## Método 2: Integrar com o Sistema de Armas Existente

O projeto já possui:
- `AC_WeaponSystem` (ActorComponent)
- `BP_WeaponBase` (classe base de arma)
- `BP_WeaponInterface` (interface)
- `E_WeaponType` (enum de tipos de arma)
- `WeaponSlots` (enum de slots)

### Passo 2.1: Adicionar novo tipo de arma
1. Abra `E_WeaponType` → Adicione `Torch`
2. Abra `WeaponList` DataTable → Adicione entrada para `BP_Torch`

### Passo 2.2: Fazer BP_Torch implementar BP_WeaponInterface
1. Abra BP_Torch → Class Settings → Implemented Interfaces → `BP_WeaponInterface`
2. Implemente as funções necessárias da interface

### Passo 2.3: Adicionar Input
1. Abra `IMC_Default` → Adicione novo Input Action
2. Crie `IA_Torch` (Input Action) → Mapeie para tecla "F" ou "L"
3. No `BP_Character` ou `AC_WeaponSystem`:
   - Adicione lógica para equipar/alternar BP_Torch

---

## Método 3: Via Script Python (Remote Control - para teste rápido)

Execute este comando via o AVA CLI para spawnar a tocha diretamente:

```python
# Spawnar BP_Torch no level e anexar ao player
import unreal

world = unreal.EditorLevelLibrary.get_editor_world()
torch_bp = unreal.EditorAssetLibrary.load_blueprint_class('/Game/Blueprints/BP_Torch')
spawn_loc = unreal.Vector(0, 0, 100)
torch_actor = unreal.EditorLevelLibrary.spawn_actor_from_class(torch_bp, spawn_loc)

pawn = unreal.GameplayStatics.get_player_pawn(world, 0)
if pawn:
    mesh = pawn.get_component_by_class(unreal.SkeletalMeshComponent)
    if mesh:
        torch_actor.k2_attach_to_component(mesh, 'WeaponHand', unreal.AttachmentRule.SNAP_TO_TARGET, unreal.AttachmentRule.SNAP_TO_TARGET, unreal.AttachmentRule.KEEP_RELATIVE, True)
```

Para spawnar APENAS a mesh da tocha (sem luz, só o modelo 3D):

```python
import unreal

world = unreal.EditorLevelLibrary.get_editor_world()
torch_mesh = unreal.EditorAssetLibrary.load_asset('/Game/AdvancedLocomotionV4/Props/Meshes/Torch')

pawn = unreal.GameplayStatics.get_player_pawn(world, 0)
if pawn:
    mesh = pawn.get_component_by_class(unreal.SkeletalMeshComponent)
    if mesh:
        sm_comp = pawn.add_component_by_class(unreal.StaticMeshComponent, False, unreal.Transform(), False)
        sm_comp.set_static_mesh(torch_mesh)
        sm_comp.k2_attach_to_component(mesh, 'WeaponHand', unreal.AttachmentRule.SNAP_TO_TARGET, unreal.AttachmentRule.SNAP_TO_TARGET, unreal.AttachmentRule.KEEP_RELATIVE, True)
```

---

## Checklist Final

- [ ] `BP_Torch` Blueprint criado com: StaticMesh, PointLight, ParticleSystem
- [ ] Lógica de toggle (ligar/desligar) implementada
- [ ] Input mapeado (tecla "F" ou "L")
- [ ] Torch spawnada e anexada ao socket `WeaponHand`
- [ ] Testado no mapa `TestMap`

---

## Observações

- A tocha tem dimensões de ~4cm x 4cm x 34cm (tamanho de mão)
- 3 materiais: cabo, corpo, e ponta (para a chama)
- O efeito de fogo pode usar `Blueprint_Effect_Fire` (já incluso no Starter Content)
- Sons de fogo disponíveis: `Fire01_Cue` e `Fire_Sparks01_Cue`
