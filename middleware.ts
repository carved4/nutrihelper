import { withAuth } from "next-auth/middleware";

export default withAuth({
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