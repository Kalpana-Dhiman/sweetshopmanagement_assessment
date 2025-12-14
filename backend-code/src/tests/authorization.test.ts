import request from 'supertest';
import app from '../app';
import { prisma, cleanDatabase, createTestSweet } from './setup';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

describe('Authorization Tests', () => {
  let userToken: string;
  let adminToken: string;
  let testSweet: any;

  beforeEach(async () => {
    await cleanDatabase();

    // Create regular user
    const userPassword = await bcrypt.hash('Test123!', 10);
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

    // Create admin user
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

    // Create test sweet
    testSweet = await createTestSweet();
  });

  describe('Unauthenticated Access (401)', () => {
    it('should return 401 when accessing sweets without token', async () => {
      const response = await request(app).get('/api/sweets');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid or expired token');
    });

    it('should return 401 when using invalid token', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });

  describe('Admin Only Access (403)', () => {
    it('should return 403 when user tries to create sweet', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'New Sweet',
          category: 'Test',
          price: 100,
          quantity: 10,
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Access denied. Admin only.');
    });

    it('should return 403 when user tries to update sweet', async () => {
      const response = await request(app)
        .put(`/api/sweets/${testSweet.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Access denied. Admin only.');
    });

    it('should return 403 when user tries to delete sweet', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweet.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Access denied. Admin only.');
    });

    it('should return 403 when user tries to restock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet.id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Access denied. Admin only.');
    });
  });

  describe('Admin Allowed Operations', () => {
    it('should allow admin to create sweet', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Admin Sweet',
          category: 'Premium',
          price: 500,
          quantity: 25,
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Admin Sweet');
    });

    it('should allow admin to update sweet', async () => {
      const response = await request(app)
        .put(`/api/sweets/${testSweet.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated by Admin' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated by Admin');
    });

    it('should allow admin to delete sweet', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweet.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Sweet deleted successfully');
    });

    it('should allow admin to restock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet.id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(60); // 10 + 50
    });
  });

  describe('User Allowed Operations', () => {
    it('should allow user to view all sweets', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should allow user to search sweets', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=Test')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
    });

    it('should allow user to purchase sweet', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Purchase successful');
    });
  });
});
