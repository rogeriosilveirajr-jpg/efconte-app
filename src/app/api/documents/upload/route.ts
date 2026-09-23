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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    let tenantId = formData.get('tenantId') as string;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { tenants: true }
    });

    if (!tenantId) {
      if (user && user.tenants.length > 0) {
        tenantId = user.tenants[0].tenantId;
      }
    }

    if (!file || !tenantId) {
      return NextResponse.json({ error: 'Faltam dados' }, { status: 400 });
    }

    // VERIFICAÇÃO DE SEGURANÇA CONTRA HACKERS (IDOR)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'CONTADOR') {
      const belongsToTenant = user?.tenants.some(t => t.tenantId === tenantId);
      if (!belongsToTenant) {
        return NextResponse.json({ error: 'Acesso negado. Tentativa de upload em empresa de terceiros bloqueada.' }, { status: 403 });
      }
    }

    // Convert file to Base64 for database storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    
    const docType = (formData.get('type') as string) || 'OUTROS';
    
    // Create document in database
    const doc = await prisma.document.create({
      data: {
        tenantId,
        title: file.name,
        fileData: base64Data,
        fileUrl: '', // Will update immediately below
        type: docType,
        status: docType === 'CONTRATO' ? 'PENDING' : null
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
