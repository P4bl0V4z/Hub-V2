
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ContextHelp } from "@/components/ContextualHelp";
import { Tag } from "lucide-react";
import BeLoopIcon from "@/components/BeLoopIcons";

interface EcoLabelingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: any;
}

export default function EcoLabelingDialog({ open, onOpenChange, selectedProduct }: EcoLabelingDialogProps) {
  const [qrEnabled, setQrEnabled] = React.useState(true);
  const [labelType, setLabelType] = React.useState("estandar");
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Etiquetado Ecológico
            <ContextHelp 
              id="eco-labeling"
              content="Creación y gestión de etiquetas ecológicas para productos"
              useHoverCard={true}
              size={16}
              title="Etiquetado Ecológico"
            />
          </DialogTitle>
          <DialogDescription>
            {selectedProduct 
              ? `Configuración de ecoetiqueta para: ${selectedProduct.name}` 
              : 'Seleccione un producto para configurar su ecoetiqueta'}
          </DialogDescription>
        </DialogHeader>
        
        {selectedProduct ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label-name">Nombre de la etiqueta</Label>
                <Input id="label-name" defaultValue={`Ecoetiqueta ${selectedProduct.name}`} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="label-type">Tipo de etiqueta</Label>
                <Select value={labelType} onValueChange={setLabelType}>
                  <SelectTrigger id="label-type">
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estandar">Estándar</SelectItem>
                    <SelectItem value="detallada">Detallada</SelectItem>
                    <SelectItem value="simplificada">Simplificada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Información a mostrar</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <Label htmlFor="toggle-co2" className="font-medium">Huella de carbono</Label>
                    <p className="text-sm text-muted-foreground">Mostrar valor en kg CO₂e</p>
                  </div>
                  <Switch id="toggle-co2" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <Label htmlFor="toggle-materials" className="font-medium">Materiales</Label>
                    <p className="text-sm text-muted-foreground">Listar materiales principales</p>
                  </div>
                  <Switch id="toggle-materials" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <Label htmlFor="toggle-recycling" className="font-medium">Instrucciones de reciclaje</Label>
                    <p className="text-sm text-muted-foreground">Información de disposición</p>
                  </div>
                  <Switch id="toggle-recycling" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <Label htmlFor="toggle-origin" className="font-medium">País de origen</Label>
                    <p className="text-sm text-muted-foreground">Mostrar información de origen</p>
                  </div>
                  <Switch id="toggle-origin" />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Vista previa</h3>
              
              <div className="flex justify-center p-6 border rounded-md">
                <div className="w-64 h-64 bg-muted/30 rounded-md flex flex-col items-center justify-center p-4">
                  <div className="w-full h-full border-2 border-dashed border-border flex flex-col items-center justify-center">
                    <BeLoopIcon name="tag" size={48} className="text-muted-foreground mb-4" />
                    <p className="text-sm text-center text-muted-foreground">
                      Vista previa de ecoetiqueta
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Ver vista previa
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border rounded-md p-4">
              <div>
                <Label htmlFor="toggle-qr" className="font-medium">Incluir código QR</Label>
                <p className="text-sm text-muted-foreground">
                  Añadir un código QR que enlace a información detallada
                </p>
              </div>
              <Switch id="toggle-qr" checked={qrEnabled} onCheckedChange={setQrEnabled} />
            </div>
            
            {qrEnabled && (
              <div className="p-4 border rounded-md bg-muted/20">
                <div className="mb-4">
                  <Label htmlFor="qr-url">URL para código QR</Label>
                  <Input 
                    id="qr-url" 
                    defaultValue="https://ecolabel.beloop.com/products/12345" 
                    className="mt-1" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Esta URL mostrará información detallada del producto
                  </p>
                </div>
                
                <div className="flex items-center">
                  <BeLoopIcon name="info" size={16} className="text-blue-500 mr-2" />
                  <p className="text-sm text-muted-foreground">
                    El código QR se generará automáticamente al guardar la configuración
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <BeLoopIcon name="tag" size={64} className="text-muted-foreground" />
            <h3 className="text-xl font-medium">Seleccione un producto</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Para configurar una ecoetiqueta, primero seleccione un producto de la lista.
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          {selectedProduct && <Button onClick={() => onOpenChange(false)}>Guardar Etiqueta</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
