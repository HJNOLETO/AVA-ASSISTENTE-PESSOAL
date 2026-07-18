# Guia Manual — Sistema de Combate ProjetoGTA

**Data:** 17/07/2026
**Plugin MCP nao consegue manipular grafos — toda logica abaixo e manual.**

**Revisão:** corrigido erro de tipo no pino `Event Instigator` da Parte 3.1 (ver nota no final).

---

## Parte 1: Preparacao (ja feito via MCP)

O MCP ja adicionou estas variaveis ao `ALS_NPC`:
- `MaxHealth` (float, 100.0, ExposeOnSpawn, categoria "Health")
- `CurrentHealth` (float, 100.0, categoria "Health")
- `bIsDead` (bool, false, categoria "Health")

---

## Parte 2: Logica do NPC (MANUAL — abrir ALS_NPC no Blueprint Editor)

### 2.1 Inicializar Health no BeginPlay

1. Abrir `ALS_NPC` (em `/Game/AdvancedLocomotionV4/Blueprints/CharacterLogic/`)
2. No EventGraph, localizar o node `Event BeginPlay`
3. Adicionar node `Set CurrentHealth`
4. Conectar `BeginPlay` → `Set CurrentHealth`
5. Conectar `MaxHealth` → valor de entrada de `CurrentHealth`

### 2.2 Receber Dano (Event AnyDamage)

1. Adicionar node `Event AnyDamage` (ja existe no Character, e built-in)
2. Do pino `Damage` do AnyDamage, subtrair de `CurrentHealth`:
   - `CurrentHealth = CurrentHealth - Damage`
3. Apos setar, adicionar um `Branch`:
   - Condicao: `CurrentHealth <= 0`
   - True → logica de morte (Parte 2.3)
   - False → continuar (pode adicionar reacao de dano: stagger, animacao, etc.)

### 2.3 Morte do NPC

Quando `CurrentHealth <= 0`:
1. `Set bIsDead = true`
2. `Set Actor Enable Collision = false` (para de colidir)
3. Opcional: `Set Ragdoll` (ALS_NPC ja tem RagdollStart/RagdollEnd)
4. `Delay` de 5 segundos
5. `Destroy Actor`

---

## Parte 3: Verificar se a Arma Aplica Dano (MANUAL — abrir BP_WeaponBase)

### 3.1 No SpawnProjectile ou EventGraph:

1. Abrir `BP_WeaponBase` (em `/Game/Blueprints/Weapons/`)
2. Localizar a funcao `SpawnProjectile` ou o EventGraph
3. Verificar se, ao acertar um ator, ha uma chamada para:
   - `Apply Damage` (node nativo do Unreal)
   - OU `Apply Point Damage`
   - OU `Apply Radial Damage`
4. **Se NAO houver chamada ApplyDamage:**
   - No ponto onde o projetil/linetrace detecta o hit:
   - Adicionar node `Apply Damage`
   - `Damaged Actor` = Hit Actor
   - `Base Damage` = valor do `CalculateDamage`
   - `Damage Causer` = Self (a arma)
   - `Event Instigator` = **Get Controller** do `OwnerCharacter` (não o `OwnerCharacter` diretamente)

   > **Correção técnica:** o pino `Event Instigator` dessas três funções (`ApplyDamage`, `ApplyPointDamage`, `ApplyRadialDamage`) espera um objeto do tipo `Controller`, não `Character`/`Pawn`. Conectar `OwnerCharacter` direto nesse pino causa erro de tipo incompatível na compilação. Para resolver:
   > 1. A partir do pino de referência do `OwnerCharacter`, puxar uma linha e adicionar o node `Get Controller`.
   > 2. Conectar a saída de `Get Controller` no pino `Event Instigator`.
   >
   > Isso vale igualmente se você optar por `Apply Point Damage` ou `Apply Radial Damage` em vez de `Apply Damage` — nas três, o pino de instigador é `Controller*`.

### 3.2 Ajustar dano da arma via MCP:

As variaveis da arma podem ser ajustadas via MCP:
```
set_blueprint_variable_properties para BP_WeaponBase
```

---

## Parte 4: Substituir NPCs no Nivel

Apos modificar o `ALS_NPC`, os 8 NPCs no nivel (`ALS_NPC_C_0` a `ALS_NPC_C_7`) precisam ser recriados para usar a versao atualizada:

1. Deletar os 8 ALS_NPC_C do nivel manualmente
2. Arrastar o `ALS_NPC` atualizado para o nivel 8 vezes
3. Posicionar nos locais desejados
4. Ajustar `MaxHealth` (ExposeOnSpawn) se necessario

OU: Rodar `compile_blueprint` via MCP — o Hot Reload pode atualizar as instancias.

---

## Parte 5: Testar

1. `pie_start` via MCP
2. Pegar uma arma (overlap) e atirar nos NPCs
3. Verificar: dano aplicado? NPC perde health? NPC morre?
4. `pie_stop` → `pie_state` ate `stopped`

---

## Nota adicional (não é erro, apenas observação de arquitetura)

O `BP_Character` (personagem jogável) usa um componente `AC_PlayerStatus` com uma função `SetDamage(Damage, OnlyHealth)` para gerenciar vida, em vez de variáveis `CurrentHealth`/`MaxHealth` soltas direto no Character. Este guia propõe um sistema mais simples, direto no `ALS_NPC`, o que é uma escolha de design válida para NPCs (não precisam da mesma robustez do player) — só fica registrado aqui para você não estranhar a inconsistência caso compare os dois sistemas depois.
