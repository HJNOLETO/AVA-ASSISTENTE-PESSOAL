// 💡 Solução do Projeto Integrador 3: Sistema de Habilidades Polimórficas

#include <iostream>
#include <string>
#include <vector>
#include <memory> // Para unique_ptr (melhor prática)

using namespace std;

// Forward Declaration para evitar erro de compilação
class Personagem;

// --- CLASSE ABSTRATA BASE ---
class Habilidade {
protected:
    int custo_mana;

public:
    // 1. Função Virtual Pura
    virtual void usar(Personagem& alvo) = 0;

    // 1. Getter (Encapsulamento)
    int get_custo() const {
        return custo_mana;
    }

    // 1. Destrutor Virtual (Polimorfismo)
    virtual ~Habilidade() {
        cout << "Destrutor de Habilidade Base." << endl;
    }
};

// --- CLASSE ALVO ---
class Personagem {
private:
    string nome;

public:
    // 3. Construtor
    Personagem(string n) : nome(n) {}

    // 3. Getter
    string get_nome() const {
        return nome;
    }
};

// --- CLASSE DERIVADA 1 ---
class BolaDeFogo : public Habilidade {
public:
    BolaDeFogo() {
        custo_mana = 20; // Inicialização do membro protegido
    }

    void usar(Personagem& alvo) override {
        cout << "Bola de Fogo lançada! " << alvo.get_nome() << " recebe 30 de dano mágico." << endl;
    }

    ~BolaDeFogo() override {
        cout << "Destrutor de BolaDeFogo." << endl;
    }
};

// --- CLASSE DERIVADA 2 ---
class AtaqueFisico : public Habilidade {
public:
    AtaqueFisico() {
        custo_mana = 0; // Inicialização do membro protegido
    }

    void usar(Personagem& alvo) override {
        cout << "Ataque Físico realizado! " << alvo.get_nome() << " recebe 15 de dano físico." << endl;
    }

    ~AtaqueFisico() override {
        cout << "Destrutor de AtaqueFisico." << endl;
    }
};

int main() {
    cout << "--- Sistema de Habilidades Polimórficas ---" << endl;

    // 4. Criação do Alvo
    Personagem inimigo("Ogro");

    // 4. Vetor Polimórfico (usando ponteiros brutos conforme o desafio)
    vector<Habilidade*> habilidades;

    // 4. Adição de Habilidades (alocação dinâmica)
    habilidades.push_back(new BolaDeFogo());
    habilidades.push_back(new AtaqueFisico());
    habilidades.push_back(new BolaDeFogo());

    cout << "\n--- Executando Habilidades ---" << endl;
    for (Habilidade* habilidade : habilidades) {
        // Polimorfismo: A chamada 'usar()' executa o método correto
        habilidade->usar(inimigo);
        cout << "  Custo de Mana: " << habilidade->get_custo() << endl;
    }

    // 4. Liberação da Memória (Crucial!)
    cout << "\n--- Liberando Memória ---" << endl;
    for (Habilidade* habilidade : habilidades) {
        delete habilidade; // O destrutor virtual garante a chamada correta
    }

    return 0;
}
