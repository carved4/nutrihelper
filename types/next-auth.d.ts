import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: Date | null;
    image?: string | null;
    password?: string | null;
    weight?: number | null;
    height?: number | null;
    age?: number | null;
    gender?: string | null;
    activityLevel?: number | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      weight?: number | null;
      height?: number | null;
      age?: number | null;
      gender?: string | null;
      activityLevel?: number | null;
    };
  }
} 