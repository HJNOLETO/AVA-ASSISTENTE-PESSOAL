#include <iostream>

int main() {
    int a, b, c;

    std::cout << "Digite os valores de A, B e C" << " :";
    std::cin >> a >> b >> c;

    if (a > b) {
        // std::cout << "A is bigger than B" << std::endl;
        std::cout << "A letra A e o maior numero" << " :" << a << std::endl;
    } else if (b > c) {
        // std::cout << "B is bigger than C" << std::endl;
        std::cout << "A letra B e o maior numero" << " :" << b << std::endl;
    } else if (c > a) {
        // std::cout << "C is bigger than A" << std::endl;
        std::cout << "A letra C e o maior numero" << " :" << c << std::endl;
    } else {
        std::cout << "All numbers are equal" << std::endl;
    }

    return 0;
}