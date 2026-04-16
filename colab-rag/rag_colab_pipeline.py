#!/usr/bin/env python3
"""
RAG pipeline para Google Colab com foco em GPU.

Objetivos:
- Montar Google Drive automaticamente (quando em Colab)
- Ler arquivos (.md, .txt, .pdf)
- Chunking com configuracao similar ao projeto atual
- Gerar embeddings em GPU via sentence-transformers
- Persistir estado incremental (manifest)
- Salvar resultados em SQLite para consulta/reuso

Compatibilidade de dados:
- Tabelas inspiradas em `memoryEntries`, `documents` e `documentChunks`
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sqlite3
import sys
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

import numpy as np


SUPPORTED_EXTENSIONS = {".md", ".txt", ".pdf"}
LEGAL_BOUNDARIES = [
    re.compile(r"(?:^|\n)\s*(?=Art\.\s*\d)", re.IGNORECASE),
    re.compile(r"(?:^|\n)\s*(?=Arto\s*\d)", re.IGNORECASE),
    re.compile(r"(?:^|\n)\s*(?=Paragrafo\s*\d)", re.IGNORECASE),
    re.compile(r"(?:^|\n)\s*(?=CAPITULO\s+)", re.IGNORECASE),
    re.compile(r"(?:^|\n)\s*(?=SECAO\s+)", re.IGNORECASE),
    re.compile(r"(?:^|\n)\s*(?=TITULO\s+)", re.IGNORECASE),
]


@dataclass
class Chunk:
    chunk_index: int
    content: str
    metadata: Dict[str, str]


def now_iso() -> str:
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def mount_google_drive_if_needed(enabled: bool) -> None:
    if not enabled:
        return
    if "google.colab" not in sys.modules:
        print("[Colab] Nao esta no Google Colab; mount ignorado.")
        return
    from google.colab import drive  # type: ignore

    print("[Colab] Solicitando montagem do Google Drive...")
    drive.mount("/content/drive", force_remount=False)


def read_text_file(file_path: Path) -> str:
    raw = file_path.read_bytes()
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("latin1", errors="ignore")


def read_pdf_file(file_path: Path) -> str:
    from pypdf import PdfReader

    reader = PdfReader(str(file_path))
    pages: List[str] = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    return "\n".join(pages)


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("\x00", " ")).strip()


def split_legal_boundaries(text: str) -> List[str]:
    segments = [text]
    for pattern in LEGAL_BOUNDARIES:
        next_segments: List[str] = []
        for seg in segments:
            parts = [p for p in pattern.split(seg) if p.strip()]
            next_segments.extend(parts)
        segments = next_segments or segments
    return [s.strip() for s in segments if s.strip()]


def chunk_text(text: str, max_chars: int, overlap: int, min_chunk_chars: int) -> List[Chunk]:
    segments = split_legal_boundaries(text)
    out: List[Chunk] = []
    chunk_index = 0

    for segment in segments:
        if len(segment) <= max_chars:
            out.append(Chunk(chunk_index=chunk_index, content=segment, metadata={}))
            chunk_index += 1
            continue

        start = 0
        while start < len(segment):
            remaining = segment[start:]
            if len(remaining) <= max_chars:
                out.append(Chunk(chunk_index=chunk_index, content=remaining.strip(), metadata={}))
                chunk_index += 1
                break

            hard_end = start + max_chars
            cut = segment.rfind(" ", start, hard_end)
            if cut <= start + min_chunk_chars:
                cut = hard_end

            content = segment[start:cut].strip()
            if content:
                out.append(Chunk(chunk_index=chunk_index, content=content, metadata={}))
                chunk_index += 1

            start = max(cut - overlap, start + min_chunk_chars)

    return out


def list_candidate_files(input_dir: Path) -> List[Path]:
    files: List[Path] = []
    for path in input_dir.rglob("*"):
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            files.append(path)
    return sorted(files)


def load_manifest(path: Path) -> Dict:
    if not path.exists():
        return {"version": "1.0", "files": {}}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {"version": "1.0", "files": {}}


def save_manifest(path: Path, manifest: Dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(manifest, indent=2, ensure_ascii=True), encoding="utf-8")


def ensure_sqlite_schema(db_path: Path) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(db_path)
    try:
        con.executescript(
            """
            CREATE TABLE IF NOT EXISTS documents (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              source_path TEXT NOT NULL UNIQUE,
              file_hash TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'indexed',
              total_chunks INTEGER NOT NULL DEFAULT 0,
              indexed_chunks INTEGER NOT NULL DEFAULT 0,
              embedding_model TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS document_chunks (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              document_id INTEGER NOT NULL,
              chunk_index INTEGER NOT NULL,
              content TEXT NOT NULL,
              metadata TEXT,
              embedding TEXT,
              embedding_dimensions INTEGER,
              created_at TEXT NOT NULL,
              FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE,
              UNIQUE(document_id, chunk_index)
            );

            CREATE TABLE IF NOT EXISTS memory_entries (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              source_path TEXT,
              content TEXT NOT NULL,
              keywords TEXT,
              embedding TEXT,
              type TEXT NOT NULL DEFAULT 'context',
              created_at TEXT NOT NULL,
              accessed_at TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_doc_source_path ON documents(source_path);
            CREATE INDEX IF NOT EXISTS idx_chunks_doc ON document_chunks(document_id);
            """
        )
        con.commit()
    finally:
        con.close()


def upsert_document_with_chunks(
    db_path: Path,
    user_id: int,
    source_path: str,
    file_hash: str,
    model_name: str,
    chunks: List[Chunk],
    embeddings: np.ndarray,
) -> None:
    ts = now_iso()
    con = sqlite3.connect(db_path)
    try:
        cur = con.cursor()

        cur.execute("SELECT id FROM documents WHERE source_path = ?", (source_path,))
        row = cur.fetchone()

        if row is None:
            cur.execute(
                """
                INSERT INTO documents (source_path, file_hash, status, total_chunks, indexed_chunks, embedding_model, created_at, updated_at)
                VALUES (?, ?, 'indexed', ?, ?, ?, ?, ?)
                """,
                (source_path, file_hash, len(chunks), len(chunks), model_name, ts, ts),
            )
            if cur.lastrowid is None:
                raise RuntimeError("Falha ao inserir documento no SQLite")
            document_id = int(cur.lastrowid)
        else:
            document_id = int(row[0])
            cur.execute(
                """
                UPDATE documents
                SET file_hash = ?, status = 'indexed', total_chunks = ?, indexed_chunks = ?, embedding_model = ?, updated_at = ?
                WHERE id = ?
                """,
                (file_hash, len(chunks), len(chunks), model_name, ts, document_id),
            )
            cur.execute("DELETE FROM document_chunks WHERE document_id = ?", (document_id,))

        for chunk, emb in zip(chunks, embeddings):
            emb_json = json.dumps(emb.tolist(), ensure_ascii=True)
            metadata_json = json.dumps(chunk.metadata, ensure_ascii=True)
            cur.execute(
                """
                INSERT INTO document_chunks (document_id, chunk_index, content, metadata, embedding, embedding_dimensions, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (document_id, chunk.chunk_index, chunk.content, metadata_json, emb_json, int(emb.shape[0]), ts),
            )

            memory_text = f"[PIPELINE] Fonte: {source_path}\nChunk: {chunk.chunk_index}\nConteudo: {chunk.content}"
            cur.execute(
                """
                INSERT INTO memory_entries (user_id, source_path, content, keywords, embedding, type, created_at, accessed_at)
                VALUES (?, ?, ?, ?, ?, 'context', ?, ?)
                """,
                (user_id, source_path, memory_text, "pipeline, rag, colab", emb_json, ts, ts),
            )

        con.commit()
    finally:
        con.close()


def load_embedder(model_name: str):
    import torch
    from sentence_transformers import SentenceTransformer  # type: ignore

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"[Embedder] device={device} model={model_name}")
    model = SentenceTransformer(model_name, device=device)
    return model


def encode_chunks(model, texts: Iterable[str], batch_size: int) -> np.ndarray:
    vectors = model.encode(
        list(texts),
        batch_size=batch_size,
        convert_to_numpy=True,
        normalize_embeddings=True,
        show_progress_bar=False,
    )
    return np.asarray(vectors, dtype=np.float32)


def run_pipeline(args: argparse.Namespace) -> None:
    mount_google_drive_if_needed(args.mount_drive)

    input_dir = Path(args.input_dir).expanduser().resolve()
    output_dir = Path(args.output_dir).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    manifest_path = output_dir / "manifest.json"
    db_path = output_dir / "rag_colab.sqlite"
    log_path = output_dir / "run-report.md"

    if not input_dir.is_dir():
        raise FileNotFoundError(f"Pasta de entrada nao encontrada: {input_dir}")

    ensure_sqlite_schema(db_path)
    manifest = load_manifest(manifest_path)
    state_files: Dict[str, Dict] = manifest.setdefault("files", {})

    candidates = list_candidate_files(input_dir)
    if args.max_files_per_run > 0:
        candidates = candidates[: args.max_files_per_run]

    print(f"[Pipeline] arquivos candidatos: {len(candidates)}")
    model = load_embedder(args.embedding_model)

    handled = 0
    imported_chunks = 0
    report = [
        "# RAG Colab Run Report",
        "",
        f"- inicio: {now_iso()}",
        f"- input_dir: {input_dir}",
        f"- output_dir: {output_dir}",
        f"- phase: {args.phase}",
        f"- model: {args.embedding_model}",
        "",
    ]

    for file_path in candidates:
        rel_path = str(file_path.relative_to(input_dir)).replace("\\", "/")
        raw = file_path.read_bytes()
        file_hash = sha256_bytes(raw)
        previous = state_files.get(rel_path, {})

        if previous.get("file_hash") == file_hash and previous.get("status") == "indexed":
            report.append(f"- SKIP {rel_path} (sem mudanca)")
            continue

        handled += 1
        if file_path.suffix.lower() == ".pdf":
            extracted = read_pdf_file(file_path)
        else:
            extracted = read_text_file(file_path)

        cleaned = normalize_text(extracted)
        if not cleaned:
            state_files[rel_path] = {
                "file_hash": file_hash,
                "status": "failed",
                "error": "sem texto extraido",
                "updated_at": now_iso(),
            }
            report.append(f"- FAIL {rel_path} (sem texto extraido)")
            continue

        chunks = chunk_text(
            cleaned,
            max_chars=args.chunk_size,
            overlap=args.chunk_overlap,
            min_chunk_chars=args.min_chunk_chars,
        )
        if not chunks:
            report.append(f"- FAIL {rel_path} (sem chunks)")
            continue

        if args.phase in {"embed", "import", "all"}:
            texts = [c.content for c in chunks]
            vectors = encode_chunks(model, texts, batch_size=args.batch_size)

            if args.max_chunks_per_run > 0 and vectors.shape[0] > args.max_chunks_per_run:
                vectors = vectors[: args.max_chunks_per_run]
                chunks = chunks[: args.max_chunks_per_run]

            if args.phase in {"embed", "import", "all"}:
                upsert_document_with_chunks(
                    db_path=db_path,
                    user_id=args.user_id,
                    source_path=rel_path,
                    file_hash=file_hash,
                    model_name=args.embedding_model,
                    chunks=chunks,
                    embeddings=vectors,
                )
                imported_chunks += len(chunks)

            state_files[rel_path] = {
                "file_hash": file_hash,
                "status": "indexed",
                "total_chunks": len(chunks),
                "indexed_chunks": len(chunks),
                "updated_at": now_iso(),
            }
            report.append(f"- OK {rel_path} ({len(chunks)} chunks)")

            if args.max_imports_per_run > 0 and imported_chunks >= args.max_imports_per_run:
                report.append("- Limite de importacao por execucao atingido")
                break

    save_manifest(manifest_path, manifest)
    report.extend(
        [
            "",
            "## Resumo",
            f"- arquivos tratados: {handled}",
            f"- chunks importados: {imported_chunks}",
            f"- sqlite: {db_path}",
            f"- manifest: {manifest_path}",
        ]
    )
    log_path.write_text("\n".join(report), encoding="utf-8")

    print(f"[Pipeline] finalizado. sqlite={db_path}")
    print(f"[Pipeline] report={log_path}")


def run_query(args: argparse.Namespace) -> None:
    mount_google_drive_if_needed(args.mount_drive)

    db_path = Path(args.output_dir).expanduser().resolve() / "rag_colab.sqlite"
    if not db_path.exists():
        raise FileNotFoundError(f"Banco SQLite nao encontrado: {db_path}")

    model = load_embedder(args.embedding_model)
    q_vec = encode_chunks(model, [args.query], batch_size=1)[0]

    con = sqlite3.connect(db_path)
    try:
        rows = con.execute(
            "SELECT d.source_path, c.chunk_index, c.content, c.embedding FROM document_chunks c "
            "JOIN documents d ON d.id = c.document_id"
        ).fetchall()
    finally:
        con.close()

    scored: List[Tuple[float, str, int, str]] = []
    for source_path, chunk_index, content, embedding_json in rows:
        if not embedding_json:
            continue
        emb = np.asarray(json.loads(embedding_json), dtype=np.float32)
        score = float(np.dot(q_vec, emb))
        scored.append((score, source_path, int(chunk_index), content))

    scored.sort(key=lambda x: x[0], reverse=True)
    top = scored[: args.top_k]

    print(f"[Query] resultados para: {args.query}")
    for score, source_path, chunk_index, content in top:
        preview = content[:280].replace("\n", " ")
        print(f"- score={score:.4f} fonte={source_path} chunk={chunk_index}")
        print(f"  {preview}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="RAG pipeline para Google Colab")
    parser.add_argument("--phase", choices=["embed", "import", "all", "query"], default="all")
    parser.add_argument("--mount-drive", action="store_true", default=False)
    parser.add_argument("--input-dir", default="/content/drive/MyDrive/AVA_RAG/input")
    parser.add_argument("--output-dir", default="/content/drive/MyDrive/AVA_RAG/output")
    parser.add_argument("--embedding-model", default="sentence-transformers/paraphrase-multilingual-mpnet-base-v2")
    parser.add_argument("--batch-size", type=int, default=16)
    parser.add_argument("--user-id", type=int, default=1)

    parser.add_argument("--max-files-per-run", type=int, default=0)
    parser.add_argument("--max-chunks-per-run", type=int, default=0)
    parser.add_argument("--max-imports-per-run", type=int, default=0)

    parser.add_argument("--chunk-size", type=int, default=2000)
    parser.add_argument("--chunk-overlap", type=int, default=200)
    parser.add_argument("--min-chunk-chars", type=int, default=500)

    parser.add_argument("--query", default="")
    parser.add_argument("--top-k", type=int, default=5)
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    t0 = time.time()
    if args.phase == "query":
        if not args.query.strip():
            raise ValueError("Use --query quando --phase=query")
        run_query(args)
    else:
        run_pipeline(args)
    dt = time.time() - t0
    print(f"[Done] elapsed={dt:.1f}s")


if __name__ == "__main__":
    main()
