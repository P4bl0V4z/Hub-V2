
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ContextHelp } from "@/components/ContextualHelp";
import BeLoopIcon from "@/components/BeLoopIcons";
import { FileCheck } from "lucide-react";

interface MaterialTraceabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MaterialTraceabilityDialog({ open, onOpenChange }: MaterialTraceabilityDialogProps) {
  const [selectedMaterial, setSelectedMaterial] = React.useState("plastic");
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileCheck className="mr-2 h-5 w-5" />
            Trazabilidad de Materiales
            <ContextHelp 
              id="material-traceability"
              content="Seguimiento del origen y destino de materiales prioritarios"
              useHoverCard={true}
              size={16}
              title="Trazabilidad de Materiales"
            />
          </DialogTitle>
          <DialogDescription>
            Seguimiento del origen y destino de materiales prioritarios
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex space-x-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Seleccionar material</Label>
              <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plastic">Plástico</SelectItem>
                  <SelectItem value="paper">Papel y Cartón</SelectItem>
                  <SelectItem value="glass">Vidrio</SelectItem>
                  <SelectItem value="metal">Metales</SelectItem>
                  <SelectItem value="tetra">Tetra Pak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button>Ver Informe</Button>
          </div>
          
          <Tabs defaultValue="flow">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="flow">Flujo de Material</TabsTrigger>
              <TabsTrigger value="providers">Proveedores</TabsTrigger>
              <TabsTrigger value="recycling">Reciclaje</TabsTrigger>
            </TabsList>
            
            <TabsContent value="flow" className="pt-4">
              <div className="bg-muted/30 p-4 rounded-md text-center h-64 flex flex-col items-center justify-center">
                <BeLoopIcon name="activity" size={48} className="text-muted-foreground mb-4" />
                <h3 className="font-medium mb-1">Flujo de Material: {selectedMaterial === "plastic" ? "Plástico" : selectedMaterial === "paper" ? "Papel y Cartón" : selectedMaterial === "glass" ? "Vidrio" : selectedMaterial === "metal" ? "Metales" : "Tetra Pak"}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Visualización del flujo de material desde el origen hasta el fin de vida
                </p>
                <Button>Generar Diagrama de Flujo</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="providers" className="pt-4">
              <div className="bg-muted/30 p-4 rounded-md h-64 flex flex-col">
                <h3 className="font-medium mb-3">Proveedores de {selectedMaterial === "plastic" ? "Plástico" : selectedMaterial === "paper" ? "Papel y Cartón" : selectedMaterial === "glass" ? "Vidrio" : selectedMaterial === "metal" ? "Metales" : "Tetra Pak"}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-3 bg-background">
                    <p className="font-medium">Eco Plásticos S.A.</p>
                    <p className="text-sm text-muted-foreground">Certificación: A</p>
                    <p className="text-sm">Volumen: 450 Ton/año</p>
                  </div>
                  <div className="border rounded-md p-3 bg-background">
                    <p className="font-medium">Polímeros Industriales</p>
                    <p className="text-sm text-muted-foreground">Certificación: B</p>
                    <p className="text-sm">Volumen: 320 Ton/año</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recycling" className="pt-4">
              <div className="bg-muted/30 p-4 rounded-md h-64 flex flex-col">
                <h3 className="font-medium mb-3">Datos de Reciclaje: {selectedMaterial === "plastic" ? "Plástico" : selectedMaterial === "paper" ? "Papel y Cartón" : selectedMaterial === "glass" ? "Vidrio" : selectedMaterial === "metal" ? "Metales" : "Tetra Pak"}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Tasa de Reciclaje</div>
                    <div className="text-2xl font-semibold">68%</div>
                    <div className="text-sm text-green-500 flex items-center">
                      <BeLoopIcon name="trendingUp" size={16} className="mr-1" />
                      +5% vs año anterior
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Meta Normativa</div>
                    <div className="text-2xl font-semibold">75%</div>
                    <div className="text-sm text-amber-500">7% restante para cumplir</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button>Exportar Datos</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
