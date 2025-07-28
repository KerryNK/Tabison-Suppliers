const express = require("express")
const { registerUser, loginUser, getMe } = require("../controllers/authController")
const { protect } = require("../middlewares/auth")
const router = express.Router()

// Sample users data (in production, this would be from database)
const sampleUsers = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In production, this would be hashed
    role: "user",
  },
  {
    _id: "2",
    name: "Admin User",
    email: "admin@tabison.com",
    password: "admin123", // In production, this would be hashed
    role: "admin",
  },
]

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/me", protect, getMe)

module.exports = router
