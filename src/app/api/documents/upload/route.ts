export const runtime = "edge";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileName, tenantId: rawTenantId, type: rawType, fileBase64 } = await request.json() as any;
    let tenantId = rawTenantId;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { tenants: true }
    });

    if (!tenantId) {
      if (user && user.tenants.length > 0) {
        tenantId = user.tenants[0].tenantId;
      }
    }

    if ((!fileBase64 && rawType !== 'SOLICITACAO') || !tenantId) {
      return NextResponse.json({ error: 'Faltam dados' }, { status: 400 });
    }

    // VERIFICAÇÃO DE SEGURANÇA CONTRA HACKERS (IDOR)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'CONTADOR') {
      const belongsToTenant = user?.tenants.some(t => t.tenantId === tenantId);
      if (!belongsToTenant) {
        return NextResponse.json({ error: 'Acesso negado. Tentativa de upload em empresa de terceiros bloqueada.' }, { status: 403 });
      }
    }

    const docType = rawType || 'OUTROS';
    
    // Create document in database
    const doc = await prisma.document.create({
      data: {
        tenantId,
        title: fileName || 'Documento',
        fileData: fileBase64 || null,
        fileUrl: '', // Will update immediately below
        type: docType,
        status: docType === 'CONTRATO' ? 'PENDING' : (docType === 'SOLICITACAO' ? 'PENDING' : null)
      }
    });

    // Update fileUrl to point to our new internal route
    const updatedDoc = await prisma.document.update({
      where: { id: doc.id },
      data: { fileUrl: `/api/documents/${doc.id}` }
    });

    return NextResponse.json({ success: true, document: updatedDoc });
  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
