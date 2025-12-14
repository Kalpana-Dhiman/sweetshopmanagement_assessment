import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  await prisma.user.create({
    data: {
      email: 'admin@sweetshop.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('User123!', 10);
  await prisma.user.create({
    data: {
      email: 'user@sweetshop.com',
      password: userPassword,
      name: 'Regular User',
      role: 'USER',
    },
  });

  // Create sample sweets
  const sweets = [
    { name: 'Gulab Jamun', category: 'Milk-based', price: 200, quantity: 50 },
    { name: 'Rasgulla', category: 'Milk-based', price: 180, quantity: 45 },
    { name: 'Jalebi', category: 'Fried', price: 150, quantity: 60 },
    { name: 'Ladoo', category: 'Traditional', price: 250, quantity: 40 },
    { name: 'Barfi', category: 'Milk-based', price: 300, quantity: 35 },
    { name: 'Peda', category: 'Milk-based', price: 220, quantity: 55 },
    { name: 'Mysore Pak', category: 'Ghee-based', price: 280, quantity: 30 },
    { name: 'Kaju Katli', category: 'Dry Fruit', price: 450, quantity: 25 },
  ];

  for (const sweet of sweets) {
    await prisma.sweet.create({ data: sweet });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
