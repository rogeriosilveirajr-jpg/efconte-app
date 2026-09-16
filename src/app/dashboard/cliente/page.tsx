"use client";

import { useEffect, useState } from "react";
import { Users, FileText, TrendingUp, AlertCircle, Calendar, Clock, CheckCircle2 } from "lucide-react";

export default function ClientDashboard() {
  const [loading, setLoading] = useState(true);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [meetingScheduled, setMeetingScheduled] = useState(false);

  // Simulating an API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
      
      {/* Welcome Banner */}
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Olá, João!</h1>
        <p className="text-silver-dark text-sm">
          Bem-vindo ao seu painel EFCONTE. Aqui está o resumo da sua empresa.
        </p>
      </section>

      {/* Plan Usage & Limits */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Assinatura */}
        <div className="plan-card p-6 rounded-2xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gold/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-silver-dark text-xs uppercase font-bold tracking-wider mb-1">Plano Atual</span>
              <span className="text-xl font-bold text-gold">GESTÃO</span>
            </div>
            <div className="bg-gold/20 p-2 rounded-lg text-gold">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-silver-dark">Fatura dia 10</span>
            <span className="font-bold text-green-500">Em dia</span>
          </div>
        </div>

        {/* Sócios (Limit 2) */}
        <div className="glass-panel border-onyx/20 dark:border-white/10 p-6 rounded-2xl flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-silver-dark text-xs uppercase font-bold tracking-wider mb-1">Sócios Ativos</span>
              <span className="text-xl font-bold">2 / 2</span>
            </div>
            <div className="bg-onyx/5 dark:bg-white/5 p-2 rounded-lg">
              <Users size={20} className="text-silver-dark" />
            </div>
          </div>
          <div className="mt-4 w-full bg-onyx/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gold h-full" style={{ width: "100%" }}></div>
          </div>
        </div>

        {/* Funcionários (Limit 3) */}
        <div className="glass-panel border-onyx/20 dark:border-white/10 p-6 rounded-2xl flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-silver-dark text-xs uppercase font-bold tracking-wider mb-1">Funcionários</span>
              <span className="text-xl font-bold">1 / 3</span>
            </div>
            <div className="bg-onyx/5 dark:bg-white/5 p-2 rounded-lg">
              <Users size={20} className="text-silver-dark" />
            </div>
          </div>
          <div className="mt-4 w-full bg-onyx/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gold h-full transition-all duration-1000" style={{ width: "33%" }}></div>
          </div>
        </div>

      </section>

      {/* DRE e Indicadores Financeiros (Skeleton Loaders) */}
      <section className="mt-4">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-gold" />
          Desempenho Financeiro
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main DRE Chart Placeholder */}
          <div className="lg:col-span-2 glass-panel border-onyx/20 dark:border-white/10 p-6 rounded-2xl flex flex-col h-80">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm">Evolução do Faturamento (DRE)</h3>
              <select className="bg-background border border-onyx/20 dark:border-white/10 rounded-lg text-xs px-2 py-1 outline-none">
                <option>2026 (Semestral)</option>
              </select>
            </div>
            
            <div className="flex-1 w-full flex items-end justify-between gap-2 md:gap-6 px-2">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-full bg-onyx/10 dark:bg-silver-dark/20 rounded-t-sm animate-pulse" style={{ height: `${20 + i * 10}%` }}></div>
                ))
              ) : (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-full bg-gold/80 hover:bg-gold rounded-t-sm transition-all relative group" style={{ height: `${Math.random() * 60 + 20}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-onyx text-white text-[10px] px-2 py-1 rounded transition-opacity">
                      R$ 45k
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between mt-4 text-xs text-silver-dark px-2 font-mono">
              <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
            </div>
          </div>

          {/* Quick Indicators */}
          <div className="flex flex-col gap-6">
            <IndicatorCard 
              title="Lucratividade Atual" 
              value="24.5%" 
              trend="+2.1%" 
              loading={loading} 
            />
            <IndicatorCard 
              title="Impostos no Semestre" 
              value="R$ 18.430" 
              trend="-1.5%" 
              loading={loading} 
              isWarning
            />
            <div className="glass-panel border-onyx/20 dark:border-white/10 p-6 rounded-2xl flex-1 flex flex-col justify-center items-center text-center gap-3">
              <AlertCircle className="text-gold" size={24} />
              <p className="text-sm text-silver-dark">Sua reunião semestral de resultados está disponível.</p>
              <button 
                onClick={() => setIsMeetingModalOpen(true)}
                className="px-4 py-2 bg-gold text-background text-sm font-bold rounded-lg hover:bg-gold-hover transition-colors w-full mt-2"
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
          <div className="bg-background border border-gold/30 p-8 rounded-2xl max-w-md w-full shadow-2xl relative">
            
            {meetingScheduled ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <CheckCircle2 size={64} className="text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Reunião Agendada!</h3>
                <p className="text-sm text-silver-dark">O contador foi notificado e o link do Google Meet será enviado para o seu e-mail.</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                      <Calendar size={24} className="text-gold" /> Agendar Reunião
                    </h3>
                    <p className="text-xs text-silver-dark">Escolha o melhor horário na agenda do contador.</p>
                  </div>
                  <button onClick={() => setIsMeetingModalOpen(false)} className="text-silver-dark hover:text-foreground">✕</button>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-silver-dark">Data Disponível</label>
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-silver-dark">Horários Livres do Contador</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["09:00", "10:30", "14:00", "15:30", "16:00"].map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 rounded-lg text-sm font-bold border transition-colors ${
                            selectedTime === time 
                              ? "bg-gold text-onyx border-gold" 
                              : "bg-background border-onyx/10 dark:border-white/10 hover:border-gold/50"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-onyx/10 dark:border-white/5 flex justify-end gap-3">
                  <button onClick={() => setIsMeetingModalOpen(false)} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-onyx/5 dark:bg-white/5 hover:bg-onyx/10 dark:hover:bg-white/10 transition-colors">
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSchedule}
                    disabled={!selectedDate || !selectedTime || loading}
                    className="px-6 py-2.5 rounded-lg font-bold text-sm bg-gold text-onyx hover:bg-gold-hover transition-colors disabled:opacity-50 flex items-center gap-2"
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

function IndicatorCard({ title, value, trend, loading, isWarning = false }: { title: string, value: string, trend: string, loading: boolean, isWarning?: boolean }) {
  return (
    <div className="glass-panel border-onyx/20 dark:border-white/10 p-6 rounded-2xl flex flex-col justify-center">
      <span className="text-xs text-silver-dark uppercase font-bold tracking-wider mb-2">{title}</span>
      {loading ? (
        <div className="h-8 w-24 bg-onyx/10 dark:bg-silver-dark/20 rounded animate-pulse"></div>
      ) : (
        <div className="flex items-end gap-3">
          <span className="text-2xl font-bold">{value}</span>
          <span className={`text-xs font-bold mb-1 ${isWarning ? 'text-red-500' : 'text-green-500'}`}>{trend}</span>
        </div>
      )}
    </div>
  );
}
