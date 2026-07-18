# 💡 Explicação da Solução: Calculadora Simples

A solução da calculadora simples é um excelente exemplo de como os fundamentos do C++ trabalham juntos para criar um programa funcional.

## Conceitos Aplicados

1.  **Variáveis e Tipos de Dados:**
    *   Usamos `double` para `num1`, `num2` e `resultado` para garantir que a calculadora possa lidar com números de ponto flutuante (decimais), como 10.5.
    *   Usamos `char` para `operador` porque ele armazena um único caractere (`+`, `-`, `*`, `/`).
    *   A variável `bool operacao_valida` é usada para controlar se o resultado deve ser impresso ou se uma mensagem de erro já foi exibida.

2.  **Entrada e Saída (`cin` e `cout`):**
    *   O `cout` é usado para solicitar a entrada do usuário.
    *   O `cin` é usado para ler os valores digitados e armazená-los nas variáveis.

3.  **Estrutura `switch`:**
    *   A estrutura `switch` é usada para tomar uma decisão clara baseada no valor da variável `operador`.
    *   Cada `case` lida com um operador específico (`+`, `-`, `*`, `/`).
    *   O `break` é crucial em cada `case` para evitar que a execução continue para o próximo bloco.
    *   O `default` captura qualquer operador que não seja um dos quatro esperados, tratando-o como um erro.

4.  **Operadores Aritméticos:**
    *   Os operadores `+`, `-`, `*`, `/` são usados diretamente dentro de seus respectivos `case`s.

5.  **Estrutura `if` (Tratamento de Erro):**
    *   Dentro do `case '/'`, uma estrutura `if` aninhada é usada para verificar a condição de erro: `if (num2 == 0)`.
    *   Se a condição for verdadeira, a mensagem de erro é impressa e `operacao_valida` é definida como `false`, impedindo que o resultado seja impresso no final do programa.

## Código Chave

```cpp
// 5. Processamento com switch
switch (operador) {
    case '+':
        resultado = num1 + num2;
        break;
    // ... outros cases
    case '/':
        // Tratamento de Erro: Divisão por zero
        if (num2 == 0) {
            cout << "Erro: Divisão por zero não é permitida." << endl;
            operacao_valida = false;
        } else {
            resultado = num1 / num2;
        }
        break;
    default:
        cout << "Erro: Operador inválido. Use +, -, *, ou /." << endl;
        operacao_valida = false;
        break;
}

// 6. Saída de Dados
if (operacao_valida) {
    cout << "Resultado: " << resultado << endl;
}
```

Este projeto demonstra como a combinação de tipos de dados, operadores e estruturas de controle forma a base para a lógica de qualquer programa, incluindo jogos.

---
[Próximo: Módulo 02 - Intermediário &raquo;](../../02-Intermediario/modulo.html)
