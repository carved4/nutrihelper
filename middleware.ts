import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.cookies.get('next-auth.session-token') || 
                 req.cookies.get('__Secure-next-auth.session-token');

    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Always check token existence
        return !!token;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/auth/signin",
    },
  }
);

// Update matcher to include base paths without wildcards
export const config = {
  matcher: [
    "/profile",
    "/profile/:path*",
    "/food-tracker",
    "/food-tracker/:path*",
    "/recipe-finder",
    "/recipe-finder/:path*",
    "/macro-tracker",
    "/macro-tracker/:path*",
    "/bmi-calculator",
    "/bmi-calculator/:path*"
  ]
}; 