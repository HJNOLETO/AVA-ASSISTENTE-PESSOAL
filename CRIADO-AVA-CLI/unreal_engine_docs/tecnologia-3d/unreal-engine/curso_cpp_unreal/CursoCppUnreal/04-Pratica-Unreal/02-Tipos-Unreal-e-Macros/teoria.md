# 📚 2. Tipos Unreal e Macros: A Linguagem do Motor

Para escrever código C++ eficiente e compatível com a Unreal Engine, é essencial usar os tipos de dados e as macros que o motor fornece.

## 1. Tipos de Dados da Unreal

A Unreal Engine usa seus próprios tipos de dados para garantir a portabilidade entre plataformas e a compatibilidade com o sistema de reflexão.

### A. Strings

| Tipo Unreal | Equivalente C++ | Descrição |
| :--- | :--- | :--- |
| **`FString`** | `std::string` | String mutável (editável) da Unreal. Usada para manipulação de texto. |
| **`FName`** | N/A | String imutável (somente leitura) e *case-insensitive*. Usada para identificadores (ex: nomes de *sockets*, animações). Extremamente rápida para comparação. |
| **`FText`** | N/A | String localizada (pronta para tradução). Usada para texto que será exibido ao usuário (ex: UI, mensagens de erro). |

**Conversão:** Para converter um literal de string C++ para `FString`, use a macro `TEXT()`:
```cpp
FString Mensagem = TEXT("Olá, Unreal!");
```

### B. Containers

A Unreal Engine fornece seus próprios containers, que são otimizados para o motor e compatíveis com o Garbage Collector.

| Tipo Unreal | Equivalente C++ | Descrição |
| :--- | :--- | :--- |
| **`TArray<T>`** | `std::vector<T>` | Array dinâmico (vetor) da Unreal. O container mais comum. |
| **`TMap<Key, Value>`** | `std::map<Key, Value>` | Mapa de chave-valor da Unreal. |
| **`TSet<T>`** | `std::set<T>` | Conjunto de elementos únicos da Unreal. |

## 2. Macros de Reflexão em Detalhe

As macros de reflexão não apenas marcam o código, mas também aceitam **especificadores** que controlam como o código se comporta no editor e em *runtime*.

### A. `UPROPERTY()`

Usada para marcar variáveis.

| Especificador | Descrição |
| :--- | :--- |
| **`EditAnywhere`** | A variável pode ser editada em qualquer instância do objeto no editor (painel de detalhes). |
| **`VisibleAnywhere`** | A variável é visível no editor, mas não pode ser editada. |
| **`BlueprintReadOnly`** | A variável é acessível (lida) em Blueprints. |
| **`BlueprintReadWrite`** | A variável pode ser lida e escrita em Blueprints. |
| **`Category = "Minha Categoria"`** | Organiza a variável em uma categoria no painel de detalhes. |

```cpp
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Combate")
float DanoBase = 10.0f;
```

### B. `UFUNCTION()`

Usada para marcar métodos.

| Especificador | Descrição |
| :--- | :--- |
| **`BlueprintCallable`** | O método pode ser chamado a partir de Blueprints. |
| **`BlueprintPure`** | O método pode ser chamado a partir de Blueprints, mas não tem efeito colateral (não altera o estado do objeto). |
| **`Server`, `Client`, `NetMulticast`** | Usado para replicação de rede (multiplayer). |

```cpp
UFUNCTION(BlueprintCallable, Category = "Combate")
void AtacarAlvo(AActor* Alvo);
```

### C. `USTRUCT()` e `UENUM()`

Usadas para marcar estruturas e enumerações para o sistema de reflexão.

```cpp
USTRUCT(BlueprintType)
struct FStatus {
    GENERATED_BODY() // Macro obrigatória para structs
    UPROPERTY(EditAnywhere)
    int Vida;
};
```

## 3. A Macro `GENERATED_BODY()`

Esta macro é obrigatória em todas as classes e estruturas que usam macros de reflexão (`UCLASS`, `USTRUCT`, `UENUM`). Ela é expandida pelo Unreal Header Tool (UHT) para incluir o código de reflexão gerado.

```cpp
UCLASS()
class AMinhaClasse : public AActor
{
    GENERATED_BODY() // Deve ser a primeira linha no corpo da classe
    // ...
};
```

## 💡 Resumo

O C++ da Unreal Engine é uma extensão do C++ padrão. Você ainda usa herança, polimorfismo e STL (em contextos não-UObject), mas para interagir com o motor, você deve usar os tipos Unreal (`FString`, `TArray`) e as macros de reflexão (`UCLASS`, `UPROPERTY`, `UFUNCTION`).

---
[Próximo: Exemplos Práticos de Tipos Unreal e Macros &raquo;](exemplos.cpp)
