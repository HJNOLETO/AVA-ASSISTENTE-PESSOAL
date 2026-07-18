# ✏️ Exercícios: Estruturas de Controle

## 1. Exercícios de Fixação (Fácil)

1.  **Condicional Simples:**
    Crie um programa que declare uma variável `moedas` com o valor 100. Use uma estrutura `if` para imprimir "Você pode comprar o item!" se `moedas` for maior ou igual a 50.

2.  **if-else-if:**
    Crie um programa que declare uma variável `nivel_jogador` com o valor 15. Use `if`, `else if` e `else` para imprimir:
    *   "Novato" se o nível for menor que 10.
    *   "Aventureiro" se o nível for entre 10 e 20 (inclusive).
    *   "Veterano" se o nível for maior que 20.

3.  **Loop `for`:**
    Escreva um loop `for` que imprima todos os números pares de 0 a 20 (inclusive).

4.  **Loop `while`:**
    Crie um loop `while` que simule a recarga de uma arma. A variável `balas` começa em 0 e deve ser incrementada até 10. Imprima o número de balas a cada passo.

5.  **Operador Ternário:**
    Use o operador ternário para atribuir a string "Atacar" à variável `acao` se `distancia` for menor que 5, e "Correr" caso contrário. Considere `distancia = 8`. Imprima `acao`.

## 2. Exercícios de Aplicação (Médio)

1.  **Máquina de Estado com `switch`:**
    Crie um programa que declare uma variável `estado_inimigo` (`int`) e use um `switch` para simular o comportamento:
    *   `case 0`: Imprima "Inimigo em estado Ocioso (Idle)".
    *   `case 1`: Imprima "Inimigo em estado de Patrulha (Patrol)".
    *   `case 2`: Imprima "Inimigo em estado de Ataque (Attack)".
    *   `default`: Imprima "Estado Desconhecido. Voltando para Idle."

2.  **Busca com `break`:**
    Simule a busca por um item raro em 10 caixas. Use um loop `for` e, se o item for encontrado na caixa de número 7, use `break` para parar a busca e imprima "Item Raro encontrado na caixa 7!".

3.  **Filtragem com `continue`:**
    Simule o processamento de 10 inimigos. Use um loop `for` e `continue` para pular o processamento dos inimigos de índice par (0, 2, 4, 6, 8). Para os inimigos de índice ímpar, imprima "Processando Inimigo [Índice]".

## 3. Desafio (Difícil)

**Validação de Entrada com `do-while`:**
Crie um programa que peça ao usuário para digitar um número de 1 a 10.
1.  Use um loop `do-while` para garantir que a entrada seja repetida **enquanto** o número digitado for menor que 1 ou maior que 10.
2.  Após a entrada válida, imprima "Número válido: [Número]".

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
