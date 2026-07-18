# ✏️ Exercícios: Tipos Unreal e Macros

## 1. Exercícios de Fixação (Fácil)

1.  **String Mutável:**
    Qual tipo de string da Unreal Engine é o equivalente mutável do `std::string` do C++ padrão?

2.  **String Localizada:**
    Qual tipo de string deve ser usado para texto que será exibido ao usuário (ex: UI, mensagens de erro), pois suporta localização (tradução)?

3.  **Macro de Variável:**
    Qual macro é usada para marcar uma variável C++ para o sistema de reflexão?

4.  **Especificador de Edição:**
    Qual especificador de `UPROPERTY` permite que a variável seja editada no painel de detalhes do editor?

## 2. Exercícios de Aplicação (Médio)

1.  **Container Unreal:**
    Como você declararia um array dinâmico de `int` usando o container da Unreal Engine?

2.  **UFUNCTION para Blueprint:**
    Escreva a assinatura de um método C++ chamado `Curar` que recebe um `float` chamado `Quantidade` e que pode ser chamado a partir de um Blueprint.

3.  **UPROPERTY Completo:**
    Escreva a declaração de uma variável `float` chamada `DanoCritico` que deve ser visível no editor, mas não editável, e que pode ser lida em Blueprints. A variável deve estar na categoria "Combate".

4.  **FName vs FString:**
    Qual tipo de string (`FName` ou `FString`) é mais eficiente para ser usado como identificador de um *socket* de animação, e por quê?

## 3. Desafio (Difícil)

**Estrutura de Dados para Blueprint:**
Crie uma estrutura C++ chamada `FItemData` que contenha:
*   Um `FName` chamado `ID_Item`.
*   Um `FText` chamado `NomeExibicao`.
*   Um `int` chamado `Peso`.
Marque a estrutura para que ela possa ser usada em Blueprints. Qual macro é obrigatória dentro do corpo da estrutura?

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
