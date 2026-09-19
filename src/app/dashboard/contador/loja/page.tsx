"use client";

import { useState, useEffect } from "react";
import StorePage from "../../cliente/loja/page";
import { Eye, Settings, Save, CheckCircle2, Info } from "lucide-react";

export default function ContadorStorePage() {
  const [activeTab, setActiveTab] = useState("preview");
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/admin/plans');
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (index: number, field: string, value: string) => {
    const newPlans = [...plans];
    if (field === 'basePrice') {
      newPlans[index][field] = value === '' ? '' : (parseFloat(value) || 0);
    } else {
      newPlans[index][field] = value;
    }
    setPlans(newPlans);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const p of plans) {
        await fetch('/api/admin/plans', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: p.id, name: p.name, basePrice: p.basePrice })
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Bar Tabs */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-[#333333] bg-white dark:bg-[#1a1a1a]">
        <button 
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'preview' ? 'bg-[#c9a96e] text-black shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          <Eye size={16} /> Visão do Cliente
        </button>
        <button 
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'config' ? 'bg-[#c9a96e] text-black shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          <Settings size={16} /> Configurar Preços
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-auto">
        {activeTab === 'preview' ? (
          <div className="relative">
            <div className="absolute top-0 right-0 z-50 bg-gray-900 dark:bg-[#111] border-l border-b border-gray-700 dark:border-[#333] text-white text-xs font-bold px-4 py-2 rounded-bl-lg shadow-md flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Visualizando Loja (Tempo Real)
            </div>
            {/* The StorePage fetches its own data now, so it will reflect DB changes immediately on remount, but here we just render it. We could pass a key to force re-render, but usually it works fine */}
            <StorePage />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurar Planos</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Altere o nome e o valor base dos planos. As mudanças refletem instantaneamente na loja do cliente.</p>
              </div>
              <button 
                onClick={handleSave} 
                disabled={saving || loading}
                className="bg-[#c9a96e] text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#b39558] transition-colors shadow-md disabled:opacity-50"
              >
                {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Alterações'}
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Carregando planos...</p>
            ) : (
              <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333333] rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-[#333333] text-gray-600 dark:text-gray-400 text-sm">
                    <tr>
                      <th className="p-4 font-bold">ID do Plano (Interno)</th>
                      <th className="p-4 font-bold">Nome de Exibição</th>
                      <th className="p-4 font-bold">Valor Base Mensal (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-[#333333]">
                    {plans.map((plan, index) => (
                      <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 text-gray-500 dark:text-gray-400 font-mono text-sm uppercase">{plan.id}</td>
                        <td className="p-4">
                          <input 
                            type="text" 
                            value={plan.name} 
                            onChange={(e) => handlePlanChange(index, 'name', e.target.value)}
                            className="w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-[#444] rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-[#c9a96e]"
                          />
                        </td>
                        <td className="p-4">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">R$</span>
                            <input 
                              type="number" 
                              value={plan.basePrice} 
                              onChange={(e) => handlePlanChange(index, 'basePrice', e.target.value)}
                              className="w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-[#444] rounded-md pl-10 pr-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-[#c9a96e] font-medium"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4 flex gap-3 text-blue-800 dark:text-blue-300 text-sm">
              <Info className="shrink-0 mt-0.5" size={18} />
              <p>Os benefícios de cada plano (recursos e limites) continuam sendo gerenciados internamente pela plataforma para garantir a estabilidade do contrato. Apenas os Nomes e Preços de Prateleira são ajustados aqui.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
