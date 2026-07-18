# Handoff — Sessão 13/Jul/2026 (V5)

**Objetivo:** Fazer o plugin UnrealMCP V4 rodar no projeto NeriVerso (Ghost), com correções de estabilidade.

---

## 1. O que foi feito

### 1.1 Diagnóstico Inicial

- O NeriVerso (`G:\PROJETO_UNREAL_5-Neri_Verso\NeriVerso\`) é um projeto **Blueprint-only** (sem `Source/`, sem `.sln`, sem módulo C++ próprio)
- O plugin UnrealMCP já estava instalado em `Plugins\UnrealMCP\`, mas com uma **DLL pré-V4** (só aceitava `type`, não `command`; sem asset discovery; sem cleanup de socket)
- O código fonte V4 estava presente (idêntico ao ProjetoGTA), mas o projeto nunca foi recompilado

### 1.2 Cópia do Plugin ProjetoGTA → NeriVerso

Copiamos o plugin completo do ProjetoGTA para o NeriVerso. Como o NeriVerso é Blueprint-only, removemos a pasta `Source/` do plugin para evitar que o UE5 tente compilá-lo.

### 1.3 3 Correções Críticas no Código Fonte (ProjetoGTA)

| # | Arquivo | Linha | Antes | Depois | Motivo |
|---|---------|-------|-------|--------|--------|
| 1 | `EpicUnrealMCPBridge.cpp` | ~434 | `return Future.Get();` | `Future.WaitFor(30/120/300s)` com timeout por categoria | Deadlock quando Game Thread trava |
| 2 | `EpicUnrealMCPBridge.cpp` | ~141 | `Listen(5)` | `Listen(10)` | Backlog maior para bursts de conexões |
| 3 | `MCPServerRunnable.cpp` | ~24-27 e ~172-176 | `DestroySocket()` + `Reset()` | só `Close()` + `Reset()` | Double-free do socket → EXCEPTION_ACCESS_VIOLATION |

### 1.4 Saga do Build

1. **Tentativa 1:** Build da solution inteira do ProjetoGTA → **277 erros** (projetos do Engine: AutomationTool, Magick.NET)
2. **Tentativa 2:** Build só do `ProjetoGTAEditor` via `Build.bat`, mas "11 up-to-date" — o plugin não foi recompilado (Binaries estava vazio)
3. **Tentativa 3 (SUCESSO):** Deletamos `ProjetoGTA/Intermediate/`, rodamos `Build.bat ProjetoGTAEditor` → **38/38 compilado, 67 segundos**

### 1.5 Estado Final da DLL

- DLL: `UnrealEditor-UnrealMCP.dll` — **791 KB, compilada 17:53, 13/Jul/2026**
- Contém: V4 (59 comandos) + timeout fix + backlog 10 + double-free fix
- Copiada para: `G:\PROJETO_UNREAL_5-Neri_Verso\NeriVerso\Plugins\UnrealMCP\Binaries\Win64\`

### 1.6 Configuração do NeriVerso

- `.uproject` sem seção `Modules` (Blueprint-only puro)
- Plugin UnrealMCP habilitado no `.uproject`
- Plugin tem **apenas** `Binaries/`, `.uplugin`, `Config/`, `Content/` — **sem `Source/`** (evita tentativa de compilação)

---

## 2. Onde paramos

O **NeriVerso está pronto para abrir**. A DLL compilada com as correções está no lugar. Falta:

1. Abrir o NeriVerso (clique duplo em `NeriVerso.uproject`)
2. Aguardar o Editor carregar completamente
3. Verificar MCP online: `python -c "import socket;s=socket.socket();s.settimeout(3);s.connect(('127.0.0.1',55557));print('ONLINE');s.close()"`
4. Rodar a bateria de testes (59 comandos)

---

## 3. Timeouts por Categoria

| Categoria | Timeout | Comandos |
|-----------|---------|----------|
| **Default** | 30s | ping, create, compile, delete, spawn, attach, set_*, add_* |
| **Inspeção** | 120s | read_*, analyze_*, get_*, list_*, search_* |
| **Procedural** | 300s | construct_house, create_tower, create_wall, create_staircase |

---

## 4. Comandos para Testar (59 totais)

### Bridge (2)
`ping`, `get_command_schema` / `list_commands`

### Editor — Atores + Assets (10)
`get_actors_in_level`, `find_actors_by_name`, `spawn_actor`, `delete_actor`, `set_actor_transform`, `spawn_blueprint_actor`, `attach_actor_to_socket`, `search_assets`, `get_asset_details`, `list_assets_in_path`

### Blueprint (23)
`create_blueprint`, `add_component_to_blueprint`, `remove_component_from_blueprint`, `attach_component_to_blueprint`, `set_component_properties`, `get_blueprint_components`, `set_physics_properties`, `compile_blueprint`, `set_component_static_mesh`, `set_point_light_properties`, `set_mesh_material_color`, `get_available_materials`, `apply_material_to_actor`, `apply_material_to_blueprint`, `get_actor_material_info`, `get_blueprint_material_info`, `create_material_instance`, `set_material_instance_parameter`, `apply_material_to_component`, `get_component_materials`, `get_static_mesh_material_slots`, `read_blueprint_content`, `analyze_blueprint_graph`, `get_blueprint_variable_details`, `get_blueprint_function_details`

### Graph (18)
`add_blueprint_node`, `connect_nodes`, `create_variable`, `set_blueprint_variable_properties`, `add_event_node`, `add_input_action_node`, `add_key_event_node`, `delete_node`, `set_node_property`, `create_function`, `add_function_input`, `add_function_output`, `delete_function`, `rename_function`, `add_get_node`, `call_function_on_object`, `add_blueprint_interface`, `remove_blueprint_interface`, `get_blueprint_graph_nodes`

### Building (4)
`create_wall`, `create_staircase`, `create_tower`, `construct_house`

---

## 5. Script de Teste Padrão

```python
import socket, json, time

def send_cmd(cmd, params=None, timeout=15, sleep_t=2):
    s = socket.socket()
    s.settimeout(timeout)
    try:
        s.connect(('127.0.0.1', 55557))
        payload = {'command': cmd}
        if params is not None:
            payload['params'] = params
        msg = json.dumps(payload) + '\n'
        s.sendall(msg.encode())
        time.sleep(sleep_t)
        data = b''
        while True:
            try:
                chunk = s.recv(65536)
                if not chunk: break
                data += chunk
            except socket.timeout:
                break
        s.close()
        time.sleep(2.0)
        result = data.decode().strip()
        try: return json.loads(result)
        except: return result if result else None
    except Exception as e:
        return {'error': str(e)}

# Exemplo:
r = send_cmd('get_command_schema')
print(json.dumps(r, indent=2))
```

---

## 6. Caminhos Importantes

| Recurso | Caminho |
|---------|---------|
| Projeto NeriVerso | `G:\PROJETO_UNREAL_5-Neri_Verso\NeriVerso\NeriVerso.uproject` |
| Plugin DLL (NeriVerso) | `G:\PROJETO_UNREAL_5-Neri_Verso\NeriVerso\Plugins\UnrealMCP\Binaries\Win64\UnrealEditor-UnrealMCP.dll` |
| Código fonte (ProjetoGTA) | `C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\Plugins\UnrealMCP\Source\` |
| Build command | `& "C:\Program Files\Epic Games\UE_5.6\Engine\Build\BatchFiles\Build.bat" ProjetoGTAEditor Win64 Development -Project="C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\ProjetoGTA.uproject" -WaitMutex` |
| AVA CLI | `C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\CRIADO-AVA-CLI\` |
| MCP Integration docs | `CRIADO-AVA-CLI\unreal_engine_docs\MCP_Integration\` |

---

## 7. Se Precisar Recompilar Futuramente

```powershell
# 1. Editar código em ProjetoGTA
# 2. Deletar Intermediate (força rebuild sem cache)
Remove-Item -Recurse -Force "C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\Intermediate"
# 3. Compilar
& "C:\Program Files\Epic Games\UE_5.6\Engine\Build\BatchFiles\Build.bat" ProjetoGTAEditor Win64 Development -Project="C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\ProjetoGTA.uproject" -WaitMutex
# 4. Copiar DLL
Copy-Item "C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\Plugins\UnrealMCP\Binaries\Win64\UnrealEditor-UnrealMCP.*" "G:\PROJETO_UNREAL_5-Neri_Verso\NeriVerso\Plugins\UnrealMCP\Binaries\Win64\"
# 5. Abrir NeriVerso
```

---

## 8. Notas / Cuidados

- **NUNCA rode `Build.bat NeriVersoEditor`** — NeriVerso é Blueprint-only, não tem módulo C++
- **Sempre mantenha o `.uproject` sem seção `Modules`** — se aparecer, remova
- **O plugin no NeriVerso NÃO deve ter `Source/`** — só `Binaries/` + `.uplugin`
- **Testes devem usar prefixo `BP_AVA_Test_*`** para facilitar limpeza
- **NUNCA mover `.uasset` pelo filesystem** — corrompe referências

---

*Documento gerado em 13/Jul/2026. Próximo passo: abrir NeriVerso e testar os 59 comandos V4.*
