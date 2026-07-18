// ✏️ Exemplos Práticos: Classes Abstratas e Interfaces

#include <iostream>
#include <string>
#include <memory>

using namespace std;

// --- CLASSE ABSTRATA ---
class ObjetoDeJogo {
protected:
    string id_unico;
    bool ativo = true;

public:
    ObjetoDeJogo(string id) : id_unico(id) {}

    // Método concreto (com implementação)
    void desativar() {
        ativo = false;
        cout << id_unico << " desativado." << endl;
    }

    // Função Virtual Pura (torna a classe abstrata)
    virtual void atualizar() = 0;

    virtual ~ObjetoDeJogo() {}
};

// --- INTERFACE (Abstração Pura) ---
class IInteragivel {
public:
    // Funções Virtuais Puras
    virtual void interagir() = 0;
    virtual bool pode_interagir() const = 0;

    virtual ~IInteragivel() {}
};

// --- CLASSE CONCRETA (Herda da Abstrata e Implementa a Interface) ---
class Porta : public ObjetoDeJogo, public IInteragivel {
private:
    bool aberta = false;

public:
    Porta(string id) : ObjetoDeJogo(id) {}

    // Implementação da Função Virtual Pura da Classe Abstrata
    void atualizar() override {
        // Lógica de atualização da porta (ex: animação de abertura)
        // cout << id_unico << " atualizando estado..." << endl;
    }

    // Implementação da Função Virtual Pura da Interface
    void interagir() override {
        aberta = !aberta;
        cout << id_unico << " foi " << (aberta ? "ABERTA" : "FECHADA") << "." << endl;
    }

    // Implementação da Função Virtual Pura da Interface
    bool pode_interagir() const override {
        return ativo;
    }
};

// Função que opera na Abstração (Interface)
void tentar_interagir(IInteragivel* objeto) {
    if (objeto->pode_interagir()) {
        objeto->interagir();
    } else {
        cout << "Objeto não pode ser interagido no momento." << endl;
    }
}

void exemplo_classes_abstratas() {
    cout << "--- Exemplo 1: Classes Abstratas ---" << endl;

    // ObjetoDeJogo obj; // Erro: Não pode instanciar classe abstrata

    // Instanciamos a classe concreta Porta
    unique_ptr<Porta> porta = make_unique<Porta>("Porta_01");

    // Chamamos o método concreto herdado
    porta->desativar();

    // Chamamos o método abstrato implementado
    porta->atualizar();

    cout << endl;
}

void exemplo_interfaces() {
    cout << "--- Exemplo 2: Interfaces ---" << endl;

    unique_ptr<Porta> porta_interagivel = make_unique<Porta>("Porta_02");

    // Passamos o objeto Porta para a função que espera a Interface IInteragivel
    tentar_interagir(porta_interagivel.get()); // Abre
    tentar_interagir(porta_interagivel.get()); // Fecha

    // Desativamos a porta
    porta_interagivel->desativar();

    // Tentamos interagir novamente
    tentar_interagir(porta_interagivel.get()); // Não pode ser interagido

    cout << endl;
}

// Função principal que chama todos os exemplos
int main() {
    exemplo_classes_abstratas();
    exemplo_interfaces();

    return 0;
}
