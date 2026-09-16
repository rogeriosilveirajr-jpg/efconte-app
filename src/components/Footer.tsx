import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-onyx text-silver py-16 px-8 relative mt-16">
      {/* Gradiente de transição suave */}
      <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-b from-background via-background/50 to-onyx pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Sobre a Empresa */}
        <div className="flex items-start gap-6">
          <img
            src="https://via.placeholder.com/150"
            alt="Contador Mock"
            className="w-36 h-36 rounded-full border-2 border-gold object-cover aspect-square"
          />
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-gold uppercase tracking-wide">Sobre Nós</h3>
            <p className="text-sm leading-relaxed text-silver">
              A EFCONTE é uma assessoria contábil especializada em pequenos e médios negócios. Oferecemos soluções estratégicas para manter sua empresa em dia e seus números sob controle.
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
            <span>(11) 9999-9999</span>
          </div>
          <div className="flex items-center gap-3 text-sm hover:text-gold transition-colors cursor-pointer">
            <Mail size={18} className="text-gold flex-shrink-0" />
            <span>contato@efconte.com.br</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <MapPin size={18} className="text-gold mt-1 flex-shrink-0" />
            <span>São Paulo, SP<br />Brasil</span>
          </div>
        </div>

        {/* Profissional */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-gold uppercase tracking-wide">
            Profissional
          </h3>
          <div className="text-sm">
            <p className="font-semibold text-silver mb-1">Rogerio Silva</p>
            <p className="text-silver-dark">Contador | CRC 1234567</p>
            <p className="text-silver-dark mt-2">
              Especialista em gestão contábil e tributária para micro e pequenas empresas.
            </p>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-silver-dark mb-8"></div>



      {/* Copyright */}
      <div className="text-center text-sm text-silver-dark">
        <p>&copy; {currentYear} EFCONTE Assessoria Contábil. Todos os direitos reservados.</p>
        <p className="mt-2">
          <Link href="#" className="hover:text-gold transition-colors">
            Política de Privacidade
          </Link>
          {" • "}
          <Link href="#" className="hover:text-gold transition-colors">
            Termos de Uso
          </Link>
        </p>
      </div>
    </footer>
  );
}
