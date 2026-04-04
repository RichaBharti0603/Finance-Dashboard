# 🚀 Zorvyn FinTech Dashboard

A modern, responsive **finance dashboard web application** built using React, TypeScript, and Vite. This application enables users to track financial activity, visualize insights, and experience a clean role-based UI system with a premium glassmorphism design.

---

## 📌 Project Overview

Zorvyn FinTech Dashboard is designed to simulate a real-world financial analytics product. It focuses on:

* Clean UI/UX with a modern design system
* Efficient state management
* Interactive data visualization
* Role-based access control (RBAC)
* Local persistence without backend dependency

---

## 🛠️ Tech Stack

### Frontend

* **React + Vite + TypeScript** → Fast, scalable, type-safe development
* **Context API** → Centralized global state management

### Styling

* **Vanilla CSS + CSS Variables**

  * Glassmorphism UI system
  * Fully responsive layout
  * Native Light/Dark mode support

### Data & Utilities

* **localStorage** → Persistent client-side storage
* **Recharts** → Interactive charts (Area & Pie)
* **date-fns** → Date formatting & calculations
* **lucide-react** → Clean icon system

---

## ✨ Features

### 📊 Dashboard Analytics

* Total Balance, Income, and Expenses summary cards
* Interactive **Income vs Expense trend chart**
* Category-wise **spending breakdown (donut chart)**

---

### 📄 Transactions Management

* View all transactions in a structured table
* Search by title or category
* Filter (Income / Expense)
* Sort transactions dynamically
* Export transaction data as CSV

---

### 🔐 Role-Based Access Control (RBAC)

Simulated user roles:

| Role   | Permissions                     |
| ------ | ------------------------------- |
| Viewer | Read-only access                |
| Editor | Add & edit transactions         |
| Admin  | Full access (add, edit, delete) |

---

### 🧠 Smart Insights

* Highest spending category detection
* Month-over-Month (MoM) expense comparison
* Savings rate calculation

---

### 🎨 Theming System

* Light & Dark mode toggle
* CSS variable-driven design tokens
* Smooth UI consistency across components

---

## ⚙️ Setup Instructions

### 📌 Prerequisites

* Node.js (v16 or above recommended)

---

### 📥 Installation

```bash
npm install
```

---

### ▶️ Run Locally

```bash
npm run dev
```

Visit:

```
http://localhost:5173/
```

---

### 🏗️ Production Build

```bash
npm run build
```

Output will be generated in the `dist/` directory.

---

## 🚀 Deployment

This project is optimized for **Vercel deployment**.

### Steps:

1. Push code to GitHub
2. Import repository in Vercel
3. Configure:

   * Build Command: `npm run build`
   * Output Directory: `dist`
4. Deploy

---

## 📁 Project Structure

```
src/
│── components/        # Reusable UI components
│── context/           # Global state (FinanceContext)
│── pages/             # Dashboard & main views
│── data/              # Mock data
│── types/             # TypeScript definitions
│── styles/            # Global CSS
```

---

## 💡 Key Highlights

* ⚡ High-performance Vite setup
* 🧩 Scalable architecture using Context API
* 📊 Real-time data visualization
* 🔐 Role-based UI behavior
* 🎯 Production-ready design system

---

## 📌 Future Enhancements

* Backend integration (Firebase / Supabase)
* Authentication system (JWT / OAuth)
* Real-time sync across devices
* AI-based financial recommendations
* Advanced analytics & forecasting

---

## 👩‍💻 Author

**Richa Bharti**

---

## 📜 License

This project is licensed under the MIT License.

---
