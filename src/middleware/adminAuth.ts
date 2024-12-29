import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

export async function adminAuthMiddleware(request: NextRequest) {
  const adminToken = request.cookies.get('admin_token');
  const { pathname } = request.nextUrl;

  // Allow access to admin login page
  if (pathname === '/admin/login') {
    // If already logged in, redirect to admin dashboard
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Check for admin token on protected routes
  if (!adminToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    // Verify the JWT token
    await jwtVerify(
      adminToken.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, clear it and redirect to login
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin_token');
    return response;
  }
} 