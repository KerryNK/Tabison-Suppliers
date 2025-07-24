import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  alternatePhone: { type: String, trim: true },
  
  // Business Information
  businessName: { type: String, trim: true },
  kraPin: { type: String, trim: true },
  businessLicense: { type: String, trim: true },
  
  // Location
  address: { type: String, required: true },
  city: { type: String, required: true, trim: true },
  county: { type: String, required: true, trim: true },
  postalCode: { type: String, trim: true },
  
  // Categories and Specialties
  category: { 
    type: String, 
    required: true,
    enum: ['Military Footwear', 'Safety Footwear', 'Official Footwear', 'Security Footwear', 'Industrial Footwear', 'Professional Footwear']
  },
  specialties: [{ type: String, trim: true }],
  
  // Business Details
  description: { type: String, required: true, maxlength: 1000 },
  yearsInBusiness: { type: Number, min: 0 },
  employeeCount: { type: String, enum: ['1-10', '11-50', '51-200', '200+'] },
  
  // Verification and Status
  status: { 
    type: String, 
    enum: ['Pending', 'Active', 'Inactive', 'Suspended'], 
    default: 'Pending' 
  },
  verified: { type: Boolean, default: false },
  verificationDate: { type: Date },
  verificationDocuments: [{
    type: { type: String, enum: ['Business License', 'KRA Pin', 'Certificate', 'Other'] },
    url: { type: String },
    uploadDate: { type: Date, default: Date.now }
  }],
  
  // Ratings and Reviews
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  
  // Media
  logo: { type: String },
  images: [{ type: String }],
  
  // Contact Person
  contactPerson: {
    name: { type: String, required: true, trim: true },
    position: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true }
  },
  
  // Business Hours
  businessHours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: true } }
  },
  
  // Admin fields
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  
  // SEO and Search
  searchKeywords: [{ type: String, lowercase: true }],
  
  // Statistics
  profileViews: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better search performance
supplierSchema.index({ name: 'text', description: 'text', specialties: 'text' });
supplierSchema.index({ category: 1, city: 1, status: 1 });
supplierSchema.index({ verified: 1, status: 1 });
supplierSchema.index({ rating: -1 });

// Virtual for full address
supplierSchema.virtual('fullAddress').get(function() {
  return `${this.address}, ${this.city}, ${this.county}`;
});

// Virtual for average rating
supplierSchema.virtual('averageRating').get(function() {
  return this.reviewCount > 0 ? (this.totalRatings / this.reviewCount).toFixed(1) : 0;
});

// Pre-save middleware to update search keywords
supplierSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isModified('description') || this.isModified('specialties')) {
    this.searchKeywords = [
      ...this.name.toLowerCase().split(' '),
      ...this.description.toLowerCase().split(' '),
      ...this.specialties.map(s => s.toLowerCase()),
      this.category.toLowerCase(),
      this.city.toLowerCase()
    ].filter(keyword => keyword.length > 2);
  }
  next();
});

// Static method for search
supplierSchema.statics.search = function(query, filters = {}) {
  const searchQuery = { status: 'Active' };
  
  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  // Category filter
  if (filters.category && filters.category !== 'All Categories') {
    searchQuery.category = filters.category;
  }
  
  // Location filter
  if (filters.location && filters.location !== 'All Locations') {
    searchQuery.city = new RegExp(filters.location, 'i');
  }
  
  // Verified filter
  if (filters.verified !== undefined) {
    searchQuery.verified = filters.verified;
  }
  
  // Rating filter
  if (filters.minRating) {
    searchQuery.rating = { $gte: filters.minRating };
  }
  
  return this.find(searchQuery).sort({ rating: -1, createdAt: -1 });
};

export default mongoose.model('Supplier', supplierSchema);