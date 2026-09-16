import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  // Para fins do MVP, retornaremos todas as notificações pendentes (visão contador)
  const notifications = await prisma.notification.findMany({
    where: { isCompleted: false },
    include: { tenant: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ notifications });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, message, metadata } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    include: { tenants: true }
  });

  if (!user || user.tenants.length === 0) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });
  }

  const tenantId = user.tenants[0].tenantId;

  await prisma.notification.create({
    data: {
      tenantId,
      type,
      message,
      metadata: metadata ? JSON.stringify(metadata) : null
    }
  });

  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const { id } = await request.json();

  await prisma.notification.update({
    where: { id },
    data: { isCompleted: true }
  });

  return NextResponse.json({ success: true });
}
