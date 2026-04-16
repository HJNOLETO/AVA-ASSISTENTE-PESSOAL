import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface ManusDialogProps {
  title?: string;
  logo?: string;
  open?: boolean;
  onLogin: () => void;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export function ManusDialog({
  title,
  logo,
  open = false,
  onLogin,
  onOpenChange,
  onClose,
}: ManusDialogProps) {
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => {
    if (!onOpenChange) {
      setInternalOpen(open);
    }
  }, [open, onOpenChange]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }

    if (!nextOpen) {
      onClose?.();
    }
  };

  return (
    <Dialog
      open={onOpenChange ? open : internalOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="bg-background border-border/10 shadow-2xl rounded-3xl p-0 gap-0 text-center overflow-hidden max-w-[360px]">
        <div className="flex flex-col items-center gap-4 p-8 pt-12">
          {logo ? (
            <div className="w-16 h-16 bg-muted/20 rounded-2xl border border-border/10 flex items-center justify-center p-3">
              <img
                src={logo}
                alt="Dialog graphic"
                className="w-full h-full object-contain"
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            {title ? (
              <DialogTitle className="text-base font-semibold text-foreground tracking-tight">
                {title}
              </DialogTitle>
            ) : null}
            <DialogDescription className="text-[13px] text-muted-foreground/60 leading-relaxed">
              Por favor, faça login com Manus para continuar a utilizar os recursos avançados.
            </DialogDescription>
          </div>
        </div>

        <DialogFooter className="px-8 pb-8 pt-2">
          <Button
            onClick={onLogin}
            className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-[13px] font-medium transition-all"
          >
            Login com Manus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
