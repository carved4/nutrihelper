import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (token) {
          // Log successful authorization
          console.log('Authorized - Path:', req.nextUrl.pathname);
          return true;
        }
        
        // Log failed authorization
        console.log('Not Authorized - Path:', req.nextUrl.pathname);
        console.log('Cookies:', req.cookies.getAll());
        return false;
      },
    },
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