# 📚 2. Operadores Aritméticos, Relacionais, Lógicos e de Atribuição

## O que são Operadores?

Em C++, um **operador** é um símbolo que diz ao compilador para realizar manipulações matemáticas ou lógicas específicas. Eles são a espinha dorsal de qualquer cálculo ou tomada de decisão em seu código.

## 1. Operadores Aritméticos

Usados para realizar operações matemáticas básicas.

| Operador | Nome | Exemplo | Resultado |
| :--- | :--- | :--- | :--- |
| `+` | Adição | `5 + 3` | 8 |
| `-` | Subtração | `5 - 3` | 2 |
| `*` | Multiplicação | `5 * 3` | 15 |
| `/` | Divisão | `5 / 3` | 1 (Divisão inteira) |
| `%` | Módulo (Resto) | `5 % 3` | 2 |
| `++` | Incremento | `x++` (ou `++x`) | Adiciona 1 a `x` |
| `--` | Decremento | `x--` (ou `--x`) | Subtrai 1 de `x` |

### 💡 Atenção à Divisão Inteira e Módulo

Quando você divide dois números inteiros (`int`), o C++ realiza uma **divisão inteira**, truncando (cortando) a parte decimal.

```cpp
int a = 10;
int b = 3;
int resultado = a / b; // resultado será 3, não 3.33...
```

O operador **Módulo (`%`)** é extremamente útil em jogos para:
*   **Ciclos:** Fazer algo acontecer a cada N iterações (ex: `if (contador % 10 == 0)`).
*   **Índices Circulares:** Garantir que um índice de array não saia dos limites (ex: `indice = (indice + 1) % tamanho_array`).

## 2. Operadores de Atribuição

Usados para atribuir um valor a uma variável.

| Operador | Exemplo | Equivalente | Significado |
| :--- | :--- | :--- | :--- |
| `=` | `x = 10` | - | Atribui o valor 10 a `x` |
| `+=` | `x += 5` | `x = x + 5` | Adiciona 5 ao valor de `x` |
| `-=` | `x -= 5` | `x = x - 5` | Subtrai 5 do valor de `x` |
| `*=` | `x *= 5` | `x = x * 5` | Multiplica `x` por 5 |
| `/=` | `x /= 5` | `x = x / 5` | Divide `x` por 5 |
| `%=` | `x %= 5` | `x = x % 5` | Atribui a `x` o resto da divisão por 5 |

## 3. Operadores Relacionais (Comparação)

Usados para comparar dois valores. O resultado de uma comparação é sempre um valor booleano (`true` ou `false`).

| Operador | Nome | Exemplo | Significado |
| :--- | :--- | :--- | :--- |
| `==` | Igual a | `x == y` | `x` é igual a `y`? |
| `!=` | Diferente de | `x != y` | `x` é diferente de `y`? |
| `>` | Maior que | `x > y` | `x` é maior que `y`? |
| `<` | Menor que | `x < y` | `x` é menor que `y`? |
| `>=` | Maior ou igual a | `x >= y` | `x` é maior ou igual a `y`? |
| `<=` | Menor ou igual a | `x <= y` | `x` é menor ou igual a `y`? |

### ❌ Erro Comum: `=` vs `==`

Um erro clássico de iniciantes é usar o operador de atribuição (`=`) quando se pretendia usar o operador de comparação (`==`).

```cpp
if (vida = 0) { // ERRO! Isso atribui 0 a 'vida' e a condição é avaliada como false
    // ...
}

if (vida == 0) { // CORRETO! Isso verifica se 'vida' é igual a 0
    // ...
}
```

## 4. Operadores Lógicos

Usados para combinar ou modificar expressões booleanas.

| Operador | Nome | Exemplo | Significado |
| :--- | :--- | :--- | :--- |
| `&&` | AND lógico | `A && B` | Verdadeiro se **A e B** forem verdadeiros. |
| `||` | OR lógico | `A || B` | Verdadeiro se **A ou B** for verdadeiro. |
| `!` | NOT lógico | `!A` | Inverte o valor de `A` (Verdadeiro se `A` for falso). |

### 💡 Aplicação em Game Development

Operadores lógicos são essenciais para definir as regras do jogo:

```cpp
// O jogador pode atacar se estiver vivo E a arma estiver carregada
if (isAlive && isWeaponLoaded) {
    // ...
}

// O jogador pode pular se estiver no chão OU estiver usando um jetpack
if (isOnGround || hasJetpack) {
    // ...
}

// O inimigo não está mais vivo
if (!isAlive) {
    // ...
}
```

## 5. Precedência de Operadores

A **precedência** define a ordem em que os operadores são avaliados em uma expressão. Assim como na matemática, a multiplicação e a divisão têm precedência sobre a adição e a subtração.

| Precedência | Categoria | Operadores |
| :--- | :--- | :--- |
| Alta | Unários (Incremento/Decremento) | `++`, `--`, `!` |
| Média | Aritméticos | `*`, `/`, `%` (maior) e `+`, `-` (menor) |
| Baixa | Relacionais | `>`, `<`, `>=`, `<=`, `==`, `!=` |
| Mais Baixa | Lógicos | `&&`, `||` |
| Mais Baixa | Atribuição | `=`, `+=`, `-=` etc. |

**Regra de Ouro:** Use parênteses `()` para garantir a ordem de avaliação desejada e para tornar seu código mais legível.

```cpp
// Sem parênteses: 5 + (2 * 3) = 11
int resultado1 = 5 + 2 * 3;

// Com parênteses: (5 + 2) * 3 = 21
int resultado2 = (5 + 2) * 3;
```

---
[Próximo: Exemplos Práticos de Operadores &raquo;](exemplos.cpp)
