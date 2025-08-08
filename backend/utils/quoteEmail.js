import nodemailer from 'nodemailer';

function transporter() {
  if (process.env.SMTP_URL) return nodemailer.createTransport(process.env.SMTP_URL);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

export async function sendQuoteRequestEmail(quote) {
  const mailer = transporter();
  const to = process.env.SALES_EMAIL || process.env.FALLBACK_RECEIPT_EMAIL;
  if (!to) return;
  const items = quote.items.map(i => `- ${i.product} x ${i.quantity}`).join('\n');
  await mailer.sendMail({
    from: process.env.MAIL_FROM || 'no-reply@tabison.suppliers',
    to,
    subject: `New Quote Request ${quote._id}`,
    text: `Name: ${quote.name}\nEmail: ${quote.email}\nPhone: ${quote.phone}\nItems:\n${items}\nNotes: ${quote.notes || ''}`,
  });
}


