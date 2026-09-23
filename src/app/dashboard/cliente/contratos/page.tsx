"use client";

import { useEffect, useState, useRef } from "react";

import { FileText, CheckCircle2, PenTool, ExternalLink, X } from "lucide-react";
import SignatureCanvas from 'react-signature-canvas';

interface Document {
  id: string;
  title: string;
  fileUrl: string;
  type: string;
  status: string | null;
  signatureUrl: string | null;
  signedAt: string | null;
  createdAt: string;
}

export default function ClientContracts() {
  
  const [contracts, setContracts] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Signature Modal state
  const [selectedContract, setSelectedContract] = useState<Document | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const sigPad = useRef<SignatureCanvas>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    

    try {
      // Pega o profile e tenantId
      const profileRes = await fetch('/api/profile');
      const profileData = await profileRes.json();
      const tenantId = profileData.user?.tenants?.[0]?.tenantId;

      if (!tenantId) return;

      const res = await fetch(`/api/documents?tenantId=${tenantId}`);
      if (res.ok) {
        const data = await res.json() as any as any;
        // Filtra apenas os do tipo CONTRATO
        setContracts(data.documents.filter((d: Document) => d.type === 'CONTRATO'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!selectedContract || !sigPad.current) return;
    
    if (sigPad.current.isEmpty()) {
      alert("Por favor, faça a sua assinatura no quadro branco.");
      return;
    }

    setIsSigning(true);
    const signatureData = sigPad.current.getTrimmedCanvas().toDataURL('image/png');

    try {
      const res = await fetch('/api/documents/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: selectedContract.id,
          signatureBase64: signatureData
        })
      });

      if (res.ok) {
        alert("Contrato assinado com sucesso!");
        setSelectedContract(null);
        fetchContracts();
      } else {
        const err = await res.json() as any as any;
        alert(err.error || "Erro ao assinar o contrato.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao assinar.");
    } finally {
      setIsSigning(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-silver">Carregando contratos...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Contratos e Termos</h1>
        <p className="text-silver-dark mt-2">Revise e assine digitalmente seus acordos com a EFCONTE.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-surface border border-onyx/10 dark:border-white/10 rounded-xl text-silver-dark">
            Você não possui nenhum contrato pendente.
          </div>
        ) : (
          contracts.map(contract => (
            <div key={contract.id} className="bg-surface border border-onyx/20 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:border-gold/50 transition-colors relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                  <FileText size={24} />
                </div>
                {contract.status === 'SIGNED' ? (
                  <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Assinado
                  </span>
                ) : (
                  <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <PenTool size={14} /> Pendente
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-lg text-foreground line-clamp-2" title={contract.title}>{contract.title}</h3>
                <p className="text-sm text-silver-dark mt-1">
                  Enviado em: {new Date(contract.createdAt).toLocaleDateString()}
                </p>
                {contract.signedAt && (
                  <p className="text-xs text-green-500 mt-1">
                    Assinado em: {new Date(contract.signedAt).toLocaleDateString()} às {new Date(contract.signedAt).toLocaleTimeString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-auto pt-4 border-t border-onyx/10 dark:border-white/10">
                <a 
                  href={contract.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-onyx/5 dark:bg-white/5 hover:bg-onyx/10 dark:hover:bg-white/10 rounded-lg text-sm font-bold text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink size={16} /> Ler Arquivo
                </a>
                
                {contract.status !== 'SIGNED' && (
                  <button 
                    onClick={() => setSelectedContract(contract)}
                    className="flex-1 py-2 px-3 bg-gold hover:bg-gold-hover text-onyx rounded-lg text-sm font-bold text-center transition-colors shadow-md"
                  >
                    Assinar Agora
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Signature Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface dark:bg-onyx border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative flex flex-col">
            <button 
              onClick={() => setSelectedContract(null)}
              className="absolute top-4 right-4 text-silver hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold mb-1">Assinatura Digital</h2>
            <p className="text-sm text-silver-dark mb-6">Assinando: <strong>{selectedContract.title}</strong></p>

            <div className="bg-white border-2 border-dashed border-silver-dark rounded-xl mb-4 overflow-hidden shadow-inner">
              <SignatureCanvas 
                ref={sigPad}
                penColor="black"
                canvasProps={{className: 'w-full h-48 cursor-crosshair'}}
              />
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-silver-dark">* Faça sua assinatura no quadro acima usando o mouse ou o dedo.</span>
              <button 
                onClick={() => sigPad.current?.clear()}
                className="text-xs font-bold text-silver hover:text-gold transition-colors"
              >
                Limpar
              </button>
            </div>

            <button 
              onClick={handleSign}
              disabled={isSigning}
              className="w-full py-3 bg-gold hover:bg-gold-hover text-onyx font-bold rounded-xl transition-all shadow-lg disabled:opacity-50"
            >
              {isSigning ? 'Registrando...' : 'Confirmar e Assinar Eletronicamente'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
