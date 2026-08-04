import { motion } from "framer-motion";
import Answers from "./Answers";
import Loader from "./Loader";
import { getBubbleSizing } from "../utils/messageSizing";

const messageTransition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] };

const MotionItem = motion.li;

const QuerryAnswer = ({ item }) => {
  const isQuestion = item.type === "q";
  const bubbleStyle = getBubbleSizing(
    item.loading ? "Thinking through it" : item.text,
    isQuestion ? "question" : "answer",
  );

  return (
    <MotionItem
      layout
      className={`flex w-full ${isQuestion ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={messageTransition}
    >
      <div
        style={bubbleStyle}
        className={`overflow-hidden rounded-2xl px-4 py-3 ${
          isQuestion
            ? "bubble-shell ml-auto bg-[var(--ink)] text-[var(--ink-contrast)]"
            : "bubble-shell border border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)]"
        }`}
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
