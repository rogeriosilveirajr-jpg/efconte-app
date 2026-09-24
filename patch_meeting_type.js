const fs = require('fs');
const file = 'src/app/dashboard/cliente/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('const [meetingScheduled, setMeetingScheduled] = useState(false);',
\`const [meetingScheduled, setMeetingScheduled] = useState(false);
  const [meetingType, setMeetingType] = useState("meet");\`);

content = content.replace(/body: JSON\.stringify\(\{\\n\\s*type: 'REUNIAO',\\n\\s*title: 'Nova Reunião Agendada',\\n\\s*message: \\\`O cliente solicitou uma reunião para \${selectedDate} às \${selectedTime}\\\`,/,
\`body: JSON.stringify({
        type: 'REUNIAO',
        title: meetingType === 'whatsapp' ? 'Nova Ligação Agendada (WhatsApp)' : 'Nova Reunião Agendada (Google Meet)',
        message: \`O cliente solicitou uma \${meetingType === 'whatsapp' ? 'ligação via WhatsApp' : 'videochamada'} para \${selectedDate} às \${selectedTime}\`,\`);

const timeBlock = `<div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-[var(--brand-silver-dark)]">Horários Livres do Contador</label>`;

const meetingTypeBlock = `<div className="flex flex-col gap-2 mb-2">
                    <label className="text-xs font-bold uppercase text-[var(--brand-silver-dark)]">Formato da Reunião</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setMeetingType('meet')}
                        className={\`py-3 px-4 rounded-xl text-sm font-bold border transition-all flex flex-col items-center gap-2 \${meetingType === 'meet' ? 'bg-gold text-onyx border-gold' : 'bg-transparent border-onyx/20 text-silver-dark hover:border-gold/50'}\`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
                        Google Meet
                      </button>
                      <button 
                        onClick={() => setMeetingType('whatsapp')}
                        className={\`py-3 px-4 rounded-xl text-sm font-bold border transition-all flex flex-col items-center gap-2 \${meetingType === 'whatsapp' ? 'bg-[#25D366] text-white border-[#25D366]' : 'bg-transparent border-onyx/20 text-silver-dark hover:border-[#25D366]/50'}\`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        Ligação via WhatsApp
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-[var(--brand-silver-dark)]">Horários Livres do Contador</label>`;

content = content.replace(timeBlock, meetingTypeBlock);

const meetingScheduledText = `<p className="text-sm text-[var(--brand-silver-dark)]">O contador foi notificado e o link do Google Meet será enviado para o seu e-mail.</p>`;
const meetingScheduledTextNew = `<p className="text-sm text-[var(--brand-silver-dark)]">O contador foi notificado e entrará em contato {meetingType === 'whatsapp' ? 'pelo WhatsApp' : 'com o link do Google Meet no seu e-mail'} no horário marcado.</p>`;
content = content.replace(meetingScheduledText, meetingScheduledTextNew);

fs.writeFileSync(file, content);
