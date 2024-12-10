import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          throw new Error("Missing credentials");
        }

        try {
          console.log("Finding user:", credentials.email);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              name: true,
              email: true
            }
          });

          if (!user) {
            console.log("No user found");
            throw new Error("Invalid credentials");
          }

          const [userPassword] = await prisma.$queryRaw<{ password: string }[]>`
            SELECT password FROM "User" WHERE email = ${credentials.email}
          `;

          if (!userPassword?.password) {
            console.log("No password found");
            throw new Error("Invalid credentials");
          }

          console.log("Comparing passwords");
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            userPassword.password
          );
          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("Invalid password");
            throw new Error("Invalid credentials");
          }

          console.log("Auth successful");
          return {
            id: user.id,
            name: user.name,
            email: user.email
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        try {
          session.user.id = token.sub!;
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
            select: {
              id: true,
              name: true,
              email: true,
              weight: true,
              height: true,
              age: true,
              gender: true,
              activityLevel: true
            }
          });
          
          if (user) {
            session.user = {
              ...session.user,
              ...user
            };
          }
        } catch (error) {
          console.error("Session error:", error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
});

export { handler as GET, handler as POST }; 