
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContextHelp } from "@/components/ContextualHelp";
import BeLoopIcon from "@/components/BeLoopIcons";
import PassportTemplateDialog from "./PassportTemplateDialog";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  materials: string[];
}

interface CreatePassportProps {
  products: Product[];
  selectedProduct: string;
  onProductSelect: (sku: string) => void;
  onCreatePassport: () => void;
}

const CreatePassport = ({ 
  products, 
  selectedProduct, 
  onProductSelect,
  onCreatePassport
}: CreatePassportProps) => {
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BeLoopIcon name="shield" className="mr-2" size={20} /> 
          Crear Pasaporte Digital
          <ContextHelp 
            id="create-passport"
            content="Cree pasaportes digitales con información detallada sobre sus productos"
            useHoverCard={true}
            size={16}
            title="Pasaportes Digitales"
          />
        </CardTitle>
        <CardDescription>
          Seleccione un producto para crear un pasaporte digital con información detallada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="passport-product" className="mb-2 block">Seleccionar producto</Label>
              <Select value={selectedProduct} onValueChange={onProductSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.sku}>{product.name} ({product.sku})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              disabled={!selectedProduct}
              onClick={onCreatePassport}
            >
              Crear Pasaporte
            </Button>
          </div>
          
          {selectedProduct && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">
                Producto: {products.find(p => p.sku === selectedProduct)?.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/30 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Categoría</div>
                  <div className="font-medium">
                    {products.find(p => p.sku === selectedProduct)?.category}
                  </div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">SKU</div>
                  <div className="font-medium">{selectedProduct}</div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Materiales</div>
                  <div className="font-medium">
                    {products.find(p => p.sku === selectedProduct)?.materials.join(", ")}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Plantillas disponibles</h4>
                  <Button variant="outline" size="sm" onClick={() => setOpenTemplateDialog(true)}>
                    <BeLoopIcon name="settings" size={14} className="mr-2" />
                    Gestionar Plantillas
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div className="border rounded-md p-3 cursor-pointer hover:border-primary hover:bg-primary/5">
                    <div className="font-medium mb-1">Plantilla Estándar</div>
                    <div className="text-xs text-muted-foreground">General, compatible con todo tipo de productos</div>
                  </div>
                  <div className="border rounded-md p-3 cursor-pointer hover:border-primary hover:bg-primary/5">
                    <div className="font-medium mb-1">Electrónicos</div>
                    <div className="text-xs text-muted-foreground">Optimizada para productos electrónicos</div>
                  </div>
                  <div className="border rounded-md p-3 cursor-pointer hover:border-primary hover:bg-primary/5">
                    <div className="font-medium mb-1">Envases</div>
                    <div className="text-xs text-muted-foreground">Enfocada en envases y embalajes</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!selectedProduct && (
            <div className="bg-muted/30 p-6 rounded-md text-center">
              <BeLoopIcon name="shield" size={48} className="text-muted-foreground mb-4 mx-auto" />
              <p className="text-muted-foreground">Seleccione un producto para crear un pasaporte digital</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Dialog */}
      <PassportTemplateDialog open={openTemplateDialog} onOpenChange={setOpenTemplateDialog} />
    </Card>
  );
};

export default CreatePassport;
