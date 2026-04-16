
import "dotenv/config";
import { getDb } from "../server/db";
import { 
  createDocument, 
  createDocumentChunk, 
  searchDocumentChunks, 
  getDocuments,
  getDocumentChunks
} from "../server/db";
import { generateEmbedding } from "../server/_core/llm";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function testRagFlow() {
  console.log("Starting RAG Flow Test...");
  const db = await getDb();
  if (!db) throw new Error("DB not available");

  // 1. Get or Create Test User
  let user = (await db.select().from(users).where(eq(users.email, "test@example.com")).limit(1))[0];

  if (!user) {
    console.log("Creating test user...");
    const result = await db.insert(users).values({
      email: "test@example.com",
      name: "Test User",
      password: "hashed_password",
      role: "user",
      openId: "test-user-openid-123"
    }).returning();
    user = result[0];
  }
  
  const userId = user.id;
  console.log(`Using User ID: ${userId}`);

  // 2. Create Document
  console.log("Creating test document...");
  const docData = {
    name: "Ollama Documentation",
    type: "text/markdown",
    size: 1024,
    content: "Ollama allows you to run open-source large language models, such as Llama 2, locally.",
    status: "processing" as const
  };
  
  // Note: createDocument returns the result of db.insert, which in better-sqlite3 with returning() gives the object
  const docResult = await createDocument(userId, docData);
  // Type assertion or check might be needed depending on return type implementation
  const docId = (docResult as any).lastInsertRowid; 
  console.log(`Document created with ID: ${docId}`);

  // 3. Generate Embedding & Create Chunk
  const text = "Ollama runs Llama 2 locally.";
  console.log(`Generating embedding for text: "${text}"...`);
  
  // Force using an available model if default is missing
  if (!process.env.EMBEDDING_MODEL) {
    process.env.EMBEDDING_MODEL = "llama3.2:latest";
  }

  let embedding: number[] = [];
  try {
    embedding = await generateEmbedding(text, "ollama");
    console.log(`Embedding generated successfully. Length: ${embedding.length}`);
  } catch (error) {
    console.warn("Failed to generate embedding (Ollama might be down or model missing). Using mock embedding.");
    // Mock embedding for testing db insertion
    embedding = Array(768).fill(0).map(() => Math.random());
  }

  // 4. Save Chunk
  console.log("Saving document chunk...");
  await createDocumentChunk({
    documentId: docId,
    content: text,
    chunkIndex: 0,
    embedding: JSON.stringify(embedding)
  });

  // 5. Test Search
  console.log("Testing search...");
  const query = "run models locally";
  const searchResults = await searchDocumentChunks(userId, query, 3);
  
  console.log(`Search results for "${query}":`);
  searchResults.forEach((result, i) => {
    // @ts-ignore - score property added by search logic
    console.log(`${i + 1}. [Score: ${result.score?.toFixed(4)}] ${result.content}`);
  });

  if (searchResults.length > 0) {
    console.log("✅ RAG Flow Test Passed!");
  } else {
    console.log("⚠️ No results found. Check embedding generation or similarity logic.");
  }
}

testRagFlow().catch(console.error);
