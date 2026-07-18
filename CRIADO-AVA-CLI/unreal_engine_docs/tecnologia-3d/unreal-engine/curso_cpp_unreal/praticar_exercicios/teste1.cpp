#include <iostream>
#include <string>
using namespace std;

int main() {
    int vida = 100;           // Inteiro
    float velocidade = 5.5f;  // Decimal
    char classe = 'G';        // Caractere
    bool vivo = true;         // Booleano
    string nome = "Kratos";   // Texto

    cout << "Nome: " << nome << endl;
    cout << "Vida: " << vida << endl;
    cout << "Velocidade: " << velocidade << endl;
    cout << "Classe: " << classe << endl;
    cout << "Vivo: " << vivo << endl;  // 1=true, 0=false

    return 0;
}