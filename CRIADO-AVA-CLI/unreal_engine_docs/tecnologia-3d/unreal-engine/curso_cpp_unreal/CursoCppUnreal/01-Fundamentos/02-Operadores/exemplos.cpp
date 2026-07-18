// ✏️ Exemplos Práticos: Operadores

#include <iostream>

using namespace std;

// Exemplo 1: Operadores Aritméticos e de Atribuição
void exemplo_aritmeticos() {
    cout << "--- Exemplo 1: Aritméticos e Atribuição ---" << endl;

    int vida = 100;
    int dano = 25;
    int cura = 10;

    // Subtração e Atribuição
    vida = vida - dano; // vida = 75
    cout << "Vida após dano: " << vida << endl;

    // Atribuição Composta (+=)
    vida += cura; // vida = 75 + 10 = 85
    cout << "Vida após cura: " << vida << endl;

    // Incremento (Pós-incremento)
    int contador = 0;
    cout << "Contador antes do ++: " << contador++ << endl; // Imprime 0, depois incrementa para 1
    cout << "Contador depois do ++: " << contador << endl; // Imprime 1

    // Incremento (Pré-incremento)
    int outro_contador = 0;
    cout << "Outro Contador antes do ++: " << ++outro_contador << endl; // Incrementa para 1, depois imprime 1
    cout << "Outro Contador depois do ++: " << outro_contador << endl; // Imprime 1

    // Módulo (%)
    int tempo_total = 125; // segundos
    int minutos = tempo_total / 60; // 2
    int segundos = tempo_total % 60; // 5
    cout << "Tempo: " << minutos << " minutos e " << segundos << " segundos." << endl;

    cout << endl;
}

// Exemplo 2: Operadores Relacionais
void exemplo_relacionais() {
    cout << "--- Exemplo 2: Relacionais ---" << endl;

    int vida = 10;
    int limite_critico = 20;

    // Maior que (>)
    bool vida_alta = vida > limite_critico; // 10 > 20 -> false (0)
    cout << "Vida está alta? " << vida_alta << endl;

    // Menor ou igual a (<=)
    bool pode_curar = vida <= limite_critico; // 10 <= 20 -> true (1)
    cout << "Pode curar? " << pode_curar << endl;

    // Igual a (==)
    int pontuacao_maxima = 1000;
    int pontuacao_atual = 1000;
    bool recorde = pontuacao_atual == pontuacao_maxima; // true (1)
    cout << "Recorde atingido? " << recorde << endl;

    cout << endl;
}

// Exemplo 3: Operadores Lógicos
void exemplo_logicos() {
    cout << "--- Exemplo 3: Lógicos ---" << endl;

    bool is_vivo = true;
    bool is_envenenado = true;
    bool is_paralisado = false;

    // AND (&&): Precisa que ambos sejam true
    bool pode_mover = is_vivo && !is_paralisado; // true && true -> true
    cout << "Pode mover? " << pode_mover << endl;

    // OR (||): Precisa que pelo menos um seja true
    bool precisa_atencao = is_envenenado || !is_vivo; // true || false -> true
    cout << "Precisa de atenção? " << precisa_atencao << endl;

    // NOT (!)
    bool is_morto = !is_vivo; // !true -> false
    cout << "Está morto? " << is_morto << endl;

    // Combinação e Precedência
    // (is_vivo && !is_paralisado) || is_envenenado
    bool pode_atacar = (is_vivo && !is_paralisado) || is_envenenado;
    // (true && true) || true -> true || true -> true
    cout << "Pode atacar? " << pode_atacar << endl;

    cout << endl;
}

// Exemplo 4: Precedência e Casting
void exemplo_precedencia() {
    cout << "--- Exemplo 4: Precedência ---" << endl;

    int a = 5;
    int b = 2;
    int c = 3;

    // 5 + (2 * 3) = 11
    int resultado1 = a + b * c;
    cout << "Resultado 1 (a + b * c): " << resultado1 << endl;

    // (5 + 2) * 3 = 21
    int resultado2 = (a + b) * c;
    cout << "Resultado 2 ((a + b) * c): " << resultado2 << endl;

    // Casting para float para divisão precisa
    int total_pontos = 100;
    int jogadores = 3;
    float media = static_cast<float>(total_pontos) / jogadores;
    cout << "Média de pontos: " << media << endl;

    cout << endl;
}

// Função principal que chama todos os exemplos
int main() {
    exemplo_aritmeticos();
    exemplo_relacionais();
    exemplo_logicos();
    exemplo_precedencia();

    return 0;
}
