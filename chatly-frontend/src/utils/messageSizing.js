const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getTextMetrics = (text = "") => {
  const normalized = String(text).replace(/\s+/g, " ").trim();
  const words = normalized ? normalized.split(" ") : [];
  const longestWord = words.reduce((max, word) => Math.max(max, word.length), 0);
  const lineCount = String(text).split("\n").length;

  return {
    charCount: normalized.length,
    wordCount: words.length,
    longestWord,
    lineCount,
  };
};

export const getBubbleSizing = (text, type) => {
  const { charCount, wordCount, longestWord, lineCount } = getTextMetrics(text);
  const isAnswer = type === "answer";

  const minWidth = clamp(
    12 + Math.min(wordCount * 0.9, 8) + Math.min(longestWord * 0.3, 7),
    isAnswer ? 18 : 12,
    isAnswer ? 28 : 22,
  );

  const preferredWidth = clamp(
    18 +
      Math.min(charCount * (isAnswer ? 0.22 : 0.2), isAnswer ? 22 : 18) +
      Math.min(longestWord * 0.55, isAnswer ? 16 : 12) +
      Math.min(lineCount * 2.6, 9),
    isAnswer ? 28 : 16,
    isAnswer ? 76 : 52,
  );

  return {
    minWidth: `min(100%, ${minWidth}ch)`,
    maxWidth: `min(100%, ${preferredWidth}ch)`,
  };
};
