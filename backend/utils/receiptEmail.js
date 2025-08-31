import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

function buildTransport() {
  // Expect SMTP_URL or discrete SMTP settings
  if (process.env.SMTP_URL) {
    return nodemailer.createTransport(process.env.SMTP_URL);
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

function generateReceiptPdf(order, user) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const stream = new PassThrough();
  doc.pipe(stream);

  doc.fontSize(20).text('Payment Receipt', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Order #: ${order.orderNumber}`);
  doc.text(`Customer: ${user?.name || ''} (${user?.email || ''})`);
  doc.text(`Status: ${order.status}`);
  doc.text(`Payment Status: ${order.paymentStatus}`);
  doc.moveDown();
  doc.text('Items:');
  order.items.forEach((i, idx) => {
    doc.text(`${idx + 1}. ${i.product?.name || i.product} x ${i.quantity} @ ${i.unitPrice} = ${i.totalPrice}`);
  });
  doc.moveDown();
  doc.fontSize(14).text(`Total: ${order.totalAmount}`, { align: 'right' });

  doc.end();
  return stream;
}

export async function sendPaymentReceipt({ order, user, method }) {
  const transporter = buildTransport();
  const to = user?.email || process.env.FALLBACK_RECEIPT_EMAIL;
  if (!to) return; // No recipient, skip

  const pdfStream = generateReceiptPdf(order, user);
  const chunks = [];
  const buffer = await new Promise((resolve, reject) => {
    pdfStream.on('data', (chunk) => chunks.push(chunk));
    pdfStream.on('end', () => resolve(Buffer.concat(chunks)));
    pdfStream.on('error', reject);
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'no-reply@tabison.suppliers',
    to,
    subject: `Receipt for Order ${order.orderNumber}`,
    text: `Thank you for your payment via ${method}. Please find your receipt attached.`,
    attachments: [
      { filename: `receipt-${order.orderNumber}.pdf`, content: buffer },
    ],
  });
}


