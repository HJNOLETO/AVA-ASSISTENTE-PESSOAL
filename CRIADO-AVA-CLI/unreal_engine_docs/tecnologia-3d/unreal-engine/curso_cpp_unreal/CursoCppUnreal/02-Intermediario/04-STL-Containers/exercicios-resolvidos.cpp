// 💡 Soluções Comentadas: STL Containers

#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <stack>
#include <queue>
#include <algorithm> // Para std::find (opcional)

using namespace std;

// --- 1. Exercícios de Fixação (Fácil) ---

void fixacao_1() {
    cout << "--- 1.1 std::vector ---" << endl;
    vector<float> posicoes_x;
    posicoes_x.push_back(10.0f);
    posicoes_x.push_back(20.5f);
    posicoes_x.push_back(30.0f);

    cout << "Tamanho do vetor: " << posicoes_x.size() << endl; // 3
    cout << "Segundo elemento (índice 1): " << posicoes_x[1] << endl; // 20.5
    cout << endl;
}

void fixacao_2() {
    cout << "--- 1.2 std::map ---" << endl;
    map<int, string> codigos_status;
    codigos_status[200] = "OK";
    codigos_status[404] = "Não Encontrado";

    cout << "Status do código 200: " << codigos_status[200] << endl; // OK
    cout << endl;
}

void fixacao_3() {
    cout << "--- 1.3 std::stack (LIFO) ---" << endl;
    stack<char> estados;
    estados.push('A');
    estados.push('B');
    estados.push('C');

    cout << "Topo inicial: " << estados.top() << endl; // C
    estados.pop();
    cout << "Novo topo após pop: " << estados.top() << endl; // B
    cout << endl;
}

void fixacao_4() {
    cout << "--- 1.4 std::queue (FIFO) ---" << endl;
    queue<string> jogadores;
    jogadores.push("Player1");
    jogadores.push("Player2");
    jogadores.push("Player3");

    cout << "Jogador na frente da fila: " << jogadores.front() << endl; // Player1
    cout << endl;
}

// --- 2. Exercícios de Aplicação (Médio) ---

void aplicacao_1() {
    cout << "--- 2.1 Iteração em std::vector ---" << endl;
    vector<int> danos = {5, 10, 15, 20};

    // Range-based for loop (leitura)
    cout << "Danos iniciais: ";
    for (int d : danos) {
        cout << d << " ";
    }
    cout << endl;

    // Loop tradicional (modificação)
    for (size_t i = 0; i < danos.size(); ++i) {
        danos[i] *= 2;
    }

    cout << "Danos dobrados: ";
    for (int d : danos) {
        cout << d << " "; // 10 20 30 40
    }
    cout << endl << endl;
}

void aplicacao_2() {
    cout << "--- 2.2 Busca e Inserção em std::map ---" << endl;
    map<string, int> inventario;
    inventario["Espada"] = 1;

    // Busca: count() retorna 0 se a chave não existe
    if (inventario.count("Poção") == 0) {
        inventario["Poção"] = 3;
        cout << "Poção inserida com sucesso." << endl;
    }

    cout << "Quantidade de Poções: " << inventario["Poção"] << endl; // 3
    cout << endl;
}

void aplicacao_3() {
    cout << "--- 2.3 std::vector de Objetos (Conceitual) ---" << endl;
    cout << "Declaração: std::vector<Inimigo> inimigos;" << endl;
    cout << "Vantagem: O std::vector gerencia o tamanho dinamicamente. Se você precisar de 51 inimigos," << endl;
    cout << "o vector pode crescer automaticamente. Um array estático (Inimigo inimigos[50]) tem tamanho fixo." << endl;
    cout << endl;
}

// --- 3. Desafio (Difícil) ---

void desfazer_acao(stack<string>& acoes) {
    if (!acoes.empty()) {
        cout << "Desfazendo: " << acoes.top() << endl;
        acoes.pop();
    } else {
        cout << "Não há mais ações para desfazer." << endl;
    }
}

void desafio_1() {
    cout << "--- 3.1 Sistema de Desfazer (Undo System) ---" << endl;
    stack<string> historico_acoes;

    historico_acoes.push("Mover");
    historico_acoes.push("Atacar");
    historico_acoes.push("Abrir Inventário");

    cout << "Histórico inicial (3 ações)." << endl;

    desfazer_acao(historico_acoes); // Abrir Inventário
    desfazer_acao(historico_acoes); // Atacar
    desfazer_acao(historico_acoes); // Mover
    desfazer_acao(historico_acoes); // Não há mais ações

    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_1();
    fixacao_2();
    fixacao_3();
    fixacao_4();

    aplicacao_1();
    aplicacao_2();
    aplicacao_3();

    desafio_1();

    return 0;
}
