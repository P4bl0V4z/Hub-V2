
import Sidebar from '@/components/Sidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, PackageCheck, FileCheck, Recycle, AlertCircle } from 'lucide-react';

const supplierData = [
  { 
    id: 1, 
    name: "EcoMateriales S.A.", 
    category: "Materias Primas", 
    status: "Certificado", 
    circularityScore: 87,
    lastAudit: "15/04/2025",
    compliance: "Completo"
  },
  { 
    id: 2, 
    name: "Componentes Globales", 
    category: "Componentes", 
    status: "En Revisión", 
    circularityScore: 64,
    lastAudit: "03/03/2025",
    compliance: "Parcial"
  },
  { 
    id: 3, 
    name: "Empaque Sostenible", 
    category: "Embalaje", 
    status: "Certificado", 
    circularityScore: 92,
    lastAudit: "22/04/2025",
    compliance: "Completo"
  },
  { 
    id: 4, 
    name: "Logística Verde", 
    category: "Transporte", 
    status: "Certificado", 
    circularityScore: 78,
    lastAudit: "10/01/2025",
    compliance: "Completo"
  },
  { 
    id: 5, 
    name: "TechParts Inc", 
    category: "Componentes", 
    status: "No Conforme", 
    circularityScore: 45,
    lastAudit: "05/02/2025",
    compliance: "Incompleto"
  },
];

const Suppliers = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Proveedores</h1>
          <p className="text-muted-foreground">Gestión de proveedores y evaluación de sostenibilidad</p>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 w-1/2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar proveedores..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            Nuevo Proveedor
          </Button>
        </div>
        
        <Tabs defaultValue="activos">
          <TabsList className="mb-6">
            <TabsTrigger value="activos">Proveedores Activos</TabsTrigger>
            <TabsTrigger value="potenciales">Potenciales</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activos">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Proveedores Activos</CardTitle>
                <CardDescription>
                  Gestiona tus proveedores actuales y su desempeño en sostenibilidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Lista de proveedores activos y su desempeño</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Índice Circularidad</TableHead>
                      <TableHead>Última Auditoría</TableHead>
                      <TableHead>Cumplimiento REP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierData.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.category}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              supplier.status === "Certificado" ? "bg-green-500" :
                              supplier.status === "En Revisión" ? "bg-yellow-500" :
                              "bg-red-500"
                            }
                          >
                            {supplier.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={
                              supplier.circularityScore >= 80 ? "text-green-600 font-medium" :
                              supplier.circularityScore >= 60 ? "text-yellow-600 font-medium" :
                              "text-red-600 font-medium"
                            }>
                              {supplier.circularityScore}%
                            </span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full ml-2">
                              <div 
                                className={
                                  supplier.circularityScore >= 80 ? "h-full bg-green-500 rounded-full" :
                                  supplier.circularityScore >= 60 ? "h-full bg-yellow-500 rounded-full" :
                                  "h-full bg-red-500 rounded-full"
                                }
                                style={{ width: `${supplier.circularityScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.lastAudit}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {supplier.compliance === "Completo" ? (
                              <PackageCheck className="mr-2 h-4 w-4 text-green-500" />
                            ) : supplier.compliance === "Parcial" ? (
                              <FileCheck className="mr-2 h-4 w-4 text-yellow-500" />
                            ) : (
                              <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                            )}
                            {supplier.compliance}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Rendimiento de Sostenibilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="text-5xl font-bold text-primary">73%</div>
                    <div className="text-sm text-muted-foreground">Promedio de índice de circularidad</div>
                    <div className="text-sm text-green-500">+5.2% vs. trimestre anterior</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Cumplimiento Normativo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="flex items-center">
                      <div className="w-24 h-24 relative">
                        <div className="w-full h-full rounded-full bg-gray-100 absolute"></div>
                        <div 
                          className="w-full h-full rounded-full border-[6px] border-green-500 absolute"
                          style={{ 
                            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                            transform: 'rotate(65deg)'
                          }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                          85%
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Proveedores con certificación completa</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Auditorías de Ciclo de Vida</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="flex items-center space-x-2">
                      <Recycle className="h-8 w-8 text-blue-500" />
                      <div className="text-5xl font-bold">12</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Auditorías programadas para Mayo</div>
                    <div className="text-xs text-blue-500 mt-2">3 en proceso actualmente</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="potenciales">
            <Card>
              <CardHeader>
                <CardTitle>Proveedores Potenciales</CardTitle>
                <CardDescription>
                  Evalúa nuevos proveedores para tu cadena de suministro sostenible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Actualmente hay 7 proveedores en proceso de evaluación</p>
                  <Button className="mt-4">Ver evaluaciones en curso</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="historico">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Proveedores</CardTitle>
                <CardDescription>
                  Registro histórico de proveedores y su desempeño
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">El historial completo de proveedores está disponible para consulta</p>
                  <Button variant="outline" className="mt-4">Exportar datos históricos</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Suppliers;
