# Módulo 7 - Transição para Unreal
## FASE 3: UNREAL ENGINE ESPECÍFICO

### Status: 📚 MATERIAL DE ESTUDO

---

## 1. DIFERENÇAS ENTRE C++ PURO E C++ DA UNREAL

O C++ da Unreal Engine (UE C++) é uma extensão do C++ padrão, otimizado para o desenvolvimento de jogos e integrado ao ecossistema do motor. A principal diferença reside no **Sistema de Reflexão** e no **Gerenciamento de Memória**.

| Característica | C++ Padrão | C++ para Unreal Engine |
|:---|:---|:---|
| **Strings** | `std::string` | **`FString`** (para texto mutável), **`FName`** (para identificadores), **`FText`** (para texto localizado). |
| **Vetores** | `std::vector` | **`TArray`** (otimizado para Unreal). |
| **Tipos Numéricos** | `int`, `float`, `double` | **`int32`**, **`float`** (32-bit), **`double`** (64-bit). |
| **Geometria** | Não nativo | **`FVector`**, **`FRotator`**, **`FTransform`**. |
| **Gerenciamento de Memória** | Manual (`new`/`delete`) ou *smart pointers* da STL. | **Garbage Collection** para `UObject` (via `UPROPERTY`), *smart pointers* da UE (`TSharedPtr`). |
| **Reflexão** | Não nativo. | **Macros** (`UCLASS`, `UPROPERTY`, `UFUNCTION`) para expor código ao Editor e Blueprints. |

---

## 2. HEADERS ESSENCIAIS

No Unreal Engine, você não usa `iostream` ou `string` da STL. Você inclui *headers* específicos do motor.

### `CoreMinimal.h`

Este é o *header* mais básico e essencial. Ele inclui a maioria dos tipos fundamentais da Unreal, como `FString`, `TArray`, `int32`, e as macros básicas.

```cpp
#include "CoreMinimal.h" 
// Usado na maioria dos arquivos .h e .cpp
```

### `GameFramework/Actor.h`

Este *header* é necessário para qualquer classe que herde de `AActor`, a classe base para objetos que podem ser colocados no mundo do jogo.

```cpp
#include "GameFramework/Actor.h" 
// Usado em classes de jogo como AMinhaPlataforma.h
```

### Outros Headers Comuns

| Header | Para que serve |
|:---|:---|
| `"Components/StaticMeshComponent.h"` | Para usar o `UStaticMeshComponent`. |
| `"Engine/World.h"` | Para acessar o mundo do jogo (Ex: `GetWorld()`). |
| `"Kismet/GameplayStatics.h"` | Para funções utilitárias de *gameplay* (Ex: `UGameplayStatics::SpawnActor`). |

---

## 3. NAMESPACES: `std` VS `UE`

### C++ Padrão (`std`)

Em C++ puro, é comum usar `using namespace std;` para evitar escrever `std::` antes de cada elemento da Standard Library.

```cpp
// C++ Puro
#include <iostream>
using namespace std; // Evita escrever std::cout
// ... cout << "Olá" << endl;
```

### Unreal Engine

No Unreal Engine, a Epic Games **desencoraja fortemente** o uso de `using namespace std;` ou qualquer `using namespace` em arquivos *header* (`.h`).

*   **Tipos da Unreal:** A maioria dos tipos da Unreal (como `FVector`, `AActor`, `UObject`) não está em um *namespace* específico, mas sim no escopo global ou em *namespaces* implícitos do motor.
*   **Melhor Prática:** Evite `using namespace` em arquivos `.h` para prevenir colisões de nomes. Em arquivos `.cpp`, o uso é mais tolerado, mas muitos desenvolvedores preferem evitar para manter a clareza.

---

## 4. TIPOS DA UNREAL

A Unreal Engine usa seus próprios tipos para garantir portabilidade, tamanho fixo e integração com o sistema de Reflexão.

### Tipos Numéricos e Primitivos

| Tipo Unreal | Tipo C++ Equivalente | Descrição |
|:---|:---|:---|
| **`int8`, `int16`, `int32`, `int64`** | `char`, `short`, `int`, `long long` | Inteiros de tamanho fixo (8, 16, 32, 64 bits). **`int32`** é o mais comum. |
| **`uint8`, `uint16`, `uint32`, `uint64`** | `unsigned` | Inteiros sem sinal. **`uint8`** é frequentemente usado para cores e bytes. |
| **`float`** | `float` | Ponto flutuante de precisão simples (32 bits). |
| **`double`** | `double` | Ponto flutuante de precisão dupla (64 bits). |
| **`bool`** | `bool` | Booleano. |

### Tipos de String

| Tipo Unreal | Descrição | Uso |
|:---|:---|:---|
| **`FString`** | String mutável (pode ser alterada). | Manipulação de texto, logs, nomes de arquivos. |
| **`FName`** | String imutável (não pode ser alterada) e otimizada para comparação rápida. | Identificadores, nomes de componentes, nomes de *sockets*. |
| **`FText`** | String otimizada para localização (tradução). | Qualquer texto que será exibido na interface do usuário (UI). |

### Tipos de Geometria (Structs)

Estes são *structs* que encapsulam dados geométricos e matemáticos.

| Tipo Unreal | Descrição | Exemplo de Uso |
|:---|:---|:---|
| **`FVector`** | Vetor 3D (X, Y, Z). | Posição, direção, velocidade. |
| **`FRotator`** | Rotação (Pitch, Yaw, Roll). | Orientação de um objeto. |
| **`FTransform`** | Combina Posição (`FVector`), Rotação (`FRotator`) e Escala (`FVector`). | Representa a transformação completa de um objeto no mundo. |

---

## EXERCÍCIO: TIPOS DA UNREAL

### Exercício 1: Conversão de Tipos

Crie um programa C++ puro (simulando o uso dos tipos da Unreal) que demonstre a conversão entre tipos de string.

1.  Declare uma `FString` (simulada com `std::string`) para o nome de um item.
2.  Declare um `FName` (simulada com `std::string`) para o ID do item.
3.  Use um `int32` (simulado com `int`) para a quantidade.
4.  Mostre os valores.

<details>
<summary>Simulação da Solução (C++ Puro)</summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

// Simulação dos tipos da Unreal
using FString = std::string;
using FName = std::string;
using int32 = int;

int main() {
    // 1. FString (Nome do Item)
    FString ItemNome = "Espada Longa +1";
    
    // 2. FName (ID do Item)
    FName ItemID = "Sword_001";
    
    // 3. int32 (Quantidade)
    int32 Quantidade = 5;
    
    // 4. Mostra os valores
    cout << "=== FICHA DO ITEM ===" << endl;
    cout << "Nome (FString): " << ItemNome << endl;
    cout << "ID (FName): " << ItemID << endl;
    cout << "Quantidade (int32): " << Quantidade << endl;
    
    // Conversão (Simulada)
    // Na Unreal, você usaria ItemNome.AppendInt(Quantidade)
    FString Descricao = ItemNome + " (x" + std::to_string(Quantidade) + ")";
    cout << "Descrição: " << Descricao << endl;
    
    return 0;
}
```
</details>

---

## RESUMO DO MÓDULO 7

### O Que Você Aprendeu

✅ O C++ da Unreal é uma extensão com tipos e macros específicos.  
✅ Headers essenciais: `CoreMinimal.h` e `GameFramework/Actor.h`.  
✅ Tipos de string da Unreal: `FString`, `FName`, `FText`.  
✅ Tipos de geometria: `FVector`, `FRotator`, `FTransform`.  

### Próximo Passo

O próximo módulo aprofundará as classes base da Unreal, que são o ponto de partida para a Herança no motor.

**Próximo:** Módulo 8: Classes Base da Unreal
