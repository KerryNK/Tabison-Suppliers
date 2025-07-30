import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import {
  initiateMpesaSTKPush,
  mpesaCallback,
  getPaymentStatus,
  processPayPalPayment,
} from "../controllers/paymentController.js"

const router = express.Router()

// M-PESA routes
router.post("/mpesa/stk-push", protect, initiateMpesaSTKPush)
router.post("/mpesa/callback", mpesaCallback) // Public callback for M-PESA
router.get("/status/:orderId", protect, getPaymentStatus)

// PayPal routes
router.post("/paypal", protect, processPayPalPayment)

export default router
