// ✏️ Exemplos Práticos: Encapsulamento e Abstração

#include <iostream>
#include <string>
#include <memory>

using namespace std;

// --- Exemplo 1: Encapsulamento com Getters e Setters ---
class Personagem {
private:
    int vida = 100; // Membro privado (acesso restrito)
    string nome;

public:
    Personagem(string n) : nome(n) {}

    // Getter (Acesso de leitura)
    int get_vida() const {
        return vida;
    }

    // Setter (Acesso de escrita com validação)
    void set_vida(int nova_vida) {
        if (nova_vida > 150) {
            cout << "Aviso: Vida máxima é 150. Definindo para 150." << endl;
            vida = 150;
        } else if (nova_vida < 0) {
            vida = 0;
            cout << nome << " foi derrotado!" << endl;
        } else {
            vida = nova_vida;
        }
    }

    void receber_dano(int dano) {
        cout << nome << " recebeu " << dano << " de dano." << endl;
        set_vida(vida - dano); // Usa o Setter interno para aplicar a lógica
    }
};

// --- Exemplo 2: Abstração com Classe Abstrata (Interface) ---
class Arma { // Classe Abstrata
public:
    // Função Virtual Pura (deve ser implementada pelas derivadas)
    virtual void atacar() = 0;

    // Destrutor virtual (boa prática para classes base)
    virtual ~Arma() {}
};

class Espada : public Arma {
public:
    void atacar() override {
        cout << "Espada: Corte rápido e preciso!" << endl;
    }
};

class Arco : public Arma {
public:
    void atacar() override {
        cout << "Arco: Flecha disparada à distância!" << endl;
    }
};

// Função que usa a abstração (não precisa saber o tipo exato da Arma)
void usar_arma(Arma* arma) {
    arma->atacar();
}

void exemplo_encapsulamento() {
    cout << "--- Exemplo 1: Encapsulamento ---" << endl;

    Personagem heroi("Kael");

    // Tentativa de acesso direto (erro de compilação se 'vida' fosse private)
    // heroi.vida = 999;

    // Acesso seguro via Setter
    heroi.set_vida(200); // Aciona a validação (Vida máxima é 150)
    cout << "Vida atual: " << heroi.get_vida() << endl; // 150

    // Uso do método que encapsula a lógica
    heroi.receber_dano(160); // Aciona a validação (Vida < 0)
    cout << "Vida atual: " << heroi.get_vida() << endl; // 0

    cout << endl;
}

void exemplo_abstracao() {
    cout << "--- Exemplo 2: Abstração e Classes Abstratas ---" << endl;

    // Não podemos instanciar a classe abstrata Arma
    // Arma arma_generica; // Erro!

    // Criamos objetos concretos
    unique_ptr<Arma> espada = make_unique<Espada>();
    unique_ptr<Arma> arco = make_unique<Arco>();

    // Usamos a função que opera na abstração (Arma*)
    usar_arma(espada.get());
    usar_arma(arco.get());

    cout << endl;
}

// Função principal que chama todos os exemplos
int main() {
    exemplo_encapsulamento();
    exemplo_abstracao();

    return 0;
}
