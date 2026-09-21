export const runtime = "edge";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ leads });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as any;
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        status: data.status || 'NEW',
        sourceUrl: data.sourceUrl || null,
      }
    });
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status, cnpj } = await request.json() as any;
    
    const lead = await prisma.lead.update({
      where: { id },
      data: { status }
    });

    if (status === 'WON') {
      const finalCnpj = (cnpj && cnpj.trim() !== '') ? cnpj : `PENDENTE-${Date.now()}`;
      
      const newTenant = await prisma.tenant.create({
        data: {
          name: lead.name,
          cnpj: finalCnpj,
          isAnnualContract: false
        }
      });

      // Assign default plan just to have a subscription active
      const firstPlan = await prisma.plan.findFirst();
      if (firstPlan) {
        await prisma.subscription.create({
          data: {
            tenantId: newTenant.id,
            planId: firstPlan.id,
            active: true
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no CRM PUT:', error);
    return NextResponse.json({ error: 'Erro ao atualizar lead' }, { status: 500 });
  }
}
