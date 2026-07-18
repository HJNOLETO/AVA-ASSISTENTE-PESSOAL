// 💡 Soluções Comentadas: Memória Dinâmica

#include <iostream>
#include <memory>
#include <string>

using namespace std;

// --- 1. Exercícios de Fixação (Fácil) ---

void fixacao_1() {
    cout << "--- 1.1 Alocação e Desalocação Simples ---" << endl;
    float* ptr_velocidade = new float; // Alocação
    *ptr_velocidade = 10.5f;
    cout << "Velocidade: " << *ptr_velocidade << endl;
    delete ptr_velocidade; // Desalocação
    ptr_velocidade = nullptr;
    cout << "Memória liberada." << endl;
    cout << endl;
}

void fixacao_2() {
    cout << "--- 1.2 Alocação de Array ---" << endl;
    int* ptr_pontuacoes = new int[10]; // Alocação de array
    ptr_pontuacoes[0] = 100;
    cout << "Primeiro elemento: " << ptr_pontuacoes[0] << endl;
    delete[] ptr_pontuacoes; // Desalocação de array (com [])
    ptr_pontuacoes = nullptr;
    cout << "Memória do array liberada." << endl;
    cout << endl;
}

void fixacao_3() {
    cout << "--- 1.3 Vazamento de Memória ---" << endl;
    cout << "Um vazamento de memória ocorre quando a memória alocada com 'new' no Heap" << endl;
    cout << "não é liberada com 'delete'. O ponteiro (variável local) é destruído ao sair" << endl;
    cout << "do escopo, mas o bloco de memória alocado permanece reservado, inacessível" << endl;
    cout << "e não utilizável pelo programa, consumindo recursos de forma desnecessária." << endl;
    cout << endl;
}

void fixacao_4() {
    cout << "--- 1.4 Smart Pointer ---" << endl;
    cout << "O std::unique_ptr garante propriedade exclusiva." << endl;
    cout << endl;
}

// --- 2. Exercícios de Aplicação (Médio) ---

// 2.1 Função com Alocação Manual
int* criar_inteiro_dinamico() {
    int* novo_int = new int(42);
    return novo_int;
}

void aplicacao_1() {
    cout << "--- 2.1 Função com Alocação Manual ---" << endl;
    int* ptr_dinamico = criar_inteiro_dinamico();
    cout << "Valor do inteiro dinâmico: " << *ptr_dinamico << endl;
    delete ptr_dinamico; // É responsabilidade do chamador liberar a memória
    ptr_dinamico = nullptr;
    cout << "Memória liberada pelo chamador." << endl;
    cout << endl;
}

void aplicacao_2() {
    cout << "--- 2.2 unique_ptr e Movimentação ---" << endl;
    auto arma_principal = make_unique<string>("Arco Longo");
    cout << "Arma Principal (antes): " << *arma_principal << endl;

    // Movendo a propriedade
    unique_ptr<string> arma_secundaria = move(arma_principal);

    cout << "Arma Secundária (depois): " << *arma_secundaria << endl;
    cout << "Arma Principal (agora nulo?): " << (arma_principal == nullptr ? "Sim" : "Não") << endl;
    cout << endl;
}

void aplicacao_3() {
    cout << "--- 2.3 shared_ptr e Contagem ---" << endl;
    auto recurso_compartilhado = make_shared<int>(99);
    cout << "Contagem inicial: " << recurso_compartilhado.use_count() << endl; // 1

    shared_ptr<int> ptr_copia1 = recurso_compartilhado;
    shared_ptr<int> ptr_copia2 = recurso_compartilhado;

    cout << "Contagem após 2 cópias: " << recurso_compartilhado.use_count() << endl; // 3
    cout << endl;
}

// --- 3. Desafio (Difícil) ---

class Recurso {
public:
    Recurso() { cout << "Recurso criado." << endl; }
    ~Recurso() { cout << "Recurso destruído." << endl; }
};

void desafio_1() {
    cout << "--- 3.1 Simulação de Recurso de Jogo ---" << endl;

    cout << "Entrando no bloco de escopo..." << endl;
    {
        // Criação do Smart Pointer
        auto ptr_recurso = make_unique<Recurso>();
        cout << "Recurso está em uso." << endl;
    } // O unique_ptr sai de escopo aqui.

    cout << "Saindo do bloco de escopo." << endl;
    cout << "O unique_ptr chamou o destrutor automaticamente, liberando a memória." << endl;
    cout << "Isso resolve o vazamento de memória, pois a desalocação está ligada ao ciclo de vida do objeto Smart Pointer." << endl;
    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_1();
    fixacao_2();
    fixacao_3();
    fixacao_4();

    aplicacao_1();
    aplicacao_2();
    aplicacao_3();

    desafio_1();

    return 0;
}
