🧁 Sweet Shop Management System – Backend API

A production-ready REST API for managing a sweet shop inventory with secure authentication, role-based authorization, and comprehensive automated test coverage.

📋 Table of Contents

Overview

Tech Stack

Project Structure

Setup Instructions

API Documentation

Testing

Error Handling

License

🎯 Overview

This backend API provides complete functionality for a sweet shop management system, including:

Authentication: Secure login and registration using JWT

Authorization: Role-based access control (USER, ADMIN)

Inventory Management: CRUD operations for sweets with stock tracking

Purchase System: Stock validation and quantity management

Search & Filter: Find sweets by name, category, and price range

The application is designed with clean architecture principles and emphasizes correctness, maintainability, and security.

🛠 Tech Stack
Layer	Technology
Runtime	Node.js 18+
Language	TypeScript
Framework	Express.js
Database	PostgreSQL
ORM	Prisma
Authentication	JWT
Validation	Zod
Testing	Jest + Supertest
Containerization	Docker
📁 Project Structure
backend/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts
│   │   └── sweet.controller.ts
│   ├── services/              # Business logic
│   │   ├── auth.service.ts
│   │   └── sweet.service.ts
│   ├── repositories/          # Data access layer
│   │   ├── user.repository.ts
│   │   └── sweet.repository.ts
│   ├── middleware/            # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── notFound.middleware.ts
│   ├── routes/                # API routes
│   │   ├── auth.routes.ts
│   │   └── sweet.routes.ts
│   ├── validations/           # Zod schemas
│   └── tests/                 # Automated tests
│       ├── auth.test.ts
│       ├── authorization.test.ts
│       ├── sweets.test.ts
│       └── inventory.test.ts
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md

🚀 Setup Instructions
Prerequisites

Node.js 18+

Docker & Docker Compose

npm

1️⃣ Install Dependencies
cd backend
npm install

2️⃣ Database Setup
docker-compose up -d db
cp .env.example .env


Update DATABASE_URL in .env if required.

3️⃣ Prisma Setup
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

4️⃣ Run the Server
npm run dev


Server runs at:

http://localhost:3000

📡 API Documentation
Base URL
http://localhost:3000/api

Authentication
Register

POST /api/auth/register

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

Login

POST /api/auth/login

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Sweets

All endpoints require authentication.

Get All Sweets

GET /api/sweets

Search Sweets

GET /api/sweets/search

Query params:

name

category

minPrice

maxPrice

Create Sweet (Admin Only)

POST /api/sweets

{
  "name": "Kaju Katli",
  "category": "Dry Fruit",
  "price": 450,
  "quantity": 30
}

Update Sweet (Admin Only)

PUT /api/sweets/:id

Delete Sweet (Admin Only)

DELETE /api/sweets/:id

Inventory
Purchase Sweet

POST /api/sweets/:id/purchase

{
  "quantity": 2
}

Restock Sweet (Admin Only)

POST /api/sweets/:id/restock

{
  "quantity": 25
}

🧪 Testing

The backend is fully covered with automated tests using Jest + Supertest.

Coverage Includes

Authentication (register/login)

Authorization (401, 403 cases)

Sweet CRUD operations

Inventory purchase & restock logic

Out-of-stock and validation errors

Run Tests
npm test


Example summary:

Test Suites: 4 passed
Tests:       30 passed
Coverage:    90%+

⚠️ Error Handling

Standard HTTP status codes are used consistently:

Status	Description
400	Validation error
401	Unauthenticated
403	Forbidden
404	Resource not found
409	Conflict
500	Internal server error
📄 License

MIT License

👤 Author

Kalpana
