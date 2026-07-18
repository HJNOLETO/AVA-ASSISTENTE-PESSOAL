// ✏️ Exemplos Práticos: STL Containers

#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <stack>
#include <queue>

using namespace std;

// Exemplo 1: std::vector (Array Dinâmico)
void exemplo_vector() {
    cout << "--- Exemplo 1: std::vector ---" << endl;

    // Criação e inicialização
    vector<int> pontuacoes = {100, 200, 300};

    // Adicionar elemento
    pontuacoes.push_back(400);

    // Acesso por índice
    cout << "Primeira pontuação: " << pontuacoes[0] << endl;

    // Iteração (Range-based for loop - C++ moderno)
    cout << "Todas as pontuações: ";
    for (int p : pontuacoes) {
        cout << p << " ";
    }
    cout << endl;

    // Remover o último elemento
    pontuacoes.pop_back();
    cout << "Tamanho após pop_back: " << pontuacoes.size() << endl;

    cout << endl;
}

// Exemplo 2: std::map (Chave-Valor Ordenado)
void exemplo_map() {
    cout << "--- Exemplo 2: std::map ---" << endl;

    // Chave: string (nome do item), Valor: int (quantidade)
    map<string, int> inventario;

    // Inserção
    inventario["Espada"] = 1;
    inventario["Poção de Cura"] = 5;
    inventario["Escudo"] = 1;

    // Alteração
    inventario["Poção de Cura"] += 2;

    // Acesso
    cout << "Quantidade de Poções de Cura: " << inventario["Poção de Cura"] << endl;

    // Iteração (o map itera em ordem alfabética da chave)
    cout << "Inventário Completo:" << endl;
    for (auto const& [item, quantidade] : inventario) {
        cout << "  " << item << ": " << quantidade << endl;
    }

    // Busca segura
    if (inventario.count("Machado")) {
        cout << "Machado encontrado!" << endl;
    } else {
        cout << "Machado não encontrado." << endl;
    }

    cout << endl;
}

// Exemplo 3: std::stack (LIFO)
void exemplo_stack() {
    cout << "--- Exemplo 3: std::stack (LIFO) ---" << endl;

    stack<string> acoes;

    // Adicionar (Push)
    acoes.push("Mover");
    acoes.push("Atacar");
    acoes.push("Pular");

    cout << "Ação atual (Top): " << acoes.top() << endl; // Pular

    // Remover (Pop)
    acoes.pop();

    cout << "Próxima ação (Top): " << acoes.top() << endl; // Atacar

    cout << endl;
}

// Exemplo 4: std::queue (FIFO)
void exemplo_queue() {
    cout << "--- Exemplo 4: std::queue (FIFO) ---" << endl;

    queue<string> comandos;

    // Adicionar (Push)
    comandos.push("Comando 1: Mover");
    comandos.push("Comando 2: Atacar");
    comandos.push("Comando 3: Pular");

    cout << "Próximo comando a ser executado (Front): " << comandos.front() << endl; // Comando 1

    // Remover (Pop)
    comandos.pop();

    cout << "Próximo comando (Front): " << comandos.front() << endl; // Comando 2

    cout << endl;
}

// Função principal que chama todos os exemplos
int main() {
    exemplo_vector();
    exemplo_map();
    exemplo_stack();
    exemplo_queue();

    return 0;
}
