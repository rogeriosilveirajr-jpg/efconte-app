"use client";
import toast from "react-hot-toast";

import { useState, useEffect } from "react";
import { Users, UserPlus, UserMinus, FileText, Download, Calendar, AlertCircle, ChevronRight, BadgeAlert, Loader2 } from "lucide-react";

export default function DepartamentoPessoalPage() {
  const [activeWizard, setActiveWizard] = useState<'admissao' | 'demissao' | 'ferias' | 'afastamento' | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/employees'),
      fetch('/api/documents')
    ])
      .then(async ([resEmp, resDoc]) => {
        const dataEmp = await resEmp.json();
        const dataDoc = await resDoc.json();
        setEmployees(dataEmp.employees || []);
        if (dataDoc.documents) {
          setDocuments(dataDoc.documents.filter((d: any) => d.type === 'DP'));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDownload = (title: string) => {
    toast(`Iniciando download seguro: ${title}. O arquivo será salvo em PDF.`);
  };

  const handleDownloadAll = () => {
    toast("Iniciando download do pacote completo (ZIP). Contém Folha, Holerites, FGTS e INSS.");
  };

  // Dados mockados baseados na regra de negócio (Plano Gestão: limite de 3)
  const currentEmployees = employees.length;
  const planLimit = 3;
  const usagePercentage = Math.min((currentEmployees / planLimit) * 100, 100);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12 relative">
      
      {/* Header & Limite de Plano */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gold/10 rounded-xl text-gold">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Departamento Pessoal</h1>
            <p className="text-silver-dark text-sm">
              Gestão de colaboradores, holerites e rotinas.
            </p>
          </div>
        </div>

        {/* Tracking de Limites (Business Rule) */}
        <div className="glass-panel border-gold/80 p-4 rounded-xl min-w-[250px]">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-silver-dark uppercase tracking-wider">Uso do Plano (Gestão)</span>
            <span className="text-sm font-bold">{currentEmployees} / {planLimit} vagas</span>
          </div>
          <div className="w-full bg-onyx/10 dark:bg-white/10 rounded-full h-2 overflow-hidden mb-1">
            <div className="bg-gold h-full rounded-full transition-all duration-500" style={{ width: `${usagePercentage}%` }}></div>
          </div>
          <p className="text-[10px] text-silver-dark">Funcionários extras geram R$ 50/mês na fatura.</p>
        </div>
      </section>

      {/* Ações Rápidas */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <ActionButton 
          icon={<UserPlus size={20} />} 
          title="Nova Admissão" 
          desc="R$ 100 por registro" 
          onClick={() => setActiveWizard('admissao')} 
        />
        <ActionButton 
          icon={<UserMinus size={20} />} 
          title="Desligamento" 
          desc="R$ 150 por rescisão"
          onClick={() => setActiveWizard('demissao')} 
        />
        <ActionButton 
          icon={<FileText size={20} />} 
          title="Alterar Dados" 
          desc="Função e Salário"
          onClick={() => setActiveWizard('alterar')} 
        />
        <ActionButton 
          icon={<Calendar size={20} />} 
          title="Férias" 
          desc="Programar período"
          onClick={() => setActiveWizard('ferias')} 
        />
        <ActionButton 
          icon={<BadgeAlert size={20} />} 
          title="Afastamento" 
          desc="Enviar atestado/INSS"
          onClick={() => setActiveWizard('afastamento')} 
        />
      </section>

      {/* Quadro de Funcionários & Guias do Mês */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        
        {/* Tabela de Colaboradores */}
        <div className="lg:col-span-2 glass-panel border-gold/80 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-onyx/10 dark:border-white/5 flex justify-between items-center">
            <h2 className="font-bold text-lg">Quadro de Colaboradores</h2>
          </div>
          
          <div className="overflow-x-auto min-h-[150px]">
            {loading ? (
              <div className="flex items-center justify-center h-full py-8 text-silver-dark">
                <Loader2 size={24} className="animate-spin" />
              </div>
            ) : employees.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-silver-dark">
                <Users size={32} className="mb-2 opacity-50" />
                <p>Nenhum colaborador registrado.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-onyx/5 dark:bg-white/5 text-silver-dark uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Nome do Funcionário</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-onyx/10 dark:divide-white/5">
                  {employees.map(emp => (
                    <tr 
                      key={emp.id} 
                      onClick={() => setSelectedEmployee(emp)}
                      className="hover:bg-onyx/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-bold">{emp.name}</td>
                      <td className="px-6 py-4"><span className="text-xs bg-green-500/20 text-green-500 font-bold px-2 py-1 rounded">Ativo</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Folha e Guias do Mês */}
        <div className="glass-panel border-onyx/20 dark:border-white/10 rounded-2xl flex flex-col">
          <div className="p-6 border-b border-onyx/10 dark:border-white/5">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FileText size={20} className="text-gold" />
              Folha: {new Date().toLocaleString('pt-BR', { month: 'long' }).charAt(0).toUpperCase() + new Date().toLocaleString('pt-BR', { month: 'long' }).slice(1)}/{new Date().getFullYear()}
            </h2>
          </div>
          
          <div className="p-6 flex flex-col gap-4">
            {documents.length === 0 ? (
              <p className="text-sm text-silver-dark text-center py-4">
                Nenhum documento de folha enviado ainda.
              </p>
            ) : (
              documents.map(doc => (
                <DocumentDownload 
                  key={doc.id}
                  title={doc.title} 
                  status="Disponível" 
                  onClick={() => window.open(doc.fileUrl, '_blank')}
                />
              ))
            )}
            
            <button 
              onClick={() => toast('O pacote ZIP estara disponivel assim que todos os documentos da folha forem fechados pelo contador.')}
              className="mt-4 w-full py-2 bg-onyx/5 dark:bg-white/5 border border-onyx/20 dark:border-white/10 hover:border-gold hover:text-gold rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} /> Baixar Pacote Completo
            </button>
          </div>
        </div>

      </section>

      {/* WIZARDS RENDER */}
      {activeWizard === 'admissao' && (
        <AdmissionWizard 
          onClose={() => setActiveWizard(null)}
          onSuccess={(employeeName) => {
            setEmployees(prev => [...prev, { id: Date.now().toString(), name: employeeName }]);
            setActiveWizard(null);
          }}
        />
      )}

      {activeWizard === 'demissao' && (
        <TerminationWizard 
          employees={employees}
          onClose={() => setActiveWizard(null)}
          onSuccess={(id) => {
            setEmployees(prev => prev.filter(e => e.id !== id));
            setActiveWizard(null);
          }}
        />
      )}

      {activeWizard === 'ferias' && (
        <VacationWizard 
          employees={employees}
          onClose={() => setActiveWizard(null)}
          onSuccess={() => setActiveWizard(null)}
        />
      )}

      {activeWizard === 'afastamento' && (
        <LeaveWizard 
          employees={employees}
          onClose={() => setActiveWizard(null)}
          onSuccess={() => setActiveWizard(null)}
        />
      )}

      {activeWizard === 'alterar' && (
        <AlterarDadosWizard 
          employees={employees}
          onClose={() => setActiveWizard(null)}
          onSuccess={() => {
            fetch('/api/employees')
              .then(res => res.json())
              .then(data => {
                if (data.employees) setEmployees(data.employees);
              });
            setActiveWizard(null);
          }}
        />
      )}

      {/* MODAL DE DETALHES DO COLABORADOR */}
      {selectedEmployee && (
        <EmployeeDetailsModal 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
        />
      )}

    </div>
  );
}

// Subcomponente do Wizard de Admissão
function AdmissionWizard({ onClose, onSuccess }: { onClose: () => void, onSuccess: (name: string) => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    salary: "",
    startDate: "",
    file: null as File | null
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          role: formData.role, 
          salary: formData.salary ? parseFloat(formData.salary.replace(/[^\d.,]/g, '').replace(',', '.')) : null
        })
      });
      if (res.ok) {
        onSuccess(formData.name);
      } else {
        const errorData = await res.json().catch(() => ({})) as any;
        toast.error(`Erro ao processar: ${errorData.error || res.statusText}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-background border border-gold/30 p-8 rounded-2xl max-w-lg w-full shadow-2xl relative">
        
        {/* Wizard Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
              <UserPlus size={24} className="text-gold" /> Nova Admissão
            </h3>
            <p className="text-sm text-silver-dark">Passo {step} de 3</p>
          </div>
          <button onClick={onClose} className="text-silver-dark hover:text-foreground">
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-gold' : 'bg-onyx/10 dark:bg-white/10'}`}></div>
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-gold' : 'bg-onyx/10 dark:bg-white/10'}`}></div>
          <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-gold' : 'bg-onyx/10 dark:bg-white/10'}`}></div>
        </div>
        
        {/* Step 1: Dados do Contrato */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-silver-dark">Nome Completo</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: João da Silva" 
                className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-silver-dark">Cargo</label>
              <input 
                type="text" 
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                placeholder="Ex: Auxiliar Administrativo" 
                className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-silver-dark">Salário Base (R$)</label>
                <input 
                  type="text" 
                  value={formData.salary}
                  onChange={e => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="2.500,00" 
                  className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-silver-dark">Início Previsto</label>
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold text-foreground" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Documentação */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-sm text-foreground/90 font-medium">
              Envie os documentos do {formData.name || 'colaborador'}.
            </p>
            <p className="text-xs text-silver-dark mb-2">
              Você pode compactar RG, CPF, Comprovante de Endereço e ASO em um único arquivo PDF ou ZIP.
            </p>
            
            <label className="border-2 border-dashed border-onyx/20 dark:border-white/20 hover:border-gold/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group bg-onyx/5 dark:bg-white/5">
              <input 
                type="file" 
                className="hidden" 
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFormData({ ...formData, file: e.target.files[0] });
                  }
                }}
              />
              <FileText size={32} className="text-silver-dark group-hover:text-gold transition-colors" />
              <div className="text-center">
                <span className="text-sm font-bold block group-hover:text-gold transition-colors">
                  {formData.file ? formData.file.name : "Clique para anexar o arquivo"}
                </span>
                <span className="text-xs text-silver-dark">Máximo 10MB (PDF, JPG, ZIP)</span>
              </div>
            </label>
          </div>
        )}

        {/* Step 3: Confirmação e Faturamento */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-onyx/5 dark:bg-white/5 p-4 rounded-lg border border-onyx/10 dark:border-white/10 flex flex-col gap-2">
              <h4 className="font-bold text-sm border-b border-onyx/10 dark:border-white/10 pb-2 mb-1">Resumo da Admissão</h4>
              <div className="flex justify-between text-sm">
                <span className="text-silver-dark">Colaborador:</span>
                <span className="font-bold">{formData.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-silver-dark">Cargo:</span>
                <span className="font-bold">{formData.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-silver-dark">Documentos:</span>
                <span className="font-bold text-green-500">{formData.file ? "Anexado" : "Pendente"}</span>
              </div>
            </div>

            <div className="bg-gold/10 border border-gold/20 p-4 rounded-lg flex items-start gap-3 mt-2">
              <AlertCircle size={20} className="text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/90 leading-relaxed">
                Ao confirmar, nossa equipe iniciará o registro no eSocial. O valor de <strong>R$ 100,00</strong> pelo serviço avulso de admissão será faturado de forma transparente junto à sua próxima mensalidade.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer (Navigation) */}
        <div className="flex items-center gap-3 mt-8 pt-4 border-t border-onyx/10 dark:border-white/5">
          {step > 1 ? (
            <button onClick={handlePrev} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-onyx/5 dark:bg-white/5 hover:bg-onyx/10 transition-colors">
              Voltar
            </button>
          ) : (
            <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-transparent text-silver-dark hover:text-foreground transition-colors">
              Cancelar
            </button>
          )}
          
          <div className="flex-1"></div>

          {step < 3 ? (
            <button 
              onClick={handleNext} 
              disabled={step === 1 && !formData.name}
              className="px-6 py-2.5 rounded-lg font-bold text-sm bg-onyx text-gold dark:bg-gold dark:text-onyx hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Próximo <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="px-6 py-2.5 rounded-lg font-bold text-sm bg-gold text-onyx hover:bg-gold-hover transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? "Processando..." : "Confirmar e Enviar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Subcomponentes
function ActionButton({ icon, title, desc, onClick }: any) {
  return (
    <div onClick={onClick} className="glass-panel border-onyx/20 dark:border-white/10 hover:border-gold p-4 rounded-xl flex flex-col items-start gap-2 cursor-pointer transition-all group">
      <div className="text-silver-dark group-hover:text-gold transition-colors">
        {icon}
      </div>
      <div>
        <span className="block font-bold text-sm">{title}</span>
        <span className="text-[10px] text-silver-dark uppercase tracking-wider">{desc}</span>
      </div>
    </div>
  );
}

function DocumentDownload({ title, status, isPending = false, onClick }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-onyx/10 dark:border-white/10 bg-background group hover:border-gold/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isPending ? 'bg-onyx/5 dark:bg-white/5' : 'bg-green-500/10 text-green-500'}`}>
          <FileText size={16} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm">{title}</span>
          <span className={`text-[10px] uppercase tracking-wider font-bold ${isPending ? 'text-silver-dark' : 'text-green-500'}`}>
            {status}
          </span>
        </div>
      </div>
      {!isPending && (
        <button onClick={onClick} className="text-silver-dark group-hover:text-gold transition-colors p-2">
          <Download size={18} />
        </button>
      )}
    </div>
  );
}

// ----------------------------------------------------
// WIZARD DE DESLIGAMENTO
// ----------------------------------------------------
function TerminationWizard({ employees, onClose, onSuccess }: { employees: any[], onClose: () => void, onSuccess: (id: string) => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    reason: "sem_justa_causa",
    lastDate: "",
    noticePeriod: "trabalhado"
  });

  const selectedEmp = employees.find(e => e.id === formData.employeeId);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employees', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: formData.employeeId })
      });
      if (res.ok) {
        onSuccess(formData.employeeId);
      } else {
        const errorData = await res.json().catch(() => ({})) as any;
        toast.error(`Erro ao processar: ${errorData.error || res.statusText}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-background border border-gold/30 p-8 rounded-2xl max-w-lg w-full shadow-2xl relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
              <UserMinus size={24} className="text-gold" /> Desligamento
            </h3>
            <p className="text-sm text-silver-dark">Passo {step} de 2</p>
          </div>
          <button onClick={onClose} className="text-silver-dark hover:text-foreground">✕</button>
        </div>

        <div className="flex gap-2 mb-8">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-gold' : 'bg-onyx/10 dark:bg-white/10'}`}></div>
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-gold' : 'bg-onyx/10 dark:bg-white/10'}`}></div>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-silver-dark">Selecionar Colaborador</label>
              <select 
                value={formData.employeeId}
                onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold"
              >
                <option value="">Selecione...</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-silver-dark">Motivo (Conforme CLT)</label>
              <select 
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold"
              >
                <option value="sem_justa_causa">Demissão sem justa causa</option>
                <option value="pedido_demissao">Pedido de demissão</option>
                <option value="termino_contrato">Término de contrato (experiência)</option>
                <option value="com_justa_causa">Demissão por justa causa</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-silver-dark">Aviso Prévio</label>
                <select 
                  value={formData.noticePeriod}
                  onChange={e => setFormData({ ...formData, noticePeriod: e.target.value })}
                  className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold"
                >
                  <option value="trabalhado">Trabalhado</option>
                  <option value="indenizado">Indenizado</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-silver-dark">Último dia</label>
                <input 
                  type="date" 
                  value={formData.lastDate}
                  onChange={e => setFormData({ ...formData, lastDate: e.target.value })}
                  className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold text-foreground" 
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-onyx/5 dark:bg-white/5 p-4 rounded-lg border border-onyx/10 dark:border-white/10 flex flex-col gap-2">
              <h4 className="font-bold text-sm border-b border-onyx/10 dark:border-white/10 pb-2 mb-1">Resumo da Rescisão</h4>
              <div className="flex justify-between text-sm">
                <span className="text-silver-dark">Colaborador:</span>
                <span className="font-bold">{selectedEmp?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-silver-dark">Último dia:</span>
                <span className="font-bold">{formData.lastDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-silver-dark">Documento exigido:</span>
                <span className="font-bold text-gold">ASO Demissional</span>
              </div>
            </div>

            <div className="bg-gold/10 border border-gold/20 p-4 rounded-lg flex items-start gap-3 mt-2">
              <AlertCircle size={20} className="text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/90 leading-relaxed">
                Nós faremos o cálculo da rescisão, guia do FGTS rescisório e comunicação ao eSocial. 
                Serviço avulso faturado: <strong>R$ 150,00</strong>.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mt-8 pt-4 border-t border-onyx/10 dark:border-white/5">
          {step > 1 ? (
            <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-onyx/5 dark:bg-white/5 hover:bg-onyx/10 transition-colors">Voltar</button>
          ) : (
            <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-transparent text-silver-dark hover:text-foreground transition-colors">Cancelar</button>
          )}
          <div className="flex-1"></div>
          {step < 2 ? (
            <button onClick={() => setStep(2)} disabled={!formData.employeeId || !formData.lastDate} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-onyx text-gold dark:bg-gold dark:text-onyx hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
              Próximo <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-gold text-onyx hover:bg-gold-hover transition-colors flex items-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null} Confirmar Rescisão
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// WIZARD DE FÉRIAS
// ----------------------------------------------------
function VacationWizard({ employees, onClose, onSuccess }: { employees: any[], onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    startDate: "",
    days: "30",
    sellAllowance: "nao"
  });

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-background border border-gold/30 p-8 rounded-2xl max-w-lg w-full shadow-2xl relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
              <Calendar size={24} className="text-gold" /> Programar Férias
            </h3>
            <p className="text-sm text-silver-dark">Aviso legal: 30 dias de antecedência mínima.</p>
          </div>
          <button onClick={onClose} className="text-silver-dark hover:text-foreground">✕</button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-silver-dark">Selecionar Colaborador</label>
            <select 
              value={formData.employeeId}
              onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold"
            >
              <option value="">Selecione...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-silver-dark">Data de Início</label>
              <input 
                type="date" 
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold text-foreground" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-silver-dark">Dias de Gozo</label>
              <select 
                value={formData.days}
                onChange={e => setFormData({ ...formData, days: e.target.value })}
                className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold"
              >
                <option value="30">30 dias</option>
                <option value="20">20 dias</option>
                <option value="15">15 dias</option>
                <option value="10">10 dias</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-silver-dark">Abono Pecuniário ("Vender 1/3")</label>
            <select 
              value={formData.sellAllowance}
              onChange={e => setFormData({ ...formData, sellAllowance: e.target.value })}
              className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold"
            >
              <option value="nao">Não</option>
              <option value="sim" disabled={formData.days !== "20"}>Sim (Requer Gozo de 20 dias)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8 pt-4 border-t border-onyx/10 dark:border-white/5 justify-end">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-transparent text-silver-dark hover:text-foreground transition-colors">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading || !formData.employeeId || !formData.startDate} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-gold text-onyx hover:bg-gold-hover transition-colors flex items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : null} Enviar Recibo
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// WIZARD DE AFASTAMENTO
// ----------------------------------------------------
function LeaveWizard({ employees, onClose, onSuccess }: { employees: any[], onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    reason: "doenca",
    startDate: "",
    file: null as File | null
  });

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-background border border-gold/30 p-8 rounded-2xl max-w-lg w-full shadow-2xl relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
              <BadgeAlert size={24} className="text-gold" /> Comunicar Afastamento
            </h3>
            <p className="text-sm text-silver-dark">Para INSS, Licença Maternidade ou atestados longos.</p>
          </div>
          <button onClick={onClose} className="text-silver-dark hover:text-foreground">✕</button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-silver-dark">Selecionar Colaborador</label>
            <select 
              value={formData.employeeId}
              onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold"
            >
              <option value="">Selecione...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-silver-dark">Motivo do Afastamento</label>
              <select 
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold"
              >
                <option value="doenca">Auxílio Doença (Mais de 15 dias)</option>
                <option value="maternidade">Licença Maternidade</option>
                <option value="acidente">Acidente de Trabalho (CAT)</option>
                <option value="exercito">Serviço Militar</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-silver-dark">Data de Início</label>
              <input 
                type="date" 
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold text-foreground" 
              />
            </div>
          </div>

          <label className="border-2 border-dashed border-onyx/20 dark:border-white/20 hover:border-gold/50 rounded-xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors group mt-2">
            <input type="file" className="hidden" onChange={e => { if (e.target.files) setFormData({...formData, file: e.target.files[0]}) }} />
            <span className="text-sm font-bold group-hover:text-gold transition-colors">{formData.file ? formData.file.name : "Anexar Atestado / Laudo Médico"}</span>
          </label>
        </div>

        <div className="flex items-center gap-3 mt-8 pt-4 border-t border-onyx/10 dark:border-white/5 justify-end">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-transparent text-silver-dark hover:text-foreground transition-colors">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading || !formData.employeeId || !formData.startDate} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-gold text-onyx hover:bg-gold-hover transition-colors flex items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : null} Enviar Documentação
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// MODAL DE DETALHES DO FUNCIONÁRIO
// ----------------------------------------------------
function EmployeeDetailsModal({ employee, onClose }: { employee: any, onClose: () => void }) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-background border border-gold/30 p-8 rounded-2xl max-w-md w-full shadow-2xl relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
              <Users size={24} className="text-gold" /> Detalhes do Colaborador
            </h3>
          </div>
          <button onClick={onClose} className="text-silver-dark hover:text-foreground">✕</button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-onyx/5 dark:bg-white/5 p-4 rounded-lg border border-onyx/10 dark:border-white/10 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-silver-dark tracking-wider">Nome Completo</span>
              <span className="font-bold text-sm">{employee.name}</span>
            </div>
            
            <div className="flex justify-between items-center border-t border-onyx/10 dark:border-white/5 pt-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-silver-dark tracking-wider">Cargo</span>
                <span className="font-bold text-sm">{employee.role || 'Não informado'}</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] uppercase font-bold text-silver-dark tracking-wider">Status</span>
                <span className="text-xs bg-green-500/20 text-green-500 font-bold px-2 py-1 rounded inline-block">Ativo</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-onyx/10 dark:border-white/5 pt-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-silver-dark tracking-wider">Data de Admissão</span>
                <span className="font-bold text-sm">--/--/----</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] uppercase font-bold text-silver-dark tracking-wider">Salário Base</span>
                <span className="font-bold text-sm">{employee.salary ? `R$ ${employee.salary.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 'R$ --'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mt-2">
            <button onClick={() => setActiveWizard('alterar')} className="w-full text-xs text-silver-dark hover:text-gold border border-silver-dark/30 hover:border-gold py-1.5 rounded transition-colors">
              Alterar Função / Salário
            </button>
            <p className="text-[10px] text-silver-dark text-center mt-1">Para gerar recibos ou solicitar férias/desligamento, utilize as ações rápidas.</p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-onyx/10 dark:border-white/5 text-right">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-onyx text-gold dark:bg-gold dark:text-onyx hover:opacity-90 transition-opacity">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function AlterarDadosWizard({ employees, onClose, onSuccess }: { employees: any[], onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    role: "",
    salary: ""
  });

  const selectedEmp = employees.find(e => e.id === formData.employeeId);

  // When selecting an employee, populate existing data
  useEffect(() => {
    if (selectedEmp) {
      setFormData(prev => ({
        ...prev,
        role: selectedEmp.role || "",
        salary: selectedEmp.salary ? selectedEmp.salary.toString() : ""
      }));
    }
  }, [selectedEmp]);

  const handleSubmit = async () => {
    if (!formData.employeeId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/employees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.employeeId,
          role: formData.role,
          salary: formData.salary ? parseFloat(formData.salary.replace(/[^\d.,]/g, '').replace(',', '.')) : null
        })
      });
      if (res.ok) {
        onSuccess();
      } else {
        const errorData = await res.json().catch(() => ({})) as any;
        toast.error(`Erro ao processar: ${errorData.error || res.statusText}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-background border border-gold/30 p-8 rounded-2xl max-w-lg w-full shadow-2xl relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
              <FileText size={24} className="text-gold" /> Alterar Dados
            </h3>
            <p className="text-sm text-silver-dark">Atualize o cargo e salário do colaborador.</p>
          </div>
          <button onClick={onClose} className="text-silver-dark hover:text-foreground">✕</button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-silver-dark">Selecionar Colaborador</label>
            <select 
              value={formData.employeeId}
              onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold text-foreground"
            >
              <option value="">Selecione...</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          {selectedEmp && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-silver-dark">Novo Cargo</label>
                <input 
                  type="text" 
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Ex: Gerente Administrativo" 
                  className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-silver-dark">Novo Salário Base (R$)</label>
                <input 
                  type="text" 
                  value={formData.salary}
                  onChange={e => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="4.500,00" 
                  className="w-full bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-gold" 
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-onyx/5 dark:bg-white/5 hover:bg-onyx/10 dark:hover:bg-white/10 transition-colors">
            Voltar
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={!formData.employeeId || loading} 
            className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-gold text-onyx hover:bg-gold-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
