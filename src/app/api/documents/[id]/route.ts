import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
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
    if (session.user.role !== 'ADMIN') {
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
    
    return new NextResponse(buffer, {
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
