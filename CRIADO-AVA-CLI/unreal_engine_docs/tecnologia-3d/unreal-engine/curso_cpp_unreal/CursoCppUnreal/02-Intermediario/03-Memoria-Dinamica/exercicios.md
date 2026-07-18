# ✏️ Exercícios: Memória Dinâmica

## 1. Exercícios de Fixação (Fácil)

1.  **Alocação e Desalocação Simples:**
    Alocar memória no Heap para um único `float` chamado `ptr_velocidade`. Atribua o valor `10.5f` a ele e, em seguida, libere a memória.

2.  **Alocação de Array:**
    Alocar memória no Heap para um array de 10 `int`s chamado `ptr_pontuacoes`. Atribua o valor 100 ao primeiro elemento (`ptr_pontuacoes[0]`). Libere a memória.

3.  **Vazamento de Memória:**
    Explique o que é um **vazamento de memória** e como ele ocorre no contexto de `new` e `delete`.

4.  **Smart Pointer:**
    Qual Smart Pointer garante que apenas um ponteiro possa possuir o recurso alocado, sendo ideal para recursos com um único proprietário?

## 2. Exercícios de Aplicação (Médio)

1.  **Função com Alocação Manual:**
    Crie uma função chamada `criar_inteiro_dinamico` que aloque um `int` no Heap, atribua o valor 42 a ele e **retorne o ponteiro bruto** (`int*`). No `main`, chame a função, use o valor e **certifique-se de deletar a memória**.

2.  **`unique_ptr` e Movimentação:**
    Crie um `std::unique_ptr<string>` chamado `arma_principal` com o valor "Arco Longo". Crie um segundo `unique_ptr<string>` chamado `arma_secundaria` e use `std::move` para transferir a propriedade de `arma_principal` para `arma_secundaria`. Imprima o valor de `arma_secundaria` e verifique se `arma_principal` é nulo.

3.  **`shared_ptr` e Contagem:**
    Crie um `std::shared_ptr<int>` chamado `recurso_compartilhado` com o valor 99. Crie mais dois `shared_ptr` que apontem para o mesmo recurso. Imprima a contagem de referência (`use_count()`) do recurso.

## 3. Desafio (Difícil)

**Simulação de Recurso de Jogo:**
Crie uma classe simples chamada `Recurso` com um construtor e um destrutor que imprimam mensagens (ex: "Recurso criado" e "Recurso destruído").
1.  No `main`, crie um bloco de escopo (`{ ... }`).
2.  Dentro do bloco, crie um `std::unique_ptr<Recurso>`.
3.  Observe a saída. O que acontece quando o `unique_ptr` sai do escopo? Explique como isso resolve o problema de vazamento de memória.

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
