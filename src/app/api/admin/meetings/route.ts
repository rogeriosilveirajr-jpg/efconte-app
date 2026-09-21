export const runtime = "edge";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const meetings = await prisma.meeting.findMany({
      include: { tenant: true },
      orderBy: { date: 'asc' }
    });
    return NextResponse.json({ meetings });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar reuniões' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status, meetingUrl } = await request.json() as any;
    await prisma.meeting.update({
      where: { id },
      data: { status, meetingUrl }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar reunião' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as any;
    const meeting = await prisma.meeting.create({
      data: {
        tenantId: data.tenantId,
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        status: data.status || 'SCHEDULED',
        meetingUrl: data.meetingUrl || null,
      }
    });
    return NextResponse.json({ success: true, meeting });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar reunião' }, { status: 500 });
  }
}
