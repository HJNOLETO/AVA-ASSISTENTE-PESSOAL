# ✏️ Exercícios: STL Containers

## 1. Exercícios de Fixação (Fácil)

1.  **`std::vector`:**
    Declare um `std::vector<float>` chamado `posicoes_x`. Adicione os valores `10.0f`, `20.5f` e `30.0f`. Imprima o tamanho do vetor e o valor do segundo elemento (índice 1).

2.  **`std::map`:**
    Declare um `std::map<int, std::string>` chamado `codigos_status`. Adicione os pares: `(200, "OK")` e `(404, "Não Encontrado")`. Imprima a string associada à chave `200`.

3.  **`std::stack`:**
    Crie um `std::stack<char>` para simular o histórico de estados de um jogo. Adicione os estados 'A', 'B', 'C'. Qual estado está no topo? Remova-o e diga qual é o novo topo.

4.  **`std::queue`:**
    Crie um `std::queue<std::string>` para simular uma fila de jogadores. Adicione "Player1", "Player2", "Player3". Qual jogador está na frente da fila?

## 2. Exercícios de Aplicação (Médio)

1.  **Iteração em `std::vector`:**
    Dado o `std::vector<int> danos = {5, 10, 15, 20};`, use um *range-based for loop* para iterar sobre o vetor e imprimir cada elemento. Em seguida, use um loop tradicional para dobrar o valor de cada elemento no vetor.

2.  **Busca e Inserção em `std::map`:**
    No `std::map<std::string, int> inventario` do exercício de fixação 2, verifique se a chave "Poção" existe. Se não existir, insira o par `("Poção", 3)`. Imprima o valor final de "Poção".

3.  **`std::vector` de Objetos:**
    (Conceitual) Se você tivesse uma classe `Inimigo`, como você declararia um vetor para armazenar 50 objetos `Inimigo`? Qual seria a vantagem de usar `std::vector<Inimigo>` em vez de um array estático `Inimigo inimigos[50]`?

## 3. Desafio (Difícil)

**Sistema de Desfazer (Undo System):**
Use um `std::stack<std::string>` para simular um sistema de desfazer.
1.  Adicione as ações: "Mover", "Atacar", "Abrir Inventário".
2.  Crie uma função `desfazer_acao` que:
    *   Verifique se a pilha não está vazia.
    *   Se não estiver, imprima a ação que está sendo desfeita (o topo).
    *   Remova a ação do topo.
    *   Se estiver vazia, imprima "Não há mais ações para desfazer.".
3.  Chame a função até que a pilha esteja vazia.

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
