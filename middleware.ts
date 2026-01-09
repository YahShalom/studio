import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // If the user is on the login page
  if (pathname === '/admin/login') {
    // If they are already logged in, redirect to the admin dashboard
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return response;
  }

  // If the user is trying to access any other admin page
  if (pathname.startsWith('/admin')) {
    // If they are not logged in, redirect to the login page
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/admin/:path*',
    '/admin/login',
  ],
};
