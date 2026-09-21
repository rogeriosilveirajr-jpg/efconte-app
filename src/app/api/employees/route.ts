export const runtime = "edge";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Find user's tenants
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    include: {
      tenants: {
        include: {
          tenant: true
        }
      }
    }
  });

  if (!user || user.tenants.length === 0) {
    return NextResponse.json({ employees: [] });
  }

  // Get the first tenant (assuming 1 tenant per customer for now)
  const tenantId = user.tenants[0].tenantId;

  const employees = await prisma.employee.findMany({
    where: {
      tenantId: tenantId,
      isDeleted: false
    }
  });

  return NextResponse.json({ employees });
}

import { addInvoiceItem } from '@/lib/invoice';

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, role } = await request.json() as any;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    include: {
      tenants: true
    }
  });

  if (!user || user.tenants.length === 0) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });
  }

  const tenantId = user.tenants[0].tenantId;

  const employee = await prisma.employee.create({
    data: {
      name,
      tenantId
    }
  });

  // Faturar serviço avulso de admissão (R$ 100)
  await addInvoiceItem(tenantId, `Admissão: ${name}`, 100.0);

  // Criar notificação para o contador
  await prisma.notification.create({
    data: {
      tenantId,
      type: 'ADMISSAO',
      message: `Cliente solicitou admissão de ${name}.`,
      metadata: JSON.stringify({ employeeId: employee.id, role })
    }
  });

  return NextResponse.json({ employee });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json() as any;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    include: { tenants: true }
  });

  if (!user || user.tenants.length === 0) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });
  }

  const tenantId = user.tenants[0].tenantId;

  // Find employee to get name
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee || employee.tenantId !== tenantId) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  // Soft delete employee
  await prisma.employee.update({
    where: { id },
    data: { isDeleted: true }
  });

  // Faturar serviço avulso de rescisão (R$ 150)
  await addInvoiceItem(tenantId, `Rescisão: ${employee.name}`, 150.0);

  // Criar notificação para o contador
  await prisma.notification.create({
    data: {
      tenantId,
      type: 'DEMISSAO',
      message: `Cliente solicitou o desligamento de ${employee.name}.`,
      metadata: JSON.stringify({ employeeId: id })
    }
  });

  return NextResponse.json({ success: true });
}
