
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calculator, FileText, Table2 } from 'lucide-react';
import ProductAnalysis from '@/components/modules/FootprintModule/ProductAnalysis';
import ComparatorCard from '@/components/modules/FootprintModule/ComparatorCard';
import EcoLabeling from '@/components/modules/FootprintModule/EcoLabeling';

interface FootprintModuleViewProps {
  products: Array<{id: number, name: string, sku: string, category: string, materials: string[]}>;
  selectedProduct: string;
  onProductSelect: (product: string) => void;
}

const FootprintModuleView: React.FC<FootprintModuleViewProps> = ({ products, selectedProduct, onProductSelect }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center">
            <Table2 className="h-4 w-4 mr-2" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="reporting" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Reportes
          </TabsTrigger>
          <TabsTrigger value="simulator" className="flex items-center">
            <Calculator className="h-4 w-4 mr-2" />
            Simulador
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ComparatorCard />
            <EcoLabeling />
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          <ProductAnalysis 
            products={products} 
            selectedProduct={selectedProduct}
            onProductSelect={onProductSelect}
          />
        </TabsContent>
        
        <TabsContent value="reporting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reportes de Huella Ambiental</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-6">
                Generación de informes de huella ambiental para productos, categorías y
                materiales, con análisis comparativo y evolución temporal.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="p-4 h-56">
                  <CardTitle className="text-lg mb-2">Reportes por Producto</CardTitle>
                  <p className="text-muted-foreground mb-4">Análisis detallado de la huella ambiental por producto.</p>
                  <Button className="mt-auto" variant="outline">Generar Reporte</Button>
                </Card>
                <Card className="p-4 h-56">
                  <CardTitle className="text-lg mb-2">Reportes por Categoría</CardTitle>
                  <p className="text-muted-foreground mb-4">Comparativa de huella entre categorías de productos.</p>
                  <Button className="mt-auto" variant="outline">Generar Reporte</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="simulator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulador de Escenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-6">
                Herramienta de simulación que permite modelar diferentes escenarios de impacto
                ambiental, considerando cambios en materiales, procesos productivos y logística.
              </div>
              
              <div className="p-12 text-center border rounded-md bg-muted/30">
                <p className="text-lg font-medium mb-2">Módulo en desarrollo</p>
                <p className="text-muted-foreground">
                  El simulador de escenarios está actualmente en fase de implementación.
                  Estará disponible próximamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Componente Button para el ejemplo
const Button = ({ children, className, variant = "default" }) => {
  return (
    <button 
      className={cn(
        "px-4 py-2 rounded-md font-medium",
        variant === "default" ? "bg-primary text-primary-foreground" : "bg-background border border-input",
        className
      )}
    >
      {children}
    </button>
  );
};

// Función cn de utils
const cn = (...inputs) => {
  return inputs.filter(Boolean).join(" ");
};

export default FootprintModuleView;
