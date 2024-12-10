import { withAuth } from "next-auth/middleware";

// Use the simpler withAuth configuration as it handles session better
export default withAuth({
  pages: {
    signIn: "/auth/signin"
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