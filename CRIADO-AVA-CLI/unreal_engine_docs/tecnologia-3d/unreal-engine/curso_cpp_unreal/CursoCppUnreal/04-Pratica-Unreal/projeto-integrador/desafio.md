# 🎯 Projeto Integrador 4: Sistema de Interação e Inventário (Conceitual)

## Desafio: Projetar um Sistema de Interação e Inventário

Este projeto integrador final é um exercício de design de classes C++ para Unreal Engine, aplicando todos os conceitos do curso.

Você deve projetar as classes e interfaces necessárias para um sistema onde o jogador pode interagir com objetos no mundo para coletar itens e adicioná-los ao seu inventário.

### Requisitos

1.  **Interface de Interação (`IInteractable`):**
    *   Crie uma Interface (Classe Abstrata Pura) chamada `IInteractable`.
    *   Deve ter uma **Função Virtual Pura** chamada `Interact(AActor* Instigator)` que não retorna nada.

2.  **Estrutura de Dados do Item (`FItemData`):**
    *   Crie uma `USTRUCT` chamada `FItemData` (para ser usada em Blueprints).
    *   Deve conter: `FName ItemID`, `FText DisplayName`, `int32 Quantity`.

3.  **Componente de Inventário (`UInventoryComponent`):**
    *   Crie um `UActorComponent` chamado `UInventoryComponent`.
    *   Deve ter um `UPROPERTY` privado que armazene um `TArray<FItemData>` chamado `Items`.
    *   Deve ter um `UFUNCTION(BlueprintCallable)` chamado `AddItem(FItemData Item)`.

4.  **Objeto Interagível (`APickupItem`):**
    *   Crie um `AActor` chamado `APickupItem` que **implemente a Interface `IInteractable`**.
    *   Deve ter um `UPROPERTY(EditAnywhere)` que armazene a `FItemData` que ele representa.
    *   Deve implementar o método `Interact(AActor* Instigator)`:
        *   Dentro de `Interact`, ele deve tentar encontrar o `UInventoryComponent` no `Instigator` (o jogador).
        *   Se o componente for encontrado, ele deve chamar `AddItem` com a `FItemData` do item.
        *   Após a coleta, o `APickupItem` deve se autodestruir (`Destroy()`).

### Responda (Conceitualmente)

1.  Como você declararia a Interface `IInteractable` em C++?
2.  Como o método `Interact` do `APickupItem` encontraria o `UInventoryComponent` no `Instigator`?
3.  Qual macro e especificador você usaria para expor o array `Items` do `UInventoryComponent` para que ele possa ser lido em Blueprints?

---
[Próximo: Solução do Projeto Integrador &raquo;](solucao.cpp)
