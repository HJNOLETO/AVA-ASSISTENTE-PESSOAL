// ✏️ Exemplos Práticos: Herança e Polimorfismo

#include <iostream>
#include <string>
#include <vector>
#include <memory> // Para Smart Pointers

using namespace std;

// --- CLASSE BASE ---
class Personagem {
public:
    string nome;
    int vida;

    Personagem(string n, int v) : nome(n), vida(v) {}

    // 1. Destrutor Virtual (Crucial para polimorfismo)
    virtual ~Personagem() {
        cout << "Destrutor de Personagem Base: " << nome << endl;
    }

    // 2. Função Virtual (Permite Sobrescrita Polimórfica)
    virtual void atacar() {
        cout << nome << " ataca com um golpe simples." << endl;
    }

    void exibir_status() {
        cout << nome << " - Vida: " << vida << endl;
    }
};

// --- CLASSE DERIVADA 1 ---
class Guerreiro : public Personagem {
public:
    Guerreiro(string n) : Personagem(n, 150) {}

    // Sobrescrita da função virtual
    void atacar() override {
        cout << nome << " desfere um poderoso golpe de espada!" << endl;
    }

    // Método específico do Guerreiro
    void defender() {
        cout << nome << " levanta o escudo." << endl;
    }
};

// --- CLASSE DERIVADA 2 ---
class Mago : public Personagem {
public:
    Mago(string n) : Personagem(n, 100) {}

    // Sobrescrita da função virtual
    void atacar() override {
        cout << nome << " lança uma bola de fogo mágica!" << endl;
    }
};

// Exemplo 1: Demonstração de Herança
void exemplo_heranca() {
    cout << "--- Exemplo 1: Herança ---" << endl;
    Guerreiro conan("Conan");
    conan.exibir_status(); // Método herdado
    conan.defender(); // Método específico
    cout << endl;
}

// Exemplo 2: Demonstração de Polimorfismo
void exemplo_polimorfismo() {
    cout << "--- Exemplo 2: Polimorfismo ---" << endl;

    // Vetor de ponteiros da CLASSE BASE
    vector<unique_ptr<Personagem>> time_herois;

    // Adicionamos objetos de CLASSES DERIVADAS
    time_herois.push_back(make_unique<Guerreiro>("Aragorn"));
    time_herois.push_back(make_unique<Mago>("Gandalf"));

    // Iteramos sobre o vetor da CLASSE BASE, mas chamamos o método correto
    for (const auto& heroi : time_herois) {
        // A chamada é feita através do ponteiro da Base, mas o método executado
        // é o da classe Derivada (graças ao 'virtual' e 'override').
        heroi->atacar();
    }

    // Os destrutores virtuais são chamados automaticamente pelo unique_ptr
    // garantindo que os destrutores de Guerreiro e Mago sejam chamados corretamente.
    cout << "\nObjetos destruídos ao sair do escopo do vetor." << endl;
}

// Função principal que chama todos os exemplos
int main() {
    exemplo_heranca();
    exemplo_polimorfismo();

    return 0;
}
