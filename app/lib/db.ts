import Dexie, { Table } from "dexie";
import type { Message } from "./store";

export interface Chat {
  id?: number;
  messages: Message[];
  title: string;
}

// Define the database
class ChatDB extends Dexie {
  chats!: Table<Chat>;

  // Define the database schema
  constructor() {
    super("ChatDatabase");
    this.version(1).stores({
      chats: "++id",
    });
  }
}

export const db = new ChatDB();