"use client";

import { useState } from "react";
import { useChatStore } from "./lib/store";
import type { Message } from "./lib/store";

export default function Home() {
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const userMessage: Message = { role: "user", content: input };
    addMessage(userMessage);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [...messages, userMessage],
      }),
    });

    const data = await res.json();

    addMessage({ role: "assistant", content: data.reply });
    setInput("");
  };

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