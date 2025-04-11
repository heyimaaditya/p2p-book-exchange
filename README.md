# 📚 Peer-to-Peer Book Exchange Portal

A full-stack web application that allows users to rent or exchange books. Users can register as **Book Owners** to list books, or as **Book Seekers** to search and connect with owners.

---

## 🚀 Features

- 🔐 User registration/login with role-based dashboard (Owner / Seeker)
- 📖 Owners can:
  - Add new books (Title, Author, Genre, Location, Contact Info)
  - Upload book cover images
  - Edit or delete their listings
- 🔍 Seekers can:
  - View and filter listings by title, genre, and location
- 🌈 Tailwind CSS for clean, responsive UI with animations
- 🎁 Bonus Features:
  - Filter by genre and location
  - Cover image uploads (Multer)
  - Animations (fade-in, button transitions)
- 🛠️ Stack:
  - Frontend: React + Next.js
  - Backend: Node.js + Express
  - Database: MongoDB
  - Styling: Tailwind CSS

---

## 🛠️ Project Structure

```
p2p-book-exchange/
├── backend/       # Node.js + Express API
├── frontend/      # Next.js + Tailwind frontend
└── README.md
```

---

## ⚙️ Getting Started

### 🧠 Prerequisites

- Node.js (v16 or above)
- MongoDB (local or Atlas)

### 📦 Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # Fill in MongoDB URI and JWT_SECRET
npm run dev
```

### 🌐 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)


---

## 🧪 What's Working

- ✅ Role-based login & registration
- ✅ Create/edit/delete book listings (owner)
- ✅ Search + filters for seekers
- ✅ Upload and view book cover images
- ✅ Tailwind styling with responsive design
- ✅ Bonus: Filters, Animations

---

## ❌ What’s Not (or could be improved)

- ❗ Robust error handling
- ❗ JWT in httpOnly cookies for production
- ❗ Image upload to cloud (currently local folder only)
-   I try to deploy it but its not wokring properly due to error in my vercel account 

---

## ⚙️ Deployment (Optional)

- 🌐 Frontend: https://p2p-book-exchange.vercel.app/
- 🛠️ Backend: https://p2p-book-exchange.onrender.com

---

## 🤖 AI Tools Used

- ChatGPT for generating boilerplate, code review, and UI/UX suggestions

---

