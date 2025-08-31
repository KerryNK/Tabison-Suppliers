import mongoose from 'mongoose';

const contactPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
});

const businessHoursSchema = new mongoose.Schema({
  open: String,
  close: String,
  closed: Boolean,
});

const supplierSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true, // Optional: A supplier might register before creating a user account
    },
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
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
      required: [true, 'Category is required'],
    },
    specialties: {
      type: [String],
      required: true,
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
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
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
