# Estrutura Básica do AVA CLI Isolado em Docker

**Objetivo:** Criar o esqueleto do nosso novo componente `AVA CLI`, garantindo que toda a sua execução aconteça dentro de um Contêiner Docker estritamente isolado (Sandboxing defensivo). Esta será a base onde o Agente operará poderes progressivos de terminal com a segurança máxima de que malwares acidentais não alcançarão o Windows Host.

---

## Passo a Passo para a IA Executora

Para estruturar o AVA CLI seguindo o padrão de ouro do projeto, siga rigorosamente as etapas de documentação e código a seguir.

### 1. Criar a Estrutura de Pastas e Arquivos do CLI
Crie uma pasta dedicada para o ambiente Console. Isolá-lo do servidor `web` organiza o código.
*   **Ação:** Crie o diretório `cli/` na raiz do projeto `ava-assistant-v3-main`.
*   **Crie o arquivo principal:** `cli/index.ts`.
*   **Conteúdo Inicial:** Este será o *entrypoint*. Implemente o *boilerplate* recebendo os comandos. Algo como:
    ```typescript
    import { Command } from "commander"; // Utilizar biblioteca limpa de argumentos
    import { invokeLLM } from "../server/_core/llm";
    // imports do DB se necessário

    const program = new Command();

    program
      .name("ava")
      .description("AVA Assistant - Interface Direta de Linha de Comando")
      .version("1.0.0");

    // Comando Hello World inicial
    program
      .command("ask")
      .description("Envia uma pergunta rápida e direta para o AVA no terminal")
      .argument("<query>", "A pergunta a ser feita")
      .action(async (query) => {
        console.log(`[AVA] Pensando sobre: "${query}"...`);
        try {
          const response = await invokeLLM({
             messages: [{ role: "user", content: query }],
             provider: "ollama" // Assuma a rota local para segurança e gratuidade inicial
          });
          const text = response.choices?.[0]?.message?.content || "";
          console.log(`\n[AVA Responde]:\n${text}\n`);
        } catch (error) {
          console.error(`\n[Erro do Sistema]: ${(error as Error).message}\n`);
        }
      });

    program.parse(process.argv);
    ```

### 2. Criar a Infraestrutura do Contêiner Isolado (Docker Sandbox)
Para garantir o **Pilar 1 (Sandboxing) do Design de Segurança**, criaremos um manipulador Docker específico para esse terminal e evitaremos usar `root`.
*   **Ação:** Crie um arquivo chamado `cli.Dockerfile` na raiz do projeto.
*   **Configuração do Dockerfile:**
    - Use `node:20-alpine` ou o equivalente do servidor backend.
    - Crie um diretório de trabalho (`/app`).
    - Copie o `package.json` e o ecossistema `pnpm`. Instale as dependências.
    - Copie a pasta local de código para dentro.
    - **CRÍTICO:** Troque o perfil administrativo. Adicione a linha `USER node` ao final do `Dockerfile` para que a aplicação e a CLI não tenham o poder total de sistema dentro do contêiner.

### 3. Integração ao `docker-compose.yml` (Arquitetura)
Se já usam um `docker-compose`, crie o serviço dedicado ao CLI para facilitar montagens de Volume compartilhadas (necessário pois o banco de dados `sqlite_v2.db` e logs precisam fluir entre a sua máquina física, a aba Web e a CLI da memória).
*   **Ação:** Adicionar o bloco ao compose (ou criar um compose dedicado ao CLI, como `docker-compose.cli.yml`).
*   **Diretriz de Compartilhamento Lógico:** Mapeie estritamente os diretórios de código e a pasta do Banco de Dados SQLite (`./sqlite_v2.db:/app/sqlite_v2.db`), garantindo sincronia perfeita sem quebrar o banco de estado. 

### 4. Criando os Hooks de Chamada Rápida (Developer Exeprience)
Para ninguém precisar digitar `docker run ...` que é muito longo e tira a imersão de terminal simples:
*   **Ação:** Crie um arquivo `ask-ava.bat` e um `.sh` na raiz.
*   **Conteúdo do BAT:**
    ```cmd
    @echo off
    docker-compose -f docker-compose.cli.yml run --rm ava-cli npx tsx cli/index.ts ask "%*"
    ```
    Isso permitirá que o humano apenas abra o power shell e digite `ask-ava.bat "Quais recursos locais eu possuo?"` ou rode a imagem iterativa, entrando no docker efêmero de cabeça limpa.

### 5. Finalização
A Executora (IA) precisa adicionar a depedência `"commander"` caso não exista, rodar os compiladores Typescript e testar se o Build no Docker funciona sem estourar o Terminal local.
Ao terminar estas ações, **não evolua nem acrescente Tools extras**. Precisamos apenas da Base. Avise ao usuário final que tudo está montado, de modo que a Arquiteta Master de Agentes (Eu) proceda a auditoria e análise de segurança desse CLI inicial embutido.
