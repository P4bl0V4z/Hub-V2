
import Sidebar from '@/components/Sidebar';
import WorldMap from '@/components/WorldMap';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Recycle, Factory, Database } from 'lucide-react';

const GlobalMap = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Mapa Global</h1>
          <p className="text-muted-foreground">Visualización de la trazabilidad y eficiencia del ciclo de vida de productos</p>
        </div>
        
        <Tabs defaultValue="world">
          <TabsList className="mb-4">
            <TabsTrigger value="world">Vista Mundial</TabsTrigger>
            <TabsTrigger value="regions">Por Regiones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="world" className="space-y-6">
            <WorldMap />
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Métricas de Trazabilidad Global</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border rounded-md p-4 flex flex-col">
                  <div className="flex items-center mb-2">
                    <Package className="mr-2 text-primary" size={18} />
                    <p className="text-sm text-muted-foreground">Total Productos</p>
                  </div>
                  <p className="text-2xl font-bold">2,453</p>
                  <p className="text-xs text-muted-foreground mt-2">Trazabilidad completa</p>
                </div>
                <div className="border rounded-md p-4 flex flex-col">
                  <div className="flex items-center mb-2">
                    <Recycle className="mr-2 text-green-500" size={18} />
                    <p className="text-sm text-muted-foreground">Economía Circular</p>
                  </div>
                  <p className="text-2xl font-bold">68%</p>
                  <p className="text-xs text-muted-foreground mt-2">Mejora +4.5% vs. Q1</p>
                </div>
                <div className="border rounded-md p-4 flex flex-col">
                  <div className="flex items-center mb-2">
                    <Factory className="mr-2 text-blue-500" size={18} />
                    <p className="text-sm text-muted-foreground">Centros de Producción</p>
                  </div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-xs text-muted-foreground mt-2">En 42 países</p>
                </div>
                <div className="border rounded-md p-4 flex flex-col">
                  <div className="flex items-center mb-2">
                    <Database className="mr-2 text-purple-500" size={18} />
                    <p className="text-sm text-muted-foreground">Datos de Trazabilidad</p>
                  </div>
                  <p className="text-2xl font-bold">98.3%</p>
                  <p className="text-xs text-muted-foreground mt-2">Integridad de datos</p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="regions">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Vista por Regiones</h2>
              <p className="text-muted-foreground">Análisis detallado de trazabilidad por regiones estará disponible próximamente.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GlobalMap;
