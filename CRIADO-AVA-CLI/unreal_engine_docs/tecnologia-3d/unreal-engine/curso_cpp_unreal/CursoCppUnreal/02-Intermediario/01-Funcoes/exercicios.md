# ✏️ Exercícios: Funções

## 1. Exercícios de Fixação (Fácil)

1.  **Função Simples com Retorno:**
    Crie uma função chamada `converter_para_fahrenheit` que receba um `float` (temperatura em Celsius) e retorne um `float` (temperatura em Fahrenheit). Use a fórmula: $F = C \times 1.8 + 32$.

2.  **Função `void`:**
    Crie uma função chamada `imprimir_mensagem_de_boas_vindas` que receba uma `std::string` (nome do jogador) e imprima na tela "Bem-vindo(a) ao jogo, [Nome do Jogador]!". A função não deve retornar nada.

3.  **Escopo Local:**
    Qual será o valor da variável `x` após a execução do código?
    ```cpp
    int x = 5;
    void funcao_muda_x() {
        int x = 10;
    }
    // Chame funcao_muda_x() e imprima x
    ```

4.  **Protótipo:**
    Escreva o protótipo (declaração) de uma função chamada `verificar_colisao` que recebe dois parâmetros do tipo `float` e retorna um `bool`.

## 2. Exercícios de Aplicação (Médio)

1.  **Sobrecarga de Funções (Overload):**
    Crie duas versões da função `calcular_area`:
    *   Versão 1: Recebe um `float` (lado) e retorna a área de um quadrado.
    *   Versão 2: Recebe dois `float`s (largura e altura) e retorna a área de um retângulo.
    *   Teste ambas as funções no `main`.

2.  **Variável Estática:**
    Crie uma função chamada `gerar_id_unico` que não recebe parâmetros e retorna um `int`. Dentro da função, use uma variável `static int` inicializada em 1000. A cada chamada, a função deve incrementar e retornar o valor dessa variável estática. Simule a geração de 3 IDs.

3.  **Parâmetros Opcionais (Valor Padrão):**
    Crie uma função chamada `aplicar_buff` que recebe um `int` (vida) e um `int` (cura) com um **valor padrão** de 10. A função deve retornar a nova vida.
    *   Teste chamando a função apenas com a vida.
    *   Teste chamando a função com a vida e um valor de cura diferente (ex: 50).

## 3. Desafio (Difícil)

**Cálculo de XP com Condicional:**
Crie uma função chamada `calcular_xp` que receba um `int` (dano_causado) e um `bool` (is_boss).
*   Se `is_boss` for `true`, o XP retornado é o `dano_causado` multiplicado por 2.
*   Se `is_boss` for `false`, o XP retornado é o `dano_causado` dividido por 2 (divisão inteira).
*   Use a função para calcular o XP ganho ao causar 100 de dano em um inimigo normal e em um Boss.

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
