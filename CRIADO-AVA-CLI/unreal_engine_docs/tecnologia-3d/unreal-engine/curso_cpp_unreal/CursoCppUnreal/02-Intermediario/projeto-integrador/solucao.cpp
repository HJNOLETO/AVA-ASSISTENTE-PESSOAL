// 💡 Solução do Projeto Integrador 2: Sistema de Inventário Básico

#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <algorithm> // Para std::find

using namespace std;

// Função para adicionar um item ao inventário (passagem por referência)
void adicionar_item(vector<string>& inv, const string& nome_item) {
    inv.push_back(nome_item);
    cout << "Item adicionado: " << nome_item << endl;
}

// Função para remover um item do inventário (passagem por referência)
void remover_item(vector<string>& inv, const string& nome_item) {
    // Usa std::find para encontrar a primeira ocorrência do item
    auto it = find(inv.begin(), inv.end(), nome_item);

    if (it != inv.end()) {
        // Remove o item usando o iterador
        inv.erase(it);
        cout << "Item removido: " << nome_item << endl;
    } else {
        cout << "Erro: Item '" << nome_item << "' não encontrado no inventário." << endl;
    }
}

// Função para calcular o ataque total (passagem por referência constante)
int calcular_ataque_total(const vector<string>& inv, const map<string, int>& dados) {
    int ataque_total = 0;

    for (const string& item : inv) {
        // Busca o valor de ataque no mapa
        auto it = dados.find(item);

        if (it != dados.end()) {
            // Se o item for encontrado, adiciona seu valor de ataque
            ataque_total += it->second;
        } else {
            // Trata itens desconhecidos (opcional)
            // cout << "Aviso: Item desconhecido '" << item << "' ignorado." << endl;
        }
    }

    return ataque_total;
}

// Função para imprimir o inventário
void imprimir_inventario(const vector<string>& inv) {
    cout << "\n--- Inventário Atual (" << inv.size() << " itens) ---" << endl;
    if (inv.empty()) {
        cout << "Inventário vazio." << endl;
        return;
    }
    for (size_t i = 0; i < inv.size(); ++i) {
        cout << i + 1 << ". " << inv[i] << endl;
    }
    cout << "---------------------------------" << endl;
}

int main() {
    // 1. Estrutura de Dados
    vector<string> inventario;
    map<string, int> dados_item = {
        {"Espada", 10},
        {"Machado", 15},
        {"Poção", 0},
        {"Armadura", 5}
    };

    cout << "--- Sistema de Inventário Básico ---" << endl;

    // 2. Adicionar Itens
    adicionar_item(inventario, "Espada");
    adicionar_item(inventario, "Machado");
    adicionar_item(inventario, "Poção");
    adicionar_item(inventario, "Espada"); // Adiciona uma segunda espada

    // 3. Imprimir e Calcular Ataque Total
    imprimir_inventario(inventario);
    int ataque1 = calcular_ataque_total(inventario, dados_item);
    cout << "Ataque Total Inicial: " << ataque1 << endl; // 10 + 15 + 0 + 10 = 35

    // 4. Remover Item
    cout << "\n--- Removendo Item ---" << endl;
    remover_item(inventario, "Espada"); // Remove a primeira espada

    // 5. Imprimir e Calcular Novo Ataque Total
    imprimir_inventario(inventario);
    int ataque2 = calcular_ataque_total(inventario, dados_item);
    cout << "Novo Ataque Total: " << ataque2 << endl; // 15 + 0 + 10 = 25

    return 0;
}
