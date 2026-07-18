# 📚 3. Encapsulamento e Abstração: Segurança e Simplicidade

## 1. Encapsulamento: Protegendo os Dados

O **Encapsulamento** é o mecanismo que agrupa os dados (atributos) e os métodos (funções) que operam nesses dados em uma única unidade (a classe), e restringe o acesso direto aos dados.

### A. Especificadores de Acesso

O encapsulamento é implementado em C++ usando os especificadores de acesso: `public`, `protected` e `private`.

| Especificador | Acessível por... | Objetivo |
| :--- | :--- | :--- |
| **`public`** | Qualquer código. | Expor a interface da classe (métodos que outros podem usar). |
| **`protected`** | A própria classe e suas classes derivadas. | Permitir que subclasses personalizem o comportamento interno. |
| **`private`** | Apenas a própria classe. | Proteger os dados internos e a lógica de implementação. |

### B. Getters e Setters

Para permitir que o código externo interaja com os atributos `private`, usamos métodos públicos chamados **Getters** (para ler o valor) e **Setters** (para modificar o valor).

O Setter é crucial porque permite adicionar **lógica de validação** antes de alterar o dado.

```cpp
class Personagem {
private:
    int vida = 100; // Atributo privado

public:
    // Getter (Leitura)
    int get_vida() const {
        return vida;
    }

    // Setter (Escrita com Validação)
    void set_vida(int nova_vida) {
        if (nova_vida >= 0) { // Lógica de validação
            vida = nova_vida;
        } else {
            vida = 0; // Garante que a vida não seja negativa
        }
    }
};
```

## 2. Abstração: Foco no Essencial

A **Abstração** é o processo de mostrar apenas as informações essenciais ao usuário e esconder os detalhes complexos de implementação.

*   **Exemplo:** Ao usar um método `atacar()`, o usuário da classe não precisa saber como o cálculo de dano é feito (multiplicadores, resistência, etc.). Ele só precisa saber que, ao chamar `atacar()`, o alvo receberá dano.

O Encapsulamento é o **mecanismo** (usando `private`) que permite a **Abstração** (escondendo os detalhes).

## 3. Classes Abstratas e Funções Virtuais Puras

A abstração máxima em C++ é alcançada com **Classes Abstratas**.

### A. Função Virtual Pura

Uma **Função Virtual Pura** é uma função virtual declarada na classe base que **não tem implementação** e é marcada com `= 0`.

```cpp
virtual void calcular_dano() = 0; // Função Virtual Pura
```

### B. Classe Abstrata

Uma **Classe Abstrata** é qualquer classe que contenha pelo menos uma Função Virtual Pura.

*   **Regra:** Você **não pode** criar objetos de uma Classe Abstrata.
*   **Uso:** Elas servem apenas como **interfaces** ou **modelos** para classes derivadas. As classes derivadas **devem** implementar todas as Funções Virtuais Puras para se tornarem classes concretas (que podem ser instanciadas).

```cpp
class Arma { // Classe Abstrata
public:
    virtual void atacar() = 0; // Deve ser implementada pelas derivadas
    virtual ~Arma() {}
};

class Espada : public Arma {
public:
    void atacar() override {
        std::cout << "Corte com a espada!" << std::endl;
    }
};
```

## 💡 Aplicação em Game Development (Unreal Engine)

*   **Encapsulamento:**
    *   **`UPROPERTY`:** Na Unreal, os atributos são frequentemente declarados como `private` ou `protected` e expostos ao editor ou a Blueprints usando a macro `UPROPERTY` com especificadores como `EditAnywhere` ou `VisibleAnywhere`.
    *   **`UFUNCTION`:** Métodos públicos são expostos a Blueprints usando `UFUNCTION(BlueprintCallable)`.
*   **Abstração:**
    *   **Interfaces:** A Unreal usa o conceito de Interfaces (classes abstratas puras) para definir contratos de comportamento (ex: `IInteractable` para objetos que podem ser interagidos).
    *   **Classes Abstratas:** Classes como `AController` ou `APawn` são frequentemente usadas como classes base abstratas que definem o comportamento fundamental, mas não são instanciadas diretamente.

---
[Próximo: Exemplos Práticos de Encapsulamento e Abstração &raquo;](exemplos.cpp)
