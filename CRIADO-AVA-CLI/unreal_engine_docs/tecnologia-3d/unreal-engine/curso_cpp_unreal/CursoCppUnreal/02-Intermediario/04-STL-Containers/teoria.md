# 📚 4. STL Containers: Estruturas de Dados Essenciais

A **Standard Template Library (STL)** é uma coleção de classes e funções C++ que implementam estruturas de dados e algoritmos comuns. Os **Containers** da STL são estruturas de dados que armazenam coleções de objetos.

O uso da STL é a **melhor prática** em C++ moderno, pois oferece estruturas de dados otimizadas e seguras.

## 1. Containers Sequenciais

Armazenam elementos em ordem linear, permitindo acesso sequencial.

### A. `std::vector` (O Mais Usado)

*   **Conceito:** Um array dinâmico que pode crescer ou diminuir de tamanho automaticamente.
*   **Vantagens:** Acesso rápido a elementos por índice (como um array), eficiente para adicionar/remover no final.
*   **Desvantagens:** Ineficiente para adicionar/remover no meio (pois requer mover todos os elementos subsequentes).
*   **Uso:** A coleção padrão para a maioria das necessidades.

```cpp
#include <vector>

std::vector<int> pontuacoes = {10, 20, 30};
pontuacoes.push_back(40); // Adiciona no final
pontuacoes[0] = 100; // Acesso por índice
pontuacoes.size(); // Retorna o tamanho (4)
```

### B. `std::list`

*   **Conceito:** Uma lista duplamente ligada. Cada elemento armazena o endereço do próximo e do anterior.
*   **Vantagens:** Inserção e remoção muito rápidas em qualquer posição.
*   **Desvantagens:** Acesso lento a elementos por índice (precisa percorrer a lista).
*   **Uso:** Quando há muitas inserções e remoções no meio da coleção (ex: lista de tarefas em um sistema de IA).

### C. `std::deque`

*   **Conceito:** Uma fila de duas pontas (Double-Ended Queue).
*   **Vantagens:** Inserção e remoção rápidas tanto no início quanto no final.
*   **Uso:** Quando você precisa de uma fila ou pilha que pode ser modificada em ambas as extremidades.

## 2. Containers Associativos

Armazenam elementos de forma ordenada, permitindo busca rápida baseada em uma chave.

### A. `std::map`

*   **Conceito:** Armazena pares de chave-valor (Key-Value Pairs), onde a chave é única. É implementado como uma árvore binária de busca balanceada.
*   **Vantagens:** Busca, inserção e remoção rápidas (complexidade $O(\log n)$).
*   **Uso:** Para mapear um identificador a um objeto (ex: mapear o nome de um item ao seu objeto Item, ou um ID de jogador ao seu objeto Player).

```cpp
#include <map>

std::map<std::string, int> inventario;
inventario["Espada"] = 1;
inventario["Poção"] = 5;

// Acesso
int num_pocoes = inventario["Poção"]; // 5
```

### B. `std::unordered_map`

*   **Conceito:** Semelhante ao `std::map`, mas implementado usando uma tabela hash.
*   **Vantagens:** Busca, inserção e remoção **muito** rápidas (complexidade média $O(1)$).
*   **Desvantagens:** Não mantém a ordem dos elementos.
*   **Uso:** Quando a ordem não importa e a velocidade de acesso é crítica.

## 3. Containers Adaptadores

Não são estruturas de dados independentes, mas sim wrappers que fornecem uma interface restrita a outros containers.

### A. `std::stack`

*   **Conceito:** Implementa o princípio LIFO (Last-In, First-Out).
*   **Operações:** `push` (adicionar), `pop` (remover o topo), `top` (ver o topo).
*   **Uso:** Para desfazer ações, rastrear o estado de uma máquina de estados (ex: Pilha de estados de IA).

### B. `std::queue`

*   **Conceito:** Implementa o princípio FIFO (First-In, First-Out).
*   **Operações:** `push` (adicionar no final), `pop` (remover o início), `front` (ver o início).
*   **Uso:** Para gerenciar eventos em ordem de chegada (ex: fila de comandos de rede).

## 💡 Aplicação em Game Development (Unreal Engine)

A Unreal Engine tem suas próprias versões otimizadas dos containers da STL, mas o conceito é o mesmo:

| STL Container | Unreal Engine Container | Uso Comum |
| :--- | :--- | :--- |
| `std::vector` | **`TArray`** | Lista de inimigos, inventário, lista de waypoints. |
| `std::map` | **`TMap`** | Mapeamento de IDs para objetos, dados de configuração. |
| `std::unordered_map` | **`TMap`** (com hash) | Busca rápida de recursos. |
| `std::string` | **`FString`** | Strings de texto. |

Dominar os conceitos da STL facilita a transição para os containers da Unreal Engine.

---
[Próximo: Exemplos Práticos de STL Containers &raquo;](exemplos.cpp)
