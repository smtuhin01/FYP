# 🧠 MRI Simulator - Student & Lecturer Portal

A web-based platform for managing MRI simulation access, authentication, and educational interactions for students, lecturers, and admins. Built with **Node.js**, **Express**, **MongoDB**, and **plain HTML/CSS/JS** (served statically).

---

## 🚀 Features

- 🔐 **Authentication System** for Students, Lecturers, and Admins
- 📚 **Role-based Dashboards**
- 📁 Media Upload & Categorization (Video/Brain/Spine/Cardiac/Abdominal)
- 📊 Student Activity Management
- 🧑‍🏫 Lecturer Access & Token-Based Login
- 📬 Email Integration (Password Reset)
- 🎯 Real-time Portal Redirection with Secure JWT Authorization
- 🌐 Hosted locally on `http://localhost:5001` or your defined port

---

## 📂 Project Structure

```

tuhin-fyp/
│
├── public/                   # Frontend static files
│   ├── home.html
│   ├── signup.html
│   ├── login.html
│   ├── lecturer/
│   ├── picture/
│   └── js/
│
├── routes/                   # Express route handlers
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── lecturerRoutes.js
│   └── assistantRoutes.js
│
├── controllers/              # Business logic
├── models/                   # Mongoose models
├── middleware/               # Auth middlewares
├── config/
│   └── db.js                 # MongoDB connection
│
├── server.js                 # Main server file
├── .env                      # Environment variables
└── package.json

````

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB (with Mongoose)
- **Frontend**: HTML5, CSS3 (Tailwind), Vanilla JS
- **File Upload**: `multer` with local storage
- **Auth**: JWT + bcryptjs
- **Email**: Nodemailer
- **Security**: CORS, environment isolation

---

## ⚙️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone git@github.com:smtuhin01/FYP.git
   cd FYP
````

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root:

   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/mri_simulator
   JWT_SECRET=your_secret_key
   GROQ_API_KEY=your_api_key
   ```

4. **Run the Server**

   ```bash
   npm run dev    # with nodemon (recommended for development)
   npm start      # plain node
   ```

5. **Access in Browser**

   ```
   http://localhost:5001/
   ```

---

## 📌 API Endpoints

| Method | Endpoint                    | Description                       |
| ------ | --------------------------- | --------------------------------- |
| POST   | `/api/auth/login`           | Student login                     |
| POST   | `/api/auth/signup`          | Student signup                    |
| POST   | `/api/admin/login`          | Admin login                       |
| GET    | `/api/admin/students`       | View all students (admin)         |
| POST   | `/api/admin/media`          | Upload file (admin, `multipart`)  |
| POST   | `/api/admin/lecturer-login` | Generate temporary lecturer token |

---

## 📷 Assets Directory

All static assets (images, videos) are inside:

```
public/
├── picture/
├── Video/
├── brain/
├── spine/
├── abdominal/
└── cardic/
```

---

## 🧪 Testing Accounts

> You can insert mock data or use MongoDB GUI to seed users for testing.