import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  // Aqui você pode adicionar verificação de session.user.role === 'CONTADOR'
  // Mas para o MVP vamos permitir a consulta.

  const tenants = await prisma.tenant.findMany({
    where: { isDeleted: false },
    include: {
      subscription: { include: { plan: true } },
      _count: {
        select: { employees: true, partners: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ tenants });
}
