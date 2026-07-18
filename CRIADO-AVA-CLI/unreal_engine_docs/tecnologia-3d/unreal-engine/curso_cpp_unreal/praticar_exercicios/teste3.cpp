#include <locale.h>

#include <cmath>
#include <iostream>

using namespace std;
/*
int main() {
    float nota1, nota2, media;
    cout << "Digite a primeira nota: ";
    cin >> nota1;
    cout << "Digite a segunda nota: ";
    cin >> nota2;

    media = (nota1 + nota2) / 2;
    cout << "A média é: " << media << endl;

    return 0;
}


int main() {
    setlocale(LC_ALL, "");

    // Crie um algoritimo que leia 2 notas e mostre o valor absoluto da diferença entre elas.
    float nota1, nota2, diferenca;
    cout << "Digite a primeira nota: ";
    cin >> nota1;
    cout << "Digite a segunda nota: ";
    cin >> nota2;

    diferenca = abs(nota1 - nota2);
    cout << "A diferença absoluta entre as notas é: " << diferenca << endl;

    return 0;
}


int main() {
    int a, b, c, resultado;
    cout << "Digite tres valores inteiros: ";
    cin >> a >> b >> c;
    resultado = a * b * c;
    cout << "O resultado da multiplicacao e: " << resultado << endl;

    return 0;
}



int main() {
    int idade;
    cout << "Digite sua idade: ";
    cin >> idade;

    if (idade > 17) {
        cout << " Voce e maior de idade." << endl;
    } else {
        cout << " Voce e menor de idade." << endl;
    }
    return 0;
}

*/

int main() {
    int a, b, soma;
    cout << "Digite o primeiro valor: " << endl;
    cin >> a;
    cout << "Digite o segundo valor: " << endl;
    cin >> b;
    soma = a + b;
    if (soma >= 10) {
        cout << "A soma e maior ou igual a 10" << endl;
    } else if (soma <= 10) {
        cout << "A soma e menor ou igual a 10" << endl;
    } else {
        cout << "A soma e igual a: " << soma << endl;
    }
    return 0;
}