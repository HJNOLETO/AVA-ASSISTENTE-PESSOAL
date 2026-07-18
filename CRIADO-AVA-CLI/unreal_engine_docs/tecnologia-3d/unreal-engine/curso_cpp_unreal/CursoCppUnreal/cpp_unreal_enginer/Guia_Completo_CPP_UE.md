# Guia Completo de C++ para Unreal Engine: Do Básico à Prática

Este guia foi estruturado para fornecer um caminho de aprendizado didático e encadeado, partindo dos fundamentos do C++ puro e avançando progressivamente para as especificidades do Unreal Engine, incluindo a Programação Orientada a Objetos (POO) e o padrão de codificação da Epic Games.

---

## INTRODUÇÃO: O C++ NO UNIVERSO UNREAL

O C++ é a linguagem de programação principal do Unreal Engine, oferecendo performance e controle de baixo nível. No entanto, o C++ usado no Unreal Engine é uma versão **estendida** do C++ padrão, otimizada para o desenvolvimento de jogos.

### 1. Diferença entre C++ Padrão e C++ para Unreal Engine

O C++ para Unreal Engine (UE C++) é o C++ padrão **turbinado** com o sistema de Reflexão e Garbage Collection do motor, exigindo o uso de tipos e macros específicos para funcionar corretamente dentro do ecossistema do Unreal Engine.

| Característica | C++ Padrão | C++ para Unreal Engine |
|:---|:---|:---|
| **Sistema de Tipos** | Tipos primitivos (`int`, `float`, `std::string`, etc.) | Tipos específicos da UE (`int32`, `float`, `FString`, `FVector`, `FRotator`, etc.) |
| **Memória/Ponteiros** | Gerenciamento manual ou via *smart pointers* da STL. | Ponteiros especiais para `UObject` (`UPROPERTY` e `TObjectPtr`) e *smart pointers* da UE (`TSharedPtr`). |
| **Reflexão** | Não possui um sistema de reflexão nativo. | Possui um sistema de **Reflexão** robusto (Unreal Header Tool - UHT) que gera código para o motor. |
| **Macros** | Uso limitado. | Uso **extensivo** de macros especiais (`UCLASS`, `UPROPERTY`, `UFUNCTION`, `GENERATED_BODY`) para integrar classes e membros ao sistema de Reflexão e ao Editor. |
| **Coleta de Lixo** | Não possui. | Possui um sistema de **Garbage Collection** para objetos que herdam de `UObject`. |
| **Bibliotecas** | Usa a Standard Template Library (STL) (`std::vector`, `std::map`, `std::string`). | Prefere suas próprias bibliotecas (`TArray`, `TMap`, `FString`) para integração com o sistema de Reflexão e otimização. |

### 2. Padrão de Codificação C++ da Epic Games

Seguir o padrão de codificação da Epic Games [1] é **mandatório** para garantir a manutenção e legibilidade do código.

#### 2.1. Convenções de Nomenclatura

*   **PascalCase:** A primeira letra de cada palavra em um nome é capitalizada, sem underscores. Ex: `Health`, `UPrimitiveComponent`.
*   **Prefixos de Tipo:** Tipos são prefixados com uma letra maiúscula para distingui-los de variáveis.
    | Prefixo | Tipo | Exemplo |
    |:---|:---|:---|
    | **T** | Classes Template | `TArray`, `TAttribute` |
    | **U** | Classes que herdam de `UObject` | `UActorComponent` |
    | **A** | Classes que herdam de `AActor` | `AExampleActor` |
    | **F** | Outras classes (Structs, etc.) | `FVector`, `FString` |
    | **E** | Enums | `EColorBits` |
*   **Variáveis Booleanas:** Devem ser prefixadas com `b`. Ex: `bPendingDestruction`.
*   **Parâmetros de Saída:** Parâmetros passados por referência e modificados devem ser prefixados com `Out`. Ex: `void GetLocation(FVector& OutLocation)`.

#### 2.2. Organização de Classes

A organização deve ser pensada para o leitor: o público (`public`) deve vir primeiro, seguido pelo protegido (`protected`) e privado (`private`).

```cpp
UCLASS()
class EXAMPLEPROJECT_API AExampleActor : public AActor
{
    GENERATEDED_BODY()
    
public:	
        // Interface pública (métodos e propriedades acessíveis de fora)

protected:
        // Implementação protegida (acessível por subclasses)

private:
        // Implementação privada (detalhes internos)
};
```

---

## FASE 1: FUNDAMENTOS C++ (Módulos 1 a 3)

Esta fase cobre os fundamentos do C++ puro, essenciais para qualquer programação, incluindo a de jogos.

### Módulo 1: Variáveis e Tipos Básicos (Revisão)

(Conteúdo do `modulo1_completo.md` - Estrutura, Tipos, `cout`, `cin`, Operações)

### Módulo 2: Lógica de Programação (Condicionais e Loops)

#### 2.1. Condicionais (`if/else` e `switch`)

Permitem que o programa tome decisões.

**Exemplo de Jogo: Sistema de Vida**

```cpp
#include <iostream>
using namespace std;

int main() {
    int vida = 30;
    
    if (vida > 50) {
        cout << "Vida alta - Continue lutando!" << endl;
    } else if (vida > 20) {
        cout << "Vida média - Cuidado!" << endl;
    } else {
        cout << "Vida crítica - Use poção!" << endl;
    }
    
    return 0;
}
```

#### Exercício 1: Sistema de Dano (Crescente)

Crie um programa que:
1. Peça o ataque do jogador (int) e a defesa do inimigo (int).
2. **SE** ataque for maior que a defesa **E** a diferença for maior que 10, mostre "Dano Crítico!".
3. **SE** ataque for maior que a defesa, mas a diferença for menor ou igual a 10, mostre "Dano Normal.".
4. **SENÃO**, mostre "Ataque Bloqueado!".

#### 2.2. Loops (`for` e `while`)

Permitem a repetição de código.

**Exemplo de Jogo: Inventário (`for`)**

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string itens[3] = {"Espada", "Poção", "Escudo"};
    
    for (int i = 0; i < 3; i++) {
        cout << "Slot " << i + 1 << ": " << itens[i] << endl;
    }
    
    return 0;
}
```

#### Exercício 2: Combate por Turnos (`while`)

Crie um programa que:
1. Declare `vidaInimigo = 100` e `danoJogador = 20`.
2. Use um loop `while` para simular o combate.
3. A cada iteração, o jogador causa dano e a vida do inimigo é atualizada.
4. O loop deve parar quando `vidaInimigo <= 0`.
5. Mostre a vida restante do inimigo a cada turno e, no final, "Inimigo Derrotado!".

### Módulo 3: Funções

(Conteúdo do `modulo3_completo.md` - `void`, com retorno, parâmetros)

---

## FASE 2: PROGRAMAÇÃO ORIENTADA A OBJETOS (POO)

A POO é o paradigma central do Unreal Engine.

### 3. Programação Orientada a Objetos (POO) em Detalhes

A POO utiliza o conceito de **objetos** para modelar o mundo real, combinando dados (propriedades) e comportamento (métodos).

#### 3.1. Pilares da POO

| Pilar | Conceito | Aplicação em Jogos |
|:---|:---|:---|
| **Encapsulamento** | Agrupar dados e métodos, protegendo dados internos (`private`). | Usar `Getters` e `Setters` para controlar o acesso à vida de um personagem, garantindo que ela nunca seja negativa. |
| **Herança** | Uma classe herda propriedades e métodos de outra. | `ACharacter` herda de `APawn`, que herda de `AActor`. Um `Inimigo` herda de `Personagem`. |
| **Polimorfismo** | Objetos de classes diferentes respondem ao mesmo método de formas distintas. | Um método `Usar()` pode ser implementado de forma diferente por `Espada` e `Arco`. |
| **Abstração** | Mostrar apenas o essencial e esconder a complexidade. | O programador usa `SetActorLocation()` sem precisar saber o código interno que move o objeto no motor. |

#### 3.2. Exercício 3: Criação de Classe (C++ Puro)

Crie uma classe `Arma` em C++ puro que:
1. Tenha um atributo `DanoBase` **privado** (`private int DanoBase;`).
2. Tenha um construtor que inicialize `DanoBase`.
3. Tenha um método `GetDano()` **público** para ler o dano.
4. Tenha um método `SetDano(int NovoDano)` **público** que só permita valores positivos.
5. No `main()`, crie um objeto `Arma` e teste o `SetDano` com um valor negativo e um positivo.

---

## FASE 3: UNREAL ENGINE ESPECÍFICO

Esta fase aplica os conceitos de C++ e POO ao *framework* do Unreal Engine.

### Módulo 7: Transição para Unreal

#### 7.1. Tipos e Macros Essenciais

*   **Tipos:** Use `int32` (em vez de `int`), `FString` (em vez de `std::string`), `FVector`, `FRotator`.
*   **Headers:** Inclua `CoreMinimal.h` e o header específico da classe base (Ex: `GameFramework/Actor.h`).
*   **Macros de Reflexão:**
    *   `UCLASS()`: Torna a classe visível para o motor.
    *   `UPROPERTY()`: Expõe a variável ao Editor ou ao sistema de salvamento.
    *   `UFUNCTION()`: Expõe a função ao Editor ou a Blueprints.

### Módulo 8: Classes Base da Unreal

*   **`AActor`:** A classe base para qualquer objeto que pode ser colocado no mundo do jogo (personagens, luzes, plataformas).
*   **`APawn`:** Um `AActor` que pode ser possuído por um jogador ou IA.
*   **`ACharacter`:** Um `APawn` especializado para personagens humanoides (com malha, movimento e colisões pré-configuradas).
*   **`UActorComponent`:** Um bloco de construção que pode ser anexado a um `AActor` para adicionar funcionalidade (Ex: `USkeletalMeshComponent` para malha, `UParticleSystemComponent` para efeitos).

### Módulo 10: Funções Principais da Unreal

*   **`BeginPlay()`:** Chamado uma única vez quando o jogo começa ou o objeto é *spawnado*. Ideal para inicialização.
*   **`Tick(float DeltaTime)`:** Chamado a cada *frame*. Ideal para lógica de movimento, checagem contínua e atualizações.

### Módulo 11: Matemática para Jogos

O movimento em jogos é sempre calculado com base no tempo para garantir que o movimento seja o mesmo, independentemente da taxa de quadros (FPS).

*   **`DeltaTime`:** O tempo, em segundos, que passou desde o último *frame*.
*   **Cálculo de Movimento:** `NovaPosição = PosiçãoAtual + Velocidade * DeltaTime`
*   **`FVector`:** Representa um ponto no espaço 3D (X, Y, Z) ou uma direção/velocidade.
*   **`FRotator`:** Representa a rotação (Pitch, Yaw, Roll).

---

## FASE 4: PROJETO PRÁTICO E ANÁLISE DE CÓDIGO

### Módulo 13: Análise Detalhada do Código `AMovingPlatform`

O código a seguir, que simula uma plataforma móvel, é um exemplo prático da aplicação de todos os conceitos anteriores.

```cpp
// AMovingPlatform.cpp

// Called every frame
void AMovingPlatform::Tick(float DeltaTime)
{
  Super::Tick(DeltaTime); // 1. Herança e Abstração
  FVector CurrentLocation = GetActorLocation(); // 2. Encapsulamento e Tipos UE
  
  // Velocidade aplicada cada frame
  CurrentLocation = CurrentLocation + PlatformVelocity * DeltaTime; // 3. Matemática para Jogos

  // 4. Checa a distância percorrida
  float DistanceMoved = FVector::Distance(ActorInitialLocation, CurrentLocation); 

  SetActorLocation(CurrentLocation); // 5. Encapsulamento (Setter)

  if (DistanceMoved >= MoveDistance) // 6. Lógica Condicional
  {
    // 7. Inverte a direção
    FVector MoveDirection = PlatformVelocity.GetSafeNormal();
    ActorInitialLocation = ActorInitialLocation + MoveDirection * MoveDistance;
    SetActorLocation(ActorInitialLocation);
    PlatformVelocity = -PlatformVelocity; 
  }
}
```

#### Passo a Passo e Conexão dos Itens

| Linha(s) | Código | Conceito Aplicado | Explicação |
|:---|:---|:---|:---|
| `Super::Tick(DeltaTime);` | Chamada ao método `Tick` da classe base (`AActor`). | **Herança / Abstração** | Garante que a funcionalidade básica da classe pai seja executada. |
| `FVector CurrentLocation = GetActorLocation();` | Obtém a posição atual. | **Encapsulamento / Tipos UE** | `GetActorLocation()` é um *Getter* que acessa a posição interna. `FVector` é o tipo de vetor 3D da Unreal. |
| `CurrentLocation = CurrentLocation + PlatformVelocity * DeltaTime;` | Calcula a nova posição. | **Matemática para Jogos** | O movimento é calculado multiplicando a velocidade pelo `DeltaTime` para garantir a consistência do movimento. |
| `SetActorLocation(CurrentLocation);` | Aplica a nova posição. | **Encapsulamento** | `SetActorLocation()` é o *Setter* que move o objeto no mundo do jogo. |
| `if (DistanceMoved >= MoveDistance)` | Verifica o limite. | **Lógica Condicional** | Usa o `if` (Módulo 2) para decidir se a plataforma deve inverter o movimento. |
| `PlatformVelocity = -PlatformVelocity;` | Inverte a velocidade. | **Comportamento de Objeto** | Inverte o vetor de velocidade, fazendo a plataforma retornar. |

#### Exercício 4: Plataforma com Rotação (Crescente)

Modifique o código da plataforma móvel para adicionar um comportamento de rotação.

1.  **Declare uma nova propriedade:** Adicione um `FRotator` chamado `RotationVelocity` (velocidade de rotação) como um membro da classe `AMovingPlatform`.
2.  **Use o `DeltaTime`:** Dentro do `Tick`, obtenha a rotação atual do ator usando `GetActorRotation()`.
3.  **Calcule a nova rotação:** Adicione a `RotationVelocity` multiplicada por `DeltaTime` à rotação atual.
4.  **Aplique a rotação:** Use `SetActorRotation()` para aplicar a nova rotação.

**Dica:** A adição de `FRotator` é feita com o operador `+` (Ex: `CurrentRotation + RotationVelocity * DeltaTime`).

---

## REFERÊNCIAS

[1] Epic C++ Coding Standard for Unreal Engine. *Epic Games Developer Documentation*. [https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine)

[2] Programming with C++ in Unreal Engine. *Epic Games Developer Documentation*. [https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-with-cplusplus-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-with-cplusplus-in-unreal-engine)
