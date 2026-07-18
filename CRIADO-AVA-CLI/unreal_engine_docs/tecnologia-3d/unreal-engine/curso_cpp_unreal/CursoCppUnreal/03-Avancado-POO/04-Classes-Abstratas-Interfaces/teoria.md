# 📚 4. Classes Abstratas e Interfaces: Definindo Contratos

Este tópico é uma extensão e aprofundamento do conceito de Abstração introduzido na lição anterior.

## 1. Classes Abstratas (Revisão)

Uma **Classe Abstrata** é uma classe que não pode ser instanciada diretamente, pois contém pelo menos uma **Função Virtual Pura** (`virtual Tipo funcao() = 0;`).

### A. Propósito

*   **Definir um Modelo:** Serve como um modelo para classes derivadas, definindo uma estrutura comum.
*   **Implementação Parcial:** Pode conter atributos e métodos concretos (com implementação) que são compartilhados pelas subclasses.

```cpp
class PersonagemBase { // Classe Abstrata
public:
    int nivel = 1; // Atributo concreto
    void subir_nivel() { nivel++; } // Método concreto

    virtual void atacar() = 0; // Método abstrato (deve ser implementado)
    virtual ~PersonagemBase() {}
};
```

## 2. Interfaces (Abstração Pura)

Em C++, o conceito de **Interface** é implementado através de uma Classe Abstrata que contém **apenas Funções Virtuais Puras** e **nenhum atributo** ou método concreto (exceto o destrutor virtual).

### A. Propósito

*   **Contrato de Comportamento:** Define um conjunto de ações que uma classe deve ser capaz de realizar, sem se preocupar com a implementação.
*   **Herança Múltipla:** Em C++, as Interfaces são a forma segura de simular a Herança Múltipla (herdar de múltiplas classes base).

```cpp
class IInteragivel { // Interface (convenção de nome: 'I' de Interface)
public:
    virtual void interagir(class Personagem* instigador) = 0;
    virtual bool pode_interagir() const = 0;
    virtual ~IInteragivel() {}
};
```

## 3. Implementando uma Interface

Uma classe que herda de uma Interface deve implementar todas as suas Funções Virtuais Puras.

```cpp
class Porta : public IInteragivel {
public:
    void interagir(Personagem* instigador) override {
        std::cout << "Porta aberta por " << instigador->nome << std::endl;
    }

    bool pode_interagir() const override {
        return true;
    }
};
```

## 4. Herança Múltipla com Interfaces

Uma classe pode herdar de uma classe base concreta (ou abstrata) e de múltiplas Interfaces.

```cpp
class ObjetoDeCenario { /* ... */ };

// Um baú herda de ObjetoDeCenario e implementa a Interface IInteragivel
class Bau : public ObjetoDeCenario, public IInteragivel {
    // Deve implementar os métodos de IInteragivel
};
```

## 5. Classes Abstratas vs. Interfaces

| Característica | Classe Abstrata | Interface (Abstração Pura) |
| :--- | :--- | :--- |
| **Instanciação** | Não pode ser instanciada. | Não pode ser instanciada. |
| **Membros Concretos** | Pode ter atributos e métodos implementados. | Não deve ter atributos ou métodos implementados (apenas FVP). |
| **Herança** | Uma classe pode herdar de apenas uma classe base. | Uma classe pode herdar de múltiplas Interfaces. |
| **Uso** | Definir uma hierarquia de tipos com implementação compartilhada. | Definir um contrato de comportamento (o que a classe faz). |

## 💡 Aplicação em Game Development (Unreal Engine)

*   **Classes Abstratas:** Classes como `AController` ou `AGameModeBase` são frequentemente usadas como classes base abstratas. Você não instancia `AGameModeBase`, mas sim uma subclasse específica do seu jogo (ex: `AMyGameMode`).
*   **Interfaces Unreal (`UInterface`):** A Unreal Engine tem seu próprio sistema de Interfaces (`UInterface`) que permite que classes C++ e Blueprints definam e implementem contratos de comportamento.
    *   **Exemplo:** Um sistema de interação é tipicamente implementado com uma Interface `IInteractable`. O código de interação do jogador simplesmente chama `Target->Execute_Interact(this)` sem se importar se o alvo é uma porta, um baú ou um NPC.

---
[Próximo: Exemplos Práticos de Classes Abstratas e Interfaces &raquo;](exemplos.cpp)
