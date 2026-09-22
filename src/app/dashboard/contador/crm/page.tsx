"use client";

import { useState, useEffect } from "react";
import { UserPlus, Phone, Mail, Link2 } from "lucide-react";

export default function CrmPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [newLeadModal, setNewLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ name: '', email: '', phone: '', sourceUrl: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const crmRes = await fetch('/api/admin/crm');
      const crmData = await crmRes.json();
      if (!crmData.error) setLeads(crmData.leads || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const changeLeadStatus = async (id: string, newStatus: string) => {
    let cnpj = '';
    if (newStatus === 'WON') {
      const input = prompt('Lead GANHO! Informe o CNPJ (ou deixe em branco para gerar um provisório) para criar a ficha do cliente:');
      if (input === null) return;
      cnpj = input;
    }

    await fetch('/api/admin/crm', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus, cnpj })
    });
    fetchData();
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newLeadForm, status: 'NEW' })
    });
    setNewLeadModal(false);
    setNewLeadForm({ name: '', email: '', phone: '', sourceUrl: '' });
    fetchData();
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 dark:text-[#7a6f67] flex justify-center text-lg">Carregando funil de vendas...</div>;
  }

  const KANBAN_STAGES = [
    { id: 'NEW', label: 'Novos', color: 'border-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400' },
    { id: 'CONTACTED', label: 'Em Contato', color: 'border-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400' },
    { id: 'PROPOSAL', label: 'Proposta', color: 'border-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400' },
    { id: 'WON', label: 'Ganho', color: 'border-green-500', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400' },
    { id: 'LOST', label: 'Perdido', color: 'border-red-500', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400' },
    { id: 'INACTIVE', label: 'Inativos', color: 'border-gray-500', bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-700 dark:text-gray-400' },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#333333] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CRM Comercial</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Gerencie negociações e leads vindos da agência de marketing.</p>
        </div>
        <button onClick={() => setNewLeadModal(true)} className="bg-[#c9a96e] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#b39558] transition-colors shadow-sm">
          <UserPlus size={18} /> Novo Lead
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 w-full items-start">
        {KANBAN_STAGES.map(stage => {
          const stageLeads = leads.filter(l => l.status === stage.id);
          return (
            <div key={stage.id} className="flex flex-col min-w-[300px] max-w-[300px] shrink-0">
              <div className={`border-t-4 ${stage.color} ${stage.bg} p-3 rounded-t-lg flex items-center justify-between border-x border-gray-200 dark:border-[#333333]`}>
                <h3 className={`font-bold ${stage.text}`}>{stage.label}</h3>
                <span className="bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-[#333333] text-xs font-bold px-2 py-1 rounded-full shadow-sm">{stageLeads.length}</span>
              </div>
              
              <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333333] border-t-0 p-3 rounded-b-lg flex flex-col gap-3 min-h-[500px]">
                {stageLeads.map(lead => (
                  <div key={lead.id} className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333333] p-4 rounded-lg shadow-sm hover:border-[#c9a96e] dark:hover:border-[#c9a96e] transition-colors cursor-pointer group">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{lead.name}</h4>
                    
                    {lead.email && <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1"><Mail size={12}/> {lead.email}</p>}
                    {lead.phone && <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2"><Phone size={12}/> {lead.phone}</p>}
                    
                    {lead.sourceUrl && (
                      <div className="mt-3 text-[10px] bg-gray-100 dark:bg-black/50 px-2 py-1 rounded text-gray-600 dark:text-gray-400 flex items-center gap-1 truncate border border-gray-200 dark:border-white/10" title={lead.sourceUrl}>
                        <Link2 size={10} className="shrink-0" /> {lead.sourceUrl.replace('https://', '').split('/')[0]}
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/10 flex gap-1 flex-wrap">
                      {KANBAN_STAGES.map(s => (
                        <button
                          key={s.id}
                          onClick={() => changeLeadStatus(lead.id, s.id)}
                          className={`text-[10px] px-2 py-1.5 rounded transition-all shadow-sm ${lead.status === s.id ? 'bg-[#c9a96e] text-black font-bold scale-105' : 'bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333333]'}`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {newLeadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-gray-200 dark:border-[#333333] max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cadastrar Novo Lead</h2>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Nome/Empresa</label>
                <input required type="text" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#c9a96e]" value={newLeadForm.name} onChange={e => setNewLeadForm({...newLeadForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">E-mail</label>
                <input type="email" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#c9a96e]" value={newLeadForm.email} onChange={e => setNewLeadForm({...newLeadForm, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Telefone/WhatsApp</label>
                <input type="text" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#c9a96e]" value={newLeadForm.phone} onChange={e => setNewLeadForm({...newLeadForm, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">URL de Origem (Campanha)</label>
                <input type="text" placeholder="ex: https://instagram.com/ad/123" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#c9a96e]" value={newLeadForm.sourceUrl} onChange={e => setNewLeadForm({...newLeadForm, sourceUrl: e.target.value})} />
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-[#333333] mt-4">
                <button type="button" onClick={() => setNewLeadModal(false)} className="flex-1 bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 py-3 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-[#333333] transition-colors border border-gray-200 dark:border-[#333333]">Cancelar</button>
                <button type="submit" className="flex-1 bg-[#c9a96e] text-black py-3 rounded-lg font-bold hover:bg-[#b39558] transition-colors shadow-md">Salvar Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
