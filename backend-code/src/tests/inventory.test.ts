import request from 'supertest';
import app from '../app';
import { prisma, cleanDatabase, createTestSweet } from './setup';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

describe('Inventory Management', () => {
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    await cleanDatabase();

    // Create admin
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: adminPassword,
        name: 'Test Admin',
        role: 'ADMIN',
      },
    });
    adminToken = generateToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Create user
    const userPassword = await bcrypt.hash('User123!', 10);
    const user = await prisma.user.create({
      data: {
        email: 'user@test.com',
        password: userPassword,
        name: 'Test User',
        role: 'USER',
      },
    });
    userToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should successfully purchase sweet with available stock', async () => {
      const sweet = await createTestSweet({ quantity: 10 });

      const response = await request(app)
        .post(`/api/sweets/${sweet.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 3 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Purchase successful');
      expect(response.body.sweet.quantity).toBe(7); // 10 - 3
    });

    it('should purchase single item by default', async () => {
      const sweet = await createTestSweet({ quantity: 5 });

      const response = await request(app)
        .post(`/api/sweets/${sweet.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(4); // 5 - 1
    });

    it('should return 400 when purchasing more than available stock', async () => {
      const sweet = await createTestSweet({ quantity: 5 });

      const response = await request(app)
        .post(`/api/sweets/${sweet.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Insufficient stock');
    });

    it('should return 400 when stock is zero', async () => {
      const sweet = await createTestSweet({ quantity: 0 });

      const response = await request(app)
        .post(`/api/sweets/${sweet.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Insufficient stock');
    });

    it('should return 404 for non-existent sweet', async () => {
      const response = await request(app)
        .post('/api/sweets/non-existent-id/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Sweet not found');
    });

    it('should allow purchasing exact remaining stock', async () => {
      const sweet = await createTestSweet({ quantity: 3 });

      const response = await request(app)
        .post(`/api/sweets/${sweet.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 3 });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(0);
    });

    it('should prevent concurrent overselling', async () => {
      const sweet = await createTestSweet({ quantity: 1 });

      // Simulate two concurrent purchases
      const [response1, response2] = await Promise.all([
        request(app)
          .post(`/api/sweets/${sweet.id}/purchase`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ quantity: 1 }),
        request(app)
          .post(`/api/sweets/${sweet.id}/purchase`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ quantity: 1 }),
      ]);

      // One should succeed, one should fail
      const statuses = [response1.status, response2.status].sort();
      expect(statuses).toContain(200);
      expect(statuses).toContain(400);
    });
  });

  describe('POST /api/sweets/:id/restock (Admin only)', () => {
    it('should successfully restock sweet', async () => {
      const sweet = await createTestSweet({ quantity: 10 });

      const response = await request(app)
        .post(`/api/sweets/${sweet.id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 25 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Restock successful');
      expect(response.body.sweet.quantity).toBe(35); // 10 + 25
    });

    it('should restock from zero', async () => {
      const sweet = await createTestSweet({ quantity: 0 });

      const response = await request(app)
        .post(`/api/sweets/${sweet.id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(50);
    });

    it('should return 404 for non-existent sweet', async () => {
      const response = await request(app)
        .post('/api/sweets/non-existent-id/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid quantity', async () => {
      const sweet = await createTestSweet();

      const response = await request(app)
        .post(`/api/sweets/${sweet.id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 });

      expect(response.status).toBe(400);
    });

    it('should return 400 for zero quantity', async () => {
      const sweet = await createTestSweet();

      const response = await request(app)
        .post(`/api/sweets/${sweet.id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 0 });

      expect(response.status).toBe(400);
    });
  });
});
