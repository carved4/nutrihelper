import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Debug session state
    const sessionToken = req.cookies.get('next-auth.session-token');
    const secureSessionToken = req.cookies.get('__Secure-next-auth.session-token');
    
    console.log('Middleware Debug:', {
      url: req.url,
      hasSessionToken: !!sessionToken,
      hasSecureSessionToken: !!secureSessionToken,
      nextAuthToken: !!req.nextauth?.token,
      cookies: req.cookies.getAll().map(c => c.name)
    });

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Accept the token if it exists
        return !!token;
      }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/auth/signin",
    },
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