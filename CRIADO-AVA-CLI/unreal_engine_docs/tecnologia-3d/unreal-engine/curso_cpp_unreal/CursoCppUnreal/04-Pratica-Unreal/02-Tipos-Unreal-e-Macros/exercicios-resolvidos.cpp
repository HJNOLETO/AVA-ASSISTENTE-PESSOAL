// 💡 Soluções Comentadas: Tipos Unreal e Macros

// Este arquivo é conceitual, pois o código C++ da Unreal Engine
// não pode ser compilado fora do ambiente do motor.

#include <iostream>
#include <string>

using namespace std;

// --- SIMULAÇÃO DE CÓDIGO UNREAL ---

// 3. Desafio (Conceitual)
// USTRUCT(BlueprintType)
// struct FItemData
// {
//     GENERATED_BODY()
//
//     UPROPERTY(EditAnywhere, BlueprintReadOnly)
//     FName ID_Item;
//
//     UPROPERTY(EditAnywhere, BlueprintReadOnly)
//     FText NomeExibicao;
//
//     UPROPERTY(EditAnywhere, BlueprintReadOnly)
//     int Peso;
// };

// --- Funções Principais ---

void fixacao_main() {
    cout << "--- 1. Fixação ---" << endl;

    // 1.1 String Mutável
    cout << "1. String Mutável: FString" << endl;

    // 1.2 String Localizada
    cout << "2. String Localizada: FText" << endl;

    // 1.3 Macro de Variável
    cout << "3. Macro de Variável: UPROPERTY()" << endl;

    // 1.4 Especificador de Edição
    cout << "4. Especificador de Edição: EditAnywhere" << endl;

    cout << endl;
}

void aplicacao_main() {
    cout << "--- 2. Aplicação ---" << endl;

    // 2.1 Container Unreal
    cout << "1. Declaração de TArray<int>: TArray<int> MinhaLista;" << endl;

    // 2.2 UFUNCTION para Blueprint
    cout << "2. Assinatura de UFUNCTION:" << endl;
    cout << "   UFUNCTION(BlueprintCallable, Category = \"Saude\")" << endl;
    cout << "   void Curar(float Quantidade);" << endl;

    // 2.3 UPROPERTY Completo
    cout << "3. UPROPERTY Completo:" << endl;
    cout << "   UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = \"Combate\")" << endl;
    cout << "   float DanoCritico;" << endl;

    // 2.4 FName vs FString
    cout << "4. FName vs FString:" << endl;
    cout << "   FName é mais eficiente para identificadores (como sockets) porque é imutável e usa um sistema de hash interno, tornando as comparações de string extremamente rápidas (O(1))." << endl;

    cout << endl;
}

void desafio_main() {
    cout << "--- 3. Desafio ---" << endl;

    cout << "Estrutura de Dados para Blueprint (Conceitual):" << endl;
    cout << "A estrutura FItemData deve ser marcada com USTRUCT(BlueprintType)." << endl;
    cout << "A macro obrigatória dentro do corpo da estrutura é: GENERATED_BODY()" << endl;

    cout << endl;
}

// Função principal que chama todas as soluções
int main() {
    fixacao_main();
    aplicacao_main();
    desafio_main();

    return 0;
}
