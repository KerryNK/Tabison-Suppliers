const request = require("supertest")
const mongoose = require("mongoose")
const app = require("../app")
const Supplier = require("../models/Supplier")

// Test database connection
const MONGODB_URI = process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/tabison_test"

describe("Supplier Routes", () => {
  let supplierId
  let testSupplier

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(MONGODB_URI)
  })

  beforeEach(async () => {
    // Clear the suppliers collection before each test
    await Supplier.deleteMany({})

    // Create a test supplier
    testSupplier = {
      name: "Test Supplier Co.",
      email: "test@supplier.com",
      phone: "+254700000000",
      website: "https://testsupplier.com",
      businessType: "Limited Company",
      registrationNumber: "REG123456",
      taxNumber: "TAX789012",
      yearEstablished: 2020,
      address: "123 Test Street",
      city: "Nairobi",
      county: "Nairobi",
      postalCode: "00100",
      category: "Military Footwear",
      specialties: ["Combat Boots", "Tactical Boots"],
      description: "A test supplier specializing in military and tactical footwear with over 3 years of experience.",
      contactPerson: {
        name: "John Doe",
        position: "Sales Manager",
        email: "john@testsupplier.com",
        phone: "+254700000001",
      },
      businessHours: {
        monday: { open: "08:00", close: "17:00", closed: false },
        tuesday: { open: "08:00", close: "17:00", closed: false },
        wednesday: { open: "08:00", close: "17:00", closed: false },
        thursday: { open: "08:00", close: "17:00", closed: false },
        friday: { open: "08:00", close: "17:00", closed: false },
        saturday: { open: "08:00", close: "13:00", closed: false },
        sunday: { open: "08:00", close: "13:00", closed: true },
      },
    }
  })

  afterAll(async () => {
    // Clean up and close database connection
    await Supplier.deleteMany({})
    await mongoose.connection.close()
  })

  describe("POST /api/suppliers/register", () => {
    it("should create a new supplier with valid data", async () => {
      const response = await request(app).post("/api/suppliers/register").send(testSupplier).expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe(testSupplier.name)
      expect(response.body.data.email).toBe(testSupplier.email)
      expect(response.body.data.status).toBe("pending")

      supplierId = response.body.data._id
    })

    it("should return validation error for missing required fields", async () => {
      const invalidSupplier = { ...testSupplier }
      delete invalidSupplier.name
      delete invalidSupplier.email

      const response = await request(app).post("/api/suppliers/register").send(invalidSupplier).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })

    it("should return error for duplicate email", async () => {
      // Create first supplier
      await request(app).post("/api/suppliers/register").send(testSupplier).expect(201)

      // Try to create another supplier with same email
      const duplicateSupplier = { ...testSupplier, name: "Another Supplier" }

      const response = await request(app).post("/api/suppliers/register").send(duplicateSupplier).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("email")
    })

    it("should validate email format", async () => {
      const invalidEmailSupplier = { ...testSupplier, email: "invalid-email" }

      const response = await request(app).post("/api/suppliers/register").send(invalidEmailSupplier).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })

    it("should validate description length", async () => {
      const shortDescriptionSupplier = { ...testSupplier, description: "Too short" }

      const response = await request(app).post("/api/suppliers/register").send(shortDescriptionSupplier).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })
  })

  describe("GET /api/suppliers", () => {
    beforeEach(async () => {
      // Create multiple test suppliers
      const suppliers = [
        { ...testSupplier, name: "Supplier A", email: "a@test.com", status: "approved" },
        { ...testSupplier, name: "Supplier B", email: "b@test.com", category: "Safety Footwear", status: "approved" },
        { ...testSupplier, name: "Supplier C", email: "c@test.com", status: "pending" },
      ]

      for (const supplier of suppliers) {
        await Supplier.create(supplier)
      }
    })

    it("should get all approved suppliers", async () => {
      const response = await request(app).get("/api/suppliers").expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(2) // Only approved suppliers
      expect(response.body.data.every((s) => s.status === "approved")).toBe(true)
    })

    it("should filter suppliers by category", async () => {
      const response = await request(app).get("/api/suppliers?category=Safety Footwear").expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].category).toBe("Safety Footwear")
    })

    it("should search suppliers by name", async () => {
      const response = await request(app).get("/api/suppliers?search=Supplier A").expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].name).toBe("Supplier A")
    })

    it("should filter suppliers by county", async () => {
      const response = await request(app).get("/api/suppliers?county=Nairobi").expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.length).toBeGreaterThan(0)
      expect(response.body.data.every((s) => s.county === "Nairobi")).toBe(true)
    })

    it("should support pagination", async () => {
      const response = await request(app).get("/api/suppliers?page=1&limit=1").expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.pagination).toBeDefined()
      expect(response.body.pagination.currentPage).toBe(1)
      expect(response.body.pagination.limit).toBe(1)
    })
  })

  describe("GET /api/suppliers/:id", () => {
    beforeEach(async () => {
      const supplier = await Supplier.create({ ...testSupplier, status: "approved" })
      supplierId = supplier._id
    })

    it("should get supplier by ID", async () => {
      const response = await request(app).get(`/api/suppliers/${supplierId}`).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(supplierId.toString())
      expect(response.body.data.name).toBe(testSupplier.name)
    })

    it("should return 404 for non-existent supplier", async () => {
      const nonExistentId = new mongoose.Types.ObjectId()

      const response = await request(app).get(`/api/suppliers/${nonExistentId}`).expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("not found")
    })

    it("should return 400 for invalid supplier ID", async () => {
      const response = await request(app).get("/api/suppliers/invalid-id").expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })
  })

  describe("PUT /api/suppliers/:id", () => {
    beforeEach(async () => {
      const supplier = await Supplier.create(testSupplier)
      supplierId = supplier._id
    })

    it("should update supplier with valid data", async () => {
      const updateData = {
        name: "Updated Supplier Name",
        phone: "+254700000999",
        description: "Updated description with more than fifty characters to meet validation requirements.",
      }

      const response = await request(app).put(`/api/suppliers/${supplierId}`).send(updateData).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe(updateData.name)
      expect(response.body.data.phone).toBe(updateData.phone)
      expect(response.body.data.description).toBe(updateData.description)
    })

    it("should return validation error for invalid update data", async () => {
      const invalidUpdateData = {
        email: "invalid-email-format",
        description: "Too short",
      }

      const response = await request(app).put(`/api/suppliers/${supplierId}`).send(invalidUpdateData).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })

    it("should return 404 for non-existent supplier", async () => {
      const nonExistentId = new mongoose.Types.ObjectId()

      const response = await request(app)
        .put(`/api/suppliers/${nonExistentId}`)
        .send({ name: "Updated Name" })
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("not found")
    })
  })

  describe("DELETE /api/suppliers/:id", () => {
    beforeEach(async () => {
      const supplier = await Supplier.create(testSupplier)
      supplierId = supplier._id
    })

    it("should delete supplier by ID", async () => {
      const response = await request(app).delete(`/api/suppliers/${supplierId}`).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain("deleted")

      // Verify supplier is deleted
      const deletedSupplier = await Supplier.findById(supplierId)
      expect(deletedSupplier).toBeNull()
    })

    it("should return 404 for non-existent supplier", async () => {
      const nonExistentId = new mongoose.Types.ObjectId()

      const response = await request(app).delete(`/api/suppliers/${nonExistentId}`).expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("not found")
    })

    it("should return 400 for invalid supplier ID", async () => {
      const response = await request(app).delete("/api/suppliers/invalid-id").expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })
  })

  describe("PATCH /api/suppliers/:id/status", () => {
    beforeEach(async () => {
      const supplier = await Supplier.create(testSupplier)
      supplierId = supplier._id
    })

    it("should update supplier status to approved", async () => {
      const response = await request(app)
        .patch(`/api/suppliers/${supplierId}/status`)
        .send({ status: "approved" })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.status).toBe("approved")
    })

    it("should update supplier status to rejected", async () => {
      const response = await request(app)
        .patch(`/api/suppliers/${supplierId}/status`)
        .send({ status: "rejected" })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.status).toBe("rejected")
    })

    it("should return validation error for invalid status", async () => {
      const response = await request(app)
        .patch(`/api/suppliers/${supplierId}/status`)
        .send({ status: "invalid-status" })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })

    it("should return 404 for non-existent supplier", async () => {
      const nonExistentId = new mongoose.Types.ObjectId()

      const response = await request(app)
        .patch(`/api/suppliers/${nonExistentId}/status`)
        .send({ status: "approved" })
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("not found")
    })
  })
})
