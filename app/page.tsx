"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "./lib/store";
import type { Message } from "./lib/store";
import { db, getUserId, getUserChats, getChatLimitStatus, MAX_CHATS, MAX_MESSAGES, COOLDOWN_MS } from "./lib/db";
import ChatThread from "./components/ChatThread";
import Sidebar from "./components/SideBar";
import LimitBanner from "./components/LimitBanner";
import { ThemeProvider } from "./lib/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

function AppShell() {
  const {
    messages,
    addMessage,
    setMessages,
    currentChatId,
    setCurrentChatId,
    streamingMessage,
    setStreamingMessage,
    isLimited,
    cooldownRemaining,
    setLimitStatus,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatLimitReached, setChatLimitReached] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // Check limits whenever current chat changes
  useEffect(() => {
    const checkLimits = async () => {
      // Check chat limit
      const userChats = await getUserChats();
      setChatLimitReached(userChats.length >= MAX_CHATS && currentChatId === undefined);

      // Check message limit for current chat
      if (currentChatId !== undefined) {
        const chat = await db.chats.get(currentChatId);
        if (chat) {
          const { isLimited, cooldownRemaining } = getChatLimitStatus(chat);
          setLimitStatus(isLimited, cooldownRemaining);
        }
      } else {
        setLimitStatus(false, 0);
      }
    };

    checkLimits();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatId, messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || isLimited || chatLimitReached) return;

    // Check message count before sending
    const userMessages = messages.filter((m) => m.role === "user");
    if (userMessages.length >= MAX_MESSAGES) {
      // Mark limit hit time in db
      if (currentChatId !== undefined) {
        await db.chats.update(currentChatId, { lastLimitHitAt: Date.now() });
      }
      setLimitStatus(true, COOLDOWN_MS);
      return;
    }

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

    const finalMessages: Message[] = [
      ...updatedMessages,
      { role: "assistant", content: assistantReply },
    ];

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

    const userId = getUserId();

    const savedId = await db.chats.put({
      id: currentChatId,
      userId,
      title,
      messages: finalMessages,
      createdAt: isNewChat ? Date.now() : (await db.chats.get(currentChatId))?.createdAt ?? Date.now(),
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
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((o) => !o)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{
            background: "var(--topbar-bg)",
            borderBottom: "1px solid var(--topbar-border)",
          }}
        >
          <button
            onClick={() => setIsSidebarOpen((o) => !o)}
            className="text-lg leading-none transition-opacity hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
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

        {/* Limit banners */}
        <LimitBanner
          cooldownRemaining={cooldownRemaining}
          chatLimitReached={chatLimitReached}
        />

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
              opacity: isLimited || chatLimitReached ? 0.5 : 1,
            }}
            placeholder={
              isLimited
                ? "Wait for cooldown to end…"
                : chatLimitReached
                ? "Delete a chat to continue…"
                : "Type a message…"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={isLoading || isLimited || chatLimitReached}
          />

          <button
            onClick={sendMessage}
            disabled={isLoading || isLimited || chatLimitReached}
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

export default function Home() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}