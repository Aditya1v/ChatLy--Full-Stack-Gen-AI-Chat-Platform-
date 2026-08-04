# ChatLy — Full-Stack Gen AI Chat Platform

A production-shaped AI chat application built on the Gemini API, with real user accounts, persistent conversations, live token streaming, and retrieval-augmented generation (RAG) over user-uploaded documents.

Unlike a typical "wrap the API in a chat UI" project, the Gemini key never touches the browser, responses stream token-by-token over Server-Sent Events instead of simulating typing, and every chat is scoped to an authenticated user in MongoDB rather than `localStorage`.

**Live demo:** _add your deployed URL here_
**Screenshots:** _add 2–3 screenshots or a short GIF here — this section sells the project before anyone reads a line of code_

---

## Why this project

Most portfolio chatbot clones call an LLM directly from the frontend, which exposes the API key to anyone who opens dev tools and has no real persistence, auth, or grounding. This project addresses all three:

| Concern | Approach |
|---|---|
| **API key security** | Gemini is called only from the Express backend; the frontend never sees the key |
| **Real-time UX** | Responses stream token-by-token via Server-Sent Events (SSE), not a post-hoc typing animation |
| **Persistence & multi-user** | Chats are stored in MongoDB, scoped per authenticated user, and sync across devices |
| **Grounded answers (RAG)** | Users upload PDFs/text files; content is chunked, embedded, and retrieved by similarity to ground the model's answers in their own data |
| **Auth** | Email/password with bcrypt hashing and JWTs in httpOnly cookies |

---

## Features

- 🔐 **Authentication** — register/login with hashed passwords, session persisted via httpOnly JWT cookie
- 💬 **Multi-chat history** — create, switch between, rename, and delete conversations, all persisted server-side
- ⚡ **Live streaming responses** — tokens render as the model generates them, via SSE
- 📄 **Retrieval-augmented generation** — upload a PDF or `.txt` file, toggle "use uploaded documents," and get answers grounded in that content with cited sources
- 🎨 **Minimal, animated UI** — flat design system with purposeful micro-interactions (Framer Motion), light/dark themes, and adaptive message bubble sizing
- 📝 **Markdown-aware responses** — headings, tables, code blocks with syntax highlighting, and GitHub-flavored markdown via `react-markdown`

---

## Tech stack

**Frontend** — React 19, Vite, Tailwind CSS v4, Framer Motion, `react-markdown` + `remark-gfm` + `rehype-highlight`, Lucide icons

**Backend** — Node.js, Express, MongoDB + Mongoose, JWT + bcrypt, Multer (file uploads), `pdf-parse`

**AI** — Google Gemini via the official `@google/genai` SDK — `generateContentStream` for chat, `embedContent` for RAG embeddings

---

## Architecture

```
┌─────────────┐        HTTPS + SSE         ┌──────────────┐        ┌────────────┐
│   React     │ ─────────────────────────► │   Express    │ ─────► │  MongoDB   │
│  (Vite)     │ ◄───────────────────────── │   API        │ ◄───── │  (chats,   │
└─────────────┘   JSON / SSE token stream   └──────┬───────┘        │ users,     │
                                                    │                │ doc chunks)│
                                                    ▼                └────────────┘
                                          ┌───────────────────┐
                                          │  Gemini API        │
                                          │  (chat + embeddings)│
                                          └───────────────────┘
```

**RAG flow:** upload → extract text (`pdf-parse` for PDFs) → chunk (~900 chars, 150 overlap) → embed each chunk (`embedContent`) → store in MongoDB → on query, embed the question → rank stored chunks by cosine similarity → inject top-k chunks into the Gemini prompt as context → cite source filenames in the response.

---

## Project structure

```
chatly/                  # React frontend
  src/
    components/          # Sidebar, ChatLayout, message rendering, auth screen
    context/              # Auth + chat React contexts
    services/             # API client (fetch wrapper + SSE parsing)

chatly-backend/           # Express API
  src/
    routes/               # auth, chats, messages (SSE), document upload
    models/               # User, Chat, DocumentChunk (Mongoose)
    services/             # Gemini SDK wrapper, RAG chunking/retrieval
    middleware/           # JWT auth guard
```

---

## Getting started

### 1. Backend
```bash
cd chatly-backend
npm install
cp .env.example .env   # fill in MONGO_URI, GEMINI_API_KEY, JWT_SECRET
npm run dev
```

### 2. Frontend
```bash
cd chatly
npm install
cp .env.example .env   # VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```

Open `http://localhost:5173`, register an account, and start chatting.

Full setup details, environment variables, and troubleshooting live in [`SETUP.md`](./SETUP.md).

---

## API overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Log in, sets an httpOnly session cookie |
| `POST` | `/api/auth/logout` | Clear the session |
| `GET` | `/api/chats` | List the current user's chats |
| `POST` | `/api/chats` | Create a new chat |
| `GET` | `/api/chats/:id` | Get a chat with full message history |
| `DELETE` | `/api/chats/:id` | Delete a chat and its indexed documents |
| `POST` | `/api/chats/:id/message` | Send a message; streams the reply over SSE |
| `POST` | `/api/documents/:chatId` | Upload a PDF/text file for RAG |
| `GET` | `/api/documents/:chatId` | List documents indexed for a chat |

---

## Design decisions & tradeoffs

Being explicit about what's simplified for scope, and how it would be hardened for production:

- **Vector search** currently ranks chunks with in-application cosine similarity rather than a dedicated vector index — fine at hundreds of chunks, but the natural next step is MongoDB Atlas Vector Search or Pinecone for larger corpora.
- **Sessions** use a single long-lived JWT rather than refresh-token rotation — simpler, but means users re-authenticate after expiry rather than silently refreshing.
- **No rate limiting yet** on Gemini-calling routes — needed before this is exposed publicly, so one user can't exhaust the API quota.

## Roadmap

- [ ] Per-user rate limiting (`express-rate-limit`)
- [ ] Message editing / response regeneration
- [ ] Multi-document manager (view/remove indexed files independently of chat deletion)
- [ ] Swap cosine-similarity retrieval for a proper vector index at scale
- [ ] Integration tests for auth and messaging routes (Jest + Supertest)

---

## License

MIT