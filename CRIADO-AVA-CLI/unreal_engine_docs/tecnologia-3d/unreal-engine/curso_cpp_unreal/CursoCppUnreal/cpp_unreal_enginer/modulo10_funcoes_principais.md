# Módulo 10 - Funções Principais da Unreal
## FASE 3: UNREAL ENGINE ESPECÍFICO

### Status: 📚 MATERIAL DE ESTUDO

---

## 1. CICLO DE VIDA DO `AACTOR`

Todo `AActor` (Módulo 8) no Unreal Engine passa por um ciclo de vida bem definido, com funções específicas que são chamadas em momentos cruciais. As duas funções mais importantes para a lógica de *gameplay* são `BeginPlay()` e `Tick()`.

---

## 2. `BeginPlay()`: QUANDO E COMO USAR

### Teoria

A função **`BeginPlay()`** é chamada uma única vez para cada `AActor` no mundo, logo após ele ser *spawnado* (criado) e ter seus componentes inicializados.

*   **Propósito:** Ideal para inicialização de variáveis, configuração inicial, registro de eventos, ou qualquer lógica que só precise ser executada uma vez no início do jogo.
*   **Sobrescrita:** Você deve sobrescrever esta função na sua classe derivada (usando `override`) e **sempre** chamar a versão da classe base (`Super::BeginPlay()`).

### Exemplo de Uso

```cpp
// AMinhaClasse.cpp

void AMinhaClasse::BeginPlay()
{
    // ⚠️ SEMPRE chame a versão da classe base primeiro!
    Super::BeginPlay(); 

    // Lógica de inicialização:
    
    // 1. Definir a posição inicial (se não for feito no construtor)
    FVector PosicaoInicial = GetActorLocation();
    
    // 2. Imprimir uma mensagem de log (apenas para debug)
    UE_LOG(LogTemp, Warning, TEXT("MinhaClasse %s começou a jogar!"), *GetName());
    
    // 3. Iniciar um temporizador
    // GetWorldTimerManager().SetTimer(MeuTimerHandle, this, &AMinhaClasse::MinhaFuncao, 5.0f, false);
}
```

---

## 3. `Tick(float DeltaTime)`: MOVIMENTO FRAME A FRAME

### Teoria

A função **`Tick(float DeltaTime)`** é chamada a cada *frame* do jogo, desde o momento em que o `AActor` é *spawnado* até ser destruído.

*   **Propósito:** Contém a lógica que precisa ser atualizada continuamente, como movimento, rotação, checagem de proximidade, ou qualquer lógica que dependa do tempo.
*   **`DeltaTime`:** O parâmetro `DeltaTime` é um `float` que representa o tempo, em segundos, que passou desde o último *frame*. Ele é crucial para garantir que a lógica de movimento seja suave e independente da taxa de quadros (FPS).
*   **Sobrescrita:** Você deve sobrescrever esta função e **sempre** chamar a versão da classe base (`Super::Tick(DeltaTime)`).

### Exemplo de Uso (Movimento Simples)

```cpp
// AMinhaClasse.cpp

void AMinhaClasse::Tick(float DeltaTime)
{
    // ⚠️ SEMPRE chame a versão da classe base primeiro!
    Super::Tick(DeltaTime); 

    // 1. Obter a posição atual
    FVector CurrentLocation = GetActorLocation();
    
    // 2. Definir a velocidade (Ex: 100 unidades por segundo no eixo X)
    FVector Velocidade = FVector(100.0f, 0.0f, 0.0f);
    
    // 3. Calcular o deslocamento (Velocidade * Tempo)
    FVector Deslocamento = Velocidade * DeltaTime;
    
    // 4. Aplicar o deslocamento à posição atual
    CurrentLocation += Deslocamento;
    
    // 5. Aplicar a nova posição
    SetActorLocation(CurrentLocation);
}
```

---

## 4. `GetActorLocation` E `SetActorLocation`

Estas são as funções de **Encapsulamento** (Módulo 5) mais básicas para manipular a posição de um `AActor`.

| Função | Tipo | Descrição | Conceito POO |
|:---|:---|:---|:---|
| **`FVector GetActorLocation() const`** | Getter | Retorna a posição atual do `AActor` no mundo. | Encapsulamento (Leitura) |
| **`void SetActorLocation(const FVector& NewLocation, ...)`** | Setter | Define a nova posição do `AActor` no mundo. | Encapsulamento (Escrita) |

### Exemplo Prático

```cpp
// No Tick()
FVector PosicaoAtual = GetActorLocation(); // Lê a posição
PosicaoAtual.Z += 1.0f * DeltaTime;       // Move 1 unidade/segundo para cima
SetActorLocation(PosicaoAtual);           // Aplica a nova posição
```

---

## EXERCÍCIO: PLATAFORMA MÓVEL SIMPLES

### Exercício 1: Implementação da Plataforma

Crie a lógica básica de uma plataforma que se move constantemente em uma direção.

1.  **Classe:** `AMovingPlatform` (herda de `AActor`).
2.  **Variáveis:**
    *   `FVector PlatformVelocity` (Velocidade e direção da plataforma).
3.  **Implementação:**
    *   No `Tick()`, use `GetActorLocation()`, `PlatformVelocity`, `DeltaTime` e `SetActorLocation()` para mover a plataforma.

<details>
<summary>Ver Solução (AMovingPlatform.h)</summary>

```cpp
// AMovingPlatform.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MovingPlatform.generated.h"

UCLASS()
class AMovingPlatform : public AActor
{
    GENERATED_BODY()

public:	
    AMovingPlatform();

protected:
    virtual void BeginPlay() override;

public:	
    virtual void Tick(float DeltaTime) override;

    // Variável para a velocidade da plataforma
    UPROPERTY(EditAnywhere, Category = "Movement")
    FVector PlatformVelocity = FVector(100.0f, 0.0f, 0.0f); // 100 unidades/segundo no eixo X
};
```
</details>

<details>
<summary>Ver Solução (AMovingPlatform.cpp - Tick)</summary>

```cpp
// AMovingPlatform.cpp

void AMovingPlatform::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    // 1. Obter a posição atual
    FVector CurrentLocation = GetActorLocation();
    
    // 2. Calcular o deslocamento e aplicar
    CurrentLocation += PlatformVelocity * DeltaTime;
    
    // 3. Aplicar a nova posição
    SetActorLocation(CurrentLocation);
}
```
</details>

---

## RESUMO DO MÓDULO 10

### O Que Você Aprendeu

✅ **`BeginPlay()`:** Para inicialização única.  
✅ **`Tick(DeltaTime)`:** Para lógica contínua (movimento, checagens).  
✅ **`DeltaTime`:** Essencial para movimento suave e independente de FPS.  
✅ **`GetActorLocation()` / `SetActorLocation()`:** Funções de Encapsulamento para manipulação de posição.  

### Próximo Passo

O próximo módulo aprofundará a matemática por trás do movimento, focando nos tipos `FVector` e `FRotator`.

**Próximo:** Módulo 11: Matemática para Jogos
