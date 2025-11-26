# 📌 SIM — Authentication + Dashboard (MERN Stack)

A scalable full-stack web application built using:

* **Frontend:** React.js / Next.js *(coming up next)* + TailwindCSS
* **Backend:** Node.js + Express.js
* **Database:** MongoDB (Mongoose ORM)
* **Authentication:** JWT + bcrypt
* **Feature Entity:** Tasks (CRUD, Search)

This project demonstrates a robust SaaS-ready design with secure auth, protected dashboard, and a modular backend built for scaling.

---

## 🚀 Features

### 🔐 Authentication & Security

* User **register**
* User **login** (JWT)
* Protected APIs + Middleware
* **Password hashing** (bcrypt)
* **Token authorization** for protected routes

### 👤 User Profile

* Fetch logged-in user details
* Update profile info securely

### 📝 Dashboard Entity – Tasks

* Create, Read, Update, Delete tasks
* Search by title

### 📈 Production-Ready Code Structure

* Modular routes, controllers, middleware
* Centralized error handling
* API validation using express-validator
* Scalable folder organization for easy future expansion

---

## 🛠️ Tech Stack

| Layer       | Technology                                            |
| ----------- | ----------------------------------------------------- |
| Frontend    | React.js or Next.js *(Configured later)*, TailwindCSS |
| Backend     | Node.js + Express.js                                  |
| Database    | MongoDB + Mongoose                                    |
| Auth        | JWT, bcryptjs                                         |
| Validation  | express-validator                                     |
| Dev Tooling | Postman                                      |

---

## 🔧 Installation & Setup

### 📌 Prerequisites

Make sure you have installed:

* Node.js ≥ v18
* MongoDB (Local or Atlas instance)
* Git
* Postman (optional, for API testing)

---

### 🧩 Backend Setup

```bash
# Clone the repo

# Install dependencies
npm install

# Create environment file
cp .env.example .env   # or manually create
```

#### Create `.env` file

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

#### Start the backend

```bash
npm run dev
```

Backend runs on:
👉 `http://localhost:5000`

---

## 📍 API Documentation

### Base URL

```
{{baseUrl}} = http://localhost:5000
```

Import ready-to-use Postman Collection:

* **`scalable-app-backend.postman_collection.json`** *(included in project)*

---

### 🔐 Authentication APIs

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | Register new user   |
| POST   | /api/auth/login    | Login & receive JWT |

---

### 👤 User APIs *(Auth Required)*

Add header `"Authorization": "Bearer {{token}}"`

| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| GET    | /api/users/me | Get logged-in user's data |
| PUT    | /api/users/me | Update profile            |

---

### 📝 Tasks APIs *(Auth Required)*

| Method | Endpoint       | Description                      |
| ------ | -------------- | -------------------------------- |
| GET    | /api/tasks     | List tasks with search & filters |
| POST   | /api/tasks     | Create a task                    |
| GET    | /api/tasks/:id | Get a single task                |
| PUT    | /api/tasks/:id | Update task                      |
| DELETE | /api/tasks/:id | Delete task                      |

Query params:

```
search=keyword
status=todo | in-progress | done
```

Example:

```
GET /api/tasks?search=react&status=todo
```

---

## 🧱 Project Structure

```
backend/
 ├─ src/
 │  ├─ config/        # DB Config
 │  ├─ routes/        # API routes
 │  ├─ models/        # Mongoose models
 │  ├─ middleware/    # Auth + Error handling
 │  ├─ validators/    # Request validation
 │  ├─ utils/         # Helper utilities
 │  └─ index.js       # Server entry point
 ├─ package.json
 └─ .env
```

Modularized → easier scaling ➜ add roles, permissions, more entities!

---

## 🧩 Scaling for Production

| Area         | Approach                                                   |
| ------------ | ---------------------------------------------------------- |
| Deployment   | Docker + Kubernetes / Render / Railway / Vercel (frontend) |
| Security     | HTTPS, Secure cookies, role-based auth                     |
| Performance  | Caching (Redis), lazy loading, code splitting              |
| Architecture | Microservices-ready folder structure                       |
| CI/CD        | GitHub Actions for automated testing & deployment          |

---

## 🎯 What This Project Demonstrates

✔ Secure user authentication
✔ Protecting private data
✔ RESTful API design
✔ Validations & error handling
✔ Full-stack integration foundation
✔ Scalable and maintainable codebase

---

## 📌 Next Targets (Frontend Work)

* 🔐 Login/Register pages
* 🛡 Protected dashboard routes
* 📊 Task CRUD UI with filtering
* 💾 Axios service layer for backend API calls
* 🎨 Tailwind UI polished design

> You can ask me anytime — I will help you complete and deploy the frontend too! 🚀

---

## ⭐ Show Some Love

If this repo helped you learn or build your assignment, please ⭐ it on GitHub!
Your feedback motivates more improvements 😊
