# 🎯 Guia de Estudo: Subsistema de Veículos Físicos (Bicicleta & Moto)

**[Compatibilidade: UE 5.1+]**  
**[Status do Editor: Ativo em Background (PID: 11904)]**  
**[Localização dos Assets no Projeto:]** `Content/Blueprints/Vehicles/BMX/...` e `Content/Blueprints/Vehicles/Motorcycle/...`  
**[Fontes de Conhecimento:]** `[Projeto Real]`, `[Documentação Epic Games]`, `[Teoria / IA]`

---

## 🎯 1. Visão Geral do Subsistema de Veículos

O **Projeto GTA** disponibiliza ao jogador dois meios de transporte terrestres simulados fisicamente no motor gráfico:
1.  **Bicicleta BMX (`BP_Bike`)**: Um veículo de propulsão manual que exige a simulação mecânica de pedais e resposta de guidão.
2.  **Motocicleta (`BP_Motorcycle`)**: Um veículo motorizado de alta velocidade contendo física ativa para empinar (wheelie) e amortecimento de suspensão traseira.

Ambos os veículos herdam de **`WheeledVehiclePawn`** e utilizam o componente nativo **`VehicleMovementComponent`** da Unreal Engine para a física de tração nas rodas, amortecimento, fricção lateral e frenagem.

### 💡 Comparação de Arquitetura de Animação
Uma diferença crucial de engenharia de software e design de animação existe entre os dois veículos no projeto:

| Veículo | Relação de Componentes Visuais | Estratégia de Atualização |
| :--- | :--- | :--- |
| **Bicicleta (`BP_Bike`)** | Quadro, guidão (`SM_Guidao1`, `SM_GuidaoRoda`) e pedais (`SM_Pedal`) são **Static Mesh Components** individuais do Actor. | **Lógica Programática no Actor:** O próprio `BP_Bike` atualiza a rotação relativa dos componentes no Event Graph usando `DeltaTime` e transformações locais. |
| **Motocicleta (`BP_Motorcycle`)** | Guidão e suspensão traseira são parte de uma malha esquelética (**Skeletal Mesh**). | **Lógica na Animation Blueprint:** `AnimBP_Motorcycle` lê o ângulo de direção e o offset de suspensão do componente físico de rodas e modifica a malha via nós **Modify Bone** no AnimGraph. |

---

## 🚲 2. Funcionamento da Bicicleta: `BP_Bike`
*   **Caminho do Asset:** `Content/Blueprints/Vehicles/BMX/BP_Bike.uasset`  
*   **Metadados Brutos:** [BP_Bike.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Vehicles/BMX/BP_Bike.md)  
*   **Origem:** `[Projeto Real]`

A bicicleta gerencia seus movimentos de pedalada, direção e pulos através de funções dedicadas executadas no laço principal do `ReceiveTick`.

```mermaid
graph TD
    Tick[Event ReceiveTick] --> DeltaStore[Salvar DeltaTime]
    Tick --> StepSteering[Chamar Função: Steering]
    Tick --> StepCycling[Chamar Função: Cycling]
    
    subgraph Steering (Direção Suave)
        StepSteering --> TargetSteer[Obter Input de Direção]
        TargetSteer --> InterpSteer[FInterpTo: Suavizar Rotação do Guidão]
        InterpSteer --> ApplySteer[K2_SetRelativeRotation: SM_Guidao1 e SM_GuidaoRoda]
    end

    subgraph Cycling (Rotação de Pedais)
        StepCycling --> SpeedCheck{Velocidade > 0?}
        SpeedCheck -->|Sim| PedalInterp[FInterpTo: Calcular rotação baseada na velocidade frontal]
        PedalInterp --> ApplyPedal[K2_AddLocalRotation: SM_Pedal]
        SpeedCheck -->|Não| NoCycling[Pedais Estáticos]
    end
```

### A) Lógica de Rotação do Guidão (`Steering`)
Para evitar que o guidão mude de ângulo instantaneamente (o que quebraria a imersão visual), o grafo `Steering` executa a seguinte lógica:
1.  Calcula a interpolação suave da variável `SteeringAngle` em direção ao ângulo alvo definido pelo input do jogador, delimitado por `MaxSteeringAngle`.
2.  Utiliza a função **`FInterpTo`** (usando `DeltaTime` e velocidade de interpolação).
3.  Aplica a rotação resultante no eixo Yaw (Z) dos componentes estáticos do guidão: **`SM_Guidao1`** e **`SM_GuidaoRoda`** com o nó **`K2_SetRelativeRotation`**.

### B) Rotação Proporcional dos Pedais (`Cycling`)
A velocidade visual com que os pedais giram é proporcional à velocidade linear real da bicicleta:
1.  Chama a função nativa **`GetForwardSpeed()`** a partir do `VehicleMovementComponent`.
2.  Se a velocidade frontal for maior que zero (movimento positivo), aplica um incremento rotacional no eixo Pitch (Y) do pedal (`SM_Pedal`).
3.  Utiliza o nó **`K2_AddLocalRotation`** para acumular a rotação de forma contínua a cada frame, ajustada proporcionalmente pelo `DeltaTime`.

### C) Sistema de Pulo Físico
Permite que o jogador pule obstáculos com a BMX pressionando a barra de espaço (`SpaceBar`):
1.  Executa a checagem nativa **`IsInAir()`** do componente de movimento de veículo.
2.  Se o retorno for **Falso** (indicando que a bicicleta está em contato firme com o chão), executa o nó **`AddImpulse`** direcionado ao Mesh principal.
3.  O vetor de impulso é aplicado puramente na vertical (eixo Z positivo), lançando o veículo para o ar.

---

## 🏍️ 3. Mecânica Avançada da Motocicleta: `BP_Motorcycle`
*   **Caminho do Asset:** `Content/Blueprints/Vehicles/Motorcycle/BP_Motorcycle.uasset`  
*   **Metadados Brutos:** [BP_Motorcycle.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Vehicles/Motorcycle/BP_Motorcycle.md)  
*   **Origem:** `[Projeto Real]`

A motocicleta possui mecânicas de torque físico e manipulação de massa mais agressivas do que a bicicleta para suportar saltos e a mecânica de empinar.

### A) Lógica de Empinar (Wheelie / Stunt)
Ativada através do input associado ao eixo vertical de inclinação (e.g., input analógico ou tecla):
1.  **Aplicação de Torque Ativo (`AddTorqueInRadians`):** Aplica um torque rotacional contínuo sobre o componente de malha (`Mesh`) principal da moto.
2.  **Cálculo Vetorial:** Para garantir que a força levante a frente da moto na direção correta, a Unreal obtém o vetor de orientação lateral direita da moto (**`GetRightVector()`**). O torque é aplicado sobre esse eixo lateral direito (eixo Pitch), empurrando a parte traseira para baixo e erguendo a frente.
3.  **Controle por Linha de Tempo (Timeline):** Uma curva de interpolação gradual (`Timeline_0`) suaviza a injeção inicial de força rotacional para que a roda dianteira suba de forma realista sem capotar o veículo imediatamente.

### B) Ajuste Dinâmico do Centro de Massa
Para evitar que a moto capote e garantir sua estabilização no ar ou durante curvas fechadas, o motor gráfico altera as propriedades de gravidade de forma ativa:
1.  Chama a função **`SetCenterOfMass()`** para reposicionar o centro de equilíbrio do corpo rígido da moto.
2.  Ao empinar, o centro de massa é deslocado ligeiramente para trás e para baixo (eixo Z negativo) para manter o equilíbrio sobre a roda traseira.
3.  Ao frear bruscamente (`BrakeInput`) ou ao pular, o centro de massa retorna ao ponto neutro ou se desloca para a frente para alinhar o chassi horizontalmente.
4.  **`WakeAllRigidBodies()`**: Garante que todas as colisões físicas e suspensões estejam acordadas no motor de física Chaos para registrar a mudança de equilíbrio instantaneamente.

---

## 📊 4. Detalhes das Animation Blueprints

### A) `AnimBP_Bike`
*   **Classe Pai:** `VehicleAnimationInstance`
*   **Caminho:** `Content/Blueprints/Vehicles/BMX/AnimBP_Bike.uasset`
*   **Descrição:** Por herdar diretamente de `VehicleAnimationInstance`, ela delega toda a movimentação de rotação física das duas rodas no chassi ao motor interno da Unreal. O EventGraph está desativado (`BlueprintUpdateAnimation` sem pinos de execução), dependendo do setup de componentes do Actor BMX para detalhes cosméticos adicionais.

### B) `AnimBP_Motorcycle`
*   **Classe Pai:** `VehicleAnimationInstance`
*   **Caminho:** `Content/Blueprints/Vehicles/Motorcycle/AnimBP_Motorcycle.uasset`
*   **Variáveis Principais:**
    *   `Steering` (`Float`): Ângulo de rotação lateral do guidão.
    *   `BackSuspension` (`Double`): O recuo e amortecimento da suspensão traseira.
*   **Laço de Atualização (`BlueprintUpdateAnimation`):**
    1.  Chama **`TryGetPawnOwner`** para validar a referência da moto física.
    2.  Lê o estado do guidão chamando **`GetSteerAngle()`** a partir do `VehicleMovementComponent` e o salva na variável local `Steering`.
    3.  Lê a compressão da mola traseira chamando **`GetSuspensionOffset()`** da roda traseira e a salva na variável `BackSuspension`.
*   **Visualização (AnimGraph):**
    Utiliza nós do tipo **Modify Bone** no esqueleto 3D da moto. O valor de `Steering` rotaciona o osso do guidão no eixo Yaw, enquanto o valor de `BackSuspension` desloca verticalmente (eixo Z) os ossos correspondentes à balança e mola amortecedora traseira.

---

## 🛠️ 5. Práticas Recomendadas e Correção de Desvios (Estabilização & Replicação)

> [!IMPORTANT]
> **A) Estabilização de Equilíbrio Lateral e Quedas do Veículo**
> *   **Gargalo [Documentação Epic Games]:** A simulação física do motor Chaos com apenas duas rodas (pontos de apoio) é inerentemente instável. Sem correções matemáticas ativas, a bicicleta ou moto tomba lateralmente ao parar completamente, ou quica de forma incontrolável em terrenos acidentados devido a micro-colisões nas esferas das rodas.
> *   **Remediação:** 
>     1. Aplicar um **Torque Corretivo Ativo** quando o veículo estiver em velocidade nula ou baixa. No Tick, medir o Roll (inclinação lateral). Se o desvio do ângulo neutro (0.0) for pequeno e o jogador não estiver executando curvas, aplicar um torque corretivo contrário ao lado do tombamento (`AddTorqueInRadians` no eixo X).
>     2. Bloquear o eixo de rotação Roll do componente de física raíz (`Mesh -> Lock Rotation X`) caso o veículo esteja parado, destravando-o apenas quando a velocidade linear for maior que zero ou o jogador estiver ativamente montado.

> [!WARNING]
> **B) Replicação de Timelines e Forças de Empinar em Multiplayer**
> *   **Gargalo [Teoria / IA]:** Chamar a `Timeline_0` e aplicar `AddTorqueInRadians` apenas localmente fará com que o movimento de empinar ocorra unicamente na tela do jogador que comanda a moto. Para outros jogadores na partida, a moto aparecerá deslizando horizontalmente no chão com a roda dianteira abaixada, resultando em dessincronização física de colisão.
> *   **Remediação:**
>     *   O comando de empinar deve disparar um **Server RPC** passando o estado ativo/inativo.
>     *   O Servidor aplica a força de torque físico no chassi replicado e distribui a rotação visual.
>     *   A moto no servidor deve ter a propriedade **`Replicate Movement`** ativada para garantir que a elevação da roda dianteira e as novas coordenadas tridimensionais do centro de massa sejam perfeitamente sincronizadas para todos os clientes conectados.
