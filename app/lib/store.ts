import { create } from "zustand";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatStore = {
  messages: Message[];
  currentChatId: number | undefined;
  streamingMessage: string;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  setCurrentChatId: (id: number | undefined) => void;
  setStreamingMessage: (msg: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  currentChatId: undefined,
  streamingMessage: "",
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  setMessages: (msgs) => set({ messages: msgs }),
  setCurrentChatId: (id) => set({ currentChatId: id }),
  setStreamingMessage: (msg) => set({ streamingMessage: msg }),
}));