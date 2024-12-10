import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ 
        error: 'Name, email, and password are required' 
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword
      } as any
    });

    return NextResponse.json({ 
      message: 'User created successfully', 
      user: { id: user.id, name: user.name, email: user.email } 
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 