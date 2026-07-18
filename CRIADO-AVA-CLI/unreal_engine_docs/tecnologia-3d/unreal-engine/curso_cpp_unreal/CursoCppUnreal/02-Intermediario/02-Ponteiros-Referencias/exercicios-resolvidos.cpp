// 💡 Soluções Comentadas: Ponteiros e Referências

#include <iostream>

using namespace std;

// --- 1. Exercícios de Fixação (Fácil) ---

void fixacao_1_2_3_4() {
    cout << "--- 1.1, 1.2, 1.3, 1.4: Ponteiros e Referências ---" << endl;

    // 1.1 Declaração e Atribuição de Ponteiro
    int pontuacao = 500;
    int* ptr_pontuacao = &pontuacao;
    cout << "Valor de pontuacao via ponteiro: " << *ptr_pontuacao << endl; // 500

    // 1.2 Desreferência
    *ptr_pontuacao = 999;
    cout << "Novo valor de pontuacao: " << pontuacao << endl; // 999

    // 1.3 Referência
    float dano = 15.5f;
    float& ref_dano = dano;
    ref_dano = 20.0f;
    cout << "Novo valor de dano (via referencia): " << dano << endl; // 20.0

    // 1.4 Operadores
    cout << "Operador para endereço: & (Address-of)" << endl;
    cout << "Operador para valor apontado: * (Dereference)" << endl;
    cout << endl;
}

// --- 2. Exercícios de Aplicação (Médio) ---

// 2.1 Passagem por Referência
void dobrar_valor(int& valor) {
    valor *= 2;
}

void aplicacao_1() {
    cout << "--- 2.1 Passagem por Referência ---" << endl;
    int valor = 10;
    cout << "Valor antes: " << valor << endl; // 10
    dobrar_valor(valor);
    cout << "Valor depois: " << valor << endl; // 20
    cout << endl;
}

void aplicacao_2() {
    cout << "--- 2.2 Ponteiro para Array ---" << endl;
    int codigos[] = {10, 20, 30, 40, 50};
    int* ptr_codigo = codigos; // codigos é o endereço de codigos[0]

    // O quarto elemento está no índice 3.
    // *(ptr_codigo + 3) move o ponteiro 3 posições e desreferencia.
    cout << "Quarto elemento (índice 3) via aritmética de ponteiros: " << *(ptr_codigo + 3) << endl; // 40
    cout << endl;
}

void aplicacao_3() {
    cout << "--- 2.3 Ponteiro Nulo ---" << endl;
    float* ptr_velocidade = nullptr;

    if (ptr_velocidade != nullptr) {
        cout << "O ponteiro é válido. Velocidade: " << *ptr_velocidade << endl;
    } else {
        cout << "O ponteiro é nulo. Operação segura." << endl;
    }
    cout << endl;
}

// --- 3. Desafio (Difícil) ---

// 3.1 Troca de Valores (Swap)
void trocar_valores(int* a, int* b) {
    // 1. Armazena o valor apontado por 'a' em uma variável temporária
    int temp = *a;

    // 2. Atribui o valor apontado por 'b' ao endereço apontado por 'a'
    *a = *b;

    // 3. Atribui o valor temporário (valor original de 'a') ao endereço apontado por 'b'
    *b = temp;
}

void desafio_main() {
    cout << "--- 3.1 Troca de Valores (Swap) ---" << endl;
    int vida = 100;
    int mana = 50;

    cout << "Antes da troca: Vida=" << vida << ", Mana=" << mana << endl;

    // Passamos os ENDEREÇOS das variáveis
    trocar_valores(&vida, &mana);

    cout << "Depois da troca: Vida=" << vida << ", Mana=" << mana << endl;
    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_1_2_3_4();
    aplicacao_1();
    aplicacao_2();
    aplicacao_3();
    desafio_main();

    return 0;
}
