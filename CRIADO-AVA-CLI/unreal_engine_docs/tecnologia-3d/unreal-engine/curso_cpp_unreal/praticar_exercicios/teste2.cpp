/*
#include <iostream>

using namespace std;

int main() {
    int vector[3] = {10, 20, 30}, cont;

    for (cont = 0; cont < 3; cont++) {
        cout << cont << endl;
    }

    system("pause");
    system("cls");
    return 0;
}


#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome;
    int vida;
    char classe;
    bool vivo;
    float velocidade;

    cout << "Qual o nome do personagem? " << endl;
    cin >> nome;
    cout << "Quanto de vida ele tem de 10 a 250? " << endl;
    cin >> vida;
    cout << "Qual a sua velocidade? " << endl;
    cin >> velocidade;
    cout << "Qual a sua classe: " << endl;
    cin >> classe;
    cout << "Seu personagem está vivo? " << endl;
    cin >> vivo;

    cout << "Nome: " << nome << endl;
    cout << "Vida: " << vida << endl;
    cout << "Classe: " << classe << endl;
    cout << "Está vivo: " << vivo << endl;
    cout << "Velocidade " << velocidade << endl;

    getchar();

    system("pause");
    // system("cls");

    return 0;
}

*/

#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    int vector[3] = {10, 20, 30};
    cout << vector[0] << endl;
    cout << vector[1] << endl;
    cout << vector[2] << endl;

    cout << "--------Outra forma de impressão--------" << endl;

    float X = 10.3, Y = 20.6, Z = 55.2;
    cout << "X: " << X << endl;
    cout << "Y: " << Y << endl;
    cout << "Z: " << Z << endl;

    cout << "--------Criando Laco FOR--------" << endl;

    int Pontuacoes[] = {10, 25, 5, 40, 15};
    int tamanho = sizeof(Pontuacoes) / sizeof(Pontuacoes[0]);
    int soma = 0;

    for (int i = 0; i < tamanho; i++) {
        soma += Pontuacoes[i];
    }

    cout << "Pontuação total: " << soma << endl;
    return 0;
}
