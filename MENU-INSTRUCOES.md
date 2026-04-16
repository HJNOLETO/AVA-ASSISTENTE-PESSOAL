# 📋 Menu Interativo - AVA Assistant v3.1

Sistema completo de menu com interface gráfica no PowerShell para gerenciar o servidor e ambiente.

## 🎯 Como Usar

### **Forma 1: Clique Duplo (Recomendado)**

1. Vá até a raiz do projeto
2. Clique duplo em **`start-menu.vbs`** ou **`start-menu.bat`**
3. O PowerShell abrirá com o menu interativo

### **Forma 2: Via PowerShell**

```powershell
.\scripts\menu.ps1
```

### **Forma 3: Criar Atalho na Área de Trabalho**

- Clique direito em `start-menu.vbs`
- Selecione "Enviar para" → "Área de Trabalho (criar atalho)"
- Agora você tem um atalho na área de trabalho

---

## 📌 Opções do Menu

| Opção | Descrição                                                                  |
| ----- | -------------------------------------------------------------------------- |
| **1** | 🧹 **Limpar Ambiente** - Remove cache, node_modules e processos node       |
| **2** | 🔍 **Verificar Servidores Ativos** - Mostra processos node e portas em uso |
| **3** | 🟢 **Iniciar Dev Server** - Inicia Vite na porta 5173                      |
| **4** | 🏭 **Build + Produção** - Constrói e inicia servidor de produção           |
| **5** | 🔄 **Reset Completo** - Limpa + inicia dev server (tudo de uma vez)        |
| **6** | 📊 **Status Completo** - Versões, dependências, verificação TypeScript     |
| **7** | 🛑 **Parar Todos os Servidores** - Finaliza todos os processos node        |
| **8** | 📋 **Verificar Portas em Uso** - Lista detalhada de portas abertas         |
| **9** | 📚 **Ver Documentação** - Mostra README dos scripts                        |
| **0** | ❌ **Sair** - Fecha o menu                                                 |

---

## 🎨 Características

✅ **Interface Colorida** - Cores por tipo de ação (amarelo para avisos, verde para sucesso, etc)

✅ **Menu Iterativo** - Retorna ao menu principal após cada ação

✅ **Verificações Automáticas** - Valida se pnpm, node, etc estão instalados

✅ **Atalhos Prontos** - `.bat` e `.vbs` para clicar duplo

✅ **Sem Configuração** - Funciona imediatamente após clique

---

## 📂 Arquivos Envolvidos

```
ava-assistant-v3.1/
├── start-menu.bat          ← Clique para abrir (Windows CMD)
├── start-menu.vbs          ← Clique para abrir (VBScript - Recomendado)
├── scripts/
│   ├── menu.ps1            ← Script principal do menu
│   ├── clean.ps1           ← Limpar ambiente
│   ├── start-dev.ps1       ← Iniciar dev
│   ├── start-prod.ps1      ← Build + produção
│   ├── full-reset.ps1      ← Reset completo
│   └── README.md           ← Documentação dos scripts
```

---

## 🚀 Workflow Recomendado

### Primeira Vez

```
1. Clique duplo em start-menu.vbs
2. Escolha opção [5] (Reset Completo)
3. Aguarde instalação e inicialização
4. Acesse http://localhost:5173
```

### Antes de Reabrir Servidor

```
1. Clique duplo em start-menu.vbs
2. Escolha opção [1] (Limpar)
3. Escolha opção [3] (Iniciar Dev)
```

### Verificar Status do Sistema

```
1. Clique duplo em start-menu.vbs
2. Escolha opção [6] (Status Completo)
3. Veja versões, dependências e verificação
```

---

## ⚠️ Requisitos

- Windows 10 ou superior
- PowerShell 5.1+ (padrão no Windows)
- pnpm instalado: `npm install -g pnpm`
- Node.js 18+

---

## 🔧 Troubleshooting

### "Não consigo clicar duplo no .vbs"

Use o `.bat` em vez disso, ou execute via PowerShell:

```powershell
.\scripts\menu.ps1
```

### "Erro de execução"

Se receber erro de política de execução:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Menu não fecha depois de dev server"

É normal - pressione CTRL+C para parar o servidor e voltar ao menu.

---

## 📝 Notas

- O menu roda em loop - sempre volta para a tela principal após cada ação
- Use a opção [7] para parar servidores antes de sair
- A opção [2] mostra portas em uso em tempo real
- Logs coloridos indicam sucesso (verde), avisos (amarelo) e erros (vermelho)

---

**Criado:** 02 de fevereiro de 2026
**Versão:** AVA Assistant v3.1
