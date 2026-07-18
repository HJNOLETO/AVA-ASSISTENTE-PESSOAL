# ✏️ Exercícios: Operadores

## 1. Exercícios de Fixação (Fácil)

1.  **Aritmética Básica:**
    Dadas as variáveis `x = 15` e `y = 4`, calcule e imprima o resultado das seguintes operações:
    *   `x + y`
    *   `x - y`
    *   `x * y`
    *   `x / y` (Divisão inteira)
    *   `x % y` (Módulo)

2.  **Atribuição Composta:**
    Uma variável `moedas` começa com o valor 50. Use operadores de atribuição composta para:
    *   Adicionar 15 moedas.
    *   Multiplicar o total por 2 (bônus).
    *   Subtrair 10 moedas (custo de um item).
    *   Imprima o valor final de `moedas`.

3.  **Incremento e Decremento:**
    Qual será o valor de `a` e `b` após a execução do código?
    ```cpp
    int a = 5;
    int b = 10;
    int c = a++;
    int d = --b;
    // Imprima a, b, c, d
    ```

4.  **Relacionais:**
    Dadas as variáveis `vida = 25` e `limite = 50`, escreva expressões booleanas que resultem em:
    *   `true` (usando `>`)
    *   `false` (usando `<=`)
    *   `true` (usando `!=`)

5.  **Lógicos:**
    Dadas as variáveis `is_chovendo = true`, `is_dia = false`, `is_frio = true`. Qual o resultado das seguintes expressões?
    *   `is_chovendo && is_frio`
    *   `is_dia || is_chovendo`
    *   `!is_dia && is_frio`

## 2. Exercícios de Aplicação (Médio)

1.  **Cálculo de Tempo de Jogo:**
    Um jogador jogou por 7500 segundos. Calcule e imprima quantos minutos e segundos isso representa.
    *   *Dica: Use os operadores `/` e `%` com o número 60.*

2.  **Verificação de Estado Complexa:**
    Um personagem pode usar uma habilidade especial se **(estiver vivo E tiver mana suficiente)** OU **(estiver com o buff de 'Poder Ilimitado')**.
    *   Declare as variáveis `is_vivo` (`bool`), `mana_atual` (`int`), `custo_mana` (`int`), `has_buff` (`bool`).
    *   Defina os valores: `is_vivo = true`, `mana_atual = 40`, `custo_mana = 50`, `has_buff = false`.
    *   Escreva a expressão lógica completa que verifica se o personagem pode usar a habilidade. Imprima o resultado.

3.  **Precedência com Casting:**
    Calcule a média de 4 notas: 7, 8, 9, 10.
    *   Use parênteses para garantir que a soma seja feita antes da divisão.
    *   Use `static_cast` para garantir que a divisão seja de ponto flutuante.

## 3. Desafio (Difícil)

**Sistema de Cooldown:**
Um ataque tem um cooldown de 5 segundos. O tempo de jogo atual é medido em milissegundos (`long long`).
1.  Declare `cooldown_ms = 5000LL` e `tempo_ultimo_ataque_ms = 12345LL`.
2.  Declare `tempo_atual_ms = 18000LL`.
3.  Crie uma expressão booleana chamada `is_ready` que seja `true` se o tempo atual for maior ou igual ao tempo do último ataque **mais** o cooldown.
4.  Imprima o resultado de `is_ready`.

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
