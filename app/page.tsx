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
import FileUpload, { type UploadedFile } from "./components/FileUploads";

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
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const focusInput = () => {
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    const checkLimits = async () => {
      const userChats = await getUserChats();
      setChatLimitReached(userChats.length >= MAX_CHATS && currentChatId === undefined);

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
    if (!input.trim() && !uploadedFile || isLoading || isLimited || chatLimitReached) return;

    const messageContent = uploadedFile
      ? input.trim()
        ? `${input.trim()}\n\n[Attached: ${uploadedFile.name}]`
        : `[Attached: ${uploadedFile.name}]`
      : input.trim();

    const userMessages = messages.filter((m) => m.role === "user");
    if (userMessages.length >= MAX_MESSAGES) {
      if (currentChatId !== undefined) {
        await db.chats.update(currentChatId, { lastLimitHitAt: Date.now() });
      }
      setLimitStatus(true, COOLDOWN_MS);
      return;
    }

    const userMessage: Message = { role: "user", content: messageContent };
    const updatedMessages = [...messages, userMessage];

    addMessage(userMessage);
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");
    focusInput();

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: updatedMessages, file: uploadedFile }),
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
    setUploadedFile(null);
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Top bar — full width, above everything */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0 z-10"
        style={{
          background: "var(--topbar-bg)",
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

      {/* Sidebar + Chat below topbar */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((o) => !o)}
        />

        <div className="flex flex-col flex-1 min-w-0">
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
            className="px-3 py-3 sm:px-4 flex flex-col gap-2 shrink-0"
            style={{
              background: "var(--topbar-bg)",
              borderTop: "1px solid var(--topbar-border)",
            }}
          >
            {/* File preview */}
            {uploadedFile && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs w-fit"
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                <span>
                  {uploadedFile.type === "image" ? "🖼️" : "📄"} {uploadedFile.name}
                </span>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="hover:opacity-70"
                  style={{ color: "var(--danger)" }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Input row */}
            <div className="flex gap-2">
              <FileUpload onFileReady={(file) => setUploadedFile(file)} />

              <input
                ref={inputRef}
                className="flex-1 rounded-full px-4 py-2 text-sm outline-none transition-colors min-w-0"
                style={{
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  opacity: isLimited || chatLimitReached ? 0.5 : 1,
                }}
                placeholder={
                  uploadedFile
                    ? "Ask something about the file..."
                    : isLimited
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
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-opacity disabled:opacity-40"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {isLoading ? "…" : "Send"}
              </button>
            </div>
          </div>
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