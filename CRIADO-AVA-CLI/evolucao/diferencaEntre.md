# Comparação entre Plugins UnrealMCP — ATUALIZADO 18/07/2026

## Versões comparadas

| # | Local | Descrição |
|---|-------|-----------|
| 1 | `...\ProjetoGTA\Plugins\UnrealMCP\Source\UnrealMCP\` | Versão GTA/Pirata Perdido (mais evoluída) |
| 2 | `...\flopperam-mcp\UnrealMCP\Source\UnrealMCP\` | Versão AVA CLI (snapshot anterior, conectada ao GitHub) |

---

## 1. NodeManager.cpp: LoadBlueprint

| Aspecto | GTA | AVA |
|---|---|---|
| Implementação | Inline (34 linhas): path resolution, `/Game/Blueprints/` prefix, `.AssetName` suffix, LoadObject → EditorAssetLibrary fallback | 3 linhas: delega ao `FEpicUnrealMCPCommonUtils::FindBlueprint()` |
| Total arquivo | 624 linhas | 596 linhas |

**Resultado:** GTA — implementação self-contained com fallback próprio. AVA delega ao CommonUtils (arquiteturalmente mais limpo, mas menos defensivo).

---

## 2. EventManager.cpp: LoadBlueprint

| Aspecto | GTA | AVA |
|---|---|---|
| LoadBlueprint | Inline (34 linhas) | Delegado ao CommonUtils |
| AddEventNode | Suporta Interface events (`interface_name`) | Sem suporte a interface |
| Métodos extras | AddGetNode, AddCallFunctionOnObject (V6 chain) | Nenhum dos dois |
| Total arquivo | 511 linhas | 171 linhas |

**Resultado:** GTA — massivamente mais rico (3x maior). Tem V6 chain support, interface events, AddGetNode.

---

## 3. NodeDeleter.cpp: LoadBlueprint

| Aspecto | GTA | AVA |
|---|---|---|
| Implementação | Inline (34 linhas) | Delegado ao CommonUtils |
| Lógica DeleteNode | Idêntica | Idêntica |
| Total arquivo | 202 linhas | 174 linhas |

**Resultado:** GTA (marginal) — mesma lógica, apenas mais auto-contido.

---

## 4. BlueprintCommands.cpp: HandleCreateBlueprint + Commands

| Aspecto | GTA | AVA |
|---|---|---|
| Lê `save_path`? | SIM (linha 228) | SIM (linha 135) |
| Valida `/Game/` em save_path? | SIM (linha 231-232) | NÃO |
| Retorna `save_path` no resultado? | SIM (linha 336) | NÃO |
| Blueprint como `parent_class`? *(Correção #2)* | **SIM** (linhas 290-316) | SIM (linhas 198-226) |
| Roteamento `delete_blueprint`? *(Correção #4)* | **SIM** (linhas 209-212) | SIM (linhas 115-118) |
| Comandos totais | ~45 (V4-V7 inclusos) | ~25 (básico) |

**Resultado:** GTA — possui TUDO que a AVA tem (Blueprint-parent-class + delete_blueprint) **E** muitos comandos a mais (V4-V7: material instances, enhanced input, widgets, collision, sockets, diagnostics, summary).

---

## 5. EpicUnrealMCPBridge.cpp: Roteamento e Infraestrutura

| Aspecto | GTA | AVA |
|---|---|---|
| Roteia `delete_blueprint`? *(Correção #4)* | **SIM** (linha 444) | SIM (linha 252) |
| Suporte RequestId | SIM | NÃO |
| Timeouts (30s/120s/300s) | SIM | NÃO (Future.Get() bloqueante) |
| Comandos roteados | ~86 (health, schema, PIE, asset search, V4-V7, graph extendido) | ~40 (básico) |
| Logging com timing | SIM | NÃO |
| `health` / `get_server_info` | SIM | NÃO |
| `get_command_schema` / `list_commands` | SIM | NÃO |

**Resultado:** GTA — tem delete_blueprint routing E toda a infraestrutura avançada que falta na AVA.

---

## 6. Resumo Final

| Arquivo | Versão mais completa |
|---|---|
| NodeManager.cpp | GTA |
| EventManager.cpp | **GTA** (3x maior) |
| NodeDeleter.cpp | GTA (marginal) |
| BlueprintCommands.cpp | **GTA** (já tem tudo da AVA + V4-V7) |
| EpicUnrealMCPBridge.cpp | **GTA** (já tem tudo da AVA + infraestrutura avançada) |

### Conclusão

**A versão GTA já é a versão canônica, completa e unificada.** NÃO há features na AVA que faltem na GTA. As duas "features ausentes" mencionadas em análises anteriores — `delete_blueprint` e Blueprint-como-parent-class — **já foram portadas para a versão GTA**.

A versão AVA (`flopperam-mcp`) pode ser tratada como um snapshot histórico da base inicial. O desenvolvimento ativo está na versão GTA.

### Comparação com o GUIDE_IMPLEMENTACAO_MCP.md

| Correção | Status no GTA |
|---|---|
| #1 LoadBlueprint duplicado | GTA usa inline próprio (funcional, mas não centralizado) |
| #2 Blueprint como parent_class | **Já implementado** (BlueprintCommands.cpp:290-316) |
| #3 "type" vs "command" no MCPServerRunnable | Verificar MCPServerRunnable.cpp |
| #4 delete_blueprint | **Já implementado** (BlueprintCommands.cpp:209-212 + Bridge.cpp:444) |
| #5 add_component com Blueprint components | **Já implementado** (fallback AssetRegistry em BlueprintCommands.cpp) |
| #6 Padronizar blueprint_name vs blueprint_path | Parcial — FindBlueprint já aceita ambos |
