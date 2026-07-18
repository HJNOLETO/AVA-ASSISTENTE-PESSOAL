# 🎯 Projeto Integrador 3: Sistema de Habilidades Polimórficas

## Desafio: Criar um Sistema de Habilidades com POO

Este projeto integrador consolidará os conceitos de **Herança, Polimorfismo, Encapsulamento e Classes Abstratas** do Módulo 03.

Você deve criar um programa C++ que simule um sistema de habilidades mágicas e físicas, onde o jogador pode usar diferentes tipos de habilidades de forma polimórfica.

### Requisitos

1.  **Classe Abstrata Base (`Habilidade`):**
    *   Crie uma classe abstrata `Habilidade` com um atributo `protected int custo_mana`.
    *   Crie um método `public int get_custo() const` (Getter).
    *   Crie uma **Função Virtual Pura** `virtual void usar(class Personagem& alvo) = 0;`.
    *   Crie um **Destrutor Virtual**.

2.  **Classes Derivadas (Habilidades Concretas):**
    *   Crie a classe `BolaDeFogo` que herda de `Habilidade`.
        *   No construtor, inicialize `custo_mana` para 20.
        *   Implemente `usar()` para imprimir: "Bola de Fogo lançada! [alvo] recebe 30 de dano mágico."
    *   Crie a classe `AtaqueFisico` que herda de `Habilidade`.
        *   No construtor, inicialize `custo_mana` para 0.
        *   Implemente `usar()` para imprimir: "Ataque Físico realizado! [alvo] recebe 15 de dano físico."

3.  **Classe Alvo (`Personagem`):**
    *   Crie uma classe `Personagem` com um atributo `private std::string nome`.
    *   Crie um construtor que inicialize o nome.
    *   Crie um `public std::string get_nome() const` (Getter).

4.  **Lógica Principal:**
    *   Crie um objeto `Personagem` chamado `inimigo` ("Ogro").
    *   Crie um `std::vector<Habilidade*>` para armazenar as habilidades.
    *   Adicione instâncias de `BolaDeFogo` e `AtaqueFisico` ao vetor.
    *   Itere sobre o vetor e chame `habilidade->usar(inimigo)` em cada elemento.
    *   Imprima o custo de mana de cada habilidade.
    *   **Lembre-se de liberar a memória alocada dinamicamente.**

### Dicas

*   A classe `Personagem` deve ser declarada antes da classe `Habilidade` ou você deve usar uma declaração *forward* (`class Personagem;`) para evitar erros de compilação.
*   Use `std::vector<Habilidade*>` para demonstrar o polimorfismo.

---
[Próximo: Solução do Projeto Integrador &raquo;](solucao.cpp)
