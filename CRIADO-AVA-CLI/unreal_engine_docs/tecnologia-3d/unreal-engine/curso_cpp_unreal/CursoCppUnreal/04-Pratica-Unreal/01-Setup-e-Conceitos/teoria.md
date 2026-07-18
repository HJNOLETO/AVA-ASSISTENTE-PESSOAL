# 📚 1. Setup e Conceitos: C++ na Unreal Engine

O Módulo 04 marca a transição da teoria pura do C++ para a aplicação prática dentro do ambiente da **Unreal Engine (UE)**.

## 1. O Ambiente de Desenvolvimento

Para trabalhar com C++ na Unreal Engine, você precisará de:
1.  **Unreal Engine:** Instalada via Epic Games Launcher.
2.  **IDE (Ambiente de Desenvolvimento Integrado):** O Visual Studio (no Windows) ou o Xcode (no macOS) são os mais recomendados, pois a Epic Games fornece integração nativa com eles.
3.  **SDKs:** Certifique-se de que os SDKs de desenvolvimento de jogos (ex: SDK do Windows) estejam instalados corretamente.

## 2. O Sistema de Build da Unreal: Unreal Build Tool (UBT)

A Unreal Engine não usa o sistema de build padrão do C++ (como CMake ou Makefiles). Ela usa seu próprio sistema chamado **Unreal Build Tool (UBT)**.

*   **Arquivos `.Build.cs`:** Cada módulo do seu projeto (e do motor) tem um arquivo C# (`.Build.cs`) que define as dependências, os cabeçalhos públicos e privados, e outras configurações de compilação.
*   **Geração de Projetos:** O UBT é responsável por gerar os arquivos de projeto (ex: `.sln` para Visual Studio) que sua IDE usa.

## 3. O Sistema de Reflexão (Reflection System)

Este é o conceito mais importante para entender o C++ da Unreal. O C++ padrão não tem um sistema de reflexão nativo (a capacidade de um programa inspecionar a si mesmo em tempo de execução). A Unreal Engine implementa seu próprio sistema de reflexão para:

1.  **Blueprints:** Permitir que classes, atributos e métodos C++ sejam acessíveis e manipuláveis no sistema de *scripting* visual (Blueprints).
2.  **Serialização:** Salvar e carregar o estado dos objetos (ex: salvar o jogo).
3.  **Garbage Collection (Coleta de Lixo):** Gerenciar a memória de objetos de jogo de forma eficiente.
4.  **Editor:** Exibir e editar propriedades de objetos no painel de detalhes do editor.

### A. Macros de Reflexão

O sistema de reflexão é ativado por meio de **Macros** especiais que você deve adicionar às suas classes, atributos e métodos.

| Macro | O que faz | Exemplo de Uso |
| :--- | :--- | :--- |
| **`UCLASS()`** | Marca uma classe para o sistema de reflexão. | `UCLASS() class AMinhaClasse : public AActor { ... };` |
| **`UPROPERTY()`** | Marca um atributo para o sistema de reflexão. | `UPROPERTY(EditAnywhere) float Velocidade;` |
| **`UFUNCTION()`** | Marca um método para o sistema de reflexão. | `UFUNCTION(BlueprintCallable) void Atacar();` |

## 4. Garbage Collection (Coleta de Lixo)

A Unreal Engine usa um sistema de Coleta de Lixo para gerenciar a memória de objetos que herdam de `UObject`.

*   **`UObject`:** É a classe base para quase tudo na Unreal que precisa ser gerenciado pelo sistema de reflexão e coleta de lixo.
*   **`TObjectPtr<T>`:** Em vez de usar ponteiros C++ brutos (`*`) para objetos `UObject`, a Unreal recomenda o uso de `TObjectPtr<T>` (ou `T*` em versões mais antigas), que são ponteiros rastreados pelo coletor de lixo.
*   **Regra de Ouro:** Se um objeto herda de `UObject`, você não usa `new` e `delete` (exceto em casos muito específicos). O motor gerencia a vida útil do objeto.

## 5. Classes Base Comuns

| Classe Base | Descrição |
| :--- | :--- |
| **`UObject`** | Classe base para todos os objetos rastreados pelo Garbage Collector. Não tem representação no mundo. |
| **`AActor`** | Classe base para todos os objetos que podem ser colocados no mundo do jogo (ex: luzes, portas, inimigos). |
| **`APawn`** | Classe base para objetos que podem ser controlados (ex: personagem, veículo). |
| **`ACharacter`** | Subclasse de `APawn` com funcionalidade de movimento humanoide (ex: andar, pular). |
| **`UActorComponent`** | Componentes que podem ser anexados a um `AActor` (ex: `USkeletalMeshComponent`, `UHealthComponent`). |

---
[Próximo: Tipos Unreal e Macros &raquo;](exemplos.cpp)
