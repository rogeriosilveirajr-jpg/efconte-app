export const runtime = "edge";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EFCONTE - Assessoria Contábil",
  description: "Contabilidade acessível, próxima e estratégica.",
};


import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#fff',
            },
          },
        }} />
      </body>
    </html>
  );
}
