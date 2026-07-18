// 💡 Solução do Projeto Integrador 1: Calculadora Simples

#include <iostream>
#include <limits> // Para cin.ignore

using namespace std;

int main() {
    // 1. Declaração de Variáveis
    double num1, num2;
    char operador;
    double resultado = 0.0;
    bool operacao_valida = true;

    cout << "Calculadora Simples C++" << endl;
    cout << "-----------------------" << endl;

    // 2. Entrada do Primeiro Número
    cout << "Digite o primeiro número: ";
    if (!(cin >> num1)) {
        cout << "Erro: Entrada inválida para o primeiro número." << endl;
        return 1; // Encerra o programa com erro
    }

    // 3. Entrada do Operador
    cout << "Digite o operador (+, -, *, /): ";
    cin >> operador;

    // 4. Entrada do Segundo Número
    cout << "Digite o segundo número: ";
    if (!(cin >> num2)) {
        cout << "Erro: Entrada inválida para o segundo número." << endl;
        return 1; // Encerra o programa com erro
    }

    // 5. Processamento com switch
    switch (operador) {
        case '+':
            resultado = num1 + num2;
            break;
        case '-':
            resultado = num1 - num2;
            break;
        case '*':
            resultado = num1 * num2;
            break;
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

    return 0;
}
