
import { useState, useCallback } from "react";

export function useConversationMemory(conversationId: number | null) {
  const [summary, setSummary] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  const updateMemory = useCallback((messages: any[]) => {
    setMessageCount(messages.length);
  }, []);

  const generateSummary = useCallback(async () => {
    // Placeholder for summary generation
    console.log("generateSummary called");
  }, []);

  const clearMemory = useCallback(() => {
    setSummary(null);
    setMessageCount(0);
  }, []);

  return {
    memory: {
      summary,
      messageCount
    },
    contextMessages: [],
    updateMemory,
    generateSummary,
    clearMemory,
    hasContext: !!summary
  };
}
