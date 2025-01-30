import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { otpStore } from '@/lib/otpStore';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    
    // Verify OTP
    const storedOTP = otpStore.get(email);
    if (!storedOTP) {
      return NextResponse.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    if (storedOTP.code !== otp) {    
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    if (Date.now() > storedOTP.expiresAt) {
      otpStore.delete(email);
      return NextResponse.json(
        { message: 'OTP expired' },
        { status: 400 }
      );
    }

    // Clear OTP
    otpStore.delete(email);

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Create session token
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create response with cookie
    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );

    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}