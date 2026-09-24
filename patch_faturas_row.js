const fs = require('fs');
const file = 'src/app/dashboard/cliente/faturas/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const tableRowCall = `<TableRow 
                    key={inv.id}
                    month={\`Fatura #\${inv.id.substring(0,6)}\`} 
                    date={formatDate(inv.dueDate)} 
                    amount={formatMoney(inv.totalAmount)} 
                    status="Pago" 
                    hasExtra={inv.items.length > 1}
                  />`;

const newTableRowCall = `<TableRow 
                    key={inv.id}
                    month={\`Fatura #\${inv.id.substring(0,6)}\`} 
                    date={formatDate(inv.dueDate)} 
                    amount={formatMoney(inv.totalAmount)} 
                    status="Pago" 
                    hasExtra={inv.items.length > 1}
                    receiptUrl={inv.receiptUrl}
                    invoiceId={inv.id}
                    onUploadReceipt={handleUploadReceipt}
                    uploadingReceipt={uploadingReceipt}
                  />`;

content = content.replace(tableRowCall, newTableRowCall);

const tableRowDef = `function TableRow({ month, date, amount, status, hasExtra = false, isSetup = false }: any) {`;
const newTableRowDef = `function TableRow({ month, date, amount, status, hasExtra = false, isSetup = false, receiptUrl, invoiceId, onUploadReceipt, uploadingReceipt }: any) {`;
content = content.replace(tableRowDef, newTableRowDef);

const tdRight = `<td className="px-6 py-4 text-right">
        <button className="text-silver-dark group-hover:text-gold transition-colors inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
          PDF <ArrowRight size={14} />
        </button>
      </td>`;

const newTdRight = `<td className="px-6 py-4 text-right flex gap-3 justify-end items-center">
        {!receiptUrl && onUploadReceipt && invoiceId ? (
          <label className="text-gold group-hover:text-gold-hover transition-colors inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider cursor-pointer">
            {uploadingReceipt === invoiceId ? 'Enviando...' : 'Anexar Comprovante'}
            <input type="file" className="hidden" onChange={(e) => onUploadReceipt(e, invoiceId)} disabled={uploadingReceipt === invoiceId} />
          </label>
        ) : receiptUrl ? (
          <a href={receiptUrl} target="_blank" className="text-green-500 hover:text-green-600 transition-colors inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
            Comprovante <ArrowRight size={14} />
          </a>
        ) : null}
        
        <button onClick={() => alert('O relatório completo da fatura em PDF estará disponível em breve.')} className="text-silver-dark group-hover:text-gold transition-colors inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
          Recibo PDF <Download size={14} />
        </button>
      </td>`;

content = content.replace(tdRight, newTdRight);

fs.writeFileSync(file, content);
