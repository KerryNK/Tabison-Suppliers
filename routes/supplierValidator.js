const { body, param, query, validationResult } = require("express-validator")
const Supplier = require("../models/Supplier")

// Custom validator to check if supplier exists
const supplierExists = async (id) => {
  const supplier = await Supplier.findById(id)
  if (!supplier) {
    throw new Error("Supplier not found")
  }
  return true
}

// Custom validator to check if email is unique (for registration)
const emailIsUnique = async (email) => {
  const existingSupplier = await Supplier.findOne({ email })
  if (existingSupplier) {
    throw new Error("Email is already registered")
  }
  return true
}

// Custom validator to check if email is unique for updates (excluding current supplier)
const emailIsUniqueForUpdate = async (email, { req }) => {
  const existingSupplier = await Supplier.findOne({
    email,
    _id: { $ne: req.params.id },
  })
  if (existingSupplier) {
    throw new Error("Email is already registered")
  }
  return true
}

// Validation rules for supplier registration
const validateSupplierRegistration = [
  // Basic Information
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .custom(emailIsUnique),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(\+254|0)[17]\d{8}$/)
    .withMessage("Please provide a valid Kenyan phone number"),

  body("website").optional().trim().isURL().withMessage("Please provide a valid website URL"),

  // Business Details
  body("businessType")
    .trim()
    .notEmpty()
    .withMessage("Business type is required")
    .isIn([
      "Sole Proprietorship",
      "Partnership",
      "Limited Company",
      "Public Limited Company",
      "Cooperative Society",
      "Non-Governmental Organization",
    ])
    .withMessage("Please select a valid business type"),

  body("registrationNumber")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Registration number must not exceed 50 characters"),

  body("taxNumber").optional().trim().isLength({ max: 20 }).withMessage("Tax number must not exceed 20 characters"),

  body("yearEstablished")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Year established must be between 1900 and ${new Date().getFullYear()}`),

  // Location
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Business address is required")
    .isLength({ min: 10, max: 200 })
    .withMessage("Address must be between 10 and 200 characters"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  body("county")
    .trim()
    .notEmpty()
    .withMessage("County is required")
    .isIn([
      "Nairobi",
      "Mombasa",
      "Kisumu",
      "Nakuru",
      "Eldoret",
      "Thika",
      "Malindi",
      "Kitale",
      "Garissa",
      "Kakamega",
      "Machakos",
      "Meru",
      "Nyeri",
      "Kericho",
      "Embu",
      "Migori",
      "Homa Bay",
      "Naivasha",
      "Voi",
      "Wajir",
      "Marsabit",
      "Isiolo",
      "Maralal",
      "Kapenguria",
      "Bungoma",
      "Webuye",
      "Busia",
      "Siaya",
      "Kisii",
      "Kilifi",
      "Lamu",
      "Mandera",
      "Moyale",
      "Lodwar",
      "Kitui",
      "Makueni",
      "Kajiado",
      "Nanyuki",
      "Nyahururu",
      "Murang'a",
      "Kerugoya",
      "Kiambu",
      "Limuru",
      "Ruiru",
      "Githunguri",
      "Ol Kalou",
    ])
    .withMessage("Please select a valid Kenyan county"),

  body("postalCode")
    .optional()
    .trim()
    .matches(/^\d{5}$/)
    .withMessage("Postal code must be 5 digits"),

  // Categories and Specialties
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Primary category is required")
    .isIn([
      "Military Footwear",
      "Safety Footwear",
      "Official Footwear",
      "Security Footwear",
      "Industrial Footwear",
      "Professional Footwear",
    ])
    .withMessage("Please select a valid category"),

  body("specialties")
    .isArray({ min: 1 })
    .withMessage("At least one specialty is required")
    .custom((specialties) => {
      const validSpecialties = [
        "Combat Boots",
        "Dress Shoes",
        "Safety Boots",
        "Steel Toe Boots",
        "Waterproof Footwear",
        "Slip-Resistant Shoes",
        "Tactical Boots",
        "Ceremonial Footwear",
        "Work Boots",
        "Protective Footwear",
        "Custom Manufacturing",
        "Bulk Orders",
        "International Shipping",
        "Quality Certification",
      ]

      for (const specialty of specialties) {
        if (!validSpecialties.includes(specialty)) {
          throw new Error(`Invalid specialty: ${specialty}`)
        }
      }
      return true
    }),

  // Description
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Company description is required")
    .isLength({ min: 50, max: 1000 })
    .withMessage("Description must be between 50 and 1000 characters"),

  // Contact Person
  body("contactPerson.name")
    .trim()
    .notEmpty()
    .withMessage("Contact person name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Contact person name must be between 2 and 100 characters"),

  body("contactPerson.position")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Position must not exceed 100 characters"),

  body("contactPerson.email")
    .trim()
    .notEmpty()
    .withMessage("Contact person email is required")
    .isEmail()
    .withMessage("Please provide a valid contact email address")
    .normalizeEmail(),

  body("contactPerson.phone")
    .optional()
    .trim()
    .matches(/^(\+254|0)[17]\d{8}$/)
    .withMessage("Please provide a valid Kenyan phone number"),

  // Business Hours
  body("businessHours")
    .optional()
    .isObject()
    .withMessage("Business hours must be an object"),

  body("businessHours.*.open")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Opening time must be in HH:MM format"),

  body("businessHours.*.close")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Closing time must be in HH:MM format"),

  body("businessHours.*.closed").optional().isBoolean().withMessage("Closed status must be a boolean"),
]

// Validation rules for supplier updates
const validateSupplierUpdate = [
  // Basic Information (optional for updates)
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Company name cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .custom(emailIsUniqueForUpdate),

  body("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number cannot be empty")
    .matches(/^(\+254|0)[17]\d{8}$/)
    .withMessage("Please provide a valid Kenyan phone number"),

  body("website").optional().trim().isURL().withMessage("Please provide a valid website URL"),

  // Business Details
  body("businessType")
    .optional()
    .trim()
    .isIn([
      "Sole Proprietorship",
      "Partnership",
      "Limited Company",
      "Public Limited Company",
      "Cooperative Society",
      "Non-Governmental Organization",
    ])
    .withMessage("Please select a valid business type"),

  body("registrationNumber")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Registration number must not exceed 50 characters"),

  body("taxNumber").optional().trim().isLength({ max: 20 }).withMessage("Tax number must not exceed 20 characters"),

  body("yearEstablished")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Year established must be between 1900 and ${new Date().getFullYear()}`),

  // Location
  body("address")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Business address cannot be empty")
    .isLength({ min: 10, max: 200 })
    .withMessage("Address must be between 10 and 200 characters"),

  body("city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  body("county")
    .optional()
    .trim()
    .isIn([
      "Nairobi",
      "Mombasa",
      "Kisumu",
      "Nakuru",
      "Eldoret",
      "Thika",
      "Malindi",
      "Kitale",
      "Garissa",
      "Kakamega",
      "Machakos",
      "Meru",
      "Nyeri",
      "Kericho",
      "Embu",
      "Migori",
      "Homa Bay",
      "Naivasha",
      "Voi",
      "Wajir",
      "Marsabit",
      "Isiolo",
      "Maralal",
      "Kapenguria",
      "Bungoma",
      "Webuye",
      "Busia",
      "Siaya",
      "Kisii",
      "Kilifi",
      "Lamu",
      "Mandera",
      "Moyale",
      "Lodwar",
      "Kitui",
      "Makueni",
      "Kajiado",
      "Nanyuki",
      "Nyahururu",
      "Murang'a",
      "Kerugoya",
      "Kiambu",
      "Limuru",
      "Ruiru",
      "Githunguri",
      "Ol Kalou",
    ])
    .withMessage("Please select a valid Kenyan county"),

  body("postalCode")
    .optional()
    .trim()
    .matches(/^\d{5}$/)
    .withMessage("Postal code must be 5 digits"),

  // Categories and Specialties
  body("category")
    .optional()
    .trim()
    .isIn([
      "Military Footwear",
      "Safety Footwear",
      "Official Footwear",
      "Security Footwear",
      "Industrial Footwear",
      "Professional Footwear",
    ])
    .withMessage("Please select a valid category"),

  body("specialties")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one specialty is required")
    .custom((specialties) => {
      const validSpecialties = [
        "Combat Boots",
        "Dress Shoes",
        "Safety Boots",
        "Steel Toe Boots",
        "Waterproof Footwear",
        "Slip-Resistant Shoes",
        "Tactical Boots",
        "Ceremonial Footwear",
        "Work Boots",
        "Protective Footwear",
        "Custom Manufacturing",
        "Bulk Orders",
        "International Shipping",
        "Quality Certification",
      ]

      for (const specialty of specialties) {
        if (!validSpecialties.includes(specialty)) {
          throw new Error(`Invalid specialty: ${specialty}`)
        }
      }
      return true
    }),

  // Description
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Company description cannot be empty")
    .isLength({ min: 50, max: 1000 })
    .withMessage("Description must be between 50 and 1000 characters"),

  // Contact Person
  body("contactPerson.name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Contact person name cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Contact person name must be between 2 and 100 characters"),

  body("contactPerson.position")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Position must not exceed 100 characters"),

  body("contactPerson.email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Contact person email cannot be empty")
    .isEmail()
    .withMessage("Please provide a valid contact email address")
    .normalizeEmail(),

  body("contactPerson.phone")
    .optional()
    .trim()
    .matches(/^(\+254|0)[17]\d{8}$/)
    .withMessage("Please provide a valid Kenyan phone number"),
]

// Validation for supplier ID parameter
const validateSupplierId = [param("id").isMongoId().withMessage("Invalid supplier ID format").custom(supplierExists)]

// Validation for status update
const validateStatusUpdate = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Status must be one of: pending, approved, rejected"),
]

// Validation for query parameters
const validateQueryParams = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),

  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

  query("category")
    .optional()
    .trim()
    .isIn([
      "Military Footwear",
      "Safety Footwear",
      "Official Footwear",
      "Security Footwear",
      "Industrial Footwear",
      "Professional Footwear",
    ])
    .withMessage("Invalid category"),

  query("county")
    .optional()
    .trim()
    .isIn([
      "Nairobi",
      "Mombasa",
      "Kisumu",
      "Nakuru",
      "Eldoret",
      "Thika",
      "Malindi",
      "Kitale",
      "Garissa",
      "Kakamega",
      "Machakos",
      "Meru",
      "Nyeri",
      "Kericho",
      "Embu",
      "Migori",
      "Homa Bay",
      "Naivasha",
      "Voi",
      "Wajir",
      "Marsabit",
      "Isiolo",
      "Maralal",
      "Kapenguria",
      "Bungoma",
      "Webuye",
      "Busia",
      "Siaya",
      "Kisii",
      "Kilifi",
      "Lamu",
      "Mandera",
      "Moyale",
      "Lodwar",
      "Kitui",
      "Makueni",
      "Kajiado",
      "Nanyuki",
      "Nyahururu",
      "Murang'a",
      "Kerugoya",
      "Kiambu",
      "Limuru",
      "Ruiru",
      "Githunguri",
      "Ol Kalou",
    ])
    .withMessage("Invalid county"),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters"),

  query("status").optional().trim().isIn(["pending", "approved", "rejected"]).withMessage("Invalid status"),
]

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    })
  }

  next()
}

module.exports = {
  validateSupplierRegistration,
  validateSupplierUpdate,
  validateSupplierId,
  validateStatusUpdate,
  validateQueryParams,
  handleValidationErrors,
}
