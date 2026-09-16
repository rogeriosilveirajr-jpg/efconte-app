import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { addInvoiceItem } from '@/lib/invoice';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        subscription: { include: { plan: true } },
        employees: { where: { isDeleted: false } },
        partners: { where: { isDeleted: false } },
        invoices: { include: { items: true }, orderBy: { dueDate: 'desc' } },
        notifications: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });

    if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    
    const plans = await prisma.plan.findMany();
    return NextResponse.json({ tenant, plans });
  } catch (error) {
    console.error("GET Tenant error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  const { planId } = await request.json();

  try {
    await prisma.subscription.update({
      where: { tenantId: id },
      data: { planId }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao alterar plano' }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  const { action, description, amount } = await request.json();

  try {
    if (action === 'ADD_INVOICE_ITEM') {
      await addInvoiceItem(id, description, parseFloat(amount));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 500 });
  }
}
