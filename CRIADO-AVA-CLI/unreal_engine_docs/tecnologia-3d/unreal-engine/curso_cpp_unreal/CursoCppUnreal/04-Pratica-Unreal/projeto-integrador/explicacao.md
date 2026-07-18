# 💡 Explicação da Solução: Sistema de Interação e Inventário

Este projeto final é um exercício de design que demonstra como os conceitos de C++ e POO se traduzem em um sistema funcional na Unreal Engine.

## Conceitos Aplicados

1.  **Abstração e Interface (`IInteractable`):**
    *   A Interface `IInteractable` define um contrato de comportamento: qualquer objeto que a implemente sabe como ser interagido.
    *   Isso permite que o código do jogador chame `Target->Interact(...)` sem se importar se o alvo é um baú, uma porta ou um item de coleta.

2.  **Encapsulamento e Tipos Unreal (`UInventoryComponent`):**
    *   O `UInventoryComponent` encapsula a lógica e os dados do inventário (`TArray<FItemData> Items`).
    *   O array `Items` é marcado com `UPROPERTY(BlueprintReadOnly)` para ser lido em Blueprints, mas o método `AddItem` é a única forma de modificá-lo, garantindo o controle sobre a lógica de adição.
    *   O uso de `TArray` e `FItemData` garante a compatibilidade com o sistema de reflexão e serialização da Unreal.

3.  **Herança Múltipla e Polimorfismo (`APickupItem`):**
    *   O `APickupItem` herda de `AActor` (para ser um objeto no mundo) e implementa `IInteractable` (para ter o comportamento de interação).
    *   O método `Interact` demonstra o polimorfismo ao usar `Instigator->FindComponentByClass<UInventoryComponent>()`. Este método é a forma correta na Unreal de buscar um componente em um `AActor`, e é um exemplo de como a Unreal usa o polimorfismo internamente.

## Fluxo de Execução (Conceitual)

1.  **Jogador Interage:** O código do jogador (ex: `AFPSCharacter`) detecta um `AActor` próximo.
2.  **Verificação de Interface:** O jogador verifica se o `AActor` implementa `IInteractable`.
3.  **Chamada Polimórfica:** O jogador chama `Target->Interact(this)`.
4.  **Execução da Lógica:** O método `Interact` do `APickupItem` é executado.
5.  **Busca de Componente:** O `APickupItem` usa `FindComponentByClass` no jogador para obter o `UInventoryComponent`.
6.  **Transferência de Dados:** O `APickupItem` chama `InventoryComp->AddItem(...)` e se destrói.

Este design é robusto, flexível e segue as melhores práticas do C++ e da Unreal Engine, preparando o desenvolvedor para a criação de sistemas de jogo complexos.

---
[Próximo: Revisão Final e Entrega &raquo;](../../index.html)
