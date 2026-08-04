export const buildConversation = (messages) =>
  messages.map((msg) => ({
    role: msg.type === "q" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

export const generateChatTitle = (query, title) =>
  !title || title === "New Chat" ? query.slice(0, 30) : title;