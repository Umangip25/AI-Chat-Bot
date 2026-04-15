"use client";

import { useState } from "react";
import { useChatStore } from "./lib/store";
import type { Message } from "./lib/store";
import { db } from "./lib/db";
import ChatThread from "./components/ChatThread";
import Sidebar from "./components/SideBar";

export default function Home() {
  const { messages, addMessage, setMessages, currentChatId, setCurrentChatId } =
    useChatStore();
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    addMessage(userMessage);
    setInput("");

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
      }
    }

    const finalMessages: Message[] = [
      ...updatedMessages,
      { role: "assistant", content: assistantReply },
    ];

    addMessage({ role: "assistant", content: assistantReply });

    // Check if this is a brand new chat
    const isNewChat = currentChatId === undefined;

    let title = "New Chat";

    if (isNewChat) {
      // Generate title from first message
      const titleRes = await fetch("/api/title", {
        method: "POST",
        body: JSON.stringify({ message: userMessage.content }),
      });
      const titleData = await titleRes.json();
      title = titleData.title;
    } else {
      // Keep existing title
      const existingChat = await db.chats.get(currentChatId);
      title = existingChat?.title ?? "New Chat";
    }

    // Save or update chat in IndexedDB
    const savedId = await db.chats.put({
      id: currentChatId,  // undefined = new chat, number = update existing
      title,
      messages: finalMessages,
    });

    // Only update currentChatId if it was a new chat
    if (isNewChat) {
      setCurrentChatId(savedId as number);
    }

    setMessages(finalMessages);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main chat area */}
      <div className="flex flex-col flex-1 bg-white">
        <ChatThread messages={messages} />

        {/* Input area */}
        <div className="border-t p-4 flex gap-2">
          <input
            className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}