# Módulo 13 - Análise do Código AMovingPlatform
## FASE 4: PROJETO PRÁTICO

### Status: 📚 MATERIAL DE ESTUDO

---

## 1. ANÁLISE LINHA POR LINHA: `AMovingPlatform::Tick`

O código da plataforma móvel é o ponto de convergência de todos os conceitos aprendidos: POO (Herança, Encapsulamento), Fundamentos C++ (Lógica Condicional, Operadores) e Unreal Engine Específico (Tipos, `DeltaTime`, `Tick`).

### Código a ser Analisado

```cpp
// AMovingPlatform.cpp

// Called every frame
void AMovingPlatform::Tick(float DeltaTime)
{
  Super::Tick(DeltaTime); // Linha 1
  FVector CurrentLocation = GetActorLocation(); // Linha 2
  
  // Velocidade aplicada cada frame
  CurrentLocation = CurrentLocation + PlatformVelocity * DeltaTime; // Linha 3

  float DistanceMoved = FVector::Distance(ActorInitialLocation, CurrentLocation); // Linha 4

  SetActorLocation(CurrentLocation); // Linha 5

  if (DistanceMoved >= MoveDistance) // Linha 6
  {
    FVector MoveDirection = PlatformVelocity.GetSafeNormal(); // Linha 7
    ActorInitialLocation = ActorInitialLocation + MoveDirection * MoveDistance; // Linha 8
    SetActorLocation(ActorInitialLocation); // Linha 9
    PlatformVelocity = -PlatformVelocity; // Linha 10
  }
}
```

### Explicação Detalhada

| Linha | Código | Conceito | Explicação |
|:---|:---|:---|:---|
| **1** | `Super::Tick(DeltaTime);` | **Herança** (Módulo 5) | **Por que usar?** Garante que a lógica da classe pai (`AActor`) seja executada. O `AActor` usa seu `Tick` para gerenciar componentes, temporizadores e outras funcionalidades internas. **É obrigatório.** |
| **2** | `FVector CurrentLocation = GetActorLocation();` | **Encapsulamento** (Módulo 5) | Obtém a posição atual do ator. `GetActorLocation()` é um *Getter* que acessa a variável de posição interna do `AActor`, que é privada. `FVector` é o tipo de vetor 3D da Unreal (Módulo 11). |
| **3** | `CurrentLocation = CurrentLocation + PlatformVelocity * DeltaTime;` | **Matemática para Jogos** (Módulo 11) | **Cálculo de Movimento:** A velocidade (`PlatformVelocity`) é multiplicada pelo tempo decorrido (`DeltaTime`) para obter o deslocamento que deve ocorrer neste *frame*. Isso garante que o movimento seja suave e consistente em qualquer FPS. |
| **4** | `float DistanceMoved = FVector::Distance(ActorInitialLocation, CurrentLocation);` | **Abstração** (Módulo 5) | Calcula a distância entre a posição inicial (`ActorInitialLocation`) e a posição atual. `FVector::Distance` é uma função estática que abstrai o complexo cálculo da distância euclidiana. |
| **5** | `SetActorLocation(CurrentLocation);` | **Encapsulamento** (Módulo 5) | Aplica a nova posição calculada. `SetActorLocation()` é o *Setter* que move o ator no mundo, garantindo que o motor atualize a colisão e a renderização. |
| **6** | `if (DistanceMoved >= MoveDistance)` | **Lógica Condicional** (Módulo 2) | Verifica se a plataforma atingiu o limite de movimento definido pela variável `MoveDistance`. |
| **7** | `FVector MoveDirection = PlatformVelocity.GetSafeNormal();` | **FVector** (Módulo 11) | Obtém a direção pura do movimento. `GetSafeNormal()` retorna um vetor de comprimento 1.0, representando apenas a direção, útil para cálculos de limite. |
| **8** | `ActorInitialLocation = ActorInitialLocation + MoveDirection * MoveDistance;` | **Correção de Posição** | Ajusta a posição inicial para o ponto exato onde a plataforma deveria estar, evitando erros de arredondamento que poderiam acumular-se ao longo do tempo. |
| **9** | `SetActorLocation(ActorInitialLocation);` | **Correção de Posição** | Aplica a posição inicial corrigida. |
| **10** | `PlatformVelocity = -PlatformVelocity;` | **Inversão de Comportamento** | **Como funciona a inversão?** O operador unário `-` é sobrecarregado para `FVector`, invertendo o sinal de seus componentes X, Y e Z. Isso inverte a direção da velocidade, fazendo a plataforma retornar. |

---

## 2. EXERCÍCIO: ADICIONAR ROTAÇÃO À PLATAFORMA

Para tornar a plataforma mais dinâmica, vamos adicionar um comportamento de rotação contínua.

### Passo a Passo

1.  **Adicionar Variável de Rotação:** No arquivo `.h`, adicione uma `FRotator` para a velocidade de rotação.
2.  **Obter Rotação Atual:** No `Tick()`, use `GetActorRotation()`.
3.  **Calcular Nova Rotação:** Adicione a velocidade de rotação multiplicada por `DeltaTime`.
4.  **Aplicar Rotação:** Use `SetActorRotation()`.

### Código de Implementação

```cpp
// AMovingPlatform.h (Adicionar a variável)

// ...
public:	
    // Variável para a velocidade da plataforma
    UPROPERTY(EditAnywhere, Category = "Movement")
    FVector PlatformVelocity = FVector(100.0f, 0.0f, 0.0f);

    // Variável para a velocidade de rotação
    UPROPERTY(EditAnywhere, Category = "Movement")
    FRotator RotationVelocity = FRotator(0.0f, 45.0f, 0.0f); // 45 graus/segundo no Yaw
// ...
```

```cpp
// AMovingPlatform.cpp (Modificar o Tick)

void AMovingPlatform::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime); 

    // --- Lógica de Rotação ---
    FRotator CurrentRotation = GetActorRotation(); // Obtém a rotação atual
    
    // Calcula a rotação incremental (Velocidade * DeltaTime)
    CurrentRotation += RotationVelocity * DeltaTime; 
    
    SetActorRotation(CurrentRotation); // Aplica a nova rotação
    // -------------------------

    // --- Lógica de Movimento (existente) ---
    FVector CurrentLocation = GetActorLocation(); 
    CurrentLocation = CurrentLocation + PlatformVelocity * DeltaTime; 
    // ... restante do código de movimento ...
}
```

---

## RESUMO DO MÓDULO 13

### O Que Você Aprendeu

✅ Análise profunda de um código funcional da Unreal.  
✅ A interconexão entre Herança, Encapsulamento e `DeltaTime`.  
✅ O uso prático de `FVector` e seus métodos.  
✅ Como estender a funcionalidade de um `AActor` com lógica de rotação.  

### Próximo Passo

O próximo módulo explorará variações e melhorias no código da plataforma móvel, introduzindo conceitos de temporizadores e interpolação.

**Próximo:** Módulo 14: Variações do Projeto
