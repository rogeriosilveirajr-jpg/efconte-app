export const runtime = "edge";
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
    
    let plans = await prisma.plan.findMany();
    
    // Auto-seed plans se estiver vazio no banco (útil para D1 sem seed manual)
    if (plans.length === 0) {
      const defaultPlans = [
        { id: 'start', name: 'Start', basePrice: 199, maxEmployees: 0 },
        { id: 'gestao', name: 'Gestão', basePrice: 349, maxEmployees: 3 },
        { id: 'prime', name: 'Prime', basePrice: 549, maxEmployees: 5 },
      ];
      for (const p of defaultPlans) {
        await prisma.plan.create({ data: p });
      }
      plans = await prisma.plan.findMany();
    }

    return NextResponse.json({ tenant, plans });
  } catch (error) {
    console.error("GET Tenant error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;

  try {
    const { planId } = await request.json() as any;
    
    // Avoid prisma.subscription.upsert to prevent potential D1 WASM panics
    const existing = await prisma.subscription.findUnique({
      where: { tenantId: id }
    });

    if (existing) {
      await prisma.subscription.update({
        where: { tenantId: id },
        data: { planId }
      });
    } else {
      await prisma.subscription.create({
        data: { tenantId: id, planId }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT Error:", error.message, error.stack);
    return NextResponse.json({ error: 'Erro ao alterar plano', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;

  try {
    const { action, description, amount } = await request.json() as any;
    if (action === 'ADD_INVOICE_ITEM') {
      await addInvoiceItem(id, description, parseFloat(amount));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error("POST Error:", error.message, error.stack);
    return NextResponse.json({ error: 'Erro ao processar', details: error.message }, { status: 500 });
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
