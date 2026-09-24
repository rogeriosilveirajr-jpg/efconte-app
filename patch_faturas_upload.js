const fs = require('fs');
const file = 'src/app/dashboard/cliente/faturas/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const uploadFn = `
  const [uploadingReceipt, setUploadingReceipt] = useState<string | null>(null);

  const handleUploadReceipt = (e: React.ChangeEvent<HTMLInputElement>, invoiceId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        setUploadingReceipt(invoiceId);
        try {
          const profileRes = await fetch('/api/profile');
          const profileData = await profileRes.json();
          const tenantId = profileData.user?.tenants?.[0]?.tenantId;
          
          if (!tenantId) throw new Error("Tenant não encontrado");

          const resDoc = await fetch('/api/documents/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: 'Comprovante - ' + file.name,
              fileBase64: reader.result?.toString(),
              tenantId,
              type: 'OUTROS'
            })
          });

          if (!resDoc.ok) throw new Error("Erro ao fazer upload do documento");
          const docData = await resDoc.json();

          const resInv = await fetch('/api/invoices', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              invoiceId,
              receiptUrl: docData.document.fileUrl
            })
          });

          if (resInv.ok) {
            alert('Comprovante enviado com sucesso!');
            window.location.reload();
          } else {
            alert('Erro ao vincular comprovante.');
          }
        } catch (err) {
          console.error(err);
          alert('Erro durante o envio.');
        } finally {
          setUploadingReceipt(null);
        }
      };
    }
  };
`;

content = content.replace('const pendingInvoice = invoices.find(inv => inv.status === \'Pending\');', uploadFn + '\n  const pendingInvoice = invoices.find(inv => inv.status === \'Pending\');');

fs.writeFileSync(file, content);
