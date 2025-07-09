import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow requests for static files, API authentication, and specific pages to pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });

  // If there's no token, redirect to the login page
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname); // Optionally pass the original URL as a callback
    return NextResponse.redirect(loginUrl);
  }

  // Role-based protection
  if (pathname.startsWith('/admin')) {
    if (token.role !== 'admin') {
      // If not an admin, redirect to the home page or an unauthorized page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (pathname.startsWith('/student')) {
    if (token.role !== 'student' && token.role !== 'admin') {
      // If not a student or admin, redirect
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};