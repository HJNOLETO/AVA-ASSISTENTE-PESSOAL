# Registro de Ideias e Debates - AVA

Data de consolidacao: 2026-05-11

## 1) Direcao do projeto

- Evoluir o AVA para um assistente operacional de alta autonomia (estilo "JARVIS"), com continuidade fluida e foco em conclusao de objetivo.
- Tornar o comportamento proativo uma capacidade global do sistema (CLI, Web, Telegram), nao apenas local de um comando.
- Consolidar adaptacao ao hardware local para estabilidade real em cenarios com LLM local.

## 2) Proatividade como principio global

Debate:
- O AVA nao deve parar no primeiro passo nem pedir confirmacao desnecessaria.
- Deve executar proximos passos tecnicos obvios com seguranca, especialmente em diagnosticos.

Diretriz consolidada:
- Fluxo padrao: objetivo -> sinais -> causa provavel -> verificacao complementar -> mitigacao segura -> validacao -> proximos passos.
- Interromper com pergunta apenas em bloqueios reais (ambiguidade critica, credencial, risco destrutivo/producao).

Implementado:
- Modo proativo em prompt/orquestracao.
- Auto-provocacao no loop quando resposta vem curta/incompleta.
- Perfis `safe`, `balanced`, `proactive-max`.

Pendencias:
- Telemetria comparativa por modo para medir taxa de conclusao e qualidade.

## 3) Timeout/abort e diferenca local vs cloud

Debate:
- Timeout e abort sao sensiveis e devem distinguir LLM local e cloud.
- Em hardware limitado, modelos locais podem exigir janela de espera grande.

Diretriz consolidada:
- Politica adaptativa por provedor/modelo/tier de hardware.
- Guardas de abort para evitar travamento infinito.

Implementado:
- Politica de runtime adaptativo centralizada (`server/runtime/adaptive-policy.ts`).
- Watchdog/abort no CLI e no agent loop.
- Distincao local/cloud e ajuste por tamanho de modelo local (quando inferivel pelo nome).

Pendencias:
- Preflight robusto de modelo local: instalado, suporte a tools, memoria minima recomendada.
- Ajuste fino por historico real de timeout (auto tuning).

## 4) Testes reais com LLM local

Debate:
- Testes criticos devem usar modelos locais para validar condicoes reais de operacao.

Resultados observados:
- Instabilidade/timeout com pouca memoria livre e modelos no limite.
- Alguns modelos locais nao suportam tool-calling no fluxo atual.
- Necessidade de roteamento por compatibilidade do modelo.

Pendencias:
- Roteador de compatibilidade (tools vs texto estruturado).
- Politica de fallback local mais inteligente em cenarios de memoria pressionada.

## 5) Multicanal juridico (CLI/Web/Telegram)

Objetivo de produto discutido:
- Receber dados de cliente e redigir pecas processuais (trabalhista/previdenciario) em qualquer canal.

Visao consolidada:
- Motor juridico multicanal com comportamento consistente.
- Saida com justificativa tecnica, checklist de aceite e validacao minima.

Pendencias de implementacao juridica:
- Biblioteca de templates versionados por tipo de peca.
- Motor de parametrizacao de campos variaveis por cliente.
- Reuso de estrategia de peca para casos similares com troca segura de dados.
- Etapa obrigatoria de revisao juridica antes da versao final protocolavel.

## 6) Aprendizado: global vs privado

Debate:
- Preferencias gerais devem ser globais, mas dados sensiveis e contexto pessoal nao podem se misturar entre usuarios.

Diretriz consolidada:
- "Globalizar comportamento, nao dados pessoais".

Arquitetura sugerida:
- Memoria global: padroes de resposta e fluxos de sucesso.
- Memoria por usuario: perfil, preferencias, nivel de linguagem.
- Memoria sensivel por caso/sessao: isolada, com acesso estrito.

Pendencias:
- Esquema formal de memoria por camada e governanca de acesso.

## 7) Perfis de usuario e modo infantil

Debate:
- AVA deve reconhecer perfil do usuario e adaptar tom, profundidade e permissoes.
- Caso infantil exige bloqueio de conteudo sensivel e operacoes de risco.

Diretriz consolidada:
- Perfis: `child`, `standard`, `professional`, `admin`.
- Troca de perfil com autenticacao leve (PIN, dispositivo confiavel, etc.).

Pendencias:
- Matriz de permissoes por perfil.
- Prompt/politica dinamica por perfil.

## 8) Webcam e evolucao para seguranca patrimonial

Debate:
- Webcam como capacidade futura para seguranca patrimonial e automacao contextual.

Diretriz consolidada (fases):
- Fase 1: deteccao de presenca/movimento/objetos sem biometria nominativa.
- Fase 2: reconhecimento opt-in com consentimento e fallback seguro.
- Fase 3: automacoes por evento/cena e resposta operacional.

Fundacao tecnica sugerida:
- `security_events`, `security_policies`, `security_actions`.
- Processamento local por padrao, retencao minima de midia e auditoria de eventos.

Pendencias:
- Desenho de APIs/eventos para integrar camera ao motor unificado.

## 9) LGPD, direito de imagem e dados juridicos

Debate:
- Operacao juridica e seguranca patrimonial exigem uso de dados pessoais/sensiveis em cenarios legitimos.

Diretriz consolidada:
- Nao tratar como "sem restricao universal".
- Tratar como "acesso amplo com base legal, finalidade e controle".

Praticas recomendadas:
- Segregacao por cliente/caso.
- Auditoria e rastreabilidade de acesso.
- Criptografia e perfis de autorizacao.
- Retencao e descarte por politica.

## 10) Backlog priorizado (retomada futura)

Prioridade alta:
1. Preflight de LLM local (instalacao, suporte a tools, memoria recomendada).
2. Roteador de compatibilidade de modelo (tools/full, tools/limitado, texto estruturado).
3. Telemetria de timeout/abort por canal/modelo para autoajuste.
4. Matriz de perfis (`child`/`professional`/etc.) com guardrails por risco.

Prioridade media:
5. Biblioteca de templates juridicos versionados (trabalhista e previdenciario).
6. Motor de parametrizacao de pecas por cliente e checklist de aceite.
7. Memoria em camadas (global, usuario, caso sensivel) com governanca.

Prioridade estrategica:
8. Fundacao de seguranca patrimonial por eventos/politicas/acoes.
9. Roadmap webcam com privacy-by-design e operacao local-first.

## 11) Criterios de sucesso (macro)

- AVA conclui tarefas com menos intervencao manual e mais evidencias de validacao.
- Estabilidade com LLM local em hardware limitado sem travas prolongadas.
- Fluxo juridico reutilizavel por tipo de peca, mudando dados de cliente com seguranca.
- Governanca de dados robusta, sem perda de utilidade operacional.
