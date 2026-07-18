# Módulo 3 - Arrays e Vetores

## FASE 1: FUNDAMENTOS C++

### Status: 📚 MATERIAL DE ESTUDO

---

## 1. ARRAYS BÁSICOS EM C++

### Teoria

Um **Array** (ou vetor) é uma estrutura de dados que armazena uma coleção de elementos do **mesmo tipo** em posições de memória contíguas. O tamanho de um array é fixo e deve ser definido no momento da declaração.

**Características Chave:**

- **Tamanho Fixo:** Não pode crescer ou diminuir após a criação.
- **Acesso por Índice:** Os elementos são acessados usando um índice numérico, que **sempre começa em 0**.

### Sintaxe

```cpp
// Tipo NomeArray[Tamanho];
int Pontuacoes[5]; // Array de 5 inteiros

// Inicialização
int VidaInimigos[] = {100, 75, 50, 120}; // O tamanho é inferido (4)
string Nomes[3] = {"Guerreiro", "Mago", "Arqueiro"};
```

### Acesso e Modificação

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string Inventario[4] = {"Espada", "Poção", "Escudo", "Vazio"};

    // Acessando o primeiro elemento (índice 0)
    cout << "Primeiro item: " << Inventario[0] << endl; // Saída: Espada

    // Modificando o último elemento (índice 3)
    Inventario[3] = "Machado";
    cout << "Novo item: " << Inventario[3] << endl; // Saída: Machado

    // Tentativa de acessar fora do limite (índice 4) é um erro grave!
    // cout << Inventario[4] << endl; // ❌ ERRO: Acesso fora do limite

    return 0;
}
```

### Iterando com Loops

Arrays são quase sempre usados em conjunto com loops `for` para processar todos os elementos.

```cpp
#include <iostream>
using namespace std;

int main() {
    int Pontuacoes[] = {10, 25, 5, 40, 15};
    int tamanho = sizeof(Pontuacoes) / sizeof(Pontuacoes[0]); // Calcula o tamanho
    int soma = 0;

    for (int i = 0; i < tamanho; i++) {
        soma += Pontuacoes[i]; // Soma o elemento atual
    }

    cout << "Pontuação total: " << soma << endl; // Saída: 95

    return 0;
}
```

---

## 2. STD::VECTOR (VETORES DINÂMICOS)

### Teoria

O `std::vector` é o contêiner mais usado em C++ para coleções. Ao contrário dos arrays, ele é **dinâmico**, ou seja, pode crescer e diminuir de tamanho em tempo de execução. Ele faz parte da Standard Template Library (STL).

### Quando Usar `std::vector`

| Característica | Array Básico                             | `std::vector`                                               |
| :------------- | :--------------------------------------- | :---------------------------------------------------------- |
| **Tamanho**    | Fixo (definido na compilação)            | Dinâmico (pode mudar em tempo de execução)                  |
| **Segurança**  | Não verifica limites (risco de _crash_)  | Verifica limites (mais seguro, mas um pouco mais lento)     |
| **Funções**    | Poucas funções nativas                   | Muitas funções úteis (`push_back`, `size`, `clear`, etc.)   |
| **Uso**        | Coleções pequenas e de tamanho conhecido | **Quase sempre a melhor escolha** para coleções em C++ puro |

### Sintaxe e Funções Principais

Para usar `std::vector`, você precisa incluir o header `<vector>`.

```cpp
#include <iostream>
#include <vector> // Necessário para usar vector
#include <string>
using namespace std;

int main() {
    // Declaração: vector<Tipo> Nome;
    vector<string> Inventario;

    // Adicionar elementos (push_back)
    Inventario.push_back("Poção de Cura");
    Inventario.push_back("Espada Longa");

    // Acessar elementos (índice)
    cout << "Item 1: " << Inventario[0] << endl;

    // Tamanho atual (size)
    cout << "Tamanho: " << Inventario.size() << endl; // Saída: 2

    // Remover o último elemento (pop_back)
    Inventario.pop_back();

    // Iterar com range-based for (C++ moderno)
    cout << "\nInventário atual:" << endl;
    for (const string& item : Inventario) {
        cout << "- " << item << endl;
    }

    return 0;
}
```

### `std::vector` no Unreal Engine

Embora o `std::vector` seja o padrão em C++ puro, no Unreal Engine você deve usar o contêiner nativo **`TArray`**.

- **`TArray`** é o equivalente do `std::vector` na Unreal.
- Ele é otimizado para o motor e se integra melhor com o sistema de memória e o _Garbage Collection_.
- A sintaxe é muito similar: `TArray<int> MinhaLista;`

---

## EXERCÍCIOS DE INVENTÁRIO COM ARRAYS E VETORES

### Exercício 1: Inventário Fixo (Array Básico)

Crie um programa que simule um inventário de 5 slots usando um **array básico** de strings.

1. Inicialize o array com 5 nomes de itens.
2. Use um loop `for` para mostrar o conteúdo de cada slot.
3. Modifique o item no slot 2 (índice 1) para "Armadura de Ferro".
4. Mostre o inventário novamente.

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

void mostrarInventario(const string inventario[], int tamanho) {
    cout << "\n=== INVENTÁRIO ===" << endl;
    for (int i = 0; i < tamanho; i++) {
        cout << "Slot " << i << ": " << inventario[i] << endl;
    }
}

int main() {
    const int TAMANHO_MAX = 5;
    string Inventario[TAMANHO_MAX] = {"Espada", "Poção", "Escudo", "Moeda", "Vazio"};

    mostrarInventario(Inventario, TAMANHO_MAX);

    // 3. Modificar o item no slot 2 (índice 1)
    Inventario[1] = "Armadura de Ferro";

    cout << "\n--- Item modificado ---" << endl;
    mostrarInventario(Inventario, TAMANHO_MAX);

    return 0;
}
```

</details>

---

### Exercício 2: Inventário Dinâmico (`std::vector`)

Crie um programa que simule um inventário dinâmico usando **`std::vector`** de strings.

1. Crie um `vector` vazio.
2. Adicione 3 itens usando `push_back`.
3. Mostre o tamanho atual do inventário.
4. Remova o último item usando `pop_back`.
5. Use um loop `range-based for` para mostrar o conteúdo restante.

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    vector<string> Inventario;

    // 2. Adicionar 3 itens
    Inventario.push_back("Arco Élfico");
    Inventario.push_back("Flechas (x50)");
    Inventario.push_back("Poção de Mana");

    // 3. Mostrar o tamanho
    cout << "Tamanho inicial: " << Inventario.size() << endl;

    // 4. Remover o último item
    Inventario.pop_back();

    // 5. Mostrar o conteúdo restante
    cout << "\nInventário após remoção:" << endl;
    for (const string& item : Inventario) {
        cout << "- " << item << endl;
    }

    cout << "\nTamanho final: " << Inventario.size() << endl;

    return 0;
}
```

</details>

---

### Exercício 3: Busca de Item (Crescente)

Crie um programa que:

1. Inicialize um `std::vector<string>` com 5 nomes de itens.
2. Peça ao usuário para digitar o nome de um item a ser buscado.
3. Use um loop `for` para percorrer o vetor.
4. **SE** o item for encontrado, mostre a mensagem "Item [Nome do Item] encontrado no slot [Índice]!" e use `break` para sair do loop.
5. **SE** o loop terminar sem encontrar o item, mostre "Item não encontrado no inventário."

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    vector<string> Inventario = {"Espada", "Poção", "Escudo", "Moeda", "Mapa"};
    string itemBusca;
    bool encontrado = false;

    cout << "Inventário: Espada, Poção, Escudo, Moeda, Mapa" << endl;
    cout << "Qual item deseja buscar? ";
    cin >> itemBusca;

    for (int i = 0; i < Inventario.size(); i++) {
        if (Inventario[i] == itemBusca) {
            cout << "Item " << itemBusca << " encontrado no slot " << i << "!" << endl;
            encontrado = true;
            break; // Sai do loop assim que encontra
        }
    }

    if (!encontrado) {
        cout << "Item não encontrado no inventário." << endl;
    }

    return 0;
}
```

</details>

---

## RESUMO DO MÓDULO 3

### O Que Você Aprendeu

✅ Arrays básicos (tamanho fixo, acesso por índice)  
✅ `std::vector` (tamanho dinâmico, funções úteis)  
✅ Diferença entre Array e `std::vector` (e a menção ao `TArray` da Unreal)  
✅ Iteração de coleções com loops `for`

### Próximo Passo

O próximo módulo inicia a **FASE 2: PROGRAMAÇÃO ORIENTADA A OBJETOS (POO)**, que é o coração do desenvolvimento com Unreal Engine.

**Próximo:** Módulo 4: Introdução a Classes (POO)
