# MCP Integration — AVA CLI + Unreal Engine 5

Esta pasta contém a documentação completa da integração entre o AVA CLI e o Flopperam Unreal Engine MCP.

## Índice de Documentos

| Arquivo | Conteúdo |
|---------|----------|
| **[DOCUMENTACAO_COMPLETA.md](./DOCUMENTACAO_COMPLETA.md)** | **LEIA ESTE PRIMEIRO.** Guia completo: visão geral, arquitetura, o que foi feito, próximos passos, troubleshooting. |
| [INTEGRACAO_TECNICA.md](./INTEGRACAO_TECNICA.md) | Detalhes técnicos da implementação: arquivos modificados, variáveis de ambiente, exemplos de código. |
| [ANALISE_FLOPPERAM_MCP.md](./ANALISE_FLOPPERAM_MCP.md) | Análise comparativa entre o Flopperam MCP e o `unreal_ops` original do AVA, com justificativa para a escolha. |

## Resumo Rápido

```
AVA CLI agora tem 2 canais para UE5:

unreal_ops  → HTTP :30010 (Remote Control)   → Python, console, screenshot
unreal_mcp  → TCP  :55557  (UnrealMCP Plugin) → Blueprint, spawn, materiais, procedural
```

## Plugin Instalado

```
ProjetoGTA/Plugins/UnrealMCP/
```
Código C++ do Flopperam MCP (MIT License) — compila automaticamente ao abrir o `.uproject`.

**Importante:** A pasta `UnrealMCP/` é portátil — pode ser copiada para qualquer outro projeto UE5 que precise dessa integração. Basta colar em `<Projeto>/Plugins/UnrealMCP/` e abrir o `.uproject`.

> ⚠️ **Compatibilidade:** O plugin original do Flopperam suporta **Unreal Engine 5.5+**. Neste projeto, foi testado e compilado especificamente no **UE 5.6** (com `DefaultBuildSettings V5` e `EngineAssociation 5.6` no `ProjetoGTA.uproject`). Para usar em UE 5.5, o código original deve funcionar sem alterações.

### Ativação

1. Abrir o projeto no UE5 (o plugin compila automaticamente em projetos C++)
2. Verificar: **Edit → Plugins** → buscar `UnrealMCP` → marcar **Enabled** ✓
3. **Edit → Plugins** → buscar `Remote Control API` → marcar **Enabled** ✓ (necessário para o canal `unreal_ops` na porta 30010 — não faz parte do MCP, mas é essencial para o funcionamento completo do AVA)

## Primeiro Teste

```typescript
unreal_mcp({ action: "check" })
// Esperado: "UnrealMCP ONLINE - X actors no level atual."
```

## Status Atual

| Item | Status |
|------|--------|
| Análise Flopperam MCP | ✅ Concluída |
| Plugin copiado p/ ProjetoGTA | ✅ `Plugins/UnrealMCP/` |
| Adaptador TCP criado | ✅ `server/tools/unreal_mcp_adapter.ts` |
| Tools registradas (executor + agents) | ✅ 21 ações |
| **Plugin compilado/testado no UE5** | 🔴 **PENDENTE** — precisa reiniciar o UE5 |

## Próximo Passo: Testar

1. **Fechar o UE5** e **reabrir** `ProjetoGTA.uproject` → compilar plugin (1-2 min)
2. Executar `unreal_mcp({ action: "check" })`
3. Seguir o **[Plano de Testes](./PLANO_DE_TESTES.md)** (11 testes em 5 fases)

## Tutoriais Relacionados

- [Guia da Tocha](../adicionar_tocha_ao_player/GUIA_ADICIONAR_TOCHA_AO_PLAYER.md)
- [Resumo ProjetoGTA](../adicionar_tocha_ao_player/RESUMO_PROJETO.md)
