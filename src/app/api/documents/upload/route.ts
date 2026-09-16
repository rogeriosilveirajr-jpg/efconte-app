import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tenantId = formData.get('tenantId') as string;

    if (!file || !tenantId) {
      return NextResponse.json({ error: 'Faltam dados' }, { status: 400 });
    }

    const bucket = "efconte-app.firebasestorage.app"; // ou appspot.com se for o padrão
    const cleanBucketName = bucket.replace('.firebasestorage.app', '.appspot.com'); 
    // O storage do Firebase costuma ser projectId.appspot.com

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = encodeURIComponent(`documents/${tenantId}/${fileName}`);
    
    // Upload via REST API (evita problemas de CORS no cliente e não precisa do SDK admin)
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
    
    // Constrói a URL pública baseada na resposta (usando o downloadTokens se houver, ou URL padrão)
    const downloadToken = data.downloadTokens;
    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/efconte-app.appspot.com/o/${filePath}?alt=media&token=${downloadToken}`;

    const doc = await prisma.document.create({
      data: {
        tenantId,
        title: file.name,
        fileUrl,
        type: 'OUTROS'
      }
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
