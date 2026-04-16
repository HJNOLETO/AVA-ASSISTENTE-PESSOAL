# ✅ SUPORTE A OLLAMA - Análise Completa

**Data:** 2 de Fevereiro de 2026  
**Status:** ✅ SIM, O PROJETO RECONHECE OLLAMA

---

## 🎯 Resposta: O projeto está reconhecendo LLMs Ollama?

### ✅ **SIM! 100% Suportado**

O projeto tem suporte completo a Ollama em:

- **Backend**: [server/\_core/llm.ts](server/_core/llm.ts#L171)
- **API**: [server/routers.ts](server/routers.ts#L256)
- **Frontend**: Parâmetros para enviar requisições com Ollama

---

## 🔧 Implementação Técnica

### 1️⃣ Suporte ao Provider "ollama"

**Arquivo:** [server/\_core/llm.ts](server/_core/llm.ts#L171)

```typescript
if (provider === "ollama") {
  const base = params.ollamaBaseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const url = `${base.replace(/\/$/, "")}/api/chat`;

  console.log(`[LLM] Conectando ao Ollama: ${url}`);
  console.log(`[LLM] Modelo: ${model || process.env.OLLAMA_MODEL || "llama3.1:8b"}`);
```

✅ **Features:**

- Detecta se Ollama está em `http://localhost:11434` (padrão)
- Suporta Ollama remoto via `ollamaBaseUrl`
- Suporta autenticação via `ollamaAuthToken`
- Modelo padrão: `llama3.1:8b`

---

### 2️⃣ Endpoint do Chat - Suporte Ollama

**Arquivo:** [server/routers.ts](server/routers.ts#L256)

```typescript
sendMessage: protectedProcedure.input(
  z.object({
    conversationId: z.number(),
    content: z.string(),
    provider: z.enum(["forge", "ollama"]).optional(), // ✅ Aqui!
    model: z.string().optional(), // ✅ Modelo customizado
    ollamaBaseUrl: z.string().url().optional(), // ✅ URL customizada
    ollamaAuthToken: z.string().optional(), // ✅ Token de auth
    // ... outros parâmetros
  })
);
```

---

### 3️⃣ Tratamento de Respostas Ollama

**Suporte a diferentes formatos:**

```typescript
// Processa respostas do Ollama
const chatMessages = messages.map(m => {
  const parts = ensureArray(m.content);
  const text = parts
    .map(p => (typeof p === "string" ? p : ((p as any)?.text ?? "")))
    .filter(t => t && t.length > 0)
    .join("\n");

  // ✅ Suporte a imagens (base64)
  const images: string[] = parts
    .filter(p => (p as any)?.type === "image_url")
    .map((p: any) => {
      const url: string = p.image_url?.url || "";
      if (url.startsWith("data:")) {
        const base64 = url.split(",")[1] || "";
        return base64;
      }
      return "";
    });
});
```

✅ **Suporta:**

- Texto
- Imagens (base64)
- Mensagens multilíngues

---

## 🚀 Como Usar Ollama

### 1️⃣ Instalar Ollama (Se não tiver)

```bash
# Windows/Mac/Linux
# Download em: https://ollama.ai

# Após instalação, inicie o serviço
ollama serve
# Fica disponível em: http://localhost:11434
```

### 2️⃣ Baixar um Modelo

```bash
# Modelos disponíveis: llama3.1, mistral, neural-chat, etc.
ollama pull llama3.1:8b
ollama pull mistral:7b
ollama pull neural-chat:7b

# Listar modelos instalados
ollama list
```

### 3️⃣ Usar no Chat da AVA

**Via Frontend (React):**

```typescript
import { trpc } from "@/lib/trpc";

export function ChatWithOllama() {
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  const handleSendMessage = async (content: string) => {
    const result = await sendMessageMutation.mutateAsync({
      conversationId: 1,
      content: content,
      provider: "ollama",              // ✅ Usar Ollama
      model: "llama3.1:8b",            // ✅ Modelo específico
      ollamaBaseUrl: "http://localhost:11434", // ✅ Opcional, padrão
    });

    console.log("Resposta:", result.assistantMessage);
  };

  return <button onClick={() => handleSendMessage("Olá!")}>Enviar</button>;
}
```

---

## ⚙️ Configuração via Variáveis de Ambiente

**Arquivo `.env`:**

```env
# Provider padrão (forge ou ollama)
LLM_PROVIDER=ollama

# URL do Ollama
OLLAMA_BASE_URL=http://localhost:11434

# Modelo padrão do Ollama
OLLAMA_MODEL=llama3.1:8b

# Token de autenticação (se necessário)
OLLAMA_AUTH_TOKEN=seu_token_aqui
```

---

## 🛡️ Tratamento de Erros

O projeto trata **erros específicos** do Ollama:

```typescript
// ✅ 401 - Não autorizado
if (response.status === 401) {
  throw new Error(`Ollama retornou 401 (Não autorizado). 
    Verifique se o token está correto.`);
}

// ✅ 404 - Modelo não encontrado
if (response.status === 404) {
  throw new Error(`Modelo não encontrado no Ollama. 
    Execute: ollama pull ${model}`);
}

// ✅ 503 - Sobrecarregado/Carregando
if (response.status === 503) {
  throw new Error(`Ollama está carregando o modelo. 
    Aguarde um momento e tente novamente.`);
}
```

---

## 📊 Modelos Recomendados para Ollama

| Modelo           | Tamanho | Velocidade | Qualidade  | Use Quando                   |
| ---------------- | ------- | ---------- | ---------- | ---------------------------- |
| `mistral:7b`     | 4.1GB   | ⚡⚡⚡     | ⭐⭐       | Quer velocidade máxima       |
| `llama3.1:8b`    | 4.7GB   | ⚡⚡       | ⭐⭐⭐     | **Default** (melhor balanço) |
| `neural-chat:7b` | 4.1GB   | ⚡⚡⚡     | ⭐⭐⭐     | Chat especializado           |
| `llama3.1:13b`   | 7.3GB   | ⚡         | ⭐⭐⭐⭐   | Quer mais qualidade          |
| `mixtral:8x7b`   | 26GB    | ⚡         | ⭐⭐⭐⭐⭐ | Quer o melhor                |

---

## ✅ Verificação: Ollama Está Funcionando?

### Via Linha de Comando

```bash
# Teste de conectividade
curl http://localhost:11434/api/tags

# Esperado:
# {"models":[{"name":"llama3.1:8b","size":4700000000,...}]}
```

### Via Frontend (Console do Navegador)

```javascript
// Teste tRPC
trpc.chat.sendMessage
  .mutate({
    conversationId: 1,
    content: "Olá, quem é você?",
    provider: "ollama",
    model: "llama3.1:8b",
  })
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

---

## 🔄 Fluxo: Do Usuário ao Modelo Ollama

```
┌─────────────────────────────────────────────────────┐
│ 1. Usuário no Frontend                              │
│    Seleciona: provider = "ollama"                   │
│              model = "llama3.1:8b"                  │
│              content = "Sua pergunta"               │
└────────────┬────────────────────────────────────────┘
             │ POST /trpc/chat.sendMessage
┌────────────▼────────────────────────────────────────┐
│ 2. API tRPC (routers.ts)                            │
│    Valida inputs com Zod                           │
│    Passou para invokeLLM()                          │
└────────────┬────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────┐
│ 3. LLM Module (server/_core/llm.ts)                 │
│    Detecta: provider === "ollama"                  │
│    Conecta a: http://localhost:11434/api/chat      │
│    Envia: {model, messages, stream: false}         │
└────────────┬────────────────────────────────────────┘
             │ HTTP POST
┌────────────▼────────────────────────────────────────┐
│ 4. Ollama Local/Remoto                              │
│    Carrega modelo: llama3.1:8b                     │
│    Processa: Sua pergunta                          │
│    Retorna: Resposta gerada                        │
└────────────┬────────────────────────────────────────┘
             │ JSON Response
┌────────────▼────────────────────────────────────────┐
│ 5. Backend Processa Resposta                        │
│    Extrai: data.message.content                    │
│    Salva: No banco de dados                        │
│    Retorna: Para o Frontend                        │
└────────────┬────────────────────────────────────────┘
             │ JSON Response
┌────────────▼────────────────────────────────────────┐
│ 6. Frontend Exibe                                   │
│    Mostra: Resposta do modelo                      │
└─────────────────────────────────────────────────────┘
```

---

## 🧪 Testes do Suporte Ollama

Pode ser adicionado teste em [server/chat.router.test.ts](server/chat.router.test.ts):

```typescript
describe("Ollama Integration", () => {
  it("sends message using Ollama provider", async () => {
    const result = await trpc.chat.sendMessage.mutate({
      conversationId: 1,
      content: "Teste Ollama",
      provider: "ollama",
      model: "llama3.1:8b",
      ollamaBaseUrl: "http://localhost:11434",
    });

    expect(result.assistantMessage).toBeDefined();
    expect(result.assistantMessage.length).toBeGreaterThan(0);
  });
});
```

---

## 📋 Checklist: Ollama Setup

- [ ] Ollama instalado (https://ollama.ai)
- [ ] Ollama rodando: `ollama serve`
- [ ] Modelo baixado: `ollama pull llama3.1:8b`
- [ ] Verificar conectividade: `curl http://localhost:11434/api/tags`
- [ ] Projeto iniciado: `pnpm dev`
- [ ] Testar chat com `provider: "ollama"`
- [ ] Verificar logs: `[LLM] Conectando ao Ollama: ...`

---

## 📊 Status Final

| Aspecto              | Status | Evidência                   |
| -------------------- | ------ | --------------------------- |
| Suporte Ollama       | ✅ Sim | server/\_core/llm.ts:171    |
| Provider na API      | ✅ Sim | z.enum(["forge", "ollama"]) |
| Autenticação         | ✅ Sim | ollamaAuthToken support     |
| Modelos customizados | ✅ Sim | model parameter             |
| URL customizada      | ✅ Sim | ollamaBaseUrl parameter     |
| Tratamento de erros  | ✅ Sim | Mensagens específicas       |
| Timeout              | ✅ Sim | 120s para modelos locais    |
| Cancelamento         | ✅ Sim | AbortSignal support         |

---

**Conclusão:** ✅ **O projeto ESTÁ 100% reconhecendo e suportando Ollama!** 🚀
