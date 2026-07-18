// ✏️ Exemplos Práticos: Arrays e Strings

#include <iostream>
#include <string>
#include <cstring> // Para funções de C-style string

using namespace std;

// Exemplo 1: Arrays Estáticos
void exemplo_arrays() {
    cout << "--- Exemplo 1: Arrays Estáticos ---" << endl;

    // Array de pontuações (tamanho 4)
    int pontuacoes[] = {100, 250, 50, 400};

    // Acessando e modificando elementos
    cout << "Pontuação inicial do 3º jogador (índice 2): " << pontuacoes[2] << endl;
    pontuacoes[2] = 300;
    cout << "Nova pontuação do 3º jogador: " << pontuacoes[2] << endl;

    // Iterando sobre o array
    int tamanho = sizeof(pontuacoes) / sizeof(pontuacoes[0]);
    cout << "\nTodas as pontuações:" << endl;
    for (int i = 0; i < tamanho; i++) {
        cout << "Jogador " << i + 1 << ": " << pontuacoes[i] << endl;
    }

    // Exemplo de acesso fora dos limites (NÃO FAÇA ISSO EM CÓDIGO REAL!)
    // cout << "Acesso fora dos limites: " << pontuacoes[10] << endl;

    cout << endl;
}

// Exemplo 2: Strings Estilo C (char array)
void exemplo_c_string() {
    cout << "--- Exemplo 2: Strings Estilo C ---" << endl;

    char nome_arma[20] = "Espada";
    cout << "Nome da arma: " << nome_arma << endl;

    // Concatenando (usando função da biblioteca cstring)
    char sufixo[] = " Longa";
    strcat(nome_arma, sufixo); // Concatena sufixo em nome_arma
    cout << "Nome da arma após concatenação: " << nome_arma << endl;

    cout << endl;
}

// Exemplo 3: std::string (A forma moderna)
void exemplo_std_string() {
    cout << "--- Exemplo 3: std::string ---" << endl;

    string nome_jogador = "Kael";
    string titulo = " o Mago";

    // Concatenação simples com operador +
    string nome_completo = nome_jogador + titulo;
    cout << "Nome Completo: " << nome_completo << endl;

    // Tamanho
    cout << "Tamanho da string: " << nome_completo.length() << endl;

    // Acesso a um caractere
    cout << "Primeira letra: " << nome_completo[0] << endl;

    // Busca (find)
    size_t pos = nome_completo.find("Mago");
    if (pos != string::npos) { // string::npos indica que não encontrou
        cout << "A palavra 'Mago' foi encontrada na posição: " << pos << endl;
    }

    // Substring (parte da string)
    string sub = nome_completo.substr(0, 4); // Pega 4 caracteres a partir do índice 0
    cout << "Substring (Nome): " << sub << endl;

    cout << endl;
}

// Função principal que chama todos os exemplos
int main() {
    exemplo_arrays();
    exemplo_c_string();
    exemplo_std_string();

    return 0;
}
