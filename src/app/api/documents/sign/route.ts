import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { documentId, signatureBase64 } = await request.json();

    if (!documentId || !signatureBase64) {
      return NextResponse.json({ error: 'Faltam dados' }, { status: 400 });
    }

    const doc = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!doc) {
      return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 });
    }

    // VERIFICAÇÃO DE SEGURANÇA CONTRA HACKERS (IDOR)
    if (session.user.role !== 'ADMIN') {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        include: { tenants: true }
      });
      
      const belongsToTenant = user?.tenants.some(t => t.tenantId === doc.tenantId);
      if (!belongsToTenant) {
        return NextResponse.json({ error: 'Acesso negado. Tentativa de assinar contrato de terceiros bloqueada.' }, { status: 403 });
      }
    }

    // Atualiza o documento no banco com a assinatura
    const updatedDoc = await prisma.document.update({
      where: { id: documentId },
      data: {
        status: 'SIGNED',
        signatureUrl: signatureBase64, // Guardando em base64 direto no banco para o MVP (super leve para assinaturas em preto/branco).
        signedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, document: updatedDoc });
  } catch (error) {
    console.error('Erro ao assinar documento:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
