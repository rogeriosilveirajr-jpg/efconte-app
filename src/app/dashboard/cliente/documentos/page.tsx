"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, UploadCloud, FileSpreadsheet, FileCode, CheckCircle2, ChevronRight, FolderArchive } from "lucide-react";

export default function DocumentosPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [pastDocuments, setPastDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.documents) {
          setPastDocuments(data.documents.filter((d: any) => d.type === 'OUTROS'));
        }
      })
      .catch(console.error);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleUploadFiles(files);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleUploadFiles(files);
    }
  };

  const uploadFileToServer = async (file: File) => {
    setIsUploading(true);
    try {
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          try {
            const res = await fetch('/api/documents/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileName: file.name,
                type: 'OUTROS',
                fileBase64: base64Data
              })
            });
            
            if (res.ok) {
              const docResponse = await res.json() as any;
              setPastDocuments(prev => [docResponse.document, ...prev]);
              setUploadedFiles(prev => [file.name, ...prev]);
            } else {
              alert('Erro ao enviar documento. Acesso negado ou dados incorretos.');
            }
          } catch (e) {
            console.error('Upload failed:', e);
            alert('Erro de conexão ao tentar enviar o documento.');
          } finally {
            resolve();
          }
        };
        reader.onerror = () => {
          alert('Erro ao ler arquivo local.');
          resolve();
        };
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadFiles = async (files: File[]) => {
    for (const file of files) {
      await uploadFileToServer(file);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gold/10 rounded-xl text-gold">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Central de Documentos</h1>
            <p className="text-silver-dark text-sm">
              Envie seus extratos e notas fiscais para o fechamento contábil do mês.
            </p>
          </div>
        </div>
      </section>

      {/* Upload Zone */}
      <section>
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileSelect}
          className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
            ${isDragging 
              ? "border-gold bg-gold/5" 
              : "border-onyx/30 dark:border-white/20 hover:border-gold hover:bg-onyx/5 dark:hover:bg-white/5"
            }
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-onyx/10 border-t-gold animate-spin"></div>
              <p className="text-sm font-bold text-gold animate-pulse">Criptografando e enviando...</p>
            </div>
          ) : (
            <>
              <input 
                type="file" 
                multiple 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileInputChange} 
              />
              <div className="w-16 h-16 bg-onyx/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-silver-dark group-hover:text-gold transition-colors">
                <UploadCloud size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">Arraste seus arquivos aqui</h3>
              <p className="text-sm text-silver-dark max-w-md">
                Suportamos arquivos <strong>OFX</strong> (Extratos bancários), <strong>XML</strong> ou <strong>ZIP</strong> (Notas Fiscais) e <strong>PDF</strong> (Comprovantes).
              </p>
              <button className="mt-6 px-6 py-2 bg-onyx text-white dark:bg-silver-dark/20 rounded-lg text-sm font-bold hover:bg-gold hover:text-onyx transition-colors">
                Ou clique para selecionar
              </button>
            </>
          )}
        </div>
      </section>

      {/* Checklist Mensal & Enviados */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Lembretes / Checklist */}
        <div className="glass-panel border-onyx/20 dark:border-white/10 p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-bold text-lg mb-2">O que preciso enviar?</h3>
          
          <ChecklistItem 
            icon={<FileSpreadsheet size={18} />} 
            title="Extratos Bancários (OFX)" 
            desc="De todas as contas PJ da empresa." 
            done={uploadedFiles.some(f => f.toLowerCase().includes('.ofx'))} 
          />
          <ChecklistItem 
            icon={<FileCode size={18} />} 
            title="Notas Fiscais (XML)" 
            desc="Notas de entrada, saída e serviços tomados." 
            done={uploadedFiles.some(f => f.toLowerCase().includes('.zip') || f.toLowerCase().includes('.xml'))} 
          />
          <ChecklistItem 
            icon={<FileText size={18} />} 
            title="Comprovantes de Pagamento" 
            desc="Aluguel, contas de consumo e impostos." 
            done={uploadedFiles.some(f => f.toLowerCase().includes('.pdf'))} 
          />
        </div>

        {/* Arquivos Recentes */}
        <div className="glass-panel border-onyx/20 dark:border-white/10 p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <FolderArchive size={20} className="text-gold" />
            Enviados recentemente
          </h3>
          
          {pastDocuments.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-silver-dark italic">
              Nenhum arquivo enviado este mês.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pastDocuments.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-onyx/5 dark:bg-white/5 rounded-lg border border-onyx/5 dark:border-white/5">
                  <div className="flex items-center gap-3 truncate mr-2">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <span className="text-sm font-medium truncate">{doc.title}</span>
                  </div>
                  <a href={doc.fileUrl} target="_blank" className="text-xs text-gold hover:underline shrink-0">Baixar</a>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

    </div>
  );
}

function ChecklistItem({ icon, title, desc, done }: { icon: React.ReactNode, title: string, desc: string, done: boolean }) {
  return (
    <div className={`flex items-start gap-4 p-3 rounded-lg border transition-colors ${done ? 'border-green-500/20 bg-green-500/5' : 'border-onyx/10 dark:border-white/10'}`}>
      <div className={`mt-1 ${done ? 'text-green-500' : 'text-silver-dark'}`}>
        {done ? <CheckCircle2 size={18} /> : icon}
      </div>
      <div>
        <h4 className={`text-sm font-bold ${done ? 'text-green-500' : ''}`}>{title}</h4>
        <p className="text-xs text-silver-dark mt-1">{desc}</p>
      </div>
    </div>
  );
}
