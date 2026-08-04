import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Answers = ({ ans }) => {
  return (
    <div className="markdown-body bubble-copy prose prose-sm max-w-none bg-transparent text-[var(--text-main)] dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-display mt-1 text-xl font-semibold tracking-tight text-[var(--text-main)]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display mt-5 text-lg font-semibold tracking-tight text-[var(--text-main)]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display mt-4 text-[15px] font-semibold tracking-tight text-[var(--text-main)]">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-2.5 text-[14.5px] leading-6 text-[var(--text-main)]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-3 list-disc space-y-1.5 pl-5 text-[14.5px] leading-6 text-[var(--text-main)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 list-decimal space-y-1.5 pl-5 text-[14.5px] leading-6 text-[var(--text-main)]">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 rounded-r-lg border-l-2 border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-2 text-[var(--text-main)]">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--accent)] underline underline-offset-2"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="min-w-full border-collapse text-left text-[13px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[var(--surface-muted)] text-[var(--text-main)]">
              {children}
            </thead>
          ),
          th: ({ children }) => <th className="px-3 py-2 font-semibold">{children}</th>,
          td: ({ children }) => (
            <td className="border-t border-[var(--border)] px-3 py-2 text-[var(--text-muted)]">
              {children}
            </td>
          ),
          pre: ({ children }) => (
            <pre className="my-3 overflow-x-auto rounded-xl bg-[var(--ink)] px-3.5 py-3.5 text-[13px] text-[var(--ink-contrast)]">
              {children}
            </pre>
          ),
          code({ inline, children, className, ...props }) {
            if (inline) {
              return (
                <code className="rounded-md bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-[0.88em] text-[var(--accent)]">
                  {children}
                </code>
              );
            }

            return (
              <code
                className={`${className || ""} font-mono text-[0.86rem] leading-6`}
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {ans}
      </ReactMarkdown>
    </div>
  );
};

export default Answers;
