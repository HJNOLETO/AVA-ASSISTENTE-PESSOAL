# 📚 1. Variáveis e Tipos de Dados Primitivos

## O que são Variáveis?

Uma **variável** é um nome simbólico para um local de armazenamento na memória do computador. Pense nela como uma **caixa rotulada** onde você pode guardar um valor. O rótulo é o nome da variável, e o que você guarda dentro é o seu valor.

Em C++, toda variável deve ter um **tipo de dado** definido. O tipo de dado informa ao compilador duas coisas cruciais:

1.  **O tamanho** do espaço de memória a ser alocado (quantos bytes).
2.  **Como interpretar** os bits armazenados nesse espaço (se é um número inteiro, um caractere, etc.).

## Tipos de Dados Primitivos Essenciais

O C++ possui um conjunto de tipos de dados fundamentais, chamados de **primitivos**. Eles são a base para todos os outros tipos mais complexos.

### 1. Tipos Inteiros (Números Sem Parte Decimal)

| Tipo | Tamanho Mínimo (Bytes) | Faixa de Valores (Aproximada) | Quando Usar |
| :--- | :--- | :--- | :--- |
| `int` | 4 | -2 bilhões a +2 bilhões | O tipo mais comum para contagens e índices. |
| `short` | 2 | -32.768 a 32.767 | Economizar memória quando o valor é pequeno. |
| `long` | 4 ou 8 (depende do sistema) | Varia muito | Para números inteiros maiores que `int` (se for 8 bytes). |
| `long long` | 8 | ±9 x 10¹⁸ | Para números inteiros muito grandes (ex: contagem de frames em um jogo longo). |

#### Como Funciona Internamente: O Tamanho e os Limites

O C++ garante apenas um **tamanho mínimo** para cada tipo. O tamanho exato (em bytes) pode variar entre diferentes arquiteturas e compiladores, mas na maioria dos sistemas modernos de 64 bits:

*   `int` geralmente tem 4 bytes (32 bits).
*   `long long` tem 8 bytes (64 bits).

O número de bits determina a **faixa de valores** que o tipo pode armazenar. Por exemplo, um `int` de 32 bits pode armazenar $2^{32}$ valores diferentes. Como ele é **assinado** (pode ser positivo ou negativo), a faixa é dividida aproximadamente ao meio.

**Modificadores:** Você pode usar `unsigned` para dobrar a faixa positiva (ex: `unsigned int` vai de 0 a 4 bilhões) ou `signed` (padrão).

### 2. Tipos de Ponto Flutuante (Números com Parte Decimal)

| Tipo | Tamanho Mínimo (Bytes) | Precisão (Dígitos Decimais) | Quando Usar |
| :--- | :--- | :--- | :--- |
| `float` | 4 | 6-7 | Bom para gráficos e física de jogos onde a velocidade é crucial. |
| `double` | 8 | 15-16 | O padrão para cálculos científicos e financeiros, ou quando a precisão é vital. |
| `long double` | 8, 10 ou 16 | Maior que `double` | Raramente usado, apenas para precisão extrema. |

**Aplicações em Game Development:** Coordenadas de posição (`x`, `y`, `z`), velocidade, rotação e cálculos de física são quase sempre armazenados como `float` ou `double`. Em Unreal Engine, o tipo `float` é o mais comum para coordenadas de mundo.

### 3. Tipos Lógicos e Caracteres

| Tipo | Tamanho (Bytes) | Uso |
| :--- | :--- | :--- |
| `bool` | 1 | Armazena apenas `true` (verdadeiro) ou `false` (falso). |
| `char` | 1 | Armazena um único caractere (ex: 'A', 'b', '5'). |

**Aplicações em Game Development:**
*   `bool`: Usado para estados de jogo (ex: `isDead`, `canJump`, `isMoving`).
*   `char`: Usado para construir strings (sequências de caracteres).

## Declaração e Inicialização

Para usar uma variável, você deve primeiro **declarar** seu tipo e nome, e opcionalmente **inicializá-la** com um valor.

```cpp
// Declaração: Tipo seguido pelo nome da variável
int pontuacao;

// Inicialização (atribuição de valor)
pontuacao = 100;

// Declaração e Inicialização na mesma linha (boa prática!)
float velocidade = 5.5f; // O 'f' indica que 5.5 é um float, não um double
bool isGameOver = false;
char inicial = 'M';
```

## Conversão entre Tipos (Casting)

Às vezes, você precisa converter um valor de um tipo para outro. Isso é chamado de **casting**.

### 1. Conversão Implícita (Automática)

Ocorre quando o compilador pode converter um tipo para outro "mais seguro" (sem perda de dados).

```cpp
int inteiro = 10;
double decimal = inteiro; // Conversão implícita: 10 se torna 10.0
```

### 2. Conversão Explícita (Manual)

Ocorre quando você força a conversão, geralmente de um tipo maior para um menor, o que pode causar **perda de dados**.

```cpp
double pi = 3.14159;
// Casting estilo C (antigo)
int pi_inteiro_c = (int)pi; // pi_inteiro_c será 3 (perda da parte decimal)

// Casting estilo C++ (preferido)
int pi_inteiro_cpp = static_cast<int>(pi); // pi_inteiro_cpp será 3
```

## 💡 Aplicação em Game Development (Unreal Engine)

Na Unreal Engine, você usará C++ para definir as propriedades dos seus objetos de jogo.

*   **`UPROPERTY`**: Esta macro é usada para expor variáveis ao editor da Unreal (Blueprints).
*   **Tipos de Dados**: Você usará `float` para posições e velocidades, `int` para contagem de munição ou vida, e `bool` para estados.

```cpp
// Exemplo de como você declararia variáveis em uma classe da Unreal
class AMyCharacter : public ACharacter
{
    // ...
    // UPROPERTY expõe a variável ao editor da Unreal
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
    int Health = 100; // Vida do personagem (int)

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement")
    float MovementSpeed = 500.0f; // Velocidade (float)

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "State")
    bool bIsJumping = false; // Estado (bool)
    // ...
};
```

## ❌ Erros Comuns

1.  **Overflow/Underflow**: Tentar armazenar um valor maior do que o tipo pode suportar (ex: um número muito grande em um `short`). O resultado é um "wrap-around" (o número volta ao seu valor mínimo/máximo), causando bugs difíceis de rastrear.
2.  **Perda de Precisão**: Atribuir um `float` a um `int` sem querer, perdendo a parte decimal.
3.  **Não Inicializar**: Declarar uma variável e usá-la antes de dar um valor. O valor será lixo (`garbage value`) da memória, levando a um comportamento imprevisível.

---
[Próximo: Exemplos Práticos de Variáveis e Tipos &raquo;](exemplos.cpp)
