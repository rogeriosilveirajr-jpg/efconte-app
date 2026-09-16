import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });

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
    const data = await request.json();
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
