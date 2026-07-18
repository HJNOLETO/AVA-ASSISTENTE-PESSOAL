# 📚 3. Projeto Final FPS: Aplicando C++ na Unreal

O Projeto Final é um guia conceitual para a criação de um sistema básico de *First Person Shooter (FPS)*, aplicando todos os conceitos de C++ e Unreal aprendidos.

## 1. Estrutura do Projeto

Um projeto FPS básico em C++ na Unreal Engine requer a criação e modificação de algumas classes principais:

| Classe | Herança | Propósito | Conceitos C++ Aplicados |
| :--- | :--- | :--- | :--- |
| **`AFPSCharacter`** | `ACharacter` | O personagem principal, responsável pelo movimento e entrada do jogador. | Herança, Sobrescrita (`SetupPlayerInputComponent`). |
| **`AFPSWeapon`** | `AActor` | A arma que o personagem segura, responsável pela lógica de tiro e dano. | Classes, Encapsulamento, Funções. |
| **`UHealthComponent`** | `UActorComponent` | Um componente reutilizável para gerenciar a vida de qualquer `AActor`. | Classes, Encapsulamento (Getters/Setters), Componentes. |
| **`AFPSGameMode`** | `AGameModeBase` | Regras do jogo (ex: *respawn*, pontuação). | Herança, Polimorfismo. |

## 2. Implementação do `UHealthComponent` (Encapsulamento)

O componente de saúde é um excelente exemplo de Encapsulamento e Reutilização.

### A. Header (`.h`)

```cpp
// UHealthComponent.h
UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
class UHealthComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    // Atributo privado, exposto apenas para leitura em Blueprints
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Health")
    float Health = 100.0f;

    // UFUNCTION para receber dano (BlueprintCallable)
    UFUNCTION(BlueprintCallable, Category = "Health")
    void TakeDamage(float DamageAmount);

    // Getter para a vida (BlueprintPure)
    UFUNCTION(BlueprintPure, Category = "Health")
    float GetHealth() const { return Health; }
};
```

### B. Source (`.cpp`)

```cpp
// UHealthComponent.cpp
void UHealthComponent::TakeDamage(float DamageAmount)
{
    if (DamageAmount <= 0.0f) return;

    Health -= DamageAmount;
    if (Health <= 0.0f)
    {
        Health = 0.0f;
        // Lógica de Morte (ex: Broadcast de um Delegate)
        UE_LOG(LogTemp, Warning, TEXT("Actor morreu!"));
    }
}
```

## 3. Implementação da Arma (`AFPSWeapon`) (Classes e Herança)

A arma é um `AActor` que será anexado ao personagem.

```cpp
// AFPSWeapon.h
UCLASS()
class AFPSWeapon : public AActor
{
    GENERATED_BODY()

public:
    // UPROPERTY para configurar o dano no editor
    UPROPERTY(EditAnywhere, Category = "Combat")
    float Damage = 20.0f;

    // UFUNCTION para a lógica de tiro
    UFUNCTION(BlueprintCallable, Category = "Combat")
    void Fire();
};
```

## 4. Conectando as Peças (Polimorfismo e Componentes)

A lógica de tiro da arma deve encontrar o `UHealthComponent` do alvo e chamar `TakeDamage()`.

```cpp
// AFPSWeapon.cpp (Dentro de Fire())
void AFPSWeapon::Fire()
{
    // ... Lógica de Raycast para encontrar o alvo (HitResult) ...

    AActor* HitActor = HitResult.GetActor();
    if (HitActor)
    {
        // Tenta obter o componente de saúde do alvo
        UHealthComponent* HealthComp = HitActor->FindComponentByClass<UHealthComponent>();

        if (HealthComp)
        {
            // Chamada polimórfica: o componente lida com a lógica de dano
            HealthComp->TakeDamage(Damage);
        }
    }
}
```

## 5. O Futuro: Extensibilidade com Interfaces

Para tornar o sistema mais robusto, você usaria uma Interface (`IRecebeDano`) em vez de depender apenas do `UHealthComponent`.

*   **Interface:** `virtual void ReceberDano(float Dano) = 0;`
*   **Arma:** Chama `Target->ReceberDano(Damage)` (Polimorfismo de Interface).
*   **Alvo:** Implementa a interface e, dentro do método, chama `HealthComponent->TakeDamage()`.

Isso garante que qualquer objeto que implemente a interface possa receber dano, mesmo que não use o `UHealthComponent` padrão.

---
[Próximo: Projeto Integrador Final &raquo;](../projeto-integrador/desafio.md)
