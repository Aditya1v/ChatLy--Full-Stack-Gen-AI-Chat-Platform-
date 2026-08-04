# ChatLy — Full-Stack Gen AI Upgrade

This turns ChatLy from a frontend-only Gemini wrapper into a real full-stack
app: **Express + MongoDB backend**, **JWT auth**, **true SSE streaming**, and
a **RAG pipeline** (upload a PDF/txt, ask questions grounded in it).

## What changed vs. the original project

| Area | Before | After |
|---|---|---|
| Gemini API key | Exposed in the frontend bundle (`VITE_API_KEY`) | Lives only in `chatly-backend/.env`, never sent to the browser |
| Streaming | Fake — waited for the full response, then re-typed it with `setInterval` | Real — tokens stream from Gemini through the backend via Server-Sent Events |
| Chat storage | `localStorage` only, no auth, single device | MongoDB, scoped per user, works across devices/browsers |
| Auth | None | Email/password with bcrypt + JWT in an httpOnly cookie |
| RAG | None | Upload PDF/txt → chunked → embedded (`text-embedding-004`) → top-k retrieved by cosine similarity → injected into the prompt |
| Error handling | One generic `alert()` for every failure | Per-request error messages, sent back and rendered inline |

## Project layout

```
chatly/              # existing frontend (updated)
chatly-backend/       # new Express + MongoDB API
```

## 1. Backend setup

```bash
cd chatly-backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — easiest path is a free MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas/register
- `GEMINI_API_KEY` — your existing Gemini key (now safe here, server-side only)
- `JWT_SECRET` — any long random string, e.g. `openssl rand -hex 32`

Run it:
```bash
npm run dev
```
Should log `[db] MongoDB connected` and `[server] listening on http://localhost:5000`.

## 2. Frontend setup

```bash
cd chatly
npm install
```

Create `chatly/.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Run it:
```bash
npm run dev
```

Open the app, **register an account**, and start chatting. Everything now
flows through your backend instead of hitting Gemini directly from the
browser.

## 3. Try the RAG feature

1. Start (or open) a chat.
2. Click the paperclip icon, upload a PDF or `.txt` file.
3. A "Use uploaded documents" chip appears — tap it on.
4. Ask a question about the file's content. The backend retrieves the most
   relevant chunks and feeds them to Gemini as context; the answer includes
   which source file(s) it drew from.

## 4. Deployment (when you're ready)

- **Frontend** → Vercel/Netlify (static build, set `VITE_API_BASE_URL` to your
  deployed backend URL).
- **Backend** → Render/Railway/Fly.io (any Node host). Set the same env vars
  as `.env.example`, and set `CLIENT_ORIGIN` to your deployed frontend URL so
  CORS + cookies work.
- **Database** → MongoDB Atlas free tier is plenty for a portfolio project.

Because auth uses an httpOnly cookie across origins, make sure both frontend
and backend are served over **HTTPS** in production (`secure: true` cookie
flag is already conditional on `NODE_ENV=production`), and that `CLIENT_ORIGIN`
exactly matches your deployed frontend domain.

## 5. Known simplifications (call these out if this is a resume project)

Being upfront about tradeoffs is a good signal in interviews — here's what I
simplified for scope, and how you'd harden it further:

- **Vector search is in-application cosine similarity**, not a real vector
  index. Fine at demo scale (hundreds of chunks); for production, swap
  `rag.service.js` for MongoDB Atlas Vector Search or Pinecone/pgvector.
  This is genuinely the single most impressive line you can add to a resume
  bullet: *"initially used brute-force cosine similarity, then migrated to
  Atlas Vector Search for O(log n) retrieval."*
- **No refresh-token rotation** — sessions just expire after `JWT_EXPIRES_IN`
  and the user has to log in again. Good enough for a portfolio piece; a
  production app would add refresh tokens.
- **No rate limiting** on the Gemini-calling routes yet — add
  `express-rate-limit` per-user before this is public-facing, so one user
  can't burn your whole API quota.
- **File size cap is 10MB**, chunk size is a fixed 900 characters — tune based
  on the documents you expect.

## 6. Suggested next features (for the "9/10 → 10/10" stretch)

- Rate limiting + per-user usage quotas
- Message editing / regenerate response
- Multi-file RAG with a document manager (view/delete indexed files)
- Streaming markdown rendering (currently markdown renders after each chunk;
  could diff-render incrementally)
- Tests: at minimum, integration tests for the auth and message routes
  (Jest + supertest)
- Swap in Atlas Vector Search as described above
