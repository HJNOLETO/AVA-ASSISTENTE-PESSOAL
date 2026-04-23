# Diretrizes para Análise e Correção: CLI Docker do Assistente AVA

Você está recebendo a tarefa de analisar, auditar e corrigir a implementação do **CLI do Assistente AVA**, que foi projetado para rodar isolado em um contêiner Docker. 

Abaixo estão os parâmetros da arquitetura atual, os problemas relatados e o passo a passo que você deve seguir para efetuar as correções necessárias.

---

## 1. Contexto e Estrutura do Sistema AVA

O ecossistema do AVA está dividido em três diretórios principais na máquina do usuário. Você deve levar essa estrutura em consideração ao montar os volumes e definir o que entra ou não no Docker:

*   **Sistema AVA (Código-fonte e aplicação principal):**
    `C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main`
*   **Dados do AVA (Informações, logs, documentos gerados):**
    `C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main-dados`
*   **Backups do AVA:**
    `C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main-backup`

---

## 2. Problemas Relatados na Implementação Atual

1.  **Excesso de Arquivos Desnecessários (Inchaço da Imagem):** Ao longo de conversas e uso, foram criados diversos arquivos inócuos que não são necessários para o funcionamento principal. Precisamos ignorá-los para a criação da imagem Docker do CLI.
2.  **Falha no CLI e Confinamento:**
    * A imagem do CLI que foi criada parece não estar funcionando corretamente.
    * Há a necessidade de validar se aa execuções do CLI estão realmente confinadas ao Docker.

---

## 3. Plano de Ação para Correção (Etapas da IA)

Para resolver essas questões e alinhar a aplicação aos padrões projetados, realize os seguintes passos e solicite os arquivos conforme necessário.

### ETAPA 1: Otimização da Imagem CLI e `.dockerignore`
*   **Tarefa:** Analise a estrutura do `ava-assistant-v3-main` e foque nas regras de exclusão de build.
*   **Ação Mínima:** Corrigir ou criar o `.dockerignore`. Garantir que conversas, dados irrelevantes e os diretórios `-dados` e `-backups` estejam totalmente de fora da cópia física da imagem, limitando-a unicamente aos scripts essenciais.

### ETAPA 2: Correção do `Dockerfile`
*   **Tarefa:** Modificar a receita de montagem da imagem docker para o CLI.
*   **Ação Mínima:** Solicitar ao usuário a exibição do `Dockerfile` atual. Refatorar para limpar cópias desnecessárias e assegurar que as Entrypoints ou CMDs chamem corretamente o processo CLI, garantindo que o programa "nasce e morre" ou aguarda comandos corretamente dentro de um conatiner, não no Windows Host.

### ETAPA 3: Isolamento e Volume Binding (Mapeamento Confidencial)
*   **Tarefa:** Verificar as configurações e comandos de inicialização, que provavelmente residem no `docker-compose.yml` ou em scripts de terminal.
*   **Ação Mínima:** Para que o CLI opere dados dinâmicos *sem* engessá-los na imagem, crie ou altere os mapeamentos de volumes. Assuma que os caminhos principais de Dados e Backup do host (mencionados na seção 1) deverão ser mapeados (`bind mount`) como volumes persistentes para que os microsserviços processem dentro do Docker as informações hospedadas fora dele.

### ETAPA 4: Validação Funcional do Arquivo Principal do CLI
*   **Tarefa:** Validar se a lógica do CLI opera adequadamente de forma independente como um "companion" para o AVA Principal.
*   **Instrução de Auditoria:** Puxar logs ou trechos de execução da função inicial do CLI para atestar que as funções do AVA CLI funcionam. Você deve garantir que a versão corrigida contemple as ferramentas para operação do Docker sem que isso conflite de portas com o sistema AVA web.

---

> **COMANDO INICIAL (PROMPT BASE) PARA INICIAR:**
> Olá. Por favor, exiba-me o conteúdo do seu `Dockerfile` atual, do arquivo `.dockerignore` e do arquivo `docker-compose.yml` (se existir). Também me mostre como você está executando a inicialização do CLI para que eu aplique os mapeamentos em cima da pasta `-dados` corretamente.
