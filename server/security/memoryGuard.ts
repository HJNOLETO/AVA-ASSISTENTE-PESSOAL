export type MemoryClass = "secret" | "sensitive" | "useful" | "discard";

export type MemoryDestination = "vault" | "semantic" | "episodic" | "none";

export type MemoryClassification = {
  classification: MemoryClass;
  destination: MemoryDestination;
  confidence: number;
  consentRequired: boolean;
  reason: string;
};

// ── C2: Pré-filtro de Injeção (Prompt/SQL/Shell) ────────────────────────────────
export type InjectionType = "sql" | "prompt" | "shell" | "path_traversal";

export type InjectionResult = {
  detected: boolean;
  type?: InjectionType;
  pattern?: string;
  severity: "critical" | "high" | "none";
};

const INJECTION_PATTERNS: Array<{ type: InjectionType; pattern: RegExp; severity: "critical" | "high" }> = [
  // SQL — comandos destrutivos com cláusulas
  { type: "sql", pattern: /\b(DELETE|DROP|TRUNCATE|UPDATE)\b.{0,60}\b(FROM|TABLE|WHERE|SET)\b/i, severity: "critical" },
  { type: "sql", pattern: /\b(INSERT\s+INTO|ALTER\s+TABLE|CREATE\s+TABLE|EXEC\s*\()/i, severity: "high" },
  // Prompt injection — tentativas de subverter instruções do sistema
  { type: "prompt", pattern: /ignore\s+(all|todas|previous|anteriores|as)?\s*(rules?|regras?|instructions?|instru[çc][oõ]es)/i, severity: "critical" },
  { type: "prompt", pattern: /\b(DAN\s*mode|jailbreak|you\s+are\s+now\s+a|act\s+as\s+if\s+you\s+are|pretend\s+you\s+are)\b/i, severity: "critical" },
  { type: "prompt", pattern: /\b(system\s*prompt|instrução\s+do\s+sistema|ignore\s+your\s+(previous|last))\b/i, severity: "high" },
  // Shell injection — comandos perigosos após separadores
  { type: "shell", pattern: /[;|&`]\s*(rm|del|format|mkfs|dd|curl|wget|nc|netcat|bash|sh|cmd\.exe|powershell)\b/i, severity: "critical" },
  { type: "shell", pattern: /\$\([^)]{0,80}\)|`[^`]{0,80}`/i, severity: "high" }, // command substitution
  // Path traversal
  { type: "path_traversal", pattern: /(\.\.[\/\\]){2,}/i, severity: "critical" },
];

/**
 * C2: Detecta tentativas de injeção em inputs antes de execução de ferramentas.
 * NÃO substitui o classifyMemoryInput — é uma camada adicional de defesa.
 */
export function detectInjectionAttempt(input: string): InjectionResult {
  const text = String(input || "").trim();
  for (const { type, pattern, severity } of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return { detected: true, type, pattern: pattern.source, severity };
    }
  }
  return { detected: false, severity: "none" };
}

const SECRET_PATTERNS: RegExp[] = [
  /\b(password|senha|passphrase)\b/i,
  /\b(api[_\s-]?key|token|bearer|secret|client[_\s-]?secret)\b/i,
  /\b(aws_access_key_id|aws_secret_access_key|private[_\s-]?key)\b/i,
  /sk-[a-z0-9]{16,}/i,
  /AIza[0-9A-Za-z\-_]{20,}/,
  /ghp_[0-9A-Za-z]{30,}/,
  /xox[baprs]-[0-9A-Za-z-]{20,}/,
  /-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----/i,
];

const SENSITIVE_PATTERNS: RegExp[] = [
  /\b(cpf|rg|cnpj|passaporte)\b/i,
  /\b(anivers[aá]rio|data de nascimento|birthdate)\b/i,
  /\b(endere[cç]o|logradouro|cep)\b/i,
  /\b(telefone|celular|e-?mail)\b/i,
  /\b(cart[aã]o|cvv)\b/i,
];

const DISCARD_PATTERNS: RegExp[] = [
  /^\s*ok\s*$/i,
  /^\s*(obrigado|valeu|thanks)\s*!?\s*$/i,
  /^\s*teste\s*$/i,
];

const REDACTION_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /(password|senha)\s*[:=]\s*[^\s,;]+/gi, replacement: "$1=[REDACTED]" },
  { pattern: /(api[_\s-]?key|token|bearer|secret|client[_\s-]?secret)\s*[:=]\s*[^\s,;]+/gi, replacement: "$1=[REDACTED]" },
  { pattern: /sk-[a-z0-9]{16,}/gi, replacement: "sk-[REDACTED]" },
  { pattern: /AIza[0-9A-Za-z\-_]{20,}/g, replacement: "AIza[REDACTED]" },
  { pattern: /ghp_[0-9A-Za-z]{30,}/g, replacement: "ghp_[REDACTED]" },
  { pattern: /xox[baprs]-[0-9A-Za-z-]{20,}/gi, replacement: "xox[REDACTED]" },
  { pattern: /-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----[\s\S]*?-----END [A-Z ]+-----/gi, replacement: "[REDACTED_PRIVATE_KEY]" },
];

export function redactSensitiveText(input: string): string {
  let output = String(input || "");
  for (const item of REDACTION_PATTERNS) {
    output = output.replace(item.pattern, item.replacement);
  }
  return output;
}

function hasPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export function classifyMemoryInput(input: string): MemoryClassification {
  const text = String(input || "").trim();
  if (!text || hasPattern(text, DISCARD_PATTERNS)) {
    return {
      classification: "discard",
      destination: "none",
      confidence: 0.96,
      consentRequired: false,
      reason: "conteudo irrelevante para memoria de longo prazo",
    };
  }

  if (hasPattern(text, SECRET_PATTERNS)) {
    return {
      classification: "secret",
      destination: "vault",
      confidence: 0.99,
      consentRequired: true,
      reason: "detectado padrao de segredo/credencial",
    };
  }

  if (hasPattern(text, SENSITIVE_PATTERNS)) {
    return {
      classification: "sensitive",
      destination: "vault",
      confidence: 0.92,
      consentRequired: true,
      reason: "detectado dado pessoal sensivel",
    };
  }

  return {
    classification: "useful",
    destination: "semantic",
    confidence: 0.8,
    consentRequired: false,
    reason: "conteudo util para recuperacao semantica",
  };
}

export type MemoryRouteDecision = {
  persist: boolean;
  blocked: boolean;
  classification: MemoryClassification;
  sanitizedContent: string;
  policyMessage: string;
};

export function routeMemoryPersistence(input: string): MemoryRouteDecision {
  const classification = classifyMemoryInput(input);
  const sanitizedContent = redactSensitiveText(input);

  if (classification.classification === "discard") {
    return {
      persist: false,
      blocked: false,
      classification,
      sanitizedContent,
      policyMessage: "Memoria descartada por baixa relevancia.",
    };
  }

  if (classification.classification === "secret" || classification.classification === "sensitive") {
    return {
      persist: false,
      blocked: true,
      classification,
      sanitizedContent,
      policyMessage: "Persistencia bloqueada: conteudo sensivel/segredo deve ir para cofre com consentimento explicito.",
    };
  }

  const failClosed = classification.confidence < 0.6;
  if (failClosed) {
    return {
      persist: false,
      blocked: true,
      classification,
      sanitizedContent,
      policyMessage: "Persistencia bloqueada por baixa confianca de classificacao (fail-closed).",
    };
  }

  return {
    persist: true,
    blocked: false,
    classification,
    sanitizedContent,
    policyMessage: "Memoria autorizada para armazenamento semantico.",
  };
}
