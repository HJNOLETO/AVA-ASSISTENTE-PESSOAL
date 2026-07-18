# UNREALMCP Improvement Guide — v2.0

**Objetivo**: Guia para a IA (e desenvolvedores) refatorar e evoluir o plugin **EpicUnrealMCP** seguindo as melhores práticas da Epic Games.

---

## 1. Alinhamento com Epic Games Standards

### 1.1 Coding Standard (Obrigatório)
- **Epic C++ Coding Standard** (2025/2026)
- Nomenclatura: `F` para structs, `U` para UObjects, `A` para Actors, `E` para enums
- Variáveis: CamelCase (`MyVariable`)
- Funções: CamelCase, verbos no início (`HandleCommand`, `CreateEventNode`)
- Includes: **IWYU** (Include What You Use) — minimizar includes
- Forward declarations sempre que possível
- `const` correctness rigorosa
- Evitar `LogTemp` → criar `DEFINE_LOG_CATEGORY(LogMCP)`

### 1.2 Inclusive Language
- Usar `they/them` para pessoas hipotéticas
- Evitar termos como `master/slave`, `blacklist/whitelist`, `dummy`

---

## 2. Arquitetura Recomendada

### Estrutura de Pastas
```
Source/UnrealMCP/
├── Public/
│   └── Commands/
│       └── BlueprintGraph/
│           ├── NodeManager.h
│           ├── BPConnector.h
│           ├── EventManager.h
│           └── InterfaceManager.h
├── Private/
│   ├── Commands/
│   │   ├── BlueprintGraph/
│   │   │   ├── NodeManager.cpp
│   │   │   ├── BPConnector.cpp
│   │   │   ├── EventManager.cpp
│   │   │   └── InterfaceManager.cpp
│   │   ├── Building/
│   │   └── Editor/
│   └── Utils/
```

### Separação de Responsabilidades
- **Commands**: apenas roteamento
- **Managers**: lógica de negócio
- **Utils**: funções puras e reutilizáveis
- **Tests**: pasta separada (futuro)

---

## 3. Melhorias Técnicas Obrigatórias

### 3.1 Performance & Robustez
- Cache de Blueprints e Assets
- Reduzir buscas lineares (`GetAllActorsOfClass`)
- Usar `TMap`/`TSet` quando aplicável
- Evitar `Sleep()` em código de editor (usar latentes ou delegates)
- Validar todos os ponteiros antes de usar (`if (!Target) return Error`)

### 3.2 Error Handling
- Usar `CreateErrorResponse` padronizado
- Incluir `suggestion` e `context` nos erros quando possível
- Usar `ensureMsgf()` em situações críticas

### 3.3 Logging
```cpp
DEFINE_LOG_CATEGORY(LogMCP);
UE_LOG(LogMCP, Verbose, TEXT("..."));
UE_LOG(LogMCP, Display, TEXT("..."));
UE_LOG(LogMCP, Warning, TEXT("..."));
UE_LOG(LogMCP, Error, TEXT("..."));
```

---

## 4. Blueprint Manipulation Best Practices

### 4.1 Comandos Essenciais (Prioridade Alta)
- `add_event_node` → suportar todos os eventos comuns (BeginPlay, Tick, OnOverlap)
- `add_blueprint_node` → aceitar `node_class` + properties
- `connect_nodes` → suportar pins por nome e por índice
- `create_variable` → suportar todos os tipos + exposições (EditAnywhere, BlueprintReadWrite)
- `apply_material_to_blueprint` / `set_component_static_mesh`
- `add_blueprint_interface` → adicionar interface a Blueprint
- `add_get_node` → criar nó Get de variável no grafo
- `call_function_on_object` → chamar função em objeto referenciado

### 4.2 Melhorias Recomendadas
- Sistema de Node Templates (pré-configurados)
- Suporte a Macro Libraries
- Suporte a Interfaces com implementação automática de funções
- Undo/Redo automático via `FScopedTransaction`

---

## 5. Melhorias Gerais

### 5.1 Documentação
- Todo arquivo deve ter header com descrição, autor e data
- Doxygen-style comments em funções públicas
- Exemplos de JSON em comentários

### 5.2 Segurança / Estabilidade
- Proteção contra Blueprint não compilado antes de spawn
- Validação de paths de assets
- Limites de recursão em graph analysis

### 5.3 Testabilidade
- Criar MCPTestSuite com comandos de teste
- Funções puras sempre que possível

### 5.4 Extensibilidade
- Sistema de Command Registry (registrar comandos dinamicamente)
- Suporte a Custom Nodes via Reflection
- API de Events para IA receber callbacks

---

## 6. Checklist para a IA ao Refatorar

- [ ] Segue Epic Coding Standard?
- [ ] Usa IWYU?
- [ ] Tem `const` correto?
- [ ] Logging com categoria própria?
- [ ] Error handling robusto?
- [ ] Documentação clara?
- [ ] Delegação clara para Managers?
- [ ] Evita duplicação de código?
- [ ] Performance otimizada?

---

## 7. Próximos Módulos Recomendados

- Animation Blueprint Support
- Material Editor Commands
- World Partition / Level Streaming
- Niagara System Integration
- AI Behavior Tree Commands
- UI (UMG) Commands



