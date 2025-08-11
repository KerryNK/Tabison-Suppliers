
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Generate PDF receipt
const generateReceipt = async (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filename = `receipt-${order.orderNumber}.pdf`;
    const filepath = path.join(__dirname, '../temp', filename);
    
    // Ensure temp directory exists
    const tempDir = path.dirname(filepath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    doc.pipe(fs.createWriteStream(filepath));
    
    // Header
    doc.fontSize(20).text('TABISON SUPPLIERS', 50, 50);
    doc.fontSize(12).text('Quality Products, Quality Service in Kenya', 50, 80);
    doc.text('Phone: +254 700 000 000 | Email: info@tabisonsuppliers.com', 50, 95);
    
    // Order details
    doc.fontSize(16).text('ORDER RECEIPT', 50, 130);
    doc.fontSize(12);
    doc.text(`Order Number: ${order.orderNumber}`, 50, 160);
    doc.text(`Date: ${order.createdAt.toLocaleDateString()}`, 50, 175);
    doc.text(`Payment Status: ${order.payment.status.toUpperCase()}`, 50, 190);
    
    // Customer details
    doc.text('BILLING ADDRESS:', 50, 220);
    doc.text(`${order.shipping.address.street}`, 50, 235);
    doc.text(`${order.shipping.address.city}, ${order.shipping.address.county}`, 50, 250);
    doc.text(`${order.shipping.address.country}`, 50, 265);
    
    // Items table
    let yPosition = 300;
    doc.text('ITEMS:', 50, yPosition);
    yPosition += 20;
    
    // Table headers
    doc.text('Item', 50, yPosition);
    doc.text('Qty', 300, yPosition);
    doc.text('Price', 350, yPosition);
    doc.text('Total', 450, yPosition);
    yPosition += 15;
    
    // Draw line
    doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
    yPosition += 10;
    
    // Items
    order.items.forEach(item => {
      doc.text(item.product.name, 50, yPosition, { width: 240 });
      doc.text(item.quantity.toString(), 300, yPosition);
      doc.text(`Ksh ${item.price.toLocaleString()}`, 350, yPosition);
      doc.text(`Ksh ${(item.quantity * item.price).toLocaleString()}`, 450, yPosition);
      yPosition += 20;
    });
    
    // Totals
    yPosition += 10;
    doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
    yPosition += 15;
    
    doc.text(`Subtotal: Ksh ${order.payment.amount.subtotal.toLocaleString()}`, 350, yPosition);
    yPosition += 15;
    doc.text(`Shipping: Ksh ${order.payment.amount.shipping.toLocaleString()}`, 350, yPosition);
    yPosition += 15;
    doc.fontSize(14).text(`TOTAL: Ksh ${order.payment.amount.total.toLocaleString()}`, 350, yPosition);
    
    // Footer
    doc.fontSize(10).text('Thank you for your business!', 50, yPosition + 50);
    doc.text('For support, contact us at support@tabisonsuppliers.com', 50, yPosition + 65);
    
    doc.end();
    
    doc.on('end', () => {
      resolve(filepath);
    });
    
    doc.on('error', (err) => {
      reject(err);
    });
  });
};

// Send receipt email
exports.sendReceiptEmail = async (order) => {
  try {
    const transporter = createTransporter();
    const receiptPath = await generateReceipt(order);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.customer.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Dear ${order.customer.name || 'Valued Customer'},</p>
        <p>Your order <strong>${order.orderNumber}</strong> has been confirmed and is being processed.</p>
        <p><strong>Order Details:</strong></p>
        <ul>
          <li>Order Number: ${order.orderNumber}</li>
          <li>Total Amount: Ksh ${order.payment.amount.total.toLocaleString()}</li>
          <li>Payment Status: ${order.payment.status}</li>
        </ul>
        <p>Please find your receipt attached to this email.</p>
        <p>You can track your order status at: <a href="${process.env.FRONTEND_URL}/orders/${order._id}">Track Order</a></p>
        <p>Thank you for choosing Tabison Suppliers!</p>
        <br>
        <p>Best regards,<br>Tabison Suppliers Team</p>
      `,
      attachments: [{
        filename: `receipt-${order.orderNumber}.pdf`,
        path: receiptPath
      }]
    };
    
    await transporter.sendMail(mailOptions);
    
    // Clean up temp file
    fs.unlinkSync(receiptPath);
    
    console.log(`Receipt email sent for order ${order.orderNumber}`);
  } catch (error) {
    console.error('Error sending receipt email:', error);
  }
};

// Send order status update email
exports.sendOrderStatusUpdate = async (order, previousStatus) => {
  try {
    const transporter = createTransporter();
    
    let subject = '';
    let message = '';
    
    switch (order.status) {
      case 'confirmed':
        subject = `Order Confirmed - ${order.orderNumber}`;
        message = 'Your order has been confirmed and is being prepared for shipment.';
        break;
      case 'processing':
        subject = `Order Processing - ${order.orderNumber}`;
        message = 'Your order is currently being processed in our warehouse.';
        break;
      case 'shipped':
        subject = `Order Shipped - ${order.orderNumber}`;
        message = `Your order has been shipped! Tracking number: ${order.tracking.trackingNumber}`;
        break;
      case 'delivered':
        subject = `Order Delivered - ${order.orderNumber}`;
        message = 'Your order has been successfully delivered. Thank you for your business!';
        break;
      default:
        return;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.customer.email,
      subject: subject,
      html: `
        <h2>Order Status Update</h2>
        <p>Dear ${order.customer.name || 'Valued Customer'},</p>
        <p>${message}</p>
        <p><strong>Order Details:</strong></p>
        <ul>
          <li>Order Number: ${order.orderNumber}</li>
          <li>Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</li>
          ${order.tracking.trackingNumber ? `<li>Tracking Number: ${order.tracking.trackingNumber}</li>` : ''}
        </ul>
        <p>You can track your order at: <a href="${process.env.FRONTEND_URL}/orders/${order._id}">Track Order</a></p>
        <br>
        <p>Best regards,<br>Tabison Suppliers Team</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Status update email sent for order ${order.orderNumber}`);
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
};
