import express from "express"
import { protect, admin } from "../middleware/authMiddleware.js"
import {
  getFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQsByCategory,
} from "../controllers/faqController.js"

const router = express.Router()

// Public routes
router.get("/", getFAQs)
router.get("/category/:category", getFAQsByCategory)
router.get("/:id", getFAQById)

// Protected admin routes
router.post("/", protect, admin, createFAQ)
router.put("/:id", protect, admin, updateFAQ)
router.delete("/:id", protect, admin, deleteFAQ)

export default router