# 🔬 Sistema de Aprendizado do AVA CLI + UnrealMCP

## Como o AVA "aprende" a criar Blueprints, Actors, Física, Construção e mais

---

## 1. Resumo Executivo

O AVA CLI **não usa machine learning no sentido tradicional** (redes neurais, treinamento por gradiente). Em vez disso, ele combina **5 mecanismos complementares** que juntos produzem comportamento inteligente:

| # | Mecanismo | Papel |
|---|-----------|-------|
| ① | **System Prompt + Tool Definitions** | Ensina o LLM o que é possível fazer |
| ② | **Keyword-Based Tool Routing** | Decide qual ferramenta usar (`unreal_ops` vs `unreal_mcp`) |
| ③ | **C++ Plugin Hardcoded** | O conhecimento de *como* criar Blueprints está compilado no C++ |
| ④ | **RAG (Retrieval-Augmented Generation)** | Recupera documentação relevante para o LLM no momento da pergunta |
| ⑤ | **Skill Files (.md)** | Injetam instruções contextuais no system prompt |

O **aprendizado real** vem da documentação exportada e indexada (Blueprints_Exportados + Docs_ProjetoGTA_Estudo + Antigravity_Tutorial + Notebook_LM), que o RAG recupera e o LLM interpreta em tempo real.

---

## 2. Anatomia do Conhecimento: Onde Cada Tipo de "Saber" Vive

### 2.1 Conhecimento Operacional (Hardcoded no C++)

O plugin `UnrealMCP` contém o conhecimento de **como executar** operações na engine:

```
flopperam-mcp/Source/UnrealMCP/Private/Commands/
├── EpicUnrealMCPEditorCommands.cpp       → spawn, delete, transform, attach
├── EpicUnrealMCPBlueprintCommands.cpp    → criar BP, adicionar componentes, física, materiais
├── EpicUnrealMCPBlueprintGraphCommands.cpp → nós, pins, variáveis, funções, eventos
└── EpicUnrealMCPBuildingCommands.cpp     → parede, escada, torre, casa (criado pelo AVA)
```

**O que isso sabe:**
- Como criar um `UBlueprint` via `FKismetEditorUtilities::CreateBlueprint()`
- Como adicionar `UStaticMeshComponent`, `USceneComponent`, `UPointLightComponent`
- Como compilar via `FKismetEditorUtilities::CompileBlueprint()`
- Como spawnar atores via `GEditor->GetEditorWorldContext().World()->SpawnActor()`
- Como configurar simulação de física via `UPrimitiveComponent::SetSimulatePhysics()`
- Como construir geometria procedural (loop de spawning com offsets incrementais)

**Limitação:** Este conhecimento é **cego** — ele sabe criar um Blueprint genérico, mas não sabe criar um `BP_WeaponBase` específico com variáveis `CurrentAmmoInMag`, eventos `WeaponFire`, e funções `CanShoot?` como o projeto real usa.

---

### 2.2 Conhecimento de Domínio (Exportado como Markdown)

Os **Blueprints exportados** (`Blueprints_Exportados/`) contêm o conhecimento de **como Blueprints reais são estruturados** no ProjetoGTA:

#### Estrutura de cada documento exportado:

```
# 🎮 Blueprint: BP_WeaponBase
**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| CurrentAmmoInMag | int |
| CurrentAmmoInBP | int |
| Fire Rate | real (double) |
| Weapon Spread | real (double) |
| Modo de Tiro | byte (E_FireMode) |
| ...

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`
**Comentários e Títulos de Seção Encontrados:**
- "Interação com as armas"
- "Simular Física"
- "Evento atirar"
- "Evento Recarregar"

**Eventos de Entrada:**
- 🟢 ReceiveBeginPlay()
- 🟢 WeaponFire (Custom Event)
- 🟢 WeaponReload (Custom Event)

**Funções e Métodos Chamados:**
- 🛠️ CanShoot?()
- 🛠️ SpawnProjectile()
- 🛠️ CanReload?()
- 🛠️ ReloadStart()
- 🛠️ SetWeaponIsDropped()

**Variáveis Manipuladas:**
- Get CurrentAmmoInMag | Set CurrentAmmoInMag
- Get CurrentAmmoInBP | Set CurrentAmmoInBP
- 🔀 Contém 12 nós de decisão (Branch/If).

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint BP_WeaponBase?
- Quais variáveis estão disponíveis no Blueprint BP_WeaponBase?
- Quais funções e eventos são chamados no grafo do BP_WeaponBase?
```

**O que isso sabe:**
- **Convenções de nomenclatura:** Variáveis em português (`Vida Atual`), inglês (`Health`), misto
- **Padrões de componentes:** `WeaponMesh`, `WeaponCollision`, `AmmoCollision`, `Magazine`
- **Padrões de eventos customizados:** `WeaponFire`, `WeaponReload`, `Death`, `Reanimate`, `Interact`
- **Padrões de funções:** `CanShoot?()`, `CanReload?()`, `SpawnProjectile()`, `SpawnMagazine()`
- **Padrões de seção (Comment Boxes):** "Sistema de vida", "Sistema de Colete", "Interação com as armas"
- **Complexidade de grafo:** quantos Branch/If cada grafo contém
- **Padrões de replicação:** `OnRep_CurrentAmmoInMag`, `FlushNetDormancy`
- **Padrões de interface:** `BPI_Get_EssentialValues`, `BPI_Set_OverlayState`

#### Chunked T3D (detalhe máximo)

Para Blueprints complexos (`AC_PlayerStatus`, `AC_WeaponSystem`, `BP_CustomMovementComponent`), existem arquivos chunked com o **grafo completo em T3D**:

```
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_14"
   FunctionReference=(MemberParent="/Script/Engine.KismetMathLibrary",MemberName="FClamp")
   NodePosX=800
   NodePosY=480
   NodeGuid=5D8F3A2B4E1C9A7F6B3D0E2C1A8F4B6D
   CustomProperties Pin (PinId=ABC123,PinName="Value",Direction="EGPD_Input",PinType.PinCategory="real",...)
   CustomProperties Pin (PinId=DEF456,PinName="Min",Direction="EGPD_Input",PinType.PinCategory="real",...)
   CustomProperties Pin (PinId=GHI789,PinName="Max",Direction="EGPD_Input",PinType.PinCategory="real",...)
   CustomProperties Pin (PinId=JKL012,PinName="ReturnValue",Direction="EGPD_Output",...)
   CustomProperties Pin (PinId=MNO345,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",
     LinkedTo=(K2Node_IfThenElse_2 ABC123,))
   CustomProperties Pin (PinId=PQR678,PinName="execute",Direction="EGPD_Input",PinType.PinCategory="exec",
     LinkedTo=(K2Node_CustomEvent_5 STU901,))
End Object
```

**Isso contém:**
- Posições exatas dos nós (`NodePosX`, `NodePosY`)
- Conexões completas de execução (`PinCategory="exec"` + `LinkedTo`)
- Conexões completas de dados (`LinkedTo` entre pins de dados)
- Valores default (`DefaultValue="..."`)
- Tipos exatos (`PinType.PinCategory="struct"`, `PinType.PinSubCategoryObject=...`)

> **Este é o "ouro" do aprendizado.** Com o T3D, é possível recriar qualquer grafo Blueprint programaticamente.

---

### 2.3 Conhecimento Pedagógico (Documentação Humana)

| Diretório | Conteúdo | Formato de Conhecimento |
|-----------|----------|------------------------|
| `Docs_ProjetoGTA_Estudo/` | 37+ docs de análise de Blueprints, sistemas, C++ | Explicações, padrões de arquitetura, bugs conhecidos |
| `Antigravity_Tutorial/` | Tutoriais reversos, guias de modificação | Lições aprendidas, armadilhas, correções |
| `Notebook_LM/` | Roadmap de aprendizagem, guia GameMode | Estrutura conceitual, glossário (~40 termos) |
| `tecnologia-3d/` | Curso C++ UE, metodologia de desenvolvimento | Fundamentos teóricos |

**Exemplo de conhecimento pedagógico** (do `Manual_Pratico_Implementacao.md`):
```
Passo 3: Criar sistema de recarga
├── Adicionar variável CurrentAmmoInMag (int, default 30)
├── Adicionar variável CurrentAmmoInBP (int, default 90)
├── Criar função CanReload?() → retorna bool
│   ├── Branch: CurrentAmmoInMag < MaxAmmoInMag?
│   ├── Branch: CurrentAmmoInBP > 0?
│   └── Return true/false
├── Criar Custom Event WeaponReload
│   ├── Call CanReload?
│   ├── Branch on result
│   ├── Set IsReloading = true
│   └── Delay (Tempo de Recarga) → Set IsReloading = false
└── ...
```

---

### 2.4 Conhecimento de Roteamento (Tool Definitions + Keywords)

Em `server/agents.ts`:

```typescript
// Keyword gate que ativa o unreal_mcp:
const mcpRegex = /spawnar|spawn|criar.*blueprint|criar.*bp|componente|compilar|
  fisica|physics|material|cor|no.*graph|conectar.*pin|variavel.*bp|
  
  casa|torre|parede|escada|procedural|construir|mcp|unreal_mcp/i;

// Tool definition:
{
  name: "unreal_mcp",
  description: "Integracao avancada com Unreal Engine 5 via plugin UnrealMCP...",
  parameters: {
    action: { enum: ["check", "actors", "find_actor", "delete_actor", 
      "set_transform", "create_bp", "add_component", "compile_bp", 
      "spawn_actor", "set_physics", "list_materials", "apply_material", 
      "set_color", "add_node", "connect_nodes", "create_var", 
      "construct_house", "create_tower", "create_wall", "create_staircase"] },
    ...
  }
}
```

**O que isso sabe:**
- Quais 21 ações existem no adapter
- Quais parâmetros cada ação espera
- Quais keywords do usuário ativam esta ferramenta

---

### 2.5 Conhecimento de Contexto (Skills)

Os arquivos `.md` em `skills/` injetam instruções detalhadas no system prompt:

- `unreal-engine-teacher/` → ativado por keywords: `unreal`, `ue5`, `blueprint`, `umg`, `behavior tree`
- `unreal-engine-diagnostics/` → ativado por: `msb3073`, `c1083`, `compilar`, `compilação`
- `unreal-engine-projeto-gta/` → ativado por: `projeto gta`, `gta`, `hud`

---

## 3. O Pipeline de Aprendizado Atual (End-to-End)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PIPELINE DE APRENDIZADO                           │
│                                                                         │
│  [1] EXPORTAÇÃO                     [2] PARSE                           │
│  ┌──────────────────┐              ┌──────────────────┐                │
│  │ export_blueprints │──T3D──────→│ parse_blueprints  │                │
│  │ .py (headless UE) │  159 BPs   │ .py (scope stack) │                │
│  └──────────────────┘              └──────┬───────────┘                │
│                                           │                            │
│                                           │ .md files                  │
│                                           ▼                            │
│  [3] INDEXAÇÃO (RAG)                                         [4] CONSULTA │
│  ┌──────────────────┐                              ┌──────────────────┐ │
│  │ sync-rag-criado- │──SHA256──→──nomic-embed──→──│ Usuário pergunta │ │
│  │ ava-cli.ps1      │  331 files   text (Ollama)   │ "crie uma arma"  │ │
│  └──────────────────┘                              └──────┬───────────┘ │
│                                                           │            │
│                                                           ▼            │
│  [5] RECUPERAÇÃO SEMÂNTICA          [6] AUMENTO DE CONTEXTO            │
│  ┌──────────────────┐              ┌──────────────────┐                │
│  │ retriever-patch  │──top-k────→│ System Prompt     │                │
│  │ .ts (contextual  │  docs        │ + RAG docs        │                │
│  │  boost +0.30)    │              │ + tool defs       │                │
│  └──────────────────┘              │ + skills          │                │
│                                    └──────┬───────────┘                │
│                                           │                            │
│                                           ▼                            │
│  [7] LLM (gemma4:31b-cloud)          [8] EXECUÇÃO                      │
│  ┌──────────────────┐              ┌──────────────────┐                │
│  │ Gera tool call   │──JSON──────→│ executor.ts      │                │
│  │ com ação e args  │              │ → unrealMcp(args)│                │
│  └──────────────────┘              │ → TCP 55557       │                │
│                                    └──────┬───────────┘                │
│                                           │                            │
│                                           ▼                            │
│  [9] EXECUÇÃO NO C++                 [10] RESULTADO                    │
│  ┌──────────────────┐              ┌──────────────────┐                │
│  │ UnrealMCP        │──spawn/───→│ Blueprint criado  │                │
│  │ Plugin (C++)     │  create      │ Actor spawnado    │                │
│  └──────────────────┘              └──────────────────┘                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. O Que Já Funciona Bem

### 4.1 Forças do Sistema Atual

| Força | Evidência |
|-------|-----------|
| **Pipeline de exportação automática** | 159 Blueprints exportados, parseados via scope-stack, indexados no RAG |
| **Documentação bilíngue consistente** | Toda doc usa padrão fixo (Português-Inglês) com seções previsíveis |
| **RAG com boost contextual** | `retriever-patch.ts` aplica +0.30 a docs do projeto aberto no editor |
| **Dual-channel complementar** | `unreal_ops` (Python flexível) + `unreal_mcp` (operações estruturadas) |
| **Separação de responsabilidades** | C++ (operações) vs TypeScript (roteamento) vs Markdown (conhecimento) |
| **Changelog e tracking** | `Changelog_Base_Estudos.md` registra bugs, exploits, correções |

### 4.2 O Que o LLM Consegue Fazer Hoje

Com o RAG recuperando `BP_WeaponBase.md`, o LLM **consegue**:

1. **Entender** que `BP_WeaponBase` tem variáveis `CurrentAmmoInMag`, `Fire Rate`, `Weapon Spread`
2. **Saber** que ele tem Custom Events `WeaponFire`, `WeaponReload`, `SpawnProjectile`
3. **Ver** que o EventGraph usa seções comment-box como "Interação com as armas", "Simular Física"
4. **Inferir** convenções: variáveis em português, funções com `?` no nome, prefixo `WPN_` para funções do sistema de armas

Com isso, quando o usuário pergunta *"Como criar um sistema de recarga igual ao da AK-47?"*, o LLM:
1. Recupera `BP_WeaponBase.md` e `AK47_Estudo_Armas/03_Logica_Recarga/` via RAG
2. Lê as variáveis, eventos e funções documentados
3. Gera uma tool call `unreal_mcp` com `create_bp`, `create_var`, `add_node`, `connect_nodes`
4. Constrói passo a passo um Blueprint com a mesma arquitetura

---

## 5. Lacunas e Oportunidades de Melhoria

### 5.1 Lacuna #1: O Adapter é Incompleto

O plugin C++ expõe **39+ comandos**, mas o adapter TypeScript mapeia apenas **~23** (59%).

**Comandos C++ existentes SEM mapeamento no adapter:**

| Comando C++ | Função | Valor para aprendizado |
|-------------|--------|----------------------|
| `read_blueprint_content` | Lê o conteúdo textual de um BP | CRÍTICO: permitiria ao LLM inspecionar BPs existentes antes de modificá-los |
| `analyze_blueprint_graph` | Analisa estrutura de grafos | CRÍTICO: resposta estruturada sobre nós, conexões, variáveis |
| `get_blueprint_variable_details` | Detalhes de variáveis (tipo, default, metadata) | ALTO: essencial para replicar padrões de variáveis |
| `get_blueprint_function_details` | Detalhes de funções (inputs, outputs, local vars) | ALTO: essencial para replicar assinaturas de funções |
| `get_actor_material_info` | Info de materiais de um actor | MÉDIO: útil para sistema de materiais |
| `get_blueprint_material_info` | Info de materiais de um BP | MÉDIO |
| `set_static_mesh_properties` | Configurar mesh estático | MÉDIO: documentado como `set_mesh` mas não implementado |
| `set_point_light_properties` | Configurar luz pontual | MÉDIO: documentado como `set_light` mas não implementado |
| `attach_actor_to_socket` | Anexar ator a socket | MÉDIO: documentado como `attach` mas não implementado |
| `add_event_node` | Adicionar nó de evento | ALTO: permitiria criar eventos customizados como `WeaponFire` |
| `set_blueprint_variable_properties` | Propriedades de variável (exposed, replicated, etc.) | ALTO |
| `create_function` | Criar função Blueprint | CRÍTICO: função `CanShoot?()` ou `ReloadStart()` |
| `add_function_input` / `add_function_output` | Adicionar parâmetros de função | ALTO |
| `delete_node` / `set_node_property` | Editar nós existentes | MÉDIO |
| `set_component_static_mesh` | Atribuir mesh a componente | ALTO |

### 5.2 Lacuna #2: Keyword Gate é Frágil

O `filterToolsByQuery` usa regex simples. Uma pergunta como *"construa um muro"* ativa `unreal_mcp` (contém `parede`?), mas *"faça uma construção"* não ativa nada.

**Palavras que NÃO ativam o gate mas deveriam:**
- `construção`, `edifício`, `prédio`, `estrutura` → não ativam `unreal_mcp`
- `anexar`, `socket`, `ligar` → não ativam `unreal_mcp`
- `variável`, `parâmetro`, `expor` → não ativam `unreal_mcp`
- `evento`, `overlap`, `hit` → não ativam `unreal_mcp`

### 5.3 Lacuna #3: Sem Loop de Feedback

O sistema **executa** comandos mas não **aprende** com os resultados:
- Não registra se uma criação de Blueprint falhou e por quê
- Não armazena BPs criados como exemplos para o futuro
- Não correlaciona erros com padrões para evitar repeti-los
- Se o LLM cria um `BP_MinhaArma` com sucesso, esse conhecimento se perde na próxima sessão

### 5.4 Lacuna #4: T3D Rico, Mas Não Aproveitado

Os arquivos chunked (`AC_WeaponSystem-1.md` a `AC_WeaponSystem-8.md`) contêm o grafo completo com posições de nós e conexões de pins. Este é o **nível mais granular de conhecimento** disponível, mas:

- O RAG indexa esses arquivos, mas o LLM recebe chunks fragmentados que não representam o grafo inteiro
- Não há um parser que converta T3D → JSON estruturado que o adapter possa executar
- O `parse_blueprints.py` gera sumários de alto nível (eventos, funções, variáveis), mas descarta a informação de conexão explícita entre nós

### 5.5 Lacuna #5: Ausência de Templates

O sistema sabe criar Blueprints genéricos (`create_bp` com parent_class), mas não tem **templates** para criar Blueprints **específicos do ProjetoGTA**:

```
// O que o AVA faz hoje:
unreal_mcp({ action: "create_bp", name: "BP_MinhaArma", parent_class: "Actor" })

// O que seria ideal:
unreal_mcp({ action: "create_from_template", template: "BP_WeaponBase", name: "BP_MinhaArma" })
```

O template injetaria automaticamente:
- Variáveis: `CurrentAmmoInMag`, `CurrentAmmoInBP`, `Fire Rate`, `Weapon Spread`, `Modo de Tiro`
- Componentes: `WeaponMesh`, `WeaponCollision`, `AmmoCollision`
- Estrutura de eventos: `WeaponFire`, `WeaponReload`, `WeaponEffects`, `WeaponFireMode`

---

## 6. Plano de Melhorias: 4 Fases

### Fase 1: Completar o Adapter (Semana 1)

**Objetivo:** Expor todos os comandos C++ existentes no adapter TypeScript.

```typescript
// Novas actions a adicionar em unreal_mcp_adapter.ts:

// === INSPEÇÃO (novo grupo) ===
"read_bp"       → sendMcpCommand("read_blueprint_content",      { blueprint_name })
"analyze_bp"    → sendMcpCommand("analyze_blueprint_graph",      { blueprint_name, graph_name? })
"get_vars"      → sendMcpCommand("get_blueprint_variable_details", { blueprint_name })
"get_funcs"     → sendMcpCommand("get_blueprint_function_details", { blueprint_name })
"get_materials" → sendMcpCommand("get_blueprint_material_info",    { blueprint_name })

// === NÓS AVANÇADOS ===
"add_event"     → sendMcpCommand("add_event_node",               { blueprint_name, event_type, ... })
"set_var_props" → sendMcpCommand("set_blueprint_variable_properties", { ... })
"create_func"   → sendMcpCommand("create_function",              { blueprint_name, function_name, ... })
"del_node"      → sendMcpCommand("delete_node",                  { blueprint_name, node_id })
"set_node_prop" → sendMcpCommand("set_node_property",            { blueprint_name, node_id, ... })

// === COMPONENTES AVANÇADOS ===
"set_mesh"      → sendMcpCommand("set_static_mesh_properties",   { ... })
"set_light"     → sendMcpCommand("set_point_light_properties",   { ... })
"attach"        → sendMcpCommand("attach_actor_to_socket",       { ... })
```

**Impacto:** O LLM ganha a capacidade de **inspecionar antes de modificar** — o ciclo completo de aprendizado:
1. `get_vars(blueprint="BP_WeaponBase")` → vê as variáveis existentes
2. `get_funcs(blueprint="BP_WeaponBase")` → vê as funções existentes  
3. `analyze_bp(blueprint="BP_WeaponBase")` → vê o grafo
4. Agora pode criar um novo BP replicando o padrão

---

### Fase 2: Templates Inteligentes (Semana 2)

**Objetivo:** Extrair automaticamente templates dos Blueprints exportados.

#### 2a. Extrator de Templates

Novo script: `extract_templates.py` (ou adaptação do `parse_blueprints.py`)

```python
# Para cada Blueprint exportado, gera um JSON de template:
{
  "name": "BP_WeaponBase",
  "parent_class": "Actor",
  "template_id": "weapon_base",
  "category": "Weapons",
  "variables": [
    {"name": "CurrentAmmoInMag", "type": "int", "default": 30},
    {"name": "CurrentAmmoInBP", "type": "int", "default": 90},
    {"name": "Fire Rate", "type": "real (double)", "default": 0.1},
    {"name": "Weapon Spread", "type": "real (double)", "default": 5.0},
    {"name": "Modo de Tiro", "type": "byte (E_FireMode)", "default": 0},
    {"name": "Tipo de Arma", "type": "byte (E_WeaponState)", "default": 0}
  ],
  "components": [
    {"name": "WeaponMesh", "type": "StaticMeshComponent"},
    {"name": "WeaponCollision", "type": "SphereComponent"},
    {"name": "AmmoCollision", "type": "SphereComponent"},
    {"name": "Magazine", "type": "StaticMeshComponent"}
  ],
  "events": [
    "ReceiveBeginPlay",
    "WeaponFire",
    "WeaponReload",
    "WeaponEffects",
    "WeaponFireMode"
  ],
  "functions": [
    "CanShoot?",
    "CanReload?",
    "SpawnProjectile",
    "SpawnMagazine",
    "ReloadStart",
    "ReloadEnd"
  ],
  "graph_sections": [
    "Interação com as armas",
    "Simular Física",
    "Evento atirar",
    "Evento Recarregar",
    "Evento trocar o modo de tiro"
  ],
  "key_patterns": {
    "replication": ["OnRep_CurrentAmmoInMag", "OnRep_CurrentAmmoInBP"],
    "interfaces": ["BPI_Get_EssentialValues"],
    "structs_used": ["S_WeaponData", "S_StoredWeapons"]
  }
}
```

#### 2b. Nova Action: `create_from_template`

```typescript
// Nova ação no adapter:
"create_from_template" → {
  // 1. Busca o template JSON do diretório templates/
  // 2. Chama create_bp com o parent_class do template
  // 3. Para cada variável: chama create_var
  // 4. Para cada componente: chama add_component
  // 5. Para cada evento: chama add_event_node
  // TUDO em sequência automática
}
```

#### 2c. Registro de Templates

```
unreal_engine_docs/
└── Templates/
    ├── weapons/
    │   ├── BP_WeaponBase.template.json
    │   ├── BP_ProjectileBase.template.json
    │   └── BP_PhysicalMag.template.json
    ├── character/
    │   ├── BP_Character.template.json
    │   └── AC_PlayerStatus.template.json
    ├── interaction/
    │   ├── BP_Door.template.json
    │   └── BP_InteractionObject.template.json
    ├── vehicles/
    │   └── BP_Vehicles.template.json
    └── hud/
        └── UMG_HUD.template.json
```

---

### Fase 3: Aprendizado por Feedback (Semana 3)

**Objetivo:** Fechar o loop: o AVA aprende com suas próprias criações.

#### 3a. Log de Operações

```typescript
// Novo módulo: server/tools/unreal_mcp_learning.ts
interface OperationLog {
  timestamp: string;
  action: string;
  params: Record<string, unknown>;
  result: "success" | "error";
  resultDetail: string;     // mensagem de retorno
  blueprintCreated?: string; // nome do BP criado (se aplicável)
  durationMs: number;
}

// Após cada execução bem-sucedida, registrar:
function logOperation(entry: OperationLog) {
  // Append to .agent/memory/unreal_mcp_operations.jsonl
}
```

#### 3b. Base de Conhecimento Dinâmica

```typescript
// Ao iniciar, carregar operações anteriores para contexto:
function loadMcpKnowledge(): string {
  const ops = readJsonl(".agent/memory/unreal_mcp_operations.jsonl");
  
  // Agrupa por tipo de operação
  const successfulBPs = ops
    .filter(o => o.result === "success" && o.blueprintCreated)
    .map(o => o.blueprintCreated);
  
  // Retorna resumo para o system prompt
  return `
Blueprints ja criados pelo AVA nesta sessao/projeto:
${successfulBPs.map(bp => `- ${bp}`).join('\n')}

Padroes de erro comuns encontrados:
${analyzeErrors(ops)}
  `;
}
```

#### 3c. Correção Automática

```typescript
// Se um create_bp falhar com "already exists":
// → Tentar create_bp com nome alternativo (sufixo _v2, _v3)
// Se spawn_actor falhar com "blueprint not compiled":
// → Chamar compile_bp automaticamente antes de tentar novamente
```

---

### Fase 4: Aprendizado Baseado em T3D (Semana 4+)

**Objetivo:** Usar os grafos T3D para replicar Blueprints completos com conexões exatas.

#### 4a. T3D → JSON Structured Graph

```python
# Novo: t3d_to_graph.py
# Para cada chunked file (AC_WeaponSystem-1.md ... AC_WeaponSystem-8.md):
# 1. Parseia os blocos Begin Object...End Object
# 2. Reconstrói o grafo como DAG:
#    nodes: [{id, type, function/macro, position, pins}]
#    edges: [{from_node, from_pin, to_node, to_pin, is_exec}]
# 3. Gera JSON estruturado

# Output: AC_WeaponSystem.graph.json
{
  "blueprint": "AC_WeaponSystem",
  "graphs": {
    "EventGraph": {
      "nodes": [
        {
          "id": "K2Node_CustomEvent_5",
          "type": "CustomEvent",
          "name": "SpawnWeapons",
          "pos": [0, 0],
          "pins": {
            "output_exec": { "type": "exec", "name": "then" },
            "output_Owner": { "type": "object", "name": "Owner", "class": "Actor" }
          }
        },
        {
          "id": "K2Node_CallFunction_14",
          "type": "CallFunction",
          "function": "GetChar_WeaponSystem",
          "pos": [300, 0],
          "pins": {
            "input_exec": { "type": "exec", "name": "execute" },
            "input_self": { "type": "object", "name": "self" },
            "output_exec": { "type": "exec", "name": "then" },
            "output_return": { "type": "object", "name": "ReturnValue" }
          }
        }
      ],
      "edges": [
        {
          "from": {"node": "K2Node_CustomEvent_5", "pin": "output_exec"},
          "to": {"node": "K2Node_CallFunction_14", "pin": "input_exec"},
          "type": "execution"
        }
      ],
      "comment_boxes": [
        {
          "text": "Spawnar armas do jogador",
          "bounds": [-200, -100, 800, 400]
        }
      ]
    }
  }
}
```

#### 4b. Replay de Grafos

```typescript
// Nova ação: "replay_graph"
// Dado um graph.json, o adapter:
// 1. Para cada node no grafo:
//    - add_node / add_event_node / create_function / create_var
// 2. Para cada edge:
//    - connect_nodes(source, source_pin, target, target_pin)
// 3. Posiciona comment boxes
// 4. Compila

unreal_mcp({
  action: "replay_graph",
  blueprint: "BP_MinhaNovaArma",
  graph_file: "Templates/weapons/BP_WeaponBase.graph.json"
})
```

#### 4c. Geração de Grafos por LLM

Com o formato JSON estruturado, o LLM pode:
1. Receber um `.graph.json` como exemplo
2. Modificar nós e conexões conforme a necessidade do usuário
3. Gerar um novo `.graph.json` customizado
4. Executar via `replay_graph`

```
Usuário: "Crie um sistema de vida igual ao do player, mas com escudo de energia regenerativo"

LLM:
  1. RAG recupera AC_PlayerStatus.graph.json (sistema de vida existente)
  2. LLM analisa o grafo: vê que tem ReceiveAnyDamage → Branch IsDead? → Death/Reanimate
  3. LLM gera novo grafo: adiciona variável EnergyShield, modifica Damage para EnergyShield primeiro
  4. Executa replay_graph com o novo grafo
  5. Resultado: BP criado com sistema de vida + escudo
```

---

---

## 7. Fases 1-4: Fundação (Já Propostas)

| Fase | Melhoria | O AVA passa a... |
|------|----------|-----------------|
| **1** | Completar adapter | Inspecionar BPs existentes, criar funções, adicionar eventos |
| **2** | Templates | Criar BPs específicos do ProjetoGTA com 1 comando (todas vars, componentes, estrutura) |
| **3** | Feedback loop | Lembrar o que já criou, evitar repetir erros, auto-corrigir |
| **4** | Replay T3D | Replicar grafos completos com conexões exatas (nível de clonagem) |

---

## 8. Fase 5: Aprendizado Semântico de Padrões entre Blueprints

### Problema
O RAG recupera documentos individuais (`BP_WeaponBase.md`), mas **padrões que aparecem em múltiplos Blueprints** não são explicitamente modelados. Por exemplo, o padrão *"Sistema de vida"* aparece em `AC_PlayerStatus`, `BP_Character` e `BP_WeaponBase` (health pickup logic), mas o LLM não sabe que existe uma relação arquitetural entre eles.

### Solução

#### 5a. Detector de Padrões Cross-Blueprint

```python
# Novo: detect_patterns.py
# Analisa TODOS os 159 Blueprints exportados e detecta padrões recorrentes:

{
  "patterns": [
    {
      "pattern_id": "health_system",
      "name": "Sistema de Vida",
      "found_in": ["AC_PlayerStatus", "BP_Character", "BP_WeaponBase"],
      "shared_variables": ["Health", "MaxHealth", "bIsDead"],
      "shared_events": ["ReceiveAnyDamage", "Death", "Reanimate"],
      "shared_functions": ["IsDead()", "SetHealth()"],
      "comment_boxes": ["Sistema de vida", "Sistema de Colete"],
      "architectural_note": "AC_PlayerStatus é o source-of-truth, BP_Character delega via GetOwner"
    },
    {
      "pattern_id": "weapon_fire_system",
      "name": "Sistema de Disparo",
      "found_in": ["BP_WeaponBase", "AC_WeaponSystem", "BP_Character"],
      "shared_variables": ["Fire Rate", "Weapon Spread", "CurrentAmmoInMag"],
      "shared_events": ["WeaponFire", "WeaponFireMode"],
      "shared_functions": ["CanShoot?()", "SpawnProjectile()"],
      "architectural_note": "BP_WeaponBase é o leaf, AC_WeaponSystem é o orquestrador, BP_Character expõe input"
    },
    {
      "pattern_id": "interaction_system",
      "name": "Sistema de Interação",
      "found_in": ["BP_Door", "AC_Interaction", "BP_PickupItem", "BP_Character"],
      "shared_events": ["ComponentBeginOverlap", "Interact"],
      "shared_functions": ["SelectInteractionObject()", "SelectPickupObject()"],
      "interfaces": ["BPI_Get_EssentialValues"],
      "architectural_note": "Overlap → Cast → Interface call → Delegates action"
    },
    {
      "pattern_id": "hud_communication",
      "name": "Comunicação com HUD",
      "found_in": ["UMG_HUD", "WBCrosshair", "BP_Character", "BP_WeaponBase"],
      "shared_functions": ["GetHUD()", "UpdateHUD_WeaponData()", "SetVisibility()"],
      "architectural_note": "HUD obtido via GetPlayerController → GetHUD → Cast to custom class"
    },
    {
      "pattern_id": "replication_pattern",
      "name": "Padrão de Replicação",
      "found_in": ["BP_WeaponBase", "BP_Character", "AC_PlayerStatus"],
      "shared_pattern": "OnRep_<Var> → FlushNetDormancy → MarkPropertyDirtyFromRepIndex",
      "architectural_note": "Usado para forçar update visual em todos os clients"
    }
  ]
}
```

#### 5b. Grafo de Dependências entre Blueprints

```
AC_PlayerStatus ──(GetOwner)──► BP_Character
                                    │
                          ┌─────────┼──────────┐
                          │         │          │
                    BP_WeaponBase  BP_Door  UMG_HUD
                          │                    │
                    AC_WeaponSystem ◄──────────┘
                          │        (GetHUD → UpdateHUD)
                    BP_Character
                    (GetChar_WeaponSystem)
```

#### 5c. RAG Boost por Afinidade Semântica

```typescript
// Em retriever-patch.ts: quando o usuário pergunta sobre "sistema de vida":
// 1. Recupera AC_PlayerStatus.md (match direto)
// 2. Consulta patterns.json → "health_system" → related BPs = [BP_Character, BP_WeaponBase]
// 3. Aplica boost +0.25 a todos os docs relacionados
// 4. Injeta contexto arquitetural: "AC_PlayerStatus é source-of-truth, BP_Character delega"
```

---

## 9. Fase 6: Tradução de Documentação Pedagógica → Tool Calls Executáveis

### Problema
`Manual_Pratico_Implementacao.md` e os tutoriais do `Antigravity_Tutorial/` descrevem **passo a passo** como criar sistemas — mas em linguagem natural. O LLM precisa interpretar essa linguagem natural e convertê-la manualmente em tool calls.

### Solução

#### 6a. Parser de Tutoriais para Sequências de Ações

```python
# Novo: tutorial_to_actions.py
# Dado um tutorial como Manual_Pratico_Implementacao.md:
#
# "Passo 3: Criar sistema de recarga
#  ├── Adicionar variável CurrentAmmoInMag (int, default 30)
#  ├── Adicionar variável CurrentAmmoInBP (int, default 90)
#  ├── Criar função CanReload?() → retorna bool
#  └── Criar Custom Event WeaponReload"
#
# Gera:

{
  "blueprint": "BP_WeaponBase",
  "from_tutorial": "Manual_Pratico_Implementacao.md § Passo 3",
  "actions": [
    {"action": "create_var", "name": "CurrentAmmoInMag", "type": "Integer", "default": 30},
    {"action": "create_var", "name": "CurrentAmmoInBP", "type": "Integer", "default": 90},
    {"action": "create_var", "name": "MaxAmmoInMag", "type": "Integer", "default": 30},
    {"action": "create_function", "name": "CanReload", "inputs": [], "outputs": ["bool"]},
    {"action": "add_event", "name": "WeaponReload", "type": "CustomEvent"},
    {"action": "add_node", "node_type": "Branch", "pos_x": 300, "pos_y": 0},
    {"action": "connect_nodes", "source": "WeaponReload.then", "target": "Branch.execute"},
    {"action": "connect_nodes", "source": "Branch.true", "target": "Call_CanReload.execute"},
    {"action": "connect_nodes", "source": "Branch.false", "target": "Return.execute"},
    ...
  ]
}
```

#### 6b. Ação `execute_tutorial`

```typescript
// Nova ação:
unreal_mcp({
  action: "execute_tutorial",
  blueprint: "BP_MinhaNovaArma",
  tutorial: "weapon_reload", // referencia o tutorial_to_actions.json
  // Executa TODOS os passos automaticamente na ordem correta
})
```

#### 6c. Conversão Automática de Todo Conteúdo Pedagógico

| Documento Original | Gera JSON de Ações | Blueprint Alvo |
|---|---|---|
| `Manual_Pratico_Implementacao.md` | `tutorial_weapon_complete.actions.json` | BP_WeaponBase |
| `AK47_Estudo_Armas/03_Logica_Recarga/` | `tutorial_reload_system.actions.json` | BP_WeaponBase |
| `Antigravity_Tutorial/AmmoBox/Ammo_Box_Tutorial.md` | `tutorial_ammo_pickup.actions.json` | BP_AmmoBox |
| `Antigravity_Tutorial/Menu_Radial/Decentralization_Guide.md` | `tutorial_radial_menu.actions.json` | UMG_RadialMenu |
| `Antigravity_Tutorial/Inventario/Structure_Guide.md` | `tutorial_inventory.actions.json` | AC_Interaction |
| `Antigravity_Tutorial/Espada/implementandoEspada.md` | `tutorial_melee.actions.json` | BP_MeleeWeapon |

---

## 10. Fase 7: Assistência Preditiva

### Problema
O usuário diz *"crie uma arma"* — o AVA cria o Blueprint. Mas o usuário também precisa de: sistema de munição, HUD para mostrar munição, efeitos de disparo, som, animação, pickup...

### Solução

#### 10a. Árvore de Dependências de Sistema

```json
{
  "dependencies": {
    "weapon_blueprint": {
      "requires": [],
      "suggests": [
        "ammo_system", "weapon_pickup", "hud_ammo_display",
        "fire_effects", "fire_sound", "reload_animation",
        "weapon_inventory_slot", "projectile_bp"
      ],
      "related_docs": [
        "Docs_ProjetoGTA_Estudo/02_Blueprints/BP_WeaponBase.md",
        "AK47_Estudo_Armas/01_Estrutura_DataDriven/",
        "Antigravity_Tutorial/Weapons/Weapon_System_Architecture.md"
      ]
    },
    "door_blueprint": {
      "requires": ["interaction_system"],
      "suggests": ["door_sound", "door_animation", "door_hud_prompt"],
      "related_docs": [
        "Docs_ProjetoGTA_Estudo/02_Blueprints/BP_Door.md"
      ]
    }
  }
}
```

#### 10b. Sugestão Proativa no System Prompt

```
Ao criar um BP_WeaponBase:
→ [PROATIVO] Sugerir também criar:
  ├── Variável "Tipo de Arma" (byte: E_WeaponState)
  ├── Variável "Modo de Tiro" (byte: E_FireMode)
  ├── Componente WeaponMesh (StaticMeshComponent)
  ├── Componente WeaponCollision (SphereComponent)
  ├── Evento WeaponFire
  ├── Evento WeaponReload
  └── Função CanShoot?()
  
  Com base no padrão documentado em:
  - Docs_ProjetoGTA_Estudo/02_Blueprints/BP_WeaponBase.md
  - AK47_Estudo_Armas/01_Estrutura_DataDriven/
```

---

## 11. Fase 8: Orquestração Multi-Blueprint

### Problema
Sistemas reais envolvem **múltiplos Blueprints interdependentes**:
- Criar arma → BP_WeaponBase, BP_ProjectileBase, UMG_HUD, AC_WeaponSystem (modificar)
- Criar inimigo → BP_EnemyChar, AC_EnemyStatus, BP_EnemyWeapon, UMG_EnemyHealthBar

Hoje o AVA trata cada criação isoladamente.

### Solução

#### 11a. Planos de Orquestração (Orchestration Plans)

```json
{
  "orchestrations": {
    "complete_weapon_system": {
      "description": "Sistema completo de arma (disparo + recarga + pickup + HUD)",
      "blueprints": [
        {
          "name": "BP_{WeaponName}",
          "template": "weapon_base",
          "create_if_not_exists": true
        },
        {
          "name": "BP_{WeaponName}_Projectile",
          "template": "projectile_base",
          "create_if_not_exists": true,
          "depends_on": ["BP_{WeaponName}"]
        },
        {
          "name": "BP_{WeaponName}_Pickup",
          "template": "weapon_pickup",
          "create_if_not_exists": true
        },
        {
          "name": "AC_WeaponSystem",
          "template": null,
          "create_if_not_exists": false,
          "modify": "add_weapon_registration"
        }
      ],
      "hud_elements": [
        {"widget": "UMG_HUD", "modify": "add_ammo_display"},
        {"widget": "WBCrosshair", "modify": "add_spread_indicator"}
      ],
      "data_tables": [
        {"table": "DT_WeaponList", "modify": "add_row"}
      ],
      "enums_to_update": ["E_WeaponState", "E_FireMode"]
    },
    "complete_interaction_system": {
      "description": "Sistema de interação (portas + pickups + prompts)",
      "blueprints": [
        {"name": "BP_InteractionObject", "template": "interaction_base"},
        {"name": "AC_Interaction", "template": null, "modify": "add_interaction_handler"}
      ],
      "interfaces": ["BPI_InteractionInterface"]
    }
  }
}
```

#### 11b. Ação `orchestrate_system`

```typescript
unreal_mcp({
  action: "orchestrate_system",
  system: "complete_weapon_system",
  params: {
    weapon_name: "AK47",
    fire_mode: "auto",
    damage: 35,
    magazine_size: 30
  }
})
// Executa TODOS os passos multi-BP automaticamente
```

---

## 12. Fase 9: Aprendizado Versionado e Evolutivo

### Problema
O `Changelog_Base_Estudos.md` documenta mudanças como *"v1.2.0: Corrigido bug onde a recarga permitia valor negativo de munição"* e *"v2.0.0: Refatoração do AC_WeaponSystem para arquitetura data-driven"*. Esse conhecimento de *por que* algo mudou é valioso mas não é usado.

### Solução

#### 12a. Marcação Temporal de Padrões

```json
{
  "blueprint": "BP_WeaponBase",
  "version_history": [
    {
      "version": "v1.0.0",
      "date": "2026-01-15",
      "variables": ["CurrentAmmoInMag", "CurrentAmmoInBP"],
      "events": ["WeaponFire"],
      "notes": "Sistema inicial, sem modo de tiro"
    },
    {
      "version": "v1.1.0",
      "date": "2026-02-01",
      "added": ["Modo de Tiro", "WeaponFireMode"],
      "notes": "Adicionado suporte a single shot / burst / auto"
    },
    {
      "version": "v2.0.0",
      "date": "2026-03-10",
      "removed": ["Tipo de Arma (migrado para DataTable)"],
      "notes": "Refatoração data-driven: propriedades movidas para DT_WeaponList"
    }
  ],
  "known_anti_patterns": [
    "Não usar CurrentAmmoInMag sem antes chamar CanShoot?()",
    "Evento ReloadStart() deve sempre preceder ReloadEnd()",
    "Nunca modificar CurrentAmmoInBP diretamente — usar AddAmmoToBP()"
  ]
}
```

#### 12b. Anti-Padrões para o System Prompt

```
⚠️ ANTI-PADRÕES CONHECIDOS (do changelog):
- Não permitir CurrentAmmoInMag negativo — sempre clampar em 0
- Não criar lógica de recarga dentro de WeaponFire — usar evento WeaponReload separado
- Não usar Cast direto — preferir interfaces (BPI_WeaponInterface)
- Ao modificar AC_WeaponSystem, nunca hardcodar nomes de armas (usar DataTable)
```

#### 12c. Sistema de "Por que não fazer assim"

```typescript
// Quando o LLM propõe uma arquitetura similar a um anti-padrão conhecido:
if (llmProposal.matches(knownAntiPattern)) {
  systemPrompt += `
  ⚠️ ALERTA ARQUITETURAL: A abordagem "${llmProposal.description}" é similar ao anti-padrão
  "${knownAntiPattern.name}" que foi corrigido em ${knownAntiPattern.fixedIn}.
  Razão da correção: ${knownAntiPattern.rationale}
  Alternativa recomendada: ${knownAntiPattern.alternative}
  `;
}
```

---

## 13. Fase 10: Aprendizado Visual por Screenshot

### Problema
Toda verificação de criação de Blueprint depende de texto (mensagens de sucesso/erro). Não há como o AVA *ver* o que criou.

### Solução

#### 13a. Verificação Visual Automática

```typescript
// Fluxo de verificação visual:
async function verifyBlueprintVisually(blueprintName: string): Promise<string> {
  // 1. Focar no Blueprint no editor
  await unrealOps({ action: "python", 
    script: `unreal.EditorAssetLibrary.open_editor_for_asset(
      unreal.EditorAssetLibrary.load_asset('/Game/Blueprints/${blueprintName}')
    )` 
  });
  
  // 2. Capturar screenshot do viewport de Blueprint
  const screenshot = await unrealOps({ action: "screenshot",
    path: `.agent/temp/verification_${blueprintName}.png`
  });
  
  // 3. Descrever a imagem para o LLM (usando visão multimodal, se disponível)
  // Ou comparar com screenshot de referência do template
  
  return screenshot;
}
```

#### 13b. Screenshot de Referência por Template

Cada template teria um screenshot do grafo esperado:

```
Templates/
└── weapons/
    ├── BP_WeaponBase.template.json     ← dados estruturados
    ├── BP_WeaponBase.reference.png     ← screenshot de referência
    └── BP_WeaponBase.expected_vars.txt ← variáveis esperadas pós-criação
```

---

## 14. Fase 11: Testes Automatizados de Blueprints Criados

### Problema
O AVA cria um Blueprint com `create_bp` + `add_component` + `create_var` + `add_node` + `connect_nodes` — mas não verifica se o resultado final está correto. Um `connect_nodes` pode ter conectado o pin errado silenciosamente.

### Solução

#### 14a. Suite de Validação

```typescript
// Após criar/modificar um Blueprint:
async function validateBlueprint(blueprintName: string, template: string): Promise<ValidationReport> {
  // 1. Verificar variáveis:
  const vars = await unrealMcp({ action: "get_vars", blueprint: blueprintName });
  const expectedVars = template.expected_variables;
  const missingVars = expectedVars.filter(v => !vars.includes(v));
  const extraVars = vars.filter(v => !expectedVars.includes(v));
  
  // 2. Verificar componentes:
  const bpInfo = await unrealMcp({ action: "analyze_bp", blueprint: blueprintName });
  const missingComponents = template.expected_components.filter(
    c => !bpInfo.components.includes(c)
  );
  
  // 3. Verificar funções:
  const funcs = await unrealMcp({ action: "get_funcs", blueprint: blueprintName });
  const missingFuncs = template.expected_functions.filter(
    f => !funcs.names.includes(f)
  );
  
  // 4. Verificar compilação:
  const compile = await unrealMcp({ action: "compile_bp", blueprint: blueprintName });
  const compiles = compile.status === "success";
  
  return {
    passes_validation: missingVars.length === 0 && missingComponents.length === 0 && compiles,
    issues: { missingVars, missingComponents, missingFuncs, compilation_errors: compile.errors },
    suggestion: generateFixSuggestions(missingVars, missingComponents)
  };
}
```

#### 14b. Auto-Reparo

```typescript
// Se a validação falhar:
if (!validationReport.passes_validation) {
  for (const var of validationReport.issues.missingVars) {
    await unrealMcp({ action: "create_var", blueprint: bp, name: var.name, type: var.type });
  }
  for (const comp of validationReport.issues.missingComponents) {
    await unrealMcp({ action: "add_component", blueprint: bp, type: comp.type, name: comp.name });
  }
  await unrealMcp({ action: "compile_bp", blueprint: bp });
  
  // Re-validar
  const revalidated = await validateBlueprint(bp, template);
  if (!revalidated.passes_validation) {
    // Escalar para auto-correção mais agressiva ou pedir ajuda ao usuário
  }
}
```

---

## 15. Fase 12: Aprendizado por Diferença (Diff-Based Learning)

### Problema
Quando o usuário modifica um Blueprint manualmente no editor, essas mudanças são "perdidas" para o AVA. Da próxima vez que exportar os Blueprints, o AVA vê o novo estado mas não sabe *o que mudou* nem *por quê*.

### Solução

#### 15a. Diff de Blueprints entre Exportações

```python
# Novo: diff_blueprints.py
# Compara exportação atual vs anterior e gera diff estruturado:

{
  "blueprint": "BP_WeaponBase",
  "previous_export": "2026-07-01",
  "current_export": "2026-07-08",
  "changes": [
    {
      "type": "variable_added",
      "detail": {"name": "DamageMultiplier", "type": "real (double)", "default": 1.0},
      "detected_by": "diff with previous export"
    },
    {
      "type": "function_modified",
      "detail": {
        "function": "CanShoot?",
        "change": "Added input pin: bCheckMagazine (bool)"
      }
    },
    {
      "type": "node_added",
      "detail": {
        "graph": "EventGraph",
        "node": "K2Node_IfThenElse (Damage > MaxHealth check)"
      }
    },
    {
      "type": "component_added",
      "detail": {"name": "LaserSight", "type": "StaticMeshComponent"}
    }
  ],
  "suggested_commit_message": "Adicionado DamageMultiplier para sistema de dificuldade, laser sight visual, e check de magazine na função CanShoot?"
}
```

#### 15b. Aprendizado de Padrões de Modificação

```json
{
  "common_modifications": [
    {
      "pattern": "Adicionar variável de dano",
      "frequency": 12,
      "blueprints_affected": ["BP_WeaponBase", "BP_ProjectileBase", "BP_MeleeWeapon"],
      "typical_change": "Adicionar real (double) Damage + Get/Set + Clamp no EventGraph"
    },
    {
      "pattern": "Adicionar suporte a multiplayer",
      "frequency": 8,
      "blueprints_affected": ["BP_WeaponBase", "BP_Door", "BP_Character"],
      "typical_change": "Adicionar OnRep_<Var> + FlushNetDormancy + MarkPropertyDirty"
    }
  ]
}
```

---

## 16. Fase 13: Catálogo de Componentes e Assets

### Problema
O AVA sabe adicionar componentes (`add_component`), mas não sabe **quais componentes existem no projeto**, **quais meshes estão disponíveis**, ou **quais assets podem ser usados**.

### Solução

#### 16a. Catálogo de Assets por Categoria

```json
{
  "static_meshes": {
    "weapons": [
      "/Game/FPS_Weapon_Bundle/Weapons/Meshes/SM_AK47",
      "/Game/FPS_Weapon_Bundle/Weapons/Meshes/SM_MP5",
      "/Game/FPS_Weapon_Bundle/Weapons/Meshes/SM_Beretta"
    ],
    "environment": [
      "/Game/ModernCityEnvironment01/Meshes/SM_Building01",
      "/Game/StarterContent/Props/SM_Chair",
      "/Game/StarterContent/Props/SM_TableRound"
    ],
    "characters": [
      "/Game/AdvancedLocomotionV4/CharacterAssets/MannequinSkeleton/SK_Mannequin"
    ]
  },
  "materials": {
    "weapons": ["/Game/Materials/M_Weapon_Standard", "/Game/Materials/M_Weapon_Gold"],
    "environment": ["/Game/Materials/M_Building_Concrete", "/Game/Materials/M_Metal_Rusty"]
  },
  "particle_effects": {
    "muzzle_flash": ["/Game/VFX/P_MuzzleFlash_Rifle", "/Game/VFX/P_MuzzleFlash_Pistol"],
    "impact": ["/Game/VFX/P_Impact_Concrete", "/Game/VFX/P_Impact_Metal"]
  },
  "sounds": {
    "weapon_fire": ["/Game/Audio/S_Rifle_Fire", "/Game/Audio/S_Pistol_Fire"],
    "weapon_reload": ["/Game/Audio/S_Rifle_Reload"]
  },
  "animations": {
    "character": ["/Game/Animations/A_Fire_Rifle", "/Game/Animations/A_Reload_Rifle"]
  }
}
```

#### 16b. Geração Automática via `unreal_ops`

```python
# Python via unreal_ops: lista todos os assets por tipo
assets = unreal.EditorAssetLibrary.list_assets("/Game/", recursive=True)
for asset in assets:
    asset_data = unreal.EditorAssetLibrary.find_asset_data(asset)
    # Categoriza por classe (StaticMesh, Material, SoundWave, AnimSequence, etc.)
    # Gera asset_catalog.json
```

#### 16c. Sugestão Inteligente de Assets

```typescript
// Quando o LLM decide criar component:
// Ao invés de "adicionar StaticMeshComponent",
// o system prompt sugere:
"Componentes StaticMesh disponíveis no projeto que você pode atribuir:
 - SM_AK47 (FPS_Weapon_Bundle/Weapons)
 - SM_M4A1 (FPS_Weapon_Bundle/Weapons)
 - SM_MP5 (FPS_Weapon_Bundle/Weapons)
 Use unreal_mcp com set_mesh para atribuir após criar o componente."
```

---

## 17. Fase 14: Memória de Longo Prazo com Embeddings Vetoriais

### Problema
O feedback loop (Fase 3) registra operações em `.jsonl`, mas a recuperação é baseada em tempo (últimas N operações). Com o tempo, padrões de sucesso/erro se diluem.

### Solução

#### 17a. Operações Indexadas Semanticamente

```typescript
// Cada operação logada é embedding-indexada:
interface VectorizedOperation extends OperationLog {
  embedding: number[];  // nomic-embed-text da descrição da operação
}

// Ao planejar uma nova operação:
// 1. Embeddings do plano atual (variáveis, nós, conexões planejados)
// 2. Busca por similaridade em operações passadas
// 3. Recupera as 5 mais similares (sucessos e falhas)
// 4. Injeta no system prompt:

"Operações similares no passado:
 ✅ Sucesso (2026-07-05): Criar BP_LaserRifle → mesma estrutura de variáveis, compilou OK
 ✅ Sucesso (2026-07-04): Criar BP_Shotgun → usou parent_class BP_WeaponBase, compilou OK
 ❌ Falha (2026-07-02): Criar BP_RocketLauncher → erro por missing S_WeaponData struct
    → Solução: criar struct primeiro ou usar parent_class com struct já definido
"
```

#### 17b. Curva de Esquecimento com Peso Temporal

```typescript
// Operações mais recentes têm peso maior na similaridade:
function weightedSimilarity(currentPlan: number[], pastOp: VectorizedOperation): number {
  const semanticSimilarity = cosineSimilarity(currentPlan, pastOp.embedding);
  const daysSinceOperation = (Date.now() - pastOp.timestamp) / 86400000;
  const temporalWeight = Math.exp(-0.1 * daysSinceOperation); // decaimento exponencial
  return semanticSimilarity * temporalWeight;
}
```

---

## 18. Fase 15: Documentação Automática de Blueprints Criados

### Problema
Quando o AVA cria um Blueprint novo, ele **não gera a documentação correspondente**. Da próxima vez que o pipeline de exportação rodar, o novo BP será exportado, mas não terá a análise pedagógica que os BPs existentes têm.

### Solução

#### 15a. Geração de .md no Formato Padrão

```typescript
async function generateBlueprintDoc(blueprintName: string): Promise<string> {
  // 1. Obter dados do BP recém-criado
  const vars = await unrealMcp({ action: "get_vars", blueprint: blueprintName });
  const funcs = await unrealMcp({ action: "get_funcs", blueprint: blueprintName });
  const analysis = await unrealMcp({ action: "analyze_bp", blueprint: blueprintName });
  
  // 2. Detectar template usado (se aplicável)
  const template = detectTemplate(vars, funcs);
  
  // 3. Gerar .md seguindo EXATAMENTE o formato de parse_blueprints.py
  const md = `# 🎮 Blueprint: ${blueprintName}
**[Classe Pai / Parent Class: \`${analysis.parent_class}\`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
${vars.map(v => `| ${v.name} | ${v.type} |`).join('\n')}

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
${analysis.graphs.map(g => generateGraphSection(g)).join('\n\n')}

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint \`${blueprintName}\`?
- Quais variáveis estão disponíveis no Blueprint \`${blueprintName}\`?
- Quais funções e eventos são chamados no grafo do \`${blueprintName}\`?
`;
  
  // 4. Salvar no diretório correto
  const category = template?.category || "Custom";
  await fileOps({ action: "write", 
    path: `unreal_engine_docs/Blueprints_Exportados/${category}/${blueprintName}.md`,
    content: md
  });
  
  return md;
}
```

#### 15b. Auto-Indexação no RAG

```typescript
// Após gerar o .md, reindexar automaticamente:
await bash("pnpm rag:index --file " + newDocPath);
// Ou idealmente: incremental index (só o arquivo novo)
```

---

## 19. Fase 16: Integração com o Ciclo de Desenvolvimento

### Problema
O AVA opera isoladamente — cria Blueprints, mas não os integra com o resto do ciclo de desenvolvimento (controle de versão, build, testes de gameplay).

### Solução

#### 16a. Operações Integradas com Git

```typescript
// Após criar um Blueprint:
// 1. Salvar o Blueprint (.uasset) — isso é automático com save depois do compile
// 2. Gerar documentação (.md) — fase 15
// 3. Commitar no git com mensagem gerada:
await bash(`git add "Content/Blueprints/${blueprintName}.uasset"`);
await bash(`git add "unreal_engine_docs/Blueprints_Exportados/${blueprintName}.md"`);
await bash(`git commit -m "feat(blueprint): add ${blueprintName} (template: ${template})
  
Variaveis: ${vars.map(v => v.name).join(', ')}
Componentes: ${components.map(c => c.name).join(', ')}
Eventos: ${events.map(e => e.name).join(', ')}"`);
```

#### 16b. Integração com Build Verification

```typescript
// Após criar/modificar Blueprints, verificar build:
async function verifyBuild(): Promise<void> {
  // 1. Compilar todos os Blueprints
  await unrealOps({ action: "compile" });
  
  // 2. Verificar se há erros de compilação
  const errors = await unrealOps({ action: "python",
    script: `
      import unreal
      log = unreal.EditorAssetLibrary.get_last_compile_errors()
      print(log)
    `
  });
  
  // 3. Se há erros, reportar e sugerir correções
  if (errors) {
    // Consultar RAG por erros similares e suas soluções
    const similarErrors = await ragSearch(errors, "Docs_ProjetoGTA_Estudo/Changelog_Base_Estudos.md");
    // Reportar
  }
}
```

---

## 20. Visão de Longo Prazo: AVA como Par de Programação UE5

### O que as 16 fases entregam juntas:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AVA COMO PAR DE PROGRAMAÇÃO                  │
│                                                                 │
│  USUÁRIO: "Quero um sistema de tiro com recarga e HUD"         │
│                                                                 │
│  AVA:                                                           │
│  ① RAG: Recupera BP_WeaponBase + AC_WeaponSystem + UMG_HUD     │
│  ② FASE 5: Detecta padrão cross-BP "weapon_fire_system"        │
│  ③ FASE 10: Carrega dependências (precisa de projectile + HUD) │
│  ④ FASE 11: Seleciona orquestração "complete_weapon_system"    │
│  ⑤ FASE 2: Aplica template BP_WeaponBase                       │
│  ⑥ FASE 8: Auto-valida variáveis e componentes                 │
│  ⑦ FASE 1: Inspeciona resultado, corrige se necessário         │
│  ⑧ FASE 3: Registra no log de operações                        │
│  ⑨ FASE 6: Gera documentação .md do BP criado                  │
│  ⑩ FASE 7: Sugere próximos passos ("Agora crie o HUD?")       │
│  ⑪ FASE 12: Verifica se compila, oferece corrigir              │
│  ⑫ FASE 14: Commita no git com mensagem descritiva             │
│                                                                 │
│  RESULTADO: ~30s, sistema completo criado e documentado         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 21. Roadmap Consolidado (16 Fases)

| # | Fase | Prioridade | Depende de | Esforço Estimado |
|---|------|-----------|------------|-----------------|
| 1 | Completar Adapter | 🔴 CRÍTICA | — | 3-5 dias |
| 2 | Templates Inteligentes | 🔴 CRÍTICA | 1 | 5-7 dias |
| 3 | Feedback Loop | 🟡 ALTA | 1 | 3-4 dias |
| 4 | Replay T3D | 🟡 ALTA | 2 | 7-10 dias |
| 5 | Padrões Cross-Blueprint | 🟡 ALTA | 2 | 5-7 dias |
| 6 | Tutorial → Tool Calls | 🟡 ALTA | 2 | 5-7 dias |
| 7 | Assistência Preditiva | 🟢 MÉDIA | 5 | 3-4 dias |
| 8 | Orquestração Multi-BP | 🟢 MÉDIA | 2, 5 | 7-10 dias |
| 9 | Aprendizado Versionado | 🟢 MÉDIA | 3 | 3-4 dias |
| 10 | Verificação Visual | 🟢 MÉDIA | 1 | 3-4 dias |
| 11 | Testes Automatizados | 🟢 MÉDIA | 2 | 5-7 dias |
| 12 | Diff-Based Learning | 🔵 BAIXA | 3 | 4-5 dias |
| 13 | Catálogo de Assets | 🔵 BAIXA | 1 | 2-3 dias |
| 14 | Memória de Longo Prazo | 🔵 BAIXA | 3, 5 | 5-7 dias |
| 15 | Documentação Automática | 🔵 BAIXA | 2 | 3-4 dias |
| 16 | Integração Dev Cycle | 🔵 BAIXA | 3 | 3-4 dias |

---

## 22. Conclusão Expandida

O sistema atual já é funcional e bem arquitetado. O pipeline de exportação/parse/indexação dos Blueprints é o **ativo mais valioso** — 159 Blueprints documentados com variáveis, eventos, funções e até conexões de grafo (T3D), mais 37+ documentos pedagógicos, mais changelogs, mais glossários.

**O problema não é falta de dados, é subutilização deles.**

Hoje o RAG entrega documentos para o LLM *ler*, mas o LLM precisa manualmente traduzir essa leitura em tool calls — um processo frágil que frequentemente falha. A arquitetura atual é **passiva**: conhecimento existe nos documentos, mas não é transformado em ação.

As 16 fases mapeiam a jornada de um sistema **passivo** (documentos para leitura) para um **par de programação ativo** que:

1. **Fase 1:** Consegue ver o que existe (inspeção completa)
2. **Fase 2:** Consegue replicar com 1 comando (templates)
3. **Fase 3:** Aprende com seus próprios erros (feedback)
4. **Fase 4:** Clona grafos completos (T3D replay)
5. **Fase 5:** Entende arquiteturas cross-Blueprint
6. **Fase 6:** Executa tutoriais automaticamente
7. **Fase 7:** Antecipa o que o usuário vai precisar
8. **Fase 8:** Orquestra sistemas multi-Blueprint
9. **Fase 9:** Sabe por que certos padrões são evitados
10. **Fase 10:** Vê visualmente o que criou
11. **Fase 11:** Auto-testa e auto-corrige
12. **Fase 12:** Aprende com mudanças incrementais
13. **Fase 13:** Conhece os assets disponíveis
14. **Fase 14:** Recupera experiências passadas semanticamente
15. **Fase 15:** Documenta automaticamente o que cria
16. **Fase 16:** Integra-se ao ciclo de dev (git, build, testes)

**Não, não se limita a 4 fases.** O ecossistema de dados deste projeto (159 BPs exportados + T3D + docs pedagógicos + changelogs + RAG) suporta pelo menos 16 fases de aprendizado progressivo, e cada uma delas já tem o "terreno preparado" — os dados existem, as ferramentas C++ existem, o pipeline existe. O que falta é implementar as camadas de inteligência que transformam dados brutos em ações autônomas.
