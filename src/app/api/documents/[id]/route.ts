export const runtime = "edge";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const resolvedParams = await params;

    const doc = await prisma.document.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!doc) {
      return new NextResponse('Not found', { status: 404 });
    }

    // IDOR protection
    if (session.user.role !== 'ADMIN' && session.user.role !== 'CONTADOR') {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        include: { tenants: true }
      });
      const belongsToTenant = user?.tenants.some(t => t.tenantId === doc.tenantId);
      if (!belongsToTenant) {
        return new NextResponse('Access denied', { status: 403 });
      }
    }

    if (!doc.fileData) {
      if (doc.fileUrl && doc.fileUrl.startsWith('http')) {
        return NextResponse.redirect(doc.fileUrl);
      }
      return new NextResponse('No file data', { status: 404 });
    }

    const buffer = Buffer.from(doc.fileData, 'base64');
    const binaryString = atob(doc.fileData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    return new NextResponse(bytes, {
      headers: {
        'Content-Type': 'application/pdf', 
        'Content-Disposition': `inline; filename="${doc.title}"`
      }
    });
  } catch (e) {
    console.error(e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const resolvedParams = await params;
    
    // Deletar do banco
    await prisma.document.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
