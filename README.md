# 🤖 AI Chat App (Next.js + OpenAI)

A full-stack AI chat application built with **Next.js App Router**, **OpenAI GPT-4o-mini**, **Zustand**, and **IndexedDB (Dexie)**.
It supports real-time streaming chat, multi-session conversations, persistent storage, math rendering, and built-in AI tools like weather, jokes, math, coding help, and general assistance.

---

## ✨ Features

* 💬 Real-time AI chat with streaming responses
* ⚡ Token-by-token UI updates for smooth experience
* 🧠 AI-generated chat titles
* 💾 Persistent chat history using IndexedDB (Dexie)
* 📦 Local storage support for theme and user preferences
* 📂 Multi-chat system (create, switch, delete chats)
* 🚫 Chat limit feature to control maximum number of stored chats
* 🔗 Share chat via copy-to-clipboard
* 🌗 Light / Dark theme support with hydration-safe toggle
* 🎨 Theme persistence using localStorage sync
* 👤 Sidebar with active chat management
* 🗑️ Delete chats with confirmation modal
* 📐 LaTeX math rendering using KaTeX (via remark-math + rehype-katex)
* 📱 Fully responsive UI — mobile, tablet, and desktop
* 🤖 Built-in AI tools:
  * Weather assistant 🌤️
  * Joke generator 😂
  * Math solver ➗
  * Code assistant 💻
  * General advice 💡

---

## 🛠️ Tech Stack

* Next.js (App Router)
* React + TypeScript
* OpenAI API (GPT-4o-mini)
* Zustand (state management)
* Dexie.js (IndexedDB storage)
* LocalStorage (UI + preference persistence)
* Tailwind CSS
* CSS Variables (theme system)
* KaTeX + remark-math + rehype-katex (math rendering)
* react-markdown (markdown rendering)

---

## 🧠 Key System Features

### 💾 Storage System
* Chats are persisted using IndexedDB (Dexie)
* Lightweight localStorage used for:
  * Theme preference
  * UI settings
* Ensures data persists even after refresh or browser restart

---

### 📐 Math Rendering
* LaTeX expressions are rendered beautifully using **KaTeX**
* Integrated via `remark-math` and `rehype-katex` plugins in `react-markdown`
* Supports both block (`\[ ... \]`) and inline (`\( ... \)`) math expressions
* No post-processing or string manipulation — rendered natively in the browser

---

### 📱 Responsive Design
* Mobile-first layout with sidebar as a hidden overlay drawer on small screens
* Sidebar auto-closes on mobile by default, opens on toggle
* On tablet and desktop, sidebar is always visible and pushes content
* Dark overlay backdrop when sidebar is open on mobile
* Consistent topbar across all screen sizes
* Chat bubbles and input bar adapt to screen width

---

### 🌗 Theme System
* Light and Dark themes using CSS variables
* Theme toggle is hydration-safe (no SSR mismatch)
* Seamless color transitions across all components
* Sidebar, topbar, chat area, and bubbles all respect theme variables

---

### 📂 Chat Management System
* Multiple chat sessions supported
* Each chat contains:
  * id
  * title
  * messages
* Users can:
  * Create new chats
  * Switch between chats
  * Delete chats with confirmation modal
  * Share/copy chat via clipboard

---

### 🚫 Rate Limiting
* System enforces a **maximum message limit per chat**
* System enforces a **maximum number of chats**
* When message limit is reached:
  * Cooldown timer is applied
  * User is notified via limit banner
* When chat limit is reached:
  * New chat creation is blocked until a chat is deleted

---

### 🧠 Chat Flow
* User sends message
* Intent detection runs (weather, joke, math, code, general)
* Weather uses external OpenWeatherMap API
* Others go through OpenAI with intent-specific system prompts
* Streaming response renders token-by-token in real time
* Chat title is auto-generated via a separate API call on first message

---

## 🚀 Potential Future Enhancements

* 🗄️ Backend database integration (PostgreSQL + Prisma)
* 🔐 User authentication (Auth.js / Clerk)
* 🔗 Public chat sharing via unique links
* 📁 File and image upload support
* 🎙️ Voice input and output
* 🔌 Plugin-based AI tools system
* 🔍 Search through past chats

---

## 👩‍💻 Author

Built by Umangi Prajapati

---
