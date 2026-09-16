import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center p-8 pb-40 sm:p-20 sm:pb-40">
        
        <main className="flex flex-col gap-12 items-center text-center max-w-5xl w-full pt-8">
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
      </div>
      
      <Footer />
      <WhatsAppButton />
    </>
  );
}
