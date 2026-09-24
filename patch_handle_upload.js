const fs = require('fs');
const file = 'src/app/dashboard/cliente/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const uploadFn = `
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString();
        setLoading(true);
        try {
          // 1. Faz o upload e cria um documento tipo OUTROS para o contador ver
          const tenantId = profile.tenants[0].tenantId;
          const res = await fetch('/api/documents/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileBase64: base64,
              tenantId,
              type: 'OUTROS' // documento real
            })
          });

          if (res.ok) {
            // 2. Avisa que a pendência foi concluída marcando-a como 'COMPLETED'
            // Pra facilitar no MVP, vamos chamar a api genérica de documents PUT, se existir, senão só exclui a solicitação original...
            // Pra evitar criar uma API nova agora, vamos só excluir o documento de solicitacao
            await fetch('/api/documents/' + docId, { method: 'DELETE' });
            
            alert('Documento enviado com sucesso!');
            window.location.reload();
          } else {
            alert('Erro ao enviar documento');
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
    }
  };
`;

content = content.replace('const tenantData = profile?.tenants?.[0]?.tenant;', uploadFn + '\n  const tenantData = profile?.tenants?.[0]?.tenant;');
fs.writeFileSync(file, content);
