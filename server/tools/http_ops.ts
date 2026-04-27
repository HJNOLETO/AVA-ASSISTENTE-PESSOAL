export type HttpOpsArgs = {
  method: "GET" | "POST";
  url: string;
  payload?: Record<string, unknown> | null;
  headers?: Record<string, string>;
  timeout_ms?: number;
  dry_run?: boolean;
};

const BLOCKED_HEADERS = new Set(["authorization", "cookie", "set-cookie", "x-api-key"]);

function sanitizeHeaders(raw?: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw || {})) {
    const key = k.trim().toLowerCase();
    if (!key || BLOCKED_HEADERS.has(key)) continue;
    sanitized[key] = String(v);
  }
  return sanitized;
}

export async function runHttpOps(args: HttpOpsArgs): Promise<string> {
  if (!/^https?:\/\//i.test(args.url || "")) {
    throw new Error("URL invalida para http_ops");
  }

  if (args.dry_run) {
    return `[DRY-RUN] http_ops ${args.method} ${args.url}`;
  }

  const timeoutMs = Number.isFinite(Number(args.timeout_ms)) ? Number(args.timeout_ms) : 15000;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const headers = sanitizeHeaders(args.headers);
    if (!headers["content-type"] && args.method === "POST") {
      headers["content-type"] = "application/json";
    }

    const response = await fetch(args.url, {
      method: args.method,
      headers,
      body: args.method === "POST" ? JSON.stringify(args.payload || {}) : undefined,
      signal: ctrl.signal,
    });

    const text = await response.text();
    return JSON.stringify({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      body: text.slice(0, 4000),
    });
  } finally {
    clearTimeout(timer);
  }
}
