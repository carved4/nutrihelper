import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Add debug logging
        console.log('Middleware Check:', {
          path: req.nextUrl.pathname,
          hasToken: !!token,
          cookies: req.cookies.getAll().map(c => c.name)
        });
        return !!token;
      }
    },
    pages: {
      signIn: "/auth/signin"
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