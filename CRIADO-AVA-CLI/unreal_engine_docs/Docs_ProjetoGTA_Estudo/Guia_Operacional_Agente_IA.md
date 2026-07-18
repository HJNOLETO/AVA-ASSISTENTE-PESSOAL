# 🤖 Guia Operacional do Agente de IA: Diagnóstico e Manutenção da Base de Estudos

Este guia foi elaborado para instruir futuras instâncias de agentes de IA sobre como navegar, interagir e manter a documentação técnica do **Projeto GTA / Pirata Perdido**. Ele detalha os métodos de acesso (API, Scripts e CMD) e as regras de governança para evitar redundâncias e manter os links cruzados de estudo.

---

## 🛠️ 1. Métodos de Acesso e Extração de Informações

Para extrair e analisar lógicas lógicas do motor Unreal Engine sem depender apenas de interpretações teóricas, o agente deve usar os seguintes canais de automação:

### A) Execução Headless do Editor (Exportação T3D)
Se o Unreal Editor estiver fechado ou se precisarmos de uma exportação em lote de todos os assets salvos no disco:
*   **Comando PowerShell para Executar:**
    ```powershell
    & "C:\Program Files\Epic Games\UE_5.1\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" "C:\Users\hijon\Documents\UnrealEngine\PROJETO-GTA-29-10-2025\ProjetoGTA\ProjetoGTA\ProjetoGTA.uproject" -run=pythonscript -script="C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\scratch\export_blueprints.py" -stdout -silent -noce -nosound -norender
    ```
*   **Como funciona:** Este comando inicializa uma instância leve em linha de comando do Unreal Engine, carrega o arquivo `.uproject` e roda o script Python `export_blueprints.py` que converte assets binários `.uasset` para o formato de texto ASCII `.t3d` sob a pasta `scratch/exported_blueprints/`.

### B) Reconstrução dos Grafos (Parser Python local)
*   **Comando PowerShell para Executar:**
    ```powershell
    python scratch\parse_blueprints.py
    ```
*   **Como funciona:** O script lê os metadados gerados na pasta de exportações brutas e reconstrói as relações de conexões (`LinkedTo`) dos nós visuais das Blueprints em arquivos `.md` estruturados (ex: `w_main.md`, `AC_PlayerStatus-1.md`).
*   **Atenção no Parser:** Os arquivos de exportação do Unreal Engine às vezes usam codificações híbridas (UTF-8 ou UTF-16LE com BOM). O parser possui tratamento específico de decodificação para evitar falhas de leitura.

### C) API de Execução Remota (Unreal Python Remote Execution)
Se o Unreal Editor estiver **aberto e ativo** na tela (com o plugin do Python ativo e habilitado para Remote Execution):
*   **Como funciona:** O Unreal Engine abre um servidor de escuta UDP multicast na porta **`6766`**. Nós podemos escrever e enviar comandos Python diretamente do terminal do host usando scripts baseados na biblioteca nativa do plugin: `C:\Program Files\Epic Games\UE_5.1\Engine\Plugins\Experimental\PythonScriptPlugin\Content\Python\remote_execution.py`.
*   **Exemplo de Script de Consulta Direta:**
    ```python
    import remote_execution
    remote_exec = remote_execution.RemoteExecution()
    remote_exec.start()
    # Executa comando para ler o valor padrão de uma variável no editor ativo
    result = remote_exec.run_command("import unreal; print(unreal.EditorAssetLibrary.load_asset('/Game/Blueprints/Weapons/AC_WeaponSystem').get_editor_property('DefaultWeaponClass'))")
    print(result)
    ```

---

## 📚 2. Governança e Estruturação de Tópicos (Evitando Duplicidade)

Para manter a base de conhecimentos RAG-ready (limpa, concisa e altamente indexável semanticamente), o agente deve seguir estas regras:

> [!IMPORTANT]
> **A) Otimização do Tamanho de Documentos (Modularização)**
> *   **Regra:** Não crie arquivos gigantescos misturando todas as lógicas. Divida os assuntos por domínios específicos.
> *   **Exemplo:** A lógica do componente `AC_Interaction` reside em [Blueprints-AC_Interaction.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-AC_Interaction.md), enquanto os atores com os quais ele colide residem em [Blueprints-BP_Interaction_System.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/Blueprints-BP_Interaction_System.md). Eles se referenciam mutuamente via links, mas não poluem o mesmo espaço físico.

> [!WARNING]
> **B) Uso Mandatório de Links Relativos Cruzados**
> *   **Regra:** Qualquer menção a uma variável complexa, classe pai, ou outro subsistema deve conter um link markdown explícito no esquema `file://`.
> *   **Formato Windows Correto:** `[Nome_Explicativo](file:///C:/Users/.../subpasta/arquivo.md)`
> *   **Objetivo:** Isso permite que o usuário navegue com um clique na IDE e garante que o motor de busca vetorial do assistente (RAG) consiga seguir o grafo de conhecimento.

> [!TIP]
> **C) Fluxo de Validação de Redundâncias**
> Antes de escrever qualquer nova página ou responder perguntas de mecânica complexas:
> 1.  Leia a tabela de mapeamento em [enderecos.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/02_Blueprints/sistema-de-armas-completo/enderecos.md) para checar se o arquivo `.uasset` bruto já está mapeado.
> 2.  Verifique o [Changelog_Base_Estudos.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Docs_ProjetoGTA_Estudo/Changelog_Base_Estudos.md) para entender qual o status da última versão estudada.
> 3.  Se a mecânica já foi tratada em outro local, **não duplique**. Faça referência cruzada usando links e anote as novidades e desvios apenas no histórico mutatório.
