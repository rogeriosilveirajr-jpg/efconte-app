"use client";

import Link from "next/link";

export default function WhatsAppButton() {
  const whatsappNumber = "5511999999999"; // Número do WhatsApp (sem formatação)
  const whatsappMessage = "Olá! Gostaria de saber mais sobre os serviços da EFCONTE.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button fixed bottom-24 right-4 sm:right-8 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-60"
      aria-label="Contato via WhatsApp"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14 0C6.27 0 0 6.27 0 14c0 2.46.67 4.81 1.94 6.85L0 28l8.3-2.2C10.2 27.4 12 28 14 28c7.73 0 14-6.27 14-14S21.73 0 14 0zm0 25.89c-1.78 0-3.52-.42-5.08-1.24l-.36-.2-3.75.99.98-3.65-.22-.38c-.88-1.6-1.35-3.44-1.35-5.41 0-6.4 5.2-11.61 11.61-11.61 6.4 0 11.61 5.2 11.61 11.61 0 6.41-5.2 11.61-11.61 11.61zm5.7-8.75c-.31-.16-1.85-.91-2.14-.99-.29-.09-.5-.14-.71.14-.21.29-.81 1-.99 1.2-.18.21-.37.24-.68.08-1.83-.91-3.03-1.65-4.23-3.76-.32-.56.32-.51.91-1.67.1-.19.05-.36-.03-.51-.08-.14-.71-1.71-.98-2.34-.25-.6-.51-.52-.71-.52-.18 0-.39-.01-.59-.01-.21 0-.55.08-.84.38-.29.3-1.1 1.07-1.1 2.61 0 1.55.71 3.03 1.81 4.2 2.47 2.74 5.35 3.62 7.65 2.89.62-.2 1.06-.66 1.2-1.38.09-.49.01-.98-.09-1.32-.1-.34-.31-.57-.61-.73z" />
      </svg>
    </Link>
  );
}
