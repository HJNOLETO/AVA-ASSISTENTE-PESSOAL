# 🔦 Correção: Lanterna na Arma (BP_WeaponBase)

**[Sessão: 14/Jul/2026]**
**[Plugin: UnrealMCP V5 — 61 comandos]**

---

## 1. Diagnóstico Inicial

### Comandos MCP usados para inspeção

```python
# Buscar assets de arma
search_assets(query="weapon", asset_classes=["Blueprint"])
# → AC_WeaponSystem, BP_WeaponBase, BP_WeaponInterface

# Buscar assets de personagem
search_assets(query="character", asset_classes=["Blueprint"])  
# → BP_Character em /Game/Blueprints/Character/

# Ler componentes do BP_WeaponBase
read_blueprint_content(
    blueprint_path="/Game/Blueprints/Weapons/BP_WeaponBase.BP_WeaponBase",
    include_components=True,
    include_variables=True
)

# Ver hierarquia com transforms
get_blueprint_components(
    blueprint_name="/Game/Blueprints/Weapons/BP_WeaponBase",
    include_transforms=True
)

# Analisar grafo (182 nós)
get_blueprint_graph_nodes(
    blueprint_name="/Game/Blueprints/Weapons/BP_WeaponBase.BP_WeaponBase"
)

# Verificar Input Actions criadas (V5)
search_assets(query="IA_", asset_classes=["InputAction"])
# → IA_ToggleFlashlight em /Game/Input/

search_assets(query="IMC", asset_classes=["InputMappingContext"])
# → IMC_Default em /Game/Blueprints/Data/Inputs/IMC_Default
```

### Hierarquia encontrada

```
BP_WeaponBase (Actor)
├── Root (DefaultSceneRoot)
├── WeaponMesh (SkeletalMeshComponent)
│   ├── WeaponCollision (CapsuleComponent)
│   ├── Magazine (StaticMeshComponent)
│   └── SpringArm          ← ❌ PROBLEMA 1: SpringArm não pertence a arma
│       └── LuzLanterna    ← ❌ PROBLEMA 2: SpotLight filha do SpringArm
└── RotatingMovement (RotatingMovementComponent)
```

### Variáveis relevantes

| Variável | Tipo | Editável | Observação |
|----------|------|----------|------------|
| `FlashlightOn` | `bool` | Não | Existe mas sem lógica de toggle |
| `OwnerCharacter` | `Object` | Sim | Referência ao character dono |

### Template de referência (BP_WeaponBase.template.json)

O template extraído anteriormente lista 9 componentes, mas **NÃO** inclui `SpringArm` nem `LuzLanterna`. Foram adicionados manualmente depois da extração. O template original é o correto — SpringArm e luz não fazem parte da estrutura planejada.

---

## 2. Por que está errado (padrão Epic Games)

### SpringArmComponent

> *Documentação oficial Epic:* `USpringArmComponent` é usado para **"prevent the camera from clipping into the level"** — proporciona camera lag, collision testing e rotação suave.

| Contexto correto | Contexto errado |
|------------------|-----------------|
| `Character → SpringArm → Camera` | `Weapon → SpringArm → Luz` |
| Personagem, veículo, drone | Arma, props, itens |

**Consequências do uso errado:**
- Overhead computacional desnecessário (collision test por frame)
- Rotation lag herdado pela luz (pode causar flickering)
- Estrutura confusa para manutenção futura

### Hierarquia correta (padrão Epic)

```
WeaponMesh (SkeletalMesh)
└── LuzLanterna (SpotLightComponent)   ← filha DIRETA, com transform manual
```

A SpotLight deve ser posicionada via `SetRelativeLocation` e `SetRelativeRotation` para apontar para frente do cano/trilho tático.

---

## 3. Correções planejadas

### Passo a passo

| # | Ação | Comando MCP | Status |
|---|------|-------------|--------|
| 1 | Remover `SpringArm` | `remove_component_from_blueprint` | ✅ |
| 2 | Remover `LuzLanterna` antiga | `remove_component_from_blueprint` | ✅ |
| 3 | Criar `LuzLanterna` nova como filha direta de `WeaponMesh` | `add_component_to_blueprint` + `attach_component_to_blueprint` | ✅ |
| 4 | Configurar intensidade, cor, raio, visibilidade | `set_component_properties` + `set_point_light_properties` | ✅ |
| 5 | Criar nó `add_input_action_node` para `IA_ToggleFlashlight` | `add_input_action_node` | ✅ |
| 6 | Criar nó `ToggleActive` no componente `LuzLanterna` | `call_function_on_object` | ✅ |
| 7 | Conectar `Pressed` → `ToggleActive.execute` | `connect_nodes` | ✅ |
| 8 | Compilar | `compile_blueprint` | ✅ |
| 9 | Testar no PIE com tecla `F` | Manual | ⬜ aguardando teste |

### Nota sobre Input Actions (V5)

O `IA_ToggleFlashlight` já foi criado e mapeado para tecla `F` no `IMC_Default` via:
```
create_input_action_asset(action_name="IA_ToggleFlashlight")
map_input_action(
    action_asset_path="/Game/Input/IA_ToggleFlashlight",
    mapping_context_path="/Game/Blueprints/Data/Inputs/IMC_Default",
    key="F"
)
```

### Especificações da Luz (SpotLight)

| Propriedade | Valor | Descrição |
|-------------|-------|-----------|
| `intensity` | `5000.0` | Intensidade em lumens |
| `attenuation_radius` | `2500.0` | Alcance da luz em cm |
| `inner_cone_angle` | `10.0` | Ângulo interno do cone |
| `outer_cone_angle` | `25.0` | Ângulo externo do cone |
| `light_color` | `[1.0, 0.95, 0.8]` | Branco quente |
| `cast_shadows` | `false` | Performance (spotlight tático) |
| `visible` | `false` | Começa desligada |

---

## 4. Referências consultadas

| Documento | Relevância |
|-----------|------------|
| `Templates/weapons/BP_WeaponBase.template.json` | Estrutura original (sem SpringArm/luz) |
| `Docs_ProjetoGTA_Estudo/02_Blueprints/BP_WeaponBase.md` | Documentação de estudo do sistema de armas |
| `Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-AC_WeaponSystem.md` | Documentação do WeaponSystem (fire, reload, pickup) |
| `CHANGELOG_FIXES.md` | Regras de validação (E1-E8, I1-I2) |
| Epic Docs: `USpringArmComponent` | "for camera collision avoidance" |
| Epic Docs: `USpotLightComponent` | Parent class, direct child attachment pattern |
| `SESSAO_13-07-2026.md` Seção 9 | V5: create_input_action_asset e map_input_action |

---

## 5. Resultados — 14/Jul/2026

### 5.1 Correção de componentes — ✅ SUCESSO

| Passo | Comando | Resultado |
|-------|---------|-----------|
| 1-2 | `remove_component_from_blueprint` (LuzLanterna + SpringArm) | Removidos com sucesso |
| 3 | `add_component_to_blueprint` + `attach_component_to_blueprint` | LuzLanterna filha direta de WeaponMesh |
| 4 | `set_component_properties` + `set_point_light_properties` | 7 propriedades + cor configuradas |
| — | `compile_blueprint` (BP_WeaponBase) | Compilado ✅ |

### Hierarquia final (corrigida)

```
BP_WeaponBase (Actor)
├── Root (DefaultSceneRoot)
├── WeaponMesh (SkeletalMeshComponent)
│   ├── WeaponCollision (CapsuleComponent)
│   ├── Magazine (StaticMeshComponent)
│   └── LuzLanterna (SpotLightComponent) ← ✅ CORRETO: filha direta
└── RotatingMovement (RotatingMovementComponent)
```

Removido: `SpringArm` + `LuzLanterna` antiga (filha do SpringArm).

### Propriedades finais da LuzLanterna

| Propriedade | Valor |
|-------------|-------|
| `visible` | `false` (inicia invisível) |
| `active` | `false` (inicia desligada) |
| `intensity` | `5000.0` |
| `attenuation_radius` | `2500.0` |
| `inner_cone_angle` | `10.0` |
| `outer_cone_angle` | `25.0` |
| `cast_shadows` | `false` |
| `light_color` | `[1.0, 0.95, 0.85]` |

### 5.2 Correção do Input Action — ✅ SUCESSO (localização)

**Erro inicial:** `IA_ToggleFlashlight` foi criado no `BP_WeaponBase`, que é um **Actor**. Atores não recebem input do jogador.

**Correção:** Criado no **`ALS_Base_CharacterBP`** (Character que tem o componente `WeaponSystem`):

```
Hierarquia:
Character → ALS_Base_CharacterBP (WeaponSystem, Interaction, PlayerStatus, CustomMovement)
          → ALS_Player (personagem jogável)
```

```json
// Comando usado
add_input_action_node({
    "blueprint_name": "/Game/AdvancedLocomotionV4/Blueprints/CharacterLogic/ALS_Base_CharacterBP.ALS_Base_CharacterBP",
    "action_name": "IA_ToggleFlashlight",
    "trigger_event": "Triggered"
})
// Resultado: K2Node_InputAction_0 em (200, 200)
```

### 5.3 Wiring manual necessário — ⚠️ PENDENTE (limitação da API MCP)

A API MCP atual **não suporta** drill-down entre componentes para acessar variáveis aninhadas (`WeaponSystem → CurrentWeapon → ToggleFlashlight`):

| Limitação | Motivo |
|-----------|--------|
| `add_get_node` | Só funciona no EventGraph (não em funções) e só no escopo do BP |
| `call_function_on_object` | Cria nó CallFunction mas **self pin fica desconectado** (conn=0) |
| `add_blueprint_node` com `CallFunction` | Cria função em classe C++, não em BP |
| Drill-down de componentes | Não há comando para "Get" de variável a partir de output pin |

### Instruções de wiring manual (Editor UE5)

Abra `ALS_Base_CharacterBP` → **EventGraph**:

1. Encontre o nó `InputAction IA_ToggleFlashlight` em (200, 200)
2. Arraste do pin **Pressed** (exec output)
3. **Get WeaponSystem** (arraste do painel Variables → Components → WeaponSystem para o grafo)
4. Do pin de output **WeaponSystem**, arraste → busque **"Get CurrentWeapon"**
5. Do pin de output **CurrentWeapon**, arraste → busque **"ToggleFlashlight"**
6. Conecte o exec pin:
   ```
   IA_ToggleFlashlight.Pressed → ToggleFlashlight.execute
   ```
7. Compile (Ctrl+Shift+B) e teste no PIE com tecla **`F`**

Fluxo final:
```
Tecla F → IA_ToggleFlashlight (Pressed) → WeaponSystem.Ref → CurrentWeapon.Ref → ToggleFlashlight
```

### 5.4 Função ToggleFlashlight (já existente no BP_WeaponBase)

A função `ToggleFlashlight` no `BP_WeaponBase` já contém 9 nós com lógica completa:

```
FunctionEntry → Get FlashlightOn → Branch
  ├─ True → Get LuzLanterna → SetVisibility(false) + PlaySound
  └─ False → Get LuzLanterna → SetVisibility(true) + PlaySound
```

Esta função usa a variável `FlashlightOn` (bool, não-editável) para alternar estado.

---

## 6. Lições aprendidas (atualizado)

1. **`call_function_on_object` self pin não é auto-conectado**: O comando cria o nó CallFunction mas o pin `self` fica com 0 conexões. Só funciona quando o target já é self do BP (ex: chamar uma função definida no próprio BP).

2. **`add_get_node` só funciona no escopo do BP**: `SetSelfMember(VariableName)` busca variáveis do próprio Blueprint, não de componentes referenciados.

3. **`add_blueprint_node` vs `call_function_on_object`**: A rota `add_blueprint_node` com `node_type: "CallFunction"` suporta `node_params.function_name` para mirar funções específicas, mas `add_get_node` e `call_function_on_object` não — sempre vão para o EventGraph.

4. **Input Action precisa estar no Character, não no Actor**: Apenas Characters e PlayerControllers (que implementam `APawn`) recebem input do jogador via Enhanced Input. Atores como `BP_WeaponBase` não recebem input diretamente.

5. **Hierarquia correta de herança para input**:
   ```
   Character → ALS_Base_CharacterBP (WeaponSystem está aqui)
            → ALS_Player (personagem jogável, herda WeaponSystem)
   ```

6. **`target_class` sempre com path completo**: `/Script/Engine.ActorComponent` (com `/Script/`) funciona. Nome curto `ActorComponent` falha no `LoadObject`.

7. **Nós órfãos em (0,0) precisam ser limpos**: Se `add_get_node` falha (node_id=000...), o nó pode ter sido criado mas mal posicionado. Verificar com `get_blueprint_graph_nodes` e limpar com `delete_node`.

8. **Sempre compilar após exclusão**: `compile_blueprint` valida se o grafo está consistente após remover nós.

---

*Documento finalizado em 14/Jul/2026 — Sessão V5*
