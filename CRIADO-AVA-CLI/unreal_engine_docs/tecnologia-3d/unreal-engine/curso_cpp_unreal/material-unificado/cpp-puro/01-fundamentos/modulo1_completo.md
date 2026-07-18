# Módulo 1 - Fundamentos C++ para Unreal Engine

## Status: ✅ CONCLUÍDO

---

## 1. ESTRUTURA BÁSICA DE UM PROGRAMA C++

### Teoria

Todo programa C++ precisa de:

1. **Headers** (bibliotecas) - ferramentas que você vai usar
2. **Namespace** - atalho para não escrever `std::` toda hora
3. **Função main()** - onde o programa começa
4. **return 0** - indica que o programa terminou com sucesso

### Código Base

```cpp
#include <iostream>
using namespace std;

int main() {
    // Seu código aqui
    return 0;
}
```

### Explicação Linha por Linha

```cpp
#include <iostream>      // Inclui ferramentas de entrada/saída
using namespace std;     // Permite usar cout sem std::
int main() {            // Função principal (obrigatória)
    return 0;           // Encerra programa com sucesso
}                       // Fecha a função main
```

---

## 2. BIBLIOTECAS (HEADERS)

### Teoria

Headers são arquivos que contêm código pronto para usar. Você inclui no início do programa com `#include`.

### Principais Headers para Iniciantes

| Header       | Para que serve            | Exemplo de uso                |
| ------------ | ------------------------- | ----------------------------- |
| `<iostream>` | Entrada/saída (cout, cin) | `cout << "Oi";`               |
| `<string>`   | Trabalhar com texto       | `string nome = "João";`       |
| `<cmath>`    | Matemática (sqrt, pow)    | `sqrt(16);`                   |
| `<vector>`   | Listas dinâmicas          | `vector<int> lista;`          |
| `<limits>`   | Limites de tipos          | `numeric_limits<int>::max();` |

### Exemplo Prático

```cpp
#include <iostream>  // Para cout
#include <string>    // Para string
using namespace std;

int main() {
    string nome = "Guerreiro";
    cout << "Classe: " << nome << endl;
    return 0;
}
```

---

## 3. TIPOS DE DADOS

### Teoria

Variáveis são "caixas" que guardam informações. Cada tipo de caixa guarda um tipo diferente de dado.

### Tipos Básicos

| Tipo     | Guarda            | Exemplo                  | Tamanho  |
| -------- | ----------------- | ------------------------ | -------- |
| `int`    | Números inteiros  | `100`, `-50`, `0`        | 4 bytes  |
| `float`  | Números decimais  | `3.14f`, `0.5f`          | 4 bytes  |
| `double` | Decimais precisos | `3.14159`, `0.5`         | 8 bytes  |
| `char`   | Um caractere      | `'A'`, `'x'`, `'5'`      | 1 byte   |
| `bool`   | Verdadeiro/Falso  | `true`, `false`          | 1 byte   |
| `string` | Texto             | `"Hello"`, `"Guerreiro"` | Variável |

### Regras Importantes

- `float` precisa de `f` no final: `0.5f`
- `char` usa aspas simples: `'A'`
- `string` usa aspas duplas: `"texto"`
- `bool` só aceita `true` ou `false`

### Exemplo Completo

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int vida = 100;              // Inteiro
    float velocidade = 5.5f;     // Decimal
    char classe = 'G';           // Caractere
    bool vivo = true;            // Booleano
    string nome = "Kratos";      // Texto

    cout << "Nome: " << nome << endl;
    cout << "Vida: " << vida << endl;
    cout << "Velocidade: " << velocidade << endl;
    cout << "Classe: " << classe << endl;
    cout << "Vivo: " << vivo << endl;  // 1=true, 0=false

    return 0;
}
```

**Saída:**

```
Nome: Kratos
Vida: 100
Velocidade: 5.5
Classe: G
Vivo: 1
```

---

## 4. SAÍDA DE DADOS (cout)

### Teoria

`cout` = Console Output = mostra dados na tela

### Sintaxe

```cpp
cout << "texto";           // Mostra texto
cout << variavel;          // Mostra valor da variável
cout << "texto" << var;    // Mostra texto + variável
cout << endl;              // Quebra linha
```

### Operador <<

O `<<` é o operador de inserção. Você pode encadear vários:

```cpp
cout << "Vida: " << vida << " / " << vidaMax << endl;
```

### Exemplos

```cpp
int pontos = 500;

// Forma 1: Simples
cout << pontos;

// Forma 2: Com texto
cout << "Pontos: " << pontos;

// Forma 3: Com quebra de linha
cout << "Pontos: " << pontos << endl;

// Forma 4: Múltiplas variáveis
int level = 10;
cout << "Level " << level << " - Pontos: " << pontos << endl;
```

---

## 5. ENTRADA DE DADOS (cin)

### Teoria

`cin` = Console Input = lê dados do teclado

### Sintaxe

```cpp
int idade;
cin >> idade;  // Espera você digitar e apertar ENTER
```

### Operador >>

O `>>` é o operador de extração. Ele "extrai" o dado do teclado para a variável.

### Fluxo Completo

```cpp
#include <iostream>
using namespace std;

int main() {
    int nivel;

    cout << "Digite seu nível: ";  // Pede informação
    cin >> nivel;                   // Lê do teclado
    cout << "Você é nível " << nivel << endl;  // Mostra

    return 0;
}
```

### Ler Múltiplos Valores

```cpp
int x, y;
cout << "Digite X e Y: ";
cin >> x >> y;  // Digita: 10 20 [ENTER]
```

### Ler String com Espaços

```cpp
#include <string>
string nomeCompleto;

// Problema: cin para no espaço
cin >> nomeCompleto;  // "João Silva" → lê só "João"

// Solução: getline
getline(cin, nomeCompleto);  // Lê "João Silva" completo
```

---

## 6. OPERAÇÕES MATEMÁTICAS

### Operadores Básicos

| Operador | Operação         | Exemplo  | Resultado |
| -------- | ---------------- | -------- | --------- |
| `+`      | Adição           | `5 + 3`  | `8`       |
| `-`      | Subtração        | `5 - 3`  | `2`       |
| `*`      | Multiplicação    | `5 * 3`  | `15`      |
| `/`      | Divisão          | `10 / 2` | `5`       |
| `%`      | Resto da divisão | `10 % 3` | `1`       |

### Ordem de Precedência

```cpp
int resultado = 5 + 3 * 2;  // resultado = 11 (não 16)
// Multiplicação primeiro: 3 * 2 = 6
// Depois soma: 5 + 6 = 11

int resultado2 = (5 + 3) * 2;  // resultado2 = 16
// Parênteses primeiro: 5 + 3 = 8
// Depois multiplica: 8 * 2 = 16
```

### Exemplo Prático

```cpp
#include <iostream>
using namespace std;

int main() {
    int ataque = 50;
    int defesa = 20;
    int multiplicador = 2;

    int danoBase = ataque - defesa;           // 30
    int danoTotal = danoBase * multiplicador; // 60

    cout << "Dano causado: " << danoTotal << endl;

    return 0;
}
```

### Divisão Inteira vs Decimal

```cpp
int a = 10;
int b = 3;

int resultado1 = a / b;        // 3 (corta decimal)
float resultado2 = a / b;      // 3.0 (ainda corta!)
float resultado3 = (float)a / b;  // 3.33333 (correto)

// Ou declare como float desde o início
float x = 10.0f;
float y = 3.0f;
float resultado4 = x / y;  // 3.33333
```

---

## 7. COMENTÁRIOS

### Tipos

```cpp
// Comentário de linha única

/*
   Comentário
   de múltiplas
   linhas
*/

int vida = 100;  // Comentário no final da linha
```

### Boas Práticas

```cpp
// ✅ BOM: Explica "por quê"
// Reduz vida pela metade ao ser atingido por crítico
vida = vida / 2;

// ❌ RUIM: Repete o óbvio
// Divide vida por 2
vida = vida / 2;
```

---

## EXERCÍCIOS PRÁTICOS

### Exercício 1: Calculadora de Vida

Crie um programa que:

1. Declare `vidaMaxima = 100`
2. Declare `dano = 30`
3. Calcule `vidaRestante = vidaMaxima - dano`
4. Mostre: `"Vida restante: "` + valor

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int vidaMaxima = 100;
    int dano = 30;
    int vidaRestante = vidaMaxima - dano;

    cout << "Vida restante: " << vidaRestante << endl;
    return 0;
}
```

</details>

---

### Exercício 2: Sistema de Pontuação

Peça ao usuário:

1. Digite os pontos do nível 1
2. Digite os pontos do nível 2
3. Calcule e mostre a soma total

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int nivel1, nivel2;

    cout << "Pontos do nível 1: ";
    cin >> nivel1;

    cout << "Pontos do nível 2: ";
    cin >> nivel2;

    int total = nivel1 + nivel2;
    cout << "Total de pontos: " << total << endl;

    return 0;
}
```

</details>

---

### Exercício 3: Ficha de Personagem

Crie uma ficha completa:

1. Peça: nome (string), nível (int), vida (int)
2. Calcule: `poder = nivel * 10 + vida`
3. Mostre todas as informações formatadas

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome;
    int nivel, vida;

    cout << "Nome do personagem: ";
    getline(cin, nome);

    cout << "Nível: ";
    cin >> nivel;

    cout << "Vida: ";
    cin >> vida;

    int poder = nivel * 10 + vida;

    cout << "\n=== FICHA DO PERSONAGEM ===" << endl;
    cout << "Nome: " << nome << endl;
    cout << "Nível: " << nivel << endl;
    cout << "Vida: " << vida << endl;
    cout << "Poder: " << poder << endl;

    return 0;
}
```

</details>

---

### Exercício 4: Sistema de Dano Crítico

Sistema de combate:

1. Peça: ataque (int), defesa (int)
2. Calcule: `danoNormal = ataque - defesa`
3. Calcule: `danoCritico = danoNormal * 2`
4. Mostre ambos os valores

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int ataque, defesa;

    cout << "Valor de ataque: ";
    cin >> ataque;

    cout << "Valor de defesa: ";
    cin >> defesa;

    int danoNormal = ataque - defesa;
    int danoCritico = danoNormal * 2;

    cout << "\nDano normal: " << danoNormal << endl;
    cout << "Dano crítico: " << danoCritico << endl;

    return 0;
}
```

</details>

---

### Exercício 5: Conversor de Moedas

Sistema de loja:

1. Peça quantidade de gold (int)
2. Taxa de conversão: 1 gold = 100 silver
3. Calcule e mostre o valor em silver

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int gold;
    const int TAXA = 100;  // const = valor não muda

    cout << "Quantidade de gold: ";
    cin >> gold;

    int silver = gold * TAXA;

    cout << "Você tem " << silver << " silver" << endl;

    return 0;
}
```

</details>

---

## RESUMO DO MÓDULO 1

### O Que Você Aprendeu

✅ Estrutura básica de programa C++  
✅ Headers (iostream, string)
