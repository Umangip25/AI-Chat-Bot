"use client";

import { useState, useRef } from "react";
import { useChatStore } from "./lib/store";
import type { Message } from "./lib/store";
import { db } from "./lib/db";
import ChatThread from "./components/ChatThread";
import Sidebar from "./components/SideBar";
import { ThemeProvider } from "./lib/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

// Inner component so it can consume the theme context
function AppShell() {
  const {
    messages,
    addMessage,
    setMessages,
    currentChatId,
    setCurrentChatId,
    streamingMessage,
    setStreamingMessage,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input after sending a message
  const focusInput = () => {
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // Handle sending a message
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    addMessage(userMessage);
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");
    focusInput();

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let assistantReply = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantReply += decoder.decode(value, { stream: true });
        setStreamingMessage(assistantReply);
      }
    }

    setStreamingMessage("");
    addMessage({ role: "assistant", content: assistantReply });

    // Save chat to IndexedDB
    const finalMessages: Message[] = [
      ...updatedMessages,
      { role: "assistant", content: assistantReply },
    ];

    // If it's a new chat, generate a title. Otherwise, keep the existing title.
    const isNewChat = currentChatId === undefined;
    let title = "New Chat";

    if (isNewChat) {
      const titleRes = await fetch("/api/title", {
        method: "POST",
        body: JSON.stringify({ message: userMessage.content }),
      });
      const titleData = await titleRes.json();
      title = titleData.title;
    } else {
      const existingChat = await db.chats.get(currentChatId);
      title = existingChat?.title ?? "New Chat";
    }

    // Upsert the chat in IndexedDB
    const savedId = await db.chats.put({
      id: currentChatId,
      title,
      messages: finalMessages,
    });

    if (isNewChat) setCurrentChatId(savedId as number);
    setMessages(finalMessages);
    setIsLoading(false);
    focusInput();
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((o) => !o)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{
            background: "var(--topbar-bg)",
            borderBottom: "1px solid var(--topbar-border)",
          }}
        >
          {/* Sidebar toggle */}
          <button
            onClick={() => setIsSidebarOpen((o) => !o)}
            className="text-lg leading-none transition-opacity hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-hidden">
          <ChatThread
            messages={messages}
            streamingMessage={streamingMessage}
            isLoading={isLoading}
          />
        </div>

        {/* Input bar */}
        <div
          className="px-4 py-3 flex gap-2 shrink-0"
          style={{
            background: "var(--topbar-bg)",
            borderTop: "1px solid var(--topbar-border)",
          }}
        >
          <input
            ref={inputRef}
            className="flex-1 rounded-full px-4 py-2 text-sm outline-none transition-colors"
            style={{
              background: "var(--bg-input)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={isLoading}
          />

          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="px-4 py-2 rounded-full text-sm font-medium transition-opacity disabled:opacity-40"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {isLoading ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main page component that wraps the app shell with the theme provider
export default function Home() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}