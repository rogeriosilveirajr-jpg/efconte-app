import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { basePrice: 'asc' }
    });
    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar planos' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, basePrice } = await request.json();
    const plan = await prisma.plan.update({
      where: { id },
      data: { name, basePrice }
    });
    return NextResponse.json({ success: true, plan });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar plano' }, { status: 500 });
  }
}
