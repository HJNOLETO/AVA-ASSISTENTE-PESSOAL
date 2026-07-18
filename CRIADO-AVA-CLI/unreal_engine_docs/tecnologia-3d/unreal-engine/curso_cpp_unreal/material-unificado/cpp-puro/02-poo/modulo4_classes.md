# Módulo 4 - Introdução a Classes (POO)
## FASE 2: PROGRAMAÇÃO ORIENTADA A OBJETOS (POO)

### Status: 📚 MATERIAL DE ESTUDO

---

## 1. O QUE É UMA CLASSE?

### Teoria

Uma **Classe** é o conceito fundamental da Programação Orientada a Objetos (POO). Ela funciona como um **molde** ou **projeto** para criar objetos. A classe define a estrutura de dados (atributos) e o comportamento (métodos) que os objetos criados a partir dela terão.

**Analogia:** Pense em uma classe como o projeto de um carro. O projeto define que todo carro terá rodas, um motor e a capacidade de acelerar. O objeto é o carro físico que você constrói a partir desse projeto.

### Exemplo: Classe Personagem

```cpp
#include <iostream>
#include <string>
using namespace std;

// Definição da Classe
class Personagem
{
public:
    // Atributos (Propriedades)
    string Nome;
    int Vida;
    int Ataque;

    // Métodos (Funções Membros)
    void MostrarStatus()
    {
        cout << "Nome: " << Nome << endl;
        cout << "Vida: " << Vida << endl;
        cout << "Ataque: " << Ataque << endl;
    }
};

int main()
{
    // Criação de Objetos (Instâncias)
    Personagem Guerreiro;
    Guerreiro.Nome = "Kratos";
    Guerreiro.Vida = 100;
    Guerreiro.Ataque = 25;

    Personagem Mago;
    Mago.Nome = "Gandalf";
    Mago.Vida = 75;
    Mago.Ataque = 40;

    // Chamando os métodos
    Guerreiro.MostrarStatus();
    Mago.MostrarStatus();

    return 0;
}
```

---

## 2. ATRIBUTOS E MÉTODOS

### 2.1. Atributos (Variáveis Membros)

São as variáveis declaradas dentro da classe. Elas representam o **estado** ou as **propriedades** do objeto.

*   No exemplo acima: `Nome`, `Vida` e `Ataque` são atributos.

### 2.2. Métodos (Funções Membros)

São as funções declaradas dentro da classe. Elas representam o **comportamento** ou as **ações** que o objeto pode realizar.

*   No exemplo acima: `MostrarStatus()` é um método.

---

## 3. PUBLIC VS PRIVATE (Encapsulamento Básico)

### Teoria

Em C++, usamos especificadores de acesso para implementar o **Encapsulamento**, um dos pilares da POO. O encapsulamento protege os dados internos do objeto de serem modificados de forma inesperada.

| Especificador | Acesso | Uso Recomendado |
|:---|:---|:---|
| **`public`** | Acessível de **qualquer lugar** (dentro ou fora da classe). | Deve ser usado para a **interface** da classe (métodos que outros objetos precisam chamar). |
| **`private`** | Acessível **apenas** pelos métodos da própria classe. | Deve ser usado para os **atributos** (dados) e métodos internos que não devem ser expostos. **Melhor Prática.** |

### Exemplo de Encapsulamento

```cpp
#include <iostream>
using namespace std;

class Personagem
{
private:
    // Atributo privado: só pode ser modificado pelos métodos da classe
    int VidaAtual = 100;

public:
    // Método público para causar dano (controla a modificação)
    void ReceberDano(int Dano)
    {
        VidaAtual -= Dano;
        if (VidaAtual < 0)
        {
            VidaAtual = 0;
        }
        cout << "Recebeu " << Dano << " de dano. Vida restante: " << VidaAtual << endl;
    }

    // Método público para obter a vida (Getter)
    int GetVida() const
    {
        return VidaAtual;
    }
};

int main()
{
    Personagem Inimigo;
    
    // Inimigo.VidaAtual = -50; // ❌ ERRO! VidaAtual é privado
    
    Inimigo.ReceberDano(30); // ✅ OK. Acessa via método público
    
    if (Inimigo.GetVida() == 0)
    {
        cout << "Inimigo derrotado!" << endl;
    }

    return 0;
}
```

---

## 4. CONSTRUTOR E DESTRUTOR

### 4.1. Construtor

O **Construtor** é um método especial que é chamado **automaticamente** quando um objeto da classe é criado (instanciado). Ele é usado para inicializar os atributos do objeto.

*   **Regras:**
    *   Tem o **mesmo nome** da classe.
    *   Não tem tipo de retorno (nem `void`).

**Exemplo de Construtor:**

```cpp
class Arma
{
public:
    string Nome;
    int Dano;

    // Construtor Padrão (sem parâmetros)
    Arma()
    {
        Nome = "Punho";
        Dano = 1;
        cout << "Arma padrão criada." << endl;
    }

    // Construtor com Parâmetros
    Arma(string NovoNome, int NovoDano)
    {
        Nome = NovoNome;
        Dano = NovoDano;
        cout << "Arma " << Nome << " criada com " << Dano << " de dano." << endl;
    }
};

int main()
{
    Arma Arma1; // Chama o Construtor Padrão
    Arma Arma2("Espada de Fogo", 50); // Chama o Construtor com Parâmetros
    
    return 0;
}
```

### 4.2. Destrutor

O **Destrutor** é um método especial que é chamado **automaticamente** quando o objeto é destruído (sai do escopo ou é deletado). Ele é usado para liberar recursos (como memória alocada dinamicamente).

*   **Regras:**
    *   Tem o mesmo nome da classe, prefixado por um til (`~`).
    *   Não tem tipo de retorno e não aceita parâmetros.

**Exemplo de Destrutor:**

```cpp
class Recurso
{
public:
    Recurso() { cout << "Recurso alocado." << endl; }
    ~Recurso() { cout << "Recurso liberado." << endl; } // Destrutor
};

int main()
{
    Recurso R; // Aloca recurso
    // ... código ...
    return 0; // R é destruído aqui, chamando o destrutor
}
```

---

## EXERCÍCIO: CLASSE ARMA

### Exercício 5: Classe Arma com Dano e Durabilidade

Crie uma classe `Arma` que simule um item de jogo.

1.  **Atributos Privados:**
    *   `int Dano`: Dano base da arma.
    *   `int Durabilidade`: Durabilidade atual (máximo 100).
2.  **Construtor:**
    *   Receba `DanoInicial` e `DurabilidadeInicial` como parâmetros e inicialize os atributos.
3.  **Método Público:**
    *   `void Usar()`:
        *   **SE** `Durabilidade` for maior que 0, diminua a durabilidade em 10 e mostre o dano.
        *   **SENÃO**, mostre "Arma quebrada! Não pode ser usada.".
4.  **Método Público:**
    *   `void Consertar()`: Restaura a durabilidade para 100.
5.  **No `main()`:**
    *   Crie um objeto `Arma` (Ex: `Espada(30, 100)`).
    *   Chame `Usar()` várias vezes até que a arma quebre.
    *   Chame `Consertar()` e use a arma novamente.

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

class Arma
{
private:
    int Dano;
    int Durabilidade;

public:
    // Construtor
    Arma(int DanoInicial, int DurabilidadeInicial)
    {
        Dano = DanoInicial;
        Durabilidade = DurabilidadeInicial;
        cout << "Arma criada. Dano: " << Dano << ", Durabilidade: " << Durabilidade << endl;
    }

    // Método Usar
    void Usar()
    {
        if (Durabilidade > 0)
        {
            Durabilidade -= 10;
            cout << "Ataque! Dano causado: " << Dano << ". Durabilidade restante: " << Durabilidade << endl;
        }
        else
        {
            cout << "Arma quebrada! Não pode ser usada." << endl;
        }
    }

    // Método Consertar
    void Consertar()
    {
        Durabilidade = 100;
        cout << "Arma consertada! Durabilidade: " << Durabilidade << endl;
    }
};

int main()
{
    Arma Espada(30, 30); // Durabilidade inicial baixa para teste
    
    Espada.Usar(); // 30 -> 20
    Espada.Usar(); // 20 -> 10
    Espada.Usar(); // 10 -> 0
    Espada.Usar(); // Arma quebrada!
    
    Espada.Consertar();
    Espada.Usar(); // 100 -> 90
    
    return 0;
}
```
</details>

---

## RESUMO DO MÓDULO 4

### O Que Você Aprendeu

✅ O que é uma **Classe** e um **Objeto**  
✅ Diferença entre **Atributos** e **Métodos**  
✅ O uso de **`public`** e **`private`** para Encapsulamento  
✅ O papel do **Construtor** e do **Destrutor**  

### Próximo Passo

O próximo módulo aprofundará os outros pilares da POO: Herança, Encapsulamento (Getters/Setters) e Polimorfismo.

**Próximo:** Módulo 5: Conceitos Intermediários POO
