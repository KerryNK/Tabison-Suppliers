const PDFDocument = require('pdfkit')
const path = require('path')

class PDFService {
  constructor() {
    this.companyInfo = {
      name: 'Tabison Suppliers',
      address: 'P.O. Box 12345',
      city: 'Nairobi, Kenya',
      phone: '+254 700 000 000',
      email: 'info@tabisonsuppliers.com',
      website: 'www.tabisonsuppliers.com',
      logo: null // We'll add this later if we have a logo file
    }
  }

  // Generate receipt PDF
  async generateReceipt(order, user) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 })
        const chunks = []

        // Collect PDF data
        doc.on('data', chunk => chunks.push(chunk))
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks)
          resolve(pdfBuffer)
        })

        // Generate receipt content
        this.generateReceiptContent(doc, order, user)
        
        // Finalize the PDF
        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  // Generate invoice PDF
  async generateInvoice(order, user) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 })
        const chunks = []

        // Collect PDF data
        doc.on('data', chunk => chunks.push(chunk))
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks)
          resolve(pdfBuffer)
        })

        // Generate invoice content
        this.generateInvoiceContent(doc, order, user)
        
        // Finalize the PDF
        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  // Generate receipt content
  generateReceiptContent(doc, order, user) {
    // Header
    this.generateHeader(doc, 'RECEIPT')
    
    // Customer info
    this.generateCustomerInfo(doc, user, order)
    
    // Receipt details
    this.generateReceiptDetails(doc, order)
    
    // Order items
    this.generateOrderItems(doc, order)
    
    // Payment details
    this.generatePaymentDetails(doc, order)
    
    // Footer
    this.generateFooter(doc)
  }

  // Generate invoice content
  generateInvoiceContent(doc, order, user) {
    // Header
    this.generateHeader(doc, 'INVOICE')
    
    // Customer info
    this.generateCustomerInfo(doc, user, order)
    
    // Invoice details
    this.generateInvoiceDetails(doc, order)
    
    // Order items
    this.generateOrderItems(doc, order)
    
    // Payment details
    this.generatePaymentDetails(doc, order)
    
    // Terms and conditions
    this.generateTerms(doc)
    
    // Footer
    this.generateFooter(doc)
  }

  // Generate header
  generateHeader(doc, documentType) {
    const currentY = doc.y

    // Company name and logo area
    doc.fontSize(24)
       .fillColor('#1D6D73')
       .text(this.companyInfo.name, 50, currentY, { align: 'left' })

    // Document type
    doc.fontSize(20)
       .fillColor('#000')
       .text(documentType, 400, currentY, { align: 'right' })

    // Company details
    doc.fontSize(10)
       .fillColor('#666')
       .text(this.companyInfo.address, 50, currentY + 35)
       .text(this.companyInfo.city, 50, currentY + 50)
       .text(`Phone: ${this.companyInfo.phone}`, 50, currentY + 65)
       .text(`Email: ${this.companyInfo.email}`, 50, currentY + 80)
       .text(`Website: ${this.companyInfo.website}`, 50, currentY + 95)

    // Date
    doc.fontSize(10)
       .fillColor('#000')
       .text(`Date: ${new Date().toLocaleDateString('en-KE')}`, 400, currentY + 35, { align: 'right' })

    // Draw line
    doc.moveTo(50, currentY + 120)
       .lineTo(550, currentY + 120)
       .strokeColor('#1D6D73')
       .stroke()

    // Move cursor
    doc.y = currentY + 140
  }

  // Generate customer information
  generateCustomerInfo(doc, user, order) {
    const startY = doc.y

    // Bill To section
    doc.fontSize(12)
       .fillColor('#000')
       .text('Bill To:', 50, startY)

    doc.fontSize(10)
       .text(user.name, 50, startY + 20)
       .text(user.email, 50, startY + 35)

    if (order.shippingAddress) {
      doc.text(order.shippingAddress.phone || '', 50, startY + 50)
    }

    // Ship To section (if different)
    if (order.shippingAddress) {
      doc.fontSize(12)
         .fillColor('#000')
         .text('Ship To:', 300, startY)

      doc.fontSize(10)
         .text(order.shippingAddress.fullName, 300, startY + 20)
         .text(order.shippingAddress.address, 300, startY + 35)
         .text(`${order.shippingAddress.city}, ${order.shippingAddress.county}`, 300, startY + 50)
         .text(order.shippingAddress.postalCode || '', 300, startY + 65)
         .text(order.shippingAddress.phone, 300, startY + 80)
    }

    doc.y = startY + 100
  }

  // Generate receipt details
  generateReceiptDetails(doc, order) {
    const startY = doc.y

    doc.fontSize(12)
       .fillColor('#000')
       .text('Receipt Details:', 50, startY)

    doc.fontSize(10)
       .text(`Receipt Number: ${order.orderNumber}`, 50, startY + 20)
       .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString('en-KE')}`, 50, startY + 35)
       .text(`Payment Date: ${order.paidAt ? new Date(order.paidAt).toLocaleDateString('en-KE') : 'Pending'}`, 50, startY + 50)
       .text(`Payment Method: ${this.getPaymentMethodName(order.paymentResult)}`, 50, startY + 65)

    doc.y = startY + 90
  }

  // Generate invoice details
  generateInvoiceDetails(doc, order) {
    const startY = doc.y

    doc.fontSize(12)
       .fillColor('#000')
       .text('Invoice Details:', 50, startY)

    doc.fontSize(10)
       .text(`Invoice Number: ${order.orderNumber}`, 50, startY + 20)
       .text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString('en-KE')}`, 50, startY + 35)
       .text(`Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-KE')}`, 50, startY + 50)
       .text(`Status: ${order.isPaid ? 'Paid' : 'Pending'}`, 50, startY + 65)

    doc.y = startY + 90
  }

  // Generate order items table
  generateOrderItems(doc, order) {
    const startY = doc.y
    const tableTop = startY + 20

    // Table headers
    doc.fontSize(12)
       .fillColor('#000')
       .text('Order Items:', 50, startY)

    // Table header background
    doc.rect(50, tableTop, 500, 25)
       .fillAndStroke('#f8f9fa', '#ddd')

    // Header text
    doc.fontSize(10)
       .fillColor('#000')
       .text('Item', 60, tableTop + 8)
       .text('Qty', 350, tableTop + 8)
       .text('Price', 400, tableTop + 8)
       .text('Total', 480, tableTop + 8)

    // Table rows
    let currentY = tableTop + 25
    let subtotal = 0

    order.orderItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity
      subtotal += itemTotal

      // Alternate row colors
      if (index % 2 === 0) {
        doc.rect(50, currentY, 500, 20)
           .fillAndStroke('#f8f9fa', '#f8f9fa')
      }

      doc.fontSize(9)
         .fillColor('#000')
         .text(item.name, 60, currentY + 6, { width: 280 })
         .text(item.quantity.toString(), 350, currentY + 6)
         .text(`KES ${item.price.toLocaleString()}`, 400, currentY + 6)
         .text(`KES ${itemTotal.toLocaleString()}`, 480, currentY + 6)

      currentY += 20
    })

    // Totals section
    currentY += 10
    const totalsStartY = currentY

    // Subtotal
    doc.fontSize(10)
       .text('Subtotal:', 400, currentY)
       .text(`KES ${order.itemsPrice?.toLocaleString() || subtotal.toLocaleString()}`, 480, currentY)

    currentY += 15

    // Shipping
    if (order.shippingPrice > 0) {
      doc.text('Shipping:', 400, currentY)
         .text(`KES ${order.shippingPrice.toLocaleString()}`, 480, currentY)
      currentY += 15
    }

    // Tax
    if (order.taxPrice > 0) {
      doc.text('Tax (VAT 16%):', 400, currentY)
         .text(`KES ${order.taxPrice.toLocaleString()}`, 480, currentY)
      currentY += 15
    }

    // Total line
    doc.moveTo(400, currentY)
       .lineTo(550, currentY)
       .strokeColor('#ddd')
       .stroke()

    currentY += 10

    // Grand total
    doc.fontSize(12)
       .fillColor('#1D6D73')
       .text('Total:', 400, currentY)
       .text(`KES ${order.totalPrice.toLocaleString()}`, 480, currentY)

    doc.y = currentY + 30
  }

  // Generate payment details
  generatePaymentDetails(doc, order) {
    const startY = doc.y

    doc.fontSize(12)
       .fillColor('#000')
       .text('Payment Information:', 50, startY)

    const paymentMethod = this.getPaymentMethodName(order.paymentResult)
    let paymentDetails = `Payment Method: ${paymentMethod}\n`
    paymentDetails += `Status: ${order.isPaid ? 'Paid' : 'Pending'}\n`

    if (order.paidAt) {
      paymentDetails += `Payment Date: ${new Date(order.paidAt).toLocaleDateString('en-KE')}\n`
    }

    if (order.paymentResult) {
      if (order.paymentResult.mpesa_receipt_number) {
        paymentDetails += `M-Pesa Receipt: ${order.paymentResult.mpesa_receipt_number}\n`
      }
      if (order.paymentResult.stripe_payment_intent_id) {
        paymentDetails += `Transaction ID: ${order.paymentResult.stripe_payment_intent_id}\n`
      }
      if (order.paymentResult.paypal_capture_id) {
        paymentDetails += `PayPal Transaction: ${order.paymentResult.paypal_capture_id}\n`
      }
    }

    doc.fontSize(10)
       .fillColor('#666')
       .text(paymentDetails, 50, startY + 20)

    doc.y = startY + 80
  }

  // Generate terms and conditions
  generateTerms(doc) {
    const startY = doc.y

    doc.fontSize(12)
       .fillColor('#000')
       .text('Terms & Conditions:', 50, startY)

    const terms = [
      '1. Payment is due within 30 days of invoice date.',
      '2. Late payments may incur additional charges.',
      '3. Goods remain the property of Tabison Suppliers until paid in full.',
      '4. Returns must be authorized and in original condition.',
      '5. Warranty terms apply as per manufacturer specifications.'
    ]

    doc.fontSize(9)
       .fillColor('#666')

    terms.forEach((term, index) => {
      doc.text(term, 50, startY + 20 + (index * 12))
    })

    doc.y = startY + 100
  }

  // Generate footer
  generateFooter(doc) {
    const pageHeight = doc.page.height
    const footerY = pageHeight - 100

    // Footer line
    doc.moveTo(50, footerY)
       .lineTo(550, footerY)
       .strokeColor('#1D6D73')
       .stroke()

    // Footer text
    doc.fontSize(10)
       .fillColor('#666')
       .text('Thank you for your business!', 50, footerY + 15, { align: 'center', width: 500 })
       .text('For support, contact us at support@tabisonsuppliers.com or +254 700 000 000', 50, footerY + 30, { align: 'center', width: 500 })

    doc.fontSize(8)
       .text(`Generated on ${new Date().toLocaleString('en-KE')}`, 50, footerY + 50, { align: 'center', width: 500 })
  }

  // Helper function to get payment method name
  getPaymentMethodName(paymentResult) {
    if (!paymentResult) return 'Unknown'
    
    if (paymentResult.mpesa_receipt_number || paymentResult.mpesa_checkout_request_id) {
      return 'M-Pesa'
    } else if (paymentResult.stripe_payment_intent_id) {
      return 'Credit/Debit Card'
    } else if (paymentResult.paypal_capture_id || paymentResult.paypal_order_id) {
      return 'PayPal'
    }
    
    return 'Other'
  }

  // Generate quote PDF
  async generateQuote(quoteRequest, user) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 })
        const chunks = []

        doc.on('data', chunk => chunks.push(chunk))
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks)
          resolve(pdfBuffer)
        })

        this.generateQuoteContent(doc, quoteRequest, user)
        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  // Generate quote content
  generateQuoteContent(doc, quoteRequest, user) {
    // Header
    this.generateHeader(doc, 'QUOTE')
    
    // Customer info
    this.generateQuoteCustomerInfo(doc, user, quoteRequest)
    
    // Quote details
    this.generateQuoteDetails(doc, quoteRequest)
    
    // Quote items
    this.generateQuoteItems(doc, quoteRequest)
    
    // Quote validity and terms
    this.generateQuoteTerms(doc)
    
    // Footer
    this.generateFooter(doc)
  }

  // Generate quote customer info
  generateQuoteCustomerInfo(doc, user, quoteRequest) {
    const startY = doc.y

    doc.fontSize(12)
       .fillColor('#000')
       .text('Quote For:', 50, startY)

    doc.fontSize(10)
       .text(quoteRequest.customerName || user.name, 50, startY + 20)
       .text(quoteRequest.customerEmail || user.email, 50, startY + 35)
       .text(quoteRequest.customerPhone || user.phoneNumber || '', 50, startY + 50)

    if (quoteRequest.company) {
      doc.text(`Company: ${quoteRequest.company}`, 50, startY + 65)
    }

    doc.y = startY + 90
  }

  // Generate quote details
  generateQuoteDetails(doc, quoteRequest) {
    const startY = doc.y

    doc.fontSize(12)
       .fillColor('#000')
       .text('Quote Details:', 50, startY)

    doc.fontSize(10)
       .text(`Quote Number: ${quoteRequest.quoteNumber}`, 50, startY + 20)
       .text(`Quote Date: ${new Date(quoteRequest.createdAt).toLocaleDateString('en-KE')}`, 50, startY + 35)
       .text(`Valid Until: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-KE')}`, 50, startY + 50)
       .text(`Status: ${quoteRequest.status || 'Pending'}`, 50, startY + 65)

    doc.y = startY + 90
  }

  // Generate quote items
  generateQuoteItems(doc, quoteRequest) {
    const startY = doc.y
    const tableTop = startY + 20

    doc.fontSize(12)
       .fillColor('#000')
       .text('Requested Items:', 50, startY)

    // Table header
    doc.rect(50, tableTop, 500, 25)
       .fillAndStroke('#f8f9fa', '#ddd')

    doc.fontSize(10)
       .fillColor('#000')
       .text('Item', 60, tableTop + 8)
       .text('Quantity', 350, tableTop + 8)
       .text('Specifications', 420, tableTop + 8)

    // Table rows
    let currentY = tableTop + 25

    quoteRequest.items.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.rect(50, currentY, 500, 25)
           .fillAndStroke('#f8f9fa', '#f8f9fa')
      }

      doc.fontSize(9)
         .fillColor('#000')
         .text(item.productName, 60, currentY + 8, { width: 280 })
         .text(item.quantity.toString(), 350, currentY + 8)
         .text(item.specifications?.size || '-', 420, currentY + 8)

      if (item.notes) {
        currentY += 12
        doc.fontSize(8)
           .fillColor('#666')
           .text(`Notes: ${item.notes}`, 60, currentY, { width: 480 })
      }

      currentY += 25
    })

    doc.y = currentY + 20
  }

  // Generate quote terms
  generateQuoteTerms(doc) {
    const startY = doc.y

    doc.fontSize(12)
       .fillColor('#000')
       .text('Quote Terms:', 50, startY)

    const terms = [
      '• This quote is valid for 30 days from the date of issue',
      '• Prices are subject to change based on current market rates',
      '• Final pricing will be confirmed upon order placement',
      '• Delivery times may vary based on product availability',
      '• Payment terms: 50% advance, 50% on delivery',
      '• All prices are in Kenyan Shillings (KES) and inclusive of VAT'
    ]

    doc.fontSize(9)
       .fillColor('#666')

    terms.forEach((term, index) => {
      doc.text(term, 50, startY + 20 + (index * 15))
    })

    doc.fontSize(10)
       .fillColor('#1D6D73')
       .text('To accept this quote, please contact us at quotes@tabisonsuppliers.com', 50, startY + 140)

    doc.y = startY + 170
  }
}

module.exports = new PDFService()