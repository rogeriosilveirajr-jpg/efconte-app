"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY + 10) {
        // scrolling down
        setShowHeader(false);
      } else if (currentY < lastScrollY - 10) {
        // scrolling up
        setShowHeader(true);
      }
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`bg-background border-b border-silver sticky top-0 relative z-40 shadow-sm theme-transition transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo-efconte.png"
              alt="EFCONTE Logo"
              width={60}
              height={50}
              priority
              className="w-auto h-auto max-h-12 drop-shadow-[0_0_5px_var(--brand-gold)]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-silver-dark">
            <button onClick={() => scrollTo('servicos')} className="hover:text-gold transition-colors">Serviços</button>
            <button onClick={() => scrollTo('diferenciais')} className="hover:text-gold transition-colors">Diferenciais</button>
            <button onClick={() => scrollTo('noticias')} className="hover:text-gold transition-colors">Notícias</button>
            <button onClick={() => scrollTo('sobre')} className="hover:text-gold transition-colors">Sobre Nós</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="flex items-center justify-center px-4 py-2 sm:px-6 rounded-lg bg-onyx text-gold dark:bg-gold dark:text-onyx font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity shadow-sm"
            >
              Acessar Portal
            </Link>
            
            {/* Hamburger menu (three bars) */}
            <button className="p-2 text-foreground hover:text-gold transition-colors md:hidden">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
