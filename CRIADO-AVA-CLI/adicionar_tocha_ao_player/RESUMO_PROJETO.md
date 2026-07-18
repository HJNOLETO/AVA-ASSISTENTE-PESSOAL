# Resumo da Análise do Projeto ProjetoGTA

## Projeto
- **Nome:** ProjetoGTA
- **Mapa aberto:** TestMap (`/Game/Maps/TestMap`)
- **Engine:** Unreal Engine 5 com Remote Control API ativa na porta 30010
- **Sistema base:** Advanced Locomotion System V4 (ALS V4)

## Personagem Player
- `BP_Character` em `/Game/Blueprints/BP_Character`
- `ALS_Player` em `/Game/AdvancedLocomotionV4/Blueprints/CharacterLogic/ALS_Player`
- Base: `ALS_Base_CharacterBP`
- Esqueleto: `ALS_Mannequin_Skeleton`

## Sistemas Existentes
- **Armas:** `AC_WeaponSystem`, `BP_WeaponBase`, Beretta, MP5, Remington, M4A1, M9
- **Veículos:** `BP_Motorcycle`
- **Interação:** `AC_Interaction`, `BP_InteractionObject`, `BP_PickupObject`
- **Munição:** `BP_AmmoBox`
- **Jetpack:** `BP_Jetpack` (já usa socket `JetpackPosition`)
- **Portas:** `BP_Door`
- **Missões:** `BP_MissionMarker`
- **NPCs:** `ALS_NPC` (usando ALS V4)

## Assets da Tocha
- **Mesh:** `/Game/AdvancedLocomotionV4/Props/Meshes/Torch` (StaticMesh, 3 slots de material)
- **Materiais:** `M_Prop_Torch1`, `M_Prop_Torch2`, `M_Prop_Torch3`
- **Efeito de Fogo:** `Blueprint_Effect_Fire` (Starter Content)

## Sockets no Esqueleto
WeaponHand, PistolSocket, WeaponBack, RifleBack, SMGSocket, MagSocket, JetpackPosition, Footstep_L, Footstep_R, TP_CameraTrace_L, TP_CameraTrace_R, FP_Camera
