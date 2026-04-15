import { create } from "zustand";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatStore = {
  messages: Message[];
  currentChatId: number | undefined;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  setCurrentChatId: (id: number | undefined) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  currentChatId: undefined,
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  setMessages: (msgs) => set({ messages: msgs }),
  setCurrentChatId: (id) => set({ currentChatId: id }),
}));