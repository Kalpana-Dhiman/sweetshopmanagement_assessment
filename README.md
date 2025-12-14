🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System designed to manage sweets inventory, handle purchases, and support role-based administration.
The project follows clean architecture, secure authentication, and test-driven backend development practices.

🚀 Features
👤 Authentication & Authorization

User registration and login

Secure JWT-based authentication

Role-based access control (USER, ADMIN)

Protected API routes

🍭 Sweet Management

View all available sweets

Search sweets by:

Name

Category

Price range

Purchase sweets with real-time stock validation

🧑‍💼 Admin Capabilities

Add new sweets

Update existing sweet details

Delete sweets

Restock inventory

Admin-only access enforced at API level

🧪 Reliability & Quality

Backend built using Test-Driven Development (TDD)

Extensive automated test coverage

Centralized error handling

Input validation and edge-case handling

🛠 Tech Stack
Frontend

React + TypeScript

Vite

Tailwind CSS

shadcn/ui

Context API for state management

Backend

Node.js + TypeScript

Express.js

PostgreSQL

Prisma ORM

JWT Authentication

Zod for request validation

Jest + Supertest for testing

Infrastructure

Docker Compose (PostgreSQL)

📂 Project Structure
.
├── backend-code/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── validations/
│   │   └── tests/
│   ├── docker-compose.yml
│   ├── jest.config.js
│   ├── package.json
│   └── README.md
│
├── src/                # Frontend source
├── public/
├── package.json
└── README.md

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone <YOUR_REPOSITORY_URL>
cd <PROJECT_FOLDER>

2️⃣ Backend Setup
cd backend-code
npm install

Start PostgreSQL
docker-compose up -d

Run Database Migrations
npm run prisma:migrate

Seed Initial Data
npm run prisma:seed

Run Tests
npm test

Start Backend Server
npm run dev


Backend runs on:

http://localhost:3000

3️⃣ Frontend Setup
cd ..
npm install
npm run dev


Frontend runs on:

http://localhost:5173

🔗 API Overview
Authentication

POST /api/auth/register

POST /api/auth/login

Sweets

GET /api/sweets

GET /api/sweets/search

POST /api/sweets (Admin only)

PUT /api/sweets/:id (Admin only)

DELETE /api/sweets/:id (Admin only)

Inventory

POST /api/sweets/:id/purchase

POST /api/sweets/:id/restock (Admin only)

🧪 Testing

Backend testing implemented using Jest + Supertest

Covers:

Authentication success & failure cases

Role-based authorization

CRUD operations

Inventory stock validation

Out-of-stock scenarios

Run all tests using:

npm test

📌 Notes

The project emphasizes correctness, maintainability, and security

Backend logic is separated into controllers, services, and repositories

All critical business rules are enforced at the API level

✅ Status

✔ Frontend implemented
✔ Backend implemented
✔ Database connected
✔ Tests passing
✔ Ready for submission

🎯 Summary

This project demonstrates the ability to design and implement a real-world full-stack application with secure authentication, role-based access control, inventory management, and reliable backend testing.
