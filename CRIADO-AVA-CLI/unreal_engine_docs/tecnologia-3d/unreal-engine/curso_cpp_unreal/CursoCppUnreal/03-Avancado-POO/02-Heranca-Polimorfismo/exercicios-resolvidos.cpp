// 💡 Soluções Comentadas: Herança e Polimorfismo

#include <iostream>
#include <string>
#include <vector>
#include <cstdlib> // Para rand() e srand()
#include <ctime>   // Para time()

using namespace std;

// --- CLASSE BASE ---
class Veiculo {
protected:
    // 2.2 Membros Protegidos
    int velocidade_maxima;

public:
    // 2.3 Construtor
    Veiculo(int max_v) : velocidade_maxima(max_v) {
        cout << "Veículo criado com velocidade máxima: " << velocidade_maxima << " km/h." << endl;
    }

    // 2.1 Destrutor Virtual
    virtual ~Veiculo() {
        cout << "Destrutor de Veículo Base." << endl;
    }

    // 1.3 Função Virtual
    virtual void acelerar() {
        cout << "Veículo acelerando." << endl;
    }

    // 1.2 Acesso a Membro Protegido
    void exibir_velocidade() {
        cout << "Velocidade Máxima: " << velocidade_maxima << " km/h." << endl;
    }

    // 1.1 Função Simples
    void ligar_motor() {
        cout << "Motor ligado." << endl;
    }
};

// --- CLASSE DERIVADA 1 ---
class Carro : public Veiculo {
public:
    // 2.3 Chamada ao construtor da classe base
    Carro() : Veiculo(200) {}

    // 1.3 Sobrescrita
    void acelerar() override {
        cout << "Carro acelerando rapidamente!" << endl;
    }
};

// --- CLASSE DERIVADA 2 ---
class Moto : public Veiculo {
public:
    Moto() : Veiculo(250) {}

    // 2.1 Destrutor
    ~Moto() override {
        cout << "Destrutor de Moto Derivada." << endl;
    }

    void acelerar() override {
        cout << "Moto empinando e acelerando!" << endl;
    }
};

// --- CLASSE BASE DO DESAFIO ---
class Dano {
public:
    // Função Virtual Pura (torna a classe abstrata)
    virtual int calcular_dano() = 0;

    // Destrutor virtual para segurança
    virtual ~Dano() {}
};

// --- CLASSES DERIVADAS DO DESAFIO ---
class DanoFisico : public Dano {
public:
    int calcular_dano() override {
        return 10; // Dano fixo
    }
};

class DanoMagico : public Dano {
public:
    int calcular_dano() override {
        // Dano aleatório entre 15 e 25
        return 15 + (rand() % 11);
    }
};

// Função do Desafio
void aplicar_dano(Dano* tipo_dano) {
    cout << "Dano aplicado: " << tipo_dano->calcular_dano() << endl;
}

// --- Funções Principais ---

void fixacao_main() {
    cout << "--- 1. Fixação ---" << endl;

    // 1.1 Herança Simples
    Carro meu_carro;
    meu_carro.ligar_motor();

    // 1.2 Membros Protegidos
    meu_carro.exibir_velocidade();

    // 1.4 Polimorfismo (Chamada via ponteiro da Base)
    Veiculo* ptr_carro = new Carro();
    ptr_carro->acelerar(); // Chama a versão do Carro (graças ao virtual)
    delete ptr_carro; // Chama o destrutor virtual

    cout << endl;
}

void aplicacao_main() {
    cout << "--- 2. Aplicação ---" << endl;

    // 2.1 Destrutor Virtual
    Veiculo* ptr_moto = new Moto();
    delete ptr_moto; // Chama o destrutor de Moto e depois o de Veiculo

    cout << "\n--- 2.2 Vetor Polimórfico ---" << endl;
    vector<Veiculo*> frota;
    frota.push_back(new Carro());
    frota.push_back(new Moto());

    for (Veiculo* v : frota) {
        v->acelerar(); // Chamada polimórfica
    }

    // Limpeza da memória
    for (Veiculo* v : frota) {
        delete v;
    }
    cout << "Memória da frota liberada." << endl;

    cout << endl;
}

void desafio_main() {
    cout << "--- 3. Desafio ---" << endl;
    srand(time(0)); // Inicializa o gerador de números aleatórios

    // Não podemos instanciar Dano diretamente (é abstrata)
    // Dano dano_base; // Erro!

    // Vetor polimórfico
    vector<Dano*> tipos_dano;
    tipos_dano.push_back(new DanoFisico());
    tipos_dano.push_back(new DanoMagico());
    tipos_dano.push_back(new DanoMagico());

    for (Dano* d : tipos_dano) {
        aplicar_dano(d);
    }

    // Limpeza da memória
    for (Dano* d : tipos_dano) {
        delete d;
    }

    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_main();
    aplicacao_main();
    desafio_main();

    return 0;
}
