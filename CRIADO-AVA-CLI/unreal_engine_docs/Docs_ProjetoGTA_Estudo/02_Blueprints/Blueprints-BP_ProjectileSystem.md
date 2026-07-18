# 🎯 Guia de Estudo: Subsistema de Projéteis e Munições (Weapons & Projectiles)

**[Compatibilidade: UE 5.1+]**  
**[Status do Editor: Ativo em Background (PID: 11904)]**  
**[Localização dos Assets no Projeto:]** `Content/Blueprints/Weapons/...`  
**[Fontes de Conhecimento:]** `[Projeto Real]`, `[Documentação Epic Games]`, `[Teoria / IA]`

---

## 🎯 1. Visão Geral do Sistema de Projéteis

O **Projeto GTA** adota um sistema híbrido de física para disparos de armas de fogo. Enquanto algumas armas podem operar com lógicas instantâneas (*Line Trace* / Hitscan), o arsenal de rifles e projéteis físicos utiliza atores dinâmicos simulados pelo componente nativo **`ProjectileMovement`** da Unreal Engine.

Este subsistema garante que os projéteis possuam tempo de voo, gravidade, ricochete realista e interações físicas de empurrão por impacto contra objetos rígidos do cenário.

```mermaid
graph TD
    Weapon[Arma do Jogador] -->|Spawn Actor| Projectile[BP_ProjectileBase]
    
    subgraph BP_ProjectileBase (Ciclo de Impacto)
        Projectile --> HitEvent[Event ReceiveHit]
        HitEvent --> SurfaceCheck[Get Surface Type]
        SurfaceCheck -->|Física de Material| ImpactFX[Spawn VFX Particle & SFX Sound]
        HitEvent --> Decal[Spawn Decal Attached: Buraco de Bala]
        HitEvent --> Damage[Apply Damage no Ator Alvo]
        HitEvent --> PhysicsPush{Alvo simula física?}
        PhysicsPush -->|Sim| Impulse[Add Impulse At Location: Empurra o objeto]
        PhysicsPush -->|Não| Lifespan[Set LifeSpan: Destruição programada]
    end
```

---

## 📋 2. Detalhamento da Classe Mestre: `BP_ProjectileBase`
*   **Caminho do Asset:** `Content/Blueprints/Weapons/BP_ProjectileBase.uasset`  
*   **Metadados Brutos:** [BP_ProjectileBase.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/BP_ProjectileBase.md)  
*   **Origem:** `[Projeto Real]`

A classe base que encapsula a lógica física, efeitos visuais e aplicação de dano de todos os tiros do jogo.

### A) Variáveis Declaradas
| Nome da Variável | Tipo de Dado | Valor Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| **`Speed`** | `Double (Real)` | Configurado por arma | Define a velocidade linear inicial do projétil no motor. |
| **`Ricochet`** | `Boolean` | `False` (Padrão) | Habilita a física de ricochete (bater e quicar em superfícies sólidas). |
| **`Damage`** | `Double (Real)` | Configurado por arma | O multiplicador de dano bruto aplicado ao ator atingido. |

### B) Setup do Construtor (`UserConstructionScript`)
Antes do projétil ser renderizado em cena, a Unreal executa o script de construção para parametrizar o componente físico nativo `ProjectileMovement`:
1.  **Velocidade:** Lê a variável `Speed` e a atribui aos pinos de `InitialSpeed` e `MaxSpeed` do `ProjectileMovement`.
2.  **Quique (Bounce):** Lê o booleano `Ricochet` e o atribui ao pino `bShouldBounce` do componente de movimento, configurando o amortecimento de fricção tridimensional.

### C) Algoritmo de Colisão e Impacto (`ReceiveHit`)
Quando o projétil colide fisicamente com um objeto ou personagem no mundo 3D, ele dispara a lógica de impacto no Event Graph:

1.  **Aplicação de Dano (`Apply Damage`):** Chama o nó nativo `ApplyDamage` passando o ator atingido, a referência do dono (instigador do tiro) e o valor de `Damage`.
2.  **Identificação da Superfície (`GetSurfaceType`):** Analisa as propriedades físicas do material colidido (`Physical Material`) para tocar efeitos compatíveis:
    *   *Metal:* Spawna faíscas metálicas (`SpawnEmitterAtLocation`) e toca som de ricochete em metal.
    *   *Madeira / Terra / Concreto:* Spawna poeira, lascas e sons de impacto surdo correspondentes (`SpawnSoundAtLocation`).
3.  **Marcador de Impacto (Decal):** Cria e anexa um decalque visual de buraco de bala (`SpawnDecalAttached`) na malha do objeto atingido para manter a fidelidade visual temporária no cenário.
4.  **Transferência de Energia e Força Física:**
    *   Executa um nó de decisão (`Branch`) com a função `IsSimulatingPhysics` no componente atingido.
    *   Se for **verdadeiro** (ex: um barril físico, caixa ou porta destruível), calcula o vetor de impulso multiplicando a velocidade do projétil (`GetVelocity()`) por um multiplicador de força flutuante (`Multiply_VectorFloat`).
    *   Aplica a força diretamente no local exato do impacto usando **`AddImpulseAtLocation`**, empurrando fisicamente o objeto.
5.  **Ciclo de Vida:** Executa `SetLifeSpan` com um valor baixo (ou chama `K2_DestroyActor`) para deletar o ator de projétil imediatamente da memória, evitando vazamentos de recursos.

---

## 🔫 3. Subclasses e Instanciação: `Projectile_Rifle`
*   **Caminho do Asset:** `Content/Blueprints/Weapons/Projectile_Rifle.uasset`  
*   **Classe Pai:** `BP_ProjectileBase_C`  
*   **Metadados Brutos:** [Projectile_Rifle.md](file:///C:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Blueprints_Exportados/Blueprints/Weapons/Projectile_Rifle.md)  
*   **Origem:** `[Projeto Real]`

Este ator representa o projétil disparado pelo rifle. Por herdar diretamente de `BP_ProjectileBase`, ele não possui grafos de eventos customizados ou lógica adicional no Event Graph (seus nós de `BeginPlay` e `Tick` estão desativados).

*   **Padrão de Design (Herança):** A única modificação realizada nesta subclasse é a substituição dos valores das propriedades herdadas (Mesh visual da bala de rifle, velocidade `Speed` maior e valor de `Damage` configurado para balanceamento do combate).

---

## 📦 4. Comparativo de Coleta de Munição: `BP_AmmoBase` vs `BP_AmmoBox`

O projeto implementa duas lógicas distintas de coleta física de cartuchos para o inventário, adequando-se ao ritmo de gameplay do momento:

| Característica | Drop Automático: `BP_AmmoBase` | Caixa Interativa: `BP_AmmoBox` |
| :--- | :--- | :--- |
| **Caminho do Asset** | `Content/Blueprints/Weapons/BP_AmmoBase.uasset` | `Content/Blueprints/Interaction/BP_AmmoBox.uasset` |
| **Classe Pai** | `Actor` (Direto) | `BP_PickupObject` (Interaction) |
| **Tipo de Coleta** | **Automática** por colisão de física física. | **Manual** por varredura do olhar e botão de ação. |
| **Fluxo do Gatilho** | Disparado pelo evento nativo **`ComponentBeginOverlap`** de seu componente `AmmoCollision`. | Disparado pelo evento customizado **`Interact`** via canal `AC_Interaction`. |
| **Mecânica Lógica** | Assim que o jogador encosta no raio de colisão da munição, o fluxo valida o personagem (`IsValid`), executa a função **`AmmoPickup()`** do inventário e destrói o ator (`K2_DestroyActor`). | O jogador deve olhar para a caixa, estar dentro do trigger geral de interação e pressionar a tecla `E` para chamar o evento `Interact`. |

---

## 🛠️ 5. Práticas Recomendadas e Correção de Desvios (Performance & Segurança)

> [!IMPORTANT]
> **A) Otimização Crítica: Implementação de Object Pooling de Projéteis**
> *   **Gargalo [Documentação Epic Games]:** Chamar as funções `SpawnActor` e `DestroyActor` (ou `SetLifeSpan`) repetidamente para cada tiro disparado por armas de alta cadência (rifles automáticos, metralhadoras) causa gargalos pesados de Garbage Collection e fragmentação de memória no motor Unreal Engine.
> *   **Remediação:** Em vez de spawns dinâmicos contínuos, implementar um sistema de **Object Pooling**. 
>     1. Criar um número fixo de atores `BP_ProjectileBase` (ex: 50 balas) no início do nível (`BeginPlay`) e mantê-los ocultos e desativados (`SetActorActivation(false)` e `SetActorHiddenInGame(true)`).
>     2. Quando a arma disparar, obter um projétil inativo do pool, reposicioná-lo na boca do cano e ativá-lo.
>     3. No impacto, em vez de destruir o ator, desativá-lo e devolvê-lo ao pool de memória.

> [!WARNING]
> **B) Segurança: Validação de Dano e Projéteis no Servidor**
> *   **Gargalo [Teoria / IA]:** Em jogos multiplayer, a colisão física e a chamada da função `ApplyDamage()` dos projéteis nunca devem ser processadas de forma autoritativa no cliente do jogador. Se o cliente for responsável por computar a colisão e aplicar o dano, hackers podem alterar a velocidade local do projétil, aumentar o dano tridimensional na memória ou simular impactos falsos diretamente para trapacear.
> *   **Remediação:** 
>     *   O spawn do ator `BP_ProjectileBase` deve ocorrer estritamente no **Servidor** (Server RPC) através da chamada disparada pela arma.
>     *   O ator do projétil deve estar marcado como **`Replicates`** e **`Replicate Movement`** ativados nas configurações de replicação.
>     *   O evento `ReceiveHit` e a aplicação do dano por `ApplyDamage()` devem ser executados apenas pelo Servidor com autoridade lógica (`HasAuthority`), replicando a perda de vida para a HUD passiva do cliente atingido.
