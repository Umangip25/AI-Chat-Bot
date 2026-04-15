Here’s a clean, professional `README.md` based on everything you’ve built so far. You can directly paste this into your project root.

---

# 🤖 AI Chat Bot (Next.js + OpenAI)

A full-stack AI chat application built with **Next.js App Router**, **OpenAI GPT-4o-mini**, **Zustand**, and **IndexedDB (Dexie)**.
It supports multi-chat sessions, streaming responses, chat persistence, and AI-generated titles.

---

## ✨ Features

* 💬 Real-time AI chat using OpenAI
* ⚡ Streaming responses (word-by-word output)
* 🧠 AI-generated chat titles
* 💾 Persistent chat storage using IndexedDB (Dexie)
* 📂 Multi-chat sidebar (create, switch, delete chats)
* 🗑️ Delete chat with confirmation modal
* ⚛️ Zustand for global state management
* 🚀 Next.js App Router architecture

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (React, TypeScript)
* **State Management:** Zustand
* **AI Integration:** OpenAI API (`gpt-4o-mini`)
* **Database (Client-side):** IndexedDB via Dexie.js
* **Styling:** Tailwind CSS
* **Streaming:** OpenAI streaming responses

---

## 📁 Project Structure

```
app/
 ├── api/
 │    ├── chat/route.ts        # Chat completion API
 │    └── title/route.ts       # Chat title generator API
 ├── components/
 │    ├── ChatThread.tsx       # Chat UI renderer
 │    ├── Sidebar.tsx          # Chat history + delete modal
 ├── page.tsx                  # Main chat page
 ├── layout.tsx                # Root layout

lib/
 ├── db.ts                     # Dexie IndexedDB setup
 ├── store.ts                  # Zustand global store
 ├── openai.ts                 # OpenAI client config
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ai-chat-bot.git
cd ai-chat-bot
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Add environment variables

Create a `.env.local` file:

```bash
OPENAI_API_KEY=your_openai_api_key
```

---

### 4. Run the app

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 💡 How It Works

### 1. Chat Flow

* User sends message
* Message stored in Zustand state
* API `/api/chat` sends request to OpenAI
* Response streamed back in real-time
* UI updates word-by-word

---

### 2. Chat Persistence

* Chats stored in IndexedDB (Dexie)
* Each chat has:

  * `id`
  * `title`
  * `messages[]`

---

### 3. Multi-chat System

* Sidebar loads all saved chats
* Click to switch between conversations
* New chats automatically created
* Delete chat via confirmation modal

---

### 4. AI Title Generation

* First message triggers `/api/title`
* AI generates short chat title
* Stored with chat session

---

## 🧠 Key Highlights

This project demonstrates:

* Real-world AI integration
* Streaming APIs in React
* Client-side database usage
* Global state management
* Scalable chat architecture
* Clean UI/UX patterns

---

## 🗑️ Future Improvements

* Server-side database (PostgreSQL / Prisma)
* Auth (login per user)
* Chat sharing
* File/image support
* Voice input/output
* AI tools (weather, jokes, etc.)

---

## 📸 UI Preview

> Add screenshots here later (optional)

---

## 👩‍💻 Author

Built by **Umangi Prajapati**

---

If you want next upgrade, I can help you:

👉 turn this into a **portfolio-ready production app**
👉 deploy it on **Vercel**
👉 add **login + cloud DB (Supabase / Firebase)**
👉 or add **AI tools (weather, jokes, career assistant, etc.)**

Just tell me 👍
