/**
 * Utilitários para processamento de memória e extração de contexto
 */

/**
 * Extrai palavras-chave simplificadas de um texto para busca na memória
 */
export function extractKeywords(text: string): string[] {
  // Lista de stop words comuns em português para filtrar
  const stopWords = new Set([
    "o", "a", "os", "as", "um", "uma", "uns", "umas",
    "de", "do", "da", "dos", "das", "em", "no", "na", "nos", "nas",
    "e", "ou", "mas", "que", "com", "por", "para", "como",
    "é", "foi", "está", "estava", "tem", "tinha",
    "me", "te", "se", "nos", "vos", "meu", "sua", "seus", "suas"
  ]);

  // Limpar pontuação e converter para minúsculas
  const cleanText = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .replace(/\s{2,}/g, " ");

  // Filtrar palavras curtas e stop words
  return cleanText
    .split(" ")
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 5); // Limitar a 5 palavras-chave principais
}

/**
 * Formata memórias recuperadas para injeção no prompt do sistema
 */
export function formatMemoriesForPrompt(memories: any[]): string {
  if (!memories || memories.length === 0) return "";

  let formatted = "\n\n### [Memórias Relevantes Recuperadas]:\n";
  memories.forEach((mem, index) => {
    formatted += `${index + 1}. ${mem.content}\n`;
  });

  return formatted;
}
