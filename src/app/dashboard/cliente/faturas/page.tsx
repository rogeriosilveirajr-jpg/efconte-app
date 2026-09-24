"use client";

import { useState, useEffect } from 'react';
import { CreditCard, QrCode, Download, CheckCircle2, History, AlertCircle, Receipt, ArrowRight, Loader2 } from "lucide-react";

export default function FaturasPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/invoices')
      .then(res => res.json())
      .then(data => {
        setInvoices(data.invoices || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  
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

  const pendingInvoice = invoices.find(inv => inv.status === 'Pending');
  const pastInvoices = invoices.filter(inv => inv.status === 'Paid');

  // Format currency
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gold/10 rounded-xl text-gold">
            <CreditCard size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Faturamento</h1>
            <p className="text-silver-dark text-sm">
              Gestão da sua assinatura, serviços avulsos e histórico de pagamentos.
            </p>
          </div>
        </div>
      </section>

      {/* Fatura Aberta / Próxima Fatura */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Detalhamento da Fatura */}
        <div className="lg:col-span-2 glass-panel border border-onyx/30 dark:border-white/15 rounded-2xl overflow-hidden flex flex-col relative shadow-sm">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-silver-dark">
              <Loader2 size={32} className="animate-spin mb-4" />
              <p>Carregando fatura atual...</p>
            </div>
          ) : pendingInvoice ? (
            <>
              <div className="absolute top-0 right-0 bg-gold text-onyx text-[10px] font-bold uppercase py-1 px-4 rounded-bl-lg">
                Vence em {formatDate(pendingInvoice.dueDate)}
              </div>

              <div className="p-6 border-b border-onyx/10 dark:border-white/5">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Receipt size={20} className="text-gold" />
                  Fatura Atual
                </h2>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex flex-col gap-4 mb-6">
                  {pendingInvoice.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-onyx/5 dark:border-white/5 pb-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">
                          {item.description.includes('Mensalidade') || item.description.includes('Admissão') || item.description.includes('Rescisão') 
                            ? item.description 
                            : `Serviço Avulso: ${item.description}`}
                        </span>
                        {item.description.includes('Admissão') || item.description.includes('Rescisão') ? (
                          <span className="text-xs text-silver-dark flex items-center gap-1 mt-1">
                            <AlertCircle size={12} className="text-gold" /> Solicitado via Departamento Pessoal
                          </span>
                        ) : null}
                      </div>
                      <span className="font-bold">{formatMoney(item.amount)}</span>
                    </div>
                  ))}
                  
                  {pendingInvoice.items.length === 0 && (
                    <p className="text-silver-dark text-sm italic">Nenhum serviço faturado ainda.</p>
                  )}
                </div>

                <div className="mt-auto bg-onyx/5 dark:bg-white/5 p-4 rounded-xl flex justify-between items-end border border-onyx/10 dark:border-white/10">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-silver-dark uppercase tracking-wider">Total a Pagar</span>
                    <span className="text-3xl font-bold text-gold">{formatMoney(pendingInvoice.totalAmount)}</span>
                  </div>
                  <span className="text-sm font-bold text-onyx dark:text-white bg-gold py-1 px-3 rounded-md">
                    Em Aberto
                  </span>
                </div>
              </div>
            </>
          ) : (
             <div className="flex flex-col items-center justify-center h-64 text-silver-dark text-center px-6">
              <CheckCircle2 size={48} className="text-green-500 mb-4 opacity-80" />
              <h3 className="text-xl font-bold text-foreground mb-2">Tudo em dia!</h3>
              <p>Você não tem nenhuma fatura em aberto no momento. Novos serviços avulsos solicitados gerarão uma nova fatura aqui.</p>
            </div>
          )}
        </div>

        {/* Métodos de Pagamento */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel border border-onyx/30 dark:border-white/15 p-6 rounded-2xl flex flex-col gap-4 h-full shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">Pagar Fatura</h3>
              <span className="text-[10px] text-silver-dark uppercase font-bold text-right leading-tight max-w-[120px]">Fale com o Contador</span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Para efetuar o pagamento da fatura, clique no botão abaixo. Você será redirecionado para o WhatsApp do escritório para escolher a melhor forma (PIX, Boleto ou Mercado Pago).
            </p>

            <button 
              onClick={() => {
                const message = encodeURIComponent(`Olá, gostaria de pagar a minha fatura atual em aberto no valor de R$ ${pendingInvoice?.totalAmount || '0.00'}.`);
                window.open(`https://wa.me/5547992187868?text=${message}`, '_blank');
              }}
              className="w-full py-4 mt-auto rounded-xl border border-transparent bg-[#25D366] hover:bg-[#128C7E] flex items-center justify-center gap-3 transition-colors text-white shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              <span className="font-bold text-base">Negociar Pagamento no WhatsApp</span>
            </button>
          </div>
        </div>

      </section>

      {/* Histórico de Faturas */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <History size={20} className="text-gold" />
            Histórico de Pagamentos
          </h2>
          <a href="/api/invoices/report" target="_blank" className="px-4 py-2 bg-onyx/5 dark:bg-white/5 hover:bg-gold/10 text-gold text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2">
            <Download size={14} /> Relatório em PDF
          </a>
        </div>
        
        <div className="glass-panel border border-onyx/30 dark:border-white/15 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-onyx/5 dark:bg-white/5 text-silver-dark uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Fatura</th>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-onyx/10 dark:divide-white/5">
              
              {pastInvoices.length > 0 ? (
                pastInvoices.map((inv: any) => (
                  <TableRow 
                    key={inv.id}
                    month={`Fatura #${inv.id.substring(0,6)}`} 
                    date={formatDate(inv.dueDate)} 
                    amount={formatMoney(inv.totalAmount)} 
                    status="Pago" 
                    hasExtra={inv.items.length > 1}
                    receiptUrl={inv.receiptUrl}
                    invoiceId={inv.id}
                    onUploadReceipt={handleUploadReceipt}
                    uploadingReceipt={uploadingReceipt}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-silver-dark">
                    Nenhum histórico de pagamentos encontrado.
                  </td>
                </tr>
              )}
              
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}

// Helper Components
function TableRow({ month, date, amount, status, hasExtra = false, isSetup = false, receiptUrl, invoiceId, onUploadReceipt, uploadingReceipt }: any) {
  return (
    <tr className="hover:bg-onyx/5 dark:hover:bg-white/5 transition-colors group cursor-pointer">
      <td className="px-6 py-4 flex flex-col gap-1">
        <span className="font-bold">{month}</span>
        {hasExtra && <span className="text-[9px] bg-onyx text-gold uppercase px-2 py-0.5 rounded w-fit">Contém Serviços Extras</span>}
        {isSetup && <span className="text-[9px] bg-silver-dark text-background uppercase px-2 py-0.5 rounded w-fit">Taxa de Setup Inclusa</span>}
      </td>
      <td className="px-6 py-4 text-silver-dark">{date}</td>
      <td className="px-6 py-4 font-bold">{amount}</td>
      <td className="px-6 py-4">
        <span className="text-xs font-bold flex items-center gap-1 text-green-500">
          <CheckCircle2 size={14} /> {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right flex gap-3 justify-end items-center">
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
        
        <a href="/api/invoices/report" target="_blank" className="text-silver-dark group-hover:text-gold transition-colors inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
          Recibo PDF <Download size={14} />
        </a>
      </td>
    </tr>
  );
}
