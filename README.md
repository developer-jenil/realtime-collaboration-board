<div align="center">
  <br />
  <h1>✨ TaskFlow - Real-Time Collaborative Workspace</h1>
  <p>
    A premium, full-stack Kanban task management application featuring real-time synchronization, advanced drag-and-drop, and a beautiful SaaS-style UI. Built with the MERN stack and Socket.IO.
  </p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
  [![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](#)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
</div>

<br />

## 🚀 Features

- **Real-Time Collaboration:** Instant synchronization across all connected clients using WebSockets (`Socket.IO`). When one team member moves a task, everyone sees it instantly.
- **Advanced Drag & Drop:** Fluid, animated task reordering and column transitions powered by `@dnd-kit` and `framer-motion`.
- **AI Task Suggestions:** An intelligent unified dashboard that aggregates tasks across all your boards, sorting them algorithmically by closest due date and highest priority.
- **Data Retention & History:** A comprehensive soft-delete architecture. Completed or removed tasks are sent to an interactive `History` log where they can be permanently destroyed or restored to their exact previous location.
- **Secure Authentication:** Complete JWT-based user authentication and protected routing.
- **Premium UI/UX:** Responsive, modern SaaS design featuring glassmorphism, smooth micro-interactions, dark mode support, and tailored color palettes.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS v3, Glassmorphism UI
- **Animations:** Framer Motion
- **Interactions:** `@dnd-kit` (Drag and Drop)
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Real-Time:** Socket.IO
- **Security:** JWT (JSON Web Tokens), bcrypt.js

## 📸 Screenshots

*(Replace these with your actual screenshots)*

| Dashboard View | AI Suggestions | Task Drag & Drop |
| :---: | :---: | :---: |
| <img src="https://via.placeholder.com/400x250/0f172a/ffffff?text=Dashboard+Screenshot" alt="Dashboard" /> | <img src="https://via.placeholder.com/400x250/0f172a/ffffff?text=AI+Suggestions+Screenshot" alt="AI Suggestions" /> | <img src="https://via.placeholder.com/400x250/0f172a/ffffff?text=Drag+and+Drop+Screenshot" alt="Drag and Drop" /> |

## 💻 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed locally or a MongoDB Atlas URI.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/taskflow.git
   cd taskflow
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskboard
   JWT_SECRET=your_super_secret_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Open the Application:**
   Visit `http://localhost:5173` in your browser.

## 📁 Project Structure

```text
📦 project-root
 ┣ 📂 backend
 ┃ ┣ 📂 controllers   # Express route handlers
 ┃ ┣ 📂 middleware    # JWT auth protection
 ┃ ┣ 📂 models        # Mongoose database schemas
 ┃ ┣ 📂 routes        # API endpoints
 ┃ ┗ 📜 server.js     # Entry point & Socket.io setup
 ┗ 📂 frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components  # Reusable UI elements (Sidebar, TaskCard)
 ┃ ┃ ┣ 📂 context     # React Context (Auth, Socket)
 ┃ ┃ ┣ 📂 pages       # Full page views (Board, History, Suggestions)
 ┃ ┃ ┣ 📂 services    # Axios API configurations
 ┃ ┃ ┗ 📜 App.jsx     # Main React router setup
 ┃ ┣ 📜 tailwind.config.js # Custom SaaS theme configuration
 ┃ ┗ 📜 vite.config.js
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#).

## 📄 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
