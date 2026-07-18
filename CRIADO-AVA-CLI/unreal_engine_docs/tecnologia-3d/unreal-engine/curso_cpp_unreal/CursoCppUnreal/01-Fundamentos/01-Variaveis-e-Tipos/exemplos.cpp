// ✏️ Exemplos Práticos: Variáveis e Tipos de Dados

#include <iostream>
#include <limits> // Para verificar limites de tipos

using namespace std;

// Exemplo 1: Declaração e Inicialização de Tipos Inteiros
void exemplo_inteiros() {
    cout << "--- Exemplo 1: Tipos Inteiros ---" << endl;

    // Declaração e inicialização de um int
    int vida_personagem = 100;
    cout << "Vida do Personagem (int): " << vida_personagem << endl;

    // Uso de short para economizar memória (se o valor for pequeno)
    short nivel_jogador = 5;
    cout << "Nível do Jogador (short): " << nivel_jogador << endl;

    // Uso de long long para números muito grandes (ex: XP total)
    long long experiencia_total = 9876543210LL; // O sufixo LL indica long long
    cout << "XP Total (long long): " << experiencia_total << endl;

    // Tipo unsigned (apenas positivo)
    unsigned int municao = 30;
    cout << "Munição (unsigned int): " << municao << endl;

    cout << endl;
}

// Exemplo 2: Tipos de Ponto Flutuante e Precisão
void exemplo_flutuantes() {
    cout << "--- Exemplo 2: Tipos de Ponto Flutuante ---" << endl;

    // float (precisão menor, 4 bytes)
    float posicao_x = 150.5f; // O 'f' é crucial para indicar que é um float
    cout << "Posição X (float): " << posicao_x << endl;

    // double (precisão maior, 8 bytes)
    double velocidade_nave = 3.1415926535;
    cout << "Velocidade da Nave (double): " << velocidade_nave << endl;

    // Demonstração de perda de precisão (apenas conceitual, nem sempre visível)
    float a = 1000000.0f;
    float b = 0.0000001f;
    float c = a + b;
    // O resultado de c pode ser apenas 1000000.0f, perdendo o b
    cout << "Soma com float (pode perder precisão): " << c << endl;

    cout << endl;
}

// Exemplo 3: Tipos Lógicos e Caracteres
void exemplo_bool_char() {
    cout << "--- Exemplo 3: Tipos Lógicos e Caracteres ---" << endl;

    // bool (verdadeiro ou falso)
    bool is_vivo = true;
    bool is_morto = false;

    cout << "Personagem está vivo? (true=1, false=0): " << is_vivo << endl;
    cout << "Personagem está morto? (true=1, false=0): " << is_morto << endl;

    // char (um único caractere)
    char tecla_pressionada = 'W';
    cout << "Tecla de movimento: " << tecla_pressionada << endl;

    cout << endl;
}

// Exemplo 4: Conversão de Tipos (Casting)
void exemplo_casting() {
    cout << "--- Exemplo 4: Conversão de Tipos (Casting) ---" << endl;

    double valor_bruto = 9.99;

    // Conversão Explícita (Casting) para int: Perde a parte decimal
    int valor_inteiro = static_cast<int>(valor_bruto);
    cout << "Valor Bruto (double): " << valor_bruto << endl;
    cout << "Valor Inteiro (int): " << valor_inteiro << endl; // Saída: 9

    // Conversão Implícita: int para float (seguro)
    int pontuacao_base = 50;
    float pontuacao_final = pontuacao_base;
    cout << "Pontuação Base (int): " << pontuacao_base << endl;
    cout << "Pontuação Final (float): " << pontuacao_final << endl; // Saída: 50.0

    // Cuidado com a divisão de inteiros!
    int total_itens = 10;
    int jogadores = 3;
    // Divisão de inteiros resulta em inteiro (truncamento)
    int itens_por_jogador = total_itens / jogadores;
    cout << "Itens por Jogador (int/int): " << itens_por_jogador << endl; // Saída: 3

    // Para obter o resultado correto, converta um dos operandos para float/double
    double itens_por_jogador_correto = static_cast<double>(total_itens) / jogadores;
    cout << "Itens por Jogador (double/int): " << itens_por_jogador_correto << endl; // Saída: 3.333...

    cout << endl;
}

// Função principal que chama todos os exemplos
int main() {
    exemplo_inteiros();
    exemplo_flutuantes();
    exemplo_bool_char();
    exemplo_casting();

    return 0;
}
