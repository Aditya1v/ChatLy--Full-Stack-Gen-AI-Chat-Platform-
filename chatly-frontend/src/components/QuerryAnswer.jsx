import { motion } from "framer-motion";
import Answers from "./Answers";
import Loader from "./Loader";

const messageTransition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] };

const MotionItem = motion.li;

const QuerryAnswer = ({ item }) => {
  const isQuestion = item.type === "q";
  return (
    <MotionItem
      layout
      className={`flex w-full ${isQuestion ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={messageTransition}
    >
      <div
        className={`bubble-shell max-w-[min(100%,48rem)] overflow-hidden rounded-2xl px-4 py-3 ${
          isQuestion
            ? "ml-auto bg-[var(--ink)] text-[var(--ink-contrast)]"
            : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)]"
        } ${item.loading ? "w-fit px-3.5 py-2.5" : ""}`}
      >
        {isQuestion ? (
          <p className="bubble-copy whitespace-pre-wrap text-[14.5px] leading-6">
            {item.text}
          </p>
        ) : item.loading ? (
          <Loader />
        ) : (
          <>
            <Answers ans={item.text} />
            {item.sources?.length > 0 && (
              <p className="mt-2 border-t border-[var(--border)] pt-2 text-[11px] text-[var(--text-muted)]">
                Source{item.sources.length > 1 ? "s" : ""}: {item.sources.join(", ")}
              </p>
            )}
          </>
        )}
      </div>
    </MotionItem>
  );
};

export default QuerryAnswer;
