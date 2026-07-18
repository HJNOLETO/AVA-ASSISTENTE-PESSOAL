# 🚀 Índice Geral: Docs_ProjetoGTA_Estudo

**[Compatibilidade: UE 5.1+]**  
**[Origem: CUSTOMIZADO]**

Este diretório contém a documentação unificada e pedagógica do projeto de desenvolvimento **Projeto GTA / Pirata Perdido**. Os materiais foram estruturados seguindo o padrão de ensino prático baseado em casos, tabelas explicativas de propriedades e lógica condicional, diagramas visuais de fluxo e desafios ativos de programação.

Esta base de conhecimento serve tanto para estudo de desenvolvedores quanto para indexação semântica e recuperação de informações em sistemas RAG (Retrieval-Augmented Generation).

---

## 📂 Árvore de Diretórios da Documentação

```
Docs_ProjetoGTA_Estudo/
├── 00_Indice_Geral.md                     <-- (Este arquivo)
├── Manual_Pratico_Implementacao.md        <-- Guia prático de criação e mecânicas (portas, armas, status)
├── Changelog_Base_Estudos.md              <-- Diário de Bordo: Histórico de modificações, exploits e correções
├── Guia_Operacional_Agente_IA.md          <-- Guia Operacional da IA: Scripts, APIs de Unreal e governança de links
├── Guia_Navegacao_Unreal_Editor_Iniciantes.md <-- Curso Masterclass: de cliques a materiais, animações e IA para iniciantes
├── 01_CodigoCpp/
│   ├── PPPirateCharacter.md               <-- Configuração física do personagem e Enhanced Input
│   └── PPGameMode.md                      <-- Regras de nível e spawn automático do Pawn
├── 02_Blueprints/
│   ├── AC_PlayerStatus.md                 <-- Conceituação do Actor Component de saúde, stamina e matemática Clamp
│   ├── Blueprints-AC_PlayerStatus.md      <-- Anotação detalhada das Blueprints reais (SetDamage, Armour, Sprint, Jump)
│   ├── Blueprints-AC_WeaponSystem.md      <-- Análise aprofundada do componente de armas, recarga, disparos e drop físico
│   ├── Blueprints-AC_Interaction.md       <-- Análise do componente de colisão, olhar e priorização de interação a pé
│   ├── Blueprints-BP_Interaction_System.md <-- Detalhamento técnico do ator base de interação, porta e itens consumíveis (vida, colete, munição)
│   ├── Blueprints-PC_ProjetoGTA.md        <-- Lógica do Player Controller para criação e visibilidade de HUD
│   ├── Blueprints-ProjetoGameInstance.md  <-- Controle do ciclo de tempo (Real vs Jogo) e integração do céu
│   ├── Blueprints-BP_CustomMovementComponent.md <-- Extensão de física de locomoção, transições e subida de escada/escalada
│   ├── Blueprints-BP_PhysicalMag.md       <-- Física de colisão, impulso linear e descarte planejado de carregadores
│   ├── Blueprints-UMG_HUD.md              <-- Guia pedagógico unificado dos Widgets UMG de HUD, Crosshair e Menu Radial
│   ├── Blueprints-BP_ProjectileSystem.md  <-- Guia técnico de projéteis (base e rifle) e drops físicos de munição
│   ├── Blueprints-BP_Jetpack.md           <-- Anotação do Jetpack (controle de gravidade, sockets, thrusters) e ciclo de tempo (BP_TimeOfDay)
│   ├── Blueprints-BP_Vehicles.md          <-- Anotação de Veículos Físicos (WheeledVehiclePawn, suspensão, pedais, empinar, centro de massa)
│   ├── Blueprints-BP_Customization.md     <-- Detalhamento técnico do subsistema de customização de personagem (visualizador e menu UI)
│   ├── Blueprints-BP_Utilities.md         <-- Mapeamento de triggers de fade de câmera, bibliotecas estáticas e interfaces comuns
│   ├── BP_WeaponBase.md                   <-- Classe mestre para armas e comunicação de interface
│   └── BP_Character.md                    <-- Vinculação visual de malhas, animações e inputs
├── 03_Sistemas/
│   ├── Sistema_Vida_Stamina.md            <-- Integração de dano, morte e consumo de energia
│   ├── Sistema_Armas.md                   <-- Spawn, encaixe em sockets e disparo polimórfico
│   ├── Sistema_HUD.md                     <-- Widgets UMG, progress bars e atualização otimizada
│   ├── Sistema_MenuRotativo.md            <-- Roda de seleção radial e dilatação temporal (câmera lenta)
│   └── Arquitetura_GameMode_Classes.md    <-- Framework do GameMode e classes de controle e fluxo (Pawn, HUD, Controller, etc.)
├── 04_TopicosFuturos/
│   ├── _modelo_topico_novo.md             <-- Template padrão para novos guias didáticos
│   ├── Adicionar_Carro.md                 <-- Simulação de veículos de 4 rodas com o Chaos Vehicles
│   ├── Adicionar_Bicicleta.md             <-- Física e estabilização de duas rodas por torque ativo
│   ├── Adicionar_Sistema_Explosivos.md    <-- Guia de implementação de projéteis explosivos, detonações e dano radial
│   └── Adicionar_Sistema_Combate_Corpo_a_Corpo.md <-- Guia de combate melee, combos de espada, stealth takedown e arremesso de faca

└── 05_GlossarioBlueprint/
    └── Nos_Comuns_Explicados.md           <-- Guia conceitual de nós lógicos e equivalentes em código
```
----

## 🧭 Resumo dos Documentos Criados

### [Manual_Pratico_Implementacao.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/Manual_Pratico_Implementacao.md)
Guia didático passo a passo ensinando a implementar do zero em Unreal Engine sistemas de porta com Timeline/Lerp, armas com Line Trace para disparo, zoom de mira na câmera, recarga e distribuição de dano amortecida por colete.

### [Changelog_Base_Estudos.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/Changelog_Base_Estudos.md)
Diário de Bordo e histórico evolutivo de modificações de mecânicas do projeto, documentando os exploits identificados e o andamento de suas correções.

### [Guia_Operacional_Agente_IA.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/Guia_Operacional_Agente_IA.md)
Manual operacional detalhando como instâncias de IA acessam informações no host (CMD, Scripts Python e Remote Execution API no Unreal Editor) e as regras de governança e indexação cruzada de documentos.

### [Guia_Navegacao_Unreal_Editor_Iniciantes.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/Guia_Navegacao_Unreal_Editor_Iniciantes.md)
Apostila de treinamento masterclass (do Zero ao Intermediário) em Unreal Engine 5. Detalha abas e atalhos de produtividade, processos de import/export e migração (Migration), criação de materiais e instâncias (Material Instances), configuração de colisões físicas (Block vs Overlap), troca de manequins (Skeletal Meshes), sistema de locomoção com Blend Spaces/State Machines e Inteligência Artificial com Behavior Trees e Blackboards.

### [01_CodigoCpp/PPPirateCharacter.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/01_CodigoCpp/PPPirateCharacter.md)
Analisa a estrutura da classe C++ principal do personagem jogador, detalhando a matemática de movimento direcional orientada pela câmera e o registro de binds no Enhanced Input.

### [01_CodigoCpp/PPGameMode.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/01_CodigoCpp/PPGameMode.md)
Explica o papel do GameMode na Unreal Engine como gestor de regras de início de jogo e no mapeamento seguro de classes iniciais via construtor C++.

### [02_Blueprints/AC_PlayerStatus.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/AC_PlayerStatus.md)
Documentação conceitual do componente de controle de Vida e Estamina, destacando a prevenção de overflow e underflow numéricos usando o nó Clamp.

### [02_Blueprints/Blueprints-AC_PlayerStatus.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-AC_PlayerStatus.md)
Documentação técnica e profunda do grafo visual de Blueprints extraído do componente `AC_PlayerStatus.t3d`, mapeando colete, dano de queda, stamina de pulo/corrida e a utilidade de centralização de mira (`BP_Functions`).

### [02_Blueprints/Blueprints-AC_WeaponSystem.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-AC_WeaponSystem.md)
Analisa a fundo o componente de gerenciamento de armas (AC_WeaponSystem), incluindo spawn diferido a partir de tabelas, checagens de armas repetidas, troca rápida, recarga com travas, e descarte de armas físicas com gravidade e ciclo de vida.

### [02_Blueprints/Blueprints-AC_Interaction.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-AC_Interaction.md)
Analisa o componente de interação do jogador, detalhando a colisão, a varredura e a priorização entre objetos estáticos e itens coletáveis.

### [02_Blueprints/Blueprints-BP_Interaction_System.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Interaction_System.md)
Guia de estudo técnico que detalha os atores de interação, desde o ator base (BP_InteractionObject) e coletável (BP_PickupObject), até as implementações filhas de portas rotativas (BP_Door) e coletores de vida, colete e munição.

### [02_Blueprints/Blueprints-PC_ProjetoGTA.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-PC_ProjetoGTA.md)
Documentação técnica do Player Controller principal, detalhando o ciclo de vida da HUD (`AddToViewport`) e o gerenciamento dinâmico de visibilidade de painéis (HUD e Tela de Morte).

### [02_Blueprints/Blueprints-ProjetoGameInstance.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-ProjetoGameInstance.md)
Documentação técnica do Game Instance principal, detalhando o ciclo de simulação de tempo dia/noite (Real vs Jogo), as equações matemáticas de conversão decimal de horas/minutos, e a sincronização visual com o ator de iluminação dinâmico do céu (`BP_GoodSky`).

### [02_Blueprints/BP_WeaponBase.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/BP_WeaponBase.md)
Aborda a arquitetura de herança em Blueprints aplicada ao sistema de armas de fogo, detalhando o funcionamento de interfaces lógicas comuns para disparo genérico.

### [02_Blueprints/BP_Character.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/BP_Character.md)
Descreve a integração prática entre código C++ e arte visual no Blueprint do jogador, mapeando a malha esquelética, animações e referências físicas de entrada.

### [02_Blueprints/Blueprints-UMG_HUD.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-UMG_HUD.md)
Analisa detalhadamente as interfaces de usuário UMG, cobrindo o HUD mestre (vida, colete, stamina, switcher de armas), retícula de mira (crosshair), menu de customização de personagem e o inventário radial de seleção de armas.

### [02_Blueprints/Blueprints-BP_ProjectileSystem.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_ProjectileSystem.md)
Documentação técnica contendo a análise lógica da classe base de projéteis (BP_ProjectileBase) e do rifle (Projectile_Rifle), cobrindo ricochetes, física de impulso, decalques e emissores de impacto por superfície, além do drop físico de munição (BP_AmmoBase).

### [02_Blueprints/Blueprints-BP_Jetpack.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Jetpack.md)
Guia de estudo técnico e pedagógico dos Atores Especiais, detalhando a lógica de acoplamento físico e visual do Jetpack (sockets e malhas), controle dinâmico de gravidade no componente de movimento para voar, interpolação suave da direção das tubeiras físicas (FInterpTo) e o ciclo de rotação do sol no controlador de tempo (BP_TimeOfDay).

### [02_Blueprints/Blueprints-BP_Vehicles.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Vehicles.md)
Guia de estudo técnico do Subsistema de Veículos Físicos, destrinchando o comportamento do componente WheeledVehicleComponent na bicicleta (BP_Bike) e na motocicleta (BP_Motorcycle). Detalha a interpolação suave de direção (Steering) e pedais (Cycling), e os cálculos físicos para empinar (wheelie) com alteração dinâmica do centro de massa e pulo de obstáculos.

### [02_Blueprints/Blueprints-BP_Customization.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Customization.md)
Guia de estudo técnico do Subsistema de Customização de Personagem, analisando a rotação 3D da malha visual com arrastar do mouse (BP_CharacterViewer), a configuração do GameMode do menu (MenuCustom_GM) e a lógica de seleção de aparência no widget gráfico (W_CustomCharacter).

### [02_Blueprints/Blueprints-BP_Utilities.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Utilities.md)
Guia de estudo de Utilitários de Gameplay, abrangendo a lógica de colisão e esmaecimento de câmera por zonas de trigger (BP_MissionMarker), a biblioteca de funções estáticas centralizadas (BP_Functions), o uso desacoplado de interfaces de comunicação (Character_Interface) e tremores de câmera por dano (Damge_CS).

### [02_Blueprints/Blueprints-BP_CustomMovementComponent.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_CustomMovementComponent.md)
Detalha a extensão de física de locomoção para suporte a escadas de mão (Ladders) e escalada de apoios (Climbing/Ledges), com controle de transições e eixos de input.

### [02_Blueprints/Blueprints-BP_PhysicalMag.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_PhysicalMag.md)
Analisa a simulação de gravidade de carregadores físicos descartados durante a recarga, aplicação de força linear inicial e descarte automático por timers para otimização do jogo.

### [03_Sistemas/Sistema_Vida_Stamina.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/03_Sistemas/Sistema_Vida_Stamina.md)
Analisa a interconexão lógica do gasto de estamina ao correr, e o fluxo físico de dano que culmina na ativação da simulação de Ragdoll (morte).

### [03_Sistemas/Sistema_Armas.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/03_Sistemas/Sistema_Armas.md)
Detalha a lógica de spawn de armas e sua fixação física na mão do pirata por meio de transformações alinhadas a Sockets de animação.

### [03_Sistemas/Sistema_HUD.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/03_Sistemas/Sistema_HUD.md)
Explica a otimização de interfaces baseadas em eventos (UMG) para reduzir o consumo de CPU em comparação com bindings acionados no Event Tick.

### [03_Sistemas/Sistema_MenuRotativo.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/03_Sistemas/Sistema_MenuRotativo.md)
Demonstra o cálculo matemático trigonométrico (`Atan2`) para a identificação de fatias radiais em interfaces e a desaceleração temporal do jogo via Time Dilation.

### [03_Sistemas/Arquitetura_GameMode_Classes.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/03_Sistemas/Arquitetura_GameMode_Classes.md)
Explica o funcionamento, a criação, as responsabilidades e a localização do GameMode e suas classes auxiliares associadas (Default Pawn, HUD, Player Controller, Game State e Spectator).

### [04_TopicosFuturos/Adicionar_Carro.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/04_TopicosFuturos/Adicionar_Carro.md)
Fornece um tutorial passo a passo para integração física de carros dirigíveis utilizando as facilidades da simulação do Chaos Vehicles.

### [04_TopicosFuturos/Adicionar_Bicicleta.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/04_TopicosFuturos/Adicionar_Bicicleta.md)
Propõe uma solução de simulação de equilíbrio ativo por aplicação de torques físicos dinâmicos em Pawns personalizados de duas rodas.

### [04_TopicosFuturos/Adicionar_Sistema_Explosivos.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/04_TopicosFuturos/Adicionar_Sistema_Explosivos.md)
Tutorial passo a passo ensinando a criar componentes de trajetória de projéteis, detonadores físicos e cálculos matemáticos de atenuação de dano por área para lançadores de granadas e barris explosivos.

### [04_TopicosFuturos/Adicionar_Sistema_Combate_Corpo_a_Corpo.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/04_TopicosFuturos/Adicionar_Sistema_Combate_Corpo_a_Corpo.md)
Guia de planejamento arquitetural e lógico para implementar combos de espadas (Samurai / GOW), impactos físicos e visuais de ataques, execuções de finalização e eliminações furtivas silenciosas por trás do inimigo.


### [05_GlossarioBlueprint/Nos_Comuns_Explicados.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/05_GlossarioBlueprint/Nos_Comuns_Explicados.md)
Catalogação e explicação técnica de nós comuns de Blueprints, mapeando suas equivalências conceituais em código de programação textual.

---

## 🛠️ Relatório de Verificação Final

1.  **Blueprints Processados:**
    *   `BP_Character` (100% Mapeado)
    *   `BP_WeaponBase` (100% Mapeado)
    *   `AC_PlayerStatus` (100% Mapeado a partir de arquivos `.t3d` exportados do Unreal Engine e capturas de tela)
    *   `UMG_RadialMenu` (100% Mapeado)
2.  **Acesso ao Unreal Engine (Processamento dos Grafos):**
    *   Os dados lógicos, pinos, conexões e fluxos de execução das Blueprints foram extraídos diretamente dos arquivos `.t3d` (conversão ASCII dos grafos originais) localizados na pasta `scratch/exported_blueprints` do projeto. O detalhamento visual dos Event Graphs e funções (como a centralização de mira da câmera) foi validado e sincronizado com base nas capturas de tela reais do Unreal Editor (`AC_PlayerStatus` e `BP_Functions`).
3.  **Caminho Absoluto Final:**
    *   Aponte a ferramenta `index-drive-sync.ts` ou indexador RAG para o seguinte caminho absoluto no host:
    `C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\CRIADO-AVA-CLI\unreal_engine_docs\Docs_ProjetoGTA_Estudo`
