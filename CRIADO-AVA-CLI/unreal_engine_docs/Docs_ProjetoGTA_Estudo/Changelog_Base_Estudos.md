# 📅 Diário de Bordo & Evolução do Projeto GTA

Este documento serve como o registro histórico de modificações de mecânicas, exploits identificados, revisões de arquitetura e correções aplicadas no código (C++ e Blueprints). Ele garante a rastreabilidade e o versionamento conceitual para estudo continuado do desenvolvedor.

---

## 🏷️ [v2.1.0] - 23 de Junho de 2026

### 🔫 Correções Lógicas de Armas e Planejamento de Mecânicas de Gameplay
*   **Resolução de Bug da Arma Presa na Mão (AK-47 / WeaponID):** Diagnóstico completo do bug da arma travada que ignora o inventário e caixas de munição. Identificado que atores posicionados manualmente no cenário que não possuem a variável `WeaponStored -> WeaponID` definida (ficando como `None` ou vazias) falham na busca da DataTable no `UserConstructionScript`, deixando o mesh vazio e capacidades a zero. A solução exige configurar o campo `WeaponID` no painel *Details* como `"AK47"`.
*   **Alinhamento e Criação de Sockets Sem Bones Dedicados:** Adicionada orientação técnica para inserção de sockets (como o `"Muzzle"`) em armas que não possuem ossos no cano, adicionando o socket diretamente sob o osso `"base"` (ou raiz do esqueleto) e movendo-o para a extremidade correta. O usuário aplicou este método com sucesso na pistola `Beretta`. Orientação de alinhar o eixo X positivo (seta vermelha) para a frente do disparo.
*   **Renomeação e Correção de Divergência M4A1 (SK_AR4):** Mudança recomendada e iniciada pelo usuário do nome do asset `SK_AR4` para `SK_M4A1` no Content Browser, alinhando com a DataTable `WeaponList`. Orientado a executar *Fix Up Redirectors* na pasta de malhas após a renomeação.
*   **Matriz de Decisão de AutoReload:** Definição do uso lógico da variável `AutoReload` (ideal para fuzis automáticos, desaconselhável para escopetas, lançadores ou snipers para evitar loops indesejados de vulnerabilidade).
*   **Design de Tópicos Futuros de Combate:** Criados os manuais detalhados para o sistema de combate melee (combos, notifiers de colisão por Line Trace), stealth takedowns (cálculo de Dot Product angular), física de facas de arremesso e gerenciamento de explosivos/granadas em `04_TopicosFuturos`.

---

## 🏷️ [v2.0.0] - 21 de Junho de 2026

### 🔫 Correções Lógicas de Armas e Configuração de Sockets no Unreal Editor
*   **Correção de Input de Recarga (IA_Reload):** Vinculação concluída da tecla `R` via Enhanced Input (`IMC_Default` -> `IA_Reload`) e conexão no Event Graph do Personagem para chamar o evento de recarregamento do `AC_WeaponSystem`.
*   **Correção do Holster Bug (Arma presa nas costas):** Corrigido o erro lógico de anexo no custom event `AttachInHand` do Blueprint `BP_WeaponBase`. O pino `Target` do nó `K2_AttachToComponent` foi alterado do componente `Magazine` para o componente mestre `WeaponMesh`, e o soquete de anexo foi parametrizado dinamicamente usando a struct `WeaponData -> HandSocket`.
*   **Correção do Erro de Muzzle Ausente (MP5):** Configurado o socket `"Muzzle"` na malha esquelética (`Skeletal Mesh`) `SK_MP5` (em `/Game/FPS_Weapon_Bundle/Weapons/Meshes/MP5/`), posicionando-o na extremidade física do cano. Isso resolveu o aviso de depuração `NÃO FOI ENCONTRADO O SOCKET "MUZZLE" NA ARMA!!!` e restabeleceu a origem dos clarões de disparo (Muzzle Flash) e dos projéteis.
*   **Correção do Pickup de Munição (BP_AmmoBox):** A variável `Ammo Type` do coletável foi configurada para o enumerador `WeaponID`, e o grafo de colisão simplificado, garantindo que o personagem colete munição mesmo desarmado ou com a arma guardada.

---

## 🏷️ [v1.9.0] - 20 de Junho de 2026

### 🎓 Curso Masterclass: de cliques a materiais, animações e IA para iniciantes
*   **Apostila Reestruturada:** Expansão massiva de [Guia_Navegacao_Unreal_Editor_Iniciantes.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/Guia_Navegacao_Unreal_Editor_Iniciantes.md) para cobrir do nível zero ao intermediário operacional da Unreal Engine 5.
*   **Atalhos e Produtividade:** Adicionado guia de comandos de teclado e mouse para Viewport 3D (WASD + clique direito, foco F, duplicação rápida Alt+Drag), Event Graph (comentários C, nós Reroute) e Content Browser.
*   **Importação e Migração (Migration):** Instruções de clique e arraste para FBX, texturas (Normal Maps) e áudio (WAV 16-bit 44.1kHz). Detalhada a regra de ouro de migração por `Asset Actions -> Migrate` para a pasta Content mestre para não quebrar referências.
*   **Criação de Materiais e Instâncias:** Passo a passo para criar materiais base, parametrizar dados (Vector/Scalar Parameters) e instanciar materiais (`Material Instances`) para otimização em tempo de execução.
*   **Física de Colisão Detalhada:** Diferenciação visual e lógica entre colisores estáticos (**Block** / Event Hit) e gatilhos de sobreposição (**Overlap** / Event BeginOverlap), com uso de formatos (Capsule, Sphere, Box) e canais customizados na Details.
*   **Customização de Manequins (Mesh Swapping):** Passo a passo de importação e substituição física do esqueleto no componente `Mesh` da Blueprint do jogador, com alinhamento de coordenadas e eixos Z (Yaw).
*   **Sistema de Locomoção Avançado:** Detalhado o setup de Blend Spaces (transição Idle-Walk-Run baseada em Speed) e Máquinas de Estado (State Machines) conectadas à lógica da AnimInstance.
*   **Inteligência Artificial (IA) e Behavior Trees:** Passo a passo de criação do volume de navegação (`NavMeshBoundsVolume`), customização de `AIController`, criação da tabela de chaves de memória (`Blackboard`) e montagem da árvore de comportamento (`Behavior Tree`) com nós compositores (Selector, Sequence) e tarefas de perseguição de inimigos.

---

## 🏷️ [v1.8.0] - 20 de Junho de 2026

### 🎓 Guia do Unreal Editor & Integração C++ para Iniciantes
*   **Novidade Documentada:** Criado o manual prático e visual de cliques na interface da Unreal Engine [Guia_Navegacao_Unreal_Editor_Iniciantes.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/Guia_Navegacao_Unreal_Editor_Iniciantes.md).
*   **Passo a Passo de Cliques Visuais:** Detalhados os métodos operacionais da aba Details, incluindo os atalhos de seleção rápida por **Seta Curva** (injetar asset selecionado no Content Browser) e **Lupa** (busca pop-up interna), além do menu `Edit -> Project Settings -> Maps & Modes`.
*   **Criação de Variáveis e Funções:** Manual de cliques passo a passo no painel `My Blueprint` para criar variáveis de tipo (Float, Integer, Boolean), compilar para abrir o *Default Value* e criar funções parametrizadas (Inputs/Outputs).
*   **Correspondência C++ para Blueprints:** Glossário e tradução visual da macro `UPROPERTY` e seus metadados de reflexão (`EditAnywhere`, `VisibleAnywhere`, `BlueprintReadWrite`, `BlueprintReadOnly`, `Category`) e `UFUNCTION(BlueprintCallable)` para localização nos painéis visuais do editor.

---

## 🏷️ [v1.7.0] - 20 de Junho de 2026

### 🛠️ Utilitários Gerais & Comunicação (Gameplay Utilities)
*   **Novidade Documentada:** Criado o guia de estudo de utilitários gerais [Blueprints-BP_Utilities.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Utilities.md).
*   **Mapeamento de Assets:** Adicionados na tabela mestre em [enderecos.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/sistema-de-armas-completo/enderecos.md) os assets `BP_MissionMarker`, `BP_Functions`, `Character_Interface` e `Damge_CS` com status `🟢 Mapeado`.
*   **Gatilhos de Transição:** Documentada a lógica condicional de sobreposição e esmaecimento de tela (`StartCameraFade`) em `BP_MissionMarker` com remoção autolimpante.
*   **Bibliotecas Estáticas:** Detalhado o funcionamento dos algoritmos de centralização de cursor (`CenterMousePosition`), busca de materiais físicos e obtenção ágil de referências em `BP_Functions`.
*   **Interface Polimórfica:** Explicada a importância da `Character_Interface` no desacoplamento lógico e economia de referências duras (Hard References) na RAM.
*   **Tremor de Câmera (Camera Shake):** Mapeado o uso de parametrização de oscilação senoidal em `Damge_CS` para impacto visual.
*   **Risco de Tela Preta Infinita:** Alerta sobre a necessidade de reverter fades de câmera no início de novos níveis para evitar bloqueios visuais permanentes.
    *   *Status:* 🔴 Pendente de Correção.
*   **Gargalos de GetComponentByClass:** Alerta sobre perda de processamento de CPU ao usar rotinas de busca em alta frequência, recomendando armazenamento em cache.
    *   *Status:* 🔴 Pendente de Correção.

---

## 🏷️ [v1.6.0] - 20 de Junho de 2026

### 👤 Subsistema de Customização de Personagem (Character Customization)
*   **Novidade Documentada:** Criado o guia técnico do menu de aparência [Blueprints-BP_Customization.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Customization.md).
*   **Mapeamento de Assets:** Adicionados na tabela mestre em [enderecos.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/sistema-de-armas-completo/enderecos.md) os assets `BP_CharacterViewer`, `MenuCustom_GM` e `W_CustomCharacter` com status `🟢 Mapeado`.
*   **Rotação 3D por Mouse:** Documentada a lógica matemática de arrastar do mouse com Enhanced Input no visualizador `BP_CharacterViewer` para rotacionar a malha esquelética do personagem baseado em delta time.
*   **Rotação de Timers por Delegate:** Detalhado o fluxo de delegates em loop contínuo do `RotateTimer` acionado por botões de setas da UI para giro autônomo suave.
*   **Fluxo de Foco Híbrido:** Explicado o setup de inicialização combinando `AddToViewport`, cursor habilitado e input híbrido (`SetInputMode_GameAndUIEx`) configurado no GameMode `MenuCustom_GM`.
*   **Bug de Foco do Mouse:** Alerta sobre perda de foco ao alternar cliques 3D com botões 2D, recomendando travas rígidas de cursor e reposicionamento central no Viewport.
    *   *Status:* 🔴 Pendente de Correção.
*   **Performance por Inativação de Tick:** Recomendação de desligar a escuta de Tick Frame padrão no manequim estático para poupar threads ociosas de CPU.
    *   *Status:* 🔴 Pendente de Correção.

---

## 🏷️ [v1.5.0] - 20 de Junho de 2026

### 🏍️ Subsistema de Veículos Físicos (Physical Vehicles)
*   **Novidade Documentada:** Criado o guia técnico de estudo de veículos [Blueprints-BP_Vehicles.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Vehicles.md).
*   **Mapeamento de Assets:** Adicionados na tabela mestre em [enderecos.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/sistema-de-armas-completo/enderecos.md) os assets `BP_Bike`, `AnimBP_Bike`, `BP_Motorcycle` e `AnimBP_Motorcycle` com status `🟢 Mapeado`.
*   **Diferenciação de Arquitetura de Animação:** Mapeado o contraste de soluções técnicas de animação entre a BMX (rotação de pedais/guidão programada no Actor por transformações locais relativas) e a Motocicleta (modificação de ossos por `ModifyBone` na Animation Blueprint via offsets e ângulos lidos do componente físico).
*   **Mecânicas da Bicicleta:** Detalhado o cálculo de interpolação suavizada de guidão (`Steering`) e rotação de pedais baseada em velocidade de movimento (`Cycling`), além de pulo vertical por aplicação de impulso físico.
*   **Mecânicas da Motocicleta:** Detalhado o sistema para empinar aplicando torque no eixo lateral direito (`GetRightVector`) com suavização por Timeline, além da movimentação do centro de massa (`SetCenterOfMass`) para reequilibrar e evitar capotamentos.
*   **Instabilidade de Duas Rodas:** Alerta sobre a instabilidade de colisores de duas rodas no motor Chaos Physics, recomendando a aplicação de torque corretivo em baixas velocidades.
    *   *Status:* 🔴 Pendente de Correção.
*   **Replicação de Timelines e Torque:** Alerta sobre dessincronização visual em multiplayer caso o torque de empinar não seja executado no servidor com replicação de movimento ativa.
    *   *Status:* 🔴 Pendente de Correção.

---

## 🏷️ [v1.4.0] - 20 de Junho de 2026

### ✈️ Atores Especiais de Gameplay (Gameplay & Special Actors)
*   **Novidade Documentada:** Criado o guia pedagógico-técnico unificado de atores especiais [Blueprints-BP_Jetpack.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Jetpack.md).
*   **Mapeamento de Assets:** Adicionados e catalogados na tabela mestre em [enderecos.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/sistema-de-armas-completo/enderecos.md) sob "Atores Especiais de Gameplay" os assets `BP_Jetpack` e `BP_TimeOfDay`, com status `🟢 Mapeado`.
*   **Mecânica de Voo (Jetpack):** Detalhado o fluxo de acoplamento físico à malha esquelética (`K2_AttachToComponent`), manipulação da gravidade do jogador (`GravityScale = 0.0` no `CharacterMovementComponent`) e descarte físico (`K2_DetachFromActor`).
*   **Interpolação de Tubeiras:** Documentada a lógica matemática de rotação suave em tempo de execução com `FInterpTo` e `MakeRotator` para inclinação dinâmica das tubeiras físicas (`LThruster` e `RThruster`).
*   **Ciclo Dia/Noite (TimeOfDay):** Documentado o funcionamento dinâmico da rotação solar (`SunLight` / DirectionalLight) por conversão de horas decimais usando `MapRangeClamped`.
*   **Exploit de Colisão no Ar:** Identificado risco do jogador atravessar ou ficar preso nas paredes ao voar sem gravidade ativada na cápsula de colisão padrão.
    *   *Status:* 🔴 Pendente de Correção.
*   **Sincronização Multiplayer:** Alerta sobre a necessidade de usar `RepNotify` na variável de estado do Jetpack para replicar emissores de partículas e efeitos de áudio para todos os clientes conectados.
    *   *Status:* 🔴 Pendente de Correção.
*   **Performance de Sombras Dinâmicas:** Alerta sobre o custo excessivo de CPU/GPU ao atualizar sombras da luz solar a cada Tick frame, recomendando limitação de taxa por timer.
    *   *Status:* 🔴 Pendente de Correção.

---

## 🏷️ [v1.3.0] - 20 de Junho de 2026

### 🔫 Subsistema de Projéteis e Munições (Weapons & Projectiles)
*   **Novidade Documentada:** Criado o guia técnico de projéteis e munições [Blueprints-BP_ProjectileSystem.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_ProjectileSystem.md).
*   **Correção de Mapeamento:** Removidos da tabela mestre os 4 componentes de projéteis e explosivos inexistentes no projeto físico e registrados os 3 assets reais (`BP_ProjectileBase`, `Projectile_Rifle`, `BP_AmmoBase`).
*   **Análise Lógica de Colisão (`ReceiveHit`):** Documentada a física de colisão, reprodução de efeitos baseados em `GetSurfaceType` (Physical Materials), aplicação de impulsos em corpos rígidos e decalques de bala.
*   **Comparativo de Coleta:** Mapeamento comparativo entre a munição colisional automática (`BP_AmmoBase`) e a caixa manual interativa (`BP_AmmoBox`).
*   **Otimização por Object Pooling:** Recomendação para combater o gargalo de spawn dinâmico repetido na CPU através de pools de projéteis.
    *   *Status:* 🔴 Pendente de Correção.
*   **Segurança de Dano:** Alerta sobre a necessidade de processar a colisão e aplicação de dano estritamente no Servidor para evitar trapaças em rede.
    *   *Status:* 🔴 Pendente de Correção.

---

## 🏷️ [v1.2.0] - 20 de Junho de 2026

### 🖥️ Subsistema de Interface (UMG)
*   **Novidade Documentada:** Criado o guia pedagógico unificado de interface [Blueprints-UMG_HUD.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-UMG_HUD.md).
*   **Mapeamento de Assets:** Atualizados os caminhos físicos corretos em [enderecos.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/sistema-de-armas-completo/enderecos.md) para apontar para `Content/Blueprints/UMG/...` em vez da pasta `UI/`.
*   **Desvio de Performance (Property Bindings):** Mapeada a necessidade de migrar os Widgets (Vida, Colete, Stamina e Munição) para uma arquitetura baseada em Eventos (*Event-Driven UI*), eliminando a verificação pesada por frame (Tick).
    *   *Status:* 🔴 Pendente de Correção no Unreal Editor.
*   **Desvio de Renderização (Background Blur):** Alerta sobre o custo de pós-processamento na GPU causado pelo `BackgroundBlur` no inventário radial.
    *   *Status:* 🔴 Pendente de Correção (Recomendado ocultar/remover o widget completamente quando inativo).
*   **Vulnerabilidade de Troca Rápida de Armas:** Risco de cancelamento de animações (*anim cancel*) para disparo infinito caso o `AC_WeaponSystem` não valide os cooldowns no servidor.
    *   *Status:* 🔴 Pendente de Correção.

### 🚪 Subsistema de Interação (World Interaction)
*   **Novidade Documentada:** Criado o guia detalhado dos atores de interação [Blueprints-BP_Interaction_System.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Interaction_System.md) e revisado o [Blueprints-AC_Interaction.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-AC_Interaction.md).
*   **Correção de Arquitetura (Raycast vs Overlap):** Corrigido o conceito de detecção do jogador: o projeto adota uma *Arquitetura Baseada em Registro por Sobreposição (Overlap-Register)* em vez de Line Traces continuados.
*   **Exploit de Spam de Coleta:** Vulnerabilidade identificada em consumíveis físicos (`BP_Health`, `BP_Armour`, `BP_AmmoBox`) que permite duplicar itens via spam de cliques rápidos antes da destruição física do ator.
    *   *Status:* 🔴 Pendente de Correção.
    *   *Remediação:* Implementar trava local com nó `DoOnce` no início do evento `Interact` de cada coletável.
*   **Segurança de Replicação:** Recomendado restringir o evento `Interact` e o comando de destruição `K2_DestroyActor` estritamente ao lado do Servidor (*Authority*).

---

## 🏷️ [v1.1.0] - 19 de Junho de 2026

### 🩸 Subsistema de Status e Vida (`AC_PlayerStatus`)
*   **Novidade Documentada:** Criada a análise detalhada das Blueprints reais em [Blueprints-AC_PlayerStatus.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-AC_PlayerStatus.md).
*   **Bug Crítico de Absorção de Colete:** Identificado vazamento de dano bruto integral para a saúde do jogador quando a armadura quebra (`Armour - LocalDamage <= 0`).
    *   *Status:* 🔴 Pendente de Correção no Unreal Editor (Recomendado recalcular aplicando a sobra: `Health - (LocalDamage - Armour)`).
*   **Exploit de Dano de Queda Livre:** Identificada imunidade total a quedas de qualquer altura se o jogador mantiver foco em um `InteractionObject` inativo durante o impacto.
    *   *Status:* 🔴 Pendente de Correção (Recomendado isolar o cálculo de velocidade vertical Z no componente de locomoção sem checagem de interface ativa).
*   **Desconexão de Event Tick:** Pino de depuração de console do `ReceiveTick` desconectado na Blueprint.
    *   *Status:* 🔴 Pendente de Correção (Recomendado reconectar para depuração ou deletar o código morto).
