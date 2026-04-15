"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/db";
import type { Chat } from "../lib/db";
import { useChatStore } from "../lib/store";

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void; // optional (no warning now)
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const { setMessages, setCurrentChatId, currentChatId } = useChatStore();
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const loadChats = async () => {
      const allChats = await db.chats.toArray();
      setChats(allChats.reverse());
    };
    loadChats();
  }, [currentChatId]);

  // When a chat is selected, load its messages into the chat thread
  const selectChat = (chat: Chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
  };

  // Start a new chat by clearing messages and resetting current chat ID
  const newChat = () => {
    setMessages([]);
    setCurrentChatId(undefined);
  };

  // Delete a chat from IndexedDB and update the UI accordingly
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

  // Close the chat options menu when clicking outside
  useEffect(() => {
    if (openMenuId === null) return;

    const handleClick = () => setOpenMenuId(null);
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [openMenuId]);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`h-screen flex flex-col shrink-0 transition-all duration-300 overflow-hidden ${
          isOpen ? "w-64" : "w-0"
        }`}
        style={{
          background: "var(--bg-sidebar)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* New Chat */}
        <div
          className="p-4 min-w-[256px]"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={newChat}
            className="w-full rounded-lg px-4 py-2 text-sm font-medium"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            + New Chat
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 min-w-[256px]">
          {chats.length === 0 ? (
            <p className="text-center mt-6 text-xs" style={{ color: "#4b5563" }}>
              No chats yet
            </p>
          ) : (
            chats.map((chat) => {
              if (!chat.id) return null;
              const id = chat.id;
              const isActive = currentChatId === id;

              return (
                <div
                  key={id}
                  className="relative flex items-center justify-between px-3 py-2 rounded-lg text-sm group"
                  style={{
                    background: isActive
                      ? "rgba(59,91,219,0.18)"
                      : "transparent",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    onClick={() => selectChat(chat)}
                    className="truncate flex-1"
                    style={{
                      color: isActive ? "#a5b4fc" : "#9ca3af",
                    }}
                  >
                    {chat.title || "Untitled Chat"}
                  </span>

                  <button
                    className="px-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#6b7280" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId((prev) =>
                        prev === id ? null : id
                      );
                    }}
                  >
                    ⋯
                  </button>

                  {openMenuId === id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-2 top-10 w-36 rounded-lg shadow-xl z-50 overflow-hidden"
                      style={{
                        background: "#1e2130",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <button
                        onClick={() => {
                          setChatToDelete(chat);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-xs"
                        style={{ color: "#f87171" }}
                      >
                        Delete chat
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            JSON.stringify(chat.messages, null, 2)
                          );
                          setOpenMenuId(null);
                          setToast("Copied to clipboard");
                          setTimeout(() => setToast(null), 2000);
                        }}
                        className="w-full text-left px-3 py-2 text-xs"
                        style={{ color: "#9ca3af" }}
                      >
                        Share chat
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* User Online Footer */}
        <div
          className="p-3 flex items-center gap-2 min-w-[256px]"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
            style={{
              background: "var(--bg-input)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          >
            U
          </div>

          {/* Name + Status */}
          <div className="flex flex-col leading-tight">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              You
            </span>

            <div className="flex items-center gap-1">
              {/* Green dot */}
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: "#22c55e",
                  boxShadow: "0 0 6px rgba(34,197,94,0.8)",
                }}
              />

              <span
                className="text-[10px]"
                style={{ color: "var(--text-secondary)" }}
              >
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {chatToDelete && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setChatToDelete(null)}
        >
          <div
            className="rounded-xl p-6 w-[320px] shadow-2xl"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-base font-semibold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Delete Chat
            </h2>

            <p
              className="text-sm mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              Delete{" "}
              <span style={{ color: "var(--text-primary)" }}>
                {chatToDelete.title || "Untitled Chat"}
              </span>
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setChatToDelete(null)}
                className="px-4 py-2 text-sm rounded-lg"
                style={{
                  background: "var(--bg-input)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                Cancel
              </button>

              <button
                onClick={deleteChat}
                className="px-4 py-2 text-sm rounded-lg font-medium"
                style={{ background: "var(--danger)", color: "#fff" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm shadow-lg z-50"
          style={{
            background: "#1e2130",
            color: "#e8eaf0",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}