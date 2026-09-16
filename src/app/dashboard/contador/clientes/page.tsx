"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building, Search, ChevronRight, FileText, Users, AlertCircle } from "lucide-react";

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

  useEffect(() => {
    async function fetchTenants() {
      try {
        const res = await fetch('/api/admin/tenants');
        const data = await res.json();
        setTenants(data.tenants || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.cnpj.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12">
      
      {/* Header & Search */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building className="text-gold" /> Meus Clientes
          </h1>
          <p className="text-silver-dark text-sm">
            Gerencie as empresas (tenants) da sua carteira, planos e limites.
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-dark" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou CNPJ..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
          />
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
                      <p className="text-xs text-silver-dark mt-1 font-mono">{tenant.cnpj || "Sem CNPJ"}</p>
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

    </div>
  );
}
