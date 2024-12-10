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
  debug: true,
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
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true
            }
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            email: user.email || "",
            name: user.name || null
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === "signIn" && user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        
        try {
          const userData = await prisma.user.findUnique({
            where: { id: token.id },
            select: {
              weight: true,
              height: true,
              age: true,
              gender: true,
              activityLevel: true
            }
          });
          
          if (userData) {
            const transformedData = {
              weight: userData.weight ?? undefined,
              height: userData.height ?? undefined,
              age: userData.age ?? undefined,
              gender: userData.gender ?? undefined,
              activityLevel: userData.activityLevel?.toString() ?? undefined
            };
            session.user = {
              ...session.user,
              ...transformedData
            };
          }
        } catch (error) {
          console.error("Session error:", error);
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log('Sign in event:', { userId: user.id, isNewUser });
    },
    async session({ session, token }) {
      console.log('Session event:', { 
        userId: session?.user?.id,
        hasToken: !!token 
      });
    }
  }
});

export { handler as GET, handler as POST }; 