const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    // Enhanced auth fields
    authProvider: {
      type: String,
      enum: ["email", "google", "apple", "otp"],
      default: "email",
    },
    googleId: {
      type: String,
      sparse: true,
    },
    appleId: {
      type: String,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "supplier", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    // OTP fields
    otp: {
      code: String,
      expiresAt: Date,
      verified: { type: Boolean, default: false },
    },
    // User preferences
    preferences: {
      notifications: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false },
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      language: { type: String, default: "en" },
      currency: { type: String, default: "KES" },
    },
    // Enhanced profile
    profile: {
      company: String,
      position: String,
      businessType: String,
      phone: String,
      website: String,
      address: {
        street: String,
        city: String,
        county: String,
        postalCode: String,
        country: { type: String, default: "Kenya" },
      },
      billing: {
        address: String,
        city: String,
        county: String,
        postalCode: String,
        country: { type: String, default: "Kenya" },
      },
    },
    // Activity tracking
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    // Reset password functionality
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
)

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ appleId: 1 }, { sparse: true });
userSchema.index({ phoneNumber: 1 }, { sparse: true });

// Encrypt password before saving (only if password is provided)
userSchema.pre("save", async function (next) {
  // Only hash password if it's modified and exists
  if (!this.isModified("password") || !this.password) {
    return next()
  }
  
  // Don't hash if using external auth
  if (this.authProvider !== "email") {
    return next()
  }
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Update login tracking
userSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("lastLogin")) {
    this.loginCount += 1
  }
  next()
})

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false
  return await bcrypt.compare(enteredPassword, this.password)
}

<<<<<<< Current (Your changes)
=======
// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    verified: false,
  }
  return otp
}

// Verify OTP
userSchema.methods.verifyOTP = function (enteredOTP) {
  if (!this.otp || !this.otp.code) return false
  if (this.otp.expiresAt < new Date()) return false
  if (this.otp.verified) return false
  
  if (this.otp.code === enteredOTP) {
    this.otp.verified = true
    this.phoneVerified = true
    return true
  }
  return false
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = require("crypto").randomBytes(20).toString("hex")
  
  this.resetPasswordToken = require("crypto")
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
  
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes
  
  return resetToken
}

>>>>>>> Incoming (Background Agent changes)
module.exports = mongoose.model("User", userSchema)
