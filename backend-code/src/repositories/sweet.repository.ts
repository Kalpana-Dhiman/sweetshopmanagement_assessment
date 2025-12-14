import { PrismaClient, Sweet } from '@prisma/client';
import { CreateSweetInput, UpdateSweetInput, SearchSweetInput } from '../validations/sweet.validation';

const prisma = new PrismaClient();

export const sweetRepository = {
  async findAll(): Promise<Sweet[]> {
    return prisma.sweet.findMany({ orderBy: { name: 'asc' } });
  },

  async findById(id: string): Promise<Sweet | null> {
    return prisma.sweet.findUnique({ where: { id } });
  },

  async search(filters: SearchSweetInput): Promise<Sweet[]> {
    const where: any = {};

    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    if (filters.category && filters.category !== 'All') {
      where.category = filters.category;
    }

    if (filters.minPrice !== undefined) {
      where.price = { ...where.price, gte: filters.minPrice };
    }

    if (filters.maxPrice !== undefined) {
      where.price = { ...where.price, lte: filters.maxPrice };
    }

    return prisma.sweet.findMany({ where, orderBy: { name: 'asc' } });
  },

  async create(data: CreateSweetInput): Promise<Sweet> {
    return prisma.sweet.create({ data });
  },

  async update(id: string, data: UpdateSweetInput): Promise<Sweet> {
    return prisma.sweet.update({ where: { id }, data });
  },

  async delete(id: string): Promise<void> {
    await prisma.sweet.delete({ where: { id } });
  },

  async updateQuantity(id: string, quantity: number): Promise<Sweet> {
    return prisma.sweet.update({
      where: { id },
      data: { quantity },
    });
  },
};

export function getSweetRepository(client: PrismaClient = prisma) {
  return {
    async findAll(): Promise<Sweet[]> {
      return client.sweet.findMany({ orderBy: { name: 'asc' } });
    },

    async findById(id: string): Promise<Sweet | null> {
      return client.sweet.findUnique({ where: { id } });
    },

    async search(filters: SearchSweetInput): Promise<Sweet[]> {
      const where: any = {};

      if (filters.name) {
        where.name = { contains: filters.name, mode: 'insensitive' };
      }

      if (filters.category && filters.category !== 'All') {
        where.category = filters.category;
      }

      if (filters.minPrice !== undefined) {
        where.price = { ...where.price, gte: filters.minPrice };
      }

      if (filters.maxPrice !== undefined) {
        where.price = { ...where.price, lte: filters.maxPrice };
      }

      return client.sweet.findMany({ where, orderBy: { name: 'asc' } });
    },

    async create(data: CreateSweetInput): Promise<Sweet> {
      return client.sweet.create({ data });
    },

    async update(id: string, data: UpdateSweetInput): Promise<Sweet> {
      return client.sweet.update({ where: { id }, data });
    },

    async delete(id: string): Promise<void> {
      await client.sweet.delete({ where: { id } });
    },

    async updateQuantity(id: string, quantity: number): Promise<Sweet> {
      return client.sweet.update({
        where: { id },
        data: { quantity },
      });
    },
  };
}
