const express = require("express")
const router = express.Router()

// Sample contact messages storage (in production, save to database)
const contactMessages = []

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    // Create contact message
    const contactMessage = {
      _id: String(contactMessages.length + 1),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: "new",
    }

    contactMessages.push(contactMessage)

    res.status(201).json({
      success: true,
      message: "Contact message sent successfully",
      data: contactMessage,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
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
