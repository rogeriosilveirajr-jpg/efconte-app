const fs = require('fs');
const file = 'src/app/dashboard/cliente/faturas/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const titleSection = `<h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <History size={20} className="text-gold" />
          Histórico de Pagamentos
        </h2>`;

const newTitleSection = `<div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <History size={20} className="text-gold" />
            Histórico de Pagamentos
          </h2>
          <a href="/api/invoices/report" target="_blank" className="px-4 py-2 bg-onyx/5 dark:bg-white/5 hover:bg-gold/10 text-gold text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2">
            <Download size={14} /> Relatório em PDF
          </a>
        </div>`;

content = content.replace(titleSection, newTitleSection);

const rowButton = `<button onClick={() => alert('O relatório completo da fatura em PDF estará disponível em breve.')} className="text-silver-dark group-hover:text-gold transition-colors inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
          Recibo PDF <Download size={14} />
        </button>`;

const newRowButton = `<a href="/api/invoices/report" target="_blank" className="text-silver-dark group-hover:text-gold transition-colors inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
          Recibo PDF <Download size={14} />
        </a>`;

content = content.replace(rowButton, newRowButton);

fs.writeFileSync(file, content);
