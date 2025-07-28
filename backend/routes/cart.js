const express = require("express")
const router = express.Router()
const Cart = require("../models/cartModel")
const { protect } = require("../middleware/authMiddleware")

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product")

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] })
    }

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
router.post("/add", protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] })
    }

    const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId)

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity
    } else {
      cart.items.push({ product: productId, quantity })
    }

    await cart.save()
    await cart.populate("items.product")

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
router.put("/update", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body

    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId)

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1)
      } else {
        cart.items[itemIndex].quantity = quantity
      }

      await cart.save()
      await cart.populate("items.product")
    }

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId)

    await cart.save()
    await cart.populate("items.product")

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete("/clear", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.items = []
    await cart.save()

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
