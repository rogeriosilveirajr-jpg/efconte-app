import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Mail, Phone } from "lucide-react";

export default function Home() {
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
