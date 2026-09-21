"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building, Search, ChevronRight, FileText, Users, AlertCircle, Plus, X, Key, Loader2, CheckCircle2 } from "lucide-react";
import { cnpj as cnpjValidator, cpf as cpfValidator } from 'cpf-cnpj-validator';

type Tenant = {
  id: string;
  name: string;
  cnpj: string;
  _count: { employees: number; partners: number };
  subscription: { plan: { name: string } } | null;
};

export default function MeusClientesPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal de Criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', cnpj: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{email: string, password: string} | null>(null);

  // Novos estados para Validação e ReceitaWS
  const [cnpjError, setCnpjError] = useState("");
  const [isFetchingReceita, setIsFetchingReceita] = useState(false);

  // Mascara e valida CNPJ
  const handleCnpjChange = (value: string) => {
    // Remove tudo que não é número
    const raw = value.replace(/\D/g, '');
    let formatted = raw;
    
    // Define se é CPF (até 11) ou CNPJ (mais de 11)
    if (raw.length <= 11) {
      // Máscara de CPF: 000.000.000-00
      if (raw.length > 3) formatted = raw.replace(/^(\d{3})(\d)/, "$1.$2");
      if (raw.length > 6) formatted = formatted.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
      if (raw.length > 9) formatted = formatted.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
      
      setFormData({ ...formData, cnpj: formatted });

      if (raw.length === 11) {
        if (!cpfValidator.isValid(raw)) {
          setCnpjError("CPF Inválido (dígito verificador incorreto)");
        } else {
          setCnpjError("");
          setIsFetchingReceita(false); // Receita não busca CPF
        }
      } else {
        setCnpjError("");
      }
    } else {
      // Máscara de CNPJ: 00.000.000/0000-00
      if (raw.length > 2) formatted = raw.replace(/^(\d{2})(\d)/, "$1.$2");
      if (raw.length > 5) formatted = formatted.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      if (raw.length > 8) formatted = formatted.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4");
      if (raw.length > 12) formatted = formatted.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
      
      formatted = formatted.substring(0, 18);
      setFormData({ ...formData, cnpj: formatted });

      if (raw.length === 14) {
        if (!cnpjValidator.isValid(raw)) {
          setCnpjError("CNPJ Inválido (dígito verificador incorreto)");
        } else {
          setCnpjError("");
          fetchReceitaWS(raw);
        }
      } else {
        setCnpjError("");
      }
    }
  };

  const fetchReceitaWS = async (rawCnpj: string) => {
    setIsFetchingReceita(true);
    try {
      // Usando API gratuita do ReceitaWS
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${rawCnpj}`);
      if (res.ok) {
        const data = await res.json() as any as any;
        setFormData(prev => ({
          ...prev,
          name: data.razao_social || data.nome_fantasia || prev.name
        }));
      } else {
        setCnpjError("CNPJ não encontrado na Receita Federal");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingReceita(false);
    }
  };


  useEffect(() => {
    fetchTenants();
  }, []);

  async function fetchTenants() {
    try {
      const res = await fetch('/api/admin/tenants');
      const data = await res.json() as any as any;
      setTenants(data.tenants || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json() as any as any;
      if (data.success) {
        setSuccessData({ email: formData.email, password: data.generatedPassword });
        fetchTenants(); // Recarrega a lista
      } else {
        alert("Erro: " + data.error);
      }
    } catch (e) {
      alert("Erro de conexão");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.cnpj.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12 relative">
      
      {/* Header & Search */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building className="text-gold" /> Meus Clientes
          </h1>
          <p className="text-silver-dark text-sm">
            Gerencie as empresas (tenants) da sua carteira e adicione novos clientes.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-dark" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <button 
            onClick={() => { setSuccessData(null); setFormData({name:'', cnpj:'', email:''}); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-onyx font-bold py-2.5 px-6 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus size={18} />
            Novo Cliente
          </button>
        </div>
      </section>

      {/* Lista de Clientes */}
      <section>
        {loading ? (
          <div className="flex justify-center p-12 text-silver-dark">Carregando clientes...</div>
        ) : filteredTenants.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl flex flex-col items-center text-silver-dark">
            <AlertCircle size={48} className="mb-4 opacity-20" />
            <p>Nenhum cliente encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTenants.map((tenant) => (
              <Link href={`/dashboard/contador/clientes/${tenant.id}`} key={tenant.id}>
                <div className="h-full glass-panel border-onyx/20 dark:border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gold/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-onyx/5 dark:bg-white/5 flex items-center justify-center text-gold font-bold text-lg">
                      {tenant.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight group-hover:text-gold transition-colors">{tenant.name}</h3>
                      <p className="text-xs text-silver-dark mt-1 font-mono">{tenant.cnpj || "Sem Documento"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:ml-auto border-t sm:border-t-0 border-onyx/10 dark:border-white/5 pt-4 sm:pt-0">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-silver-dark tracking-wider">Plano</span>
                      <span className="text-xs font-bold bg-gold/10 text-gold px-2 py-0.5 rounded text-center">
                        {tenant.subscription?.plan?.name || "Nenhum"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-center">
                      <span className="text-[10px] uppercase font-bold text-silver-dark tracking-wider">Equipe</span>
                      <span className="text-sm font-bold flex items-center gap-1 justify-center">
                        <Users size={14} className="text-silver-dark" /> {tenant._count.employees + tenant._count.partners}
                      </span>
                    </div>
                    <div className="text-silver-dark group-hover:text-gold transition-colors">
                      <ChevronRight size={20} />
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Modal de Novo Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-onyx-light border border-onyx/10 dark:border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-onyx/10 dark:border-white/10">
              <h2 className="text-xl font-bold">Adicionar Cliente</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-silver-dark hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {successData ? (
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-2">
                    <Key size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-green-500">Cliente Criado!</h3>
                  <p className="text-sm text-silver-dark">O acesso foi gerado. Copie a senha abaixo e envie para o cliente junto com o link do portal.</p>
                  
                  <div className="w-full bg-onyx/5 dark:bg-black/30 p-4 rounded-lg mt-4 border border-onyx/10 dark:border-white/5 text-left">
                    <p className="text-sm text-silver-dark mb-1">Email (Login):</p>
                    <p className="font-mono font-bold mb-4">{successData.email}</p>
                    <p className="text-sm text-silver-dark mb-1">Senha Provisória:</p>
                    <p className="font-mono text-gold font-bold text-lg">{successData.password}</p>
                  </div>

                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-full mt-4 bg-onyx/10 dark:bg-white/10 hover:bg-onyx/20 dark:hover:bg-white/20 font-bold py-3 rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateClient} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-silver-dark">Nome da Empresa</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-onyx/5 dark:bg-black/20 border border-onyx/10 dark:border-white/10 rounded-lg focus:outline-none focus:border-gold"
                      placeholder="Ex: Tech Solutions Ltda"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-silver-dark">CPF ou CNPJ</label>
                                      <div className="relative">
                      <input 
                        type="text" 
                        required
                        value={formData.cnpj}
                        onChange={(e) => handleCnpjChange(e.target.value)}
                        className={`w-full px-4 py-3 bg-onyx/5 dark:bg-black/20 border ${cnpjError ? 'border-red-500' : 'border-onyx/10 dark:border-white/10'} rounded-lg focus:outline-none focus:border-gold pr-10`}
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      />
                      {isFetchingReceita && <Loader2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gold" />}
                      {!isFetchingReceita && formData.cnpj.length === 18 && !cnpjError && <CheckCircle2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
                    </div>
                    {cnpjError && <p className="text-red-500 text-xs mt-1 font-bold">{cnpjError}</p>}
                    {!cnpjError && formData.cnpj.length === 18 && formData.name && <p className="text-green-500 text-xs mt-1">✓ Razão Social preenchida via Receita Federal</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-silver-dark">Email do Responsável (Login)</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-onyx/5 dark:bg-black/20 border border-onyx/10 dark:border-white/10 rounded-lg focus:outline-none focus:border-gold"
                      placeholder="contato@empresa.com"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-gold hover:bg-gold-light text-onyx font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Criando..." : "Gerar Acesso do Cliente"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
