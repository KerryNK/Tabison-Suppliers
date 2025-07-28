const express = require("express")
const router = express.Router()

// Sample contact messages storage (in production, save to database)
const contactMessages = []

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post("/", (req, res) => {
  const { name, email, subject, message } = req.body

  // Here you would typically save to database or send email
  console.log("Contact form submission:", { name, email, subject, message })

  res.json({
    success: true,
    message: "Thank you for your message. We will get back to you soon!",
  })
})

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin only)
router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: contactMessages.length,
      data: contactMessages,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

module.exports = router
