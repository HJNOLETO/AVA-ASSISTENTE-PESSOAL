# Módulo 12 - Especificadores UPROPERTY e UFUNCTION
## FASE 3: UNREAL ENGINE ESPECÍFICO

### Status: 📚 MATERIAL DE ESTUDO

---

## 1. O SISTEMA DE REFLEXÃO DA UNREAL

O **Sistema de Reflexão** da Unreal Engine é o que permite que o motor, o Editor e os Blueprints "saibam" sobre as classes, variáveis e funções que você escreve em C++.

As macros `UPROPERTY`, `UFUNCTION` e `UCLASS` são lidas pelo **Unreal Header Tool (UHT)**, que gera código C++ adicional para integrar seus membros ao sistema de Reflexão.

---

## 2. `UPROPERTY`: EXPOR VARIÁVEIS

A macro `UPROPERTY()` é usada para marcar variáveis de membro de classes `UObject` e `AActor`. Ela é essencial para:

1.  **Garbage Collection:** Informa ao *Garbage Collector* quais ponteiros para `UObject` estão sendo referenciados.
2.  **Serialização:** Permite que a variável seja salva e carregada.
3.  **Editor:** Expõe a variável no Editor para que designers possam ajustá-la.

### Especificadores Comuns para o Editor

| Especificador | Descrição | Uso |
|:---|:---|:---|
| **`EditAnywhere`** | Permite editar a variável em qualquer instância do objeto (no mundo ou em Blueprints). | Variáveis que designers precisam ajustar. |
| **`VisibleAnywhere`** | A variável é visível, mas **não editável** no Editor. | Variáveis de leitura (Ex: vida atual, estado). |
| **`BlueprintReadOnly`** | Variável pode ser lida (Getter) em Blueprints, mas não modificada. | Variáveis de estado que só o C++ deve alterar. |
| **`BlueprintReadWrite`** | Variável pode ser lida e escrita em Blueprints. | Variáveis que Blueprints precisam manipular. |
| **`Category = "Nome"`** | Organiza a variável em uma categoria no painel de Detalhes do Editor. | Organização do código. |

### Exemplo de `UPROPERTY`

```cpp
// AMovingPlatform.h

UCLASS()
class AMovingPlatform : public AActor
{
    GENERATED_BODY()

public:
    // EditAnywhere: Permite que o designer defina a velocidade no Editor
    UPROPERTY(EditAnywhere, Category = "Movement")
    FVector PlatformVelocity = FVector(100.0f, 0.0f, 0.0f);

    // VisibleAnywhere: Apenas para visualização do estado atual
    UPROPERTY(VisibleAnywhere, Category = "Movement")
    float DistanceMoved = 0.0f;
};
```

---

## 3. `UFUNCTION`: EXPOR FUNÇÕES

A macro `UFUNCTION()` é usada para marcar funções de membro. Ela é essencial para:

1.  **Blueprints:** Permite que a função seja chamada a partir de Blueprints.
2.  **Eventos:** Permite que a função seja usada como um *Delegate* (evento).

### Especificadores Comuns para Blueprints

| Especificador | Descrição | Uso |
|:---|:---|:---|
| **`BlueprintCallable`** | A função pode ser chamada como um nó de execução em Blueprints. | Funções que Blueprints precisam executar (Ex: `ReceberDano()`). |
| **`BlueprintPure`** | A função pode ser chamada em Blueprints, mas **não tem efeito colateral** (não altera o estado do objeto). | Funções que retornam um valor (Ex: `GetVida()`). |
| **`Server`, `Client`, `NetMulticast`** | Usado para replicação de rede. | Funções que precisam ser executadas em diferentes máquinas em jogos multiplayer. |

### Exemplo de `UFUNCTION`

```cpp
// APlayerCharacter.h

UCLASS()
class APlayerCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    // BlueprintCallable: Pode ser chamada por um Blueprint (Ex: um botão na UI)
    UFUNCTION(BlueprintCallable, Category = "Combat")
    void ReceberDano(float Dano);

    // BlueprintPure: Pode ser lida por um Blueprint (Ex: para mostrar na UI)
    UFUNCTION(BlueprintPure, Category = "Stats")
    float GetVidaAtual() const;
};
```

---

## 4. `PROTECTED` VS `PRIVATE` NA UNREAL

No C++ padrão (Módulo 4), a diferença entre `protected` e `private` é sobre quem pode acessar o membro:

*   **`private`:** Apenas a própria classe.
*   **`protected`:** A própria classe e as classes derivadas (subclasses).

### Convenção da Unreal

A Epic Games tem uma convenção específica para membros de classes `UObject` e `AActor`:

| Especificador | Convenção da Epic |
|:---|:---|
| **`private`** | Usado para membros que **não** devem ser acessados por subclasses. |
| **`protected`** | Usado para membros que **podem** ser acessados por subclasses (o que é muito comum na Unreal, já que você sempre herda). |

**Melhor Prática:** Na Unreal, a maioria dos atributos e métodos internos que você espera que sejam sobrescritos ou acessados por Blueprints ou classes filhas são declarados como **`protected`**.

---

## EXERCÍCIO: EXPOSIÇÃO DE MEMBROS

### Exercício 1: Expondo Variáveis e Funções

Modifique a classe `Arma` (Módulo 4) para ser uma classe Unreal (`UObject` ou `AActor`) e exponha seus membros.

1.  **Classe:** `UWeaponComponent` (herda de `UActorComponent`).
2.  **Variáveis:**
    *   `float DanoBase`: Deve ser editável no Editor.
    *   `float DurabilidadeAtual`: Deve ser visível no Editor e lida em Blueprints.
3.  **Função:**
    *   `void Atacar()`: Deve ser chamável a partir de Blueprints.

<details>
<summary>Ver Solução (Arquivo .h)</summary>

```cpp
// UWeaponComponent.h
#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "WeaponComponent.generated.h"

UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
class UWeaponComponent : public UActorComponent
{
    GENERATED_BODY()

public:	
    UWeaponComponent();

protected:
    // 1. DanoBase: Editável no Editor
    UPROPERTY(EditAnywhere, Category = "Weapon Stats")
    float DanoBase = 25.0f;

    // 2. DurabilidadeAtual: Visível no Editor e lida em Blueprints
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Weapon Stats")
    float DurabilidadeAtual = 100.0f;

public:
    // 3. Atacar(): Chamável a partir de Blueprints
    UFUNCTION(BlueprintCallable, Category = "Weapon Actions")
    void Atacar();
};
```
</details>

---

## RESUMO DO MÓDULO 12

### O Que Você Aprendeu

✅ **Reflexão:** A ponte entre C++ e o Editor/Blueprints.  
✅ **`UPROPERTY(EditAnywhere)`:** Edição de variáveis no Editor.  
✅ **`UPROPERTY(VisibleAnywhere)`:** Visualização de variáveis no Editor.  
✅ **`UFUNCTION(BlueprintCallable)`:** Funções que Blueprints podem chamar.  
✅ **`protected`:** Convenção para membros que subclasses devem acessar.  

### Próximo Passo

A FASE 3 (Unreal Engine Específico) está completa. O próximo módulo inicia a **FASE 4: PROJETO PRÁTICO**, com a análise detalhada do código da plataforma móvel.

**Próximo:** Módulo 13: Análise do Código AMovingPlatform
