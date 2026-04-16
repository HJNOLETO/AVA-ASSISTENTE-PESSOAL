# Fluxo Híbrido RAG (Google Colab → Local SQLite)

Este documento documenta o modelo de engenharia de dados estabelecido para lidar com documentações massivas (como Vade Mecum, Doutrinas, Leis) sem sobrecarregar a máquina local do AVA Assistant.

---

## 🎯 Visão Geral
Em vez de depender exclusivamente do processamento `rag:memory:pipeline` na máquina local, o fluxo "Massivo" tira proveito das GPUs em nuvem do Google Colab para as etapas mais pesadas.

O funil se dá na seguinte ordem:
1. **Nuvem (Colab):** Corta os textos e gera as matrizes matemáticas (Embeddings).
2. **Transferência (Drive):** O Colab salva JSONs puros sem dependência local.
3. **Validação (Local):** Os dados passam por um controle anti-falhas.
4. **Injeção (Local):** Os vetores são atirados de forma agressiva e direta ao banco de dados SQLite.
5. **Auditoria (Local):** O sistema varre as partições gerando Relatórios em Excel organizando os assuntos.

---

## 🛠️ Passo a Passo e Comandos Envolvidos

### Passo 1: Processamento no Google Colab (Extração e Vetores)
- **Onde acontece:** Notebook `Pipeline_Extrator_Vade_Mecum.ipynb`
- **Ação:** O script processa grandes PDFs/MDs, cria os Chunks (fragmentos) através do Ollama (ou de um serviço embutido) e empacota tudo.
- **Resultado Esperado:** Geração de um arquivo finalizado de extração, estruturado e pronto para banco. Exemplo: `vade_mecum_memories.json`.

---

### Passo 2: Verificação de Integridade Local (✅ Já Concluído)
Ao baixar os arquivos `.json` do Drive, arquivos gigantes podem estar levemente corrompidos se a conexão cair momentaneamente. Antes de mexer no banco, precisamos testar a saúde do dado.
- **Comando Real Disponível:** `pnpm rag:healthcheck`
- **O que faz:** Lê a pasta local onde você baixou os JSONs e testa a dimensão do Vetor (ex: garante que tenha as 768 / 1536 dimensões numéricas esperadas) e aspas de JSON válidas.
- **Resultado Esperado:** Alerta visual no terminal garantindo: `[OK] Vetores íntegros`.

---

### Passo 3: Injeção Rápida Direta no DB (✅ Já Concluído)
Tendo a garantia de que o JSON é válido, isolaremos o pipeline demorado.
- **Comando Real Disponível:** `pnpm rag:import-direct`
- **Regra Importante:** O arquivo base (`.md` ou `.json`) originário **NÃO** deve ser salvo dentro da pasta oficial monitorada localmente (`Drive_Sync/conhecimentos-sobre-AVA`), para não causar loop reverso. Ele deve ficar em uma pasta separada, ex: `Memoria_Colab_Pendentes/`.
- **O que faz:** Lê o JSON e injeta diretamente na tabela `memoryEntries` usando o `addMemoryEntry()`.

---

### Passo 4: O Auditor e Relator por Assuntos (✅ Já Concluído)
Com os dados de toda a Inteligência da AVA já inseridos, rodamos a auditoria.
- **Comando Real Disponível:** `pnpm rag:audit`
- **O que faz:** Script dinâmico (`scripts/audit-knowledge.ts`) que mapeia todos os arquivos em disco que fazem parte do escopo (taxonomia), lê o banco e checa se há duplicatas de Hashes de arquivos.
- **Resultado Esperado:** Exportação imediata do arquivo `Relatorio_Memoria_AVA.xlsx`. Ele detalha em colunas a divisão de assuntos: Nível 1 (Ex: Direito), Nível 2 (Ex: OAB), tamanho, Chunks processados e Riscos Verdes/Amarelos/Vermelhos de lixo duplicado.

---

## 💡 Por que este formato é mais poderoso e veloz?
Ao pular o uso do arquivo de controle estrito `manifest.json` da sua máquina para esse lote específico do Colab, você se livra da sobrecarga da CPU local (sem gargalos). Você injeta arquivos de forma assíncrona, transformando sua máquina em mero recebedor inteligente (Receiver/Auditor) enquanto o Google lida com o peso brutal (Producer).
