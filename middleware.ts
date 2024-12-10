import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.cookies.get('next-auth.session-token') || 
                 req.cookies.get('__Secure-next-auth.session-token');
                 
    console.log('Middleware Check:', {
      path: req.nextUrl.pathname,
      hasToken: !!token,
      cookies: req.cookies.getAll().map(c => c.name)
    });

    // If we have a token, allow the request
    if (token) {
      return NextResponse.next();
    }

    // If no token, redirect to sign in with the full URL as callback
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(signInUrl);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // We're handling the authorization in the middleware function
        return true;
      }
    }
  }
);

export const config = {
  matcher: [
    "/profile/:path*",
    "/food-tracker/:path*",
    "/recipe-finder/:path*",
    "/macro-tracker/:path*",
    "/bmi-calculator/:path*"
  ]
}; 