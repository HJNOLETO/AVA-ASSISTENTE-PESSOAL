# 📚 4. Estruturas de Dados Básicas: Arrays e Strings

## 1. Arrays (Vetores) Estáticos

Um **Array** é uma coleção de elementos do **mesmo tipo de dado**, armazenados em posições de memória contíguas (lado a lado). Isso permite acesso muito rápido a qualquer elemento.

### A. Declaração e Inicialização

Arrays em C++ são **estáticos**, o que significa que seu tamanho deve ser definido no momento da declaração e não pode ser alterado durante a execução do programa.

```cpp
// Array de 5 inteiros (tamanho fixo)
int pontuacoes[5];

// Inicialização na declaração
int vida_inimigos[3] = {100, 75, 120};

// Omitindo o tamanho (o compilador conta)
float coordenadas[] = {1.0f, 5.5f, 0.0f}; // Tamanho 3
```

### B. Acesso e Índices

Os elementos de um array são acessados usando um **índice** (posição), que começa em **0**.

```cpp
int vida_inimigos[3] = {100, 75, 120};

// Acessando o primeiro elemento (índice 0)
cout << vida_inimigos[0] << endl; // Saída: 100

// Alterando o último elemento (índice 2)
vida_inimigos[2] = 150;
```

### ❌ Erro Comum: Acesso Fora dos Limites (Out-of-Bounds)

Tentar acessar um índice que não existe (ex: `vida_inimigos[3]` em um array de tamanho 3) é um erro grave chamado **acesso fora dos limites**. O C++ não verifica isso automaticamente, e o programa tentará ler ou escrever em uma área de memória que não pertence ao array, causando um comportamento imprevisível ou uma falha de segurança.

### C. Iteração (Percorrendo o Array)

O loop `for` é a ferramenta ideal para percorrer arrays.

```cpp
int pontuacoes[] = {10, 20, 30, 40};
int tamanho = sizeof(pontuacoes) / sizeof(pontuacoes[0]); // Cálculo do tamanho

for (int i = 0; i < tamanho; i++) {
    cout << "Pontuação " << i << ": " << pontuacoes[i] << endl;
}
```

## 2. Strings

Uma **String** é uma sequência de caracteres. Em C++, existem duas formas principais de lidar com strings:

### A. Strings Estilo C (C-style Strings)

São arrays de caracteres (`char`) terminados por um caractere nulo (`\0`).

```cpp
char nome_personagem[10] = "Guerreiro"; // O tamanho deve incluir o '\0'
```

Embora ainda sejam usados em algumas APIs de baixo nível, eles são difíceis de manipular e propensos a erros.

### B. `std::string` (A Opção Preferida)

A classe `std::string` (parte da Standard Template Library - STL) é a forma moderna e segura de lidar com strings em C++. Ela gerencia automaticamente o tamanho e a memória.

Para usar `std::string`, você deve incluir o cabeçalho `<string>`.

```cpp
#include <string>

// Declaração e Inicialização
std::string nome_arma = "Espada Longa";
std::string nome_jogador;
nome_jogador = "Arqueiro";
```

### C. Manipulação de `std::string`

| Operação | Exemplo | Descrição |
| :--- | :--- | :--- |
| **Concatenação** | `str1 + str2` | Junta duas strings. |
| **Tamanho** | `str.length()` | Retorna o número de caracteres. |
| **Acesso** | `str[i]` | Acessa o caractere na posição `i`. |
| **Comparação** | `str1 == str2` | Compara se as strings são iguais. |
| **Busca** | `str.find("sub")` | Retorna a posição da primeira ocorrência. |

```cpp
std::string nome = "Herói";
std::string titulo = " o Destemido";

std::string nome_completo = nome + titulo; // Concatenação
cout << nome_completo << endl; // Saída: Herói o Destemido

cout << "Tamanho: " << nome_completo.length() << endl; // Saída: 18
```

## 💡 Aplicação em Game Development (Unreal Engine)

*   **Arrays Estáticos**: Raramente usados diretamente para dados de jogo devido à sua inflexibilidade de tamanho.
*   **`std::string`**: Usado para manipulação de texto em geral, como nomes de arquivos, logs e mensagens de erro.
*   **`TArray` e `FString`**: Na Unreal Engine, você usará as classes otimizadas do motor:
    *   **`TArray`**: O equivalente dinâmico e otimizado de um array para coleções de objetos de jogo.
    *   **`FString`**: O tipo de string otimizado da Unreal, que se comporta de forma semelhante ao `std::string`, mas é integrado ao sistema de reflexão do motor.

Dominar o `std::string` agora facilitará muito a compreensão do `FString` no Módulo 4.

---
[Próximo: Exemplos Práticos de Arrays e Strings &raquo;](exemplos.cpp)
