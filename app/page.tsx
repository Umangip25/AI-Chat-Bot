"use client";

import { useState } from "react";
import { useChatStore } from "./lib/store";
import type { Message } from "./lib/store";
import { db } from "./lib/db";
import ChatThread from "./components/ChatThread";
import Sidebar from "./components/SideBar";

export default function Home() {
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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    addMessage(userMessage);
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let assistantReply = "";

    // Stream response word by word into state
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantReply += chunk;
        setStreamingMessage(assistantReply);
      }
    }

    // Clear streaming message and add final message
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

    const savedId = await db.chats.put({
      id: currentChatId,
      title,
      messages: finalMessages,
    });

    if (isNewChat) {
      setCurrentChatId(savedId as number);
    }

    setMessages(finalMessages);
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1 bg-white">
        <ChatThread
          messages={messages}
          streamingMessage={streamingMessage}
          isLoading={isLoading}
        />

        <div className="border-t p-4 flex gap-2">
          <input
            className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
