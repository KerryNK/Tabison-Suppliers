import request from 'supertest';
import app from '../app.js'; // Use the configured app
import Supplier from '../models/Supplier.js';

describe('Supplier API Endpoints', () => {
  describe('GET /api/suppliers', () => {
    beforeEach(async () => {
      // Seed the database with some test data
      await Supplier.create([
        { name: 'Test Supplier 1', email: 'test1@example.com', phone: '1234567890', address: '123 Test St', city: 'Testville', county: 'Testshire', category: 'Safety Footwear', description: 'A test supplier.', contactPerson: { name: 'John Doe' }, specialties: ['Boots'] },
        { name: 'Active Supplier', status: 'Active', email: 'active@example.com', phone: '111', address: '1 active st', city: 'City', county: 'County', category: 'Safety Footwear', description: 'desc', contactPerson: { name: 'act' }, specialties: ['a'] },
      ]);
    });

    it('should return only active suppliers for a public request', async () => {
      const res = await request(app).get('/api/suppliers');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('suppliers');
      expect(res.body.suppliers).toBeInstanceOf(Array);
      // The public endpoint should only return suppliers with status: 'Active'
      expect(res.body.suppliers.length).toBe(1);
      expect(res.body.suppliers[0].name).toBe('Active Supplier');
    });
  });
});