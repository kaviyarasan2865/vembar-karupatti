import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

export const adminAuth = async (req: NextRequest) => {
  const adminToken = req.cookies.get('admin_token');
  const { pathname } = req.nextUrl;

  // Allow access to admin login page
  if (pathname === '/admin/login') {
    // If already logged in, redirect to admin dashboard
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Check for admin token on protected routes
  if (!adminToken) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  try {
    // Verify the JWT token
    await jwtVerify(
      adminToken.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return NextResponse.next();
  } catch (err) {
    console.error('Admin authentication error:', err);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 401 }
    );
  }
}; 