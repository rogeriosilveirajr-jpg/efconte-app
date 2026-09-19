import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-onyx text-silver py-16 px-8 relative mt-16">
      {/* Gradiente de transição suave */}
      <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-b from-background via-background/50 to-onyx pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Sobre a Empresa */}
        <div className="flex items-start gap-6">
          <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-gold flex-shrink-0 shadow-[0_0_15px_rgba(201,169,110,0.2)]">
            <Image
              src="/eduardo-efconte.jpg"
              alt="Eduardo Fernandes"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-gold uppercase tracking-wide">Sobre Nós</h3>
            <p className="text-sm leading-relaxed text-silver">
              Contabilidade próxima, clara e responsável, adaptada à realidade de cada cliente. 8 anos de experiência cuidando dos seus números e guiando decisões.
            </p>
          </div>
        </div>

        {/* Contato */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-gold uppercase tracking-wide">
            Contato
          </h3>
          <div className="flex items-center gap-3 text-sm hover:text-gold transition-colors cursor-pointer">
            <Phone size={18} className="text-gold flex-shrink-0" />
            <a href="https://wa.me/5547992187868" target="_blank">(47) 99218-7868</a>
          </div>
          <div className="flex items-center gap-3 text-sm hover:text-gold transition-colors cursor-pointer break-all">
            <Mail size={18} className="text-gold flex-shrink-0" />
            <a href="mailto:efconteassessoriacontabil@gmail.com">Efconteassessoriacontabil@gmail.com</a>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <MapPin size={18} className="text-gold mt-1 flex-shrink-0" />
            <span>Joinville, SC<br />Brasil</span>
          </div>
        </div>

        {/* Profissional */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-gold uppercase tracking-wide">
            Profissional
          </h3>
          <div className="text-sm">
            <p className="font-semibold text-silver mb-1">Eduardo Fernandes</p>
            <p className="text-silver-dark">Contador Responsável</p>
            <p className="text-silver-dark mt-2">
              Graduado em Ciências Contábeis pela Univille. Especialista em gestão contábil e apoio estratégico a negócios.
            </p>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-silver-dark mb-8"></div>



      {/* Copyright */}
      <div className="text-center text-sm text-silver-dark">
        <p>&copy; {currentYear} EFCONTE Assessoria Contábil. Todos os direitos reservados.</p>
        <p className="mt-2 text-xs">
          Powered by <a href="#" className="font-bold text-gold hover:underline">CodeLumen | Technology Agency</a>
        </p>
      </div>
    </footer>
  );
}
