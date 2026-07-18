// ✏️ Exemplos Conceituais: C++ na Unreal Engine

// Este arquivo é conceitual, pois o código C++ da Unreal Engine
// não pode ser compilado fora do ambiente do motor.

#include <iostream>
#include <string>

using namespace std;

// --- SIMULAÇÃO DE CÓDIGO UNREAL ---

// 1. Macros de Reflexão (UCLASS, UPROPERTY, UFUNCTION)
// Na Unreal, o código gerado pelo UHT (Unreal Header Tool)
// transforma essas macros em código C++ funcional.

// UCLASS()
class AMinhaClasse : public AActor {
    // UPROPERTY()
    float Vida;

    // UFUNCTION()
    void ReceberDano(float Dano) {
        // ...
    }
};

// 2. Tipos de Ponteiros (TObjectPtr)
// O TObjectPtr é o ponteiro rastreado pelo Garbage Collector.

// UPROPERTY()
// TObjectPtr<UStaticMeshComponent> MeshComponent;

// 3. Construtor (Usado para configurar valores padrão)
// AMinhaClasse::AMinhaClasse() {
//     Vida = 100.0f;
//     // Criação de Componentes
//     MeshComponent = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));
// }

// 4. Funções Virtuais Sobrescritas
// void AMinhaClasse::BeginPlay() {
//     Super::BeginPlay(); // Chama a implementação da classe base
//     // Lógica de início de jogo
// }

// --- FUNÇÃO PRINCIPAL (Apenas para demonstração) ---
int main() {
    cout << "Este arquivo contém apenas exemplos conceituais de código C++ da Unreal Engine." << endl;
    cout << "O código real deve ser escrito e compilado dentro do ambiente do motor." << endl;
    cout << "\nConceitos Chave:" << endl;
    cout << "1. Macros de Reflexão (UCLASS, UPROPERTY, UFUNCTION)" << endl;
    cout << "2. Herança de Classes Base (AActor, UObject)" << endl;
    cout << "3. Ponteiros Rastreáveis (TObjectPtr)" << endl;
    cout << "4. Sistema de Build (UBT) e Geração de Código (UHT)" << endl;

    return 0;
}
