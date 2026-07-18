# 📚 1. Funções: Organizando o Código

## O que são Funções?

Uma **função** é um bloco de código nomeado que executa uma tarefa específica. Em vez de escrever o mesmo código repetidamente, você o encapsula em uma função e a chama sempre que precisar.

As funções são essenciais para:
1.  **Reutilização de Código:** Evitar a repetição (princípio DRY - Don't Repeat Yourself).
2.  **Modularidade:** Dividir um programa grande em partes menores e gerenciáveis.
3.  **Legibilidade:** Tornar o código mais fácil de entender.

## Estrutura de uma Função

Uma função em C++ possui quatro partes principais:

1.  **Tipo de Retorno:** O tipo de dado que a função irá retornar (ex: `int`, `float`, `bool`). Se a função não retornar nada, o tipo é `void`.
2.  **Nome:** O identificador da função (deve ser descritivo).
3.  **Parâmetros:** Uma lista de variáveis que a função aceita como entrada (opcional).
4.  **Corpo:** O bloco de código que executa a tarefa.

```cpp
// Tipo de Retorno | Nome | Parâmetros
int calcular_dano(int dano_base, float multiplicador) {
    // Corpo da função
    int dano_final = dano_base * multiplicador;
    return dano_final; // Retorna o valor
}
```

## Declaração, Definição e Chamada

Em C++, é comum separar a **declaração** (ou protótipo) da **definição** da função.

*   **Declaração (Protótipo):** Informa ao compilador que a função existe, qual seu nome, tipo de retorno e parâmetros. É geralmente colocada em arquivos de cabeçalho (`.h`) ou no início do arquivo `.cpp`.
    ```cpp
    int calcular_dano(int dano_base, float multiplicador); // Protótipo
    ```
*   **Definição:** Contém o corpo real da função.
*   **Chamada:** O ato de executar a função.
    ```cpp
    int dano_causado = calcular_dano(50, 1.5f); // Chamada
    ```

## Parâmetros e Argumentos

*   **Parâmetros:** As variáveis listadas na declaração da função (ex: `dano_base`, `multiplicador`).
*   **Argumentos:** Os valores reais passados para a função quando ela é chamada (ex: `50`, `1.5f`).

Por padrão, os argumentos são passados **por valor**. Isso significa que a função recebe uma **cópia** do valor. Qualquer alteração feita no parâmetro dentro da função não afeta a variável original fora dela.

## Sobrecarga de Funções (Overload)

A **Sobrecarga de Funções** permite que você defina múltiplas funções com o **mesmo nome**, desde que elas tenham **assinaturas diferentes**. A assinatura é definida pelo **número** e **tipo** dos parâmetros.

O tipo de retorno **não** faz parte da assinatura e não pode ser usado para diferenciar funções sobrecarregadas.

```cpp
// 1. Sobrecarga por tipo de parâmetro
int somar(int a, int b) { return a + b; }
float somar(float a, float b) { return a + b; } // Nome igual, tipos diferentes

// 2. Sobrecarga por número de parâmetro
int somar(int a, int b, int c) { return a + b + c; } // Nome igual, número diferente
```

## Escopo e Tempo de Vida de Variáveis

O **escopo** de uma variável define onde no código ela pode ser acessada. O **tempo de vida** define por quanto tempo ela existe na memória.

| Tipo de Variável | Escopo | Tempo de Vida |
| :--- | :--- | :--- |
| **Local** | Apenas dentro do bloco de código (geralmente a função) onde foi declarada. | Criada quando o bloco é executado, destruída quando o bloco termina. |
| **Global** | Em todo o arquivo (ou em todo o programa, se declarada com `extern`). | Criada no início do programa, destruída no final. (Evitar ao máximo!) |
| **Estática (`static`)** | Escopo local, mas tempo de vida global. | Criada na primeira vez que a função é chamada, persiste até o fim do programa. |

```cpp
void funcao_exemplo() {
    int variavel_local = 10; // Criada e destruída a cada chamada

    static int contador_chamadas = 0; // Criada apenas na primeira chamada
    contador_chamadas++;
    cout << "Função chamada " << contador_chamadas << " vezes." << endl;
}
```

## Funções `inline`

A palavra-chave `inline` é uma **sugestão** ao compilador para que ele substitua a chamada da função pelo corpo da função diretamente no código onde ela é chamada. Isso elimina a sobrecarga de tempo de execução de uma chamada de função, mas pode aumentar o tamanho do código (code bloat).

É mais útil para funções **muito pequenas** e que são chamadas com frequência.

## 💡 Aplicação em Game Development (Unreal Engine)

*   **Modularidade:** Cada ação de um personagem (Pular, Atirar, Curar) é encapsulada em uma função.
*   **`UFUNCTION`**: Na Unreal, a macro `UFUNCTION` é usada para expor funções ao sistema de reflexão, permitindo que sejam chamadas a partir de Blueprints, timers ou eventos de rede.
*   **Sobrecarga:** Você pode ter funções sobrecarregadas para lidar com diferentes tipos de dano: `ApplyDamage(float damageAmount)` e `ApplyDamage(float damageAmount, EDamageType type)`.

---
[Próximo: Exemplos Práticos de Funções &raquo;](exemplos.cpp)
