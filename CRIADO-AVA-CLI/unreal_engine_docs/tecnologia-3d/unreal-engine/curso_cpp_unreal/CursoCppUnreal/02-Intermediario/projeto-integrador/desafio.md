# 🎯 Projeto Integrador 2: Sistema de Inventário Básico

## Desafio: Criar um Sistema de Inventário Simples

Este projeto integrador consolidará os conceitos aprendidos no Módulo 02: **Funções, Ponteiros, Memória Dinâmica e STL Containers**.

Você deve criar um programa C++ que simule um sistema de inventário de jogo, usando `std::vector` e `std::map` para gerenciar itens.

### Requisitos

1.  **Estrutura de Dados:**
    *   Use um `std::vector<std::string>` chamado `inventario` para armazenar os nomes dos itens.
    *   Use um `std::map<std::string, int>` chamado `dados_item` para armazenar o valor de ataque de cada item (Chave: Nome do Item, Valor: Ataque).

2.  **Funções:**
    *   **`void adicionar_item(std::vector<std::string>& inv, const std::string& nome_item)`:** Recebe o inventário **por referência** e o nome do item. Adiciona o item ao vetor.
    *   **`void remover_item(std::vector<std::string>& inv, const std::string& nome_item)`:** Recebe o inventário **por referência** e o nome do item. Remove a **primeira** ocorrência do item do vetor.
    *   **`int calcular_ataque_total(const std::vector<std::string>& inv, const std::map<std::string, int>& dados)`:** Recebe o inventário e os dados **por referência constante** (`const &`). Calcula e retorna a soma dos valores de ataque de todos os itens no inventário.

3.  **Lógica Principal:**
    *   Inicialize o `dados_item` com pelo menos 3 itens (ex: "Espada" - 10, "Machado" - 15, "Poção" - 0).
    *   Adicione alguns itens ao inventário.
    *   Imprima o inventário atual.
    *   Calcule e imprima o ataque total.
    *   Remova um item.
    *   Calcule e imprima o novo ataque total.

### Dicas

*   Use `std::find` (do cabeçalho `<algorithm>`) para encontrar a posição do item a ser removido.
*   Use `vector.erase()` para remover o item.
*   A passagem por referência (`&`) é crucial para que as funções modifiquem o inventário original.
*   A passagem por referência constante (`const &`) é ideal para `calcular_ataque_total`, pois evita a cópia de grandes estruturas de dados e garante que a função não as altere.

---
[Próximo: Solução do Projeto Integrador &raquo;](solucao.cpp)
