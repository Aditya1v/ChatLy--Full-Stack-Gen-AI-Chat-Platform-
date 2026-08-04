import { Router } from "express";
import { Chat } from "../models/Chat.js";
import { DocumentChunk } from "../models/DocumentChunk.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// List all chats for the logged-in user (most recent first)
router.get("/", async (req, res) => {
  const chats = await Chat.find({ user: req.userId })
    .sort({ updatedAt: -1 })
    .select("title createdAt updatedAt");
  res.json(chats);
});

// Get a single chat with full message history
router.get("/:id", async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, user: req.userId });
  if (!chat) return res.status(404).json({ error: "Chat not found" });
  res.json(chat);
});

// Create a new empty chat
router.post("/", async (req, res) => {
  const chat = await Chat.create({ user: req.userId, title: "New Chat", messages: [] });
  res.status(201).json(chat);
});

// Delete a chat and any documents indexed for it
router.delete("/:id", async (req, res) => {
  const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!chat) return res.status(404).json({ error: "Chat not found" });

  await DocumentChunk.deleteMany({ chat: chat._id, user: req.userId });
  res.json({ ok: true });
});

export default router;
