# OPENCODE — Ideia Exclusiva (Memoria Viva do AVA)

## Visao
Criar uma memoria viva, auditavel e autonoma para o AVA: o sistema lembra do que importa, explica por que lembra, esquece com criterio e usa esse historico para executar melhor tarefas futuras.

## Conceito Central
Memoria em 3 camadas, com governanca explicita:

1. Curta duracao (sessao atual)
- Foco: manter contexto imediato sem inflar tokens.
- Politica: compactacao automatica por janela de mensagens.
- Beneficio: respostas mais consistentes no fluxo corrente.

2. Memoria semantica (perfil e preferencias)
- Foco: fatos estaveis do usuario (preferencias, padroes, objetivos).
- Politica: score de utilidade + TTL diferenciado por tipo.
- Beneficio: personalizacao real entre canais (CLI/Web/Telegram).

3. Memoria operacional (aprendizados do proprio AVA)
- Foco: falhas recorrentes, workarounds, sucesso por estrategia/modelo.
- Politica: append-only com sumarios periodicos.
- Beneficio: autocorrecao progressiva e menos repeticao de erro.

## Diferencial "Espetacular"
"Memoria Explicavel": ao perguntar "o que voce lembra de mim?", o AVA retorna:
- item lembrado
- origem (canal/ferramenta)
- data da captura
- confianca/relevancia
- acao rapida: manter, atualizar, remover

Isso transforma memoria de "caixa-preta" em recurso confiavel e controlavel.

## Implementacoes de Alto Impacto
- Corrigir roteamento de `buscar_na_memoria` no motor unificado para eliminar quebra de integracao.
- Adicionar `memory_ops` com acoes padronizadas: `save`, `search`, `list`, `delete`, `explain`.
- Criar politica de retencao por classe: util, sensivel, descartavel, operacional.
- Habilitar comandos de higiene: "limpar memorias antigas", "revisar memorias de baixa confianca".
- Registrar trilha de auditoria por memoria: create/read/update/delete (com motivo).

## Guardrails Necessarios
- Bloqueio de dados sensiveis por default (integrado ao `memoryGuard`).
- Confirmacao explicita para persistencia sensivel.
- Opcao de "nao memorizar esta conversa" por sessao.
- Expurgo automatico de itens vencidos.

## Compatibilidade com Hardware Atual (16GB)
- Embeddings opcionais com fallback para keyword-only.
- Compactacao agressiva de contexto antes de chamadas LLM.
- Limites de tamanho por item de memoria e por lote de consulta.
- Cache local de consultas frequentes de memoria.

## Criterios de Sucesso
- Recuperar corretamente preferencias gravadas em rodada anterior.
- Reduzir reincidencia de erros operacionais repetidos.
- Manter latencia de memoria sob controle (P95 alvo < 800ms).
- Zero persistencia de segredo sem confirmacao.

## Roteiro Proposto (nao cronologico)
- Integracao de tool mapping de memoria no unified engine.
- Interface de memoria explicavel para usuario final.
- Politica de ciclo de vida (TTL, arquivamento, limpeza).
- Painel de saude da memoria (volume, taxa de acerto, expiracoes).
- Autoajuste por aprendizado operacional.

## Observacao de Propriedade
Este documento representa uma proposta autoral de evolucao tecnica do AVA, preservada como "ideia exclusiva" para uso estrategico no projeto.
