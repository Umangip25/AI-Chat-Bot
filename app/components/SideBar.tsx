"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/db";
import type { Chat } from "../lib/db";
import { useChatStore } from "../lib/store";

export default function Sidebar() {
  const [chats, setChats] = useState<Chat[]>([]);
  const { setMessages, setCurrentChatId, currentChatId } = useChatStore();
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);

  // Load chats whenever currentChatId changes
  useEffect(() => {
    const loadChats = async () => {
      const allChats = await db.chats.toArray();
      setChats(allChats.reverse());
    };

    loadChats();
  }, [currentChatId]);

  // Select a chat
  const selectChat = (chat: Chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
  };

  // Start a new chat
  const newChat = () => {
    setMessages([]);
    setCurrentChatId(undefined);
  };

  // Delete chat
  const deleteChat = async () => {
    if (!chatToDelete?.id) return;

    await db.chats.delete(chatToDelete.id);

    const allChats = await db.chats.toArray();
    setChats(allChats.reverse());

    if (currentChatId === chatToDelete.id) {
      setMessages([]);
      setCurrentChatId(undefined);
    }

    setChatToDelete(null);
  };

  return (
    <>
      {/* Sidebar */}
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
              <div
                key={chat.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  currentChatId === chat.id
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {/* Chat title */}
                <span
                  onClick={() => selectChat(chat)}
                  className="truncate cursor-pointer flex-1"
                >
                  {chat.title || "Untitled Chat"}
                </span>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setChatToDelete(chat);
                  }}
                  className="ml-2 text-red-400 hover:text-red-600 text-xs"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ Modal */}
      {chatToDelete && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setChatToDelete(null)} // ✅ click outside closes modal
        >
          <div
            className="bg-white rounded-xl p-6 w-[320px] shadow-lg"
            onClick={(e) => e.stopPropagation()} // ✅ prevent closing when clicking inside
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Chat
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Delete{" "}
              <span className="font-medium">
                {chatToDelete.title || "Untitled Chat"}
              </span>{" "}
              chat?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setChatToDelete(null)}
                className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={deleteChat}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}