
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContextHelp } from "@/components/ContextualHelp";
import { Scale } from "lucide-react";
import BeLoopIcon from "@/components/BeLoopIcons";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  materials: string[];
}

interface FootprintDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product; // Made product optional
}

export default function FootprintDetailDialog({ open, onOpenChange, product }: FootprintDetailDialogProps) {
  const emissionsData = [
    { name: 'Materiales', value: 45 },
    { name: 'Fabricación', value: 25 },
    { name: 'Transporte', value: 15 },
    { name: 'Uso', value: 10 },
    { name: 'Fin de vida', value: 5 },
  ];
  
  const materialData = [
    { name: 'Plástico', CO2: 28 },
    { name: 'Aluminio', CO2: 42 },
    { name: 'Vidrio', CO2: 12 },
    { name: 'Papel', CO2: 18 },
  ];
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Scale className="mr-2 h-5 w-5" />
            Análisis de Huella de Carbono
            <ContextHelp 
              id="carbon-footprint"
              content="Análisis detallado de la huella de carbono del producto en su ciclo de vida"
              useHoverCard={true}
              size={16}
              title="Huella de Carbono"
            />
          </DialogTitle>
          <DialogDescription>
            {product ? `Análisis para: ${product.name}` : 'Seleccione un producto para ver el análisis detallado'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {product ? (
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="lifecycle">Ciclo de Vida</TabsTrigger>
                <TabsTrigger value="materials">Materiales</TabsTrigger>
                <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Emisiones Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">8.5 kg CO₂e</div>
                      <div className="text-sm text-green-500 flex items-center">
                        <BeLoopIcon name="trendingDown" size={16} className="mr-1" />
                        -12% vs. versión anterior
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Por unidad de producto, calculado según ISO 14067
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Distribución de Emisiones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={emissionsData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {emissionsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Reducción Potencial</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">
                        Se identificaron las siguientes oportunidades de reducción de huella de carbono:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <BeLoopIcon name="check" size={16} className="mr-2 text-green-500 mt-0.5" />
                          <span>Reducción de 15% en emisiones cambiando el material de embalaje</span>
                        </li>
                        <li className="flex items-start">
                          <BeLoopIcon name="check" size={16} className="mr-2 text-green-500 mt-0.5" />
                          <span>Reducción de 8% optimizando la cadena de transporte</span>
                        </li>
                        <li className="flex items-start">
                          <BeLoopIcon name="check" size={16} className="mr-2 text-green-500 mt-0.5" />
                          <span>Reducción de 10% usando energías renovables en fabricación</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="lifecycle" className="pt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      Análisis de Ciclo de Vida
                      <ContextHelp 
                        id="lifecycle-analysis"
                        content="Análisis de las emisiones en cada etapa del ciclo de vida del producto"
                        size={14}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={emissionsData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" name="kg CO₂e" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="materials" className="pt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Impacto por Material</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={materialData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="CO2" name="kg CO₂e" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recommendations" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recomendaciones para Reducción de Huella</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Cambio de materiales</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Reemplazar el plástico PET por rPET reciclado puede reducir la huella de carbono hasta un 25%.
                        </p>
                        <div className="flex items-center text-sm">
                          <span className="text-green-500 font-medium mr-1">Potencial de reducción:</span> 
                          1.2 kg CO₂e por unidad
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Optimización de transporte</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Cambiar el modo de transporte de camión a tren para distancias largas.
                        </p>
                        <div className="flex items-center text-sm">
                          <span className="text-green-500 font-medium mr-1">Potencial de reducción:</span> 
                          0.7 kg CO₂e por unidad
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Energía renovable</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Utilizar energía solar en las plantas de producción para reducir las emisiones de alcance 2.
                        </p>
                        <div className="flex items-center text-sm">
                          <span className="text-green-500 font-medium mr-1">Potencial de reducción:</span> 
                          0.9 kg CO₂e por unidad
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <BeLoopIcon name="scale" size={64} className="text-muted-foreground" />
              <h3 className="text-xl font-medium">Seleccione un producto</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Para ver el análisis detallado de la huella de carbono, seleccione un producto de la lista.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          {product && <Button>Exportar Informe</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
