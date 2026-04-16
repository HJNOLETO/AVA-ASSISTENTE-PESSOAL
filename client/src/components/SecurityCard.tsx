import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Download, Printer, Copy, Check } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface SecurityCardProps {
  data: {
    userName: string | null;
    userEmail: string | null;
    userId: number;
    codes: Record<string, string>;
  };
}

export default function SecurityCardDisplay({ data }: SecurityCardProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    const text = Object.entries(data.codes)
      .map(([pos, code]) => `${pos}: ${code}`)
      .sort((a, b) => a.localeCompare(b))
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Códigos copiados para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    
    const toastId = toast.loading("Gerando PDF...");
    
    try {
      // Hide buttons temporarily
      const buttons = cardRef.current.querySelector('.action-buttons');
      if (buttons) (buttons as HTMLElement).style.display = 'none';

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });

      // Show buttons again
      if (buttons) (buttons as HTMLElement).style.display = 'flex';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Carta-Seguranca-AVA-${data.userId}.pdf`);
      
      toast.success("PDF gerado com sucesso!", { id: toastId });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF", { id: toastId });
    }
  };

  // Convert codes object to sorted array of [position, code]
  const sortedCodes = Object.entries(data.codes).sort(([a], [b]) => parseInt(a) - parseInt(b));

  return (
    <div ref={cardRef}>
      <Card className="w-full max-w-4xl border-2 border-zinc-900 dark:border-white shadow-xl bg-white dark:bg-zinc-950 overflow-hidden print:shadow-none print:border-zinc-300">
        <CardHeader className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-6 flex flex-row justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-6 h-6" />
              <span className="font-bold text-xl tracking-tight uppercase">AVA Assistant</span>
            </div>
            <CardTitle className="text-2xl font-black uppercase">Carta de Segurança</CardTitle>
            <CardDescription className="text-zinc-300 dark:text-zinc-600 font-medium">
              MANTENHA ESTA CARTA EM LOCAL SEGURO. NUNCA COMPARTILHE SEUS CÓDIGOS.
            </CardDescription>
          </div>
          <div className="text-right text-xs font-mono space-y-1 opacity-80">
            <p>USUÁRIO: {data.userName}</p>
            <p>E-MAIL: {data.userEmail}</p>
            <p>ID: {data.userId.toString().padStart(6, '0')}</p>
            <p>EMITIDA EM: {new Date().toLocaleDateString()}</p>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {sortedCodes.map(([pos, code]) => (
              <div 
                key={pos} 
                className="flex items-center justify-between p-2 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 transition-colors"
              >
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">{pos}</span>
                <span className="text-sm font-mono font-bold tracking-widest">{code}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-4 justify-center print:hidden action-buttons">
            <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-full">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copiado!" : "Copiar Códigos"}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-full">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir Carta
            </Button>
            <Button size="sm" onClick={handleDownloadPDF} className="rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </div>

          <div className="mt-8 text-center space-y-2 opacity-50 print:opacity-100">
            <p className="text-[10px] uppercase font-bold tracking-tighter">
              Esta carta é de uso pessoal e intransferível. O AVA Assistant nunca solicitará sua carta completa.
            </p>
            <div className="flex justify-center gap-1">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-1 h-4 bg-zinc-300 dark:bg-zinc-700" />
              ))}
            </div>
            
            {/* QR Code Placeholder */}
            <div className="flex justify-center mt-4">
              <div className="w-24 h-24 bg-white p-1 border border-zinc-200">
                <div className="w-full h-full bg-zinc-900 flex flex-wrap content-start">
                  {[...Array(144)].map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-[6.66%] h-[6.66%]",
                        Math.random() > 0.5 ? "bg-white" : "bg-black"
                      )} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[8px] uppercase font-mono tracking-widest mt-2">
              TOKEN-VERIFICATION-ID: {data.userId}-{Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
