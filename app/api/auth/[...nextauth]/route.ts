import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          // First, get the user without password
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            throw new Error("Invalid credentials");
          }

          // Then, get the password separately
          const userWithPassword = await prisma.$queryRaw<{ password: string }[]>`
            SELECT password FROM "User" WHERE email = ${credentials.email}
          `;

          if (!userWithPassword[0]?.password) {
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            userWithPassword[0].password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 