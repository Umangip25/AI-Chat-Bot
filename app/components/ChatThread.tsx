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
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && !streamingMessage ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          Start a conversation...
        </div>
      ) : (
        <>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {/* Thinking indicator — shown before streaming starts */}
          {isLoading && !streamingMessage && (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-2xl px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded-bl-none">
                <span className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}

          {/* Streaming message with blinking cursor */}
          {streamingMessage && (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-2xl px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded-bl-none">
                {streamingMessage}
                <span className="inline-block w-1 h-3 ml-1 bg-gray-400 animate-pulse" />
              </div>
            </div>
          )}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
}