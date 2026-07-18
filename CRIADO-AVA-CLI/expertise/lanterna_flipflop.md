# Padrão: Lanterna com Flip Flop (Ghost Project)

## Origem
Extraído do projeto **NeriVerso** (Ghost) em 09-07-2026 via MCP + Remote Control API.

## Resumo
Lanterna integrada diretamente no Character BP como **SpotLightComponent**, 
alternada com **Flip Flop** pela tecla **F**, com som de ligar/desligar.

---

## Componentes no Character BP

| Componente | Tipo | Nome |
|-----------|------|------|
| LuzLanterna | SpotLightComponent | `LuzLanterna` |
| Som Ligar | SoundCue | `Lanterna-Sons-01_Cue` |
| Som Desligar | SoundCue | `Lanterna-Sons-02_Cue` |
| Material LightFunction | Material | `Renderização-Lanterna_Mat` |

OBS: O SpotLight deve ter o Light Function Material aplicado para o efeito de lanterna.

---

## Lógica do Event Graph

```
InputKey F (Pressed) → Flip Flop
  ├── A (LIGAR):
  │   Spawn Sound "Lanterna-Sons-01_Cue" at Location
  │   → Delay (≈0.3s)
  │   → Set Visibility(TRUE) → LuzLanterna (SpotLightComponent)
  │
  └── B (DESLIGAR):
      Spawn Sound "Lanterna-Sons-02_Cue" at Location
      → Delay (≈0.3s)
      → Set Visibility(FALSE) → LuzLanterna (SpotLightComponent)
```

---

## Nós do Blueprint (59 nós totais, estes são os da lanterna)

| Nó | Tipo | Posição | Conexões |
|----|------|---------|----------|
| InputKey F | K2Node_InputKey | (2096, 1600) | Pressed→FlipFlop(1) |
| Flip Flop | K2Node_MacroInstance | (2352, 1601) | A→SpawnSound(A), B→SpawnSound(B) |
| Get LuzLanterna | K2Node_VariableGet | (2272, 1808) | Output(2)→Knot_6→Knot_5→SetVis(2), Knot_7→Knot_4→SetVis(6) |
| Spawn Sound (A) | K2Node_CallFunction_7 | (2624, 1601) | then→Delay(10) |
| Delay (A) | K2Node_CallFunction_10 | (3040, 1600) | then→SetVisibility(2) |
| Set Visibility TRUE | K2Node_CallFunction_2 | (3376, 1584) | self←Knot_5, bNewVisibility=TRUE(default) |
| Spawn Sound (B) | K2Node_CallFunction_8 | (2640, 1919) | then→Delay(11) |
| Delay (B) | K2Node_CallFunction_11 | (3088, 1919) | then→SetVisibility(6) |
| Set Visibility FALSE | K2Node_CallFunction_6 | (3376, 1901) | self←Knot_4, bNewVisibility=FALSE(default) |
| Knot 4 | K2Node_Knot | (3296, 1856) | InputPin←Knot_7, OutputPin→SetVis(6).self |
| Knot 5 | K2Node_Knot | (3296, 1792) | InputPin←Knot_6, OutputPin→SetVis(2).self |
| Knot 6 | K2Node_Knot | (2512, 1792) | InputPin←GetLuzLanterna, OutputPin→Knot_5 |
| Knot 7 | K2Node_Knot | (2512, 1856) | InputPin←GetLuzLanterna, OutputPin→Knot_4 |

---

## Checklist de Replicação (via MCP)

1. **Adicionar componente SpotLight** ao BP do jogador
   ```json
   {"type": "add_component_to_blueprint", "params": {
     "blueprint_name": "BP_Character",
     "component_type": "SpotLightComponent",
     "component_name": "LuzLanterna"
   }}
   ```

2. **Configurar SpotLight** (intensidade, cor, atenuação, light function)
   ```json
   {"type": "set_point_light_properties", "params": {
     "blueprint_name": "BP_Character",
     "component_name": "LuzLanterna",
     "intensity": 5000,
     "light_color": [1.0, 0.9, 0.7, 1.0],
     "attenuation_radius": 3000,
     "inner_cone_angle": 15,
     "outer_cone_angle": 30
   }}
   ```

3. **Adicionar InputAction F** no Project Settings
   - Action Name: `Lanterna`
   - Key: F

4. **Adicionar nós no Event Graph:**
   - InputKey F (Pressed) → Flip Flop
   - Flip Flop A → Spawn Sound (Ligar) → Delay → Set Visibility (TRUE) LuzLanterna
   - Flip Flop B → Spawn Sound (Desligar) → Delay → Set Visibility (FALSE) LuzLanterna

---

## Variações Possíveis

### Sem som
Remova os nós Spawn Sound e Delay. Direto: F → Flip Flop → SetVisibility.

### Com variável de estado
Adicione `bLanternaLigada` (Boolean). Use Branch ao invés de Flip Flop:
```
F Pressed → Set bLanternaLigada = NOT bLanternaLigada → Branch
  True  → Set Visibility TRUE
  False → Set Visibility FALSE
```

### Com consumo de bateria
Adicione `Bateria` (float, default 100). No Tick, se bLanternaLigada:
diminuir Bateria. Se Bateria <= 0: desligar automaticamente.

---

*Extraído via MCP (TCP 55557) + Remote Control API (HTTP 30010) em 09-07-2026*
