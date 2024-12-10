import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("Middleware - Full Request URL:", req.url);
    console.log("Middleware - Request Headers:", {
      cookie: req.headers.get("cookie"),
      authorization: req.headers.get("authorization"),
    });
    console.log("Middleware - Session Token:", req.nextauth?.token);

    if (!req.nextauth?.token) {
      console.log("Middleware - No session token found");
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        console.log("Middleware - Authorization Check Details:", {
          path: req.nextUrl.pathname,
          hasToken: !!token,
          tokenData: token,
        });

        if (!token) {
          console.log("Middleware - Authorization failed: No token");
          return false;
        }

        return true;
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