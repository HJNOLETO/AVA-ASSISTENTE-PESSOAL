Claro! Vou criar um código simples em C++ que calcula o valor absoluto da diferença entre duas notas. Este é um
exemplo básico, então vamos abordar detalhadamente cada linha.

```cpp
#include <iostream> // Biblioteca para entrada/saída de dados
#include <cmath>    // Biblioteca para manipulação matemática

int main() {
    double nota1, nota2;  // Declaração das variáveis que armazenarão as notas
    std::cout << "Digite a primeira nota: ";  // Mensagem exibida para o usuário
    std::cin >> nota1;                       // Leitura da entrada do usuário

    std::cout << "Digite a segunda nota: ";  // Mensagem exibida para o usuário
    std::cin >> nota2;                       // Leitura da entrada do usuário

    double diferenca = abs(nota1 - nota2);   // Cálculo da diferença e aplicação de valor absoluto usando a função
abs()
    std::cout << "A diferença entre as notas é: " << diferenca << std::endl;  // Exibição do resultado final

    return 0;                                // Retorno 0 indica que o programa terminou com sucesso
}
```

### Explicação Linha por Linha:

1. `#include <iostream>` - Este comando inclui a biblioteca padrão de entrada e saída do C++, permitindo que você
   use as funções `std::cout` (para impressão na tela) e `std::cin` (para leitura de dados).

2. `#include <cmath>` - Esta linha inclui a biblioteca matemática, fornecendo acesso à função `abs`, usada para
   obter o valor absoluto.

3. `int main()` - A função principal do programa em C++, onde todo o fluxo de execução começa.

4. `double nota1, nota2;` - Declara duas variáveis do tipo `double` (que podem armazenar números reais) para
   armazenar as notas.

5. `std::cout << "Digite a primeira nota: ";` - Exibe uma mensagem solicitando ao usuário que digite a primeira
   nota.

6. `std::cin >> nota1;` - Lê o valor digitado pelo usuário e armazena na variável `nota1`.

7. `std::cout << "Digite a segunda nota: ";` - Exibe uma mensagem solicitando ao usuário que digite a segunda
   nota.

8. `std::cin >> nota2;` - Lê o valor digitado pelo usuário e armazena na variável `nota2`.

9. `double diferenca = abs(nota1 - nota2);` - Subtrai as notas (`nota1 - nota2`) e aplica a função `abs()` para
   garantir que o resultado seja sempre não-negativo, independentemente do sinal da diferença.

10. `std::cout << "A diferença entre as notas é: " << diferenca << std::endl;` - Exibe na tela a mensagem "A
    diferença entre as notas é:" seguida do valor calculado para `diferenca`.

11. `return 0;` - Indica que o programa terminou com sucesso.

Este código lida simplesmente com entrada de duas notas, cálculo da diferença e exibição do resultado final.

## EXERCÍCIO A PARTIR DAQUI

Entendi. Vamos modificar seu código para que ele identifique e imprima o maior valor dos três números lidos, e
então pergunte ao usuário qual é o maior valor. A resposta do usuário será comparada com o valor previamente
determinado como o maior, e uma mensagem apropriada será exibida.

Aqui está o código ajustado:

```cpp
#include <iostream>

int main() {
    int a, b, c;

    std::cout << "Digite os valores de A, B e C" << " : ";
    std::cin >> a >> b >> c;

    // Determinar qual é o maior valor entre A, B e C
    if (a > b && a > c) {
        int maior = a;
    } else if (b > a && b > c) {
        int maior = b;
    } else {
        int maior = c;
    }

    // Exibir o maior valor
    std::cout << "O maior número é: " << maior << std::endl;

    // Pergunta ao usuário qual foi o maior valor
    std::cout << "Qual foi o maior valor? ";
    int resposta_user;
    std::cin >> resposta_user;

    // Comparar a resposta do usuário com o valor previamente determinado
    if (resposta_user == maior) {
        std::cout << "Parabéns, você acertou!" << std::endl;
    } else {
        std::cout << "Desculpe, o maior valor era: " << maior << "." << std::endl;
    }

    return 0;
}
```

### Explicação Linha a Linha:

1. `#include <iostream>` - Este comando inclui a biblioteca padrão de entrada e saída do C++, permitindo que você
   use as funções `std::cout` (para impressão na tela) e `std::cin` (para leitura de dados).

2. `int main()` - A função principal do programa em C++, onde todo o fluxo de execução começa.

3. `int a, b, c;` - Declara três variáveis do tipo `int` para armazenar os três números inteiros que serão lidos.

4. `std::cout << "Digite os valores de A, B e C" << " : ";` - Exibe uma mensagem solicitando ao usuário que digite
   três números inteiros separados por um espaço.

5. `std::cin >> a >> b >> c;` - Lê os três números inteiros digitados pelo usuário e armazena-os nas respectivas
   variáveis.

6. ```cpp
    if (a > b && a > c) {
        int maior = a;
    } else if (b > a && b > c) {
        int maior = b;
    } else {
        int maior = c;
    }
   ```

   - Compara os três números e armazena o maior em uma variável `maior`.

7. `std::cout << "O maior número é: " << maior << std::endl;` - Exibe na tela o maior valor encontrado.

8. `std::cout << "Qual foi o maior valor? ";` - Pede ao usuário que digite qual é o maior valor.

9. `int resposta_user;` - Declara uma variável para armazenar a resposta do usuário.

10. `std::cin >> resposta_user;` - Lê a resposta do usuário e armazena-a na variável `resposta_user`.

11. ```cpp
    if (resposta_user == maior) {
        std::cout << "Parabéns, você acertou!" << std::endl;
    } else {
        std::cout << "Desculpe, o maior valor era: " << maior << "." << std::endl;
    }
    ```

- Compara a resposta do usuário com o maior valor encontrado. Se forem iguais, exibe uma mensagem de parabéns;
  caso contrário, informa qual foi o maior valor.

12. `return 0;` - Indica que o programa terminou com sucesso.

Este código lida com a leitura de três números inteiros, determina o maior valor entre eles, exibe esse valor e
então verifica se o usuário acertou qual é o maior valor.
