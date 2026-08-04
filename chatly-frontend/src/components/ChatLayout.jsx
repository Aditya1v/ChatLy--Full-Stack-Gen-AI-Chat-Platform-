import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, FileText, Loader2, Paperclip } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/useChat";
import QuerryAnswer from "./QuerryAnswer";

const quickPrompts = [
  "Summarize a document",
  "Plan a feature rollout",
  "Explain a bug clearly",
];

const startPrompts = [
  "Debug my code",
  "Plan a project",
  "Explain a concept",
  "Write something professional",
];

const transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

const MotionButton = motion.button;
const MotionDiv = motion.div;
const MotionList = motion.ul;

const ChatLayout = ({ isOpen }) => {
  const {
    result,
    querry,
    setQuerry,
    askQuerry,
    documents,
    useDocuments,
    setUseDocuments,
    uploadDocument,
    isSending,
  } = useChat();
  const [isFocused, setIsFocused] = useState(false);
  const [uploading, setUploading] = useState(false);
  const showWelcome = result.length === 0;
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const hasDraft = querry.trim().length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 48), 180)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 180 ? "auto" : "hidden";
  }, [querry]);

  const handleSubmit = (event) => {
    event.preventDefault();
    askQuerry();
  };

  const handleSuggestionClick = (prompt) => {
    setQuerry(prompt);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      await uploadDocument(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section
      className={`relative flex min-h-0 min-w-0 flex-1 flex-col ${
        isOpen ? "pointer-events-none md:pointer-events-auto" : ""
      }`}
    >
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <MotionDiv
              key="welcome"
              className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={transition}
            >
              <h1 className="font-display text-[28px] font-semibold tracking-tight text-[var(--text-main)] md:text-[34px]">
                What do you want to work on?
              </h1>
              <p className="mt-2 max-w-md text-[14px] leading-6 text-[var(--text-muted)]">
                Ask questions, solve problems, or build something step by step.
              </p>

              <div className="mt-7 flex flex-col gap-2">
                {startPrompts.map((item, i) => (
                  <MotionButton
                    key={item}
                    onClick={() => handleSuggestionClick(item)}
                    className="panel rounded-xl px-4 py-3 text-left text-[13.5px] text-[var(--text-main)] transition hover:border-[var(--accent)]"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    {item}
                  </MotionButton>
                ))}
              </div>
            </MotionDiv>
          ) : (
            <MotionList
              key="messages"
              layout
              className="mx-auto flex w-full max-w-3xl flex-col gap-5"
              transition={{ layout: { duration: 0.25, ease: "easeInOut" } }}
            >
              {result.map((item, index) => (
                <QuerryAnswer key={`${item.type}-${index}`} item={item} />
              ))}
              <div ref={bottomRef} />
            </MotionList>
          )}
        </AnimatePresence>
      </div>

      <MotionDiv
        className="px-4 pb-4 pt-2 md:px-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.25 }}
      >
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <MotionDiv
            layout
            className="panel rounded-2xl p-2"
            animate={{
              borderColor: isFocused ? "var(--accent)" : "var(--border)",
            }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,text/plain,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Attach a PDF or text file"
                className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-main)] disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Paperclip size={17} />
                )}
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Ask anything"
                className="composer-textarea max-h-44 min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-[14.5px] leading-6 text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
                value={querry}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(event) => setQuerry(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    askQuerry();
                  }
                }}
              />

              <MotionButton
                type="submit"
                disabled={!hasDraft || isSending}
                className={`mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                  hasDraft && !isSending
                    ? "bg-[var(--ink)] text-[var(--ink-contrast)]"
                    : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                }`}
                whileHover={hasDraft && !isSending ? { scale: 1.05 } : {}}
                whileTap={hasDraft && !isSending ? { scale: 0.94 } : {}}
              >
                {isSending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowUp size={16} />
                )}
              </MotionButton>
            </div>

            {(documents.length > 0 || uploading) && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 px-1 pb-0.5">
                <MotionButton
                  type="button"
                  onClick={() => setUseDocuments((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition ${
                    useDocuments
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--text-muted)]"
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  <FileText size={12} />
                  {useDocuments ? "Using your documents" : "Use uploaded documents"}
                </MotionButton>

                {documents.map((name) => (
                  <span
                    key={name}
                    className="max-w-[9rem] truncate rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[11.5px] text-[var(--text-muted)]"
                    title={name}
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-2 flex flex-wrap gap-1.5 px-1 pb-0.5">
              {quickPrompts.map((prompt) => (
                <MotionButton
                  key={prompt}
                  type="button"
                  onClick={() => handleSuggestionClick(`Help me ${prompt.toLowerCase()}.`)}
                  className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11.5px] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  whileTap={{ scale: 0.97 }}
                >
                  {prompt}
                </MotionButton>
              ))}
            </div>
          </MotionDiv>
        </form>
      </MotionDiv>
    </section>
  );
};

export default ChatLayout;
