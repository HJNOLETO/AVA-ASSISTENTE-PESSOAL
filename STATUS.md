# AVA Assistant + ProjetoGTA — Status do Projeto

**Última atualização:** 18/07/2026

---

## Conexão com Unreal Engine

O AVA conecta-se ao Unreal Engine via o **plugin UnrealMCP** (TCP `127.0.0.1:55557`). Toda comunicação — criação de Blueprints, componentes, nós, materiais, spawn, PIE — passa por esse canal.

### Endereços dos plugins

| # | Plugin | Local | Função | Git |
|---|--------|-------|--------|-----|
| 1 | **GTA (ativo)** | `ProjetoGTA/Plugins/UnrealMCP/` | Compilado e rodando no editor UE5 aberto | Sem git (cópia local) |
| 2 | **AVA (canônico)** | `CRIADO-AVA-CLI/flopperam-mcp/UnrealMCP/` | Código fonte versionado no GitHub | `HJNOLETO/AVA-ASSISTENTE-PESSOAL` |
| 3 | **AVA (exemplo)** | `CRIADO-AVA-CLI/flopperam-mcp/FlopperamUnrealMCP/Plugins/UnrealMCP/` | Cópia dentro de projeto UE de exemplo | Mesmo repo, subpasta |

**Sincronização:** Os 3 plugins têm código-fonte **idêntico** (verificação por hash MD5 em 18/07/2026). Sempre que o GTA é modificado, o AVA é atualizado em seguida.

### Formas de conexão

```
┌─────────────────────────────────────────────────────────────┐
│  MODO 1: Via AVA CLI (TypeScript)                           │
│  ─────────────────────────────                              │
│  AVA CLI (Node) ──TCP──▶ UnrealMCP Plugin (:55557)          │
│                                                             │
│  Usa: unreal_mcp_adapter.ts, unreal_ops.ts                  │
│  Vantagem: orquestração multi-BP, validação, templates      │
│  Comando: npm run dev (inicia CLI + servidor MCP)           │
├─────────────────────────────────────────────────────────────┤
│  MODO 2: Direto (IA ↔ Plugin)                               │
│  ─────────────────────────────                              │
│  IA (opencode) ──TCP──▶ UnrealMCP Plugin (:55557)          │
│                                                             │
│  Usa: socket.send_command("comando", params)                │
│  Vantagem: zero latência, acesso a 87 comandos C++          │
│  Requer: plugin compilado e rodando no editor               │
│  Exemplo: python -c "send_command('health', {})"           │
├─────────────────────────────────────────────────────────────┤
│  MODO 3: Via Python MCP Server                              │
│  ─────────────────────────────                              │
│  IA ──MCP──▶ unreal_mcp_server_advanced.py ──TCP──▶ Plugin │
│                                                             │
│  Usa: @mcp.tool() decorators                                │
│  Vantagem: compatível com clientes MCP (Claude, Antigravity)│
│  Gap atual: 59 wrappers + send_command() vs 87 comandos C++ │
└─────────────────────────────────────────────────────────────┘
```

### Verificar se o plugin está online

```bash
python -c "
import socket, json
s = socket.socket(); s.settimeout(5)
s.connect(('127.0.0.1', 55557))
s.sendall(json.dumps({'command':'health'}).encode() + b'\n')
print(s.recv(4096).decode())
"
```

---

## Plugin UnrealMCP — Status Técnico

| Métrica | Valor |
|---------|-------|
| Versão | 1.0.0 |
| Unreal Engine | 5.5+ / 5.6 |
| Comandos C++ | 87 |
| Wrappers Python | 59 específicos + send_command() genérico (cobertura total) |
| Timeouts | Criação 30s / Inspeção 120s / Procedural 300s |
| Protocolo | TCP com framing `\n`, JSON |
| Conexões simultâneas | 1 (sequencial) |
| Suporte RequestId | Sim |
| Suporte PIE | Sim (pie_start, pie_stop, pie_state) |
| Schema dinâmico | Sim (get_command_schema, list_commands) |

### Handlers e distribuição de comandos

| Handler | Comandos | Exemplos |
|---------|----------|----------|
| `bridge` | 6 | health, get_command_schema, list_commands |
| `blueprint` | 35 | create_blueprint, add_component, create_material_instance, delete_blueprint |
| `graph` | 23 | add_node, connect_pins, add_event_node, delete_node |
| `editor` | 18 | spawn_actor, set_mesh, pie_start, validate_project, search_assets |
| `building` | 4 | create_wall, create_tower, create_staircase, construct_house |

### Correções recentes aplicadas (18/07/2026)

| Correção | Arquivo | Status |
|----------|---------|--------|
| #1 LoadBlueprint unificado | NodeDeleter, NodePropertyManager, FunctionManager, FunctionIO → `FEpicUnrealMCPCommonUtils::FindBlueprint` | ✅ |
| #2 Blueprint como parent_class | BlueprintCommands.cpp `HandleCreateBlueprint` | ✅ |
| #3 Build.cs sincronizado | `FlopperamUnrealMCP/` agora tem EnhancedInput, UMG, UMGEditor | ✅ |
| #4 delete_blueprint | Bridge.cpp roteamento + BlueprintCommands.cpp implementação + schema | ✅ |
| #5 Código morto removido | `NodeManager::CreateVariableGetNode/SetNode` (migrado para FDataNodeCreator) | ✅ |
| #6 Python wrappers nativos | `create_wall`, `create_staircase` agora delegam ao C++ (1 chamada em vez de N) | ✅ |
| #7 tools-reference.md | Autogerado a partir de `get_command_schema` (86 comandos) | ✅ |
| #8 commands_count off-by-one | Bridge.cpp health: 86 → 87 | ✅ |
| #9 create_blueprint save_path | Python wrapper agora expõe save_path opcional | ✅ |
| #10 Auditoria completa | 87 comandos cross-referenciados: C++ / Bridge / Schema / Python / Docs | ✅ |

### Comandos sem wrapper específico (28) — acessíveis via send_command()

```
remove_component_from_blueprint  attach_component_to_blueprint
set_physics_properties           set_point_light_properties
get_blueprint_variable_details   get_blueprint_function_details
get_component_materials          get_static_mesh_material_slots
delete_blueprint                 add_input_action_node
add_key_event_node               add_get_node
call_function_on_object          disconnect_pins
delete_blueprint_node            add_enhanced_input_action_node
add_is_valid_guard               add_widget_to_viewport
compile_project_target           run_map_check
create_test_report
```

---

## ProjetoGTA (jogo)

| Status | Detalhe |
|--------|---------|
| ✅ | BP_WeaponBase funcional: 36 vars, 4 comps, 187 nós, 20 funções |
| ✅ | Sistema data-driven via DT_WeaponList |
| ✅ | AK-47 com todos assets referenciados corretamente |
| ⚠️ | Warning Humanoid (UE 5.6) — cosmético, não afeta gameplay |
| ⚠️ | BP_TestePy duplicado em AVA_Tests/ |
| ❌ | Arma aparece no pé (falta WeaponSocket no skeleton) |
| ❌ | Munição do chão não é coletada (AmmoBox overlap não conectado) |

---

## AVA CLI — Fases

| # | Fase | Status |
|---|------|--------|
| 1 | Adapter TCP (50+ ações) | ✅ |
| 2 | Templates (46 JSON) | ✅ |
| 3 | Feedback Loop | ✅ |
| 4 | Replay T3D | ✅ |
| 5 | Padrões Cross-BP | ✅ |
| 6 | Tutorial → Tool Calls | ✅ |
| 7 | Assistência Preditiva | ✅ |
| 8 | Orquestração Multi-BP | ✅ |
| 9 | Anti-padrões (14 bugs) | ✅ |
| 10 | Validação Estrutural | ✅ |
| 11 | Auto-correção | ✅ |
| 12 | Diff Learning | ✅ |
| 13 | Smart Asset Suggestions | ✅ |
| 14 | Memória Longo Prazo | ✅ |
| 15 | Documentação Automática | ✅ |
| 16 | Dev Cycle (Git) | ✅ |

---

## Caminhos disponíveis

### A) PROVAR O PIPELINE COMPLETO
Criar um sistema real do zero usando todas as fases integradas:
```
orchestrate_system("complete_weapon", "Shotgun")
  → create_from_template → auto_fix → validate_bp
  → asset_suggest → set_mesh/set_material
  → compile → spawn → generate_doc → dev_commit
```
**Requer:** UE5 aberto com MCP online

### B) CORRIGIR O PROJETO (intervenções do usuário)
1. **WeaponSocket** — Adicionar socket no skeleton `hand_r` (INTERVENCOES_USUARIO.md §1)
2. **AmmoBox overlap** — Conectar evento ao `AddAmmoToBP` (INTERVENCOES_USUARIO.md §2)
3. **BP_TestePy** — Deletar duplicata pelo Content Browser (INTERVENCOES_USUARIO.md §5)
**Requer:** Abrir UE5 e seguir o passo a passo

### C) CRIAR JOGO NOVO
Usar `GAME_TEMPLATES.md`: Samurai, FPS, RPG, Survival Horror, Corrida, Sandbox.

### D) EXPANDIR CONHECIMENTO
- Buscar documentação da Epic via WebFetch
- Executar `detect_duplicates.py`, `validator.py`, `catalog_assets.py`

---

## Para retomar

1. **Abrir UE5 com ProjetoGTA** — plugin compila e fica online em `127.0.0.1:55557`
2. **Verificar conexão:** `python -c "import socket,json;s=socket.socket();s.settimeout(5);s.connect(('127.0.0.1',55557));..."` 
3. **Consultar docs:** `INTERVENCOES_USUARIO.md`, `GAME_TEMPLATES.md`, `MA PEAMENTO_COMPLETO.md`
4. **Escolher caminho** A, B, C ou D

---

## Scripts Python úteis

```bash
python catalog_assets.py           # Catálogo de assets
python extract_templates.py        # Re-extrair templates
python detect_patterns.py          # Padrões cross-BP
python validator.py                # Checks de qualidade
python detect_duplicates.py        # Achar duplicatas
python cleanup_tests.py            # Limpar artefatos de teste
```
