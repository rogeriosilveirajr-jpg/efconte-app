import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    const updated = await prisma.user.update({
      where: { email: session.user.email as string },
      data: { name }
    });

    return NextResponse.json({ success: true, user: { name: updated.name } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: {
        tenants: {
          include: {
            tenant: {
              include: {
                subscription: {
                  include: { plan: true }
                },
                _count: {
                  select: { employees: true, partners: true }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar perfil' }, { status: 500 });
  }
}
