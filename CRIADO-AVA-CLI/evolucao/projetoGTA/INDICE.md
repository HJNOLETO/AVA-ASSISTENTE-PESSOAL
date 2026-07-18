# ProjetoGTA — Indice de Desenvolvimento

**Inicio:** 17/07/2026
**UE:** 5.6.1
**Plugin MCP:** UnrealMCP 1.0.0 (86 comandos, V5 com fix EndPIE)

---

## Estrutura de Pastas

```
projetoGTA/
├── INDICE.md                    ← voce esta aqui
├── sistema-combate/             Armas, dano, tiroteio, cobertura
├── sistema-missoes/             Missoes, objetivos, recompensas, progressao
├── hud-interface/               HUD, menus, inventario, radar/minimapa
├── npcs-ia/                     NPCs, inimigos, patrulha, comportamento
├── veiculos/                    Carros, motos, fisica, entrada/saida
├── economia/                    Moedas, loja, compra de armas/roupas
└── limites-plugin/              O que o MCP nao faz — gaps e workarounds
```

---

## 1. Sistema de Combate

**Status atual:** BP_WeaponBase com 36 propriedades (dano, fire rate, spread, bullet speed), BP_AmmoBox, AC_PlayerStatus (Health). Basico funcional.

**A implementar/melhorar:**
- [ ] Sistema de dano no jogador e NPCs
- [ ] Morte e respawn
- [ ] Sistema de cobertura (cover)
- [ ] Diferentes tipos de arma (pistola, rifle, shotgun)
- [ ] Efeitos de tiro (muzzle flash, impactos, som)
- [ ] Recarga de arma

**Pasta:** `sistema-combate/`

---

## 2. Sistema de Missoes

**Status atual:** BP_MissionMarker (2 no mapa). Apenas marcadores visuais.

**A implementar/melhorar:**
- [ ] Estrutura de missao (objetivos, etapas)
- [ ] Dialogo / texto de missao
- [ ] Recompensas (dinheiro, itens)
- [ ] Progressao (cadeia de missoes)
- [ ] Tipos: entrega, eliminacao, coleta, escolta

**Pasta:** `sistema-missoes/`

---

## 3. HUD / Interface

**Status atual:** Nao identificado HUD completo no projeto.

**A implementar/melhorar:**
- [ ] HUD principal (vida, municao, dinheiro)
- [ ] Radar / minimapa
- [ ] Indicador de missao ativa
- [ ] Menu de pausa
- [ ] Tela de morte / game over
- [ ] Inventario de armas

**Pasta:** `hud-interface/`

---

## 4. NPCs e IA

**Status atual:** 8 ALS_NPC no mapa com 51 variaveis de customizacao (cores, roupas). IA basica ou nenhuma.

**A implementar/melhorar:**
- [ ] Comportamento hostil (inimigos)
- [ ] Patrulha / waypoints
- [ ] Percepcao (visao, audicao)
- [ ] Reacao a tiros
- [ ] Fugir / buscar cobertura
- [ ] NPCs neutros (civis, pedestres)

**Pasta:** `npcs-ia/`

---

## 5. Veiculos

**Status atual:** Nao identificados veiculos no projeto.

**A implementar/melhorar:**
- [ ] Blueprint de veiculo base
- [ ] Fisica de direcao
- [ ] Entrada/saida do veiculo
- [ ] Camera de veiculo
- [ ] Dano em veiculos
- [ ] Tipos: carro, moto

**Pasta:** `veiculos/`

---

## 6. Economia

**Status atual:** BP_InteractiveCoin (moeda coletavel).

**A implementar/melhorar:**
- [ ] Sistema de dinheiro (wallet)
- [ ] Loja de armas
- [ ] Loja de roupas
- [ ] Precos e balancing
- [ ] Save/load da economia

**Pasta:** `economia/`

---

## 7. Limites do Plugin MCP

**Status:** Documentado em `limites-plugin/LIMITES_PLUGIN_MCP.md`

**Gaps conhecidos:**
- [ ] Sem comando `delete_blueprint` — delecao manual necessaria
- [ ] Outros a descobrir durante implementacao

**Pasta:** `limites-plugin/`

---

## Ordem Sugerida de Implementacao

1. **HUD/Interface** — base visual para tudo
2. **Sistema de Combate** — mecânica central
3. **NPCs/IA** — inimigos para combate
4. **Sistema de Missoes** — proposito e progressao
5. **Economia** — recompensas e compras
6. **Veiculos** — navegacao e perseguicao
