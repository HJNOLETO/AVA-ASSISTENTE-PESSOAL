// 💡 Soluções Comentadas: Classes Abstratas e Interfaces

#include <iostream>
#include <string>
#include <vector>
#include <cmath>

using namespace std;

// --- CLASSE ABSTRATA (para Fixação e Aplicação) ---
class FormaGeometrica {
protected:
    // 1.1 Atributo Protegido
    float area;

public:
    // 1.1 Função Virtual Pura
    virtual float calcular_area() = 0;

    virtual ~FormaGeometrica() {}
};

// --- INTERFACE (para Fixação e Aplicação) ---
class IDestruivel {
public:
    // 1.3 Função Virtual Pura
    virtual void destruir() = 0;

    virtual ~IDestruivel() {}
};

// --- CLASSE QUADRADO (para Fixação e Aplicação) ---
class Quadrado : public FormaGeometrica {
private:
    float lado;

public:
    // 1.2 Construtor
    Quadrado(float l) : lado(l) {}

    // 1.2 Implementação da FVP
    float calcular_area() override {
        area = lado * lado;
        return area;
    }
};

// --- CLASSE BARREIRA (para Aplicação) ---
class Barreira : public IDestruivel {
public:
    // 2.1 Implementação da FVP
    void destruir() override {
        cout << "Barreira destruída com efeitos de partícula!" << endl;
    }
};

// --- CLASSE BAÚ DESTRUÍVEL (para Aplicação) ---
class BauDestruivel : public Quadrado, public IDestruivel {
public:
    // 2.2 Construtor que chama o construtor da classe base Quadrado
    BauDestruivel(float lado_bau) : Quadrado(lado_bau) {
        cout << "Baú Destruível criado (Lado: " << lado_bau << ")." << endl;
    }

    // 2.2 Implementação da FVP da Interface
    void destruir() override {
        cout << "Baú Destruível quebrado, loot liberado!" << endl;
    }
};

// --- INTERFACE DE DESAFIO ---
class INotificavel {
public:
    virtual void notificar(const string& mensagem) = 0;
    virtual ~INotificavel() {}
};

// --- CLASSES DE DESAFIO ---
class NotificacaoEmail : public INotificavel {
public:
    void notificar(const string& mensagem) override {
        cout << "E-mail enviado: " << mensagem << endl;
    }
};

class NotificacaoSMS : public INotificavel {
public:
    void notificar(const string& mensagem) override {
        cout << "SMS enviado: " << mensagem << endl;
    }
};

// Função do Desafio
void enviar_notificacao(INotificavel* canal, const string& mensagem) {
    canal->notificar(mensagem);
}

// --- Funções Principais ---

void fixacao_main() {
    cout << "--- 1. Fixação ---" << endl;

    // 1.4 Instanciação
    cout << "Apenas 'Quadrado' pode ser instanciado, pois implementa a FVP de 'FormaGeometrica'." << endl;
    Quadrado q(5.0f);
    cout << "Área do Quadrado: " << q.calcular_area() << endl;

    cout << endl;
}

void aplicacao_main() {
    cout << "--- 2. Aplicação ---" << endl;

    // 2.1 Implementação de Interface
    IDestruivel* ptr_barreira = new Barreira();
    ptr_barreira->destruir();
    delete ptr_barreira;

    // 2.2 Herança Múltipla
    BauDestruivel bau(3.0f);
    cout << "Área do Baú (Quadrado): " << bau.calcular_area() << endl;
    bau.destruir();

    // 2.3 Vetor de Interfaces
    cout << "\n--- Vetor de Interfaces ---" << endl;
    vector<IDestruivel*> destruiveis;
    destruiveis.push_back(new Barreira());
    destruiveis.push_back(new BauDestruivel(1.0f));

    for (IDestruivel* d : destruiveis) {
        d->destruir();
        delete d;
    }

    cout << endl;
}

void desafio_main() {
    cout << "--- 3. Desafio ---" << endl;

    INotificavel* email = new NotificacaoEmail();
    INotificavel* sms = new NotificacaoSMS();
    string mensagem = "Seu personagem foi atacado!";

    enviar_notificacao(email, mensagem);
    enviar_notificacao(sms, mensagem);

    delete email;
    delete sms;

    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_main();
    aplicacao_main();
    desafio_main();

    return 0;
}
