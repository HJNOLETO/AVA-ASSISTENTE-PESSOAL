## Entenda o que estamos fazendo: C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\CRIADO-AVA-CLI\unreal_engine_docs\Resumo_Progresso_Atual.md



# 🗺️ Mapeamento de Assets & Roteiro de Documentação do Projeto

**[Compatibilidade: UE 5.1+]**  
**[Status do Repositório: Indexação RAG Ativa]**

Este documento serve como a **tabela mestre de mapeamento** dos assets originais do Unreal Engine (arquivos `.uasset` localizados no diretório do projeto) com as suas respectivas extrações brutas de metadados (`Blueprints_Exportados/`) e os guias técnicos formalizados (`Docs_ProjetoGTA_Estudo/`).

Esta estrutura organizada permite que sistemas de RAG indexem de forma sólida e semântica a relação entre a lógica física dos arquivos no motor e a documentação textual pedagógica.

---

## 🔫 1. Subsistema de Armas e Combate (Weapons & Shooting)

Este subsistema gerencia o inventário de armas equipadas no personagem, o ciclo de disparo (Line Trace ou projéteis físicos), recarga, efeitos visuais/sonoros no cano da arma, e comunicação por interfaces.

| Asset do Unreal Engine (.uasset) | Caminho no Projeto UE | Metadados Brutos (T3D) | Guia Formalizado / Estudo | Status | Objetivos Analíticos Chave |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AC_WeaponSystem** | `Content/Blueprints/Weapons/AC_WeaponSystem.uasset` | [AC_WeaponSystem.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/AC_WeaponSystem.md) | [Blueprints-AC_WeaponSystem.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-AC_WeaponSystem.md) | 🟢 Mapeado | Gerenciamento de slots, spawn inicial, troca de armas (cycling), drop físico de arma, e integração com o menu de seleção radial. |
| **BP_WeaponBase** | `Content/Blueprints/Weapons/BP_WeaponBase.uasset` | [BP_WeaponBase.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/BP_WeaponBase.md) | [BP_WeaponBase.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/BP_WeaponBase.md) | 🟢 Mapeado | Lógica mestre de herança, validação de munição no pente, cadência de disparo, recarga e herança pelos filhos (`BP_Pistol`, `BP_Shotgun`, etc.). |
| **BP_WeaponInterface** | `Content/Blueprints/Weapons/BP_WeaponInterface.uasset` | [BP_WeaponInterface.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/BP_WeaponInterface.md) | Incluído em [Sistema_Armas.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/03_Sistemas/Sistema_Armas.md) | 🟢 Mapeado | Comunicação desacoplada e polimórfica para disparar e recarregar qualquer arma equipada no jogador. |
| **BP_PhysicalMag** | `Content/Blueprints/Weapons/BP_PhysicalMag.uasset` | [BP_PhysicalMag.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/BP_PhysicalMag.md) | [Blueprints-BP_PhysicalMag.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_PhysicalMag.md) | 🟢 Mapeado | Simulação física de colisão, gravidade, impulso linear e destruição programada por timer de carregadores ejetados. |




| **BP_CustomMovementComponent** | `Content/CustomMovement/Blueprints/Components/BP_CustomMovementComponent.uasset` | [BP_CustomMovementComponent/](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/BP_CustomMovementComponent) | [Blueprints-BP_CustomMovementComponent.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_CustomMovementComponent.md) | 🟢 Mapeado | Varredura de colisão, transições suaves (Lerp), e injeção de inputs de movimento para escadas (Ladders) e escalada de apoios (Climbing). |



| **BP_ProjectileBase** | `Content/Blueprints/Weapons/BP_ProjectileBase.uasset` | [BP_ProjectileBase.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/BP_ProjectileBase.md) | [Blueprints-BP_ProjectileSystem.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_ProjectileSystem.md) | 🟢 Mapeado | Ator de projétil base contendo física de movimento, ricochete, dano e emissores de partículas e decalques de impacto. |
| **Projectile_Rifle** | `Content/Blueprints/Weapons/Projectile_Rifle.uasset` | [Projectile_Rifle.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/Projectile_Rifle.md) | [Blueprints-BP_ProjectileSystem.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_ProjectileSystem.md) | 🟢 Mapeado | Subclasse de projétil específica do rifle herdada de BP_ProjectileBase. |
| **BP_AmmoBase** | `Content/Blueprints/Weapons/BP_AmmoBase.uasset` | [BP_AmmoBase.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/BP_AmmoBase.md) | [Blueprints-BP_ProjectileSystem.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_ProjectileSystem.md) | 🟢 Mapeado | Drop físico de munição coletado imediatamente pelo jogador ao colidir (overlap). |

---

## 🚪 2. Subsistema de Interação com o Mundo (World Interaction)

Gerencia a detecção de objetos interativos no cenário (portas, caixas de loot, munição, poções) através de varreduras do olhar do jogador, executando ações específicas.

| Asset do Unreal Engine (.uasset) | Caminho no Projeto UE | Metadados Brutos (T3D) | Guia Formalizado / Estudo | Status | Objetivos Analíticos Chave |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AC_Interaction** | `Content/Blueprints/Interaction/AC_Interaction.uasset` | [AC_Interaction.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Interaction/AC_Interaction.md) | [Blueprints-AC_Interaction.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-AC_Interaction.md) | 🟢 Mapeado | Trace de colisão, filtragem de canais e execução de interfaces de interação para objetos e itens. |
| **BP_InteractionObject** | `Content/Blueprints/Interaction/BP_InteractionObject.uasset` | [BP_InteractionObject.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Interaction/BP_InteractionObject.md) | [Blueprints-BP_Interaction_System.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Interaction_System.md) | 🟢 Mapeado | Ator mestre que serve de base para qualquer objeto coletável ou manipulável do cenário. |
| **BP_PickupObject** | `Content/Blueprints/Interaction/BP_PickupObject.uasset` | [BP_PickupObject.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Interaction/BP_PickupObject.md) | [Blueprints-BP_Interaction_System.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Interaction_System.md) | 🟢 Mapeado | Classe intermediária para coleta física de itens que envia dados ao `AC_WeaponSystem`. |
| **BP_Door** | `Content/Blueprints/Interaction/BP_Door.uasset` | [BP_Door.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Interaction/BP_Door.md) | [Blueprints-BP_Interaction_System.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Interaction_System.md) | 🟢 Mapeado | Controle de rotação com Timeline/Lerp e verificação de chaves no inventário com som multicast. |
| **BP_AmmoBox** | `Content/Blueprints/Interaction/BP_AmmoBox.uasset` | [BP_AmmoBox.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Interaction/BP_AmmoBox.md) | [Blueprints-BP_Interaction_System.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Interaction_System.md) | 🟢 Mapeado | Detecção de colisão do jogador e adição de cartuchos específicos por classe da arma. |
| **BP_Health** | `Content/Blueprints/Interaction/BP_Health.uasset` | [BP_Health.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Interaction/BP_Health.md) | [Blueprints-BP_Interaction_System.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Interaction_System.md) | 🟢 Mapeado | Consumo imediato para recuperação de vida através do componente `AC_PlayerStatus`. |
| **BP_Armour** | `Content/Blueprints/Interaction/BP_Armour.uasset` | [BP_Armour.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Interaction/BP_Armour.md) | [Blueprints-BP_Interaction_System.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Interaction_System.md) | 🟢 Mapeado | Consumo imediato para recuperação de colete/escudo através do componente `AC_PlayerStatus`. |

---

## 🏃 3. Mecânicas Principais do Personagem (Character)

Controla o movimento avançado, a integração de animações complexas da biblioteca ALSv4 (Advanced Locomotion System) e o fluxo dos componentes vitais e de combate.

| Asset do Unreal Engine (.uasset) | Caminho no Projeto UE | Metadados Brutos (T3D) | Guia Formalizado / Estudo | Status | Objetivos Analíticos Chave |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BP_Character** | `Content/Blueprints/Character/BP_Character.uasset` | [BP_Character.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Character/BP_Character.md) | [BP_Character.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/BP_Character.md) | 🟢 Mapeado | Conexão do modelo 3D visual e do Blueprint de animações com as variáveis herdadas da classe C++ `APPPirateCharacter`. |
| **AC_PlayerStatus** | `Content/Blueprints/Components/AC_PlayerStatus.uasset` | [AC_PlayerStatus.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/AC_PlayerStatus.md) | [Blueprints-AC_PlayerStatus.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-AC_PlayerStatus.md) e [AC_PlayerStatus.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/AC_PlayerStatus.md) | 🟢 Mapeado | Gerenciamento de Vida (Health), Colete (Armour), Estamina e restrições rígidas via nós de `Clamp`. |

---

## 🖥️ 4. Interface do Usuário & Controle (UI / HUD / Controller)

Mapeia a criação dinâmica de Widgets na tela (HUD) e a resposta a inputs de mouse e teclado para interação com menus e inventário.

| Asset do Unreal Engine (.uasset) | Caminho no Projeto UE | Metadados Brutos (T3D) | Guia Formalizado / Estudo | Status | Objetivos Analíticos Chave |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PC_ProjetoGTA** | `Content/Blueprints/Player/PC_ProjetoGTA.uasset` | [PC_ProjetoGTA.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/PC_ProjetoGTA.md) | [Blueprints-PC_ProjetoGTA.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-PC_ProjetoGTA.md) | 🟢 Mapeado | Ciclo de vida da HUD (`AddToViewport`), controle do mouse e exibição dinâmica da tela de morte. |
| **W_Main** | `Content/Blueprints/UMG/W_Main.uasset` | [w_main.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Widget-HUD/UI/w_main.md) | [Blueprints-UMG_HUD.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-UMG_HUD.md) | 🟢 Mapeado | Interface gráfica principal contendo a barra de vida, colete, munição ativa e reserva do jogador. |
| **UMG_Inventory** | `Content/Blueprints/UMG/RadialMenu/UMG_Inventory.uasset` | [UMG_Inventory.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Widget-HUD/RadialMenu/UMG_Inventory.md) | [Blueprints-UMG_HUD.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-UMG_HUD.md) | 🟢 Mapeado | Grade gráfica de inventário radial conectada à lógica de slots do `AC_WeaponSystem`. |
| **UMG_RadialMenu** | `Content/Blueprints/UMG/RadialMenu/UMG_RadialMenu.uasset` | [UMG_RadialMenu.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Widget-HUD/RadialMenu/UMG_RadialMenu.md) | [Blueprints-UMG_HUD.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-UMG_HUD.md) | 🟢 Mapeado | Roda física de seleção de armas contendo 8 slots radiais vinculados. |
| **UMG_Slot** | `Content/Blueprints/UMG/RadialMenu/UMG_Slot.uasset` | [UMG_Slot.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Widget-HUD/RadialMenu/UMG_Slot.md) | [Blueprints-UMG_HUD.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-UMG_HUD.md) | 🟢 Mapeado | Slot individual do menu radial exibindo ícone e munição da arma. |
| **W_PickupItem** | `Content/Blueprints/UMG/W_PickupItem.uasset` | [W_PickupItem.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Widget-HUD/UI/W_PickupItem.md) | [Blueprints-UMG_HUD.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-UMG_HUD.md) | 🟢 Mapeado | Pop-up de interação na tela para coleta de armas do chão. |
| **WBCrosshair** | `Content/Blueprints/UMG/WBCrosshair.uasset` | [WBCrosshair.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Widget-HUD/UI/WBCrosshair.md) | [Blueprints-UMG_HUD.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-UMG_HUD.md) | 🟢 Mapeado | Retícula dinâmica de mira com bordas expansíveis (top, bottom, left, right). |
| **W_CustomCharacter** | `Content/Blueprints/UMG/W_CustomCharacter.uasset` | [W_CustomCharacter.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Widget-HUD/UI/W_CustomCharacter.md) | [Blueprints-UMG_HUD.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-UMG_HUD.md) | 🟢 Mapeado | Menu de customização visual do personagem com setas de navegação. |

---

## ✈️ 5. Atores Especiais de Gameplay (Gameplay & Special Actors)

Este grupo gerencia mecânicas específicas de gameplay não enquadradas em outros subsistemas, como o voo e propulsão com o Jetpack e o ciclo de iluminação solar ao longo do dia e da noite.

| Asset do Unreal Engine (.uasset) | Caminho no Projeto UE | Metadados Brutos (T3D) | Guia Formalizado / Estudo | Status | Objetivos Analíticos Chave |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BP_Jetpack** | `Content/Blueprints/Actors/Jetpack/BP_Jetpack.uasset` | [BP_Jetpack.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Actors/Jetpack/BP_Jetpack.md) | [Blueprints-BP_Jetpack.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Jetpack.md) | 🟢 Mapeado | Sistema de acoplamento esquelético a sockets do personagem, desativação de gravidade (escala de gravidade zerada no CharacterMovementComponent) e rotação dinâmica de tubeiras físicas por interpolação suave. |
| **BP_TimeOfDay** | `Content/Blueprints/Actors/Functions/BP_TimeOfDay.uasset` | [BP_TimeOfDay.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Actors/Functions/BP_TimeOfDay.md) | [Blueprints-BP_Jetpack.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Jetpack.md) | 🟢 Mapeado | Atualização da rotação do sol baseada em intervalos de tempo mapeados, servindo como ponte para iluminação dinâmica. |

---

## 🏍️ 6. Subsistema de Veículos Físicos (Physical Vehicles)

Este grupo gerencia os veículos físicos disponíveis para o jogador no mundo tridimensional, englobando bicicletas e motocicletas com mecânicas de movimento, inclinação de curvas e física ativa de empinar ou pular.

| Asset do Unreal Engine (.uasset) | Caminho no Projeto UE | Metadados Brutos (T3D) | Guia Formalizado / Estudo | Status | Objetivos Analíticos Chave |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BP_Bike** | `Content/Blueprints/Vehicles/BMX/BP_Bike.uasset` | [BP_Bike.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Vehicles/BMX/BP_Bike.md) | [Blueprints-BP_Vehicles.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Vehicles.md) | 🟢 Mapeado | Bicicleta física herdada de `WheeledVehiclePawn`, contendo rotação de guidão interpolada, rotação dinâmica de pedais por velocidade frontal e pular por impulso físico. |
| **AnimBP_Bike** | `Content/Blueprints/Vehicles/BMX/AnimBP_Bike.uasset` | [AnimBP_Bike.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Vehicles/BMX/AnimBP_Bike.md) | [Blueprints-BP_Vehicles.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Vehicles.md) | 🟢 Mapeado | Blueprint de animação para as rodas e pedais da bicicleta baseado na velocidade física. |
| **BP_Motorcycle** | `Content/Blueprints/Vehicles/Motorcycle/BP_Motorcycle.uasset` | [BP_Motorcycle.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Vehicles/Motorcycle/BP_Motorcycle.md) | [Blueprints-BP_Vehicles.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Vehicles.md) | 🟢 Mapeado | Motocicleta física com sistema para empinar aplicando torque no eixo lateral e alteração do centro de massa dinâmico para rebaixamento e equilíbrio. |
| **AnimBP_Motorcycle** | `Content/Blueprints/Vehicles/Motorcycle/AnimBP_Motorcycle.uasset` | [AnimBP_Motorcycle.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Vehicles/Motorcycle/AnimBP_Motorcycle.md) | [Blueprints-BP_Vehicles.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Vehicles.md) | 🟢 Mapeado | Blueprint de animation para rotação e suspensão das rodas da motocicleta baseado em física. |

---

## 👤 7. Subsistema de Customização de Personagem (Character Customization)

Gerencia a exibição e seleção de opções estéticas do jogador em um cenário e HUD dedicados.

| Asset do Unreal Engine (.uasset) | Caminho no Projeto UE | Metadados Brutos (T3D) | Guia Formalizado / Estudo | Status | Objetivos Analíticos Chave |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BP_CharacterViewer** | `Content/Blueprints/Character/BP_CharacterViewer.uasset` | [BP_CharacterViewer.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Character/BP_CharacterViewer.md) | [Blueprints-BP_Customization.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Customization.md) | 🟢 Mapeado | Personagem de visualização contendo Enhanced Input para rotacionar a malha esquelética com cliques e arraste do mouse, e criação inicial do menu de UI. |
| **MenuCustom_GM** | `Content/Blueprints/Character/MenuCustom_GM.uasset` | [MenuCustom_GM.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Character/MenuCustom_GM.md) | [Blueprints-BP_Customization.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Customization.md) | 🟢 Mapeado | GameMode específico para o cenário de customização, definindo classes iniciais de HUD e controlador. |
| **W_CustomCharacter** | `Content/Blueprints/UMG/W_CustomCharacter.uasset` | [W_CustomCharacter.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Widget-HUD/UI/W_CustomCharacter.md) | [Blueprints-BP_Customization.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Customization.md) | 🟢 Mapeado | Widget visual com setas direcionais e painel gráfico para customização de cores/aparência do pirata. |

---

## 🛠️ 8. Utilitários Gerais & Comunicação (Gameplay Utilities)

Grupo de assets, interfaces e funções de uso geral para transições, detecções físicas e cálculos utilitários do projeto.

| Asset do Unreal Engine (.uasset) | Caminho no Projeto UE | Metadados Brutos (T3D) | Guia Formalizado / Estudo | Status | Objetivos Analíticos Chave |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BP_MissionMarker** | `Content/Blueprints/Interaction/BP_MissionMarker.uasset` | [BP_MissionMarker.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Interaction/BP_MissionMarker.md) | [Blueprints-BP_Utilities.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Utilities.md) | 🟢 Mapeado | Trigger de sobreposição (overlap) que executa transição por fade de câmera via CameraManager, oculta a HUD do jogador e destrói a si mesmo. |
| **BP_Functions** | `Content/Blueprints/BP_Functions.uasset` | [BP_Functions.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/BP_Functions.md) | [Blueprints-BP_Utilities.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Utilities.md) | 🟢 Mapeado | Biblioteca de funções estáticas reutilizáveis para centralização de cursor do mouse no Viewport, extração de material físico colidido e atalhos de componentes. |
| **Character_Interface** | `Content/Blueprints/Character/Character_Interface.uasset` | [Character_Interface.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Character_Interface.md) | [Blueprints-BP_Utilities.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Utilities.md) | 🟢 Mapeado | Interface de comunicação desacoplada para atualizar parâmetros vitais do jogador sem dependências circulares. |
| **Damge_CS** | `Content/Blueprints/CameraEffects/Damge_CS.uasset` | [Damge_CS.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/CameraEffects/Damge_CS.md) | [Blueprints-BP_Utilities.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Utilities.md) | 🟢 Mapeado | Classe de tremor de câmera configurada para efeitos de oscilação de impacto ao receber dano físico. |

---

## 📈 Roteiro de Formalização (Roadmap para RAG)

Para obtermos uma base de conhecimento RAG 100% robusta e rica sobre o projeto de Unreal Engine, devemos priorizar a conversão das extrações brutas mais complexas e importantes em guias formais de estudo.

### Próxima Ação Recomendada:
Devemos iniciar a formalização a partir do arquivo **`AC_WeaponSystem`**, pois ele atua como o cérebro coordenador entre as mecânicas do jogador (`BP_Character`), a arma equipada (`BP_WeaponBase`), o HUD (`W_Main`) e o Inventário (`UMG_Inventory`). 

Seu arquivo bruto [AC_WeaponSystem.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/AC_WeaponSystem.md) contém uma lista maciça de funções, loops de checagem e timers que merecem ser destrinchados pedagogicamente em um novo documento: **`Blueprints-AC_WeaponSystem.md`** na pasta `02_Blueprints`.

### Cronograma Sugerido de Formalização:
1. **[NEW] `Blueprints-AC_WeaponSystem.md`**: Detalhar funções de spawn de armas, desanexação, atualização do HUD e sincronização de timers.
2. **[Mapeado] `Blueprints-AC_Interaction.md`**: Detalhar a lógica de varredura do olhar (Line Trace por canal) e o ciclo de interfaces de interação do pirata.
3. **[NEW] `Blueprints-W_Main.md`**: Detalhar a conexão de propriedades dos Widgets (vida, munição) orientada a eventos para otimização de CPU.

