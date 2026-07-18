# GameMode e Gameplay Framework no Unreal Engine 5 — Guia Prático Completo

**[Compatibilidade: UE 5.1+]** | **[Projeto: Pirata Perdido / Projeto GTA]**

Este documento é um guia prático e autocontido para aprender sobre GameMode e o Gameplay Framework da Unreal Engine. Cada conceito inclui: **onde** se faz, **como** se faz (passo a passo no editor ou código), e **exemplos concretos** baseados em projetos reais.

---

## 📖 Glossário Rápido — Termos Técnicos da Unreal Engine

| Termo | Significado |
|:---|:---|
| **Actor** | Qualquer objeto que existe no mundo 3D do jogo (personagens, luzes, portas, câmeras...) |
| **Asset** | Arquivo de recurso do jogo: modelo 3D, textura, som, animação, material |
| **BeginPlay** | Evento automático que roda quando o jogo ou um ator inicia |
| **Blueprint** (BP) | Sistema de programação visual da Unreal — você conecta caixas/nós coloridos em vez de escrever código |
| **Cast / Cast To** | Converter um tipo genérico para um tipo específico e acessar suas funções. Ex: "saber que este GameMode é MEU GameMode" |
| **Character** | Tipo de Pawn para personagens bípedes — já vem com física de caminhada, pulo e agachamento |
| **Classe** | Molde/planta que define o que um objeto é e o que ele pode fazer |
| **Cliente** | Computador do jogador conectado ao servidor (em multiplayer) |
| **Component** | Peça anexada a um ator. Ex: malha 3D (`StaticMeshComponent`), colisão, movimento |
| **Construtor** | Função especial que roda automaticamente ao criar um objeto de uma classe |
| **Event Graph** | Área de programação visual dentro de um Blueprint — onde se monta a lógica com nós |
| **Frame / Tick** | Cada "foto" do jogo (30, 60 ou mais por segundo). `Event Tick` roda a cada frame |
| **GameMode** | Classe autoridade que define as regras da partida (spawn, vitória, derrota) |
| **Header (.h)** | Arquivo C++ que declara o que uma classe tem (variáveis, funções) — a "fachada" |
| **Herança** | Quando uma classe "filha" copia tudo da classe "pai" e adiciona suas próprias coisas |
| **HUD** (Heads-Up Display) | Interface gráfica sobreposta à tela do jogador (barras de vida, munição, mira) |
| **Instância / Instanciar** | Criar uma cópia concreta de uma classe no jogo. A classe é o molde, a instância é o bolo |
| **Macro** (`UCLASS`, `UPROPERTY`, etc.) | Anotação que diz ao motor "esta classe/variável/função é especial, trate-a diferente" |
| **Multiplayer** | Modo de jogo com múltiplos jogadores conectados via rede |
| **Nó / Node** | Cada caixa colorida no Event Graph de Blueprint. Nós são conectados por fios/lines |
| **Override / Sobrescrever** | Substituir o comportamento original de uma função herdada da classe pai |
| **Pawn** | Ator físico que pode ser controlado por um jogador ou IA. É o "corpo" no jogo |
| **Player Controller** | A "alma" do jogador — recebe input do teclado/mouse, controla câmera e gerencia a HUD |
| **Player Start** | Ator que marca onde o jogador aparece (spawna) quando entra no mapa |
| **Possess** | Um Controller "tomar posse" de um Pawn — assumir o controle daquele corpo |
| **Project Settings** | Janela de configurações globais do projeto no editor (Edit → Project Settings) |
| **Replicação / Replicated** | Sincronização automática de dados do servidor para todos os clientes conectados |
| **Respawn** | Recriar o personagem do jogador após morte |
| **RPC** (Remote Procedure Call) | Chamar uma função em outra máquina via rede (ex: cliente pede algo ao servidor) |
| **Servidor** | Máquina que hospeda/controla a partida multiplayer |
| **Server-only** | Ator ou lógica que existe apenas no servidor, não nos clientes |
| **Spawn** | Criar/instanciar um ator no mundo durante o jogo |
| **StaticClass()** | Método C++ que retorna o "RG" da classe — seu descritor de tipo em tempo de execução |
| **UMG** (Unreal Motion Graphics) | Sistema nativo da Unreal para criar interfaces gráficas (barras de vida, menus, botões) |
| **Viewport** | A "janela" onde o jogo é renderizado — o que você vê na tela |
| **Widget** | Um elemento visual de interface UMG. Pode ser uma barra de vida, um botão, um menu inteiro |
| **World Settings** | Janela de configurações específicas do mapa atual (Window → World Settings) |

---

## 1. O que é GameMode?

O `GameMode` é a **autoridade central** em uma partida no Unreal Engine. Ele define:

- As regras do jogo (condições de vitória, derrota, fluxo de fases)
- Quais classes serão usadas como padrão na inicialização de cada jogador
- O ciclo de spawn e respawn (criar e recriar o personagem no mundo) dos jogadores
- As regras de rede em multiplayer

**Regra fundamental:** O GameMode só existe no servidor (Server-only). Clientes não têm acesso a ele por segurança — evita trapaças e hacks de leitura de memória.

### GameMode vs GameModeBase — Qual escolher?

A Unreal Engine oferece duas classes base para GameMode. A escolha depende do tipo de jogo:

| Classe | Quando usar | Funcionalidades inclusas |
|:---|:---|:---|
| `AGameModeBase` | Singleplayer, co-op local, ou jogos com lógica simples de rede | Spawn, posse de Pawn, funções básicas de entrada/saída de jogador |
| `AGameMode` (herda — copia funcionalidades — de `AGameModeBase`) | Multiplayer competitivo, partidas com lobby, fases e pós-partida | Tudo do Base + match states — fases da partida: espera (WaitingToStart), jogo ativo (InProgress), pós-partida (WaitingPostMatch), `ReadyToStartMatch`, `StartMatch`, transições de estado |

**Recomendação prática:** Para projetos singleplayer (como o Pirata Perdido), use `AGameModeBase`. Para jogos multiplayer com lobby e pontuação, use `AGameMode`.

### Onde o GameMode é definido?

Existem dois lugares onde se define qual GameMode será usado:

**A) Globalmente (Project Settings) — para o jogo inteiro:**
```
Editor → Edit → Project Settings → Maps & Modes → Default Modes → Default GameMode
```
Selecione seu GameMode no dropdown. Todo mapa que não tiver um override específico usará este.

**B) Por mapa (World Settings) — para um nível específico:**
```
Editor → Window → World Settings → GameMode Override
```
Cada nível pode ter seu próprio GameMode. Útil para menu principal (GameMode simples) vs fase de jogo (GameMode com regras).

**Como o editor decide qual usar:** Se o mapa tem um `GameMode Override` definido no World Settings, usa ele. Se não, usa o `Default GameMode` do Project Settings.

---

## 2. Onde e Como as Regras do Jogo São Criadas

### Condições de Vitória e Derrota

As regras de vitória/derrota são implementadas como **funções dentro do GameMode**. Você as cria de duas formas:

#### Opção A: Em Blueprint (sistema de programação visual com nós coloridos — recomendado para iniciantes)

**Onde criar:** Dentro do seu Blueprint de GameMode (ex: `BP_MeuGameMode`), no **Event Graph**.

**Como criar uma condição de vitória — Exemplo: "Destruir 5 inimigos para vencer":**

**Passo 1:** Abra seu Blueprint GameMode (`BP_MeuGameMode`).

**Passo 2:** No **My Blueprint** (painel esquerdo), clique em `+` ao lado de **Variables**. Crie uma variável chamada `InimigosDerrotados`, tipo **Integer**, valor padrão `0`.

**Passo 3:** Na aba **Functions** do My Blueprint, clique em `+` para criar uma nova função chamada `RegistrarMorteInimigo`.

**Passo 4 — O grafo da função** (dentro de `RegistrarMorteInimigo`):

```
   FUNÇÃO: RegistrarMorteInimigo (dentro do BP_MeuGameMode)
   ═══════════════════════════════════════════════════════════

   ┌─────────────────────────────┐
   │  RegistrarMorteInimigo      │  ← nó de entrada da função
   │  (Entry Node)               │
   └──────────────┬──────────────┘
                  │ ▶ (exec flow — linha branca)
                  ▼
   ┌─────────────────────────────┐
   │  Get InimigosDerrotados     │  ← nó PURO (sem ▶, só dados)
   └──────────────┬──────────────┘
                  │ int: valor atual (ex: 3)
                  ▼
   ┌─────────────────────────────┐
   │       integer + integer     │
   │   A = Get InimigosDerrot.   │  ← soma 1 ao contador
   │   B = 1                     │
   └──────────────┬──────────────┘
                  │ int: novo valor (ex: 4)
                  ▼
   ┌─────────────────────────────┐
   │  Set InimigosDerrotados     │  ← salva o novo valor
   └──────────────┬──────────────┘
                  │ ▶
                  ▼
   ┌─────────────────────────────┐
    │         Branch              │  ← nó de decisão (if/else visual):
    │  Condition:                 │     se TRUE → caminho da esquerda
    │  InimigosDerrotados >= 5 ?  │     se FALSE → caminho da direita
   └────────┬──────────┬─────────┘
            │ TRUE     │ FALSE
            ▼          ▼
   ┌──────────────┐  ┌──────────────┐
   │  Vitória!    │  │ (fim da      │
   │              │  │  execução)   │
   │  PrintString │  └──────────────┘
   │  "YOU WIN!"  │
   │       │      │
   │       ▼      │
   │  Open Level  │
   │  Mapa_Vitoria│
   └──────────────┘
```

**Passo 5 — Onde chamar esta função (do inimigo):**

Em qualquer Blueprint de inimigo (`BP_Inimigo`), no evento de morte:

```
   EVENTO DE MORTE DO INIMIGO (dentro do BP_Inimigo)
   ═══════════════════════════════════════════════════

   ┌─────────────────────────────┐
   │  Vida <= 0 ?                │  ← evento de morte
   │  (Event AnyDamage ou        │     (gatilho)
   │   Custom Event OnDeath)     │
   └──────────────┬──────────────┘
                  │ ▶
                  ▼
   ┌─────────────────────────────┐
   │     Get Game Mode           │  ← nó global, retorna
   └──────────────┬──────────────┘     o GameMode atual
                  │ GameModeBase (ref)
                  ▼
   ┌─────────────────────────────┐
   │ Cast To BP_MeuGameMode      │  ← converte para nosso
   └──────┬──────────┬───────────┘     tipo específico (sem o Cast,
          │ SUCESSO  │ FALHA           o motor não sabe quais
          ▼          ▼                 funções customizadas existem)
          ▼          ▼
   ┌──────────────┐  ┌──────────────┐
   │ Registrar-   │  │ PrintString  │
   │ MorteInimigo │  │ "GM nao enc."│
   │   (call)     │  └──────────────┘
   └──────────────┘
```

**Como criar uma condição de derrota — Exemplo: "Vida do jogador chegou a 0":**

1. No seu Blueprint GameMode, crie uma função chamada `JogadorMorreu`
2. No graph da função:
   - Atrase a transição com um nó **Delay** (ex: 3 segundos para tela de morte)
   - Use um nó **Open Level** para carregar o mapa de Game Over ou o mesmo mapa (restart)
3. **Onde chamar esta função:** No Blueprint do Player Controller ou Character, quando vida <= 0:
   - `Get Game Mode` → `Cast To BP_MeuGameMode` → `JogadorMorreu`

#### Opção B: Em C++ (recomendado para performance e multiplayer)

**Onde criar:** No arquivo `.h` e `.cpp` do seu GameMode.

```cpp
// PPGameMode.h
UCLASS()
class MEUJOGO_API AMyGameMode : public AGameModeBase
{
    GENERATED_BODY()
    
public:
    // Variável rastreável. UPROPERTY com Replicated para multiplayer
    UPROPERTY(BlueprintReadOnly, Category = "Game Rules")
    int32 EnemiesDefeated = 0;
    
    // Funções de regra — BlueprintCallable permite chamar de Blueprints
    UFUNCTION(BlueprintCallable, Category = "Game Rules")
    void RegisterEnemyDefeat();
    
    UFUNCTION(BlueprintCallable, Category = "Game Rules")
    void PlayerDied(AController* DeadPlayer);
    
protected:
    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Game Rules")
    int32 EnemiesToWin = 5;
    
    UFUNCTION(BlueprintImplementableEvent, Category = "Game Rules")
    void OnVictory();  // Implementado no Blueprint filho
    
    UFUNCTION(BlueprintImplementableEvent, Category = "Game Rules")
    void OnDefeat();   // Implementado no Blueprint filho
};
```

```cpp
// PPGameMode.cpp
void AMyGameMode::RegisterEnemyDefeat()
{
    EnemiesDefeated++;
    
    if (EnemiesDefeated >= EnemiesToWin)
    {
        OnVictory();  // Dispara o evento que o Blueprint filho implementa
    }
}

void AMyGameMode::PlayerDied(AController* DeadPlayer)
{
    OnDefeat();  // Dispara o evento de derrota
}
```

**Como o Blueprint filho implementa os eventos visuais:** Ao criar `BP_MeuGameMode` herdado de `AMyGameMode`, as funções `OnVictory` e `OnDefeat` aparecem no My Blueprint como eventos que você pode implementar com nós visuais (abrir Widget de vitória, tocar som, carregar mapa, etc.).

### Fluxo de Fases (Match States)

O fluxo de fases existe apenas em `AGameMode` (não em `AGameModeBase`). As fases são:

```
WaitingToStart → InProgress → WaitingPostMatch → (reinicia ou fecha)
```

**Onde se controla o fluxo de fases:** Em C++, sobrescrevendo funções do `AGameMode`. No Blueprint, usando os eventos expostos.

**Exemplo prático — Fase de preparação (WaitingToStart) com contagem regressiva:**

1. Sobrescreva (override — substitua a função original pela sua versão) a função `HandleMatchIsWaitingToStart` no Blueprint do GameMode:
   - No **My Blueprint**, passe o mouse sobre **Functions** → clique em **Override** → selecione `HandleMatchIsWaitingToStart`
   - No graph: use um nó **Delay** (ex: 10 segundos de preparação), depois chame `StartMatch` (função nativa que muda para InProgress)

2. Para iniciar a partida automaticamente quando todos os jogadores estiverem prontos:
   - Sobrescreva `ReadyToStartMatch` (retorna bool)
   - Coloque a lógica: retorne True quando todos os PlayerControllers tiverem marcado "pronto"
   - Se True, o motor chama `StartMatch` automaticamente

**Exemplo — Transição para tela de resultados (WaitingPostMatch):**

1. Quando a condição de vitória for atingida:
   - Chame `EndMatch()` — isso muda o estado para WaitingPostMatch
   - No Blueprint, sobrescreva `HandleMatchHasEnded` para mostrar Widget de resultados
2. Após um Delay, chame `RestartGame()` para reiniciar ou `ReturnToMainMenuHost()` para voltar ao menu

---

## 3. O Gameplay Framework — Onde e Como Configurar Cada Classe

Quando você configura um GameMode, está definindo quais classes o motor usará para criar todos os elementos da sessão do jogador. As configurações ficam no **painel Details** do GameMode, na categoria **Classes**.

### Onde acessar essas configurações? Dois caminhos:

**Caminho A — Pelo Content Browser (para GameMode em Blueprint):**
1. No Content Browser, encontre seu `BP_MeuGameMode`
2. Clique duplo para abrir
3. No painel **Class Defaults** (barra de ferramentas superior do Blueprint Editor), clique em **Class Defaults**
4. No painel **Details**, expanda a categoria **Classes** — todas as 5 classes estão listadas aqui

**Caminho B — Pelo World Settings (override no mapa):**
1. Com o mapa aberto, vá em `Window → World Settings`
2. Em **GameMode Override**, selecione seu GameMode
3. As mesmas configurações de **Classes** aparecem logo abaixo

### 3.1 Default Pawn Class — Onde e como configurar o personagem jogável

**Onde configurar:** No painel Details do GameMode → categoria **Classes** → campo **Default Pawn Class**.

**Como funciona:** O GameMode usa esta classe como molde. Quando um jogador entra, o motor instancia uma cópia deste Pawn no local do Player Start.

**O que colocar aqui:** Pode ser um Character (se for bípede com física de caminhada) ou um Pawn (para veículos, câmeras, ou qualquer coisa controlável sem `CharacterMovementComponent`).

**Diferença prática entre Pawn e Character:**

| Característica | Pawn | Character |
|:---|:---|:---|
| Colisão | Sim (capsule ou mesh) | Sim (capsule + mesh) |
| Movimento | Manual (você programa) | Automático (`CharacterMovementComponent`) |
| Gravidade | Manual | Nativa |
| Agachar/Pular | Manual | Nativo |
| Quando usar | Veículos, câmeras voadoras, torres, objetos controláveis | Personagens bípedes |

**Exemplo prático — Projeto Pirata Perdido (C++):**
```cpp
// No construtor do GameMode (PPGameMode.cpp):
APPGameMode::APPGameMode()
{
    DefaultPawnClass = APPPirateCharacter::StaticClass();
}
```

**Exemplo prático — Projeto GTA (Blueprint):**
No `ProjetoGTA_GameMode`, o campo `Default Pawn Class` está configurado para `ALS_Player` — um Blueprint localizado em:
```
Content/AdvancedLocomotionV4/Blueprints/CharacterLogic/ALS_Player.uasset
```

### 3.2 Player Controller Class — Onde e como configurar o controlador

**Onde configurar:** Painel Details do GameMode → categoria **Classes** → **Player Controller Class**.

**Para que serve na prática:**
- Capturar teclas pressionadas (WASD, mouse, controle)
- Controlar a câmera do jogador
- Criar e gerenciar a HUD (interface UMG)
- Decidir se o mouse está visível (`Set Show Mouse Cursor`)
- Possuir e controlar o Pawn (`Possess` — o ato de "tomar posse" do corpo do personagem)

**Como criar um Player Controller customizado:**
1. No Content Browser, clique com botão direito → **Blueprint Class**
2. Selecione **Player Controller** como classe pai
3. Nomeie (ex: `BP_MeuPlayerController`)
4. Abra o Blueprint e use o **Event Graph** para programar a lógica

**Exemplo prático — Criando a HUD no Player Controller:**

No `Event Graph` do `BP_MeuPlayerController`:

```
   PLAYER CONTROLLER: Criando HUD (1x por sessão)
   ═══════════════════════════════════════════════

   ┌─────────────────────────┐
   │   Event BeginPlay       │  ← executado UMA vez
   └────────────┬────────────┘     quando o jogo inicia
                │ ▶
                ▼
   ┌─────────────────────────┐
   │     Create Widget       │
   │  Class: W_HUD_Principal │  ← cria a interface
   └────────────┬────────────┘
                │ Return Value: W_HUD (ref)
                │ ▶
                ▼
   ┌─────────────────────────┐
   │  Promote to Variable    │  ← clique direito no
   │  Nome: MainHUD          │     pino → Promote
   └────────────┬────────────┘
                │ ▶
                ▼
   ┌─────────────────────────┐
   │    Add to Viewport      │  ← exibe na tela
   └────────────┬────────────┘
                │ ▶
                ▼
   ┌─────────────────────────┐
   │  HUD visível! Persiste  │
   │  mesmo após mortes.     │
   └─────────────────────────┘

   MAIS TARDE — ao receber dano (qualquer função no PlayerController):
   ════════════════════════════════════════════════════════════════════

   ┌─────────────────────────┐
   │    Get MainHUD          │  ← recupera a referência salva
   └────────────┬────────────┘
                │ W_HUD (ref)
                ▼
   ┌─────────────────────────┐
   │ AtualizarBarraDeVida    │  ← função customizada
   │   (NovoValor: float)    │     que você criou no Widget
   └─────────────────────────┘
```

1. Evento `Event BeginPlay` — executado UMA vez quando o jogo inicia
2. `Create Widget` (Class: `W_HUD`) — cria a interface
3. Promova o retorno a variável: clique direito no pino → **Promote to Variable** → nomeie `MainHUD`
4. `Add to Viewport` — exibe na tela
5. Pronto — a HUD persiste mesmo após morte do personagem

**Por que no Player Controller e não no Character:** O Player Controller é criado uma única vez quando o jogador entra. O Character é destruído e recriado a cada morte. Se a HUD fosse criada no BeginPlay do Character, a cada respawn uma nova HUD seria empilhada sobre a anterior.

**Onde colocar Input do Enhanced Input no Player Controller:**

1. No `BP_MeuPlayerController`, evento `Event BeginPlay`
2. `Get Owning Pawn` → `Cast To SeuCharacter`
3. `Get Enhanced Input Local Player Subsystem`
4. Conecte a um nó **Add Mapping Context** — passa o `MappingContext` que contém seus Input Actions (WASD, pulo, etc.)
5. Isso garante que o input seja reconfigurado mesmo após respawn

### 3.3 HUD Class

**Onde configurar:** Painel Details do GameMode → **Classes** → **HUD Class**.

**Realidade atual:** A classe `AHUD` é um legado do Unreal Engine 3/4 para desenho 2D procedural (Canvases de texto, retângulos). **Quase ninguém estende `AHUD` em projetos modernos** — usa-se UMG Widgets.

**Como funciona UMG (o substituto moderno da HUD):**
- Você cria Widgets na pasta Content: clique direito → **User Interface** → **Widget Blueprint**
- Monta a interface visualmente (barras de vida, textos, botões, imagens)
- Adiciona ao Viewport via Player Controller (`Create Widget` → `Add to Viewport`)
- Atualiza os valores por **Event Binding** (mais eficiente que Event Tick) ou chamando funções do Widget

**Exemplo prático — Barra de vida que atualiza sem Event Tick:**
1. No Widget `W_HUD`, selecione a Progress Bar de vida
2. No painel Details, em **Progress → Percent**, clique em **Bind** → **Create Binding**
3. No graph da binding: `Get Owning Player Controller` → `Cast To BP_MeuPlayerController` → `Get MainHUD` (ou obtenha a referência ao Character) → retorne `Vida / VidaMaxima`
4. Esta binding só atualiza quando o valor muda — não consome CPU no Event Tick

### 3.4 Game State Class

**Onde configurar:** Painel Details do GameMode → **Classes** → **Game State Class**.

**Função principal:** Armazenar dados que precisam ser visíveis para TODOS os jogadores. O GameState é automaticamente replicado (sincronizado via rede) do servidor para todos os clientes conectados.

**Exemplo prático — Placar de time em multiplayer:**
```cpp
// MeuGameState.h
UCLASS()
class AMyGameState : public AGameStateBase
{
    GENERATED_BODY()
public:
    // Replicated (replicado) significa que este valor é sincronizado
    // automaticamente do servidor para todos os clientes
    UPROPERTY(Replicated, BlueprintReadOnly, Category = "Score")
    int32 TeamAScore = 0;
    
    UPROPERTY(Replicated, BlueprintReadOnly, Category = "Score")
    int32 TeamBScore = 0;
    
    // Função chamada apenas no servidor para atualizar placar
    void AddScoreTeamA(int32 Points);
    
    // Necessário para replicação
    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;
};

// MeuGameState.cpp
void AMyGameState::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(AMyGameState, TeamAScore);
    DOREPLIFETIME(AMyGameState, TeamBScore);
}

void AMyGameState::AddScoreTeamA(int32 Points)
{
    TeamAScore += Points;
}
```

**De qualquer Widget HUD (em qualquer cliente):**
- `Get Game State` → `Cast To AMyGameState` → `Get TeamAScore` — o valor está sempre atualizado e sincronizado
- Isso funciona porque o GameState é replicado

### 3.5 Spectator Class

**Onde configurar:** Painel Details do GameMode → **Classes** → **Spectator Class**.

**Quando o SpectatorPawn é usado:** Quando o jogador não possui um Pawn ativo — tipicamente ao morrer em multiplayer antes do respawn, ou no modo espectador pós-partida. O `SpectatorPawn` tem voo livre (WASD + mouse para olhar + scroll para velocidade).

**Como colocar o jogador em modo espectador ao morrer:**
```cpp
// No PlayerController ou Character, quando vida chegar a 0:
void AMyPlayerController::HandleDeath()
{
    // Despossui o Pawn atual, o motor automaticamente cria um SpectatorPawn
    UnPossess();
    
    // Configura um timer para respawn
    FTimerHandle RespawnTimer;
    GetWorldTimerManager().SetTimer(RespawnTimer, this, &AMyPlayerController::RespawnPlayer, 5.0f, false);
}

void AMyPlayerController::RespawnPlayer()
{
    // Pede ao GameMode para fazer respawn
    AGameModeBase* GM = GetWorld()->GetAuthGameMode();
    if (GM)
    {
        GM->RestartPlayer(this);
    }
}
```

---

## 4. Ciclo de Spawn do Jogador — Passo a Passo Dentro do Motor

Quando um nível carrega, o GameMode orquestra a criação do jogador nesta ordem exata:

```
   CICLO DE SPAWN DO JOGADOR (GameMode)
   ═══════════════════════════════════════════

   ┌─────────────────────────┐
   │    Mapa Carregado       │
   │    (Level Loaded)       │
   └────────────┬────────────┘
                │ ▶
                ▼
   ┌─────────────────────────┐
   │  1. InitGame()          │
   │  Inicializa o GameMode  │
   │  Executa o construtor   │
   │  e BeginPlay do GM      │
   └────────────┬────────────┘
                │ ▶
                ▼
   ┌─────────────────────────┐
   │  2. ChoosePlayerStart() │
   │  Percorre todos os      │
   │  APlayerStart do mapa   │
   │  Escolhe por tag ou     │
   │  aleatório              │
   └────────────┬────────────┘
                │ Transform (posição + rotação)
                ▼
   ┌─────────────────────────┐
   │  3. SpawnDefaultPawn    │
   │     AtTransform()       │
   │  Usa DefaultPawnClass   │
   │  Cria o Pawn no mundo   │
   └────────────┬────────────┘
                │ APawn* (novo personagem)
                │ ▶
                ▼
   ┌─────────────────────────┐
   │  4. Login() →           │
   │     SpawnPlayerController│
   │  Usa PlayerController   │
   │  Class                  │
   └────────────┬────────────┘
                │ APlayerController*
                │ ▶
                ▼
   ┌─────────────────────────┐
   │  5. Possess(Pawn)       │
   │  Controller toma posse  │
   │  do Pawn                │
   │  Inputs do teclado/mouse│
   │  agora controlam o Pawn │
   └────────────┬────────────┘
                │ ▶
                ▼
   ┌─────────────────────────┐
   │  🎮 Jogador no controle │
   └─────────────────────────┘
```

### Fluxo de respawn (quando o jogador morre e volta):

```
   Jogador morre → RestartPlayer() → (repete passos 2-5)
```

### Onde colocar atores Player Start no mapa:

1. No **Place Actors** (painel esquerdo do editor), busque por "Player Start"
2. Arraste para o mapa onde quiser que o jogador apareça
3. Rotacione o ator para definir a direção inicial do jogador (a seta azul indica a direção)
4. Coloque múltiplos Player Starts — o GameMode escolhe um automaticamente

**Personalizando qual Player Start usar — Por tag de time:**

1. Selecione um `PlayerStart` no mapa
2. No painel Details, em **Player Start → Player Start Tag**, digite `"TeamA"`
3. No GameMode C++, sobrescreva `ChoosePlayerStart`:
```cpp
AActor* AMyGameMode::ChoosePlayerStart_Implementation(AController* Player)
{
    // Percorre todos os Player Starts
    TArray<AActor*> PlayerStarts;
    UGameplayStatics::GetAllActorsOfClass(GetWorld(), APlayerStart::StaticClass(), PlayerStarts);
    
    for (AActor* Start : PlayerStarts)
    {
        APlayerStart* PS = Cast<APlayerStart>(Start);
        if (PS && PS->PlayerStartTag == "TeamA")
        {
            return PS;  // Spawna o time A neste ponto
        }
    }
    
    // Fallback: usa o padrão (primeiro Player Start encontrado)
    return Super::ChoosePlayerStart_Implementation(Player);
}
```

---

## 5. Implementação em C++ — GameMode do Pirata Perdido

### 5.1 Onde os arquivos ficam no projeto

No projeto Pirata Perdido, os arquivos estão em:
```
Source/PirataPerdido/
├── PPGameMode.h       ← Declaração da classe
└── PPGameMode.cpp     ← Implementação (construtor)
```

No Visual Studio, a estrutura de pastas da Solution espelha o diretório `Source/`.

### 5.2 Como criar um GameMode C++ do zero — Passo a passo

1. No Unreal Editor: **Tools → New C++ Class**
2. Selecione **Game Mode Base** como classe pai
3. Nomeie a classe (ex: `MeuGameMode`)
4. Clique em **Create Class** — o editor gera `.h` e `.cpp` e recompila

### 5.3 Cabeçalho — O que cada linha faz

```cpp
// PPGameMode.h
#pragma once               // Evita inclusão duplicada do cabeçalho

#include "CoreMinimal.h"   // Inclui tipos fundamentais da Unreal
#include "GameFramework/GameModeBase.h"  // Classe pai
#include "PPGameMode.generated.h"        // GERADO pelo UHT — sempre por último

UCLASS(Blueprintable)  // Permite criar Blueprints baseados nesta classe
class PIRATAPERDIDO_API APPGameMode : public AGameModeBase
{
    GENERATED_BODY()   // Macro obrigatória — injeta infraestrutura de reflexão

public:
    APPGameMode();     // Construtor
};
```

### 5.4 Explicação de cada macro — O que realmente fazem

| Macro | Onde se aplica | O que o UHT gera a partir dela | Efeito prático no editor |
|:---|:---|:---|:---|
| `UCLASS(Blueprintable)` | Antes da declaração da classe | Gera metadados que permitem herança em Blueprint | A classe aparece na lista ao criar um novo Blueprint. Designers podem criar `BP_MeuGameMode` herdando desta classe C++. |
| `GENERATED_BODY()` | Dentro da classe, antes de qualquer declaração | Injeta: construtor padrão, suporte a `UObject` macros, serialização, GC, `StaticClass()` | Sem esta macro, **a classe não compila**. É obrigatória em 100% das classes UCLASS. |
| `PIRATAPERDIDO_API` | No nome da classe | Marca a classe como `DLLEXPORT` (Windows) / visível externamente | Sem isso, outros módulos do projeto não conseguem referenciar a classe. O nome `PIRATAPERDIDO` vem do `.Build.cs` do módulo. |

### 5.5 Construtor — Onde se vinculam as classes padrão

```cpp
// PPGameMode.cpp
#include "PPGameMode.h"
#include "../Characters/PPPirateCharacter.h"  // Inclui o header do personagem
#include "GameFramework/HUD.h"                // Para ter acesso a AHUD

APPGameMode::APPGameMode()
{
    // DefaultPawnClass é herdado de AGameModeBase
    // StaticClass() retorna UClass* — é type-safe e validado em compilação
    DefaultPawnClass = APPPirateCharacter::StaticClass();
    
    // Opcional: definir outras classes padrão
    // PlayerControllerClass = APPPiratePlayerController::StaticClass();
    // HUDClass = AMyHUD::StaticClass();
}
```

**O que `StaticClass()` faz na prática:**
- Toda classe UCLASS tem automaticamente um método estático `StaticClass()`
- Ele retorna um ponteiro `UClass*` — o **"RG da classe"** (descritor de tipo em tempo de execução, chamado de reflection type descriptor)
- O motor usa esse descritor para instanciar (criar) objetos da classe correta em runtime
- É type-safe: se `APPPirateCharacter` não existir, o código **não compila** (erro detectado antes de rodar)

---

## 6. Como Criar um GameMode Customizado — Guia Visual

### Pelo Editor (Blueprint — sem código):

**Passo 1 — Criar o Blueprint GameMode:**
1. No **Content Browser**, navegue até uma pasta (ex: `Content/Blueprints/`)
2. Clique com botão direito no espaço vazio → **Blueprint Class**
3. Na janela "Pick Parent Class", use a barra de busca: digite `Game Mode Base`
4. Selecione **Game Mode Base** (ou **Game Mode** se precisar de match states)
5. Nomeie: `BP_MeuGameMode`

**Passo 2 — Configurar as classes do framework:**
1. Clique duplo em `BP_MeuGameMode` para abrir o Blueprint Editor
2. Na barra de ferramentas superior, clique em **Class Defaults**
3. No painel **Details** (direita), localize a categoria **Classes**
4. Configure cada campo:
   - **Default Pawn Class** → selecione `BP_MeuPersonagem` (seu Character)
   - **Player Controller Class** → selecione `BP_MeuPlayerController` (se tiver um)
   - **HUD Class** → geralmente deixa o padrão (nativo) e usa UMG
   - **Game State Class** → selecione `BP_MeuGameState` (se tiver um)
   - **Spectator Class** → geralmente deixa o padrão `SpectatorPawn`
5. **Compile** (botão na barra superior) e **Save**

**Passo 3 — Adicionar lógica de jogo ao GameMode:**
1. Vá para a aba **Event Graph** do Blueprint
2. Use os eventos nativos disponíveis. Os mais comuns:
   - **Event BeginPlay** → chamado quando o GameMode inicia. Use para configurar regras iniciais, spawnar atores do cenário, iniciar música.
   - **Event OnPostLogin** → chamado quando um jogador entra. Use para dar itens iniciais, teleportar ao lobby, mostrar mensagem de boas-vindas.
   - Sobrescrever funções: no painel **My Blueprint**, passe o mouse sobre **Functions** → **Override** → selecione a função desejada

**Passo 4 — Definir como GameMode padrão (2 lugares possíveis):**

**Global (Project Settings):**
1. Vá em **Edit → Project Settings**
2. No painel esquerdo: **Project → Maps & Modes**
3. Em **Default Modes → Default GameMode**, selecione `BP_MeuGameMode`

**Por mapa (World Settings — override por nível):**
1. Abra o mapa (nível) onde quer usar este GameMode
2. Vá em **Window → World Settings**
3. Em **GameMode → GameMode Override**, selecione `BP_MeuGameMode`
4. Isso SOBRESCREVE o GameMode global SOMENTE para este mapa

### Pelo Visual Studio (C++):

**Passo 1 — Criar a classe:**
1. No Unreal Editor: **Tools → New C++ Class**
2. Classe pai: **Game Mode Base**
3. Nome: `MeuGameMode`
4. O editor gera os arquivos e recompila

**Passo 2 — Editar o construtor (função que roda ao criar o GameMode):**
```cpp
// MeuGameMode.cpp
AMeuGameMode::AMeuGameMode()
{
    DefaultPawnClass = AMyCharacter::StaticClass();
    PlayerControllerClass = AMyPlayerController::StaticClass();
}
```

**Passo 3 — Criar Blueprint filho (opcional, para designers):**
1. No Content Browser: clique direito → **Blueprint Class**
2. Na busca da classe pai, encontre `MeuGameMode` (sua classe C++)
3. Nomeie: `BP_MeuGameMode`
4. Agora designers podem alterar propriedades do GameMode sem mexer em C++

---

## 7. Como Acessar o GameMode de Outros Blueprints

### Em Blueprint (Event Graph de qualquer ator ou widget):

**Caminho padrão:**
```
Get Game Mode → Cast To SeuGameMode → (use as funções/variáveis do seu GameMode)
```

**Exemplo concreto — Inimigo notifica GameMode ao morrer:**
1. No Blueprint do inimigo (`BP_Inimigo`), evento que detecta morte (ex: vida <= 0)
2. Conecte a: `Get Game Mode` (nó azul, sem input)
3. Conecte a: `Cast To BP_MeuGameMode`
4. Do pino de sucesso do Cast (execução): chame `RegistrarMorteInimigo`

### Em C++ (de qualquer classe):

```cpp
// Obtém o GameMode do mundo atual — FUNCIONA APENAS NO SERVIDOR
AGameModeBase* GameMode = GetWorld()->GetAuthGameMode();

// Cast seguro para o seu tipo específico
AMyGameMode* MyGM = Cast<AMyGameMode>(GameMode);
if (MyGM)
{
    MyGM->RegisterEnemyDefeat();
}
```

### Cuidado com Multiplayer — Por que `Get Game Mode` falha em clientes:

**Problema:** O nó `Get Game Mode` retorna **None** (nulo) quando executado em um cliente conectado. Isso acontece porque o GameMode só existe no servidor.

**Solução:** Se você precisa de dados que todos os jogadores devem ver, coloque-os no **GameState** e acesse assim:
```
Get Game State → Cast To MeuGameState → (leia as variáveis)
```
O GameState é replicado automaticamente. Funciona em servidor e cliente.

---

## 8. Arquitetura Oculta — 3 Verdades Que Todo Dev Unreal Precisa Saber

### 8.1 A Armadilha do Respawn

> **Nunca armazene dados persistentes do jogador na classe do Character/Pawn!**

**Por que isso acontece:** Quando o personagem morre, o GameMode chama `RestartPlayer()`, que **destrói o ator Character atual** e **instancia um novo** a partir de `DefaultPawnClass`. O novo Character é um objeto zerado — qualquer variável que estava no antigo se perdeu.

**Demonstração prática do problema:**
1. Crie uma variável `Dinheiro` (Integer, valor 0) no seu `BP_Character`
2. Durante o jogo, colete moedas: `Dinheiro += 10`
3. O personagem morre
4. O GameMode spawna um novo Character — **`Dinheiro` voltou a ser 0**

**Onde salvar cada tipo de dado para evitar perda:**

| Persistência desejada | Onde salvar | Por que funciona |
|:---|:---|:---|
| Inventário, dinheiro, XP, vida máxima | **Player State** ou **Player Controller** | O Player Controller é criado 1x por sessão e NUNCA é destruído na morte. O Player State é anexado ao Controller e também persiste. |
| Progresso entre mapas (fases completadas, saves) | **Game Instance** | O Game Instance existe desde o momento que o jogo abre até ele fechar — sobrevive a qualquer troca de mapa. |
| Placar, tempo de partida, estado de missão | **Game State** | O GameState é replicado para todos os jogadores. Perfeito para dados compartilhados. |
| Posição, rotação, animação | **Character/Pawn** | São dados efêmeros — podem e devem ser resetados a cada respawn. |

**Como implementar Player State para salvar inventário:**
```cpp
// MyPlayerState.h
UCLASS()
class AMyPlayerState : public APlayerState
{
    GENERATED_BODY()
public:
    UPROPERTY(Replicated, BlueprintReadOnly)
    int32 Money = 0;
    
    UPROPERTY(Replicated, BlueprintReadOnly)
    TArray<FName> Inventory;
    
    UFUNCTION(BlueprintCallable)
    void AddMoney(int32 Amount) { Money += Amount; }
};
```

### 8.2 GameMode é Server-Only (Multiplayer)

**O que isso significa:** Em uma partida multiplayer, o GameMode é um ator que só existe no computador que está hosteando (servidor/listen server). Os computadores dos clientes conectados NÃO têm instância do GameMode.

**Como isso afeta seu código:**
- `Get Game Mode` → retorna None se executado no cliente
- `GetWorld()->GetAuthGameMode()` → retorna nullptr no cliente
- Variáveis e funções do GameMode NÃO são replicadas

**Estratégias para contornar isso:**

| Necessidade | Abordagem correta |
|:---|:---|
| Cliente precisa saber o placar | Coloque o placar no **GameState** |
| Cliente precisa saber o nome do jogador | Use **PlayerState** |
| Cliente quer pedir para spawnar (ex: apertou "Ready") | Use uma **Server RPC** (Remote Procedure Call) no PlayerController |
| Cliente precisa ler regras (ex: tempo máximo de partida) | Coloque como variável replicada no **GameState** |

**Exemplo de Server RPC (função que o cliente usa para pedir algo ao servidor) — comunicação cliente→servidor:**
```cpp
// No PlayerController (que existe tanto no servidor quanto no cliente)
UFUNCTION(Server, Reliable)  // Server = executado no servidor, Reliable = garantia de entrega
void ServerRequestRespawn();

void AMyPlayerController::ServerRequestRespawn_Implementation()
{
    // Este código roda APENAS no servidor
    AGameModeBase* GM = GetWorld()->GetAuthGameMode();
    if (GM)
    {
        GM->RestartPlayer(this);  // GameMode existe aqui — estamos no servidor
    }
}
```

### 8.3 O Ciclo de Vida da HUD — Por Que Criá-la no Player Controller

**O problema de criar a HUD no Character:**

```
   O PROBLEMA: HUD criada no Character → Memory Leak a cada morte
   ═══════════════════════════════════════════════════════════════

   INÍCIO DO JOGO:
   ┌──────────────────┐     ┌──────────────────┐
   │ Character #1     │────▶│ CreateWidget #1  │────▶ Widget #1 na tela
   │   BeginPlay()    │     │ AddToViewport    │
   └──────────────────┘     └──────────────────┘
           │
   ═══════════ MORTE ═══════════  (Widget #1 NÃO é destruído!)
           │
   RESPAWN:
   ┌──────────────────┐     ┌──────────────────┐
   │ Character #2     │────▶│ CreateWidget #2  │────▶ Widget #2 sobre #1
   │   BeginPlay()    │     │ AddToViewport    │      (2 widgets na tela!)
   └──────────────────┘     └──────────────────┘
           │
   ═══════════ MORTE ═══════════  (Widget #1 E #2 acumulados!)
           │
   RESPAWN:
   ┌──────────────────┐     ┌──────────────────┐
   │ Character #3     │────▶│ CreateWidget #3  │────▶ Widget #3 sobre #2 e #1
   │   BeginPlay()    │     │ AddToViewport    │      (3 widgets na tela!)
   └──────────────────┘     └──────────────────┘
           │
   ════ REPETE A CADA MORTE ════  Memory leak + widgets empilhados ad infinitum
```

**Consequências:**
- **Memory leak:** Widgets antigos nunca são removidos da memória
- **Performance degradada:** Múltiplos widgets processando bindings simultaneamente
- **Input capturado pelo widget errado:** O widget mais novo pode não ser o que está no topo visual

**A solução — HUD no Player Controller:**

```
   A SOLUÇÃO: HUD no Player Controller → Criado 1x, reutilizado sempre
   ═════════════════════════════════════════════════════════════════

   ┌──────────────────┐     ┌──────────────────┐
   │ PlayerController │────▶│ CreateWidget #1  │────▶ Widget na tela
   │   BeginPlay()    │     │ AddToViewport    │      (1 única vez!)
   └──────────────────┘     └──────────────────┘
           │                ┌──────────────────┐
           │                │ Store as MainHUD │  ← salva a referência
           │                └──────────────────┘
           │
   ═══════════ MORTE ═══════════
           │                    O PlayerController NÃO é destruído!
   ══════ RESPAWN ══════       Ele persiste durante toda a sessão.
           │                    O mesmo Widget #1 continua na tela.
           │
   ═════ ATUALIZAR HUD ═════
           │
   Get MainHUD → Call AtualizarBarraDeVida(NovoValor)
   │
   (sempre o mesmo widget, sem duplicação)
```

**A solução — HUD no Player Controller:**

```cpp
// No PlayerController (MeuPlayerController.h)
UCLASS()
class AMyPlayerController : public APlayerController
{
    GENERATED_BODY()
    
protected:
    virtual void BeginPlay() override;
    
    // Referência em cache para atualizar valores depois
    UPROPERTY()
    class UMyHUDWidget* MainHUDWidget;
};
```

```cpp
// MeuPlayerController.cpp
void AMyPlayerController::BeginPlay()
{
    Super::BeginPlay();
    
    // Cria a HUD UMA ÚNICA VEZ — nunca mais
    if (IsLocalPlayerController() && MainHUDWidgetClass)
    {
        MainHUDWidget = CreateWidget<UMyHUDWidget>(this, MainHUDWidgetClass);
        if (MainHUDWidget)
        {
            MainHUDWidget->AddToViewport();
        }
    }
}
```

**No Blueprint (Event Graph do Player Controller):**
1. Evento `Event BeginPlay`
2. `Create Widget` (Class = seu Widget HUD)
3. Promova o retorno a variável: clique direito no pino de retorno → **Promote to Variable** → nomeie `MainHUD`
4. Conecte a `Add to Viewport`
5. Sempre que precisar atualizar a HUD (ex: dano recebido): `Get MainHUD` → `Cast To W_HUD` → chame a função de atualização no Widget

---

## 9. Tabela Comparativa Completa — GameMode vs GameState vs PlayerState vs PlayerController vs Pawn

| Característica | GameMode | GameState | PlayerState | PlayerController | Pawn/Character |
|:---|:---|:---|:---|:---|:---|
| **Escopo** | Partida inteira | Partida inteira | Um jogador | Um jogador | Um jogador |
| **Quantas instâncias** | 1 por partida | 1 por partida | 1 por jogador | 1 por jogador | 1 por jogador (por vez) |
| **Persiste após morte?** | Sim | Sim | Sim | Sim | **Não** (destruído e recriado) |
| **Persiste após troca de mapa?** | Não | Não | Não | Pode (se seamless travel) | Não |
| **Existe no cliente?** | **Não** (server-only) | **Sim** (replicado) | **Sim** (replicado) | Sim (apenas o do próprio jogador) | Sim |
| **Responsabilidade principal** | Regras do jogo, spawn, fluxo | Estado global: placar, tempo, missões | Dados do jogador: nome, kills, score | Input, câmera, HUD, controlar Pawn | Física, colisão, mesh, animação |
| **Como acessar em Blueprint** | `Get Game Mode` (só servidor) | `Get Game State` | `Get Player State` (do Player Controller) | `Get Player Controller` (de qualquer lugar) | `Get Controlled Pawn` (do Controller) |
| **Como acessar em C++** | `GetWorld()->GetAuthGameMode()` | `GetWorld()->GetGameState()` | `PlayerController->GetPlayerState<AMyPS>()` | `GetOwningPlayerController()` (do Pawn) | `GetPawn()` (do Controller) |
| **Criar classe customizada?** | Sim — quase sempre | Quando precisa de dados globais replicados | Quando precisa de dados por jogador replicados | Sim — quase sempre | Sim — sempre (é seu personagem) |

---

## 10. Checklist: Tudo Que Você Precisa Saber Sobre GameMode

1. **Conceito:** GameMode é a autoridade central de regras — define como o jogo funciona
2. **Escolha da classe base:** `AGameModeBase` para singleplayer, `AGameMode` para multiplayer com match states
3. **Onde definir:** Project Settings (global) ou World Settings (por mapa)
4. **As 5 classes do framework:** Default Pawn, Player Controller, HUD, Game State, Spectator
5. **Onde configurar as 5 classes:** No painel Details do GameMode, categoria **Classes**
6. **Ciclo de spawn:** InitGame → ChoosePlayerStart → SpawnDefaultPawnAtTransform → Possess
7. **Player Start:** Onde colocar e como usar tags para times diferentes
8. **Criar GameMode em Blueprint:** Botão direito no Content Browser → Blueprint Class → Game Mode Base → configurar Class Defaults
9. **Criar em C++:** Tools → New C++ Class → Game Mode Base → implementar construtor com `StaticClass()`
10. **Macros C++:** `UCLASS(Blueprintable)` permite herança em BP, `GENERATED_BODY()` é obrigatório, `_API` exporta a classe
11. **Funções nativas principais:** `PostLogin` (jogador entra), `RestartPlayer` (respawn), `SpawnDefaultPawnAtTransform` (cria Pawn)
12. **Regras de jogo:** Implementadas como funções no Event Graph do GameMode — vitória, derrota, pontuação
13. **Match states** (só `AGameMode`): `WaitingToStart → InProgress → WaitingPostMatch`
14. **Multiplayer:** GameMode é server-only — clientes não acessam. Use GameState para dados globais
15. **Server RPCs:** Para cliente se comunicar com o servidor, use funções `UFUNCTION(Server, Reliable)` no PlayerController
16. **Onde salvar dados:** Player State (por jogador, persiste morte), Game Instance (global, persiste mapas), Game State (compartilhado entre todos)
17. **Armadilha do respawn:** NUNCA salve dados persistentes no Character — são perdidos na morte
18. **HUD:** Crie no Player Controller, nunca no Character — evita memory leak e widgets empilhados
19. **UMG vs AHUD:** Use UMG Widgets com `AddToViewport` no Player Controller. A classe AHUD é legado, raramente estendida
20. **Bindings eficientes:** Use Event Bindings em Widgets (não Event Tick) para atualizar barras de vida — melhor performance

---

Este documento foi consolidado para uso com NotebookLM a partir de:
- `01_CodigoCpp/PPGameMode.md` — implementação C++ do Pirata Perdido
- `03_Sistemas/Arquitetura_GameMode_Classes.md` — framework completo do Projeto GTA
