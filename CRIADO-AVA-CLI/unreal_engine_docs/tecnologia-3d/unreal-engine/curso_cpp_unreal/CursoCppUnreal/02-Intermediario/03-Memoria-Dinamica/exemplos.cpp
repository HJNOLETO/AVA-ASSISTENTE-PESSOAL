// ✏️ Exemplos Práticos: Memória Dinâmica e Smart Pointers

#include <iostream>
#include <memory> // Para Smart Pointers

using namespace std;

// Exemplo 1: Alocação e Desalocação Manual (Raw Pointers)
void exemplo_raw_pointers() {
    cout << "--- Exemplo 1: Alocação Manual (Raw Pointers) ---" << endl;

    // Alocação de um único inteiro
    int* ptr_vida = new int;
    *ptr_vida = 100;
    cout << "Vida alocada: " << *ptr_vida << endl;

    // Desalocação
    delete ptr_vida;
    ptr_vida = nullptr; // Boa prática

    // Alocação de um array
    int* ptr_array = new int[3];
    ptr_array[0] = 10;
    ptr_array[1] = 20;
    ptr_array[2] = 30;
    cout << "Primeiro elemento do array: " << ptr_array[0] << endl;

    // Desalocação de array
    delete[] ptr_array;
    ptr_array = nullptr;

    cout << endl;
}

// Exemplo 2: unique_ptr
void exemplo_unique_ptr() {
    cout << "--- Exemplo 2: unique_ptr (Propriedade Exclusiva) ---" << endl;

    // Criação (método preferido)
    auto ptr_arma = make_unique<string>("Espada Longa");

    cout << "Arma: " << *ptr_arma << endl;

    // Tentativa de cópia (erro de compilação)
    // unique_ptr<string> ptr_copia = ptr_arma;

    // Movendo a propriedade
    unique_ptr<string> ptr_dono_novo = move(ptr_arma);

    if (ptr_arma == nullptr) {
        cout << "ptr_arma agora é nulo (propriedade movida)." << endl;
    }

    cout << "Arma no novo dono: " << *ptr_dono_novo << endl;

    // Quando ptr_dono_novo sai de escopo, a memória é liberada automaticamente.
    cout << endl;
}

// Exemplo 3: shared_ptr
void exemplo_shared_ptr() {
    cout << "--- Exemplo 3: shared_ptr (Propriedade Compartilhada) ---" << endl;

    // Criação
    auto ptr_recurso = make_shared<int>(500);

    // Contagem de referência inicial: 1
    cout << "Contagem de referência (1): " << ptr_recurso.use_count() << endl;

    // Criação de cópia (incrementa a contagem)
    shared_ptr<int> ptr_copia1 = ptr_recurso;
    shared_ptr<int> ptr_copia2 = ptr_recurso;

    // Contagem de referência: 3
    cout << "Contagem de referência (3): " << ptr_recurso.use_count() << endl;

    // Quando ptr_copia2 sai de escopo (ou é resetado)
    ptr_copia2.reset();

    // Contagem de referência: 2
    cout << "Contagem de referência (2): " << ptr_recurso.use_count() << endl;

    // A memória só será liberada quando ptr_recurso e ptr_copia1 saírem de escopo.
    cout << endl;
}

// Função principal que chama todos os exemplos
int main() {
    exemplo_raw_pointers();
    exemplo_unique_ptr();
    exemplo_shared_ptr();

    return 0;
}
