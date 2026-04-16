"use client";

import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
};

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p style={{ marginBottom: "0.5rem" }}>{children}</p>,
          ul: ({ children }) => <ul style={{ listStyleType: "disc", paddingLeft: "1.25rem", marginBottom: "0.5rem" }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ listStyleType: "decimal", paddingLeft: "1.25rem", marginBottom: "0.5rem" }}>{children}</ol>,
          li: ({ children }) => <li style={{ marginBottom: "0.25rem" }}>{children}</li>,
          strong: ({ children }) => <strong style={{ fontWeight: "600" }}>{children}</strong>,
          code: ({ children }) => (
            <code style={{ background: "var(--bg-secondary)", padding: "0.1rem 0.3rem", borderRadius: "4px", fontSize: "0.8em" }}>
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre style={{ background: "var(--bg-secondary)", padding: "0.75rem", borderRadius: "8px", overflowX: "auto", marginBottom: "0.5rem", fontSize: "0.8em" }}>
              {children}
            </pre>
          ),
          h1: ({ children }) => <h1 style={{ fontSize: "1.2em", fontWeight: "700", marginBottom: "0.5rem" }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ fontSize: "1.1em", fontWeight: "600", marginBottom: "0.5rem" }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ fontSize: "1em", fontWeight: "600", marginBottom: "0.5rem" }}>{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}