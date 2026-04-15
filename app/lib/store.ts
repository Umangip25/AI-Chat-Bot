import { create } from "zustand";

// Define the shape of a message in our chat
export type Message = {
  role: "user" | "assistant";
  content: string;
};

// Define the shape of our chat store
type ChatStore = {
  messages: Message[];
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
};

// Create the chat store using Zustand
export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  setMessages: (msgs) => set({ messages: msgs }),
}));