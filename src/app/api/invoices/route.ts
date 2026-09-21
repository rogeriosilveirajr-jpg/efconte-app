export const runtime = "edge";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    include: { tenants: true }
  });

  if (!user || user.tenants.length === 0) {
    return NextResponse.json({ invoices: [] });
  }

  const tenantId = user.tenants[0].tenantId;

  const invoices = await prisma.invoice.findMany({
    where: { tenantId },
    include: { items: true },
    orderBy: { dueDate: 'desc' }
  });

  return NextResponse.json({ invoices });
}
