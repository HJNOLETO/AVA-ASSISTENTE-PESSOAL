# 📚 3. Memória Dinâmica: `new`, `delete` e Smart Pointers

## 1. Gerenciamento de Memória em C++

Em C++, a memória é dividida em diferentes áreas, sendo as mais importantes:

| Área de Memória | Descrição | Gerenciamento |
| :--- | :--- | :--- |
| **Stack (Pilha)** | Usada para variáveis locais e chamadas de função. Rápida e automática. | **Automático** (pelo compilador). |
| **Heap (Montículo)** | Usada para alocação de memória dinâmica. Lenta e manual. | **Manual** (pelo programador, usando `new` e `delete`). |

A **Memória Dinâmica** é a alocação de memória no **Heap** em tempo de execução (enquanto o programa está rodando), e não em tempo de compilação.

## 2. Alocação e Desalocação Manual

Para alocar e desalocar memória no Heap, usamos os operadores `new` e `delete`.

### A. Alocação com `new`

O operador `new` aloca o espaço de memória necessário no Heap e retorna o **endereço** desse espaço (um ponteiro).

```cpp
// Aloca espaço para um único inteiro no Heap
int* ptr_vida = new int;

// Atribui um valor ao espaço alocado
*ptr_vida = 100;

// Aloca espaço para um array de 5 inteiros no Heap
int* ptr_array = new int[5];
```

### B. Desalocação com `delete`

O operador `delete` libera o espaço de memória alocado pelo `new`. É crucial que cada `new` tenha um `delete` correspondente.

```cpp
// Libera o espaço alocado para um único objeto
delete ptr_vida;
ptr_vida = nullptr; // Boa prática: Evita ponteiros 'dangling'

// Libera o espaço alocado para um array
delete[] ptr_array; // Note os colchetes []
ptr_array = nullptr;
```

### ❌ Vazamento de Memória (Memory Leak)

Um **vazamento de memória** ocorre quando a memória alocada com `new` não é liberada com `delete`. O programa perde a referência (o ponteiro) para o bloco de memória, mas o sistema operacional ainda o considera em uso.

```cpp
void funcao_com_vazamento() {
    int* ptr = new int(5); // Aloca memória
    // ...
    // ESQUECEU DE DELETAR!
    // delete ptr;
} // Quando a função termina, 'ptr' é destruído, mas a memória alocada no Heap não é liberada.
```

Vazamentos de memória são um problema sério em jogos, pois o uso de RAM aumenta progressivamente, levando a travamentos.

## 3. Smart Pointers (Ponteiros Inteligentes)

Para resolver o problema dos vazamentos de memória e do gerenciamento manual, o C++ moderno (C++11 em diante) introduziu os **Smart Pointers**.

Um Smart Pointer é um objeto que encapsula um ponteiro bruto (`raw pointer`) e gerencia automaticamente a desalocação de memória quando o objeto Smart Pointer sai de escopo.

### A. `std::unique_ptr`

*   **Propriedade Exclusiva:** Garante que apenas um Smart Pointer possa possuir o recurso alocado.
*   **Movível, Não Copiável:** Não pode ser copiado, mas pode ser movido (transferindo a propriedade).
*   **Uso:** Para recursos que têm um único proprietário e tempo de vida bem definido.

```cpp
#include <memory>

// Aloca um objeto e o ponteiro o possui
std::unique_ptr<int> ptr_unico(new int(10));
// OU (preferido em C++14+)
auto ptr_unico_2 = std::make_unique<int>(20);

// Quando 'ptr_unico' sai de escopo, a memória é liberada automaticamente.
```

### B. `std::shared_ptr`

*   **Propriedade Compartilhada:** Permite que múltiplos Smart Pointers possuam o mesmo recurso.
*   **Contagem de Referência:** Mantém uma contagem de quantos `shared_ptr` estão apontando para o recurso. A memória é liberada somente quando a contagem de referência chega a zero.
*   **Uso:** Para recursos que precisam ser compartilhados entre diferentes partes do código (ex: um recurso de jogo que vários objetos usam).

```cpp
// Cria o recurso e o primeiro shared_ptr
auto ptr_compartilhado = std::make_shared<int>(100);

// Cria outro shared_ptr que aponta para o mesmo recurso
std::shared_ptr<int> ptr_copia = ptr_compartilhado;
// Contagem de referência agora é 2

// A memória só será liberada quando ambos 'ptr_compartilhado' e 'ptr_copia' saírem de escopo.
```

### C. `std::weak_ptr`

*   **Referência Não Proprietária:** Aponta para um recurso gerenciado por um `shared_ptr`, mas **não** incrementa a contagem de referência.
*   **Uso:** Para quebrar ciclos de referência circulares que poderiam impedir a liberação de memória.

## 💡 Aplicação em Game Development (Unreal Engine)

A Unreal Engine tem seus próprios Smart Pointers otimizados, mas o conceito é idêntico:

*   **`TUniquePtr`**: Equivalente ao `std::unique_ptr`.
*   **`TSharedPtr` / `TSharedRef`**: Equivalente ao `std::shared_ptr`.

O uso de Smart Pointers é a **melhor prática** em C++ moderno e Unreal Engine para evitar vazamentos de memória e simplificar o gerenciamento de recursos.

---
[Próximo: Exemplos Práticos de Memória Dinâmica &raquo;](exemplos.cpp)
