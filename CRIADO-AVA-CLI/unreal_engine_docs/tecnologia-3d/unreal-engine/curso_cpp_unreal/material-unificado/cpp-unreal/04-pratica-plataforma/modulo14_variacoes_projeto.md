# Módulo 14 - Variações do Projeto
## FASE 4: PROJETO PRÁTICO

### Status: 📚 MATERIAL DE ESTUDO

---

## 1. FAZER PLATAFORMA PARAR POR 2 SEGUNDOS

A plataforma móvel básica (Módulo 13) inverte a direção instantaneamente. Para adicionar um atraso, usaremos o sistema de **Temporizadores** (`FTimerHandle`) da Unreal Engine.

### Conceito: Temporizadores (`FTimerHandle`)

O `FTimerHandle` é um identificador que permite agendar a execução de uma função uma ou várias vezes após um certo período. É a maneira mais eficiente de lidar com atrasos no Unreal Engine, pois não exige que o código fique checando a cada *frame* no `Tick()`.

### Implementação

1.  **Variáveis:**
    *   `FTimerHandle MoveTimerHandle`: O identificador do temporizador.
    *   `float StopDuration = 2.0f`: Duração da parada.
    *   `bool bIsMoving = true`: Variável de estado para controlar o movimento.
2.  **Lógica no `Tick()`:** O movimento só ocorre se `bIsMoving` for `true`.
3.  **Nova Função:** `void HandleMovementStop()`: Inverte a velocidade e agenda o reinício do movimento.

```cpp
// AMovingPlatform.h (Adicionar variáveis e funções)

// ...
protected:
    // ... outras variáveis ...
    
    UPROPERTY(EditAnywhere, Category = "Movement")
    float StopDuration = 2.0f;

    bool bIsMoving = true;

    FTimerHandle MoveTimerHandle;

    void HandleMovementStop();
    void HandleMovementStart();
// ...
```

```cpp
// AMovingPlatform.cpp (Modificar Tick e adicionar funções)

void AMovingPlatform::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    if (!bIsMoving) // Se não estiver movendo, sai do Tick
    {
        return;
    }

    // ... lógica de movimento existente ...

    if (DistanceMoved >= MoveDistance)
    {
        // 1. Para o movimento
        bIsMoving = false;
        
        // 2. Inverte a velocidade
        PlatformVelocity = -PlatformVelocity;
        
        // 3. Agenda o reinício do movimento após StopDuration
        GetWorldTimerManager().SetTimer(
            MoveTimerHandle, 
            this, 
            &AMovingPlatform::HandleMovementStart, 
            StopDuration, 
            false // Não repetir
        );
    }
}

void AMovingPlatform::HandleMovementStart()
{
    bIsMoving = true;
}
```

---

## 2. FAZER PLATAFORMA SE MOVER EM CÍRCULO

Para um movimento circular, a plataforma precisa de uma lógica de rotação constante e um cálculo de posição baseado em funções trigonométricas (seno e cosseno).

### Conceito: Seno e Cosseno

*   **Cosseno:** Controla a posição X (ou Y) em um círculo.
*   **Seno:** Controla a posição Y (ou X) em um círculo.

### Implementação

1.  **Variáveis:**
    *   `float Radius = 500.0f`: Raio do círculo.
    *   `float Angle = 0.0f`: Ângulo atual (em radianos).
    *   `float RotationSpeed = 1.0f`: Velocidade de rotação (em radianos/segundo).
2.  **Lógica no `Tick()`:**

```cpp
// AMovingPlatform.h (Adicionar variáveis)

// ...
protected:
    FVector InitialLocation;
    float Radius = 500.0f;
    float Angle = 0.0f;
    float RotationSpeed = 1.0f; // 1 radiano por segundo
// ...

// AMovingPlatform.cpp (No BeginPlay)
void AMovingPlatform::BeginPlay()
{
    Super::BeginPlay();
    InitialLocation = GetActorLocation();
}

// AMovingPlatform.cpp (No Tick)
void AMovingPlatform::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    // 1. Atualiza o ângulo
    Angle += RotationSpeed * DeltaTime;

    // 2. Calcula a nova posição X e Y usando seno e cosseno
    float X = FMath::Cos(Angle) * Radius;
    float Y = FMath::Sin(Angle) * Radius;

    // 3. Cria o novo vetor de posição
    FVector NewLocation = InitialLocation;
    NewLocation.X += X;
    NewLocation.Y += Y;

    // 4. Aplica a nova posição
    SetActorLocation(NewLocation);
}
```

---

## 3. FAZER PLATAFORMA ACELERAR/DESACELERAR SUAVEMENTE

Para um movimento suave, usamos a técnica de **Interpolação Linear (Lerp)** ou funções de **Curva de Tensão (Ease)**.

### Conceito: Interpolação (Lerp)

A Interpolação Linear (`FMath::Lerp`) calcula um ponto entre dois valores (A e B) com base em um fator (Alpha) que varia de 0.0 a 1.0.

*   `Alpha = 0.0`: Retorna A.
*   `Alpha = 1.0`: Retorna B.
*   `Alpha = 0.5`: Retorna o ponto médio entre A e B.

### Implementação

1.  **Variáveis:**
    *   `FVector StartPoint`, `FVector EndPoint`.
    *   `float InterpSpeed = 0.5f`: Velocidade de interpolação.
2.  **Lógica no `Tick()`:**

```cpp
// AMovingPlatform.h (Adicionar variáveis)

// ...
protected:
    FVector StartPoint;
    FVector EndPoint;
    float InterpSpeed = 0.5f;
    float Alpha = 0.0f;
// ...

// AMovingPlatform.cpp (No BeginPlay)
void AMovingPlatform::BeginPlay()
{
    Super::BeginPlay();
    StartPoint = GetActorLocation();
    // Exemplo: EndPoint 1000 unidades à frente
    EndPoint = StartPoint + FVector(1000.0f, 0.0f, 0.0f); 
}

// AMovingPlatform.cpp (No Tick)
void AMovingPlatform::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    // 1. Atualiza o Alpha
    Alpha += DeltaTime * InterpSpeed;

    // 2. Garante que Alpha não passe de 1.0
    if (Alpha > 1.0f)
    {
        Alpha = 0.0f; // Reinicia o movimento
        // Troca StartPoint e EndPoint para ir e voltar
        FVector Temp = StartPoint;
        StartPoint = EndPoint;
        EndPoint = Temp;
    }

    // 3. Interpola a posição
    FVector NewLocation = FMath::Lerp(StartPoint, EndPoint, Alpha);

    // 4. Aplica a nova posição
    SetActorLocation(NewLocation);
}
```

---

## RESUMO DO MÓDULO 14

### O Que Você Aprendeu

✅ **Temporizadores (`FTimerHandle`):** Para atrasos e agendamento de funções.  
✅ **Movimento Circular:** Uso de `FMath::Cos` e `FMath::Sin`.  
✅ **Movimento Suave:** Uso de **Interpolação Linear (`FMath::Lerp`)**.  

### Próximo Passo

Todos os módulos do *roadmap* foram criados. O próximo passo é compilar todo o material em um documento final e entregá-lo.

**Próximo:** Compilar e Entregar o Material Final
