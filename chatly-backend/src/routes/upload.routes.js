import { Router } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import { requireAuth } from "../middleware/auth.js";
import { Chat } from "../models/Chat.js";
import { DocumentChunk } from "../models/DocumentChunk.js";
import { indexDocument } from "../services/rag.service.js";

const router = Router();
router.use(requireAuth);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ok = ["application/pdf", "text/plain"].includes(file.mimetype);
    cb(ok ? null : new Error("Only PDF and .txt files are supported"), ok);
  },
});

router.post("/:chatId", upload.single("file"), async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findOne({ _id: chatId, user: req.userId });
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let text;
    if (req.file.mimetype === "application/pdf") {
      const parsed = await pdfParse(req.file.buffer);
      text = parsed.text;
    } else {
      text = req.file.buffer.toString("utf-8");
    }

    if (!text || !text.trim()) {
      return res.status(422).json({ error: "Couldn't extract any text from that file" });
    }

    const chunkCount = await indexDocument({
      userId: req.userId,
      chatId,
      filename: req.file.originalname,
      text,
    });

    res.status(201).json({ filename: req.file.originalname, chunks: chunkCount });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", detail: err.message });
  }
});

// List documents indexed for a given chat
router.get("/:chatId", async (req, res) => {
  const docs = await DocumentChunk.find({
    chat: req.params.chatId,
    user: req.userId,
  }).distinct("filename");
  res.json(docs);
});

export default router;
