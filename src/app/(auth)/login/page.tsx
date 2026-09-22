"use client";
export const runtime = "edge";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setErrorMsg("Credenciais inválidas. Tente novamente.");
      setLoading(false);
    } else {
      setSuccess(true);
      // Busca o perfil real para direcionar baseado na role, e não no email (evita falha de lógica)
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          setTimeout(() => {
            if (data.user?.role === 'ADMIN') {
              router.push("/dashboard/contador");
            } else {
              router.push("/dashboard/cliente");
            }
          }, 800);
        });
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Left Side - Brand / Value Prop (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 border-r border-onyx/10 dark:border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gold flex items-center justify-center rounded-sm font-bold text-onyx text-xl">EF</div>
          <div className="flex flex-col text-left">
            <span className="font-bold tracking-widest text-lg leading-tight uppercase">Conte</span>
            <span className="text-[10px] text-silver-dark uppercase tracking-widest">Assessoria Contábil</span>
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Inteligência financeira para <span className="text-gold">decisões seguras</span>.
          </h1>
          <p className="text-lg text-silver-dark">
            Acesse seu painel para acompanhar seus números, solicitar serviços do departamento pessoal e visualizar suas obrigações em dia.
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-silver-dark">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-gold" />
            <span>Conexão Segura</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-onyx/20 dark:bg-white/20"></div>
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-gold" />
            <span>Criptografia Ponta a Ponta</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10 relative">
        <div className="w-full max-w-md glass-panel p-10 rounded-2xl border-onyx/20 dark:border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-gold flex items-center justify-center rounded-sm font-bold text-onyx text-lg">EF</div>
            <div className="flex flex-col text-left">
              <span className="font-bold tracking-widest leading-tight uppercase">Conte</span>
              <span className="text-[8px] text-silver-dark uppercase tracking-widest">Assessoria Contábil</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Acesso ao Portal</h2>
            <p className="text-sm text-silver-dark">Insira suas credenciais para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {errorMsg && (
              <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg border border-red-500/20 text-center font-bold">
                {errorMsg}
              </div>
            )}
            {/* Input Email / CNPJ */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-silver-dark">Email ou CNPJ</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-dark" />
                <input 
                  type="text" 
                  required
                  placeholder="empresa@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-onyx/20 dark:border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-silver-dark">Senha</label>
                <a href="#" className="text-xs text-gold hover:underline">Esqueceu a senha?</a>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-dark" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-onyx/20 dark:border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading || success}
              className={`w-full py-3 mt-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300
                ${success 
                  ? "bg-green-500 text-white border border-green-500" 
                  : "bg-gold text-onyx hover:bg-gold-hover hover:scale-[1.02]"
                }
              `}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin text-onyx/70" />
              ) : success ? (
                <>
                  <CheckCircle2 size={20} className="text-white" />
                  Conectado
                </>
              ) : (
                <>
                  Entrar no Painel
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Security Badge Form Footer */}
          <div className="mt-8 pt-6 border-t border-onyx/10 dark:border-white/5 flex flex-col items-center justify-center gap-3 text-xs text-silver-dark">
            <div className="flex items-center gap-2">
              <Lock size={12} />
              <span>Adequado à LGPD e criptografado.</span>
            </div>
            
            {/* CodeForge Signature */}
            <div className="flex items-center gap-1 mt-2 text-[10px] font-medium tracking-wide">
              <span>Desenvolvido por</span>
              <a href="#" className="text-gold font-bold hover:underline transition-all hover:brightness-110 flex items-center gap-1">
                CodeForge Agência
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
