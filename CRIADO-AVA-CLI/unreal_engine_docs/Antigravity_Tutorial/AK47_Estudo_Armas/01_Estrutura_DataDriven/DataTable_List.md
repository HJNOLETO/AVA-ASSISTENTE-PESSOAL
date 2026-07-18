# 📊 01. Estrutura Orientada a Dados da AK-47

**[Foco: Configurações na Tabela de Dados e Acoplamento Mestre-Filho]**

Para entender como a **AK-47** (que no editor é o Blueprint filho derivado de `BP_WeaponBase`) configura seus atributos específicos, você deve entender a relação entre o Blueprint Pai, a Tabela de Dados e as Estruturas de Dados do projeto.

---

## 📂 1. Onde Localizar no Unreal Editor?

### A Tabela de Dados (DataTable):
No **Content Browser**, navegue até:
> 📦 `/Game/Blueprints/Weapons/Data/WeaponList`

### O Blueprint da AK-47 (BP_WeaponBase):
No **Content Browser**, navegue até:
> 📦 `/Game/Blueprints/Weapons/BP_WeaponBase`
> *Nota: A AK-47 usa a classe base diretamente. No editor de níveis (World Outliner), a arma colocada no cenário aparece com o nome da instância (ex: `BP_WeaponBase7` ou `BP_WeaponBase_C_7`).*

### A Estrutura de Dados (Struct):
No **Content Browser**, navegue até:
> 📦 `/Game/Blueprints/Weapons/Data/S_WeaponData`

---

## ⚙️ 2. Como a AK-47 Inicializa Seus Dados?

A herança da AK-47 funciona por meio do script de construção (`UserConstructionScript`) herdado de [BP_WeaponBase.md](file:///c:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/BP_WeaponBase.md).

### O Fluxo de Carga de Dados:
1. O Blueprint da AK-47 possui a variável `WeaponStored` com o valor de `WeaponID` configurado como `"AK47"`.
2. O script de construção chama o nó **`Get Data Table Row`** na tabela `/Game/Blueprints/Weapons/Data/WeaponList` usando a linha `"AK47"`.
3. As variáveis locais de munição, dano, dispersão e meshes são preenchidas automaticamente a partir dessa linha.

---

## 🗂️ 3. Mapeamento das Variáveis na DataTable `WeaponList`

Para a AK-47 funcionar perfeitamente, os seguintes campos na tabela devem estar preenchidos:

| Nome do Campo | Tipo no Editor | Função na AK-47 |
| :--- | :--- | :--- |
| **`WeaponMesh`** | `SkeletalMesh` | A malha 3D física da AK-47. |
| **`Magazine`** | `StaticMesh` | A malha 3D do pente de munição física (usado para descarte). |
| **`Fire Rate`** | `Float` | Taxa de disparo da arma (tempo de atraso entre tiros). |
| **`Weapon Spread`** | `Float` | Dispersão padrão do tiro. |
| **`Max Ammo`** | `Integer` | Tamanho do pente da AK-47 (ex: 30 balas). |
| **`Fire Sound`** | `SoundBase` | Som reproduzido ao atirar. |
| **`Reload Sound`** | `SoundBase` | Som reproduzido ao recarregar. |

> [!WARNING]
> Se o `WeaponID` no painel de detalhes do Blueprint da AK-47 não corresponder exatamente ao nome da linha na tabela de dados (ex: `"AK47"`), o Unreal não carregará nenhuma propriedade, resultando em uma arma invisível que não atira nem recarrega.

---

## 📋 4. Valores de Configuração da AK-47 (Dados Extraídos)

Abaixo estão anotados os valores de configuração reais da AK-47 presentes no `Row Editor` da DataTable `WeaponList`, divididos por categorias lógicas:

### A) Identidade Visual e Física
*   **WeaponName:** `AK-47`
*   **ALSOverlay:** `Rifle` (Define a pose de animação no sistema ALS)
*   **WeaponSlots:** `3` (Rifle de Assalto Primário)
*   **WeaponIcon:** `T_AK47` (Ícone de exibição na HUD e inventário)
*   **WeaponSkeletalMesh:** `SK_KA47` (Modelo 3D esquelético principal)
*   **MagazineMesh:** `SM_AK47Mag` (Modelo estático do pente ejetado durante a recarga)

### B) Estatísticas de Combate e Cadência
*   **BulletsInShot:** `1` (Quantidade de projéteis disparados por tiro)
*   **FireRate:** `500.0` (Cadência de disparo da arma)
*   **SingleShotMode:** `True` (Habilitado)
*   **BurstShotMode:** `True` (Habilitado, disparando rajadas de `3` tiros - `RoundsInBurst = 3`)
*   **FullAutoMode:** `True` (Habilitado)
*   **WeaponSpread:** `0.1` (Dispersão básica dos projéteis)
*   **MinDamage / MaxDamage:** `3.0` / `5.0` (Faixa de dano padrão)
*   **CritChance / CritMultiplier:** `2.0` / `5.0` (Chance e multiplicador de acerto crítico)
*   **BulletSpeed:** `10000.0` (Velocidade inicial do projétil)
*   **BulletRicochet:** `True` (Permite ricochete das balas)
*   **Projectile:** `Projectile_Rifle` (Classe do projétil instanciado)
*   **ProjectileSize:** `7.62x54`

### C) Áudio, Partículas e Animações
*   **MuzzleFlashFX:** `Muzzle_Flash_Med2` (VFX do clarão do disparo)
*   **FireSound:** `aksound_Cue` (Efeito sonoro do tiro)
*   **ReloadSound:** `None (Nenhum)` ⚠️ **[ANOMALIA DETECTADA]** *A ausência deste som faz com que a arma recarregue em completo silêncio. Deve ser selecionado um asset de áudio apropriado.*
*   **CharAnimations (Animações do Personagem):**
    *   *CharReloadAnimation:* `MM_Rifle_Reload` (Animação de recarga)
    *   *CharEquipAnimation:* `A_EquipRifle` (Animação de saque)
    *   *CharUnequipAnimation:* `A_UnequipRifle` (Animação de coldre)
*   **WeaponAnimations (Animações da Arma):**
    *   *WeaponShootingAnimation:* `SK_AK_Shoot` (Animação interna do ferrolho/gatilho da arma)
    *   *WeaponReloadingAnimation:* `None (Nenhum)`

### D) Movimentação e Mecânicas de Recarga
*   **AutoReload:** `True` (Habilitado)
*   **ConsumeAllRoundsOnReload:** `False` (Não descarta as balas sobressalentes ao recarregar com munição no pente)
*   **ReduceAccuracyWhileMoving:** `False` ⚠️ **[ANOMALIA DETECTADA]** *Desativado. Isso significa que o jogador não sofre perda de precisão ao se movimentar, o que anula a mecânica de recuo dinâmico por velocidade.*
*   **AccuracyPenaltyWhileMoving:** `1.0`
*   **ReloadDuration:** `2.0` (Tempo lógico em segundos para que as balas sejam adicionadas no HUD)

---

## ⚙️ 5. Decisão de Design: Devo Habilitar o `AutoReload` em Todas as Armas?

O parâmetro **`AutoReload`** determina se a arma deve iniciar a animação de recarga de forma automática quando o jogador pressiona o gatilho sem balas no pente (`CurrentAmmoInMag == 0`).

**Como funciona a lógica do Blueprint (`BP_WeaponBase`):**
1. O gatilho é pressionado ➡️ O sistema verifica se `CurrentAmmoInMag == 0`.
2. Se `0`, verifica a variável booleana `AutoReload`.
3. Se **`True`**, chama a função `ReloadStart` instantaneamente (mesmo fluxo de apertar `R`).
4. Se **`False`**, chama o som de clique seco (`NoAmmoSound`), deixando o controle totalmente nas mãos do jogador.

### 📊 Matriz de Decisão por Categoria de Arma

| Tipo de Arma | AutoReload Recomendado | Justificativa de Design (Foco em Gameplay) |
| :--- | :--- | :--- |
| **Rifles de Assalto / Submetralhadoras** *(AK-47, MP5, M4A1)* | **`True` (Sim)** | Melhora a fluidez em confrontos frenéticos de curta/média distância, evitando frustração de cliques secos. |
| **Pistolas / Armas Secundárias** | **`True` ou `False`** | Em jogos arcades de tiro rápido, `True` é melhor. Em jogos táticos e survival horror, `False` adiciona tensão ao forçar a recarga manual. |
| **Rifles de Precisão (Snipers)** | **`False` (Não)** | Evita que o jogador fique vulnerável em uma animação de recarga automática demorada e possa, ao invés disso, correr para cobertura ou sacar uma arma secundária de imediato. |
| **Escopetas / Shotguns** | **`False` (Não)** | Como a recarga de escopetas costuma ser lenta e em cartuchos individuais, o jogador precisa decidir o momento tático de alimentar o armamento. |
| **Lança-Foguetes / RPGs** | **`False` (Não)** | A recarga é extremamente demorada. Iniciar automaticamente após um único disparo pode prender o jogador em uma animação letal em situações de curto alcance. |

> [!TIP]
> **Recomendação Prática:**
> Ative a opção `AutoReload` ap## 🔍 6. Análise de Divergência: AK-47 vs. M4A1 (`SK_M4A1` - Antiga `SK_AR4`)

Ao comparar a pasta da **AK-47** (`Ka47`) com a da **M4A1** (`AR4` / `SK_M4A1`) e a sua respectiva linha na DataTable `WeaponList`, observamos inconsistências estruturais importantes e as respectivas soluções aplicadas:

### A) Inconsistência de Nomenclatura Resolvida (DataTable vs. Asset 3D)
*   **Nome da Linha na DataTable:** A linha está registrada como **`M4A1`** (e o `WeaponName` também é `M4A1`).
*   **Malha Esquelética Associada:** O campo `WeaponSkeletalMesh` apontava para **`SK_AR4`**.
*   **Ação Realizada:** O nome físico da malha esquelética (`SK_AR4`) e a pasta onde ela reside (`AR4`) não batiam com o ID lógico (`M4A1`) da tabela. **O desenvolvedor renomeou o asset de malha de `SK_AR4` para `SK_M4A1`** no Content Browser do Unreal Editor para unificar a nomenclatura. 
*   **Pendência:** Clique com o botão direito na pasta onde estava o asset e selecione **"Fix Up Redirectors in Folder"** para consolidar os links. Confirme na DataTable `WeaponList` que o campo `WeaponSkeletalMesh` está apontando para a nova malha `SK_M4A1`.

### B) Elementos e Arquivos Ausentes
Ao comparar a pasta `/Content/FPS_Weapon_Bundle/Weapons/Meshes/` das duas armas:

| Categoria de Elemento | Pasta da AK-47 (`Ka47`) | Pasta da M4A1 (`AR4` / `SK_M4A1`) | Impacto Técnico / Solução |
| :--- | :--- | :--- | :--- |
| **Sequência de Animação** | Possui `SK_AK_Shoot` (Animação de tiro nativa da arma). | **Nenhuma**. | A M4A1 não possui animação de gatilho/ferrolho própria. No campo `WeaponShootingAnimation` da DataTable, ela deve ser deixada como `None` ou usar a animação genérica. |
| **Malha Física (`_Physics`)** | Possui `SK_KA47_Physics` | Possui `SK_M4A1_Physics` | Correto. Ambas possuem configuração de colisão física para quando são dropadas. |
| **Asset de Esqueleto** | Possui `SK_KA47_Skeleton` | Possui `SK_M4A1_Skeleton` | Correto. Ambas possuem árvore de ossos individualizada. |
| **Pente Estático (`StaticMesh`)** | Possui **`SM_AK47Mag`** | **Nenhum** (`None` na DataTable). | **⚠️ [ANOMALIA DETECTADA]:** A pasta da M4A1 não tem um modelo 3D separado para o pente de munição. Por isso, a coluna `MagazineMesh` da M4A1 está configurada como `None`. Na recarga da M4A1, **nenhum pente físico cairá no chão**, quebrando a lógica de partículas descrita em `Fluxo_Reload.md`. Para corrigir, é necessário exportar/modelar o pente da M4A1 separadamente e associá-lo. |

---

## 📂 7. Mapeamento Geral do Arsenal (Pastas vs. Linhas da DataTable)

Com base na estrutura de pastas em `/Content/FPS_Weapon_Bundle/Weapons/Meshes/` e nas linhas da DataTable `WeaponList`, abaixo está o mapeamento completo do arsenal para ajudar no diagnóstico e na expansão das demais armas:

| Nome da Pasta | Malha Esquelética (`SkeletalMesh`) | Row Name (DataTable) | Nome no HUD | Recomendações de Verificação / Checklist |
| :--- | :--- | :--- | :--- | :--- |
| **`AR4`** | `SK_M4A1` (Antiga `SK_AR4`) | **`M4A1`** | `M4A1` | **⚠️ [ANOMALIAS ENCONTRADAS]:** `WeaponSpread` está em `1.0` (precisão baixíssima) e `MinDamage` em `500.0` (insta-kill). O pente (`MagazineMesh`) está como `None` e não possui som de recarga. Corrigir na DataTable! Garantir que o skeletal mesh referenciado seja o novo `SK_M4A1`. |
| **`Beretta`** | `SK_Beretta` (ou similar) | **`Beretta`** | `Beretta` | Certifique-se de que o socket `Muzzle` está na ponta do cano (como configurado no osso `base`). Ajuste o `HolsterSocket` para a cintura/perna. |
| **`KA_Val`** | `SK_AsVal` (ou similar) | **`AsVal`** | `AsVal` | Rifle de precisão silenciado. Verifique o som de disparo integrado e defina `AutoReload = False` se preferir controle tático. |
| **`Ka47`** | `SK_KA47` | **`AK47`** | `AK-47` | A mais completa. Corrigir o `ReloadSound` que está como `None` e ativar `ReduceAccuracyWhileMoving` para balanceamento. |
| **`MP5`** | `SK_MP5` | **`MP5`** | `MP5` | Submetralhadora leve. Verifique se o socket `Muzzle` está ativo. Configure `AutoReload = True` e um `FireRate` rápido. |
| **`Remington`** | `SK_Shotgun` (ou similar) | **`Remington`** | `Remington` | Escopeta/Shotgun. O `BulletsInShot` está em `3` (quantidade de chumbo). O `AutoReload` deve ser `False` para recarga manual tática. |
| **`SMG11`** | `SK_SMG11` (ou similar) | **`SMG`** | `SMG` | Submetralhadora compacta. Deve usar slot secundário de inventário. Garanta cadência rápida e `AutoReload = True`. |
| **`KA74U`** | `SK_KA74U` (ou similar) | *Não mapeada* | - | Caso queira ativá-la: adicione uma nova linha na DataTable com o ID `AK74U`, configure o mesh e as estatísticas herdando `BP_WeaponBase`. |
| **`M9_Knife`** | `SK_M9_Knife` | *Não mapeada* | - | Arma branca. Não dispara projéteis (BulletsInShot = 0, FireRate = 0). Pode ser mapeada na DataTable caso precise de colisão física. |
| **`G67_Grenade`** | `SK_G67_Grenade` | *Não mapeada* | - | Granada arremessável. Normalmente gerenciada por um sistema de arremessos próprio, não herdando diretamente do fluxo de tiro contínuo de `BP_WeaponBase`. |

