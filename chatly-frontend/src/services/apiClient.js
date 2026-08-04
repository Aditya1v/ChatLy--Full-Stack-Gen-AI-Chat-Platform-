export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include", // send/receive the httpOnly auth cookie
    headers: options.body instanceof FormData
      ? undefined
      : { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
};

export const api = {
  // --- auth ---
  register: (payload) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),

  // --- chats ---
  listChats: () => request("/chats"),
  getChat: (id) => request(`/chats/${id}`),
  createChat: () => request("/chats", { method: "POST" }),
  deleteChat: (id) => request(`/chats/${id}`, { method: "DELETE" }),

  // --- documents (RAG) ---
  listDocuments: (chatId) => request(`/documents/${chatId}`),
  uploadDocument: (chatId, file) => {
    const form = new FormData();
    form.append("file", file);
    return request(`/documents/${chatId}`, { method: "POST", body: form });
  },
};

/**
 * Streams a chat message via Server-Sent Events.
 * onChunk(deltaText) fires for every token piece; onDone(meta) fires once
 * with { sources, title } when the model finishes.
 */
export const streamMessage = async ({ chatId, text, useDocuments, onChunk, onDone }) => {
  const res = await fetch(`${API_BASE_URL}/chats/${chatId}/message`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, useDocuments }),
  });

  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Failed to reach the server");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const lines = frame.split("\n");
      const eventLine = lines.find((l) => l.startsWith("event:"));
      const dataLine = lines.find((l) => l.startsWith("data:"));
      if (!eventLine || !dataLine) continue;

      const event = eventLine.replace("event:", "").trim();
      const data = JSON.parse(dataLine.replace("data:", "").trim());

      if (event === "chunk") onChunk(data.delta);
      if (event === "done") onDone(data);
      if (event === "error") throw new Error(data.message);
    }
  }
};
