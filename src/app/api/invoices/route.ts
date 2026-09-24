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

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoiceId, receiptUrl } = await request.json() as any;

    if (!invoiceId || !receiptUrl) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const updated = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { 
        receiptUrl,
        status: 'Paid' // Automatically marking as Paid, or accountant can review later
      }
    });

    return NextResponse.json({ success: true, invoice: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
