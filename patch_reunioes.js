const fs = require('fs');
const file = 'src/app/dashboard/contador/reunioes/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldLogic = `const setMeetingLink = (id: string, currentUrl: string, tenantName?: string, tenantPhone?: string, meetingTitle?: string, meetingDate?: string) => {
    const url = prompt('Cole o link do Google Meet / Zoom para esta reunião:', currentUrl || '');
    if (url !== null) {
      updateMeeting(id, { meetingUrl: url });
      
      if (tenantPhone && url) {
        // Envia mensagem pelo WhatsApp automaticamente
        const dateStr = new Date(meetingDate || '').toLocaleDateString('pt-BR');
        const timeStr = new Date(meetingDate || '').toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
        
        const msg = \`Olá! A sua reunião de consultoria contábil ("\${meetingTitle}") agendada para \${dateStr} às \${timeStr} foi confirmada pelo seu contador. \\n\\nAcesse no link: \${url}\`;
        
        // Remove caracteres não numéricos do telefone
        let phoneNum = tenantPhone.replace(/\\D/g, '');
        if (phoneNum && phoneNum.length >= 10) {
          if (!phoneNum.startsWith('55')) phoneNum = '55' + phoneNum;
          window.open(\`https://wa.me/\${phoneNum}?text=\${encodeURIComponent(msg)}\`, '_blank');
        } else {
          toast.success('Link salvo com sucesso, mas o cliente não tem um telefone válido cadastrado para envio do WhatsApp.');
        }
      }
    }
  };`;

const newLogic = `const setMeetingLink = (id: string, currentUrl: string, tenantName?: string, tenantPhone?: string, meetingTitle?: string, meetingDate?: string, description?: string) => {
    const isWhatsappCall = description && description.toLowerCase().includes('whatsapp');
    let url = currentUrl;
    
    if (isWhatsappCall) {
      url = 'Ligação via WhatsApp';
      updateMeeting(id, { meetingUrl: url });
    } else {
      url = prompt('Cole o link do Google Meet / Zoom para esta reunião:', currentUrl || '') || '';
      if (!url) return;
      updateMeeting(id, { meetingUrl: url });
    }
      
    if (tenantPhone && url) {
      // Envia mensagem pelo WhatsApp automaticamente
      const dateStr = new Date(meetingDate || '').toLocaleDateString('pt-BR');
      const timeStr = new Date(meetingDate || '').toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
      
      let msg = \`Olá! A sua reunião de consultoria contábil ("\${meetingTitle}") agendada para \${dateStr} às \${timeStr} foi confirmada pelo seu contador. \\n\\nAcesse no link: \${url}\`;
      if (isWhatsappCall) {
        msg = \`Olá! A sua ligação de consultoria via WhatsApp agendada para \${dateStr} às \${timeStr} foi confirmada. O contador te chamará por aqui no horário marcado.\`;
      }

      // Remove caracteres não numéricos do telefone
      let phoneNum = tenantPhone.replace(/\\D/g, '');
      if (phoneNum && phoneNum.length >= 10) {
        if (!phoneNum.startsWith('55')) phoneNum = '55' + phoneNum;
        window.open(\`https://wa.me/\${phoneNum}?text=\${encodeURIComponent(msg)}\`, '_blank');
      } else {
        toast.success(isWhatsappCall ? 'Confirmado com sucesso! Sem telefone válido para aviso via WhatsApp.' : 'Link salvo com sucesso! Sem telefone válido para envio do WhatsApp.');
      }
    } else if (isWhatsappCall) {
      toast.success('Ligação via WhatsApp confirmada!');
    }
  };`;

content = content.replace(oldLogic, newLogic);

// We also need to find where setMeetingLink is called and pass description
content = content.replace(/setMeetingLink\(m\.id, m\.meetingUrl \|\| '', m\.tenant\.name, m\.tenant\.phone, m\.title, m\.date\)/g, "setMeetingLink(m.id, m.meetingUrl || '', m.tenant.name, m.tenant.phone, m.title, m.date, m.description)");

fs.writeFileSync(file, content);
