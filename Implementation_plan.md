# Ibda' — AI Social Media Marketing Agent

A full-stack, **three-tier** application: a universal **Expo** client (iOS, Android
and web from one codebase) on top of a **Django REST** API backed by **Postgres +
pgvector**.

---

## Architecture (three tiers)

```
┌───────────────────────────────────────────────────────────────────────┐
│  PRESENTATION TIER — Expo SDK 57 (universal)                          │
│                                                                       │
│   iOS  ─┐                                                             │
│ Android ─┼─▶  app/  (Expo Router, file-based routes)                  │
│   Web  ─┘      └─ NativeWind (Tailwind) → shared UI, one codebase      │
└───────────────────────────────┬───────────────────────────────────────┘
                                │  HTTPS · JSON · JWT bearer token
┌───────────────────────────────▼───────────────────────────────────────┐
│  APPLICATION TIER — Django 5 + Django REST Framework (containerised)  │
│                                                                       │
│   apps/core/          models · serializers · API views                │
│   services/llm.py     Gemini + deterministic mock fallback            │
│   services/rag.py     chunk → embed → retrieve → generate             │
└───────────────────────────────┬───────────────────────────────────────┘
                                │  DATABASE_URL (psycopg)
┌───────────────────────────────▼───────────────────────────────────────┐
│  DATA TIER — managed Postgres with the pgvector extension             │
│                                                                       │
│   Tiger Cloud (chosen provider) · vector(768) column · HNSW index     │
└───────────────────────────────────────────────────────────────────────┘
```

The whole stack is intended to be **containerised and deployed by a CI/CD
pipeline** (see [Deployment & CI/CD](#deployment--cicd)).

---

## Tech stack

| Layer | Technology |
|---|---|
| Client | **Expo SDK 57**, React Native 0.86, React 19.2, TypeScript 5.9 |
| Routing | **Expo Router 57** — file-based routes, typed routes, deep linking |
| Styling | **NativeWind 4** (Tailwind classes → native + web), `brand-*` tokens |
| Animation | React Native `Animated` (see [`FadeIn`](src/components/ui/FadeIn.tsx)) |
| Icons | `lucide-react-native` |
| UI extras | `@react-native-community/slider`, `expo-linear-gradient` |
| API | **Django 5 + DRF**, `google-genai` (Gemini), `dj-database-url`, CORS |
| AI | Gemini free tier (`gemini-2.0-flash` + `text-embedding-004`) or **mock fallback** |
| Database | Postgres + **pgvector** in production · SQLite for zero-setup local dev |
| Containers | Docker + Docker Compose |

---

## Repository layout

```
├── app/                        # Expo Router routes (the presentation tier)
│   ├── _layout.tsx             # Root layout: NativeWind, gesture + safe-area providers
│   ├── index.tsx               # Landing page (public)
│   ├── demo.tsx                # Watch Demo (public)
│   └── (app)/                  # Authenticated app shell — drawer navigation
│       ├── _layout.tsx         # Drawer + custom Sidebar content
│       ├── dashboard.tsx
│       ├── approval.tsx
│       ├── scheduler.tsx
│       ├── memory.tsx
│       ├── analytics.tsx
│       ├── pricing.tsx
│       ├── profile.tsx
│       └── notifications.tsx
├── src/
│   ├── components/layout/      # Header, Screen shell, Sidebar (drawer content)
│   ├── components/ui/          # Button, Card, Badge, Avatar, Input, Textarea,
│   │                           #   Tabs, Grid, Gradient, FadeIn
│   ├── lib/                    # `cn()` helper, raw theme palette
│   └── types/                  # Shared domain types
├── global.css                  # Tailwind entry point for NativeWind
├── tailwind.config.js          # `brand-*` design tokens (re-themes everything)
├── app.json                    # Expo config (scheme, platforms, plugins)
├── metro.config.js             # Metro + NativeWind
├── babel.config.js             # babel-preset-expo + nativewind
├── backend/                    # Django project (application + data tier)
│   ├── config/                 # settings, urls, wsgi/asgi
│   ├── apps/core/              # models, API views, serializers
│   │   └── services/           # llm.py (Gemini + mock), rag.py (RAG pipeline)
│   ├── Dockerfile
│   └── manage.py
└── docker-compose.yml          # Postgres (pgvector) + backend
```

---

## Quick start — client

```bash
npm install
npm start          # Expo dev server → press i / a / w, or scan the QR code
```

Individual targets:

```bash
npm run web        # web (react-native-web) — http://localhost:8081
npm run ios        # iOS simulator
npm run android    # Android emulator
```

The UI is fully functional on **mock data** — no backend required to explore it.

Quality gates:

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # expo lint
npm run build:web  # static web export → dist/
```

> **Note:** a physical device cannot reach `localhost`. When you wire the API up,
> point the client at your machine's LAN address (or a tunnel), not `127.0.0.1`.

---

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

The API runs in **mock AI mode** until you add a Gemini key. Every endpoint works;
answers/plans are deterministic stand-ins.

### Main API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/api/goals/` | List / create goals |
| POST | `/api/goals/generate/` | Goal → tasks + content drafts (brand voice + RAG context) |
| GET/POST | `/api/tasks/` | Tasks |
| GET/POST | `/api/content/` | AI drafts awaiting approval |
| POST | `/api/content/{id}/approve/` `/reject/` | Approve / reject a draft |
| GET/PUT | `/api/brand-memory/voice/` | Brand voice config |
| GET/POST | `/api/brand-memory/documents/` | List / ingest a brand document (**chunks + embeds it**) |
| POST | `/api/brand-memory/query/` | **RAG query**: retrieve + generate a grounded answer with sources |
| GET/POST | `/api/personas/` | Audience personas |
| POST | `/api/auth/register/` `/api/auth/token/` | Auth endpoints |

---

## Data tier — status: **pending**

The database will be provisioned separately. The chosen provider is **Tiger
Cloud** (managed Postgres, free plan: 2 services up to 750 MB, no credit card,
no time limit) because pgvector and embedding workloads are supported out of the
box.

Values to add to `backend/.env` when it is set up:

```
DATABASE_URL=postgres://...
GEMINI_API_KEY=...          # optional — mock AI is the fallback
```

`backend/config/settings.py` already reads `DATABASE_URL` via `dj-database-url`,
and `docker-compose.yml` ships the `pgvector/pgvector:pg16` image, so the
extension is available the moment the database exists.

**Verify pgvector once connected:**

```bash
python manage.py shell -c "from django.db import connection; \
c = connection.cursor(); c.execute(\"SELECT extname FROM pg_extension WHERE extname='vector'\"); print(c.fetchone())"
```

If it returns `None`, run `CREATE EXTENSION IF NOT EXISTS vector;` via a migration.

### Auth — status: **pending**

The plan is **JWT with refresh tokens** (`djangorestframework-simplejwt`), with
the access token stored in `expo-secure-store` on the client. The existing
`/api/auth/register/` and `/api/auth/token/` endpoints are the starting point.

---

## Deployment & CI/CD

The brief requires a **containerised three-tier app deployed to a cloud platform
with a pipeline that automates build and deploy**. Proposed design:

**Containers**

| Image | Contents | Notes |
|---|---|---|
| `agentai-backend` | Django + DRF + gunicorn | Built from `backend/Dockerfile`; runs migrations on release |
| `agentai-web` | Expo web export (`dist/`) served by nginx | The third tier is already container-ready via `npm run build:web` |
| Data tier | Managed Postgres (pgvector) | Not containerised in production — managed service |

`docker compose up --build` brings the whole stack up locally: Postgres
(pgvector) + backend at <http://localhost:8000>.

**Pipeline (GitHub Actions)**

```
push / PR
   │
   ├─▶ 1. install          npm ci · pip install -r requirements.txt
   ├─▶ 2. quality gates    npm run typecheck · npm run lint · python manage.py check
   ├─▶ 3. build images     docker build backend · docker build web (expo export)
   ├─▶ 4. push registry    tag with the commit SHA, push to the registry
   ├─▶ 5. migrate          run migrations against the target database
   ├─▶ 6. deploy           roll the new image out to the cloud platform
   └─▶ 7. smoke test       hit /api/healthz and the web root, fail the run if down
```

Secrets (`DATABASE_URL`, `GEMINI_API_KEY`, `SECRET_KEY`, registry credentials)
belong in the platform's secret store / GitHub Actions secrets — never in the
image.

**Environment variables**

| Variable | Used by | Purpose |
|---|---|---|
| `SECRET_KEY` | backend | Django secret |
| `DEBUG` | backend | `False` in production |
| `DATABASE_URL` | backend | Postgres connection string |
| `GEMINI_API_KEY` | backend | Real AI; omit for mock mode |
| `CORS_ALLOWED_ORIGINS` | backend | The deployed web origin |
| `EXPO_PUBLIC_API_URL` | client | Base URL of the deployed API |

---

## The RAG pipeline

Read `backend/apps/core/services/rag.py` top to bottom — it's the whole loop in
~120 readable lines:

1. **Chunk** — `chunk_text()` splits a document into overlapping pieces.
2. **Embed** — each chunk becomes a vector (`llm.embed_many`).
3. **Store** — chunk + vector saved as `DocumentChunk` rows.
4. **Retrieve** — `retrieve()` ranks chunks by **cosine similarity** to your
   query (`cosine_similarity()` is ~10 lines of pure math).
5. **Generate** — `answer()` feeds the top-k chunks into the LLM as context so
   the answer is grounded in *your* documents.

Today retrieval scans chunks in Python — perfect for learning and small MVPs.
For production, swap step 4 for pgvector, which does the **same cosine math**
with an index:

```sql
SELECT content, embedding <=> %s AS distance
FROM core_documentchunk
ORDER BY distance LIMIT 5;
```

---

## Porting notes — web → universal

The client was migrated from a single-target Vite + React DOM SPA to Expo. The
logic, types and design tokens carried over; the markup could not. Recorded here
so the differences are intentional rather than surprising:

| Original (web) | Expo equivalent | Reason |
|---|---|---|
| `div` / `p` / `span` / `button` | `View` / `Text` / `Pressable` | No DOM in React Native |
| Vite + `index.html` | Metro + Expo Router | Native bundling + file-based routes |
| `App.tsx` state machine | `app/` route tree + drawer | Real navigation, back button, deep links |
| Fixed sidebar with collapse | Drawer + `Sidebar` content | Collapse is meaningless on a phone; the full nav is the drawer |
| `framer-motion` | RN `Animated` via `FadeIn` | No Reanimated dependency for simple entries |
| `lucide-react` | `lucide-react-native` | Native SVG rendering |
| `Twitter` / `Instagram` / `Linkedin` icons | `AtSign` / `Camera` / `Briefcase` | **lucide 1.x removed the brand icons** |
| CSS `grid` | `Grid` helper (flex-wrap + percentage widths) | React Native has no CSS grid |
| `hover:` / `group-hover:` | `active:` press states | No cursor on touch devices |
| `<select>` | Pill segments | No native select control |
| `<input type="range">` | `@react-native-community/slider` | No native range input |
| `<input type="date"/"time">` | Text inputs (`YYYY-MM-DD`, `HH:MM`) | Avoids another native dependency |
| `bg-clip-text` gradient text | Solid `brand-600` | RN cannot clip a gradient to text |
| `blur-3xl` decorative blobs | Translucent circles | Blur is not a style property on native |
| `max-w-*` + `mx-auto` | `md:max-w-*` on the scroll container | Centring is approximated, not exact |
| Footer/nav links | Non-navigating `Text` | Placeholders in the original too |

---

## Roadmap

1. ✅ Port the client to Expo (universal) — **done**
2. ▶ Provision the Postgres + pgvector database and point `DATABASE_URL` at it
3. ▶ Move retrieval to pgvector (`<=>` + HNSW index)
4. ▶ Switch auth to JWT + refresh and store the token in `expo-secure-store`
5. ▶ Wire the screens to the API (`EXPO_PUBLIC_API_URL`), replacing mock data
6. ▶ Add per-user filtering to the backend querysets (currently `AllowAny`)
7. ▶ Containerise the web export and stand up the CI/CD pipeline
8. ▶ Deploy the three tiers and add payments/usage limits for the SaaS loop

> `plan.md` still describes the pre-Expo plan and is out of date — this README is
> the current source of truth.
