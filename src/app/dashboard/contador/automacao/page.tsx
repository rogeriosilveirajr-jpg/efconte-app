"use client";

import { useState } from "react";
import { Settings, RefreshCw, FileText, DownloadCloud, CheckCircle2, AlertCircle } from "lucide-react";

export default function AutomacaoFiscalPage() {
  const [syncStatus, setSyncStatus] = useState<Record<string, 'idle' | 'syncing' | 'done' | 'error'>>({
    nfe: 'idle',
    cnd: 'idle',
    ecac: 'idle',
  });

  const simulateSync = (type: string) => {
    setSyncStatus(prev => ({ ...prev, [type]: 'syncing' }));
    
    // Simula tempo de rede e scraping
    setTimeout(() => {
      setSyncStatus(prev => ({ ...prev, [type]: 'done' }));
    }, 4500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Settings className="text-gold" /> Robô Fiscal e Automações
        </h1>
        <p className="text-silver-dark mt-2">
          Integrações automatizadas com a Receita Federal, SEFAZ e e-CAC usando Certificado Digital A1.
        </p>
      </div>

      {/* Upgrade Banner for MVP */}
      <div className="bg-gold/10 border border-gold/30 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-gold font-bold text-lg mb-1 flex items-center gap-2">
            <AlertCircle size={20} /> Módulo Avançado (PRO)
          </h3>
          <p className="text-sm text-silver-dark max-w-2xl">
            A captura automática de Notas Fiscais e CNDs requer a contratação do módulo PRO (R$ 800/mês), pois utiliza infraestrutura de alta segurança para armazenamento de Certificados Digitais A1 em nuvem.
          </p>
        </div>
        <button className="whitespace-nowrap px-6 py-3 bg-gold text-onyx font-bold rounded-xl hover:bg-gold-hover transition-all shadow-lg">
          Ativar Automações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* NFe Card */}
        <div className="bg-surface border border-onyx/10 dark:border-white/5 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
            <FileText size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">Captura de Notas Fiscais (SEFAZ)</h3>
          <p className="text-sm text-silver-dark mb-6 flex-1">
            Varredura automática 24/7. Baixa XML e PDF de todas as notas emitidas contra os CNPJs dos seus clientes.
          </p>
          
          <button 
            disabled={syncStatus.nfe !== 'idle'}
            onClick={() => simulateSync('nfe')}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              syncStatus.nfe === 'done' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 
              syncStatus.nfe === 'syncing' ? 'bg-onyx/5 text-silver-dark cursor-not-allowed' :
              'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {syncStatus.nfe === 'syncing' ? <><RefreshCw size={18} className="animate-spin" /> Sincronizando SEFAZ...</> :
             syncStatus.nfe === 'done' ? <><CheckCircle2 size={18} /> Sincronizado (Modo Teste)</> :
             <><DownloadCloud size={18} /> Forçar Sincronização Agora</>}
          </button>
        </div>

        {/* CND Card */}
        <div className="bg-surface border border-onyx/10 dark:border-white/5 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">Monitoramento de CNDs</h3>
          <p className="text-sm text-silver-dark mb-6 flex-1">
            Emissão automática de certidões negativas (Receita, FGTS, TST, Trabalhista). Alertas em caso de débitos.
          </p>
          
          <button 
            disabled={syncStatus.cnd !== 'idle'}
            onClick={() => simulateSync('cnd')}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              syncStatus.cnd === 'done' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 
              syncStatus.cnd === 'syncing' ? 'bg-onyx/5 text-silver-dark cursor-not-allowed' :
              'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            {syncStatus.cnd === 'syncing' ? <><RefreshCw size={18} className="animate-spin" /> Varrendo Portais...</> :
             syncStatus.cnd === 'done' ? <><CheckCircle2 size={18} /> CNDs Validadas (Modo Teste)</> :
             <><DownloadCloud size={18} /> Checar CNDs Agora</>}
          </button>
        </div>

        {/* e-CAC Card */}
        <div className="bg-surface border border-onyx/10 dark:border-white/5 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">Caixa Postal e-CAC</h3>
          <p className="text-sm text-silver-dark mb-6 flex-1">
            Leitura robótica das mensagens da Receita Federal. Alertas sobre exclusão do Simples Nacional ou pendências.
          </p>
          
          <button 
            disabled={syncStatus.ecac !== 'idle'}
            onClick={() => simulateSync('ecac')}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              syncStatus.ecac === 'done' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 
              syncStatus.ecac === 'syncing' ? 'bg-onyx/5 text-silver-dark cursor-not-allowed' :
              'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {syncStatus.ecac === 'syncing' ? <><RefreshCw size={18} className="animate-spin" /> Acessando e-CAC...</> :
             syncStatus.ecac === 'done' ? <><CheckCircle2 size={18} /> Caixa Postal Lida (Modo Teste)</> :
             <><DownloadCloud size={18} /> Ler Caixa Postal Agora</>}
          </button>
        </div>

      </div>
    </div>
  );
}
