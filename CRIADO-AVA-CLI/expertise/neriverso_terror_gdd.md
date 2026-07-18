# NeriVerso: Terror — Game Design Document

## Arquitetura

```
BP_GameManager (Actor, Singleton, persistente entre fases)
├── Fase 1: Mate 3 zumbis
├── Fase 2: Mate 5 zumbis + 1 chave
├── Fase 3: Mate 7 zumbis + 2 chaves
├── Fase 4: Mate 10 zumbis + 2 chaves + 1 Boss
└── Fase N: Kills = 2*N+3, Keys = 1+floor(N/2)
        │
        ├── SpawnZombies(level, count) -> spawna BP_Zombie
        ├── SpawnKeys(level, count) -> spawna BP_Key
        ├── TrackKills/KillZombie() -> IncrementKill, check phase complete
        ├── TrackKeys/CollectKey() -> IncrementKey, check weapon upgrade
        └── UI_PhaseInfo -> mostra fase + objetivo

BP_Zombie (Character, baseado no BP_Enemy)
├── Health (int, default 3+level)
├── Speed (float, default 300+level*50)
├── Damage (float, default 20)
├── AI: AI MoveTo Player (chase, não patrola aleatório)
├── OnTakeDamage -> Health -= Damage
├── OnDestroyed -> GameManager.IncrementKill()
└── OnHitPlayer -> Player.TakeDamage(Damage)

BP_Key (Actor)
├── SphereComponent (overlap)
├── StaticMeshComponent (chave)
├── OnBeginOverlap(Player) -> GameManager.CollectKey() -> DestroySelf
└── RotatingComponent (visual feedback)

BP_FirstPersonCharacter (melhorias)
├── Health (float, default 100)
├── MaxHealth (float, default 100)
├── WeaponLevel (int, 0-3)
├── Keys (int)
├── TakeDamage(float Amount)
│   └── Health -= Amount
│   └── if Health <= 0 -> UI_Defeat
└── UpgradeWeapon()
    └── Keys >= 2 -> WeaponLevel++, Keys -= 2
```

## Variáveis por Blueprint

### BP_GameManager
| Variável | Tipo | Default | Descrição |
|----------|------|---------|-----------|
| CurrentPhase | int | 0 | Fase atual |
| KillCount | int | 0 | Zumbis mortos na fase |
| KillGoal | int | 3 | Meta de kills da fase |
| KeyCount | int | 0 | Chaves coletadas na fase |
| KeyGoal | int | 0 | Meta de chaves da fase |
| TotalZombies | int | 0 | Total de zumbis spawnados |
| PhaseActive | bool | false | Fase em andamento? |

### BP_Zombie
| Variável | Tipo | Default | Descrição |
|----------|------|---------|-----------|
| Health | int | 3 | Vida (aumenta com fase) |
| Speed | float | 300 | Velocidade de perseguição |
| Damage | float | 20 | Dano ao jogador |
| bIsDead | bool | false | Já morreu? |

### BP_Key
| Variável | Tipo | Default | Descrição |
|----------|------|---------|-----------|
| KeyID | int | 0 | ID da chave (pra tracking) |

### BP_FirstPersonCharacter (novas)
| Variável | Tipo | Default | Descrição |
|----------|------|---------|-----------|
| Health | float | 100 | Vida atual |
| MaxHealth | float | 100 | Vida máxima |
| WeaponLevel | int | 0 | 0=Pistola, 1=Rifle, 2=Shotgun |
| Keys | int | 0 | Chaves coletadas |

## Lógicas de Event Graph

### BP_GameManager
```
Event BeginPlay:
  -> StartPhase(1)

StartPhase(int Phase):
  -> CurrentPhase = Phase
  -> KillCount = 0, KeyCount = 0
  -> Calcula KillGoal = 2*Phase + 3, KeyGoal = 1 + floor(Phase/2)
  -> SpawnZombies(KillGoal)
  -> if KeyGoal > 0: SpawnKeys(KeyGoal)
  -> ShowPhaseUI(Phase, KillGoal, KeyGoal)

On Kill Updated:
  -> KillCount++
  -> UpdatePhaseUI()
  -> CheckPhaseComplete()

On Key Collected:
  -> KeyCount++
  -> Player.IncrementKeys()
  -> CheckWeaponUpgrade()
  -> CheckPhaseComplete()

CheckPhaseComplete:
  -> if KillCount >= KillGoal AND KeyCount >= KeyGoal:
       PhaseActive = false
       -> Delay(2s)
       -> StartPhase(CurrentPhase + 1)

CheckWeaponUpgrade:
  -> if Player.Keys >= 2:
       Player.UpgradeWeapon()
       Player.Keys -= 2
```

### BP_Zombie
```
Event BeginPlay:
  -> Set Health based on GameManager.CurrentPhase
  -> Set Speed based on GameManager.CurrentPhase

Event Tick:
  -> if not bIsDead:
       AI MoveTo Player Location

OnTakeDamage(int Amount):
  -> Health -= Amount
  -> if Health <= 0:
       bIsDead = true
       -> GameManager.IncrementKill()
       -> Play death animation/sound
       -> Destroy Self

OnHit Player (Overlap):
  -> Player.TakeDamage(Damage)
```

### BP_Key
```
Event BeginPlay:
  -> Assign random location / from spawn points

OnBeginOverlap(Player):
  -> Cast to BP_FirstPersonCharacter
  -> if Player: GameManager.CollectKey() -> Destroy Self
```

### BP_FirstPersonCharacter (novas funções)
```
TakeDamage(float Amount):
  -> Health -= Amount
  -> if Health <= 0:
       Health = 0
       -> Disable Input
       -> Show UI_Defeat

UpgradeWeapon():
  -> WeaponLevel++
  -> switch(WeaponLevel):
       case 1: rifle stats
       case 2: shotgun stats
       case 3: special weapon
```

## Ordem de Implementação (via MCP)

### Fase 1: Base
1. Criar BP_GameManager (Actor)
   - Variáveis de fase e contador
   - Event BeginPlay -> StartPhase(1)
   - SpawnZombies() usando SpawnActor

2. Modificar BP_Enemy → BP_Zombie
   - Adicionar variáveis: Health, Speed, Damage, bIsDead
   - Mudar AI: patrol aleatório → chase player
   - Adicionar OnTakeDamage

3. Adicionar Health ao BP_FirstPersonCharacter
   - Variáveis: Health(100), MaxHealth(100), WeaponLevel(0), Keys(0)
   - Função TakeDamage()

### Fase 2: Chaves e Arma
4. Criar BP_Key (Actor)
   - Mesh + overlap detection
   - OnOverlap: incrementa keys + destroy

5. Upgrade de arma no BP_FirstPersonCharacter
   - Função UpgradeWeapon()
   - Modificar PrimaryAction (tiro) baseado no WeaponLevel

### Fase 3: UI
6. Criar UI_PhaseInfo (Widget)
   - Mostra: Fase atual, Kills/X, Chaves/Y
   - Barra de vida

7. Atualizar UI_PlayerBalls → incluir barra de vida

---

*Design criado em 09-07-2026. Baseado no BP_Enemy + BP_Balls + BP_FirstPersonCharacter do NeriVerso.*
