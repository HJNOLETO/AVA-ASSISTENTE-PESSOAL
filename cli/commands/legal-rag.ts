import { Command } from "commander";
import { getDocumentsRAG } from "../../server/db";
import { ingestLegalDocument } from "../../server/rag/legal-ingest";
import { validateLegalCitations } from "../../server/rag/citation-validator";
import { retrieveLegalChunks } from "../../server/rag/retriever-legal";
import { orchestrateAgentResponse } from "../../server/agents";
import { resolveTaskModel } from "../../server/_core/llm-router";

function ensureLegalFeature() {
  if (String(process.env.AVA_LEGAL_RAG_ENABLED || "false").toLowerCase() !== "true") {
    throw new Error("LEGAL_RAG desabilitado. Defina AVA_LEGAL_RAG_ENABLED=true");
  }
}

export function registerLegalRagCommands(program: Command, userId: number) {
  const legal = program.command("legal").description("Operacoes de RAG juridico/normativo");

  legal
    .command("ingest")
    .argument("<caminho>", "Arquivo legal (PDF/MD/TXT)")
    .action(async (caminho: string) => {
      ensureLegalFeature();
      const out = await ingestLegalDocument(caminho, userId);
      console.log(JSON.stringify(out, null, 2));
    });

  legal
    .command("ask")
    .argument("<query>", "Pergunta juridica")
    .action(async (query: string) => {
      ensureLegalFeature();
      const retrieval = await retrieveLegalChunks({ userId, query });
      const baseContext = retrieval.chunks
        .map((c, idx) => `# Chunk ${idx + 1} (score=${c.score.toFixed(3)})\n${c.documentChunks.content}`)
        .join("\n\n");

      const legalPrompt = [
        "Voce e um assistente juridico. Responda APENAS com base nos chunks fornecidos. SEMPRE cite: [Lei/Decreto Nº XXX, Art. Y, §/Inciso Z, Vigencia: DD/MM/AAAA]. SE nao houver correspondencia >= 0.6 confianca, responda: 'Nao consta na base indexada com precisao suficiente.' NUNCA invente artigos, prazos ou revogacoes.",
        "\n[CHUNKS]\n",
        baseContext || "Sem chunks com confianca suficiente.",
        "\n[PERGUNTA]\n",
        query,
      ].join("\n");

      // Roteamento inteligente: cloud (qwen3-coder-next:cloud) primeiro, fallback local automático.
      // Provider sempre "ollama" pois ambos (cloud e local) são acessados via Ollama.
      const resolvedModel = await resolveTaskModel("reasoning/legal", legalPrompt);
      const llm = await orchestrateAgentResponse([{ role: "user", content: legalPrompt }], "ollama", resolvedModel, []);
      const answerRaw = llm.choices?.[0]?.message?.content;
      const answer = typeof answerRaw === "string"
        ? answerRaw
        : Array.isArray(answerRaw)
          ? answerRaw.map((x: any) => x?.text || "").join("\n")
          : "Nao consta na base indexada com precisao suficiente.";
      const validation = await validateLegalCitations(userId, answer);
      if (validation.status === "blocked") {
        console.log(validation.message);
        return;
      }
      console.log(answer);
    });

  legal
    .command("sources")
    .action(async () => {
      ensureLegalFeature();
      const docs = await getDocumentsRAG(userId, { sourceType: "legal" });
      const payload = docs.map((d) => ({
        id: d.id,
        nome: d.name,
        status: d.legalStatus || "vigente",
        ementa: d.tags,
        vigencia: d.effectiveDate,
      }));
      console.log(JSON.stringify(payload, null, 2));
    });
}
