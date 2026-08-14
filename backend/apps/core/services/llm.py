"""LLM and embedding access.

Primary: Google Gemini via the `google-genai` SDK. The free tier
(https://aistudio.google.com/apikey) gives you real generation AND real
embeddings with a single key and no credit card.

Fallback: if GEMINI_API_KEY is not set, `generate()` returns a deterministic
mock response and `embed()` returns a deterministic hashing-trick vector, so
every feature (including RAG retrieval) works end-to-end for development.
"""
import hashlib
import math
import os
import re

from google import genai
from google.genai import types as genai_types

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
GEMINI_MODEL = os.environ.get('GEMINI_MODEL', 'gemini-2.0-flash')
GEMINI_EMBED_MODEL = os.environ.get('GEMINI_EMBED_MODEL', 'text-embedding-004')
EMBED_DIM = 768  # text-embedding-004 output dimensionality

_client = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def llm_enabled() -> bool:
    """True when a real LLM is configured; False means mock mode."""
    return bool(GEMINI_API_KEY)


def generate(prompt: str, system: str = '') -> str:
    """Generate text. Uses Gemini when configured, otherwise a mock."""
    if not llm_enabled():
        return _mock_generate(prompt, system)
    client = _get_client()
    config = None
    if system:
        config = genai_types.GenerateContentConfig(system_instruction=system)
    response = client.models.generate_content(model=GEMINI_MODEL, contents=prompt, config=config)
    return response.text or ''


def embed(text: str) -> list[float]:
    """Return a normalized embedding vector for `text`."""
    if not llm_enabled():
        return _mock_embed(text)
    client = _get_client()
    response = client.models.embed_content(model=GEMINI_EMBED_MODEL, contents=[text])
    return [float(v) for v in response.embeddings[0].values]


def embed_many(texts: list[str]) -> list[list[float]]:
    """Batch embed. Uses the real API when available (more efficient), else mocks."""
    if not llm_enabled():
        return [_mock_embed(t) for t in texts]
    client = _get_client()
    response = client.models.embed_content(model=GEMINI_EMBED_MODEL, contents=texts)
    return [[float(v) for v in item.values] for item in response.embeddings]


# --- Mock implementations ---------------------------------------------------

def _mock_generate(prompt: str, system: str = '') -> str:
    """Deterministic stand-in so the API is testable without a key.

    For structured tasks (plan generation) views detect mock mode and return
    a canned plan instead of parsing this text.
    """
    digest = hashlib.sha256(prompt.encode()).hexdigest()
    suffix = digest[:8]
    return (
        f'Mock response ({suffix}). Configure GEMINI_API_KEY in backend/.env '
        'to get real AI-generated content.'
    )


def _mock_embed(text: str) -> list[float]:
    """Hashing-trick embedding: word -> fixed pseudo-random vector direction.

    Not semantically meaningful like a real embedding model, but similar texts
    share tokens, so cosine similarity still ranks related chunks first —
    enough to demo and test the full RAG loop without any API.
    """
    vec = [0.0] * EMBED_DIM
    for token in re.findall(r'\w+', text.lower()):
        h = int(hashlib.sha256(token.encode()).hexdigest(), 16)
        index = h % EMBED_DIM
        sign = 1.0 if (h >> 8) % 2 == 0 else -1.0
        vec[index] += sign
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]
