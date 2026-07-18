# Módulo 3 - Funções

## Status: 📚 MATERIAL DE ESTUDO

---

## O QUE SÃO FUNÇÕES?

### Teoria

Funções são blocos de código reutilizáveis que executam uma tarefa específica.

**Analogia:** Uma função é como uma máquina:
- Você dá ingredientes (parâmetros)
- Ela processa
- Retorna um resultado

**Por que usar?**
- ✅ Evita repetição de código
- ✅ Organiza o programa
- ✅ Facilita manutenção
- ✅ Torna código testável

---

## ANATOMIA DE UMA FUNÇÃO

```cpp
tipo_retorno nomeDaFuncao(parametros) {
    // código
    return valor;
}
```

### Partes:

1. **Tipo de retorno** - que tipo de dado a função devolve
2. **Nome da função** - identificador único
3. **Parâmetros** - dados que a função recebe (opcional)
4. **Corpo** - código que executa
5. **return** - valor que devolve (se não for void)

---

## TIPOS DE FUNÇÕES

### 1. Função Void (Sem Retorno)

Executa ação, mas NÃO devolve valor.

```cpp
#include <iostream>
using namespace std;

void saudacao() {
    cout << "Bem-vindo ao jogo!" << endl;
}

int main() {
    saudacao();  // Chama a função
    return 0;
}
```

**Saída:** `Bem-vindo ao jogo!`

---

### 2