const fs = require('fs');
const file = 'src/app/dashboard/cliente/faturas/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const mockBlock = `<TableRow 
                  month="Fatura Setup / Mensalidade Inicial" 
                  date="05/08/2026" 
                  amount="R$ 349,00" 
                  status="Pago" 
                  isSetup
                />`;

const emptyBlock = `<tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-silver-dark">
                    Nenhum histórico de pagamentos encontrado.
                  </td>
                </tr>`;

content = content.replace(mockBlock, emptyBlock);
fs.writeFileSync(file, content);
