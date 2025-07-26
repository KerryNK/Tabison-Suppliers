import request from 'supertest';
import app from '../app.js'; // Assuming your express app is exported from app.js
import mongoose from 'mongoose';
import Supplier from '../models/supplierModel.js'; // Adjust path as necessary

describe('Supplier API', () => {
  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tabison_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    // Clear the database after each test
    await Supplier.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect from the database
    await mongoose.connection.close();
  });

  it('should register a new supplier successfully', async () => {
    const supplierData = {
      name: 'Test Company',
      email: 'test@example.com',
      phone: '1234567890',
      website: 'www.test.com',
      businessType: 'Manufacturer',
      registrationNumber: 'REG123',
      taxNumber: 'TAX456',
      yearEstablished: 2000,
      address: '123 Test St',
      city: 'Test City',
      county: 'Test County',
      postalCode: '12345',
      category: 'Military Footwear',
      specialties: ['Boots', 'Uniforms'],
      description: 'A test company for military footwear.',
      contactPerson: {
        name: 'John Doe',
        position: 'CEO',
        email: 'john.doe@test.com',
        phone: '0987654321',
      },
      businessHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: