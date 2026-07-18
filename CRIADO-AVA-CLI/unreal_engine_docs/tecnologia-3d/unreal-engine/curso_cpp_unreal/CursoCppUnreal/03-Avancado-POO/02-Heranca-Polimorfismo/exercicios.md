# ✏️ Exercícios: Herança e Polimorfismo

## 1. Exercícios de Fixação (Fácil)

1.  **Herança Simples:**
    Crie uma classe base `Veiculo` com um método `void ligar_motor()` que imprime "Motor ligado.". Crie uma classe derivada `Carro` que herde publicamente de `Veiculo`. No `main`, crie um objeto `Carro` e chame o método `ligar_motor()`.

2.  **Membros Protegidos:**
    Adicione um atributo `protected int velocidade_maxima` à classe `Veiculo`. Na classe `Carro`, crie um método `void exibir_velocidade()` que acesse e imprima `velocidade_maxima`.

3.  **Função Virtual:**
    Na classe `Veiculo`, adicione uma função virtual `virtual void acelerar()` que imprime "Veículo acelerando.". Na classe `Carro`, sobrescreva essa função para imprimir "Carro acelerando rapidamente!".

4.  **Polimorfismo:**
    No `main`, crie um ponteiro da classe base `Veiculo* ptr_carro = new Carro();`. Chame `ptr_carro->acelerar()` e observe qual método é executado.

## 2. Exercícios de Aplicação (Médio)

1.  **Destrutor Virtual:**
    Modifique a classe `Veiculo` para que seu destrutor seja virtual. Crie uma classe `Moto` que herde de `Veiculo` e tenha um destrutor que imprima "Moto destruída.". No `main`, use um ponteiro da classe base para deletar um objeto `Moto` (`delete ptr_moto;`) e verifique se o destrutor correto é chamado.

2.  **Vetor Polimórfico:**
    Crie um `std::vector<Veiculo*>` e adicione um objeto `Carro` e um objeto `Moto` (alocados dinamicamente). Use um loop `for` para iterar sobre o vetor e chamar o método `acelerar()` em cada elemento. **Lembre-se de deletar a memória alocada no final.**

3.  **Construtores em Herança:**
    Crie um construtor na classe `Veiculo` que receba um `int` (velocidade_maxima) e o inicialize. Crie um construtor na classe `Carro` que chame o construtor da classe base, passando um valor fixo (ex: 200).

## 3. Desafio (Difícil)

**Sistema de Dano Polimórfico:**
Crie uma classe base `Dano` com um método virtual `virtual int calcular_dano() = 0;` (Função Virtual Pura - veja o próximo tópico).
Crie duas classes derivadas:
*   `DanoFisico` que sobrescreve `calcular_dano()` para retornar um valor fixo (ex: 10).
*   `DanoMagico` que sobrescreve `calcular_dano()` para retornar um valor aleatório entre 15 e 25.
Crie uma função `void aplicar_dano(Dano* tipo_dano)` que chame `tipo_dano->calcular_dano()` e imprima o resultado.
No `main`, crie um vetor de `Dano*` e adicione instâncias de `DanoFisico` e `DanoMagico`. Itere sobre o vetor e chame `aplicar_dano` em cada elemento.

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
