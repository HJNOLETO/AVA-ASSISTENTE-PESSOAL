// 💡 Soluções Comentadas: Classes e Objetos

#include <iostream>
#include <string>
#include <memory> // Para o desafio (melhor prática)

using namespace std;

// --- Classe Item (para Fixação e Aplicação) ---
class Item {
public:
    // Atributos
    string nome;
    int peso;

    // 1.3 Construtor com Parâmetros
    Item(string n, int p) : nome(n), peso(p) {
        cout << "Item " << nome << " criado." << endl;
    }

    // 1.1 Método
    void usar() {
        cout << "Item " << nome << " usado!" << endl;
    }

    // 2.1 Destrutor
    ~Item() {
        cout << "Item " << nome << " destruído, liberando recursos." << endl;
    }

    // 2.2 Método com Lógica
    bool pode_equipar(int forca_jogador) {
        return peso <= forca_jogador;
    }
};

// --- Classe Inventario (para Aplicação 2.3) ---
class Inventario {
public:
    // 2.3 Objeto como Membro (deve ser inicializado no construtor)
    Item slot_principal;

    // Construtor do Inventario, que chama o construtor do Item
    Inventario() : slot_principal("Adaga", 2) {
        cout << "Inventário criado." << endl;
    }
};

// --- Classe Inimigo (para Desafio) ---
class Inimigo {
public:
    int vida;
    string nome;

    Inimigo(string n) : nome(n), vida(100) {
        cout << "Inimigo " << nome << " criado com 100 de vida." << endl;
    }

    void receber_dano(int dano) {
        vida -= dano;
        cout << nome << " recebeu " << dano << " de dano. Vida restante: " << vida << endl;
    }

    ~Inimigo() {
        cout << "Inimigo " << nome << " derrotado e destruído." << endl;
    }
};

// --- Função do Desafio ---
void atacar_inimigo(Inimigo* alvo) {
    if (alvo != nullptr) {
        alvo->receber_dano(25);
    }
}

// --- Funções Principais ---

void fixacao_main() {
    cout << "--- 1. Fixação ---" << endl;

    // 1.2 Criação de Objeto (Stack)
    Item pocao("Poção de Cura", 1);
    pocao.usar();

    // 1.3 Construtor com Parâmetros (Stack)
    Item espada("Espada Longa", 5);

    // 1.4 Ponteiro para Objeto (Heap)
    Item* ptr_item = new Item("Escudo de Madeira", 8);
    ptr_item->usar();
    delete ptr_item; // Liberação manual
    ptr_item = nullptr;

    cout << endl;
}

void aplicacao_main() {
    cout << "--- 2. Aplicação ---" << endl;

    // 2.1 Destrutor (já implementado na classe Item)
    // O destrutor da 'espada' será chamado no final desta função.

    // 2.2 Método com Lógica
    Item espada("Espada Curta", 5);
    Item armadura("Armadura Pesada", 12);
    int forca_jogador = 10;

    cout << "Jogador com Força " << forca_jogador << endl;
    cout << "Pode equipar Espada (peso 5)? " << (espada.pode_equipar(forca_jogador) ? "Sim" : "Não") << endl;
    cout << "Pode equipar Armadura (peso 12)? " << (armadura.pode_equipar(forca_jogador) ? "Sim" : "Não") << endl;

    // 2.3 Objeto como Membro
    Inventario inv; // Cria o inventário e o item 'Adaga'

    cout << endl;
}

void desafio_main() {
    cout << "--- 3. Desafio ---" << endl;

    // Criação de objeto no Heap (melhor prática com Smart Pointer)
    // Usaremos o ponteiro bruto para seguir o requisito do exercício, mas com ressalvas.
    Inimigo* boss = new Inimigo("Ogro");

    atacar_inimigo(boss); // Vida: 75
    atacar_inimigo(boss); // Vida: 50

    // Liberação manual da memória (crucial)
    delete boss;
    boss = nullptr;

    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_main();
    aplicacao_main();
    desafio_main();

    return 0;
}
