"use client";

import { useState, useEffect } from "react";
import { useChatStore } from "./lib/store";
import type { Message } from "./lib/store";
import { db } from "./lib/db";
import ChatThread from "./components/ChatThread";

export default function Home() {
  const { messages, addMessage, setMessages } = useChatStore();
  const [input, setInput] = useState("");

  useEffect(() => {
    const load = async () => {
      const allChats = await db.chats.toArray();
      if (allChats.length > 0) {
        setMessages(allChats[0].messages);
      }
    };
    load();
  }, [setMessages]);

  const sendMessage = async () => {
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

    // Read the streamed response chunk by chunk
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

    let title = "New Chat";
    if (messages.length === 0) {
      const titleRes = await fetch("/api/title", {
        method: "POST",
        body: JSON.stringify({ message: userMessage.content }),
      });
      const titleData = await titleRes.json();
      title = titleData.title;
    }

    await db.chats.put({ title, messages: finalMessages });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Chat messages */}
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
  );
}