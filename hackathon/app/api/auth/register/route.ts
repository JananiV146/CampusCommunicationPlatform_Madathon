import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/userData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, department, year, userType } = body;

    if (!email || !password || !department || !year || !userType) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const user = createUser({
      email,
      password,
      department,
      year,
      userType,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
