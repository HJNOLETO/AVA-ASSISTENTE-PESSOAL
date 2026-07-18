# ✏️ Exercícios: Setup e Conceitos

## 1. Exercícios de Fixação (Fácil)

1.  **Macro de Classe:**
    Qual macro C++ é obrigatória para que a Unreal Engine reconheça uma classe C++ como um tipo de objeto de jogo?

2.  **Classe Base:**
    Qual é a classe base para todos os objetos que podem ser colocados no mundo do jogo (nível)?

3.  **Sistema de Build:**
    Qual ferramenta a Unreal Engine usa para compilar projetos C++ em vez de sistemas padrão como CMake?

4.  **Propósito da Reflexão:**
    Cite um dos principais motivos pelos quais a Unreal Engine implementa seu próprio sistema de Reflexão.

## 2. Exercícios de Aplicação (Médio)

1.  **Acesso a Blueprints:**
    Qual macro deve ser usada em um método C++ para que ele possa ser chamado diretamente de um Blueprint?

2.  **Ponteiros Rastreáveis:**
    Em vez de usar um ponteiro C++ bruto (`*`) para um objeto `UObject`, qual tipo de ponteiro a Unreal recomenda para garantir que o Garbage Collector possa rastreá-lo?

3.  **Herança de Componente:**
    Se você está criando um componente que será anexado a um `AActor` (ex: um componente de saúde), de qual classe base ele deve herdar?

4.  **Ciclo de Vida:**
    Qual função virtual da classe base `AActor` é tipicamente sobrescrita para inicializar a lógica do jogo quando o objeto é colocado no mundo e o jogo começa?

## 3. Desafio (Difícil)

**Vazamento de Memória (Conceitual):**
Explique por que usar `new` e `delete` para gerenciar a vida útil de um objeto que herda de `UObject` é uma má prática e pode levar a problemas de memória na Unreal Engine. Qual é a alternativa recomendada para a criação de objetos `UObject` em tempo de execução?

---
[Próximo: Soluções dos Exercícios &raquo;](exercicios-resolvidos.cpp)
