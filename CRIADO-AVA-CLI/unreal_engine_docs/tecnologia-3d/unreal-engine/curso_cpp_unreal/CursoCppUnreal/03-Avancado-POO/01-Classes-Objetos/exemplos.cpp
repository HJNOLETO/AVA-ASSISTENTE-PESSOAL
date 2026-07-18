// ✏️ Exemplos Práticos: Classes e Objetos

#include <iostream>
#include <string>

using namespace std;

// Definição da Classe
class Personagem {
public:
    // Atributos (Membros de Dados)
    string nome;
    int vida;

    // Construtor Padrão
    Personagem() {
        nome = "Sem Nome";
        vida = 100;
        cout << "Personagem Padrão criado: " << nome << endl;
    }

    // Construtor com Parâmetros
    Personagem(string n, int v) {
        nome = n;
        vida = v;
        cout << "Personagem Personalizado criado: " << nome << endl;
    }

    // Destrutor
    ~Personagem() {
        cout << "Personagem " << nome << " destruído." << endl;
    }

    // Método (Membro de Função)
    void atacar(Personagem& alvo) {
        cout << nome << " ataca " << alvo.nome << "!" << endl;
        int dano = 10;
        alvo.vida -= dano;
        cout << alvo.nome << " perde " << dano << " de vida. Vida restante: " << alvo.vida << endl;
    }
};

// Exemplo 1: Objetos na Stack (Pilha)
void exemplo_stack() {
    cout << "--- Exemplo 1: Objetos na Stack ---" << endl;

    // Chamada do Construtor com Parâmetros
    Personagem heroi("Arqueiro", 150);

    // Chamada do Construtor Padrão
    Personagem inimigo;

    // Interação entre objetos
    heroi.atacar(inimigo);

    // Os destrutores são chamados automaticamente ao sair desta função
    cout << "Saindo da função exemplo_stack..." << endl;
}

// Exemplo 2: Objetos no Heap (Montículo) com Ponteiros
void exemplo_heap() {
    cout << "\n--- Exemplo 2: Objetos no Heap ---" << endl;

    // Criação de objeto no Heap (retorna um ponteiro)
    Personagem* ptr_boss = new Personagem("Dragão", 500);

    // Acessando membros com o operador ->
    cout << "Vida do Boss: " << ptr_boss->vida << endl;

    // Alterando um atributo
    ptr_boss->vida = 450;

    // Chamando um método (precisamos de um alvo na stack para o exemplo)
    Personagem* ptr_guerreiro = new Personagem("Guerreiro", 120);
    ptr_guerreiro->atacar(*ptr_boss); // Desreferenciamos o ponteiro para passar o objeto

    // Liberação manual da memória (crucial!)
    delete ptr_boss;
    ptr_boss = nullptr;

    delete ptr_guerreiro;
    ptr_guerreiro = nullptr;

    cout << "Saindo da função exemplo_heap..." << endl;
}

// Função principal que chama todos os exemplos
int main() {
    exemplo_stack();
    exemplo_heap();

    return 0;
}
