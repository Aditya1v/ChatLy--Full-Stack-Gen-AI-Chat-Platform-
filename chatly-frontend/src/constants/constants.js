// The Gemini API key now lives ONLY on the backend (chatly-backend/.env).
// The frontend just talks to our own server.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
