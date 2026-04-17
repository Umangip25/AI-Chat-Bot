"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/db";
import type { Chat } from "../lib/db";
import { useChatStore } from "../lib/store";

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const { setMessages, setCurrentChatId, currentChatId } = useChatStore();
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const loadChats = async () => {
      const { getUserChats } = await import("../lib/db");
      const userChats = await getUserChats();
      setChats(userChats);
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

  useEffect(() => {
    if (openMenuId === null) return;
    const handleClick = () => setOpenMenuId(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [openMenuId]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{
            top: "var(--topbar-height)",
            background: "rgba(0,0,0,0.7)"
          }}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar fixed md:relative z-50 md:z-auto flex flex-col shrink-0 transition-all duration-300 overflow-hidden
    ${isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:translate-x-0"}`}
        style={{
          background: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border)",
          top: "var(--topbar-height)",
          height: "calc(100vh - var(--topbar-height))",
        }}
      >
        {/* New Chat button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={newChat}
            className="w-full rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
            style={{
              color: "var(--text-primary)",
              background: "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-input)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span className="text-base">✏️</span>
            New Chat
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {chats.length === 0 ? (
            <p
              className="text-center mt-8 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              No chats yet
            </p>
          ) : (
            <>
              <p
                className="px-3 py-1 text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Recents
              </p>
              {chats.map((chat) => {
                if (!chat.id) return null;
                const id = chat.id;
                const isActive = currentChatId === id;

                return (
                  <div
                    key={id}
                    className="relative flex items-center justify-between px-3 py-2 rounded-lg text-sm group cursor-pointer"
                    style={{
                      background: isActive
                        ? "var(--bg-input)"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.background = "var(--bg-input)";
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
                        color: isActive
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                        fontWeight: isActive ? "500" : "400",
                      }}
                    >
                      {chat.title || "Untitled Chat"}
                    </span>

                    <button
                      className="px-1 opacity-0 group-hover:opacity-100 transition-opacity text-base"
                      style={{ color: "var(--text-secondary)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((prev) => (prev === id ? null : id));
                      }}
                    >
                      ⋯
                    </button>

                    {openMenuId === id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-2 top-10 w-36 rounded-xl shadow-xl z-50 overflow-hidden"
                        style={{
                          background: "var(--bg-secondary)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <button
                          onClick={() => {
                            setChatToDelete(chat);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:opacity-80"
                          style={{ color: "var(--danger)" }}
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
                          className="w-full text-left px-3 py-2 text-xs hover:opacity-80"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Share chat
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* User footer */}
        <div className="px-3 py-3">
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-input)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{
                background: "var(--accent)",
                color: "#fff",
              }}
            >
              U
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                You
              </span>
              <div className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#22c55e" }}
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
      </div>

      {/* Delete Modal */}
      {chatToDelete && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setChatToDelete(null)}
        >
          <div
            className="rounded-2xl p-6 w-[320px] shadow-2xl"
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
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
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
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}