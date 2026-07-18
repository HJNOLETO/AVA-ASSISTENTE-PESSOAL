# 💡 Explicação da Solução: Sistema de Habilidades Polimórficas

Este projeto demonstrou a aplicação completa dos pilares da Programação Orientada a Objetos (POO) para criar um sistema de habilidades flexível e extensível.

## Conceitos Aplicados

1.  **Abstração e Classes Abstratas:**
    *   A classe `Habilidade` é abstrata (devido à Função Virtual Pura `usar() = 0;`), definindo o contrato básico de uma habilidade: ter um custo de mana e poder ser usada em um alvo.
    *   Não é possível instanciar `Habilidade`, forçando o uso de classes concretas (como `BolaDeFogo`).

2.  **Herança:**
    *   `BolaDeFogo` e `AtaqueFisico` herdam de `Habilidade`, reutilizando o atributo `custo_mana` (acessível via `protected`) e o método `get_custo()`.

3.  **Encapsulamento:**
    *   O atributo `custo_mana` é `protected`, permitindo o acesso apenas às classes derivadas, mas escondendo-o do código externo. O acesso de leitura é fornecido pelo `public` Getter `get_custo()`.
    *   O `nome` do `Personagem` é `private`, acessível apenas pelo `public` Getter `get_nome()`.

4.  **Polimorfismo:**
    *   O vetor `std::vector<Habilidade*>` armazena ponteiros da classe base, mas aponta para objetos das classes derivadas.
    *   A chamada `habilidade->usar(inimigo)` é polimórfica: o C++ determina em tempo de execução qual versão do método `usar()` deve ser executada (a de `BolaDeFogo` ou a de `AtaqueFisico`), garantindo a flexibilidade do sistema.

5.  **Destrutor Virtual:**
    *   O `virtual ~Habilidade() {}` na classe base é essencial. Ao deletar um objeto derivado através de um ponteiro da base (`delete habilidade;`), o destrutor virtual garante que o destrutor da classe derivada (`~BolaDeFogo()`) seja chamado primeiro, seguido pelo destrutor da base, prevenindo vazamentos de memória.

## Código Chave: O Loop Polimórfico

```cpp
for (Habilidade* habilidade : habilidades) {
    // A chamada é a mesma, mas o resultado é diferente (polimorfismo)
    habilidade->usar(inimigo);
    cout << "  Custo de Mana: " << habilidade->get_custo() << endl;
}
```

Este projeto ilustra como a POO permite criar sistemas de jogo onde novas habilidades podem ser adicionadas simplesmente criando novas classes que herdam de `Habilidade`, sem a necessidade de modificar o código principal do sistema.

---
[Próximo: Módulo 04 - Prática-Unreal &raquo;](../../04-Pratica-Unreal/modulo.html)
