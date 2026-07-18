# Módulo 2 - Lógica de Programação

## Status: 📚 MATERIAL DE ESTUDO

---

## PARTE 1: CONDICIONAIS (if/else)

### Teoria

Condicionais permitem que o programa tome decisões. O código só executa SE uma condição for verdadeira.

**Analogia:** "SE tenho dinheiro, ENTÃO compro item, SENÃO mostro mensagem de erro"

### Sintaxe Básica

```cpp
if (condicao) {
    // Executa se verdadeiro
}
```

```cpp
if (condicao) {
    // Executa se verdadeiro
} else {
    // Executa se falso
}
```

```cpp
if (condicao1) {
    // Executa se condicao1 verdadeira
} else if (condicao2) {
    // Executa se condicao2 verdadeira
} else {
    // Executa se todas falsas
}
```

---

### Operadores de Comparação

| Operador | Significado | Exemplo | Resultado |
|----------|-------------|---------|-----------|
| `==` | Igual a | `5 == 5` | `true` |
| `!=` | Diferente de | `5 != 3` | `true` |
| `>` | Maior que | `5 > 3` | `true` |
| `<` | Menor que | `3 < 5` | `true` |
| `>=` | Maior ou igual | `5 >= 5` | `true` |
| `<=` | Menor ou igual | `3 <= 5` | `true` |

**⚠️ ATENÇÃO:** `=` é atribuição, `==` é comparação!

```cpp
int x = 5;      // Atribui 5 a x
if (x == 5) {   // Compara se x é igual a 5
    // código
}
```

---

### Operadores Lógicos

| Operador | Significado | Exemplo | Quando é verdadeiro |
|----------|-------------|---------|---------------------|
| `&&` | E (AND) | `a > 5 && b < 10` | Ambas condições verdadeiras |
| `\|\|` | OU (OR) | `a > 5 \|\| b < 10` | Pelo menos uma verdadeira |
| `!` | NÃO (NOT) | `!(a > 5)` | Inverte o resultado |

---

### Exemplo 1: Sistema de Vida

```cpp
#include <iostream>
using namespace std;

int main() {
    int vida = 30;
    
    if (vida > 50) {
        cout << "Vida alta - Continue lutando!" << endl;
    } else if (vida > 20) {
        cout << "Vida média - Cuidado!" << endl;
    } else {
        cout << "Vida crítica - Use poção!" << endl;
    }
    
    return 0;
}
```

**Saída:** `Vida média - Cuidado!`

---

### Exemplo 2: Sistema de Acesso

```cpp
#include <iostream>
using namespace std;

int main() {
    int nivel = 15;
    bool temChave = true;
    
    // Precisa nível 10 E ter a chave
    if (nivel >= 10 && temChave) {
        cout << "Porta destrancada!" << endl;
    } else {
        cout << "Acesso negado!" << endl;
    }
    
    return 0;
}
```

**Saída:** `Porta destrancada!`

---

### Exemplo 3: Menu de Personagem

```cpp
#include <iostream>
using namespace std;

int main() {
    int escolha;
    
    cout << "=== ESCOLHA SUA CLASSE ===" << endl;
    cout << "1 - Guerreiro" << endl;
    cout << "2 - Mago" << endl;
    cout << "3 - Arqueiro" << endl;
    cout << "Digite sua escolha: ";
    cin >> escolha;
    
    if (escolha == 1) {
        cout << "Você é um Guerreiro! +10 Força" << endl;
    } else if (escolha == 2) {
        cout << "Você é um Mago! +10 Inteligência" << endl;
    } else if (escolha == 3) {
        cout << "Você é um Arqueiro! +10 Agilidade" << endl;
    } else {
        cout << "Opção inválida!" << endl;
    }
    
    return 0;
}
```

---

### Switch Case (Alternativa ao if/else)

Usado quando você compara a mesma variável com vários valores fixos.

```cpp
#include <iostream>
using namespace std;

int main() {
    int opcao;
    
    cout << "1-Atacar 2-Defender 3-Fugir: ";
    cin >> opcao;
    
    switch (opcao) {
        case 1:
            cout << "Você atacou!" << endl;
            break;  // Importante! Sai do switch
        case 2:
            cout << "Você defendeu!" << endl;
            break;
        case 3:
            cout << "Você fugiu!" << endl;
            break;
        default:
            cout << "Ação inválida!" << endl;
    }
    
    return 0;
}
```

**⚠️ Não esqueça o `break`!** Sem ele, executa os próximos cases também.

---

### Exercícios - Condicionais

#### Exercício 1: Sistema de Dano
Crie um programa que:
1. Peça o ataque do jogador (int)
2. Peça a defesa do inimigo (int)
3. SE ataque > defesa: mostre "Causou dano!"
4. SENÃO: mostre "Ataque bloqueado!"

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int ataque, defesa;
    
    cout << "Ataque do jogador: ";
    cin >> ataque;
    
    cout << "Defesa do inimigo: ";
    cin >> defesa;
    
    if (ataque > defesa) {
        cout << "Causou dano!" << endl;
    } else {
        cout << "Ataque bloqueado!" << endl;
    }
    
    return 0;
}
```
</details>

---

#### Exercício 2: Verificador de Level
Crie um programa que:
1. Peça o level do jogador
2. SE level < 10: "Iniciante"
3. SE level entre 10 e 30: "Intermediário"
4. SE level > 30: "Avançado"

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int level;
    
    cout << "Digite seu level: ";
    cin >> level;
    
    if (level < 10) {
        cout << "Categoria: Iniciante" << endl;
    } else if (level <= 30) {
        cout << "Categoria: Intermediário" << endl;
    } else {
        cout << "Categoria: Avançado" << endl;
    }
    
    return 0;
}
```
</details>

---

#### Exercício 3: Sistema de Loja
Crie um programa que:
1. Peça o gold do jogador
2. Peça o preço do item
3. SE tem gold suficiente E preço <= gold: "Compra realizada!"
4. SENÃO: "Gold insuficiente!"
5. Mostre o gold restante após compra (se comprou)

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int gold, preco;
    
    cout << "Seu gold: ";
    cin >> gold;
    
    cout << "Preço do item: ";
    cin >> preco;
    
    if (gold >= preco) {
        gold = gold - preco;
        cout << "Compra realizada!" << endl;
        cout << "Gold restante: " << gold << endl;
    } else {
        cout << "Gold insuficiente!" << endl;
    }
    
    return 0;
}
```
</details>

---

## PARTE 2: LOOPS (REPETIÇÃO)

### Teoria

Loops executam o mesmo código múltiplas vezes. Útil para:
- Processar inventários
- Spawnar inimigos
- Contar regressivamente
- Repetir ações

---

### FOR LOOP

Use quando você sabe QUANTAS vezes vai repetir.

#### Sintaxe

```cpp
for (inicio; condição; incremento) {
    // código que repete
}
```

#### Anatomia do For

```cpp
for (int i = 0; i < 5; i++) {
    cout << i << endl;
}
```

1. `int i = 0` - cria variável i começando em 0
2. `i < 5` - continua enquanto i for menor que 5
3. `i++` - aumenta i em 1 a cada repetição
4. Executa 5 vezes (i = 0, 1, 2, 3, 4)

---

#### Exemplo 1: Contagem Simples

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Contagem regressiva:" << endl;
    
    for (int i = 5; i >= 1; i--) {
        cout << i << endl;
    }
    
    cout << "BOOM!" << endl;
    return 0;
}
```

**Saída:**
```
Contagem regressiva:
5
4
3
2
1
BOOM!
```

---

#### Exemplo 2: Spawnar Inimigos

```cpp
#include <iostream>
using namespace std;

int main() {
    int quantidadeInimigos = 5;
    
    for (int i = 1; i <= quantidadeInimigos; i++) {
        cout << "Inimigo #" << i << " spawnou!" << endl;
    }
    
    cout << "Total: " << quantidadeInimigos << " inimigos" << endl;
    return 0;
}
```

**Saída:**
```
Inimigo #1 spawnou!
Inimigo #2 spawnou!
Inimigo #3 spawnou!
Inimigo #4 spawnou!
Inimigo #5 spawnou!
Total: 5 inimigos
```

---

#### Exemplo 3: Tabuada

```cpp
#include <iostream>
using namespace std;

int main() {
    int numero = 7;
    
    cout << "Tabuada do " << numero << ":" << endl;
    
    for (int i = 1; i <= 10; i++) {
        cout << numero << " x " << i << " = " << numero * i << endl;
    }
    
    return 0;
}
```

---

### WHILE LOOP

Use quando você NÃO sabe quantas vezes vai repetir. Continua enquanto condição for verdadeira.

#### Sintaxe

```cpp
while (condicao) {
    // código que repete
}
```

---

#### Exemplo 1: Sistema de Combate

```cpp
#include <iostream>
using namespace std;

int main() {
    int vidaInimigo = 100;
    int dano = 25;
    int turno = 1;
    
    while (vidaInimigo > 0) {
        cout << "Turno " << turno << ": Atacando!" << endl;
        vidaInimigo = vidaInimigo - dano;
        cout << "Vida do inimigo: " << vidaInimigo << endl;
        turno++;
    }
    
    cout << "Inimigo derrotado!" << endl;
    return 0;
}
```

**Saída:**
```
Turno 1: Atacando!
Vida do inimigo: 75
Turno 2: Atacando!
Vida do inimigo: 50
Turno 3: Atacando!
Vida do inimigo: 25
Turno 4: Atacando!
Vida do inimigo: 0
Inimigo derrotado!
```

---

#### Exemplo 2: Menu Interativo

```cpp
#include <iostream>
using namespace std;

int main() {
    int opcao = 0;
    
    while (opcao != 4) {
        cout << "\n=== MENU ===" << endl;
        cout << "1 - Ver status" << endl;
        cout << "2 - Descansar" << endl;
        cout << "3 - Inventário" << endl;
        cout << "4 - Sair" << endl;
        cout << "Escolha: ";
        cin >> opcao;
        
        if (opcao == 1) {
            cout << "HP: 100/100" << endl;
        } else if (opcao == 2) {
            cout << "Você descansou!" << endl;
        } else if (opcao == 3) {