import request from 'supertest';
import app from '../app.js'; // Use the configured app
import Supplier from '../models/Supplier.js';

describe('Supplier API Endpoints', () => {
  describe('GET /api/suppliers', () => {
    beforeEach(async () => {
      // Seed the database with test data
      await Supplier.create([
        { name: 'Pending Supplier', status: 'Pending', email: 'pending@example.com', phone: '123', address: '123 pending st', city: 'City', county: 'County', category: 'Safety Footwear', description: 'desc', contactPerson: { name: 'pend' }, specialties: ['a'] },
        { name: 'Active Supplier', status: 'Active', email: 'active@example.com', phone: '111', address: '1 active st', city: 'City', county: 'County', category: 'Safety Footwear', description: 'desc', contactPerson: { name: 'act' }, specialties: ['a'] },
      ]);
    });

    it('should return only active suppliers for a public (unauthenticated) request', async () => {
      const res = await request(app).get('/api/suppliers');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('suppliers');
      expect(res.body.suppliers).toBeInstanceOf(Array);
      expect(res.body.suppliers.length).toBe(1);
      expect(res.body.suppliers[0].name).toBe('Active Supplier');
    });
  });
});