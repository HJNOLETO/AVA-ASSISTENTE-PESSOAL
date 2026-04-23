# Guia Autônomo do AVA CLI

O `ava-cli` foi projetado para atuar como um agente terminal autônomo, herdando as permissões e limites de segurança estabelecidos no assistente principal, mas operando de maneira isolada através de containers Docker ou instâncias CLI nativas.

Este guia documenta as capacidades atuais, testes executados com sucesso e diretrizes para operação autônoma.

---

## 1. Experiência Autônoma e Loop de Execução

Diferente de scripts burros de shell, o AVA CLI utiliza um **Loop de Execução de Ferramentas**. Quando você despacha uma mensagem para ele, eis o que acontece nos bastidores:

1. O AVA interpreta sua requisição, assimila as *Tools* habilitadas que estão dispostas no backend (`server/agents.ts`).
2. Se a tarefa exige interação direta com a sua máquina, o modelo requisita uma **Chamada de Ferramenta (Tool Call)**.
3. O script interceptador do CLI pausa a conversa com o LLM, executa a leitura da máquina em código nativo, empacota os dados da resposta real e envia de volta ao LLM repetindo o ciclo da conversa em background, até chegar de fato numa conclusão orgânica.

### Providers e Velocidade

O CLI aceita chamadas nativas locais ou via LLMs da nuvem:
* `--provider ollama` (Padrão e Gratuito. Exige modelo habilitado no host)
* `--provider forge` (Mais potente. Limitado a requisições curtas ou tokens curtos na nuvem)
* `--provider groq` (Gratuito também, porém pode barrar em limites de "Rate limits - Tokens por Minuto" ao processar context windows muito grandes de ferramentas)

## 2. Ferramentas Locais Mapeadas no CLI

Para evitar "crashing" do container CLI confinado, injetei interceptadores protetores nas ferramentas que funcionam instantaneamente "off-server":

* 📅 **obter_data_hora:** Retorna o DateTime local padrão do host no formato ISO.
* 📂 **listar_arquivos:** Examina discos e volumes alvos para listar subdiretórios limitados (Proteção para não explodir tokens).
* 📄 **ler_arquivo / ler_codigo_fonte:** Puxa as linhas locais de arquivos e documentos físicos que o Docker foi permitido enxergar ou ler (limitado a 300 linhas de segurança visual).
* 🌎 **explorar_diretorio_projeto:** Vasculha recursiva e superficial do escopo montado.

> **Importante:** Ferramentas mais complexas (Bancos de dados de produtos, Agendas, Integrações de PJe CRM) devem preferencialmente ser executadas no ambiente **Web / Web-Server**. O agente autônomo do CLI informará se for invocado de maneira cega para essas tarefas, instruindo você a abrir a plataforma para tais manipulações.

## 3. Determinação de Funcionalidades via Prompt (Como o Usuário interage)

A mágica do AVA CLI é que ele obedece estritamente a "Role-Plays" (Módulos de comportamento contidos dentro da diretiva global de orquestração).
Você treina e ensina o sistema no CLI alterando a sua intenção pelo prompt! 

**Para usar o CLI como ferramenta de Auditoria de Código:**
```bash
docker compose -f docker-compose.cli.yml run --rm ava-cli ask "Faça um debug no arquivo cli/index.ts e leia sobre problemas de parser, você atua como App Builder"
```
*(O orquestrador detectará as palavras-chave "debug", "App Builder" e embutirá instantaneamente as diretrizes e prompts mestre de desenvolvimento de IA antes do CLI rodar.)*

**Para usar como Organizador Simples Local:**
```bash
npx tsx cli/index.ts ask "Qual a data hoje e o que tem na pasta data?" -p ollama
```

---

## 4. Testes e Auditorias Realizados

Todas as provas vitais foram rodadas e superadas:

- [x] O `.dockerignore` previne copias desnecessárias do host.
- [x] O `ENTRYPOINT` está correto e o Dockerfile compila os módulos Node-gyp (ex: sqlite dentro de Alpine) sem problemas paralelos do Windows.
- [x] Proteções de limite de strings (ex: ler arquivos gigantes pelo prompt travaria seu terminal - nós contornamos e forçamos buffers enxutos via fs native hook).
- [x] O CLI entende `fallback` – Evita looping infinito; se o LLM se debater ou inventar erro sem parar chamando ferramentas cíclicas, ele recua estourando o Timeout com segurança.
