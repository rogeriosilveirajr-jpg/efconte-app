import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Mail, Phone, CheckCircle2, Star, ShieldCheck, Briefcase, TrendingUp, Users, Lock } from "lucide-react";
import prisma from "@/lib/prisma";

export const revalidate = 3600; // revalidate at most every hour

export default async function Home() {
  
  let dbPlans: any[] = [];
  try {
    dbPlans = await prisma.plan.findMany({ orderBy: { basePrice: 'asc' } });
  } catch (e) {
    console.error("Failed to fetch plans on homepage", e);
  }

  const BASE_PLANS = [
    {
      id: "start",
      name: "Start",
      price: 199,
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
      price: 349,
      icon: <Star size={28} className="text-gold" />,
      isPopular: true,
      features: [
        "Até 2 Sócios incluídos",
        "Até 3 Funcionários",
        "DRE Semestral",
        "1 Reunião de alinhamento",
        "Suporte prioritário",
      ],
    },
    {
      id: "prime",
      name: "Prime",
      price: 549,
      icon: <ShieldCheck size={28} className="text-gray-500 dark:text-silver-dark" />,
      features: [
        "Até 3 Sócios incluídos",
        "Até 5 Funcionários",
        "DRE Trimestral",
        "Reunião de fechamento",
        "Atendimento Exclusivo",
      ],
    }
  ];

  const plans = BASE_PLANS.map(base => {
    const dbPlan = dbPlans.find((p: any) => p.id === base.id);
    if (dbPlan) {
      return { ...base, name: dbPlan.name, price: dbPlan.basePrice };
    }
    return base;
  });

  return (
    <>
      <Header />
      <div className="flex flex-col items-center p-8 sm:px-20 overflow-x-hidden">
        
        {/* HERO SECTION - TALLER */}
        <main className="flex flex-col gap-12 items-center text-center max-w-5xl w-full min-h-[90vh] justify-center pb-20 relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 dark:bg-gold/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

          <header className="flex flex-col gap-8 items-center z-10">
            {/* Logo Image */}
            <div className="mb-2">
              <Image 
                src="/logo-efconte.png" 
                alt="EFCONTE Logo" 
                width={320} 
                height={260}
                priority
                className="w-auto h-auto max-w-sm drop-shadow-[0_0_25px_rgba(201,169,110,0.3)]"
              />
            </div>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
              A contabilidade que acompanha o <span className="text-gold">seu negócio</span>.
            </h1>
            <p className="text-xl sm:text-2xl text-silver-dark max-w-3xl mt-4 font-medium">
              Sua empresa em dia. Seus números sob controle. Suas decisões mais seguras com tecnologia e proximidade.
            </p>
          </header>
        </main>

        {/* DIFERENCIAIS SECTION */}
        <section id="diferenciais" className="w-full max-w-6xl py-24 flex flex-col items-center border-t border-onyx/10 dark:border-white/10">
          <div className="mb-16 flex flex-col items-center text-center">
            <h2 className="text-sm font-bold text-gold uppercase tracking-widest mb-2">Por que a EFConte?</h2>
            <h3 className="text-3xl md:text-5xl font-bold">Nossos Diferenciais</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-center items-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-2">
                <TrendingUp size={32} />
              </div>
              <h4 className="text-xl font-bold">Foco em Crescimento</h4>
              <p className="text-silver-dark text-sm">Ajudamos você a entender seus números para tomar decisões financeiras que impulsionam o seu negócio.</p>
            </div>
            
            <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-center items-center hover:-translate-y-2 transition-transform duration-300 border-gold/30 relative">
              <div className="absolute -inset-1 bg-gradient-to-b from-gold/20 to-transparent rounded-2xl blur-lg -z-10"></div>
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-onyx mb-2 shadow-[0_0_20px_rgba(201,169,110,0.4)]">
                <Users size={32} />
              </div>
              <h4 className="text-xl font-bold">Portal Exclusivo</h4>
              <p className="text-silver-dark text-sm">Você e seus funcionários têm acesso a um sistema próprio para abrir chamados, pegar faturas e enviar documentos.</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-center items-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-2">
                <Lock size={32} />
              </div>
              <h4 className="text-xl font-bold">Segurança Total</h4>
              <p className="text-silver-dark text-sm">Garantimos que sua empresa cumpra todas as obrigações fiscais sem atrasos, multas ou surpresas indesejadas.</p>
            </div>
          </div>
        </section>

        {/* PLANOS / SERVIÇOS SECTION */}
        <section id="servicos" className="w-full max-w-6xl py-24 border-t border-onyx/10 dark:border-white/10 flex flex-col items-center">
          <div className="mb-16 flex flex-col items-center text-center">
            <h2 className="text-sm font-bold text-gold uppercase tracking-widest mb-2">Transparência</h2>
            <h3 className="text-3xl md:text-5xl font-bold">Planos de Serviço</h3>
            <p className="text-silver-dark mt-4 max-w-xl mx-auto text-lg">
              Escolha o nível de acompanhamento ideal para o estágio da sua empresa. Sem surpresas no final do mês.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`glass-panel rounded-2xl flex flex-col justify-between overflow-hidden relative transition-all duration-300
                  ${plan.isPopular ? 'border-gold shadow-[0_10px_40px_rgba(201,169,110,0.15)] scale-105 z-10' : 'border-onyx/20 dark:border-white/5 hover:border-gold/50'}
                `}
              >
                {plan.isPopular && (
                  <div className="bg-gold text-onyx text-[10px] font-bold uppercase tracking-wider py-2 text-center">
                    Mais Escolhido
                  </div>
                )}
                
                <div className="p-8 flex flex-col gap-6 flex-1">
                  <div className="flex flex-col gap-2">
                    <div className="w-14 h-14 rounded-xl bg-onyx/5 dark:bg-white/5 flex items-center justify-center mb-2">
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-sm font-bold text-silver-dark">R$</span>
                      <span className="text-4xl font-black">{plan.price}</span>
                      <span className="text-sm text-silver-dark">/mês</span>
                    </div>
                  </div>

                  <ul className="flex flex-col gap-3 mt-4 flex-1">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-silver-dark">
                        <CheckCircle2 size={18} className="text-gold flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <a 
                    href={`https://wa.me/5547992187868?text=${encodeURIComponent('Olá! Gostaria de contratar o plano ' + plan.name + ' da EFCONTE.')}`}
                    target="_blank"
                    className={`mt-6 w-full py-3 rounded-lg font-bold text-sm text-center transition-colors flex items-center justify-center gap-2
                      ${plan.isPopular 
                        ? 'bg-gold text-onyx hover:bg-gold-hover shadow-md' 
                        : 'bg-onyx text-gold dark:bg-white/10 dark:hover:bg-gold dark:hover:text-onyx'}
                    `}
                  >
                    Contratar Plano
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SOBRE NÓS SECTION - SMALLER */}
        <section id="sobre" className="w-full max-w-4xl py-24 border-t border-onyx/10 dark:border-white/10 flex flex-col md:flex-row gap-12 items-center justify-center">
          {/* Imagem Eduardo (Menor) */}
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-gold shadow-[0_0_30px_rgba(201,169,110,0.2)]">
              <Image 
                src="/eduardo-efconte.jpg" 
                alt="Eduardo Fernandes - EFCONTE" 
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Texto Sobre Nós (Menor e mais direto) */}
          <div className="w-full md:w-2/3 flex flex-col gap-4 text-center md:text-left">
            <div>
              <h2 className="text-xs font-bold text-gold uppercase tracking-widest mb-1">Sobre Nós</h2>
              <h3 className="text-2xl md:text-3xl font-bold">Experiência e Confiança</h3>
            </div>
            
            <div className="text-silver-dark space-y-3 text-sm md:text-base leading-relaxed">
              <p>
                A <strong>EFCONTE</strong> nasceu da experiência de 8 anos na área contábil, aliada à formação em Ciências Contábeis pela Univille.
              </p>
              <p>
                Unimos conhecimento técnico e vivência prática para compreender os desafios de pessoas e empresas, buscando sempre orientar e apoiar decisões rumo ao crescimento.
              </p>
            </div>

            {/* Contatos (Menores) */}
            <div className="mt-4 flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-silver-dark font-bold uppercase tracking-wider">WhatsApp</span>
                  <a href="https://wa.me/5547992187868" target="_blank" className="font-bold text-sm hover:text-gold transition-colors">(47) 99218-7868</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-silver-dark font-bold uppercase tracking-wider">E-mail</span>
                  <a href="mailto:efconteassessoriacontabil@gmail.com" className="font-bold text-sm hover:text-gold transition-colors">efconteassessoriacontabil@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      
      <Footer />
      <WhatsAppButton />
    </>
  );
}
