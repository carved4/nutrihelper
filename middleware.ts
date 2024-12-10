import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Debug logging
      console.log('Auth Check - URL:', req.url);
      console.log('Auth Check - Token exists:', !!token);
      console.log('Auth Check - Token:', token);
      
      return !!token;
    }
  },
  pages: {
    signIn: "/auth/signin",
  }
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/food-tracker/:path*",
    "/recipe-finder/:path*",
    "/macro-tracker/:path*",
    "/bmi-calculator/:path*"
  ]
}; 