# 🤖 AI Chatbot (React + Gemini API)

A modern AI-powered chatbot built using **React**, featuring real-time conversation, context awareness, and a clean responsive UI.
Deployed and fully functional with Google Gemini API.

---

## 🚀 Live Demo

🔗 https://chatly-assistant.vercel.app/

---

## ✨ Features

* 💬 Real-time chat interface
* 🧠 Context-based conversation handling
* ⚡ Instant response with loading animation
* 🎨 Clean and modern UI (Dark/Light mode)
* 📱 Fully responsive (mobile + desktop)
* 🗂️ Multiple chat history support
* 🧹 Delete chats functionality
* 🔄 Smooth animations (message + UI transitions)

---

## 🛠️ Tech Stack

* **Frontend:** React, Tailwind CSS
* **State Management:** Context API
* **API:** Google Gemini API
* **Icons:** Lucide React
* **Deployment:** Vercel

---

## 📂 Project Structure

```
src/
│── components/
│   ├── ChatLayout.jsx
│   ├── Sidebar.jsx
│   ├── QuerryAnswer.jsx
│   └── Answers.jsx
│
│── context/
│   └── ChatContext.jsx
│
│── services/
│   └── chatService.js
│
│── utils/
│   └── chatHelpers.js
│
│── constants/
│   └── constants.js
│
└── App.jsx
```

---

## ⚙️ Installation & Setup

Clone the repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_KEY=your_gemini_api_key
```

Run the project:

```bash
npm run dev
```

---

## 🌐 Deployment

This project is deployed using **Vercel**.

Steps:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable:

   ```
   VITE_API_KEY=your_api_key
   ```
4. Deploy 🚀

---

## 🧠 Key Learnings

* Handling async API calls in real-time apps
* Managing global state using Context API
* Building responsive and interactive UI
* Debugging API & deployment issues
* Understanding environment variables and production setup

---

<!-- ## 📸 Screenshots

(Add your project screenshots here)

--- -->

## 📌 Future Improvements

* Typing animation (AI response)
* Streaming responses
* Chat rename feature
* Copy message button
* Better markdown rendering

---

## 👨‍💻 Author

**Aditya**

* Passionate about AI, development, and building real-world projects
* Always learning and improving 🚀

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
