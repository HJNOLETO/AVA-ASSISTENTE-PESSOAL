# Módulo 5 - Conceitos Intermediários POO
## FASE 2: PROGRAMAÇÃO ORIENTADA A OBJETOS (POO)

### Status: 📚 MATERIAL DE ESTUDO

---

## 1. HERANÇA

### Teoria

A **Herança** é um mecanismo que permite que uma nova classe (chamada **subclasse** ou **classe derivada**) adquira as propriedades (atributos) e o comportamento (métodos) de uma classe existente (chamada **superclasse** ou **classe base**).

Isso estabelece uma relação **"É UM TIPO DE"** (Ex: Um `Mago` **É UM TIPO DE** `Personagem`).

**Benefícios:**
*   **Reutilização de Código:** Evita reescrever atributos e métodos comuns.
*   **Organização:** Cria uma hierarquia lógica de classes.

### Sintaxe

```cpp
class Subclasse : public Superclasse {
    // Membros específicos da subclasse
};
```

### Exemplo: Inimigo herda de Personagem

```cpp
#include <iostream>
#include <string>
using namespace std;

// CLASSE BASE
class Personagem
{
public:
    string Nome;
    int Vida = 100;

    void Mover()
    {
        cout << Nome << " está se movendo." << endl;
    }
};

// CLASSE DERIVADA
class Inimigo : public Personagem
{
public:
    int Dano = 10;

    void Atacar()
    {
        cout << Nome << " ataca e causa " << Dano << " de dano!" << endl;
    }
};

int main()
{
    Inimigo Goblin;
    Goblin.Nome = "Goblin";
    
    // Goblin usa métodos e atributos herdados de Personagem
    Goblin.Mover(); // Saída: Goblin está se movendo.
    
    // Goblin usa métodos próprios
    Goblin.Atacar(); // Saída: Goblin ataca e causa 10 de dano!
    
    return 0;
}
```

---

## 2. ENCAPSULAMENTO: GETTERS E SETTERS

### Teoria

Vimos no Módulo 4 que o Encapsulamento é a prática de proteger os dados internos (`private`). Para permitir que o mundo exterior interaja com esses dados de forma controlada, usamos métodos públicos:

*   **Getter (Acessador):** Um método que **retorna** o valor de um atributo privado.
*   **Setter (Modificador):** Um método que **modifica** o valor de um atributo privado, geralmente incluindo lógica de validação.

### Exemplo: Getters e Setters

```cpp
#include <iostream>
using namespace std;

class Jogador
{
private:
    int Vida = 100; // Atributo privado
    
public:
    // Setter: Permite modificar a vida com validação
    void SetVida(int NovaVida)
    {
        if (NovaVida >= 0 && NovaVida <= 100)
        {
            Vida = NovaVida;
            cout << "Vida alterada para: " << Vida << endl;
        }
        else if (NovaVida < 0)
        {
            Vida = 0;
            cout << "O jogador morreu!" << endl;
        }
        else
        {
            Vida = 100;
            cout << "Vida restaurada ao máximo!" << endl;
        }
    }
    
    // Getter: Permite ler a vida
    int GetVida() const // 'const' indica que o método não altera o objeto
    {
        return Vida;
    }
};

int main()
{
    Jogador Heroi;
    
    Heroi.SetVida(50);
    Heroi.SetVida(-10); // A lógica de validação do Setter impede vida negativa
    
    cout << "Vida atual (lida pelo Getter): " << Heroi.GetVida() << endl;
    
    return 0;
}
```

---

## 3. POLIMORFISMO BÁSICO COM VIRTUAL

### Teoria

**Polimorfismo** significa "muitas formas". Ele permite que objetos de classes diferentes, mas relacionadas por herança, respondam ao mesmo método de maneiras específicas.

Em C++, o polimorfismo dinâmico (em tempo de execução) é alcançado usando a palavra-chave **`virtual`** na função da classe base.

*   **`virtual`:** Indica que a função pode ser sobrescrita (override) pelas classes derivadas.
*   **`override`:** (Melhor Prática C++ moderno) Indica explicitamente que a função está sobrescrevendo uma função virtual da classe base.

### Exemplo: Polimorfismo

```cpp
#include <iostream>
using namespace std;

// CLASSE BASE
class Arma
{
public:
    // Função virtual: permite que subclasses a sobrescrevam
    virtual void Atacar()
    {
        cout << "Ataque genérico." << endl;
    }
};

// CLASSE DERIVADA 1
class Espada : public Arma
{
public:
    // Sobrescreve o método da classe base
    void Atacar() override
    {
        cout << "Espada: Cortando o inimigo!" << endl;
    }
};

// CLASSE DERIVADA 2
class Arco : public Arma
{
public:
    void Atacar() override
    {
        cout << "Arco: Atirando uma flecha!" << endl;
    }
};

int main()
{
    // Ponteiro da classe base (Arma*) pode apontar para qualquer subclasse
    Arma* MinhaArma = new Espada();
    MinhaArma->Atacar(); // Saída: Espada: Cortando o inimigo!
    delete MinhaArma;
    
    MinhaArma = new Arco();
    MinhaArma->Atacar(); // Saída: Arco: Atirando uma flecha!
    delete MinhaArma;
    
    return 0;
}
```

**Importância:** O polimorfismo permite que você crie uma lista de `Arma*` e chame `Atacar()` em cada item, sem se preocupar se é uma `Espada` ou um `Arco`. O compilador saberá qual versão correta chamar em tempo de execução.

---

## EXERCÍCIO: SISTEMA DE CLASSES

### Exercício 4: Sistema de Classes (Guerreiro, Mago, Arqueiro)

Crie um sistema de classes que utilize Herança e Polimorfismo.

1.  **Classe Base `Personagem`:**
    *   Atributo `string Nome`.
    *   Método `virtual void Atacar() = 0;` (Função virtual pura: torna `Personagem` uma classe abstrata, forçando subclasses a implementarem `Atacar`).
    *   Método `void Mover()` (implementado).
2.  **Subclasses `Guerreiro`, `Mago`, `Arqueiro`:**
    *   Herde de `Personagem`.
    *   Implemente o método `Atacar()` de forma específica para cada classe.
3.  **No `main()`:**
    *   Crie um `vector<Personagem*>` e adicione um objeto de cada subclasse.
    *   Use um loop para chamar `Atacar()` em cada elemento do vetor.

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// CLASSE BASE ABSTRATA
class Personagem
{
public:
    string Nome;
    
    // Construtor
    Personagem(string nome) : Nome(nome) {}
    
    // Função virtual pura: deve ser implementada pelas subclasses
    virtual void Atacar() = 0; 
    
    void Mover()
    {
        cout << Nome << " está se movendo." << endl;
    }
};

// SUBCLASSE 1
class Guerreiro : public Personagem
{
public:
    Guerreiro(string nome) : Personagem(nome) {}
    
    void Atacar() override
    {
        cout << Nome << " desfere um golpe de espada poderoso!" << endl;
    }
};

// SUBCLASSE 2
class Mago : public Personagem
{
public:
    Mago(string nome) : Personagem(nome) {}
    
    void Atacar() override
    {
        cout << Nome << " lança uma bola de fogo mágica!" << endl;
    }
};

// SUBCLASSE 3
class Arqueiro : public Personagem
{
public:
    Arqueiro(string nome) : Personagem(nome) {}
    
    void Atacar() override
    {
        cout << Nome << " dispara uma flecha certeira!" << endl;
    }
};

int main()
{
    // Vetor de ponteiros para a classe base
    vector<Personagem*> Time;
    
    Time.push_back(new Guerreiro("Arthur"));
    Time.push_back(new Mago("Merlin"));
    Time.push_back(new Arqueiro("Legolas"));
    
    cout << "=== INÍCIO DO COMBATE ===" << endl;
    
    // Polimorfismo em ação: o mesmo método chama diferentes implementações
    for (Personagem* p : Time)
    {
        p->Atacar();
    }
    
    cout << "=== FIM DO COMBATE ===" << endl;
    
    // Limpeza de memória
    for (Personagem* p : Time)
    {
        delete p;
    }
    
    return 0;
}
```
</details>

---

## RESUMO DO MÓDULO 5

### O Que Você Aprendeu

✅ **Herança:** Reutilização de código e relação "É UM TIPO DE".  
✅ **Encapsulamento:** Uso de **Getters** e **Setters** para controle de acesso.  
✅ **Polimorfismo:** Uso de **`virtual`** e **`override`** para múltiplas formas de um mesmo método.  

### Próximo Passo

O próximo módulo abordará o gerenciamento de memória e a manipulação de endereços, conceitos cruciais para entender como o Unreal Engine gerencia seus objetos.

**Próximo:** Módulo 6: Ponteiros e Referências
