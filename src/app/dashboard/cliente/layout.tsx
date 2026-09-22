"use client";
export const runtime = "edge";
import Link from "next/link";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Store,
  CreditCard,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu
} from "lucide-react";
import WhatsAppChat from "@/components/WhatsAppChat";

export default function ClientDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`flex h-screen overflow-hidden bg-background ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar (Desktop) */}
      <aside className="w-64 border-r border-gold/80 flex flex-col justify-between glass-panel hidden md:flex">
        <div>
          {/* Navigation */}
          <nav className="p-4 flex flex-col gap-2">
            <NavItem href="/dashboard/cliente" icon={<LayoutDashboard size={20} />} label="Visão Geral" active />
            <NavItem href="/dashboard/cliente/loja" icon={<Store size={20} />} label="Loja de Serviços" />
            <NavItem href="/dashboard/cliente/documentos" icon={<FileText size={20} />} label="Documentos" />
            <NavItem href="/dashboard/cliente/contratos" icon={<FileText size={20} />} label="Contratos" />
            <NavItem href="/dashboard/cliente/dp" icon={<Users size={20} />} label="Departamento Pessoal" />
            <NavItem href="/dashboard/cliente/faturas" icon={<CreditCard size={20} />} label="Faturas" />
          </nav>
        </div>

        {/* User / Settings Footer */}
        <div className="p-4 border-t border-gold/80 flex flex-col gap-2">
          <NavItem href="#" icon={<Settings size={20} />} label="Configurações" />
          <NavItem href="/login" icon={<LogOut size={20} />} label="Sair" isDanger />
          <button onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-onyx/5 dark:hover:bg-white/5 text-sm font-medium">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? "Claro" : "Escuro"}</span>
          </button>
          
          <div className="mt-4 pt-4 border-t border-onyx/10 dark:border-white/5 flex flex-col items-center gap-1 text-[9px] text-silver-dark uppercase tracking-wider">
            <span>Powered by</span>
            <a href="#" className="text-gold font-bold hover:underline">CodeForge Agência</a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-onyx/10 dark:border-white/5 bg-background z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold flex items-center justify-center rounded-sm font-bold text-onyx text-xs">EF</div>
            <span className="font-bold tracking-widest text-sm uppercase">Conte</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:text-gold transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-onyx/10 dark:border-white/5 flex flex-col p-4 gap-2 z-30 shadow-xl">
            <NavItem href="/dashboard/cliente" icon={<LayoutDashboard size={20} />} label="Visão Geral" />
            <NavItem href="/dashboard/cliente/loja" icon={<Store size={20} />} label="Loja de Serviços" />
            <NavItem href="/dashboard/cliente/dp" icon={<Users size={20} />} label="Departamento Pessoal" />
            <div className="border-t border-onyx/10 dark:border-white/5 my-2"></div>
            <NavItem href="/login" icon={<LogOut size={20} />} label="Sair" isDanger />
          </div>
        )}

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>

        <WhatsAppChat />
      </div>
    </div>
  );
}

// NavItem Helper Component
function NavItem({
  href,
  icon,
  label,
  active = false,
  isDanger = false,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
  isDanger?: boolean;
}) {
  const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer text-sm font-medium";
  const activeClasses = active
    ? "bg-onyx text-gold dark:bg-white/10 dark:text-gold"
    : "text-silver-dark hover:bg-onyx/5 hover:text-onyx dark:hover:bg-white/5 dark:hover:text-silver";
  const dangerClasses = isDanger ? "text-red-500 hover:bg-red-500/10" : "";

  return (
    <Link href={href} className={`${baseClasses} ${isDanger ? dangerClasses : activeClasses}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}
