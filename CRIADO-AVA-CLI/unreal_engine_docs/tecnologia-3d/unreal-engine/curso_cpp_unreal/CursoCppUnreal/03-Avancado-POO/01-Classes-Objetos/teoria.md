# 📚 1. Classes e Objetos: A Base da POO

A **Programação Orientada a Objetos (POO)** é um paradigma de programação que se baseia no conceito de "objetos", que podem conter dados (atributos) e código (métodos). Em C++, a POO é implementada através de **Classes**.

## 1. Classes: O Molde

Uma **Classe** é um molde, um projeto ou uma definição para criar objetos. Ela define a estrutura e o comportamento que todos os objetos desse tipo terão.

### A. Membros de uma Classe

Uma classe é composta por:
1.  **Atributos (Membros de Dados):** Variáveis que armazenam o estado do objeto (ex: `vida`, `nome`).
2.  **Métodos (Membros de Função):** Funções que definem o comportamento do objeto (ex: `atacar()`, `curar()`).

```cpp
class Personagem {
public: // Especificador de acesso (visível fora da classe)
    // Atributos
    std::string nome;
    int vida;

    // Métodos
    void atacar() {
        // Lógica de ataque
    }
};
```

## 2. Objetos: A Instância

Um **Objeto** é uma instância concreta de uma classe. É a realização do molde.

```cpp
// Personagem é a Classe (o molde)
// heroi e inimigo são Objetos (instâncias)
Personagem heroi;
Personagem inimigo;

// Acessando e modificando atributos do objeto
heroi.nome = "Kratos";
heroi.vida = 100;

// Chamando um método do objeto
heroi.atacar();
```

## 3. Construtores e Destrutores

### A. Construtor

O **Construtor** é um método especial que é chamado automaticamente quando um objeto da classe é criado. Ele é usado para inicializar os atributos do objeto.

*   **Regra:** O construtor tem o **mesmo nome** da classe e **não tem tipo de retorno** (nem mesmo `void`).

```cpp
class Personagem {
public:
    std::string nome;
    int vida;

    // Construtor Padrão (sem argumentos)
    Personagem() {
        nome = "Sem Nome";
        vida = 50;
    }

    // Construtor com Parâmetros
    Personagem(std::string n, int v) {
        nome = n;
        vida = v;
    }
};
```

### B. Destrutor

O **Destrutor** é um método especial que é chamado automaticamente quando um objeto é destruído (sai de escopo ou é desalocado). Ele é usado para liberar recursos (como memória alocada dinamicamente).

*   **Regra:** O destrutor tem o mesmo nome da classe, precedido por um til (`~`), e **não tem tipo de retorno nem parâmetros**.

```cpp
class Recurso {
public:
    // ...
    ~Recurso() {
        // Código para liberar memória ou fechar arquivos
        std::cout << "Objeto Recurso destruído." << std::endl;
    }
};
```

## 4. Ponteiros para Objetos (`->`)

Podemos criar objetos no Heap usando `new` e acessá-los através de ponteiros.

```cpp
// Cria um objeto no Heap e retorna um ponteiro
Personagem* ptr_heroi = new Personagem("Arqueiro", 80);

// Para acessar membros de um objeto através de um ponteiro, usamos o operador seta (->)
ptr_heroi->vida = 90;
ptr_heroi->atacar();

// Não se esqueça de liberar a memória!
delete ptr_heroi;
ptr_heroi = nullptr;
```

O operador seta (`->`) é apenas uma forma abreviada de desreferenciar o ponteiro e acessar o membro: `ptr_heroi->vida` é o mesmo que `(*ptr_heroi).vida`.

## 💡 Aplicação em Game Development (Unreal Engine)

*   **Classes Unreal:** A maioria dos elementos de um jogo Unreal são classes C++ que herdam de classes base do motor (ex: `AActor`, `UObject`, `UCharacter`).
*   **`UCLASS`:** A macro `UCLASS` é usada para marcar uma classe C++ para que o sistema de reflexão da Unreal a reconheça, permitindo que ela seja usada em Blueprints.
*   **Construtores:** Os construtores são usados para definir valores padrão para os atributos do objeto e configurar componentes.
*   **Destrutores:** Em Unreal, a desalocação de objetos de jogo é geralmente gerenciada pelo *Garbage Collector* do motor, mas o conceito de destrutor ainda é válido para liberar recursos não gerenciados pelo GC.

---
[Próximo: Exemplos Práticos de Classes e Objetos &raquo;](exemplos.cpp)
