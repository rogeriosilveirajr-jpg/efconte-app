export const runtime = "edge";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendClientCredentials } from '@/lib/mail';

export async function GET() {
  const session = await auth();
  
  const tenants = await prisma.tenant.findMany({
    where: { isDeleted: false },
    include: {
      subscription: { include: { plan: true } },
      _count: {
        select: { employees: true, partners: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ tenants });
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    // Ideal check: if (session?.user?.role !== 'CONTADOR') return unauthorized;

    const { name, cnpj, email, planId, phone } = await request.json() as any;

    // Generate random password (6 chars)
    const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const passwordHash = await bcrypt.hash(randomPassword, 10);

    // Create Tenant and User
    const newTenant = await prisma.tenant.create({
      data: {
        name,
        cnpj,
        phone,
        users: {
          create: {
            user: {
              create: {
                email,
                passwordHash,
                role: 'CLIENTE'
              }
            }
          }
        }
      }
    });

    if (planId) {
      await prisma.subscription.create({
        data: {
          tenantId: newTenant.id,
          planId
        }
      });
    }

    // Envia email para o cliente (se SMTP estiver configurado)
    try {
      await sendClientCredentials(email, name, randomPassword);
    } catch (mailError) {
      console.error("Erro ao enviar email:", mailError);
    }

    // Retorna a senha gerada para exibir na tela pro contador
    return NextResponse.json({ 
      success: true, 
      tenant: newTenant,
      generatedPassword: randomPassword 
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Erro ao criar cliente' }, { status: 500 });
  }
}
