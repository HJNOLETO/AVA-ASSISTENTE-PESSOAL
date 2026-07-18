# Módulo 6 - Ponteiros e Referências
## FASE 2: PROGRAMAÇÃO ORIENTADA A OBJETOS (POO)

### Status: 📚 MATERIAL DE ESTUDO

---

## 1. O QUE SÃO PONTEIROS?

### Teoria

Um **Ponteiro** é uma variável que armazena o **endereço de memória** de outra variável. Em vez de armazenar um valor diretamente, ele armazena a localização (o "endereço") onde o valor real está guardado.

Ponteiros são cruciais em C++ para:
*   Gerenciamento de memória dinâmica (alocar e liberar memória manualmente).
*   Passagem de grandes estruturas de dados para funções de forma eficiente.
*   Implementação de estruturas de dados complexas (listas, árvores).
*   **No Unreal Engine:** Ponteiros são usados para referenciar objetos do mundo do jogo (`AActor*`, `UObject*`).

### Sintaxe e Operadores

| Operador | Nome | Significado | Exemplo |
|:---|:---|:---|:---|
| `*` | **Declaração** | Declara uma variável como ponteiro. | `int* ptr;` |
| `&` | **Endereço de** | Retorna o endereço de memória de uma variável. | `ptr = &variavel;` |
| `*` | **Desreferência** | Acessa o valor armazenado no endereço apontado. | `*ptr = 10;` |

### Exemplo Prático

```cpp
#include <iostream>
using namespace std;

int main() {
    int Vida = 100;
    int* ptrVida = &Vida; // Ponteiro para Vida
    
    cout << "Valor de Vida: " << Vida << endl;
    cout << "Endereço de Vida: " << &Vida << endl;
    cout << "Valor do Ponteiro (Endereço): " << ptrVida << endl;
    cout << "Valor apontado pelo Ponteiro: " << *ptrVida << endl;
    
    // Modificando o valor através do ponteiro
    *ptrVida = 50;
    
    cout << "\nNovo valor de Vida: " << Vida << endl; // Saída: 50
    
    return 0;
}
```

---

## 2. REFERÊNCIAS (`&`) VS PONTEIROS (`*`)

### Teoria

Uma **Referência** é um **apelido** para uma variável existente. Uma vez inicializada, a referência não pode ser alterada para referenciar outra variável.

| Característica | Ponteiro (`*`) | Referência (`&`) |
|:---|:---|:---|
| **Sintaxe** | Usa `*` para declarar e `*` para desreferenciar. | Usa `&` para declarar. Não precisa de desreferência. |
| **Endereço** | Pode ser nulo (`nullptr`). | Não pode ser nula (deve ser inicializada). |
| **Reatribuição** | Pode apontar para diferentes variáveis. | Não pode ser reatribuída (é um apelido fixo). |
| **Uso Comum** | Memória dinâmica, estruturas de dados. | Passagem de parâmetros para funções (passagem por referência). |

### Exemplo de Referência

```cpp
#include <iostream>
using namespace std;

void modificarPorReferencia(int& ref) {
    ref = 200; // Modifica a variável original
}

int main() {
    int Ataque = 10;
    int& refAtaque = Ataque; // refAtaque é um apelido para Ataque
    
    cout << "Ataque original: " << Ataque << endl; // 10
    
    refAtaque = 50; // Modifica Ataque através do apelido
    
    cout << "Ataque modificado: " << Ataque << endl; // 50
    
    modificarPorReferencia(Ataque);
    cout << "Ataque após função: " << Ataque << endl; // 200
    
    return 0;
}
```

---

## 3. MEMÓRIA DINÂMICA (`new` e `delete`)

### Teoria

A memória dinâmica (Heap) permite alocar memória em tempo de execução, e não em tempo de compilação. Isso é essencial quando o tamanho de um objeto não é conhecido de antemão (Ex: um array de tamanho variável).

*   **`new`:** Aloca memória no Heap e retorna o endereço (um ponteiro).
*   **`delete`:** Libera a memória alocada pelo `new`.

**⚠️ Regra de Ouro:** Para cada `new`, deve haver um `delete`. Se você esquecer o `delete`, ocorre um **vazamento de memória** (*memory leak*).

### Exemplo: Alocação e Liberação

```cpp
#include <iostream>
using namespace std;

int main() {
    // Aloca um inteiro no Heap e retorna o endereço para ptrXP
    int* ptrXP = new int; 
    
    *ptrXP = 500; // Atribui valor à memória alocada
    
    cout << "XP no Heap: " << *ptrXP << endl;
    
    // Libera a memória alocada
    delete ptrXP; 
    
    // O ponteiro ainda existe, mas aponta para uma memória inválida.
    // É uma boa prática definir o ponteiro como nullptr após a exclusão.
    ptrXP = nullptr; 
    
    // Se você tentar acessar *ptrXP agora, o programa pode falhar.
    
    return 0;
}
```

### Ponteiros e Classes (Operador `->`)

Quando um ponteiro aponta para um objeto de uma classe, usamos o operador **seta (`->`)** para acessar seus membros.

```cpp
class Item {
public:
    void Usar() { cout << "Item usado!" << endl; }
};

int main() {
    Item* ptrItem = new Item();
    
    // Equivalente a: (*ptrItem).Usar();
    ptrItem->Usar(); 
    
    delete ptrItem;
    return 0;
}
```

---

## 4. PONTEIROS NO UNREAL ENGINE

No Unreal Engine, o uso de ponteiros é ainda mais complexo devido ao sistema de *Garbage Collection* (Coleta de Lixo) do motor.

*   **`UObject*`:** Ponteiros para objetos que herdam de `UObject` (a maioria das classes da Unreal). O motor gerencia a vida desses objetos.
*   **`UPROPERTY()`:** Variáveis que são ponteiros para `UObject` **devem** ser marcadas com `UPROPERTY()` para que o *Garbage Collector* saiba que elas estão sendo referenciadas e não as destrua prematuramente.
*   **`TObjectPtr<T>`:** No C++ moderno da Unreal, `TObjectPtr<T>` é o tipo preferido para ponteiros para `UObject`, pois é mais seguro e se comporta como um ponteiro normal (`T*`) na maioria dos casos.

**Conclusão:** Embora você precise entender `new` e `delete` em C++ puro, no Unreal Engine, você usará principalmente ponteiros para `UObject` (`TObjectPtr<T>`) e deixará o motor gerenciar a memória.

---

## EXERCÍCIOS DE PONTEIROS

### Exercício 1: Troca de Valores com Ponteiros

Crie uma função `TrocarValores(int* a, int* b)` que receba dois ponteiros para inteiros e troque os valores que eles apontam.

1.  Declare dois inteiros no `main()`.
2.  Chame a função passando o endereço de cada um (`&variavel`).
3.  Mostre os valores antes e depois da chamada.

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

// Recebe ponteiros
void TrocarValores(int* a, int* b) {
    int temp = *a; // Armazena o valor apontado por a
    *a = *b;       // O valor de a recebe o valor de b
    *b = temp;     // O valor de b recebe o valor original de a
}

int main() {
    int x = 10;
    int y = 20;
    
    cout << "Antes: x=" << x << ", y=" << y << endl;
    
    // Passa os endereços de x e y
    TrocarValores(&x, &y); 
    
    cout << "Depois: x=" << x << ", y=" << y << endl;
    
    return 0;
}
```
</details>

---

### Exercício 2: Criação de Inimigo Dinâmico

Crie uma classe `Inimigo` com um método `void Atacar()`. No `main()`:

1.  Use `new` para criar um objeto `Inimigo` dinamicamente.
2.  Use o operador `->` para chamar o método `Atacar()`.
3.  Use `delete` para liberar a memória.

<details>
<summary>Ver Solução</summary>

```cpp
#include <iostream>
using namespace std;

class Inimigo {
public:
    Inimigo() { cout << "Inimigo spawnado!" << endl; }
    ~Inimigo() { cout << "Inimigo destruído!" << endl; }
    
    void Atacar() {
        cout << "O inimigo ataca o jogador!" << endl;
    }
};

int main() {
    // 1. Cria dinamicamente
    Inimigo* Goblin = new Inimigo(); 
    
    // 2. Chama o método
    Goblin->Atacar(); 
    
    // 3. Libera a memória
    delete Goblin; 
    Goblin = nullptr;
    
    return 0;
}
```
</details>

---

## RESUMO DO MÓDULO 6

### O Que Você Aprendeu

✅ **Ponteiros (`*`):** Variáveis que armazenam endereços de memória.  
✅ **Operadores:** `&` (endereço de) e `*` (desreferência).  
✅ **Referências (`&`):** Apelidos para variáveis existentes.  
✅ **Memória Dinâmica:** Uso de `new` e `delete` (e a importância do *Garbage Collector* da Unreal).  

### Próximo Passo

A FASE 2 (POO) está completa. O próximo módulo inicia a **FASE 3: UNREAL ENGINE ESPECÍFICO**, onde aplicaremos todos os conceitos de C++ e POO no contexto do motor.

**Próximo:** Módulo 7: Transição para Unreal
