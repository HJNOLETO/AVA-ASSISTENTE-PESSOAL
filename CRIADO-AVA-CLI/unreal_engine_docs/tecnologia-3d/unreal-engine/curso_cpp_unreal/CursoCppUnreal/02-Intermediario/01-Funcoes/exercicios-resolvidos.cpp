// 💡 Soluções Comentadas: Funções

#include <iostream>
#include <string>

using namespace std;

// --- 1. Exercícios de Fixação (Fácil) ---

// 1.1 Função Simples com Retorno
float converter_para_fahrenheit(float celsius) {
    // Fórmula: F = C * 1.8 + 32
    return celsius * 1.8f + 32.0f;
}

// 1.2 Função void
void imprimir_mensagem_de_boas_vindas(string nome_jogador) {
    cout << "Bem-vindo(a) ao jogo, " << nome_jogador << "!" << endl;
}

// 1.4 Protótipo (apenas a declaração)
bool verificar_colisao(float pos_x, float pos_y);

void fixacao_main() {
    cout << "--- 1.1 Conversão ---" << endl;
    float temp_c = 25.0f;
    cout << temp_c << "°C é igual a " << converter_para_fahrenheit(temp_c) << "°F" << endl;

    cout << "\n--- 1.2 Boas Vindas ---" << endl;
    imprimir_mensagem_de_boas_vindas("Manus");

    cout << "\n--- 1.3 Escopo Local ---" << endl;
    int x = 5;
    auto funcao_muda_x = []() {
        int x = 10; // Esta é uma nova variável 'x' local à lambda/função
        cout << "Dentro da função, x é: " << x << endl;
    };
    funcao_muda_x();
    cout << "Fora da função, x é: " << x << endl; // Permanece 5
    cout << endl;
}

// --- 2. Exercícios de Aplicação (Médio) ---

// 2.1 Sobrecarga de Funções
float calcular_area(float lado) {
    return lado * lado; // Quadrado
}

float calcular_area(float largura, float altura) {
    return largura * altura; // Retângulo
}

// 2.2 Variável Estática
int gerar_id_unico() {
    static int proximo_id = 1000; // Inicializada apenas uma vez
    return proximo_id++; // Retorna o valor atual e depois incrementa
}

// 2.3 Parâmetros Opcionais (Valor Padrão)
// O valor padrão DEVE ser especificado na declaração (protótipo)
int aplicar_buff(int vida, int cura = 10) {
    return vida + cura;
}

void aplicacao_main() {
    cout << "--- 2.1 Sobrecarga de Funções ---" << endl;
    cout << "Área do Quadrado (lado 5): " << calcular_area(5.0f) << endl;
    cout << "Área do Retângulo (5x10): " << calcular_area(5.0f, 10.0f) << endl;

    cout << "\n--- 2.2 Variável Estática ---" << endl;
    cout << "ID 1: " << gerar_id_unico() << endl; // 1000
    cout << "ID 2: " << gerar_id_unico() << endl; // 1001
    cout << "ID 3: " << gerar_id_unico() << endl; // 1002

    cout << "\n--- 2.3 Parâmetros Opcionais ---" << endl;
    int vida_atual = 80;
    cout << "Vida inicial: " << vida_atual << endl;
    cout << "Cura padrão (10): " << aplicar_buff(vida_atual) << endl; // Usa 10
    cout << "Cura forte (50): " << aplicar_buff(vida_atual, 50) << endl; // Usa 50
    cout << endl;
}

// --- 3. Desafio (Difícil) ---

int calcular_xp(int dano_causado, bool is_boss) {
    if (is_boss) {
        return dano_causado * 2;
    } else {
        // Divisão inteira para inimigos normais
        return dano_causado / 2;
    }
}

void desafio_main() {
    cout << "--- 3.1 Cálculo de XP com Condicional ---" << endl;
    int dano = 100;

    int xp_normal = calcular_xp(dano, false);
    cout << "XP por dano em Inimigo Normal: " << xp_normal << endl; // 50

    int xp_boss = calcular_xp(dano, true);
    cout << "XP por dano em Boss: " << xp_boss << endl; // 200
    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_main();
    aplicacao_main();
    desafio_main();

    return 0;
}
