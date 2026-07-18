# ✏️ Exercícios: Variáveis e Tipos de Dados

## 1. Exercícios de Fixação (Fácil)

1.  **Declaração e Inicialização:**
    Declare e inicialize as seguintes variáveis, escolhendo o tipo de dado primitivo mais apropriado:
    *   `vida_maxima` (valor: 250)
    *   `taxa_critica` (valor: 0.35)
    *   `nome_inicial` (valor: 'K')
    *   `jogo_pausado` (valor: verdadeiro)

2.  **Tamanho na Memória:**
    Escreva um pequeno programa C++ que use o operador `sizeof()` para imprimir o tamanho (em bytes) dos tipos `int`, `double`, `bool` e `long long` no seu sistema.

3.  **Entrada de Dados:**
    Crie um programa que peça ao usuário para digitar sua idade (inteiro) e seu saldo bancário (ponto flutuante). Armazene os valores nas variáveis apropriadas e imprima-os na tela.

4.  **Casting Implícito:**
    O que será impresso na tela pelo código abaixo? Explique o porquê.
    ```cpp
    int a = 5;
    double b = 2.0;
    double resultado = a / b;
    // cout << resultado;
    ```

5.  **Casting Explícito:**
    Você tem uma variável `float` chamada `dano_bruto` com o valor `15.75f`. Converta este valor para um `int` chamado `dano_final` usando `static_cast` e imprima o resultado.

## 2. Exercícios de Aplicação (Médio)

1.  **Cálculo de Dano:**
    Um ataque causa 50 pontos de dano base. O inimigo tem uma redução de dano de 15% (0.15).
    *   Declare as variáveis apropriadas para o dano base (`int`) e a redução (`float`).
    *   Calcule o dano final (`dano_final`) que o inimigo receberá.
    *   Imprima o dano final com uma mensagem clara.
    *   *Dica: Lembre-se de usar casting para garantir que a multiplicação e subtração sejam feitas com ponto flutuante.*

2.  **Controle de Munição:**
    Você tem 100 balas no total (`int`). Você usa 3 balas por tiro.
    *   Crie uma variável `tiros_possiveis` (`int`) para armazenar quantos tiros completos você pode dar.
    *   Crie uma variável `balas_restantes` (`int`) para armazenar o resto da divisão.
    *   Imprima ambos os resultados.

3.  **Conversão de Temperatura:**
    Crie um programa que declare uma temperatura em Celsius (`float`). Converta essa temperatura para Fahrenheit usando a fórmula: $F = C \times 1.8 + 32$. Imprima o resultado.

## 3. Desafio (Difícil)

**Simulação de Overflow:**
O tipo `short` tem um limite máximo de 32767.
1.  Declare uma variável `short` chamada `contador_inimigos` e inicialize-a com 32767.
2.  Imprima o valor.
3.  Incremente a variável em 1 (`contador_inimigos = contador_inimigos + 1;`).
4.  Imprima o novo valor.
5.  Explique o que aconteceu (o fenômeno de **overflow**).

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
