export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-onyx text-silver py-8 px-8 relative mt-16">
      {/* Gradiente de transição suave */}
      <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-b from-background via-background/50 to-onyx pointer-events-none"></div>

      {/* Copyright */}
      <div className="text-center text-sm text-silver-dark max-w-6xl mx-auto">
        <p>&copy; {currentYear} EFCONTE Assessoria Contábil. Todos os direitos reservados.</p>
        <p className="mt-2 text-xs">
          Powered by <a href="#" className="font-bold text-gold hover:underline">CodeLumen | Technology Agency</a>
        </p>
      </div>
    </footer>
  );
}
