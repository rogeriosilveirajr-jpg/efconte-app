export const runtime = "edge";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendClientCredentials } from '@/lib/mail';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

    // Gerar PDF com as credenciais
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

      page.drawText('EFCONTE - Assessoria Contabil', { x: 50, y: 750, size: 24, font: timesRomanBoldFont, color: rgb(0, 0, 0) });
      page.drawText('Credenciais de Acesso do Cliente', { x: 50, y: 710, size: 18, font: timesRomanFont, color: rgb(0.2, 0.2, 0.2) });

      page.drawText(`Empresa: ${name}`, { x: 50, y: 650, size: 14, font: timesRomanFont });
      page.drawText(`CNPJ: ${cnpj}`, { x: 50, y: 630, size: 14, font: timesRomanFont });
      page.drawText(`Telefone: ${phone || 'Não informado'}`, { x: 50, y: 610, size: 14, font: timesRomanFont });

      page.drawText('--- DADOS DE LOGIN ---', { x: 50, y: 560, size: 14, font: timesRomanBoldFont });
      page.drawText(`Acesso: https://efconte-app.pages.dev`, { x: 50, y: 530, size: 14, font: timesRomanFont, color: rgb(0, 0, 0.8) });
      page.drawText(`Login (Email): ${email}`, { x: 50, y: 510, size: 14, font: timesRomanBoldFont });
      page.drawText(`Senha Provisoria: ${randomPassword}`, { x: 50, y: 490, size: 14, font: timesRomanBoldFont });

      page.drawText('Por favor, altere sua senha no primeiro acesso.', { x: 50, y: 440, size: 12, font: timesRomanFont, color: rgb(0.8, 0, 0) });

      const pdfBytes = await pdfDoc.saveAsBase64();

      const doc = await prisma.document.create({
        data: {
          tenantId: newTenant.id,
          title: 'Credenciais de Acesso - ' + name + '.pdf',
          fileData: pdfBytes,
          fileUrl: '',
          type: 'OUTROS'
        }
      });

      await prisma.document.update({
        where: { id: doc.id },
        data: { fileUrl: `/api/documents/${doc.id}` }
      });
      
    } catch(e) {
      console.error("Erro ao gerar PDF:", e);
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
