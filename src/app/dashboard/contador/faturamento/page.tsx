"use client";
export const runtime = "edge";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export default function FaturamentoPage() {
  const [loading, setLoading] = useState(true);
  const [financeiro, setFinanceiro] = useState<any>({ mrr: 0, avulsoMes: 0, inadimplencia: 0, invoices: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/billing');
      const data = await res.json() as any as any;
      if (!data.error) setFinanceiro(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markInvoiceAsPaid = async (id: string) => {
    if (!confirm('Deseja marcar esta fatura como paga?')) return;
    await fetch('/api/admin/billing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'Paid' })
    });
    fetchData();
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 dark:text-[#7a6f67] flex justify-center text-lg">Carregando painel financeiro...</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12 w-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#333333] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Faturamento e MRR</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Visão global da receita da sua agência.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-gray-200 dark:border-[#333333] flex flex-col gap-4 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 text-gray-900 dark:text-white"><TrendingUp size={64} /></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2"><DollarSign size={18} /> MRR (Recorrente)</p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">R$ {financeiro.mrr.toFixed(2)}</h2>
        </div>
        
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-gray-200 dark:border-[#333333] flex flex-col gap-4 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 text-gray-900 dark:text-white"><FileText size={64} /></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2"><DollarSign size={18} /> Avulso (Mês Atual)</p>
          <h2 className="text-4xl font-bold text-[#c9a96e]">R$ {financeiro.avulsoMes.toFixed(2)}</h2>
        </div>
        
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-red-200 dark:border-red-900/30 flex flex-col gap-4 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 text-red-500"><AlertCircle size={64} /></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2"><AlertCircle size={18} className="text-red-500 dark:text-red-400" /> Inadimplência</p>
          <h2 className="text-4xl font-bold text-red-500 dark:text-red-400">R$ {financeiro.inadimplencia.toFixed(2)}</h2>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-[#333333] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-[#333333] flex items-center justify-between bg-gray-50 dark:bg-transparent">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Faturas Globais</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-[#333333] text-gray-500 dark:text-gray-400">
              <tr>
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium">Vencimento</th>
                <th className="p-4 font-medium">Valor Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#333333]">
              {financeiro.invoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-900 dark:text-white font-medium">{inv.tenant?.name || 'Desconhecido'}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{new Date(inv.dueDate).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4 text-gray-900 dark:text-white">R$ {inv.totalAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'}`}>
                      {inv.status === 'Paid' ? 'PAGO' : 'PENDENTE'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {inv.status !== 'Paid' && (
                      <button onClick={() => markInvoiceAsPaid(inv.id)} className="text-[#c9a96e] hover:text-[#b39558] flex items-center justify-end gap-1 ml-auto text-sm font-medium">
                        <CheckCircle2 size={16} /> Dar Baixa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {financeiro.invoices.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">Nenhuma fatura encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
