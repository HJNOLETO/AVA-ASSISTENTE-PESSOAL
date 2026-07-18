# 🔄 03. Lógica de Recarga e Pente Físico da AK-47

**[Foco: Fluxo de Recarga, Timers, Cálculos de Munição Reserva e Drop de Pente]**

Para compreender como a AK-47 gerencia o carregamento de balas de reserva para o pente ativo, você deve estudar as funções de recarga herdadas de [BP_WeaponBase.md](file:///c:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/BP_WeaponBase.md).

---

## 📂 1. Onde Localizar no Unreal Editor?

1. Abra o Blueprint mestre das armas: `/Game/Blueprints/Weapons/BP_WeaponBase`.
2. Vá até a lista de funções e localize os grafos:
   * **`ReloadStart`**
   * **`ReloadEnd`**
   * **`CanReload?`**
3. No **Event Graph** principal, localize a seção:
   * **`"Eventos para efeitos da arma ao recarregar"`** (onde ocorrem os eventos de animação do pente físico, como `DropMagazine` e `InsertMagazine`).

---

## ⚙️ 2. O Fluxo Lógico da Recarga

```
[Tecla R (Input)] ──> [AC_WeaponSystem] ──> Chamar: WeaponReload() em BP_WeaponBase
                                                 │
   ┌─────────────────────────────────────────────┘
   ▼
[CanReload?] ──(True)──> [Set: IsReloading = True]
                         [Set: IsFiring = False]
                         [Tocar Som de Recarga (Reload Sound)]
                         [Chamar Timer: K2_SetTimer executando ReloadEnd]
                             │
   ┌─────────────────────────┘
   ▼
[ReloadEnd (Ao acabar o Timer)] ──> [Calcular balas a transferir]
                                ──> [Subtrair da reserva (CurrentAmmoInBP)]
                                ──> [Adicionar no pente (CurrentAmmoInMag)]
                                ──> [Set: IsReloading = False]
```

---

## 🛠️ 3. Animação de Drop e Encaixe de Pente Físico (Magazine)

Durante a recarga da AK-47, o jogador executa movimentos físicos para descartar o pente vazio e inserir um novo. Isso é feito via **AnimNotifies** no arquivo de animação do personagem que disparam eventos no `BP_WeaponBase`:

### A) Evento `DropMagazine`:
* Spawna o Blueprint físico do pente **`BP_PhysicalMag`** na posição do soquete do pente da AK-47.
* Dá um impulso físico no pente descartado para que ele caia realisticamente e colida com o chão.
* Oculta o pente que está acoplado na malha da AK-47 (`SetVisibility` do componente `Magazine` para `false`).

### B) Evento `PickupMagazine` / `InsertMagazine`:
* Torna o pente acoplado na malha da AK-47 visível novamente (`SetVisibility` para `true`).
* Destrói a referência temporária do pente que estava na mão do personagem.

---

## 📌 4. Onde Configurar os Tempos e Sons da AK-47?

Todos os tempos e assets de recarga da AK-47 são configurados em sua linha dedicada da DataTable `/Game/Blueprints/Weapons/Data/WeaponList`:
* **`Reload Duration`:** O tempo (em segundos) que dura o timer antes da munição de fato subir no HUD. Deve bater exatamente com o tempo que a animação leva para colocar o pente na arma.
* **`Reload Sound`:** O asset de áudio com os sons mecânicos da AK-47 recarregando.
