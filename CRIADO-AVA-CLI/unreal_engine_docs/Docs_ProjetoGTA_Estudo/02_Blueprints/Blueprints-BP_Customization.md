# 🎯 Guia de Estudo: Subsistema de Customização de Personagem (Character Customization)

**[Compatibilidade: UE 5.1+]**  
**[Status do Editor: Ativo em Background (PID: 11904)]**  
**[Localização dos Assets no Projeto:]** `Content/Blueprints/Character/...` e `Content/Blueprints/UMG/W_CustomCharacter.uasset`  
**[Fontes de Conhecimento:]** `[Projeto Real]`, `[Documentação Epic Games]`, `[Teoria / IA]`

---

## 🎯 1. Visão Geral do Sistema de Customização

O **Projeto GTA** disponibiliza um cenário exclusivo de customização visual do jogador. Este fluxo desliga a jogabilidade em terceira pessoa padrão e posiciona a câmera em foco sobre um manequim estático tridimensional. 

O jogador interage com botões gráficos (Widget UMG) para alterar a aparência do personagem e pode clicar e arrastar com o mouse (ou usar botões) para rotacionar a malha do pirata em tempo real no cenário de testes.

O subsistema é constituído por três assets principais:
1.  **`BP_CharacterViewer`**: O ator que representa a réplica física/visual do jogador. Ele gerencia as entradas de Enhanced Input para rotação manual e as chamadas de timers de rotação automática pelos botões.
2.  **`MenuCustom_GM`**: O GameMode configurado que substitui as regras de gameplay, forçando o spawn do viewer e desativando a movimentação de exploração.
3.  **`W_CustomCharacter`**: A interface de usuário que desenha as opções de customização e as setas direcionais de rotação na tela.

---

## 👤 2. Manequim de Visualização: `BP_CharacterViewer`
*   **Caminho do Asset:** `Content/Blueprints/Character/BP_CharacterViewer.uasset`  
*   **Classe Pai:** `Character` (Nativo)  
*   **Metadados Brutos:** [BP_CharacterViewer.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Character/BP_CharacterViewer.md)  
*   **Origem:** `[Projeto Real]`

### A) Variáveis de Estado
*   **`MousePressed`** (`Boolean`): Indica se o botão esquerdo do mouse (`LMB`) está sendo pressionado na tela. É a flag usada para habilitar a rotação por arrasto do mouse.
*   **`RotateTimer`** (`TimerHandle`): Manipulador de timer de repetição contínua para girar o personagem automaticamente enquanto o jogador clica e segura os botões da UI.
*   **`RotateCamera?`** (`Boolean`): Flag secundária que define se o input do mouse deve girar a câmera (SpringArm) ou diretamente a malha do personagem.

---

### B) Rotação por Botões da UI (Timer Delegate)

Para realizar o giro contínuo do personagem ao segurar um botão na tela (como as setas esquerda `<-` e direita `->`), o `BP_CharacterViewer` utiliza uma arquitetura baseada em **Timers por Delegate**:

```mermaid
graph TD
    UILeft[Botão UI pressionado: LeftButton] --> CallLeft[Event RotateLeft]
    UIRight[Botão UI pressionado: RightButton] --> CallRight[Event RotateRight]
    
    subgraph BP_CharacterViewer (Timer Loop)
        CallLeft --> TimerL[Set Timer by Delegate: EventRotateLeft, Loop=True]
        CallRight --> TimerR[Set Timer by Delegate: EventRotateRight, Loop=True]
        
        TimerL --> ExecuteL[Executa: EventRotateLeft]
        TimerR --> ExecuteR[Executa: EventRotateRight]
        
        ExecuteL --> RotL[RotateCharacter: Incrementar rotação Yaw negativa]
        ExecuteR --> RotR[RotateCharacter: Incrementar rotação Yaw positiva]
    end
    
    UIRelease[Botão Liberado / Click Finished] --> Stop[Event EventStopRotate]
    Stop --> ClearTimer[Clear and Invalidate Timer Handle: RotateTimer]
```

1.  **`RotateLeft` / `RotateRight`**: Eventos customizados disparados ao interagir com a UI. Eles configuram o manipulador **`RotateTimer`** através do nó **`SetTimerByDelegate`** com a propriedade `Looping = True` ativa, programada para disparar uma fração de segundos.
2.  **`EventRotateLeft` / `EventRotateRight`**: Funções chamadas consecutivamente a cada disparo do timer. Elas chamam a lógica central `RotateCharacter` passando valores de rotação positiva ou negativa.
3.  **`EventStopRotate`**: Quando o botão da UI é liberado, este evento é chamado. Ele executa o nó **`ClearAndInvalidateTimerHandle`** limpando o `RotateTimer`, interrompendo o giro instantaneamente.

---

### C) Rotação Manual por Clique e Arrasto
Além dos botões, o jogador pode rotacionar o manequim clicando sobre o personagem e arrastando o mouse lateralmente:
1.  **Monitoramento do Clique (`IA_MousePressed`):** Enhanced Input que altera o booleano `MousePressed` para `True` no clique e para `False` ao soltar o mouse.
2.  **Entrada Bidimensional (`IA_LookMouse`):** Enhanced Input de eixo 2D (Mouse X/Y). Quando disparado, se `MousePressed` for verdadeiro:
    *   Chama a função **`RotateCharacter`**.
    *   Utiliza a coordenada decimal do Mouse X (horizontal) como multiplicador multiplicando-a pelo `DeltaTime` global.
3.  **Modificação Relativa (`K2_SetRelativeRotation`):** Aplica o novo cálculo de incremento de Yaw (Z) no componente de malha (**`Mesh`**) ou no braço de câmera (**`SpringArm`**), permitindo ver o personagem de todos os ângulos.

---

## 🖥️ 3. Interface Visual e Regras de Nível

### A) Widget de Customização: `W_CustomCharacter`
*   **Caminho do Asset:** `Content/Blueprints/UMG/W_CustomCharacter.uasset`  
*   **Metadados Brutos:** [W_CustomCharacter.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Widget-HUD/UI/W_CustomCharacter.md)

O design visual renderiza os botões de navegação e as opções gráficas:
*   **`LeftButton`** e **`RightButton`**: Botões de cor azul (`BackgroundColor = Blue`) posicionados em um alinhamento horizontal (`HorizontalBox_69`) contendo textos `<-` e `->` para rotação de câmera.
*   **Comutadores de Aparência:** Setas adicionais que realizam chamadas para funções ou interfaces no `BP_CharacterViewer` para alternar cores de roupas, cabelos ou acessórios.

### B) Setup do GameMode: `MenuCustom_GM`
*   **Caminho do Asset:** `Content/Blueprints/Character/MenuCustom_GM.uasset`  
*   **Metadados Brutos:** [MenuCustom_GM.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Character/MenuCustom_GM.md)

GameMode específico que desabilita a locomoção de exploração e configura a interface no início do jogo (`BeginPlay` no `BP_CharacterViewer`):
1.  **Criação do Painel:** Executa o nó `CreateWidget` referenciando `W_CustomCharacter` e insere na tela com `AddToViewport`.
2.  **Exibição de Cursor:** Altera a flag do controlador **`bShowMouseCursor`** para `True`.
3.  **Foco de Input Híbrido:** Chama a função **`SetInputMode_GameAndUIEx`** com foco principal no widget, mas permitindo que a janela 3D registre cliques de física de arrastar do mouse no viewer.

---

## 🛠️ 4. Práticas Recomendadas e Correção de Desvios (Bloqueio de Foco e Input)

> [!IMPORTANT]
> **A) Resolução do Bug de Perda de Foco do Cursor do Mouse**
> *   **Gargalo [Documentação Epic Games]:** Em telas de customização que misturam cliques tridimensionais (arrastar manequim) com botões bidimensionais (UI), é muito comum que o cursor suma ou perca o foco lógico ao clicar rápido repetidamente na borda dos botões. O jogo passa a registrar cliques diretamente na tela de gameplay invisível de fundo, impedindo o jogador de clicar nos botões novamente.
> *   **Remediação:** 
>     1. No nó `SetInputMode_GameAndUIEx`, garantir que o parâmetro **`LockMouseToViewportBehavior`** esteja configurado como `LockAlways` ou `LockInFullscreen`.
>     2. Sempre que a HUD de customização for recriada ou exibida, forçar uma chamada da biblioteca estática `CenterMousePosition` de [BP_Functions](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Utilities.md) para restaurar a ancoragem lógica do mouse e evitar a dessincronização do ponteiro.

> [!WARNING]
> **B) Otimização de Performance: Desativação do Event Tick no Manequim**
> *   **Gargalo [Teoria / IA]:** Manter o Event Tick ativado em atores de visualização estática como manequins de loja ou telas de customização para monitorar se o mouse foi liberado ou para atualizar rotações é um desperdício contínuo de processamento na CPU.
> *   **Remediação:**
>     *   Zerar a propriedade **`Start With Tick Enabled`** nas configurações padrões do `BP_CharacterViewer`.
>     *   Implementar a rotação inteiramente orientada a eventos através dos delegates de Enhanced Input (`IA_LookMouse`) e das chamadas de Timers sob demanda (`SetTimerByDelegate`). Desta forma, nenhum código será processado nos frames ociosos em que o jogador não estiver rotacionando o personagem.
