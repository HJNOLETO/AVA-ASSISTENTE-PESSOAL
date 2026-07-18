# Resumo de Conexao AVA CLI ↔ Unreal Engine

**[Data do documento original: 03 de Julho de 2026]**
**[Ultima atualizacao: 15 de Julho de 2026 — incorpora UnrealMCP e testes em UE 5.6.1]**
**[Status do Editor: UE 5.6.1, plugin UnrealMCP + Remote Control API]**
**[Ollama: Online — gemma4:31b-cloud]**

---

## Objetivo

Entender como o AVA CLI se conecta ao Unreal Engine para viabilizar implementacao de mecanicas em tempo real via chat.

---

## Arquitetura da Conexao (Atualizada — Duas Vias)

```
AVA CLI (cli/index.ts)
  │
  ├─→ unreal_mcp (TCP :55557, plugin UnrealMCP C++)
  │     → Blueprints, spawn, materiais, PIE, compilacao, diagnostico
  │     → 86 comandos disponiveis
  │
  └─→ unreal_ops (HTTP :30010, Remote Control API nativa)
        → Python, console, screenshot
        → 8 acoes (nao funciona em UE 5.6)
```

**MCP C++ e o caminho primario.** Python remoto via HTTP nao funciona em UE 5.6, portanto a criacao de Blueprints, inspecao, compilacao e controle de PIE sao feitos exclusivamente pelo plugin UnrealMCP (TCP).

Cada acao HTTP abre uma requisicao fresh. Timeout padrao: 15s (HTTP) / 30-300s (MCP, dependendo do comando).

---

## Via 1 — UnrealMCP (TCP :55557) — PRIMARIA

### 86 Comandos Disponiveis (destaques)

| Categoria | Comandos | Descricao |
|---|---|---|
| Health / Info | `health`, `get_command_schema`, `pie_state` | Status do servidor e do PIE |
| Blueprint | `create_blueprint`, `get_blueprint_summary`, `compile_blueprint`, `get_blueprint_diagnostics` | Ciclo completo de BP |
| Assets | `list_assets_in_path` | Navegacao no Content Browser |
| Nivel | `run_map_check` | Validacao de nivel |
| PIE | `pie_start`, `pie_stop` | Controle de Play In Editor |
| Projeto | `validate_project`, `create_test_report` | Validacao e snapshot da sessao |

> Consulte `MCP_Integration/DOCUMENTACAO_FINAL.md` para a especificacao completa.

### Bugs Conhecidos (15/07/2026)

| Bug | Status | Detalhe |
|---|---|---|
| `save_path` ignorado | **CORRIGIDO** | Asset agora e criado no caminho exato solicitado |
| `pie_stop` nao deterministico | **ABERTO** | Requer 2a chamada para encerrar; conexoes TCP caem durante polling (WinError 10053/10054) |

**Contrato atual do `pie_stop`:**
- Retorna `{state:"stopping", accepted:true, completed:false}`
- Cliente DEVE fazer polling com `pie_state` ate obter `stopped`
- Timeout recomendado: esperar ate 10s com retentativas de 2s

### Pre-requisitos

- Plugin **UnrealMCP** copiado para `Plugins/UnrealMCP/` no projeto
- Plugin habilitado em Edit → Plugins
- Servidor escutando em `127.0.0.1:55557`

### Verificar MCP

```powershell
# Testar conexao TCP com o MCP
npx tsx cli/index.ts ask "verifique a saude do servidor MCP do unreal"
```

```bash
# Health check direto (exemplo conceitual — o CLI encapsula o protocolo)
# Resposta esperada: UE 5.6, porta 55557, 86 comandos
```

---

## Via 2 — Remote Control API (HTTP :30010) — SECUNDARIA

### 8 Acoes Disponiveis

| Acao | Endpoint/Metodo | Descricao |
|---|---|---|
| `check` | `GET /remote/info` | Verifica se editor esta online |
| `python` | `PUT /remote/object/call` | Executa script Python arbitrario |
| `console` | `PUT /remote/object/call` | Comando de console (ex: `stat fps`) |
| `actors` | `PUT /remote/object/call` | Lista todos os actors do nivel |
| `inspect` | `PUT /remote/object/call` | Inspeciona propriedades de um actor |
| `screenshot` | `PUT /remote/object/call` | Captura viewport (1920x1080) |
| `assets` | `PUT /remote/object/call` | Lista assets do Content Browser |
| `compile` | `PUT /remote/object/call` | Recompila todos os Blueprints |

As acoes 2-8 sao scripts Python enviados para `PythonScriptPlugin.Default__PythonScriptLibrary.ExecutePythonScript`.

> [!WARNING]
> **Python remoto via HTTP NAO funciona em UE 5.6.** Use o UnrealMCP (Via 1) para operacoes de Blueprint e PIE. O Remote Control permanece util para `screenshot`, `console` e `check` em UE 5.5-.

### Pre-requisitos

Editor com Remote Control habilitado no `DefaultEngine.ini`:

```ini
[/Script/RemoteControl.RemoteControlSettings]
bEnableRemoteExecution=True
bAllowRemoteExecutionOfConsoleCommands=True
bAllowPythonExecution=True

[/Script/RemoteControlAPI.RemoteControlSettings]
bEnableRemoteControlHttp=True
RemoteControlHttpServerPort=30010
bRestrictServerToLocalHost=True
```

> [!WARNING]
> **O editor precisa ser reiniciado** para que `bAllowPythonExecution=True` surta efeito.

### Verificar HTTP

```powershell
curl http://localhost:30010/remote/info
```

---

## Arquivos-Chave

| Arquivo | Funcao |
|---|---|
| `server/tools/unreal_ops.ts` | Cliente HTTP + 8 handlers (Remote Control) |
| `server/tools/unreal_mcp.ts` | Cliente TCP + handlers MCP (86 comandos) |
| `server/tools/executor.ts` | Roteador de tools — dispatcher para ambas as vias |
| `server/agents.ts` | Definicao da tool schema (LLM) + filtro regex |
| `cli/index.ts` | Registro no CLI + dispatch switch/case |
| `server/rag/retriever-patch.ts` | Context-Aware Boosting — detecta projeto UE5 aberto |
| `tests/unreal-ops.test.ts` | Testes unitarios (HTTP) |
| `tests/unreal-mcp.test.ts` | Testes de integracao (MCP) |

---

## Resultados dos Testes Realizados

### Testes MCP — Integracao (15/07/2026, UE 5.6.1)

| Verificacao | Resultado |
|---|---|
| `health` | Sucesso — UE 5.6.1, porta 55557, 86 comandos |
| Comando desconhecido | `status:error`, `UNKNOWN_COMMAND` |
| `pie_state` | Estado estruturado |
| `create_blueprint` | Criado em `/Game/MCPTests/` (save_path corrigido) |
| `get_blueprint_summary` | Componentes, graphs, compilacao |
| `compile_blueprint` | Sucesso, `has_errors:false`, 68 ms |
| `get_blueprint_diagnostics` | 0 erros, 0 avisos, 0 nos orfaos |
| `run_map_check` | `issue_count: 0` |
| `validate_project` | Plugin habilitado, estado valido |
| `pie_start` → `running` | OK |
| `pie_stop` → `stopped` | **Requer 2a chamada** (bug aberto) |
| `create_test_report` | Snapshot da sessao OK |

### Testes HTTP — Remote Control (03/07/2026, UE 5.3)

| Teste | Comando | Resultado |
|---|---|---|
| Porta 30010 escutando | `netstat -ano \| findstr :30010` | LISTENING — PID do UnrealEditor.exe |
| API info | `curl http://localhost:30010/remote/info` | 34 rotas disponiveis |
| Object describe | `PUT /remote/object/describe` GameplayStatics | Retornou descricao completa |
| GetAllActorsOfClass | `PUT /remote/object/call` nativo | Executou — retornou `[]` |

---

## Exemplos de Uso

### Via MCP (primaria — recomendada)

```bash
# Verificar saude do MCP
npx tsx cli/index.ts ask "verifique a saude do servidor MCP"

# Criar um Blueprint em pasta de teste
npx tsx cli/index.ts ask "crie um blueprint BP_Teste na pasta /Game/MCPTests/ herdando de Actor"

# Compilar e diagnosticar
npx tsx cli/index.ts ask "compile o blueprint BP_Teste e mostre os diagnosticos"

# Iniciar PIE
npx tsx cli/index.ts ask "inicie o Play in Editor"

# Verificar estado do PIE
npx tsx cli/index.ts ask "qual o estado atual do PIE"

# Parar PIE (pode precisar de retentativa)
npx tsx cli/index.ts ask "pare o Play in Editor"

# Validar nivel
npx tsx cli/index.ts ask "execute map check no nivel atual"
```

### Via HTTP (secundaria — UE 5.5-)

```bash
# Verificar conexao
npx tsx cli/index.ts ask "verifique se o unreal engine esta conectado"

# Listar actors
npx tsx cli/index.ts ask "liste todos os actors do level"

# Screenshot
npx tsx cli/index.ts ask "tire um screenshot do viewport"

# Compilar Blueprints (Python)
npx tsx cli/index.ts ask "compile todos os blueprints do projeto"
```

---

## Como Retomar na Proxima Sessao

### 1. Verificar pre-requisitos

```powershell
# Verificar se Ollama esta rodando
curl http://localhost:11434/api/tags

# Verificar se Unreal Editor esta rodando
tasklist /FI "IMAGENAME eq UnrealEditor.exe" /V | findstr "UnrealEditor"

# Verificar porta MCP (TCP 55557)
netstat -ano | findstr ":55557"

# Verificar porta Remote Control (HTTP 30010)
netstat -ano | findstr ":30010"
```

### 2. Garantir plugins

- **UnrealMCP:** Verificar em Edit → Plugins que "UnrealMCP" esta habilitado
- **Remote Control:** Confirmar config no `DefaultEngine.ini` (ver secao Via 2)
- Se alterou `DefaultEngine.ini`, **reinicie o editor**

### 3. Testar a integracao completa

```bash
# Health check MCP (primario)
npx tsx cli/index.ts ask "verifique a saude do servidor MCP do unreal"

# Health check HTTP (secundario)
curl http://localhost:30010/remote/info
```

### 4. Mudar de projeto

1. Feche o projeto atual no Unreal Editor
2. Abra o projeto desejado
3. Copie o plugin UnrealMCP para `Plugins/UnrealMCP/` se necessario
4. Verifique `DefaultEngine.ini` do projeto alvo
5. Rode script de config: `powershell -ExecutionPolicy Bypass -File scratch/update-unreal-config.ps1`
6. Reinicie o editor

### 5. Scripts uteis salvos

| Script | Funcao |
|---|---|
| `scratch/fix-alien-config.ps1` | Configura Remote Control no AlienPrototype |
| `scratch/update-unreal-config.ps1` | Configurador generico |
| `scratch/update-uproject.ps1` | Adiciona plugins ao `.uproject` |

---

## Contexto Atual do Ambiente

| Componente | Status |
|---|---|
| Ollama | Online — `127.0.0.1:11434` |
| Modelo | `gemma4:31b-cloud` |
| Unreal Editor | UE 5.6.1 |
| Plugin UnrealMCP | Habilitado — 86 comandos, porta 55557 |
| Remote Control | Porta 30010 (escutando) |
| Projetos | AlienPrototype (UE 5.3), ProjetoGTA, TheLostPirate (offline) |

---

## Links Importantes

- **Relatorio de Integracao MCP:** [RELATORIO_TESTE_INTEGRACAO_UNREALMCP_2026-07-15.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/evolucao/RELATORIO_TESTE_INTEGRACAO_UNREALMCP_2026-07-15.md)
- **Documentacao Final MCP:** [DOCUMENTACAO_FINAL.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/MCP_Integration/DOCUMENTACAO_FINAL.md)
- **Mapeamento Completo de Comandos:** [MAPEAMENTO_COMPLETO.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/MAPEAMENTO_COMPLETO.md)
- **Anti-Patterns:** [ANTI_PATTERNS.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/ANTI_PATTERNS.md)
- **Guia Integracao Completo:** [GUIA_INTEGRACAO_UNREAL_ENGINE.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/docs/blender_mcp/GUIA_INTEGRACAO_UNREAL_ENGINE.md)
- **Docs Integracao UE5:** [unreal_ops_integration.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/unreal_ops_integration.md)
