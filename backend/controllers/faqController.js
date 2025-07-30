import asyncHandler from "express-async-handler"
import FAQ from "../models/FAQ.js"

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
const getFAQs = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        $or: [
          { question: { $regex: req.query.keyword, $options: "i" } },
          { answer: { $regex: req.query.keyword, $options: "i" } },
        ],
      }
    : {}

  const count = await FAQ.countDocuments({ ...keyword, isActive: true })
  const faqs = await FAQ.find({ ...keyword, isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("createdBy", "name")

  res.json({
    faqs,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  })
})

// @desc    Get FAQs by category
// @route   GET /api/faqs/category/:category
// @access  Public
const getFAQsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params
  const faqs = await FAQ.find({ category, isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .populate("createdBy", "name")

  res.json(faqs)
})

// @desc    Get single FAQ
// @route   GET /api/faqs/:id
// @access  Public
const getFAQById = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id).populate("createdBy", "name")

  if (faq && faq.isActive) {
    res.json(faq)
  } else {
    res.status(404)
    throw new Error("FAQ not found")
  }
})

// @desc    Create a FAQ
// @route   POST /api/faqs
// @access  Private/Admin
const createFAQ = asyncHandler(async (req, res) => {
  const { question, answer, category, order } = req.body

  const faq = await FAQ.create({
    question,
    answer,
    category,
    order: order || 0,
    createdBy: req.user._id,
  })

  if (faq) {
    res.status(201).json(faq)
  } else {
    res.status(400)
    throw new Error("Invalid FAQ data")
  }
})

// @desc    Update a FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
const updateFAQ = asyncHandler(async (req, res) => {
  const { question, answer, category, order, isActive } = req.body

  const faq = await FAQ.findById(req.params.id)

  if (faq) {
    faq.question = question || faq.question
    faq.answer = answer || faq.answer
    faq.category = category || faq.category
    faq.order = order !== undefined ? order : faq.order
    faq.isActive = isActive !== undefined ? isActive : faq.isActive
    faq.updatedBy = req.user._id

    const updatedFAQ = await faq.save()

    res.json(updatedFAQ)
  } else {
    res.status(404)
    throw new Error("FAQ not found")
  }
})

// @desc    Delete a FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id)

  if (faq) {
    await faq.deleteOne()
    res.json({ message: "FAQ removed" })
  } else {
    res.status(404)
    throw new Error("FAQ not found")
  }
})

export {
  getFAQs,
  getFAQsByCategory,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
}