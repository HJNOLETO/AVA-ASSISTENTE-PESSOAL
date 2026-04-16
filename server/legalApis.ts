type DOUSection = "todos" | "1" | "2" | "3" | "extra";
type Tribunal = "stf" | "stj" | "tst" | "tjma" | "tjto";

type LegalApiResult = {
  success: boolean;
  source: string;
  message?: string;
  results?: unknown[];
  searchUrl?: string;
  total?: number;
  error?: string;
};

type NormalizedHit = {
  titulo: string;
  url: string;
  data?: string;
  resumo?: string;
};

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "application/json, text/html, */*",
  "Accept-Language": "pt-BR,pt;q=0.9",
};

async function safeJsonFetch(url: string, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: DEFAULT_HEADERS,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

function cleanHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(input: string) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function absUrl(base: string, maybeRelative: string) {
  try {
    return new URL(maybeRelative, base).toString();
  } catch {
    return maybeRelative;
  }
}

function extractHtmlLinks(html: string, baseUrl: string, limit: number): NormalizedHit[] {
  const hits: NormalizedHit[] = [];
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(html)) && hits.length < limit) {
    const href = decodeEntities(match[1] || "").trim();
    const label = decodeEntities(cleanHtml(match[2] || ""));
    if (!href || !label || label.length < 6) continue;
    if (href.startsWith("javascript:")) continue;
    hits.push({
      titulo: label,
      url: absUrl(baseUrl, href),
    });
  }
  return hits;
}

export async function searchDOU(
  termo: string,
  secao: DOUSection = "todos",
  data?: string,
  pagina = 1
): Promise<LegalApiResult> {
  const params = new URLSearchParams();
  params.set("q", termo);
  if (secao && secao !== "todos") params.set("s", secao);
  if (data) params.set("exactDate", data);
  params.set("currentPage", String(pagina));

  const searchUrl = `https://www.in.gov.br/consulta/-/buscar/dou?${params.toString()}`;

  try {
    const res = await safeJsonFetch(searchUrl);
    const contentType = res.headers.get("content-type") || "";

    if (res.ok && contentType.includes("application/json")) {
      const dataJson: any = await res.json();
      const items = dataJson?.content || dataJson?.items || [];
      return {
        success: true,
        source: "DOU",
        total: items.length,
        results: items.slice(0, 20),
        searchUrl,
      };
    }

    if (res.ok && contentType.includes("text/html")) {
      const html = await res.text();
      const extracted = extractHtmlLinks(html, "https://www.in.gov.br", 20).filter(
        h => h.url.includes("in.gov.br")
      );
      if (extracted.length > 0) {
        return {
          success: true,
          source: "DOU",
          total: extracted.length,
          results: extracted,
          searchUrl,
        };
      }
      return {
        success: false,
        source: "DOU",
        error: "Consulta real executada, mas nenhum resultado estruturado foi extraido do HTML.",
        searchUrl,
      };
    }

    return {
      success: false,
      source: "DOU",
      error: `Resposta inesperada da fonte oficial (HTTP ${res.status}).`,
      searchUrl,
    };
  } catch {
    return {
      success: false,
      source: "DOU",
      error: "Falha de rede/timeout ao consultar a fonte oficial.",
      searchUrl,
    };
  }
}

export async function searchLexML(termo: string, tipo = "lei"): Promise<LegalApiResult> {
  const searchUrl = `https://www.lexml.gov.br/busca/pesquisaLexML?pesq=${encodeURIComponent(termo)}&tipoDocumento=${encodeURIComponent(tipo)}`;
  try {
    const res = await safeJsonFetch(searchUrl);
    if (!res.ok) {
      return {
        success: false,
        source: "LexML",
        error: `Falha na consulta da fonte oficial (HTTP ${res.status}).`,
        searchUrl,
      };
    }

    const html = await res.text();
    const extracted = extractHtmlLinks(html, "https://www.lexml.gov.br", 30).filter(
      h => h.url.includes("lexml.gov.br")
    );

    if (extracted.length === 0) {
      return {
        success: false,
        source: "LexML",
        error: "Consulta real executada, mas nenhum resultado foi extraido.",
        searchUrl,
      };
    }

    return {
      success: true,
      source: "LexML",
      total: extracted.length,
      results: extracted,
      searchUrl,
    };
  } catch {
    return {
      success: false,
      source: "LexML",
      error: "Falha de rede/timeout ao consultar a fonte oficial.",
      searchUrl,
    };
  }
}

export async function searchJurisprudencia(
  termo: string,
  tribunal: Tribunal = "stf",
  limit = 5
): Promise<LegalApiResult> {
  const officialSearchByTribunal: Record<Tribunal, string> = {
    stf: `https://jurisprudencia.stf.jus.br/pages/search?base=acordaos&sinonimo=true&plural=true&page=1&pageSize=${Math.max(1, limit)}&queryString=${encodeURIComponent(termo)}`,
    stj: `https://scon.stj.jus.br/SCON/pesquisar.jsp?b=ACOR&livre=${encodeURIComponent(termo)}`,
    tst: `https://jurisprudencia.tst.jus.br/`,
    tjma: `https://www.tjma.jus.br/portal/jurisprudencia/busca?texto=${encodeURIComponent(termo)}`,
    tjto: `https://jurisprudencia.tjto.jus.br/consulta?q=${encodeURIComponent(termo)}`,
  };

  try {
    if (tribunal === "stf") {
      const url = `https://jurisprudencia.stf.jus.br/api/search/search?query=${encodeURIComponent(termo)}&pageSize=${limit}`;
      const res = await safeJsonFetch(url);
      if (res.ok) {
        const payload: any = await res.json();
        const hits = payload?.hits?.hits || [];
        const results = hits.slice(0, limit).map((h: any) => ({
          tribunal: "STF",
          numero: h?._source?.numeroProcesso,
          ementa: h?._source?.ementa,
          tipoDecisao: h?._source?.tipoDecisao,
        }));
        return { success: true, source: "Jurisprudência STF", total: results.length, results };
      }

      return {
        success: false,
        source: "Jurisprudência STF",
        error: `Falha na API oficial do STF (HTTP ${res.status}).`,
        searchUrl: officialSearchByTribunal.stf,
      };
    }

    if (tribunal === "tst") {
      const url = `https://consultap.tst.jus.br/rest/jurisprudencia/pesquisar?query=${encodeURIComponent(termo)}&rows=${limit}`;
      const res = await safeJsonFetch(url);
      if (res.ok) {
        const payload: any = await res.json();
        const docs = payload?.response?.docs || [];
        const results = docs.slice(0, limit).map((d: any) => ({
          tribunal: "TST",
          numero: d?.num_processo_mask,
          ementa: d?.ementa,
        }));
        return { success: true, source: "Jurisprudência TST", total: results.length, results };
      }

      return {
        success: false,
        source: "Jurisprudência TST",
        error: `Falha na API oficial do TST (HTTP ${res.status}).`,
        searchUrl: officialSearchByTribunal.tst,
      };
    }

    return {
      success: false,
      source: `Jurisprudência ${tribunal.toUpperCase()}`,
      error:
        "Nao ha API integrada para este tribunal neste modulo. Use a URL oficial retornada para consulta manual ou implemente integracao dedicada.",
      searchUrl: officialSearchByTribunal[tribunal],
    };
  } catch {
    return {
      success: false,
      source: `Jurisprudência ${tribunal.toUpperCase()}`,
      error: "Falha de rede/timeout na consulta oficial.",
      searchUrl: officialSearchByTribunal[tribunal],
    };
  }
}

export async function searchPJeComunicacoes(dataDisponibilizacao?: string): Promise<LegalApiResult> {
  const date = dataDisponibilizacao || new Date().toISOString().slice(0, 10);
  const url = `https://comunicaapi.pje.jus.br/api/v1/comunicacao?data_disponibilizacao=${encodeURIComponent(date)}`;

  try {
    const res = await safeJsonFetch(url, 20000);
    if (res.ok) {
      const payload: any = await res.json();
      const items = payload?.items || [];
      return {
        success: true,
        source: "Comunica PJe",
        total: items.length,
        results: items.slice(0, 20),
        searchUrl: url,
      };
    }
  } catch {
    // fallback below
  }

  return {
    success: false,
    source: "Comunica PJe",
    error: "Falha ao consultar API pública no momento",
    searchUrl: url,
  };
}
