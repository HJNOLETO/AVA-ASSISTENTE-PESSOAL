import "dotenv/config";
import { appRouter } from "../server/routers";
import { createDocumentChunkBatch, createDocumentRAG, hardDeleteDocument } from "../server/db";
import { searchRelevantChunks } from "../server/rag";

const TEST_DOC_EXTERNAL_ID = `repro-rag-null-legalstatus-${Date.now()}`;
const TEST_SENTINEL = "CHAVE-RAG-TESTE-99173";

async function main() {
  let docId: number | null = null;
  const caller = appRouter.createCaller({
    user: {
      id: 1,
      openId: "local-guest",
      email: null,
      name: "Local Guest",
      loginMethod: "guest",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } as any,
    req: { protocol: "http", headers: {} } as any,
    res: { clearCookie: () => {} } as any,
  } as any);

  try {
    const created = await createDocumentRAG(1, {
      name: "Repro RAG null legalStatus",
      type: "text/plain",
      size: 512,
      status: "indexed",
      isIndexed: 1,
      externalId: TEST_DOC_EXTERNAL_ID,
      sourceType: "repro",
      legalStatus: null,
      effectiveDate: null,
      totalChunks: 1,
      indexedChunks: 1,
      estimatedSizeKB: 8,
    });

    docId = Number((created as any)?.lastInsertRowid || (created as any)?.[0]?.id);
    if (!docId) {
      throw new Error("Falha ao criar documento de teste");
    }

    await createDocumentChunkBatch([
      {
        documentId: docId,
        chunkIndex: 0,
        content:
          `${TEST_SENTINEL}: A cor oficial do projeto nesta base de teste e laranja. ` +
          "Use esta frase como unica resposta para validar o RAG.",
        metadata: JSON.stringify({ test: true }),
        embedding: null,
        embeddingProvider: null,
        embeddingModel: null,
        embeddingDimensions: null,
      },
    ]);

    const query = `Qual e a cor oficial do projeto segundo ${TEST_SENTINEL}?`;
    const chunks = await searchRelevantChunks(query, 1, 5, {
      documentIds: [docId],
      minScore: 0.1,
    });

    const conversation = await caller.chat.createConversation({
      title: "Repro RAG null legalStatus",
      mode: "ECO",
    });
    const conversationId = (conversation as any).conversationId ?? (conversation as any).id;

    const llmResult = await caller.chat.sendMessage({
      conversationId,
      content: query,
      provider: "ollama",
      model: process.env.OLLAMA_MODEL || "qwen2.5:7b-instruct",
      documentIds: [docId],
    });

    console.log("[repro] docId=", docId);
    console.log("[repro] searchRelevantChunks.count=", chunks.length);
    if (chunks[0]) {
      console.log("[repro] topChunk=", chunks[0].content);
    }
    console.log("[repro] assistantMessage=", llmResult.assistantMessage);
  } finally {
    if (docId) {
      await hardDeleteDocument(1, docId);
    }
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("[repro] failed:", error);
    process.exit(1);
  });
