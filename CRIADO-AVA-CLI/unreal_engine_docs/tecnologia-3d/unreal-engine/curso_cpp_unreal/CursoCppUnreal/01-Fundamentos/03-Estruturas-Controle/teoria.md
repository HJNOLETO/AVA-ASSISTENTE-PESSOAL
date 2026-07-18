# 📚 3. Estruturas de Controle: Condicionais e Loops

As **Estruturas de Controle** são o que dão vida a um programa, permitindo que ele tome decisões e execute tarefas repetitivas. Sem elas, o código seria executado linearmente, do início ao fim, sem inteligência.

## 1. Estruturas Condicionais (Tomada de Decisão)

As condicionais permitem que o programa execute blocos de código diferentes dependendo se uma condição é verdadeira (`true`) ou falsa (`false`).

### A. `if`, `else if`, `else`

A estrutura mais fundamental para a tomada de decisões.

```cpp
int vida = 30;

if (vida <= 0) {
    // Bloco 1: Executado se a condição for verdadeira
    cout << "O personagem morreu!" << endl;
} else if (vida < 50) {
    // Bloco 2: Executado se a primeira condição for falsa E esta for verdadeira
    cout << "Vida baixa! Use uma poção." << endl;
} else {
    // Bloco 3: Executado se todas as condições anteriores forem falsas
    cout << "Vida estável." << endl;
}
```

### B. `switch`

Usado para tomar decisões baseadas no valor exato de uma variável (geralmente um inteiro ou um `char`). É mais limpo que múltiplos `else if` quando se compara o mesmo valor a muitas opções.

```cpp
char direcao = 'W';

switch (direcao) {
    case 'W':
        cout << "Mover para frente." << endl;
        break; // Crucial: Sai do bloco switch
    case 'S':
        cout << "Mover para trás." << endl;
        break;
    case 'A':
    case 'D': // Múltiplos cases podem compartilhar o mesmo bloco
        cout << "Mover para o lado." << endl;
        break;
    default:
        cout << "Comando inválido." << endl;
        // Não precisa de break no default se for o último
}
```

### C. Operador Ternário

Uma forma concisa de escrever uma condicional `if-else` simples em uma única linha.

**Sintaxe:** `condição ? valor_se_verdadeiro : valor_se_falso;`

```cpp
int dano = 150;
string resultado = (dano > 100) ? "Dano Crítico!" : "Dano Normal.";
cout << resultado << endl; // Saída: Dano Crítico!
```

## 2. Estruturas de Repetição (Loops)

Os loops permitem que um bloco de código seja executado repetidamente.

### A. `for`

Ideal para quando você sabe exatamente (ou pode calcular) quantas vezes a repetição deve ocorrer.

**Sintaxe:** `for (inicialização; condição; incremento)`

```cpp
// Loop que executa 10 vezes (de 0 a 9)
for (int i = 0; i < 10; i++) {
    cout << "Inimigo " << i << " gerado." << endl;
}
```

### B. `while`

Ideal para quando a repetição deve continuar enquanto uma condição for verdadeira, mas você não sabe de antemão quantas vezes isso ocorrerá.

```cpp
int vida = 100;
int dano_por_segundo = 10;

while (vida > 0) {
    vida -= dano_por_segundo;
    cout << "Vida restante: " << vida << endl;
    // Em um jogo real, haveria um delay aqui
}
cout << "Game Over!" << endl;
```

### C. `do-while`

Semelhante ao `while`, mas garante que o bloco de código seja executado **pelo menos uma vez**, pois a condição é verificada no final.

```cpp
char comando;
do {
    cout << "Digite um comando (X para sair): ";
    cin >> comando;
} while (comando != 'X');
```

## 3. Comandos de Controle de Loop

Estes comandos permitem alterar o fluxo normal de um loop.

### A. `break`

Sai imediatamente do loop mais interno em que está.

```cpp
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break; // O loop para quando i for 5
    }
    cout << i << endl; // Imprime 0, 1, 2, 3, 4
}
```

### B. `continue`

Pula o restante do código no corpo do loop atual e passa para a próxima iteração.

```cpp
for (int i = 0; i < 5; i++) {
    if (i == 2) {
        continue; // Pula a iteração onde i é 2
    }
    cout << i << endl; // Imprime 0, 1, 3, 4
}
```

### C. `return`

Embora não seja um comando de controle de loop, `return` sai **completamente** da função atual (e, consequentemente, de qualquer loop dentro dela).

## 💡 Aplicação em Game Development (Unreal Engine)

*   **`if/else`**: Usado em toda a lógica de jogo, como verificar se um ataque acertou, se um jogador pode interagir com um objeto, ou qual animação deve ser reproduzida.
*   **`switch`**: Ideal para máquinas de estado (State Machines), como definir o comportamento de um inimigo (Idle, Patrol, Attack, Flee) baseado em um valor de enumeração.
*   **`for`**: Usado para iterar sobre coleções (como `TArray` na Unreal) para aplicar dano a todos os inimigos em uma área, ou para inicializar um conjunto de objetos.
*   **`while`**: Menos comum em loops de jogo (que geralmente usam o loop principal do motor), mas útil para algoritmos de busca ou espera por uma condição (ex: carregar um recurso).

---
[Próximo: Exemplos Práticos de Estruturas de Controle &raquo;](exemplos.cpp)
