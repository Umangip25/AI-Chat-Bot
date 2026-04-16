Got it — I updated your README to clearly include **local storage persistence + chat max limit feature**, while keeping everything clean and recruiter-ready.

Here is your updated version (only meaningful additions, no fluff):

---

# 🤖 AI Chat App (Next.js + OpenAI)

A full-stack AI chat application built with **Next.js App Router**, **OpenAI GPT-4o-mini**, **Zustand**, and **IndexedDB (Dexie)**.

It supports real-time streaming chat, multi-session conversations, persistent storage, and built-in AI tools like weather, jokes, math, coding help, and general assistance.

---

## ✨ Features

* 💬 Real-time AI chat with streaming responses
* ⚡ Token-by-token UI updates for smooth experience
* 🧠 AI-generated chat titles
* 💾 Persistent chat history using IndexedDB (Dexie)
* 📦 Local storage support for theme and user preferences
* 📂 Multi-chat system (create, switch, delete chats)
* 🚫 Chat limit feature to control maximum number of stored chats (auto-handling of older chats when limit is reached)
* 🔗 Share chat via copy-to-clipboard
* 🌗 Light / Dark theme support
* 🎨 Theme persistence using localStorage sync
* 👤 Sidebar with active chat management
* 🗑️ Delete chats with confirmation modal
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

---

## 🧠 Key System Features

### 💾 Storage System

* Chats are persisted using IndexedDB (Dexie)
* Lightweight localStorage used for:

  * Theme preference
  * UI settings
* Ensures data persists even after refresh or browser restart

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
  * Delete chats

---

### 🚫 Chat Limit Feature

* System enforces a **maximum chat limit**
* When limit is reached:

  * Older chats are automatically removed / managed
  * Ensures performance stays stable
  * Prevents unlimited storage growth in IndexedDB

---

### 🧠 Chat Flow

* User sends message
* Intent detection runs (weather, joke, math, code, general)
* Weather uses external API
* Others go through OpenAI
* Streaming response renders in real time

---

## 🚀 Future Improvements

* Backend database (PostgreSQL + Prisma)
* Authentication (Auth.js / Clerk)
* Chat sharing via public links
* File and image uploads
* Voice input/output
* Plugin-based AI tools system

---

## 👩‍💻 Author

Built by Umangi Prajapati

---

## 📸 Screenshots

## 📸 UI
<img width="1512" height="833" alt="UI" src="https://github.com/user-attachments/assets/2e719b5c-93b3-4661-b084-32f4207ca7b7" />

## 📸 JOKE
<img width="1512" height="833" alt="JOKE" src="https://github.com/user-attachments/assets/c5ef85eb-df01-47ea-86d1-254a77a72303" />

## 📸 Light/ Dark Theme
<img width="1512" height="833" alt="Light/ Dark Theme" src="https://github.com/user-attachments/assets/24ae7d17-9d74-4ac8-91ea-5225468c9dda" />

## 📸 Light/ Dark Theme
<img width="1512" height="833" alt="Light/ Dark Theme" src="https://github.com/user-attachments/assets/60426cc9-8fce-4bed-a3c3-6d6381a7b14e" />

## 📸 Weather
<img width="1512" height="833" alt="WeatherM" src="https://github.com/user-attachments/assets/7e3b6f37-5d5b-4061-9c48-49b2f21aced9" />
