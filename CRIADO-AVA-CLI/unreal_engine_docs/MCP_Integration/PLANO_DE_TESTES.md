# Plano de Testes — Integração UnrealMCP no AVA CLI

## Pré-requisito: Compilar o Plugin

### Procedimento

1. **Fechar o UE5** completamente
2. **Abrir** `ProjetoGTA.uproject` (clique duplo):
   ```
   C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\ProjetoGTA.uproject
   ```
3. Clicar **Yes** na mensagem "The following modules are missing..."
4. Aguardar compilação (~1-2 min)
5. Editor abre com o mapa TestMap → plugin carregado

---

## Metodologia de Teste

**Regra: um teste por vez. Só avançar após confirmar que o anterior funcionou.**

Cada teste segue o ciclo:

```
1. Executar comando
2. Verificar resultado (no terminal E visualmente no editor UE5)
3. Classificar: PASSOU ✓ / FALHOU ✗
4. Só então passar para o próximo
```

---

## Fase 1: Verificação de Conexão

### Teste 1.1 — Ping TCP (unreal_mcp)

**Objetivo:** Confirmar que o plugin UnrealMCP está rodando e aceitando conexões TCP na porta 55557.

```
unreal_mcp({ action: "check" })
```

| Critério de Sucesso |
|---------------------|
| Resposta contém `UnrealMCP ONLINE` |
| Resposta contém o número de actors no level (ex: `15 actors`) |

**Se FALHAR:**
- Mensagem `UnrealMCP plugin nao encontrado` → o plugin não compilou ou não carregou
- Mensagem `Timeout` → plugin carregou mas não está respondendo
- Ação: verificar Edit → Plugins → UnrealMCP → Enabled. Reiniciar editor.

**Resultado:** `[  ] PASSOU  [  ] FALHOU`  
**Detalhe:** ___________________________________

---

### Teste 1.2 — Ping HTTP (unreal_ops)

**Objetivo:** Confirmar que o Remote Control (HTTP 30010) continua funcionando normalmente.

```
unreal_ops({ action: "check" })
```

| Critério de Sucesso |
|---------------------|
| Resposta contém `Unreal Engine conectado` |

**Resultado:** `[  ] PASSOU  [  ] FALHOU`  
**Detalhe:** ___________________________________

---

## Fase 2: Leitura de Dados (não modifica nada)

> **Só prossiga se os testes 1.1 e 1.2 passaram.**

### Teste 2.1 — Listar Atores

**Objetivo:** Verificar se o plugin retorna a lista de atores do TestMap corretamente.

```
unreal_mcp({ action: "actors" })
```

| Critério de Sucesso |
|---------------------|
| Lista contém atores conhecidos: `ALS_NPC`, `PlayerStart`, `BP_Beretta`, etc. |
| Cada linha tem formato `- [Classe] Nome` |

**Verificação visual no UE5:** Os nomes listados devem corresponder ao que está no World Outliner.

**Resultado:** `[  ] PASSOU  [  ] FALHOU`  
**Detalhe:** ___________________________________

---

### Teste 2.2 — Buscar Ator por Nome

**Objetivo:** Testar busca com padrão de nome.

```
unreal_mcp({ action: "find_actor", pattern: "ALS" })
```

| Critério de Sucesso |
|---------------------|
| JSON retornado contém `ALS_NPC`, `ALS_NPC2`, `ALS_NPC3` |
| Cada entrada tem propriedades do ator |

**Resultado:** `[  ] PASSOU  [  ] FALHOU`  
**Detalhe:** ___________________________________

---

## Fase 3: Criação de Blueprint (modifica o projeto)

> **Só prossiga se os testes 2.1 e 2.2 passaram.**
> **A PARTIR DAQUI OS TESTES MODIFICAM O PROJETO. Recomendo salvar antes (Ctrl+Shift+S).**

### Teste 3.1 — Criar Blueprint

**Objetivo:** Criar um Blueprint simples para teste.

```
unreal_mcp({ action: "create_bp", name: "BP_MCP_Test", parent_class: "Actor" })
```

| Critério de Sucesso |
|---------------------|
| Resposta: `Blueprint "BP_MCP_Test" criado com classe pai "Actor".` |
| **Visual:** No Content Browser → `/Game/Blueprints/` → aparece `BP_MCP_Test` |

**Resultado:** `[  ] PASSOU  [  ] FALHOU`  
**Detalhe:** ___________________________________

---

### Teste 3.2 — Adicionar Componente

**Objetivo:** Adicionar um StaticMeshComponent ao Blueprint criado.

```
unreal_mcp({ action: "add_component", blueprint: "BP_MCP_Test", component_type: "StaticMeshComponent", component_name: "TestMesh" })
```

| Critério de Sucesso |
|---------------------|
| Resposta contém `Componente "TestMesh" (StaticMeshComponent) adicionado` |
| **Visual:** Abrir `BP_MCP_Test` no editor → Components panel mostra `TestMesh` |

**Resultado:** `[  ] PASSOU  [  ] FALHOU`  
**Detalhe:** ___________________________________

---

### Teste 3.3 — Compilar Blueprint

**Objetivo:** Compilar o BP com o componente adicionado.

```
unreal_mcp({ action: "compile_bp", name: "BP_MCP_Test" })
```

| Critério de Sucesso |
|---------------------|
| Resposta: `Blueprint "BP_MCP_Test" compilado com sucesso.` |
| **Visual:** Abrir BP_MCP_Test → não deve ter erros de compilação (ícone verde ✓) |

**Resultado:** `[  ] PASSOU  [  ] FALHOU`  
**Detalhe:** ___________________________________

---

### Teste 3.4 — Spawnar no Level

**Objetivo:** Spawnar o BP criado no mapa atual.

```
unreal_mcp({ action: "spawn_actor", blueprint: "BP_MCP_Test", name: "MCP_Test_Actor", location: [500, 500, 200] })
```

| Critério de Sucesso |
|---------------------|
| Resposta contém `Actor "MCP_Test_Actor" spawnado` |
| **Visual:** Um cubo branco aparece nas coordenadas (500, 500, 200) no viewport |

**Resultado:** `[  ] PASSOU  [  ] FALHOU`  
**Detalhe:** ___________________________________

---

## Fase 4: Propriedades (física, cor)

> **Só prossiga se o teste 3.4 passou.**

### Teste 4.1 — Definir Cor

**Objetivo:** Mudar a cor do mesh do BP.

```
unreal_mcp({ action: "set_color", blueprint: "BP_MCP_Test", component: "TestMesh", color: [0.2, 0.6, 1.0, 1.0] })
```

| Critério de Sucesso |
|---------------------|
| Resposta contém `Cor definida` |
| **Visual:** O cubo no viewport muda para azul |

**Resultado:** `[  ] PASSOU  [  ] FALHOU`  
**Detalhe:** ___________________________________

---

### Teste 4.2 — Configurar Física

**Objetivo:** Ativar simulação de física no componente.

```
unreal_mcp({ action: "set_physics", blueprint: "BP_MCP_Test", component: "TestMesh", mass: 5, simulate_physics: true })
```

| Critério de Sucesso |
|---------------------|
| Resposta contém `Fisica configurada` |
| **Visual:** Ao clicar Play (PIE), o cubo azul cai com gravidade |

**Resultado:** `[  ] PASSOU  [  ] FALHOU`  
**Detalhe:** ___________________________________

---

## Fase 5: Construção Procedural

> **Só prossiga se a Fase 4 passou.**

### Teste 5.1 — Criar Parede

**Objetivo:** Construir uma parede com cubos no level.

```
unreal_mcp({ action: "create_wall", length: 5, height: 3, location: [2000, 2000, 0], orientation: "x" })
```

| Critério de Sucesso |
|---------------------|
| Resposta contém `Parede construida` |
| **Visual:** Parede de 5x3 cubos alinhados aparece em (2000, 2000) |

**Resultado:** `[  ] PASSOU  [  ] FALHOU`  
**Detalhe:** ___________________________________

---

## Fase 6: Integração Python (unreal_ops)

> **Só prossiga se a Fase 5 passou.**

### Teste 6.1 — Python + MCP juntos

**Objetivo:** Usar `unreal_ops` (Python) para interagir com algo criado pelo `unreal_mcp`. Testar se os dois canais coexistem sem conflito.

```
unreal_ops({ action: "python", script: "import unreal\nactors = unreal.EditorLevelLibrary.get_all_level_actors()\ncount = 0\nfor a in actors:\n    if 'MCP_Test' in a.get_actor_label() or 'WallBlock' in a.get_actor_label():\n        unreal.log(f'ENCONTRADO: {a.get_actor_label()}')\n        count += 1\nunreal.log(f'Total MCP actors: {count}')" })
```

| Critério de Sucesso |
|---------------------|
| Resposta: `Resultado:` (script executou sem erro) |
| **Visual:** Output Log do UE5 mostra `ENCONTRADO: MCP_Test_Actor` e `ENCONTRADO: WallBlock_*` |

**Resultado:** `[  ] PASSOU  [  ] FALHOU`  
**Detalhe:** ___________________________________

---

## Resumo Final

| Fase | Teste | Status | Observação |
|------|-------|--------|------------|
| 1.1 | Ping TCP (unreal_mcp check) | [ ] OK [ ] FAIL | |
| 1.2 | Ping HTTP (unreal_ops check) | [ ] OK [ ] FAIL | |
| 2.1 | Listar Atores | [ ] OK [ ] FAIL | |
| 2.2 | Buscar Ator (ALS) | [ ] OK [ ] FAIL | |
| 3.1 | Criar Blueprint | [ ] OK [ ] FAIL | |
| 3.2 | Adicionar Componente | [ ] OK [ ] FAIL | |
| 3.3 | Compilar Blueprint | [ ] OK [ ] FAIL | |
| 3.4 | Spawnar no Level | [ ] OK [ ] FAIL | |
| 4.1 | Definir Cor | [ ] OK [ ] FAIL | |
| 4.2 | Configurar Física | [ ] OK [ ] FAIL | |
| 5.1 | Criar Parede Procedural | [ ] OK [ ] FAIL | |
| 6.1 | Python + MCP Juntos | [ ] OK [ ] FAIL | |

**Total:** ___ / 12 passaram

### Avaliação Final

- **10+/12** → Integração confiável. Prosseguir para uso em produção (tocha, etc.)
- **7-9/12** → Funcional mas precisa de ajustes. Investigar falhas pontuais.
- **< 7/12** → Problemas na compilação do plugin ou incompatibilidade. Revisar.
