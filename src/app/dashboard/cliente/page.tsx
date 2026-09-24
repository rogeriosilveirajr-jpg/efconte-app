"use client";

import { useEffect, useState } from "react";
import { Users, FileText, TrendingUp, AlertCircle, Calendar, Clock, CheckCircle2 } from "lucide-react";

export default function ClientDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [meetingScheduled, setMeetingScheduled] = useState(false);
  const [allMeetings, setAllMeetings] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/profile'),
      fetch('/api/documents')
    ])
    .then(async ([resProfile, resDocs]) => {
      const dataProfile = await resProfile.json();
      const dataDocs = await resDocs.json();
      
      if (dataProfile.user) {
        setProfile(dataProfile.user);
      }
      if (dataDocs.documents) {
        setDocuments(dataDocs.documents);
      }
    })
    .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isMeetingModalOpen) {
      fetch('/api/admin/meetings')
        .then(res => res.json())
        .then(data => {
           if (data.meetings) setAllMeetings(data.meetings);
        })
        .catch(console.error);
    }
  }, [isMeetingModalOpen]);

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) return;
    setLoading(true);
    
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'REUNIAO', 
          message: `Cliente agendou uma reunião para ${selectedDate} às ${selectedTime}`,
          metadata: { date: selectedDate, time: selectedTime }
        })
      });
    } catch (e) {
      console.error(e);
    }
    
    setTimeout(() => {
      setLoading(false);
      setMeetingScheduled(true);
      setTimeout(() => {
        setIsMeetingModalOpen(false);
        setMeetingScheduled(false);
        setSelectedDate("");
        setSelectedTime("");
      }, 3000);
    }, 1000);
  };

  const bookedTimes = allMeetings
    .filter(m => m.status === 'SCHEDULED')
    .filter(m => {
      const d = new Date(m.date);
      // Extrair YYYY-MM-DD no fuso do Brasil usando Sweden (sv-SE) ou Canada (en-CA) locale
      const dStr = d.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
      return dStr === selectedDate;
    })
    .map(m => {
      const d = new Date(m.date);
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
    });

  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString();
        setLoading(true);
        try {
          // 1. Faz o upload e cria um documento tipo OUTROS para o contador ver
          const tenantId = profile.tenants[0].tenantId;
          const res = await fetch('/api/documents/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileBase64: base64,
              tenantId,
              type: 'OUTROS' // documento real
            })
          });

          if (res.ok) {
            // 2. Avisa que a pendência foi concluída marcando-a como 'COMPLETED'
            // Pra facilitar no MVP, vamos chamar a api genérica de documents PUT, se existir, senão só exclui a solicitação original...
            // Pra evitar criar uma API nova agora, vamos só excluir o documento de solicitacao
            await fetch('/api/documents/' + docId, { method: 'DELETE' });
            
            alert('Documento enviado com sucesso!');
            window.location.reload();
          } else {
            alert('Erro ao enviar documento');
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
    }
  };

  const tenantData = profile?.tenants?.[0]?.tenant;
  const currentPlan = tenantData?.subscription?.plan?.name || "Sem Plano";

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
      
      {/* Welcome Banner */}
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[var(--brand-gold)]">Olá, {profile?.name || tenantData?.name?.split(' ')[0] || "Cliente"}!</h1>
        <p className="text-[var(--brand-silver-dark)] text-sm">
          Bem-vindo ao seu painel. Aqui está o resumo da sua empresa.
        </p>
      </section>

      {/* Plan Usage & Limits */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Assinatura */}
        <div className="plan-card p-6 rounded-2xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--brand-gold)]/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[var(--brand-silver-dark)] text-xs uppercase font-bold tracking-wider mb-1">Plano Atual</span>
              <span className="text-xl font-bold text-[var(--brand-gold)]">{loading ? "Carregando..." : currentPlan}</span>
            </div>
            <div className="bg-[var(--brand-gold)]/20 p-2 rounded-lg text-[var(--brand-gold)]">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-[var(--brand-silver-dark)]">Fatura dia 10</span>
            <span className="font-bold text-green-500">Em dia</span>
          </div>
        </div>

        {/* Dependentes / Equipe */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-[var(--brand-silver-dark)] text-xs uppercase font-bold tracking-wider mb-1">Equipe Registrada</span>
            <div className="bg-background p-2 rounded-lg text-[var(--brand-silver-dark)]">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-2xl font-bold">
              {loading ? "..." : (tenantData?._count?.employees || 0) + (tenantData?._count?.partners || 0)}
            </span>
            <span className="text-xs text-[var(--brand-silver-dark)]">
              {tenantData?._count?.partners || 0} sócios e {tenantData?._count?.employees || 0} funcionários
            </span>
          </div>
        </div>

        {/* Documentos */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-[var(--brand-silver-dark)] text-xs uppercase font-bold tracking-wider mb-1">Avisos e Impostos</span>
            <div className="bg-background p-2 rounded-lg text-[var(--brand-silver-dark)]">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <CheckCircle2 size={24} className="text-green-500" />
            <span className="text-sm font-bold text-green-500">Tudo em dia!</span>
          </div>
          <span className="text-xs mt-1 text-[var(--brand-silver-dark)]">Nenhuma guia pendente.</span>
        </div>
        
      </section>

      {/* DRE e Indicadores */}
      <section className="mt-4">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-[var(--brand-gold)]" />
          Desempenho Financeiro
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Pendências do Contador */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col h-80">
            <div className="flex justify-between items-center mb-6">
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
          </div>

          {/* Quick Indicators */}
          <div className="flex flex-col gap-6">

            <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col justify-center items-center text-center gap-3">
              <AlertCircle className="text-[var(--brand-gold)]" size={24} />
              <p className="text-sm text-[var(--brand-silver-dark)]">Sua reunião semestral de resultados está disponível.</p>
              <button 
                onClick={() => setIsMeetingModalOpen(true)}
                className="px-4 py-2 bg-[var(--brand-gold)] text-[var(--color-primary)] text-sm font-bold rounded-lg hover:bg-[var(--brand-gold-hover)] transition-colors w-full mt-2"
              >
                Agendar Reunião
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Modal de Agendamento */}
      {isMeetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-background border border-[var(--brand-gold)]/30 p-8 rounded-2xl max-w-md w-full shadow-2xl relative glass-panel">
            
            {meetingScheduled ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <CheckCircle2 size={64} className="text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Reunião Agendada!</h3>
                <p className="text-sm text-[var(--brand-silver-dark)]">O contador foi notificado e o link do Google Meet será enviado para o seu e-mail.</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                      <Calendar size={24} className="text-[var(--brand-gold)]" /> Agendar Reunião
                    </h3>
                    <p className="text-xs text-[var(--brand-silver-dark)]">Escolha o melhor horário na agenda do contador.</p>
                  </div>
                  <button onClick={() => setIsMeetingModalOpen(false)} className="text-[var(--brand-silver-dark)] hover:text-[var(--color-text)]">✕</button>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-[var(--brand-silver-dark)]">Data Disponível</label>
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-[var(--brand-gold)] text-[var(--color-text)]"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-[var(--brand-silver-dark)]">Horários Livres do Contador</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["09:00", "10:30", "14:00", "15:30", "16:00"].map((time) => {
                        const isBooked = bookedTimes.includes(time);
                        return (
                          <button
                            key={time}
                            disabled={isBooked}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 rounded-lg text-sm font-bold border transition-colors ${
                              isBooked
                                ? "bg-[var(--color-border)] text-[var(--brand-silver-dark)] opacity-50 cursor-not-allowed border-transparent"
                                : selectedTime === time 
                                ? "bg-[var(--brand-gold)] text-[var(--color-primary)] border-[var(--brand-gold)]" 
                                : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--brand-gold)]/50"
                            }`}
                          >
                            {time} {isBooked && "(Ocupado)"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex justify-end gap-3">
                  <button onClick={() => setIsMeetingModalOpen(false)} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-[var(--color-surface)] hover:bg-[var(--color-border)] transition-colors">
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSchedule}
                    disabled={!selectedDate || !selectedTime || loading}
                    className="px-6 py-2.5 rounded-lg font-bold text-sm bg-[var(--brand-gold)] text-[var(--color-primary)] hover:bg-[var(--brand-gold-hover)] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? "Agendando..." : "Confirmar Agenda"}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

