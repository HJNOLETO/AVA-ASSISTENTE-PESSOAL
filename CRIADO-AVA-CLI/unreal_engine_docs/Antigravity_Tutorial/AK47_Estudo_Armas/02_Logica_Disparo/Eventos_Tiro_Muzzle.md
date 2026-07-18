# 🔫 02. Lógica de Disparo e Soquete Muzzle da AK-47

**[Foco: Loops de Disparo, Spawning de Projéteis e Efeitos Visuais]**

Para compreender como a AK-47 realiza o disparo físico de balas, você deve estudar a cadeia lógica de eventos herdada de [BP_WeaponBase.md](file:///c:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/BP_WeaponBase.md).

---

## 📂 1. Onde Localizar no Unreal Editor?

1. Abra o Blueprint da AK-47 ou [BP_WeaponBase.md](file:///c:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/BP_WeaponBase.md).
2. Vá até o **Event Graph** principal.
3. Localize as seções comentadas:
   * **`"Evento atirar"`**
   * **`"Efeito do tiro - VFX + Sons + Animações"`** (dentro da função `SpawnProjectile`)

---

## ⚙️ 2. O Fluxo de Disparo Passo a Passo

```
[Input Action: Fire] ──> [AC_WeaponSystem] ──> Chamar: WeaponFire() em BP_WeaponBase
                                                          │
   ┌──────────────────────────────────────────────────────┘
   ▼
[CanShoot?] ──(True)──> [Diminuir Ammo (Set CurrentAmmoInMag)]
                             │
   ┌─────────────────────────┘
   ▼
[Spawning FX] ──> Tocar: Fire Sound (Play Sound At Location)
              ──> Spawner: Muzzle Flash FX (Spawn Emitter Attached)
                             │
   ┌─────────────────────────┘
   ▼
[Spawn Projectile] ──> SpawnActor: BP_ProjectileBase no transform do soquete "Muzzle"
```

---

## 🎯 3. O Papel Crítico do Soquete "Muzzle" (Cano da Arma)

A macro **`Muzzle Pos`** dentro de `BP_WeaponBase` é a responsável por obter a localização exata no mundo 3D onde a bala física e a partícula de faísca devem aparecer.

### Como a Macro Obtém a Posição:
1. Ela executa o nó **`Get Socket Transform`** no componente `WeaponMesh` da AK-47.
2. Ela busca o soquete com o nome exato **`"Muzzle"`**.
3. O transform retornado é ligeiramente deslocado em `10.0` unidades para frente (usando o `Forward Vector` do soquete) para evitar colisões indesejadas da bala com o próprio cano da arma.

> [!IMPORTANT]
> **Boas Práticas de Malhas:**
> Se a AK-47 tiver problemas onde a partícula de tiro não aparece ou os tiros saem do pé do jogador, significa que o esqueleto do modelo 3D da AK-47 não possui o socket `"Muzzle"`.
> **Para corrigir:** Abra a Skeletal Mesh da AK-47, adicione o socket `"Muzzle"` no osso da ponta do cano e alinhe o eixo de direção (geralmente eixo X vermelho apontando para frente).
