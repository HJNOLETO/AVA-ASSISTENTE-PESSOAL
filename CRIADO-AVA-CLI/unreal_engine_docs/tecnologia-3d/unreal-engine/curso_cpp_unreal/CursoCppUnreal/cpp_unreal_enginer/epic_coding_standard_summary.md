# Padrão de Codificação C++ da Epic Games e Diferenças para Unreal Engine

## 1. Padrão de Codificação C++ da Epic Games (Mandatório)

O padrão de codificação da Epic Games é fundamental para a manutenção e legibilidade do código no Unreal Engine.

### 1.1. Convenções de Nomenclatura

*   **PascalCase:** A primeira letra de cada palavra em um nome (tipo ou variável) é capitalizada, sem underscores. Ex: `Health`, `UPrimitiveComponent`.
*   **Prefixos de Tipo:** Tipos são prefixados com uma letra maiúscula para distingui-los de variáveis.
    | Prefixo | Tipo | Exemplo |
    |:---|:---|:---|
    | **T** | Classes Template | `TArray`, `TAttribute` |
    | **U** | Classes que herdam de `UObject` | `UActorComponent` |
    | **A** | Classes que herdam de `AActor` | `AExampleActor` |
    | **S** | Classes que herdam de `SWidget` | `SCompoundWidget` |
    | **I** | Interfaces Abstratas | `IAnalyticsProvider` |
    | **E** | Enums | `EColorBits` |
    | **F** | Outras classes (Structs, etc.) | `FVector`, `FString` |
*   **Variáveis Booleanas:** Devem ser prefixadas com `b`. Ex: `bPendingDestruction`, `bHasFadedIn`.
*   **Parâmetros de Função:**
    *   Funções que retornam `bool` devem ser perguntas (Ex: `IsVisible()`).
    *   Parâmetros de saída (passados por referência e modificados) devem ser prefixados com `Out` (Ex: `void GetLocation(FVector& OutLocation)`).
*   **Declaração de Variáveis:** Cada variável deve ser declarada em sua própria linha para permitir comentários individuais.

### 1.2. Organização de Classes

*   **Ordem de Seções:** A organização deve ser pensada para o leitor. O público (`public`) deve vir primeiro, seguido pelo protegido (`protected`) e privado (`private`).
    ```cpp
    UCLASS()
    class EXAMPLEPROJECT_API AExampleActor : public AActor
    {
        GENERATED_BODY()
        
    public:	
            // Interface pública
    
    protected:
            // Implementação protegida
    
    private:
            // Implementação privada
    };
    ```

## 2. Diferenças entre C++ Padrão e C++ para Unreal Engine

O C++ da Unreal Engine (UE C++) é uma extensão do C++ padrão, otimizado para o desenvolvimento de jogos e integrado ao ecossistema do motor.

| Característica | C++ Padrão | C++ para Unreal Engine |
|:---|:---|:---|
| **Sistema de Tipos** | Tipos primitivos (`int`, `float`, `std::string`, etc.) | Tipos específicos da UE (`int32`, `float`, `FString`, `FVector`, `FRotator`, etc.) |
| **Memória/Ponteiros** | Ponteiros brutos (`*`), `std::shared_ptr`, `std::unique_ptr`. Gerenciamento manual ou via *smart pointers*. | Ponteiros brutos, mas principalmente *smart pointers* da UE (`TSharedPtr`, `TWeakObjectPtr`) e ponteiros especiais para `UObject` (`UPROPERTY` e `TObjectPtr`). |
| **Reflexão** | Não possui um sistema de reflexão nativo (precisa de bibliotecas externas). | Possui um sistema de **Reflexão** robusto (Unreal Header Tool - UHT) que gera código para o motor. |
| **Macros** | Uso limitado, geralmente para compilação condicional. | Uso **extensivo** de macros especiais (`UCLASS`, `UPROPERTY`, `UFUNCTION`, `GENERATED_BODY`) para integrar classes e membros ao sistema de Reflexão e ao Editor. |
| **Coleta de Lixo** | Não possui. O programador gerencia a memória. | Possui um sistema de **Garbage Collection** para objetos que herdam de `UObject`, gerenciando automaticamente a memória desses objetos. |
| **Bibliotecas** | Usa a Standard Template Library (STL) (`std::vector`, `std::map`, `std::string`). | Prefere suas próprias bibliotecas (`TArray`, `TMap`, `FString`) para integração com o sistema de Reflexão e otimização. |

### 2.1. O Papel das Macros da Unreal

As macros da Unreal (como `UCLASS`, `UPROPERTY`, `UFUNCTION`) são a principal diferença. Elas não são C++ padrão; são marcadores que o **Unreal Header Tool (UHT)** lê para gerar código C++ adicional.

*   **`UCLASS()`:** Marca uma classe para ser reconhecida pelo sistema de Reflexão da Unreal, permitindo que ela seja usada no Editor, em Blueprints e no sistema de Garbage Collection.
*   **`UPROPERTY()`:** Marca uma variável para ser exposta ao Editor (para edição), ao sistema de serialização (salvamento/carregamento) e ao Garbage Collection.
*   **`UFUNCTION()`:** Marca uma função para ser chamada a partir de Blueprints, ou para ser usada como um *Delegate* (evento).

**Conclusão:** O C++ para Unreal Engine é o C++ padrão **turbinado** com o sistema de Reflexão e Garbage Collection do motor, exigindo o uso de tipos e macros específicos para funcionar corretamente dentro do ecossistema do Unreal Engine.
