import { DocumentChunk } from "../models/DocumentChunk.js";
import { embedText } from "./gemini.service.js";

const CHUNK_SIZE = 900; // characters
const CHUNK_OVERLAP = 150;

/**
 * Splits raw text into overlapping chunks so each piece stays small enough
 * to embed well and to fit cheaply into a prompt later.
 */
export const chunkText = (text) => {
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks = [];

  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + CHUNK_SIZE, clean.length);
    chunks.push(clean.slice(start, end));
    if (end === clean.length) break;
    start = end - CHUNK_OVERLAP;
  }

  return chunks;
};

const cosineSimilarity = (a, b) => {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
};

/**
 * Embeds and stores every chunk of an uploaded document for a user/chat.
 */
export const indexDocument = async ({ userId, chatId, filename, text }) => {
  const chunks = chunkText(text);

  const docs = [];
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await embedText(chunks[i]);
    docs.push({
      user: userId,
      chat: chatId,
      filename,
      chunkIndex: i,
      text: chunks[i],
      embedding,
    });
  }

  if (docs.length) {
    await DocumentChunk.insertMany(docs);
  }

  return docs.length;
};

/**
 * Finds the top-K most relevant chunks for a query, scoped to a user
 * (and optionally a single chat).
 */
export const retrieveRelevantChunks = async ({ userId, chatId, query, topK = 4 }) => {
  const filter = { user: userId };
  if (chatId) filter.chat = chatId;

  const candidates = await DocumentChunk.find(filter).lean();
  if (!candidates.length) return [];

  const queryEmbedding = await embedText(query);

  const scored = candidates
    .map((c) => ({ ...c, score: cosineSimilarity(queryEmbedding, c.embedding) }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
};
