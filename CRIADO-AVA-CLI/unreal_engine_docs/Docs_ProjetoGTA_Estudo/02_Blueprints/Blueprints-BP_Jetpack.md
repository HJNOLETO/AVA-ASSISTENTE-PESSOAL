# 🎯 Guia de Estudo: Atores Especiais de Gameplay (Jetpack & TimeOfDay)

**[Compatibilidade: UE 5.1+]**  
**[Status do Editor: Ativo em Background (PID: 11904)]**  
**[Localização dos Assets no Projeto:]** `Content/Blueprints/Actors/Jetpack/BP_Jetpack.uasset` e `Content/Blueprints/Actors/Functions/BP_TimeOfDay.uasset`  
**[Fontes de Conhecimento:]** `[Projeto Real]`, `[Documentação Epic Games]`, `[Teoria / IA]`

---

## 🎯 1. Visão Geral dos Atores Especiais

Esta documentação analisa o funcionamento lógico de dois atores utilitários fundamentais na gameplay e atmosfera do **Projeto GTA**:

1.  **`BP_Jetpack`**: Um objeto interativo complexo que permite ao jogador voar livremente pelo cenário tridimensional ao zerar sua influência gravitacional e acoplar-se ao seu esqueleto.
2.  **`BP_TimeOfDay`**: Um manipulador dinâmico de iluminação global e ciclo solar responsável pela rotação angular do céu baseado na progressão temporal do jogo.

```mermaid
graph TD
    Player[Jogador] -->|Chama Interact| Jetpack[BP_Jetpack]
    
    subgraph BP_Jetpack (Ciclo de Ativação)
        Jetpack -->|Toggle IsActive| CheckState{Ativar ou Desativar?}
        CheckState -->|Ativar| Attach[Attach Mesh to Socket 'Spine']
        Attach -->|Modify CharacterMovement| Gravity0[Set GravityScale = 0.0]
        Gravity0 -->|Spawn VFX/SFX| FX[Spawn Particles FX & JetpackSound]
        
        CheckState -->|Desativar| Detach[K2_DetachFromActor]
        Detach -->|Restore CharacterMovement| Gravity1[Set GravityScale = 1.0]
        Detach -->|Stop VFX/SFX| StopFX[Deactivate Thrusters & Sound]
    end

    subgraph BP_TimeOfDay (Ciclo Solar)
        TOD[BP_TimeOfDay] -->|Time Updates| RotationCalculus[MapRangeClamped: Horas -> Graus]
        RotationCalculus -->|Set Rotation| SunLight[Rotacionar SunLight DirectionalLight]
    end
```

---

## 🚀 2. Mecânica de Voo e Propulsão: `BP_Jetpack`
*   **Caminho do Asset:** `Content/Blueprints/Actors/Jetpack/BP_Jetpack.uasset`  
*   **Classe Pai:** `BP_InteractionObject_C` (Herança de Interação)  
*   **Metadados Brutos:** [BP_Jetpack.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Actors/Jetpack/BP_Jetpack.md)  
*   **Origem:** `[Projeto Real]`

O Jetpack é implementado como uma subclasse de interativos. Ao invés de ser um item coletado para o inventário, ele modifica diretamente o estado do Pawn físico do jogador enquanto estiver acoplado.

### A) Variáveis e Componentes Declarados
*   **`IsJetpack`** (`Boolean`): Flag de estado interna que indica se o Jetpack está atualmente ativo na gameplay do personagem.
*   **`FX_LThruster` & `FX_RThruster`** (`Niagara / Cascade Component`): Emissores de partículas de fogo e fumaça acoplados às tubeiras esquerda e direita do Jetpack.
*   **`Light_LThruster` & `Light_RThruster`** (`PointLight Component`): Luzes dinâmicas de cor quente (amarela/laranja) para simular o reflexo luminoso do fogo no chão e no personagem.
*   **`JetpackSound`** (`Audio Component`): Efeito sonoro contínuo de empuxo/turbina.
*   **`LThruster` & `RThruster`** (`StaticMesh Component`): As malhas físicas rotacionais das tubeiras (bicos propulsores).

---

### B) Ciclo de Acoplamento e Desacoplamento (`Interact`)

Quando o jogador se aproxima do Jetpack físico no cenário tridimensional e aciona a tecla de interação (`E`), o fluxo lógico executa o evento `Interact` herdado:

#### 1. Ativação do Jetpack (`IsActive = True`)
*   **Acoplamento Esquelético (`K2_AttachToComponent`):** Fixa o Jetpack à malha esquelética do jogador (`Character Mesh`). Ele se alinha automaticamente ao socket apropriado (geralmente `"Spine"` ou `"Backpack"`) mantendo regras de transformação relativas (`Keep Relative Transform`).
*   **Desativação de Gravidade (`Set GravityScale = 0`):** Obtém a referência do componente de locomoção do jogador (`CharacterMovement`) e altera o multiplicador de gravidade para `0.0`. Isso remove a força peso que puxa o personagem para baixo, simulando flutuação imediata.
*   **Inicialização dos Propulsores:** Ativa os sistemas de partículas (`SetActive(true)`), as luzes dos thrusters (`SetHiddenInGame(false)`) e toca o som contínuo de propulsão.
*   **Flag de Estado:** Seta `IsJetpack` no personagem como `True` para modificar as animações ativas e os inputs de altura.

#### 2. Desativação do Jetpack (`IsActive = False`)
*   **Desacoplamento Físico (`K2_DetachFromActor`):** Rompe o vínculo de transformações entre a malha do Jetpack e o jogador.
*   **Restauração de Física (`Set GravityScale = 1.0`):** Define a escala de gravidade no `CharacterMovement` de volta para `1.0` (gravidade padrão do jogo), fazendo com que o jogador sofra queda livre imediata.
*   **Desativação de Efeitos:** Desliga os emissores de partículas, zera a intensidade luminosa das point lights e silencia o som de turbina.

---

### C) Lógica Matemática de Rotação das Tubeiras (`ThrusterRotation`)

Um dos maiores diferenciais visuais do `BP_Jetpack` é o movimento de orientação das tubeiras dos propulsores (`LThruster` e `RThruster`) baseada na direção dos inputs do jogador, gerando uma resposta mecânica orgânica de empuxo direcional.

1.  **Função de Interpolação (`FInterpTo`):** O grafo `ThrusterRotation` realiza uma interpolação matemática suave entre a rotação atual das tubeiras e a nova rotação direcionada pelos vetores de movimentação.
2.  **Parâmetros de Entrada:** Utiliza a variável global `DeltaSeconds` (tempo desde o último frame) e uma velocidade de interpolação (`InterpSpeed`) alta para garantir resposta instantânea, porém fluida.
3.  **Geração do Rotator (`MakeRotator`):** Mapeia os inputs direcionais do jogador (frente/trás, direita/esquerda) e converte-os em ângulos de inclinação física (Pitch e Roll) das tubeiras tridimensionais.
4.  **Aplicação Relativa (`K2_SetRelativeRotation`):** Aplica a nova rotação resultante individualmente no componente `LThruster` e `RThruster`, forçando as tubeiras a se inclinarem para trás ao acelerar para a frente, ou para os lados ao fazer curvas no ar.

---

## ☀️ 3. Ciclo de Iluminação Atmosférica: `BP_TimeOfDay`
*   **Caminho do Asset:** `Content/Blueprints/Actors/Functions/BP_TimeOfDay.uasset`  
*   **Classe Pai:** `Actor`  
*   **Metadados Brutos:** [BP_TimeOfDay.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Actors/Functions/BP_TimeOfDay.md)  
*   **Origem:** `[Projeto Real]`

`BP_TimeOfDay` é um ator utilitário invisível em jogo que centraliza a transição gradual e contínua da luz do sol no cenário.

### A) Estrutura Lógica
*   **`SunLight`** (`DirectionalLight Object Reference`): Variável exposta do tipo luz direcional, que aponta diretamente para a luz mestre do sol do mapa de jogo.

### B) Algoritmo de Rotação Solar (`TimeOfDay`)
Em sintonia com a passagem temporal registrada pelo `ProjetoGameInstance` (ex: 24 horas decimais), este ator executa a função de atualização:
1.  **Validação (`IsValid`):** Confere se a referência de `SunLight` não está nula antes de tentar rotacionar a luz solar.
2.  **Mapeamento de Escala (`MapRangeClamped`):** Converte a hora atual do jogo (0.0 a 24.0) em graus de inclinação física do sol (0° a 360°):
    *   *Entrada:* Valor de tempo decimal de 0.0 a 24.0.
    *   *Saída:* Rotação de Pitch no espaço tridimensional.
3.  **Geração do Vetor Angular (`MakeRotator`):** Insere a rotação calculada no eixo de Pitch (mantendo Yaw e Roll nulos ou alinhados com o hemisfério).
4.  **Movimentação da Luz (`K2_SetActorRotation`):** Aplica a rotação calculada diretamente no ator de luz direcional, movendo as sombras projetadas dinamicamente e atualizando a claridade do mundo (amanhecer, meio-dia, entardecer, anoitecer).

---

## 🛠️ 4. Práticas Recomendadas e Correção de Desvios (Exploits & Otimização)

> [!IMPORTANT]
> **A) Prevenção de Exploits de Colisão Físico-Aérea**
> *   **Gargalo [Projeto Real]:** Ao zerar a escala de gravidade (`GravityScale = 0.0`), a Unreal Engine continua a computar a colisão padrão da cápsula do personagem (`CapsuleComponent`). Se o jogador voar em alta velocidade contra cantos fechados de tetos ou junções de paredes tridimensionais, ele pode forçar a cápsula a ultrapassar a malha física estática (*StaticMesh*), ficando preso fora do mapa ou caindo no "void".
> *   **Remediação:** 
>     1. Durante o voo com Jetpack, alterar temporariamente as propriedades de fricção e colisão lateral do jogador.
>     2. Adicionar uma verificação contínua no Event Tick: se o jogador colidir frontalmente com velocidade linear residual nula enquanto estiver usando o Jetpack, aplicar um pequeno empurrão compensatório na direção oposta ao vetor normal de impacto (`AddForce` ou `LaunchCharacter` suave).
>     3. Utilizar o nó `Sweep` na movimentação ou habilitar a verificação de detecção contínua de colisão (*CCD - Continuous Collision Detection*) no `CapsuleComponent` do jogador enquanto `IsJetpack` for verdadeiro.

> [!WARNING]
> **B) Replicação de Efeitos Visuais e Sonoros do Jetpack em Multiplayer**
> *   **Gargalo [Teoria / IA]:** Chamar `SpawnEmitter` ou `SpawnSoundAtLocation` diretamente em eventos comuns do cliente do jogador fará com que o fogo do Jetpack e o barulho de turbina sejam reproduzidos apenas para o jogador que está utilizando o item. Os outros jogadores verão o personagem flutuando estaticamente no ar sem efeitos de fogo ou ruídos, arruinando a imersão e o feedback de combate.
> *   **Remediação:**
>     1. A variável `IsJetpack` deve estar configurada como **`RepNotify`**.
>     2. A função gerada automaticamente pelo motor (`OnRep_IsJetpack`) deve gerenciar as luzes, a ativação visual das partículas dos propulsores (`FX_LThruster` e `FX_RThruster`) e a inicialização sonora.
>     3. Sendo uma propriedade replicada por notificação (`RepNotify`), a Unreal Engine executará a lógica local em todas as instâncias de cliente conectadas na partida sempre que o estado de voo mudar no servidor, mantendo todos os jogadores sincronizados visualmente.

> [!TIP]
> **C) Otimização Atmosférica: Frequência de Atualização Dynamic Lights**
> *   **Gargalo [Documentação Epic Games]:** Rotacionar a luz direcional mestre (`SunLight`) em todo Event Tick faz com que o motor recalcule o mapa de sombras dinâmicas de todo o cenário dezenas de vezes por segundo. Isso gera quedas severas de taxa de quadros (FPS), principalmente em mapas densos em vegetação e construções.
> *   **Remediação:**
>     1. Em vez de atualizar a rotação do sol a cada frame no Tick, implementar um timer no `BP_TimeOfDay` que executa a atualização apenas a cada 0.2 ou 0.5 segundos.
>     2. Utilizar interpolação de rotação gradual nas sombras para que a transição seja invisível aos olhos do jogador, reduzindo o impacto de processamento dinâmico em até 80%.
