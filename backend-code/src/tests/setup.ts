import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clear database before all tests
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };

// Test helpers
export async function createTestUser(role: 'USER' | 'ADMIN' = 'USER') {
  const email = `${role.toLowerCase()}-${Date.now()}@test.com`;
  const password = await bcrypt.hash('Test123!', 10);
  
  return prisma.user.create({
    data: {
      email,
      password,
      name: `Test ${role}`,
      role,
    },
  });
}

export async function createTestSweet(overrides: Partial<{
  name: string;
  category: string;
  price: number;
  quantity: number;
}> = {}) {
  return prisma.sweet.create({
    data: {
      name: overrides.name || 'Test Sweet',
      category: overrides.category || 'Test Category',
      price: overrides.price || 100,
      quantity: overrides.quantity ?? 10,
    },
  });
}

export async function cleanDatabase() {
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();
}
