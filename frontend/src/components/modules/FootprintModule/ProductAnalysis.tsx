
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Download, FileText, Info, Eye } from "lucide-react";
import FootprintDetailDialog from './FootprintDetailDialog';
import { toast } from "sonner";
import { formatFootprintDataForExport, exportToExcel } from "@/utils/excelExport";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  materials: string[];
}

interface ProductAnalysisProps {
  products: Product[];
  selectedProduct: string;
  onProductSelect: (productId: string) => void;
}

const ProductAnalysis: React.FC<ProductAnalysisProps> = ({ 
  products, 
  selectedProduct, 
  onProductSelect 
}) => {
  const [openDetail, setOpenDetail] = React.useState(false);
  
  const selectedProductObj = products.find(p => p.id.toString() === selectedProduct);
  
  // Handle export of footprint data
  const handleExportFootprintData = () => {
    const data = formatFootprintDataForExport(selectedProductObj);
    exportToExcel(
      data, 
      `Huella_Carbono_${selectedProductObj?.sku || 'Producto'}`, 
      'Análisis Huella',
      { 'Producto': 20, 'Metodología': 15 }
    );
    toast.success("Datos de huella ambiental exportados correctamente");
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="mr-2 h-5 w-5" />
          Análisis de Ciclo de Vida
        </CardTitle>
        <CardDescription>
          Evaluación detallada del impacto ambiental a lo largo del ciclo de vida del producto
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1 w-72">
            <label className="text-sm font-medium">Seleccionar producto</label>
            <Select value={selectedProduct} onValueChange={onProductSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name} ({product.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={handleExportFootprintData}
              disabled={!selectedProduct}
            >
              <Download className="h-4 w-4 mr-1" />
              Exportar Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => setOpenDetail(true)}
              disabled={!selectedProduct}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver detalles
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">
              Información General
            </TabsTrigger>
            <TabsTrigger value="analisis">
              Análisis Detallado
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="pt-4 space-y-4">
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="font-medium mb-3">Datos del Producto</h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="font-medium">Nombre</label>
                  <label className="font-medium">SKU</label>
                </div>
                
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>{selectedProductObj?.name || 'N/A'}</div>
                  <div>{selectedProductObj?.sku || 'N/A'}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <label className="font-medium">Categoría</label>
                  <label className="font-medium">Materiales</label>
                </div>
                
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>{selectedProductObj?.category || 'N/A'}</div>
                  <div>{selectedProductObj && selectedProductObj.materials.length > 0 ? selectedProductObj.materials.join(', ') : 'N/A'}</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center bg-blue-50 p-3 rounded-md border border-blue-200">
              <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                El análisis de ciclo de vida se basa en estándares ISO 14040 y considera las etapas de
                extracción de materias primas, producción, distribución, uso y fin de vida.
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analisis" className="pt-4">
            <div className="border rounded-md p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Huella de Carbono</h3>
                    <p className="text-sm text-muted-foreground">Calculada el 15/05/2025</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Materias Primas</p>
                    <p className="font-medium">320 kg CO2e</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Producción</p>
                    <p className="font-medium">250 kg CO2e</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Distribución</p>
                    <p className="font-medium">180 kg CO2e</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Uso</p>
                    <p className="font-medium">50 kg CO2e</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fin de Vida</p>
                    <p className="font-medium">50 kg CO2e</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium">850 kg CO2e</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">Ver Detalles</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <FootprintDetailDialog 
          open={openDetail} 
          onOpenChange={setOpenDetail} 
          product={selectedProductObj} // Pass the selected product to the dialog
        />
      </CardContent>
    </Card>
  );
};

export default ProductAnalysis;
