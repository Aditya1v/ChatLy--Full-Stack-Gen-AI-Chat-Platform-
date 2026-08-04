import mongoose from "mongoose";

const documentChunkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", index: true }, // optional: scope doc to a chat
    filename: { type: String, required: true },
    chunkIndex: { type: Number, required: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
  },
  { timestamps: true },
);

// Note: for a real production app, swap this for a proper vector index
// (MongoDB Atlas Vector Search, pgvector, Pinecone, etc). Cosine similarity
// is computed in application code here to keep the demo dependency-free.
documentChunkSchema.index({ user: 1, chat: 1 });

export const DocumentChunk = mongoose.model("DocumentChunk", documentChunkSchema);
