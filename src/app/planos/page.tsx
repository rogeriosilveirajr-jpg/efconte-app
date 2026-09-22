export const runtime = "edge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PlansSection from "@/components/PlansSection";

export default function PlanosPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center pt-24 pb-40 px-8 sm:px-20">
        <main className="flex flex-col gap-8 items-center text-center max-w-5xl w-full">
          <header className="flex flex-col gap-4 items-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Nossos <span className="text-gold">Planos</span>
            </h1>
            <p className="text-lg text-silver max-w-2xl">
              Escolha o plano que melhor atende ao momento da sua empresa.
            </p>
          </header>
          
          <PlansSection />
        </main>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
