
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BeLoopIcon from "@/components/BeLoopIcons";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  materials: string[];
}

interface PassportCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: string;
  products: Product[];
}

const PassportCreationDialog = ({
  open,
  onOpenChange,
  selectedProduct,
  products
}: PassportCreationDialogProps) => {
  const product = products.find(p => p.sku === selectedProduct);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Crear Pasaporte Digital</DialogTitle>
          <DialogDescription>
            Complete la información requerida para el pasaporte digital del producto
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passport-name">Nombre del producto</Label>
              <Input 
                id="passport-name" 
                value={product?.name || ""} 
                readOnly
              />
            </div>
            
            <div>
              <Label htmlFor="passport-sku">SKU</Label>
              <Input id="passport-sku" value={selectedProduct || ""} readOnly />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="passport-description">Descripción del producto</Label>
              <Input id="passport-description" placeholder="Descripción detallada del producto" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passport-manufacturer">Fabricante</Label>
                <Input id="passport-manufacturer" placeholder="Nombre del fabricante" />
              </div>
              
              <div>
                <Label htmlFor="passport-origin">País de origen</Label>
                <Input id="passport-origin" placeholder="País de fabricación" />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Información de materiales</h4>
            <div className="rounded-lg border overflow-hidden">
              <div className="grid grid-cols-3 font-medium p-3 border-b bg-muted/50">
                <div>Material</div>
                <div>Porcentaje</div>
                <div>Origen</div>
              </div>
              
              {product?.materials.map((material, idx) => (
                <div key={idx} className="grid grid-cols-3 p-3 border-b last:border-0">
                  <div>{material}</div>
                  <div>
                    <Input type="number" placeholder="%" className="w-20" />
                  </div>
                  <div>
                    <Input placeholder="Origen del material" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Certificaciones</Label>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Input placeholder="Nombre de la certificación" className="flex-1" />
                  <Button variant="ghost" size="sm">
                    <BeLoopIcon name="plus" size={16} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <Label>Características de fin de vida</Label>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Input placeholder="Característica de reciclabilidad" className="flex-1" />
                  <Button variant="ghost" size="sm">
                    <BeLoopIcon name="plus" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => onOpenChange(false)}>Crear pasaporte</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PassportCreationDialog;
