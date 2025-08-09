const nodemailer = require('nodemailer')
const fs = require('fs').promises
const path = require('path')

class EmailService {
  constructor() {
    this.transporter = null
    this.initializeTransporter()
  }

  // Initialize email transporter
  initializeTransporter() {
    try {
      // Configure based on environment
      if (process.env.NODE_ENV === 'production') {
        // Production configuration (e.g., SendGrid, AWS SES, etc.)
        this.transporter = nodemailer.createTransporter({
          service: 'SendGrid',
          auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
          }
        })
      } else {
        // Development configuration (Gmail or other SMTP)
        this.transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // Use App Password for Gmail
          }
        })
      }

      // Verify transporter
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('Email configuration error:', error)
        } else {
          console.log('✅ Email service configured successfully')
        }
      })
    } catch (error) {
      console.error('Email service initialization failed:', error)
    }
  }

  // Base email sending function
  async sendEmail({ to, subject, html, text, attachments = [] }) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not configured')
      }

      const mailOptions = {
        from: {
          name: 'Tabison Suppliers',
          address: process.env.EMAIL_FROM || 'noreply@tabisonsuppliers.com'
        },
        to,
        subject,
        html,
        text,
        attachments
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', result.messageId)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Order confirmation email
  async sendOrderConfirmation(order, user) {
    try {
      const subject = `Order Confirmation - ${order.orderNumber}`
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: #1D6D73; color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px 20px; }
            .order-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .item:last-child { border-bottom: none; }
            .total { font-weight: bold; font-size: 18px; color: #1D6D73; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
            .btn { display: inline-block; padding: 12px 24px; background: #1D6D73; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed!</h1>
              <p>Thank you for your order, ${user.name}</p>
            </div>
            
            <div class="content">
              <div class="order-info">
                <h3>Order Details</h3>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-KE')}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Payment Status:</strong> ${order.isPaid ? 'Paid' : 'Pending'}</p>
              </div>

              <h3>Order Items</h3>
              ${order.orderItems.map(item => `
                <div class="item">
                  <div>
                    <strong>${item.name}</strong><br>
                    <small>Quantity: ${item.quantity}</small>
                  </div>
                  <div>KES ${(item.price * item.quantity).toLocaleString()}</div>
                </div>
              `).join('')}
              
              <div class="item total">
                <div>Total Amount</div>
                <div>KES ${order.totalPrice.toLocaleString()}</div>
              </div>

              <div class="order-info">
                <h3>Shipping Address</h3>
                <p>
                  ${order.shippingAddress.fullName}<br>
                  ${order.shippingAddress.address}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.county}<br>
                  ${order.shippingAddress.postalCode || ''}<br>
                  ${order.shippingAddress.phone}
                </p>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order._id}" class="btn">
                  Track Your Order
                </a>
              </div>
            </div>

            <div class="footer">
              <p>Questions about your order? Contact us at support@tabisonsuppliers.com</p>
              <p>&copy; 2024 Tabison Suppliers. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `

      const text = `
        Order Confirmation - ${order.orderNumber}
        
        Thank you for your order, ${user.name}!
        
        Order Details:
        - Order Number: ${order.orderNumber}
        - Order Date: ${new Date(order.createdAt).toLocaleDateString('en-KE')}
        - Total: KES ${order.totalPrice.toLocaleString()}
        
        Track your order: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order._id}
      `

      return await this.sendEmail({
        to: user.email,
        subject,
        html,
        text
      })
    } catch (error) {
      console.error('Order confirmation email failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Order status update email
  async sendOrderStatusUpdate(order, user, previousStatus) {
    try {
      const subject = `Order Update - ${order.orderNumber}`
      
      const statusMessages = {
        'confirmed': 'Your order has been confirmed and is being prepared.',
        'processing': 'Your order is currently being processed.',
        'shipped': 'Great news! Your order has been shipped.',
        'delivered': 'Your order has been delivered successfully.',
        'cancelled': 'Your order has been cancelled.'
      }

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Status Update</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: #1D6D73; color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .status-update { background: #e8f5e8; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #28a745; }
            .btn { display: inline-block; padding: 12px 24px; background: #1D6D73; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Status Update</h1>
              <p>Order #${order.orderNumber}</p>
            </div>
            
            <div class="content">
              <div class="status-update">
                <h3>Status Changed: ${previousStatus} → ${order.status}</h3>
                <p>${statusMessages[order.status] || 'Your order status has been updated.'}</p>
                ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
              </div>

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order._id}" class="btn">
                  View Order Details
                </a>
              </div>
            </div>

            <div class="footer">
              <p>Questions? Contact us at support@tabisonsuppliers.com</p>
              <p>&copy; 2024 Tabison Suppliers. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `

      return await this.sendEmail({
        to: user.email,
        subject,
        html
      })
    } catch (error) {
      console.error('Order status update email failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Send receipt with PDF attachment
  async sendReceipt(order, user, pdfBuffer) {
    try {
      const subject = `Receipt - ${order.orderNumber}`
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Receipt</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: #1D6D73; color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; text-align: center; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
            .attachment-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Receipt Ready</h1>
              <p>Order #${order.orderNumber}</p>
            </div>
            
            <div class="content">
              <h2>Thank you for your purchase!</h2>
              <p>Your receipt is attached to this email as a PDF document.</p>
              
              <div class="attachment-info">
                <h3>📄 Receipt Details</h3>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Amount:</strong> KES ${order.totalPrice.toLocaleString()}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-KE')}</p>
              </div>
              
              <p>If you have any questions about your order, please don't hesitate to contact us.</p>
            </div>

            <div class="footer">
              <p>Support: support@tabisonsuppliers.com | Phone: +254 700 000 000</p>
              <p>&copy; 2024 Tabison Suppliers. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `

      const attachments = pdfBuffer ? [
        {
          filename: `Receipt-${order.orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ] : []

      return await this.sendEmail({
        to: user.email,
        subject,
        html,
        attachments
      })
    } catch (error) {
      console.error('Receipt email failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Welcome email for new users
  async sendWelcomeEmail(user) {
    try {
      const subject = 'Welcome to Tabison Suppliers!'
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Tabison Suppliers</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: #1D6D73; color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .feature { display: flex; align-items: center; margin: 15px 0; }
            .feature-icon { width: 40px; height: 40px; background: #e8f5e8; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; }
            .btn { display: inline-block; padding: 12px 24px; background: #1D6D73; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Tabison Suppliers!</h1>
              <p>Your reliable partner for quality products</p>
            </div>
            
            <div class="content">
              <h2>Hi ${user.name},</h2>
              <p>Welcome to the Tabison Suppliers family! We're excited to have you on board.</p>
              
              <h3>What you can do:</h3>
              <div class="feature">
                <div class="feature-icon">🛒</div>
                <div>Browse and order from thousands of quality products</div>
              </div>
              <div class="feature">
                <div class="feature-icon">📦</div>
                <div>Track your orders in real-time</div>
              </div>
              <div class="feature">
                <div class="feature-icon">💳</div>
                <div>Secure payments with M-Pesa, Cards, or PayPal</div>
              </div>
              <div class="feature">
                <div class="feature-icon">📞</div>
                <div>Get 24/7 customer support</div>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" class="btn">
                  Start Shopping
                </a>
              </div>
            </div>

            <div class="footer">
              <p>Need help? Contact us at support@tabisonsuppliers.com</p>
              <p>&copy; 2024 Tabison Suppliers. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `

      return await this.sendEmail({
        to: user.email,
        subject,
        html
      })
    } catch (error) {
      console.error('Welcome email failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Password reset email
  async sendPasswordResetEmail(user, resetToken) {
    try {
      const subject = 'Reset Your Password - Tabison Suppliers'
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: #1D6D73; color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .btn { display: inline-block; padding: 12px 24px; background: #1D6D73; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            
            <div class="content">
              <h2>Hi ${user.name},</h2>
              <p>We received a request to reset your password for your Tabison Suppliers account.</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="btn">Reset Password</a>
              </div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            </div>

            <div class="footer">
              <p>If you need help, contact us at support@tabisonsuppliers.com</p>
              <p>&copy; 2024 Tabison Suppliers. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `

      return await this.sendEmail({
        to: user.email,
        subject,
        html
      })
    } catch (error) {
      console.error('Password reset email failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Quote request notification
  async sendQuoteRequestNotification(quoteRequest, user) {
    try {
      const subject = `Quote Request Received - ${quoteRequest.quoteNumber}`
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Quote Request Received</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: #1D6D73; color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .quote-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Quote Request Received</h1>
              <p>We'll get back to you soon!</p>
            </div>
            
            <div class="content">
              <h2>Hi ${user.name},</h2>
              <p>Thank you for your quote request. Our team is reviewing your requirements and will send you a detailed quote within 24 hours.</p>
              
              <div class="quote-info">
                <h3>Request Details</h3>
                <p><strong>Quote Number:</strong> ${quoteRequest.quoteNumber}</p>
                <p><strong>Date:</strong> ${new Date(quoteRequest.createdAt).toLocaleDateString('en-KE')}</p>
                <p><strong>Items:</strong> ${quoteRequest.items.length} product(s)</p>
              </div>
              
              <p>In the meantime, feel free to browse our products or contact us if you have any questions.</p>
            </div>

            <div class="footer">
              <p>Questions? Contact us at quotes@tabisonsuppliers.com</p>
              <p>&copy; 2024 Tabison Suppliers. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `

      return await this.sendEmail({
        to: user.email,
        subject,
        html
      })
    } catch (error) {
      console.error('Quote request email failed:', error)
      return { success: false, error: error.message }
    }
  }
}

module.exports = new EmailService()