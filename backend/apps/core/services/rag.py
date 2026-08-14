"""RAG pipeline for Brand Memory.

The four classic steps, each deliberately small and readable so this doubles
as a learning resource:

  1. CHUNK    — split a document into overlapping pieces
  2. EMBED    — turn each chunk into a vector (Gemini, or deterministic mock)
  3. STORE    — save chunk + vector in the database
  4. RETRIEVE — rank chunks by cosine similarity to the query
  5. GENERATE — answer the query grounded in the retrieved chunks

Retrieval here is pure Python. The production upgrade is pgvector, which
replaces step 4 with a single SQL query:
    SELECT content, embedding <=> %s AS distance FROM ... ORDER BY distance
The math is identical (cosine distance); pgvector just does it with an index.
"""
import math
import re

from apps.core.models import BrandDocument, DocumentChunk
from apps.core.services import llm


# --- 1. CHUNK ---------------------------------------------------------------

def chunk_text(text: str, chunk_size: int = 900, overlap: int = 150) -> list[str]:
    """Split text into chunks of ~chunk_size chars with `overlap` of context.

    Overlap stops a sentence from being cut off mid-thought and preserves
    context across chunk boundaries — a classic RAG gotcha.
    """
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+|\n+', text.strip()) if s.strip()]
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0

    for sentence in sentences:
        if current_len + len(sentence) > chunk_size and current:
            chunks.append(' '.join(current))
            # Keep the tail of the previous chunk as overlap for the next one.
            kept: list[str] = []
            kept_len = 0
            for prev in reversed(current):
                if kept_len + len(prev) > overlap:
                    break
                kept.append(prev)
                kept_len += len(prev) + 1
            current = list(reversed(kept))
            current_len = kept_len
        current.append(sentence)
        current_len += len(sentence) + 1

    if current:
        chunks.append(' '.join(current))
    return chunks or [text]


# --- 2+3. EMBED & STORE -----------------------------------------------------

def index_document(document: BrandDocument) -> int:
    """Chunk + embed + store a document. Returns the number of chunks written."""
    DocumentChunk.objects.filter(document=document).delete()
    chunks = chunk_text(document.content)
    embeddings = llm.embed_many(chunks)
    DocumentChunk.objects.bulk_create([
        DocumentChunk(document=document, content=text, embedding=vector)
        for text, vector in zip(chunks, embeddings)
    ])
    return len(chunks)


# --- 4. RETRIEVE -------------------------------------------------------------

def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Cosine similarity = dot product / product of norms.

    This is exactly what pgvector's `<=>` operator computes internally.
    """
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return dot / (norm_a * norm_b)


def retrieve(query: str, top_k: int = 5) -> list[dict]:
    """Return the top_k most similar chunks to `query` as dicts.

    Each dict: {content, score, document_title, chunk_id}. Scores are 0-1
    cosine similarity (higher = more relevant).
    """
    query_vector = llm.embed(query)
    scored = [
        {
            'chunk_id': chunk.id,
            'content': chunk.content,
            'document_title': chunk.document.title,
            'score': cosine_similarity(query_vector, chunk.embedding),
        }
        for chunk in DocumentChunk.objects.select_related('document').all()
    ]
    scored.sort(key=lambda item: item['score'], reverse=True)
    return scored[:top_k]


# --- 5. GENERATE --------------------------------------------------------------

def answer(question: str, top_k: int = 5) -> tuple[str, list[dict]]:
    """Answer `question` grounded in the brand's indexed documents.

    Returns (answer_text, sources) where sources is the retrieved chunk list
    so the frontend can cite where the answer came from.
    """
    sources = retrieve(question, top_k=top_k)
    if not sources:
        return (
            'No brand documents are indexed yet. Upload brand guidelines or '
            'product copy via POST /api/brand-memory/documents/ first.',
            [],
        )

    context = '\n\n'.join(
        f'[Document: {s["document_title"]}]\n{s["content"]}' for s in sources
    )
    prompt = (
        f'Question: {question}\n\n'
        f'Relevant brand material:\n{context}\n\n'
        'Answer the question using ONLY the material above. If the material '
        'does not contain the answer, say so. Cite which document you used.'
    )
    system = (
        'You are the brand-memory assistant for Agent.ai, an AI social media '
        'marketing agent. Be concise and helpful.'
    )

    if llm.llm_enabled():
        answer_text = llm.generate(prompt, system=system)
    else:
        # Deterministic mock so the endpoint is demoable without an API key.
        best = sources[0]
        answer_text = (
            f'Mock answer (set GEMINI_API_KEY for real AI): based on '
            f'"{best["document_title"]}", the most relevant material is: '
            f'{best["content"][:200]}…'
        )

    return answer_text, sources
