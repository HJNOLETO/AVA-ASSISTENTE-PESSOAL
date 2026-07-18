# REGRAS DE ASSISTÊNCIA PREDITIVA — AVA Proativo (Fase 7)
# 
# Quando o usuário criar/modificar algo, o AVA DEVE sugerir proativamente
# as dependências relacionadas. Baseado nos padrões arquiteturais do ProjetoGTA.

## Sistema de Armas
trigger: criar|modificar BP de arma|spawnar arma|create_bp.*weapon|BP_WeaponBase|WeaponFire
suggest:
  - "**HUD de munição**: Atualizar UMG_HUD para exibir CurrentAmmoInMag / MaxAmmo"
  - "**VFX de disparo**: Adicionar ParticleSystem MuzzleFlash de BallisticsVFX/"
  - "**Som de tiro**: Configurar AudioComponent com aksound_Cue ou m4sound_Cue de Sounds/Weapons/"
  - "**Decal de impacto**: Usar Decals_* de BallisticsVFX/Decals/ no LineTrace"
  - "**Pickup de arma**: Criar BP_{WeaponName}_Pickup para spawnar no chão"
  - "**Projétil**: Criar BP_{WeaponName}_Projectile com ProjectileMovement"

## Sistema de Portas / Interação
trigger: criar|modificar porta|interação|BP_Door|BP_InteractionObject|Interact
suggest:
  - "**Som de porta**: Adicionar AudioComponent para abrir/fechar"
  - "**Animação**: Criar Timeline para rotação suave (Lerp 0° → 90°)"
  - "**HUD de prompt**: 'Pressione E para interagir' no UMG_HUD"
  - "**Colisão**: Ajustar BoxCollision/SphereCollision para alcance de interação"
  - "**Trava**: Variável IsLocked (bool) + lógica de chave"

## Sistema de Vida / Dano
trigger: criar|modificar vida|dano|health|damage|AC_PlayerStatus|Death|ReceiveAnyDamage
suggest:
  - "**HUD de vida**: UMG_HUD precisa de barra de Health + Armour"
  - "**Efeito de dano**: CameraShake (Damge_CS em Blueprints/CameraEffects/) + vignette vermelha"
  - "**Sistema de morte**: Evento Death → Ragdoll + Respawn após delay"
  - "**Colete/Escudo**: Variável Armour + lógica de absorção (80% colete, 20% vida)"
  - "**Regeneração**: Timer para recuperar vida/colete após X segundos sem dano"

## Sistema de HUD / UI
trigger: criar|modificar HUD|UMG|widget|UI|interface|menu
suggest:
  - "**Crosshair**: WBCrosshair precisa refletir WeaponSpread atual"
  - "**Inventário**: UMG_Inventory + UMG_Slot para mostrar armas/itens"
  - "**Mini-mapa**: Se houver navegação, adicionar minimapa"
  - "**Menu radial**: UMG_RadialMenu para troca rápida de armas"
  - "**Indicador de dano**: Widget directional damage indicator"

## Sistema de Personagem
trigger: criar|modificar personagem|character|BP_Character|movimento|movement
suggest:
  - "**Jetpack**: BP_Jetpack já existe — conectar ao input de pulo duplo"
  - "**Câmera**: SpringArm + CameraComponent com lag suave"
  - "**Animação**: Conectar ALS_Player ao AnimBP_Character"
  - "**Input**: Verificar EnhancedInput Actions (IA_Jump, IA_Sprint, etc.)"
  - "**Sistema de armas**: GetChar_WeaponSystem para equipar/alternar armas"

## Sistema de Veículos
trigger: criar|modificar veículo|vehicle|carro|moto|BP_Bike|BP_Vehicle
suggest:
  - "**Física**: Ajustar massa, suspensão, torque do WheeledVehiclePawn"
  - "**Câmera**: SpringArm + Camera para terceira pessoa do veículo"
  - "**Som**: Motor loop audio component baseado na velocidade"
  - "**Entrada/Saída**: Evento para entrar/sair do veículo (possess/unpossess)"

## Criação de Blueprint Genérico
trigger: criar BP|create_bp|create_blueprint|novo blueprint
suggest:
  - "**Compilar após criar**: Sempre chame compile_bp após adicionar componentes/vars"
  - "**Verificar template**: Checar se existe template em unreal_engine_docs/Templates/"
  - "**Usar assets existentes**: Consultar [CATALOGO DE ASSETS] para meshes/materiais/sons"
  - "**Padrão arquitetural**: Verificar se este BP pertence a um sistema cross-BP"
  - "**Testar no level**: Spawnar o BP no level para verificar visualmente"

## Build / Performance
trigger: compilar|cook|build|buildar|performance|otimizar
suggest:
  - "**Compilar todos os BPs**: Chamar compile_bp em cada BP modificado"
  - "**Verificar referências quebradas**: BP_AVA_Test e BP_AVA_Validate foram movidos"
  - "**Limpar BPs de teste**: Rodar cleanup_tests.py para remover artefatos"
