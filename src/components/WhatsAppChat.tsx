"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  // Substitua pelo número real do WhatsApp do escritório (apenas números, com código do país)
  const WHATSAPP_NUMBER = "5547992187868";

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(url, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-2xl w-80 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          <div className="bg-[#075E54] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-bold">Fale com a Contabilidade</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
              <X size={16} />
            </button>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#111]">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 bg-white dark:bg-[#252525] p-3 rounded-xl border border-gray-100 dark:border-[#333] inline-block shadow-sm">
              Olá! Em que podemos ajudar hoje? 🚀
            </p>
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Digite sua mensagem..." 
                className="flex-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#444] rounded-full px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#25D366]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-[#25D366] text-white p-2 rounded-full hover:bg-[#128C7E] transition flex-shrink-0"
              >
                <MessageCircle size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center animate-bounce-slow"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}
