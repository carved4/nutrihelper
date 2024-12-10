import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Enhanced logging
    console.log("\n=== Middleware Execution Start ===");
    console.log("Request URL:", req.url);
    console.log("Request Method:", req.method);
    console.log("Request Path:", req.nextUrl.pathname);
    
    const sessionToken = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token');
    console.log("Session Cookie Present:", !!sessionToken);
    
    if (!req.nextauth?.token) {
      console.log("No NextAuth token found - Redirecting to signin");
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    console.log("NextAuth token found - Proceeding with request");
    console.log("=== Middleware Execution End ===\n");
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        console.log("\n=== Authorization Check ===");
        console.log("Path:", req.nextUrl.pathname);
        console.log("Token Present:", !!token);
        
        if (!token) {
          console.log("Authorization failed: No token");
          return false;
        }

        // Log token expiry if available
        if (token.exp) {
          console.log("Token Expiry:", new Date((token.exp as number) * 1000).toISOString());
          console.log("Current Time:", new Date().toISOString());
        }

        console.log("Authorization successful");
        console.log("=== Authorization Check End ===\n");
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