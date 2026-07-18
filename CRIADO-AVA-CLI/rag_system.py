"""
RAG System para indexação de conteúdo do diretório CRIADO-AVA-CLI
Otimizado para nomic-embed-text:latest (274 MB)
"""

import os
import json
import hashlib
import re
from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass, field, asdict
import time

# Configurações
RAG_DIR = Path(__file__).parent / ".rag_data"
CHUNK_SIZE_TOKENS = 256  # Tamanho do chunk otimizado para embed
CHUNK_OVERLAP = 32
MAX_FILE_SIZE_MB = 500  # Ignorar arquivos muito grandes
TARGET_EMBED_SIZE = 768  # Dimensão alvo para o embedding

# Extensões a processar
ALLOWED_EXTENSIONS = {'.md', '.txt', '.html'}
IGNORED_PATTERNS = {
    'Output',
    'Binaries',
    'Intermediate',
    '.exe',
    '.zip',
    '.pdf'
}

@dataclass
class Chunk:
    id: str
    content: str
    source_file: str
    start_line: int
    end_line: int
    tokens: int
    timestamp: float = field(default_factory=time.time)

@dataclass 
class Document:
    id: str
    file_path: str
    content: str
    metadata: Dict = field(default_factory=dict)
    chunks: List[Chunk] = field(default_factory=list)

class ChunkSplitter:
    """Divide conteúdo em chunks otimizados"""
    
    def __init__(self, max_tokens: int = CHUNK_SIZE_TOKENS, overlap: int = CHUNK_OVERLAP):
        self.max_tokens = max_tokens
        self.overlap = overlap
    
    def split_text(self, text: str) -> List[str]:
        """Divide texto em chunks"""
        lines = text.split('\n')
        chunks = []
        current_chunk = []
        current_token_count = 0
        
        for line in lines:
            line_tokens = len(line.split())
            
            if current_token_count + line_tokens > self.max_tokens and current_chunk:
                chunks.append('\n'.join(current_chunk))
                # Retroceder para overlap
                overlap_lines = []
                overlap_tokens = 0
                fori in range(len(current_chunk) - 1, -1, -1):
                    line_tokens = len(current_chunk[i].split())
                    if overlap_tokens + line_tokens <= self.overlap:
                        overlap_lines.insert(0, current_chunk[i])
                        overlap_tokens += line_tokens
                    else:
                        break
                current_chunk = overlap_lines
                current_token_count = overlap_tokens
            
            current_chunk.append(line)
            current_token_count += line_tokens
        
        if current_chunk:
            chunks.append('\n'.join(current_chunk))
        
        return chunks
    
    def split_by_context(self, text: str) -> List[str]:
        """Divide por contexto lógico (seções de Blueprint)"""
        # Split por Begin Object (estrutura Blueprint)
        sections = re.split(r'Begin Object', text)
        
        chunks = []
        current_chunk = ""
        
        for section in sections:
            if not section.strip():
                continue
            
            # Tenta manter cada Begin Object completo
            candidate = current_chunk + "\nBegin Object" + section
            
            if len(candidate.split()) > self.max_tokens:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = "Begin Object" + section
            else:
                current_chunk = candidate
        
        if current_chunk:
            chunks.append(current_chunk)
        
        return chunks

class FileProcessor:
    """Processa arquivos do diretório"""
    
    def __init__(self, base_dir: Path):
        self.base_dir = base_dir
        self.splitter = ChunkSplitter()
    
    def should_process_file(self, file_path: Path) -> bool:
        """Verifica se o arquivo deve ser processado"""
        # Ignora arquivos muito grandes
        if file_path.stat().st_size > MAX_FILE_SIZE_MB * 1024 * 1024:
            return False
        
        # Ignora extensões não permitidas
        if file_path.suffix.lower() not in ALLOWED_EXTENSIONS:
            return False
        
        # Ignora padrões específicos
        path_str = str(file_path)
        for pattern in IGNORED_PATTERNS:
            if pattern.lower() in path_str.lower():
                return False
        
        return True
    
    def read_file_content(self, file_path: Path) -> str:
        """Lê conteúdo do arquivo com tratamento de erros"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except UnicodeDecodeError:
            try:
                with open(file_path, 'r', encoding='latin-1') as f:
                    return f.read()
            except:
                return ""
        except Exception as e:
            print(f"Erro ao ler {file_path}: {e}")
            return ""
    
    def process_file(self, file_path: Path) -> Optional[Document]:
        """Processa um único arquivo"""
        if not self.should_process_file(file_path):
            return None
        
        content = self.read_file_content(file_path)
        if not content.strip():
            return None
        
        # Gerar ID único
        content_hash = hashlib.md5(content.encode()).hexdigest()[:12]
        doc_id = f"doc_{content_hash}"
        
        # Processar chunks
        chunks_content = self.splitter.split_by_context(content)
        
        # Criar document
        doc = Document(
            id=doc_id,
            file_path=str(file_path),
            content=content,
            metadata={
                "filename": file_path.name,
                "size": file_path.stat().st_size,
                "extension": file_path.suffix
            }
        )
        
        # Criar chunks
        line_positions = self._get_line_positions(content)
        start_idx = 0
        
        for chunk_content in chunks_content:
            end_idx = start_idx + len(chunk_content.split('\n'))
            chunk_id = f"{doc_id}_chunk_{start_idx}"
            
            chunk = Chunk(
                id=chunk_id,
                content=chunk_content,
                source_file=str(file_path),
                start_line=line_positions.get(start_idx, 1),
                end_line=line_positions.get(end_idx, len(content.split('\n'))),
                tokens=len(chunk_content.split())
            )
            doc.chunks.append(chunk)
            start_idx = end_idx
        
        return doc
    
    def _get_line_positions(self, text: str) -> Dict[int, int]:
        """Mapeia índices de chunks para números de linha"""
        lines = text.split('\n')
        positions = {0: 1}
        for i, line in enumerate(lines):
            positions[i] = i + 1
        return positions
    
    def process_all(self) -> List[Document]:
        """Processa todos os arquivos do diretório"""
        documents = []
        
        for file_path in self.base_dir.rglob('*'):
            if file_path.is_file():
                doc = self.process_file(file_path)
                if doc:
                    documents.append(doc)
                    print(f"Processado: {file_path.name} ({len(doc.chunks)} chunks)")
        
        return documents

class RAGIndexer:
    """Indexa documentos para RAG"""
    
    def __init__(self, index_dir: Path = RAG_DIR):
        self.index_dir = index_dir
        self.index_dir.mkdir(exist_ok=True)
        self.chunks_file = self.index_dir / "chunks.json"
        self.embeddings_file = self.index_dir / "embeddings.npy"
        
    def index(self, documents: List[Document]):
        """Indexa documentos"""
        all_chunks = []
        
        for doc in documents:
            for chunk in doc.chunks:
                chunk_data = asdict(chunk)
                chunk_data['doc_id'] = doc.id
                all_chunks.append(chunk_data)
        
        # Salvar chunks
        with open(self.chunks_file, 'w', encoding='utf-8') as f:
            json.dump(all_chunks, f, ensure_ascii=False, indent=2)
        
        print(f"Total de chunks indexados: {len(all_chunks)}")
        print(f"Chunks salvos em: {self.chunks_file}")
        
        return all_chunks

def main():
    """Função principal"""
    print("=" * 60)
    print("SISTEMA RAG - Processamento de Documentos")
    print("=" * 60)
    
    base_dir = Path(r"C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\CRIADO-AVA-CLI")
    rag_dir = Path(__file__).parent / ".rag_data"
    
    print(f"\nDiretório base: {base_dir}")
    print(f"Diretório de saída: {rag_dir}")
    
    # Processar arquivos
    print("\n[1/3] Processando arquivos...")
    processor = FileProcessor(base_dir)
    documents = processor.process_all()
    print(f"Total de documentos processados: {len(documents)}")
    
    # Indexar
    print("\n[2/3] Indexando chunks...")
    indexer = RAGIndexer(rag_dir)
    chunks = indexer.index(documents)
    
    # Resumo
    print("\n[3/3] Resumo")
    print("-" * 60)
    total_size = sum(c.tokens for c in chunks)
    print(f"Total de tokens: {total_size:,}")
    print(f"Total de chunks: {len(chunks)}")
    print(f"Tamanho médio do chunk: {total_size/len(chunks):.0f} tokens")
    print("\nPróximo passo: Criar sistema de query com Ollama")
    
    return rag_dir

if __name__ == "__main__":
    main()
