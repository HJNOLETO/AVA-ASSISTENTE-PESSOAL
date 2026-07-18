# 📦 Caixas de Munição e Coleta de Itens: Integração de FPS_Weapon_Bundle e Correção de Pickups

**[Autor: Antigravity]**  
**[Foco: Colisões (Block vs Overlap), Integração de Malhas 3D e Lógica de Coleta em Coldres]**

---

## 🎯 Caso de Uso: Coleta Dinâmica de Itens no Mapa

Durante a exploração do nível do jogo, o jogador se depara com pacotes de munição e caixas de suprimentos espalhados pelo mapa (como caixas militares e pentes extras). Ao passar por cima de uma caixa, ele deve ouvir um som de coleta, ver a caixa sumir do chão e ver sua reserva de munição aumentar instantaneamente no HUD.

Para colocar isso em prática de forma consistente, usaremos os modelos 3D localizados em:  
`C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\Content\FPS_Weapon_Bundle`

E corrigiremos um comportamento indesejado (bug) do sistema de inventário.

---

## 📐 1. Física e Detecção: Colisão de Coleta (Block vs Overlap)

Na Unreal Engine, a colisão de objetos físicos é ditada por canais de resposta. Para itens coletáveis (Pickups), usamos as seguintes diretrizes de física:

* **Collision Presets: `OverlapAllDynamic` ou `Custom`:**
  * O objeto do suprimento **não deve colidir fisicamente** com o jogador como se fosse uma parede de concreto (resposta `Block` desativada). O jogador deve conseguir atravessar visualmente o volume da caixa de suprimentos.
  * O canal correspondente ao tipo de colisão do jogador (`Pawn`) deve estar marcado como **Overlap** (Sobrepor).
* **O Nó Evento:** Usamos o evento **OnComponentBeginOverlap** na cápsula de colisão (`SphereCollision` ou `BoxCollision`) do coletável para disparar a lógica quando o jogador entrar no raio de detecção.

| Canal de Colisão | Tipo de Resposta | Consequência no Jogo |
| :--- | :--- | :--- |
| **`WorldStatic`** | `Block` | A caixa de munição assenta perfeitamente sobre o solo ou mesas sem atravessar o mapa. |
| **`Pawn`** | `Overlap` | Detecta a passagem física do jogador e dispara o evento de coleta (Overlap). |

---

## 🎨 2. Integração Prática com `FPS_Weapon_Bundle`

A pasta `Content/FPS_Weapon_Bundle` possui malhas estáticas e esqueléticas de alta qualidade para armas, cartuchos e caixas de munição militares.

### 👤 Parte do Usuário: Como Configurar um Pickup do zero no Editor:

1. No Unreal Editor, crie um novo Actor Blueprint chamado `BP_AmmoBox_Military`.
2. Adicione um componente **Box Collision** como componente raiz. Mantenha o tamanho compatível com a caixa.
3. Adicione uma **Static Mesh** filha da colisão e escolha a malha tridimensional da caixa de munição contida em `/FPS_Weapon_Bundle/`.
4. Configure a colisão do Box Collision para:
   * **Collision Presets:** `Custom...`
   * **Query Only (No Physics)**
   * **Pawn:** `Overlap`
   * **WorldStatic:** `Block`
5. No **Event Graph**, adicione o evento **On Component Begin Overlap (BoxCollision)**.

---

## 🛠️ 3. DIAGNÓSTICO E CORREÇÃO DO BUG: Coleta com Arma Guardada (Holstered Weapon Bug)

### O Diagnóstico
No fluxo original do projeto (`BP_AmmoBase`), quando o personagem colide com o coletável de munição, o Blueprint faz o seguinte:
1. Verifica se `CurrentWeapon` (a arma ativa na mão do jogador) é válida.
2. Se for válida, chama o evento `Ammo Pickup` (via Interface) no personagem.
3. **O Bug:** Se o jogador estiver com a arma **guardada no coldre** (`CurrentWeapon` é `None`), o primeiro ramo falha. Na tentativa de corrigir isso, o grafo tenta buscar a primeira arma do inventário (`GET [0]` de `SpawnedWeapons`), mas a chamada de `Ammo Pickup` enviada para o personagem continua passando o parâmetro `Ammo Type` configurado como `CurrentWeapon` (que continua nulo). Logo, o sistema rejeita a munição.

---

## 🏃 A Solução Elegante (Sem Loops Manuais Complexos)

O `AC_WeaponSystem` **já possui um sistema interno inteligente de busca**! O evento `AddAmmo` dentro do componente possui um nó `Switch on AmmoType` que decide como encontrar a arma com base na variável `Ammo Type` (que é um Enum).

As opções desse Enum são:
* **`CurrentWeapon` (Enumerator 0):** Adiciona munição apenas à arma equipada nas mãos.
* **`AllWeapons` (Enumerator 1):** Percorre o inventário e adiciona a todas as armas compatíveis.
* **`WeaponID` (Enumerator 2):** Percorre o inventário e adiciona à arma cujo **Weapon ID** coincidir.
* **`WeaponType` (Enumerator 3):** Filtra e adiciona combinando o estado de overlay.
* **`ProjectileType` (Enumerator 4):** Filtra e adiciona combinando a classe do projétil.

Portanto, em vez de criar loops complexos ou branches no seu Blueprint de munição, basta alterar o modo de busca do Enum para **`WeaponID`**!

---

### 👤 Parte do Usuário (Como fazer no Unreal Editor)

#### Passo A: Simplificar o Grafo em `BP_AmmoBase`
Você não precisa de nenhuma verificação de `IsValid` em `CurrentWeapon` nem em `GET [0]`! Pode deletar todas essas ramificações intermediárias. O seu grafo deve ficar limpo e direto:

1. Conecte o pino de execução **Cast Succeeded** do nó `Cast to ALS_Base_CharacterBP` diretamente à chamada de mensagem da interface `Ammo Pickup` (direcionada ao personagem).
2. Conecte a saída de `Ammo Pickup` diretamente ao nó `Destroy Actor`.

Seu fluxo ficará simplificado assim:
```
[Event Overlap] ──> [Cast to ALS_Base_CharacterBP] ──> [Ammo Pickup (Message)] ──> [Destroy Actor]
```

#### Passo B: Alterar o Valor Padrão de `Ammo Type`
1. Com o Blueprint `BP_AmmoBase` aberto, localize o painel de variáveis (lado esquerdo).
2. Selecione a variável local **`Ammo Type`** (que alimenta o pino `Ammo Type` do nó `Ammo Pickup`).
3. No painel de **Detalhes** (lado direito), altere o **Default Value** (Valor Padrão) dessa variável para **`WeaponID`** (ou o Enumerator correspondente a ID da arma).
4. Certifique-se de que a variável **`Weapon ID`** do seu pickup de munição tenha o mesmo nome cadastrado na DataTable de armas (ex: `Rifle`, `Pistol`).

Pronto! Agora, mesmo que o jogador esteja desarmado (com os punhos limpos), o `AC_WeaponSystem` receberá a instrução de busca por ID, percorrerá a array `SpawnedWeapons` automaticamente em background, localizará a arma correspondente e depositará as balas em sua reserva com segurança!

---

## ❓ Perguntas de Fixação

* **O que acontece se configurarmos o canal Pawn como Block em um Pickup?**
  O personagem físico tropeçará ou colidirá com a caixa de munição como se fosse um degrau sólido, o que pode atrapalhar a movimentação suave no mapa.
* **Por que percorremos a Array `SpawnedWeapons` em vez de apenas ler `CurrentWeapon` ao coletar munições?**
  Porque o jogador pode carregar a arma correspondente no inventário (coldre) sem estar ativamente segurando-a nas mãos no momento em que passa por cima do suprimento.
