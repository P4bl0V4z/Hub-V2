
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package2, FileText, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatPassportTimelineForExport, exportToExcel } from "@/utils/excelExport";
import { toast } from "sonner";

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface TimelineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: TimelineEvent[];
}

export default function TimelineDialog({ open, onOpenChange, events }: TimelineDialogProps) {
  // Handle export of timeline events
  const handleExportTimeline = () => {
    const data = formatPassportTimelineForExport(events);
    exportToExcel(
      data, 
      'Trazabilidad_Producto', 
      'Línea de Tiempo',
      { 'Evento': 20, 'Descripción': 40 }
    );
    toast.success("Datos de trazabilidad exportados correctamente");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Línea de Tiempo del Producto
          </DialogTitle>
          <DialogDescription>
            Trazabilidad completa del ciclo de vida
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-6 relative">
            {/* Vertical line for timeline */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-muted-foreground/20"></div>
            
            {events.map((event, index) => {
              const EventIcon = event.icon;
              return (
                <div key={event.id} className="flex gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 relative z-10">
                    <EventIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <h4 className="font-medium">{event.title}</h4>
                      <span className="text-sm text-muted-foreground">{event.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    {index < events.length - 1 && <Separator className="my-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Seguimiento en tiempo real con blockchain
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportTimeline}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
