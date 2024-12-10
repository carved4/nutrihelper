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

          if (!user?.email) {
            throw new Error("Invalid credentials");
          }

          console.log("Auth successful");
          return {
            id: user.id,
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - Token:", token);
      if (session.user) {
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
              ...userData,
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
          console.log("Session data:", session);
        } catch (error) {
          console.error("Session error:", error);
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
});

export { handler as GET, handler as POST }; 