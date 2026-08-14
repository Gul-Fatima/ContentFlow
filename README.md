# Agent.ai — AI Social Media Marketing Agent

A full-stack MVP for your marketing team.

- **Frontend**: React + Vite + TypeScript + Tailwind (imported from a Figma UI, cleaned up and re-themed)
- **Backend**: Python + Django + Django REST Framework
- **AI**: Google Gemini (free tier) with a deterministic **mock fallback** so everything runs with zero API keys
- **Deployment**: Docker Compose (Postgres + backend), free-tier PaaS (Render/Railway) ready

---

## Project layout

```
├── src/                  # React frontend (Vite)
│   ├── pages/            # Landing, Dashboard, ApprovalInbox, BrandMemory, ...
│   ├── components/       # layout (Sidebar, Header) + ui primitives (Button, Card, ...)
│   └── lib/              # utils (cn)
├── backend/              # Django project
│   ├── config/           # settings, urls, wsgi/asgi
│   ├── apps/core/        # models, API views, serializers
│   │   └── services/     # llm.py (Gemini + mock) and rag.py (the RAG pipeline)
│   └── manage.py
└── docker-compose.yml    # Postgres (pgvector) + backend
```

## Quick start — frontend

```bash
npm install
npm run dev        # http://localhost:5173
```

The UI is fully functional with mock data. Quality gates:

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Quick start — backend

Requires Python 3.11+.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # optional; defaults work without it
python manage.py migrate
python manage.py seed_demo       # demo goals, personas, one indexed brand doc
python manage.py runserver       # http://localhost:8000
```

The API runs in **mock AI mode** until you add a Gemini key (see below). Every
endpoint works; answers/plans are deterministic stand-ins.

### Main API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/api/goals/` | List / create goals |
| POST | `/api/goals/generate/` | Goal → tasks + content drafts (uses brand voice + RAG context) |
| GET/POST | `/api/tasks/` | Tasks |
| GET/POST | `/api/content/` | AI drafts awaiting approval |
| POST | `/api/content/{id}/approve/` `/reject/` | Approve / reject a draft |
| GET/PUT | `/api/brand-memory/voice/` | Brand voice config |
| GET/POST | `/api/brand-memory/documents/` | List / ingest a brand document (**chunks + embeds it**) |
| POST | `/api/brand-memory/query/` | **RAG query**: retrieve + generate a grounded answer with sources |
| GET/POST | `/api/personas/` | Audience personas |
| POST | `/api/auth/register/` `/api/auth/token/` | Simple token auth |

## Turn on real AI (free)

1. Get a free API key at <https://aistudio.google.com/apikey> (no credit card).
2. Add it to `backend/.env`:

   ```
   GEMINI_API_KEY=your-key-here
   ```

One key covers both **generation** (gemini-2.0-flash) and **embeddings**
(text-embedding-004). Re-run `python manage.py seed_demo` or re-ingest documents
to replace mock embeddings with real ones.

## The RAG pipeline 

Read `backend/apps/core/services/rag.py` top to bottom — it's the whole loop in
~120 readable lines:

1. **Chunk** — `chunk_text()` splits a document into overlapping pieces.
2. **Embed** — each chunk becomes a vector (`llm.embed_many`).
3. **Store** — chunk + vector saved as `DocumentChunk` rows.
4. **Retrieve** — `retrieve()` ranks chunks by **cosine similarity** to your
   query (`cosine_similarity()` is ~10 lines of pure math).
5. **Generate** — `answer()` feeds the top-k chunks into the LLM as context so
   the answer is grounded in *your* documents (no hallucinations from thin air).

Try it: ingest a document, then `POST /api/brand-memory/query/` and inspect the
`sources` array — that's retrieval working.

### Upgrading to a real vector database (pgvector)

Today retrieval scans chunks in Python — perfect for learning and small MVPs.
For production, swap step 4 for pgvector, which does the **same cosine math**
with an index:

```sql
SELECT content, embedding <=> %s AS distance
FROM core_documentchunk
ORDER BY distance LIMIT 5;
```

`docker-compose.yml` already uses the `pgvector/pgvector:pg16` image, so the
extension is ready when you are. Steps: add a `vector(768)` column (migration
with `CreateExtension('vector')`), drop the JSON embedding column, and run the
query above in `retrieve()`.

## Deployment

### Option A — Docker Compose (self-host)

```bash
cd backend && cp .env.example .env   # fill in SECRET_KEY, GEMINI_API_KEY
docker compose up --build
```

Brings up Postgres (pgvector) + backend at http://localhost:8000. The backend
runs migrations + seeds demo data on boot.

### Option B — free-tier PaaS (Render / Railway)

1. Push this repo to GitHub.
2. Create a **Postgres** database (both platforms have a free tier).
3. Create a **Web Service** from the repo root:
   - Build: `docker build -t agentai-backend ./backend` (or use the Dockerfile)
   - Or run natively: root dir `backend/`, build command
     `pip install -r requirements.txt`, start command
     `python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:8000`
4. Set env vars: `SECRET_KEY`, `DEBUG=False`, `DATABASE_URL` (from your Postgres),
   `GEMINI_API_KEY`, `CORS_ALLOWED_ORIGINS` (your frontend URL).

Frontend: build with `npm run build` and host `dist/` on Vercel/Netlify (free),
or serve it from nginx in the same container later.

## Suggested learning path

1. ✅ Frontend clean-up + design tokens (`brand-*` colors in `tailwind.config.js`)
2. ✅ Django REST API matching the UI (goals, tasks, content, personas)
3. ✅ Brand Memory as real RAG (chunk → embed → retrieve → generate)
4. ▶ Wire the frontend to the API (replace mock data with `fetch` calls)
5. ▶ Replace mock AI with your Gemini key and compare answers
6. ▶ Swap in-memory retrieval for pgvector
7. ▶ Add real auth (JWT or Django sessions) and per-user data
8. ▶ Deploy + add payments/Stripe for the SaaS loop
