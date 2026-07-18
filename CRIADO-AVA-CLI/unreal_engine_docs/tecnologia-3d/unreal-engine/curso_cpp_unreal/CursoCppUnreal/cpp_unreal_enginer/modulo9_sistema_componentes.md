# Módulo 9 - Sistema de Componentes
## FASE 3: UNREAL ENGINE ESPECÍFICO

### Status: 📚 MATERIAL DE ESTUDO

---

## 1. O QUE É UM COMPONENTE?

### Teoria

O Sistema de Componentes da Unreal Engine é a principal forma de adicionar funcionalidade e representação visual a um `AActor`. Ele implementa o **Padrão de Design Componente**, que favorece a **Composição** sobre a **Herança** (Módulo 5).

*   **Composição:** Em vez de herdar de uma classe que faz tudo, você *compõe* um objeto anexando pequenos blocos de funcionalidade (componentes).
*   **Vantagem:** Flexibilidade. Um `AActor` pode ter um componente de movimento, um componente de som e um componente de inventário, todos trabalhando juntos.

### Tipos Principais de Componentes

| Componente | Classe Base | Descrição |
|:---|:---|:---|
| **`UActorComponent`** | `UObject` | Classe base para qualquer componente. Não tem representação física no mundo. Ex: `UHealthComponent`, `UInventoryComponent`. |
| **`USceneComponent`** | `UActorComponent` | Classe base para componentes que **têm uma localização e transformação** no mundo. Pode ser anexado a outros `USceneComponent`s para formar uma hierarquia. |
| **`UPrimitiveComponent`** | `USceneComponent` | Classe base para componentes que têm uma **representação geométrica** (malha, colisão). Ex: `UStaticMeshComponent`, `UCapsuleComponent`. |

---

## 2. `USceneComponent`

O `USceneComponent` é o componente mais importante para a organização visual de um `AActor`.

*   **Função:** Define a localização, rotação e escala de um objeto no mundo.
*   **Hierarquia:** Todo `AActor` deve ter um `USceneComponent` como **Componente Raiz** (`Root Component`). Todos os outros componentes visuais são anexados a ele.

### Exemplo: Definindo o Componente Raiz

```cpp
// No construtor da sua classe AActor (Ex: AMinhaPlataforma::AMinhaPlataforma())

// Cria o componente raiz (um componente de cena simples)
USceneComponent* Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));

// Define o componente como a raiz do Actor
RootComponent = Root; 
```

---

## 3. `UStaticMeshComponent`

O `UStaticMeshComponent` é um tipo de `UPrimitiveComponent` usado para renderizar malhas estáticas (objetos que não se deformam, como paredes, rochas, ou a malha de uma plataforma).

*   **Função:** Adiciona a representação visual de uma malha estática ao `AActor`.
*   **Configuração:** Permite definir a malha, o material e as configurações de colisão.

### Exemplo: Adicionando uma Malha

```cpp
// No construtor da sua classe AActor

// 1. Incluir o header
#include "Components/StaticMeshComponent.h" 

// 2. Criar o componente
UStaticMeshComponent* Mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("PlatformMesh"));

// 3. Anexar à Raiz
Mesh->SetupAttachment(RootComponent); 

// 4. Configurar a malha (geralmente feito no Blueprint ou no Editor)
// Mesh->SetStaticMesh(MinhaMalha); 
```

---

## 4. ANEXAR COMPONENTES (`SetupAttachment`)

A função **`SetupAttachment()`** é usada no construtor de um `AActor` para criar a hierarquia de componentes.

*   **Sintaxe:** `ComponenteFilho->SetupAttachment(ComponentePai);`
*   **Regra:** Um componente só pode ser anexado a um `USceneComponent` ou a uma subclasse dele.

### Exemplo de Hierarquia

Imagine um canhão em uma torre.

1.  **Componente Raiz:** `USceneComponent` (posição da torre).
2.  **Base da Torre:** `UStaticMeshComponent` (anexado à Raiz).
3.  **Canhão:** `UStaticMeshComponent` (anexado à Base da Torre).
4.  **Ponto de Disparo:** `USceneComponent` (anexado ao Canhão, usado para *spawnar* projéteis).

```cpp
// No construtor
USceneComponent* Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
RootComponent = Root;

UStaticMeshComponent* Base = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Base"));
Base->SetupAttachment(Root); // Base anexada à Raiz

UStaticMeshComponent* Canhao = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Canhao"));
Canhao->SetupAttachment(Base); // Canhão anexado à Base

USceneComponent* PontoDisparo = CreateDefaultSubobject<USceneComponent>(TEXT("PontoDisparo"));
PontoDisparo->SetupAttachment(Canhao); // Ponto de Disparo anexado ao Canhão
```

---

## EXERCÍCIO: CRIAR ACTOR COM MÚLTIPLOS COMPONENTES

### Exercício 1: Actor com Câmera e Malha

Crie um `AActor` simples que represente um objeto de observação, utilizando a hierarquia de componentes.

1.  **Classe:** `AObservador` (herda de `AActor`).
2.  **Componentes:**
    *   `USceneComponent` como **RootComponent**.
    *   `UStaticMeshComponent` (para a malha visual).
    *   `UCameraComponent` (para simular uma câmera).
3.  **Hierarquia:** A Malha e a Câmera devem ser anexadas ao **RootComponent**.

<details>
<summary>Ver Solução (Arquivo .h)</summary>

```cpp
// AObservador.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/StaticMeshComponent.h" // Para UStaticMeshComponent
#include "Camera/CameraComponent.h"        // Para UCameraComponent
#include "Observador.generated.h"

UCLASS()
class AObservador : public AActor
{
    GENERATED_BODY()

public:	
    AObservador();

private:
    // Componentes devem ser ponteiros UPROPERTY para o Garbage Collector
    UPROPERTY(VisibleAnywhere, Category = "Components")
    UStaticMeshComponent* MeshComponent;

    UPROPERTY(VisibleAnywhere, Category = "Components")
    UCameraComponent* CameraComponent;
};
```
</details>

<details>
<summary>Ver Solução (Arquivo .cpp - Construtor)</summary>

```cpp
// AObservador.cpp

#include "Observador.h"

AObservador::AObservador()
{
    // 1. Cria o Componente Raiz
    USceneComponent* Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    // 2. Cria a Malha e anexa à Raiz
    MeshComponent = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));
    MeshComponent->SetupAttachment(RootComponent);

    // 3. Cria a Câmera e anexa à Raiz
    CameraComponent = CreateDefaultSubobject<UCameraComponent>(TEXT("Camera"));
    CameraComponent->SetupAttachment(RootComponent);

    // Opcional: Ajusta a posição da câmera
    CameraComponent->SetRelativeLocation(FVector(0.0f, 0.0f, 50.0f));
}
```
</details>

---

## RESUMO DO MÓDULO 9

### O Que Você Aprendeu

✅ O Sistema de Componentes favorece a **Composição**.  
✅ **`UActorComponent`** é a base para funcionalidades.  
✅ **`USceneComponent`** é a base para componentes com transformação (localização, rotação).  
✅ **`UStaticMeshComponent`** adiciona a representação visual.  
✅ **`SetupAttachment()`** cria a hierarquia de componentes.  

### Próximo Passo

O próximo módulo abordará as funções essenciais do ciclo de vida de um `AActor`, preparando o terreno para a lógica de *gameplay*.

**Próximo:** Módulo 10: Funções Principais da Unreal
