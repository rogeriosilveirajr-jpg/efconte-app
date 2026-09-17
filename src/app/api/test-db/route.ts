import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const user = await prisma.user.findUnique({ where: { email: 'contador@efconte.com' } });
    if (!user) {
      return NextResponse.json({ status: "User not found in DB" });
    }
    const isValid = await bcrypt.compare('123456', user.passwordHash);
    return NextResponse.json({ 
      status: "User found", 
      email: user.email, 
      role: user.role,
      passwordMatch: isValid,
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nextAuthUrl: process.env.NEXTAUTH_URL
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, name: error.name }, { status: 500 });
  }
}
