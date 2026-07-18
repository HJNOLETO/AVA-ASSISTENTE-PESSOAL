// 💡 Soluções Comentadas: Arrays e Strings

#include <iostream>
#include <string>
#include <numeric> // Para std::accumulate (opcional, mas bom para mostrar)

using namespace std;

// --- 1. Exercícios de Fixação (Fácil) ---

void fixacao_1_2_3() {
    cout << "--- 1.1, 1.2, 1.3: Array e Iteração ---" << endl;

    // 1.1 Declaração
    float posicao_z[5] = {0.0f, 10.5f, 5.2f, 20.0f, 1.1f};

    // 1.2 Acesso e Modificação
    cout << "Terceiro elemento (índice 2): " << posicao_z[2] << endl; // 5.2
    posicao_z[4] = 99.9f; // Último elemento (índice 4)
    cout << "Novo valor do último elemento: " << posicao_z[4] << endl; // 99.9

    // 1.3 Iteração
    int tamanho = sizeof(posicao_z) / sizeof(posicao_z[0]);
    cout << "Elementos do array:" << endl;
    for (int i = 0; i < tamanho; i++) {
        cout << "posicao_z[" << i << "] = " << posicao_z[i] << endl;
    }
    cout << endl;
}

void fixacao_4_5() {
    cout << "--- 1.4, 1.5: Concatenação e Tamanho de String ---" << endl;

    // 1.4 Concatenação
    string primeiro_nome = "Jaina";
    string sobrenome = "Proudmoore";
    string nome_completo = primeiro_nome + " " + sobrenome;
    cout << "Nome Completo: " << nome_completo << endl;

    // 1.5 Tamanho
    cout << "Tamanho da string: " << nome_completo.length() << endl; // 19 (Jaina + espaço + Proudmoore)
    cout << endl;
}

// --- 2. Exercícios de Aplicação (Médio) ---

void aplicacao_1() {
    cout << "--- 2.1 Cálculo de Média de Dano ---" << endl;
    int danos[] = {15, 22, 18, 30, 12};
    int tamanho = sizeof(danos) / sizeof(danos[0]);
    int soma_danos = 0;

    // 1. Calcular a soma
    for (int i = 0; i < tamanho; i++) {
        soma_danos += danos[i];
    }

    // 2. Calcular a média (com casting para float)
    float media_dano = static_cast<float>(soma_danos) / tamanho;

    cout << "Soma total de danos: " << soma_danos << endl; // 97
    cout << "Média de dano: " << media_dano << endl; // 19.4
    cout << endl;
}

void aplicacao_2() {
    cout << "--- 2.2 Busca em Array ---" << endl;
    int codigos_erro[] = {404, 500, 200, 403, 503};
    int tamanho = sizeof(codigos_erro) / sizeof(codigos_erro[0]);
    int codigo_busca = 200;
    bool encontrado = false;

    for (int i = 0; i < tamanho; i++) {
        cout << "Verificando código: " << codigos_erro[i] << endl;
        if (codigos_erro[i] == codigo_busca) {
            cout << "Sucesso! Código " << codigo_busca << " encontrado." << endl;
            encontrado = true;
            break; // Para o loop
        }
    }

    if (!encontrado) {
        cout << "Código não encontrado." << endl;
    }
    cout << endl;
}

void aplicacao_3() {
    cout << "--- 2.3 Manipulação de String (Substituição) ---" << endl;
    string log = "ERRO: O jogador Player1 tentou usar um item invalido.";
    string busca = "ERRO";
    string substituicao = "AVISO";

    // 1. Localizar a posição da substring
    size_t pos = log.find(busca);

    if (pos != string::npos) {
        // 2. Substituir: (posição inicial, tamanho da busca, string de substituição)
        log.replace(pos, busca.length(), substituicao);
    }

    cout << "Log Original: ERRO: O jogador Player1 tentou usar um item invalido." << endl;
    cout << "Log Modificado: " << log << endl;
    cout << endl;
}

// --- 3. Desafio (Difícil) ---

void desafio_1() {
    cout << "--- 3.1 Inversão de String ---" << endl;
    string palavra = "Unreal";
    string palavra_invertida = "";

    // O loop deve começar do último índice (tamanho - 1) e ir até o 0
    // O tamanho de "Unreal" é 6. O último índice é 5.
    for (int i = palavra.length() - 1; i >= 0; i--) {
        // Adiciona o caractere na posição 'i' ao final da nova string
        palavra_invertida.push_back(palavra[i]);
    }

    cout << "Original: " << palavra << endl;
    cout << "Invertida: " << palavra_invertida << endl; // Saída: laernU
    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_1_2_3();
    fixacao_4_5();

    aplicacao_1();
    aplicacao_2();
    aplicacao_3();

    desafio_1();

    return 0;
}
