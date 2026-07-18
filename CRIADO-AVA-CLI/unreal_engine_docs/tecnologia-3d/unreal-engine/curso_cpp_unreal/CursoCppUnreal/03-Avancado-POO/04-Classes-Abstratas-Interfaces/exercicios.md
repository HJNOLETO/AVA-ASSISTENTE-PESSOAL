# ✏️ Exercícios: Classes Abstratas e Interfaces

## 1. Exercícios de Fixação (Fácil)

1.  **Classe Abstrata:**
    Crie uma classe abstrata `FormaGeometrica` com um atributo `protected float area` e uma função virtual pura `virtual float calcular_area() = 0;`.

2.  **Herança de Abstrata:**
    Crie uma classe `Quadrado` que herde de `FormaGeometrica`. Implemente o construtor para receber o lado e a função `calcular_area()` para retornar o lado ao quadrado.

3.  **Interface:**
    Crie uma Interface (classe abstrata pura) chamada `IDestruivel` com uma função virtual pura `virtual void destruir() = 0;`.

4.  **Instanciação:**
    Qual classe você pode instanciar: `FormaGeometrica` ou `Quadrado`? Por quê?

## 2. Exercícios de Aplicação (Médio)

1.  **Implementação de Interface:**
    Crie uma classe `Barreira` que herde de `IDestruivel`. Implemente o método `destruir()` para imprimir "Barreira destruída com efeitos de partícula!". No `main`, crie um ponteiro para `IDestruivel` que aponte para um objeto `Barreira` e chame `destruir()`.

2.  **Herança Múltipla:**
    Crie uma classe `BauDestruivel` que herde de `Quadrado` e `IDestruivel`. Implemente o construtor para inicializar o lado do `Quadrado`. No `main`, crie um objeto `BauDestruivel` e chame `calcular_area()` e `destruir()`.

3.  **Vetor de Interfaces:**
    Crie um `std::vector<IDestruivel*>` e adicione um objeto `Barreira` e um objeto `BauDestruivel` (alocados dinamicamente). Itere sobre o vetor e chame `destruir()` em cada elemento. **Lembre-se de liberar a memória.**

## 3. Desafio (Difícil)

**Sistema de Notificação:**
Crie uma Interface `INotificavel` com uma função virtual pura `virtual void notificar(const std::string& mensagem) = 0;`.
Crie duas classes que implementem essa interface:
*   `NotificacaoEmail`: Implementa `notificar` para imprimir "E-mail enviado: [mensagem]".
*   `NotificacaoSMS`: Implementa `notificar` para imprimir "SMS enviado: [mensagem]".
Crie uma função `void enviar_notificacao(INotificavel* canal, const std::string& mensagem)` que chame o método `notificar` do canal.
No `main`, use a função `enviar_notificacao` para enviar a mesma mensagem para ambos os canais.

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
