"use client";
import Link from "next/link";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileBarChart,
  Handshake,
  CalendarDays,
  Settings,
  LogOut,
  Building,
  Moon,
  Sun
} from "lucide-react";

import { usePathname } from "next/navigation";

export default function AgencyDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 border-r border-onyx/20 dark:border-white/10 flex flex-col justify-between glass-panel hidden md:flex">
        <div>
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-onyx/20 dark:border-white/10">
            <div className="w-8 h-8 bg-gold flex items-center justify-center rounded-sm font-bold text-onyx text-sm mr-3">EF</div>
            <span className="font-bold tracking-widest uppercase">Conte</span>
            <span className="ml-2 px-2 py-0.5 bg-onyx text-gold text-[9px] font-bold rounded uppercase tracking-wider">Admin</span>
          </div>

          {/* Navigation */}
          <nav className="p-4 flex flex-col gap-2">
            <NavItem href="/dashboard/contador" icon={<LayoutDashboard size={20} />} label="Visão Geral" active={pathname === '/dashboard/contador'} />
            <NavItem href="/dashboard/contador/clientes" icon={<Building size={20} />} label="Meus Clientes" active={pathname?.startsWith('/dashboard/contador/clientes')} />
            <NavItem href="/dashboard/contador/faturamento" icon={<FileBarChart size={20} />} label="Faturamento e MRR" active={pathname === '/dashboard/contador/faturamento'} />
            <NavItem href="/dashboard/contador/crm" icon={<Handshake size={20} />} label="CRM Comercial" active={pathname === '/dashboard/contador/crm'} />
            <NavItem href="/dashboard/contador/reunioes" icon={<CalendarDays size={20} />} label="Reuniões Estratégicas" active={pathname === '/dashboard/contador/reunioes'} />
            <NavItem href="/dashboard/contador/loja" icon={<Briefcase size={20} />} label="Loja (Visão Cliente)" active={pathname === '/dashboard/contador/loja'} />
          </nav>
        </div>

        {/* User / Settings Footer */}
        <div className="p-4 border-t border-onyx/20 dark:border-white/10 flex flex-col gap-2">
          <NavItem href="#" icon={<Settings size={20} />} label="Configurações da Agência" />
          <NavItem href="/login" icon={<LogOut size={20} />} label="Sair" isDanger />
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-4 py-2 rounded bg-silver text-foreground hover:bg-silver/80 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? 'Claro' : 'Escuro'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topbar (Mobile Menu & Profile) */}
        <header className="h-16 border-b border-onyx/20 dark:border-white/10 flex items-center justify-between px-6 glass-panel z-10">
          <div className="md:hidden flex items-center">
            <div className="w-8 h-8 bg-gold flex items-center justify-center rounded-sm font-bold text-onyx text-sm">EF</div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-bold">Eduardo Fernandes</span>
              <span className="text-[10px] text-silver-dark uppercase font-bold tracking-wider">Contador / Sócio</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-onyx font-bold">
              EF
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
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
