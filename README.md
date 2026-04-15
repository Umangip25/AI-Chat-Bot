# 🤖 AI Chat Bot (Next.js + OpenAI)

A full-stack AI chat application built with **Next.js App Router**, **OpenAI GPT-4o-mini**, **Zustand**, and **IndexedDB (Dexie)**.

It supports real-time streaming chat, multi-session conversations, persistent storage, and built-in AI tools like weather, jokes, math, coding help, and general assistance.

---

## ✨ Features

* 💬 Real-time AI chat with OpenAI
* ⚡ Streaming responses (token-by-token UI updates)
* 🧠 AI-generated chat titles
* 💾 Persistent chat history using IndexedDB (Dexie)
* 📂 Multi-chat sidebar (create, switch, delete chats)
* 🗑️ Delete chat with confirmation modal
* 🔗 Share chat via copy-to-clipboard
* 🌗 Light & Dark theme support
* 🎨 Theme toggle with persistent localStorage sync
* 👤 Online user indicator in sidebar
* 📌 Non-collapsible sidebar layout
* 🤖 Built-in intent handling:

  * Weather assistant 🌤️
  * Joke generator 😂
  * Math solver ➗
  * Code assistant 💻
  * Basic life advice 💡

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript
* **State Management:** Zustand
* **AI Integration:** OpenAI API (`gpt-4o-mini`)
* **Database (Client-side):** IndexedDB (Dexie.js)
* **Styling:** Tailwind CSS + CSS variables
* **Streaming:** OpenAI streaming responses

---

## 📁 Project Structure

```
app/
 ├── api/
 │    ├── chat/route.ts        # Main chat API (intent handling + OpenAI)
 │    └── title/route.ts       # Chat title generator
 │
 ├── components/
 │    ├── ChatThread.tsx       # Chat UI renderer
 │    ├── Sidebar.tsx          # Chat history + actions
 │
 ├── page.tsx                  # Main chat page
 ├── layout.tsx                # Root layout

lib/
 ├── db.ts                     # Dexie IndexedDB setup
 ├── store.ts                  # Zustand global state
 ├── openai.ts                 # OpenAI client config

context/
 ├── ThemeProvider.tsx         # Theme state + localStorage sync
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
WEATHER_API_KEY=your_openweathermap_key
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

## 🧠 How It Works

### Chat Flow

1. User sends a message
2. Intent is detected (weather, joke, math, code, advice, general)
3. If weather → external API call (OpenWeatherMap)
4. Otherwise → OpenAI handles response
5. Response streams back in real-time

---

### Chat Persistence

* Chats stored in IndexedDB (Dexie)
* Each chat contains:

  * id
  * title
  * messages array

---

### Multi-Chat System

* Sidebar loads saved chats
* Switch between conversations instantly
* Create new chat sessions dynamically
* Delete unwanted chats

---

### Theme System

* Light / Dark mode toggle
* Theme stored in `localStorage`
* CSS variables control entire UI

---

## 🧠 Key Highlights

This project demonstrates:

* Real-world AI integration with routing logic
* Streaming responses in React UI
* Local-first data persistence (IndexedDB)
* Clean state management with Zustand
* Theme architecture using CSS variables
* Modular chat system design

---

## 🗑️ Future Improvements

* Backend database (PostgreSQL + Prisma)
* User authentication (Auth.js / Clerk)
* Chat sharing via link
* File + image support
* Voice input/output
* Advanced AI tools system (plugins architecture)

---

## 👩‍💻 Author

Built by Umangi Prajapati

