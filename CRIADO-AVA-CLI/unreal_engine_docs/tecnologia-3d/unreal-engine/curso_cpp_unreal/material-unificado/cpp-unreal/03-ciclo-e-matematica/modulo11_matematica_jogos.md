# Módulo 11 - Matemática para Jogos
## FASE 3: UNREAL ENGINE ESPECÍFICO

### Status: 📚 MATERIAL DE ESTUDO

---

## 1. `FVector`: POSIÇÃO E DIREÇÃO

### Teoria

O **`FVector`** é um *struct* fundamental na Unreal Engine. Ele representa um vetor 3D, que é usado para três propósitos principais:

1.  **Posição:** Onde um objeto está no mundo (coordenadas X, Y, Z).
2.  **Direção:** Para onde um objeto está apontando ou se movendo.
3.  **Escala:** O tamanho de um objeto.

### Operações Básicas

O `FVector` sobrecarrega operadores C++ (Módulo 5 - Polimorfismo) para facilitar a matemática:

| Operação | Exemplo | Resultado |
|:---|:---|:---|
| **Soma** | `FVector A + FVector B` | Move o ponto A na direção e distância de B. |
| **Subtração** | `FVector A - FVector B` | Retorna o vetor de B para A (direção e distância). |
| **Multiplicação** | `FVector A * float Escala` | Aumenta o comprimento do vetor A. |

### Funções Essenciais

| Função | Descrição |
|:---|:---|
| **`FVector::Distance(A, B)`** | Função estática que calcula a distância euclidiana entre dois pontos A e B. |
| **`FVector::Size()`** | Retorna o comprimento (magnitude) do vetor. |
| **`FVector::GetSafeNormal()`** | Retorna a versão **normalizada** do vetor (comprimento 1.0), representando apenas a **direção**. |

### Exemplo: Normalização

```cpp
FVector Velocidade = FVector(100.0f, 0.0f, 0.0f); // Comprimento 100
FVector Direcao = Velocidade.GetSafeNormal();    // Comprimento 1.0 (apenas direção)
```

---

## 2. `FRotator`: ROTAÇÃO

### Teoria

O **`FRotator`** é um *struct* que representa a rotação de um objeto no espaço 3D, usando três eixos:

*   **Pitch (Arfagem):** Rotação em torno do eixo Y (inclinação para cima/baixo).
*   **Yaw (Guinada):** Rotação em torno do eixo Z (rotação horizontal).
*   **Roll (Rolagem):** Rotação em torno do eixo X (inclinação lateral).

### Operações

A rotação é geralmente aplicada de forma incremental, somando um `FRotator` de velocidade ao `FRotator` atual.

```cpp
FRotator RotacaoAtual = GetActorRotation();
FRotator VelocidadeRotacao = FRotator(0.0f, 90.0f, 0.0f); // 90 graus/segundo no Yaw

RotacaoAtual += VelocidadeRotacao * DeltaTime; // Aplica a rotação
SetActorRotation(RotacaoAtual);
```

---

## 3. `DeltaTime`: MOVIMENTO INDEPENDENTE DE FRAMERATE

### Teoria

O **`DeltaTime`** (Módulo 10) é o tempo decorrido desde o último *frame*. Ele é a chave para o movimento consistente em jogos.

**Por que é crucial?**

Se você mover um objeto em 10 unidades por *frame* (sem `DeltaTime`):
*   Em 60 FPS: O objeto se move 600 unidades por segundo.
*   Em 30 FPS: O objeto se move 300 unidades por segundo.

O movimento seria mais rápido em computadores mais rápidos.

Ao usar `DeltaTime`:
*   **Movimento = Velocidade * DeltaTime**
*   Se a velocidade for 100 unidades/segundo, o movimento será sempre 100 unidades/segundo, independentemente do FPS.

---

## EXERCÍCIO: OBJETO QUE SEGUE PLAYER

### Exercício 1: Seguir um Alvo

Crie a lógica para um `AActor` (Ex: `AInimigoSeguidor`) que se move em direção a um alvo (Ex: o jogador).

1.  **Variáveis:**
    *   `AActor* TargetActor` (o alvo a ser seguido).
    *   `float MoveSpeed` (velocidade de movimento).
2.  **Lógica no `Tick()`:**
    *   Obtenha a posição do Inimigo (`P_Inimigo`) e do Alvo (`P_Alvo`).
    *   Calcule o vetor de **Direção** do Inimigo para o Alvo: `Direcao = P_Alvo - P_Inimigo`.
    *   **Normalize** a direção: `Direcao.Normalize()`.
    *   Calcule o deslocamento: `Deslocamento = Direcao * MoveSpeed * DeltaTime`.
    *   Aplique o movimento: `P_Inimigo += Deslocamento`.
    *   Use `SetActorLocation()` para mover o Inimigo.

<details>
<summary>Ver Solução (Lógica no Tick)</summary>

```cpp
// AInimigoSeguidor.cpp

void AInimigoSeguidor::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    if (TargetActor)
    {
        // 1. Obter Posições
        FVector P_Inimigo = GetActorLocation();
        FVector P_Alvo = TargetActor->GetActorLocation();

        // 2. Calcular Vetor de Direção (do Inimigo para o Alvo)
        FVector Direcao = P_Alvo - P_Inimigo;

        // 3. Normalizar (obter apenas a direção, tamanho 1.0)
        Direcao.Normalize(); 

        // 4. Calcular Deslocamento (Velocidade * Direção * Tempo)
        float MoveSpeed = 300.0f; // Exemplo
        FVector Deslocamento = Direcao * MoveSpeed * DeltaTime;

        // 5. Aplicar o movimento
        P_Inimigo += Deslocamento;
        SetActorLocation(P_Inimigo);
    }
}
```
</details>

---

## RESUMO DO MÓDULO 11

### O Que Você Aprendeu

✅ **`FVector`:** Usado para Posição, Direção e Escala.  
✅ **`FVector::GetSafeNormal()`:** Essencial para obter a direção pura.  
✅ **`FRotator`:** Usado para Rotação (Pitch, Yaw, Roll).  
✅ **`DeltaTime`:** Garante movimento consistente (Velocidade * DeltaTime).  

### Próximo Passo

O próximo módulo abordará as macros de Reflexão da Unreal, que são a ponte entre o C++ e o Editor/Blueprints.

**Próximo:** Módulo 12: Especificadores UPROPERTY e UFUNCTION
