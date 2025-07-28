const mongoose = require("mongoose")

const contactPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
})

const businessHoursSchema = new mongoose.Schema({
  open: String,
  close: String,
  closed: Boolean,
})

const supplierSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    website: { type: String, trim: true },
    businessType: { type: String, required: true },
    registrationNumber: { type: String },
    taxNumber: { type: String },
    yearEstablished: { type: Number },
    address: { type: String, required: true },
    city: { type: String, required: true },
    county: { type: String, required: true },
    postalCode: { type: String },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    specialties: {
      type: [String],
      required: true,
      default: [],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    logo: { type: String },
    contactPerson: contactPersonSchema,
    businessHours: {
      monday: businessHoursSchema,
      tuesday: businessHoursSchema,
      wednesday: businessHoursSchema,
      thursday: businessHoursSchema,
      friday: businessHoursSchema,
      saturday: businessHoursSchema,
      sunday: businessHoursSchema,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Supplier", supplierSchema)
