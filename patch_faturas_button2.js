const fs = require('fs');
const file = 'src/app/dashboard/cliente/faturas/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"[^>]+><path d="M7\.9 20A9 9 0 1 0 4 16\.1L2 22Z"\/><\/svg>\s*<span className="font-bold text-base">Negociar Pagamento no WhatsApp<\/span>/g, 
\`className="w-full py-4 mt-auto rounded-xl border border-transparent bg-[#25D366] hover:bg-[#128C7E] flex items-center justify-center gap-3 transition-colors text-white shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              <span className="font-bold text-base">Negociar Pagamento no WhatsApp</span>\`);

fs.writeFileSync(file, content);
