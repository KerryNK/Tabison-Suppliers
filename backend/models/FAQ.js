const mongoose = require("mongoose")

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Please add a question"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Please add an answer"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["delivery", "payments", "account", "products", "general"],
      default: "general",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

// Create index for better search performance
faqSchema.index({ category: 1, isActive: 1, order: 1 })

module.exports = mongoose.model("FAQ", faqSchema)