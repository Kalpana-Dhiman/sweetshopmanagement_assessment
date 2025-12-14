import request from 'supertest';
import app from '../app';
import { prisma, cleanDatabase, createTestSweet } from './setup';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

describe('Sweets API', () => {
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    await cleanDatabase();

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

    // Create regular user
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

  describe('GET /api/sweets', () => {
    it('should return all sweets', async () => {
      await createTestSweet({ name: 'Sweet 1' });
      await createTestSweet({ name: 'Sweet 2' });

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should return empty array when no sweets exist', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await createTestSweet({ name: 'Gulab Jamun', category: 'Milk-based', price: 200 });
      await createTestSweet({ name: 'Jalebi', category: 'Fried', price: 150 });
      await createTestSweet({ name: 'Rasgulla', category: 'Milk-based', price: 180 });
    });

    it('should filter by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=Gulab')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Gulab Jamun');
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Milk-based')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=160&maxPrice=190')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Rasgulla');
    });
  });

  describe('POST /api/sweets (Admin only)', () => {
    it('should create a new sweet', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Kaju Katli',
          category: 'Dry Fruit',
          price: 450,
          quantity: 30,
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        name: 'Kaju Katli',
        category: 'Dry Fruit',
        price: 450,
        quantity: 30,
      });
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Incomplete Sweet',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/sweets/:id (Admin only)', () => {
    it('should update an existing sweet', async () => {
      const sweet = await createTestSweet({ name: 'Original Name' });

      const response = await request(app)
        .put(`/api/sweets/${sweet.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name', price: 300 });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
      expect(response.body.price).toBe(300);
    });

    it('should return 404 for non-existent sweet', async () => {
      const response = await request(app)
        .put('/api/sweets/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Sweet not found');
    });
  });

  describe('DELETE /api/sweets/:id (Admin only)', () => {
    it('should delete an existing sweet', async () => {
      const sweet = await createTestSweet();

      const response = await request(app)
        .delete(`/api/sweets/${sweet.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Sweet deleted successfully');

      // Verify deletion
      const deleted = await prisma.sweet.findUnique({ where: { id: sweet.id } });
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent sweet', async () => {
      const response = await request(app)
        .delete('/api/sweets/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});
