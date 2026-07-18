# 🎯 Projeto Integrador 1: Calculadora Simples

## Desafio: Criar uma Calculadora de Linha de Comando

Este projeto integrador consolidará todos os conceitos aprendidos no Módulo 01: **Variáveis, Tipos de Dados, Operadores e Estruturas de Controle**.

Você deve criar um programa C++ que funcione como uma calculadora simples de linha de comando.

### Requisitos

1.  **Entrada de Dados:** O programa deve solicitar ao usuário:
    *   O primeiro número (`double`).
    *   O operador desejado (`char`: `+`, `-`, `*`, `/`).
    *   O segundo número (`double`).

2.  **Processamento:**
    *   Use uma estrutura `switch` para determinar qual operação realizar com base no operador fornecido.
    *   Realize a operação aritmética correspondente.

3.  **Saída de Dados:**
    *   Imprima o resultado da operação.
    *   Se o operador for inválido, imprima uma mensagem de erro.
    *   **Tratamento de Erro:** Se o usuário tentar uma divisão por zero (`/ 0`), imprima uma mensagem de erro específica ("Erro: Divisão por zero não é permitida.").

### Exemplo de Interação

```
Calculadora Simples C++
-----------------------
Digite o primeiro número: 10.5
Digite o operador (+, -, *, /): *
Digite o segundo número: 2
Resultado: 21
```

### Dicas

*   Use `double` para os números para garantir que a calculadora possa lidar com números decimais.
*   Use `char` para o operador.
*   Use `cin` para a entrada de dados.
*   A estrutura `switch` é ideal para lidar com os diferentes operadores.
*   Dentro do `case '/'`, adicione um `if` para verificar se o segundo número é zero.

---
[Próximo: Solução do Projeto Integrador &raquo;](solucao.cpp)
