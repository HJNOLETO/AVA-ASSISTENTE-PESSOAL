# 🎓 Masterclass Unreal Engine 5: Guia Prático Operacional (do Zero ao Intermediário)

**[Compatibilidade: Unreal Engine 5.0 - 5.5+]**  
**[Origem: CUSTOMIZADO / MANUAL DE APRENDIZADO MASTERCLASS]**

Seja bem-vindo à apostila definitiva de operação prática da Unreal Engine 5. Este guia foi desenvolvido para levar você, estudante ou desenvolvedor iniciante, a compreender **onde clicar, quais botões pressionar, quais atalhos utilizar e como estruturar do zero** as principais mecânicas que sustentam um projeto do nível de um jogo estilo GTA.

---

## 🧭 MÓDULO 1: Os 4 Painéis Cruciais do Editor de Blueprints

Ao abrir qualquer Blueprint de Ator (como um duplo clique em `BP_Character` ou `BP_Door`), a tela se divide em quatro painéis essenciais. É fundamental memorizar seus nomes e funções:

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│  [Components] (Hierarquia Física)     │  [Details] (Detalhes / Propriedades)  │
├───────────────────────────────────────┤                                       │
│  [My Blueprint]                       │                                       │
│  ├─ Grafos (EventGraph)               │                                       │
│  ├─ Funções (Functions) [ + ]         │                                       │
│  └─ Variáveis (Variables) [ + ]       │                                       │
├───────────────────────────────────────┴───────────────────────────────────────┤
│  [Viewport / Event Graph] (Área Central de Programação Visual ou Vista 3D)    │
└───────────────────────────────────────────────────────────────────────────────┘
```

1.  **`Components (Componentes)` (Canto Superior Esquerdo):**
    *   **O que é:** Controla a estrutura física do objeto.
    *   **Como operar:** Clique em **`+ Add`** para adicionar uma malha visual (`Static Mesh`), um colisor (`Box Collision`) ou som (`Audio`).
2.  **`My Blueprint (Meu Blueprint)` (Canto Esquerdo - Abaixo de Components):**
    *   **O que é:** Controla a lógica de programação.
    *   **Como operar:** Aqui você clica nos botões **`+`** (sinal de mais) ao lado de *Variables* (para guardar dados como vida e munição) e *Functions* (para programar lógicas reutilizáveis).
3.  **`Details (Detalhes)` (Lado Direito Inteiro):**
    *   **O que é:** Exibe as propriedades específicas do item que você selecionou.
    *   **Como operar:** Se você clicou em uma variável no *My Blueprint*, é no painel *Details* que definirá se ela é um Float ou Boolean e qual seu valor inicial.
4.  **`Viewport / Event Graph` (Painel Central de Trabalho):**
    *   **Viewport:** Aba visual para ver e posicionar fisicamente os componentes em 3D.
    *   **Event Graph (Grafo de Eventos):** Aba lógica onde você conecta caixas de comando (nós) usando fios de execução.

---

## ⌨️ MÓDULO 2: Atalhos Fundamentais de Produtividade

A navegação rápida economiza tempo de desenvolvimento. Decore estes atalhos fundamentais:

### A) Navegação no Viewport 3D (Mundo do Jogo)
*   **`Botão Direito do Mouse + Teclas WASD`**: Voar livremente pelo mapa em primeira pessoa.
*   **`Botão Direito do Mouse + Q / E`**: Descer (Q) e Subir (E) verticalmente no ar.
*   **`Tecla F (Focus)`**: Com um ator selecionado, aperte `F` para a câmera centralizar e aproximar instantaneamente dele.
*   **`Alt + Arrastar com Mouse`**: Com um ator selecionado no mapa, segure `Alt` e mova-o pelos eixos (setas coloridas) para criar uma cópia duplicada idêntica no mesmo local.

### B) No Grafo de Blueprints (Área de Programação)
*   **`Tecla F7 (ou clicar em Compile)`**: Compila a Blueprint (salva e traduz a lógica para o motor). **Sempre faça isso após criar variáveis ou funções.**
*   **`Ctrl + W`**: Selecione um nó de programação e aperte `Ctrl + W` para duplicá-lo instantaneamente com as mesmas configurações.
*   **`Tecla C (Comment)`**: Selecione um grupo de nós de lógica e aperte `C` para criar uma caixa de comentários envolvente. Digite o título (ex: "Sistema de Pulo") para manter o código organizado.
*   **`Reroute Node (Redirecionador):`** Dê um **duplo clique** rápido no meio de um fio de conexão para criar um nó de redirecionamento (uma bolinha). Arraste-o para dobrar fios e evitar cruzamentos confusos.

### C) No Content Browser (Gerenciador de Arquivos)
*   **`Ctrl + Space`**: Abre a gaveta de arquivos (*Content Drawer*) de forma flutuante e rápida em qualquer tela.
*   **`Ctrl + B`**: Com um ator ou asset selecionado na aba *Details* ou no cenário, aperte `Ctrl + B` para o Content Browser abrir e destacar a pasta exata onde o arquivo físico está salvo no disco.

---

## 📂 MÓDULO 3: Import, Export e Migração Segura (Migration)

A Unreal possui regras rígidas para lidar com arquivos externos. Mover arquivos de forma errada corrompe o projeto.

### A) Importação de Assets do Windows para a Unreal
1.  Abra a pasta do Windows Explorer onde estão seus assets (imagens, sons, modelos 3D).
2.  Abra o Unreal Editor e selecione a pasta de destino no **Content Browser**.
3.  **Clique e arraste** os arquivos diretamente para dentro da janela do *Content Browser*.
4.  **Configurações de Importação:**
    *   **Modelos 3D (FBX):** Se o modelo for um personagem ou monstro com animações, marque **`Skeletal Mesh`**. Se for um objeto estático (prédio, copo, arma), desmarque *Skeletal Mesh* (ele virará um **`Static Mesh`**).
    *   **Texturas (PNG/TGA):** A Unreal as converterá em texturas do motor. Para mapas de relevo, certifique-se de que a opção **`Normal Map`** seja reconhecida (a textura ficará azulada/roxa).
    *   **Áudios:** Devem estar estritamente no formato **`WAV` de 16-bit com taxa de amostragem de 44.1kHz**. O motor não aceita MP3 nativo para efeitos de jogo.

### B) Exportação de Assets
1.  Clique com o botão direito no asset dentro do Content Browser.
2.  Navegue até **`Asset Actions (Ações do Asset)`** e selecione **`Export (Exportar)`**.
3.  Escolha a pasta no seu computador para salvá-lo como FBX, TGA ou WAV original.

### C) O Sistema de Migração (Migration)
> [!CAUTION]
> **NUNCA COPIE ARQUIVOS `.uasset` DIRETAMENTE PELO WINDOWS EXPLORER.**
> A Unreal mapeia as relações de arquivos usando caminhos absolutos baseados na pasta principal (`/Game/...`). Se você copiar um arquivo de material diretamente de uma pasta do Windows para outra, as referências de texturas quebrarão e o objeto ficará cinza.

#### Como mover assets de forma segura de um projeto para outro (Migrate):
1.  No Content Browser do projeto de origem, clique com o botão direito no asset que deseja mover (ex: `BP_Character`).
2.  Navegue em **`Asset Actions`** e clique em **`Migrate... (Migrar)`**.
3.  Uma janela listará o asset selecionado e **todos os arquivos dependentes dele** (texturas, materiais, malhas, sons). Clique em **`OK`**.
4.  A Unreal abrirá a seleção de pastas do Windows. Você deve localizar a pasta do projeto destino e clicar **estritamente sobre a pasta `Content` mestre**. Nunca escolha subpastas.
5.  Clique em **`Selecionar Pasta`**. O motor copiará recursivamente todos os arquivos necessários mantendo as conexões e os caminhos `/Game/` intactos.

---

## 🎨 MÓDULO 4: Criação de Materiais e Instâncias (Material Instances)

Materiais controlam a aparência visual 3D (cor, brilho, rugosidade) de um objeto.

### A) Criando um Material Base do Zero
1.  No Content Browser, clique com o botão direito em uma área vazia e selecione **`Material`**. Nomeie como `M_Base_Character`.
2.  Dê um duplo clique para abrir o Grafo de Materiais. Você verá um nó mestre grande com vários pinos de entrada:
    *   **Base Color (Cor Base):** A cor da textura.
    *   **Metallic (Metálico):** Controla se o objeto reflete luz como metal (0.0 = plástico/tecido, 1.0 = metal puro).
    *   **Roughness (Rugosidade):** Controla o polimento (0.0 = espelho super polido e brilhante, 1.0 = opaco/fosco).
    *   **Normal:** Entrada para mapas de relevo que simulam texturas tridimensionais (como rachaduras em paredes).

### B) Parametrizando o Material (Preparando para Otimização)
Para evitar ter que criar um novo material completo toda vez que quiser mudar apenas uma cor (o que consome memória e tempo de compilação da GPU), crie **parâmetros**:
1.  Clique com o botão direito no grafo de materiais e digite **`Vector Parameter`** (Parâmetro de Vetor). Renomeie para `CorDaRoupa`. Ligue sua saída no pino **Base Color** do nó mestre.
2.  Segure a tecla **`1`** no teclado e clique no grafo para criar uma constante de canal único. Clique nela com o botão direito e selecione **`Convert to Parameter`** (Converter em Parâmetro). Renomeie para `Brilho`. Conecte no pino **Roughness**.
3.  Clique em **`Apply`** e **`Save`** no canto superior esquerdo.

```
[Vector Parameter: CorDaRoupa] ─────────> Base Color (Nó Mestre)
[Scalar Parameter: Brilho]     ─────────> Roughness  (Nó Mestre)
```

---

### C) Criando e Editando uma Instância de Material (Material Instance)
A instância é um filho do material mestre que herda os grafos de cálculo, permitindo alterar os parâmetros instantaneamente sem recompilação:
1.  No Content Browser, clique com o botão direito sobre o seu material `M_Base_Character` e selecione **`Create Material Instance (Criar Instância de Material)`**. Nomeie como `MI_Character_Blue`.
2.  Abra a instância com duplo clique.
3.  No lado direito (painel Details), marque as caixas de seleção de `CorDaRoupa` e `Brilho` para ativá-las.
4.  Clique na cor para alterá-la para azul e deslize o valor de brilho. A alteração ocorrerá instantaneamente na tela 3D.
5.  **Como aplicar no Ator:** Abra a Blueprint do seu personagem, selecione o componente de Malha (**Mesh**), procure a seção **Materials** no painel *Details*, selecione a caixa do material e aplique a instância `MI_Character_Blue` usando a **Seta Curva** ou a **Lupa**.

---

## 🛡️ MÓDULO 5: O Sistema de Colisões Completo

Colisões impedem que objetos atravessem paredes e detectam quando o jogador entra em áreas interativas.

### A) As Predefinições de Colisão (Collision Presets)
Ao selecionar qualquer componente com física (como uma malha ou colisor) no painel *Components*, localize a seção **`Collision`** na aba *Details* do lado direito. Você verá a propriedade **`Collision Presets`**:
1.  **`NoCollision (Sem Colisão):`** O objeto fica totalmente intangível. Tudo passa por dentro dele sem registrar qualquer física ou evento (excelente para folhas, poeira ou luzes).
2.  **`BlockAll (Bloquear Tudo):`** Bloqueia a passagem física de qualquer objeto sólido, projétil ou câmera (usado para o chão, paredes e tetos).
3.  **`OverlapAll (Sobrepor Tudo):`** Não impede o movimento físico (os personagens passam por dentro), mas gera notificações lógicas (Eventos de Overlap) ao entrar e sair da área (perfeito para moedas de coletar, portas automáticas e triggers de missão).

---

### B) Diferença Prática: Block vs Overlap

```
   [ BLOQUEIO FÍSICO: BLOCK ]                       [ DETECTOR DE ÁREA: OVERLAP ]
┌───────────────────────────────┐               ┌───────────────────────────────┐
│           Paredes / Chão      │               │          Trigger Box / Itens  │
├───────────────────────────────┤               ├───────────────────────────────┤
│                               │               │                               │
│  👦 ───> ⛔ (Bloqueia)         │               │  👦 ───────> 🚶 (Atravessa)    │
│                               │               │                               │
│  * Ativa: Event ReceiveHit    │               │  * Ativa: Event BeginOverlap  │
└───────────────────────────────┘               └───────────────────────────────┘
```

*   **`Block (Bloqueio):`** Usado quando o objeto deve atuar como uma barreira rígida.
    *   *Gatilha:* O evento **`Event ReceiveHit`** no Blueprint.
*   **`Overlap (Sobreposição):`** Usado quando o objeto atua como um sensor de área invisível.
    *   *Gatilha:* O evento **`Event ActorBeginOverlap`** ou **`OnComponentBeginOverlap`** no Blueprint.

---

### C) Configurando Canais de Colisão Personalizados
Para fazer um projétil atravessar folhagens, mas bater em paredes e inimigos, use a colisão customizada:
1.  Mude o campo `Collision Presets` para **`Custom...`**.
2.  Abaixo, uma tabela de canais será liberada contendo colunas para **Ignore (Ignorar)**, **Overlap (Sobrepor)** e **Block (Bloquear)**.
3.  Mapeie as opções:
    *   *Ignore:* O objeto ignora colisores deste tipo.
    *   *Block:* O projétil colidirá e parará ao encostar em objetos mapeados neste canal.

---

## 👤 MÓDULO 6: Inserção, Configuração e Troca de Manequins (Mesh Swapping)

Para trocar o modelo visual do personagem (o pirata padrão do projeto por outro modelo 3D importado):

1.  Abra a Blueprint do seu personagem (`BP_Character`).
2.  No painel **Components** (canto esquerdo), clique e selecione o componente **`Mesh (CharacterMesh0)`**.
3.  Olhe para o painel **Details** (lado direito) e localize a categoria **`Mesh`**.
4.  No campo **`Skeletal Mesh`**, clique na caixa de seleção atual. 
    *   *Opção de Lupa:* Clique e procure o novo esqueleto importado pelo nome.
    *   *Opção de Seta:* Selecione o esqueleto do manequim desejado no Content Browser e clique na seta curva para aplicá-lo instantaneamente.
5.  **Ajuste de Rotação e Escala (Muito Importante):** Manequins importados costumam vir apontando para a direção errada ou flutuando acima do chão. 
    *   Clique no componente `Mesh` e vá no painel Details em **`Transform -> Rotation`**. Ajuste o eixo **Z (Yaw) para `-90.0` graus** (isso fará o personagem olhar na direção correta da seta azul indicadora de frente da cápsula).
    *   Ajuste a **Location Z para `-90.0`** (ou o valor necessário para alinhar os pés do manequim exatamente com a base da cápsula de colisão).
6.  **Ajuste do Animator:** No campo **`Anim Class`** logo abaixo da malha no painel Details, selecione a Animation Blueprint compatível com o novo esqueleto para ativar os movimentos.

---

## 🏃 MÓDULO 7: Sistema de Locomoção (Walk, Run, Crouch, Idle)

A movimentação orgânica é construída dividindo o controle de inputs, o ajuste físico de velocidades no motor e a mesclagem visual de animações baseada nessas velocidades.

### A) Ajustes Físicos no `CharacterMovementComponent`
Selecione o componente **`CharacterMovement`** na aba *Components* do seu personagem e configure no painel *Details*:
1.  **Caminhar / Correr:** Procure pela variável **`Max Walk Speed (Velocidade Máxima de Caminhada)`**. Defina como `300.0` (velocidade de caminhada). Quando o jogador pressionar o botão de correr (Shift), mude esta variável via programação Blueprint (`Set Max Walk Speed`) para `600.0` (velocidade de corrida).
2.  **Agachar:** Procure por **`Can Crouch (Pode Agachar)`** e marque como `True`. Em seguida, defina **`Max Walk Speed Crouched`** para `150.0` (velocidade agachada mais lenta).

---

### B) Criação de Blend Spaces (Mistura de Animações)
O **Blend Space** é um ativo especial que lê a velocidade atual do jogador no motor e calcula automaticamente a transição de pose (de parado para caminhando e depois correndo) de forma suave:
1.  No Content Browser, clique com o botão direito, vá em **`Animation`** e selecione **`Blend Space`**. Escolha o esqueleto correspondente ao seu personagem e nomeie como `BS_Locomotion`.
2.  Abra o `BS_Locomotion`.
3.  No painel esquerdo (Details), configure o eixo horizontal **`Horizontal Axis`**:
    *   *Name:* `Speed`
    *   *Minimum Axis Value:* `0.0`
    *   *Maximum Axis Value:* `600.0` (velocidade máxima de corrida).
4.  Arraste suas animações da aba de assets (canto inferior direito) direto para a grade de Blend Space:
    *   Posicione a animação de **Idle (Parado)** no valor de velocidade `0.0`.
    *   Posicione a animação de **Walk (Caminhada)** no valor de velocidade `300.0`.
    *   Posicione a animação de **Run (Corrida)** no valor de velocidade `600.0`.
5.  Ao mover o mouse segurando `Ctrl` sobre a grade, o personagem fará a transição física suave de poses de movimento. Salve o arquivo.

---

### C) Máquinas de Estado na Blueprint de Animação (AnimGraph)
Para ligar o Blend Space ao fluxo de animação do jogo, usamos Máquinas de Estado dentro da Animation Blueprint (`AnimBP_Character`):
1.  Abra a aba **AnimGraph** da sua Animation Blueprint.
2.  Clique com o botão direito e selecione **`State Machine`**. Dê duplo clique para abri-la.
3.  **Criando Estados:** Arraste um fio do nó inicial `Entry` e selecione **`Add State`**. Nomeie para `Idle_Run`. Dê duplo clique para abrir esse estado.
4.  Arraste o seu Blend Space `BS_Locomotion` criado anteriormente para dentro desse grafo. Ligue sua saída no pino **Output Pose**.
5.  Crie uma variável Float chamada `Velocidade` no painel esquerdo da AnimBP (atualizada a cada Tick pelo EventGraph lendo a velocidade do jogador). Conecte esta variável no pino de entrada `Speed` do Blend Space.

```
          ┌──────────────┐
[Entry] ─>│   Idle_Run   │ (Grafo Interno: BS_Locomotion <── Variable: Velocidade)
          └──────────────┘
```

---

## 🤖 MÓDULO 8: Inteligência Artificial (IA) e Behavior Trees

Para criar inimigos inteligentes que patrulham e perseguem o jogador ativamente pela cena:

### A) Habilitando a Navegação no Mapa (NavMesh)
A Inteligência Artificial precisa saber onde há chão transitável e onde há obstáculos intransponíveis.
1.  No menu superior do mapa principal, clique no botão de adição **`+` (Add)** ou vá em `Window -> Place Actors`.
2.  Procure por **`NavMeshBoundsVolume`** na barra de pesquisa e arraste o volume verde direto para a cena tridimensional.
3.  Selecione o volume colocado e, no painel Details, aumente sua escala (**`Scale`**) tridimensional (X, Y, Z) até cobrir todo o terreno e construções do seu jogo.
4.  **Aperte a tecla `P` no seu teclado.** O chão do cenário que for válido para a movimentação da IA ficará pintado de **verde brilhante**. Áreas com obstáculos (como paredes) ficarão sem cor, indicando que a IA não pode colidir ali.

---

### B) Estruturando o AI Controller e a Memória (Blackboard)
A IA de jogo precisa de um cérebro controlador e de uma memória de curto prazo:
1.  **AI Controller:** Crie uma Blueprint class selecionando a classe pai **`AIController`**. Nomeie como `AIC_Enemy`. É neste controlador que iniciaremos a árvore de comportamentos no `BeginPlay`.
2.  **Blackboard (BB) - Memória:** Clique com o botão direito no Content Browser, vá em **`Artificial Intelligence`** e crie um **`Blackboard`**. Nomeie como `BB_Enemy`.
    *   *Criando chaves de memória:* Abra o Blackboard e adicione chaves no painel esquerdo:
        *   Crie uma chave do tipo Object chamada **`TargetActor`** (usada para armazenar o jogador a ser perseguido).
        *   Crie uma chave do tipo Vector chamada **`PatrolLocation`** (usada para patrulhas).

---

### C) Programando a Árvore de Comportamento (Behavior Tree)
A **Behavior Tree (BT)** dita a ordem de tomadas de decisão da IA.
1.  Crie um **`Behavior Tree`** no Content Browser (`Artificial Intelligence -> Behavior Tree`). Nomeie como `BT_Enemy`.
2.  Abra o `BT_Enemy` e associe seu Blackboard correspondente no menu superior direito.
3.  **Compreendendo os Nós Organizadores (Composite Nodes):**
    *   **`Selector (Seletor):`** Executa seus filhos da esquerda para a direita. Se um filho falhar, ele tenta o próximo. Ele para na primeira vitória (usado para decidir entre diferentes estados como "Se puder atacar, ataque. Se não, persiga. Se não, patrulhe").
    *   **`Sequence (Sequência):`** Executa seus filhos da esquerda para a direita. Para no primeiro que falhar. Exige que todos vençam para completar (usado para ações sequenciais como "Mova-se até a parede -> Espere 2 segundos -> Gire a câmera").

#### Configurando a Perseguição Simples na Árvore:
No grafo da Behavior Tree, puxe um fio do nó raiz `Root` e adicione um nó **Sequence**:
1.  Puxe um fio do Sequence e adicione a tarefa nativa **`Move To`** (Mover para).
2.  Selecione o nó `Move To` colocado e, no painel Details do lado direito, mude a propriedade **`Blackboard Key`** para apontar para a nossa chave **`TargetActor`** (o jogador).
3.  Para atualizar a referência do jogador na memória continuamente:
    *   No C++ ou no Event Graph do AI Controller, faça uma verificação de proximidade (`Get Distance To` jogador). Se o jogador estiver perto, use o nó **`Set Value as Object`** no Blackboard, passando a referência do jogador para preencher a chave `TargetActor`.
    *   Assim que o Blackboard for preenchido, a Behavior Tree ativará a tarefa `Move To`, fazendo o inimigo correr fisicamente na direção do jogador pela rota verde calculada pelo NavMesh.

```
       ┌────────┐
       │  Root  │
       └────────┘
           │
       ┌────────┐
       │Sequence│
       └────────┘
           │
     ┌───────────┐
     │  Move To  │ ──> (Blackboard Key Target: TargetActor)
     └───────────┘
```
