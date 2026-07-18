# Módulo 3 - Funções

## Status: 📚 MATERIAL DE ESTUDO

---

## O QUE SÃO FUNÇÕES?

### Teoria

Funções são blocos de código reutilizáveis que executam uma tarefa específica.

**Analogia:** Uma função é como uma máquina:
- Você dá ingredientes (parâmetros)
- Ela processa
- Retorna um resultado

**Por que usar?**
- ✅ Evita repetição de código
- ✅ Organiza o programa
- ✅ Facilita manutenção
- ✅ Torna código testável

---

## ANATOMIA DE UMA FUNÇÃO

```cpp
tipo_retorno nomeDaFuncao(parametros) {
    // código
    return valor;
}
```

### Partes:

1. **Tipo de retorno** - que tipo de dado a função devolve
2. **Nome da função** - identificador único
3. **Parâmetros** - dados que a função recebe (opcional)
4. **Corpo** - código que executa
5. **return** - valor que devolve (se não for void)

---

## TIPOS DE FUNÇÕES

### 1. Função Void (Sem Retorno)

Executa ação, mas NÃO devolve valor.

```cpp
#include <iostream>
using namespace std;

void saudacao() {
    cout << "Bem-vindo ao jogo!" << endl;
}

int main() {
    saudacao();  // Chama a função
    return 0;
}
```

**Saída:** `Bem-vindo ao jogo!`

---

### 2. Função Com Retorno

Devolve um valor para quem chamou.

```cpp
#include <iostream>
using namespace std;

int somar(int a, int b) {
    int resultado = a + b;
    return resultado;  // Devolve o valor
}

int main() {
    int total = somar(5, 3);  // Recebe o retorno
    cout << "Total: " << total << endl;
    return 0;
}
```

**Saída:** `Total: 8`

---

### 3. Função Com Parâmetros

```cpp
#include <iostream>
using namespace std;

void mostrarVida(int vida, int vidaMaxima) {
    cout << "Vida: " << vida << "/" << vidaMaxima << endl;
}

int main() {
    mostrarVida(80, 100);
    mostrarVida(50, 100);
    return 0;
}
```

**Saída:**
```
Vida: 80/100
Vida: 50/100
```

---

## DECLARAÇÃO vs DEFINIÇÃO

### Problema

Em C++, você precisa declarar a função ANTES de usá-la.

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = calcularDano(50, 20);  // ❌ ERRO! calcularDano não existe ainda
    return 0;
}

int calcularDano(int ataque, int defesa) {
    return ataque - defesa;
}
```

---

### Solução 1: Definir Antes do main

```cpp
#include <iostream>
using namespace std;

int calcularDano(int ataque, int defesa) {
    return ataque - defesa;
}

int main() {
    int x = calcularDano(50, 20);  // ✅ OK
    cout << "Dano: " << x << endl;
    return 0;
}
```

---

### Solução 2: Protótipo (Declaração) + Definição Depois

```cpp
#include <iostream>
using namespace std;

// Protótipo (declaração)
int calcularDano(int ataque, int defesa);

int main() {
    int x = calcularDano(50, 20);  // ✅ OK
    cout << "Dano: " << x << endl;
    return 0;
}

// Definição
int calcularDano(int ataque, int defesa) {
    return ataque - defesa;
}
```

**Melhor prática:** Use protótipos no topo, definições no final.

---

## EXEMPLOS PRÁTICOS

### Exemplo 1: Sistema de Dano

```cpp
#include <iostream>
using namespace std;

// Protótipos
int calcularDano(int ataque, int defesa);
bool isCritico(int chance);

int main() {
    int ataque = 50;
    int defesa = 20;
    int chanceC ritica = 30;
    
    int dano = calcularDano(ataque, defesa);
    
    if (isCritico(chanceCritica)) {
        dano = dano * 2;
        cout << "CRÍTICO! ";
    }
    
    cout << "Dano causado: " << dano << endl;
    return 0;
}

int calcularDano(int ataque, int defesa) {
    int dano = ataque - defesa;
    if (dano < 0) {
        dano = 0;
    }
    return dano;
}

bool isCritico(int chance) {
    // Simplificado: retorna true se chance > 25
    return chance > 25;
}
```

---

### Exemplo 2: Calculadora

```cpp
#include <iostream>
using namespace std;

// Protótipos
float somar(float a, float b);
float subtrair(float a, float b);
float multiplicar(float a, float b);
float dividir(float a, float b);
void mostrarMenu();

int main() {
    int opcao;
    float num1, num2, resultado;
    
    mostrarMenu();
    cin >> opcao;
    
    cout << "Digite o primeiro número: ";
    cin >> num1;
    cout << "Digite o segundo número: ";
    cin >> num2;
    
    if (opcao == 1) {
        resultado = somar(num1, num2);
    } else if (opcao == 2) {
        resultado = subtrair(num1, num2);
    } else if (opcao == 3) {
        resultado = multiplicar(num1, num2);
    } else if (opcao == 4) {
        resultado = dividir(num1, num2);
    } else {
        cout << "Opção inválida!" << endl;
        return 0;
    }
    
    cout << "Resultado: " << resultado << endl;
    return 0;
}

void mostrarMenu() {
    cout << "=== CALCULADORA ===" << endl;
    cout << "1 - Somar" << endl;
    cout << "2 - Subtrair" << endl;
    cout << "3 - Multiplicar" << endl;
    cout << "4 - Dividir" << endl;
    cout << "Escolha: ";
}

float somar(float a, float b) {
    return a + b;
}

float subtrair(float a, float b) {
    return a - b;
}

float multiplicar(float a, float b) {
    return a * b;
}

float dividir(float a, float b) {
    if (b == 0) {
        cout << "Erro: divisão por zero!" << endl;
        return 0;
    }
    return a / b;
}
```

---

### Exemplo 3: Sistema de Level Up

```cpp
#include <iostream>
using namespace std;

// Protótipos
int calcularXPNecessario(int nivel);
void levelUp(int &nivel, int &xp);
void mostrarStatus(int nivel, int xp);

int main() {
    int nivel = 1;
    int xp = 0;
    
    // Simula ganhar XP
    xp = 150;
    
    mostrarStatus(nivel, xp);
    
    // Verifica level up
    if (xp >= calcularXPNecessario(nivel)) {
        levelUp(nivel, xp);
        mostrarStatus(nivel, xp);
    }
    
    return 0;
}

int calcularXPNecessario(int nivel) {
    return nivel * 100;  // Cada nível precisa de 100*nivel XP
}

void levelUp(int &nivel, int &xp) {
    int xpNecessario = calcularXPNecessario(nivel);
    xp = xp - xpNecessario;
    nivel++;
    cout << "\n*** LEVEL UP! ***" << endl;
    cout << "Agora você é nível " << nivel << "!" << endl << endl;
}

void mostrarStatus(int nivel, int xp) {
    int xpNecessario = calcularXPNecessario(nivel);
    cout << "Nível: " << nivel << endl;
    cout << "XP: " << xp << "/" << xpNecessario << endl;
}
```

---

## PASSAGEM DE PARÂMETROS

### Por Valor (Cópia)

Cria uma cópia. Mudanças NÃO afetam a variável original.

```cpp
#include <iostream>
using namespace std;

void tentarModificar(int x) {
    x = 100;  // Modifica apenas a cópia
    cout << "Dentro da função: " << x << endl;
}

int main() {
    int numero = 10;
    tentarModificar(numero);
    cout << "Fora da função: " << numero << endl;
    return 0;
}
```

**Saída:**
```
Dentro da função: 100
Fora da função: 10
```

---

### Por Referência (&)

Trabalha com a variável original. Mudanças AFETAM o original.

```cpp
#include <iostream>
using namespace std;

void modificar(int &x) {  // & = referência
    x = 100;  // Modifica o original
    cout << "Dentro da função: " << x << endl;
}

int main() {
    int numero = 10;
    modificar(numero);
    cout << "Fora da função: " << numero << endl;
    return 0;
}
```

**Saída:**
```
Dentro da função: 100
Fora da função: 100
```

---

### Quando Usar Cada Um?

| Situação | Use |
|----------|-----|
| Apenas ler o valor | Por valor |
| Modificar o valor | Por referência `&` |
| Economizar memória (objetos grandes) | Por referência `&` |
| Múltiplos retornos | Por referência `&` |

---

### Exemplo: Trocar Valores

```cpp
#include <iostream>
using namespace std;

void trocar(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 5;
    int y = 10;
    
    cout << "Antes: x=" << x << " y=" << y << endl;
    trocar(x, y);
    cout << "Depois: x=" << x << " y=" << y << endl;
    
    return 0;
}
```

**Saída:**
```
Antes: x=5 y=10
Depois: x=10 y=5
```

---

## VALORES PADRÃO

Você pode dar valores padrão aos parâmetros.

```cpp
#include <iostream>
using namespace std;

void criarInimigo(int vida = 100, int ataque = 20) {
    cout << "Inimigo criado!" << endl;
    cout << "Vida: " << vida << endl;
    cout << "Ataque: " << ataque << endl << endl;
}

int main() {
    criarInimigo();           // Usa valores padrão: 100, 20
    criarInimigo(150);        // vida=150, ataque=20 (padrão)
    criarInimigo(200, 35);    // vida=200, ataque=35
    
    return 0;
}
```

**Saída:**
```
Inimigo criado!
Vida: 100
Ataque: 20

Inimigo criado!
Vida: 150
Ataque: 20

Inimigo criado!
Vida: 200
Ataque: 35
```

---

## SOBRECARGA DE FUNÇÕES (OVERLOAD)

Múltiplas funções com mesmo nome, mas parâmetros diferentes.

```cpp
#include <iostream>
using namespace std;

// Sobrecarga: mesmo nome, parâmetros diferentes
int somar(int a, int b) {
    return a + b;
}

float somar(float a, float b) {
    return a + b;
}

int somar(int a, int b, int c) {
    return a + b + c;
}

int main() {
    cout << somar(5, 3) << endl;           // Chama versão int
    cout << somar(5.5f, 3.2f) << endl;     // Chama versão float
    cout << somar(1, 2, 3) << endl;        // Chama versão com 3 parâmetros
    
    return 0;
}
```

**Saída:**
```
8
8.7
6
```

---

## ESCOPO DE VARIÁVEIS

### Variáveis Locais

Existem apenas dentro da função.

```cpp
#include <iostream>
using namespace std;

void funcao1() {
    int x = 10;  // Local de funcao1
    cout << "funcao1: " << x << endl;
}

void funcao2() {
    int x = 20;  // Local de funcao2 (diferente da outra)
    cout << "funcao2: " << x << endl;
}

int main() {
    funcao1();
    funcao2();
    // cout << x;  // ❌ ERRO! x não existe aqui
    return 0;
}
```

---

### Variáveis Globais

Existem em todo o programa. **Use com cuidado!**

```cpp
#include <iostream>
using namespace std;

int vidaGlobal = 100;  // Global

void receberDano(int dano) {
    vidaGlobal = vidaGlobal - dano;
}

void mostrarVida() {
    cout << "Vida: " << vidaGlobal << endl;
}

int main() {
    mostrarVida();
    receberDano(30);
    mostrarVida();
    return 0;
}
```

**⚠️ Evite globais!** Preferível passar como parâmetro.

---

## RECURSÃO

Função que chama ela mesma.

### Exemplo: Fatorial

```cpp
#include <iostream>
using namespace std;

int fatorial(int n) {
    if (n <= 1) {
        return 1;  // Caso base
    }
    return n * fatorial(n - 1);  // Chamada recursiva
}

int main() {
    cout << "5! = " << fatorial(5) << endl;
    return 0;
}
```

**Como funciona:**
```
fatorial(5)
= 5 * fatorial(4)
= 5 * 4 * fatorial(3)
= 5 * 4 * 3 * fatorial(2)
= 5 * 4 * 3 * 2 * fatorial(1)
= 5 * 4 * 3 * 2 * 1
= 120
```

---

## EXERCÍCIOS

### Exercício 1: Calculadora de Dano

Crie funções:
1. `int calcularDanoFisico(int ataque, int defesa)` - retorna ataque-defesa
2. `int calcularDanoMagico(int magia, int resistencia)` - retorna magia-resistencia
3. No main, teste ambas

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

int calcularDanoFisico(int ataque, int defesa);
int calcularDanoMagico(int magia, int resistencia);

int main() {
    int danoFisico = calcularDanoFisico(50, 20);
    int danoMagico = calcularDanoMagico(40, 15);
    
    cout << "Dano físico: " << danoFisico << endl;
    cout << "Dano mágico: " << danoMagico << endl;
    
    return 0;
}

int calcularDanoFisico(int ataque, int defesa) {
    int dano = ataque - defesa;
    return (dano > 0) ? dano : 0;
}

int calcularDanoMagico(int magia, int resistencia) {
    int dano = magia - resistencia;
    return (dano > 0) ? dano : 0;
}
```
</details>

---

### Exercício 2: Verificador de Par/Ímpar

Crie função:
1. `bool isPar(int numero)` - retorna true se par, false se ímpar
2. No main, peça um número e use a função

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

bool isPar(int numero);

int main() {
    int num;
    
    cout << "Digite um número: ";
    cin >> num;
    
    if (isPar(num)) {
        cout << num << " é PAR" << endl;
    } else {
        cout << num << " é ÍMPAR" << endl;
    }
    
    return 0;
}

bool isPar(int numero) {
    return numero % 2 == 0;
}
```
</details>

---

### Exercício 3: Aumentar Estatísticas

Crie função:
1. `void aumentarStats(int &forca, int &agilidade, int &inteligencia)` - aumenta cada em 10
2. Use referência para modificar os originais

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

void aumentarStats(int &forca, int &agilidade, int &inteligencia);

int main() {
    int forca = 20;
    int agilidade = 15;
    int inteligencia = 10;
    
    cout << "ANTES:" << endl;
    cout << "Força: " << forca << endl;
    cout << "Agilidade: " << agilidade << endl;
    cout << "Inteligência: " << inteligencia << endl;
    
    aumentarStats(forca, agilidade, inteligencia);
    
    cout << "\nDEPOIS:" << endl;
    cout << "Força: " << forca << endl;
    cout << "Agilidade: " << agilidade << endl;
    cout << "Inteligência: " << inteligencia << endl;
    
    return 0;
}

void aumentarStats(int &forca, int &agilidade, int &inteligencia) {
    forca += 10;
    agilidade += 10;
    inteligencia += 10;
}
```
</details>

---

### Exercício 4: Menu de RPG

Crie:
1. `void mostrarMenu()` - exibe opções
2. `void atacar()` - mostra "Você atacou!"
3. `void defender()` - mostra "Você defendeu!"
4. `void curar()` - mostra "Você se curou!"
5. No main, faça um loop com menu

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

void mostrarMenu();
void atacar();
void defender();
void curar();

int main() {
    int opcao = 0;
    
    while (opcao != 4) {
        mostrarMenu();
        cin >> opcao;
        
        if (opcao == 1) {
            atacar();
        } else if (opcao == 2) {
            defender();
        } else if (opcao == 3) {
            curar();
        } else if (opcao == 4) {
            cout << "Saindo..." << endl;
        } else {
            cout << "Opção inválida!" << endl;
        }
        
        cout << endl;
    }
    
    return 0;
}

void mostrarMenu() {
    cout << "=== COMBATE ===" << endl;
    cout << "1 - Atacar" << endl;
    cout << "2 - Defender" << endl;
    cout << "3 - Curar" << endl;
    cout << "4 - Fugir" << endl;
    cout << "Escolha: ";
}

void atacar() {
    cout << "Você atacou o inimigo!" << endl;
}

void defender() {
    cout << "Você assumiu posição defensiva!" << endl;
}

void curar() {
    cout << "Você usou uma poção de cura!" << endl;
}
```
</details>

---

### Exercício 5: Maior de Três Números

Crie função:
1. `int maior(int a, int b, int c)` - retorna o maior dos três
2. Teste com vários valores

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

int maior(int a, int b, int c);

int main() {
    cout << "Maior entre 5, 12, 8: " << maior(5, 12, 8) << endl;
    cout << "Maior entre 20, 15, 30: " << maior(20, 15, 30) << endl;
    cout << "Maior entre 7, 7, 3: " << maior(7, 7, 3) << endl;
    
    return 0;
}

int maior(int a, int b, int c) {
    int maiorValor = a;
    
    if (b > maiorValor) {
        maiorValor = b;
    }
    
    if (c > maiorValor) {
        maiorValor = c;
    }
    
    return maiorValor;
}
```
</details>

---

### Exercício 6: Fibonacci Recursivo

Crie função recursiva:
1. `int fibonacci(int n)` - retorna o n-ésimo número de Fibonacci
2. Sequência: 0, 1, 1, 2, 3, 5, 8, 13...

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

int fibonacci(int n);

int main() {
    cout << "Primeiros 10 números de Fibonacci:" << endl;
    
    for (int i = 0; i < 10; i++) {
        cout << fibonacci(i) << " ";
    }
    cout << endl;
    
    return 0;
}

int fibonacci(int n) {
    if (n <= 1) {
        return n;  // Caso base
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```
</details>

---

## RESUMO DO MÓDULO 3

### O Que Você Aprendeu

✅ **Estrutura de funções:**
- Tipo de retorno, nome, parâmetros
- void (sem retorno)
- return (com retorno)

✅ **Protótipos:**
- Declaração vs definição
- Organização do código

✅ **Parâmetros:**
- Por valor (cópia)
- Por referência (&) - modifica original
- Valores padrão

✅ **Conceitos avançados:**
- Sobrecarga (overload)
- Escopo (local vs global)
- Recursão

---

### Boas Práticas

✅ **Faça:**
- Funções pequenas e específicas
- Nomes descritivos (calcularDano, mostrarMenu)
- Use referência para modificar valores
- Documente funções complexas

❌ **Evite:**
- Funções com muitos parâmetros (>5)
- Variáveis globais
- Funções muito longas (>50 linhas)
- Nomes genéricos (func1, x, abc)

---

### Próximo Módulo

**Módulo 4: Arrays e Vetores**
- Arrays estáticos
- std::vector
- Manipulação de listas
- Inventários

---

## CHECKLIST DE DOMÍNIO

Marque quando conseguir fazer sem ajuda:

- [ ] Criar função void
- [ ] Criar função com retorno
- [ ] Passar parâmetros por valor
- [ ] Passar parâmetros por referência
- [ ] Usar protótipos
- [ ] Criar funções com valores padrão
- [ ] Fazer sobrecarga de funções
- [ ] Entender escopo de variáveis
- [ ] Resolver os 6 exercícios sem olhar respostas

**Quando marcar todos, você dominou o Módulo 3!**