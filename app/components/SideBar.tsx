"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/db";
import type { Chat } from "../lib/db";
import { useChatStore } from "../lib/store";

export default function Sidebar() {
  const [chats, setChats] = useState<Chat[]>([]);
  const { setMessages, setCurrentChatId, currentChatId } = useChatStore();

  // Reload chats whenever currentChatId changes (new chat saved)
  useEffect(() => {
    const loadChats = async () => {
      const allChats = await db.chats.toArray();
      setChats(allChats.reverse());
    };

    loadChats();
  }, [currentChatId]);

  const selectChat = (chat: Chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
  };

  const newChat = () => {
    setMessages([]);
    setCurrentChatId(undefined);
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={newChat}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium"
        >
          + New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {chats.length === 0 ? (
          <p className="text-gray-400 text-sm text-center mt-4">
            No chats yet
          </p>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => selectChat(chat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                currentChatId === chat.id
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {chat.title || "Untitled Chat"}
            </button>
          ))
        )}
      </div>
    </div>
  );
}