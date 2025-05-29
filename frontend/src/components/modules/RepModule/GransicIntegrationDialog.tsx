
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileCheck } from "lucide-react";
import { ContextHelp } from "@/components/ContextualHelp";
import BeLoopIcon from "@/components/BeLoopIcons";

interface GransicIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GransicIntegrationDialog({ open, onOpenChange }: GransicIntegrationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileCheck className="mr-2 h-5 w-5" />
            Integración con GRANSIC
            <ContextHelp 
              id="gransic-integration"
              content="Conectividad con sistemas colectivos de gestión para la ley REP"
              useHoverCard={true}
              size={16}
              title="Integración GRANSIC"
            />
          </DialogTitle>
          <DialogDescription>
            Conectividad con sistemas colectivos de gestión
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Estado de conexión</div>
              <div className="text-sm text-muted-foreground">Sistema conectado y sincronizando datos</div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
                Activo
              </div>
            </Badge>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="font-medium">Sistemas conectados</h3>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div>
                  <div className="font-medium">GRANSIC Envases</div>
                  <div className="text-sm text-muted-foreground">Última sincronización: 05/05/2025 10:30</div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div>
                  <div className="font-medium">GRANSIC Electrónicos</div>
                  <div className="text-sm text-muted-foreground">Última sincronización: 04/05/2025 14:15</div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div>
                  <div className="font-medium">Sistema Nacional REP</div>
                  <div className="text-sm text-muted-foreground">Última sincronización: 03/05/2025 09:45</div>
                </div>
                <Switch />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <Alert>
            <BeLoopIcon name="info" size={16} className="h-4 w-4" />
            <AlertDescription>
              La próxima sincronización automática está programada para el 06/05/2025 a las 00:00 hrs.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="auto-sync">Sincronización automática</Label>
              <Switch id="auto-sync" defaultChecked />
            </div>
            <p className="text-sm text-muted-foreground">Mantener la sincronización automática cada 24 horas</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button onClick={() => onOpenChange(false)}>Sincronizar ahora</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
