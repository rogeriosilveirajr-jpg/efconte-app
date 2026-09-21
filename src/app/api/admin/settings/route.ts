export const runtime = "edge";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const settings = await prisma.setting.findMany();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const { settings } = await request.json(); // Array of { key, value }
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value.toString() },
      create: { key: s.key, value: s.value.toString() }
    });
  }
  return NextResponse.json({ success: true });
}
