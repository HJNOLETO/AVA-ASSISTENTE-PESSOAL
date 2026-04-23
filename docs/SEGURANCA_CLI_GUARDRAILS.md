# Arquitetura de Defesa e Segurança para IA Agêntica (AVA CLI)

Quando evoluímos uma Inteligência Artificial do estágio de "Chatbot" para o estágio de "Agente Operacional" (com capacidade de acionar o Terminal e navegar na Web via CLI), expomos a máquina host a vetores de ataque complexos, incluindo **Prompt Injections**, execução de artefatos maliciosos (como `.vbs` ou scripts PowerShell de terceiros) e SQL Injections por alucinação.

Para mitigar todos estes riscos sem anular a autonomia do assistente, a AVA deverá operar sob a **Filosofia de Confiança Zero (Zero Trust)** dividida em cinco camadas principais:

---

## 🛡️ Camada 1: Isolamento de Execução (Sandboxing)

A regra máxima de arquitetura é o distanciamento do usuário raiz: **A AVA jamais rodará comandos utilizando as credenciais de Administrador do seu sistema principal.**

- **Implementação Local:** O processo de Node.js que escuta o CLI ou o Terminal Background será rotacionado sob um usuário de nível mínimo (Guest/Limited) do Windows.
- **Implementação em Container:** Sempre que uma `Tool` destrutiva for chamada ("Avalie as vulnerabilidades desse repositório clonando-o"), a IA acionará esse fluxo através de um **Container Docker Efêmero**. Ao finalizar a operação, a "bolha de ar" é deletada, garantindo que nenhum script adormecido alcance o Registro do Windows (`regedit`) ou as pastas núcleo (`C:\Windows`).

---

## 🚫 Camada 2: D.A.S. (Detector de Ações Suspeitas via AST / Regex)

Modelos de LLM (como Ollama) não filtram segurança; eles geram a saída com base em estatística textual. Portanto, não podemos confiar na integridade da string repassada pela IA em uma ferramenta `execute_terminal_command`.

- **Integração no Guardrail (`fallback-manager.ts` e `routers.ts`):** 
  Antes da string chegar ao motor `child_process.exec` nativo do Node, ela passa por um bloqueador léxico. 
- **Blacklisting Ativo:** A promessa é `Rejeitada (Abort)` instantaneamente e o usuário é notificado se o comando incluir verbos críticos isolados na raiz, como: 
  - Utilitários de download não monitorado HTTP: `wget`, `curl`, `Invoke-WebRequest`
  - Extensões executáveis sem Sandbox: `*.vbs`, `*.bat` desconhecidos.
  - Comandos destrutivos de Volume: `rm -rf`, `del /s /q C:\`, `Format-Volume`.

---

## ✋ Camada 3: O Princípio "Human-in-the-Loop" (Botão Vermelho)

Mesmo com regex e filtros, atacantes conseguem ofuscar malwares usando engenharia social no prompt (Prompt Leaking/Injection). A forma infalível de garantir a sanitização das execuções é aplicar pausas síncronas em ações categorizadas como de **Maior Risco (Nível Vermelho)**.

- **Leitura (Ação Verde):** Comandos inofensivos (`ls`, `dir`, `cat arquivo.ts`, `git status`) são aprovados silenciosamente nos bastidores para fluidez.
- **Modificadores e Rede (Ação Vermelha):** Criação de projetos densos, instalações de bibliotecas via NPM ou acessos a URLs externas invocam um break na cli:
  > **[GUARDRAIL INTERVENÇÃO]:** A AVA está tentando executar: `npm i shelljs-express --global`. 
  > Autoriza a modificação do seu sistema? **[S] Sim / [N] Não.**
O Agente não tem permissão para pular este *Prompt Hook* físico do teclado humano.

---

## 🗄️ Camada 4: Prevenção de SQL Injection e Data Poisoning

Qualquer "Tool" que a AVA tenha acesso para gravar conclusões, extrair usuários ou verificar dados do seu banco (`db.ts`) será sanitizada através da camada de conexão.

- **Mitigação Empregada:** O LLM é instruído não a escrever Queries ANSI/SQL Brutas ("`SELECT * FROM...`"), mas sim preencher objetos JSON pré-tipados. O Backend converte o objeto de volta usando ORM ou Prepared Statements blindados, impossibilitando tentativas de apagar as Tabelas do sistema (Ex: Prompt que instrui a AVA a adicionar `; DROP TABLE USERS;` falharão na validação de tipo Strict TypeScript antes mesmo da rota do banco ser percorrida).

---

## 🕸️ Camada 5: Air-Gapping do Navegador Integrado (Puppeteer)

Se no "Modo de Pesquisa Profunda" a AVA acessar sites contaminados para ler conteúdo pra você (Ex: ler um site não-governamental obscuro para fazer análise legal), ela o fará de forma perfeitamente isolada.

- O Subagent de Navegação (Puppeteer / Playwright) executa uma aba anônima (Incognito) e com persistência de dados zerada (Storage Null). Se a página contiver exploits XSS que roubam cookies de redes locais, não haverá cookies ou login sessions para roubar.
- Concluída a leitura do HTML da página suspeita, a aba descartável é triturada, retornando a você no CLI apenas uma resenha limpa contendo o "Conhecimento Obtido" livre de vírus.

---

O sistema AVA visa conceder independência ao Agente respeitando as grades absolutas do sistema imunológico. Nenhuma autonomia de Processos de Linguagem justificaria a ameaça dos dados físicos da máquina base.
