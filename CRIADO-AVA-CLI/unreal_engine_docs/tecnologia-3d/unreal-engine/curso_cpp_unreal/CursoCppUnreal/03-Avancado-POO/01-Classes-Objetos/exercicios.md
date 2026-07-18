# ✏️ Exercícios: Classes e Objetos

## 1. Exercícios de Fixação (Fácil)

1.  **Definição de Classe:**
    Defina uma classe chamada `Item` com os seguintes membros públicos:
    *   Atributos: `std::string nome`, `int peso`.
    *   Método: `void usar()` que imprime "Item [nome] usado!".

2.  **Criação de Objeto:**
    No `main`, crie um objeto `Item` chamado `pocao`. Atribua "Poção de Cura" ao `nome` e 1 ao `peso`. Chame o método `usar()`.

3.  **Construtor:**
    Adicione um **construtor com parâmetros** à classe `Item` que receba o nome e o peso e os inicialize. Crie um novo objeto `Item` chamado `espada` usando este construtor (`"Espada Longa"`, `5`).

4.  **Ponteiro para Objeto:**
    Crie um ponteiro para `Item` chamado `ptr_item` e aloque um novo `Item` no Heap usando o construtor com parâmetros (`"Escudo de Madeira"`, `8`). Use o operador seta (`->`) para chamar o método `usar()`.

## 2. Exercícios de Aplicação (Médio)

1.  **Construtor e Destrutor:**
    Modifique a classe `Item` para incluir um **destrutor** que imprima "Item [nome] destruído, liberando recursos.". Crie um objeto `Item` na Stack e observe quando o destrutor é chamado.

2.  **Método com Lógica:**
    Adicione um método `bool pode_equipar(int forca_jogador)` à classe `Item`. O método deve retornar `true` se o `peso` do item for menor ou igual à `forca_jogador`, e `false` caso contrário. Teste o método no `main` com um jogador de força 10 e a `espada` (peso 5) e o `escudo` (peso 8).

3.  **Objeto como Membro:**
    Crie uma classe `Inventario` com um atributo público `Item slot_principal`. No `main`, crie um `Inventario` e inicialize o `slot_principal` com uma `Item` (ex: "Adaga", 2).

## 3. Desafio (Difícil)

**Simulação de Dano:**
Crie uma classe `Inimigo` com atributos `int vida` (inicializado para 100) e `std::string nome`.
Crie um método `void receber_dano(int dano)` que subtrai o dano da vida e imprime o status.
No `main`, crie um objeto `Inimigo` no Heap (`new Inimigo(...)`).
Crie uma função `void atacar_inimigo(Inimigo* alvo)` que chama o método `receber_dano` do alvo.
Chame `atacar_inimigo` e, em seguida, **libere a memória** do inimigo.

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
