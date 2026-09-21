export const runtime = "edge";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { active: true },
      include: { plan: true, tenant: true }
    });

    const mrr = subscriptions.reduce((acc: number, sub: any) => acc + sub.plan.basePrice, 0);

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const invoices = await prisma.invoice.findMany({
      include: { tenant: true },
      orderBy: { dueDate: 'desc' }
    });

    // Receita Avulsa do mês atual
    // Vamos considerar que todos os valores além do plano base nas faturas deste mês são avulsos.
    // Como simplificação para o MVP, vamos somar tudo o que foi gerado como "Pendente" ou "Pago" extra neste mês.
    let avulsoMes = 0;
    
    // Inadimplencia (Vencidas e Pendentes)
    const inadimplencia = invoices
      .filter((i: any) => i.status === 'Pending' && new Date(i.dueDate) < new Date())
      .reduce((acc: number, inv: any) => acc + inv.totalAmount, 0);

    // Mocks / Simplificações para visualização imediata do MRR / Avulso:
    // Na nossa lógica atual, as faturas possuem "totalAmount" e não desmembramos aqui perfeitamente os "invoiceItems".
    // Vamos usar o total de faturas "Pagas" ou "Pendentes" geradas para este mês como receita total, menos o MRR = avulso.

    return NextResponse.json({
      mrr,
      avulsoMes: 0, // calculado a partir de invoices no futuro
      inadimplencia,
      invoices
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar faturamento' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    await prisma.invoice.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar fatura' }, { status: 500 });
  }
}
