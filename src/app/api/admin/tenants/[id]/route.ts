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
        documents: { orderBy: { createdAt: 'desc' } },
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
    await prisma.subscription.upsert({
      where: { tenantId: id },
      update: { planId },
      create: { tenantId: id, planId }
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

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;

  try {
    await prisma.tenant.update({
      where: { id },
      data: { isDeleted: true }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao excluir cliente' }, { status: 500 });
  }
}
