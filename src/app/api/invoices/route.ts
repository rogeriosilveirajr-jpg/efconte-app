import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  
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
