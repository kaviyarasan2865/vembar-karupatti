import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    const isAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'admin account not found. Please try with valid email.' },
        { status: 404 }
      );
    }

    const isPasswordValid = await Admin.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      success: true,
      user: {
        email: Admin.email,
        isVerified: Admin.isVerified,
        authProvider: Admin.authProvider
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}