// 💡 Soluções Comentadas: Setup e Conceitos

#include <iostream>
#include <string>

using namespace std;

// --- Funções Principais ---

void fixacao_main() {
    cout << "--- 1. Fixação ---" << endl;

    // 1.1 Macro de Classe
    cout << "1. Macro de Classe: UCLASS()" << endl;

    // 1.2 Classe Base
    cout << "2. Classe Base para objetos no mundo: AActor" << endl;

    // 1.3 Sistema de Build
    cout << "3. Sistema de Build: Unreal Build Tool (UBT)" << endl;

    // 1.4 Propósito da Reflexão
    cout << "4. Propósito da Reflexão: Permitir que classes C++ sejam acessíveis e manipuláveis em Blueprints, Serialização e Garbage Collection." << endl;

    cout << endl;
}

void aplicacao_main() {
    cout << "--- 2. Aplicação ---" << endl;

    // 2.1 Acesso a Blueprints
    cout << "1. Acesso a Blueprints: UFUNCTION(BlueprintCallable)" << endl;

    // 2.2 Ponteiros Rastreáveis
    cout << "2. Ponteiros Rastreáveis: TObjectPtr<T> (ou T* em contextos UPROPERTY)" << endl;

    // 2.3 Herança de Componente
    cout << "3. Herança de Componente: UActorComponent" << endl;

    // 2.4 Ciclo de Vida
    cout << "4. Ciclo de Vida: virtual void BeginPlay() override" << endl;

    cout << endl;
}

void desafio_main() {
    cout << "--- 3. Desafio ---" << endl;

    cout << "Vazamento de Memória (Conceitual):" << endl;
    cout << "Objetos que herdam de UObject são gerenciados pelo Garbage Collector (GC) da Unreal Engine." << endl;
    cout << "Se você usa 'new' para criar um UObject, mas não o registra corretamente no sistema de reflexão/GC, o GC não saberá que ele existe e não o destruirá quando não for mais referenciado, causando um vazamento de memória." << endl;
    cout << "A alternativa recomendada para a criação de UObjects em tempo de execução é usar a função de fábrica 'NewObject<T>()' ou 'CreateDefaultSubobject<T>()' (para componentes em construtores)." << endl;

    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_main();
    aplicacao_main();
    desafio_main();

    return 0;
}
