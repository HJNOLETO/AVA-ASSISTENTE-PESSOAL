# 💡 Explicação da Solução: Sistema de Inventário Básico

Este projeto demonstrou a aplicação prática dos conceitos intermediários do C++ para criar um sistema de inventário funcional.

## Conceitos Aplicados

1.  **STL Containers (`std::vector` e `std::map`):**
    *   O `std::vector<std::string> inventario` foi usado para armazenar a lista de itens, aproveitando sua capacidade de crescimento dinâmico.
    *   O `std::map<std::string, int> dados_item` foi usado para armazenar os dados imutáveis (valor de ataque) de cada tipo de item, permitindo uma busca rápida pelo nome do item.

2.  **Funções e Modularidade:**
    *   O código foi dividido em funções (`adicionar_item`, `remover_item`, `calcular_ataque_total`) para melhorar a organização e a reutilização.

3.  **Passagem por Referência (`&`):**
    *   As funções `adicionar_item` e `remover_item` receberam o `inventario` como `std::vector<std::string>&`. Isso é crucial, pois permite que as funções modifiquem o vetor original no `main` sem precisar copiá-lo (o que seria ineficiente).

4.  **Passagem por Referência Constante (`const &`):**
    *   A função `calcular_ataque_total` recebeu o inventário e os dados como `const &`. Isso garante que:
        *   Não haja cópia dos containers (eficiência).
        *   A função não possa alterar os dados (segurança).

5.  **Algoritmos da STL (`std::find` e `vector::erase`):**
    *   A função `remover_item` usou `std::find` (do cabeçalho `<algorithm>`) para localizar o item a ser removido.
    *   Em seguida, usou o método `erase` do `std::vector` para remover o elemento na posição apontada pelo iterador.

## Código Chave: `calcular_ataque_total`

Esta função demonstra a iteração sobre um container e a busca em outro:

```cpp
int calcular_ataque_total(const vector<string>& inv, const map<string, int>& dados) {
    int ataque_total = 0;

    for (const string& item : inv) { // Itera sobre o inventário
        auto it = dados.find(item); // Busca o item no mapa

        if (it != dados.end()) {
            // it->second é o valor (ataque)
            ataque_total += it->second;
        }
    }
    return ataque_total;
}
```

Este projeto ilustra como a combinação de containers e a correta utilização de passagem por referência e referência constante são fundamentais para a criação de sistemas de jogo eficientes e seguros em C++.

---
[Próximo: Módulo 03 - Avançado-POO &raquo;](../../03-Avancado-POO/modulo.html)
