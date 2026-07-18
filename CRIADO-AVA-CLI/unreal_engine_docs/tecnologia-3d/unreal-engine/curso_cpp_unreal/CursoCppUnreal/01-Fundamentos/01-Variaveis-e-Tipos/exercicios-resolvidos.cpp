// 💡 Soluções Comentadas: Variáveis e Tipos de Dados

#include <iostream>
#include <limits>

using namespace std;

// --- 1. Exercícios de Fixação (Fácil) ---

void fixacao_1() {
    cout << "--- 1.1 Declaração e Inicialização ---" << endl;
    int vida_maxima = 250;
    float taxa_critica = 0.35f; // Usamos 'f' para float
    char nome_inicial = 'K';
    bool jogo_pausado = true;

    cout << "Vida Máxima: " << vida_maxima << endl;
    cout << "Taxa Crítica: " << taxa_critica << endl;
    cout << "Inicial: " << nome_inicial << endl;
    cout << "Jogo Pausado (1=true, 0=false): " << jogo_pausado << endl;
    cout << endl;
}

void fixacao_2() {
    cout << "--- 1.2 Tamanho na Memória (sizeof) ---" << endl;
    cout << "Tamanho de int: " << sizeof(int) << " bytes" << endl;
    cout << "Tamanho de double: " << sizeof(double) << " bytes" << endl;
    cout << "Tamanho de bool: " << sizeof(bool) << " bytes" << endl;
    cout << "Tamanho de long long: " << sizeof(long long) << " bytes" << endl;
    cout << endl;
}

void fixacao_3() {
    cout << "--- 1.3 Entrada de Dados (cin) ---" << endl;
    int idade;
    float saldo;

    cout << "Digite sua idade: ";
    cin >> idade;

    cout << "Digite seu saldo bancário: ";
    cin >> saldo;

    cout << "Idade digitada: " << idade << endl;
    cout << "Saldo digitado: " << saldo << endl;
    cout << endl;
}

void fixacao_4() {
    cout << "--- 1.4 Casting Implícito ---" << endl;
    int a = 5;
    double b = 2.0;
    double resultado = a / b;
    cout << "Resultado: " << resultado << endl;
    /*
    Explicação: O resultado será 2.5.
    A divisão é feita entre um 'int' (a) e um 'double' (b).
    O C++ promove o 'int' para 'double' (5.0) antes da divisão para evitar perda de dados.
    Portanto, a operação é 5.0 / 2.0, resultando em 2.5.
    */
    cout << endl;
}

void fixacao_5() {
    cout << "--- 1.5 Casting Explícito ---" << endl;
    float dano_bruto = 15.75f;
    int dano_final = static_cast<int>(dano_bruto);

    cout << "Dano Bruto: " << dano_bruto << endl;
    cout << "Dano Final (inteiro): " << dano_final << endl; // Saída: 15
    cout << endl;
}

// --- 2. Exercícios de Aplicação (Médio) ---

void aplicacao_1() {
    cout << "--- 2.1 Cálculo de Dano ---" << endl;
    int dano_base = 50;
    float reducao_dano = 0.15f; // 15%

    // Cálculo da redução: 50 * 0.15 = 7.5
    float dano_reduzido = dano_base * reducao_dano;

    // Dano final: 50 - 7.5 = 42.5
    float dano_final = dano_base - dano_reduzido;

    // Se quisermos o dano final como inteiro (truncado):
    int dano_final_int = static_cast<int>(dano_final);

    cout << "Dano Base: " << dano_base << endl;
    cout << "Redução de Dano: " << reducao_dano * 100 << "%" << endl;
    cout << "Dano Final (float): " << dano_final << endl;
    cout << "Dano Final (int truncado): " << dano_final_int << endl;
    cout << endl;
}

void aplicacao_2() {
    cout << "--- 2.2 Controle de Munição ---" << endl;
    int balas_totais = 100;
    int balas_por_tiro = 3;

    // Divisão de inteiros (truncamento) para saber quantos tiros completos
    int tiros_possiveis = balas_totais / balas_por_tiro;

    // Operador módulo (%) para saber o resto
    int balas_restantes = balas_totais % balas_por_tiro;

    cout << "Balas Totais: " << balas_totais << endl;
    cout << "Balas por Tiro: " << balas_por_tiro << endl;
    cout << "Tiros Possíveis: " << tiros_possiveis << endl; // Saída: 33
    cout << "Balas Restantes: " << balas_restantes << endl; // Saída: 1
    cout << endl;
}

void aplicacao_3() {
    cout << "--- 2.3 Conversão de Temperatura ---" << endl;
    float celsius = 25.0f;
    // Fórmula: F = C * 1.8 + 32
    float fahrenheit = celsius * 1.8f + 32.0f;

    cout << "Temperatura em Celsius: " << celsius << "°C" << endl;
    cout << "Temperatura em Fahrenheit: " << fahrenheit << "°F" << endl; // Saída: 77.0
    cout << endl;
}

// --- 3. Desafio (Difícil) ---

void desafio_1() {
    cout << "--- 3.1 Simulação de Overflow ---" << endl;
    short contador_inimigos = 32767; // Valor máximo para short

    cout << "Valor inicial (MAX_SHORT): " << contador_inimigos << endl;

    // Incrementando em 1
    contador_inimigos = contador_inimigos + 1;

    cout << "Valor após incremento: " << contador_inimigos << endl; // Saída: -32768

    /*
    Explicação do Overflow:
    O tipo 'short' é um inteiro de 16 bits assinado, com faixa de -32768 a 32767.
    Quando o valor máximo (32767) é excedido, o contador "dá a volta" (wrap-around)
    e volta para o valor mínimo (-32768). Isso é chamado de OVERFLOW.
    Em C++, o overflow de inteiros assinados é um comportamento indefinido,
    mas na maioria dos sistemas, ele se comporta como um wrap-around.
    */
    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_1();
    fixacao_2();
    // fixacao_3(); // Descomente para testar a entrada de dados
    fixacao_4();
    fixacao_5();

    aplicacao_1();
    aplicacao_2();
    aplicacao_3();

    desafio_1();

    return 0;
}
