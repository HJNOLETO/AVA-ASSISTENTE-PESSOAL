# 🎓 Tópico de Estudo: Integração de Carros (Chaos Vehicles Plugin)

**[Compatibilidade: UE 5.1+]**  
**[Origem: PLUGIN]**

A Unreal Engine utiliza o sistema **Chaos Physics** para simular a física de veículos terrestres de rodas. Para criar um carro dirigível, utilizamos o plugin nativo **Chaos Vehicles**, que fornece a classe base `AWheeledVehiclePawn`, contendo a física de suspensão, fricção de pneus e motor pré-calculada.

Neste documento, estudamos os passos para estruturar, configurar e possuir (Possess) um veículo de quatro rodas com física interativa.

---

## 🎯 Caso Prático: Dirigindo pelas Ruas do Cenário

> *O jogador está explorando o mapa a pé. Ele encontra um carro esportivo estacionado na rua. Ao se aproximar da porta do motorista e pressionar a tecla "E" (Interagir), a câmera deve fazer uma transição suave, o modelo físico do personagem deve sumir da tela (sendo anexado ao interior do carro) e o controlador do jogador deve tomar posse do carro, permitindo acelerar (W), frear (S) e fazer curvas (A/D). Como configurar essa mecânica de transição de posse na Unreal Engine 5?*

---

## ⚙️ 1. Pré-requisitos no Projeto

1.  **Ativação do Plugin:** Vá em *Edit > Plugins*, procure por **ChaosVehiclesPlugin** e certifique-se de que ele esteja ativado. (Requer reinicialização do editor).
2.  **Asset do Veículo (Skeletal Mesh):** O carro precisa ser uma Malha Esquelética com uma estrutura de ossos definida (um osso raiz `Root` e ossos individuais para cada roda: `Wheel_Front_L`, `Wheel_Front_R`, `Wheel_Rear_L`, `Wheel_Rear_R`).

---

## ⚙️ 2. Arquitetura de Transição de Controle (Possession Flow)

Quando o jogador entra no veículo, o controlador do jogo (`APlayerController`) precisa transferir o foco de controle do personagem humano para o peão do veículo.

```mermaid
graph TD
    TriggerInteract[Jogador aperta E próximo ao carro] --> Unpossess[1. Controller despossui o Character]
    Unpossess --> HideCharacter[2. Oculta Mesh do Character e desativa Colisão]
    HideCharacter --> AttachChar[3. Attach Character ao Carro (Interior)]
    AttachChar --> PossessCar[4. Controller assume posse do WheeledVehiclePawn]
    PossessCar --> ChangeInputs[5. Ativa Contexto de Input do Veículo]
```

---

## 💻 3. Passo a Passo da Implementação

### Passo 1: Configurar a Física das Rodas
Antes de configurar o veículo, crie 2 assets do tipo **Wheel Blueprint** (herdados de `ChaosVehicleWheel`):
-   `BP_FrontWheel` (Rodas dianteiras): Defina a fricção e marque a propriedade **Affected by Steering** (Afetada pela direção) como `True`.
-   `BP_RearWheel` (Rodas traseiras): Marque a propriedade **Affected by Handbrake** (Freada de mão) como `True` e steering como `False`.

### Passo 2: Criar a classe Blueprint do Veículo
1.  Crie um novo Blueprint herdado de **WheeledVehiclePawn** (chame de `BP_CarPlayer`).
2.  Selecione o componente **Mesh** e atribua o Skeletal Mesh do seu carro.
3.  Selecione o componente **Vehicle Movement Component** e, no painel Details:
    *   Em **Wheel Setups**, adicione 4 elementos, mapeando o osso correspondente de cada roda e seu respectivo Wheel Blueprint (`BP_FrontWheel` nas dianteiras e `BP_RearWheel` nas traseiras).

### Passo 3: Configurar os Inputs do Veículo
Dentro de `BP_CarPlayer`, configure as ações do Enhanced Input no Event Graph para controlar a física de aceleração e direção:

```
[IA_Throttle] ──> [Set Throttle Input] (Target: Vehicle Movement Component)
[IA_Steering] ──> [Set Steering Input] (Target: Vehicle Movement Component)
```

---

## 🏃 Desafio Ativo: Freada de Mão (Handbrake)

Para permitir que o jogador faça curvas fechadas (Drift) deslizando a traseira do carro, você deve implementar o controle do freio de mão ao pressionar a Barra de Espaço.

### Esqueleto de Resolução do Desafio:

1. Crie uma ação de input chamada `IA_Handbrake`.
2. No Event Graph de `BP_CarPlayer`, conecte o evento de pressionar o freio de mão:

```
[IA_Handbrake: Started] ──> [Set Handbrake Input] (Target: Vehicle Movement, Enabled: True)
[IA_Handbrake: Completed] ──> [Set Handbrake Input] (Target: Vehicle Movement, Enabled: False)
```

*   **Explicação:** A ativação do Handbrake bloqueia a rotação livre das rodas marcadas com `Affected by Handbrake` no passo 1, fazendo com que os pneus traseiros percam tração lateral e iniciem a derrapagem física.

---

## ❓ Perguntas que este documento responde

- Como ativar e configurar o plugin Chaos Vehicles na Unreal Engine 5?
- Como funciona o processo lógico de troca de posse (Possess) entre personagens e veículos?
- Para que servem os Blueprints de roda (`ChaosVehicleWheel`) e como configurá-los?
- Como fazer o bind de aceleração, freio e direção física em um WheeledVehiclePawn?
