"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface NewsItem {
  title: string;
  link: string;
}

export default function NewsTicker() {
  const pathname = usePathname();
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // Usamos o RSS2JSON para converter o Feed RSS do G1 Economia em JSON fácil de ler
    const fetchNews = async () => {
      try {
        const feedUrl = "https://g1.globo.com/rss/g1/economia/";
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
        const data = await res.json();
        
        if (data && data.items) {
          // Pega as 10 notícias mais recentes
          setNews(data.items.slice(0, 10));
        }
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
      }
    };

    fetchNews();
  }, []);

  // Não mostrar o ticker na área do cliente (dashboard) nem na tela de login
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/login")) {
    return null;
  }

  if (news.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-background bg-opacity-100 border-t-2 border-gold text-foreground z-50 overflow-hidden h-14 flex items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {/* Container das notícias rolando */}
      <div className="flex-1 overflow-hidden relative w-full h-full">
        <div className="animate-marquee h-full flex items-center">
          {news.map((item, i) => (
            <span key={`news1-${i}`} className="mx-8 text-lg text-foreground flex items-center whitespace-nowrap font-medium">
              <span className="text-gold mr-4 text-sm">✦</span>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                {item.title}
              </a>
            </span>
          ))}
          {/* Duplicado para fazer o loop infinito suavemente */}
          {news.map((item, i) => (
            <span key={`news2-${i}`} className="mx-8 text-lg text-foreground flex items-center whitespace-nowrap font-medium">
              <span className="text-gold mr-4 text-sm">✦</span>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                {item.title}
              </a>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
