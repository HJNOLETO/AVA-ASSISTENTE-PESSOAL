Vou te dar uma estrutura organizada de aprendizado para Unreal Engine 5, separada por módulos claros, para você estudar um por um (ideal para NotebookLM).
📌 Ordem Recomendada de Aprendizado (Roadmap)
Aqui está uma divisão lógica e eficiente para quem quer criar jogos:
Módulo 1: Fundamentos Básicos

Unreal Engine Interface (Editor, Viewports, Content Browser, World Outliner)
Navegação e Atalhos
Assets e Content Browser
Inheritance (Herança) – você já tem um bom material sobre isso
Levels e Level Streaming

Módulo 2: Blueprints Essenciais

Variables, Functions, Events e Macros
Flow Control (Branch, Sequence, Loops)
Casting (Cast To...)
Communication between Blueprints (Event Dispatchers, Interfaces)
GameMode, GameState, PlayerState, PlayerController
Pawn, Character e Controller

Módulo 3: Sistema de Jogo (Core)

GameMode (muito importante)
GameState e PlayerState
PlayerController vs AIController
Possession (Possess Pawn)
Input System (Enhanced Input)
Blackboard + Behavior Tree (IA)

Módulo 4: Movimento e Personagem

Character Movement Component
Animation Blueprint (AnimBP)
State Machines
Root Motion

Módulo 5: Sistema de Interação e Gameplay

Collision e Overlap Events
Interfaces (para interação)
Widgets (UMG - User Interface)
Saving and Loading (SaveGame)
Audio System

Módulo 6: Avançado

Niagara (Efeitos Visuais)
Chaos Physics
Metasound
Networking / Multiplayer
Optimization e Profiling
Packaging e Performance


Exemplo: O que estudar sobre GameMode
GameMode – Tópicos essenciais:

O que é GameMode e para que serve
Diferença entre GameMode, GameState e PlayerState
Principais funções: PostLogin, RestartPlayer, HandleStartingNewPlayer
Como criar um GameMode customizado
Como definir o GameMode padrão no Project Settings
Spawn de jogadores (Default Pawn Class)
Como acessar GameMode de outros Blueprints