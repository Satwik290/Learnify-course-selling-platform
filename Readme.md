# 🌟 Learnify - Online Course Platform Backend

> 🎓 *Empower your learning journey with a scalable, feature-rich backend!*

![Learnify Banner](https://img.shields.io/badge/Learnify-Online--Course--Backend-blueviolet?style=for-the-badge\&logo=server)

---

## 🚀 Tech Stack

| 🧱 Category          | 🚀 Tech Used           |
| -------------------- | ---------------------- |
| ⚙️ Backend Framework | **Express.js**         |
| 🗄️ Database         | **MongoDB + Mongoose** |
| 🔐 Auth              | **JWT + Cookies**      |
| ✅ Validation         | **Zod**                |
| 🔒 Encryption        | **bcrypt**             |
| 📁 File Upload       | **Multer**             |
| ⚙️ Config Management | **dotenv**             |
| ☁️ Deployment Ready  | ✔️ Railway / Render    |

---

## 🧠 Project Structure

```bash
learnify-server/
├── config/                # 🛠️ DB and environment setup
│   ├── db.js
│   └── env.js
├── controllers/          # 🎯 Route logic
├── models/               # 🧬 Mongoose schemas
├── routes/               # 🛣️ Express routes
├── middlewares/          # 🧱 Custom middleware
├── utils/                # 🧪 Validators and helpers
├── uploads/              # 🖼️ Uploaded images
├── App.js                # 🚀 Server entry point
└── .env
```

---

## 🔐 Features Implemented (🚀 Part 1 Complete!)

### 🔑 Auth System

* ✅ Signup/Login with **JWT + Cookies**
* ✅ Password hashing with **bcrypt**
* ✅ Strong input validation using **Zod**

### 👤 User Profile

* 👁️ View profile
* 📝 Edit profile (bio, skills, photo)

### 📚 Courses

* 🆕 Create courses with thumbnail upload
* 🔍 View all & single course
* ✏️ Update/Delete (protected)

### 📥 Enrollments

* 🚀 Enroll in any course
* 📘 View enrolled courses
* ❌ Unenroll from a course

### 💸 Mock Payments *(Coming Day 5)*

* Simulated Stripe flow before enrollment

---

## 🎨 Sample Diagram

![Learnify Backend Architecture](./assets/learnify-backend-arch.svg)

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

> Built with ❤️ by a passionate learner & open-source enthusiast.
