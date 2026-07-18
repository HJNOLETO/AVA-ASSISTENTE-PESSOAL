// ✏️ Exemplos Conceituais: Tipos Unreal e Macros

// Este arquivo é conceitual, pois o código C++ da Unreal Engine
// não pode ser compilado fora do ambiente do motor.

#include <iostream>
#include <string>

using namespace std;

// --- SIMULAÇÃO DE TIPOS UNREAL ---

// FString (String mutável)
// FName (String imutável, rápida para comparação)
// FText (String localizada)

// TArray (Vetor dinâmico)
// TMap (Mapa chave-valor)

// --- SIMULAÇÃO DE MACROS ---

// USTRUCT() - Estrutura para o sistema de reflexão
// struct FStatus {
//     GENERATED_BODY()
//     UPROPERTY(EditAnywhere)
//     int Vida;
// };

// UCLASS() - Classe para o sistema de reflexão
// class AMinhaClasse : public AActor
// {
//     GENERATED_BODY()
//
// public:
//     // UPROPERTY() - Variável editável no editor e acessível em Blueprints
//     UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Config")
//     float Velocidade = 500.0f;
//
//     // UPROPERTY() - Container Unreal
//     UPROPERTY(VisibleAnywhere, Category = "Inventario")
//     TArray<FString> Itens;
//
//     // UFUNCTION() - Método chamável em Blueprints
//     UFUNCTION(BlueprintCallable, Category = "Acoes")
//     void AdicionarItem(const FString& NomeItem)
//     {
//         Itens.Add(NomeItem);
//         // FString para std::string para console (apenas para simulação)
//         // std::cout << "Item adicionado: " << TCHAR_TO_UTF8(*NomeItem) << std::endl;
//     }
//
//     // UFUNCTION() - Método Pure (não altera o estado)
//     UFUNCTION(BlueprintPure, Category = "Acoes")
//     int GetNumeroDeItens() const
//     {
//         return Itens.Num();
//     }
// };

// --- FUNÇÃO PRINCIPAL (Apenas para demonstração) ---
int main() {
    cout << "Este arquivo demonstra o uso conceitual de Tipos Unreal e Macros." << endl;
    cout << "O código real deve ser escrito e compilado dentro do ambiente do motor." << endl;
    cout << "\nTipos Chave:" << endl;
    cout << "1. FString, FName, FText (Strings)" << endl;
    cout << "2. TArray, TMap, TSet (Containers)" << endl;
    cout << "\nMacros Chave:" << endl;
    cout << "1. UPROPERTY (Variáveis)" << endl;
    cout << "2. UFUNCTION (Métodos)" << endl;
    cout << "3. GENERATED_BODY() (Obrigatório)" << endl;

    return 0;
}
