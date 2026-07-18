# 👤 Pendências do Usuário no Unreal Editor

Esta lista de tarefas contém as ações manuais que devem ser realizadas por você diretamente no Unreal Editor para aplicar as soluções sugeridas. 

---

## 🟩 1. [RESOLVIDO] Criar e Configurar Input de Recarga (Enhanced Input)

Esta tarefa resolve o problema de **a recarga não funcionar** por falta de uma vinculação de entrada (Input Action) associada à tecla `R`.

### O que fazer:
1. **Criar a InputAction:**
   * No painel **Content Browser**, navegue até a pasta de Inputs do seu projeto (ex: `/Game/Blueprints/Input/` ou `/Game/Input/`).
   * Clique com o botão direito, selecione **Input -> Input Action**.
   * Nomeie o arquivo como `IA_Reload`.
   * Abra o arquivo e defina o **Value Type** como `Digital (bool)`. Salve e feche.
2. **Adicionar ao Contexto de Mapeamento:**
   * Abra o seu contexto ativo de mapeamento, ex: `IMC_Default` (ou `IMC_PirateCharacter`).
   * Clique no botão `+` em **Mappings**, selecione `IA_Reload`.
   * Clique no ícone de teclado e pressione a tecla `R` no seu teclado físico para vinculá-la. Salve e feche.
3. **Vincular no Event Graph do Personagem:**
   * Abra o Blueprint do seu personagem jogável (ex: `BP_Character` ou `ALS_Base_CharacterBP`).
   * No **Event Graph** principal, clique com o botão direito e adicione o evento `IA_Reload` (sob *Enhanced Action Events*).
   * Obtenha a referência da variável do componente de armas (ex: `WeaponSystem` ou `AC_WeaponSystem`).
   * Arraste a partir dela e chame a função/evento `Reload`.
   * Conecte o pino de execução **Started** do evento `IA_Reload` ao nó `Reload` do componente.
   * Compile e salve o Blueprint.

---

## 🟥 2. [PENDENTE] Corrigir Coleta de Munição com Arma Guardada (Holster Bug)

Esta tarefa corrige a falha em `BP_AmmoBase` que rejeita munição quando o personagem passa por cima de um pickup estando com os punhos limpos/arma guardada (`CurrentWeapon` nulo).

### O que fazer:
1. **Simplificar o Grafo em `BP_AmmoBase`:**
   * Abra o Blueprint `BP_AmmoBase`.
   * Delete as conexões e os nós de verificação `IsValid` de `CurrentWeapon` e a verificação do slot `GET [0]`.
   * Conecte o pino **Cast Succeeded** do nó `Cast to ALS_Base_CharacterBP` diretamente à chamada de interface `Ammo Pickup` (Target/Alvo: Personagem).
   * Conecte a saída de `Ammo Pickup` diretamente ao nó `Destroy Actor`.
2. **Configurar a variável `Ammo Type`:**
   * No painel de variáveis (lado esquerdo), selecione a variável **`Ammo Type`** (do tipo `AmmoType` enum) que alimenta o nó de mensagem `Ammo Pickup`.
   * No painel de **Detalhes** (lado direito), mude o **Default Value** de `CurrentWeapon` para **`WeaponID`** (Enumerator 2).
   * Certifique-se de que a variável `Weapon ID` do coletável tem o mesmo nome da ID de sua arma cadastrada (ex: `Rifle`, `Pistol`).
   * Compile e salve o Blueprint.

---

## 🟥 3. [PENDENTE] Limpeza do Menu Radial e Desacoplamento Lógico

Esta tarefa corrige o desvio arquitetural de aninhamento invertido do inventário global dentro de uma subpasta gráfica de menu radial.

### O que fazer:
1. **Criar a nova pasta física:**
   * No Content Browser, crie a pasta `/Game/Blueprints/UMG/Inventory/`.
2. **Mover o Widget:**
   * Arraste o arquivo `UMG_Inventory.uasset` de dentro de `Content/Blueprints/UMG/RadialMenu/` para a nova pasta criada. Escolha **Move Here**.
3. **Corrigir os Redirectores:**
   * Clique com o botão direito sobre a pasta raiz `Content/` e selecione **Fix Up Redirectors in Folder** para limpar links quebrados automaticamente no motor de jogo.
4. **Interface de Comunicação:**
   * Crie uma **Blueprint Interface** chamada `BPI_RadialMenuController` para intermediar os sinais angulares sem que o menu dependa diretamente das variáveis internas do inventário principal.

---

## 🟥 4. [PENDENTE] Corrigir Loop Infinito nos Modos de Disparo (Crash ao Recarregar Sem Arma / Punhos)

Esta tarefa corrige o crash que ocorre quando o jogador tenta recarregar sem nenhuma arma equipada (ou com os punhos/unarmed ativos) devido a um loop recursivo infinito de fallbacks de modo de disparo em `BP_WeaponBase`.

### O que fazer:
1. **Abrir a Função Afetada:**
   * Abra o Blueprint mestre `/Game/Blueprints/Weapons/BP_WeaponBase`.
   * Dê dois cliques na função **`Set Mode Auto`** (ou `SetMode_Auto`) na aba lateral esquerda.
2. **Remover Conexão de Fallback Direta:**
   * Localize o nó **`Ramificação`** (Branch) que verifica `Full Auto Mode`.
   * Desconecte a execução do pino **`False`** que vai para a chamada da função `Set Mode Single Shot`.
3. **Inserir Verificação de Modos Suportados:**
   * Adicione um nó **`Boolean OR`** (operador lógico `OU`).
   * Puxe a variável `Weapon Data`, quebre a estrutura (`Quebrar S_WeaponData`) e conecte `Single Shot Mode` e `Burst Shot Mode` nas duas entradas do nó `OR`.
   * Crie um novo nó **`Ramificação`** (Branch) e conecte a saída do nó `OR` à sua entrada `Condition`.
   * Conecte o pino **`False`** do primeiro Branch no pino de entrada (exec) deste novo Branch.
4. **Reconectar com Segurança:**
   * Conecte a saída **`True`** do novo Branch à chamada de função **`Set Mode Single Shot`**.
   * Deixe a saída **`False`** do novo Branch **desconectada** (isso interrompe o fluxo com segurança se nenhum modo for suportado).
5. **Configurar Punhos (Dica de Prevenção):**
   * Abra o Blueprint de punhos/unarmed (ex: `BP_Fists` ou similar).
   * Garanta que no painel de detalhes da variável padrão `WeaponData`, o booleano `Single Shot Mode` esteja marcado como `True` (ativo).
   * Compile e salve ambos os Blueprints.

---

## 🟩 5. [RESOLVIDO] Corrigir Arma Presa nas Costas (Holster Bug - AttachInHand)

Esta tarefa corrige a falha que faz com que a arma física permaneça grudada no coldre/costas do personagem, mesmo quando ele muda para o modo de mira/equipado.

### O que fazer:
1. **Abrir o Event Graph do Blueprint Mestre de Armas:**
   * Abra o Blueprint `/Game/Blueprints/Weapons/BP_WeaponBase`.
   * Navegue até o **Event Graph** principal.
2. **Localizar o Evento `AttachInHand`:**
   * Procure pelo nó do evento personalizado chamado **`AttachInHand`** (geralmente sob um comentário ou caixa organizadora de saque/holster).
3. **Identificar o Nó de Anexo Incorreto:**
   * Localize o nó **`K2_AttachToComponent`** que é executado imediatamente após o evento `AttachInHand`.
   * Note que o pino **`Target`** (Alvo) desse nó está conectado à variável **`Magazine`** (Static Mesh Component).
4. **Reconectar ao Mesh da Arma:**
   * **Desconecte** a variável `Magazine` do pino `Target` (Alvo).
   * Obtenha a referência do componente de malha principal da arma (geralmente **`WeaponMesh`** ou **`Mesh`**, do tipo *Skeletal Mesh Component* ou *Static Mesh Component* que representa o corpo da arma). Arraste esta variável para o grafo.
   * Conecte a nova referência do mesh principal da arma (ex: `WeaponMesh`) ao pino **`Target`** (Alvo) do nó `K2_AttachToComponent`.
5. **Configurar o Soquete e Regras:**
   * No pino **`Socket Name`** do nó `K2_AttachToComponent`, você pode obter o valor correto dinamicamente:
     * Puxe um fio da variável struct `Weapon Data`, use o nó **`Break S_WeaponData`** e conecte o campo **`HandSocket`** (tipo Name) diretamente ao pino `Socket Name`.
     * *(Alternativa simples)*: Você pode digitar manualmente o soquete padrão da mão direita do manequim (ex: `hand_rSocket`), mas usar `WeaponData -> HandSocket` é a melhor prática recomendada por permitir soquetes específicos por arma.
   * Garanta que os pinos **`Location Rule`**, **`Rotation Rule`** e **`Scale Rule`** estejam todos definidos como **`Snap to Target`**.
6. **Compilar e Salvar:**
   * Compile e salve o Blueprint `BP_WeaponBase`.

---

## 🟩 6. [RESOLVIDO] Adicionar Socket "Muzzle" no Mesh da Arma (Erro de Muzzle Desaparecido - Beretta e MP5 Resolvidos)

Esta tarefa corrige o aviso de erro `NÃO FOI ENCONTRADO O SOCKET "MUZZLE" NA ARMA!!!` e permite que o sistema identifique a ponta física do cano para spawnar partículas de disparo e projéteis no local correto. O usuário já adicionou e configurou com sucesso na pistola Beretta (direto no osso `base`) e na MP5.

### O que fazer (Caso precise adicionar em novas armas):
1. **Localizar a Malha 3D da Arma Ativa:**
   * No Content Browser, navegue até a pasta onde estão os assets 3D de suas armas (ex: `/Game/FPS_Weapon_Bundle/` ou na pasta de malhas correspondente).
   * Identifique o asset da malha (Static Mesh ou Skeletal Mesh) da arma que você está testando (ex: a malha do rifle, como `SM_AK47`, `SK_Rifle_01` ou similar).
2. **Abrir o Visualizador de Malha:**
   * Dê dois cliques na malha 3D para abrir o editor correspondente (Static Mesh Editor ou Skeletal Mesh Editor).
3. **Adicionar um Novo Soquete (Socket):**
   * No painel lateral **Socket Manager** (Gerenciador de Sockets), clique no botão **`+ Add Socket`** (ou clique com o botão direito sobre um osso/referência e escolha *Add Socket*).
   * Renomeie o soquete criado para exatamente **`Muzzle`** (respeitando maiúsculas e minúsculas).
4. **Posicionar o Soquete:**
   * Use os manipuladores de movimento no visualizador 3D para arrastar o socket `Muzzle` até a extremidade física do cano da arma (na ponta de saída da bala).
   * Certifique-se de que a seta vermelha (eixo X) do soquete esteja apontando para a frente (direção para onde o tiro deve ir).
5. **Salvar o Asset:**
   * Clique em **Save** no topo do editor de malha e feche a janela.
6. **Repetir para Outras Armas (Opcional):**
   * Caso use outras armas filhas (como pistolas ou escopetas), repita este processo adicionando o socket `Muzzle` em suas respectivas malhas 3D.

---

## 🟩 7. [RESOLVIDO] Corrigir Arma Caindo ao Andar ou Pegar Munição (Colisão no Pickup)

Esta tarefa corrige o bug onde o personagem solta a arma ativa ao andar ou passar perto de caixas de munição, causado pela colisão da arma em mãos permanecer ativa por 0.2 segundos (delay do drop) e colidir com a própria cápsula do jogador.

### O que fazer:
1. **Abrir o Blueprint Mestre de Armas:**
   * Abra o Blueprint `/Game/Blueprints/Weapons/BP_WeaponBase`.
2. **Localizar o Evento `SetWeaponIsDropped`:**
   * No **Event Graph**, localize o custom event `SetWeaponIsDropped`.
3. **Inserir um Nó de Ramificação (Branch):**
   * Logo após o nó do evento `SetWeaponIsDropped`, adicione um nó **Branch** (Ramificação).
   * Conecte o pino booleano **`Dropped`** do evento `SetWeaponIsDropped` à entrada **`Condition`** do Branch.
4. **Separar os Caminhos de Execução:**
   * **Caminho True (Arma Dropada):**
     * Conecte a saída **`True`** do Branch ao nó `SetSimulatePhysics` do mesh principal.
     * Mantenha a conexão existente com o nó **`Delay`** de `0.2` segundos e, em seguida, chame `SetCollisionEnabled` (que definirá a colisão como ativa via Select).
   * **Caminho False (Arma Pega/Equipada):**
     * Conecte a saída **`False`** do Branch a uma nova chamada de **`SetCollisionEnabled`** do componente `WeaponCollision`.
     * Defina o pino **`New Type`** desta chamada diretamente para **`No Collision`**.
     * Conecte a saída deste nó `SetCollisionEnabled` ao nó `SetSimulatePhysics(False)` (para desativar a física imediatamente).
5. **Compilar e Salvar:**
   * Compile e salve o Blueprint `BP_WeaponBase`.

---

## 🟩 8. [RESOLVIDO] Corrigir Atualização da Munição Reserva no HUD (Update ao Coletar)

Esta tarefa garante que a munição reserva coletada do chão atualize instantaneamente no HUD do jogador, forçando a execução da função de replicação correspondente.

### O que fazer:
1. **Abrir o Event Graph de `BP_WeaponBase`:**
   * Abra o Blueprint `/Game/Blueprints/Weapons/BP_WeaponBase` no Event Graph principal.
2. **Localizar o Evento `AddAmmoToBP`:**
   * Procure pelo custom event chamado **`AddAmmoToBP`**.
3. **Usar o Nó Definir com Notificação (Set w/ Notify):**
   * Certifique-se de que o nó que define `Current Ammo in BP` seja do tipo **`DEFINIR c/ Notificar` (Set with Notify)** (como mostrado no seu print).
   * O nó `DEFINIR c/ Notificar` executa automaticamente a lógica de replicação e chama a função `OnRep_CurrentAmmoInBP` no Servidor/Host e nos clientes.
   * **Nota:** Nas versões recentes da Unreal Engine, não é permitido arrastar ou chamar a função `OnRep` manualmente no gráfico (por isso o erro *"This function was not marked as Blueprint Callable"*).
4. **Compilar e Salvar:**
   * Clique em **Compilar (Compile)** e depois em **Salvar (Save)** no Blueprint `BP_WeaponBase`.

---

## 🟥 9. [PENDENTE] Corrigir Arma Grudada na Mão ao Substituir/Coletar (Accessed None na Arma Antiga)

Este bug faz com que, ao coletar uma nova arma para um slot que está atualmente vazio, a função `Substituir a Arma` tente realizar ações de ocultação e drop sobre uma referência nula (pois não havia arma antiga naquele slot). Isso causa um erro de runtime `Accessed None`, abortando a execução da função e impedindo que a nova arma seja anexada corretamente, deixando-a grudada nas mãos do personagem.

### O que fazer:
1. **Abrir o Componente de Sistema de Armas:**
   * Abra o Blueprint `/Game/Blueprints/Weapons/AC_WeaponSystem`.
2. **Localizar a Função `Substituir a Arma`:**
   * No painel **Funções (Functions)** à esquerda, dê um duplo clique na função **`Substituir a Arma`**.
3. **Identificar o Fluxo de Entrada:**
   * No gráfico da função, localize o nó de entrada principal da função (**`Substituir a Arma`**).
   * Você verá o fluxo de execução indo direto desse nó de entrada para o nó **`Set Actor Hidden In Game`**.
4. **Inserir um Nó de Validação `Is Valid`:**
   * Adicione um nó **`Is Valid`** (o nó macro com um ponto de interrogação `?` cinza no canto superior direito).
   * Localize o nó **`Get` (Get Array Item)** que puxa a arma antiga do array `SpawnedWeapons` (ou o nó de atalho/reroute correspondente).
   * Conecte a saída deste nó `Get` (a referência do ator da arma antiga) ao pino **`Input Object`** do nó **`Is Valid`**.
5. **Separar os Caminhos de Execução:**
   * Desconecte o fluxo de execução que vai da entrada da função para o nó `Set Actor Hidden In Game`.
   * Conecte o pino de execução da entrada da função direto à entrada do nó **`Is Valid`**.
   * **Caminho Is Valid (Arma antiga existe):**
     * Conecte a saída **`Is Valid`** (pino de execução superior) ao pino de execução de **`Set Actor Hidden In Game`**.
     * Isso manterá o fluxo original intacto (esconder, desanexar e dropar a arma antiga) antes de salvar a nova.
   * **Caminho Is Not Valid (Slot vazio / Sem arma antiga):**
     * Conecte a saída **`Is Not Valid`** (pino de execução inferior) diretamente ao nó **`Array Set`** que define o slot no array `Initial Weapon` (pulando todo o processo de esconder/dropar a arma antiga que não existe).
6. **Compilar e Salvar:**
   * Compile e salve o blueprint `AC_WeaponSystem`.

---

## 📝 Status das Resoluções

*Quando você concluir uma tarefa no Unreal Editor, altere o status abaixo de `[ ] PENDENTE` para `[x] RESOLVIDO` neste documento.*

- [x] RESOLVIDO: Mapeamento da tecla `R` e vinculação de `IA_Reload`
- [ ] Correção do overlap de pickup com arma guardada (`SpawnedWeapons` Loop)
- [ ] Mover pasta física do `UMG_Inventory` e corrigir redirectores
- [ ] Correção do loop infinito / crash na recarga sem arma (`BP_WeaponBase` Anti-Loop)
- [ ] Correção da arma presa nas costas (AttachInHand em `BP_WeaponBase`)
- [x] RESOLVIDO: Adicionar socket "Muzzle" na malha da arma ativa (Beretta e MP5 resolvidos)
- [x] RESOLVIDO: Correção da arma caindo ao andar/pegar munição (SetWeaponIsDropped instantâneo)
- [x] RESOLVIDO: Correção da atualização da munição reserva no HUD (OnRep no AddAmmoToBP)
- [x] RESOLVIDO (Cena): Definir `WeaponID` no painel *Details* das armas colocadas no cenário (evita a AK-47 travada)
- [ ] Correção preventiva de arma grudada na mão ao coletar/substituir (IsValid em `AC_WeaponSystem`)
- [x] RESOLVIDO: Renomear asset `SK_AR4` para `SK_M4A1` no Content Browser para alinhar com DataTable

