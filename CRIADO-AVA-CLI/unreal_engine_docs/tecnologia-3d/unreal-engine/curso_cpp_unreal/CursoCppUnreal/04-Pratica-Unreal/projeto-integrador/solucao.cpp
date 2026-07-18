// 💡 Solução Conceitual do Projeto Integrador 4: Sistema de Interação e Inventário

// Este arquivo é conceitual, pois o código C++ da Unreal Engine
// não pode ser compilado fora do ambiente do motor.

#include <iostream>
#include <string>
#include <vector>

using namespace std;

// --- 1. Interface de Interação (IInteractable) ---
// Resposta 1: Como declarar a Interface
/*
class IInteractable
{
public:
    // Função Virtual Pura
    virtual void Interact(AActor* Instigator) = 0;
    virtual ~IInteractable() {}
};
*/

// --- 2. Estrutura de Dados do Item (FItemData) ---
/*
USTRUCT(BlueprintType)
struct FItemData
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Item")
    FName ItemID;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Item")
    FText DisplayName;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Item")
    int32 Quantity = 1;
};
*/

// --- 3. Componente de Inventário (UInventoryComponent) ---
/*
UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
class UInventoryComponent : public UActorComponent
{
    GENERATED_BODY()

private:
    // Resposta 3: Macro e Especificador para Array de Itens
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Inventory")
    TArray<FItemData> Items;

public:
    UFUNCTION(BlueprintCallable, Category = "Inventory")
    void AddItem(FItemData Item)
    {
        // Lógica de adição (ex: empilhar itens, adicionar novo slot)
        Items.Add(Item);
        UE_LOG(LogTemp, Warning, TEXT("Item adicionado: %s"), *Item.DisplayName.ToString());
    }
};
*/

// --- 4. Objeto Interagível (APickupItem) ---
/*
UCLASS()
class APickupItem : public AActor, public IInteractable // Herança Múltipla
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, Category = "Item")
    FItemData ItemData;

    // Implementação da Interface
    void Interact(AActor* Instigator) override
    {
        // Resposta 2: Encontrar o Componente
        // Usa a função FindComponentByClass, que é polimórfica
        UInventoryComponent* InventoryComp = Instigator->FindComponentByClass<UInventoryComponent>();

        if (InventoryComp)
        {
            // Chamada do método do componente
            InventoryComp->AddItem(ItemData);

            // Destruição do Actor (coleta)
            Destroy();
        }
        else
        {
            UE_LOG(LogTemp, Error, TEXT("Instigator não possui UInventoryComponent."));
        }
    }
};
*/

// --- Respostas Conceituais ---
void respostas_conceituais() {
    cout << "--- Respostas Conceituais ---" << endl;

    cout << "1. Como você declararia a Interface IInteractable em C++?" << endl;
    cout << "   R: Usando uma classe abstrata pura com a convenção de nome 'I' e Funções Virtuais Puras." << endl;
    cout << "   Ex: class IInteractable { public: virtual void Interact(AActor* Instigator) = 0; virtual ~IInteractable() {} };" << endl;

    cout << "\n2. Como o método Interact do APickupItem encontraria o UInventoryComponent no Instigator?" << endl;
    cout << "   R: Usando o método polimórfico 'FindComponentByClass<UInventoryComponent>()' no ponteiro do Instigator (AActor*)." << endl;
    cout << "   Ex: UInventoryComponent* Comp = Instigator->FindComponentByClass<UInventoryComponent>();" << endl;

    cout << "\n3. Qual macro e especificador você usaria para expor o array Items do UInventoryComponent para que ele possa ser lido em Blueprints?" << endl;
    cout << "   R: UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = \"Inventory\")" << endl;
    cout << "   'VisibleAnywhere' torna visível no editor, e 'BlueprintReadOnly' permite a leitura em Blueprints." << endl;

    cout << "-----------------------------" << endl;
}

int main() {
    respostas_conceituais();
    return 0;
}
