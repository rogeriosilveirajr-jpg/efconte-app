export const dynamic = "force-dynamic";
export const runtime = "edge";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
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
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, message, metadata } = await request.json() as any;

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

  if (type === 'REUNIAO' && metadata?.date && metadata?.time) {
    const dateStr = `${metadata.date}T${metadata.time}:00`;
    await prisma.meeting.create({
      data: {
        tenantId,
        title: "Reunião Estratégica (Solicitada pelo Cliente)",
        description: message,
        date: new Date(dateStr),
        status: "SCHEDULED"
      }
    });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const { id } = await request.json() as any;

  await prisma.notification.update({
    where: { id },
    data: { isCompleted: true }
  });

  return NextResponse.json({ success: true });
}
