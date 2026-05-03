<img src="https://capsule-render.vercel.app/api?type=waving&color=0:000000,50:7f1d1d,100:dc2626&height=220&section=header&text=AuriQAI&fontSize=52&fontColor=ffffff&fontAlignY=40&desc=AI%20Chat%20Application%20%7C%20Next.js%20%C2%B7%20OpenAI%20%C2%B7%20Zustand%20%C2%B7%20Dexie&descSize=18&descAlignY=60&animation=fadeIn" width="100%"/>

<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=22&pause=1000&color=DC2626&center=true&vCenter=true&width=700&height=60&lines=Real-time+AI+Chat+with+Streaming+%F0%9F%A4%96;Multi-session+Chat+%2B+Persistent+Storage+%F0%9F%92%BE;Math+Rendering+with+KaTeX+%E2%9E%97;AI+Tools+-+Weather+%2C+Code+%2C+Jokes+%2C+More)](https://git.io/typing-svg)

</div>

<br>

## 🤖 AuriQ — AI Chat Application

A full-stack AI chat application built with **Next.js App Router**, **OpenAI GPT-4o-mini**, **Zustand**, and **IndexedDB (Dexie)**.

Designed to feel fast, intelligent, and production-ready with streaming responses, persistent chat sessions, and built-in AI tools.

---

## 🚀 Live Demo

<div align="center">

👉 **[Try AuriQ Live](https://ai-chat-bot-theta-rust.vercel.app/)**

</div>

---

## ✨ Features

- 💬 Real-time AI chat with streaming responses  
- ⚡ Token-by-token UI updates  
- 🧠 AI-generated chat titles  
- 💾 Persistent chat history (IndexedDB via Dexie)  
- 📂 Multi-chat system (create, switch, delete)  
- 🚫 Chat + message limit with cooldown handling  
- 🔗 Share chat via clipboard  
- 🌗 Light / Dark theme with persistence  
- 📐 LaTeX math rendering (KaTeX)  
- 📱 Fully responsive across all devices  

### 🤖 Built-in AI Tools
- 🌤️ Weather assistant  
- 😂 Joke generator  
- ➗ Math solver  
- 💻 Code assistant  
- 💡 General AI help  

---

## 🧠 System Highlights

### 💾 Storage Architecture
- IndexedDB (Dexie) for chat persistence  
- localStorage for UI + theme preferences  
- Survives refresh and browser restarts  

---

### 📐 Math Rendering
- Powered by **KaTeX**
- Integrated with `remark-math` + `rehype-katex`
- Supports inline and block LaTeX  
- No hacks, clean native rendering  

---

### 📂 Chat System
Each chat includes:
- id  
- title  
- messages  

Users can:
- Create new chats  
- Switch sessions  
- Delete with confirmation  
- Share chats  

---

### 🚫 Rate Limiting
- Max **10 messages per chat**  
- Max **10 chats total**  
- Cooldown timer when limit is reached  
- Prevents excessive usage and improves UX  

---

### 🔄 Chat Flow
- User sends message  
- Intent detection runs (weather, math, joke, code, general)  
- Weather → OpenWeather API  
- Others → OpenAI (GPT-4o-mini)  
- Streaming response rendered in real time  
- Title auto-generated on first message  

---

## 🛠️ Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-FF6600?style=for-the-badge&logo=npm&logoColor=white)
![Dexie.js](https://img.shields.io/badge/Dexie.js-IndexedDB-FF6B35?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![KaTeX](https://img.shields.io/badge/KaTeX-Math%20Rendering-DC2626?style=for-the-badge)

</div>

---

## 🔮 Future Enhancements

- 🗄️ PostgreSQL + Prisma backend  
- 🔐 Authentication (Auth.js / Clerk)  
- 🔗 Shareable public chat links  
- 📁 File + image uploads  
- 🎙️ Voice input/output  
- 🔌 Plugin-based AI tools  
- 🔍 Chat search  

---

## 👩‍💻 Author

**Umangi Prajapati**  
Frontend Software Engineer  

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:dc2626,50:7f1d1d,100:000000&height=120&section=footer&animation=twinkling" width="100%"/>

</div>
