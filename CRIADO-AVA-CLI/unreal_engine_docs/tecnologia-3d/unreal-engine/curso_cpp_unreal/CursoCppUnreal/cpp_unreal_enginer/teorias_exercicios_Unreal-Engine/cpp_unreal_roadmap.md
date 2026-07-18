# Roadmap C++ para Unreal Engine - Guia de Estudo

## Como Usar Este Documento

**Copie e cole a pergunta do módulo atual para o Claude:**
- Exemplo: "Módulo 2.1 - Explique condicionais if/else com exemplo de jogo"
- Peça exercícios: "Módulo 2.1 - Me dê 3 exercícios práticos"
- Peça resolução: "Módulo 2.1 - Resolva o exercício 2 comentando cada linha"

---

## FASE 1: FUNDAMENTOS C++ (Onde você está agora)

### ✅ Módulo 1: Variáveis e Tipos Básicos
**Status:** CONCLUÍDO
- [x] int, float, string, bool
- [x] cout e cin
- [x] Operações básicas (+, -, *, /)

### 📍 Módulo 2: Lógica de Programação
**Status:** PRÓXIMO
**Perguntas para fazer:**

#### 2.1 Condicionais
- "Módulo 2.1 - Explique if/else com exemplo de sistema de vida em jogo"
- "Módulo 2.1 - 3 exercícios de if/else para jogos"

#### 2.2 Loops
- "Módulo 2.2 - Explique for loop com exemplo de inventário"
- "Módulo 2.2 - Explique while loop com exemplo de combate"
- "Módulo 2.2 - 3 exercícios de loops"

#### 2.3 Funções
- "Módulo 2.3 - Explique funções com parâmetros e retorno"
- "Módulo 2.3 - Exemplo de função CalcularDano(ataque, defesa)"
- "Módulo 2.3 - 3 exercícios de funções"

### Módulo 3: Arrays e Vetores
**Perguntas para fazer:**
- "Módulo 3 - Arrays básicos em C++"
- "Módulo 3 - std::vector e quando usar"
- "Módulo 3 - Exercícios de inventário com arrays"

---

## FASE 2: PROGRAMAÇÃO ORIENTADA A OBJETOS (POO)

### Módulo 4: Introdução a Classes
**Perguntas para fazer:**
- "Módulo 4.1 - O que é uma classe? Crie exemplo classe Personagem"
- "Módulo 4.2 - Atributos (variáveis membros) e métodos (funções membros)"
- "Módulo 4.3 - Public vs Private - quando usar cada um"
- "Módulo 4.4 - Construtor e Destrutor"
- "Módulo 4.5 - Exercício: classe Arma com dano, durabilidade"

### Módulo 5: Conceitos Intermediários POO
**Perguntas para fazer:**
- "Módulo 5.1 - Herança: classe Inimigo herda de Personagem"
- "Módulo 5.2 - Encapsulamento: getters e setters"
- "Módulo 5.3 - Polimorfismo básico com virtual"
- "Módulo 5.4 - Exercício: sistema de classes (Guerreiro, Mago, Arqueiro)"

### Módulo 6: Ponteiros e Referências
**Perguntas para fazer:**
- "Módulo 6.1 - O que são ponteiros? Exemplo prático"
- "Módulo 6.2 - Referências (&) vs Ponteiros (*)"
- "Módulo 6.3 - new e delete (memória dinâmica)"
- "Módulo 6.4 - Exercícios de ponteiros"

---

## FASE 3: UNREAL ENGINE ESPECÍFICO

### Módulo 7: Transição para Unreal
**Perguntas para fazer:**
- "Módulo 7.1 - Diferenças entre C++ puro e C++ da Unreal"
- "Módulo 7.2 - Headers essenciais: CoreMinimal.h, GameFramework/Actor.h"
- "Módulo 7.3 - Namespaces: std vs UE"
- "Módulo 7.4 - Tipos da Unreal: int32, FString, FVector, FRotator"

### Módulo 8: Classes Base da Unreal
**Perguntas para fazer:**
- "Módulo 8.1 - AActor: o que é e como usar"
- "Módulo 8.2 - APawn e ACharacter"
- "Módulo 8.3 - UActorComponent"
- "Módulo 8.4 - Hierarquia de classes da Unreal (diagrama)"

### Módulo 9: Sistema de Componentes
**Perguntas para fazer:**
- "Módulo 9.1 - UStaticMeshComponent"
- "Módulo 9.2 - USceneComponent"
- "Módulo 9.3 - Anexar componentes (AttachToComponent)"
- "Módulo 9.4 - Exercício: criar Actor com múltiplos componentes"

### Módulo 10: Funções Principais da Unreal
**Perguntas para fazer:**
- "Módulo 10.1 - BeginPlay(): quando e como usar"
- "Módulo 10.2 - Tick(DeltaTime): movimento frame a frame"
- "Módulo 10.3 - GetActorLocation, SetActorLocation"
- "Módulo 10.4 - Exercício: plataforma móvel simples"

### Módulo 11: Matemática para Jogos
**Perguntas para fazer:**
- "Módulo 11.1 - FVector: posição e direção"
- "Módulo 11.2 - FRotator: rotação"
- "Módulo 11.3 - FVector::Distance, GetSafeNormal"
- "Módulo 11.4 - DeltaTime: movimento independente de framerate"
- "Módulo 11.5 - Exercício: objeto que segue player"

### Módulo 12: Especificadores UPROPERTY e UFUNCTION
**Perguntas para fazer:**
- "Módulo 12.1 - UPROPERTY(EditAnywhere) - expor no editor"
- "Módulo 12.2 - UPROPERTY(VisibleAnywhere) - apenas visualizar"
- "Módulo 12.3 - UFUNCTION(BlueprintCallable)"
- "Módulo 12.4 - Protected vs Private na Unreal"

---

## FASE 4: PROJETO PRÁTICO

### Módulo 13: Análise do Código AMovingPlatform
**Perguntas para fazer:**
- "Módulo 13.1 - Explique linha por linha o código AMovingPlatform::Tick"
- "Módulo 13.2 - Por que usar Super::Tick(DeltaTime)?"
- "Módulo 13.3 - Como funciona a inversão de direção (PlatformVelocity = -PlatformVelocity)"
- "Módulo 13.4 - Exercício: adicionar rotação à plataforma"

### Módulo 14: Variações do Projeto
**Perguntas para fazer:**
- "Módulo 14.1 - Fazer plataforma parar por 2 segundos ao chegar no fim"
- "Módulo 14.2 - Fazer plataforma se mover em círculo"
- "Módulo 14.3 - Fazer plataforma acelerar/desacelerar suavemente"

---

## EXERCÍCIOS RÁPIDOS POR MÓDULO

### Como Pedir Exercícios:
```
"Módulo [número] - Me dê 5 exercícios progressivos (fácil → difícil)"
"Módulo [número] - Resolva o exercício 3 comentando cada linha"
"Módulo [número] - Corrija meu código: [cole seu código]"
```

---

## TEORIA E FUNDAMENTOS

### Perguntas Conceituais Importantes:
- "Explique o conceito de POO em 3 parágrafos práticos"
- "Diferença entre passar por valor vs por referência"
- "Por que DeltaTime é importante em jogos?"
- "O que é garbage collection e por que C++ não tem?"
- "Como funciona a hierarquia de classes na Unreal?"
- "Explique o padrão de design Component Pattern"

---

## DICAS DE USO EFICIENTE

### ✅ Perguntas Eficientes:
- "Módulo X - conceito + exemplo + exercício"
- "Corrija e explique este código: [código]"
- "Compare [conceito A] vs [conceito B] com exemplos"

### ❌ Evite Perguntas Vagas:
- "Me ensine tudo sobre C++"
- "Explique programação"
- "Como fazer jogos?"

---

## CHECKLIST DE PROGRESSO

Marque conforme avança:

**FASE 1: Fundamentos**
- [x] Variáveis básicas
- [ ] Condicionais
- [ ] Loops
- [ ] Funções
- [ ] Arrays

**FASE 2: POO**
- [ ] Classes básicas
- [ ] Public/Private
- [ ] Herança
- [ ] Ponteiros

**FASE 3: Unreal**
- [ ] Tipos da Unreal
- [ ] AActor
- [ ] Componentes
- [ ] BeginPlay/Tick
- [ ] FVector/FRotator
- [ ] UPROPERTY/UFUNCTION

**FASE 4: Projeto**
- [ ] Analisar AMovingPlatform
- [ ] Criar variações
- [ ] Projeto próprio

---

## EXEMPLO DE SESSÃO DE ESTUDO

```
Você: "Módulo 2.1 - Explique if/else com exemplo de sistema de vida"
Claude: [explicação + código + exemplo]

Você: "Módulo 2.1 - 3 exercícios práticos"
Claude: [3 exercícios progressivos]

Você: [resolve exercício 2]
Claude: [feedback + correções]

Você: "Módulo 2.2 - Próximo tópico"
```

---

## STATUS ATUAL

**Você está em:** Módulo 1 ✅ CONCLUÍDO
**Próximo:** Módulo 2.1 - Condicionais

**Para continuar, pergunte:**
"Módulo 2.1 - Explique if/else com exemplo de sistema de vida em jogo e me dê 3 exercícios"