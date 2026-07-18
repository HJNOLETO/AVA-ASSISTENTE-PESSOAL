# 🎓 Regras de Jogo: APPGameMode C++

**[Compatibilidade: UE 5.1+]**  
**[Origem: CUSTOMIZADO]**

O `GameMode` é a autoridade central em uma partida no Unreal Engine. Ele define as regras do jogo, como o fluxo de fases, as condições de vitória ou derrota, e orquestra quais classes serão utilizadas como padrões na inicialização de um jogador (como o personagem jogável, o controlador, a interface gráfica/HUD, etc.).

Este documento detalha o funcionamento da classe `APPGameMode` e como expor suas regras de forma flexível para que artistas e designers modifiquem os parâmetros através do Editor da Unreal Engine.

---

## 🎯 Caso Prático: Definindo o Personagem Inicial no Spawn

> *Você foi contratado para criar a estrutura inicial do jogo "Pirata Perdido". A equipe de arte e design de fases precisa colocar um marcador "Player Start" no mapa e garantir que, assim que o jogo for iniciado, o personagem principal (`APPPirateCharacter`) seja instanciado exatamente naquele local de spawn automaticamente. O designer de fases também precisa ser capaz de alterar a classe do personagem para um modelo de teste ou para outros personagens jogáveis sem a necessidade de solicitar alterações ou compilações aos programadores.*

---

## ⚙️ 1. O Ciclo de Spawn do Jogador e o GameMode

Quando um nível é carregado na Unreal Engine, o GameMode orquestra o ciclo de criação do jogador, conforme o diagrama a seguir:

```mermaid
graph TD
    LevelStart[Início do Mapa / Level Load] --> GameModeInit[1. Inicializa GameMode]
    GameModeInit --> FindPlayerStart[2. Localiza o Ator Player Start no Mundo]
    FindPlayerStart --> SpawnPawn[3. Instancia DefaultPawnClass]
    SpawnPawn --> SpawnController[4. Instancia PlayerControllerClass]
    SpawnController --> Possess[5. Controller Toma Posse do Personagem (Possess)]
```

---

## ⚖️ 2. Assinatura da Classe e a Macro `UCLASS`

No arquivo `PPGameMode.h`, a classe herda de `AGameModeBase` (a versão padrão e leve do GameMode para jogos singleplayer ou com lógica simplificada de rede).

### Código do Cabeçalho (`PPGameMode.h`):
```cpp
UCLASS(Blueprintable)
class PIRATAPERDIDO_API APPGameMode : public AGameModeBase
{
    GENERATED_BODY()

public:
    APPGameMode();
};
```

### Detalhamento Técnico das Macros:

| Macro / Modificador | Função no Sistema de Reflexão | Significado Prático |
| :--- | :--- | :--- |
| **`UCLASS(Blueprintable)`** | Permite que a classe C++ sirva de base para a criação de arquivos de Blueprint (`BP_PPGameMode`) no Editor. | Designers podem herdar esta classe e alterar propriedades no painel Details do editor visualmente. |
| **`GENERATED_BODY()`** | Prepara o cabeçalho para as otimizações do **Unreal Header Tool (UHT)**. | Necessária para que o compilador do C++ saiba onde injetar metadados de reflexão e Garbage Collection. |
| **`PIRATAPERDIDO_API`** | Exporta a classe do módulo do projeto para DLLs compartilhadas do motor. | Necessária para que outros plugins ou módulos consigam enxergar e referenciar essa classe. |

---

## 💻 3. Implementação e Atribuição no Construtor

No arquivo `PPGameMode.cpp`, a vinculação da classe padrão do personagem é feita no construtor utilizando a referência da classe estática (`StaticClass()`).

### Análise do Construtor (`PPGameMode.cpp`):
```cpp
#include "PPGameMode.h"
#include "../Characters/PPPirateCharacter.h"
#include "GameFramework/HUD.h"

APPGameMode::APPGameMode()
{
    // Define a classe de personagem padrão que será instanciada no Player Start.
    DefaultPawnClass = APPPirateCharacter::StaticClass();
}
```

### Explicação Detalhada do Código:
- **`DefaultPawnClass`**: É uma propriedade da classe base `AGameModeBase` que armazena a classe que o motor deve criar quando o jogador inicializar.
- **`APPPirateCharacter::StaticClass()`**: Retorna um ponteiro do tipo `UClass` que descreve a classe de C++ `APPPirateCharacter`. É uma forma segura em tempo de compilação de dizer à Unreal para usar nosso personagem de pirata.
- **Vantagem de Projetar com Herança de Blueprints**: Ao definir `DefaultPawnClass` no C++, criamos um valor padrão de fábrica. No entanto, ao usar `Blueprintable`, o designer pode criar `BP_GameMode` no editor e trocar o `Default Pawn Class` no painel Details para `BP_Character` (que possui a malha 3D e as animações do pirata configuradas visualmente).

---

## 🏃 Desafio Ativo: Definindo o PlayerController Padrão

Em jogos avançados, precisamos de um controlador personalizado (`APlayerController`) para gerenciar a exibição do menu de pausa ou para gerenciar o cursor do mouse na tela. Sua tarefa é expandir o construtor da classe `APPGameMode` para carregar e instanciar um `PlayerController` personalizado.

### Esqueleto de Resolução do Desafio:

1. Crie uma classe de C++ vazia chamada `APPPiratePlayerController` herdada de `APlayerController`.
2. Inclua o cabeçalho do controlador no arquivo `PPGameMode.cpp`:
```cpp
#include "PPGameMode.h"
#include "../Characters/PPPirateCharacter.h"
#include "../Characters/PPPiratePlayerController.h" // Inclua o cabeçalho criado
```

3. No construtor de `APPGameMode::APPGameMode()`, configure a propriedade `PlayerControllerClass`:
```cpp
APPGameMode::APPGameMode()
{
    DefaultPawnClass = APPPirateCharacter::StaticClass();
    
    // CONFIGURE AQUI o PlayerController padrão:
    PlayerControllerClass = APPPiratePlayerController::StaticClass();
}
```

---

## ❓ Perguntas que este documento responde

- Qual o papel do `GameMode` na Unreal Engine C++?
- Como funciona o processo de spawn automático do personagem ao iniciar o jogo?
- Para que serve a macro `Blueprintable` na declaração da classe `APPGameMode`?
- Como vincular e configurar uma classe padrão (como a do personagem) em tempo de compilação C++?
