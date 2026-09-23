"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Video, CheckCircle2, XCircle, Plus } from "lucide-react";

export default function ReunioesPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await fetch('/api/admin/meetings');
      const data = await res.json() as any as any;
      setMeetings(data.meetings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateMeeting = async (id: string, updates: any) => {
    await fetch('/api/admin/meetings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
    fetchMeetings();
  };

  const setMeetingLink = (id: string, currentUrl: string, tenantName?: string, tenantPhone?: string, meetingTitle?: string, meetingDate?: string) => {
    const url = prompt('Cole o link do Google Meet / Zoom para esta reunião:', currentUrl || '');
    if (url !== null) {
      updateMeeting(id, { meetingUrl: url });
      
      if (tenantPhone && url) {
        // Envia mensagem pelo WhatsApp automaticamente
        const dateStr = new Date(meetingDate || '').toLocaleDateString('pt-BR');
        const timeStr = new Date(meetingDate || '').toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
        
        const msg = `Olá! A sua reunião de consultoria contábil ("${meetingTitle}") agendada para ${dateStr} às ${timeStr} foi confirmada pelo seu contador. \n\nAcesse no link: ${url}`;
        
        // Remove caracteres não numéricos do telefone
        let phoneNum = tenantPhone.replace(/\D/g, '');
        if (phoneNum && phoneNum.length >= 10) {
          if (!phoneNum.startsWith('55')) phoneNum = '55' + phoneNum;
          window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`, '_blank');
        } else {
          alert('Link salvo com sucesso, mas o cliente não tem um telefone válido cadastrado para envio do WhatsApp.');
        }
      }
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 dark:text-silver-dark flex justify-center text-lg">Carregando agenda...</div>;
  }

  const upcoming = meetings.filter(m => m.status === 'SCHEDULED');
  const past = meetings.filter(m => m.status !== 'SCHEDULED');

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12 w-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#333333] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reuniões Estratégicas</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Controle as reuniões consultivas agendadas pelos seus clientes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Próximas Reuniões */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CalendarIcon size={20} className="text-[#c9a96e]" /> Próximos Encontros
          </h2>
          
          {upcoming.length === 0 ? (
            <div className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-xl border border-dashed border-gray-300 dark:border-[#333333] text-center">
              <p className="text-gray-500 dark:text-gray-400">Nenhuma reunião agendada no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map(meeting => (
                <div key={meeting.id} className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333333] rounded-xl p-5 shadow-sm hover:border-[#c9a96e] dark:hover:border-[#c9a96e] transition-colors flex flex-col">
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-[#c9a96e] uppercase tracking-wider mb-1 block">
                        {meeting.tenant?.name || 'Cliente'}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{meeting.title}</h3>
                    </div>
                    <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-[10px] px-2 py-1 rounded font-bold">
                      AGENDADO
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 border-b border-gray-100 dark:border-[#333333] pb-4">
                    <div className="flex items-center gap-1"><CalendarIcon size={14}/> {new Date(meeting.date).toLocaleDateString('pt-BR')}</div>
                    <div className="flex items-center gap-1"><Clock size={14}/> {new Date(meeting.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>

                  {meeting.meetingUrl ? (
                    <div className="mb-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 p-3 rounded-lg flex flex-col gap-2">
                      <p className="text-xs text-green-700 dark:text-green-400 font-bold flex items-center gap-1"><Video size={14} /> Link Gerado</p>
                      <a href={meeting.meetingUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400 underline truncate">{meeting.meetingUrl}</a>
                      <button onClick={() => setMeetingLink(meeting.id, meeting.meetingUrl, meeting.tenant?.name, meeting.tenant?.phone, meeting.title, meeting.date)} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-left mt-1">Alterar Link</button>
                    </div>
                  ) : (
                    <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-3 rounded-lg">
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 font-bold mb-2">Aguardando Link</p>
                      <button onClick={() => setMeetingLink(meeting.id, '', meeting.tenant?.name, meeting.tenant?.phone, meeting.title, meeting.date)} className="bg-white dark:bg-[#252525] border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded text-sm w-full font-medium hover:bg-gray-50 dark:hover:bg-[#333] transition">
                        + Inserir Link da Reunião
                      </button>
                    </div>
                  )}

                  <div className="mt-auto flex gap-2 pt-2">
                    <button onClick={() => updateMeeting(meeting.id, { status: 'COMPLETED' })} className="flex-1 bg-gray-100 hover:bg-green-100 hover:text-green-700 dark:bg-[#252525] dark:hover:bg-green-900/30 dark:hover:text-green-400 text-gray-700 dark:text-gray-300 py-2 rounded text-sm font-medium transition flex justify-center items-center gap-1">
                      <CheckCircle2 size={16} /> Concluir
                    </button>
                    <button onClick={() => updateMeeting(meeting.id, { status: 'CANCELED' })} className="flex-1 bg-gray-100 hover:bg-red-100 hover:text-red-700 dark:bg-[#252525] dark:hover:bg-red-900/30 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 py-2 rounded text-sm font-medium transition flex justify-center items-center gap-1">
                      <XCircle size={16} /> Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Histórico */}
        {past.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Histórico Recente</h2>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-[#333333] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-[#333333] text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="p-4 font-medium">Cliente</th>
                    <th className="p-4 font-medium">Motivo</th>
                    <th className="p-4 font-medium">Data</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-[#333333]">
                  {past.map(meeting => (
                    <tr key={meeting.id}>
                      <td className="p-4 text-gray-900 dark:text-white font-medium">{meeting.tenant?.name || 'Cliente'}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">{meeting.title}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">{new Date(meeting.date).toLocaleDateString('pt-BR')}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${meeting.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                          {meeting.status === 'COMPLETED' ? 'CONCLUÍDA' : 'CANCELADA'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

    </div>
  );
}
