# <p align="center">🌟 Learnify: The Real-World LMS Platform 🎓</p>

<p align="center">
  <img src="./C:/Users/satwi/.gemini/antigravity/brain/5c41704d-9512-4ca6-9470-f2dffa04fae6/learnify_readme_banner_1775499876303.png" alt="Learnify Banner" width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Learnify-Full--Stack--LMS-blueviolet?style=for-the-badge&logo=react" alt="Full Stack Badge">
  <img src="https://img.shields.io/badge/Premium--UI-Glassmorphism-accent?style=for-the-badge&logo=tailwindcss" alt="UI Badge">
  <img src="https://img.shields.io/badge/Backend-Express--Real--World-61DAFB?style=for-the-badge&logo=node.js" alt="Backend Badge">
</p>

---

## 🚀 Vision
**Learnify** is not just another tutorial site; it's a professional-grade Learning Management System (LMS) designed for the real world. Built with the **MERN** stack, it delivers an "Elite" user experience through **Glassmorphism design**, **Framer Motion animations**, and a robust, relational backend infrastructure.

---

## 💎 Elite Feature Showcase

### 🎓 Student Experience (Study Mode)
- **Interactive Dashboards**: Real-time progress tracking with percentage-based course completion.
- **Micro-Animations**: Seamless page transitions and interactive elements powered by Framer Motion.
- **Dynamic Exploration**: Premium course search with category filtering and instant UI feedback.

### 🧑‍🏫 Instructor Command Center
- **Dynamic Stats Engine**: Real-time revenue and enrollment tracking using MongoDB aggregation.
- **Course Lifecycle Management**: Professional `Draft`, `Published`, and `Archived` states.
- **Soft-Deletion Protection**: Delete courses without wiping student data—courses are safely archived.
- **Instructor Portfolios**: Dedicated public-facing portfolios showcasing an instructor's full curriculum.

### 🛡️ Administrative Oversight
- **Global Platform Health**: Real-time stats across all users, courses, and enrollments.
- **Performance Analytics**: Detailed instructor breakdowns with revenue and student engagement metrics.
- **RBAC (Role Based Access Control)**: Secure student, instructor, and admin flows.

---

## 🛠️ The Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Vanilla CSS (Glassmorphism), Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js, JWT (Cookie-based Auth), Zod (Validation) |
| **Database** | MongoDB + Mongoose (Aggregation Framework, Sync Logic) |
| **Styling** | Modern CSS Variables, Responsive Grids, Flexbox |
| **Security** | BCrypt Hashing, HTTP-only Cookies, RBAC Middlewares |

---

## 🧠 Real-World "Under the Hood" Logic
Unlike basic tutorials, Learnify implements production-grade backend logic:
- **Atomic Synchronization**: Course `enrolledCount` is automatically synchronized with real enrollment records.
- **Data Integrity**: Uses MongoDB lookups to ensure student metrics are always accurate.
- **Relational Seeding**: Dynamic seed engine creates 20+ mock students and real enrollment flows for instant demo capability.

---

## ⚙️ Installation & Setup

### 1. Server Setup
```bash
cd server
npm install
# Setup .env with MONGO_URI, PORT, and JWT_SECRET
npm run seed  # 🌱 Essential: Creates the elite demo environment
npm run dev
```

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

---

## 🤝 Demo Credentials
Feel free to explore the platform using these pre-seeded demo accounts:
- **Student**: `student@learnify.com` / `Demo@1234`
- **Instructor**: `instructor@learnify.com` / `Demo@1234` (Username: **Bob**)
- **Admin**: `admin@learnify.com` / `Demo@1234`

---

<<<<<<< HEAD
<p align="center">Built with ❤️ for a state-of-the-art learning experience.</p>
=======
## 🎨 Sample Diagram

![Learnify Backend Architecture](./server/src/Assets/learnify-server.svg)

---

## 🧪 API Testing

Test using **Postman** or **Thunder Client**:

* 🔐 Protected routes require login
* 📸 Upload course image with `multipart/form-data`
* 🧾 Check response for `JWT cookie` auth

---

## ⚙️ Setup & Installation

```bash
# 📥 Clone the repository
$ git clone https://github.com/your-username/learnify-server.git

# 📦 Install dependencies
$ cd learnify-server && npm install

# 🧬 Setup environment variables
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# 🚀 Start the server
$ npm run start
```

---

## 🔮 What's Next (Part 2)

* 💳 Mock payment + confirmation screen
* 📊 Dashboard UI with stats
* 🧑‍🏫 Instructor controls
* 👮 RBAC (Admin, Student, Instructor)
* 💻 Frontend with **EJS / React**

---

## 🤝 Contributing

Pull requests welcome 🙌
If you find a bug or have an idea, feel free to [open an issue](https://github.com/your-username/learnify-server/issues).

---

## 📄 License

MIT License © 2025 \[Your Name or GitHub Handle]

---
.....
> Built with ❤️ by a passionate learner & open-source enthusiast.
>>>>>>> d7d966652841c9082ee5477e4f4810ab6af331d1
