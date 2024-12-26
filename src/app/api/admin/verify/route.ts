import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const OTP_STORE = {};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { email, password, otp } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Admin not found.' });

    if (otp) {
      // Verify OTP
      if (OTP_STORE[email] && OTP_STORE[email] === otp) {
        admin.isVerified = true;
        await admin.save();
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token });
      } else {
        return res.status(400).json({ message: 'Invalid OTP.' });
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password.' });

    if (!admin.isVerified) {
      // Send OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      OTP_STORE[email] = otp;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
      });

      return res.status(200).json({ message: 'OTP sent to email.' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  }

  res.status(405).json({ message: 'Method not allowed.' });
}
