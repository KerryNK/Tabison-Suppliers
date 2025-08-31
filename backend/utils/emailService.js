
const nodemailer = require('nodemailer');
const config = require('../config/env');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: false,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });
};

// Send OTP Email
const sendOTPEmail = async (email, otp, name, subject = 'Email Verification') => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: config.EMAIL_FROM,
      to: email,
      subject: `${subject} - Tabison Suppliers`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Email Verification</title>
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9fafb; }
            .otp-box { background: white; border: 2px dashed #2563eb; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px; }
            .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Tabison Suppliers</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your verification code is:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Tabison Suppliers. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw error;
  }
};

// Send Password Reset Email
const sendPasswordResetEmail = async (email, resetToken, name) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${config.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: config.EMAIL_FROM,
      to: email,
      subject: 'Password Reset - Tabison Suppliers',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9fafb; }
            .reset-button { display: inline-block; padding: 15px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>You requested a password reset. Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
              </div>
              <p>This link will expire in 30 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <p><small>If the button doesn't work, copy this link: ${resetUrl}</small></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Tabison Suppliers. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error('❌ Password reset email error:', error);
    throw error;
  }
};

// Send Order Confirmation Email
const sendOrderConfirmationEmail = async (email, order, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: config.EMAIL_FROM,
      to: email,
      subject: `Order Confirmation #${order.orderNumber} - Tabison Suppliers`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation</title>
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9fafb; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .item { border-bottom: 1px solid #e5e7eb; padding: 10px 0; }
            .total { font-weight: bold; font-size: 18px; color: #059669; }
            .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed!</h1>
            </div>
            <div class="content">
              <h2>Thank you ${name}!</h2>
              <p>Your order has been confirmed and is being processed.</p>
              
              <div class="order-details">
                <h3>Order #${order.orderNumber}</h3>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                
                <h4>Items:</h4>
                ${order.items.map(item => `
                  <div class="item">
                    <strong>${item.product.name}</strong><br>
                    Quantity: ${item.quantity} × Ksh ${item.price.toLocaleString()} = Ksh ${(item.quantity * item.price).toLocaleString()}
                  </div>
                `).join('')}
                
                <div class="total">
                  Total: Ksh ${order.payment.amount.total.toLocaleString()}
                </div>
              </div>
              
              <p>You can track your order status at any time by visiting our website.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Tabison Suppliers. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${email}`);
  } catch (error) {
    console.error('❌ Order confirmation email error:', error);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail
};
