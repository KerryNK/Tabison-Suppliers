import express from 'express';
import Otp from '../models/otpModel.js';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

function buildMailer() {
  if (process.env.SMTP_URL) return nodemailer.createTransport(process.env.SMTP_URL);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

router.post('/send', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'email required' });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await Otp.create({ recipient: email, code, expiresAt });
  try {
    const mailer = buildMailer();
    await mailer.sendMail({ from: process.env.MAIL_FROM || 'no-reply@tabison.suppliers', to: email, subject: 'Your OTP Code', text: `Your login code is ${code}. It expires in 10 minutes.` });
  } catch (e) {}
  res.json({ message: 'OTP sent' });
});

router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  const record = await Otp.findOne({ recipient: email, code, used: false });
  if (!record || record.expiresAt < new Date()) return res.status(400).json({ message: 'Invalid or expired code' });
  record.used = true; await record.save();
  let user = await User.findOne({ email });
  if (!user) user = await User.create({ name: email.split('@')[0], email, password: Math.random().toString(36) });
  generateToken(res, user._id, user.role);
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
});

export default router;


