# DeepSeek V4 Pro — Etapa 4: validação, testes e entrega do UnrealMCP

Pré-requisito: Etapas 1–3 concluídas. Esta etapa mede confiabilidade; não é uma oportunidade para ampliar escopo sem testes.

## Objetivo

Criar um mecanismo de prova de que a IA não apenas editou assets, mas entregou um projeto compilável e testável.

## Implementar

1. `validate_project` (leitura): estado de módulos, assets ausentes conhecidos, mapas configurados, plugins/dependências requeridos e resumo de avisos relevantes.
2. `compile_blueprint` e `compile_project_target` com saída estruturada: sucesso, duração, erros/avisos normalizados e caminhos/nomes afetados.
3. `run_map_check` para um nível escolhido, retornando itens estruturados (`severity`, `actor`, `component`, `message`, sugestão). Não tratar avisos como sucesso silencioso.
4. Modo de teste em editor/PIE somente se for possível controlar com segurança. Deve suportar iniciar, verificar estado e encerrar; nunca deixar PIE rodando em erro.
5. `create_test_report`: gerar Markdown/JSON com comandos executados, respostas, diagnósticos, mudanças, artefatos e resultado final.
6. Testes automatizados do protocolo e testes de integração mínimos para comandos críticos. Se automação UE não for viável, fornecer roteiro manual reproduzível e marcar a limitação.

## Matriz obrigatória de verificação

| Caso | Resultado esperado |
|---|---|
| ping e health | resposta estruturada e servidor disponível |
| JSON inválido | erro estruturado; servidor continua atendendo |
| nó/conexão incompatível | sem alteração parcial |
| Blueprint com nó órfão | diagnóstico claro |
| chamada em CurrentWeapon nulo | fluxo protegido por Is Valid |
| Blueprint modificado | compila e apresenta diagnóstico |
| map check | erros e avisos atribuídos a ator/componente |
| cliente desconecta | cliente seguinte funciona |

## Critérios de aceite final

- Build do `ProjetoGTAEditor Win64 Development` concluído.
- Todos os casos da matriz possuem evidência (log, resposta JSON e, quando aplicável, relatório gerado).
- O plugin não afirma ter criado gameplay funcional sem teste/diagnóstico correspondente.
- Existe um guia curto para uma IA cliente: ordem recomendada `planejar → inspecionar → dry-run → executar → compilar → diagnosticar → testar → relatar`.
- Todas as limitações remanescentes são explícitas e priorizadas.

## Entrega exigida

Entregar `RELATORIO_FINAL_UNREALMCP.md`, mais arquivos de testes/roteiros. Indicar com honestidade os itens testados, não testados e bloqueados. Não alterar assets de produção para forçar um resultado verde.
