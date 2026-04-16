import { invokeLLM, generateEmbedding } from "./_core/llm";
import type { InvokeResult } from "./_core/llm";
import { promises as fs } from "fs";
import path from "path";

/**
 * Utility to slugify strings for filenames
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Create an embedding for a text
 */
export async function createEmbedding(text: string): Promise<number[]> {
  return generateEmbedding(text);
}

/**
 * Analyze content to extract key topics and structure
 */
export async function analyzeContent(content: string): Promise<any> {
  const prompt = `
    Analise o conteúdo abaixo e extraia:
    1. Tópicos principais (hierarquia)
    2. Conceitos-chave
    3. Resumo breve
    4. Estrutura sugerida para uma apostila didática

    Conteúdo:
    ${content.substring(0, 10000)}

    Responda em formato JSON:
    {
      "topics": ["tópico 1", "tópico 2"],
      "concepts": ["conceito A", "conceito B"],
      "summary": "texto curto",
      "structure": ["Introdução", "Desenvolvimento", "Conclusão"]
    }
  `;

  const result = await invokeLLM({
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const llmResponse = result.choices[0]?.message?.content;
  const contentString = typeof llmResponse === "string" ? llmResponse : JSON.stringify(llmResponse);

  try {
    return JSON.parse(contentString || "{}");
  } catch (e) {
    console.error("Failed to parse analysis JSON:", e);
    return {
      topics: [],
      concepts: [],
      summary: (typeof llmResponse === "string" ? llmResponse : "").substring(0, 200),
      structure: ["Conteúdo Geral"],
    };
  }
}

/**
 * Generate a complete study material (apostila)
 */
export async function generateApostila(content: string, title: string, analysis: any): Promise<string> {
  const prompt = `
    Com base na análise e no conteúdo fornecido, crie uma APOSTILA DIDÁTICA completa e bem estruturada em Markdown.
    
    Título: ${title}
    Tópicos: ${analysis.topics.join(", ")}
    Estrutura: ${analysis.structure.join(" -> ")}
    
    Conteúdo base:
    ${content.substring(0, 15000)}
    
    A apostila deve conter:
    - Sumário
    - Introdução clara
    - Desenvolvimento detalhado por capítulos
    - Exemplos práticos
    - Conclusão/Revisão
    - Formatação Markdown rica (negrito, listas, tabelas se necessário)
  `;

  const result = await invokeLLM({
    messages: [{ role: "user", content: prompt }],
  });

  const llmResponse = result.choices[0]?.message?.content;
  const contentString = typeof llmResponse === "string" ? llmResponse : JSON.stringify(llmResponse);
  return contentString || "";
}

/**
 * Generate an executive summary
 */
export async function generateResumo(content: string, analysis: any): Promise<string> {
  const prompt = `
    Crie um RESUMO EXECUTIVO (1-2 páginas) em Markdown sobre o conteúdo abaixo.
    Foque nos pontos mais importantes e conclusões principais.
    
    Tópicos: ${analysis.topics.join(", ")}
    Conteúdo base:
    ${content.substring(0, 10000)}
  `;

  const result = await invokeLLM({
    messages: [{ role: "user", content: prompt }],
  });

  const llmResponse = result.choices[0]?.message?.content;
  const contentString = typeof llmResponse === "string" ? llmResponse : JSON.stringify(llmResponse);
  return contentString || "";
}

/**
 * Generate a mind map in Mermaid format
 */
export async function generateMapaMental(content: string, analysis: any): Promise<string> {
  const prompt = `
    Crie um MAPA MENTAL em formato Mermaid (syntax: mindmap) representando as conexões entre os tópicos e conceitos abaixo.
    
    Tópicos: ${analysis.topics.join(", ")}
    Conceitos: ${analysis.concepts.join(", ")}
    
    Retorne APENAS o código Mermaid mindmap.
  `;

  const result = await invokeLLM({
    messages: [{ role: "user", content: prompt }],
  });

  // Clean up potential markdown code blocks
  const llmResponse = result.choices[0]?.message?.content;
  const contentString = typeof llmResponse === "string" ? llmResponse : JSON.stringify(llmResponse);
  return (contentString || "").replace(/```mermaid/g, "").replace(/```/g, "").trim();
}

/**
 * Generate flashcards for study
 */
export async function generateFlashcards(content: string, analysis: any): Promise<string> {
  const prompt = `
    Gere 10-15 FLASHCARDS baseados no conteúdo abaixo para estudo (formato Anki: Pergunta;Resposta).
    
    Tópicos: ${analysis.topics.join(", ")}
    Conteúdo base:
    ${content.substring(0, 10000)}
    
    Retorne apenas as linhas no formato: Pergunta;Resposta
  `;

  const result = await invokeLLM({
    messages: [{ role: "user", content: prompt }],
  });

  const llmResponse = result.choices[0]?.message?.content;
  const contentString = typeof llmResponse === "string" ? llmResponse : JSON.stringify(llmResponse);
  return contentString || "";
}

/**
 * Generate a quiz with multiple choice questions
 */
export async function generateQuiz(content: string, analysis: any): Promise<string> {
  const prompt = `
    Crie um QUIZ de múltipla escolha (5-10 questões) sobre o conteúdo abaixo.
    Para cada questão, forneça 4 alternativas (A, B, C, D) e indique a correta.
    
    Conteúdo base:
    ${content.substring(0, 10000)}
    
    Formato Markdown.
  `;

  const result = await invokeLLM({
    messages: [{ role: "user", content: prompt }],
  });

  const llmResponse = result.choices[0]?.message?.content;
  const contentString = typeof llmResponse === "string" ? llmResponse : JSON.stringify(llmResponse);
  return contentString || "";
}

/**
 * Generate a legal petition (Petição Inicial/Interlocutória)
 */
export async function generatePeticao(content: string, title: string, analysis: any): Promise<string> {
  const prompt = `
    Com base no conteúdo fornecido, aja como um ADVOGADO EXPERIENTE e crie uma PETIÇÃO JUDICIAL (Petição Inicial ou Peça Processual) em Markdown.
    
    Título/Assunto: ${title}
    Conceitos-chave: ${analysis.concepts.join(", ")}
    
    Conteúdo base:
    ${content.substring(0, 15000)}
    
    A petição deve conter:
    - Endereçamento (ao juízo competente)
    - Qualificação das partes (espaços para preencher)
    - Fatos (descrição detalhada)
    - Direito (fundamentação jurídica baseada nos conceitos)
    - Pedidos e Requerimentos
    - Valor da causa (se aplicável)
    - Local, Data e Assinatura (espaços)
    - Formatação jurídica profissional.
  `;

  const result = await invokeLLM({
    messages: [{ role: "user", content: prompt }],
  });

  const llmResponse = result.choices[0]?.message?.content;
  const contentString = typeof llmResponse === "string" ? llmResponse : JSON.stringify(llmResponse);
  return contentString;
}

/**
 * Generate a legal opinion (Parecer Jurídico)
 */
export async function generateParecer(content: string, analysis: any): Promise<string> {
  const prompt = `
    Crie um PARECER JURÍDICO técnico em Markdown analisando o conteúdo abaixo.
    
    Tópicos: ${analysis.topics.join(", ")}
    Conteúdo base:
    ${content.substring(0, 10000)}
    
    O parecer deve conter:
    - Ementa
    - Relatório
    - Fundamentação Jurídica (Análise doutrinária/jurisprudencial sugerida)
    - Conclusão/Resposta à consulta
  `;

  const result = await invokeLLM({
    messages: [{ role: "user", content: prompt }],
  });

  const llmResponse = result.choices[0]?.message?.content;
  const contentString = typeof llmResponse === "string" ? llmResponse : JSON.stringify(llmResponse);
  return contentString;
}

/**
 * Generate a legal consultation log (Atendimento)
 */
export async function generateAtendimento(content: string, title: string): Promise<string> {
  const prompt = `
    Resuma este atendimento/consulta jurídica para registro em CRM em formato Markdown.
    
    Título: ${title}
    Conteúdo:
    ${content}
    
    Extraia:
    - Dados do Cliente
    - Relato do Caso
    - Orientações Prestadas
    - Pendências/Próximos Passos
  `;

  const result = await invokeLLM({
    messages: [{ role: "user", content: prompt }],
  });

  const llmResponse = result.choices[0]?.message?.content;
  const contentString = typeof llmResponse === "string" ? llmResponse : JSON.stringify(llmResponse);
  return contentString;
}

/**
 * Ensure necessary directories exist
 */
export async function ensureKnowledgeDirs(): Promise<void> {
  const dirs = [
    "docs/apostilas",
    "docs/resumos",
    "docs/mapas-mentais",
    "docs/flashcards",
    "docs/quizzes",
    "docs/juridico/peticoes",
    "docs/juridico/pareceres",
    "docs/juridico/atendimentos"
  ];

  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }
  }
}
