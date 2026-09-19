import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
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
    if (session.user.role !== 'ADMIN') {
      const belongsToTenant = user?.tenants.some(t => t.tenantId === tenantId);
      if (!belongsToTenant) {
        return NextResponse.json({ error: 'Acesso negado. Tentativa de upload em empresa de terceiros bloqueada.' }, { status: 403 });
      }
    }

    const bucket = "efconte-app.firebasestorage.app";
    const cleanBucketName = bucket.replace('.firebasestorage.app', '.appspot.com'); 

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = encodeURIComponent(`documents/${tenantId}/${fileName}`);
    
    const url = `https://firebasestorage.googleapis.com/v0/b/efconte-app.appspot.com/o?name=${filePath}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Firebase upload failed:", errText);
      return NextResponse.json({ error: 'Erro no Firebase Storage' }, { status: 500 });
    }

    const data = await response.json();
    
    const downloadToken = data.downloadTokens;
    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/efconte-app.appspot.com/o/${filePath}?alt=media&token=${downloadToken}`;

    const docType = (formData.get('type') as string) || 'OUTROS';
    const doc = await prisma.document.create({
      data: {
        tenantId,
        title: file.name,
        fileUrl,
        type: docType,
        status: docType === 'CONTRATO' ? 'PENDING' : null
      }
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
