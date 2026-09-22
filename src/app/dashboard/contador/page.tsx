"use client";

import { useEffect, useState } from "react";
import { Building, TrendingUp, AlertCircle, CalendarClock, ChevronRight, Filter, Inbox, Check, FileText, Users, Calendar } from "lucide-react";

export default function AgencyDashboard() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [billing, setBilling] = useState<{mrr: number, avulsoMes: number}>({ mrr: 0, avulsoMes: 0 });
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resNotif, resBill, resTen] = await Promise.all([
        fetch('/api/notifications'),
        fetch('/api/admin/billing'),
        fetch('/api/admin/tenants')
      ]);

      const dataNotif = await resNotif.json();
      const dataBill = await resBill.json();
      const dataTen = await resTen.json();

      setNotifications(dataNotif.notifications || []);
      setBilling({ mrr: dataBill.mrr || 0, avulsoMes: dataBill.avulsoMes || 0 });
      setTenants(dataTen.tenants || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll for new notifications every 5 seconds (simulating real-time for demo)
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      // Remove da lista
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const pendingMeetingsCount = notifications.filter(n => n.type === 'REUNIAO').length;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Painel da Agência</h1>
        <p className="text-silver-dark text-sm">
          Visão geral de todos os clientes, faturamento e solicitações pendentes.
        </p>
      </section>

      {/* Caixa de Entrada de Solicitações */}
      <section className="mt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Inbox size={20} className="text-gold" />
            Caixa de Entrada (Solicitações de Clientes)
          </h2>
          <span className="bg-gold text-onyx text-xs font-bold px-3 py-1 rounded-full">
            {notifications.length} Pendentes
          </span>
        </div>
        
        {loading ? (
           <div className="glass-panel border-onyx/20 dark:border-white/10 p-12 rounded-2xl flex flex-col items-center justify-center text-silver-dark text-center">
            <p>Carregando...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="glass-panel border-onyx/20 dark:border-white/10 p-12 rounded-2xl flex flex-col items-center justify-center text-silver-dark text-center">
            <Check size={48} className="mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground">Inbox Zero!</h3>
            <p className="mt-2">Você concluiu todas as solicitações dos clientes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notifications.map(notif => (
              <NotificationCard 
                key={notif.id} 
                notification={notif} 
                onComplete={() => handleComplete(notif.id)} 
              />
            ))}
          </div>
        )}
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        <KpiCard 
          title="MRR Previsto (Assinaturas)" 
          value={`R$ ${billing.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={<TrendingUp size={24} className="text-gold" />}
        />
        <KpiCard 
          title="Faturamento Extra (Loja)" 
          value={`R$ ${billing.avulsoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          subtitle="A faturar no próximo ciclo"
          icon={<TrendingUp size={24} className="text-silver-dark" />}
        />
        <KpiCard 
          title="Clientes Ativos" 
          value={tenants.length.toString()} 
          icon={<Building size={24} className="text-silver-dark" />}
        />
        <KpiCard 
          title="Reuniões Pendentes" 
          value={pendingMeetingsCount.toString()} 
          isWarning={pendingMeetingsCount > 0}
          icon={<AlertCircle size={24} className={pendingMeetingsCount > 0 ? "text-red-500" : "text-silver-dark"} />}
        />
      </section>

      {/* Tabela Multi-Tenant (Limites e Faturamento) */}
      <section className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Gestão de Clientes</h2>
          <button className="flex items-center gap-2 text-sm text-silver-dark hover:text-gold transition-colors border border-onyx/20 dark:border-white/10 px-3 py-1.5 rounded-lg">
            <Filter size={16} /> Filtrar
          </button>
        </div>

        <div className="glass-panel border-onyx/20 dark:border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-onyx/5 dark:bg-white/5 text-silver-dark uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Empresa</th>
                <th className="px-6 py-4">Plano</th>
                <th className="px-6 py-4">Sócios (Uso)</th>
                <th className="px-6 py-4">Funcionários (Uso)</th>
                <th className="px-6 py-4 rounded-tr-2xl text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-onyx/10 dark:divide-white/5">
              
              {tenants.map(tenant => {
                const planName = tenant.subscription?.plan?.name || 'Sem Plano';
                return (
                  <TableRow 
                    key={tenant.id}
                    name={tenant.name} 
                    plan={planName} 
                    partners={`${tenant._count?.partners || 0}`} 
                    employees={`${tenant._count?.employees || 0}`} 
                  />
                );
              })}

              {tenants.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-silver-dark">Nenhum cliente cadastrado.</td>
                </tr>
              )}
              
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}

// Subcomponents

function NotificationCard({ notification, onComplete }: any) {
  // Configuração visual baseada no tipo
  const config = {
    ADMISSAO: { borderLine: "bg-gold", textLine: "text-gold", hoverBorder: "hover:border-gold/50", borderBtn: "border-gold/30", btnText: "text-gold", btnHover: "hover:bg-gold/10", icon: <Users size={20} />, button: "Gerar Contrato" },
    DEMISSAO: { borderLine: "bg-red-500", textLine: "text-red-500", hoverBorder: "hover:border-red-500/50", borderBtn: "border-red-500/30", btnText: "text-red-500", btnHover: "hover:bg-red-500/10", icon: <AlertCircle size={20} />, button: "Enviar Guias de Rescisão" },
    DOCUMENTO: { borderLine: "bg-blue-400", textLine: "text-blue-400", hoverBorder: "hover:border-blue-400/50", borderBtn: "border-blue-400/30", btnText: "text-blue-400", btnHover: "hover:bg-blue-400/10", icon: <FileText size={20} />, button: "Baixar Documentos" },
    REUNIAO: { borderLine: "bg-green-500", textLine: "text-green-500", hoverBorder: "hover:border-green-500/50", borderBtn: "border-green-500/30", btnText: "text-green-500", btnHover: "hover:bg-green-500/10", icon: <Calendar size={20} />, button: "Confirmar / Enviar Meet" }
  }[notification.type as "ADMISSAO"|"DEMISSAO"|"DOCUMENTO"|"REUNIAO"] || { borderLine: "bg-silver-dark", textLine: "text-silver-dark", hoverBorder: "hover:border-silver-dark/50", borderBtn: "border-silver-dark/30", btnText: "text-silver-dark", btnHover: "hover:bg-silver-dark/10", icon: <Inbox size={20} />, button: "Concluir" };

  return (
    <div className={`bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group ${config.hoverBorder} transition-colors`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${config.borderLine}`}></div>
      
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className={config.textLine}>
            {config.icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-silver-dark">
            {notification.tenant?.name || "Empresa Cliente"}
          </span>
        </div>
        <span className="text-[10px] text-silver-dark">{new Date(notification.createdAt).toLocaleDateString()}</span>
      </div>

      <p className="font-bold text-sm leading-snug">
        {notification.message}
      </p>

      <div className="mt-auto pt-4 flex gap-2">
        <button 
          onClick={onComplete}
          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${config.borderBtn} ${config.textLine} ${config.btnHover}`}
        >
          {config.button}
        </button>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, subtitle, icon, isWarning = false }: any) {
  return (
    <div className={`glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[140px] border ${isWarning ? 'border-red-500/30' : 'border-onyx/20 dark:border-white/10'}`}>
      <div className="flex justify-between items-start">
        <span className="text-silver-dark text-xs uppercase font-bold tracking-wider mb-1">{title}</span>
        <div className="bg-background p-2 rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-end gap-3">
        <span className="text-3xl font-bold">{value}</span>
        {trend && <span className={`text-xs font-bold mb-1.5 ${isWarning ? 'text-red-500' : 'text-green-500'}`}>{trend}</span>}
      </div>
      {subtitle && <span className={`text-xs mt-2 ${isWarning ? 'text-red-400' : 'text-silver-dark'}`}>{subtitle}</span>}
    </div>
  );
}

function TableRow({ name, plan, partners, employees, status, warning, isLate }: any) {
  return (
    <tr className="hover:bg-onyx/5 dark:hover:bg-white/5 transition-colors group cursor-pointer">
      <td className="px-6 py-4">
        <span className="font-bold">{name}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
          plan === 'START' ? 'bg-silver-dark/20 text-silver-dark' : 
          plan === 'GESTÃO' ? 'bg-gold/20 text-gold' : 
          plan === 'Sem Plano' ? 'bg-red-500/20 text-red-400' :
          'bg-purple-500/20 text-purple-400'
        }`}>{plan}</span>
      </td>
      <td className="px-6 py-4 text-silver-dark">{partners}</td>
      <td className="px-6 py-4 flex flex-col gap-1">
        <span className={warning ? "text-gold font-bold" : "text-silver-dark"}>{employees}</span>
        {warning && <span className="text-[9px] text-gold uppercase">{warning}</span>}
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-silver-dark group-hover:text-gold transition-colors">
          <ChevronRight size={20} />
        </button>
      </td>
    </tr>
  );
}
