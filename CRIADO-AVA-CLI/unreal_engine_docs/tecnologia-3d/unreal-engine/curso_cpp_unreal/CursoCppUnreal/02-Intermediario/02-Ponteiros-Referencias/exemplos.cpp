// ✏️ Exemplos Práticos: Ponteiros e Referências

#include <iostream>

using namespace std;

// Exemplo 1: Ponteiros Básicos
void exemplo_ponteiros() {
    cout << "--- Exemplo 1: Ponteiros Básicos ---" << endl;

    int vida = 100;
    int* ptr_vida = &vida; // ptr_vida armazena o endereço de 'vida'

    cout << "Valor de 'vida': " << vida << endl;
    cout << "Endereço de 'vida' (&vida): " << &vida << endl;
    cout << "Valor de 'ptr_vida': " << ptr_vida << endl; // Deve ser o mesmo endereço
    cout << "Valor apontado por 'ptr_vida' (*ptr_vida): " << *ptr_vida << endl;

    // Alterando o valor através do ponteiro
    *ptr_vida = 50;
    cout << "Novo valor de 'vida' após desreferência: " << vida << endl;

    cout << endl;
}

// Exemplo 2: Referências Básicas
void exemplo_referencias() {
    cout << "--- Exemplo 2: Referências Básicas ---" << endl;

    int mana = 200;
    int& ref_mana = mana; // ref_mana é um apelido para mana

    cout << "Valor de 'mana': " << mana << endl;
    cout << "Valor de 'ref_mana': " << ref_mana << endl;

    // Alterando o valor através da referência
    ref_mana = 150;
    cout << "Novo valor de 'mana' após alteração via referência: " << mana << endl;

    // Tentativa de reatribuir a referência (não funciona, apenas altera o valor)
    int outra_mana = 50;
    ref_mana = outra_mana; // Isso atribui o VALOR de 'outra_mana' a 'mana' (e 'ref_mana')
    cout << "Valor de 'mana' após 'ref_mana = outra_mana': " << mana << endl; // 50
    cout << "Valor de 'outra_mana': " << outra_mana << endl; // 50

    cout << endl;
}

// Exemplo 3: Passagem por Referência (Função)
void curar_por_referencia(int& vida) {
    vida += 50;
    cout << "Curado! Vida dentro da função: " << vida << endl;
}

void exemplo_passagem() {
    cout << "--- Exemplo 3: Passagem por Referência ---" << endl;

    int vida_personagem = 100;
    cout << "Vida antes da cura: " << vida_personagem << endl;

    curar_por_referencia(vida_personagem);

    cout << "Vida depois da cura: " << vida_personagem << endl; // O valor mudou!

    cout << endl;
}

// Exemplo 4: Ponteiros e Arrays
void exemplo_ponteiros_arrays() {
    cout << "--- Exemplo 4: Ponteiros e Arrays ---" << endl;

    int pontuacoes[] = {10, 20, 30, 40};
    int* ptr_pontuacoes = pontuacoes; // O nome do array é o endereço do primeiro elemento

    cout << "Primeiro elemento (pontuacoes[0]): " << *ptr_pontuacoes << endl;

    // Aritmética de Ponteiros: Avança para o próximo elemento
    ptr_pontuacoes++;
    cout << "Segundo elemento (*(ptr_pontuacoes + 1)): " << *ptr_pontuacoes << endl; // 20

    // Acessando o terceiro elemento sem mover o ponteiro
    cout << "Terceiro elemento (*(pontuacoes + 2)): " << *(pontuacoes + 2) << endl; // 30

    cout << endl;
}

// Função principal que chama todos os exemplos
int main() {
    exemplo_ponteiros();
    exemplo_referencias();
    exemplo_passagem();
    exemplo_ponteiros_arrays();

    return 0;
}
