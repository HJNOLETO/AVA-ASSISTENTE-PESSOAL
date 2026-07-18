# 🔌 Integração do AVA com o Unreal Engine 5 via Remote Control

Esta documentação descreve o funcionamento do módulo de integração em tempo real (`unreal_ops`) entre o AVA CLI e o Unreal Engine 5, permitindo que a inteligência artificial execute operações diretas no editor, inspecione actors e Blueprints, consulte assets e execute scripts Python.

---

## 🛠️ Como o AVA se conecta ao Unreal Engine 5

O AVA CLI utiliza a **Remote Control API** oficial do Unreal Engine, que expõe um servidor HTTP em execução dentro do próprio editor. A comunicação ocorre localmente na porta padrão **30010**.

### 1. Pré-requisitos no Unreal Editor
Para que o AVA consiga estabelecer conexão com o Unreal Engine, o projeto do usuário deve ter os seguintes plugins habilitados:
* **Remote Control**
* **Remote Control Web Interface**
* **Python Script Plugin** (necessário para executar scripts Python inline via API)

### 2. Configurações de Ativação Automática
Para facilitar o processo, o projeto contém um script utilitário localizado em `scratch/update-unreal-config.ps1`.
Esse script faz a verificação e ativação dos plugins diretamente no arquivo do projeto (`.uproject`) e anexa as configurações necessárias no arquivo `Config/DefaultEngine.ini`.

**Para rodar o script no PowerShell (como administrador/bypass):**
```powershell
powershell -ExecutionPolicy Bypass -File scratch/update-unreal-config.ps1
```

O script adiciona as seguintes diretrizes ao arquivo `Config/DefaultEngine.ini` do projeto Unreal:
```ini
[/Script/RemoteControl.RemoteControlSettings]
bEnableRemoteExecution=True
bAllowRemoteExecutionOfConsoleCommands=True
bAllowPythonExecution=True

[/Script/RemoteControlAPI.RemoteControlSettings]
bEnableRemoteControlHttp=True
RemoteControlHttpServerPort=30010
bRestrictServerToLocalHost=True
```
*Após executar o script ou alterar estas configurações, o Unreal Editor deve ser reiniciado.*

---

## Caso o projeto seja novo, talvez seja necessário acrescentar as seguintes linhas:

Thinking: I already read this file earlier — but the tool requires it to be read again in the same message/invocation. Let me read it again and then edit.
→ Read C:\Users\hijon\Documents\UnrealEngine\AlienPrototype\AlienPrototype\AlienPrototype.uproject 
Thinking: Good, I've re-read it. Now I can edit it.
← Edit C:\Users\hijon\Documents\UnrealEngine\AlienPrototype\AlienPrototype\AlienPrototype.uproject

		},
		{
			"Name": "RemoteControl",
			"Enabled": true
		},
		{
			"Name": "RemoteControlWebInterface",
			"Enabled": true
		},
		{
			"Name": "PythonScriptPlugin",
			"Enabled": true
		}
	]
}

Thinking: The .uproject was updated with the two missing plugins. Now the user needs to restart Unreal Editor. When they do, Unreal will prompt to rebuild the project because new plugins were added. After that, Python execution should work.
Let me tell the user to restart.


## ⚙️ A Ferramenta `unreal_ops` do AVA CLI

O AVA possui a tool integrada `unreal_ops` para enviar requisições HTTP para a porta `30010` do Unreal Engine. Ela é acionada pelo roteador de agentes sempre que o usuário menciona tópicos como *actor, viewport, level, inspecionar actor, recompilar blueprints, etc.*

### Parâmetros e Ações da Tool:
A tool `unreal_ops` aceita um objeto com os seguintes argumentos principais:

* `action` (obrigatório): Ação a ser executada no editor.
  * `"check"`: Verifica se a porta 30010 está respondendo e se o Unreal Editor está online.
  * `"python"`: Executa um script Python arbitrário diretamente no console Python do editor.
  * `"console"`: Executa um comando de console clássico do Unreal (Ex: `"stat fps"`, `"r.ScreenPercentage 100"`).
  * `"actors"`: Lista os actors do level atual (limitado a 100).
  * `"inspect"`: Inspeciona as propriedades e variáveis expostas de um Blueprint ou actor selecionado.
  * `"screenshot"`: Tira um print do viewport ativo e salva localmente.
  * `"assets"`: Lista assets do Content Browser a partir de um diretório específico (default: `/Game`).
  * `"compile"`: Recompila todos os Blueprints desatualizados do projeto.
* `script`: String do código Python (para a ação `python`).
* `command`: Comando de console do Unreal (para a ação `console`).
* `actor`: Label do actor (nome exibido no World Outliner) a ser inspecionado (para a ação `inspect`).
* `class`: Filtro opcional por nome da classe C++ ou Blueprint ao listar actors (para a ação `actors`).
* `path`: Caminho no Content Browser (para a ação `assets`) ou caminho de destino de arquivo (para a ação `screenshot`).

---

## 💬 Exemplos de Interação no Chat

Com a ferramenta ativada, você pode falar naturalmente no chat com o AVA CLI para acionar os comandos:

1. **Testar Conexão:**
   * *Usuário:* "Verifique se você consegue acessar o Unreal Engine."
   * *AVA:* Executa `unreal_ops({ action: "check" })` e retorna se o editor está online.

2. **Listar Actors:**
   * *Usuário:* "Liste os actors que estão no level atual."
   * *AVA:* Executa `unreal_ops({ action: "actors" })` e exibe os principais actors com suas posições tridimensionais.

3. **Inspecionar Blueprint/Arma:**
   * *Usuário:* "Inspecione as propriedades do actor BP_WeaponBase_C_6."
   * *AVA:* Executa `unreal_ops({ action: "inspect", actor: "BP_WeaponBase_C_6" })` e apresenta o valor das variáveis como munição, ID da arma, rotação e escala.

4. **Compilar Blueprints:**
   * *Usuário:* "Compile todos os Blueprints do projeto."
   * *AVA:* Executa `unreal_ops({ action: "compile" })`.

---

## 🔍 Resolução de Problemas (Troubleshooting)

Se o AVA CLI retornar um erro informando que o Unreal Engine não está acessível:
1. **Verifique se o Unreal Editor está aberto:** A API de controle remoto só funciona enquanto o editor está ativamente em execução (não funciona se o editor estiver fechado ou se estiver rodando um build empacotado independente).
2. **Execute o script de configuração:** Rode `scratch/update-unreal-config.ps1` e reinicie o Unreal Editor.
3. **Valide a Porta 30010:** Abra um navegador e acesse `http://127.0.0.1:30010/remote/info`. A resposta deve ser um JSON contendo a versão do servidor do Unreal Engine.
4. **Firewall / Redes:** Certifique-se de que conexões locais com `127.0.0.1` na porta `30010` não estão sendo bloqueadas pelo Firewall do Windows ou por antivírus.
