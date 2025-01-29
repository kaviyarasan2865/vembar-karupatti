import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import nodemailer from 'nodemailer';
import Admin from '@/models/Admin';
import { otpStore } from '@/lib/otpStore';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}


// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email: string, otp: string): Promise<boolean> {
  const mailOptions: EmailOptions = {
    from: process.env.EMAIL_USER!,
    to: email,
    subject: 'Admin Login OTP',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Login Verification Code</h2>
        <p style="color: #666; font-size: 16px;">Your OTP for login verification is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <h1 style="color: #333; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">This OTP will expire in 5 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password - Fix: Compare with stored password directly since we're not using bcrypt
    if (admin.password !== password) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate and store OTP
    const otp = generateOTP();
    otpStore.set(email, {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Send OTP
    const emailSent = await sendOTP(email, otp);
    if (!emailSent) {
      return NextResponse.json(
        { message: 'Failed to send OTP' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
