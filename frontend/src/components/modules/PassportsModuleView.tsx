
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calculator, FileText, QrCode, Table2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PassportsList from '@/components/modules/PassportsModule/PassportsList';
import CreatePassport from '@/components/modules/PassportsModule/CreatePassport';

interface PassportsModuleViewProps {
  products: Array<{id: number, name: string, sku: string, category: string, materials: string[]}>;
  selectedProduct: string;
  onProductSelect: (product: string) => void;
  onCreatePassport: () => void;
  onOpenTimeline: () => void;
}

const PassportsModuleView: React.FC<PassportsModuleViewProps> = ({ 
  products, 
  selectedProduct, 
  onProductSelect,
  onCreatePassport,
  onOpenTimeline
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="passports" className="flex items-center">
            <QrCode className="h-4 w-4 mr-2" />
            Pasaportes
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
            <Card className="p-4 h-48">
              <CardTitle className="text-lg mb-2">Pasaportes Activos</CardTitle>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold">{products.length}</div>
                <Button onClick={() => setActiveTab("passports")}>Ver detalles</Button>
              </div>
            </Card>
            <Card className="p-4 h-48">
              <CardTitle className="text-lg mb-2">Escaneos Totales</CardTitle>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold">328</div>
                <Button variant="outline" onClick={() => setActiveTab("reporting")}>Ver análisis</Button>
              </div>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Pasaportes Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.slice(0, 3).map(product => (
                  <div key={product.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onOpenTimeline}>
                      Ver timeline
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="passports" className="space-y-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium">Lista de Pasaportes Digitales</h3>
            <Button onClick={onCreatePassport}>
              Crear Nuevo Pasaporte
            </Button>
          </div>
          
          <PassportsList 
            products={products}
            selectedProduct={selectedProduct}
            onProductSelect={onProductSelect}
            onCreatePassport={onCreatePassport}
            onOpenTimeline={onOpenTimeline}
          />
        </TabsContent>
        
        <TabsContent value="reporting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reportes de Pasaportes Digitales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-6">
                Generación de informes sobre el uso de pasaportes digitales, interacciones
                de los consumidores y trazabilidad de productos.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="p-4 h-56">
                  <CardTitle className="text-lg mb-2">Análisis de Escaneos</CardTitle>
                  <p className="text-muted-foreground mb-4">Estadísticas detalladas sobre escaneos de pasaportes por producto y ubicación.</p>
                  <Button className="mt-auto" variant="outline">Generar Reporte</Button>
                </Card>
                <Card className="p-4 h-56">
                  <CardTitle className="text-lg mb-2">Reporte de Trazabilidad</CardTitle>
                  <p className="text-muted-foreground mb-4">Visualización del recorrido completo de productos en la cadena de valor.</p>
                  <Button className="mt-auto" variant="outline">Generar Reporte</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="simulator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulador de Pasaportes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-6">
                Herramienta para modelar diferentes escenarios de pasaportes digitales,
                permitiendo visualizar el impacto en la trazabilidad y circulación de información.
              </div>
              
              <div className="p-12 text-center border rounded-md bg-muted/30">
                <p className="text-lg font-medium mb-2">Módulo en desarrollo</p>
                <p className="text-muted-foreground">
                  El simulador de pasaportes está actualmente en fase de implementación.
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

export default PassportsModuleView;
