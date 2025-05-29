
import { useState } from "react";
import BeLoopIcon from "@/components/BeLoopIcons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  type: "user" | "assistant";
  content: string;
};

const initialMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    content: "¡Hola! Soy CEIA, tu asistente virtual especializado en economía circular. ¿En qué puedo ayudarte hoy?",
  },
];

const ChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      type: "user",
      content: inputValue,
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        type: "assistant",
        content: getResponseText(inputValue),
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    }, 1000);
  };

  // Generate a simple response based on user input
  const getResponseText = (input: string): string => {
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes("rep") || inputLower.includes("responsabilidad")) {
      return "La Responsabilidad Extendida del Productor (REP) es un principio de política ambiental que extiende la responsabilidad de los productores sobre sus productos durante todo el ciclo de vida, especialmente en la etapa post-consumo. En BeLoop te ayudamos a gestionar el cumplimiento de estas normativas.";
    } else if (inputLower.includes("huella") || inputLower.includes("carbono")) {
      return "El cálculo de la huella de carbono es fundamental para medir el impacto ambiental de tus productos. En BeLoop ofrecemos herramientas para realizar este cálculo siguiendo estándares internacionales como ISO 14067 y PAS 2050.";
    } else if (inputLower.includes("pasaport") || inputLower.includes("digital")) {
      return "Los pasaportes digitales de productos permiten almacenar y compartir información sobre la composición, origen y reciclabilidad de tus productos. Esta transparencia facilita la circularidad y cumplimiento normativo.";
    } else if (inputLower.includes("certifica")) {
      return "En nuestra sección de Academia puedes encontrar información sobre certificaciones relevantes para la economía circular como Cradle to Cradle, EcoLabel, y otras específicas de tu sector.";
    } else {
      return "Gracias por tu consulta. Como especialista en economía circular, puedo ayudarte con temas como cumplimiento REP, cálculo de huella de carbono, pasaportes digitales de productos y estrategias circulares. ¿Hay algún tema específico sobre el que necesites más información?";
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="fixed right-6 bottom-6 z-50 rounded-full shadow-lg h-14 w-14 p-0 bg-primary hover:bg-primary/90"
        onClick={() => setOpen(true)}
      >
        <BeLoopIcon name="messageCircle" size={24} />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Asistente CEIA</SheetTitle>
            <SheetDescription>
              Consulta tus dudas sobre economía circular
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-max max-w-[80%] rounded-lg px-4 py-2",
                  message.type === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))}
          </div>
          
          <form 
            onSubmit={handleSend}
            className="border-t p-4 flex gap-2"
          >
            <Input 
              placeholder="Escribe tu consulta..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Enviar</Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

// Helper function for conditional classnames
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default ChatAssistant;
