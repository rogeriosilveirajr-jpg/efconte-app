const fs = require('fs');
const file = 'src/app/dashboard/cliente/faturas/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const whatsappButton = `<button 
              onClick={() => {
                const message = encodeURIComponent(\`Olá, gostaria de pagar a minha fatura atual em aberto no valor de R$ \${pendingInvoice?.totalAmount || '0.00'}.\`);
                window.open(\`https://wa.me/5547992187868?text=\${message}\`, '_blank');
              }}
              className="w-full py-4 mt-auto rounded-xl border border-transparent bg-[#25D366] hover:bg-[#128C7E] flex items-center justify-center gap-3 transition-colors text-white shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              <span className="font-bold text-base">Negociar Pagamento no WhatsApp</span>
            </button>`;

const newButtons = whatsappButton + `
            
            <label className="w-full py-3 mt-3 rounded-xl border border-gold text-gold hover:bg-gold/10 flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm font-bold">
              {uploadingReceipt === pendingInvoice?.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {uploadingReceipt === pendingInvoice?.id ? 'Enviando...' : 'Anexar Comprovante'}
              <input type="file" className="hidden" onChange={(e) => handleUploadReceipt(e, pendingInvoice.id)} disabled={uploadingReceipt !== null} />
            </label>`;

content = content.replace(whatsappButton, newButtons);
fs.writeFileSync(file, content);
