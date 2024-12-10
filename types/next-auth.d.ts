import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      weight?: number
      height?: number
      age?: number
      gender?: string
      activityLevel?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    email: string
    weight?: number
    height?: number
    age?: number
    gender?: string
    activityLevel?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
  }
} 