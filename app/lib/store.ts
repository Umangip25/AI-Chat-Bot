import { create } from "zustand";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatStore = {
  messages: Message[];
  currentChatId: number | undefined;
  streamingMessage: string;
  isLimited: boolean;
  cooldownRemaining: number;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  setCurrentChatId: (id: number | undefined) => void;
  setStreamingMessage: (msg: string) => void;
  setLimitStatus: (isLimited: boolean, cooldownRemaining: number) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  currentChatId: undefined,
  streamingMessage: "",
  isLimited: false,
  cooldownRemaining: 0,
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  setMessages: (msgs) => set({ messages: msgs }),
  setCurrentChatId: (id) => set({ currentChatId: id }),
  setStreamingMessage: (msg) => set({ streamingMessage: msg }),
  setLimitStatus: (isLimited, cooldownRemaining) =>
    set({ isLimited, cooldownRemaining }),
}));