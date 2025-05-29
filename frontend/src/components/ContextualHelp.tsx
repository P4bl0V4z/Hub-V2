
import React, { createContext, useContext, useState, ReactNode } from "react";
import HelpTooltip from "@/components/HelpTooltip";

// Define context type
type HelpItem = {
  id: string;
  title: string;
  content: string;
};

type ContextualHelpContextType = {
  registerHelp: (id: string, title: string, content: string) => void;
  getHelpContent: (id: string) => HelpItem | undefined;
};

// Create context
const ContextualHelpContext = createContext<ContextualHelpContextType | undefined>(undefined);

// Provider component
export const ContextualHelpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [helpItems, setHelpItems] = useState<HelpItem[]>([]);

  const registerHelp = (id: string, title: string, content: string) => {
    setHelpItems(prev => {
      // Check if item already exists
      const exists = prev.some(item => item.id === id);
      if (exists) return prev;
      
      // Add new item
      return [...prev, { id, title, content }];
    });
  };

  const getHelpContent = (id: string) => {
    return helpItems.find(item => item.id === id);
  };

  return (
    <ContextualHelpContext.Provider value={{ registerHelp, getHelpContent }}>
      {children}
    </ContextualHelpContext.Provider>
  );
};

// Hook to use the context
export const useContextualHelp = () => {
  const context = useContext(ContextualHelpContext);
  if (!context) {
    throw new Error("useContextualHelp must be used within a ContextualHelpProvider");
  }
  return context;
};

// Component that renders help tooltip
interface ContextHelpProps {
  id: string;
  content: string;
  size?: number;
  title?: string;
  useHoverCard?: boolean;
}

export const ContextHelp = ({ id, content, size, title, useHoverCard = true }: ContextHelpProps) => {
  const { registerHelp } = useContextualHelp();
  
  // Register this help item
  React.useEffect(() => {
    registerHelp(id, title || id, content);
  }, [id, content, title]);
  
  return <HelpTooltip content={content} size={size} useHoverCard={useHoverCard} title={title} />;
};

export default ContextHelp;
