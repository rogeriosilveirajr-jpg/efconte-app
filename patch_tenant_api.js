const fs = require('fs');
const file = 'src/app/api/admin/tenants/route.ts';
let content = fs.readFileSync(file, 'utf8');

const importReplacement = `import { sendClientCredentials } from '@/lib/mail';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';`;

content = content.replace(`import { sendClientCredentials } from '@/lib/mail';`, importReplacement);

const pdfLogic = `
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

      page.drawText(\`Empresa: \${name}\`, { x: 50, y: 650, size: 14, font: timesRomanFont });
      page.drawText(\`CNPJ: \${cnpj}\`, { x: 50, y: 630, size: 14, font: timesRomanFont });
      page.drawText(\`Telefone: \${phone || 'Não informado'}\`, { x: 50, y: 610, size: 14, font: timesRomanFont });

      page.drawText('--- DADOS DE LOGIN ---', { x: 50, y: 560, size: 14, font: timesRomanBoldFont });
      page.drawText(\`Acesso: https://efconte-app.pages.dev\`, { x: 50, y: 530, size: 14, font: timesRomanFont, color: rgb(0, 0, 0.8) });
      page.drawText(\`Login (Email): \${email}\`, { x: 50, y: 510, size: 14, font: timesRomanBoldFont });
      page.drawText(\`Senha Provisoria: \${randomPassword}\`, { x: 50, y: 490, size: 14, font: timesRomanBoldFont });

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
        data: { fileUrl: \`/api/documents/\${doc.id}\` }
      });
      
    } catch(e) {
      console.error("Erro ao gerar PDF:", e);
    }
`;

content = content.replace(`if (planId) {
      await prisma.subscription.create({
        data: {
          tenantId: newTenant.id,
          planId
        }
      });
    }`, pdfLogic);

fs.writeFileSync(file, content);
