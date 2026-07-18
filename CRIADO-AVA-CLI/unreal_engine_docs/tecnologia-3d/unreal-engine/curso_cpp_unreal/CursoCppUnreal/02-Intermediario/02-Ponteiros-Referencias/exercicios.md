# ✏️ Exercícios: Ponteiros e Referências

## 1. Exercícios de Fixação (Fácil)

1.  **Declaração e Atribuição de Ponteiro:**
    Declare uma variável `int pontuacao = 500;`. Declare um ponteiro para inteiro `ptr_pontuacao` e faça-o apontar para `pontuacao`. Imprima o valor de `pontuacao` usando o ponteiro.

2.  **Desreferência:**
    Usando o `ptr_pontuacao` do exercício anterior, altere o valor de `pontuacao` para 999. Imprima o valor de `pontuacao` (sem usar o ponteiro) para confirmar a mudança.

3.  **Referência:**
    Declare uma variável `float dano = 15.5f;`. Declare uma referência para `float` chamada `ref_dano` e inicialize-a com `dano`. Altere o valor de `ref_dano` para `20.0f`. Imprima o valor de `dano`.

4.  **Operadores:**
    Qual operador retorna o endereço de memória de uma variável? E qual operador acessa o valor armazenado no endereço apontado por um ponteiro?

## 2. Exercícios de Aplicação (Médio)

1.  **Passagem por Referência:**
    Crie uma função `dobrar_valor` que receba um `int` **por referência** e multiplique seu valor por 2. No `main`, declare `int valor = 10;`, chame a função e imprima o novo valor de `valor`.

2.  **Ponteiro para Array:**
    Dado o array `int codigos[] = {10, 20, 30, 40, 50};`.
    *   Declare um ponteiro `ptr_codigo` e faça-o apontar para o início do array.
    *   Use a **aritmética de ponteiros** (`*(ptr_codigo + 3)`) para imprimir o valor do quarto elemento (o número 40).

3.  **Ponteiro Nulo:**
    Declare um ponteiro para `float` chamado `ptr_velocidade` e inicialize-o com `nullptr`. Use uma estrutura `if` para verificar se o ponteiro é diferente de `nullptr` antes de tentar desreferenciá-lo.

## 3. Desafio (Difícil)

**Troca de Valores (Swap):**
Crie uma função chamada `trocar_valores` que receba **dois ponteiros** para `int` (`int* a`, `int* b`). A função deve trocar o valor apontado por `a` com o valor apontado por `b`.
*   No `main`, declare `int vida = 100;` e `int mana = 50;`.
*   Chame `trocar_valores` passando os endereços de `vida` e `mana`.
*   Imprima os valores finais de `vida` e `mana`.

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
