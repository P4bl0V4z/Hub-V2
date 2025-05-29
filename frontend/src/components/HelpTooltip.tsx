
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BeLoopIcon from "@/components/BeLoopIcons";
import { useState } from "react";

interface HelpTooltipProps {
  content: string;
  size?: number;
  useHoverCard?: boolean;
  title?: string;
}

const HelpTooltip = ({ content, size = 16, useHoverCard = false, title }: HelpTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Si useHoverCard es true, usamos HoverCard para una experiencia más rica
  if (useHoverCard) {
    return (
      <HoverCard openDelay={100} closeDelay={200}>
        <HoverCardTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-full w-5 h-5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <BeLoopIcon name="helpCircle" size={size} />
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-3">
          {title && <h4 className="text-sm font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{content}</p>
        </HoverCardContent>
      </HoverCard>
    );
  }
  
  // Si no, usamos el Tooltip original
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-full w-5 h-5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <BeLoopIcon name="helpCircle" size={size} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpTooltip;
