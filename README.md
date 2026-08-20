# 🚀 TaskFlow SaaS

### *Enterprise-Grade Task Management & Productivity Platform*

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License">
</p>

<p align="center">
  <strong>TaskFlow</strong> is a feature-rich, full-stack enterprise task management platform built for modern teams. It combines robust backend security, real-time weather tracking, automated email dispatching, and a high-performance glassmorphic UI.
</p>

---

## 📑 Table of Contents

* [🌟 Key Features](#-key-features)
* [🛠️ Tech Stack](#️-tech-stack)
* [🏗️ Architecture & Project Structure](#️-architecture--project-structure)
* [⚡ Getting Started & Installation](#-getting-started--installation)
* [⚙️ Environment Variables](#️-environment-variables)
* [📖 API Documentation (Swagger)](#-api-documentation-swagger)
* [🤝 Contributing](#-contributing)
* [📜 License](#-license)

---

## 🌟 Key Features

* **🔐 Secure Authentication & Authorization:** JWT-based stateless authentication with password hashing using `bcrypt` and dynamic JWT payload parsing for automated user identity display.

* **🌤️ Dynamic Weather Integration:** Automatically fetches real-time temperature and weather conditions based on a task's specified location using the OpenWeather API.

* **✉️ Automated & Configurable Email Alerts:** Powered by Nodemailer to send instant email notifications on task creation, updates, and deletions, complete with a database-backed user preference toggle in the account settings.

* **🔍 Live Search & Advanced Filtering:** Real-time search using case-insensitive MongoDB regex mapping, paired with filters for status, priority, and date range parameters.

* **📁 File Management:** Seamless file uploads and cloud storage integration using Cloudinary.

* **🛡️ Enterprise API Security:** Global brute-force and spam protection using NestJS Throttler rate limiting.

* **📱 Responsive Glassmorphic UI:** Modern layout built using Tailwind CSS featuring custom metric dashboards, mobile profile menus, and smooth toast notifications.

---

## 🛠️ Tech Stack

### **Backend Server (`/backend`)**

* **Framework:** [NestJS](https://nestjs.com/) — Node.js framework built with TypeScript
* **Database & ODM:** MongoDB, Mongoose
* **Authentication:** Passport.js (`@nestjs/passport`, `passport-jwt`)
* **Mailing Service:** `@nestjs-modules/mailer`, Nodemailer
* **Security & Validation:** `@nestjs/throttler`, `class-validator`, `class-transformer`
* **API Documentation:** `@nestjs/swagger`

### **Frontend Client (`/frontend`)**

* **Library:** React (Vite)
* **Language:** TypeScript
* **Styling & Design:** Tailwind CSS
* **Routing & State:** React Router DOM, React Context API
* **Network Client:** Axios
* **UI Feedback:** React Hot Toast

---

## 🏗️ Architecture & Project Structure

The project is structured as a clean monorepo containing decoupled client and server environments:

```text
taskflow-saas/
│
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication strategy, guards, and decorators
│   │   ├── tasks/         # Task CRUD logic, Weather integration, & Mail service
│   │   ├── users/         # User preferences and notification settings
│   │   ├── schemas/       # Mongoose schemas (User, Task)
│   │   ├── app.module.ts  # Root module (Throttler, Mongoose, Mailer config)
│   │   └── main.ts        # Bootstrap and Swagger initialization
│   │
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI (Navbar, TaskCard, Modals)
│   │   ├── context/       # AuthContext provider
│   │   ├── pages/         # Dashboard, CreateTask, EditTask, Login, Register
│   │   └── main.tsx
│   │
│   └── .env
│
└── README.md
```

---

## ⚡ Getting Started & Installation

### Prerequisites

Make sure you have the following installed on your local machine:

* Node.js `v18` or higher
* Git
* MongoDB Atlas account or MongoDB instance

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/taskflow-saas.git
cd taskflow-saas
```

### 2. Setup the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend/` directory and configure the required environment variables.

Start the backend development server:

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

### 3. Setup the Frontend

Open a new terminal window and navigate to the frontend directory:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key

EMAIL_USER=your-email@gmail.com

EMAIL_PASSWORD=your-gmail-app-password
```

> **Note:** Never commit your `.env` file or expose your database credentials, JWT secret, or email app password publicly.

---

## 📖 API Documentation (Swagger)

TaskFlow includes automated API documentation powered by Swagger.

Once the backend server is running locally, open the following URL in your browser:

**Swagger UI:**

```text
http://localhost:3000/api
```

From the Swagger interface, you can inspect, test, and interact with the available authentication and task management endpoints.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### Contribution Steps

1. Fork the project.
2. Create your feature branch:

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes:

```bash
git commit -m "Add some AmazingFeature"
```

4. Push the branch:

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request.

---

## 📜 License

Distributed under the **MIT License**.

See the `LICENSE` file for more information.
