// Mock app title data
let appTitle = {
  title: "Tabison Suppliers",
  subtitle: "Military, Safety & Professional Footwear",
  description: "Leading supplier of military boots, safety footwear, and professional equipment in Kenya",
}

/**
 * @desc    Get app title
 * @route   GET /api/app-title
 * @access  Public
 */
const getAppTitle = async (req, res) => {
  try {
    res.json({
      success: true,
      data: appTitle,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

/**
 * @desc    Update app title
 * @route   PUT /api/app-title
 * @access  Private/Admin
 */
const updateAppTitle = async (req, res) => {
  try {
    const { title, subtitle, description } = req.body

    appTitle = {
      title: title || appTitle.title,
      subtitle: subtitle || appTitle.subtitle,
      description: description || appTitle.description,
    }

    res.json({
      success: true,
      data: appTitle,
      message: "App title updated successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

module.exports = {
  getAppTitle,
  updateAppTitle,
}
