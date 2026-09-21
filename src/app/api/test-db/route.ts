export const runtime = "edge";
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ 
      users,
      envDbUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 40) + '...' : 'missing',
      // @ts-ignore
      provider: prisma._engineConfig?.activeProvider || 'unknown'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
