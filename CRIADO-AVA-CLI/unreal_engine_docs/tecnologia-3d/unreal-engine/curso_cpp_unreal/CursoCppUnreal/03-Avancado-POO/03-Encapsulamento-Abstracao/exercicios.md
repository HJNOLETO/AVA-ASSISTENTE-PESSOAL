# ✏️ Exercícios: Encapsulamento e Abstração

## 1. Exercícios de Fixação (Fácil)

1.  **Encapsulamento Básico:**
    Crie uma classe `Moeda` com um atributo `private int valor`. Adicione um método `public int get_valor()` para ler o valor.

2.  **Setter Simples:**
    Adicione um método `public void set_valor(int novo_valor)` à classe `Moeda` para alterar o valor. No `main`, crie um objeto `Moeda`, defina o valor para 50 e imprima-o usando o Getter.

3.  **Função Virtual Pura:**
    Como você declararia uma função virtual pura chamada `renderizar()` que não recebe parâmetros e não retorna nada, dentro de uma classe base `ObjetoGrafico`?

4.  **Abstração:**
    Explique em uma frase o objetivo da Abstração em POO.

## 2. Exercícios de Aplicação (Médio)

1.  **Setter com Validação:**
    Modifique o `set_valor` da classe `Moeda` para incluir uma validação: o valor só pode ser alterado se `novo_valor` for maior ou igual a zero. Se for negativo, imprima uma mensagem de erro e não altere o valor. Teste a validação no `main`.

2.  **Classe Abstrata e Herança:**
    Crie uma classe abstrata `Habilidade` com uma função virtual pura `virtual void usar() = 0;`.
    Crie uma classe derivada `BolaDeFogo` que herde de `Habilidade` e implemente `usar()` para imprimir "Bola de Fogo lançada!". No `main`, crie um ponteiro para `Habilidade` que aponte para um objeto `BolaDeFogo` e chame `usar()`.

3.  **Membro Protegido:**
    Na classe `Habilidade`, adicione um membro `protected int custo_mana`. Na classe `BolaDeFogo`, crie um construtor que inicialize `custo_mana` para 20. Crie um método `public int get_custo()` na classe base para ler o custo.

## 3. Desafio (Difícil)

**Sistema de Log Encapsulado:**
Crie uma classe `Logger` que tenha um atributo `private std::vector<std::string> logs`.
1.  Crie um método `public void log_mensagem(const std::string& mensagem)` que adicione a mensagem ao vetor.
2.  Crie um método `public void imprimir_logs() const` que itere sobre o vetor e imprima todas as mensagens.
3.  **Validação:** No `log_mensagem`, adicione a data e hora atual (simulada, ex: "[2025-11-05]") antes da mensagem.
4.  No `main`, crie um `Logger`, adicione 3 mensagens e imprima os logs.

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
