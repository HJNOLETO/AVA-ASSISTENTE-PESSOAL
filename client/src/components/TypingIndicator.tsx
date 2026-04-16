import React from "react";

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 px-2.5 py-1.5 bg-muted/20 border border-border/10 rounded-xl w-fit">
      <div className="w-1 h-1 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1 h-1 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1 h-1 bg-muted-foreground/40 rounded-full animate-bounce"></div>
    </div>
  );
}
