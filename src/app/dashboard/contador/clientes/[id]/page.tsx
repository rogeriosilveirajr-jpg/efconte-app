"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, 
  Building, ChevronLeft, ArrowUpRight, CheckCircle2, 
  FileText, Users, CreditCard, Activity, UploadCloud, Download, Loader2, X
} from "lucide-react";

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [tenant, setTenant] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("visao_geral");

  // Modals state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchTenant = async () => {
    try {
      const res = await fetch(`/api/admin/tenants/${id}`);
      const data = await res.json();
      setTenant(data.tenant);
      setPlans(data.plans || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTenant();
  }, [id]);

  const handleUpgrade = async (planId: string) => {
    setProcessing(true);
    try {
      await fetch(`/api/admin/tenants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });
      await fetchTenant();
      setIsUpgradeModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };
  const handleDeleteClient = async () => {
    if (!confirm("Tem certeza que deseja desativar/excluir este cliente?")) return;
    setProcessing(true);
    try {
      await fetch(`/api/admin/tenants/${params.id}`, { method: "DELETE" });
      router.push("/dashboard/contador/clientes");
    } catch (e) {
      console.error(e);
      setProcessing(false);
    }
  };


  const handleAddInvoiceItem = async (description: string, amount: string) => {
    setProcessing(true);
    try {
      await fetch(`/api/admin/tenants/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ADD_INVOICE_ITEM', description, amount })
      });
      await fetchTenant();
      setIsInvoiceModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-silver-dark flex justify-center"><Loader2 className="animate-spin text-gold" size={32} /></div>;
  if (!tenant) return <div className="p-12 text-center text-red-500">Cliente não encontrado.</div>;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12">
      
      {/* Header / Breadcrumb */}
      <section className="flex flex-col gap-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-silver-dark hover:text-gold transition-colors w-fit">
          <ChevronLeft size={16} /> Voltar para clientes
        </button>
        
        <div className="glass-panel border-gold/30 dark:border-gold/30 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 rounded-2xl bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 flex items-center justify-center text-gold font-bold text-2xl shadow-sm">
              {tenant.name.substring(0,2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{tenant.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm">
                <span className="text-silver-dark font-mono">{tenant.cnpj}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span className="text-green-500 font-bold">Ativo</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 z-10 w-full md:w-auto">
            <div className="flex flex-col items-end mr-4">
              <span className="text-[10px] uppercase font-bold text-silver-dark tracking-wider">Plano Atual</span>
              <span className="text-lg font-bold text-gold">{tenant.subscription?.plan?.name || "Nenhum"}</span>
            </div>
            <button 
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex-1 md:flex-none px-6 py-2.5 bg-onyx text-gold dark:bg-white/10 border border-transparent dark:hover:border-gold rounded-lg font-bold text-sm transition-colors shadow-sm"
            >
              Alterar Plano
            </button>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="border-b border-onyx/10 dark:border-white/10 flex gap-8 px-2 overflow-x-auto">
        <TabButton id="visao_geral" label="Visão Geral" icon={<Activity size={18} />} activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="faturas" label="Faturas & Financeiro" icon={<CreditCard size={18} />} activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="documentos" label="Documentos (GED)" icon={<FileText size={18} />} activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="dp" label="Departamento Pessoal" icon={<Users size={18} />} activeTab={activeTab} setActiveTab={setActiveTab} />
      </section>

      {/* Tab Content */}
      <section className="min-h-[400px]">
        {activeTab === "visao_geral" && <VisaoGeralTab tenant={tenant} />}
        {activeTab === "faturas" && <FaturasTab tenant={tenant} onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)} />}
        {activeTab === "documentos" && <DocumentosTab tenant={tenant} />}
        {activeTab === "dp" && <DepartamentoPessoalTab tenant={tenant} />}
      </section>

      {/* Modals */}
      {isUpgradeModalOpen && (
        <UpgradeModal 
          plans={plans} 
          currentPlanId={tenant.subscription?.planId}
          onClose={() => setIsUpgradeModalOpen(false)}
          onConfirm={handleUpgrade}
          processing={processing}
        />
      )}
      
      {isInvoiceModalOpen && (
        <InvoiceModal 
          onClose={() => setIsInvoiceModalOpen(false)}
          onConfirm={handleAddInvoiceItem}
          processing={processing}
        />
      )}

    </div>
  );
}

// -----------------------------------------------------
// Subcomponents
// -----------------------------------------------------

function TabButton({ id, label, icon, activeTab, setActiveTab }: any) {
  const isActive = activeTab === id;
  return (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap
        ${isActive ? 'border-gold text-foreground' : 'border-transparent text-silver-dark hover:text-foreground'}
      `}
    >
      <span className={isActive ? 'text-gold' : ''}>{icon}</span>
      {label}
    </button>
  );
}

function VisaoGeralTab({ tenant }: { tenant: any }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-silver-dark text-xs uppercase font-bold tracking-wider mb-1">Total de Funcionários</span>
          <span className="text-3xl font-bold">{tenant.employees?.length || 0}</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-silver-dark text-xs uppercase font-bold tracking-wider mb-1">Total de Sócios</span>
          <span className="text-3xl font-bold">{tenant.partners?.length || 0}</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-gold/30">
          <span className="text-silver-dark text-xs uppercase font-bold tracking-wider mb-1">Mensalidade Base</span>
          <span className="text-3xl font-bold text-gold">R$ {tenant.subscription?.plan?.basePrice || 0}</span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold mb-4">Histórico Recente de Ações</h3>
        <div className="glass-panel border-onyx/20 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          {(!tenant.notifications || tenant.notifications.length === 0) ? (
            <p className="text-sm text-silver-dark">Nenhum evento registrado recentemente.</p>
          ) : (
            tenant.notifications?.map((n: any) => (
              <div key={n.id} className="flex items-start gap-4 pb-4 border-b border-onyx/10 dark:border-white/5 last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-gold shrink-0"></div>
                <div>
                  <p className="text-sm font-bold">{n.message}</p>
                  <p className="text-xs text-silver-dark">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FaturasTab({ tenant, onOpenInvoiceModal }: { tenant: any, onOpenInvoiceModal: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Faturas e Cobranças</h3>
        <button onClick={onOpenInvoiceModal} className="px-4 py-2 bg-gold text-onyx text-sm font-bold rounded-lg hover:bg-gold-hover transition-colors flex items-center gap-2">
          <ArrowUpRight size={16} /> Adicionar Cobrança
        </button>
      </div>

      <div className="glass-panel border-onyx/20 dark:border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-onyx/5 dark:bg-white/5 text-silver-dark uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Vencimento</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Valor Total</th>
              <th className="px-6 py-4">Itens</th>
              <th className="px-6 py-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-onyx/10 dark:divide-white/5">
            {tenant.invoices?.map((inv: any) => (
              <tr key={inv.id}>
                <td className="px-6 py-4 font-bold">{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${inv.status === 'Pending' ? 'bg-silver-dark/20 text-silver-dark' : 'bg-green-500/20 text-green-500'}`}>
                    {inv.status === 'Pending' ? 'Pendente' : 'Pago'}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gold">R$ {inv.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4 text-xs text-silver-dark">
                  {inv.items?.length || 0} serviços
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => alert("A fatura detalhada abriria aqui.")} className="text-silver-dark hover:text-gold text-xs font-bold transition-colors">Ver Detalhes</button>
                </td>
              </tr>
            ))}
            {(!tenant.invoices || tenant.invoices.length === 0) && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-silver-dark">Nenhuma fatura encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocumentosTab({ tenant }: { tenant: any }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sentFiles, setSentFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      const type = window.prompt("Qual é o tipo deste documento?\n(Ex: CONTRATO, IMPOSTO, DP, OUTROS)", "CONTRATO");
      if (!type) return;

      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('tenantId', tenant.id);
      formData.append('type', type.toUpperCase());

      try {
        const res = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          setSentFiles(prev => [file.name, ...prev]);
          alert('Documento enviado com sucesso!');
        } else {
          alert('Erro ao enviar o documento.');
        }
      } catch (err) {
        console.error(err);
        alert('Erro ao fazer upload.');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Cofre Digital (GED)</h3>
        <button onClick={handleUploadClick} disabled={uploading} className="px-4 py-2 bg-onyx text-gold dark:bg-white/10 text-sm font-bold rounded-lg hover:border-gold transition-colors flex items-center gap-2 border border-transparent disabled:opacity-50">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />} 
          {uploading ? "Enviando..." : "Enviar Documento"}
        </button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel border-onyx/20 dark:border-white/10 rounded-2xl p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2"><Download size={18} className="text-gold"/> Recebidos do Cliente</h4>
          <p className="text-sm text-silver-dark">Os documentos enviados pelo cliente aparecem aqui.</p>
          <div className="mt-4 flex flex-col gap-2">
            {tenant.notifications?.filter((n:any)=>n.type==='DOCUMENTO').map((docNotif:any) => {
              const meta = docNotif.metadata ? JSON.parse(docNotif.metadata) : {};
              const files = meta.fileNames || ["Arquivo.pdf"];
              return files.map((file: string, idx: number) => (
                <div key={docNotif.id+idx} className="p-3 bg-background rounded-lg border border-onyx/10 dark:border-white/5 flex justify-between items-center">
                  <span className="text-sm font-mono truncate mr-2">{file}</span>
                  <button onClick={() => alert("Simulando download...")} className="text-gold text-xs font-bold hover:underline shrink-0">Baixar</button>
                </div>
              ));
            })}
            {tenant.notifications?.filter((n:any)=>n.type==='DOCUMENTO').length === 0 && (
              <span className="text-xs text-silver-dark italic">Nenhum documento recente.</span>
            )}
          </div>
        </div>

        <div className="glass-panel border-onyx/20 dark:border-white/10 rounded-2xl p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2"><UploadCloud size={18} className="text-silver-dark"/> Enviados (Guias & Folha)</h4>
          <p className="text-sm text-silver-dark">Arquivos enviados pela contabilidade ficarão visíveis para o cliente.</p>
          <div className="mt-4 flex flex-col gap-2">
            {sentFiles.map((file, idx) => (
               <div key={idx} className="p-3 bg-background rounded-lg border border-onyx/10 dark:border-white/5 flex justify-between items-center">
                 <span className="text-sm font-mono">{file}</span>
                 <span className="text-xs text-green-500 font-bold">Enviado hoje</span>
               </div>
            ))}
            {sentFiles.length === 0 && (
              <span className="text-xs text-silver-dark italic">Você ainda não enviou documentos para este cliente.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DepartamentoPessoalTab({ tenant }: { tenant: any }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Colaboradores da Empresa</h3>
      </div>

      <div className="glass-panel border-onyx/20 dark:border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-onyx/5 dark:bg-white/5 text-silver-dark uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Cargo / Função</th>
              <th className="px-6 py-4">Vínculo</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-onyx/10 dark:divide-white/5">
            {tenant.employees?.map((emp: any) => (
              <tr key={emp.id}>
                <td className="px-6 py-4 font-bold">{emp.name}</td>
                <td className="px-6 py-4">{emp.role || "Não informado"}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-500">CLT</span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button onClick={() => alert("Mostra os dados completos do eSocial do funcionário.")} className="text-xs font-bold text-silver-dark hover:text-gold transition-colors">Detalhes</button>
                </td>
              </tr>
            ))}
            {tenant.partners?.map((partner: any) => (
              <tr key={partner.id}>
                <td className="px-6 py-4 font-bold">{partner.name}</td>
                <td className="px-6 py-4">Sócio-Administrador</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-gold/20 text-gold">SÓCIO</span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-xs font-bold text-silver-dark hover:text-gold transition-colors">Detalhes</button>
                </td>
              </tr>
            ))}
            {(!tenant.employees?.length && !tenant.partners?.length) && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-silver-dark">Nenhum colaborador registrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -----------------------------------------------------
// Modals
// -----------------------------------------------------

function UpgradeModal({ plans, currentPlanId, onClose, onConfirm, processing }: any) {
  const [selected, setSelected] = useState(currentPlanId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-background border border-gold/30 p-8 rounded-2xl max-w-xl w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-silver-dark hover:text-foreground"><X size={24}/></button>
        
        <h3 className="text-xl font-bold mb-1">Alterar Plano do Cliente</h3>
        <p className="text-sm text-silver-dark mb-6">Selecione o novo plano aplicável para este contrato.</p>

        <div className="flex flex-col gap-3">
          {plans.map((p: any) => (
            <div 
              key={p.id} 
              onClick={() => setSelected(p.id)}
              className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all
                ${selected === p.id ? 'border-gold bg-gold/5' : 'border-onyx/20 dark:border-white/10 hover:border-gold/50'}
              `}
            >
              <div>
                <h4 className="font-bold">{p.name}</h4>
                <span className="text-xs text-silver-dark">Até {p.maxEmployees} funcionários</span>
              </div>
              <span className="font-bold text-gold">R$ {p.basePrice} /mês</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-onyx/5 dark:bg-white/5 hover:bg-onyx/10 transition-colors">Cancelar</button>
          <button 
            onClick={() => onConfirm(selected)}
            disabled={processing || selected === currentPlanId}
            className="px-6 py-2.5 rounded-lg font-bold text-sm bg-gold text-onyx hover:bg-gold-hover transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {processing ? <Loader2 size={16} className="animate-spin" /> : null}
            Confirmar Alteração
          </button>
        </div>
      </div>
    </div>
  );
}

function InvoiceModal({ onClose, onConfirm, processing }: any) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-background border border-gold/30 p-8 rounded-2xl max-w-sm w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-silver-dark hover:text-foreground"><X size={24}/></button>
        
        <h3 className="text-xl font-bold mb-1">Cobrança Avulsa</h3>
        <p className="text-sm text-silver-dark mb-6">Lançar valor extra na fatura pendente.</p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-silver-dark">Descrição do Serviço</label>
            <input 
              type="text" 
              value={desc} onChange={(e) => setDesc(e.target.value)}
              placeholder="Ex: Honorário de Defesa Fiscal"
              className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-silver-dark">Valor (R$)</label>
            <input 
              type="number" 
              value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="150.00"
              className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg font-bold text-sm bg-onyx/5 dark:bg-white/5 hover:bg-onyx/10 transition-colors">Cancelar</button>
          <button 
            onClick={() => onConfirm(desc, amount)}
            disabled={processing || !desc || !amount}
            className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-gold text-onyx hover:bg-gold-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing ? <Loader2 size={16} className="animate-spin" /> : null}
            Lançar Fatura
          </button>
        </div>
      </div>
    </div>
  );
}
