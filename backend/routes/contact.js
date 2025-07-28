const express = require("express")
const router = express.Router()

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and message",
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      })
    }

    // Here you would typically save to database or send email
    console.log("📧 Contact form submission:", {
      name,
      email,
      subject: subject || "No subject",
      message,
      timestamp: new Date().toISOString(),
    })

    res.status(200).json({
      success: true,
      message: "Thank you for your message. We'll get back to you soon!",
      data: {
        name,
        email,
        subject: subject || "No subject",
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Contact form error:", error)
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    })
  }
})

// @desc    Get contact info
// @route   GET /api/contact
// @access  Public
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Contact endpoint is working",
    data: {
      email: "info@tabisonsuppliers.com",
      phone: "+254-XXX-XXXX",
      address: "Nairobi, Kenya",
      businessHours: "Mon-Fri 8AM-6PM EAT",
    },
  })
})

module.exports = router
