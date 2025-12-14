import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Download, FileCode, Database, Server, Layout, TestTube, Shield, GitBranch } from "lucide-react";
import { toast } from "sonner";

const CodeBlock = ({ code, language = "bash" }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-code-bg text-code-text p-4 rounded-lg overflow-x-auto text-sm font-mono border border-border/50">
        <code>{code}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};

const SectionCard = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">{children}</CardContent>
  </Card>
);

const Index = () => {
  const projectStructure = `sweet-shop/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── sweets.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── sweets.service.ts
│   │   ├── repositories/
│   │   │   ├── user.repository.ts
│   │   │   └── sweet.repository.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── sweets.routes.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── admin.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── validators/
│   │   │   ├── auth.validator.ts
│   │   │   └── sweet.validator.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── jwt.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── tests/
│   │   ├── auth.test.ts
│   │   ├── sweets.test.ts
│   │   └── setup.ts
│   ├── jest.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── SweetCard.tsx
│   │   │   ├── SweetForm.tsx
│   │   │   ├── SearchFilter.tsx
│   │   │   └── Navbar.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   └── sweets.service.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useSweets.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── tests/
│   │       ├── Login.test.tsx
│   │       └── Dashboard.test.tsx
│   ├── vite.config.ts
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md`;

  const prismaSchema = `// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  purchases Purchase[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Sweet {
  id        String     @id @default(uuid())
  name      String
  category  String
  price     Float
  quantity  Int
  purchases Purchase[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Purchase {
  id        String   @id @default(uuid())
  userId    String
  sweetId   String
  quantity  Int
  total     Float
  user      User     @relation(fields: [userId], references: [id])
  sweet     Sweet    @relation(fields: [sweetId], references: [id])
  createdAt DateTime @default(now())
}`;

  const authServiceCode = `// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto, LoginDto } from '../validators/auth.validator';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(data: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return this.generateTokens(user);
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  private generateTokens(user: { id: string; role: string }) {
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    return { accessToken, userId: user.id, role: user.role };
  }
}`;

  const authTestCode = `// tests/auth.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';

describe('Auth API', () => {
  beforeEach(async () => {
    await prisma.purchase.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.role).toBe('USER');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
    });

    it('should return 409 for duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User',
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Another User',
        });

      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User',
        });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword!',
        });

      expect(response.status).toBe(401);
    });
  });
});`;

  const sweetsTestCode = `// tests/sweets.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';

describe('Sweets API', () => {
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    // Create test users
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@test.com', password: 'Pass123!', name: 'User' });
    userToken = userRes.body.accessToken;

    // Create admin via seed or direct DB insert
    await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: await bcrypt.hash('Admin123!', 10),
        name: 'Admin',
        role: 'ADMIN',
      },
    });
    
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'Admin123!' });
    adminToken = adminRes.body.accessToken;
  });

  describe('POST /api/sweets (Admin only)', () => {
    it('should create a sweet when admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', \`Bearer \${adminToken}\`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.99,
          quantity: 100,
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Chocolate Bar');
    });

    it('should return 403 when user tries to create', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', \`Bearer \${userToken}\`)
        .send({
          name: 'Gummy Bears',
          category: 'Candy',
          price: 1.99,
          quantity: 50,
        });

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await prisma.sweet.create({
        data: {
          name: 'Test Sweet',
          category: 'Test',
          price: 1.00,
          quantity: 10,
        },
      });
      sweetId = sweet.id;
    });

    it('should purchase sweet successfully', async () => {
      const response = await request(app)
        .post(\`/api/sweets/\${sweetId}/purchase\`)
        .set('Authorization', \`Bearer \${userToken}\`)
        .send({ quantity: 2 });

      expect(response.status).toBe(200);
      expect(response.body.purchase.quantity).toBe(2);
    });

    it('should fail when insufficient stock', async () => {
      const response = await request(app)
        .post(\`/api/sweets/\${sweetId}/purchase\`)
        .set('Authorization', \`Bearer \${userToken}\`)
        .send({ quantity: 100 });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Insufficient stock');
    });
  });
});`;

  const dockerCompose = `# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: sweetshop_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: sweetshop
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    container_name: sweetshop_api
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/sweetshop
      JWT_SECRET: your-super-secret-jwt-key
      PORT: 3000
    ports:
      - "3000:3000"

  frontend:
    build: ./frontend
    container_name: sweetshop_web
    depends_on:
      - backend
    ports:
      - "5173:5173"

volumes:
  postgres_data:`;

  const envExample = `# Backend .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sweetshop"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3000

# Frontend .env
VITE_API_URL="http://localhost:3000/api"`;

  const backendPackageJson = `{
  "name": "sweetshop-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest --coverage --detectOpenHandles",
    "test:watch": "jest --watch",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.0",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/node": "^20.0.0",
    "@types/supertest": "^2.0.12",
    "jest": "^29.5.0",
    "prisma": "^5.0.0",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.0"
  }
}`;

  const handleDownload = () => {
    const content = `# 🍬 Sweet Shop Management System

A production-ready full-stack application built with TDD principles.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Git Workflow](#git-workflow)

## 🎯 Overview

A comprehensive sweet shop management system featuring:
- Secure JWT authentication with role-based access
- Full CRUD operations for sweets inventory
- Purchase and restock functionality
- Admin dashboard for inventory management
- High test coverage with TDD approach

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT tokens
- **Validation**: Zod
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18 + Vite
- **State**: React Query
- **Styling**: Tailwind CSS
- **Testing**: React Testing Library + Jest

## 📁 Project Structure

${projectStructure}

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Backend Setup

\`\`\`bash
# Clone and navigate
mkdir sweet-shop && cd sweet-shop

# Create backend
mkdir backend && cd backend
npm init -y

# Install dependencies
npm install express @prisma/client bcryptjs jsonwebtoken cors zod
npm install -D typescript @types/node @types/express prisma jest ts-jest supertest @types/jest @types/supertest @types/bcryptjs @types/jsonwebtoken ts-node-dev

# Initialize TypeScript
npx tsc --init

# Initialize Prisma
npx prisma init

# Configure .env
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sweetshop"' >> .env
echo 'JWT_SECRET="your-secret-key"' >> .env

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Start development server
npm run dev
\`\`\`

### Frontend Setup

\`\`\`bash
# From project root
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install dependencies
npm install @tanstack/react-query axios react-router-dom
npm install -D @testing-library/react @testing-library/jest-dom vitest jsdom

# Start development
npm run dev
\`\`\`

### Docker Setup (Recommended)

\`\`\`bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate dev
\`\`\`

## 📚 API Documentation

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |

### Sweets

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/sweets | List all sweets | User |
| GET | /api/sweets/search | Search sweets | User |
| POST | /api/sweets | Create sweet | Admin |
| PUT | /api/sweets/:id | Update sweet | Admin |
| DELETE | /api/sweets/:id | Delete sweet | Admin |

### Inventory

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/sweets/:id/purchase | Purchase sweet | User |
| POST | /api/sweets/:id/restock | Restock sweet | Admin |

## 🧪 Testing

Run tests with coverage:

\`\`\`bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
\`\`\`

## 📝 Git Workflow

Use meaningful commits with AI co-authorship:

\`\`\`bash
git commit -m "feat(auth): add registration endpoint

Used AI to scaffold controller and tests.

Co-authored-by: Bolt AI <ai@users.noreply.github.com>"
\`\`\`
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SWEET-SHOP-README.md';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("README downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-2xl">🍬</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Sweet Shop Management System</h1>
              <p className="text-muted-foreground">Production-Ready Full-Stack Project Scaffold</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            <Badge variant="secondary">Express.js</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Prisma</Badge>
            <Badge variant="secondary">PostgreSQL</Badge>
            <Badge variant="secondary">Jest</Badge>
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">TDD</Badge>
          </div>

          <Button onClick={handleDownload} className="mt-6 gap-2" size="lg">
            <Download className="h-4 w-4" />
            Download Complete README
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="structure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger value="structure" className="gap-2 data-[state=active]:bg-background">
              <FileCode className="h-4 w-4" />
              <span className="hidden sm:inline">Structure</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="gap-2 data-[state=active]:bg-background">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Database</span>
            </TabsTrigger>
            <TabsTrigger value="backend" className="gap-2 data-[state=active]:bg-background">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">Backend</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="gap-2 data-[state=active]:bg-background">
              <TestTube className="h-4 w-4" />
              <span className="hidden sm:inline">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="docker" className="gap-2 data-[state=active]:bg-background">
              <Layout className="h-4 w-4" />
              <span className="hidden sm:inline">Docker</span>
            </TabsTrigger>
            <TabsTrigger value="git" className="gap-2 data-[state=active]:bg-background">
              <GitBranch className="h-4 w-4" />
              <span className="hidden sm:inline">Git</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-6">
            <SectionCard icon={FileCode} title="Project Structure">
              <p className="text-sm text-muted-foreground mb-4">
                Clean architecture with Controller → Service → Repository layers
              </p>
              <CodeBlock code={projectStructure} language="text" />
            </SectionCard>

            <SectionCard icon={Shield} title="Environment Variables">
              <CodeBlock code={envExample} language="bash" />
            </SectionCard>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <SectionCard icon={Database} title="Prisma Schema">
              <p className="text-sm text-muted-foreground mb-4">
                PostgreSQL database schema with User, Sweet, and Purchase models
              </p>
              <CodeBlock code={prismaSchema} language="typescript" />
            </SectionCard>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Database Setup Commands</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CodeBlock code={`# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio`} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backend" className="space-y-6">
            <SectionCard icon={Server} title="Auth Service Implementation">
              <CodeBlock code={authServiceCode} language="typescript" />
            </SectionCard>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Package.json</CardTitle>
                <CardDescription>Backend dependencies and scripts</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={backendPackageJson} language="json" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            <SectionCard icon={TestTube} title="Auth Tests (TDD)">
              <p className="text-sm text-muted-foreground mb-4">
                Following Red → Green → Refactor methodology
              </p>
              <CodeBlock code={authTestCode} language="typescript" />
            </SectionCard>

            <SectionCard icon={TestTube} title="Sweets Tests">
              <CodeBlock code={sweetsTestCode} language="typescript" />
            </SectionCard>
          </TabsContent>

          <TabsContent value="docker" className="space-y-6">
            <SectionCard icon={Layout} title="Docker Compose">
              <p className="text-sm text-muted-foreground mb-4">
                Complete containerized setup with PostgreSQL
              </p>
              <CodeBlock code={dockerCompose} language="yaml" />
            </SectionCard>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Docker Commands</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock code={`# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Run migrations in container
docker-compose exec backend npx prisma migrate dev

# Stop services
docker-compose down`} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="git" className="space-y-6">
            <SectionCard icon={GitBranch} title="Commit Message Format">
              <p className="text-sm text-muted-foreground mb-4">
                Use conventional commits with AI co-authorship
              </p>
              <CodeBlock code={`# Feature commit
git commit -m "feat(auth): add JWT authentication

- Implement register endpoint with validation
- Add login with bcrypt password verification
- Include access token generation

Co-authored-by: Bolt AI <ai@users.noreply.github.com>"

# Test commit
git commit -m "test(auth): add registration test suite

- Test successful registration
- Test duplicate email handling
- Test validation errors

Co-authored-by: Bolt AI <ai@users.noreply.github.com>"

# Fix commit
git commit -m "fix(sweets): handle insufficient stock error

Co-authored-by: Bolt AI <ai@users.noreply.github.com>"`} />
            </SectionCard>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">TDD Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <span className="font-bold text-destructive">1. RED</span>
                    <span className="text-sm">Write a failing test first</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                    <span className="font-bold text-success">2. GREEN</span>
                    <span className="text-sm">Write minimal code to pass</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <span className="font-bold text-primary">3. REFACTOR</span>
                    <span className="text-sm">Improve code quality</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Sweet Shop Management System — Project Scaffold for Local Development</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
