import { getDb } from "../db";

export type DbOpsArgs = {
  query: string;
  mode?: "read" | "write";
  dry_run?: boolean;
  confirmed?: boolean;
};

function isReadOnlySql(query: string): boolean {
  const q = query.trim().toLowerCase();
  return q.startsWith("select") || q.startsWith("pragma") || q.startsWith("with");
}

export async function runDbOps(args: DbOpsArgs): Promise<string> {
  const query = String(args.query || "").trim();
  if (!query) throw new Error("query obrigatoria para db_ops");

  const mode = args.mode || "read";
  if (args.dry_run) {
    return `[DRY-RUN] db_ops ${mode} ${query.slice(0, 120)}`;
  }

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (mode === "read") {
    if (!isReadOnlySql(query)) {
      throw new Error("Modo read aceita apenas SELECT/PRAGMA/WITH");
    }
    const rows = await (db as any).run(sql`${sql.raw(query)}` as any);
    return JSON.stringify(rows);
  }

  if (!args.confirmed) {
    throw new Error("Writes exigem confirmed=true");
  }

  const tx = (db as any).transaction((rawQuery: string) => {
    return (db as any).run(rawQuery);
  });

  const result = tx(query);
  return JSON.stringify(result);
}

import { sql } from "drizzle-orm";
