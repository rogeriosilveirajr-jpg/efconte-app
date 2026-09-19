import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });

    // VERIFICAÇÃO DE SEGURANÇA CONTRA HACKERS (IDOR)
    // Se não for admin/contador, só pode ver os documentos do PRÓPRIO tenant.
    if (session.user.role !== 'ADMIN') {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        include: { tenants: true }
      });
      
      const belongsToTenant = user?.tenants.some(t => t.tenantId === tenantId);
      if (!belongsToTenant) {
        return NextResponse.json({ error: 'Acesso negado. Você não tem permissão para ver os documentos desta empresa.' }, { status: 403 });
      }
    }

    const documents = await prisma.document.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ documents });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar documentos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    
    // VERIFICAÇÃO DE SEGURANÇA CONTRA HACKERS (IDOR)
    if (session.user.role !== 'ADMIN') {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        include: { tenants: true }
      });
      
      const belongsToTenant = user?.tenants.some(t => t.tenantId === data.tenantId);
      if (!belongsToTenant) {
        return NextResponse.json({ error: 'Acesso negado. Você não pode salvar documentos para esta empresa.' }, { status: 403 });
      }
    }

    const doc = await prisma.document.create({
      data: {
        tenantId: data.tenantId,
        title: data.title,
        fileUrl: data.fileUrl,
        type: data.type || 'OUTROS'
      }
    });
    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    console.error('Erro ao salvar documento:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
