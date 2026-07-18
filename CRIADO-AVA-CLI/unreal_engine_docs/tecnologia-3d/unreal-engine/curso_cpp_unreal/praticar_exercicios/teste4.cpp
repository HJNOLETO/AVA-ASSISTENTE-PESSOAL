
/*
#include <iostream>

int main() {
    // std::cout << "Hello, world!" << std::endl;

    float preco;
    std::cout << "Digite o preço do livro: ";
    std::cin >> preco;

    // Verificar as condições e aplicar desconto apropriado
    if (preco <= 10.00) {
        std::cout << "O preço não tem desconto." << std::endl;
    } else if (preco > 10.00 && preco <= 50.00) {
        float desconto = 0.05 * preco;  // Calcular o desconto de 5%
        std::cout << "O preço do livro com desconto é: R$" << preco - desconto << std::endl;
    } else if (preco > 50.00) {
        float desconto = 0.10 * preco;  // Calcular o desconto de 10%
        std::cout << "O preço do livro com desconto é R$" << preco - desconto << std::endl;
    } else {
        std::cout << "Preço inválido." << std::endl;
    }

    return 0;
}


#include <iostream>

int main() {
    // Declarar variável
    float preco;
    // Digite o valor do produto
    std::cout << "Digite o valor do produto: " << std::endl;
    std::cin >> preco;

    if (preco <= 10.00) {
        std::cout << "O valor nao tem desconto: " << std::endl;
    } else if (preco > 10.00 && preco <= 50.00) {
        float desconto = 0.05 * preco;
        std::cout << "O preco do livro com desconto e: R$ " << preco - desconto << std::endl;
    } else if (preco > 50.00) {
        float desconto = 0.10 * preco;
        std::cout << "O preco do livro com desconto e: R$" << preco - desconto << std::endl;
    } else {
        std::cout << "Preco invalido." << std::endl;
    }
}

*/

#include <iostream>

int main() {
    int count;
    for (count = 0; count < 7; count += 2) {
        std::cout << "Iteracoes" << " :" << count << std::endl;

        if (count % 4 == 0) {
            std::cout << "Multiplo de 4: " << count << std::endl;
        }
    }

    return 0;
}