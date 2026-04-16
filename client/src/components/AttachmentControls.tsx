import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AttachmentControlsProps {
  attachedImage: {
    base64: string;
    mime: "image/png" | "image/jpeg" | "image/webp" | "image/gif";
  } | null;
  onImageAttach: (image: { base64: string; mime: string }) => void;
  onImageRemove: () => void;
}

export const AttachmentControls: React.FC<AttachmentControlsProps> = ({
  attachedImage,
  onImageAttach,
  onImageRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato de imagem não suportado");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem muito grande (máx. 10MB)");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(",")[1];
        onImageAttach({ base64, mime: file.type as any });
        toast.success("Imagem anexada");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erro ao processar imagem");
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      
      {attachedImage ? (
        <Button
          variant="outline"
          size="icon"
          onClick={onImageRemove}
          title="Remover imagem"
          className="h-8 w-8 rounded-lg bg-muted/20 text-muted-foreground border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          title="Anexar imagem"
          className="h-8 w-8 text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/10 rounded-lg transition-all"
        >
          <Paperclip className="h-3.5 w-3.5" />
        </Button>
      )}
    </>
  );
};