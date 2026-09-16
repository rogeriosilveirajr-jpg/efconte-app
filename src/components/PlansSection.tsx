import Link from "next/link";

export default function PlansSection() {
  return (
    <section id="planos" className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8 pb-20">
      {/* START */}
      <div className="plan-card rounded-2xl p-8 flex flex-col gap-6 text-left relative overflow-hidden">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold uppercase tracking-wide text-silver">Start</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-silver-dark">R$</span>
            <span className="text-4xl font-bold">199</span>
            <span className="text-sm text-silver-dark">/mês</span>
          </div>
          <p className="text-sm text-silver-dark mt-2 h-10">Ideal para pequenos negócios e baixa complexidade.</p>
        </div>
        <ul className="flex flex-col gap-3 text-sm flex-grow">
          <li className="flex items-center gap-2"><span className="text-gold">✓</span> Apuração de impostos</li>
          <li className="flex items-center gap-2"><span className="text-gold">✓</span> Pró-labore de até 2 sócios</li>
          <li className="flex items-center gap-2"><span className="text-gold">✓</span> DRE anual</li>
          <li className="flex items-center gap-2"><span className="text-gold">✓</span> 0 funcionários inclusos</li>
        </ul>
        <Link href="/login" className="w-full py-3 rounded-lg border border-gold text-gold font-semibold hover:bg-gold hover:text-background transition-colors mt-4 text-center">
          Solicitar Proposta
        </Link>
      </div>

      {/* GESTÃO (Recomendado) */}
      <div className="plan-card rounded-2xl p-8 flex flex-col gap-6 text-left relative overflow-hidden border-gold/50">
        <div className="absolute top-0 right-0 bg-gold text-background text-[10px] font-bold uppercase py-1 px-3 rounded-bl-lg">
          Mais Contratado
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold uppercase tracking-wide text-gold">Gestão</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-silver-dark">R$</span>
            <span className="text-4xl font-bold">349</span>
            <span className="text-sm text-silver-dark">/mês</span>
          </div>
          <p className="text-sm text-silver-dark mt-2 h-10">Recomendado para empresas em crescimento.</p>
        </div>
        <ul className="flex flex-col gap-3 text-sm flex-grow">
          <li className="flex items-center gap-2"><span className="text-gold">✓</span> Tudo do plano Start</li>
          <li className="flex items-center gap-2"><span className="text-gold">✓</span> DRE semestral</li>
          <li className="flex items-center gap-2"><span className="text-gold">✓</span> Reunião de acompanhamento</li>
          <li className="flex items-center gap-2"><span className="text-gold">✓</span> Até 3 funcionários</li>
        </ul>
        <Link href="/login" className="w-full py-3 rounded-lg bg-gold text-background font-semibold hover:bg-gold-hover transition-colors mt-4 text-center">
          Começar Agora
        </Link>
      </div>

      {/* PRIME */}
      <div className="plan-card rounded-2xl p-8 flex flex-col gap-6 text-left relative overflow-hidden">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold uppercase tracking-wide text-silver">Prime</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-silver-dark">R$</span>
            <span className="text-4xl font-bold">549</span>
            <span className="text-sm text-silver-dark">/mês</span>
          </div>
          <p className="text-sm text-silver-dark mt-2 h-10">Contabilidade estratégica para quem quer crescer.</p>
        </div>
        <ul className="flex flex-col gap-3 text-sm flex-grow">
          <li className="flex items-center gap-2"><span className="text-gold">✓</span> Tudo do plano Gestão</li>
          <li className="flex items-center gap-2"><span className="text-gold">✓</span> DRE trimestral</li>
          <li className="flex items-center gap-2"><span className="text-gold">✓</span> Planejamento tributário</li>
          <li className="flex items-center gap-2"><span className="text-gold">✓</span> Até 5 funcionários inclusos</li>
        </ul>
        <Link href="/login" className="w-full py-3 rounded-lg border border-gold text-gold font-semibold hover:bg-gold hover:text-background transition-colors mt-4 text-center">
          Falar com Especialista
        </Link>
      </div>
    </section>
  );
}
