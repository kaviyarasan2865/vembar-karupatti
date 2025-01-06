import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { adminAuthMiddleware } from './middleware/adminAuth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    return adminAuthMiddleware(request);
  }

  // Your existing user authentication middleware
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // if (pathname === '/') {
  //   if (token) {
  //     return NextResponse.redirect(new URL('/', request.url))
  //   }
  //   return NextResponse.next()
  // }

  const isAuthPage = ['/login', '/signup'].includes(pathname)
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }
  
  // Protected routes
  // if (!token) {
  //   const loginUrl = new URL('/', request.url)
  //   return NextResponse.redirect(loginUrl)
  // }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ]
}