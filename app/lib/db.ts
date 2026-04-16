import Dexie, { Table } from "dexie";
import type { Message } from "./store";

export interface Chat {
  id?: number;
  userId: string;
  messages: Message[];
  title: string;
  createdAt: number;
  lastLimitHitAt?: number;
}

class ChatDB extends Dexie {
  chats!: Table<Chat>;

  constructor() {
    super("ChatDatabase");
    this.version(2).stores({
      chats: "++id, userId",
    });
  }
}

export const db = new ChatDB();

export function getUserId(): string {
  let userId = localStorage.getItem("chat_user_id");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("chat_user_id", userId);
  }
  return userId;
}

export async function getUserChats() {
  const userId = getUserId();
  const all = await db.chats.where("userId").equals(userId).toArray();
  return all.reverse();
}

export const MAX_CHATS = 10;
export const MAX_MESSAGES = 10;
export const COOLDOWN_MS = 15 * 60 * 1000;

export function getChatLimitStatus(chat: Chat): {
  isLimited: boolean;
  cooldownRemaining: number;
} {
  const userMessages = chat.messages.filter((m) => m.role === "user");
  if (userMessages.length < MAX_MESSAGES) return { isLimited: false, cooldownRemaining: 0 };

  const lastHit = chat.lastLimitHitAt ?? 0;
  const elapsed = Date.now() - lastHit;
  const remaining = COOLDOWN_MS - elapsed;

  if (remaining <= 0) return { isLimited: false, cooldownRemaining: 0 };
  return { isLimited: true, cooldownRemaining: remaining };
}