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
    addMessage(userMessage);

    // Send message to backend API
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [...messages, userMessage],
      }),
    });

    const data = await res.json();

    // Add assistant's reply to chat
    addMessage({ role: "assistant", content: data.reply });
    
    // Save chat to IndexedDB
    await db.chats.put({
      messages: [...messages, userMessage, { role: "assistant", content: data.reply }],
    });
    
    setInput("");
  };

  // Load chat history from IndexedDB on component mount
  return (
    <div className="p-6">
      <div className="h-[400px] overflow-y-auto border p-4 mb-4">
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>

      <input
        className="border p-2 w-full"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={sendMessage} className="mt-2 bg-blue-500 text-white px-4 py-2">
        Send
      </button>
    </div>
  );
}