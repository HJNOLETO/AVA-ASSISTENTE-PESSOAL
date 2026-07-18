// 💡 Soluções Comentadas: Encapsulamento e Abstração

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

// --- CLASSE MOEDA (para Fixação e Aplicação) ---
class Moeda {
private:
    int valor = 0; // 1.1 Atributo privado

public:
    // 1.1 Getter
    int get_valor() const {
        return valor;
    }

    // 2.1 Setter com Validação
    void set_valor(int novo_valor) {
        if (novo_valor >= 0) {
            valor = novo_valor;
            cout << "Valor da moeda definido para: " << valor << endl;
        } else {
            cout << "Erro: O valor da moeda não pode ser negativo. Valor não alterado." << endl;
        }
    }
};

// --- CLASSE HABILIDADE (para Aplicação) ---
class Habilidade { // Classe Abstrata
protected:
    // 3.3 Membro Protegido
    int custo_mana;

public:
    // 2.2 Função Virtual Pura
    virtual void usar() = 0;

    // 3.3 Getter para Membro Protegido
    int get_custo() const {
        return custo_mana;
    }

    virtual ~Habilidade() {}
};

// --- CLASSE BOLA DE FOGO (para Aplicação) ---
class BolaDeFogo : public Habilidade {
public:
    // 3.3 Construtor que inicializa o membro protegido
    BolaDeFogo() {
        custo_mana = 20;
    }

    // 2.2 Implementação da Função Virtual Pura
    void usar() override {
        cout << "Bola de Fogo lançada! (-" << custo_mana << " de Mana)" << endl;
    }
};

// --- CLASSE LOGGER (para Desafio) ---
class Logger {
private:
    vector<string> logs; // 3.1 Atributo privado

public:
    // 3.1 Método para logar (com validação)
    void log_mensagem(const string& mensagem) {
        // 3.3 Validação (simulação de data e hora)
        string log_formatado = "[2025-11-05] " + mensagem;
        logs.push_back(log_formatado);
        cout << "Log registrado: " << log_formatado << endl;
    }

    // 3.2 Método para imprimir
    void imprimir_logs() const {
        cout << "\n--- Logs Registrados ---" << endl;
        for (const string& log : logs) {
            cout << log << endl;
        }
        cout << "------------------------" << endl;
    }
};

// --- Funções Principais ---

void fixacao_main() {
    cout << "--- 1. Fixação ---" << endl;

    // 1.2 Setter Simples
    Moeda pocao;
    pocao.set_valor(50);
    cout << "Valor lido via Getter: " << pocao.get_valor() << endl;

    // 1.3 Função Virtual Pura
    cout << "Declaração de FVP: virtual void renderizar() = 0;" << endl;

    // 1.4 Abstração
    cout << "Abstração: Mostrar apenas o essencial e esconder os detalhes de implementação." << endl;

    cout << endl;
}

void aplicacao_main() {
    cout << "--- 2. Aplicação ---" << endl;

    // 2.1 Setter com Validação
    Moeda ouro;
    ouro.set_valor(100);
    ouro.set_valor(-10); // Deve falhar na validação

    // 2.2 e 2.3 Classe Abstrata e Herança
    // Ponteiro da Base aponta para Objeto Derivado
    Habilidade* bola_fogo = new BolaDeFogo();
    bola_fogo->usar();
    cout << "Custo de Mana: " << bola_fogo->get_custo() << endl;

    delete bola_fogo;

    cout << endl;
}

void desafio_main() {
    cout << "--- 3. Desafio ---" << endl;

    Logger log_sistema;
    log_sistema.log_mensagem("Sistema inicializado.");
    log_sistema.log_mensagem("Jogador Kael entrou no servidor.");
    log_sistema.log_mensagem("Erro: Falha ao carregar textura.");

    log_sistema.imprimir_logs();

    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_main();
    aplicacao_main();
    desafio_main();

    return 0;
}
