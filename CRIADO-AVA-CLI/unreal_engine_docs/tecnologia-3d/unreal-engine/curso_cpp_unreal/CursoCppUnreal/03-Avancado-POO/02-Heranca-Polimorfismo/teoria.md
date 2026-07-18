# 📚 2. Herança e Polimorfismo: Flexibilidade e Reutilização

## 1. Herança: Reutilização de Código

A **Herança** é um dos pilares da POO. Ela permite que uma nova classe (a **classe derivada** ou **subclasse**) herde os atributos e métodos de uma classe existente (a **classe base** ou **superclasse**).

### A. Sintaxe da Herança

```cpp
class ClasseBase {
public:
    void mover() { /* ... */ }
};

// Classe Derivada herda publicamente da ClasseBase
class ClasseDerivada : public ClasseBase {
public:
    void atacar() { /* ... */ }
};
```

### B. Especificadores de Acesso na Herança

O especificador de acesso define quem pode acessar os membros da classe.

| Especificador | Acessível por... |
| :--- | :--- |
| **`public`** | Qualquer código. |
| **`protected`** | A própria classe e suas classes derivadas (filhas). |
| **`private`** | Apenas a própria classe. |

Em C++, a herança pública (`: public ClasseBase`) é a mais comum, pois mantém os membros públicos e protegidos da classe base com o mesmo nível de acesso na classe derivada.

## 2. Polimorfismo: Múltiplas Formas

**Polimorfismo** significa "muitas formas". Em POO, refere-se à capacidade de um objeto assumir muitas formas, ou seja, a capacidade de um método se comportar de maneira diferente dependendo do objeto que o invoca.

### A. Funções Virtuais (`virtual`)

O polimorfismo em tempo de execução (runtime) é alcançado em C++ usando a palavra-chave **`virtual`**.

1.  **Função Virtual:** Uma função na classe base é declarada como `virtual`.
2.  **Sobrescrita (`override`):** A classe derivada pode fornecer sua própria implementação para essa função. A palavra-chave `override` (C++11+) é opcional, mas altamente recomendada para garantir que a sobrescrita está correta.

```cpp
class Inimigo {
public:
    // Função virtual
    virtual void atacar() {
        std::cout << "Inimigo ataca com dano base." << std::endl;
    }
};

class Boss : public Inimigo {
public:
    // Sobrescrita da função virtual
    void atacar() override {
        std::cout << "Boss ataca com ataque especial!" << std::endl;
    }
};
```

### B. O Problema da Chamada Estática (Sem `virtual`)

Se a função `atacar()` não fosse `virtual`, o compilador decidiria qual função chamar com base no **tipo do ponteiro** (ou referência), e não no **tipo do objeto** real.

### C. Chamada Polimórfica (Com `virtual`)

O polimorfismo só funciona quando a função é chamada através de um **ponteiro** ou **referência** da classe base.

```cpp
Inimigo* ptr_inimigo = new Boss(); // Ponteiro da Base aponta para Objeto Derivado
ptr_inimigo->atacar(); // Saída: Boss ataca com ataque especial! (Chamada Polimórfica)

delete ptr_inimigo;
```

## 3. Destrutores Virtuais

Se uma classe base tem funções virtuais, seu **destrutor** também **deve** ser declarado como `virtual`.

```cpp
class Inimigo {
public:
    virtual ~Inimigo() { /* ... */ } // Destrutor virtual
};
```

**Por quê?** Se você deletar um objeto derivado através de um ponteiro da classe base (como no exemplo acima), e o destrutor da base não for virtual, apenas o destrutor da classe base será chamado, resultando em um **comportamento indefinido** e prováveis vazamentos de memória.

## 💡 Aplicação em Game Development (Unreal Engine)

*   **Herança:** É a espinha dorsal da Unreal. `ACharacter` herda de `APawn`, que herda de `AActor`, que herda de `UObject`.
*   **Polimorfismo:** Usado extensivamente para sistemas de dano, comportamento de IA e renderização. Por exemplo, uma função `TakeDamage()` é virtual na classe base `AActor`, permitindo que cada subclasse (personagem, veículo, objeto destrutível) implemente sua própria lógica de dano.
*   **`virtual` e `override`:** São usados em quase todas as classes de jogo para personalizar o comportamento padrão do motor (ex: `virtual void BeginPlay() override;`).

---
[Próximo: Exemplos Práticos de Herança e Polimorfismo &raquo;](exemplos.cpp)
