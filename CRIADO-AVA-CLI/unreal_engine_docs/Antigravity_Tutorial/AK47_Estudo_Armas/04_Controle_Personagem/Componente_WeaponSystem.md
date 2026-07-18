# 🧠 04. O Gerenciador de Combate: AC_WeaponSystem

**[Foco: Controle de Slots, Trava de Ações (WeaponIsLocked) e Comunicação com o Personagem]**

Para compreender como a AK-47 interage com o personagem do jogador, você deve estudar o componente lógico gerenciador de inventário de armas: [AC_WeaponSystem.md](file:///c:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/AC_WeaponSystem.md).

---

## 📂 1. Onde Localizar no Unreal Editor?

1. No **Content Browser**, navegue até:
   > 📦 `/Game/Blueprints/Weapons/AC_WeaponSystem` (um Actor Component)
2. No Blueprint do seu personagem jogável (ex: `BP_Character` ou `ALS_Base_CharacterBP`), veja a lista de componentes anexados no canto superior esquerdo para confirmar a presença do `AC_WeaponSystem`.

---

## ⚙️ 2. Principais Responsabilidades do Componente

O `AC_WeaponSystem` gerencia o ciclo de vida do arsenal do jogador. Ele coordena quando o jogador pode equipar, trocar ou realizar ações.

### A) O Sistema de Slots (`SpawnedWeapons`):
* O componente gerencia um Array chamado `SpawnedWeapons` que armazena referências para as armas físicas instanciadas no jogo.
* **Slot 1 (Principal):** Normalmente reservado para rifles como a AK-47.
* **Slot 2 (Secundário):** Reservado para pistolas.
* **Slot 3 (Especial/Lança-granadas):** Reservado para armas pesadas.

### B) A Trava de Segurança (`WeaponIsLocked`):
* Esta variável booleana é o **núcleo de governança de gameplay** do sistema de combate.
* Quando `WeaponIsLocked` é `true`, o jogador **não pode**:
  * Disparar.
  * Recarregar.
  * Trocar de arma.
  * Executar outras ações físicas.
* **Ciclo da Trava:**
  1. O jogador inicia uma recarga ➡️ `WeaponIsLocked` é definido como `true`.
  2. A animação toca ➡️ O combate fica travado (sem exploits de cancelamento).
  3. A recarga termina (`ReloadEnd`) ➡️ `WeaponIsLocked` volta a ser `false`, liberando as ações.

---

## 🛠️ 3. O Fluxo de Troca e Posicionamento (Coldre vs. Mão)

A lógica de equipar a AK-47 envolve mover a arma do coldre (costas) para a mão do jogador:

1. **Seleção de Slot:** O jogador pressiona a tecla correspondente (ex: tecla `1` para rifle).
2. **Equipamento:** O `AC_WeaponSystem` chama o evento de saque e ativa as animações de saque no `ALS_AnimBP`.
3. **Anexo por Sockets:** 
   * Quando em repouso (desequipada), a AK-47 é anexada ao socket das costas do personagem (geralmente `"Rifle_Holster"` ou `"Back_Socket"`).
   * Ao ser empunhada (equipada), ela é anexada ao socket da mão direita do personagem (geralmente `"R_Hand"` ou `"Hand_R"`).
   * O anexo físico é realizado por meio do nó **`K2_AttachToComponent`** usando regras de posicionamento relativas.
