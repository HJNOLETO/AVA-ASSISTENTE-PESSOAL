// ✏️ Exemplos Práticos: Funções

#include <iostream>
#include <string>

using namespace std;

// Protótipo da função (declaração)
void imprimir_status(string nome, int vida, int mana);

// Exemplo 1: Função Simples com Retorno e Parâmetros
int calcular_dano(int dano_base, float multiplicador) {
    // Parâmetros são passados por valor (cópia)
    int dano_final = static_cast<int>(dano_base * multiplicador);
    return dano_final; // Retorna um int
}

// Exemplo 2: Função sem Retorno (void)
void imprimir_status(string nome, int vida, int mana) {
    cout << "--- Status de " << nome << " ---" << endl;
    cout << "Vida: " << vida << endl;
    cout << "Mana: " << mana << endl;
}

// Exemplo 3: Sobrecarga de Funções (Overload)
// Versão 1: Aplica dano com multiplicador padrão
void aplicar_dano(int& vida, int dano_base) {
    vida -= dano_base;
    cout << "Dano normal aplicado: " << dano_base << ". Vida restante: " << vida << endl;
}

// Versão 2: Aplica dano com multiplicador crítico
void aplicar_dano(int& vida, int dano_base, float multiplicador_critico) {
    int dano_critico = static_cast<int>(dano_base * multiplicador_critico);
    vida -= dano_critico;
    cout << "Dano CRÍTICO aplicado: " << dano_critico << ". Vida restante: " << vida << endl;
}

// Exemplo 4: Escopo e Variáveis Estáticas
void contar_chamadas() {
    // Variável estática: Criada apenas na primeira chamada, persiste entre chamadas
    static int contador = 0;
    contador++;
    cout << "A função 'contar_chamadas' foi chamada " << contador << " vezes." << endl;

    // Variável local: Criada e destruída a cada chamada
    int temp = 1;
    // cout << "Variável local temp: " << temp << endl;
}

// Exemplo 5: Função Inline (Sugestão ao compilador)
inline int dobro(int x) {
    return x * 2;
}

// Função principal que chama todos os exemplos
int main() {
    // Exemplo 1: Chamada de função com retorno
    int dano_base_ataque = 60;
    float multiplicador_critico = 1.5f;
    int dano_final = calcular_dano(dano_base_ataque, multiplicador_critico);
    cout << "Dano final calculado: " << dano_final << endl; // 90

    // Exemplo 2: Chamada de função void
    imprimir_status("Guerreiro", 150, 50);

    // Exemplo 3: Sobrecarga
    int vida_inimigo = 200;
    aplicar_dano(vida_inimigo, 50); // Chama a Versão 1
    aplicar_dano(vida_inimigo, 50, 2.0f); // Chama a Versão 2 (dano base 50 * 2.0 = 100)

    // Exemplo 4: Variáveis Estáticas
    contar_chamadas(); // 1
    contar_chamadas(); // 2
    contar_chamadas(); // 3

    // Exemplo 5: Função Inline
    int valor = 10;
    int resultado_dobro = dobro(valor); // O compilador pode substituir por 'valor * 2'
    cout << "O dobro de " << valor << " é " << resultado_dobro << endl;

    return 0;
}
