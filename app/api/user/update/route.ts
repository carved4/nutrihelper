import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await request.json();
    
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
        weight: data.weight,
        height: data.height,
        age: data.age,
        gender: data.gender,
        activityLevel: data.activityLevel
      }
    });

    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        weight: user.weight,
        height: user.height,
        age: user.age,
        gender: user.gender,
        activityLevel: user.activityLevel
      }
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ 
      error: "Failed to update profile" 
    }, { status: 500 });
  }
} 