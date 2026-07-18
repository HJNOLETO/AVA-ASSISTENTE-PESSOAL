# 🔫 Arquitetura de Armas e Resolução de Problemas: Sistema de Combate e Recarga

**[Autor: Antigravity]**  
**[Foco: Programação Orientada a Objetos (Herança), Fluxo de Recarga e Inputs]**

---

## 🎯 Caso de Uso: O Arsenal Extensível

Em um jogo de ação moderna estilo GTA, o personagem precisa carregar e manusear diferentes armas de fogo: pistolas de combate rápidos, metralhadoras automáticas pesadas, espingardas de curta distância ou rifles de ferrolho precisos.

Para desenvolver isso sem duplicar códigos, usamos **Herança (OOP)** combinada com um **Actor Component Gerenciador de Armas**.

---

## ⚙️ 1. A Estrutura Lógica: `BP_WeaponBase` e Seus Filhos

A arquitetura do sistema baseia-se em um modelo "Mestre-Filho", onde toda a inteligência e lógica geral de funcionamento ficam concentradas no Blueprint pai (`BP_WeaponBase`), enquanto as características visuais (malhas 3D) e os valores de comportamento específicos são herdados e modificados pelas armas filhas.

### Atributos Lógicos Herdados
No `BP_WeaponBase`, declaramos variáveis fundamentais para o cálculo de tiro e recarga:
* **`CurrentAmmoInMag`** (Munição no Pente): Balas atualmente carregadas e prontas para disparar.
* **`CurrentAmmoInBP`** (Munição Reserva): Balas em reserva no inventário daquela arma.
* **`Reload Duration`** (Tempo de Recarga): O tempo de duração (em segundos) que a trava de combate impedirá novos disparos enquanto toca a animação de recarregamento.

```
       [ BP_WeaponBase ] (Lógica: Atirar, Recarregar, Spawn)
              │
      ┌───────┴───────┐
      ▼               ▼
[ BP_Pistola ]  [ BP_Rifle ]
(Dano: 25.0)    (Dano: 45.0)
(Balas: 10)     (Balas: 30)
```

---

## 🧠 2. O Coordenador de Combate: `AC_WeaponSystem`

O `AC_WeaponSystem` é um **Actor Component** anexado ao personagem. É o cérebro que gerencia as ações e a troca rápida de armas (Slots):
1. **Slots Físicos (`SpawnedWeapons`):** Mantém uma array com referências às armas físicas instanciadas pelo jogador.
2. **O Trinco de Ações (`WeaponIsLocked`):** Uma variável booleana que atua como barreira lógica. Quando ativa (ex: durante a recarga, troca de arma ou animação montada), impede que o personagem atire, corra de forma inadequada ou execute comandos concorrentes.

---

## 🛠️ 3. DIAGNÓSTICO E CORREÇÃO DO BUG: Por que a Recarga (Reload) Não Funciona?

### O Diagnóstico
Analisando a estrutura exportada das Blueprints, a função lógica de recarga (`Reload`) existe e está perfeitamente implementada dentro de `AC_WeaponSystem` e `BP_WeaponBase` (coordenando as durações, alterando as variáveis de munição e aplicando a trava `WeaponIsLocked`).

No entanto, **não há nenhum sinal físico associado à tecla "R" no Grafo de Eventos do Personagem** (`BP_Character` ou `ALS_Base_CharacterBP` usando Enhanced Input), e nenhuma vinculação correspondente na classe-mãe em C++ `APPPirateCharacter`. O gatilho de recarga está "solto", sem nenhuma ligação com o teclado.

---

## 🏃 Como Resolver a Recarga (Guia Passo a Passo)

Siga este roteiro didático de tarefas para fazer a recarga voltar a funcionar no jogo:

```
[ Tecla R ] ──> [ IMC_Default ] ──(Gera)──> [ IA_Reload ]
                                                │
[ BP_Character Event Graph ] ◄──────────────────┘
  ├──> Evento IA_Reload (Triggered/Started)
  └──> Obter AC_WeaponSystem ──> Chamar Evento: Reload()
```

### 👤 Parte do Usuário (Pendências a realizar no Unreal Editor)

#### Passo A: Criar a InputAction
1. No painel de navegação (**Content Browser**), vá até a pasta de Inputs do seu projeto (geralmente sob `/Game/Blueprints/Input/` ou `/Game/Input/`).
2. Clique com o botão direito na área vazia, selecione **Input -> Input Action**.
3. Nomeie o novo arquivo como `IA_Reload`.
4. Abra o `IA_Reload` e garanta que o tipo de valor (**Value Type**) esteja configurado como `Digital (bool)`. Salve o arquivo.

#### Passo B: Registrar no Contexto de Mapeamento
1. Abra o arquivo do seu contexto de mapeamento ativo, geralmente nomeado como `IMC_Default` (ou `IMC_PirateCharacter`).
2. Clique no botão de `+` em **Mappings** para adicionar uma nova ação.
3. Selecione a ação `IA_Reload` na lista.
4. Expanda a ação adicionada, clique no ícone do teclado em **Key** e pressione a tecla `R` no seu teclado físico (ou escolha `R` manualmente no menu de seleção de chaves). Salve e feche o `IMC_Default`.

#### Passo C: Vincular o Evento no Grafo do Personagem
1. Abra o Blueprint do seu personagem jogável (ex: `BP_Character` ou `ALS_Base_CharacterBP`).
2. Vá até o **Event Graph** principal.
3. Clique com o botão direito no grafo vazio e pesquise por `IA_Reload`. Selecione o evento de Enhanced Input correspondente (**Enhanced Action Events -> IA_Reload**).
4. No nó do evento criado, arraste o pino **Started** (ou **Triggered**) e solte na área de trabalho.
5. Obtenha uma referência ao seu componente de armas do jogador. No painel de variáveis (à esquerda), arraste a variável **WeaponSystem** (ou `AC_WeaponSystem`) para o grafo.
6. A partir da referência do componente, arraste um fio e pesquise por `Reload` (chame a função ou evento personalizado `Reload` do componente).
7. Conecte o pino de execução do evento `IA_Reload` ao nó `Reload` do componente de armas.
8. Compile e salve seu Blueprint!

---

## 🛑 4. DIAGNÓSTICO E CORREÇÃO DO CRASH: O Loop Infinito ao Recarregar Sem Arma (Punhos)

### O Diagnóstico do Crash
Quando o jogador coleta munições e clica em recarregar sem nenhuma arma ativa selecionada (ou com os punhos equipados), o jogo fecha abruptamente (crash).

A causa é o fluxo recursivo de fallback dos modos de disparo em `BP_WeaponBase`:
```
┌──────────────────────────────────────────────┐
▼                                              │
[ SetMode_SingleShot ] ──(Se False)──> [ SetMode_Burst ]
                                              │
▲                                         (Se False)
│                                             │
└───────── [ SetMode_Auto ] ◄─────────────────┘
```
1. **`SetMode_SingleShot`** verifica se `SingleShotMode` da arma é `true`. Se for `false`, chama `SetMode_Burst`.
2. **`SetMode_Burst`** verifica se `BurstShotMode` da arma é `true`. Se for `false`, chama `SetMode_Auto`.
3. **`SetMode_Auto`** verifica se `FullAutoMode` da arma é `true`. Se for `false`, chama de volta `SetMode_SingleShot`.

Se a arma ativa não possuir **nenhum** modo de disparo habilitado (caso dos punhos/unarmed ou de uma arma mal configurada na struct `S_WeaponData` onde os três booleanos são `false`), este ciclo vira um **loop infinito**, estourando o limite de iterações e travando/fechando a Unreal Engine.

---

## 🏃 Como Corrigir o Loop Infinito (Guia Passo a Passo)

Para interromper o loop infinito sem quebrar o alternador de modos de disparo, devemos introduzir uma verificação de segurança (uma ramificação lógica protetora) na função `Set Mode Auto`:

```
[ Set Mode Auto ]
       │
[ Ramificação ] ──(True)──> (Define: FullAuto e encerra)
       │
    (False)
       │
[ Ramificação (Nova) ] 
  - Condição: (SingleShotMode OR BurstShotMode)
       ├──(True)───> [ Set Mode Single Shot ] (Seguir ciclo)
       └──(False)──> (Do Nothing / Parar fluxo com segurança)
```

### 👤 Parte do Usuário (Ações no Unreal Editor)

1. **Abrir a Função Afetada:**
   * Abra o Blueprint mestre de armas: `/Game/Blueprints/Weapons/BP_WeaponBase`.
   * Na aba lateral esquerda, na lista de funções, localize e dê dois cliques em **`Set Mode Auto`** (ou `SetMode_Auto`).

2. **Remodelar a Ramificação `False`:**
   * Localize o nó **`Ramificação`** (Branch) principal que valida o booleano `Full Auto Mode`.
   * **Desconecte** a linha de execução que sai do pino **`False`** de `Ramificação` e vai para a chamada de função `Set Mode Single Shot`.

3. **Adicionar a Proteção Anti-Loop:**
   * Clique com o botão direito no grafo vazio e adicione uma nova **`Ramificação`** (Branch) logo à frente do pino `False`.
   * Conecte o pino **`False`** do primeiro Branch no pino de entrada (exec) desse novo Branch.
   * Adicione um nó de **`Boolean OR`** (operador lógico `OU`).
   * Puxe um pino da struct **`Weapon Data`** (use `Quebrar S_WeaponData` para expor os campos) e conecte o pino `Single Shot Mode` na primeira entrada do nó `OR`.
   * Conecte o pino `Burst Shot Mode` na segunda entrada do nó `OR`.
   * Conecte a saída do nó `OR` no pino **`Condition`** do novo Branch.

4. **Reconectar o Fallback Seguro:**
   * A partir do pino **`True`** do novo Branch, puxe um fio e conecte-o ao nó de chamada da função **`Set Mode Single Shot`**.
   * Deixe o pino **`False`** do novo Branch completamente **desconectado** (isso fará o fluxo parar com segurança, pois significa que nenhum dos três modos é suportado).
   * Compile e salve o Blueprint.

> [!TIP]
> **Dica Extra:** Abra o Blueprint que representa os Punhos (ou Unarmed, ex: `BP_Fists`) e confira se nas variáveis padrões (`WeaponData`) o campo `Single Shot Mode` está marcado como `True`. Mesmo que os punhos não atirem fisicamente, habilitar um dos modos previne comportamentos inesperados ao usar mecânicas gerais de armas.

---

## 🔒 5. O FLUXO DE ANEXO: Por que a Arma Fica Presa nas Costas (Holster Bug)?

### O Diagnóstico Técnico

Quando o jogador equipa uma arma, o sistema de animação (`ALS_AnimBP`) gerencia as transições visuais de saque. Durante a montagem da animação de saque, uma notificação de animação (**AnimNotify**) chamada `AnimNotify_AttachInHand` é acionada. Essa notificação faz uma chamada direta para a função personalizada `AttachInHand` declarada no Blueprint da arma ativa (`BP_WeaponBase`).

A finalidade de `AttachInHand` é mover a arma física do coldre (costas ou quadril) para a mão direita do personagem. No entanto, ao analisarmos as conexões do grafo, encontramos o seguinte erro lógico:

```
[Evento: AttachInHand] ──> [K2_AttachToComponent]
                                ├── Target (Alvo): Variable "Magazine" (Pente) ❌ (Deveria ser WeaponMesh/Self)
                                └── Parent (Pai): Character Mesh (Malha do Manequim)
```

Como o pino **`Target`** está conectado ao componente **`Magazine`** (a malha estática do pente de munição), o motor de física realiza o anexo do pente na mão do personagem, enquanto a estrutura principal da arma (receptor, cano, coronha) continua acoplada ao soquete do coldre nas costas.

Como resultado:
1. O personagem executa a animação de mira perfeitamente.
2. A arma permanece estática nas costas do jogador, pois nunca foi reposicionada na mão direita.

---

## 🎯 6. CONFIGURAÇÃO DE SOCKETS: Aviso "Muzzle" Não Encontrado

### O Diagnóstico do Erro

Ao tentar disparar ou calcular o vetor inicial dos projéteis, o console do editor exibe a mensagem de aviso:
`NÃO FOI ENCONTRADO O SOCKET "MUZZLE" NA ARMA!!!`

Isso ocorre porque a função `GetSocketTransform` (ou `DoesSocketExist`) é chamada na malha estática/esquelética da arma buscando o identificador `"Muzzle"`. Como os assets 3D importados (por exemplo, os modelos de rifle do pacote `FPS_Weapon_Bundle`) não contêm esse soquete configurado por padrão, a função falha em obter a posição inicial para o spawn da bala e a partícula de clarão de disparo (Muzzle Flash).

Para que o tiro seja disparado a partir da extremidade real do cano da arma, o desenvolvedor precisa abrir a malha 3D e adicionar manualmente o soquete.

---

## ❓ Perguntas de Fixação

* **O que acontece quando o jogador pressiona o botão de recarga se a arma já estiver com o pente cheio?**
  O `AC_WeaponSystem` executa a função interna `CanReload?()` do `BP_WeaponBase`. Se a munição no pente for igual à capacidade máxima ou a reserva estiver zerada, a ação de recarga é abortada silenciosamente antes de travar o combate.
* **Qual é o papel da variável `WeaponIsLocked` no fluxo de combate?**
  Garante que o jogador não consiga atirar enquanto recarrega, evitando *animation cancels* e outros exploits clássicos de trapaça (hacks de cadência).

