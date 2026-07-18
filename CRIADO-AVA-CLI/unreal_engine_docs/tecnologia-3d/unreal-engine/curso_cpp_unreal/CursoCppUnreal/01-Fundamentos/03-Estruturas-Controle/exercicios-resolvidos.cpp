// 💡 Soluções Comentadas: Estruturas de Controle

#include <iostream>
#include <string>

using namespace std;

// --- 1. Exercícios de Fixação (Fácil) ---

void fixacao_1() {
    cout << "--- 1.1 Condicional Simples ---" << endl;
    int moedas = 100;

    if (moedas >= 50) {
        cout << "Você pode comprar o item!" << endl;
    }
    cout << endl;
}

void fixacao_2() {
    cout << "--- 1.2 if-else-if ---" << endl;
    int nivel_jogador = 15;

    if (nivel_jogador < 10) {
        cout << "Novato" << endl;
    } else if (nivel_jogador >= 10 && nivel_jogador <= 20) {
        // A condição 'nivel_jogador >= 10' é implícita, pois a primeira falhou.
        cout << "Aventureiro" << endl;
    } else {
        cout << "Veterano" << endl;
    }
    cout << endl;
}

void fixacao_3() {
    cout << "--- 1.3 Loop for (Pares) ---" << endl;
    for (int i = 0; i <= 20; i += 2) {
        cout << i << " ";
    }
    cout << endl << endl;
}

void fixacao_4() {
    cout << "--- 1.4 Loop while (Recarga) ---" << endl;
    int balas = 0;
    while (balas < 10) {
        balas++;
        cout << "Balas: " << balas << endl;
    }
    cout << "Recarga completa!" << endl;
    cout << endl;
}

void fixacao_5() {
    cout << "--- 1.5 Operador Ternário ---" << endl;
    int distancia = 8;
    string acao = (distancia < 5) ? "Atacar" : "Correr";
    cout << "Ação: " << acao << endl; // Saída: Correr
    cout << endl;
}

// --- 2. Exercícios de Aplicação (Médio) ---

void aplicacao_1() {
    cout << "--- 2.1 Máquina de Estado com switch ---" << endl;
    int estado_inimigo = 2; // Teste com 0, 1, 2 e 99

    switch (estado_inimigo) {
        case 0:
            cout << "Inimigo em estado Ocioso (Idle)." << endl;
            break;
        case 1:
            cout << "Inimigo em estado de Patrulha (Patrol)." << endl;
            break;
        case 2:
            cout << "Inimigo em estado de Ataque (Attack)." << endl;
            break;
        default:
            cout << "Estado Desconhecido. Voltando para Idle." << endl;
            // Poderíamos adicionar 'estado_inimigo = 0;' aqui
            break;
    }
    cout << endl;
}

void aplicacao_2() {
    cout << "--- 2.2 Busca com break ---" << endl;
    int item_raro_caixa = 7;

    for (int i = 1; i <= 10; i++) {
        cout << "Buscando na caixa #" << i << endl;
        if (i == item_raro_caixa) {
            cout << "Item Raro encontrado na caixa " << i << "!" << endl;
            break; // Sai do loop imediatamente
        }
    }
    cout << endl;
}

void aplicacao_3() {
    cout << "--- 2.3 Filtragem com continue ---" << endl;
    for (int i = 0; i < 10; i++) {
        // Se o índice for par (resto da divisão por 2 é 0), pula
        if (i % 2 == 0) {
            cout << "Inimigo " << i << " (Par) ignorado." << endl;
            continue; // Pula para a próxima iteração
        }
        // Este código só é executado para índices ímpares
        cout << "Processando Inimigo [" << i << "]" << endl;
    }
    cout << endl;
}

// --- 3. Desafio (Difícil) ---

void desafio_1() {
    cout << "--- 3.1 Validação de Entrada com do-while ---" << endl;
    int numero;

    do {
        cout << "Digite um número de 1 a 10: ";
        // A entrada de dados deve ser feita dentro do loop
        if (!(cin >> numero)) {
            // Lida com entrada inválida (ex: texto)
            cout << "Entrada inválida. Tente novamente." << endl;
            cin.clear(); // Limpa o estado de erro
            cin.ignore(numeric_limits<streamsize>::max(), '\n'); // Descarta o restante da linha
            numero = 0; // Garante que o loop continue
        }
    } while (numero < 1 || numero > 10); // A condição é verificada no final

    cout << "Número válido: " << numero << endl;
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
