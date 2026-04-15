"use client";

import { useState, useEffect } from "react";
import { useChatStore } from "./lib/store";
import type { Message } from "./lib/store";
import { db } from "./lib/db";

export default function Home() {
  const { messages, addMessage, setMessages } = useChatStore();
  const [input, setInput] = useState("");

  // Load chat history from IndexedDB on component mount
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

  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      messages: updatedMessages,
    }),
  });

  const data = await res.json();

  addMessage({ role: "assistant", content: data.reply as string });

  const finalMessages: Message[] = [
    ...updatedMessages,
    { role: "assistant", content: data.reply as string },
  ];

  let title = "New Chat";

  if (messages.length === 0) {
    const titleRes = await fetch("/api/title", {
      method: "POST",
      body: JSON.stringify({
        message: userMessage.content,
      }),
    });

    const titleData = await titleRes.json();
    title = titleData.title;
  }

  await db.chats.put({
    title,
    messages: finalMessages,
  });

  setInput("");
};

  // Load chat history from IndexedDB on component mount
  return (
    <div className="p-6">
      <div className="h-[400px] overflow-y-auto border p-4 mb-4">
        {messages.map((m, i) => (
          <div key={i}>
           <b>{m.role === "user" ? "You" : "AI"}:</b> {m.content}
          </div>
        ))}
      </div>

      <input
        className="border p-2 w-full"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={sendMessage}
        className="mt-2 bg-blue-500 text-white px-4 py-2"
      >
        Send
      </button>
    </div>
  );
}
