import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Mail, Phone, CheckCircle2, Star, ShieldCheck, Briefcase } from "lucide-react";
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
      <div className="flex flex-col items-center p-8 sm:p-20">
        
        {/* HERO SECTION */}
        <main className="flex flex-col gap-12 items-center text-center max-w-5xl w-full pt-8 min-h-[60vh] justify-center">
          <header className="flex flex-col gap-6 items-center">
            
            {/* Logo Image */}
            <div className="mb-4">
              <Image 
                src="/logo-efconte.png" 
                alt="EFCONTE Logo" 
                width={280} 
                height={220}
                priority
                className="w-auto h-auto max-w-xs drop-shadow-[0_0_15px_var(--brand-gold)]"
              />
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              A contabilidade que acompanha o <span className="text-gold">seu negócio</span>.
            </h1>
            <p className="text-xl sm:text-2xl text-silver max-w-2xl mt-4">
              Sua empresa em dia. Seus números sob controle.<br />
              Suas decisões mais seguras.
            </p>
          </header>
        </main>

        {/* PLANOS SECTION */}
        <section id="planos" className="w-full max-w-6xl mt-12 pt-20 border-t border-onyx/10 dark:border-white/10 flex flex-col items-center">
          <div className="mb-12 flex flex-col items-center text-center">
            <h2 className="text-sm font-bold text-gold uppercase tracking-widest mb-2">Transparência</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Nossos Planos Mensais</h3>
            <p className="text-silver-dark mt-4 max-w-xl mx-auto text-lg">
              Escolha o nível de acompanhamento ideal para o estágio da sua empresa. Sem surpresas no final do mês.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`glass-panel rounded-2xl flex flex-col justify-between overflow-hidden relative transition-all duration-300
                  ${plan.isPopular ? 'border-gold shadow-[0_0_30px_rgba(201,169,110,0.2)] scale-105 z-10' : 'border-onyx/30 dark:border-white/10 hover:border-gold/50'}
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
                        ? 'bg-gold text-onyx hover:bg-gold-hover' 
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

        {/* SOBRE NÓS SECTION */}
        <section id="sobre" className="w-full max-w-6xl mt-24 pt-20 border-t border-onyx/10 dark:border-white/10 flex flex-col md:flex-row gap-16 items-center">
          {/* Imagem Eduardo */}
          <div className="w-full md:w-5/12 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-gold shadow-[0_0_40px_rgba(201,169,110,0.3)]">
              <Image 
                src="/eduardo-efconte.jpg" 
                alt="Eduardo Fernandes - EFCONTE" 
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Texto Sobre Nós */}
          <div className="w-full md:w-7/12 flex flex-col gap-6 text-center md:text-left">
            <div>
              <h2 className="text-sm font-bold text-gold uppercase tracking-widest mb-2">Sobre Nós</h2>
              <h3 className="text-3xl md:text-4xl font-bold">Experiência e Confiança</h3>
            </div>
            
            <div className="text-silver-dark space-y-4 text-lg leading-relaxed">
              <p>
                A <strong>EFCONTE</strong> nasceu da experiência de 8 anos na área contábil, aliada à formação em Ciências Contábeis pela Univille. Nossa empresa foi criada para oferecer uma contabilidade próxima, clara e responsável, adaptada à realidade de cada cliente.
              </p>
              <p>
                Unimos conhecimento técnico e vivência prática para compreender os desafios de pessoas e empresas. Mais do que cumprir obrigações, buscamos orientar, organizar e apoiar decisões.
              </p>
              <p>
                Na EFCONTE, construímos relações de confiança para ajudar nossos clientes a cuidar melhor de seus negócios.
              </p>
            </div>

            {/* Contatos */}
            <div className="mt-6 flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                  <Phone size={24} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs text-silver-dark font-bold uppercase">WhatsApp</span>
                  <a href="https://wa.me/5547992187868" target="_blank" className="font-bold hover:text-gold transition-colors">(47) 99218-7868</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                  <Mail size={24} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs text-silver-dark font-bold uppercase">E-mail</span>
                  <a href="mailto:efconteassessoriacontabil@gmail.com" className="font-bold hover:text-gold transition-colors">Efconteassessoriacontabil@gmail.com</a>
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
