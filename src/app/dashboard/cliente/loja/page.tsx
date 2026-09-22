"use client";

import { useState, useEffect } from "react";
import { Store, UserPlus, UserMinus, FileText, CheckCircle2, Info, Star, ShieldCheck, Briefcase } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  features: string[];
  isPopular?: boolean;
};

const BASE_PLANS: Plan[] = [
  {
    id: "start",
    name: "Start",
    price: 347,
    icon: <Briefcase size={28} className="text-gray-500 dark:text-silver-dark" />,
    features: [
      "Até 2 Sócios incluídos",
      "Sem funcionários",
      "DRE Anual",
      "Suporte via Chamado",
    ],
  },
  {
    id: "gestao",
    name: "Gestão",
    price: 547,
    icon: <Star size={28} className="text-[#c9a96e]" />,
    isPopular: true,
    features: [
      "Até 2 Sócios incluídos",
      "Até 3 Funcionários incluídos",
      "DRE Semestral",
      "1 Reunião de alinhamento por semestre",
      "Suporte prioritário",
    ],
  },
  {
    id: "prime",
    name: "Prime",
    price: 1247,
    icon: <ShieldCheck size={28} className="text-gray-500 dark:text-silver-dark" />,
    features: [
      "Até 3 Sócios incluídos",
      "Até 5 Funcionários incluídos",
      "DRE Trimestral",
      "1 Reunião de alinhamento por trimestre",
      "Consultoria financeira dedicada",
    ],
  }
];

const AVULSO_SERVICES = [
  {
    title: "Admissão de Funcionário",
    description: "Processo completo de registro, eSocial e contrato de trabalho.",
    price: 100,
    icon: <UserPlus size={24} />,
  },
  {
    title: "Rescisão Contratual",
    description: "Cálculo de verbas rescisórias, guias, e homologação.",
    price: 150,
    icon: <UserMinus size={24} />,
  },
  {
    title: "Folha Complementar",
    description: "Recálculo de folha devido a atrasos ou ajustes de dissídio.",
    price: 80,
    icon: <FileText size={24} />,
  },
];

export default function StorePage() {
  const [plans, setPlans] = useState<Plan[]>(BASE_PLANS);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [settings, setSettings] = useState<any>({});

  
  useEffect(() => {
    Promise.all([fetch('/api/admin/plans'), fetch('/api/admin/settings')])
      .then(async ([resPlans, resSettings]) => {
        const data = await resPlans.json();
        const settingsData = await resSettings.json();
        
        if (settingsData.settings) {
          const sMap: any = {};
          settingsData.settings.forEach((s: any) => sMap[s.key] = s.value);
          setSettings(sMap);
        }

        if (data.plans) {
          const dynamicPlans = BASE_PLANS.map(base => {
            const dbPlan = data.plans.find((p: any) => p.name.toUpperCase() === base.name.toUpperCase());
            if (dbPlan) {
              return { ...base, name: dbPlan.name, price: dbPlan.basePrice };
            }
            return base;
          });
          setPlans(dynamicPlans);
        }
      })
      .finally(() => setLoadingPlans(false));
  }, []);


  const handleUpgradeClick = (planName: string) => {
    alert(`Obrigado pelo interesse no plano ${planName}! Nossa equipe entrará em contato em breve para realizar o upgrade da sua conta e tirar suas dúvidas.`);
  };

  if (loadingPlans) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold"></div>
        <p className="text-silver-dark text-sm animate-pulse">Carregando catálogo oficial...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gold/10 rounded-xl text-gold">
            <Store size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Planos e Serviços</h1>
            <p className="text-silver-dark text-sm">
              Conheça os planos de contabilidade da EFCONTE e nossos serviços adicionais.
            </p>
          </div>
        </div>

        <div className="bg-onyx/5 dark:bg-white/5 border border-onyx/10 dark:border-white/10 rounded-lg p-4 flex items-start gap-3 mt-4 max-w-4xl">
          <Info size={20} className="text-gold flex-shrink-0 mt-0.5" />
          <div className="text-sm text-silver-dark">
            <strong className="text-foreground">Informações sobre os planos e serviços:</strong><br />
            Aqui você pode conferir o catálogo completo da EFCONTE. Caso queira solicitar demandas operacionais como Admissões, Rescisões ou Férias, por favor acesse a aba <strong className="text-gold">Departamento Pessoal</strong>. Para troca de plano ou orçamentos complexos, acione a nossa equipe!
          </div>
        </div>
      </section>

      {/* SEÇÃO 1: PLANOS EFCONTE */}
      <section>
        <div className="mb-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold">Nossos Planos Mensais</h2>
          <p className="text-silver-dark text-sm mt-1 max-w-xl mx-auto">
            Escolha o nível de acompanhamento ideal para o estágio da sua empresa. Faça o upgrade a qualquer momento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`glass-panel rounded-2xl flex flex-col justify-between overflow-hidden relative transition-all duration-300
                ${plan.isPopular ? 'border-gold shadow-[0_0_20px_rgba(212,175,55,0.15)] scale-105 z-10' : 'border-onyx/30 dark:border-white/15 hover:border-gold/50'}
              `}
            >
              {plan.isPopular && (
                <div className="bg-gold text-onyx text-[10px] font-bold uppercase tracking-wider py-1.5 text-center">
                  Mais Escolhido
                </div>
              )}
              
              <div className="p-8 flex flex-col gap-6 flex-1">
                <div className="flex flex-col gap-2">
                  <div className="w-14 h-14 rounded-xl bg-onyx/5 dark:bg-white/5 flex items-center justify-center mb-2">
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-bold text-silver-dark">R$</span>
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm font-bold text-silver-dark">/mês</span>
                  </div>
                </div>

                <div className="h-px w-full bg-onyx/10 dark:bg-white/10 my-2"></div>

                <ul className="flex flex-col gap-4 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-silver-dark leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <button 
                  onClick={() => handleUpgradeClick(plan.name)}
                  className={`w-full py-3 rounded-lg font-bold text-sm transition-colors
                    ${plan.isPopular 
                      ? 'bg-gold text-onyx hover:bg-gold/90' 
                      : 'bg-onyx/5 dark:bg-white/5 border border-onyx/20 dark:border-white/10 hover:border-gold hover:text-gold'
                    }
                  `}
                >
                  Solicitar Upgrade
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 2: SERVIÇOS AVULSOS (INFORMATIVO) */}
      <section className="mt-8 bg-onyx/5 dark:bg-white/5 rounded-3xl p-8 md:p-12 border border-onyx/10 dark:border-white/10">
        <div className="mb-8 md:text-center">
          <h2 className="text-xl font-bold flex items-center md:justify-center gap-2">
            <FileText size={24} className="text-gold" />
            Tabela de Serviços Avulsos e Excedentes
          </h2>
          <p className="text-silver-dark text-sm mt-2 max-w-xl mx-auto">
            Serviços que não estão incluídos no seu plano ou ultrapassam a franquia são cobrados como adicionais na fatura seguinte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AVULSO_SERVICES.map((service, idx) => (
            <div key={idx} className="bg-background border border-onyx/10 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-2">
                {service.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg">{service.title}</h3>
                <p className="text-xs text-silver-dark mt-1 min-h-[40px]">{service.description}</p>
              </div>
              <div className="mt-auto flex items-end justify-between border-t border-onyx/10 dark:border-white/5 pt-4">
                <span className="text-[10px] uppercase font-bold text-silver-dark tracking-wider">Custo</span>
                <span className="font-bold text-lg">R$ {parseFloat(settings[service.title === "Admissão de Funcionário" ? "price_admissao" : service.title === "Rescisão Contratual" ? "price_rescisao" : "price_folha_extra"] || service.price).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabela de Excedentes */}
        <div className="mt-8 bg-background border border-onyx/10 dark:border-white/10 rounded-xl overflow-hidden">
          <div className="p-4 bg-onyx/5 dark:bg-white/5 border-b border-onyx/10 dark:border-white/10">
            <h4 className="font-bold text-sm">Taxas por Limites Excedentes</h4>
          </div>
          <div className="p-4 flex flex-col sm:flex-row gap-8 justify-around text-center">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold">Funcionário Extra</span>
              <span className="text-gold font-bold">R$ {settings['price_func_extra'] || '50'} /mês</span>
              <span className="text-xs text-silver-dark">Até atingir limite do próximo plano</span>
            </div>
            <div className="hidden sm:block w-px bg-onyx/10 dark:bg-white/10"></div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold">Sócio Extra</span>
              <span className="text-gold font-bold">R$ {settings['price_socio_extra'] || '40'} /mês</span>
              <span className="text-xs text-silver-dark">Faturado recorrentemente</span>
            </div>
            <div className="hidden sm:block w-px bg-onyx/10 dark:bg-white/10"></div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold">Taxa de Setup</span>
              <span className="text-gold font-bold">R$ {settings['price_setup'] || '250'}</span>
              <span className="text-xs text-silver-dark">Apenas p/ contratos não-anuais</span>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
