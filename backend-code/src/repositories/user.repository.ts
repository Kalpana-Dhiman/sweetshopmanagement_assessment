import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  async create(data: { email: string; password: string; name: string }): Promise<User> {
    return prisma.user.create({ data });
  },
};

export function getUserRepository(client: PrismaClient = prisma) {
  return {
    async findByEmail(email: string): Promise<User | null> {
      return client.user.findUnique({ where: { email } });
    },

    async findById(id: string): Promise<User | null> {
      return client.user.findUnique({ where: { id } });
    },

    async create(data: { email: string; password: string; name: string }): Promise<User> {
      return client.user.create({ data });
    },
  };
}
