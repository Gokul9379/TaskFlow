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
  <strong>TaskFlow</strong> is a feature-rich, full-stack enterprise task management platform built for modern teams. It combines robust backend security, real-time weather tracking, automated email dispatching through Resend, cloud file management, and a high-performance glassmorphic UI.
</p>

---

## 📑 Table of Contents

* [🌟 Key Features](#-key-features)
* [🛠️ Tech Stack](#️-tech-stack)
* [🏗️ Architecture & Project Structure](#️-architecture--project-structure)
* [⚡ Getting Started & Installation](#-getting-started--installation)
* [⚙️ Environment Variables](#️-environment-variables)
* [📧 Email Service](#-email-service)
* [📖 API Documentation](#-api-documentation-swagger)
* [🔒 Security](#-security)
* [🤝 Contributing](#-contributing)
* [📜 License](#-license)

---

## 🌟 Key Features

### 🔐 Secure Authentication & Authorization

* JWT-based stateless authentication.
* Password hashing using `bcrypt`.
* Passport.js and JWT authentication strategies.
* Protected API routes using authentication guards.
* Dynamic JWT payload parsing for automated user identity display.

### 🌤️ Dynamic Weather Integration

TaskFlow integrates with the **OpenWeather API** to provide real-time weather information based on the location specified for a task.

Weather information can include:

* 🌡️ Current temperature
* ☁️ Weather conditions
* 📍 Task location-based weather information

This allows users to understand environmental conditions associated with their scheduled tasks.

### ✉️ Automated & Configurable Email Alerts

TaskFlow uses the **Resend API** to send instant, reliable email notifications over HTTPS.

Email notifications can be triggered for:

* ✅ Task creation
* ✏️ Task updates
* 🗑️ Task deletion

The application also provides a database-backed user preference toggle, allowing users to control whether they want to receive task-related email notifications.

### 🔍 Live Search & Advanced Filtering

TaskFlow provides powerful task discovery capabilities through:

* Real-time task search.
* Case-insensitive MongoDB regex matching.
* Status filtering.
* Priority filtering.
* Date-range filtering.
* Combined search and filter parameters.

### 📁 File Management

TaskFlow supports file uploads and cloud-based file storage through **Cloudinary**.

Users can attach files to tasks while keeping uploaded resources accessible through cloud storage.

### 🛡️ Enterprise API Security

The backend includes multiple security and validation mechanisms:

* JWT authentication.
* Password hashing.
* API rate limiting using NestJS Throttler.
* Request validation using `class-validator`.
* Request transformation using `class-transformer`.
* Protected routes and authentication guards.

### 📱 Responsive Glassmorphic UI

The frontend provides a modern glassmorphic user interface built with Tailwind CSS.

Features include:

* Responsive dashboard.
* Task cards.
* Metric dashboards.
* Mobile-friendly profile menus.
* Modal dialogs.
* Toast notifications.
* Responsive task management screens.

---

## 🛠️ Tech Stack

### Backend Server (`/backend`)

| Technology            | Purpose                      |
| --------------------- | ---------------------------- |
| **NestJS**            | Backend framework            |
| **Node.js**           | JavaScript runtime           |
| **TypeScript**        | Backend programming language |
| **MongoDB**           | Database                     |
| **Mongoose**          | MongoDB ODM                  |
| **Passport.js**       | Authentication               |
| **JWT**               | Stateless authentication     |
| **bcrypt**            | Password hashing             |
| **Resend**            | Transactional email delivery |
| **OpenWeather API**   | Weather integration          |
| **Cloudinary**        | Cloud file storage           |
| **NestJS Throttler**  | Rate limiting                |
| **class-validator**   | Request validation           |
| **class-transformer** | Data transformation          |
| **Swagger**           | API documentation            |

### Frontend Client (`/frontend`)

| Technology            | Purpose                       |
| --------------------- | ----------------------------- |
| **React**             | Frontend library              |
| **Vite**              | Frontend build tool           |
| **TypeScript**        | Frontend programming language |
| **Tailwind CSS**      | Styling                       |
| **React Router DOM**  | Client-side routing           |
| **React Context API** | Global state management       |
| **Axios**             | HTTP requests                 |
| **React Hot Toast**   | Notifications                 |

### External Services

| Service           | Purpose             |
| ----------------- | ------------------- |
| **MongoDB Atlas** | Cloud database      |
| **Resend**        | Transactional email |
| **OpenWeather**   | Weather data        |
| **Cloudinary**    | File storage        |

---

## 🏗️ Architecture & Project Structure

TaskFlow follows a decoupled full-stack architecture where the React frontend communicates with the NestJS REST API.

```text
taskflow-saas/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── tasks/
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   └── tasks.module.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   │
│   │   ├── schemas/
│   │   │   ├── user.schema.ts
│   │   │   └── task.schema.ts
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── Modals/
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CreateTask.tsx
│   │   │   ├── EditTask.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔄 Application Architecture

```text
                    ┌──────────────────────┐
                    │      React App       │
                    │   Vite + TypeScript  │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               │ Axios
                               ▼
                    ┌──────────────────────┐
                    │     NestJS API       │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼─────────────────┐
              │                │                 │
              ▼                ▼                 ▼
        ┌───────────┐    ┌───────────┐    ┌─────────────┐
        │  MongoDB  │    │  Resend   │    │ OpenWeather │
        │  Database │    │   Email   │    │     API     │
        └───────────┘    └───────────┘    └─────────────┘
                              
                               ┌─────────────┐
                               │  Cloudinary │
                               │ File Storage│
                               └─────────────┘
```

---

# ⚡ Getting Started & Installation

## Prerequisites

Make sure you have the following installed on your local machine:

* **Node.js** v18 or higher
* **npm**
* **Git**
* **MongoDB Atlas account** or a MongoDB instance
* **Resend account**
* **Cloudinary account** if file uploads are enabled
* **OpenWeather API key** for weather integration

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/taskflow-saas.git
```

Navigate into the project:

```bash
cd taskflow-saas
```

---

## 2. Setup the Backend

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```bash
touch .env
```

Configure the required environment variables as described in the [Environment Variables](#️-environment-variables) section.

Start the backend development server:

```bash
npm run start:dev
```

The backend API will run at:

```text
http://localhost:3000
```

---

## 3. Setup the Frontend

Open a new terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

# ⚙️ Environment Variables

## Backend (`backend/.env`)

```env
PORT=3000

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key

RESEND_API_KEY=re_your_resend_api_key_here

OPENWEATHER_API_KEY=your_openweather_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Environment Variable Description

| Variable                | Description                            |
| ----------------------- | -------------------------------------- |
| `PORT`                  | Port used by the NestJS backend        |
| `MONGO_URI`             | MongoDB connection string              |
| `JWT_SECRET`            | Secret key used to sign JWT tokens     |
| `RESEND_API_KEY`        | API key used for Resend email delivery |
| `OPENWEATHER_API_KEY`   | API key for weather information        |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                  |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                     |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                  |

> **⚠️ Security:** Never commit `.env` files or expose API keys, database credentials, JWT secrets, or Cloudinary credentials in your public repository.

---

## Frontend (`frontend/.env`)

If your frontend requires an environment variable for the backend API URL, create:

```env
VITE_API_URL=http://localhost:3000
```

The frontend can then use:

```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

---

# 📧 Email Service

TaskFlow uses **Resend** for transactional email delivery.

Instead of relying on traditional SMTP-based email delivery, the application communicates with Resend through its HTTPS API.

### Email Notifications

TaskFlow can send email notifications when:

* ✅ A task is created
* ✏️ A task is updated
* 🗑️ A task is deleted

Users can control email notifications through their account settings.

### Resend Configuration

Add your Resend API key to the backend `.env` file:

```env
RESEND_API_KEY=re_your_resend_api_key_here
```

The application should never expose this key to the React frontend.

---

# 🌤️ Weather Integration

TaskFlow integrates with the OpenWeather API to retrieve weather information based on the location associated with a task.

Example information:

```text
Location: Coimbatore
Temperature: 28°C
Condition: Cloudy
```

The weather information can be displayed alongside task details to provide additional context for location-based tasks.

---

# 📁 File Management

TaskFlow uses **Cloudinary** for cloud-based file management.

The integration supports:

* File uploads
* Cloud storage
* Secure file URLs
* Task-related attachments

Cloudinary credentials should be stored exclusively in the backend environment variables.

---

# 🔐 Authentication Flow

TaskFlow uses JWT-based authentication.

The authentication flow works as follows:

```text
User
 │
 │ Login / Register
 ▼
React Frontend
 │
 │ POST /auth/login
 ▼
NestJS Backend
 │
 │ Validate credentials
 ▼
MongoDB
 │
 │ User verified
 ▼
JWT Token
 │
 ▼
React Frontend
 │
 │ Authorization: Bearer <token>
 ▼
Protected API Routes
```

### Authentication Features

* User registration
* User login
* Password hashing
* JWT token generation
* JWT validation
* Protected routes
* User identity extraction

---

# 🔍 Search & Filtering

TaskFlow provides dynamic task search and filtering.

Users can search tasks using keywords and combine multiple filters.

### Supported Filters

* Search text
* Task status
* Task priority
* Start date
* End date

Example:

```text
Search: Project

Status: In Progress

Priority: High

Date Range: 2026-08-01 → 2026-08-31
```

The backend processes search requests using MongoDB queries and case-insensitive regular expressions.

---

# 🛡️ API Security

TaskFlow implements several layers of backend security.

### JWT Authentication

Protected routes require a valid JWT token.

### Password Hashing

Passwords are securely hashed using `bcrypt` before being stored.

### Rate Limiting

NestJS Throttler is used to protect API endpoints against:

* Brute-force attacks
* Excessive requests
* API abuse
* Spam requests

### Request Validation

DTOs are validated using:

```text
class-validator
class-transformer
```

This helps ensure that incoming API requests contain valid data.

---

# 📖 API Documentation (Swagger)

TaskFlow provides automatically generated API documentation using Swagger.

Start the backend:

```bash
npm run start:dev
```

Then open:

```text
http://localhost:3000/api
```

The Swagger UI allows developers to:

* View available endpoints
* Inspect request parameters
* Inspect response schemas
* Authenticate using JWT
* Test API endpoints directly
* Understand the backend API structure

---

# 🧪 Development

### Start Backend

```bash
cd backend
npm install
npm run start:dev
```

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### Build Backend

```bash
cd backend
npm run build
```

### Build Frontend

```bash
cd frontend
npm run build
```

---

# 📦 Production Considerations

Before deploying TaskFlow to production, make sure to:

* Configure production MongoDB credentials.
* Generate a strong random JWT secret.
* Configure a verified Resend sending domain.
* Configure production Cloudinary credentials.
* Configure the production OpenWeather API key.
* Set appropriate CORS policies.
* Configure HTTPS.
* Use production environment variables.
* Never expose secret keys in frontend code.
* Never commit `.env` files to Git.
* Configure appropriate API rate limits.

---

# 🗂️ Git & Environment File Protection

Add environment files to `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.development
.env.production

# Dependencies
node_modules/

# Build output
dist/
build/

# Logs
*.log
npm-debug.log*
```

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## Contribution Steps

### 1. Fork the Project

Create your own fork of the repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/taskflow-saas.git
cd taskflow-saas
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/AmazingFeature
```

### 4. Make Your Changes

Implement your feature or fix.

### 5. Commit Your Changes

```bash
git add .
git commit -m "Add some AmazingFeature"
```

### 6. Push Your Branch

```bash
git push origin feature/AmazingFeature
```

### 7. Open a Pull Request

Create a Pull Request from your feature branch to the main branch.

---

# 🐛 Issues & Feature Requests

If you find a bug or have an idea for a new feature, please create an issue in the GitHub repository.

When reporting an issue, include:

* Description of the problem
* Steps to reproduce
* Expected behavior
* Actual behavior
* Relevant screenshots or logs
* Environment details

---

# 📄 License

Distributed under the **MIT License**.

See the `LICENSE` file for more information.

---

# 👨‍💻 Author

**Gokul P**

Full Stack Developer | Python | TypeScript | React | NestJS | MongoDB

---

<p align="center">
  ⭐ If you find TaskFlow useful, consider giving the repository a star!
</p>

<p align="center">
  Built with ❤️ using NestJS, React, TypeScript, MongoDB, Tailwind CSS & Resend.
</p>
