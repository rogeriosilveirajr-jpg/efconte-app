const fs = require('fs');
const file = 'src/app/dashboard/cliente/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const dreBlockRegex = /<h3 className="font-bold text-sm">Evolução do Faturamento \(DRE\)<\/h3>[\s\S]*?Mai<\/span><span>Jun<\/span>\s*<\/div>\s*<\/div>/g;

const replacement = `<div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm">Pendências de Documentos</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
              {documents.filter(d => d.type === 'SOLICITACAO').length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 mt-12">
                   <CheckCircle2 size={48} className="text-green-500 mb-2" />
                   <p className="text-sm font-bold">Tudo em ordem!</p>
                   <p className="text-xs mt-1">Nenhum documento pendente com a contabilidade.</p>
                </div>
              ) : (
                documents.filter(d => d.type === 'SOLICITACAO').map(doc => (
                  <div key={doc.id} className="p-4 bg-background border border-[var(--brand-gold)]/50 rounded-xl flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{doc.title}</span>
                      <span className="text-xs text-[var(--brand-silver-dark)]">Solicitado em {new Date(doc.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <label className="px-4 py-2 bg-[var(--brand-gold)] text-[var(--color-primary)] text-xs font-bold rounded-lg cursor-pointer hover:bg-[var(--brand-gold-hover)] transition-colors">
                      Enviar Arquivo
                      <input type="file" className="hidden" onChange={(e) => handleUpload(e, doc.id)} />
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>`;

content = content.replace(dreBlockRegex, replacement);
fs.writeFileSync(file, content);
