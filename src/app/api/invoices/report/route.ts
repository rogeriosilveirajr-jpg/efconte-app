export const runtime = "edge";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { tenants: { include: { tenant: true } } }
    });

    if (!user || user.tenants.length === 0) {
      return NextResponse.json({ error: 'No tenant found' }, { status: 404 });
    }

    const tenant = user.tenants[0].tenant;

    const invoices = await prisma.invoice.findMany({
      where: { tenantId: tenant.id },
      include: { items: true },
      orderBy: { dueDate: 'desc' }
    });

    // Criar PDF
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Header
    page.drawText('EFCONTE - Assessoria Contabil', { x: 50, y: 780, size: 20, font: boldFont, color: rgb(0.85, 0.65, 0.13) }); // Goldish color
    page.drawText('Relatorio de Historico de Pagamentos e Servicos', { x: 50, y: 750, size: 14, font: font });
    
    page.drawText(`Cliente: ${tenant.name}`, { x: 50, y: 710, size: 12, font: boldFont });
    page.drawText(`CNPJ: ${tenant.cnpj}`, { x: 50, y: 695, size: 10, font: font });
    page.drawText(`Data de Emissao: ${new Date().toLocaleDateString('pt-BR')}`, { x: 50, y: 680, size: 10, font: font });

    let yOffset = 630;
    
    // Tabela Header
    page.drawText('Vencimento', { x: 50, y: yOffset, size: 11, font: boldFont });
    page.drawText('Valor', { x: 150, y: yOffset, size: 11, font: boldFont });
    page.drawText('Status', { x: 250, y: yOffset, size: 11, font: boldFont });
    page.drawText('Servicos Inclusos', { x: 350, y: yOffset, size: 11, font: boldFont });

    yOffset -= 20;

    for (const inv of invoices) {
      if (yOffset < 50) {
        page = pdfDoc.addPage([595, 842]);
        yOffset = 780;
      }
      
      const dateStr = new Date(inv.dueDate).toLocaleDateString('pt-BR');
      const amountStr = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.totalAmount);
      const statusStr = inv.status === 'Paid' ? 'Pago' : 'Pendente';
      
      const desc = inv.items.map(i => i.description).join(', ');
      // truncate desc
      const shortDesc = desc.length > 35 ? desc.substring(0, 32) + '...' : desc;

      page.drawText(dateStr, { x: 50, y: yOffset, size: 10, font: font });
      page.drawText(amountStr, { x: 150, y: yOffset, size: 10, font: font });
      
      const statusColor = inv.status === 'Paid' ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0);
      page.drawText(statusStr, { x: 250, y: yOffset, size: 10, font: boldFont, color: statusColor });
      
      page.drawText(shortDesc || 'Mensalidade Padrão', { x: 350, y: yOffset, size: 9, font: font, color: rgb(0.4, 0.4, 0.4) });

      yOffset -= 20;
    }

    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Relatorio_Pagamentos.pdf"'
      }
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao gerar relatorio' }, { status: 500 });
  }
}
