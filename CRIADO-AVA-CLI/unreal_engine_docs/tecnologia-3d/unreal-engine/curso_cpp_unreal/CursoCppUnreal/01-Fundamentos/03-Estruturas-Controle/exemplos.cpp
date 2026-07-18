// ✏️ Exemplos Práticos: Estruturas de Controle

#include <iostream>
#include <string>

using namespace std;

// Exemplo 1: Condicionais (if, else if, else)
void exemplo_condicionais() {
    cout << "--- Exemplo 1: Condicionais ---" << endl;

    int pontuacao = 85;

    if (pontuacao >= 90) {
        cout << "Rank: S (Excelente!)" << endl;
    } else if (pontuacao >= 70) {
        cout << "Rank: A (Muito Bom)" << endl;
    } else if (pontuacao >= 50) {
        cout << "Rank: B (Bom)" << endl;
    } else {
        cout << "Rank: C (Precisa melhorar)" << endl;
    }

    // Operador Ternário
    string status_vida = (pontuacao > 0) ? "Vivo" : "Morto";
    cout << "Status: " << status_vida << endl;

    cout << endl;
}

// Exemplo 2: Switch
void exemplo_switch() {
    cout << "--- Exemplo 2: Switch ---" << endl;

    int tipo_inimigo = 2; // 1: Goblin, 2: Orc, 3: Dragão

    switch (tipo_inimigo) {
        case 1:
            cout << "Inimigo: Goblin. Dano baixo." << endl;
            break;
        case 2:
            cout << "Inimigo: Orc. Dano médio." << endl;
            break;
        case 3:
            cout << "Inimigo: Dragão. Dano alto. Cuidado!" << endl;
            break;
        default:
            cout << "Inimigo desconhecido." << endl;
            break;
    }

    cout << endl;
}

// Exemplo 3: Loops (for)
void exemplo_for() {
    cout << "--- Exemplo 3: Loop For ---" << endl;

    int num_inimigos = 5;

    // Loop para gerar 5 inimigos
    for (int i = 0; i < num_inimigos; i++) {
        cout << "Gerando Inimigo #" << i + 1 << endl;
    }

    // Loop com incremento diferente (a cada 2 passos)
    cout << "Contagem regressiva a cada 2:" << endl;
    for (int i = 10; i >= 0; i -= 2) {
        cout << i << "..." << endl;
    }

    cout << endl;
}

// Exemplo 4: Loops (while e do-while)
void exemplo_while() {
    cout << "--- Exemplo 4: Loops While e Do-While ---" << endl;

    // While: Executa enquanto a condição for verdadeira
    int contador_tiros = 5;
    while (contador_tiros > 0) {
        cout << "Tiro disparado! Restam: " << contador_tiros << endl;
        contador_tiros--; // É CRUCIAL alterar a condição para evitar loop infinito
    }

    // Do-While: Executa pelo menos uma vez
    char tecla;
    do {
        cout << "Pressione 'S' para simular um Save Game: ";
        cin >> tecla;
    } while (tecla != 'S' && tecla != 's');
    cout << "Jogo Salvo!" << endl;

    cout << endl;
}

// Exemplo 5: Break e Continue
void exemplo_break_continue() {
    cout << "--- Exemplo 5: Break e Continue ---" << endl;

    // Break: Sai do loop
    cout << "Exemplo de Break (parar na primeira poção):" << endl;
    for (int i = 1; i <= 10; i++) {
        if (i == 4) {
            cout << "Poção encontrada! Parando a busca." << endl;
            break;
        }
        cout << "Buscando no baú #" << i << endl;
    }

    // Continue: Pula a iteração
    cout << "\nExemplo de Continue (pular baús vazios):" << endl;
    for (int i = 1; i <= 5; i++) {
        if (i == 3) {
            cout << "Baú #" << i << " está vazio. Pulando..." << endl;
            continue;
        }
        cout << "Abrindo Baú #" << i << ". Item encontrado!" << endl;
    }

    cout << endl;
}

// Função principal que chama todos os exemplos
int main() {
    exemplo_condicionais();
    exemplo_switch();
    exemplo_for();
    exemplo_while();
    exemplo_break_continue();

    return 0;
}
