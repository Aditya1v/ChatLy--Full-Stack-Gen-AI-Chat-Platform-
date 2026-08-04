import { Router } from "express";
import { Chat } from "../models/Chat.js";
import { requireAuth } from "../middleware/auth.js";
import { streamGeminiChat } from "../services/gemini.service.js";
import { retrieveRelevantChunks } from "../services/rag.service.js";

const router = Router();
router.use(requireAuth);

const HISTORY_WINDOW = 8; // messages of prior context to send back to Gemini

router.post("/:chatId/message", async (req, res) => {
  const { chatId } = req.params;
  const { text, useDocuments } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Message text is required" });
  }

  const chat = await Chat.findOne({ _id: chatId, user: req.userId });
  if (!chat) return res.status(404).json({ error: "Chat not found" });

  // Set up Server-Sent Events so the frontend can render tokens as they arrive
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    let sources = [];
    let contextPreamble = "";

    if (useDocuments) {
      const chunks = await retrieveRelevantChunks({
        userId: req.userId,
        chatId,
        query: text,
      });

      if (chunks.length) {
        sources = [...new Set(chunks.map((c) => c.filename))];
        contextPreamble =
          "Use the following context from the user's uploaded documents to answer, " +
          "if relevant. If the context doesn't help, answer normally.\n\n" +
          chunks.map((c, i) => `[Excerpt ${i + 1} from ${c.filename}]\n${c.text}`).join("\n\n") +
          "\n\n---\n\n";
      }
    }

    const history = chat.messages.slice(-HISTORY_WINDOW).map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const contents = [
      ...history,
      { role: "user", parts: [{ text: contextPreamble + text }] },
    ];

    const fullText = await streamGeminiChat({
      contents,
      onChunk: (delta) => send("chunk", { delta }),
    });

    chat.messages.push({ role: "user", text });
    chat.messages.push({ role: "model", text: fullText, sources });

    if (chat.title === "New Chat") {
      chat.title = text.slice(0, 40);
    }

    await chat.save();

    send("done", { sources, title: chat.title });
    res.end();
  } catch (err) {

  console.error(err);
    send("error", { message: err.message || "Something went wrong talking to Gemini" });
    res.end();
  }
});

export default router;
