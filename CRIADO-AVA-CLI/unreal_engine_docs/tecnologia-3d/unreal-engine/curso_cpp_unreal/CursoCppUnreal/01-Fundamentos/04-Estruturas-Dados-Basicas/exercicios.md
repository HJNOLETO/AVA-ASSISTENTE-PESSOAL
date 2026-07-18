# ✏️ Exercícios: Arrays e Strings

## 1. Exercícios de Fixação (Fácil)

1.  **Declaração de Array:**
    Declare um array de `float` chamado `posicao_z` com 5 elementos. Inicialize-o com os valores `0.0f, 10.5f, 5.2f, 20.0f, 1.1f`.

2.  **Acesso a Array:**
    No array `posicao_z` do exercício anterior, imprima o valor do **terceiro** elemento. Em seguida, altere o valor do **último** elemento para `99.9f` e imprima o novo valor.

3.  **Iteração Simples:**
    Use um loop `for` para percorrer o array `posicao_z` e imprimir todos os seus elementos.

4.  **Concatenação de String:**
    Declare duas `std::string`: `primeiro_nome = "Jaina"` e `sobrenome = "Proudmoore"`. Crie uma terceira string `nome_completo` que seja a concatenação das duas, separadas por um espaço. Imprima `nome_completo`.

5.  **Tamanho da String:**
    Imprima o tamanho (número de caracteres) da string `nome_completo` criada no exercício anterior.

## 2. Exercícios de Aplicação (Médio)

1.  **Cálculo de Média de Dano:**
    Dado o array `int danos[] = {15, 22, 18, 30, 12}`, use um loop `for` para calcular a soma total dos danos e, em seguida, a média de dano. Imprima a média (como `float`).

2.  **Busca em Array:**
    No array `int codigos_erro[] = {404, 500, 200, 403, 503}`, use um loop `for` para verificar se o código de erro `200` está presente. Se estiver, imprima "Sucesso!" e use `break` para parar o loop.

3.  **Manipulação de String (Substituição):**
    Dada a string `std::string log = "ERRO: O jogador Player1 tentou usar um item invalido."`, use a função `find` para localizar a palavra "ERRO" e a função `replace` para substituí-la por "AVISO". Imprima a string resultante.

## 3. Desafio (Difícil)

**Inversão de String:**
Dada a string `std::string palavra = "Unreal"`, use um loop `for` para criar uma nova string `palavra_invertida` que contenha os caracteres de `palavra` na ordem inversa. Imprima a string invertida.
*   *Dica: Comece o loop do final da string e use o método `push_back()` para adicionar caracteres à nova string.*

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
