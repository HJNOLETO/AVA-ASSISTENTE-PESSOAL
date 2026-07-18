// 💡 Soluções Comentadas: Operadores

#include <iostream>

using namespace std;

// --- 1. Exercícios de Fixação (Fácil) ---

void fixacao_1() {
    cout << "--- 1.1 Aritmética Básica ---" << endl;
    int x = 15;
    int y = 4;

    cout << "15 + 4 = " << x + y << endl; // 19
    cout << "15 - 4 = " << x - y << endl; // 11
    cout << "15 * 4 = " << x * y << endl; // 60
    cout << "15 / 4 = " << x / y << endl; // 3 (Divisão inteira)
    cout << "15 % 4 = " << x % y << endl; // 3 (Resto)
    cout << endl;
}

void fixacao_2() {
    cout << "--- 1.2 Atribuição Composta ---" << endl;
    int moedas = 50;
    cout << "Inicial: " << moedas << endl;

    moedas += 15; // moedas = 65
    cout << "Após += 15: " << moedas << endl;

    moedas *= 2; // moedas = 130
    cout << "Após *= 2: " << moedas << endl;

    moedas -= 10; // moedas = 120
    cout << "Após -= 10: " << moedas << endl;

    cout << "Final: " << moedas << endl;
    cout << endl;
}

void fixacao_3() {
    cout << "--- 1.3 Incremento e Decremento ---" << endl;
    int a = 5;
    int b = 10;

    // Pós-incremento: 'c' recebe o valor de 'a' (5), e DEPOIS 'a' é incrementado para 6.
    int c = a++;

    // Pré-decremento: 'b' é decrementado para 9, e DEPOIS 'd' recebe o valor de 'b' (9).
    int d = --b;

    cout << "a: " << a << endl; // 6
    cout << "b: " << b << endl; // 9
    cout << "c: " << c << endl; // 5
    cout << "d: " << d << endl; // 9
    cout << endl;
}

void fixacao_4() {
    cout << "--- 1.4 Relacionais ---" << endl;
    int vida = 25;
    int limite = 50;

    cout << "Vida > Limite (25 > 50): " << (vida > limite) << endl; // false (0)
    cout << "Vida <= Limite (25 <= 50): " << (vida <= limite) << endl; // true (1)
    cout << "Vida != Limite (25 != 50): " << (vida != limite) << endl; // true (1)
    cout << endl;
}

void fixacao_5() {
    cout << "--- 1.5 Lógicos ---" << endl;
    bool is_chovendo = true;
    bool is_dia = false;
    bool is_frio = true;

    // true && true -> true
    cout << "is_chovendo && is_frio: " << (is_chovendo && is_frio) << endl;

    // false || true -> true
    cout << "is_dia || is_chovendo: " << (is_dia || is_chovendo) << endl;

    // !false && true -> true && true -> true
    cout << "!is_dia && is_frio: " << (!is_dia && is_frio) << endl;
    cout << endl;
}

// --- 2. Exercícios de Aplicação (Médio) ---

void aplicacao_1() {
    cout << "--- 2.1 Cálculo de Tempo de Jogo ---" << endl;
    int segundos_totais = 7500;

    // 7500 / 60 = 125
    int minutos = segundos_totais / 60;

    // 7500 % 60 = 0
    int segundos = segundos_totais % 60;

    cout << "Tempo total: " << segundos_totais << " segundos" << endl;
    cout << "Representa: " << minutos << " minutos e " << segundos << " segundos." << endl;
    cout << endl;
}

void aplicacao_2() {
    cout << "--- 2.2 Verificação de Estado Complexa ---" << endl;
    bool is_vivo = true;
    int mana_atual = 40;
    int custo_mana = 50;
    bool has_buff = false;

    // Condição 1: (is_vivo E mana_atual >= custo_mana)
    bool tem_mana = mana_atual >= custo_mana; // 40 >= 50 -> false
    bool condicao1 = is_vivo && tem_mana; // true && false -> false

    // Condição 2: has_buff
    bool condicao2 = has_buff; // false

    // Expressão Completa: Condição 1 OU Condição 2
    bool pode_usar_habilidade = condicao1 || condicao2;
    // false || false -> false

    cout << "Pode usar habilidade? " << pode_usar_habilidade << endl;
    cout << endl;
}

void aplicacao_3() {
    cout << "--- 2.3 Precedência com Casting ---" << endl;
    int nota1 = 7, nota2 = 8, nota3 = 9, nota4 = 10;
    int num_notas = 4;

    // Soma das notas
    int soma = nota1 + nota2 + nota3 + nota4; // 34

    // Cálculo da média com casting explícito para float
    float media = static_cast<float>(soma) / num_notas;

    cout << "Soma das notas: " << soma << endl;
    cout << "Média: " << media << endl; // 8.5
    cout << endl;
}

// --- 3. Desafio (Difícil) ---

void desafio_1() {
    cout << "--- 3.1 Sistema de Cooldown ---" << endl;
    long long cooldown_ms = 5000LL; // 5 segundos
    long long tempo_ultimo_ataque_ms = 12345LL;
    long long tempo_atual_ms = 18000LL;

    // Tempo em que o ataque estará pronto: 12345 + 5000 = 17345
    long long tempo_pronto = tempo_ultimo_ataque_ms + cooldown_ms;

    // Verifica se o tempo atual é maior ou igual ao tempo em que estará pronto
    bool is_ready = tempo_atual_ms >= tempo_pronto;
    // 18000 >= 17345 -> true

    cout << "Tempo Atual (ms): " << tempo_atual_ms << endl;
    cout << "Tempo Pronto (ms): " << tempo_pronto << endl;
    cout << "Ataque está pronto? " << is_ready << endl;
    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_1();
    fixacao_2();
    fixacao_3();
    fixacao_4();
    fixacao_5();

    aplicacao_1();
    aplicacao_2();
    aplicacao_3();

    desafio_1();

    return 0;
}
