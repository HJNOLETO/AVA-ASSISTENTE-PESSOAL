# CHANGELOG_FIXES.md
## Log de Erros, Acertos e Lições Aprendidas — AVA Assistant Fases 1-4

> **Regra de ouro:** Todo erro corrigido deve ser registrado aqui ANTES de avançar.  
> **Objetivo:** Não repetir erros. Cada entrada = uma lição que o código aprendeu.

---

## 📅 08-07-2026 — Sessão de Implementação Fases 1-4

### ✅ ACERTOS

#### A1. Extração de templates funcionou de primeira
- **O que:** 40 templates JSON extraídos dos 159 Blueprints exportados
- **Por que deu certo:** O formato dos `.md` exportados é consistente (cabeçalho `# 🎮 Blueprint:`, tabela de variáveis, seções de grafo)
- **Lição:** Investir em formato de exportação padronizado paga dividendos em automação

#### A2. Inspeção de Blueprints via MCP funciona (com timeout adequado)
- **O que:** `read_blueprint_content` retornou 35 variáveis + 4 componentes do BP_WeaponBase
- **Por que deu certo:** Path completo `/Game/Blueprints/Weapons/BP_WeaponBase` + timeout de 60s
- **Lição:** BPs complexos (>30 variáveis) precisam de 60-120s para inspeção

#### A3. Criação e spawn de Blueprint funciona
- **O que:** `BP_AVA_Test` criado, compilado e spawnado no level (84° ator na lista)
- **Por que deu certo:** Comandos `create_blueprint` e `spawn_blueprint_actor` são estáveis no C++
- **Lição:** As operações básicas do plugin são confiáveis — os problemas estão nas operações avançadas

---

### ❌ ERROS CORRIGIDOS

#### E1. [CRÍTICO] `add_node` enviava comando errado para o C++
- **Sintoma:** "Unknown command: add_node"
- **Causa:** Adapter TypeScript enviava `"add_node"`, mas o bridge C++ espera `"add_blueprint_node"`
- **Correção:** Linha 271 → `sendMcpCommand("add_blueprint_node", ...)`
- **Impacto:** Toda tentativa de adicionar nó ao Blueprint Graph falhava silenciosamente
- **Lição:** Sempre comparar os nomes de comando do adapter com os do `EpicUnrealMCPBridge::ExecuteCommand()`

#### E2. [CRÍTICO] `connect_nodes` usava nomes errados de parâmetros
- **Sintoma:** "Missing 'source_node_id' parameter"
- **Causa:** Adapter enviava `source_node`, `target_node`, mas C++ espera `source_node_id`, `target_node_id` (e similar para pins: `_pin` → `_pin_name`)
- **Correção:** Mapeamento corrigido: `source_node`→`source_node_id`, `source_pin`→`source_pin_name`, etc.
- **Lição:** Nomes de parâmetros do adapter DEVEM corresponder exatamente aos do C++ — não há validação automática

#### E3. [ALTO] `create_tower` enviava `tower_style` em vez de `style`
- **Sintoma:** Estilo da torre ignorado (sempre usava default)
- **Causa:** Parâmetro nomeado `tower_style` no adapter, mas C++ espera `style`
- **Correção:** Mapeamento corrigido + fallback: `String(args.style || args.tower_style || "square")`
- **Lição:** Parâmetros com nomes diferentes entre TS e C++ devem ser mapeados explicitamente

#### E4. [ALTO] `list_materials` lia do caminho errado na resposta
- **Sintoma:** "Nenhum material encontrado" quando havia materiais
- **Causa:** Código lia `result.result` como array, mas C++ retorna `result.result.materials` (objeto aninhado)
- **Correção:** Acesso corrigido: `resultObj?.materials || (Array.isArray(resultObj) ? resultObj : [])`
- **Lição:** Sempre verificar o formato exato da resposta C++ — pode ter wrapping extra

#### E5. [CRÍTICO] Comandos de inspeção precisam de path completo
- **Sintoma:** `read_blueprint_content` com `"BP_AVA_Test"` → erro
- **Causa:** C++ espera `/Game/Blueprints/BP_AVA_Test`, não apenas o nome
- **Correção:** Função `normalizeBpPath()` que detecta e adiciona prefixo `/Game/Blueprints/`
- **Lição:** Alguns comandos C++ usam nome curto, outros exigem path completo — inconsistência do plugin precisa de adaptação no TS

#### E6. [ALTO] Timeout de 30s insuficiente para inspeção de BPs complexos
- **Sintoma:** `get_blueprint_variable_details` e `get_blueprint_function_details` timeout
- **Causa:** BPs com 35+ variáveis ou 97+ funções levam >60s para processar no C++
- **Correção:** Nova env var `UE_MCP_INSPECT_TIMEOUT_MS` (default 120s) para comandos de inspeção
- **Lição:** Operações de leitura/inspeção em BPs grandes precisam de timeout separado

#### E7. [MÉDIO] extract_templates.py: erro de encoding Unicode no Windows
- **Sintoma:** `UnicodeEncodeError: 'charmap' codec can't encode character '\u2713'`
- **Causa:** Terminal Windows usa cp1252, não suporta caracteres Unicode como ✓ e ✗
- **Correção:** `sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')` + substituir ✓→[OK] e ✗→[ERRO]
- **Lição:** Sempre usar ASCII-safe em prints de scripts CLI para Windows

#### E8. [MÉDIO] 7 arquivos Widget-HUD falharam na extração de templates
- **Sintoma:** "Nao encontrou nome do Blueprint"
- **Causa:** Arquivos UMG/Widget usam formato T3D puro (sem cabeçalho `# 🎮 Blueprint:`)
- **Correção:** Função `extract_from_t3d()` como fallback — detecta `Begin Object Class=/Script/UMG.`, extrai componentes UMG, gera template mínimo
- **Validação:** 46 templates extraídos, zero erros

---

### 🔍 RESOLVIDO DURANTE A SESSÃO

#### I1. `add_component_to_blueprint` precisa de path completo de classe C++
- **Sintoma:** Timeout (silencioso) ao enviar `component_type: "StaticMeshComponent"`
- **Causa:** C++ espera o path completo `/Script/Engine.StaticMeshComponent`, não o nome curto
- **Correção:** `normalizeComponentType()` com mapeamento de 22 tipos de componentes comuns
- **Validação:** Testado com CapsuleComponent — sucesso, compilou, spawnou
- **Lição:** O plugin C++ usa `StaticLoadClass` para resolver tipos — requer path completo

#### I2. `delete_actor` — ator pode não existir mais
- **Sintoma:** "Actor not found" mesmo com nome exato
- **Causa:** O ator BP_AVA_Test_C_0 foi removido do level (não persiste entre sessões ou foi limpo)
- **Conclusão:** Não é bug — o ator realmente não existia mais (confirmado via listagem: 83 atores, sem AVA_Test)
- **Lição:** Verificar existência via `get_actors_in_level` antes de assumir bug no delete

---

### 📊 MÉTRICAS DA SESSÃO

| Métrica | Valor |
|---------|-------|
| Ações totais no adapter | 39 (eram 23) |
| Bugs corrigidos | 8 |
| Templates extraídos | 40 |
| Arquivos criados/modificados | 7 |
| Conexão MCP testada | ONLINE (84 actors) |
| BPs criados via MCP | 1 (BP_AVA_Test) |
| Inspeções bem-sucedidas | 1 (BP_WeaponBase: 35 vars, 4 comps) |

---

### 🎯 REGRAS PARA PRÓXIMAS IMPLEMENTAÇÕES

1. **Validar comando C++ ANTES de adicionar ao adapter TypeScript** — testar via Python raw socket
2. **Sempre verificar o formato de resposta C++** — inspecionar `result.result` vs `result` vs wrapping
3. **Nomes de parâmetros TS === C++** — sem exceções, mapear explicitamente se diferente
4. **Timeouts separados por categoria** — criação (30s), inspeção (120s), construção procedural (300s)
5. **Path completo para comandos que usam AssetRegistry** — `/Game/Blueprints/...`, não só nome
6. **Printf ASCII-safe** — sem emoji ou Unicode em scripts CLI
7. **Registrar TODO erro neste arquivo** — antes de passar para a próxima feature

---

## 08-07-2026 (Fase 5) — Padroes Cross-Blueprint

### Acertos
- 9 padroes arquiteturais detectados (HUD/UI: 15 BPs, Interacao: 12, Arma: 6)
- Evento `Interact` compartilhado por 7 BPs — padrao de interacao confirmado
- Contexto arquitetural injetado no system prompt

### Regra adicional:
8. **Sistemas sao compostos por multiplos BPs** — ao modificar um, verificar o contexto arquitetural para identificar BPs relacionados

---

## 08-07-2026 (Aprendizados de Resiliência) — Testes de Fallback

### Acertos
- MCP plugin C++ sobreviveu a upgrade de UE 5.3 → 5.6 (binário compilado funciona)
- Remote Control API (porta 30010) funciona com `/remote/info`, `/remote/presets`, `/remote/search/assets`
- Config `DefaultEngine.ini` corretamente identificado e modificado

### Erro / Limitação
- Python remoto via HTTP NÃO funciona em UE 5.6 — `PythonScriptPlugin` bloqueia acesso remoto
- Config `bEnableRemotePythonExecution=True` não surte efeito nesta versão
- `[/Script/RemoteControl.RemoteControlSettings]` existe mas não expõe Python
- Mover `.uasset` pelo filesystem com UE5 aberto CORROMPE referências no mapa

### Regras adicionadas:
9. **NUNCA mover .uasset pelo filesystem** — use Content Browser, MCP, ou Python (se disponível)
10. **Python remoto via HTTP não é fallback confiável em UE 5.5+** — requer Remote Control Preset manual
11. **MCP C++ é o caminho primário** — Python remoto seria bônus, não dependência
12. **BPs de teste devem usar prefixo `BP_AVA_Test_*`** — facilita identificação e limpeza
13. **Sempre verificar locks de arquivo** — `PermissionError` indica UE5 aberto com arquivo em uso

### Comandos validados (funcionam):
- `create_blueprint` — BP_AVA_Validate criado e confirmado
- `create_variable` — 2 vars criadas com sucesso
- `compile_blueprint` — compila OK
- `spawn_blueprint_actor` — spawna OK
- `read_blueprint_content` — inspecao retorna dados corretos

### Comandos com problemas:
- `add_event_node` — retorna erro (delega para FEventManager que espera params adicionais)
- `create_function` — delega para FunctionManager, requer params adicionais
- `create_from_template` — funciona ate a etapa de eventos, falha no add_event_node

### Licao:
9. **Comandos que delegam para sub-managers (EventManager, FunctionManager) podem precisar de params extras** — verificar as implementacoes C++ dos sub-managers antes de assumir que os params documentados sao suficientes
