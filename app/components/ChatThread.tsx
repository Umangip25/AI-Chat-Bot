"use client";

import { useEffect, useRef } from "react";
import type { Message } from "../lib/store";

type Props = {
  messages: Message[];
  streamingMessage?: string;
  isLoading?: boolean;
};

export default function ChatThread({ messages, streamingMessage, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  return (
    <div
      className="h-full overflow-y-auto p-4 space-y-4"
      style={{ background: "var(--bg-primary)" }}
    >
      {messages.length === 0 && !streamingMessage ? (
        <div
          className="flex items-center justify-center h-full text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Start a conversation…
        </div>
      ) : (
        <>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                style={
                  m.role === "user"
                    ? {
                        background: "var(--bubble-user)",
                        color: "var(--bubble-user-text)",
                        borderBottomRightRadius: "4px",
                      }
                    : {
                        background: "var(--bubble-ai)",
                        color: "var(--bubble-ai-text)",
                        borderBottomLeftRadius: "4px",
                        border: "1px solid var(--border)",
                      }
                }
              >
                {m.content}
              </div>
            </div>
          ))}

          {/* Thinking dots */}
          {isLoading && !streamingMessage && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl px-4 py-3"
                style={{
                  background: "var(--bubble-ai)",
                  border: "1px solid var(--border)",
                  borderBottomLeftRadius: "4px",
                }}
              >
                <span className="flex gap-1.5 items-center h-4">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        background: "var(--text-secondary)",
                        animationDelay: `${delay}ms`,
                      }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}

          {/* Streaming message */}
          {streamingMessage && (
            <div className="flex justify-start">
              <div
                className="max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                style={{
                  background: "var(--bubble-ai)",
                  color: "var(--bubble-ai-text)",
                  border: "1px solid var(--border)",
                  borderBottomLeftRadius: "4px",
                }}
              >
                {streamingMessage}
                <span
                  className="inline-block w-0.5 h-3.5 ml-1 rounded-full animate-pulse align-middle"
                  style={{ background: "var(--accent)" }}
                />
              </div>
            </div>
          )}
        </>
      )}

      <div ref={bottomRef} />
    </div>
  );
}